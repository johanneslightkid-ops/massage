import { Link } from 'react-router-dom'
import { ArrowRight, Compass } from 'lucide-react'
import { useContent } from '@/lib/content-store'
import { useT } from '@/lib/translations/LanguageProvider'
import { faqSchema, localBusinessSchema, useJsonLd, useSeo } from '@/lib/seo'
import { sortByOrder } from '@/lib/utils'
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
import { FindBanner } from '@/components/find/FindBanner'
import { Container, Section, SectionHead } from '@/components/ui/Section'
import { Reveal } from '@/components/ui/Reveal'
import { Hibiscus, MonsteraLeaf, PalmFrond, ScatterDots, SunBurst } from '@/components/art/Decor'

/** Mobile gets a snap-scrolling rail; desktop gets the grid. */
function Rail({ children }: { children: React.ReactNode }) {
  return (
    <div className="no-scrollbar -mx-5 flex snap-x snap-mandatory gap-4 overflow-x-auto px-5 pb-2 sm:mx-0 sm:grid sm:snap-none sm:grid-cols-2 sm:overflow-visible sm:px-0 lg:grid-cols-3">
      {children}
    </div>
  )
}

const railItem = 'w-[82vw] shrink-0 snap-center sm:w-auto'

const quietLink =
  'inline-flex h-12 items-center gap-2 rounded-full border border-ocean-900/15 bg-white/60 px-6 text-[0.9rem] font-semibold text-ocean-950 backdrop-blur-sm transition-colors hover:border-lagoon-400/60 hover:bg-white'

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

      {/* -------------------------------------------------- treatments */}
      <Section className="relative overflow-hidden py-20 sm:py-28">
        {/* Each section gets one piece of weather of its own, so scrolling the
            page feels like moving through a place rather than down a list. */}
        <SunBurst className="animate-spin-slow pointer-events-none absolute -top-24 -right-28 hidden size-96 text-sun-300/40 lg:block" />
        <ScatterDots
          seed="treatments"
          className="pointer-events-none absolute inset-x-0 top-0 h-40 text-lagoon-400/50"
        />
        <Container className="relative">
          <div className="flex flex-wrap items-end justify-between gap-6">
            <SectionHead
              eyebrow={t('home.treatments.eyebrow')}
              title={t('home.treatments.title')}
              script={t('home.treatments.script')}
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

      <VenueSection />
      <BenefitsSection />

      {/* ---------------------------------------------------- packages */}
      <Section tone="cream" className="grain speckle relative overflow-hidden py-20 sm:py-28">
        <Hibiscus className="animate-wiggle pointer-events-none absolute top-12 -left-10 size-40 text-flamingo-300/45" />
        <MonsteraLeaf className="pointer-events-none absolute -right-16 bottom-4 hidden h-72 w-56 rotate-6 text-palm-300/45 sm:block" />
        <Container className="relative">
          <SectionHead
            eyebrow={t('home.packages.eyebrow')}
            title={t('home.packages.title')}
            script={t('home.packages.script')}
            lead={t('home.packages.lead')}
          />
          <div className="mt-14 grid gap-5 md:grid-cols-2">
            {packages.map((item, index) => (
              <Reveal key={item.id} delay={index * 0.07} className="h-full">
                <PackageCard item={item} currency={currency} />
              </Reveal>
            ))}
          </div>
        </Container>
      </Section>

      <OwnerSection />

      {/* -------------------------------------------------------- team */}
      <Section className="relative overflow-hidden py-20 sm:py-28">
        <PalmFrond className="animate-sway pointer-events-none absolute -top-20 -left-24 hidden h-96 w-72 text-palm-300/45 lg:block" />
        <Container className="relative">
          <div className="flex flex-wrap items-end justify-between gap-6">
            <SectionHead
              eyebrow={t('home.team.eyebrow')}
              title={t('home.team.title')}
              script={t('home.team.script')}
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

      {/* ---------------------------------------------------- discover */}
      <Section className="relative overflow-hidden py-20 sm:py-28">
        <ScatterDots seed="discover" count={30} className="pointer-events-none absolute inset-0 text-sun-400/35" />
        <Hibiscus className="animate-wiggle pointer-events-none absolute -right-8 top-16 size-32 text-flamingo-300/40" />
        <Container className="relative">
          <div className="flex flex-wrap items-end justify-between gap-6">
            <SectionHead
              eyebrow={t('home.discover.eyebrow')}
              title={t('home.discover.title')}
              script={t('home.discover.script')}
              lead={t('home.discover.lead')}
            />
            <Reveal delay={0.15}>
              <Link
                to="/discover"
                className="inline-flex h-12 items-center gap-2 rounded-full bg-gradient-to-r from-sky-700 to-lagoon-600 px-6 text-[0.9rem] font-semibold text-sand-50 shadow-soft transition-all hover:brightness-110"
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
