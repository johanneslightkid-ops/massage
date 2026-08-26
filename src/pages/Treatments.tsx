import { useMemo, useState } from 'react'
import { useContent } from '@/lib/content-store'
import { cn, sortByOrder } from '@/lib/utils'
import { Container, Section, SectionHead } from '@/components/ui/Section'
import { Reveal } from '@/components/ui/Reveal'
import { PackageCard, ServiceCard } from '@/components/sections/cards'
import { CtaBand, FaqSection, PaymentsSection, VenueSection } from '@/components/sections/blocks'
import { PageHeader } from '@/components/sections/PageHeader'

export function Treatments() {
  const { content } = useContent()
  const currency = content.site.currency
  const services = useMemo(() => sortByOrder(content.services), [content.services])
  const packages = sortByOrder(content.packages)

  const categories = useMemo(() => {
    const seen = new Set<string>()
    for (const service of services) if (service.category) seen.add(service.category)
    return ['All', ...seen]
  }, [services])

  const [active, setActive] = useState('All')
  const shown = active === 'All' ? services : services.filter((service) => service.category === active)

  return (
    <>
      <PageHeader
        kicker="Menu & prices"
        title="Every treatment,"
        script="every price"
        lead="No packages you did not ask for and no upselling on the table. Pick a length, pick a place, and tell us what hurts."
      />

      <Section className="py-16 sm:py-20">
        <Container>
          <div className="no-scrollbar edge-fade -mx-5 flex gap-2 overflow-x-auto px-5 sm:mx-0 sm:flex-wrap sm:px-0">
            {categories.map((category) => (
              <button
                key={category}
                type="button"
                onClick={() => setActive(category)}
                className={cn(
                  'shrink-0 rounded-full px-5 py-2.5 text-[0.85rem] font-semibold transition-all duration-300',
                  active === category
                    ? 'bg-ocean-900 text-sand-50 shadow-soft'
                    : 'border border-ocean-900/12 text-ocean-800/70 hover:border-ocean-900/25 hover:text-ocean-900',
                )}
              >
                {category}
              </button>
            ))}
          </div>

          <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {shown.map((service, index) => (
              <Reveal key={service.id} delay={Math.min(index * 0.05, 0.3)} className="h-full">
                <ServiceCard service={service} currency={currency} />
              </Reveal>
            ))}
          </div>

          {shown.length === 0 && (
            <p className="mt-16 text-center text-ocean-800/60">Nothing in this category yet.</p>
          )}
        </Container>
      </Section>

      <Section tone="cream" className="grain py-20 sm:py-28">
        <Container>
          <SectionHead
            eyebrow="Bundles"
            title="Packages worth"
            script="the whole week"
            lead="Better value than booking session by session, and the sunset slots are held for you in advance."
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

      <VenueSection />
      <PaymentsSection id="payment" />
      <FaqSection />
      <CtaBand />
    </>
  )
}
