import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react'
import type { ReactNode } from 'react'
import type { SiteContent } from '@shared/types'
import { seedContent } from '@shared/seed'
import { api } from './api'

interface ContentState {
  content: SiteContent
  loading: boolean
  error: string | null
  lang: string
  setLang: (lang: string) => void
  refresh: () => Promise<void>
}

const ContentContext = createContext<ContentState | null>(null)

export function ContentProvider({ children }: { children: ReactNode }) {
  const [lang, setLangState] = useState(() => {
    return new URLSearchParams(window.location.search).get('lang') || 'en'
  })
  
  // Seed acts as the instant first paint; KV content replaces it a moment later.
  const [content, setContent] = useState<SiteContent>(seedContent)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const refresh = useCallback(async () => {
    try {
      const fresh = await api.getContent(lang)
      setContent(fresh)
      setError(null)
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : 'Could not load content')
    } finally {
      setLoading(false)
    }
  }, [lang])

  const setLang = useCallback((nextLang: string) => {
    setLangState(nextLang)
    const url = new URL(window.location.href)
    url.searchParams.set('lang', nextLang)
    window.history.pushState({}, '', url)
  }, [])

  useEffect(() => {
    void refresh()
  }, [refresh])

  const value = useMemo<ContentState>(
    () => ({ content, loading, error, lang, setLang, refresh }),
    [content, loading, error, lang, setLang, refresh],
  )

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
