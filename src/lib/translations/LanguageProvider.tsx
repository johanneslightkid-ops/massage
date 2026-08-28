import { createContext, useContext, useEffect, useState, useCallback, useMemo } from 'react';
import type { ReactNode } from 'react';
import type { LanguageCode } from './index';
import { isSupportedLanguage, getUiTranslations } from './index';

const STORAGE_KEY = 'preferred_language';

interface LanguageState {
  language: LanguageCode;
  setLanguage: (lang: LanguageCode) => void;
  toggleLanguage: () => void;
  t: (key: string) => string;
  translations: Record<string, string>;
}

const LanguageContext = createContext<LanguageState | null>(null);

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [language, setLanguageState] = useState<LanguageCode>('en');
  const [mounted, setMounted] = useState(false);
  const [translations, setTranslations] = useState<Record<string, string>>({});

  // Load saved language preference on mount
  useEffect(() => {
    setMounted(true);
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved && isSupportedLanguage(saved)) {
      setLanguageState(saved);
    } else {
      // Try to detect from browser
      const browserLang = navigator.language?.toLowerCase() || 'en';
      if (browserLang.startsWith('es')) {
        setLanguageState('es');
      }
    }
  }, []);

  // Update translations when language changes
  useEffect(() => {
    setTranslations(getUiTranslations(language));
    document.documentElement.lang = language;
    if (mounted) {
      localStorage.setItem(STORAGE_KEY, language);
    }
  }, [language, mounted]);

  const setLanguage = useCallback((lang: LanguageCode) => {
    setLanguageState(lang);
  }, []);

  const toggleLanguage = useCallback(() => {
    setLanguageState((prev) => (prev === 'en' ? 'es' : 'en'));
  }, []);

  const t = useCallback(
    (key: string): string => {
      return translations[key] || key;
    },
    [translations]
  );

  const value = useMemo<LanguageState>(
    () => ({
      language,
      setLanguage,
      toggleLanguage,
      t,
      translations,
    }),
    [language, setLanguage, toggleLanguage, t, translations]
  );

  return <LanguageContext.Provider value={value}>{children}</LanguageContext.Provider>;
}

export function useLanguage(): LanguageState {
  const value = useContext(LanguageContext);
  if (!value) throw new Error('useLanguage must be used inside <LanguageProvider>');
  return value;
}
