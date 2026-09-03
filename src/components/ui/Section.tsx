import type { ReactNode } from 'react'
import { cn } from '@/lib/utils'
import { Reveal } from './Reveal'

/**
 * Section tones are washes rather than flat fills — each one carries a hint of
 * a different family so scrolling the page moves through sky, then foam, then
 * warm sand, without any of them announcing itself.
 */
const tones = {
  sand: 'bg-transparent',
  cream: 'bg-gradient-to-b from-sand-100/80 via-sand-100/55 to-sky-50/70',
  foam: 'bg-gradient-to-b from-seafoam-50/90 to-sky-50/70',
  ocean: 'bg-ocean-900 text-sand-50',
  none: '',
} as const

export function Section({
  id,
  className,
  children,
  tone = 'sand',
}: {
  id?: string
  className?: string
  children: ReactNode
  tone?: keyof typeof tones
}) {
  return (
    <section id={id} className={cn('relative', tones[tone], className)}>
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
  align = 'left',
  invert = false,
  className,
}: {
  eyebrow?: string
  title: ReactNode
  script?: string
  lead?: ReactNode
  align?: 'left' | 'center'
  invert?: boolean
  className?: string
}) {
  return (
    <Reveal className={cn('max-w-2xl', align === 'center' && 'mx-auto text-center', className)}>
      {eyebrow && (
        <p
          className={cn(
            'mb-4 inline-flex items-center gap-2 text-[0.7rem] font-bold tracking-[0.22em] uppercase',
            invert ? 'text-seafoam-300' : 'text-lagoon-800',
          )}
        >
          <span
            className={cn(
              'h-1.5 w-1.5 rounded-full',
              invert ? 'bg-sun-400' : 'bg-flamingo-500',
            )}
            aria-hidden="true"
          />
          {eyebrow}
        </p>
      )}
      <h2
        className={cn(
          'text-3xl leading-[1.08] sm:text-4xl md:text-5xl',
          invert ? 'text-sand-50' : 'text-ocean-950',
        )}
      >
        {title}
        {script && (
          <>
            {' '}
            <span className={cn('script', invert ? 'text-sun-400' : 'text-flamingo-600')}>{script}</span>
          </>
        )}
      </h2>
      {lead && (
        <p
          className={cn(
            'mt-5 text-[1.02rem] leading-relaxed sm:text-lg',
            invert ? 'text-sand-200/85' : 'text-ocean-800/85',
          )}
        >
          {lead}
        </p>
      )}
    </Reveal>
  )
}
