import { useEffect, useMemo, useState } from 'react'
import { RotateCcw } from 'lucide-react'
import { settingsGroups } from '@shared/schema'
import type { SiteSettings } from '@shared/types'
import { api } from '@/lib/api'
import { cn } from '@/lib/utils'
import { FieldInput } from './FieldInput'
import { SaveBar } from './SaveBar'

export function SettingsEditor({
  settings,
  onSaved,
}: {
  settings: SiteSettings
  onSaved: () => Promise<void>
}) {
  const [draft, setDraft] = useState<SiteSettings>(settings)
  const [group, setGroup] = useState(settingsGroups[0].key)
  const [saving, setSaving] = useState(false)
  const [status, setStatus] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [confirmReset, setConfirmReset] = useState(false)

  useEffect(() => setDraft(settings), [settings])

  const dirty = useMemo(() => JSON.stringify(draft) !== JSON.stringify(settings), [draft, settings])
  const current = settingsGroups.find((entry) => entry.key === group) ?? settingsGroups[0]

  async function save() {
    setSaving(true)
    setError(null)
    try {
      await api.saveSettings(draft)
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
    try {
      await api.reset('site')
      await onSaved()
      setConfirmReset(false)
      setStatus('Restored the starting settings')
      setTimeout(() => setStatus(null), 2600)
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : 'Could not reset.')
    } finally {
      setSaving(false)
    }
  }

  return (
    <div>
      <header>
        <h1 className="font-display text-3xl text-ocean-900">Site settings</h1>
        <p className="mt-1.5 max-w-xl text-[0.92rem] text-ocean-800/60">
          Your name, your WhatsApp number, the hero, the hours and the small print.
        </p>
      </header>

      <div className="no-scrollbar edge-fade -mx-5 mt-7 flex gap-2 overflow-x-auto px-5 sm:mx-0 sm:flex-wrap sm:px-0">
        {settingsGroups.map((entry) => (
          <button
            key={entry.key}
            type="button"
            onClick={() => setGroup(entry.key)}
            className={cn(
              'shrink-0 rounded-full px-5 py-2.5 text-[0.85rem] font-semibold transition-all duration-300',
              group === entry.key
                ? 'bg-ocean-900 text-sand-50 shadow-soft'
                : 'border border-ocean-900/12 text-ocean-800/65 hover:border-ocean-900/25 hover:text-ocean-900',
            )}
          >
            {entry.label}
          </button>
        ))}
      </div>

      <div className="mt-6 rounded-4xl border border-ocean-900/10 bg-white p-5 sm:p-7">
        <p className="text-[0.88rem] text-ocean-800/55">{current.description}</p>
        <div className="mt-6 grid gap-5 sm:grid-cols-2">
          {current.fields.map((field) => (
            <FieldInput
              key={field.key}
              field={field}
              value={(draft as unknown as Record<string, unknown>)[field.key]}
              onChange={(next) => setDraft((value) => ({ ...value, [field.key]: next }) as SiteSettings)}
            />
          ))}
        </div>
      </div>

      <div className="mt-7 flex flex-wrap items-center gap-3">
        {confirmReset ? (
          <div className="flex flex-wrap items-center gap-2 rounded-2xl bg-coral-100 p-2 pl-4">
            <span className="text-[0.85rem] font-semibold text-coral-600">
              Replace every setting with the starting values?
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

      <SaveBar dirty={dirty} saving={saving} status={status} onSave={save} onDiscard={() => setDraft(settings)} />
    </div>
  )
}
