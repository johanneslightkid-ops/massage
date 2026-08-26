import type { ReactNode } from 'react'
import { cn } from '@/lib/utils'

export function Pill({
  children,
  className,
  tone = 'sand',
}: {
  children: ReactNode
  className?: string
  tone?: 'sand' | 'lagoon' | 'coral' | 'sun' | 'ocean' | 'glass'
}) {
  const tones = {
    sand: 'bg-sand-100 text-ocean-800',
    lagoon: 'bg-seafoam-100 text-lagoon-600',
    coral: 'bg-coral-100 text-coral-600',
    sun: 'bg-sun-200 text-sun-600',
    ocean: 'bg-ocean-900/8 text-ocean-800',
    glass: 'bg-white/12 text-sand-100 backdrop-blur-sm',
  }
  return (
    <span
      className={cn(
        'inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-[0.72rem] font-semibold tracking-wide',
        tones[tone],
        className,
      )}
    >
      {children}
    </span>
  )
}

export function Stars({ count = 5, className }: { count?: number; className?: string }) {
  return (
    <div className={cn('flex gap-0.5 text-sun-500', className)} aria-label={`${count} out of 5 stars`}>
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
      <circle cx="12" cy="12" r="9.5" fill="currentColor" opacity="0.14" />
      <path d="m8 12.4 2.7 2.6L16 9.6" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}

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
        'group relative overflow-hidden rounded-4xl border border-ocean-900/8 bg-white/70 shadow-soft backdrop-blur-sm transition-all duration-500 ease-[cubic-bezier(.22,1,.36,1)]',
        className,
      )}
    >
      {children}
    </Tag>
  )
}
