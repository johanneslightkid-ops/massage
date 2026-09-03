import { cn, seededUnit } from '@/lib/utils'
import { hasServiceScene, ServiceScene } from './ServiceScene'

/* ------------------------------------------------------------ wave divider */

/**
 * The seam between two sections. Three offset crests rather than one, so the
 * boundary reads as moving water instead of a printed edge.
 */
export function WaveDivider({
  className,
  flip = false,
  from = 'var(--color-sand-50)',
  tone = 'var(--color-ocean-900)',
}: {
  className?: string
  flip?: boolean
  from?: string
  tone?: string
}) {
  return (
    <div className={cn('pointer-events-none w-full leading-none', className)} aria-hidden="true">
      <svg
        viewBox="0 0 1440 120"
        preserveAspectRatio="none"
        className={cn('h-[60px] w-full sm:h-[90px]', flip && 'rotate-180')}
      >
        <path
          d="M0 60c120-30 240-45 360-30s240 60 360 60 240-45 360-60 240-15 360 0v90H0Z"
          fill={tone}
          opacity="0.14"
        />
        <path
          d="M0 78c120-24 240-36 360-24s240 48 360 48 240-36 360-48 240-12 360 0v66H0Z"
          fill={tone}
          opacity="0.22"
        />
        <path d="M0 96c180-24 360-30 540-18s360 30 540 18 240-18 360-12v36H0Z" fill={from} />
      </svg>
    </div>
  )
}

/**
 * A softer seam for light-on-light joins: one long, lazy organic curve with no
 * repeating rhythm at all, so two pale sections melt into each other.
 */
export function OrganicDivider({
  className,
  flip = false,
  fill = 'var(--color-sand-50)',
}: {
  className?: string
  flip?: boolean
  fill?: string
}) {
  return (
    <div className={cn('pointer-events-none w-full leading-none', className)} aria-hidden="true">
      <svg
        viewBox="0 0 1440 96"
        preserveAspectRatio="none"
        className={cn('h-[48px] w-full sm:h-[72px]', flip && 'rotate-180')}
      >
        <path
          d="M0 44c164 44 318 46 462 8s268-54 372-30 186 62 306 54 194-32 300-58v82H0Z"
          fill={fill}
        />
      </svg>
    </div>
  )
}

/* ------------------------------------------------------------- palm fronds */

export function PalmFrond({ className, mirrored = false }: { className?: string; mirrored?: boolean }) {
  const leaves = 11
  const blades: string[] = []

  for (let i = 0; i < leaves; i++) {
    const t = i / (leaves - 1)
    const y = 24 + t * 214
    const x = 100 - t * 26
    // Longest blades sit a third of the way down, tapering to the tip.
    const len = 82 * (1 - Math.abs(t - 0.34) * 0.82)
    const drop = 20 + t * 26

    for (const side of [1, -1]) {
      const tipX = x + side * len
      const tipY = y + drop
      const upperX = x + side * len * 0.42
      const upperY = y - len * 0.44
      const lowerX = x + side * len * 0.52
      const lowerY = y + drop * 0.42
      blades.push(`M${x} ${y}Q${upperX} ${upperY} ${tipX} ${tipY}Q${lowerX} ${lowerY} ${x} ${y}Z`)
    }
  }

  return (
    <svg
      viewBox="0 0 200 270"
      fill="none"
      aria-hidden="true"
      className={cn('origin-top', mirrored && '-scale-x-100', className)}
    >
      <g fill="currentColor">
        {blades.map((d, index) => (
          <path key={index} d={d} />
        ))}
      </g>
      <path d="M100 270C100 176 96 96 80 18" stroke="currentColor" strokeWidth="4" strokeLinecap="round" />
    </svg>
  )
}

/* ------------------------------------------------------------- monstera-ish */

export function LeafBlob({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 240 240" fill="none" aria-hidden="true" className={className}>
      <path
        d="M120 12c62 0 108 46 108 108s-46 108-108 108S12 182 12 120 58 12 120 12Z"
        fill="currentColor"
        opacity="0.09"
      />
      <path
        d="M198 42c-52-16-104 2-134 44-28 39-30 92-6 132 46-4 88-30 110-70 20-36 26-72 30-106Z"
        fill="currentColor"
        opacity="0.14"
      />
      <path d="M58 218C92 168 132 108 198 42" stroke="currentColor" strokeWidth="2" opacity="0.25" />
    </svg>
  )
}

/**
 * A monstera leaf with its real cuts — the one plant that says "tropical"
 * without a single palm cliché. Used as a large, quiet watermark.
 */
