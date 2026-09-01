/**
 * The guided admin conversation.
 *
 * The owner talks (or types); Cloudflare Workers AI turns that into one small,
 * explicit change at a time; the owner confirms it; we write it to KV — and
 * then translate it into the other language and write it there too, so the two
 * documents never drift apart.
 *
 * Nothing is written without a confirmation. The model proposes; the owner
 * decides; this module is the only thing that touches the content API.
 */

import { useCallback, useMemo, useRef, useState } from 'react'
import { blankRecord, type CollectionSchema, type Field } from '@shared/schema'
import { localizedCollections, localizedSettingsGroups } from '@shared/schema-i18n'
import type { CollectionKey, SiteContent } from '@shared/types'
import { api } from './api'
import type { LanguageCode } from './translations'
import { getLanguageDisplayName, localeTag, otherLanguage } from './translations'

/* --------------------------------------------------------------- actions */

export type AssistantAction =
  | { kind: 'none' }
  | { kind: 'done' }
  | { kind: 'set_setting'; field: string; value: string }
  | { kind: 'create'; collection: CollectionKey; fields: Record<string, unknown> }
  | { kind: 'update'; collection: CollectionKey; id: string; fields: Record<string, unknown> }
  | { kind: 'delete'; collection: CollectionKey; id: string }
  | { kind: 'manual'; task: string; collection?: string; id?: string; label?: string }

export interface AssistantMessage {
  id: string
  role: 'assistant' | 'user'
  content: string
  action?: AssistantAction
}

export interface ChangeRecord {
  id: string
  summary: string
  translated: boolean
}

export interface ManualStep {
  id: string
  task: string
  label: string
  section?: string
}

/* ------------------------------------------------- what gets translated */

/**
 * Fields that must survive a language switch untouched: identifiers, links,
 * numbers, and the proper nouns a translator would mangle. Everything else
 * that is plain prose goes through the AI translator.
 *
 * Keys are matched as `field` (anywhere) or `collection.field` (one place).
 */
const NEVER_TRANSLATE = new Set([
  // identifiers and links, wherever they appear
  'id',
  'slug',
  'image',
  'photo',
  'icon',
  'accent',
  'url',
  'mapUrl',
  'mapEmbedUrl',
  'instagram',
  'facebook',
  'tiktok',
  'heroImage',
  'ownerPhoto',
  // contact details and money
  'brandName',
  'whatsapp',
  'phoneDisplay',
  'email',
  'currency',
  // people and places keep their names
  'ownerName',
  'team.name',
  'testimonials.name',
  'discover.name',
])

function isTranslatableField(field: Field, scope: string): boolean {
  if (NEVER_TRANSLATE.has(field.key) || NEVER_TRANSLATE.has(`${scope}.${field.key}`)) return false
  return field.type === 'text' || field.type === 'textarea' || field.type === 'list' || field.type === 'pairs'
}

/**
 * A `select` stores its option string straight into the content, so the value
 * has to move to the matching option in the other language — by position, the
 * one thing both option lists share.
 */
function mapSelectValue(options: string[] | undefined, target: string[] | undefined, value: string): string {
  if (!options || !target) return value
  const index = options.findIndex((option) => option.toLowerCase() === value.toLowerCase())
  return index >= 0 && target[index] ? target[index] : value
}

interface FieldPair {
  from: Field
  to: Field
}

function pairFields(from: CollectionSchema, to: CollectionSchema): Map<string, FieldPair> {
  const map = new Map<string, FieldPair>()
  for (const field of from.fields) {
    const twin = to.fields.find((candidate) => candidate.key === field.key)
    if (twin) map.set(field.key, { from: field, to: twin })
  }
  return map
}

/* ------------------------------------------------------- site summary */

/**
 * A compact description of what exists right now, handed to the model on every
 * turn. It has to be small enough to be cheap and complete enough that the
 * model never guesses at an id.
 */
