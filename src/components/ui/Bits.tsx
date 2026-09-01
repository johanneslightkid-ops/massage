import type { ReactNode } from 'react'
import { cn } from '@/lib/utils'
import { useT } from '@/lib/translations/LanguageProvider'

export type PillTone = 'sand' | 'sky' | 'lagoon' | 'palm' | 'flamingo' | 'coral' | 'sun' | 'ocean' | 'glass'

const pillTones: Record<PillTone, string> = {
  sand: 'bg-sand-200/70 text-ocean-800',
  sky: 'bg-sky-100 text-sky-800',
  lagoon: 'bg-seafoam-100 text-lagoon-700',
  palm: 'bg-palm-100 text-palm-700',
  flamingo: 'bg-flamingo-100 text-flamingo-700',
  coral: 'bg-coral-100 text-coral-600',
  sun: 'bg-sun-200 text-sun-700',
  ocean: 'bg-ocean-900/8 text-ocean-800',
  glass: 'bg-white/14 text-sand-100 backdrop-blur-sm ring-1 ring-white/20',
}

export function Pill({
  children,
  className,
  tone = 'sand',
}: {
  children: ReactNode
  className?: string
  tone?: PillTone
}) {
  return (
    <span
      className={cn(
        'inline-flex items-center gap-1.5 rounded-full px-3.5 py-1.5 text-[0.72rem] font-semibold tracking-wide',
        pillTones[tone],
        className,
      )}
    >
      {children}
    </span>
  )
}

export function Stars({ count = 5, className }: { count?: number; className?: string }) {
  const t = useT()
  return (
    <div className={cn('flex gap-0.5 text-sun-500', className)} aria-label={t('card.stars', { count })}>
      {Array.from({ length: 5 }).map((_, index) => (
        <svg
          key={index}
          viewBox="0 0 24 24"
          className="size-4"
          fill={index < count ? 'currentColor' : 'none'}
          stroke="currentColor"
          strokeWidth="1.4"
          aria-hidden="true"
        >
          <path d="m12 3 2.6 5.6 6.1.8-4.5 4.2 1.2 6-5.4-3-5.4 3 1.2-6L3.3 9.4l6.1-.8Z" />
        </svg>
      ))}
    </div>
  )
}

export function Tick({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" className={cn('size-4 shrink-0', className)} aria-hidden="true">
      <circle cx="12" cy="12" r="9.5" fill="currentColor" opacity="0.16" />
      <path
        d="m8 12.4 2.7 2.6L16 9.6"
        stroke="currentColor"
        strokeWidth="1.9"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  )
}

/**
 * The base surface for every card on the site. Soft, slightly translucent and
 * lifted off the page — never a hard-edged panel.
 */
export function Card({
  children,
  className,
  as: Tag = 'div',
}: {
  children: ReactNode
  className?: string
  as?: 'div' | 'article' | 'li'
}) {
  return (
    <Tag
      className={cn(
        'group relative overflow-hidden rounded-5xl border border-white/70 bg-white/72 shadow-soft ring-1 ring-sky-900/5 backdrop-blur-sm transition-all duration-500 ease-[cubic-bezier(.22,1,.36,1)]',
        className,
      )}
    >
      {children}
    </Tag>
  )
}