export function MonsteraLeaf({ className, mirrored = false }: { className?: string; mirrored?: boolean }) {
  // The cuts are a mask, not paint: on a dark hero a painted "hole" reads as a
  // pale blob, while a masked one is genuinely see-through.
  const id = 'monstera-cuts'
  return (
    <svg
      viewBox="0 0 220 240"
      fill="none"
      aria-hidden="true"
      className={cn(mirrored && '-scale-x-100', className)}
    >
      <defs>
        <mask id={id} maskUnits="userSpaceOnUse" x="0" y="0" width="220" height="240">
          <rect width="220" height="240" fill="white" />
          <g fill="black">
            <ellipse cx="76" cy="70" rx="17" ry="7" transform="rotate(-24 76 70)" />
            <ellipse cx="144" cy="70" rx="17" ry="7" transform="rotate(24 144 70)" />
            <ellipse cx="66" cy="118" rx="21" ry="8" transform="rotate(-16 66 118)" />
            <ellipse cx="154" cy="118" rx="21" ry="8" transform="rotate(16 154 118)" />
            <ellipse cx="78" cy="166" rx="17" ry="7" transform="rotate(-12 78 166)" />
            <ellipse cx="142" cy="166" rx="17" ry="7" transform="rotate(12 142 166)" />
            <ellipse cx="92" cy="204" rx="12" ry="5" transform="rotate(-10 92 204)" />
            <ellipse cx="128" cy="204" rx="12" ry="5" transform="rotate(10 128 204)" />
          </g>
        </mask>
      </defs>

      <g mask={`url(#${id})`}>
        <path
          d="M110 6c58 0 100 46 100 108 0 58-44 106-100 120C54 220 10 172 10 114 10 52 52 6 110 6Z"
          fill="currentColor"
        />
      </g>
      <g stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" opacity="0.55">
        <path d="M110 232V26" />
        <path d="M110 62 58 34M110 62l52-28M110 108 40 82M110 108l70-26M110 154 52 138M110 154l58-16M110 196l-40-18M110 196l40-18" />
      </g>
    </svg>
  )
}

/**
 * The oil sheen: four colour fields drifting slowly over each other, the way a
 * film of oil moves on wet sand.
 *
 * It is a sibling layer rather than a `::before`, because a pseudo-element
 * behind its own host is painted *under* the host's background — which is
 * exactly where a gradient section would hide it. Rendered as a sibling with
 * the content marked `relative z-10`, it lands between the two.
 */
export function OilSheen({
  className,
  soft = false,
  blend = 'screen',
}: {
  className?: string
  /** The pale variant for light sections. */
  soft?: boolean
  blend?: 'screen' | 'soft-light' | 'normal'
}) {
  return (
    <div
      aria-hidden="true"
      className={cn('animate-drift pointer-events-none absolute -inset-1/4', className)}
      style={{
        opacity: soft ? 0.42 : 0.78,
        filter: `blur(${soft ? 40 : 8}px) saturate(165%)`,
        mixBlendMode: blend,
        background: soft
          ? 'radial-gradient(44% 36% at 18% 22%, rgb(85 184 236 / 0.55) 0%, transparent 66%),' +
            'radial-gradient(40% 32% at 84% 30%, rgb(251 156 187 / 0.55) 0%, transparent 64%),' +
            'radial-gradient(46% 38% at 62% 88%, rgb(91 211 150 / 0.5) 0%, transparent 66%),' +
            'radial-gradient(38% 30% at 30% 92%, rgb(253 226 163 / 0.62) 0%, transparent 62%)'
          : 'radial-gradient(46% 38% at 22% 26%, rgb(99 222 230 / 0.75) 0%, transparent 66%),' +
            'radial-gradient(42% 34% at 78% 18%, rgb(247 114 158 / 0.62) 0%, transparent 64%),' +
            'radial-gradient(50% 40% at 68% 82%, rgb(47 185 114 / 0.6) 0%, transparent 66%),' +
            'radial-gradient(44% 36% at 18% 84%, rgb(253 210 116 / 0.68) 0%, transparent 64%)',
      }}
    />
  )
}

/* ------------------------------------------------- generated card artwork */

/**
 * Sky/sea/sun triples rather than free colour sets: the sea stays in the ocean
 * family on every seed, so a card always reads as a tropical shore instead of
 * an arbitrary wash. Warmed towards the new palette — brighter sky blues, a
 * lusher green and a flamingo option among the warm tones.
 */
