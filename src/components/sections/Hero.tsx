import { motion, useReducedMotion, useScroll, useTransform } from 'motion/react'
import { useRef } from 'react'
import { Link } from 'react-router-dom'
import { MapPin, MessageCircle, Star, ArrowDown } from 'lucide-react'
import { useContent } from '@/lib/content-store'
import { useTheme, type Phase } from '@/lib/theme'
import { useT } from '@/lib/translations/LanguageProvider'
import { sortByOrder, whatsappLink } from '@/lib/utils'
import { Hibiscus, MonsteraLeaf, PalmFrond } from '@/components/art/Decor'
import { TainoSpiral, TainoSun } from '@/components/art/Taino'
import { WaterCanvas } from '@/components/art/WaterCanvas'

/**
 * The first screen is the sea at this hour.
 *
 * A live WebGL ocean paints the bottom of the screen — pink at dawn, glitter
 * at noon, gold at dusk, bioluminescent at night — while the type sits in the
 * sky above it. Everything else is painted on top in layers that move at
 * different speeds as you scroll: the carver's sun, the botanist's fronds,
 * the modernist's headline.
 *
 * Until the shader is running (and for anyone who asked for less motion),
 * a static painting of the same sky stands in for it.
 */

const STATIC_SKY: Record<Phase, { sky: string; sea: string; sun: string; sunAt: string }> = {
  dawn: {
    sky: 'linear-gradient(180deg,#8fb8ee 0%,#c9d4f2 35%,#ffd6e2 60%)',
    sea: 'linear-gradient(180deg,#ffd6e2 0%,#8edbe4 18%,#2b78ad 100%)',
    sun: '#ffd2a6',
    sunAt: '20% 40%',
  },
  day: {
    sky: 'linear-gradient(180deg,#6fc1f0 0%,#bfe6fb 32%,#eef9ff 60%)',
    sea: 'linear-gradient(180deg,#eef9ff 0%,#4fdde0 16%,#0b8bb0 100%)',
    sun: '#fff3d1',
    sunAt: '80% 16%',
  },
  dusk: {
    sky: 'linear-gradient(180deg,#8c9ae0 0%,#d6a6c8 38%,#ffb9a6 60%)',
    sea: 'linear-gradient(180deg,#ffb9a6 0%,#e892b2 18%,#27548c 100%)',
    sun: '#ffb178',
    sunAt: '74% 42%',
  },
  night: {
    sky: 'linear-gradient(180deg,#040a1c 0%,#0e1a3d 35%,#1c2c5c 60%)',
    sea: 'linear-gradient(180deg,#1c2c5c 0%,#0a3550 16%,#020c1a 100%)',
    sun: '#dfe8ff',
    sunAt: '80% 14%',
  },
}

function StaticSea({ phase, horizon }: { phase: Phase; horizon: number }) {
  const p = STATIC_SKY[phase]
  return (
    <div className="absolute inset-0">
      <div className="absolute inset-0" style={{ background: p.sky }} />
      <div
        className="absolute inset-0"
        style={{ background: `radial-gradient(28vmax 28vmax at ${p.sunAt}, ${p.sun}cc 0%, ${p.sun}33 30%, transparent 62%)` }}
      />
      <div className="absolute inset-x-0 bottom-0" style={{ height: `${horizon * 100}%`, background: p.sea }}>
        <svg viewBox="0 0 1440 200" preserveAspectRatio="none" className="absolute inset-0 size-full opacity-60">
          {[0, 1, 2, 3, 4].map((i) => (
            <path
              key={i}
              d={`M0 ${30 + i * 36}c120 0 120-12 240-12s120 12 240 12 120-12 240-12 120 12 240 12 120-12 240-12 120 12 240 12`}
              stroke="#ffffff"
              strokeOpacity={0.4 - i * 0.06}
              strokeWidth="2"
              fill="none"
            />
          ))}
        </svg>
      </div>
    </div>
  )
}

