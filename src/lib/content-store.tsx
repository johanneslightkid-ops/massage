import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react'
import type { ReactNode } from 'react'
import type { SiteContent } from '@shared/types'
import { seedFor } from '@shared/seeds'
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

export function ContentProvider({ children }: { children: ReactNode }) {
  const { language, t } = useLanguage()

  // The seed for the *current* language is the instant first paint — switching
  // to Spanish must never flash English copy while KV is being fetched.
  const [content, setContent] = useState<SiteContent>(() => seedFor(language))
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const refresh = useCallback(async () => {
    try {
      const fresh = await api.getContent(language)
      setContent(fresh)
      setError(null)
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : t('error.content_load'))
    } finally {
      setLoading(false)
    }
  }, [language, t])

  // Swap to the other language's seed immediately, then let KV catch up.
  useEffect(() => {
    setContent(seedFor(language))
    setLoading(true)
    void refresh()
  }, [language, refresh])

  const value = useMemo<ContentState>(
    () => ({ content, loading, error, lang: language, refresh }),
    [content, loading, error, language, refresh],
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
