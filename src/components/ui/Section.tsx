import type { ReactNode } from 'react'
import { cn } from '@/lib/utils'
import { Reveal } from './Reveal'

/**
 * Section tones are washes rather than flat fills — each one carries a hint of
 * a different family so scrolling the page moves through sky, then foam, then
 * warm sand, without any of them announcing itself.
 *
 * The `cut` prop is the modernist's knife: the section's edges are sliced on
 * the bias, so consecutive sections overlap like torn sheets of paper.
 */
const tones = {
  sand: 'bg-transparent',
  cream: 'bg-gradient-to-b from-sand-100/80 via-sand-100/55 to-sky-50/70',
  foam: 'bg-gradient-to-b from-seafoam-50/90 to-sky-50/70',
  ocean: 'bg-abyss-900 text-sand-50',
  sunrise: 'wash-sunrise',
  lagoon: 'wash-lagoon',
  none: '',
} as const

const cuts = {
  none: '',
  both: 'angle-both py-[calc(5rem+4vw)] sm:py-[calc(7rem+4vw)]',
  top: 'angle-top pt-[calc(5rem+4vw)] sm:pt-[calc(7rem+4vw)]',
  'top-rev': 'angle-top-rev pt-[calc(5rem+4vw)] sm:pt-[calc(7rem+4vw)]',
  bottom: 'angle-bottom pb-[calc(5rem+4vw)] sm:pb-[calc(7rem+4vw)]',
} as const

export function Section({
  id,
  className,
  children,
  tone = 'sand',
  cut = 'none',
}: {
  id?: string
  className?: string
  children: ReactNode
  tone?: keyof typeof tones
  cut?: keyof typeof cuts
}) {
  return (
    <section id={id} className={cn('relative', tones[tone], className, cuts[cut], cut !== 'none' && '-my-[2vw]')}>
      {children}
    </section>
  )
}

export function Container({ className, children }: { className?: string; children: ReactNode }) {
  return <div className={cn('mx-auto w-full max-w-6xl px-5 sm:px-8', className)}>{children}</div>
}

export function SectionHead({
  eyebrow,
  title,
  script,
  lead,
  chapter,
  note,
  align = 'left',
  invert = false,
  className,
}: {
  eyebrow?: string
  title: ReactNode
  script?: string
  lead?: ReactNode
  /** A Roman numeral drawn huge and hollow behind the heading. */
  chapter?: string
  /** A hand-lettered aside, pencilled in the margin. */
  note?: string
  align?: 'left' | 'center' | 'right'
  invert?: boolean
  className?: string
}) {
  return (
    <Reveal
      className={cn(
        'relative isolate max-w-2xl',
        align === 'center' && 'mx-auto text-center',
        align === 'right' && 'ml-auto text-right',
        className,
      )}
    >
      {chapter && (
        <span
          aria-hidden="true"
          className={cn(
            'chapter-numeral pointer-events-none absolute -top-[0.42em] -z-10',
            align === 'right' ? '-right-2' : align === 'center' ? 'left-1/2 -translate-x-1/2' : '-left-3',
          )}
        >
          {chapter}
        </span>
      )}
      {eyebrow && (
        <p
          className={cn(
            'mb-5 inline-flex items-center gap-3 text-[0.68rem] font-extrabold tracking-[0.26em] uppercase',
            invert ? 'text-seafoam-300' : 'text-lagoon-800',
          )}
        >
          <span className={cn('taino-steps w-9', invert ? 'text-sun-400' : 'text-flamingo-500')} aria-hidden="true" />
          {eyebrow}
        </p>
      )}
      <h2
        className={cn(
          'display-wonk text-[2.55rem] sm:text-5xl md:text-[4.1rem]',
          invert ? 'text-sand-50' : 'text-ocean-950',
        )}
      >
        {title}
        {script && (
          <>
            {' '}
            <span
              className={cn(
                'script inline-block bg-gradient-to-r bg-clip-text pr-1 text-transparent',
                invert ? 'from-sun-300 to-flamingo-300' : 'from-flamingo-600 via-flamingo-500 to-sun-600',
              )}
            >
              {script}
            </span>
          </>
        )}
      </h2>
      {note && (
        <p
          className={cn(
            'hand mt-3 inline-block -rotate-3 text-[1.55rem]',
            invert ? 'text-sun-300' : 'text-palm-700',
          )}
        >
          {note}
        </p>
      )}
      {lead && (
        <p
          className={cn(
            'mt-5 text-[1.02rem] leading-relaxed sm:text-lg',
            invert ? 'text-pearl-200/85' : 'text-ocean-800/85',
            align === 'center' && 'mx-auto',
            align === 'right' && 'ml-auto',
          )}
        >
          {lead}
        </p>
      )}
    </Reveal>
  )
}