export function buildSiteContext(content: SiteContent, lang: LanguageCode): string {
  const groups = localizedSettingsGroups(lang)
  const schemas = localizedCollections(lang)
  const lines: string[] = []

  lines.push('SETTINGS — use {"kind":"set_setting","field":<name>,"value":<text>}')
  for (const group of groups) {
    for (const field of group.fields) {
      if (field.type === 'pairs' || field.type === 'list') continue
      const raw = (content.site as unknown as Record<string, unknown>)[field.key]
      const value = typeof raw === 'string' ? raw : String(raw ?? '')
      lines.push(`  ${field.key} = ${JSON.stringify(value.slice(0, 90))}`)
    }
  }

  lines.push('')
  lines.push('COLLECTIONS — use {"kind":"create"|"update"|"delete","collection":<name>,...}')
  for (const schema of schemas) {
    const editable = schema.fields
      .filter((field) => field.key !== 'order')
      .map((field) => (field.options ? `${field.key}(${field.options.join('|')})` : field.key))
      .join(', ')
    lines.push(`  ${schema.key} — ${schema.label}. fields: ${editable}`)

    const rows = (content[schema.key] ?? []) as unknown as Record<string, unknown>[]
    for (const row of rows.slice(0, 14)) {
      const title = String(row[schema.titleField] ?? '').slice(0, 60)
      lines.push(`      ${String(row.id)} — ${title}`)
    }
  }

  return lines.join('\n')
}

/** Records with an empty photo field — the manual work no assistant can do. */
export function missingPhotos(content: SiteContent, lang: LanguageCode): ManualStep[] {
  const steps: ManualStep[] = []
  for (const schema of localizedCollections(lang)) {
    const photoField = schema.fields.find((field) => field.type === 'image')
    if (!photoField) continue
    const rows = (content[schema.key] ?? []) as unknown as Record<string, unknown>[]
    for (const row of rows) {
      const value = row[photoField.key]
      if (typeof value === 'string' && value.trim()) continue
      steps.push({
        id: `photo-${schema.key}-${String(row.id)}`,
        task: 'photo',
        label: String(row[schema.titleField] ?? schema.singular),
        section: schema.key,
      })
    }
  }
  if (!content.site.heroImage?.trim()) {
    steps.push({ id: 'photo-site-hero', task: 'photo', label: 'hero', section: 'settings' })
  }
  if (!content.site.ownerPhoto?.trim()) {
    steps.push({ id: 'photo-site-owner', task: 'photo', label: content.site.ownerName, section: 'settings' })
  }
  return steps
}

/* -------------------------------------------------------- action parsing */

/** Pulls the trailing `<action>{…}</action>` block out of a model reply. */
export function parseReply(raw: string): { text: string; action?: AssistantAction } {
  const match = raw.match(/<action>([\s\S]*?)<\/action>/i)
  const text = raw
    .replace(/<action>[\s\S]*?<\/action>/gi, '')
    // A small model sometimes opens the tag and never closes it.
    .replace(/<action>[\s\S]*$/i, '')
    .trim()

  if (!match) return { text }
  try {
    const parsed = JSON.parse(match[1].trim()) as AssistantAction
    if (parsed && typeof parsed.kind === 'string') return { text, action: parsed }
  } catch {
    // A malformed block is treated as no action at all — never as a guess.
  }
  return { text }
}

export function isActionable(action?: AssistantAction): boolean {
  return Boolean(action && action.kind !== 'none' && action.kind !== 'done' && action.kind !== 'manual')
}

/* ------------------------------------------------------------ the hook */

interface UseAssistantOptions {
  content: SiteContent
  language: LanguageCode
  t: (key: string, vars?: Record<string, string | number>) => string
  /** Called after every successful write so the admin can refetch. */
  onApplied: () => Promise<void>
}

