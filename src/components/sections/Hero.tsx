import { motion, useReducedMotion } from 'motion/react'
import { Link } from 'react-router-dom'
import { MapPin, MessageCircle, Star, ArrowDown } from 'lucide-react'
import { useContent } from '@/lib/content-store'
import { useT } from '@/lib/translations/LanguageProvider'
import { whatsappLink } from '@/lib/utils'
import { MonsteraLeaf, PalmFrond } from '@/components/art/Decor'

/**
 * Daylight backdrop built from CSS gradients plus one SVG sea band, so the
 * horizon stays on screen at every aspect ratio instead of being cropped away
 * on a phone the way a fixed-viewBox illustration would be.
 *
 * The palette is the middle of a bright Caribbean afternoon rather than a
 * sunset: wide sky blue at the top, turquoise shallows, warm sand at the foot.
 */
function HeroBackdrop() {
  return (
    <div className="absolute inset-0 overflow-hidden" aria-hidden="true">
      <div className="absolute inset-0 bg-[linear-gradient(180deg,#07293f_0%,#0d4569_18%,#12639a_36%,#1a82c4_52%,#2f9fdd_66%,#55b8ec_78%,#9fdfe8_90%,#fdd274_100%)]" />

      {/* sun high and to the right, hazy rather than a hard disc */}
      <div className="absolute top-[16%] left-[76%] size-[54vmax] max-w-none -translate-x-1/2 -translate-y-1/2 rounded-full bg-[radial-gradient(circle,rgba(255,250,235,0.9)_0%,rgba(253,226,163,0.46)_30%,rgba(251,156,187,0.2)_54%,rgba(251,156,187,0)_74%)]" />
      <div className="absolute top-[16%] left-[76%] size-[8vmax] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[#FFFAEB] opacity-90 blur-[2px]" />

      {/* sea */}
      <svg
        viewBox="0 0 1440 320"
        preserveAspectRatio="none"
        className="absolute inset-x-0 bottom-0 h-[34%] min-h-[200px] w-full"
      >
        <defs>
          <linearGradient id="hero-sea" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#63dee6" />
            <stop offset="34%" stopColor="#2ec9d4" />
            <stop offset="72%" stopColor="#1a82c4" />
            <stop offset="100%" stopColor="#0c5878" />
          </linearGradient>
        </defs>
        <rect width="1440" height="320" fill="url(#hero-sea)" />
        <ellipse cx="1100" cy="26" rx="150" ry="16" fill="#FFF6E2" opacity="0.28" />
        <ellipse cx="1100" cy="74" rx="104" ry="11" fill="#FFF6E2" opacity="0.18" />
        <ellipse cx="1100" cy="120" rx="66" ry="8" fill="#FFF6E2" opacity="0.12" />
        {[0, 1, 2, 3, 4, 5].map((i) => (
          <path
            key={i}
            d={`M0 ${52 + i * 44}c120 0 120-16 240-16s120 16 240 16 120-16 240-16 120 16 240 16 120-16 240-16 120 16 240 16`}
            stroke="#F2FBFF"
            strokeOpacity={0.2 - i * 0.026}
            strokeWidth="2.5"
            fill="none"
          />
        ))}
      </svg>

      {/*
        The oil slick sits on top of the water, not under it — a film of colour
        on the surface, which is the whole reason it is here.
      */}
      <div className="animate-drift absolute inset-x-[-10%] bottom-[2%] h-[52%] opacity-50 mix-blend-screen blur-2xl">
        <div className="size-full bg-[radial-gradient(38%_58%_at_16%_52%,#2fb972_0%,transparent_70%),radial-gradient(34%_54%_at_48%_36%,#f7729e_0%,transparent_70%),radial-gradient(36%_56%_at_72%_62%,#fdd274_0%,transparent_70%),radial-gradient(40%_60%_at_92%_44%,#2ec9d4_0%,transparent_70%)]" />
      </div>

      {/* readability veil — kept light so the daylight still reads as one */}
      <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(4,33,47,0.62)_0%,rgba(4,33,47,0.16)_36%,rgba(4,33,47,0.22)_66%,rgba(4,33,47,0.5)_100%)]" />
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
    <section className="grain relative isolate flex min-h-[94svh] flex-col justify-end overflow-hidden bg-sky-950 text-sand-50 lg:min-h-[88svh] lg:justify-center">
      {site.heroImage ? (
        <>
          <img src={site.heroImage} alt="" className="absolute inset-0 size-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-b from-sky-950/85 via-sky-900/35 to-ocean-950/85" />
        </>
      ) : (
        <HeroBackdrop />
      )}

      <PalmFrond className="pointer-events-none absolute -top-14 -left-24 h-[26rem] w-72 animate-sway text-palm-800/55 sm:-left-16 lg:h-[34rem] lg:w-96" />
      <MonsteraLeaf
        mirrored
        className="pointer-events-none absolute -top-16 -right-24 h-[22rem] w-72 text-palm-800/35 lg:h-[30rem] lg:w-96"
      />

      <div className="relative z-10 mx-auto w-full max-w-6xl px-5 pt-28 pb-32 sm:px-8 sm:pb-28 lg:py-24">
        <motion.p
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
          className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-4 py-1.5 text-[0.7rem] font-semibold tracking-[0.14em] text-seafoam-100 uppercase backdrop-blur-sm"
        >
          <MapPin className="size-3.5" />
          {site.heroKicker}
        </motion.p>

        <motion.h1
          initial={{ opacity: 0, y: 22 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.08, ease: [0.22, 1, 0.36, 1] }}
          className="mt-6 max-w-3xl text-[2.7rem] leading-[1.02] font-normal tracking-[-0.035em] text-sand-50 sm:text-6xl lg:text-[4.6rem]"
        >
          {site.heroTitle}{' '}
          <span className="script bg-gradient-to-r from-sun-200 via-sun-400 to-flamingo-300 bg-clip-text text-transparent drop-shadow-[0_2px_18px_rgba(4,33,47,0.35)]">
            {site.heroHighlight}
          </span>
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.16, ease: [0.22, 1, 0.36, 1] }}
          className="mt-6 max-w-xl text-[1.02rem] leading-relaxed text-sand-100/88 sm:text-lg"
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
            className="inline-flex h-14 items-center justify-center rounded-full border border-white/25 bg-white/10 px-7 text-[1rem] font-semibold text-sand-50 backdrop-blur-sm transition-colors duration-300 hover:bg-white/20"
          >
            {site.heroCtaSecondary}
          </Link>
        </motion.div>

        <motion.dl
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.9, delay: 0.4 }}
          className="no-scrollbar -mx-5 mt-10 flex items-center gap-x-7 overflow-x-auto px-5 whitespace-nowrap text-sand-100/85 sm:mx-0 sm:mt-12 sm:flex-wrap sm:gap-x-8 sm:gap-y-3 sm:px-0 sm:whitespace-normal"
        >
          <div className="flex shrink-0 items-center gap-2">
            <span className="flex text-sun-400">
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
          className="pointer-events-none absolute bottom-6 left-1/2 hidden -translate-x-1/2 text-sand-100/50 lg:block"
        >
          <ArrowDown className="size-5" />
        </motion.div>
      )}
    </section>
  )
}
