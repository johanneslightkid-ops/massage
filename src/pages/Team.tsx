import { Globe, ShieldCheck, Sparkles } from 'lucide-react'
import { useContent } from '@/lib/content-store'
import { useSeo } from '@/lib/seo'
import { sortByOrder } from '@/lib/utils'
import { Container, Section, SectionHead } from '@/components/ui/Section'
import { Reveal } from '@/components/ui/Reveal'
import { TherapistCard } from '@/components/sections/cards'
import { PageHeader } from '@/components/sections/PageHeader'
import { CtaBand, OwnerSection, TestimonialsSection } from '@/components/sections/blocks'
import { Pill } from '@/components/ui/Bits'

export function Team() {
  const { content } = useContent()
  const team = sortByOrder(content.team)
  const site = content.site

  useSeo({
    path: '/team',
    title: `Our therapists · ${site.brandName}, ${site.neighborhood}`,
    description: `Meet the certified Dominican therapists behind ${site.brandName} — who they are, what they specialise in, and exactly how a session works.`,
  })

  const languages = Array.from(new Set(team.flatMap((person) => person.languages)))

  return (
    <>
      <PageHeader
        kicker="The people"
        title="Five Dominican women,"
        script="one small studio"
        lead="We are not an agency and there is no call centre. When you write, you are writing to one of us."
      >
        <div className="mt-9 flex flex-wrap gap-2">
          <Pill tone="glass">
            <ShieldCheck className="size-3.5" />
            Certified therapists
          </Pill>
          <Pill tone="glass">
            <Sparkles className="size-3.5" />
            Women-owned since 2019
          </Pill>
          <Pill tone="glass">
            <Globe className="size-3.5" />
            {languages.length} languages between us
          </Pill>
        </div>
      </PageHeader>

      <Section className="py-16 sm:py-24">
        <Container>
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {team.map((person, index) => (
              <Reveal key={person.id} delay={Math.min(index * 0.06, 0.3)} className="h-full">
                <TherapistCard person={person} />
              </Reveal>
            ))}
          </div>
        </Container>
      </Section>

      <Section tone="cream" className="grain py-20 sm:py-24">
        <Container>
          <SectionHead
            eyebrow="How a session actually goes"
            title="No surprises,"
            script="ever"
            lead="If you have never booked a massage outside a resort spa, here is exactly what happens."
          />

          <div className="mt-12 grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            {[
              {
                step: '01',
                title: 'You write on WhatsApp',
                body: 'Tell us the day, the hour, how many people, and whether you want the studio, the beach or your room. We confirm in minutes.',
              },
              {
                step: '02',
                title: 'We arrive prepared',
                body: 'Table, fresh linens, towels, oils and a small speaker. For hotel visits we text when we reach reception.',
              },
              {
                step: '03',
                title: 'You set the pressure',
                body: 'We ask before we start and check during. Draping is used the whole time — say the word and we adjust anything.',
              },
              {
                step: '04',
                title: 'Pay however suits you',
                body: 'Cash, card in the studio, or a Stripe, PayPal or Azul link over WhatsApp. Tipping is welcome but never expected.',
              },
            ].map((item, index) => (
              <Reveal key={item.step} delay={index * 0.07} className="h-full">
                <div className="flex h-full flex-col rounded-4xl border border-ocean-900/8 bg-white/70 p-6">
                  <span className="script text-3xl text-coral-400">{item.step}</span>
                  <h3 className="mt-3 font-display text-xl text-ocean-900">{item.title}</h3>
                  <p className="mt-2 text-[0.92rem] leading-relaxed text-ocean-800/75">{item.body}</p>
                </div>
              </Reveal>
            ))}
          </div>

          <Reveal delay={0.2}>
            <div className="mt-8 rounded-4xl border border-ocean-900/8 bg-white/60 p-7">
              <p className="text-[0.7rem] font-bold tracking-[0.2em] text-lagoon-600 uppercase">Languages we work in</p>
              <div className="mt-4 flex flex-wrap gap-2">
                {site.languages.map((language) => (
                  <Pill key={language} tone="lagoon">
                    {language}
                  </Pill>
                ))}
              </div>
            </div>
          </Reveal>
        </Container>
      </Section>

      <OwnerSection />
      <TestimonialsSection />
      <CtaBand />
    </>
  )
}
