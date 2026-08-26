import { useState } from 'react'
import { motion } from 'motion/react'
import { Link } from 'react-router-dom'
import { ArrowLeft, Loader2, Lock } from 'lucide-react'
import { api } from '@/lib/api'
import { PalmFrond } from '@/components/art/Decor'
import { Motif } from '@/components/art/Motif'

export function Login({ onSignedIn }: { onSignedIn: (usingDefault: boolean) => void }) {
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
      setError(cause instanceof Error ? cause.message : 'Could not sign in.')
      setPassword('')
    } finally {
      setBusy(false)
    }
  }

  return (
    <div className="grain relative grid min-h-dvh place-items-center overflow-hidden bg-ocean-950 px-5 py-16">
      <PalmFrond className="pointer-events-none absolute -top-12 -left-20 h-96 w-72 animate-sway text-lagoon-400/12" />
      <PalmFrond mirrored className="pointer-events-none absolute -right-24 -bottom-20 h-96 w-72 text-lagoon-400/10" />

      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
        className="relative z-10 w-full max-w-sm"
      >
        <div className="rounded-5xl border border-white/10 bg-white/8 p-8 backdrop-blur-xl">
          <span className="grid size-14 place-items-center rounded-3xl bg-sand-50/10 text-sun-400">
            <Motif name="wave" className="size-7" strokeWidth={1.8} />
          </span>

          <h1 className="mt-6 font-display text-3xl text-sand-50">Admin</h1>
          <p className="mt-2 text-[0.92rem] leading-relaxed text-sand-200/65">
            Sign in to edit the website — treatments, prices, the guide, your team and everything else.
          </p>

          <form onSubmit={submit} className="mt-7">
            <label className="block">
              <span className="mb-2 block text-[0.72rem] font-bold tracking-[0.16em] text-seafoam-300 uppercase">
                Password
              </span>
              <div className="relative">
                <Lock className="pointer-events-none absolute top-1/2 left-4 size-4 -translate-y-1/2 text-sand-200/40" />
                <input
                  type="password"
                  value={password}
                  autoFocus
                  autoComplete="current-password"
                  onChange={(event) => setPassword(event.target.value)}
                  className="h-13 w-full rounded-2xl border border-white/15 bg-white/8 py-3.5 pr-4 pl-11 text-sand-50 placeholder:text-sand-200/30 focus:border-lagoon-400 focus:outline-none"
                  placeholder="••••••••"
                />
              </div>
            </label>

            {error && (
              <p className="mt-4 rounded-2xl bg-coral-500/15 p-3 text-[0.85rem] text-coral-300">{error}</p>
            )}

            <button
              type="submit"
              disabled={busy || !password}
              className="mt-6 inline-flex h-13 w-full items-center justify-center gap-2 rounded-full bg-seafoam-300 py-3.5 font-bold text-ocean-950 transition-transform duration-300 hover:scale-[1.02] disabled:opacity-50 disabled:hover:scale-100"
            >
              {busy && <Loader2 className="size-4 animate-spin" />}
              Sign in
            </button>
          </form>

          <p className="mt-6 text-[0.78rem] leading-relaxed text-sand-200/45">
            First time here? The starting password is{' '}
            <code className="rounded bg-white/10 px-1.5 py-0.5 font-mono">massage</code> — change it under
            “Password” as soon as you are in.
          </p>
        </div>

        <Link
          to="/"
          className="mt-6 inline-flex items-center gap-2 text-[0.86rem] font-semibold text-sand-200/55 transition-colors hover:text-sand-50"
        >
          <ArrowLeft className="size-4" />
          Back to the website
        </Link>
      </motion.div>
    </div>
  )
}
