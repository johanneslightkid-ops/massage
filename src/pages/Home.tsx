import { Link } from 'react-router-dom'
import { ArrowRight, Compass } from 'lucide-react'
import { useContent } from '@/lib/content-store'
import { useT } from '@/lib/translations/LanguageProvider'
import { faqSchema, localBusinessSchema, useJsonLd, useSeo } from '@/lib/seo'
import { cn, sortByOrder } from '@/lib/utils'
import { Hero } from '@/components/sections/Hero'
import {
  BenefitsSection,
  CtaBand,
  FaqSection,
  OwnerSection,
  PaymentsSection,
  TestimonialsSection,
  VenueSection,
} from '@/components/sections/blocks'
import { PackageCard, ServiceCard, SpotCard, TherapistCard } from '@/components/sections/cards'
import { BlogTeaser } from '@/components/blog/BlogCards'
import { FindBanner } from '@/components/find/FindBanner'
import { Container, Section, SectionHead } from '@/components/ui/Section'
import { Reveal } from '@/components/ui/Reveal'
import { DriftText, Parallax } from '@/components/ui/Parallax'
import { Hibiscus, MonsteraLeaf, PalmFrond, ScatterDots } from '@/components/art/Decor'
import { Coqui, TainoFace, TainoSpiral, TainoSun } from '@/components/art/Taino'

/**
 * Mobile gets a snap-scrolling rail; desktop gets a staggered grid — the
 * middle column dropped half a card, so a row reads as a wave, not a shelf.
 */
function Rail({ children }: { children: React.ReactNode }) {
  return (
    <div className="no-scrollbar -mx-5 flex snap-x snap-mandatory gap-4 overflow-x-auto px-5 pb-2 sm:mx-0 sm:grid sm:snap-none sm:grid-cols-2 sm:overflow-visible sm:px-0 lg:grid-cols-3 lg:gap-6">
      {children}
    </div>
  )
}

const railItem = 'w-[82vw] shrink-0 snap-center sm:w-auto lg:[&:nth-child(3n+2)]:mt-14'

const quietLink =
  'inline-flex h-12 items-center gap-2 rounded-full border border-ocean-900/15 bg-white/60 px-6 text-[0.9rem] font-semibold text-ocean-950 backdrop-blur-sm transition-colors hover:border-lagoon-400/60 hover:bg-white'

/** Outlined place names sliding across the page between chapters. */
function PlaceBand({ words, className }: { words: string; className?: string }) {
  return (
    <div aria-hidden="true" className={cn('pointer-events-none relative z-0 select-none', className)}>
      <DriftText distance={22} className="flex gap-10 whitespace-nowrap">
        {[0, 1, 2].map((copy) => (
          <span key={copy} className="display-wonk text-outline text-[4.5rem] text-flamingo-400/55 italic sm:text-[8rem]">
            {words}
          </span>
        ))}
      </DriftText>
    </div>
  )
}

