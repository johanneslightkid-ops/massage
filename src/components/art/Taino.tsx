import { cn } from '@/lib/utils'

/**
 * The carver's hand.
 *
 * Line drawings after the petroglyphs the Taíno left on the cave walls of the
 * east coast — Cueva de las Maravillas is forty minutes from Bávaro. Drawn as
 * single-weight strokes in `currentColor`, the way they read on limestone, so
 * they sit on any section as a quiet mark of where this place comes from.
 *
 * They are ornament, never decoration of a sacred thing: abstract suns,
 * spirals, a coquí frog, the round "face" glyph — the motifs that already
 * live on Dominican craft, pottery and the national coins.
 */

const stroke = {
  fill: 'none',
  stroke: 'currentColor',
  strokeLinecap: 'round' as const,
  strokeLinejoin: 'round' as const,
}

/** The Taíno sun: a round face crowned with rays, a spiral for a heart. */
export function TainoSun({ className, strokeWidth = 2.4 }: { className?: string; strokeWidth?: number }) {
  return (
    <svg viewBox="0 0 120 120" className={cn('shrink-0', className)} aria-hidden="true">
      <g {...stroke} strokeWidth={strokeWidth}>
        <circle cx="60" cy="60" r="30" />
        <circle cx="60" cy="60" r="22" opacity="0.6" />
        {Array.from({ length: 16 }, (_, i) => {
          const a = (i / 16) * Math.PI * 2
          const r1 = 36
          const r2 = i % 2 ? 46 : 54
          return (
            <path
              key={i}
              d={`M${60 + Math.cos(a) * r1} ${60 + Math.sin(a) * r1}L${60 + Math.cos(a) * r2} ${60 + Math.sin(a) * r2}`}
            />
          )
        })}
        <circle cx="51" cy="54" r="4" />
        <circle cx="69" cy="54" r="4" />
        <path d="M50 70c6 5 14 5 20 0" />
      </g>
    </svg>
  )
}

/** A petroglyph spiral — the carved whorl, never quite closing. */
export function TainoSpiral({ className, strokeWidth = 2.2 }: { className?: string; strokeWidth?: number }) {
  // An Archimedean spiral, sampled — stays perfectly even at every size.
  const points: string[] = []
  for (let i = 0; i <= 120; i++) {
    const a = i * 0.21
    const r = 2 + a * 3.3
    points.push(`${(50 + Math.cos(a) * r).toFixed(1)} ${(50 + Math.sin(a) * r).toFixed(1)}`)
  }
  return (
    <svg viewBox="0 0 100 100" className={cn('shrink-0', className)} aria-hidden="true">
      <path d={`M${points.join('L')}`} {...stroke} strokeWidth={strokeWidth} />
    </svg>
  )
}

/** The coquí: the little frog of the Antilles, as the Taíno drew it. */
export function Coqui({ className, strokeWidth = 2.4 }: { className?: string; strokeWidth?: number }) {
  return (
    <svg viewBox="0 0 100 100" className={cn('shrink-0', className)} aria-hidden="true">
      <g {...stroke} strokeWidth={strokeWidth}>
        <ellipse cx="50" cy="52" rx="15" ry="20" />
        <circle cx="50" cy="28" r="9" />
        <circle cx="46.5" cy="27" r="1.6" fill="currentColor" />
        <circle cx="53.5" cy="27" r="1.6" fill="currentColor" />
        <path d="M36 44c-10-4-14-12-14-20M22 24l-5-3M22 24l-1-6M22 24l5-4" />
        <path d="M64 44c10-4 14-12 14-20M78 24l5-3M78 24l1-6M78 24l-5-4" />
        <path d="M38 66c-10 4-16 12-16 22M22 88l-6 2M22 88l-2 6M22 88l5 4" />
        <path d="M62 66c10 4 16 12 16 22M78 88l6 2M78 88l2 6M78 88l-5 4" />
        <path d="M44 50h12M44 57h12" opacity="0.55" />
      </g>
    </svg>
  )
}

/** The round "face" glyph — rings for ears, three dots for a face. */
export function TainoFace({ className, strokeWidth = 2.4 }: { className?: string; strokeWidth?: number }) {
  return (
    <svg viewBox="0 0 120 100" className={cn('shrink-0', className)} aria-hidden="true">
      <g {...stroke} strokeWidth={strokeWidth}>
        <circle cx="60" cy="50" r="30" />
        <circle cx="20" cy="50" r="9" />
        <circle cx="100" cy="50" r="9" />
        <circle cx="20" cy="50" r="3" />
        <circle cx="100" cy="50" r="3" />
        <circle cx="49" cy="44" r="5.5" />
        <circle cx="71" cy="44" r="5.5" />
        <ellipse cx="60" cy="64" rx="8" ry="4.5" />
        <path d="M44 22c10-8 22-8 32 0" opacity="0.6" />
      </g>
    </svg>
  )
}

/** The zig-zag frieze from a cemí bowl's rim, as a full-width band. */
export function TainoBand({ className, variant = 'zigzag' }: { className?: string; variant?: 'zigzag' | 'steps' }) {
  return (
    <div
      aria-hidden="true"
      className={cn('pointer-events-none w-full', variant === 'zigzag' ? 'taino-band' : 'taino-steps', className)}
    />
  )
}
