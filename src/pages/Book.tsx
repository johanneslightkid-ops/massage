import { useEffect, useMemo, useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import { CalendarDays, Check, Clock, Loader2, MessageCircle, Users } from 'lucide-react'
import { useContent } from '@/lib/content-store'
import { useT } from '@/lib/translations/LanguageProvider'
import { faqSchema, useJsonLd, useSeo } from '@/lib/seo'
import { api } from '@/lib/api'
import { bookingMessage, cn, formatPrice, sortByOrder, whatsappLink } from '@/lib/utils'
import { Container, Section } from '@/components/ui/Section'
import { Reveal } from '@/components/ui/Reveal'
import { PageHeader } from '@/components/sections/PageHeader'
import { FaqSection, PaymentsSection } from '@/components/sections/blocks'
import { Motif } from '@/components/art/Motif'

const TIME_SLOTS = ['09:00', '10:30', '12:00', '14:00', '15:30', '17:00', '18:30', '20:00']

function StepLabel({ index, children }: { index: number; children: React.ReactNode }) {
  return (
    <h2 className="flex items-center gap-3 font-display text-[1.35rem] text-ocean-950">
      <span className="grid size-8 shrink-0 place-items-center rounded-[44%_56%_50%_50%/50%_46%_54%_50%] bg-gradient-to-br from-sky-700 to-lagoon-600 text-[0.8rem] font-bold text-sand-50">
        {index}
      </span>
      {children}
    </h2>
  )
}

function OptionButton({
  selected,
  onClick,
  children,
  className,
}: {
  selected: boolean
  onClick: () => void
  children: React.ReactNode
  className?: string
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={selected}
      className={cn(
        'relative rounded-[1.6rem] border p-4 text-left transition-all duration-300',
        selected
          ? 'border-lagoon-400 bg-gradient-to-br from-seafoam-50 to-sky-50 shadow-soft'
          : 'border-ocean-900/10 bg-white/70 hover:border-lagoon-400/50 hover:bg-white',
        className,
      )}
    >
      {selected && (
        <span className="absolute top-3 right-3 grid size-5 place-items-center rounded-full bg-lagoon-500 text-white">
          <Check className="size-3" strokeWidth={3} />
        </span>
      )}
      {children}
    </button>
  )
}

export function Book() {
  const { content } = useContent()
  const t = useT()
  const site = content.site
  const currency = site.currency
  const services = useMemo(() => sortByOrder(content.services), [content.services])
  const venues = useMemo(() => sortByOrder(content.venues), [content.venues])
  const packages = useMemo(() => sortByOrder(content.packages), [content.packages])

  useSeo({
    path: '/book',
    title: `${t('nav.book')} · ${site.brandName}, ${site.neighborhood}`,
    description: t('book.lead'),
  })
  useJsonLd([faqSchema(sortByOrder(content.faqs))])

  const [params] = useSearchParams()
  const preset = params.get('service') ?? ''

  const [serviceName, setServiceName] = useState(preset)
  const [minutes, setMinutes] = useState<number | null>(null)
  const [venue, setVenue] = useState('')
  const [date, setDate] = useState('')
  const [time, setTime] = useState('')
  const [people, setPeople] = useState('1')
  const [name, setName] = useState('')
  const [hotel, setHotel] = useState('')
  const [notes, setNotes] = useState('')

  const [sending, setSending] = useState(false)
  const [sent, setSent] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const selectedService = services.find((service) => service.name === serviceName)
  const selectedPackage = packages.find((item) => item.name === serviceName)

  useEffect(() => {
    if (!selectedService) return
    if (!selectedService.durations.some((duration) => duration.minutes === minutes)) {
      setMinutes(selectedService.durations[0]?.minutes ?? null)
    }
  }, [selectedService, minutes])

  useEffect(() => {
    if (!venue && venues.length) setVenue(venues[0].name)
  }, [venues, venue])

  const price = useMemo(() => {
    if (selectedPackage) return selectedPackage.price
    const duration = selectedService?.durations.find((entry) => entry.minutes === minutes)
    return duration?.price ?? null
  }, [selectedPackage, selectedService, minutes])

  const durationLabel = selectedPackage
    ? selectedPackage.duration
    : minutes
      ? t('book.minutes', { minutes })
      : ''

  const draft = { service: serviceName, duration: durationLabel, venue, date, time, people, name, hotel, notes }

  const message = bookingMessage(draft, site.brandName, t)
  const link = whatsappLink(site, message)
  const ready = Boolean(name.trim() && serviceName)

  const todayIso = new Date().toISOString().slice(0, 10)

  async function handleSend() {
    if (!ready || sending) return
    setSending(true)
    setError(null)

    // Open the WhatsApp tab from the click gesture so mobile browsers allow it.
    const target = window.open(link, '_blank', 'noopener,noreferrer')

    try {
      await api.createBooking({ ...draft, contact: 'WhatsApp' })
      setSent(true)
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : t('book.error_save'))
    } finally {
      setSending(false)
      if (!target) window.location.href = link
    }
  }

  const fieldBase =
    'h-12 w-full rounded-2xl border border-ocean-900/12 bg-white/85 px-4 text-ocean-950 transition-colors focus:border-lagoon-400 focus:outline-none'
  const labelBase = 'mb-2 block text-[0.82rem] font-semibold text-ocean-800/70'

  return (
    <>
      <PageHeader
        kicker={t('book.kicker')}
        title={t('book.title')}
        script={t('book.script')}
        lead={t('book.lead')}
      />

      <Section className="py-14 sm:py-20">
        <Container>
          <div className="grid gap-8 lg:grid-cols-[1fr_22rem] lg:items-start">
            <div className="min-w-0 space-y-12">
              {/* ---------------------------------------------- treatment */}
              <Reveal>
                <StepLabel index={1}>{t('book.step_treatment')}</StepLabel>
                <div className="mt-5 grid gap-3 sm:grid-cols-2">
                  {services.map((service) => (
                    <OptionButton
                      key={service.id}
                      selected={serviceName === service.name}
                      onClick={() => setServiceName(service.name)}
                    >
                      <div className="flex items-start gap-3">
                        <span className="mt-0.5 grid size-9 shrink-0 place-items-center rounded-[46%_54%_48%_52%/52%_48%_52%_48%] bg-sky-100 text-sky-800">
                          <Motif name={service.icon} className="size-4.5" />
                        </span>
                        <span>
                          <span className="block font-semibold text-ocean-950">{service.name}</span>
                          <span className="mt-0.5 block text-[0.8rem] text-ocean-800/60">{service.tagline}</span>
                          <span className="mt-1.5 block text-[0.8rem] font-bold text-lagoon-700">
                            {t('book.from', {
                              price: formatPrice(service.durations[0]?.price ?? 0, currency),
                            })}
                          </span>
                        </span>
                      </div>
                    </OptionButton>
                  ))}
                </div>

                {packages.length > 0 && (
                  <>
                    <p className="mt-7 text-[0.7rem] font-bold tracking-[0.18em] text-lagoon-700 uppercase">
                      {t('book.or_package')}
                    </p>
                    <div className="mt-3 grid gap-3 sm:grid-cols-2">
                      {packages.map((item) => (
                        <OptionButton
                          key={item.id}
                          selected={serviceName === item.name}
                          onClick={() => setServiceName(item.name)}
                        >
                          <span className="block font-semibold text-ocean-950">{item.name}</span>
                          <span className="mt-0.5 block text-[0.8rem] text-ocean-800/60">{item.duration}</span>
                          <span className="mt-1.5 block text-[0.8rem] font-bold text-flamingo-600">
                            {formatPrice(item.price, currency)}
                          </span>
                        </OptionButton>
                      ))}
                    </div>
                  </>
                )}
              </Reveal>

              {/* ----------------------------------------------- duration */}
              {selectedService && (
                <Reveal>
                  <StepLabel index={2}>{t('book.step_duration')}</StepLabel>
                  <div className="mt-5 flex flex-wrap gap-3">
                    {selectedService.durations.map((duration) => (
                      <OptionButton
                        key={duration.minutes}
                        selected={minutes === duration.minutes}
                        onClick={() => setMinutes(duration.minutes)}
                        className="min-w-34 flex-1 sm:flex-none"
                      >
                        <span className="flex items-center gap-2 font-semibold text-ocean-950">
                          <Clock className="size-4 text-lagoon-600" />
                          {t('book.minutes', { minutes: duration.minutes })}
                        </span>
                        <span className="mt-1 block text-[0.85rem] font-bold text-lagoon-700">
                          {formatPrice(duration.price, currency)}
                        </span>
                      </OptionButton>
                    ))}
                  </div>
                </Reveal>
              )}

              {/* -------------------------------------------------- where */}
              <Reveal>
                <StepLabel index={selectedService ? 3 : 2}>{t('book.step_venue')}</StepLabel>
                <div className="mt-5 grid gap-3 sm:grid-cols-3">
                  {venues.map((option) => (
                    <OptionButton key={option.id} selected={venue === option.name} onClick={() => setVenue(option.name)}>
                      <span className="grid size-9 place-items-center rounded-[46%_54%_48%_52%/52%_48%_52%_48%] bg-sky-100 text-sky-800">
                        <Motif name={option.icon} className="size-4.5" />
                      </span>
                      <span className="mt-3 block font-semibold text-ocean-950">{option.name}</span>
                      <span className="mt-0.5 block text-[0.8rem] text-ocean-800/60">{option.subtitle}</span>
                    </OptionButton>
                  ))}
                </div>
                <p className="mt-4 text-[0.82rem] leading-relaxed text-ocean-800/60">{site.hotelSurcharge}</p>
              </Reveal>

              {/* --------------------------------------------------- when */}
              <Reveal>
                <StepLabel index={selectedService ? 4 : 3}>{t('book.step_when')}</StepLabel>
                <div className="mt-5 grid gap-4 sm:grid-cols-2">
                  <label className="block">
                    <span className="mb-2 flex items-center gap-2 text-[0.82rem] font-semibold text-ocean-800/70">
                      <CalendarDays className="size-4 text-lagoon-600" />
                      {t('book.date')}
                    </span>
                    <input
                      type="date"
                      value={date}
                      min={todayIso}
                      onChange={(event) => setDate(event.target.value)}
                      className={fieldBase}
                    />
                  </label>
                  <label className="block">
                    <span className="mb-2 flex items-center gap-2 text-[0.82rem] font-semibold text-ocean-800/70">
                      <Users className="size-4 text-lagoon-600" />
                      {t('book.people')}
                    </span>
                    <select
                      value={people}
                      onChange={(event) => setPeople(event.target.value)}
                      className={fieldBase}
                    >
                      {['1', '2', '3', '4', '5', '6+'].map((count) => (
                        <option key={count} value={count}>
                          {count}
                        </option>
                      ))}
                    </select>
                  </label>
                </div>

                <p className="mt-5 mb-2 text-[0.82rem] font-semibold text-ocean-800/70">{t('book.preferred_time')}</p>
                <div className="no-scrollbar -mx-5 flex gap-2 overflow-x-auto px-5 sm:mx-0 sm:flex-wrap sm:px-0">
                  {TIME_SLOTS.map((slot) => (
                    <button
                      key={slot}
                      type="button"
                      onClick={() => setTime(time === slot ? '' : slot)}
                      className={cn(
                        'shrink-0 rounded-full px-5 py-2.5 text-[0.85rem] font-semibold transition-all duration-300',
                        time === slot
                          ? 'bg-gradient-to-r from-sky-700 to-lagoon-600 text-sand-50 shadow-soft'
                          : 'border border-ocean-900/12 bg-white/50 text-ocean-800/70 hover:border-lagoon-400/60',
                      )}
                    >
                      {slot}
                    </button>
                  ))}
                </div>
              </Reveal>

              {/* -------------------------------------------------- details */}
              <Reveal>
                <StepLabel index={selectedService ? 5 : 4}>{t('book.step_details')}</StepLabel>
                <div className="mt-5 grid gap-4 sm:grid-cols-2">
                  <label className="block sm:col-span-2">
                    <span className={labelBase}>{t('book.name')}</span>
                    <input
                      value={name}
                      onChange={(event) => setName(event.target.value)}
                      placeholder={t('book.name_placeholder')}
                      className={cn(fieldBase, 'placeholder:text-ocean-800/35')}
                    />
                  </label>
                  <label className="block sm:col-span-2">
                    <span className={labelBase}>{t('book.hotel')}</span>
                    <input
                      value={hotel}
                      onChange={(event) => setHotel(event.target.value)}
                      placeholder={t('book.hotel_placeholder')}
                      className={cn(fieldBase, 'placeholder:text-ocean-800/35')}
                    />
                  </label>
                  <label className="block sm:col-span-2">
                    <span className={labelBase}>{t('book.notes')}</span>
                    <textarea
                      value={notes}
                      onChange={(event) => setNotes(event.target.value)}
                      rows={4}
                      placeholder={t('book.notes_placeholder')}
                      className="w-full rounded-2xl border border-ocean-900/12 bg-white/85 px-4 py-3 text-ocean-950 transition-colors placeholder:text-ocean-800/35 focus:border-lagoon-400 focus:outline-none"
                    />
                  </label>
                </div>
              </Reveal>
            </div>

            {/* ---------------------------------------------------- summary */}
            <div className="min-w-0 lg:sticky lg:top-24">
              <div className="rounded-5xl border border-white/70 bg-white/85 p-6 shadow-lift ring-1 ring-sky-900/5 backdrop-blur-sm">
                <p className="text-[0.7rem] font-bold tracking-[0.2em] text-lagoon-700 uppercase">
                  {t('book.summary')}
                </p>

                <dl className="mt-5 space-y-3 text-[0.9rem]">
                  {[
                    [t('book.summary_treatment'), serviceName || '—'],
                    [t('book.summary_duration'), durationLabel || '—'],
                    [t('book.summary_where'), venue || '—'],
                    [t('book.summary_date'), date || t('book.flexible')],
                    [t('book.summary_time'), time || t('book.flexible')],
                    [t('book.summary_people'), people],
                  ].map(([label, value]) => (
                    <div key={label} className="flex justify-between gap-4 border-b border-ocean-900/6 pb-2.5">
                      <dt className="text-ocean-800/55">{label}</dt>
                      <dd className="text-right font-semibold text-ocean-950">{value}</dd>
                    </div>
                  ))}
                </dl>

                {price !== null && (
                  <p className="mt-5 flex items-baseline justify-between">
                    <span className="text-[0.82rem] font-semibold text-ocean-800/55">{t('book.estimated')}</span>
                    <span className="font-display text-3xl text-flamingo-600">{formatPrice(price, currency)}</span>
                  </p>
                )}

                <button
                  type="button"
                  onClick={handleSend}
                  disabled={!ready || sending}
                  className={cn(
                    'mt-6 inline-flex h-14 w-full items-center justify-center gap-2.5 rounded-full text-[0.98rem] font-bold transition-all duration-300',
                    ready
                      ? 'bg-[#25D366] text-[#062e17] shadow-soft hover:scale-[1.02]'
                      : 'cursor-not-allowed bg-sand-200 text-ocean-800/40',
                  )}
                >
                  {sending ? (
                    <Loader2 className="size-5 animate-spin" />
                  ) : (
                    <MessageCircle className="size-5" strokeWidth={2.4} />
                  )}
                  {sending ? t('book.sending') : t('book.send')}
                </button>

                {!ready && (
                  <p className="mt-3 text-center text-[0.78rem] text-ocean-800/50">{t('book.not_ready')}</p>
                )}
                {sent && (
                  <p className="mt-3 rounded-2xl bg-seafoam-50 p-3 text-center text-[0.82rem] font-semibold text-lagoon-700">
                    {t('book.sent')}
                  </p>
                )}
                {error && (
                  <p className="mt-3 rounded-2xl bg-coral-100 p-3 text-center text-[0.82rem] text-coral-600">
                    {error} {t('book.error_suffix')}
                  </p>
                )}

                <details className="mt-5 rounded-2xl bg-sky-50 p-4 ring-1 ring-sky-200/60">
                  <summary className="cursor-pointer text-[0.8rem] font-semibold text-ocean-800/70">
                    {t('book.preview')}
                  </summary>
                  <pre className="mt-3 text-[0.76rem] leading-relaxed whitespace-pre-wrap text-ocean-800/70">
                    {message}
                  </pre>
                </details>

                <p className="mt-5 text-[0.76rem] leading-relaxed text-ocean-800/50">{site.cancellationPolicy}</p>
              </div>
            </div>
          </div>
        </Container>
      </Section>

      <PaymentsSection id="payment" />
      <FaqSection />
    </>
  )
}
