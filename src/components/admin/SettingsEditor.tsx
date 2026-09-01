import { useEffect, useMemo, useState } from 'react'
import { RotateCcw } from 'lucide-react'
import { localizedSettingsGroups } from '@shared/schema-i18n'
import type { SiteSettings } from '@shared/types'
import { api } from '@/lib/api'
import { useLanguage } from '@/lib/translations/LanguageProvider'
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
  const { t, language } = useLanguage()
  const groups = useMemo(() => localizedSettingsGroups(language), [language])

  const [draft, setDraft] = useState<SiteSettings>(settings)
  const [group, setGroup] = useState(groups[0].key)
  const [saving, setSaving] = useState(false)
  const [status, setStatus] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [confirmReset, setConfirmReset] = useState(false)

  useEffect(() => setDraft(settings), [settings])

  const dirty = useMemo(() => JSON.stringify(draft) !== JSON.stringify(settings), [draft, settings])
  const current = groups.find((entry) => entry.key === group) ?? groups[0]

  async function save() {
    setSaving(true)
    setError(null)
    try {
      await api.saveSettings(draft, language)
      await onSaved()
      setStatus(t('action.saved'))
      setTimeout(() => setStatus(null), 2200)
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : t('admin.save_error'))
    } finally {
      setSaving(false)
    }
  }

  async function resetToSeed() {
    setSaving(true)
    try {
      await api.reset('site', language)
      await onSaved()
      setConfirmReset(false)
      setStatus(t('admin.restored_settings'))
      setTimeout(() => setStatus(null), 2600)
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : t('admin.reset_error'))
    } finally {
      setSaving(false)
    }
  }

  return (
    <div>
      <header>
        <h1 className="font-display text-3xl text-ocean-950">{t('admin.settings')}</h1>
        <p className="mt-1.5 max-w-xl text-[0.92rem] text-ocean-800/60">{t('admin.settings_lead')}</p>
      </header>

      <div className="no-scrollbar edge-fade -mx-5 mt-7 flex gap-2 overflow-x-auto px-5 sm:mx-0 sm:flex-wrap sm:px-0">
        {groups.map((entry) => (
          <button
            key={entry.key}
            type="button"
            onClick={() => setGroup(entry.key)}
            className={cn(
              'shrink-0 rounded-full px-5 py-2.5 text-[0.85rem] font-semibold transition-all duration-300',
              group === entry.key
                ? 'bg-gradient-to-r from-sky-700 to-lagoon-600 text-sand-50 shadow-soft'
                : 'border border-ocean-900/12 bg-white/60 text-ocean-800/65 hover:border-lagoon-400/60 hover:text-ocean-950',
            )}
          >
            {entry.label}
          </button>
        ))}
      </div>

      <div className="mt-6 rounded-5xl border border-white/70 bg-white/90 p-5 shadow-soft sm:p-7">
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
              {t('admin.confirm_reset_settings')}
            </span>
            <button
              type="button"
              onClick={resetToSeed}
              className="h-9 rounded-full bg-coral-500 px-4 text-[0.82rem] font-bold text-white"
            >
              {t('action.yes_restore')}
            </button>
            <button
              type="button"
              onClick={() => setConfirmReset(false)}
              className="h-9 rounded-full px-4 text-[0.82rem] font-semibold text-coral-600"
            >
              {t('action.cancel')}
            </button>
          </div>
        ) : (
          <button
            type="button"
            onClick={() => setConfirmReset(true)}
            className="inline-flex h-11 items-center gap-2 rounded-full border border-ocean-900/12 bg-white/60 px-5 text-[0.86rem] font-semibold text-ocean-800/70 transition-colors hover:border-ocean-900/25 hover:text-ocean-950"
          >
            <RotateCcw className="size-4" />
            {t('action.restore_defaults')}
          </button>
        )}
        {error && <p className="text-[0.86rem] font-medium text-coral-600">{error}</p>}
      </div>

      <SaveBar dirty={dirty} saving={saving} status={status} onSave={save} onDiscard={() => setDraft(settings)} />
    </div>
  )
}
