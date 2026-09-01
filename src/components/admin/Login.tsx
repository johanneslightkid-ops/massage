import { useState } from 'react'
import { motion } from 'motion/react'
import { Link } from 'react-router-dom'
import { ArrowLeft, Loader2, Lock } from 'lucide-react'
import { api } from '@/lib/api'
import { useT } from '@/lib/translations/LanguageProvider'
import { MonsteraLeaf, OilSheen, PalmFrond } from '@/components/art/Decor'
import { Motif } from '@/components/art/Motif'
import { LanguageToggle } from '@/components/ui/LanguageToggle'

export function Login({ onSignedIn }: { onSignedIn: (usingDefault: boolean) => void }) {
  const t = useT()
  const [password, setPassword] = useState('')
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState<string | null>(null)

  async function submit(event: React.FormEvent) {
    event.preventDefault()
    setBusy(true)
    setError(null)
    try {
      const result = await api.login(password)
      onSignedIn(result.usingDefaultPassword)
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : t('admin.login.failed'))
      setPassword('')
    } finally {
      setBusy(false)
    }
  }

  return (
    <div className="grain relative grid min-h-dvh place-items-center overflow-hidden bg-gradient-to-br from-sky-950 via-ocean-950 to-palm-950 px-5 py-16">
      <OilSheen />
      <PalmFrond className="pointer-events-none absolute -top-12 -left-20 h-96 w-72 animate-sway text-lagoon-400/14" />
      <MonsteraLeaf mirrored className="pointer-events-none absolute -right-20 -bottom-20 h-96 w-72 text-palm-400/12" />

      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
        className="relative z-10 w-full max-w-sm"
      >
        <div className="rounded-6xl border border-white/12 bg-white/10 p-8 backdrop-blur-xl">
          <div className="flex items-start justify-between gap-3">
            <span className="grid size-14 place-items-center rounded-[46%_54%_50%_50%/52%_46%_54%_48%] bg-gradient-to-br from-sky-500 via-lagoon-500 to-palm-500 text-white">
              <Motif name="wave" className="size-7" strokeWidth={1.8} />
            </span>
            <LanguageToggle variant="inline" className="border-white/20 bg-white/10" />
          </div>

          <h1 className="mt-6 font-display text-3xl text-sand-50">{t('admin.title')}</h1>
          <p className="mt-2 text-[0.92rem] leading-relaxed text-sand-200/70">{t('admin.login.lead')}</p>

          <form onSubmit={submit} className="mt-7">
            <label className="block">
              <span className="mb-2 block text-[0.72rem] font-bold tracking-[0.16em] text-seafoam-300 uppercase">
                {t('admin.login.password')}
              </span>
              <div className="relative">
                <Lock className="pointer-events-none absolute top-1/2 left-4 size-4 -translate-y-1/2 text-sand-200/40" />
                <input
                  type="password"
                  value={password}
                  autoFocus
                  autoComplete="current-password"
                  onChange={(event) => setPassword(event.target.value)}
                  className="h-13 w-full rounded-2xl border border-white/15 bg-white/10 py-3.5 pr-4 pl-11 text-sand-50 placeholder:text-sand-200/30 focus:border-lagoon-400 focus:outline-none"
                  placeholder="••••••••"
                />
              </div>
            </label>

            {error && <p className="mt-4 rounded-2xl bg-coral-500/15 p-3 text-[0.85rem] text-coral-300">{error}</p>}

            <button
              type="submit"
              disabled={busy || !password}
              className="mt-6 inline-flex h-13 w-full items-center justify-center gap-2 rounded-full bg-gradient-to-r from-lagoon-400 to-seafoam-300 py-3.5 font-bold text-ocean-950 transition-transform duration-300 hover:scale-[1.02] disabled:opacity-50 disabled:hover:scale-100"
            >
              {busy && <Loader2 className="size-4 animate-spin" />}
              {t('action.sign_in')}
            </button>
          </form>

          <p className="mt-6 text-[0.78rem] leading-relaxed text-sand-200/45">
            {t('admin.login.hint_before')}{' '}
            <code className="rounded bg-white/10 px-1.5 py-0.5 font-mono">massage</code>{' '}
            {t('admin.login.hint_after')}
          </p>
        </div>

        <Link
          to="/"
          className="mt-6 inline-flex items-center gap-2 text-[0.86rem] font-semibold text-sand-200/55 transition-colors hover:text-sand-50"
        >
          <ArrowLeft className="size-4" />
          {t('action.back_to_site')}
        </Link>
      </motion.div>
    </div>
  )
}