export function useAssistant({ content, language, t, onApplied }: UseAssistantOptions) {
  const [live, setLive] = useState(false)
  const [messages, setMessages] = useState<AssistantMessage[]>([])
  const [pending, setPending] = useState<AssistantAction | null>(null)
  const [changes, setChanges] = useState<ChangeRecord[]>([])
  const [manual, setManual] = useState<ManualStep[]>([])
  const [finished, setFinished] = useState(false)

  const [listening, setListening] = useState(false)
  const [transcribing, setTranscribing] = useState(false)
  const [thinking, setThinking] = useState(false)
  const [applying, setApplying] = useState(false)
  const [speaking, setSpeaking] = useState(false)
  const [muted, setMuted] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const recorderRef = useRef<MediaRecorder | null>(null)
  const chunksRef = useRef<Blob[]>([])
  const mutedRef = useRef(false)
  mutedRef.current = muted

  // The live content is read through a ref so the send loop always sees the
  // freshest site summary without being re-created on every content refresh.
  const contentRef = useRef(content)
  contentRef.current = content

  const alternate = useMemo(() => otherLanguage(language), [language])

  /* --------------------------------------------------------------- voice */

  const speak = useCallback(
    (text: string) => {
      if (mutedRef.current || !text.trim()) return
      const synth = window.speechSynthesis
      if (!synth) return
      synth.cancel()
      const utterance = new SpeechSynthesisUtterance(text)
      utterance.lang = localeTag(language)
      utterance.rate = 1.02
      utterance.onstart = () => setSpeaking(true)
      utterance.onend = () => setSpeaking(false)
      utterance.onerror = () => setSpeaking(false)
      synth.speak(utterance)
    },
    [language],
  )

  const stopSpeaking = useCallback(() => {
    window.speechSynthesis?.cancel()
    setSpeaking(false)
  }, [])

  /* -------------------------------------------------------- conversation */

  const push = useCallback((message: Omit<AssistantMessage, 'id'>) => {
    const withId = { ...message, id: `${Date.now()}-${Math.random().toString(36).slice(2, 8)}` }
    setMessages((current) => [...current, withId])
    return withId
  }, [])

  const ask = useCallback(
    async (text: string, history: AssistantMessage[]) => {
      setThinking(true)
      setError(null)
      try {
        const payload = [...history, { role: 'user' as const, content: text }]
          .filter((message) => message.content.trim())
          .map((message) => ({
            role: message.role === 'assistant' ? ('assistant' as const) : ('user' as const),
            content: message.content,
          }))

        const result = await api.aiChat({
          messages: payload,
          language,
          context: buildSiteContext(contentRef.current, language),
        })

        const { text: spoken, action } = parseReply(result.reply)
        const body = spoken || t('ai.error')
        push({ role: 'assistant', content: body, action })
        speak(body)

        if (action?.kind === 'manual') {
          setManual((current) =>
            current.some((step) => step.id === manualId(action))
              ? current
              : [
                  ...current,
                  {
                    id: manualId(action),
                    task: action.task || 'photo',
                    label: action.label || action.id || '',
                    section: action.collection,
                  },
                ],
          )
        }
        if (action?.kind === 'done') setFinished(true)
        if (isActionable(action)) setPending(action ?? null)
      } catch (cause) {
        const message = cause instanceof Error ? cause.message : t('ai.error')
        setError(message)
        push({ role: 'assistant', content: t('ai.error') })
      } finally {
        setThinking(false)
      }
    },
    [language, push, speak, t],
  )

  const send = useCallback(
    async (text: string) => {
      const clean = text.trim()
      if (!clean || thinking) return
      const history = messages
      push({ role: 'user', content: clean })
      setPending(null)
      await ask(clean, history)
    },
    [ask, messages, push, thinking],
  )

  const start = useCallback(() => {
    setLive(true)
    setFinished(false)
    setError(null)
    setChanges([])
    setPending(null)
    setManual([])
    const greeting = t('ai.greeting')
    setMessages([{ id: 'greeting', role: 'assistant', content: greeting }])
    speak(greeting)
  }, [speak, t])

  const finish = useCallback(() => {
    setLive(false)
    setPending(null)
    setFinished(true)
    stopSpeaking()
    recorderRef.current?.state === 'recording' && recorderRef.current.stop()
    setListening(false)
  }, [stopSpeaking])

  /* ------------------------------------------------------------- the mic */

  const stopListening = useCallback(() => {
    const recorder = recorderRef.current
    if (recorder && recorder.state === 'recording') recorder.stop()
    setListening(false)
  }, [])

  const startListening = useCallback(async () => {
    if (listening) {
      stopListening()
      return
    }
    setError(null)

    if (!navigator.mediaDevices?.getUserMedia || typeof MediaRecorder === 'undefined') {
      setError(t('ai.unsupported_mic'))
      return
    }

    let stream: MediaStream
    try {
      stream = await navigator.mediaDevices.getUserMedia({ audio: true })
    } catch {
      setError(t('ai.mic_denied'))
      return
    }

    // Whichever container this browser actually produces is what Whisper gets;
    // asking for one it cannot encode is how recordings come back empty.
    const mimeType = ['audio/webm;codecs=opus', 'audio/webm', 'audio/mp4', 'audio/ogg;codecs=opus'].find(
      (candidate) => MediaRecorder.isTypeSupported?.(candidate),
    )

    const recorder = new MediaRecorder(stream, mimeType ? { mimeType } : undefined)
    recorderRef.current = recorder
    chunksRef.current = []

    recorder.ondataavailable = (event) => {
      if (event.data.size > 0) chunksRef.current.push(event.data)
    }

    recorder.onstop = async () => {
      stream.getTracks().forEach((track) => track.stop())
      const blob = new Blob(chunksRef.current, { type: recorder.mimeType || 'audio/webm' })
      chunksRef.current = []
      if (blob.size < 1200) return // a tap rather than a sentence

      setTranscribing(true)
      try {
        const response = await fetch('/api/ai/stt', {
          method: 'POST',
          credentials: 'same-origin',
          headers: { 'Content-Type': blob.type },
          body: blob,
        })
        const data = (await response.json()) as { text?: string; error?: string }
        if (!response.ok) throw new Error(data.error ?? 'Transcription failed')
        if (data.text?.trim()) await send(data.text.trim())
      } catch (cause) {
        setError(cause instanceof Error ? cause.message : t('ai.error'))
      } finally {
        setTranscribing(false)
      }
    }

    recorder.start()
    setListening(true)
  }, [listening, send, stopListening, t])

  /* ------------------------------------------------------------- writing */

  /**
   * Applies a confirmed action to the language being edited, then mirrors it
   * into the other language: text translated by the AI, everything else copied
   * across untouched so ids, prices and photos stay identical.
   */
  const apply = useCallback(
    async (action: AssistantAction) => {
      setApplying(true)
      setError(null)
      try {
        const summary = await applyAction(action, language, alternate)
        setChanges((current) => [
          ...current,
          { id: `${Date.now()}`, summary: summary.text, translated: summary.translated },
        ])
        setPending(null)
        await onApplied()

        const note = summary.translated
          ? `${t('ai.applied', { summary: summary.text })} ${t('ai.translated', {
              language: getLanguageDisplayName(alternate),
            })}`
          : t('ai.applied', { summary: summary.text })
        push({ role: 'assistant', content: note })

        // Tell the model what actually landed, so its next question follows on.
        await ask(`[system] Applied: ${summary.text}. Continue with the next question.`, messages)
      } catch (cause) {
        const message = cause instanceof Error ? cause.message : t('error.unknown')
        setError(t('ai.apply_failed', { message }))
      } finally {
        setApplying(false)
      }
    },
    [alternate, ask, language, messages, onApplied, push, t],
  )

  const reject = useCallback(() => {
    setPending(null)
    void send(t('ai.reject'))
  }, [send, t])

  const manualSteps = useMemo(() => {
    const photos = missingPhotos(contentRef.current, language)
    const merged = new Map<string, ManualStep>()
    for (const step of [...manual, ...photos]) merged.set(step.id, step)
    return [...merged.values()]
  }, [manual, language])

  return {
    live,
    finished,
    messages,
    pending,
    changes,
    manualSteps,
    listening,
    transcribing,
    thinking,
    applying,
    speaking,
    muted,
    error,
    alternate,
    start,
    finish,
    send,
    apply,
    reject,
    startListening,
    stopListening,
    setMuted,
    stopSpeaking,
  }
}