/**
 * Six daylight scenes, one per treatment card.
 *
 * These used to bottom out at #04212f — near-black — and that single value
 * painted the sky, the sea *and* the palm, so a grid of cards read as a wall of
 * dark blue-green. Every scene is now lit for midday: a pale sky, turquoise
 * water, warm sand and a green (never black) palm.
 *
 *   sky   top of the sky, the lightest value
 *   sea   the water, and the deeper end of the sky gradient
 *   warm  sand and the glow around the sun
 *   palm  the tree — foliage green, so it never silhouettes
 */
const PALETTES = [
  { sky: '#d8f1fd', sea: '#2ec9d4', warm: '#fdefc9', palm: '#1e9a5c' },
  { sky: '#e3f9ed', sea: '#10abb8', warm: '#fde3a3', palm: '#16794a' },
  { sky: '#eaf8fe', sea: '#55b8ec', warm: '#ffdbe7', palm: '#2fb972' },
  { sky: '#fff0f5', sea: '#63dee6', warm: '#fdd274', palm: '#1e9a5c' },
  { sky: '#e9fcfb', sea: '#2fb972', warm: '#f5bd42', palm: '#0f6239' },
  { sky: '#d0eefd', sea: '#2f9fdd', warm: '#f89a80', palm: '#16794a' },
]

/**
 * A deterministic tropical scene used wherever the owner has not uploaded a
 * photo yet. Same seed always draws the same picture, so cards do not flicker
 * between renders and the grid keeps a consistent rhythm.
 */
