import { useState } from 'react'
import { Link } from 'react-router-dom'
import { AnimatePresence, motion } from 'motion/react'
import { ChevronDown, MessageCircle, ShieldCheck, Sparkles, Wallet } from 'lucide-react'
import type { Faq, PaymentMethod } from '@shared/types'
import { useContent } from '@/lib/content-store'
import { useT } from '@/lib/translations/LanguageProvider'
import { cn, sortByOrder, whatsappLink } from '@/lib/utils'
import { Motif } from '@/components/art/Motif'
import { LeafBlob, MonsteraLeaf, OilSheen, PalmFrond, WaveDivider } from '@/components/art/Decor'
import { Container, Section, SectionHead } from '@/components/ui/Section'
import { Reveal } from '@/components/ui/Reveal'
import { Card, Pill } from '@/components/ui/Bits'
import { TestimonialCard } from './cards'

/* ---------------------------------------------------------- where we work */

export function VenueSection() {
  const { content } = useContent()
  const t = useT()
  const venues = sortByOrder(content.venues)

  return (
    <Section tone="cream" className="grain relative overflow-hidden py-20 sm:py-28">
      <OilSheen soft blend="normal" />
      <Container className="relative z-10">
        <SectionHead
          eyebrow={t('venues.eyebrow')}
          title={t('venues.title')}
          script={t('venues.script')}
          lead={t('venues.lead')}
        />

        <div className="mt-14 grid gap-5 md:grid-cols-3">
          {venues.map((venue, index) => (
            <Reveal key={venue.id} delay={index * 0.08} className="h-full">
              <Card className="flex h-full flex-col bg-white/80 p-7 hover:-translate-y-1.5 hover:shadow-lift">
                <span className="grid size-14 place-items-center rounded-[46%_54%_50%_50%/50%_46%_54%_50%] bg-gradient-to-br from-sky-600 via-lagoon-600 to-palm-500 text-white shadow-soft transition-transform duration-500 group-hover:rotate-6">
                  <Motif name={venue.icon} className="size-7" />
                </span>
                <h3 className="mt-6 font-display text-2xl text-ocean-950">{venue.name}</h3>
                <p className="mt-1 text-[0.82rem] font-bold tracking-wide text-lagoon-700 uppercase">
                  {venue.subtitle}
                </p>
                <p className="mt-4 text-[0.96rem] leading-relaxed text-ocean-800/80">{venue.description}</p>
                {venue.note && (
                  <p className="mt-auto pt-6 text-[0.82rem] leading-relaxed text-ocean-800/55">{venue.note}</p>
                )}
              </Card>
            </Reveal>
          ))}
        </div>

        <Reveal delay={0.2}>
          <div className="mt-8 flex flex-col gap-3 rounded-5xl border border-white/70 bg-white/65 p-6 text-[0.88rem] leading-relaxed text-ocean-800/75 shadow-soft sm:flex-row sm:items-center sm:gap-6">
            <Wallet className="size-5 shrink-0 text-lagoon-600" />
            <p>{content.site.hotelSurcharge}</p>
          </div>
        </Reveal>
      </Container>
    </Section>
  )
}

/* ---------------------------------------------------------------- benefits */

export function BenefitsSection() {
  const { content } = useContent()
  const t = useT()
  const benefits = sortByOrder(content.benefits)

  return (
    <Section className="relative overflow-hidden py-20 sm:py-28">
      <LeafBlob className="pointer-events-none absolute -top-24 -right-24 size-96 text-lagoon-500" />
      <MonsteraLeaf className="pointer-events-none absolute -bottom-20 -left-24 h-80 w-64 text-palm-500/12" />

      <Container>
        <SectionHead
          eyebrow={t('benefits.eyebrow')}
          title={t('benefits.title')}
          script={t('benefits.script')}
          lead={t('benefits.lead')}
        />

        <div className="mt-14 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {benefits.map((benefit, index) => (
            <Reveal key={benefit.id} delay={index * 0.06} className="h-full">
              <div className="group flex h-full gap-4 rounded-5xl border border-white/70 bg-white/65 p-6 shadow-soft transition-all duration-500 hover:-translate-y-1.5 hover:bg-white hover:shadow-lift">
                <span className="grid size-11 shrink-0 place-items-center rounded-[48%_52%_44%_56%/52%_48%_52%_48%] bg-sky-100 text-sky-800 transition-all duration-500 group-hover:bg-gradient-to-br group-hover:from-flamingo-500 group-hover:to-sun-400 group-hover:text-white">
                  <Motif name={benefit.icon} className="size-5" />
                </span>
                <div>
                  <h3 className="font-display text-[1.28rem] leading-snug text-ocean-950">{benefit.title}</h3>
                  <p className="mt-2 text-[0.92rem] leading-relaxed text-ocean-800/75">{benefit.description}</p>
                </div>
              </div>
            </Reveal>
          ))}
        </div>
      </Container>
    </Section>
  )
}

