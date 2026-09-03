import { cn } from '@/lib/utils'

/**
 * A drawn illustration per treatment, so a card shows what the treatment
 * actually *is* rather than a generic beach.
 *
 * Every service used to fall back to the same sun-and-sea scene in a different
 * tint, which told a guest nothing: hot stone and reflexology looked identical.
 * These are original drawings — no stock licence to track, no photo of a
 * stranger's body standing in for this studio's work, and they tint to the
 * site's own palette instead of fighting it.
 *
 * Matched on the service **slug**, which the owner controls and rarely changes.
 * Anything unmatched falls through to the generic scene, so a new treatment
 * still gets sensible artwork the moment it is created — and a real photograph
 * uploaded in /admin always wins over all of this.
 */

const SKY = '#eaf8fe'
const SAND = '#fdefc9'
const SEA = '#63dee6'
const LINEN = '#ffffff'
const SKIN = '#f3d3b5'
const SKIN_SHADE = '#e0b894'
const PALM = '#2fb972'
const PALM_DARK = '#16794a'
const STONE = '#4a5b63'
const STONE_LIGHT = '#6d818a'
const PINK = '#f7729e'
const GOLD = '#f5bd42'
const INK = '#0c5878'

/** Shared backdrop: a soft horizon so every card sits in the same daylight. */
function Ground({ tint = SKY }: { tint?: string }) {
  return (
    <>
      <rect width="320" height="240" fill={tint} />
      <path d="M0 150h320v90H0Z" fill={SAND} opacity="0.85" />
      <circle cx="262" cy="52" r="30" fill="#fffdf4" opacity="0.9" />
      <circle cx="262" cy="52" r="46" fill={GOLD} opacity="0.14" />
    </>
  )
}

/** A draped massage table, seen from the side — the base of most scenes. */
function Table({ y = 150 }: { y?: number }) {
  return (
    <>
      <rect x="34" y={y} width="252" height="20" rx="10" fill={LINEN} />
      <rect x="34" y={y + 14} width="252" height="10" rx="5" fill="#e6eef2" />
      <rect x="60" y={y + 24} width="9" height="34" rx="4" fill={INK} opacity="0.35" />
      <rect x="251" y={y + 24} width="9" height="34" rx="4" fill={INK} opacity="0.35" />
    </>
  )
}

/** A person lying face down under a towel. */
function LyingBody({ x = 0, scale = 1 }: { x?: number; scale?: number }) {
  return (
    <g transform={`translate(${x} 0) scale(${scale})`}>
      <ellipse cx="78" cy="140" rx="17" ry="15" fill={SKIN} />
      <path d="M96 152c26-16 74-20 116-12 30 6 52 8 68 6v14H92Z" fill={SKIN} />
      <path d="M120 150c40-10 96-12 140-4l6 12H116Z" fill={LINEN} />
      <path d="M118 150c40-10 96-12 140-4" stroke="#dbe7ec" strokeWidth="2" fill="none" />
    </g>
  )
}


/** A hand with actual fingers — an ellipse alone does not read as one. */
function Hand({ x, y, rot = 0, fill = SKIN_SHADE }: { x: number; y: number; rot?: number; fill?: string }) {
  return (
    <g transform={`rotate(${rot} ${x} ${y})`}>
      <rect x={x - 15} y={y - 8} width="27" height="19" rx="9" fill={fill} />
      {[-9, -3, 3, 9].map((dy) => (
        <rect key={dy} x={x + 9} y={y + dy - 2} width="13" height="5" rx="2.5" fill={fill} />
      ))}
      <rect x={x - 13} y={y + 6} width="12" height="6" rx="3" fill={fill} transform={`rotate(24 ${x - 7} ${y + 9})`} />
    </g>
  )
}

/* --------------------------------------------------------------- scenes */

function RelaxingScene() {
  return (
    <>
      <Ground />
      <Table />
      <LyingBody />
      {/* two hands working the shoulders */}
      <ellipse cx="112" cy="138" rx="13" ry="9" fill={SKIN_SHADE} transform="rotate(-18 112 138)" />
      <ellipse cx="132" cy="134" rx="13" ry="9" fill={SKIN_SHADE} transform="rotate(-18 132 134)" />
      {/* warm oil glow */}
      <circle cx="122" cy="140" r="34" fill={GOLD} opacity="0.18" />
    </>
  )
}

