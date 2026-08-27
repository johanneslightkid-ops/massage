import { Link } from 'react-router-dom'
import { ArrowRight, Compass } from 'lucide-react'
import { useContent } from '@/lib/content-store'
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
import { Container, Section, SectionHead } from '@/components/ui/Section'
import { Reveal } from '@/components/ui/Reveal'

/** Mobile gets a snap-scrolling rail; desktop gets the grid. */
function Rail({ children }: { children: React.ReactNode }) {
  return (
    <div className="no-scrollbar -mx-5 flex snap-x snap-mandatory gap-4 overflow-x-auto px-5 pb-2 sm:mx-0 sm:grid sm:snap-none sm:grid-cols-2 sm:overflow-visible sm:px-0 lg:grid-cols-3">
      {children}
    </div>
  )
}

const railItem = 'w-[82vw] shrink-0 snap-center sm:w-auto'

export function Home() {
  const { content } = useContent()
  const site = content.site
  const currency = site.currency

  useSeo({
    path: '/',
    title: `${site.brandName} · Massage in ${site.neighborhood}, ${site.city}`,
    description: `${site.tagline} Studio, beach and hotel-room massage in ${site.neighborhood}. Reserve on WhatsApp.`,
  })
  useJsonLd([
    localBusinessSchema(
      site,
      sortByOrder(content.services),
      content.payments.filter((p) => p.enabled).map((p) => p.name),
      typeof window === 'undefined' ? '' : window.location.origin,
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

      {/* -------------------------------------------------- treatments */}
      <Section className="relative py-20 sm:py-28">
        <Container className="relative">
          <div className="flex flex-wrap items-end justify-between gap-6">
            <SectionHead
              eyebrow="What we do"
              title="Treatments that suit"
              script="a holiday body"
              lead="Everything is done with warm oil, fresh linens and pressure you choose. Prices are per person, in US dollars."
            />
            <Reveal delay={0.15}>
              <Link
                to="/treatments"
                className="inline-flex h-12 items-center gap-2 rounded-full border border-ocean-900/15 px-6 text-[0.9rem] font-semibold text-ocean-900 transition-colors hover:bg-ocean-900/5"
              >
                All treatments
                <ArrowRight className="size-4" />
              </Link>
            </Reveal>
          </div>

          <div className="mt-14">
            <Rail>
              {featured.map((service, index) => (
                <Reveal key={service.id} delay={index * 0.06} className={railItem}>
                  <ServiceCard service={service} currency={currency} compact />
                </Reveal>
              ))}
            </Rail>
          </div>
        </Container>
      </Section>

      <VenueSection />
      <BenefitsSection />

      {/* ---------------------------------------------------- packages */}
      <Section tone="cream" className="grain py-20 sm:py-28">
        <Container>
          <SectionHead
            eyebrow="Occasions & bundles"
            title="For honeymoons, groups"
            script="and whole weeks"
            lead="Fixed prices, no surprises. Every package can be moved to the beach, the studio or your room."
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
      <Section className="py-20 sm:py-28">
        <Container>
          <div className="flex flex-wrap items-end justify-between gap-6">
            <SectionHead eyebrow="The hands" title="Five women who" script="do this properly" />
            <Reveal delay={0.15}>
              <Link
                to="/team"
                className="inline-flex h-12 items-center gap-2 rounded-full border border-ocean-900/15 px-6 text-[0.9rem] font-semibold text-ocean-900 transition-colors hover:bg-ocean-900/5"
              >
                Meet everyone
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
      <Section className="py-20 sm:py-28">
        <Container>
          <div className="flex flex-wrap items-end justify-between gap-6">
            <SectionHead
              eyebrow="Your neighbourhood guide"
              title="What is actually good"
              script="within a short walk"
              lead="We live here. This is the list we give friends — beaches, the restaurants worth leaving the resort for, and the practical things nobody tells you."
            />
            <Reveal delay={0.15}>
              <Link
                to="/discover"
                className="inline-flex h-12 items-center gap-2 rounded-full bg-ocean-900 px-6 text-[0.9rem] font-semibold text-sand-50 transition-colors hover:bg-ocean-800"
              >
                <Compass className="size-4" />
                Open the guide
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
