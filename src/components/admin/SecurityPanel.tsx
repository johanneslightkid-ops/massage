import { useState } from 'react'
import { AlertTriangle, Check, KeyRound, Loader2, RotateCcw } from 'lucide-react'
import { api } from '@/lib/api'
import { useLanguage } from '@/lib/translations/LanguageProvider'
import { cn } from '@/lib/utils'

const inputBase =
  'w-full rounded-2xl border border-ocean-900/12 bg-white px-4 py-3 text-[0.92rem] text-ocean-900 placeholder:text-ocean-800/35 focus:border-lagoon-400 focus:outline-none'

export function SecurityPanel({
  usingDefaultPassword,
  onChanged,
  onResetAll,
}: {
  usingDefaultPassword: boolean
  onChanged: (usingDefault: boolean) => void
  onResetAll: () => Promise<void>
}) {
  const { t, language } = useLanguage()
  const [current, setCurrent] = useState('')
  const [next, setNext] = useState('')
  const [repeat, setRepeat] = useState('')
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [done, setDone] = useState(false)

  const [confirmReset, setConfirmReset] = useState(false)
  const [resetting, setResetting] = useState(false)

  async function submit(event: React.FormEvent) {
    event.preventDefault()
    setError(null)
    setDone(false)

    if (next.length < 4) return setError(t('admin.password_too_short'))
    if (next !== repeat) return setError(t('admin.password_mismatch'))

    setBusy(true)
    try {
      const result = await api.changePassword(current, next)
      onChanged(result.usingDefaultPassword)
      setCurrent('')
      setNext('')
      setRepeat('')
      setDone(true)
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : t('admin.password_error'))
    } finally {
      setBusy(false)
    }
  }

  async function resetEverything() {
    setResetting(true)
    try {
      await api.reset('all', language)
      await onResetAll()
      setConfirmReset(false)
    } finally {
      setResetting(false)
    }
  }

  return (
    <div className="max-w-2xl">
      <header>
        <h1 className="font-display text-3xl text-ocean-950">{t('admin.security')}</h1>
        <p className="mt-1.5 text-[0.92rem] text-ocean-800/85">
          {t('admin.security_lead')}
        </p>
      </header>

      {usingDefaultPassword && (
        <div className="mt-7 flex gap-3 rounded-4xl border border-sun-400/50 bg-sun-200/50 p-5">
          <AlertTriangle className="mt-0.5 size-5 shrink-0 text-sun-800" />
          <div>
            <p className="font-semibold text-ocean-950">{t('admin.security_warning_title')}</p>
            <p className="mt-1 text-[0.9rem] leading-relaxed text-ocean-800/80">
              {t('admin.security_warning_body_before')}{' '}
              <code className="rounded bg-white/70 px-1.5 py-0.5 font-mono text-[0.84em]">massage</code>{' '}
              {t('admin.security_warning_body_after')}
            </p>
          </div>
        </div>
      )}

      <form onSubmit={submit} className="mt-7 rounded-5xl border border-white/70 bg-white/90 p-6 shadow-soft sm:p-7">
        <h2 className="flex items-center gap-2 font-display text-xl text-ocean-950">
          <KeyRound className="size-5 text-lagoon-600" />
          {t('admin.change_password')}
        </h2>

        <div className="mt-6 space-y-4">
          <label className="block">
            <span className="mb-2 block text-[0.78rem] font-bold tracking-wide text-ocean-800/80 uppercase">
              {t('admin.current_password')}
            </span>
            <input
              type="password"
              value={current}
              autoComplete="current-password"
              onChange={(event) => setCurrent(event.target.value)}
              className={inputBase}
            />
          </label>
          <label className="block">
            <span className="mb-2 block text-[0.78rem] font-bold tracking-wide text-ocean-800/80 uppercase">
              {t('admin.new_password')}
            </span>
            <input
              type="password"
              value={next}
              autoComplete="new-password"
              onChange={(event) => setNext(event.target.value)}
              className={inputBase}
            />
          </label>
          <label className="block">
            <span className="mb-2 block text-[0.78rem] font-bold tracking-wide text-ocean-800/80 uppercase">
              {t('admin.repeat_password')}
            </span>
            <input
              type="password"
              value={repeat}
              autoComplete="new-password"
              onChange={(event) => setRepeat(event.target.value)}
              className={inputBase}
            />
          </label>
        </div>

        {error && <p className="mt-4 rounded-2xl bg-coral-100 p-3.5 text-[0.86rem] text-coral-600">{error}</p>}
        {done && (
          <p className="mt-4 flex items-center gap-2 rounded-2xl bg-seafoam-50 p-3.5 text-[0.86rem] font-semibold text-lagoon-800">
            <Check className="size-4" />
            {t('admin.password_changed')}
          </p>
        )}

        <button
          type="submit"
          disabled={busy}
          className="mt-6 inline-flex h-12 items-center gap-2 rounded-full bg-gradient-to-r from-sky-700 to-lagoon-600 px-6 text-[0.9rem] font-semibold text-sand-50 transition-all hover:brightness-110 disabled:opacity-60"
        >
          {busy && <Loader2 className="size-4 animate-spin" />}
          {t('admin.update_password')}
        </button>
      </form>

      <div className="mt-6 rounded-5xl border border-coral-300/50 bg-coral-100/50 p-6 shadow-soft sm:p-7">
        <h2 className="flex items-center gap-2 font-display text-xl text-ocean-950">
          <RotateCcw className="size-5 text-coral-500" />
          {t('admin.restore_all_title')}
        </h2>
        <p className="mt-2 text-[0.9rem] leading-relaxed text-ocean-800/80">
          {t('admin.restore_all_lead')}
        </p>

        {confirmReset ? (
          <div className={cn('mt-5 flex flex-wrap items-center gap-2')}>
            <button
              type="button"
              onClick={resetEverything}
              disabled={resetting}
              className="inline-flex h-11 items-center gap-2 rounded-full bg-coral-500 px-5 text-[0.86rem] font-bold text-white disabled:opacity-60"
            >
              {resetting && <Loader2 className="size-4 animate-spin" />}
              {t('admin.restore_all_confirm')}
            </button>
            <button
              type="button"
              onClick={() => setConfirmReset(false)}
              className="h-11 rounded-full px-5 text-[0.86rem] font-semibold text-coral-600"
            >
              {t('action.cancel')}
            </button>
          </div>
        ) : (
          <button
            type="button"
            onClick={() => setConfirmReset(true)}
            className="mt-5 inline-flex h-11 items-center gap-2 rounded-full border border-coral-400/60 px-5 text-[0.86rem] font-semibold text-coral-600 transition-colors hover:bg-coral-100"
          >
            {t('admin.restore_all_cta')}
          </button>
        )}
      </div>
    </div>
  )
}