function DeepTissueScene() {
  return (
    <>
      <Ground tint="#e3f9ed" />
      <Table />
      <LyingBody />
      {/* a forearm braced into the back, with pressure rings */}
      <path d="M104 96c14 10 22 24 24 40" stroke={SKIN_SHADE} strokeWidth="17" strokeLinecap="round" fill="none" />
      <ellipse cx="130" cy="139" rx="12" ry="9" fill={SKIN_SHADE} />
      {[16, 26, 36].map((r, i) => (
        <circle key={r} cx="130" cy="139" r={r} stroke={PALM_DARK} strokeWidth="2" fill="none" opacity={0.4 - i * 0.1} />
      ))}
    </>
  )
}

function HotStoneScene() {
  return (
    <>
      <Ground tint="#fdefc9" />
      <Table />
      <LyingBody />
      {/* a row of basalt stones down the spine */}
      {[112, 142, 172, 202].map((cx, i) => (
        <g key={cx}>
          <ellipse cx={cx} cy={140 - (i % 2)} rx="15" ry="9" fill={STONE} />
          <ellipse cx={cx} cy={137 - (i % 2)} rx="10" ry="5" fill={STONE_LIGHT} opacity="0.75" />
        </g>
      ))}
      {/* heat rising */}
      {[118, 152, 186].map((x, i) => (
        <path
          key={x}
          d={`M${x} 122c6-8-6-14 0-22`}
          stroke={PINK}
          strokeWidth="3"
          strokeLinecap="round"
          fill="none"
          opacity={0.5 - i * 0.08}
        />
      ))}
    </>
  )
}

function AromaScene() {
  return (
    <>
      <Ground tint="#f4fefd" />
      <path d="M0 168h320v72H0Z" fill={SAND} />
      {/* a coconut half and an oil bottle on a shelf */}
      <ellipse cx="104" cy="168" rx="46" ry="12" fill={INK} opacity="0.08" />
      <path d="M60 168a44 34 0 0 1 88 0Z" fill="#8a5a3b" />
      <path d="M68 166a36 26 0 0 1 72 0Z" fill="#fdf6ea" />
      <ellipse cx="104" cy="166" rx="26" ry="7" fill="#f2e3cd" />
      <rect x="196" y="112" width="40" height="56" rx="12" fill={PALM} opacity="0.85" />
      <rect x="208" y="96" width="16" height="20" rx="5" fill={PALM_DARK} />
      <rect x="204" y="126" width="24" height="26" rx="6" fill={LINEN} opacity="0.75" />
      {/* leaves and a falling drop */}
      <path d="M150 150c-22 0-34-12-34-30 18 0 34 12 34 30Z" fill={PALM} />
      <path d="M158 150c22 0 34-12 34-30-18 0-34 12-34 30Z" fill={PALM_DARK} opacity="0.75" />
      <path d="M216 74c5 7 8 11 8 15a8 8 0 0 1-16 0c0-4 3-8 8-15Z" fill={SEA} />
    </>
  )
}

function CouplesScene() {
  return (
    <>
      <Ground tint="#fff0f5" />
      {/* two tables, side by side */}
      <g transform="translate(-84 6) scale(0.62)">
        <Table y={168} />
        <LyingBody />
      </g>
      <g transform="translate(76 6) scale(0.62)">
        <Table y={168} />
        <LyingBody />
      </g>
      {/* a heart between them */}
      <path
        d="M160 104c-8-11-24-8-24 5 0 10 14 18 24 27 10-9 24-17 24-27 0-13-16-16-24-5Z"
        fill={PINK}
        opacity="0.9"
      />
    </>
  )
}

function FourHandsScene() {
  return (
    <>
      <Ground tint="#e9fcfb" />
      <Table />
      <LyingBody />
      {/*
        Two therapists, one at each end, arms reaching in — the point of the
        treatment is that there are two of them, so the arms are drawn rather
        than just the hands. Their tints differ so the pairing reads at a
        glance.
      */}
      {[
        { x: 74, dir: 1, tint: SEA },
        { x: 246, dir: -1, tint: PINK },
      ].map(({ x, dir, tint }) => (
        <g key={x}>
          <circle cx={x} cy={92} r="30" fill={tint} opacity="0.16" />
          <path
            d={`M${x} 74c${dir * 6} 18 ${dir * 16} 34 ${dir * 30} 46`}
            stroke={SKIN}
            strokeWidth="15"
            strokeLinecap="round"
            fill="none"
          />
          <path
            d={`M${x + dir * 18} 76c${dir * 4} 20 ${dir * 12} 36 ${dir * 26} 48`}
            stroke={SKIN_SHADE}
            strokeWidth="13"
            strokeLinecap="round"
            fill="none"
            opacity="0.85"
          />
          <ellipse cx={x + dir * 32} cy={122} rx="13" ry="9" fill={SKIN_SHADE} transform={`rotate(${dir * 24} ${x + dir * 32} 122)`} />
          <ellipse cx={x + dir * 46} cy={132} rx="13" ry="9" fill={SKIN_SHADE} transform={`rotate(${dir * 24} ${x + dir * 46} 132)`} />
        </g>
      ))}
    </>
  )
}