export function GeneratedScene({ seed, className }: { seed: string; className?: string }) {
  const unit = seededUnit(seed)
  const { sky, sea, warm, palm } = PALETTES[Math.floor(unit * PALETTES.length) % PALETTES.length]
  const sunX = 70 + unit * 190
  const horizon = 116 + unit * 24
  const id = seed.replace(/[^a-zA-Z0-9]/g, '')

  return (
    <svg viewBox="0 0 320 240" preserveAspectRatio="xMidYMid slice" aria-hidden="true" className={className}>
      <defs>
        <linearGradient id={`sky-${id}`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={sky} />
          <stop offset="52%" stopColor="#FFFFFF" />
          <stop offset="100%" stopColor={warm} />
        </linearGradient>
        <radialGradient id={`glow-${id}`} cx="50%" cy="50%">
          <stop offset="0%" stopColor="#FFF6E2" stopOpacity="0.9" />
          <stop offset="45%" stopColor={warm} stopOpacity="0.6" />
          <stop offset="100%" stopColor={warm} stopOpacity="0" />
        </radialGradient>
        <linearGradient id={`sea-${id}`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#c4f4f6" />
          <stop offset="38%" stopColor={sea} />
          <stop offset="100%" stopColor={sea} />
        </linearGradient>
      </defs>

      <rect width="320" height="240" fill={`url(#sky-${id})`} />
      <circle cx={sunX} cy={horizon - 40} r="78" fill={`url(#glow-${id})`} />
      <circle cx={sunX} cy={horizon - 40} r="20" fill="#FFF3D6" opacity="0.92" />

      <path d={`M0 ${horizon}h320v240H0Z`} fill={`url(#sea-${id})`} />
      <ellipse cx={sunX} cy={horizon + 14} rx="46" ry="6" fill="#FFE9B8" opacity="0.28" />
      <ellipse cx={sunX} cy={horizon + 32} rx="30" ry="4" fill="#FFE9B8" opacity="0.18" />
      {[0, 1, 2, 3].map((i) => (
        <path
          key={i}
          d={`M0 ${horizon + 22 + i * 19}c40 0 40-7 80-7s40 7 80 7 40-7 80-7 40 7 80 7`}
          stroke="#FFFFFF"
          strokeOpacity={0.55 - i * 0.09}
          strokeWidth="2"
          fill="none"
        />
      ))}

      <path d={`M0 ${horizon + 92}c60-12 120-4 180 6s90 8 140-4v150H0Z`} fill="#FDF8EF" opacity="0.94" />

      <g transform={`translate(${16 + unit * 26} ${horizon + 74}) scale(${0.4 + unit * 0.12})`} opacity="0.9">
        <path d="M40 180C40 110 36 60 20 6" stroke={palm} strokeWidth="7" strokeLinecap="round" fill="none" />
        {[0, 1, 2, 3, 4].map((i) => (
          <path
            key={i}
            d={`M20 6c${-40 + i * 22} ${-24 + i * 4}, ${-60 + i * 30} ${6 + i * 8}, ${-52 + i * 34} ${34 + i * 6}`}
            stroke={palm}
            strokeWidth="6"
            strokeLinecap="round"
            fill="none"
          />
        ))}
      </g>
    </svg>
  )
}

/* --------------------------------------------------------- image or scene */

export function SceneImage({
  src,
  seed,
  alt,
  slug,
  className,
}: {
  src?: string
  seed: string
  alt: string
  /**
   * A treatment slug, when the caller has one. Gets the drawn illustration for
   * that specific treatment instead of the generic beach.
   */
  slug?: string
  className?: string
}) {
  // A real photograph the owner uploaded always wins.
  if (src) {
    return <img src={src} alt={alt} loading="lazy" decoding="async" className={cn('size-full object-cover', className)} />
  }
  if (hasServiceScene(slug)) {
    return <ServiceScene slug={slug!} className={cn('size-full', className)} />
  }
  return <GeneratedScene seed={seed} className={cn('size-full', className)} />
}

/* ------------------------------------------------- bright tropical extras */

/**
 * A hibiscus, the flower that is actually everywhere in Bávaro.
 *
 * Five petals off a common centre with a long stamen. Drawn rather than
 * photographed so it tints to whatever the section around it needs.
 */
export function Hibiscus({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 64 64" fill="none" className={cn('shrink-0', className)} aria-hidden="true">
      <g fill="currentColor">
        {[0, 72, 144, 216, 288].map((angle) => (
          <ellipse
            key={angle}
            cx="32"
            cy="19"
            rx="11"
            ry="14"
            transform={`rotate(${angle} 32 32)`}
            opacity="0.85"
          />
        ))}
      </g>
      <circle cx="32" cy="32" r="5.5" fill="currentColor" opacity="0.45" />
      <path d="M32 32 46 46" stroke="currentColor" strokeWidth="2" strokeLinecap="round" opacity="0.6" />
      <circle cx="47" cy="47" r="2.6" fill="currentColor" opacity="0.7" />
    </svg>
  )
}

/**
 * A soft sunburst. Rays are individually rotated wedges rather than a conic
 * gradient, so they stay crisp at any size and can be animated as one group.
 */
export function SunBurst({ className, rays = 12 }: { className?: string; rays?: number }) {
  return (
    <svg viewBox="0 0 200 200" fill="none" className={cn('shrink-0', className)} aria-hidden="true">
      <g className="origin-center">
        {Array.from({ length: rays }, (_, i) => (
          <path
            key={i}
            d="M100 8 L106 52 L94 52 Z"
            fill="currentColor"
            opacity={0.28}
            transform={`rotate(${(360 / rays) * i} 100 100)`}
          />
        ))}
      </g>
      <circle cx="100" cy="100" r="34" fill="currentColor" opacity="0.22" />
      <circle cx="100" cy="100" r="22" fill="currentColor" opacity="0.3" />
    </svg>
  )
}

/**
 * Scattered dots — sand grains, sea spray, confetti, depending on where it
 * lands. Seeded so a given section always scatters the same way and the layout
 * never jumps between renders.
 */
export function ScatterDots({ className, count = 22, seed = 'scatter' }: { className?: string; count?: number; seed?: string }) {
  let n = 0
  for (let i = 0; i < seed.length; i++) n = (n * 31 + seed.charCodeAt(i)) >>> 0
  const next = () => {
    n = (n * 1664525 + 1013904223) >>> 0
    return n / 4294967296
  }
  const dots = Array.from({ length: count }, () => ({
    x: next() * 100,
    y: next() * 100,
    r: 1 + next() * 2.6,
    o: 0.18 + next() * 0.4,
  }))
  return (
    <svg viewBox="0 0 100 100" preserveAspectRatio="none" className={cn('pointer-events-none', className)} aria-hidden="true">
      {dots.map((d, i) => (
        <circle key={i} cx={d.x} cy={d.y} r={d.r} fill="currentColor" opacity={d.o} />
      ))}
    </svg>
  )
}

/**
 * A single lazy bubble column — used behind watery sections. Each bubble has
 * its own delay so they never rise in lockstep.
 */
export function Bubbles({ className, count = 6 }: { className?: string; count?: number }) {
  return (
    <div className={cn('pointer-events-none absolute inset-0 overflow-hidden', className)} aria-hidden="true">
      {Array.from({ length: count }, (_, i) => (
        <span
          key={i}
          className="animate-rise-slow absolute rounded-full bg-current"
          style={{
            left: `${(i * 100) / count + 4}%`,
            bottom: '-12%',
            width: `${6 + (i % 3) * 5}px`,
            height: `${6 + (i % 3) * 5}px`,
            opacity: 0.18 + (i % 3) * 0.08,
            animationDelay: `${i * 1.6}s`,
            animationDuration: `${11 + (i % 4) * 3}s`,
          }}
        />
      ))}
    </div>
  )
}
