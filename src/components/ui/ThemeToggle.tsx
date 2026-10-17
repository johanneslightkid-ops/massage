import { AnimatePresence, motion } from 'motion/react'
import { Moon, Sun, SunMoon } from 'lucide-react'
import { useTheme } from '@/lib/theme'
import { useT } from '@/lib/translations/LanguageProvider'
import { cn } from '@/lib/utils'

/**
 * One round button: auto (follows the clock) → day → night → auto. The icon
 * shows the mode, not the theme, so a guest on "auto" can see that the site
 * is choosing for them.
 */
export function ThemeToggle({ className }: { className?: string }) {
  const { mode, theme, cycle } = useTheme()
  const t = useT()

  const icon =
    mode === 'auto' ? <SunMoon className="size-[1.15rem]" /> : mode === 'day' ? <Sun className="size-[1.15rem]" /> : <Moon className="size-[1.15rem]" />

  const label = t(`theme.${mode}`, { now: t(`theme.now_${theme}`) })

  return (
    <button
      type="button"
      onClick={cycle}
      aria-label={label}
      title={label}
      className={cn(
        'relative grid size-10 place-items-center overflow-hidden rounded-full border border-sky-900/12 bg-white/70 text-ocean-950 backdrop-blur-sm transition-all duration-300 hover:scale-105 hover:bg-white hover:shadow-soft',
        className,
      )}
    >
      <AnimatePresence mode="wait" initial={false}>
        <motion.span
          key={mode}
          initial={{ y: 14, opacity: 0, rotate: -40 }}
          animate={{ y: 0, opacity: 1, rotate: 0 }}
          exit={{ y: -14, opacity: 0, rotate: 40 }}
          transition={{ duration: 0.28, ease: [0.22, 1, 0.36, 1] }}
          className="grid place-items-center"
        >
          {icon}
        </motion.span>
      </AnimatePresence>
      {mode === 'auto' && (
        <span
          aria-hidden="true"
          className="absolute -right-0.5 -bottom-0.5 grid h-4 min-w-4 place-items-center rounded-full bg-gradient-to-br from-flamingo-500 to-sun-400 px-0.5 text-[0.5rem] font-bold text-pearl"
        >
          A
        </span>
      )}
    </button>
  )
}
