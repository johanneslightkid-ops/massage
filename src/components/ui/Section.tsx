import type { ReactNode } from 'react'
import { cn } from '@/lib/utils'
import { Reveal } from './Reveal'

export function Section({
  id,
  className,
  children,
  tone = 'sand',
}: {
  id?: string
  className?: string
  children: ReactNode
  tone?: 'sand' | 'cream' | 'ocean' | 'none'
}) {
  const tones = {
    sand: 'bg-sand-50',
    cream: 'bg-sand-100',
    ocean: 'bg-ocean-900 text-sand-50',
    none: '',
  }
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
            'mb-4 text-[0.7rem] font-bold tracking-[0.22em] uppercase',
            invert ? 'text-seafoam-300' : 'text-lagoon-600',
          )}
        >
          {eyebrow}
        </p>
      )}
      <h2
        className={cn(
          'text-3xl leading-[1.08] sm:text-4xl md:text-5xl',
          invert ? 'text-sand-50' : 'text-ocean-900',
        )}
      >
        {title}
        {script && (
          <>
            {' '}
            <span className={cn('script', invert ? 'text-sun-400' : 'text-coral-500')}>{script}</span>
          </>
        )}
      </h2>
      {lead && (
        <p
          className={cn(
            'mt-5 text-[1.02rem] leading-relaxed sm:text-lg',
            invert ? 'text-sand-200/85' : 'text-ocean-800/75',
          )}
        >
          {lead}
        </p>
      )}
    </Reveal>
  )
}