/* ------------------------------------------------------------- owner story */

export function OwnerSection() {
  const { content } = useContent()
  const t = useT()
  const site = content.site

  return (
    <Section tone="foam" className="grain relative overflow-hidden py-20 sm:py-28">
      <Container>
        <div className="grid items-center gap-12 lg:grid-cols-[0.85fr_1fr]">
          <Reveal from="right">
            <div className="relative">
              {/* A soft colour field behind the portrait, offset so it reads as light. */}
              <div
                aria-hidden="true"
                className="animate-morph absolute -inset-5 -z-10 opacity-45 blur-2xl"
                style={{
                  background:
                    'linear-gradient(140deg, var(--color-sky-400) 0%, var(--color-lagoon-400) 42%, var(--color-flamingo-300) 100%)',
                }}
              />
              <div className="relative aspect-4/5 overflow-hidden rounded-[46%_54%_42%_58%/38%_40%_60%_62%] shadow-lift">
                {site.ownerPhoto ? (
                  <img src={site.ownerPhoto} alt={site.ownerName} className="size-full object-cover" loading="lazy" />
                ) : (
                  <div className="relative grid size-full place-items-center bg-gradient-to-br from-sky-700 via-lagoon-600 to-sun-400">
                    <PalmFrond className="absolute -right-8 -bottom-6 h-72 w-56 animate-sway text-palm-950/25" />
                    <span className="relative font-display text-8xl text-sand-50/90">
                      {site.ownerName.charAt(0)}
                    </span>
                  </div>
                )}
              </div>
              <div className="absolute -right-3 -bottom-5 max-w-64 rounded-[2rem] bg-ocean-950/95 p-5 text-sand-50 shadow-lift backdrop-blur-sm sm:-right-6">
                <p className="script text-[1.05rem] leading-snug text-sun-400">“{site.ownerQuote}”</p>
                <p className="mt-3 text-[0.72rem] font-bold tracking-[0.14em] text-seafoam-300 uppercase">
                  {site.ownerName} · {site.ownerRole}
                </p>
              </div>
            </div>
          </Reveal>

          <div>
            <SectionHead eyebrow={t('owner.eyebrow')} title={t('owner.title')} script={t('owner.script')} />
            <Reveal delay={0.1}>
              <p className="mt-6 text-[1.02rem] leading-[1.75] text-ocean-800/80">{site.ownerStory}</p>

              <div className="mt-8 flex flex-wrap gap-2">
                <Pill tone="lagoon">
                  <ShieldCheck className="size-3.5" />
                  {t('owner.badge_certified')}
                </Pill>
                <Pill tone="sun">
                  <Sparkles className="size-3.5" />
                  {t('owner.badge_women')}
                </Pill>
                <Pill tone="flamingo">{t('owner.badge_linens')}</Pill>
              </div>

              <div className="mt-8 flex flex-wrap gap-3">
                <Link
                  to="/team"
                  className="inline-flex h-12 items-center justify-center rounded-full bg-gradient-to-br from-sky-700 to-lagoon-600 px-6 text-[0.92rem] font-semibold text-sand-50 shadow-soft transition-all hover:brightness-110"
                >
                  {t('owner.meet_team')}
                </Link>
                <a
                  href={whatsappLink(site)}
                  target="_blank"
                  rel="noreferrer noopener"
                  className="inline-flex h-12 items-center justify-center gap-2 rounded-full border border-ocean-900/15 bg-white/60 px-6 text-[0.92rem] font-semibold text-ocean-950 backdrop-blur-sm transition-colors hover:bg-white"
                >
                  <MessageCircle className="size-4" />
                  {t('owner.ask')}
                </a>
              </div>
            </Reveal>
          </div>
        </div>
      </Container>
    </Section>
  )
}