export function Home() {
  const { content } = useContent()
  const t = useT()
  const site = content.site
  const currency = site.currency

  useSeo({
    path: '/',
    title: `${site.brandName} · ${t('seo.home_suffix', { neighborhood: site.neighborhood, city: site.city })}`,
    description: `${site.tagline} ${site.heroSubtitle}`.slice(0, 300),
  })
  useJsonLd([
    localBusinessSchema(
      site,
      sortByOrder(content.services),
      content.payments.filter((p) => p.enabled).map((p) => p.name),
      typeof window === 'undefined' ? '' : window.location.origin,
      t('seo.catalog'),
    ),
    faqSchema(sortByOrder(content.faqs)),
  ])

  const featured = sortByOrder(content.services).filter((service) => service.featured).slice(0, 6)
  const team = sortByOrder(content.team).slice(0, 3)
  const spots = sortByOrder(content.discover).slice(0, 3)
  const packages = sortByOrder(content.packages)

  return (
    <>
      <Hero />

      {/*
        The guided experience sits directly under the hero because it is the
        front door: most guests arrive knowing how their day has gone, not
        which modality they want. The catalogue below stays the reference
        library for the ones who do.
      */}
      <FindBanner journeys={content.journeys ?? []} />

      {/* ------------------------------------------------ I. treatments */}
      <Section tone="sunrise" cut="both" className="overflow-hidden">
        <Parallax speed={-0.5} rotate={40} className="pointer-events-none absolute top-16 -right-28 size-[26rem] opacity-70">
          <TainoSun className="size-full text-sun-500/35" strokeWidth={1.2} />
        </Parallax>
        <ScatterDots seed="treatments" className="pointer-events-none absolute inset-x-0 top-0 h-48 text-flamingo-400/40" />
        <Container className="relative">
          <div className="flex flex-wrap items-end justify-between gap-6">
            <SectionHead
              chapter="I"
              eyebrow={t('home.treatments.eyebrow')}
              title={t('home.treatments.title')}
              script={t('home.treatments.script')}
              note={t('home.treatments.note')}
              lead={t('home.treatments.lead')}
            />
            <Reveal delay={0.15}>
              <Link to="/treatments" className={quietLink}>
                {t('home.treatments.all')}
                <ArrowRight className="size-4" />
              </Link>
            </Reveal>
          </div>

          <div className="mt-14">
            <Rail>
              {featured.map((service, index) => (
                <Reveal key={service.id} delay={index * 0.06} className={railItem}>
                  <ServiceCard service={service} currency={currency} journeys={content.journeys ?? []} compact />
                </Reveal>
              ))}
            </Rail>
          </div>
        </Container>
      </Section>

      <PlaceBand words={`${site.neighborhood} · ${site.city} · Cap Cana ·`} className="-my-6 sm:-my-10" />

      <VenueSection />
      <BenefitsSection />

      {/* -------------------------------------------------- IV. packages */}
      <Section tone="cream" cut="top-rev" className="grain speckle overflow-hidden pb-20 sm:pb-28">
        <Parallax speed={0.35} className="pointer-events-none absolute top-24 -left-10">
          <Hibiscus className="animate-wiggle size-40 text-flamingo-300/50" />
        </Parallax>
        <MonsteraLeaf className="pointer-events-none absolute -right-16 bottom-4 hidden h-72 w-56 rotate-6 text-palm-300/45 sm:block" />
        <Container className="relative">
          <SectionHead
            chapter="IV"
            align="right"
            eyebrow={t('home.packages.eyebrow')}
            title={t('home.packages.title')}
            script={t('home.packages.script')}
            lead={t('home.packages.lead')}
          />
          <div className="mt-14 grid gap-5 md:grid-cols-2 md:gap-7">
            {packages.map((item, index) => (
              <Reveal
                key={item.id}
                delay={index * 0.07}
                from={index % 2 ? 'left' : 'right'}
                className={index % 2 === 1 ? 'md:mt-10' : 'h-full'}
              >
                <PackageCard item={item} currency={currency} />
              </Reveal>
            ))}
          </div>
        </Container>
      </Section>

      <OwnerSection />

      {/* ------------------------------------------------------- V. team */}
      <Section className="overflow-hidden py-20 sm:py-28">
        <Parallax speed={0.3} rotate={-8} className="pointer-events-none absolute -top-20 -left-24 hidden h-96 w-72 lg:block">
          <PalmFrond className="size-full animate-sway text-palm-300/45" />
        </Parallax>
        <TainoFace className="pointer-events-none absolute top-24 right-6 hidden w-36 text-lagoon-500/25 lg:block" strokeWidth={1.6} />
        <Container className="relative">
          <div className="flex flex-wrap items-end justify-between gap-6">
            <SectionHead
              chapter="V"
              eyebrow={t('home.team.eyebrow')}
              title={t('home.team.title')}
              script={t('home.team.script')}
              note={t('home.team.note')}
            />
            <Reveal delay={0.15}>
              <Link to="/team" className={quietLink}>
                {t('home.team.all')}
                <ArrowRight className="size-4" />
              </Link>
            </Reveal>
          </div>

          <div className="mt-14">
            <Rail>
              {team.map((person, index) => (
                <Reveal key={person.id} delay={index * 0.07} className={railItem}>
                  <TherapistCard person={person} />
                </Reveal>
              ))}
            </Rail>
          </div>
        </Container>
      </Section>

      <TestimonialsSection />

      <BlogTeaser />

      {/* --------------------------------------------------- VII. discover */}
      <Section tone="lagoon" cut="both" className="overflow-hidden">
        <ScatterDots seed="discover" count={30} className="pointer-events-none absolute inset-0 text-sun-400/35" />
        <Parallax speed={-0.3} className="pointer-events-none absolute top-20 -right-8">
          <Coqui className="size-32 text-palm-600/25" strokeWidth={1.8} />
        </Parallax>
        <TainoSpiral className="animate-spiral pointer-events-none absolute bottom-24 left-6 size-28 text-flamingo-400/30" />
        <Container className="relative">
          <div className="flex flex-wrap items-end justify-between gap-6">
            <SectionHead
              chapter="VII"
              eyebrow={t('home.discover.eyebrow')}
              title={t('home.discover.title')}
              script={t('home.discover.script')}
              note={t('home.discover.note')}
              lead={t('home.discover.lead')}
            />
            <Reveal delay={0.15}>
              <Link
                to="/discover"
                className="sheen-hover inline-flex h-12 items-center gap-2 rounded-full bg-gradient-to-r from-sky-700 to-lagoon-600 px-6 text-[0.9rem] font-semibold text-sand-50 shadow-soft transition-all hover:brightness-110"
              >
                <Compass className="size-4" />
                {t('home.discover.all')}
              </Link>
            </Reveal>
          </div>

          <div className="mt-14">
            <Rail>
              {spots.map((spot, index) => (
                <Reveal key={spot.id} delay={index * 0.07} className={railItem}>
                  <SpotCard spot={spot} />
                </Reveal>
              ))}
            </Rail>
          </div>
        </Container>
      </Section>

      <PaymentsSection />
      <FaqSection />
      <CtaBand />
    </>
  )
}
