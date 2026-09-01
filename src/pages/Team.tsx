import { Globe, ShieldCheck, Sparkles } from 'lucide-react'
import { useContent } from '@/lib/content-store'
import { useT } from '@/lib/translations/LanguageProvider'
import { useSeo } from '@/lib/seo'
import { sortByOrder } from '@/lib/utils'
import { Container, Section, SectionHead } from '@/components/ui/Section'
import { OilSheen } from '@/components/art/Decor'
import { Reveal } from '@/components/ui/Reveal'
import { TherapistCard } from '@/components/sections/cards'
import { PageHeader } from '@/components/sections/PageHeader'
import { CtaBand, OwnerSection, TestimonialsSection } from '@/components/sections/blocks'
import { Pill } from '@/components/ui/Bits'

export function Team() {
  const { content } = useContent()
  const t = useT()
  const team = sortByOrder(content.team)
  const site = content.site

  useSeo({
    path: '/team',
    title: `${t('nav.team')} · ${site.brandName}, ${site.neighborhood}`,
    description: t('team.lead'),
  })

  const languages = Array.from(new Set(team.flatMap((person) => person.languages)))

  const steps = [
    { step: '01', title: t('team.step1.title'), body: t('team.step1.body') },
    { step: '02', title: t('team.step2.title'), body: t('team.step2.body') },
    { step: '03', title: t('team.step3.title'), body: t('team.step3.body') },
    { step: '04', title: t('team.step4.title'), body: t('team.step4.body') },
  ]

  return (
    <>
      <PageHeader
        kicker={t('team.kicker')}
        title={t('team.title')}
        script={t('team.script')}
        lead={t('team.lead')}
      >
        <div className="mt-9 flex flex-wrap gap-2">
          <Pill tone="glass">
            <ShieldCheck className="size-3.5" />
            {t('team.badge_certified')}
          </Pill>
          <Pill tone="glass">
            <Sparkles className="size-3.5" />
            {t('team.badge_since')}
          </Pill>
          <Pill tone="glass">
            <Globe className="size-3.5" />
            {t('team.badge_languages', { count: languages.length })}
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

      <Section tone="cream" className="grain relative overflow-hidden py-20 sm:py-24">
        <OilSheen soft blend="normal" />
        <Container className="relative z-10">
          <SectionHead
            eyebrow={t('team.how.eyebrow')}
            title={t('team.how.title')}
            script={t('team.how.script')}
            lead={t('team.how.lead')}
          />

          <div className="mt-12 grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            {steps.map((item, index) => (
              <Reveal key={item.step} delay={index * 0.07} className="h-full">
                <div className="flex h-full flex-col rounded-5xl border border-white/70 bg-white/72 p-6 shadow-soft transition-all duration-500 hover:-translate-y-1 hover:shadow-lift">
                  <span className="script bg-gradient-to-br from-flamingo-500 to-sun-400 bg-clip-text text-3xl text-transparent">
                    {item.step}
                  </span>
                  <h3 className="mt-3 font-display text-xl text-ocean-950">{item.title}</h3>
                  <p className="mt-2 text-[0.92rem] leading-relaxed text-ocean-800/75">{item.body}</p>
                </div>
              </Reveal>
            ))}
          </div>

          <Reveal delay={0.2}>
            <div className="mt-8 rounded-5xl border border-white/70 bg-white/65 p-7 shadow-soft">
              <p className="text-[0.7rem] font-bold tracking-[0.2em] text-lagoon-700 uppercase">
                {t('team.languages')}
              </p>
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