/* ----------------------------------------------------------- testimonials */

export function TestimonialsSection() {
  const { content } = useContent()
  const t = useT()
  const reviews = sortByOrder(content.testimonials)

  return (
    <Section tone="ocean" className="grain relative overflow-hidden bg-gradient-to-br from-sky-900 via-ocean-900 to-palm-900 py-20 sm:py-28">
      <OilSheen />
      <WaveDivider flip from="var(--color-sky-900)" tone="var(--color-lagoon-400)" className="absolute inset-x-0 -top-px" />
      <MonsteraLeaf mirrored className="pointer-events-none absolute -right-20 bottom-0 h-96 w-72 text-lagoon-300/10" />

      <Container className="relative z-10 pt-10">
        <SectionHead
          invert
          eyebrow={t('testimonials.eyebrow')}
          title={t('testimonials.title')}
          script={t('testimonials.script')}
        />

        <div className="mt-14 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {reviews.map((review, index) => (
            <Reveal key={review.id} delay={index * 0.06} className="h-full">
              <TestimonialCard review={review} />
            </Reveal>
          ))}
        </div>
      </Container>
    </Section>
  )
}

/* -------------------------------------------------------------- payments */

const paymentGlyphs: Record<string, string> = {
  cash: 'Cash',
  stripe: 'Stripe',
  bank: 'Azul',
  paypal: 'PayPal',
  card: 'Card',
}

export function PaymentsSection({ id }: { id?: string }) {
  const { content } = useContent()
  const t = useT()
  const methods = sortByOrder(content.payments).filter((method: PaymentMethod) => method.enabled)

  return (
    <Section id={id} className="py-20 sm:py-28">
      <Container>
        <SectionHead
          eyebrow={t('payments.eyebrow')}
          title={t('payments.title')}
          script={t('payments.script')}
          lead={t('payments.lead')}
        />

        <div className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {methods.map((method, index) => (
            <Reveal key={method.id} delay={index * 0.06} className="h-full">
              <div className="flex h-full flex-col rounded-5xl border border-white/70 bg-white/70 p-6 shadow-soft transition-all duration-500 hover:-translate-y-1.5 hover:shadow-lift">
                <span className="inline-flex h-9 w-fit items-center rounded-full bg-gradient-to-r from-sky-700 to-lagoon-600 px-3.5 text-[0.75rem] font-bold tracking-wide text-white">
                  {paymentGlyphs[method.icon] ?? method.name}
                </span>
                <h3 className="mt-5 font-display text-xl text-ocean-950">{method.name}</h3>
                <p className="mt-2 text-[0.9rem] leading-relaxed text-ocean-800/75">{method.description}</p>
                {method.url && (
                  <a
                    href={method.url}
                    target="_blank"
                    rel="noreferrer noopener"
                    className="mt-auto pt-5 text-[0.84rem] font-bold text-lagoon-700 hover:text-lagoon-600"
                  >
                    {t('payments.open_link')}
                  </a>
                )}
              </div>
            </Reveal>
          ))}
        </div>

        <Reveal delay={0.2}>
          <p className="mt-8 rounded-5xl bg-gradient-to-r from-sun-100 via-sand-100 to-flamingo-100 p-6 text-[0.88rem] leading-relaxed text-ocean-800/80 ring-1 ring-white/70">
            <span className="font-bold text-ocean-950">{t('payments.cancellations')}</span>
            {content.site.cancellationPolicy}
          </p>
        </Reveal>
      </Container>
    </Section>
  )
}

/* ------------------------------------------------------------------- FAQ */

