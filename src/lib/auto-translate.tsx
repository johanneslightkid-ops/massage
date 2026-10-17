import { createContext, useCallback, useContext, useMemo, useState } from 'react'
import type { ReactNode } from 'react'
import type { CollectionKey, SiteSettings } from '@shared/types'
import { api } from './api'
import { isTranslatableField, mirrorRecord, settingsFieldFor } from './assistant'
import { LANGUAGES, type LanguageCode } from './translations'
import { slugify } from './utils'

/**
 * Save once, publish in every language.
 *
 * Each language is its own KV document, so an edit in English used to leave
 * the Spanish site behind until someone retyped it. With auto-translate on
 * (the default) every admin save is diffed against what was loaded, and only
 * what changed is carried into the other languages: new records are
 * translated in full, edited records only in the fields that changed — so an
 * owner's hand-polished Spanish is never re-translated over — and deletions
 * and reordering are copied straight across.
 *
 * Prose goes through Workers AI; ids, prices, links, photos, tags and the
 * matcher's canonical vocabulary are copied untouched (see
 * `isTranslatableField`).
 */

type Row = Record<string, unknown>

const STORAGE_KEY = 'admin_auto_translate'

export interface MirrorResult {
  /** Languages that received the change. */
  languages: LanguageCode[]
  /** True when at least one field went through the translator. */
  translated: boolean
}

const NOTHING: MirrorResult = { languages: [], translated: false }

function otherLanguages(lang: LanguageCode): LanguageCode[] {
  return LANGUAGES.filter((code) => code !== lang)
}

const same = (a: unknown, b: unknown) => JSON.stringify(a) === JSON.stringify(b)

/** Carries a collection save into every other language. */
export async function mirrorCollection(
  collection: CollectionKey,
  before: Row[],
  after: Row[],
  lang: LanguageCode,
): Promise<MirrorResult> {
  const beforeById = new Map(before.map((row) => [String(row.id), row]))
  const afterIds = new Set(after.map((row) => String(row.id)))

  const created = after.filter((row) => !beforeById.has(String(row.id)))
  const deleted = before.filter((row) => !afterIds.has(String(row.id))).map((row) => String(row.id))
  const changed = after
    .filter((row) => beforeById.has(String(row.id)))
    .map((row) => {
      const previous = beforeById.get(String(row.id))!
      const patch: Row = {}
      for (const key of Object.keys(row)) if (!same(row[key], previous[key])) patch[key] = row[key]
      return { id: String(row.id), row, patch }
    })
    .filter((entry) => Object.keys(entry.patch).length > 0)

  if (!created.length && !deleted.length && !changed.length) return NOTHING

  const result: MirrorResult = { languages: [], translated: false }

  for (const target of otherLanguages(lang)) {
    const other = await api.adminContent(target)
    let rows = [...((other[collection] ?? []) as unknown as Row[])]

    rows = rows.filter((row) => !deleted.includes(String(row.id)))

    for (const record of created) {
      if (rows.some((row) => String(row.id) === String(record.id))) continue
      const mirror = await mirrorRecord(record, collection, lang, target)
      // A post's slug is part of its URL, and a URL should read in its own language.
      if (collection === 'posts' && typeof mirror.record.title === 'string') {
        mirror.record.slug = slugify(mirror.record.title) || mirror.record.slug
      }
      rows.push(mirror.record)
      result.translated ||= mirror.translated
    }

    for (const { id, row, patch } of changed) {
      // Only the changed fields: the twin keeps everything else it already has.
      const mirror = await mirrorRecord({ ...patch, id }, collection, lang, target)
      result.translated ||= mirror.translated
      const index = rows.findIndex((candidate) => String(candidate.id) === id)
      if (index >= 0) rows[index] = { ...rows[index], ...mirror.record, id }
      else {
        const full = await mirrorRecord(row, collection, lang, target)
        rows.push(full.record)
      }
    }

    await api.saveCollection(collection, rows, target)
    result.languages.push(target)
  }

  return result
}

/** Carries a settings save into every other language. */
export async function mirrorSettings(
  before: SiteSettings,
  after: SiteSettings,
  lang: LanguageCode,
): Promise<MirrorResult> {
  const prev = before as unknown as Row
  const next = after as unknown as Row
  const keys = Object.keys(next).filter((key) => !same(next[key], prev[key]))
  if (keys.length === 0) return NOTHING

  const result: MirrorResult = { languages: [], translated: false }

  for (const target of otherLanguages(lang)) {
    const patch: Row = {}
    const prose: Record<string, string> = {}
    const long: Array<[string, string]> = []

    for (const key of keys) {
      const field = settingsFieldFor(lang, key)
      const value = next[key]
      if (!field || !isTranslatableField(field, 'settings')) {
        patch[key] = value
        continue
      }
      if (typeof value === 'string' && value.trim()) {
        if (value.length >= 700) long.push([key, value])
        else prose[key] = value
      } else if (Array.isArray(value) && field.type === 'list') {
        value.forEach((entry, index) => {
          if (typeof entry === 'string' && entry.trim()) prose[`${key}#${index}`] = entry
        })
        patch[key] = value
      } else if (Array.isArray(value) && field.type === 'pairs') {
        value.forEach((entry, index) => {
          const label = (entry as { label?: unknown })?.label
          if (typeof label === 'string' && label.trim()) prose[`${key}#${index}`] = label
        })
        patch[key] = value
      } else {
        patch[key] = value
      }
    }

    const translations: Record<string, string> = {}
    for (const [key, value] of long) {
      const { translated } = await api.aiTranslateLong({ text: value, targetLang: target })
      if (translated) translations[key] = translated
    }
    if (Object.keys(prose).length > 0) {
      Object.assign(translations, (await api.aiTranslate({ fields: prose, targetLang: target })).translated)
    }

    for (const key of keys) {
      const value = next[key]
      if (typeof value === 'string' && translations[key]) patch[key] = translations[key]
      else if (typeof value === 'string' && !(key in patch)) patch[key] = value
      else if (Array.isArray(value)) {
        patch[key] = value.map((entry, index) => {
          const translated = translations[`${key}#${index}`]
          if (!translated) return entry
          return typeof entry === 'string' ? translated : { ...(entry as object), label: translated }
        })
      }
    }

    result.translated ||= Object.keys(translations).length > 0
    await api.saveSettings(patch as Partial<SiteSettings>, target)
    result.languages.push(target)
  }

  return result
}

/* ---------------------------------------------------------- preference */

interface AutoTranslateState {
  enabled: boolean
  setEnabled: (value: boolean) => void
}

const AutoTranslateContext = createContext<AutoTranslateState | null>(null)

function readEnabled(): boolean {
  try {
    return window.localStorage.getItem(STORAGE_KEY) !== 'off'
  } catch {
    return true
  }
}

/** On by default; the owner can switch it off for a session of careful hand edits. */
export function AutoTranslateProvider({ children }: { children: ReactNode }) {
  const [enabled, setState] = useState(readEnabled)
  const setEnabled = useCallback((value: boolean) => {
    setState(value)
    try {
      window.localStorage.setItem(STORAGE_KEY, value ? 'on' : 'off')
    } catch {
      // Remembering is a convenience, not a requirement.
    }
  }, [])
  const value = useMemo(() => ({ enabled, setEnabled }), [enabled, setEnabled])
  return <AutoTranslateContext.Provider value={value}>{children}</AutoTranslateContext.Provider>
}

export function useAutoTranslate(): AutoTranslateState {
  return useContext(AutoTranslateContext) ?? { enabled: true, setEnabled: () => undefined }
}

