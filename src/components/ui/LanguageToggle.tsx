import { useState } from 'react'
import { Globe } from 'lucide-react'
import { motion, AnimatePresence } from 'motion/react'
import { useLanguage } from '@/lib/translations/LanguageProvider'
import { LANGUAGES, getLanguageDisplayName } from '@/lib/translations'
import { cn } from '@/lib/utils'

interface LanguageToggleProps {
  variant?: 'inline' | 'dropdown' | 'icon'
  className?: string
}

export function LanguageToggle({ variant = 'inline', className }: LanguageToggleProps) {
  const { language, setLanguage, toggleLanguage, t } = useLanguage()
  const [isOpen, setIsOpen] = useState(false)

  const options = LANGUAGES.map((code) => ({ code, native: getLanguageDisplayName(code) }))
  const current = options.find((option) => option.code === language)

  if (variant === 'icon') {
    return (
      <button
        type="button"
        onClick={toggleLanguage}
        className={cn(
          'group relative grid size-10 place-items-center rounded-full border border-sky-900/12 bg-white/70 text-ocean-950 backdrop-blur-sm transition-all duration-300 hover:scale-105 hover:bg-white hover:shadow-soft',
          className,
        )}
        aria-label={t('lang.select')}
      >
        <Globe className="size-5 transition-transform duration-500 group-hover:rotate-12" />
        <span className="absolute -right-1 -bottom-1 grid size-4 place-items-center rounded-full bg-gradient-to-br from-lagoon-500 to-sky-600 text-[0.55rem] font-bold text-white">
          {language.toUpperCase()}
        </span>
      </button>
    )
  }

  if (variant === 'dropdown') {
    return (
      <div className={cn('relative', className)}>
        <button
          type="button"
          onClick={() => setIsOpen(!isOpen)}
          aria-expanded={isOpen}
          className="flex items-center gap-2 rounded-full border border-sky-900/12 bg-white/70 px-4 py-2 text-[0.85rem] font-semibold text-ocean-950 backdrop-blur-sm transition-colors hover:bg-white hover:shadow-soft"
        >
          <Globe className="size-4" />
          <span>{current?.native}</span>
        </button>

        <AnimatePresence>
          {isOpen && (
            <>
              <div className="fixed inset-0 z-10" onClick={() => setIsOpen(false)} />
              <motion.div
                initial={{ opacity: 0, y: -8, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: -8, scale: 0.95 }}
                transition={{ duration: 0.15 }}
                className="absolute top-full right-0 z-20 mt-2 w-40 overflow-hidden rounded-2xl border border-sky-900/10 bg-white py-1 shadow-lift"
              >
                {options.map((option) => (
                  <button
                    key={option.code}
                    type="button"
                    onClick={() => {
                      setLanguage(option.code)
                      setIsOpen(false)
                    }}
                    className={cn(
                      'flex w-full items-center justify-between px-4 py-2.5 text-left text-[0.85rem] font-medium transition-colors',
                      language === option.code
                        ? 'bg-sky-50 text-lagoon-800'
                        : 'text-ocean-800/80 hover:bg-sand-100',
                    )}
                  >
                    <span>{option.native}</span>
                    {language === option.code && <span className="size-1.5 rounded-full bg-lagoon-500" />}
                  </button>
                ))}
              </motion.div>
            </>
          )}
        </AnimatePresence>
      </div>
    )
  }

  // Inline variant — both languages side by side.
  return (
    <div
      className={cn(
        'inline-flex items-center gap-1 rounded-full border border-sky-900/12 bg-white/70 p-1 backdrop-blur-sm',
        className,
      )}
    >
      {options.map((option) => (
        <button
          key={option.code}
          type="button"
          onClick={() => setLanguage(option.code)}
          aria-pressed={language === option.code}
          className={cn(
            'relative rounded-full px-3 py-1.5 text-[0.75rem] font-bold transition-all duration-300',
            language === option.code
              ? 'bg-gradient-to-r from-sky-700 to-lagoon-600 text-sand-50 shadow-soft'
              : 'text-ocean-800/85 hover:text-ocean-950',
          )}
        >
          {option.code.toUpperCase()}
        </button>
      ))}
    </div>
  )
}