export function FaqSection({ items }: { items?: Faq[] }) {
  const { content } = useContent()
  const t = useT()
  const faqs = sortByOrder(items ?? content.faqs)
  const [open, setOpen] = useState<string | null>(faqs[0]?.id ?? null)

  return (
    <Section tone="cream" className="grain py-20 sm:py-28">
      <Container className="max-w-3xl">
        <SectionHead align="center" eyebrow={t('faq.eyebrow')} title={t('faq.title')} script={t('faq.script')} />

        <div className="mt-12 space-y-3">
          {faqs.map((faq, index) => {
            const expanded = open === faq.id
            return (
              <Reveal key={faq.id} delay={Math.min(index * 0.04, 0.3)}>
                <div
                  className={cn(
                    'overflow-hidden rounded-[1.75rem] border transition-colors duration-300',
                    expanded ? 'border-lagoon-400/50 bg-white shadow-soft' : 'border-white/70 bg-white/60',
                  )}
                >
                  <button
                    type="button"
                    onClick={() => setOpen(expanded ? null : faq.id)}
                    aria-expanded={expanded}
                    className="flex w-full items-center justify-between gap-4 px-6 py-5 text-left"
                  >
                    <span className="font-display text-[1.15rem] leading-snug text-ocean-950">{faq.question}</span>
                    <ChevronDown
                      className={cn(
                        'size-5 shrink-0 text-lagoon-600 transition-transform duration-300',
                        expanded && 'rotate-180',
                      )}
                    />
                  </button>
                  <AnimatePresence initial={false}>
                    {expanded && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.32, ease: [0.22, 1, 0.36, 1] }}
                      >
                        <p className="px-6 pb-6 text-[0.96rem] leading-relaxed text-ocean-800/80">{faq.answer}</p>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </Reveal>
            )
          })}
        </div>
      </Container>
    </Section>
  )
}

/* -------------------------------------------------------------- final CTA */

export function CtaBand() {
  const { content } = useContent()
  const t = useT()
  const site = content.site

  return (
    <Section className="relative overflow-hidden py-20 sm:py-28">
      <Container>
        <Reveal>
          <div className="grain relative overflow-hidden rounded-6xl bg-gradient-to-br from-sky-800 via-lagoon-700 to-palm-700 px-7 py-14 text-center shadow-float sm:px-16 sm:py-20">
            <OilSheen />
            <PalmFrond className="pointer-events-none absolute -top-10 -left-16 h-72 w-56 animate-sway text-sky-950/30" />
            <MonsteraLeaf
              mirrored
              className="pointer-events-none absolute -right-14 -bottom-16 h-72 w-60 text-palm-950/25"
            />

            <div className="relative z-10">
              <p className="text-[0.7rem] font-bold tracking-[0.22em] text-seafoam-200 uppercase">
                {site.neighborhood} · {site.city}
              </p>
              <h2 className="mt-5 text-4xl leading-[1.05] text-sand-50 sm:text-5xl">
                {t('cta.title')}{' '}
                <span className="script bg-gradient-to-r from-sun-300 to-flamingo-300 bg-clip-text text-transparent">
                  {t('cta.script')}
                </span>
              </h2>
              <p className="mx-auto mt-5 max-w-xl text-[1rem] leading-relaxed text-sand-100/85">{t('cta.lead')}</p>

              <div className="mt-9 flex flex-col justify-center gap-3 sm:flex-row">
                <a
                  href={whatsappLink(site)}
                  target="_blank"
                  rel="noreferrer noopener"
                  className="inline-flex h-14 items-center justify-center gap-2.5 rounded-full bg-[#25D366] px-8 text-[1rem] font-bold text-[#062e17] shadow-lift transition-transform duration-300 hover:scale-[1.02]"
                >
                  <MessageCircle className="size-5" strokeWidth={2.4} />
                  {t('action.message_on_whatsapp')}
                </a>
                <Link
                  to="/book"
                  className="inline-flex h-14 items-center justify-center rounded-full border border-white/25 bg-white/12 px-8 text-[1rem] font-semibold text-sand-50 backdrop-blur-sm transition-colors hover:bg-white/22"
                >
                  {t('cta.form')}
                </Link>
              </div>

              <p className="mt-7 text-[0.8rem] text-sand-100/60">{site.beachNote}</p>
            </div>
          </div>
        </Reveal>
      </Container>
    </Section>
  )
}
