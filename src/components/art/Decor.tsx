import { cn, seededUnit } from '@/lib/utils'

/* ------------------------------------------------------------ wave divider */

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
      <path
        d="M100 270C100 176 96 96 80 18"
        stroke="currentColor"
        strokeWidth="4"
        strokeLinecap="round"
      />
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

/* ------------------------------------------------- generated card artwork */

const PALETTES = [
  ['#0F423F', '#1E9C90', '#7CD3C4'],
  ['#145651', '#34B5A6', '#FBE3B6'],
  ['#0A302E', '#157F76', '#F4BE63'],
  ['#1E9C90', '#F28E76', '#FBE3B6'],
  ['#2A5F4A', '#3F8A66', '#A8E5DA'],
  ['#0F423F', '#E9A23B', '#F7B09D'],
]

/**
 * A deterministic tropical scene used wherever the owner has not uploaded a
 * photo yet. Same seed always draws the same picture, so cards do not flicker
 * between renders and the grid keeps a consistent rhythm.
 */
export function GeneratedScene({ seed, className }: { seed: string; className?: string }) {
  const unit = seededUnit(seed)
  const palette = PALETTES[Math.floor(unit * PALETTES.length) % PALETTES.length]
  const [deep, mid, warm] = palette
  const sunX = 60 + unit * 200
  const horizon = 150 + unit * 30
  const id = seed.replace(/[^a-zA-Z0-9]/g, '')

  return (
    <svg viewBox="0 0 320 240" preserveAspectRatio="xMidYMid slice" aria-hidden="true" className={className}>
      <defs>
        <linearGradient id={`sky-${id}`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={warm} stopOpacity="0.85" />
          <stop offset="55%" stopColor={mid} stopOpacity="0.75" />
          <stop offset="100%" stopColor={deep} />
        </linearGradient>
        <radialGradient id={`glow-${id}`} cx="50%" cy="50%">
          <stop offset="0%" stopColor="#FFF3D6" stopOpacity="0.95" />
          <stop offset="70%" stopColor={warm} stopOpacity="0.25" />
          <stop offset="100%" stopColor={warm} stopOpacity="0" />
        </radialGradient>
        <linearGradient id={`sea-${id}`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={mid} />
          <stop offset="100%" stopColor={deep} />
        </linearGradient>
      </defs>

      <rect width="320" height="240" fill={`url(#sky-${id})`} />
      <circle cx={sunX} cy={horizon - 46} r="72" fill={`url(#glow-${id})`} />
      <circle cx={sunX} cy={horizon - 46} r="21" fill="#FFF0CE" opacity="0.92" />

      <path d={`M0 ${horizon}h320v240H0Z`} fill={`url(#sea-${id})`} />
      {[0, 1, 2, 3].map((i) => (
        <path
          key={i}
          d={`M0 ${horizon + 16 + i * 18}c40 0 40-7 80-7s40 7 80 7 40-7 80-7 40 7 80 7`}
          stroke="#FFFFFF"
          strokeOpacity={0.16 - i * 0.03}
          strokeWidth="2"
          fill="none"
        />
      ))}

      <path d={`M0 ${horizon + 88}c60-12 120-4 180 6s90 8 140-4v150H0Z`} fill="#F8F1E8" opacity="0.9" />

      <g transform={`translate(${18 + unit * 24} ${horizon + 70}) scale(${0.42 + unit * 0.12})`} opacity="0.85">
        <path d="M40 180C40 110 36 60 20 6" stroke={deep} strokeWidth="7" strokeLinecap="round" fill="none" />
        {[0, 1, 2, 3, 4].map((i) => (
          <path
            key={i}
            d={`M20 6c${-40 + i * 22} ${-24 + i * 4}, ${-60 + i * 30} ${6 + i * 8}, ${-52 + i * 34} ${34 + i * 6}`}
            stroke={deep}
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
  className,
}: {
  src?: string
  seed: string
  alt: string
  className?: string
}) {
  if (src) {
    return <img src={src} alt={alt} loading="lazy" decoding="async" className={cn('size-full object-cover', className)} />
  }
  return <GeneratedScene seed={seed} className={cn('size-full', className)} />
}
