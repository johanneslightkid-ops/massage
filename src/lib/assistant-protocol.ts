/**
 * The `<action>` protocol: model reply in, one validated action out.
 *
 * Split from `assistant.ts` because it is pure — no React, no fetch, no
 * schema — so it can be exercised directly by `scripts/parse-reply.test.mjs`
 * without standing up the admin UI. It is also the security boundary of the
 * assistant: everything downstream trusts that what comes out of here is a
 * complete, well-formed action, so this is the one place allowed to decide
 * that a reply contains no action at all.
 */

import type { CollectionKey } from '@shared/types'

export type AssistantAction =
  | { kind: 'none' }
  | { kind: 'done' }
  | { kind: 'set_setting'; field: string; value: string }
  | { kind: 'create'; collection: CollectionKey; fields: Record<string, unknown> }
  | { kind: 'update'; collection: CollectionKey; id: string; fields: Record<string, unknown> }
  | { kind: 'delete'; collection: CollectionKey; id: string }
  | { kind: 'manual'; task: string; collection?: string; id?: string; label?: string }

/* -------------------------------------------------------- action parsing */

/**
 * Everything below exists because the conversation runs on an 8B model.
 *
 * `@cf/meta/llama-3.1-8b-instruct` follows the `<action>{…}</action>` protocol
 * most of the time and mangles it the rest: it fences the JSON in Markdown,
 * writes a sentence before the brace, leaves a trailing comma, emits the shape
 * without the fields the shape requires, or invents a `kind` that does not
 * exist. The rule throughout is the same one the module already followed:
 * recover what is unambiguous, and treat anything else as no action at all.
 * Never guess — a guess here writes to the live site.
 */

/** ```json … ``` or ``` … ``` around the payload; the model loves these. */
function stripFences(block: string): string {
  return block
    .trim()
    .replace(/^```[a-z]*\s*/i, '')
    .replace(/```\s*$/, '')
    .trim()
}

/**
 * The first balanced `{…}` in the block, so a sentence either side of the
 * JSON does not sink it. Braces inside strings do not count, and `\"` inside
 * a string does not end it.
 */
function extractJsonObject(block: string): string | undefined {
  const start = block.indexOf('{')
  if (start < 0) return undefined

  let depth = 0
  let inString = false
  let escaped = false

  for (let i = start; i < block.length; i += 1) {
    const char = block[i]

    if (escaped) {
      escaped = false
      continue
    }
    if (char === '\\' && inString) {
      escaped = true
      continue
    }
    if (char === '"') {
      inString = !inString
      continue
    }
    if (inString) continue

    if (char === '{') depth += 1
    else if (char === '}') {
      depth -= 1
      if (depth === 0) return block.slice(start, i + 1)
    }
  }
  return undefined
}

/** `{"kind":"none",}` — legal to the model, not to JSON.parse. */
function stripTrailingCommas(json: string): string {
  return json.replace(/,\s*([}\]])/g, '$1')
}

const COLLECTION_ACTIONS = new Set(['create', 'update', 'delete'])

/**
 * Accepts an action only if it carries everything its kind needs.
 *
 * Without this a `{"kind":"delete"}` with no id reached `applyDelete` as
 * `delete(undefined, undefined)`, and an invented kind produced a confirmation
 * card that the owner could approve to no effect — the switch fell through to
 * its default and did nothing. Both are worse than showing no action.
 */
function normalizeAction(value: unknown): AssistantAction | undefined {
  if (!value || typeof value !== 'object') return undefined
  const raw = value as Record<string, unknown>
  const kind = raw.kind

  if (typeof kind !== 'string') return undefined

  const isNonEmpty = (candidate: unknown): candidate is string =>
    typeof candidate === 'string' && candidate.trim().length > 0
  const isFields = (candidate: unknown): candidate is Record<string, unknown> =>
    Boolean(candidate) && typeof candidate === 'object' && !Array.isArray(candidate)

  if (kind === 'none' || kind === 'done') return { kind }

  if (kind === 'manual') {
    if (!isNonEmpty(raw.task)) return undefined
    const step: AssistantAction = { kind: 'manual', task: raw.task.trim() }
    if (isNonEmpty(raw.collection)) step.collection = raw.collection.trim()
    if (isNonEmpty(raw.id)) step.id = raw.id.trim()
    if (isNonEmpty(raw.label)) step.label = raw.label.trim()
    return step
  }

  if (kind === 'set_setting') {
    if (!isNonEmpty(raw.field) || typeof raw.value !== 'string') return undefined
    return { kind, field: raw.field.trim(), value: raw.value }
  }

  if (!COLLECTION_ACTIONS.has(kind) || !isNonEmpty(raw.collection)) return undefined
  const collection = raw.collection.trim() as CollectionKey

  if (kind === 'create') {
    if (!isFields(raw.fields)) return undefined
    return { kind, collection, fields: raw.fields }
  }
  if (kind === 'update') {
    if (!isNonEmpty(raw.id) || !isFields(raw.fields)) return undefined
    return { kind, collection, id: raw.id.trim(), fields: raw.fields }
  }
  // delete
  if (!isNonEmpty(raw.id)) return undefined
  return { kind: 'delete', collection, id: raw.id.trim() }
}

/** One `<action>` block to an action, through every layer of model sloppiness. */
function actionFromBlock(block: string): AssistantAction | undefined {
  const json = extractJsonObject(stripFences(block))
  if (!json) return undefined
  try {
    return normalizeAction(JSON.parse(json))
  } catch {
    try {
      return normalizeAction(JSON.parse(stripTrailingCommas(json)))
    } catch {
      return undefined
    }
  }
}

/**
 * Pulls the `<action>{…}</action>` block out of a model reply.
 *
 * If the model emits several blocks that disagree, none of them is used: which
 * one it "meant" is exactly the guess this must not make. Identical repeats are
 * fine — the model restating itself is not a disagreement.
 */
export function parseReply(raw: string): { text: string; action?: AssistantAction } {
  const text = raw
    .replace(/<action>[\s\S]*?<\/action>/gi, '')
    // A small model sometimes opens the tag and never closes it.
    .replace(/<action>[\s\S]*$/i, '')
    .trim()

  const actions: AssistantAction[] = []
  for (const match of raw.matchAll(/<action>([\s\S]*?)<\/action>/gi)) {
    const action = actionFromBlock(match[1])
    if (action) actions.push(action)
  }

  if (actions.length === 0) return { text }
  const first = JSON.stringify(actions[0])
  if (actions.some((candidate) => JSON.stringify(candidate) !== first)) return { text }
  return { text, action: actions[0] }
}

export function isActionable(action?: AssistantAction): boolean {
  return Boolean(action && action.kind !== 'none' && action.kind !== 'done' && action.kind !== 'manual')
}
