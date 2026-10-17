import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react'
import type { ReactNode } from 'react'
import type { LanguageCode, TranslateVars } from './index'
import { isLanguageLoaded, isSupportedLanguage, loadLanguage, localeTag, otherLanguage, t as translate } from './index'

const STORAGE_KEY = 'preferred_language'

interface LanguageState {
  language: LanguageCode
  /** The language the site is *not* currently in — used by the AI translator. */
  alternate: LanguageCode
  setLanguage: (lang: LanguageCode) => void
  toggleLanguage: () => void
  t: (key: string, vars?: TranslateVars) => string
  locale: string
}

const LanguageContext = createContext<LanguageState | null>(null)

/**
 * Resolves the starting language once, before the first paint, so the page
 * never flashes English at a Spanish-speaking guest.
 *
 * Precedence: `?lang=` in the URL → saved preference → browser language.
 */
export function initialLanguage(): LanguageCode {
  if (typeof window === 'undefined') return 'en'

  const fromUrl = new URLSearchParams(window.location.search).get('lang')
  if (fromUrl && isSupportedLanguage(fromUrl)) return fromUrl

  try {
    const saved = window.localStorage.getItem(STORAGE_KEY)
    if (saved && isSupportedLanguage(saved)) return saved
  } catch {
    // Private mode or a locked-down browser — fall through to the browser hint.
  }

  return navigator.language?.toLowerCase().startsWith('es') ? 'es' : 'en'
}

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [language, setLanguageState] = useState<LanguageCode>(initialLanguage)

  // Keep <html lang>, the saved preference and the URL in step with the state,
  // so a shared link carries the language the sender was reading in.
  useEffect(() => {
    document.documentElement.lang = language
    // The Worker reads this to inline the right language's content into the
    // next page it serves, before any JavaScript runs.
    document.cookie = `lang=${language}; Path=/; Max-Age=31536000; SameSite=Lax`
    try {
      window.localStorage.setItem(STORAGE_KEY, language)
    } catch {
      // Not being able to remember the choice is not worth an error.
    }

    const url = new URL(window.location.href)
    if (url.searchParams.get('lang') !== language) {
      url.searchParams.set('lang', language)
      window.history.replaceState({}, '', url)
    }
  }, [language])

  // A language's dictionary is a separate chunk: fetch it, then switch, so
  // the page never renders a half-English frame in between.
  const setLanguage = useCallback((lang: LanguageCode) => {
    if (isLanguageLoaded(lang)) setLanguageState(lang)
    else void loadLanguage(lang).then(() => setLanguageState(lang))
  }, [])
  const toggleLanguage = useCallback(() => setLanguage(otherLanguage(language)), [language, setLanguage])

  const t = useCallback(
    (key: string, vars?: TranslateVars) => translate(key, language, vars),
    [language],
  )

  const value = useMemo<LanguageState>(
    () => ({
      language,
      alternate: otherLanguage(language),
      setLanguage,
      toggleLanguage,
      t,
      locale: localeTag(language),
    }),
    [language, setLanguage, toggleLanguage, t],
  )

  return <LanguageContext.Provider value={value}>{children}</LanguageContext.Provider>
}

export function useLanguage(): LanguageState {
  const value = useContext(LanguageContext)
  if (!value) throw new Error('useLanguage must be used inside <LanguageProvider>')
  return value
}

/** Shorthand for components that only need the lookup function. */
export function useT(): (key: string, vars?: TranslateVars) => string {
  return useLanguage().t
}
