import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react'
import type { ReactNode } from 'react'

/**
 * Day and night, by the clock.
 *
 * The site follows the hour of the person reading it: a guest scrolling in
 * bed at eleven gets the moonlit sea, the same guest at breakfast gets the
 * midday one. The four *phases* drive the artwork (the hero sky is pink at
 * dawn and dusk); the two *themes* drive the colour tokens in `index.css`.
 *
 * The first decision is made by the inline script in `index.html`, before
 * React loads, so the page never flashes the wrong sky. This provider then
 * keeps it in step as the clock crosses a boundary, and lets the guest pin
 * day or night if they prefer.
 */

export type ThemeMode = 'auto' | 'day' | 'night'
export type Theme = 'day' | 'night'
export type Phase = 'dawn' | 'day' | 'dusk' | 'night'

const STORAGE_KEY = 'theme_mode'

/** Decimal hours. Kept identical to the inline script in index.html. */
export function phaseAt(date: Date): Phase {
  const hour = date.getHours() + date.getMinutes() / 60
  if (hour < 5.5 || hour >= 19.5) return 'night'
  if (hour < 7.5) return 'dawn'
  if (hour < 17.5) return 'day'
  return 'dusk'
}

function readMode(): ThemeMode {
  try {
    const saved = window.localStorage.getItem(STORAGE_KEY)
    if (saved === 'day' || saved === 'night' || saved === 'auto') return saved
  } catch {
    // Storage blocked — the clock decides.
  }
  return 'auto'
}

function resolve(mode: ThemeMode, now: Date): { theme: Theme; phase: Phase } {
  if (mode === 'day') return { theme: 'day', phase: 'day' }
  if (mode === 'night') return { theme: 'night', phase: 'night' }
  const phase = phaseAt(now)
  return { theme: phase === 'night' ? 'night' : 'day', phase }
}

interface ThemeState {
  mode: ThemeMode
  theme: Theme
  phase: Phase
  setMode: (mode: ThemeMode) => void
  /** auto → day → night → auto: one button covers all three. */
  cycle: () => void
}

const ThemeContext = createContext<ThemeState | null>(null)

const THEME_COLORS: Record<Theme, string> = { day: '#eaf8fe', night: '#061325' }

export function ThemeProvider({ children }: { children: ReactNode }) {
  const [mode, setModeState] = useState<ThemeMode>(() => (typeof window === 'undefined' ? 'auto' : readMode()))
  const [now, setNow] = useState(() => new Date())

  // A minute is fine-grained enough for a sunset, and costs nothing.
  useEffect(() => {
    if (mode !== 'auto') return
    const id = window.setInterval(() => setNow(new Date()), 60_000)
    const onVisible = () => document.visibilityState === 'visible' && setNow(new Date())
    document.addEventListener('visibilitychange', onVisible)
    return () => {
      window.clearInterval(id)
      document.removeEventListener('visibilitychange', onVisible)
    }
  }, [mode])

  const { theme, phase } = resolve(mode, now)

  useEffect(() => {
    const root = document.documentElement
    root.dataset.theme = theme
    root.dataset.phase = phase
    root.style.colorScheme = theme === 'night' ? 'dark' : 'light'
    document.querySelector('meta[name="theme-color"]')?.setAttribute('content', THEME_COLORS[theme])
  }, [theme, phase])

  const setMode = useCallback((next: ThemeMode) => {
    setModeState(next)
    setNow(new Date())
    try {
      window.localStorage.setItem(STORAGE_KEY, next)
    } catch {
      // Not remembering the choice is not worth an error.
    }
  }, [])

  const cycle = useCallback(() => {
    setMode(mode === 'auto' ? 'day' : mode === 'day' ? 'night' : 'auto')
  }, [mode, setMode])

  const value = useMemo<ThemeState>(() => ({ mode, theme, phase, setMode, cycle }), [mode, theme, phase, setMode, cycle])

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>
}

export function useTheme(): ThemeState {
  const value = useContext(ThemeContext)
  if (!value) throw new Error('useTheme must be used inside <ThemeProvider>')
  return value
}
