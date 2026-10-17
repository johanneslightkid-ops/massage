import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState } from 'react'
import type { ReactNode } from 'react'
import type { SiteContent } from '@shared/types'
import { api } from './api'
import { useLanguage } from './translations/LanguageProvider'
import type { LanguageCode } from './translations'

interface ContentState {
  content: SiteContent
  loading: boolean
  error: string | null
  lang: LanguageCode
  refresh: () => Promise<void>
}

const ContentContext = createContext<ContentState | null>(null)

declare global {
  interface Window {
    /** Inlined by the Worker into every page: the KV document for this visitor's language. */
    __BOOT__?: { lang: string; content: SiteContent }
  }
}

/**
 * The first paint comes from the content the Worker inlined into the HTML, so
 * a phone renders the real page without waiting for an API call — and
 * without downloading the seed for both languages (it used to ship in the
 * main bundle). The seed is still there as a lazily-loaded fallback for local
 * dev, a failed KV read, or a language switch the page was not booted in.
 */
function bootContent(lang: LanguageCode): SiteContent | null {
  if (typeof window === 'undefined') return null
  const boot = window.__BOOT__
  return boot && boot.lang === lang && boot.content ? boot.content : null
}

const loadSeed = (lang: LanguageCode) => import('@shared/seeds').then((module) => module.seedFor(lang))

export function ContentProvider({ children }: { children: ReactNode }) {
  const { language, t } = useLanguage()

  const [content, setContent] = useState<SiteContent | null>(() => bootContent(language))
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  // The language whose content is on screen — a late seed must never paint
  // over a fresher API response, or over a newer language.
  const shown = useRef<{ lang: LanguageCode; fresh: boolean }>({ lang: language, fresh: Boolean(content) })

  const refresh = useCallback(async () => {
    try {
      const fresh = await api.getContent(language)
      setContent(fresh)
      shown.current = { lang: language, fresh: true }
      setError(null)
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : t('error.content_load'))
    } finally {
      setLoading(false)
    }
  }, [language, t])

  useEffect(() => {
    const booted = bootContent(language)
    if (booted) {
      // Already fresh from the Worker: no second fetch on first load.
      setContent(booted)
      shown.current = { lang: language, fresh: true }
      setLoading(false)
      if (window.__BOOT__) window.__BOOT__.lang = ''
      return
    }
    setLoading(true)
    shown.current = { lang: language, fresh: false }
    void loadSeed(language).then((seed) => {
      if (shown.current.lang === language && !shown.current.fresh) setContent(seed)
    })
    void refresh()
  }, [language, refresh])

  const value = useMemo<ContentState | null>(
    () => (content ? { content, loading, error, lang: language, refresh } : null),
    [content, loading, error, language, refresh],
  )

  // Only ever empty in local dev, for the few milliseconds the seed takes.
  if (!value) return <div className="min-h-dvh" aria-busy="true" />

  return <ContentContext.Provider value={value}>{children}</ContentContext.Provider>
}

export function useContent(): ContentState {
  const value = useContext(ContentContext)
  if (!value) throw new Error('useContent must be used inside <ContentProvider>')
  return value
}

/** Convenience: the site settings object on its own. */
export function useSite() {
  return useContent().content.site
}