function manualId(action: Extract<AssistantAction, { kind: 'manual' }>): string {
  return `manual-${action.task}-${action.collection ?? 'site'}-${action.id ?? action.label ?? ''}`
}

/* ------------------------------------------------------ apply internals */

interface ApplyResult {
  text: string
  translated: boolean
}

async function applyAction(
  action: AssistantAction,
  lang: LanguageCode,
  alternate: LanguageCode,
): Promise<ApplyResult> {
  switch (action.kind) {
    case 'set_setting':
      return applySetting(action.field, action.value, lang, alternate)
    case 'create':
      return applyCreate(action.collection, action.fields, lang, alternate)
    case 'update':
      return applyUpdate(action.collection, action.id, action.fields, lang, alternate)
    case 'delete':
      return applyDelete(action.collection, action.id, lang, alternate)
    default:
      return { text: '', translated: false }
  }
}

function settingsFieldFor(lang: LanguageCode, key: string): Field | undefined {
  for (const group of localizedSettingsGroups(lang)) {
    const field = group.fields.find((candidate) => candidate.key === key)
    if (field) return field
  }
  return undefined
}

async function applySetting(
  key: string,
  value: string,
  lang: LanguageCode,
  alternate: LanguageCode,
): Promise<ApplyResult> {
  const field = settingsFieldFor(lang, key)
  if (!field) throw new Error(`Unknown setting "${key}".`)

  const typed: unknown =
    field.type === 'boolean'
      ? /^(true|yes|on|sí|si|1)$/i.test(value)
      : field.type === 'number' || field.type === 'money'
        ? Number(value)
        : value

  await api.saveSettings({ [key]: typed } as never, lang)

  if (!isTranslatableField(field, 'settings') || typeof typed !== 'string') {
    await api.saveSettings({ [key]: typed } as never, alternate)
    return { text: `${field.label}: ${value}`, translated: false }
  }

  const { translated } = await api.aiTranslate({ fields: { [key]: typed }, targetLang: alternate })
  await api.saveSettings({ [key]: translated[key] ?? typed } as never, alternate)
  return { text: `${field.label}: ${value}`, translated: Boolean(translated[key]) }
}

