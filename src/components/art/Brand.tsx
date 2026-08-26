import { cn } from '@/lib/utils'

/** Brand marks — lucide dropped its brand set, so these are drawn here. */

export function InstagramGlyph({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" aria-hidden="true" className={cn('size-4', className)}>
      <rect x="3" y="3" width="18" height="18" rx="5" />
      <circle cx="12" cy="12" r="4" />
      <circle cx="17.2" cy="6.8" r="1.1" fill="currentColor" stroke="none" />
    </svg>
  )
}

export function FacebookGlyph({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" className={cn('size-4', className)}>
      <path d="M13.5 21v-8h2.7l.4-3.1h-3.1V7.9c0-.9.25-1.5 1.55-1.5H16.7V3.6A21 21 0 0 0 14.3 3.5c-2.4 0-4 1.45-4 4.12V9.9H7.6V13h2.7v8Z" />
    </svg>
  )
}

export function TikTokGlyph({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" className={cn('size-4', className)}>
      <path d="M16.1 3h-2.6v12.1a2.4 2.4 0 1 1-2-2.36V10.1a5.3 5.3 0 1 0 4.6 5.25V8.9a6.2 6.2 0 0 0 3.6 1.15V7.5a3.6 3.6 0 0 1-3.6-3.6V3Z" />
    </svg>
  )
}
