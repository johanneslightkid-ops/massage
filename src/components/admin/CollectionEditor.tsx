import { useEffect, useMemo, useState } from 'react'
import { AnimatePresence, motion } from 'motion/react'
import { ArrowDown, ArrowUp, Copy, Pencil, Plus, RotateCcw, Trash2, X } from 'lucide-react'
import type { CollectionSchema } from '@shared/schema'
import { blankRecord } from '@shared/schema'
import type { CollectionKey } from '@shared/types'
import { api } from '@/lib/api'
import { cn } from '@/lib/utils'
import { FieldInput } from './FieldInput'
import { SaveBar } from './SaveBar'

type Row = Record<string, unknown>

export function CollectionEditor({
  schema,
  rows,
  onSaved,
}: {
  schema: CollectionSchema
  rows: Row[]
  onSaved: () => Promise<void>
}) {
  const [draft, setDraft] = useState<Row[]>(rows)
  const [editing, setEditing] = useState<string | null>(null)
  const [saving, setSaving] = useState(false)
  const [status, setStatus] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [confirmReset, setConfirmReset] = useState(false)

  useEffect(() => {
    setDraft(rows)
    setEditing(null)
  }, [rows, schema.key])

  const dirty = useMemo(() => JSON.stringify(draft) !== JSON.stringify(rows), [draft, rows])

  const sorted = useMemo(
    () => [...draft].sort((a, b) => Number(a.order ?? 0) - Number(b.order ?? 0)),
    [draft],
  )

  function patch(id: string, key: string, value: unknown) {
    setDraft((current) => current.map((row) => (row.id === id ? { ...row, [key]: value } : row)))
  }

  function addRow() {
    const nextOrder = Math.max(0, ...draft.map((row) => Number(row.order ?? 0))) + 1
    const record = blankRecord(schema, nextOrder)
    setDraft((current) => [...current, record])
    setEditing(String(record.id))
  }

  function duplicate(row: Row) {
    const copy: Row = {
      ...structuredClone(row),
      id: `${schema.key}-${Date.now().toString(36)}${Math.random().toString(36).slice(2, 6)}`,
      order: Number(row.order ?? 0) + 0.5,
    }
    setDraft((current) => [...current, copy])
    setEditing(String(copy.id))
  }

  function remove(id: string) {
    setDraft((current) => current.filter((row) => row.id !== id))
    if (editing === id) setEditing(null)
  }

  /** Swaps `order` with the neighbour, then normalises so numbers stay tidy. */
  function move(id: string, direction: -1 | 1) {
    const index = sorted.findIndex((row) => row.id === id)
    const target = index + direction
    if (index < 0 || target < 0 || target >= sorted.length) return

    const next = [...sorted]
    const [item] = next.splice(index, 1)
    next.splice(target, 0, item)
    setDraft(next.map((row, position) => ({ ...row, order: position + 1 })))
  }

  async function save() {
    setSaving(true)
    setError(null)
    try {
      const normalised = sorted.map((row, index) => ({ ...row, order: index + 1 }))
      await api.saveCollection(schema.key as CollectionKey, normalised)
      setDraft(normalised)
      await onSaved()
      setStatus('Saved')
      setTimeout(() => setStatus(null), 2200)
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : 'Could not save.')
    } finally {
      setSaving(false)
    }
  }

  async function resetToSeed() {
    setSaving(true)
    setError(null)
    try {
      await api.reset(schema.key)
      await onSaved()
      setConfirmReset(false)
      setStatus('Restored the starting content')
      setTimeout(() => setStatus(null), 2600)
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : 'Could not reset.')
    } finally {
      setSaving(false)
    }
  }

  return (
    <div>
      <header className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <h1 className="font-display text-3xl text-ocean-900">{schema.label}</h1>
          <p className="mt-1.5 max-w-xl text-[0.92rem] text-ocean-800/60">{schema.description}</p>
        </div>
        <button
          type="button"
          onClick={addRow}
          className="inline-flex h-11 items-center gap-2 rounded-full bg-ocean-900 px-5 text-[0.88rem] font-semibold text-sand-50 transition-colors hover:bg-ocean-800"
        >
          <Plus className="size-4" />
          Add {schema.singular.toLowerCase()}
        </button>
      </header>

      <ul className="mt-8 space-y-3">
        {sorted.map((row, index) => {
          const id = String(row.id)
          const open = editing === id
          const title = String(row[schema.titleField] ?? '') || `Untitled ${schema.singular.toLowerCase()}`
          const subtitle = String(row[schema.subtitleField] ?? '')

          return (
            <li
              key={id}
              className={cn(
                'overflow-hidden rounded-3xl border bg-white transition-colors',
                open ? 'border-lagoon-400/50 shadow-soft' : 'border-ocean-900/10',
              )}
            >
              <div className="flex items-center gap-3 p-4">
                <div className="flex shrink-0 flex-col gap-1">
                  <button
                    type="button"
                    onClick={() => move(id, -1)}
                    disabled={index === 0}
                    aria-label="Move up"
                    className="grid size-6 place-items-center rounded-lg text-ocean-800/40 transition-colors hover:bg-sand-100 hover:text-ocean-900 disabled:opacity-25"
                  >
                    <ArrowUp className="size-3.5" />
                  </button>
                  <button
                    type="button"
                    onClick={() => move(id, 1)}
                    disabled={index === sorted.length - 1}
                    aria-label="Move down"
                    className="grid size-6 place-items-center rounded-lg text-ocean-800/40 transition-colors hover:bg-sand-100 hover:text-ocean-900 disabled:opacity-25"
                  >
                    <ArrowDown className="size-3.5" />
                  </button>
                </div>

                <button
                  type="button"
                  onClick={() => setEditing(open ? null : id)}
                  className="min-w-0 flex-1 text-left"
                >
                  <p className="truncate font-semibold text-ocean-900">{title}</p>
                  {subtitle && <p className="mt-0.5 truncate text-[0.82rem] text-ocean-800/50">{subtitle}</p>}
                </button>

                <div className="flex shrink-0 items-center gap-1">
                  <button
                    type="button"
                    onClick={() => duplicate(row)}
                    aria-label="Duplicate"
                    className="grid size-9 place-items-center rounded-xl text-ocean-800/45 transition-colors hover:bg-sand-100 hover:text-ocean-900"
                  >
                    <Copy className="size-4" />
                  </button>
                  <button
                    type="button"
                    onClick={() => remove(id)}
                    aria-label="Delete"
                    className="grid size-9 place-items-center rounded-xl text-ocean-800/45 transition-colors hover:bg-coral-100 hover:text-coral-600"
                  >
                    <Trash2 className="size-4" />
                  </button>
                  <button
                    type="button"
                    onClick={() => setEditing(open ? null : id)}
                    aria-label={open ? 'Close' : 'Edit'}
                    className={cn(
                      'grid size-9 place-items-center rounded-xl transition-colors',
                      open ? 'bg-ocean-900 text-sand-50' : 'text-ocean-800/45 hover:bg-sand-100 hover:text-ocean-900',
                    )}
                  >
                    {open ? <X className="size-4" /> : <Pencil className="size-4" />}
                  </button>
                </div>
              </div>

              <AnimatePresence initial={false}>
                {open && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.28, ease: [0.22, 1, 0.36, 1] }}
                  >
                    <div className="grid gap-5 border-t border-ocean-900/8 bg-sand-50/60 p-5 sm:grid-cols-2 sm:p-6">
                      {schema.fields.map((field) => (
                        <FieldInput
                          key={field.key}
                          field={field}
                          value={row[field.key]}
                          onChange={(next) => patch(id, field.key, next)}
                        />
                      ))}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </li>
          )
        })}
      </ul>

      {sorted.length === 0 && (
        <div className="mt-8 rounded-3xl border border-dashed border-ocean-900/15 p-12 text-center">
          <p className="text-ocean-800/50">No {schema.label.toLowerCase()} yet.</p>
          <button
            type="button"
            onClick={addRow}
            className="mt-4 inline-flex h-11 items-center gap-2 rounded-full bg-ocean-900 px-5 text-[0.88rem] font-semibold text-sand-50"
          >
            <Plus className="size-4" />
            Add the first one
          </button>
        </div>
      )}

      <div className="mt-8 flex flex-wrap items-center gap-3">
        {confirmReset ? (
          <div className="flex flex-wrap items-center gap-2 rounded-2xl bg-coral-100 p-2 pl-4">
            <span className="text-[0.85rem] font-semibold text-coral-600">
              Replace all {schema.label.toLowerCase()} with the starting content?
            </span>
            <button
              type="button"
              onClick={resetToSeed}
              className="h-9 rounded-full bg-coral-500 px-4 text-[0.82rem] font-bold text-white"
            >
              Yes, restore
            </button>
            <button
              type="button"
              onClick={() => setConfirmReset(false)}
              className="h-9 rounded-full px-4 text-[0.82rem] font-semibold text-coral-600"
            >
              Cancel
            </button>
          </div>
        ) : (
          <button
            type="button"
            onClick={() => setConfirmReset(true)}
            className="inline-flex h-11 items-center gap-2 rounded-full border border-ocean-900/12 px-5 text-[0.86rem] font-semibold text-ocean-800/70 transition-colors hover:border-ocean-900/25 hover:text-ocean-900"
          >
            <RotateCcw className="size-4" />
            Restore defaults
          </button>
        )}

        {error && <p className="text-[0.86rem] font-medium text-coral-600">{error}</p>}
      </div>

      <SaveBar
        dirty={dirty}
        saving={saving}
        status={status}
        onSave={save}
        onDiscard={() => setDraft(rows)}
      />
    </div>
  )
}