function schemaFor(lang: LanguageCode, collection: CollectionKey): CollectionSchema {
  const schema = localizedCollections(lang).find((candidate) => candidate.key === collection)
  if (!schema) throw new Error(`Unknown collection "${collection}".`)
  return schema
}

/** Coerces the model's loose values into the shape the field actually stores. */
function coerce(field: Field, value: unknown): unknown {
  switch (field.type) {
    case 'number':
    case 'money':
      return typeof value === 'number' ? value : Number(String(value).replace(/[^\d.-]/g, '')) || 0
    case 'boolean':
      return typeof value === 'boolean' ? value : /^(true|yes|on|sí|si|1)$/i.test(String(value))
    case 'list':
      if (Array.isArray(value)) return value.map((entry) => String(entry))
      return String(value)
        .split(/\s*[;\n]\s*/)
        .map((entry) => entry.trim())
        .filter(Boolean)
    case 'durations':
      return Array.isArray(value)
        ? value.map((entry) => {
            const row = entry as { minutes?: unknown; price?: unknown }
            return { minutes: Number(row?.minutes) || 60, price: Number(row?.price) || 0 }
          })
        : [{ minutes: 60, price: 0 }]
    case 'pairs':
      return Array.isArray(value)
        ? value.map((entry) => {
            const row = entry as { label?: unknown; value?: unknown }
            return { label: String(row?.label ?? ''), value: String(row?.value ?? '') }
          })
        : []
    case 'select': {
      const wanted = String(value)
      const match = field.options?.find((option) => option.toLowerCase() === wanted.toLowerCase())
      return match ?? field.options?.[0] ?? wanted
    }
    default:
      return String(value ?? '')
  }
}

/** Builds the twin record for the other language: prose translated, rest copied. */
async function mirrorRecord(
  record: Record<string, unknown>,
  collection: CollectionKey,
  lang: LanguageCode,
  alternate: LanguageCode,
): Promise<{ record: Record<string, unknown>; translated: boolean }> {
  const fromSchema = schemaFor(lang, collection)
  const toSchema = schemaFor(alternate, collection)
  const pairs = pairFields(fromSchema, toSchema)

  // Collect the prose. Lists and pairs are flattened into indexed keys so one
  // translate call covers a whole record.
  const toTranslate: Record<string, string> = {}
  for (const [key, { from }] of pairs) {
    if (!isTranslatableField(from, collection)) continue
    const value = record[key]
    if (typeof value === 'string' && value.trim()) toTranslate[key] = value
    else if (Array.isArray(value)) {
      value.forEach((entry, index) => {
        if (from.type === 'list' && typeof entry === 'string' && entry.trim()) {
          toTranslate[`${key}#${index}`] = entry
        }
        if (from.type === 'pairs' && entry && typeof entry === 'object') {
          const label = (entry as { label?: unknown }).label
          if (typeof label === 'string' && label.trim()) toTranslate[`${key}#${index}`] = label
        }
      })
    }
  }

  let translations: Record<string, string> = {}
  if (Object.keys(toTranslate).length > 0) {
    translations = (await api.aiTranslate({ fields: toTranslate, targetLang: alternate })).translated
  }

  const mirrored: Record<string, unknown> = { ...record }
  for (const [key, { from, to }] of pairs) {
    const value = record[key]

    if (from.type === 'select' && typeof value === 'string') {
      mirrored[key] = mapSelectValue(from.options, to.options, value)
      continue
    }
    if (!isTranslatableField(from, collection)) continue

    if (typeof value === 'string') {
      mirrored[key] = translations[key] ?? value
    } else if (Array.isArray(value)) {
      mirrored[key] = value.map((entry, index) => {
        const translated = translations[`${key}#${index}`]
        if (from.type === 'list') return translated ?? entry
        if (from.type === 'pairs' && entry && typeof entry === 'object') {
          return { ...(entry as object), label: translated ?? (entry as { label?: string }).label ?? '' }
        }
        return entry
      })
    }
  }

  return { record: mirrored, translated: Object.keys(translations).length > 0 }
}