function BackNeckScene() {
  return (
    <>
      <Ground tint="#e8f7fe" />
      <path d="M0 182h320v58H0Z" fill={SAND} />
      {/* head, neck, then a back that narrows to the waist */}
      <circle cx="160" cy="62" r="24" fill={SKIN} />
      <rect x="150" y="82" width="20" height="16" rx="8" fill={SKIN_SHADE} />
      <path d="M160 96c30 0 50 14 56 34l10 52H94l10-52c6-20 26-34 56-34Z" fill={SKIN} />
      {/* the shoulder line, and warmth where the work happens */}
      <path d="M112 124q48-20 96 0" stroke={SKIN_SHADE} strokeWidth="6" strokeLinecap="round" fill="none" opacity="0.45" />
      <ellipse cx="122" cy="124" rx="24" ry="18" fill={PINK} opacity="0.22" />
      <ellipse cx="198" cy="124" rx="24" ry="18" fill={PINK} opacity="0.22" />
      <Hand x={120} y={122} rot={-24} />
      <Hand x={200} y={122} rot={204} />
    </>
  )
}

function ReflexologyScene() {
  return (
    <>
      <Ground tint="#e3f9ed" />
      <path d="M0 176h320v64H0Z" fill={SAND} />
      {/* a pair of feet, soles toward us, with pressure points */}
      {[112, 208].map((cx, i) => (
        <g key={cx}>
          <path
            d={`M${cx} 62c22 0 34 20 34 48 0 26-10 46-10 62 0 14-10 22-24 22s-24-8-24-22c0-16-10-36-10-62 0-28 12-48 34-48Z`}
            fill={SKIN}
            transform={`scale(${i ? -1 : 1} 1) translate(${i ? -2 * cx : 0} 0)`}
          />
          {[
            [0, 96],
            [-12, 122],
            [12, 128],
            [0, 158],
          ].map(([dx, cy], j) => (
            <circle key={j} cx={cx + dx} cy={cy} r="6" fill={PALM_DARK} opacity="0.35" />
          ))}
        </g>
      ))}
      <ellipse cx="160" cy="214" rx="96" ry="10" fill={INK} opacity="0.07" />
    </>
  )
}

function LymphaticScene() {
  return (
    <>
      <Ground tint="#f4fbff" />
      <Table />
      <LyingBody />
      {/* long directional strokes, drawn as arrows along the body */}
      {[
        [110, 128],
        [150, 122],
        [190, 126],
      ].map(([x, y], i) => (
        <g key={i} opacity={0.6}>
          <path d={`M${x} ${y}h44`} stroke={SEA} strokeWidth="4" strokeLinecap="round" fill="none" />
          <path d={`M${x + 44} ${y}l-9-6m9 6l-9 6`} stroke={SEA} strokeWidth="4" strokeLinecap="round" fill="none" />
        </g>
      ))}
    </>
  )
}

function ReductiveScene() {
  return (
    <>
      <Ground tint="#fff0f5" />
      <Table />
      <LyingBody />
      {/* contour lines and a tape measure */}
      {[0, 1, 2].map((i) => (
        <path
          key={i}
          d={`M108 ${128 + i * 8}c30-9 70-11 104-5`}
          stroke={PINK}
          strokeWidth="2.5"
          strokeDasharray="7 6"
          fill="none"
          opacity={0.65 - i * 0.15}
        />
      ))}
      <rect x="196" y="88" width="56" height="16" rx="8" fill={GOLD} />
      {[204, 214, 224, 234, 244].map((x) => (
        <path key={x} d={`M${x} 88v6`} stroke={INK} strokeWidth="2" opacity="0.5" />
      ))}
    </>
  )
}

