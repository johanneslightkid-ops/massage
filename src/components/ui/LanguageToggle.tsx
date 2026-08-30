import { useState } from 'react';
import { Globe } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { useLanguage } from '@/lib/translations/LanguageProvider';
import type { LanguageCode } from '@/lib/translations';
import { cn } from '@/lib/utils';

interface LanguageToggleProps {
  variant?: 'inline' | 'dropdown' | 'icon';
  className?: string;
}

export function LanguageToggle({ variant = 'inline', className }: LanguageToggleProps) {
  const { language, setLanguage, toggleLanguage, t } = useLanguage();
  const [isOpen, setIsOpen] = useState(false);

  const languages: { code: LanguageCode; label: string; native: string }[] = [
    { code: 'en', label: 'English', native: 'English' },
    { code: 'es', label: 'Spanish', native: 'Español' },
  ];

  const currentLang = languages.find((l) => l.code === language);

  if (variant === 'icon') {
    return (
      <button
        type="button"
        onClick={toggleLanguage}
        className={cn(
          'group relative grid size-10 place-items-center rounded-full border border-ocean-900/12 bg-white/70 text-ocean-900 backdrop-blur-sm transition-all duration-300 hover:scale-105 hover:bg-white hover:shadow-soft',
          className
        )}
        aria-label={t('lang.select')}
      >
        <Globe className="size-5 transition-transform duration-300 group-hover:rotate-12" />
        <span className="absolute -bottom-1 -right-1 grid size-4 place-items-center rounded-full bg-lagoon-500 text-[0.55rem] font-bold text-white">
          {language.toUpperCase()}
        </span>
      </button>
    );
  }

  if (variant === 'dropdown') {
    return (
      <div className={cn('relative', className)}>
        <button
          type="button"
          onClick={() => setIsOpen(!isOpen)}
          className="flex items-center gap-2 rounded-full border border-ocean-900/12 bg-white/70 px-4 py-2 text-[0.85rem] font-semibold text-ocean-900 backdrop-blur-sm transition-colors hover:bg-white hover:shadow-soft"
        >
          <Globe className="size-4" />
          <span>{currentLang?.native}</span>
        </button>

        <AnimatePresence>
          {isOpen && (
            <>
              <div 
                className="fixed inset-0 z-10" 
                onClick={() => setIsOpen(false)}
              />
              <motion.div
                initial={{ opacity: 0, y: -8, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: -8, scale: 0.95 }}
                transition={{ duration: 0.15 }}
                className="absolute right-0 top-full z-20 mt-2 w-40 overflow-hidden rounded-2xl border border-ocean-900/10 bg-white py-1 shadow-lift"
              >
                {languages.map((lang) => (
                  <button
                    key={lang.code}
                    type="button"
                    onClick={() => {
                      setLanguage(lang.code);
                      setIsOpen(false);
                    }}
                    className={cn(
                      'flex w-full items-center justify-between px-4 py-2.5 text-left text-[0.85rem] font-medium transition-colors',
                      language === lang.code
                        ? 'bg-lagoon-50 text-lagoon-600'
                        : 'text-ocean-800/70 hover:bg-sand-50'
                    )}
                  >
                    <span>{lang.native}</span>
                    {language === lang.code && (
                      <span className="size-1.5 rounded-full bg-lagoon-500" />
                    )}
                  </button>
                ))}
              </motion.div>
            </>
          )}
        </AnimatePresence>
      </div>
    );
  }

  // Inline variant - shows both languages
  return (
    <div
      className={cn(
        'inline-flex items-center gap-1 rounded-full border border-ocean-900/12 bg-white/70 p-1 backdrop-blur-sm',
        className
      )}
    >
      {languages.map((lang) => (
        <button
          key={lang.code}
          type="button"
          onClick={() => setLanguage(lang.code)}
          className={cn(
            'relative rounded-full px-3 py-1.5 text-[0.75rem] font-bold transition-all duration-300',
            language === lang.code
              ? 'bg-ocean-900 text-sand-50 shadow-soft'
              : 'text-ocean-800/60 hover:text-ocean-900'
          )}
        >
          {lang.code.toUpperCase()}
        </button>
      ))}
    </div>
  );
}
