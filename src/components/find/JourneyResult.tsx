import { Link } from 'react-router-dom'
import { ArrowRight, Check, Clock, MapPin, Sparkles } from 'lucide-react'
import type { MassageJourney, Service, Venue } from '@shared/types'
import type { GuestAnswers, JourneyMatch } from '@shared/matcher'
import { leadService, offeredDurations } from '@shared/matcher'
import { venueTagFromName } from '@shared/journey-tags'
import { useT, useLanguage } from '@/lib/translations/LanguageProvider'
import { localeTag } from '@/lib/translations'
import { reasonSentence } from '@/lib/journey-ui'
import { cn, formatPrice } from '@/lib/utils'
import { Motif } from '@/components/art/Motif'

/**
 * Builds the link into the existing booking flow with the choices already made.
 *
 * Only what the guest picked about the *massage* travels: treatment, length and
 * place. The comfort-check answers deliberately do not — they are not part of a
 * booking, they are not the studio's business unless the guest chooses to
 * mention them, and putting them in a URL would write them into browser history
 * and any shared link.
 */
export function bookingHref(
  journey: MassageJourney,
  service: Service | undefined,
  minutes: number | undefined,
  venueName: string | undefined,
): string {
  const params = new URLSearchParams()
  if (service) params.set('service', service.name)
  if (minutes) params.set('minutes', String(minutes))
  if (venueName) params.set('venue', venueName)
  // Non-sensitive context, so the studio knows which suggestion led here.
  params.set('journey', journey.slug)
  return `/book?${params.toString()}`
}

export function JourneyResult({
  match,
  answers,
  services,
  venues,
  currency,
  venueName,
  primary = true,
}: {
  match: JourneyMatch
  answers: GuestAnswers
  services: Service[]
  venues: Venue[]
  currency: string
  venueName?: string
  primary?: boolean
}) {
  const t = useT()
  const { language } = useLanguage()
  const journey = match.journey

  const service = leadService(journey, services)
  const durations = offeredDurations(journey, services)
  const because = reasonSentence(match, answers, localeTag(language), t)

  const price = service?.durations.find((d) => d.minutes === durations[0])?.price

  /*
   * Show the studio's own words for the places this journey works, not our
   * canonical tags — the owner renames venues and the card should follow.
   * Falls back to the tag's dictionary label if a venue record was deleted.
   */
  const whereLabels = journey.venueTags.map((tag) => {
    const venue = venues.find((candidate) => venueTagFromName(candidate.name) === tag)
    return venue?.name ?? t(`find.venue.${tag}`)
  })

  return (
    <article
      className={cn(
        'relative overflow-hidden rounded-[2.25rem] border bg-white/85 backdrop-blur-sm',
        primary ? 'border-white/70 p-6 shadow-lift ring-1 ring-sky-900/5 sm:p-8' : 'border-ocean-900/10 p-5 shadow-soft',
      )}
    >
      {journey.badge && (
        <span className="mb-3 inline-flex items-center gap-1.5 rounded-full bg-gradient-to-r from-flamingo-600 to-coral-500 px-3.5 py-1.5 text-[0.7rem] font-bold tracking-[0.12em] text-white uppercase">
          <Sparkles className="size-3" />
          {journey.badge}
        </span>
      )}

      <h3 className={cn('font-display text-ocean-950', primary ? 'text-[1.85rem] sm:text-[2.35rem]' : 'text-[1.35rem]')}>
        {journey.name}
      </h3>
      <p className="mt-1.5 script text-[1.05rem] text-lagoon-800">{journey.tagline}</p>

      {because && primary && (
        <p className="mt-5 rounded-[1.4rem] bg-gradient-to-br from-seafoam-50 to-sky-50 p-4 text-[0.95rem] leading-relaxed text-ocean-900">
          {because}
        </p>
      )}

      <p className="mt-4 leading-relaxed text-ocean-800/85">{journey.description}</p>

      {primary && journey.whyItFits.length > 0 && (
        <section className="mt-6">
          <h4 className="text-[0.7rem] font-bold tracking-[0.2em] text-lagoon-800 uppercase">{t('find.why')}</h4>
          <ul className="mt-3 space-y-2">
            {journey.whyItFits.map((reason) => (
              <li key={reason} className="flex gap-2.5 text-[0.92rem] leading-relaxed text-ocean-800/80">
                <Check className="mt-1 size-4 shrink-0 text-palm-600" strokeWidth={2.6} />
                {reason}
              </li>
            ))}
          </ul>
        </section>
      )}

      {primary && journey.whatToExpect.length > 0 && (
        <section className="mt-6">
          <h4 className="text-[0.7rem] font-bold tracking-[0.2em] text-lagoon-800 uppercase">{t('find.what')}</h4>
          <ul className="mt-3 space-y-2">
            {journey.whatToExpect.map((step) => (
              <li key={step} className="flex gap-2.5 text-[0.92rem] leading-relaxed text-ocean-800/80">
                <span aria-hidden className="mt-2 size-1.5 shrink-0 rounded-full bg-lagoon-400" />
                {step}
              </li>
            ))}
          </ul>
        </section>
      )}

      {/* The professional name, kept below the human explanation rather than above it. */}
      {service && (
        <p className="mt-6 flex flex-wrap items-center gap-x-2 gap-y-1 text-[0.85rem] text-ocean-800/85">
          <Motif name={service.icon} className="size-4 text-lagoon-600" />
          {t('find.based_on', { service: service.name })}
          {price !== undefined && (
            <span className="font-bold text-lagoon-800">{t('find.from', { price: formatPrice(price, currency) })}</span>
          )}
        </p>
      )}

      <dl className="mt-5 flex flex-wrap gap-x-6 gap-y-3 text-[0.85rem]">
        {durations.length > 0 && (
          <div className="flex items-center gap-2">
            <dt className="sr-only">{t('find.duration')}</dt>
            <Clock className="size-4 text-lagoon-600" aria-hidden />
            <dd className="font-semibold text-ocean-950">
              {durations.map((minutes) => t('find.minutes', { minutes })).join(' · ')}
            </dd>
          </div>
        )}
        {whereLabels.length > 0 && (
          <div className="flex items-center gap-2">
            <dt className="sr-only">{t('find.where')}</dt>
            <MapPin className="size-4 text-lagoon-600" aria-hidden />
            <dd className="font-semibold text-ocean-950">{whereLabels.join(' · ')}</dd>
          </div>
        )}
      </dl>

      <Link
        to={bookingHref(journey, service, durations[0], venueName)}
        className={cn(
          'mt-6 inline-flex w-full items-center justify-center gap-2 rounded-full font-bold text-sand-50 shadow-soft transition-all duration-300 hover:brightness-110',
          primary
            ? 'h-14 bg-gradient-to-r from-sky-700 to-lagoon-600 text-[1rem]'
            : 'h-12 bg-gradient-to-r from-lagoon-600 to-palm-500 text-[0.9rem]',
        )}
      >
        {t('find.cta_book')}
        <ArrowRight className="size-4" />
      </Link>
    </article>
  )
}