function PrenatalScene() {
  return (
    <>
      <Ground tint="#f4fefd" />
      <path d="M0 176h320v64H0Z" fill={SAND} />

      {/*
        A seated side profile rather than someone lying down.

        Three attempts at a reclining figure all read as overlapping blobs at
        card size: the belly either floated free of the body or merged into it.
        Seen from the side, upright, with the bump drawn as part of one
        continuous silhouette, it is unmistakable in a single glance — which is
        the whole job of this drawing.
      */}
      {/* the bolster she is propped against */}
      <ellipse cx="104" cy="132" rx="17" ry="34" fill={PALM} opacity="0.32" />
      {/* the mat */}
      <rect x="86" y="166" width="152" height="12" rx="6" fill={LINEN} />

      {/* legs folded forward, drawn first so the bump sits over them */}
      <path d="M156 168c24-7 48-3 60 6 1 3-2 4-8 4h-52Z" fill={SKIN_SHADE} opacity="0.85" />

      <circle cx="136" cy="70" r="18" fill={SKIN} />

      {/* one silhouette: shoulder, chest, bump, hip, back */}
      <path
        d="M138 88c32 2 56 22 54 44 -2 20 -16 34 -34 36h-42c-10-20-10-58 4-76Z"
        fill={SKIN}
      />
      {/* the underside of the bump, just enough to give it volume */}
      <path d="M188 140c-6 16-20 26-38 28" stroke={SKIN_SHADE} strokeWidth="3" fill="none" opacity="0.45" />

      {/* her arm coming over the top, and a hand where it always rests */}
      <path
        d="M144 100c22 6 34 28 22 46"
        stroke={SKIN_SHADE}
        strokeWidth="12"
        strokeLinecap="round"
        fill="none"
        opacity="0.9"
      />
      <Hand x={160} y={150} rot={26} fill={SKIN} />

      <ellipse cx="162" cy="182" rx="80" ry="8" fill={INK} opacity="0.07" />
    </>
  )
}

function AfterSunScene() {
  return (
    <>
      <Ground tint="#e9fcfb" />
      <path d="M0 172h320v68H0Z" fill={SAND} />
      {/* aloe fronds with droplets */}
      {[-28, -10, 8, 26].map((rot, i) => (
        <path
          key={rot}
          d="M160 172c-9-34-6-70 0-96 6 26 9 62 0 96Z"
          fill={i % 2 ? PALM : PALM_DARK}
          opacity={0.9 - i * 0.08}
          transform={`rotate(${rot} 160 172)`}
        />
      ))}
      {[
        [120, 108],
        [206, 120],
        [166, 84],
      ].map(([cx, cy], i) => (
        <path
          key={i}
          d={`M${cx} ${cy}c5 7 8 11 8 15a8 8 0 0 1-16 0c0-4 3-8 8-15Z`}
          fill={SEA}
          opacity="0.8"
        />
      ))}
    </>
  )
}

function ScrubScene() {
  return (
    <>
      <Ground tint="#fdefc9" />
      <path d="M0 176h320v64H0Z" fill="#f8efdb" />
      {/* a bowl of scrub, coffee beans and coconut */}
      <ellipse cx="160" cy="176" rx="72" ry="14" fill={INK} opacity="0.08" />
      <path d="M96 140h128c-6 30-26 42-64 42s-58-12-64-42Z" fill="#8a5a3b" />
      <ellipse cx="160" cy="140" rx="64" ry="14" fill="#c08b5c" />
      <ellipse cx="160" cy="138" rx="52" ry="10" fill="#e8d5bb" />
      {[
        [132, 136],
        [150, 132],
        [170, 137],
        [188, 133],
      ].map(([cx, cy], i) => (
        <g key={i}>
          <ellipse cx={cx} cy={cy} rx="7" ry="5" fill="#6b4128" transform={`rotate(${i * 22} ${cx} ${cy})`} />
          <path d={`M${cx - 5} ${cy}q5 -3 10 0`} stroke="#e8d5bb" strokeWidth="1.4" fill="none" />
        </g>
      ))}
      <circle cx="246" cy="120" r="22" fill="#8a5a3b" />
      <circle cx="246" cy="120" r="15" fill="#fdf6ea" />
      <path d="M60 148c-18 0-28-10-28-26 16 0 28 10 28 26Z" fill={PALM} />
    </>
  )
}

/* ------------------------------------------------------------- dispatch */

const SCENES: Record<string, () => React.ReactElement> = {
  'full-body-relaxing': RelaxingScene,
  'deep-tissue': DeepTissueScene,
  'hot-stone': HotStoneScene,
  aromatherapy: AromaScene,
  couples: CouplesScene,
  'four-hands': FourHandsScene,
  'back-neck-shoulders': BackNeckScene,
  reflexology: ReflexologyScene,
  'lymphatic-drainage': LymphaticScene,
  reductive: ReductiveScene,
  prenatal: PrenatalScene,
  'after-sun': AfterSunScene,
  'body-scrub': ScrubScene,
}

export function hasServiceScene(slug?: string): boolean {
  return Boolean(slug && slug in SCENES)
}

export function ServiceScene({ slug, className }: { slug: string; className?: string }) {
  const Scene = SCENES[slug]
  if (!Scene) return null
  return (
    <svg viewBox="0 0 320 240" preserveAspectRatio="xMidYMid slice" aria-hidden="true" className={cn(className)}>
      <Scene />
    </svg>
  )
}
