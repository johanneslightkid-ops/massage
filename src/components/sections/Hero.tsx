import { motion, useReducedMotion } from 'motion/react'
import { Link } from 'react-router-dom'
import { MapPin, MessageCircle, Star, ArrowDown } from 'lucide-react'
import { useContent } from '@/lib/content-store'
import { useT } from '@/lib/translations/LanguageProvider'
import { whatsappLink } from '@/lib/utils'
import { MonsteraLeaf, PalmFrond } from '@/components/art/Decor'

/**
 * Midday, not dusk.
 *
 * This used to open on #07293f — near-black navy — under a 62% dark veil, and
 * because it is the first screen the whole site read as a dark blue-green one.
 * It is now lit the way Bávaro actually looks at two in the afternoon: pale
 * sky overhead, turquoise shallows, wet sand at the foot, and no veil at all.
 *
 * Losing the veil means the headline sits on light, so the hero text is dark
 * rather than white — the one change that does most of the brightening.
 */
function HeroBackdrop() {
  return (
    <div className="absolute inset-0 overflow-hidden" aria-hidden="true">
      {/* sky: white at the horizon, deepening only slightly overhead */}
      <div className="absolute inset-0 bg-[linear-gradient(180deg,#bfe6fb_0%,#d8f1fd_14%,#eaf8fe_30%,#f7fdff_46%,#ffffff_56%)]" />

      {/* sun, high right, hazy and warm */}
      <div className="absolute top-[13%] left-[78%] size-[58vmax] max-w-none -translate-x-1/2 -translate-y-1/2 rounded-full bg-[radial-gradient(circle,rgba(255,252,240,0.95)_0%,rgba(253,226,163,0.55)_26%,rgba(251,156,187,0.22)_50%,rgba(251,156,187,0)_72%)]" />
      <div className="absolute top-[13%] left-[78%] size-[7vmax] -translate-x-1/2 -translate-y-1/2 animate-breathe rounded-full bg-[#FFFDF4] blur-[3px]" />

      {/* a few soft clouds, drifting */}
      <div className="animate-drift absolute top-[18%] left-[8%] h-16 w-56 rounded-full bg-white/70 blur-2xl sm:h-20 sm:w-80" />
      <div className="animate-float absolute top-[30%] right-[12%] h-12 w-40 rounded-full bg-white/60 blur-2xl sm:h-16 sm:w-64" />

      {/* sea */}
      <svg
        viewBox="0 0 1440 320"
        preserveAspectRatio="none"
        className="absolute inset-x-0 bottom-0 h-[42%] min-h-[220px] w-full"
      >
        <defs>
          <linearGradient id="hero-sea" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#c4f4f6" />
            <stop offset="22%" stopColor="#63dee6" />
            <stop offset="55%" stopColor="#2ec9d4" />
            <stop offset="82%" stopColor="#10abb8" />
            <stop offset="100%" stopColor="#63dee6" />
          </linearGradient>
          <linearGradient id="hero-sand" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#fdefc9" />
            <stop offset="100%" stopColor="#f8efdb" />
          </linearGradient>
        </defs>
        <rect width="1440" height="320" fill="url(#hero-sea)" />

        {/* sun glitter on the water */}
        <ellipse cx="1120" cy="22" rx="160" ry="15" fill="#FFFFFF" opacity="0.55" />
        <ellipse cx="1120" cy="66" rx="110" ry="10" fill="#FFFFFF" opacity="0.4" />
        <ellipse cx="1120" cy="108" rx="70" ry="7" fill="#FFFFFF" opacity="0.28" />

        {[0, 1, 2, 3, 4, 5].map((i) => (
          <path
            key={i}
            d={`M0 ${44 + i * 42}c120 0 120-16 240-16s120 16 240 16 120-16 240-16 120 16 240 16 120-16 240-16 120 16 240 16`}
            stroke="#FFFFFF"
            strokeOpacity={0.5 - i * 0.06}
            strokeWidth="2.5"
            fill="none"
          />
        ))}

        {/* wet sand and foam at the very bottom */}
        <path d="M0 268c150 0 180-14 320-14s200 16 340 16 210-18 350-18 250 16 430 16v52H0Z" fill="url(#hero-sand)" />
        <path
          d="M0 268c150 0 180-14 320-14s200 16 340 16 210-18 350-18 250 16 430 16"
          stroke="#FFFFFF"
          strokeWidth="7"
          fill="none"
          opacity="0.9"
        />
      </svg>

      {/*
        The oil sheen stays — it is the signature — but on a light ground it has
        to tint rather than glow, so it multiplies instead of screening.
      */}
      <div className="animate-drift absolute inset-x-[-10%] bottom-[6%] h-[46%] opacity-30 mix-blend-multiply blur-2xl">
        <div className="size-full bg-[radial-gradient(38%_58%_at_16%_52%,#2fb972_0%,transparent_70%),radial-gradient(34%_54%_at_48%_36%,#f7729e_0%,transparent_70%),radial-gradient(36%_56%_at_72%_62%,#fdd274_0%,transparent_70%),radial-gradient(40%_60%_at_92%_44%,#2ec9d4_0%,transparent_70%)]" />
      </div>
    </div>
  )
}