async function applyCreate(
  collection: CollectionKey,
  fields: Record<string, unknown>,
  lang: LanguageCode,
  alternate: LanguageCode,
): Promise<ApplyResult> {
  const schema = schemaFor(lang, collection)
  const current = await api.adminContent(lang)
  const rows = (current[collection] ?? []) as unknown as Record<string, unknown>[]
  const nextOrder = Math.max(0, ...rows.map((row) => Number(row.order ?? 0))) + 1

  const record = blankRecord(schema, nextOrder)
  for (const field of schema.fields) {
    if (field.key === 'order') continue
    if (field.key in fields) record[field.key] = coerce(field, fields[field.key])
  }
  if (!record.slug && typeof record.name === 'string') {
    record.slug = String(record.name)
      .toLowerCase()
      .normalize('NFD')
      .replace(/[̀-ͯ]/g, '')
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-+|-+$/g, '')
  }

  await api.saveCollection(collection, [...rows, record], lang)

  const mirror = await mirrorRecord(record, collection, lang, alternate)
  const other = await api.adminContent(alternate)
  const otherRows = (other[collection] ?? []) as unknown as Record<string, unknown>[]
  await api.saveCollection(collection, [...otherRows, mirror.record], alternate)

  const title = String(record[schema.titleField] ?? schema.singular)
  return { text: `+ ${schema.singular}: ${title}`, translated: mirror.translated }
}

async function applyUpdate(
  collection: CollectionKey,
  id: string,
  fields: Record<string, unknown>,
  lang: LanguageCode,
  alternate: LanguageCode,
): Promise<ApplyResult> {
  const schema = schemaFor(lang, collection)
  const current = await api.adminContent(lang)
  const rows = (current[collection] ?? []) as unknown as Record<string, unknown>[]
  const existing = rows.find((row) => String(row.id) === id)
  if (!existing) throw new Error(`No record "${id}" in ${collection}.`)

  const patch: Record<string, unknown> = {}
  for (const field of schema.fields) {
    if (field.key in fields) patch[field.key] = coerce(field, fields[field.key])
  }
  const updated: Record<string, unknown> = { ...existing, ...patch, id: existing.id }

  await api.saveCollection(
    collection,
    rows.map((row) => (String(row.id) === id ? updated : row)),
    lang,
  )

  // Only the changed fields are translated — re-translating a whole record on
  // every small edit would slowly rewrite copy the owner had already approved.
  const mirror = await mirrorRecord({ ...patch, id }, collection, lang, alternate)
  const other = await api.adminContent(alternate)
  const otherRows = (other[collection] ?? []) as unknown as Record<string, unknown>[]
  const hasTwin = otherRows.some((row) => String(row.id) === id)

  await api.saveCollection(
    collection,
    hasTwin
      ? otherRows.map((row) => (String(row.id) === id ? { ...row, ...mirror.record, id } : row))
      : [...otherRows, { ...updated, ...mirror.record, id }],
    alternate,
  )

  const title = String(updated[schema.titleField] ?? id)
  const changed = Object.keys(patch)
    .map((key) => schema.fields.find((field) => field.key === key)?.label ?? key)
    .join(', ')
  return { text: `${title} — ${changed}`, translated: mirror.translated }
}

async function applyDelete(
  collection: CollectionKey,
  id: string,
  lang: LanguageCode,
  alternate: LanguageCode,
): Promise<ApplyResult> {
  const schema = schemaFor(lang, collection)
  const current = await api.adminContent(lang)
  const rows = (current[collection] ?? []) as unknown as Record<string, unknown>[]
  const existing = rows.find((row) => String(row.id) === id)
  if (!existing) throw new Error(`No record "${id}" in ${collection}.`)

  await api.saveCollection(
    collection,
    rows.filter((row) => String(row.id) !== id),
    lang,
  )

  const other = await api.adminContent(alternate)
  const otherRows = (other[collection] ?? []) as unknown as Record<string, unknown>[]
  await api.saveCollection(
    collection,
    otherRows.filter((row) => String(row.id) !== id),
    alternate,
  )

  const title = String(existing[schema.titleField] ?? id)
  return { text: `− ${schema.singular}: ${title}`, translated: false }
}
