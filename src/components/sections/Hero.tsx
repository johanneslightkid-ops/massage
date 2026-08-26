import { motion, useReducedMotion } from 'motion/react'
import { Link } from 'react-router-dom'
import { MapPin, MessageCircle, Star, ArrowDown } from 'lucide-react'
import { useContent } from '@/lib/content-store'
import { whatsappLink } from '@/lib/utils'
import { PalmFrond } from '@/components/art/Decor'

/**
 * Sunset backdrop built from CSS gradients plus one SVG sea band, so the sun
 * stays on screen at every aspect ratio instead of being cropped away on a
 * phone the way a fixed-viewBox illustration would be.
 */
function HeroBackdrop() {
  return (
    <div className="absolute inset-0 overflow-hidden" aria-hidden="true">
      <div className="absolute inset-0 bg-[linear-gradient(180deg,#06211F_0%,#0A302E_24%,#12474A_48%,#1A7C78_68%,#3FA394_82%,#E9A23B_100%)]" />

      {/* sun */}
      <div className="absolute bottom-[26%] left-[68%] size-[62vmax] max-w-none -translate-x-1/2 translate-y-1/2 rounded-full bg-[radial-gradient(circle,rgba(255,246,226,0.92)_0%,rgba(248,206,128,0.5)_30%,rgba(232,140,102,0.22)_52%,rgba(226,112,90,0)_72%)]" />
      <div className="absolute bottom-[26%] left-[68%] size-[11vmax] -translate-x-1/2 translate-y-1/2 rounded-full bg-[#FFF4DA] opacity-90 blur-[1px]" />

      {/* sea */}
      <svg
        viewBox="0 0 1440 320"
        preserveAspectRatio="none"
        className="absolute inset-x-0 bottom-0 h-[32%] min-h-[190px] w-full"
      >
        <defs>
          <linearGradient id="hero-sea" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#2AA396" />
            <stop offset="45%" stopColor="#116561" />
            <stop offset="100%" stopColor="#06211F" />
          </linearGradient>
        </defs>
        <rect width="1440" height="320" fill="url(#hero-sea)" />
        <ellipse cx="980" cy="26" rx="150" ry="16" fill="#FFE9B8" opacity="0.3" />
        <ellipse cx="980" cy="74" rx="104" ry="11" fill="#FFE9B8" opacity="0.2" />
        <ellipse cx="980" cy="120" rx="66" ry="8" fill="#FFE9B8" opacity="0.13" />
        {[0, 1, 2, 3, 4, 5].map((i) => (
          <path
            key={i}
            d={`M0 ${52 + i * 44}c120 0 120-16 240-16s120 16 240 16 120-16 240-16 120 16 240 16 120-16 240-16 120 16 240 16`}
            stroke="#CFEDE6"
            strokeOpacity={0.16 - i * 0.022}
            strokeWidth="2.5"
            fill="none"
          />
        ))}
      </svg>

      {/* readability veil — kept light so the sunset still reads as one */}
      <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(6,33,31,0.66)_0%,rgba(6,33,31,0.22)_38%,rgba(6,33,31,0.32)_70%,rgba(6,33,31,0.66)_100%)]" />
    </div>
  )
}

export function Hero() {
  const { content } = useContent()
  const site = content.site
  const reduced = useReducedMotion()

  const rated = content.testimonials.length
  const therapists = content.team.length

  return (
    <section className="grain relative isolate flex min-h-[94svh] flex-col justify-end overflow-hidden bg-ocean-950 text-sand-50 lg:min-h-[86svh] lg:justify-center">
      {site.heroImage ? (
        <>
          <img src={site.heroImage} alt="" className="absolute inset-0 size-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-b from-ocean-950/85 via-ocean-950/45 to-ocean-950/85" />
        </>
      ) : (
        <HeroBackdrop />
      )}

      <PalmFrond
        className="pointer-events-none absolute -top-14 -left-24 h-[26rem] w-72 animate-sway text-ocean-950/45 sm:-left-16 lg:h-[34rem] lg:w-96"
      />
      <PalmFrond
        mirrored
        className="pointer-events-none absolute -top-24 -right-28 h-[24rem] w-72 text-ocean-950/35 lg:h-[32rem] lg:w-96"
        aria-hidden="true"
      />

      <div className="relative z-10 mx-auto w-full max-w-6xl px-5 pt-28 pb-32 sm:px-8 sm:pb-28 lg:py-24">
        <motion.p
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
          className="inline-flex items-center gap-2 rounded-full border border-white/18 bg-white/8 px-4 py-1.5 text-[0.7rem] font-semibold tracking-[0.14em] text-seafoam-100 uppercase backdrop-blur-sm"
        >
          <MapPin className="size-3.5" />
          {site.heroKicker}
        </motion.p>

        <motion.h1
          initial={{ opacity: 0, y: 22 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.08, ease: [0.22, 1, 0.36, 1] }}
          className="mt-6 max-w-3xl text-[2.7rem] leading-[1.02] font-normal tracking-[-0.035em] sm:text-6xl lg:text-[4.6rem]"
        >
          {site.heroTitle}{' '}
          <span className="script bg-gradient-to-r from-sun-400 via-sun-200 to-coral-300 bg-clip-text text-transparent">
            {site.heroHighlight}
          </span>
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.16, ease: [0.22, 1, 0.36, 1] }}
          className="mt-6 max-w-xl text-[1.02rem] leading-relaxed text-sand-100/85 sm:text-lg"
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
            className="inline-flex h-14 items-center justify-center rounded-full border border-white/25 bg-white/8 px-7 text-[1rem] font-semibold text-sand-50 backdrop-blur-sm transition-colors duration-300 hover:bg-white/16"
          >
            {site.heroCtaSecondary}
          </Link>
        </motion.div>

        <motion.dl
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.9, delay: 0.4 }}
          className="no-scrollbar -mx-5 mt-10 flex items-center gap-x-7 overflow-x-auto px-5 whitespace-nowrap text-sand-100/80 sm:mx-0 sm:mt-12 sm:flex-wrap sm:gap-x-8 sm:gap-y-3 sm:px-0 sm:whitespace-normal"
        >
          <div className="flex shrink-0 items-center gap-2">
            <span className="flex text-sun-400">
              {Array.from({ length: 5 }).map((_, index) => (
                <Star key={index} className="size-4 fill-current" strokeWidth={0} />
              ))}
            </span>
            <dt className="sr-only">Guest rating</dt>
            <dd className="text-[0.84rem] font-medium">{rated} guest reviews</dd>
          </div>
          <div className="shrink-0 text-[0.84rem] font-medium">
            <dt className="sr-only">Team size</dt>
            <dd>{therapists} certified therapists</dd>
          </div>
          <div className="shrink-0 text-[0.84rem] font-medium">
            <dt className="sr-only">Where we work</dt>
            <dd>Studio · Beach · Your hotel room</dd>
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
