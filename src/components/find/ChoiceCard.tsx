import { motion, useReducedMotion } from 'motion/react'
import { Check } from 'lucide-react'
import { Motif, type MotifName } from '@/components/art/Motif'
import { cn } from '@/lib/utils'

/**
 * The one control the whole flow is built from.
 *
 * Deliberately a large tactile card rather than a radio button. A guest doing
 * this one-handed on a hotel bed should be able to hit any answer without
 * aiming — the target is the whole card, and the minimum height clears the
 * 44px Apple and 48dp Android guidance with room to spare.
 *
 * It is a real <button> with aria-pressed, so a screen reader announces the
 * choice and its state, and the keyboard gets it for free.
 */
export function ChoiceCard({
  title,
  subtitle,
  icon,
  selected,
  onClick,
  accent,
  index = 0,
}: {
  title: string
  subtitle?: string
  icon: MotifName
  selected?: boolean
  onClick: () => void
  /** Gradient from the current mood, so the page tints as answers are given. */
  accent: string
  index?: number
}) {
  const still = useReducedMotion()

  return (
    <motion.button
      type="button"
      onClick={onClick}
      aria-pressed={selected ?? false}
      initial={still ? false : { opacity: 0, y: 14 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: still ? 0 : Math.min(index * 0.045, 0.32), ease: [0.22, 1, 0.36, 1] }}
      whileTap={still ? undefined : { scale: 0.985 }}
      className={cn(
        'group relative flex min-h-24 w-full items-center gap-4 rounded-[1.75rem] border p-4 text-left transition-colors duration-300 sm:min-h-28 sm:p-5',
        selected
          ? 'border-lagoon-400 bg-white shadow-lift'
          : 'border-ocean-900/10 bg-white/70 hover:border-lagoon-400/60 hover:bg-white',
      )}
    >
      <span
        className={cn(
          'grid size-12 shrink-0 place-items-center rounded-[46%_54%_48%_52%/52%_48%_52%_48%] transition-colors sm:size-14',
          selected ? `bg-gradient-to-br ${accent} text-sand-50` : 'bg-sky-100 text-sky-800',
        )}
      >
        <Motif name={icon} className="size-5 sm:size-6" />
      </span>

      <span className="min-w-0 flex-1">
        <span className="block font-display text-[1.05rem] leading-snug text-ocean-950 sm:text-[1.15rem]">
          {title}
        </span>
        {subtitle && (
          <span className="mt-1 block text-[0.85rem] leading-snug text-ocean-800/60">{subtitle}</span>
        )}
      </span>

      {/*
        The tick is redundant with the border and the tinted icon on purpose —
        selection must never be carried by colour alone.
      */}
      <span
        aria-hidden
        className={cn(
          'grid size-6 shrink-0 place-items-center rounded-full transition-all duration-300',
          selected ? 'scale-100 bg-lagoon-500 text-white opacity-100' : 'scale-75 opacity-0',
        )}
      >
        <Check className="size-3.5" strokeWidth={3} />
      </span>
    </motion.button>
  )
}
