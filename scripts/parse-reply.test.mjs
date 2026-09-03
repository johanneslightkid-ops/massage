#!/usr/bin/env node --test
/**
 * The action protocol, tested against the ways an 8B model actually breaks it.
 *
 * `@cf/meta/llama-3.1-8b-instruct` drives the admin conversation, and it is
 * small enough that malformed `<action>` blocks are the norm rather than the
 * exception. Every case below is a shape a small instruct model really emits.
 *
 * Two rules are being pinned down:
 *   - recover the action whenever the intent is unambiguous;
 *   - emit NO action whenever it is not, because the alternative is guessing
 *     at a write to the live site.
 *
 * Run with `npm test`. Node strips the TypeScript itself, so this imports the
 * real module rather than a copy that can drift away from it.
 */

import test from 'node:test'
import assert from 'node:assert/strict'
import { parseReply, isActionable } from '../src/lib/assistant-protocol.ts'

const wrap = (body) => `Sure, I can do that.\n<action>${body}</action>`

/* ------------------------------------------------------------ recovery */

test('plain block, exactly as the prompt asks for it', () => {
  const { text, action } = parseReply(wrap('{"kind":"delete","collection":"services","id":"svc_1"}'))
  assert.equal(text, 'Sure, I can do that.')
  assert.deepEqual(action, { kind: 'delete', collection: 'services', id: 'svc_1' })
})

test('markdown-fenced JSON — the single most common failure', () => {
  const { action } = parseReply(wrap('```json\n{"kind":"done"}\n```'))
  assert.deepEqual(action, { kind: 'done' })
})

test('unlabelled fence', () => {
  const { action } = parseReply(wrap('```\n{"kind":"none"}\n```'))
  assert.deepEqual(action, { kind: 'none' })
})

test('prose either side of the JSON', () => {
  const { action } = parseReply(
    wrap('Here is the action: {"kind":"done"} — let me know if that is right.'),
  )
  assert.deepEqual(action, { kind: 'done' })
})

test('trailing comma', () => {
  const { action } = parseReply(wrap('{"kind":"delete","collection":"team","id":"t1",}'))
  assert.deepEqual(action, { kind: 'delete', collection: 'team', id: 't1' })
})

test('braces inside string values do not end the object early', () => {
  const { action } = parseReply(
    wrap('{"kind":"set_setting","field":"brand.tagline","value":"Calm {and} bright"}'),
  )
  assert.deepEqual(action, { kind: 'set_setting', field: 'brand.tagline', value: 'Calm {and} bright' })
})

test('escaped quote inside a string value', () => {
  const { action } = parseReply(
    wrap('{"kind":"set_setting","field":"brand.tagline","value":"She said \\"yes\\""}'),
  )
  assert.equal(action.value, 'She said "yes"')
})

test('whitespace and newlines throughout', () => {
  const { action } = parseReply(wrap('\n\n  {\n  "kind" : "done"\n  }\n\n'))
  assert.deepEqual(action, { kind: 'done' })
})

test('uppercase tags', () => {
  const { action } = parseReply('Done.<ACTION>{"kind":"done"}</ACTION>')
  assert.deepEqual(action, { kind: 'done' })
})

test('identical block repeated is not a disagreement', () => {
  const { action } = parseReply(
    `${wrap('{"kind":"done"}')}\n${wrap('{"kind":"done"}')}`,
  )
  assert.deepEqual(action, { kind: 'done' })
})

test('optional manual fields are carried through, absent ones omitted', () => {
  const { action } = parseReply(
    wrap('{"kind":"manual","task":"upload a photo","collection":"team","label":"Ana"}'),
  )
  assert.deepEqual(action, {
    kind: 'manual',
    task: 'upload a photo',
    collection: 'team',
    label: 'Ana',
  })
  assert.equal('id' in action, false)
})

/* ------------------------------------------------------------- refusal */

test('no action block at all', () => {
  const { text, action } = parseReply('What would you like to change?')
  assert.equal(text, 'What would you like to change?')
  assert.equal(action, undefined)
})

test('opened but never closed — the tag never reaches the owner', () => {
  const { text, action } = parseReply('One moment.\n<action>{"kind":"done"}')
  assert.equal(text, 'One moment.')
  assert.equal(action, undefined)
})

test('delete without an id is refused, not passed on as undefined', () => {
  const { action } = parseReply(wrap('{"kind":"delete","collection":"services"}'))
  assert.equal(action, undefined)
})

test('update without an id is refused', () => {
  const { action } = parseReply(wrap('{"kind":"update","collection":"services","fields":{"name":"x"}}'))
  assert.equal(action, undefined)
})

test('create without fields is refused', () => {
  const { action } = parseReply(wrap('{"kind":"create","collection":"services"}'))
  assert.equal(action, undefined)
})

test('collection action without a collection is refused', () => {
  const { action } = parseReply(wrap('{"kind":"delete","id":"svc_1"}'))
  assert.equal(action, undefined)
})

test('set_setting without a field is refused', () => {
  const { action } = parseReply(wrap('{"kind":"set_setting","value":"hello"}'))
  assert.equal(action, undefined)
})

test('manual without a task is refused', () => {
  const { action } = parseReply(wrap('{"kind":"manual","collection":"team"}'))
  assert.equal(action, undefined)
})

test('an invented kind never becomes a confirmation card', () => {
  const { action } = parseReply(wrap('{"kind":"reorder","collection":"services"}'))
  assert.equal(action, undefined)
})

test('empty-string id is refused the same as a missing one', () => {
  const { action } = parseReply(wrap('{"kind":"delete","collection":"services","id":"   "}'))
  assert.equal(action, undefined)
})

test('fields given as an array is refused', () => {
  const { action } = parseReply(wrap('{"kind":"create","collection":"services","fields":[]}'))
  assert.equal(action, undefined)
})

test('unparseable JSON', () => {
  const { text, action } = parseReply(wrap('{kind: done'))
  assert.equal(text, 'Sure, I can do that.')
  assert.equal(action, undefined)
})

test('empty block', () => {
  assert.equal(parseReply(wrap('')).action, undefined)
})

test('two blocks that disagree yield no action', () => {
  const { action } = parseReply(
    `${wrap('{"kind":"delete","collection":"services","id":"svc_1"}')}\n` +
      `${wrap('{"kind":"delete","collection":"services","id":"svc_2"}')}`,
  )
  assert.equal(action, undefined)
})

test('a valid block alongside an invalid one still yields the valid one', () => {
  const { action } = parseReply(`${wrap('{oops')}\n${wrap('{"kind":"done"}')}`)
  assert.deepEqual(action, { kind: 'done' })
})

/* -------------------------------------------------------- isActionable */

test('only write actions ask the owner to confirm', () => {
  assert.equal(isActionable({ kind: 'none' }), false)
  assert.equal(isActionable({ kind: 'done' }), false)
  assert.equal(isActionable({ kind: 'manual', task: 'x' }), false)
  assert.equal(isActionable(undefined), false)
  assert.equal(isActionable({ kind: 'delete', collection: 'team', id: 't1' }), true)
})
