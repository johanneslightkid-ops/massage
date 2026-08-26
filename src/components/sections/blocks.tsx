import { useState } from 'react'
import { Link } from 'react-router-dom'
import { AnimatePresence, motion } from 'motion/react'
import { ChevronDown, MessageCircle, ShieldCheck, Sparkles, Wallet } from 'lucide-react'
import type { Faq, PaymentMethod } from '@shared/types'
import { useContent } from '@/lib/content-store'
import { cn, sortByOrder, whatsappLink } from '@/lib/utils'
import { Motif } from '@/components/art/Motif'
import { LeafBlob, PalmFrond, WaveDivider } from '@/components/art/Decor'
import { Container, Section, SectionHead } from '@/components/ui/Section'
import { Reveal } from '@/components/ui/Reveal'
import { Card, Pill } from '@/components/ui/Bits'
import { TestimonialCard } from './cards'

/* ---------------------------------------------------------- where we work */

export function VenueSection() {
  const { content } = useContent()
  const venues = sortByOrder(content.venues)

  return (
    <Section tone="cream" className="grain py-20 sm:py-28">
      <Container>
        <SectionHead
          eyebrow="Three ways to be massaged"
          title="Come to us, or"
          script="we come to you"
          lead="The same therapists and the same table wherever you are — the only difference is the soundtrack."
        />

        <div className="mt-14 grid gap-5 md:grid-cols-3">
          {venues.map((venue, index) => (
            <Reveal key={venue.id} delay={index * 0.08} className="h-full">
              <Card className="flex h-full flex-col bg-white/75 p-7 hover:-translate-y-1 hover:shadow-lift">
                <span className="grid size-14 place-items-center rounded-3xl bg-ocean-900 text-sun-400">
                  <Motif name={venue.icon} className="size-7" />
                </span>
                <h3 className="mt-6 font-display text-2xl text-ocean-900">{venue.name}</h3>
                <p className="mt-1 text-[0.82rem] font-bold tracking-wide text-lagoon-600 uppercase">
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
          <div className="mt-8 flex flex-col gap-3 rounded-4xl border border-ocean-900/8 bg-white/60 p-6 text-[0.88rem] leading-relaxed text-ocean-800/75 sm:flex-row sm:items-center sm:gap-6">
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
  const benefits = sortByOrder(content.benefits)

  return (
    <Section className="relative overflow-hidden py-20 sm:py-28">
      <LeafBlob className="pointer-events-none absolute -top-24 -right-24 size-96 text-lagoon-500" />

      <Container>
        <SectionHead
          eyebrow="Why bother, on holiday?"
          title="Because a week goes fast and"
          script="your body arrived tired"
          lead="Most guests book once, then come back twice. This is what usually changes."
        />

        <div className="mt-14 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {benefits.map((benefit, index) => (
            <Reveal key={benefit.id} delay={index * 0.06} className="h-full">
              <div className="group flex h-full gap-4 rounded-4xl border border-ocean-900/8 bg-white/60 p-6 transition-all duration-500 hover:-translate-y-1 hover:bg-white hover:shadow-soft">
                <span className="grid size-11 shrink-0 place-items-center rounded-2xl bg-seafoam-100 text-lagoon-600 transition-colors duration-500 group-hover:bg-ocean-900 group-hover:text-sun-400">
                  <Motif name={benefit.icon} className="size-5" />
                </span>
                <div>
                  <h3 className="font-display text-[1.28rem] leading-snug text-ocean-900">{benefit.title}</h3>
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
  const site = content.site

  return (
    <Section tone="cream" className="grain relative overflow-hidden py-20 sm:py-28">
      <Container>
        <div className="grid items-center gap-12 lg:grid-cols-[0.85fr_1fr]">
          <Reveal from="right">
            <div className="relative">
              <div className="relative aspect-[4/5] overflow-hidden rounded-5xl shadow-lift">
                {site.ownerPhoto ? (
                  <img src={site.ownerPhoto} alt={site.ownerName} className="size-full object-cover" loading="lazy" />
                ) : (
                  <div className="grid size-full place-items-center bg-gradient-to-br from-ocean-800 via-lagoon-600 to-sun-400">
                    <PalmFrond className="absolute -right-8 -bottom-6 h-72 w-56 animate-sway text-ocean-950/25" />
                    <span className="relative font-display text-8xl text-sand-50/90">
                      {site.ownerName.charAt(0)}
                    </span>
                  </div>
                )}
              </div>
              <div className="absolute -right-3 -bottom-5 max-w-[16rem] rounded-3xl bg-ocean-900 p-5 text-sand-50 shadow-lift sm:-right-6">
                <p className="script text-[1.05rem] leading-snug text-sun-400">“{site.ownerQuote}”</p>
                <p className="mt-3 text-[0.72rem] font-bold tracking-[0.14em] text-seafoam-300 uppercase">
                  {site.ownerName} · {site.ownerRole}
                </p>
              </div>
            </div>
          </Reveal>

          <div>
            <SectionHead
              eyebrow="Who you are booking with"
              title="A small business,"
              script="five pairs of hands"
            />
            <Reveal delay={0.1}>
              <p className="mt-6 text-[1.02rem] leading-[1.75] text-ocean-800/80">{site.ownerStory}</p>

              <div className="mt-8 flex flex-wrap gap-2">
                <Pill tone="lagoon">
                  <ShieldCheck className="size-3.5" />
                  Certified therapists
                </Pill>
                <Pill tone="sun">
                  <Sparkles className="size-3.5" />
                  Women-owned
                </Pill>
                <Pill tone="coral">Fresh linens every session</Pill>
              </div>

              <div className="mt-8 flex flex-wrap gap-3">
                <Link
                  to="/team"
                  className="inline-flex h-12 items-center justify-center rounded-full bg-ocean-900 px-6 text-[0.92rem] font-semibold text-sand-50 transition-colors hover:bg-ocean-800"
                >
                  Meet the team
                </Link>
                <a
                  href={whatsappLink(site)}
                  target="_blank"
                  rel="noreferrer noopener"
                  className="inline-flex h-12 items-center justify-center gap-2 rounded-full border border-ocean-900/20 px-6 text-[0.92rem] font-semibold text-ocean-900 transition-colors hover:bg-ocean-900/5"
                >
                  <MessageCircle className="size-4" />
                  Ask us anything
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
  const reviews = sortByOrder(content.testimonials)

  return (
    <Section tone="ocean" className="grain relative overflow-hidden py-20 sm:py-28">
      <WaveDivider flip from="var(--color-ocean-900)" tone="var(--color-lagoon-400)" className="absolute inset-x-0 -top-px" />
      <PalmFrond mirrored className="pointer-events-none absolute -right-24 bottom-0 h-96 w-72 text-lagoon-400/10" />

      <Container className="relative z-10 pt-10">
        <SectionHead
          invert
          eyebrow="Guests, afterwards"
          title="The nicest thing about this job is"
          script="how people leave"
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
  const methods = sortByOrder(content.payments).filter((method: PaymentMethod) => method.enabled)

  return (
    <Section id={id} className="py-20 sm:py-28">
      <Container>
        <SectionHead
          eyebrow="Paying is the easy part"
          title="Cash, card, or a link"
          script="before we arrive"
          lead="Whatever is simplest for you. We send payment links over WhatsApp and never ask for card details in a chat."
        />

        <div className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {methods.map((method, index) => (
            <Reveal key={method.id} delay={index * 0.06} className="h-full">
              <div className="flex h-full flex-col rounded-4xl border border-ocean-900/8 bg-white/70 p-6 transition-all duration-500 hover:-translate-y-1 hover:shadow-soft">
                <span className="inline-flex h-9 w-fit items-center rounded-xl bg-ocean-900 px-3 text-[0.75rem] font-bold tracking-wide text-sand-50">
                  {paymentGlyphs[method.icon] ?? method.name}
                </span>
                <h3 className="mt-5 font-display text-xl text-ocean-900">{method.name}</h3>
                <p className="mt-2 text-[0.9rem] leading-relaxed text-ocean-800/75">{method.description}</p>
                {method.url && (
                  <a
                    href={method.url}
                    target="_blank"
                    rel="noreferrer noopener"
                    className="mt-auto pt-5 text-[0.84rem] font-bold text-lagoon-600 hover:text-lagoon-500"
                  >
                    Open payment link →
                  </a>
                )}
              </div>
            </Reveal>
          ))}
        </div>

        <Reveal delay={0.2}>
          <p className="mt-8 rounded-3xl bg-sand-100 p-6 text-[0.88rem] leading-relaxed text-ocean-800/75">
            <span className="font-bold text-ocean-900">Cancellations · </span>
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
  const faqs = sortByOrder(items ?? content.faqs)
  const [open, setOpen] = useState<string | null>(faqs[0]?.id ?? null)

  return (
    <Section tone="cream" className="grain py-20 sm:py-28">
      <Container className="max-w-3xl">
        <SectionHead align="center" eyebrow="Before you write" title="Questions we get" script="every single week" />

        <div className="mt-12 space-y-3">
          {faqs.map((faq, index) => {
            const expanded = open === faq.id
            return (
              <Reveal key={faq.id} delay={Math.min(index * 0.04, 0.3)}>
                <div
                  className={cn(
                    'overflow-hidden rounded-3xl border transition-colors duration-300',
                    expanded ? 'border-lagoon-400/40 bg-white' : 'border-ocean-900/8 bg-white/55',
                  )}
                >
                  <button
                    type="button"
                    onClick={() => setOpen(expanded ? null : faq.id)}
                    aria-expanded={expanded}
                    className="flex w-full items-center justify-between gap-4 px-6 py-5 text-left"
                  >
                    <span className="font-display text-[1.15rem] leading-snug text-ocean-900">{faq.question}</span>
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
  const site = content.site

  return (
    <Section className="relative overflow-hidden py-20 sm:py-28">
      <Container>
        <Reveal>
          <div className="grain relative overflow-hidden rounded-5xl bg-gradient-to-br from-ocean-900 via-ocean-800 to-lagoon-600 px-7 py-14 text-center shadow-lift sm:px-16 sm:py-20">
            <PalmFrond className="pointer-events-none absolute -top-10 -left-16 h-72 w-56 animate-sway text-ocean-950/30" />
            <PalmFrond mirrored className="pointer-events-none absolute -right-16 -bottom-16 h-72 w-56 text-ocean-950/25" />

            <div className="relative z-10">
              <p className="text-[0.7rem] font-bold tracking-[0.22em] text-seafoam-300 uppercase">
                {site.neighborhood} · {site.city}
              </p>
              <h2 className="mt-5 text-4xl leading-[1.05] text-sand-50 sm:text-5xl">
                Ready when you are.{' '}
                <span className="script text-sun-400">Even today.</span>
              </h2>
              <p className="mx-auto mt-5 max-w-xl text-[1rem] leading-relaxed text-sand-100/80">
                Tell us the day, the hour and where you are staying. We answer on WhatsApp in minutes and bring
                everything with us.
              </p>

              <div className="mt-9 flex flex-col justify-center gap-3 sm:flex-row">
                <a
                  href={whatsappLink(site)}
                  target="_blank"
                  rel="noreferrer noopener"
                  className="inline-flex h-14 items-center justify-center gap-2.5 rounded-full bg-[#25D366] px-8 text-[1rem] font-bold text-[#062e17] shadow-lift transition-transform duration-300 hover:scale-[1.02]"
                >
                  <MessageCircle className="size-5" strokeWidth={2.4} />
                  Message on WhatsApp
                </a>
                <Link
                  to="/book"
                  className="inline-flex h-14 items-center justify-center rounded-full border border-white/25 bg-white/10 px-8 text-[1rem] font-semibold text-sand-50 backdrop-blur-sm transition-colors hover:bg-white/20"
                >
                  Use the reservation form
                </Link>
              </div>

              <p className="mt-7 text-[0.8rem] text-sand-100/55">{site.beachNote}</p>
            </div>
          </div>
        </Reveal>
      </Container>
    </Section>
  )
}