export function Hero() {
  const { content } = useContent()
  const t = useT()
  const { phase } = useTheme()
  const site = content.site
  const reduced = useReducedMotion()
  const ref = useRef<HTMLElement>(null)

  const { scrollYProgress } = useScroll({ target: ref, offset: ['start start', 'end start'] })
  const sinkText = useTransform(scrollYProgress, [0, 1], ['0%', '28%'])
  const fadeText = useTransform(scrollYProgress, [0, 0.7], [1, 0])
  const rise = useTransform(scrollYProgress, [0, 1], ['0%', '-40%'])
  const turn = useTransform(scrollYProgress, [0, 1], [0, 90])
  const drift = useTransform(scrollYProgress, [0, 1], ['0%', '18%'])

  const rated = content.testimonials.length
  const therapists = content.team.length
  const ribbon = sortByOrder(content.services).map((service) => service.name)
  const horizon = 0.4
  const night = phase === 'night'

  const motionOr = <T,>(value: T) => (reduced ? undefined : value)

  return (
    <section
      ref={ref}
      className="relative isolate flex min-h-[100svh] flex-col overflow-hidden text-ocean-950 lg:min-h-[92svh]"
    >
      {site.heroImage ? (
        <>
          <img src={site.heroImage} alt="" className="absolute inset-0 size-full object-cover" fetchPriority="high" />
          <div className="absolute inset-0 bg-gradient-to-b from-white/85 via-white/40 to-white/85" />
        </>
      ) : (
        <WaterCanvas
          phase={phase}
          horizon={horizon}
          fallback={<StaticSea phase={phase} horizon={horizon} />}
        />
      )}

      {/* --- the carver: a Taíno sun turning slowly behind the headline */}
      <motion.div
        style={motionOr({ y: rise, rotate: turn })}
        className="pointer-events-none absolute top-[3%] -right-24 size-[14rem] opacity-70 sm:top-[6%] sm:right-[4%] sm:size-[26rem] sm:opacity-100 lg:right-[8%]"
        aria-hidden="true"
      >
        <TainoSun
          className={night ? 'size-full text-sun-300/35' : 'size-full text-flamingo-500/30'}
          strokeWidth={1.6}
        />
      </motion.div>
      <TainoSpiral
        className="animate-spiral pointer-events-none absolute top-[38%] left-[6%] hidden size-24 text-pearl/40 lg:block"
        strokeWidth={1.4}
      />

      {/* --- the botanist: fronds on the edges, drifting at their own pace */}
      <motion.div style={motionOr({ y: drift })} className="pointer-events-none absolute -top-16 -left-24 sm:-left-16" aria-hidden="true">
        <PalmFrond className={`h-[24rem] w-64 animate-sway lg:h-[34rem] lg:w-96 ${night ? 'text-palm-400/25' : 'text-palm-600/45'}`} />
      </motion.div>
      <motion.div style={motionOr({ y: rise })} className="pointer-events-none absolute -top-24 -right-32" aria-hidden="true">
        <MonsteraLeaf mirrored className={`h-[16rem] w-52 rotate-12 lg:h-[22rem] lg:w-72 ${night ? 'text-palm-300/15' : 'text-palm-500/25'}`} />
      </motion.div>
      <Hibiscus className="animate-wiggle pointer-events-none absolute top-[24%] left-[58%] hidden size-16 text-flamingo-500/55 lg:block" />

      {/* --- the modernist: the headline in the sky */}
      <motion.div
        style={motionOr({ y: sinkText, opacity: fadeText })}
        className="relative z-10 mx-auto flex w-full max-w-6xl flex-1 flex-col px-5 pt-24 pb-10 sm:px-8 sm:pt-28 lg:justify-center lg:pt-20"
      >
        <motion.p
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
          className="inline-flex w-fit items-center gap-2 rounded-full border border-white/50 bg-white/70 px-4 py-1.5 text-[0.68rem] font-bold tracking-[0.16em] text-palm-800 uppercase shadow-soft backdrop-blur-md"
        >
          <MapPin className="size-3.5" />
          {site.heroKicker}
        </motion.p>

        <div className="relative mt-6">
          <motion.span
            initial={{ opacity: 0, rotate: -14, scale: 0.8 }}
            animate={{ opacity: 1, rotate: -7, scale: 1 }}
            transition={{ duration: 0.9, delay: 0.5, type: 'spring', stiffness: 120 }}
            className="hand absolute -top-7 right-2 text-[1.7rem] text-flamingo-600 sm:-top-8 sm:right-auto sm:left-[48%] sm:text-[2.2rem] lg:left-[56%]"
          >
            {t(`hero.greet.${phase}`)}
          </motion.span>

          <motion.h1
            initial={{ opacity: 0, y: 26 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9, delay: 0.08, ease: [0.22, 1, 0.36, 1] }}
            className="display-wonk ink-halo max-w-4xl text-[3.1rem] font-normal text-ocean-950 sm:text-7xl lg:text-[6.2rem]"
          >
            {site.heroTitle}{' '}
            <span className="script brush-under inline-block bg-gradient-to-r from-flamingo-600 via-sun-600 to-lagoon-600 bg-clip-text pr-1 text-transparent">
              {site.heroHighlight}
            </span>
          </motion.h1>
        </div>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.18, ease: [0.22, 1, 0.36, 1] }}
          className="ink-halo mt-6 max-w-lg text-[1.02rem] leading-relaxed font-medium text-ocean-900/90 sm:text-lg"
        >
          {site.heroSubtitle}
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.26, ease: [0.22, 1, 0.36, 1] }}
          className="mt-8 flex flex-col gap-3 sm:flex-row sm:items-center"
        >
          <a
            href={whatsappLink(site)}
            target="_blank"
            rel="noreferrer noopener"
            className="sheen-hover inline-flex h-14 items-center justify-center gap-2.5 rounded-full bg-[#25D366] px-7 text-[1rem] font-bold text-[#062e17] shadow-lift transition-transform duration-300 hover:scale-[1.03] active:scale-[0.98]"
          >
            <MessageCircle className="size-5" strokeWidth={2.4} />
            {site.heroCtaPrimary}
          </a>
          <Link
            to="/treatments"
            className="inline-flex h-14 items-center justify-center rounded-full border border-white/60 bg-white/75 px-7 text-[1rem] font-semibold text-ocean-950 shadow-soft backdrop-blur-md transition-all duration-300 hover:-translate-y-0.5 hover:bg-white"
          >
            {site.heroCtaSecondary}
          </Link>
        </motion.div>

        <motion.dl
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.9, delay: 0.42 }}
          className="mt-8 flex w-fit flex-wrap items-center gap-x-6 gap-y-2 rounded-3xl bg-white/55 px-4 py-2.5 text-ocean-900 backdrop-blur-md"
        >
          <div className="flex items-center gap-2">
            <span className="flex text-sun-500">
              {Array.from({ length: 5 }).map((_, index) => (
                <Star key={index} className="size-3.5 fill-current" strokeWidth={0} />
              ))}
            </span>
            <dt className="sr-only">{t('hero.rating_label')}</dt>
            <dd className="text-[0.8rem] font-semibold">{t('hero.rating', { count: rated })}</dd>
          </div>
          <div className="text-[0.8rem] font-semibold">
            <dt className="sr-only">{t('hero.team_label')}</dt>
            <dd>{t('hero.therapists', { count: therapists })}</dd>
          </div>
          <div className="hidden text-[0.8rem] font-semibold sm:block">
            <dt className="sr-only">{t('hero.where_label')}</dt>
            <dd>{t('hero.where')}</dd>
          </div>
        </motion.dl>
      </motion.div>

      {/* --- the shoreline: an angled ribbon of every treatment, drifting by */}
      {ribbon.length > 0 && (
        <div className="relative z-10 -mb-2 -rotate-2 pb-3" aria-hidden="true">
          <div className="overflow-hidden bg-gradient-to-r from-flamingo-600 via-flamingo-500 to-sun-500 py-2.5 text-pearl shadow-lift">
            <div className="animate-marquee flex w-max gap-8 whitespace-nowrap">
              {[0, 1].map((copy) => (
                <div key={copy} className="flex shrink-0 items-center gap-8 pr-8">
                  {ribbon.map((name) => (
                    <span key={`${copy}-${name}`} className="flex items-center gap-8 font-display text-lg italic">
                      {name}
                      <TainoSpiral className="size-4 text-pearl/80" strokeWidth={6} />
                    </span>
                  ))}
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {!reduced && (
        <motion.div
          aria-hidden="true"
          initial={{ opacity: 0 }}
          animate={{ opacity: [0, 1, 1, 0], y: [0, 8, 14, 20] }}
          transition={{ duration: 2.6, repeat: Infinity, delay: 1.2 }}
          className="pointer-events-none absolute bottom-16 left-1/2 z-10 hidden -translate-x-1/2 text-pearl/80 lg:block"
        >
          <ArrowDown className="size-5" />
        </motion.div>
      )}
    </section>
  )
}