export function Hero() {
  const { content } = useContent()
  const t = useT()
  const site = content.site
  const reduced = useReducedMotion()

  const rated = content.testimonials.length
  const therapists = content.team.length

  return (
    <section className="grain relative isolate flex min-h-[94svh] flex-col justify-end overflow-hidden bg-sky-100 text-ocean-950 lg:min-h-[88svh] lg:justify-center">
      {site.heroImage ? (
        <>
          <img src={site.heroImage} alt="" className="absolute inset-0 size-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-b from-white/85 via-white/45 to-white/85" />
        </>
      ) : (
        <HeroBackdrop />
      )}

      <PalmFrond className="pointer-events-none absolute -top-14 -left-24 h-[26rem] w-72 animate-sway text-palm-500/60 sm:-left-16 lg:h-[34rem] lg:w-96" />
      <MonsteraLeaf
        mirrored
        className="pointer-events-none absolute -top-24 -right-32 h-[16rem] w-52 rotate-12 text-palm-400/30 lg:h-[22rem] lg:w-72"
      />
      <MonsteraLeaf
        className="pointer-events-none absolute top-[6%] right-[6%] hidden h-28 w-24 -rotate-12 animate-sway text-palm-500/25 lg:block"
      />

      <div className="relative z-10 mx-auto w-full max-w-6xl px-5 pt-28 pb-32 sm:px-8 sm:pb-28 lg:py-24">
        <motion.p
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
          className="inline-flex items-center gap-2 rounded-full border border-white/70 bg-white/80 px-4 py-1.5 text-[0.7rem] font-semibold tracking-[0.14em] text-palm-800 uppercase shadow-soft backdrop-blur-sm"
        >
          <MapPin className="size-3.5" />
          {site.heroKicker}
        </motion.p>

        <motion.h1
          initial={{ opacity: 0, y: 22 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.08, ease: [0.22, 1, 0.36, 1] }}
          className="mt-6 max-w-3xl text-[2.7rem] leading-[1.02] font-normal tracking-[-0.035em] text-ocean-950 sm:text-6xl lg:text-[4.6rem]"
        >
          {site.heroTitle}{' '}
          <span className="script bg-gradient-to-r from-palm-600 to-lagoon-600 bg-clip-text text-transparent">
            {site.heroHighlight}
          </span>
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.16, ease: [0.22, 1, 0.36, 1] }}
          className="mt-6 max-w-xl text-[1.02rem] leading-relaxed text-ocean-800/85 sm:text-lg"
        >
          {site.heroSubtitle}
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.24, ease: [0.22, 1, 0.36, 1] }}
          className="mt-9 flex flex-col gap-3 sm:flex-row sm:items-center"
        >
          <a
            href={whatsappLink(site)}
            target="_blank"
            rel="noreferrer noopener"
            className="inline-flex h-14 items-center justify-center gap-2.5 rounded-full bg-[#25D366] px-7 text-[1rem] font-bold text-[#062e17] shadow-lift transition-transform duration-300 hover:scale-[1.02] active:scale-[0.98]"
          >
            <MessageCircle className="size-5" strokeWidth={2.4} />
            {site.heroCtaPrimary}
          </a>
          <Link
            to="/treatments"
            className="inline-flex h-14 items-center justify-center rounded-full border border-ocean-900/12 bg-white/85 px-7 text-[1rem] font-semibold text-ocean-950 shadow-soft backdrop-blur-sm transition-all duration-300 hover:-translate-y-0.5 hover:bg-white"
          >
            {site.heroCtaSecondary}
          </Link>
        </motion.div>

        <motion.dl
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.9, delay: 0.4 }}
          className="no-scrollbar -mx-5 mt-10 flex items-center gap-x-7 overflow-x-auto px-5 whitespace-nowrap text-ocean-800/80 sm:mx-0 sm:mt-12 sm:flex-wrap sm:gap-x-8 sm:gap-y-3 sm:px-0 sm:whitespace-normal"
        >
          <div className="flex shrink-0 items-center gap-2">
            <span className="flex text-sun-500">
              {Array.from({ length: 5 }).map((_, index) => (
                <Star key={index} className="size-4 fill-current" strokeWidth={0} />
              ))}
            </span>
            <dt className="sr-only">{t('hero.rating_label')}</dt>
            <dd className="text-[0.84rem] font-medium">{t('hero.rating', { count: rated })}</dd>
          </div>
          <div className="shrink-0 text-[0.84rem] font-medium">
            <dt className="sr-only">{t('hero.team_label')}</dt>
            <dd>{t('hero.therapists', { count: therapists })}</dd>
          </div>
          <div className="shrink-0 text-[0.84rem] font-medium">
            <dt className="sr-only">{t('hero.where_label')}</dt>
            <dd>{t('hero.where')}</dd>
          </div>
        </motion.dl>
      </div>

      {!reduced && (
        <motion.div
          aria-hidden="true"
          initial={{ opacity: 0 }}
          animate={{ opacity: [0, 1, 1, 0], y: [0, 8, 14, 20] }}
          transition={{ duration: 2.6, repeat: Infinity, delay: 1.2 }}
          className="pointer-events-none absolute bottom-6 left-1/2 hidden -translate-x-1/2 text-ocean-800/45 lg:block"
        >
          <ArrowDown className="size-5" />
        </motion.div>
      )}
    </section>
  )
}
