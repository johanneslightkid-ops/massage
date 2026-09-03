import { Link } from 'react-router-dom'
import { Clock, Footprints, MapPin, Quote } from 'lucide-react'
import type { DiscoverSpot, MassageJourney, Package, Service, Testimonial, Therapist } from '@shared/types'
import { journeysForService } from '@shared/matcher'
import { cn, formatPrice } from '@/lib/utils'
import { useT } from '@/lib/translations/LanguageProvider'
import { spotCategoryKey, spotCategoryTone } from '@/lib/taxonomy'
import { Motif } from '@/components/art/Motif'
import { SceneImage } from '@/components/art/Decor'
import { Card, Pill, Stars, Tick } from '@/components/ui/Bits'
import type { PillTone } from '@/components/ui/Bits'

/* ------------------------------------------------------------- treatments */

export function ServiceCard({
  service,
  currency,
  onBook,
  compact = false,
  journeys = [],
}: {
  service: Service
  currency: string
  onBook?: (service: Service) => void
  compact?: boolean
  /** Used to show what this treatment is *for*, in the guest's own terms. */
  journeys?: MassageJourney[]
}) {
  const t = useT()
  const cheapest = service.durations?.[0]

  /*
   * What this treatment is for, how firm it is and where it can happen are all
   * already known — by the journeys that deliver it. Deriving them here means
   * the owner never writes the same thing twice, and a card can lead with the
   * human purpose while still naming the modality above it.
   */
  const uses = journeysForService(service.id, journeys)
  const intensities = [...new Set(uses.map((journey) => journey.intensity))]
  const venueTags = [...new Set(uses.flatMap((journey) => journey.venueTags ?? []))]

  return (
    <Card as="article" className="lift-hover group flex h-full flex-col hover:border-lagoon-300">
      <div className="relative aspect-16/10 overflow-hidden">
        <SceneImage
          src={service.image}
          seed={service.id}
          alt={service.name}
          className="transition-transform duration-700 ease-[cubic-bezier(.22,1,.36,1)] group-hover:scale-105"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-ocean-950/85 via-ocean-950/25 to-transparent" />

        <span className="absolute top-4 left-4 grid size-10 place-items-center rounded-[46%_54%_48%_52%/52%_48%_52%_48%] bg-white/94 text-lagoon-800 shadow-soft backdrop-blur-sm transition-transform duration-500 group-hover:-rotate-6 group-hover:scale-110">
          <Motif name={service.icon} className="size-5" />
        </span>

        {service.popular && (
          <span className="absolute top-4 right-4 rounded-full bg-gradient-to-r from-flamingo-500 to-coral-500 px-3 py-1 text-[0.66rem] font-bold tracking-wide text-white uppercase shadow-soft">
            {t('card.popular')}
          </span>
        )}

        <div className="absolute right-4 bottom-4 left-4 flex items-end justify-between gap-3">
          <h3 className="font-display text-[1.35rem] leading-tight text-sand-50">{service.name}</h3>
          {cheapest && (
            <span className="shrink-0 rounded-full bg-sand-50/94 px-3 py-1 text-[0.8rem] font-bold text-ocean-950 backdrop-blur-sm">
              {t('card.from', { price: formatPrice(cheapest.price, currency) })}
            </span>
          )}
        </div>
      </div>

      <div className="flex flex-1 flex-col p-6">
        <p className="text-[0.78rem] font-bold tracking-[0.12em] text-lagoon-800 uppercase">{service.category}</p>
        <p className="mt-2 text-[0.98rem] leading-relaxed text-ocean-800/80">
          {compact ? service.tagline : service.description}
        </p>

        {/* Human purpose, straight after the description and before the technique. */}
        {uses.length > 0 && (
          <div className="mt-5">
            <p className="text-[0.7rem] font-bold tracking-[0.16em] text-lagoon-800 uppercase">
              {t('card.good_for')}
            </p>
            <div className="mt-2.5 flex flex-wrap gap-1.5">
              {uses.slice(0, compact ? 2 : 4).map((journey) => (
                <Link
                  key={journey.id}
                  to={`/find-your-massage?m=${journey.guestTags?.[0] ?? 'unsure'}`}
                  className="rounded-full bg-seafoam-100 px-3 py-1.5 text-[0.78rem] font-semibold text-lagoon-800 transition-all duration-300 hover:-translate-y-0.5 hover:bg-palm-100 hover:text-palm-800"
                >
                  {journey.name}
                </Link>
              ))}
            </div>
          </div>
        )}

        {!compact && (intensities.length > 0 || venueTags.length > 0) && (
          <dl className="mt-4 flex flex-wrap gap-x-5 gap-y-2 text-[0.82rem]">
            {intensities.length > 0 && (
              <div className="flex items-center gap-1.5">
                <dt className="text-ocean-800/85">{t('card.pressure')}</dt>
                <dd className="font-semibold text-ocean-950">
                  {intensities.map((level) => t(`find.feel.${level}`)).join(' · ')}
                </dd>
              </div>
            )}
            {venueTags.length > 0 && (
              <div className="flex items-center gap-1.5">
                <dt className="text-ocean-800/85">{t('find.where')}</dt>
                <dd className="font-semibold text-ocean-950">
                  {venueTags.map((tag) => t(`find.venue.${tag}`)).join(' · ')}
                </dd>
              </div>
            )}
          </dl>
        )}

        {!compact && service.benefits?.length > 0 && (
          <ul className="mt-5 space-y-2">
            {service.benefits.map((benefit) => (
              <li key={benefit} className="flex items-start gap-2.5 text-[0.9rem] text-ocean-800/85">
                <Tick className="mt-0.5 text-palm-500" />
                {benefit}
              </li>
            ))}
          </ul>
        )}

        <div className="mt-6 flex flex-wrap gap-2">
          {service.durations?.map((duration) => (
            <span
              key={duration.minutes}
              className="inline-flex items-center gap-1.5 rounded-full bg-sky-50 px-3 py-1.5 text-[0.8rem] font-semibold text-sky-800 ring-1 ring-sky-200/70"
            >
              <Clock className="size-3.5 text-lagoon-600" />
              {t('book.minutes', { minutes: duration.minutes })}
              <span className="text-ocean-950">· {formatPrice(duration.price, currency)}</span>
            </span>
          ))}
        </div>

        <div className="mt-auto pt-6">
          {onBook ? (
            <button
              type="button"
              onClick={() => onBook(service)}
              className="inline-flex h-11 w-full items-center justify-center rounded-full bg-gradient-to-r from-sky-700 to-lagoon-600 text-[0.9rem] font-semibold text-sand-50 transition-all hover:brightness-110"
            >
              {t('card.reserve')}
            </button>
          ) : (
            <Link
              to={`/book?service=${encodeURIComponent(service.name)}`}
              className="inline-flex h-11 w-full items-center justify-center rounded-full bg-gradient-to-r from-sky-700 to-lagoon-600 text-[0.9rem] font-semibold text-sand-50 transition-all hover:brightness-110"
            >
              {t('card.reserve')}
            </Link>
          )}
        </div>
      </div>
    </Card>
  )
}

/* ------------------------------------------------------------------- team */

const accents: Record<string, string> = {
  ocean: 'from-sky-800 to-lagoon-600',
  coral: 'from-flamingo-500 to-sun-400',
  palm: 'from-palm-700 to-lagoon-400',
  sun: 'from-sun-500 to-flamingo-400',
  seafoam: 'from-lagoon-500 to-seafoam-300',
}

export function TherapistCard({ person }: { person: Therapist }) {
  const t = useT()

  return (
    <Card as="article" className="lift-hover group flex h-full flex-col hover:border-lagoon-300">
      <div className="relative aspect-4/5 overflow-hidden">
        {person.photo ? (
          <img
            src={person.photo}
            alt={person.name}
            loading="lazy"
            className="size-full object-cover transition-transform duration-700 group-hover:scale-105"
          />
        ) : (
          <div className={cn('grid size-full place-items-center bg-gradient-to-br', accents[person.accent] ?? accents.ocean)}>
            <span className="font-display text-[4.5rem] leading-none text-sand-50/90">{person.name.charAt(0)}</span>
          </div>
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-ocean-950/78 via-ocean-950/10 to-transparent" />
        <div className="absolute right-5 bottom-5 left-5">
          <h3 className="font-display text-2xl text-sand-50">{person.name}</h3>
          <p className="mt-1 text-[0.82rem] font-semibold text-white/90">{person.role}</p>
        </div>
        <span className="absolute top-4 right-4 rounded-full bg-sand-50/92 px-3 py-1 text-[0.68rem] font-bold text-ocean-950 backdrop-blur-sm">
          {person.years}
        </span>
      </div>

      <div className="flex flex-1 flex-col p-6">
        <p className="text-[0.94rem] leading-relaxed text-ocean-800/80">{person.bio}</p>

        <div className="mt-5 flex flex-wrap gap-1.5">
          {person.specialties.map((item) => (
            <Pill key={item} tone="lagoon">
              {item}
            </Pill>
          ))}
        </div>

        <p className="mt-auto pt-5 text-[0.78rem] font-medium text-ocean-800/85">
          {t('team.speaks', { languages: person.languages.join(' · ') })}
        </p>
      </div>
    </Card>
  )
}

/* --------------------------------------------------------------- discover */

export function SpotCard({ spot }: { spot: DiscoverSpot }) {
  const t = useT()
  const key = spotCategoryKey(spot.category)
  const tone: PillTone = key ? spotCategoryTone[key] : 'sand'

  return (
    <Card as="article" className="lift-hover group flex h-full flex-col hover:border-lagoon-300">
      <div className="relative aspect-16/9 overflow-hidden">
        <SceneImage
          src={spot.image}
          seed={spot.id}
          alt={spot.name}
          className="transition-transform duration-700 group-hover:scale-105"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-ocean-950/68 to-transparent" />
        <div className="absolute top-3 left-3">
          <Pill tone={tone} className="shadow-soft">
            {spot.category}
          </Pill>
        </div>
        <h3 className="absolute right-4 bottom-3 left-4 font-display text-xl leading-tight text-sand-50">
          {spot.name}
        </h3>
      </div>

      <div className="flex flex-1 flex-col p-5">
        <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-[0.76rem] font-semibold text-ocean-800/85">
          {spot.walkMinutes > 0 && (
            <span className="inline-flex items-center gap-1.5">
              <Footprints className="size-3.5 text-lagoon-600" />
              {t('card.walk', { minutes: spot.walkMinutes })}
            </span>
          )}
          {spot.priceLevel && spot.priceLevel !== '—' && <span>{spot.priceLevel}</span>}
        </div>

        <p className="mt-3 text-[0.93rem] leading-relaxed text-ocean-800/80">{spot.blurb}</p>

        {spot.tip && (
          <p className="mt-4 rounded-[1.5rem] bg-gradient-to-br from-seafoam-50 to-sky-50 p-4 text-[0.86rem] leading-relaxed text-ocean-800 ring-1 ring-sky-200/60">
            <span className="font-bold text-lagoon-800">{t('card.tip')}</span>
            {spot.tip}
          </p>
        )}

        <div className="mt-auto flex items-center justify-between gap-3 pt-5">
          <div className="flex flex-wrap gap-1.5">
            {spot.tags.slice(0, 2).map((tag) => (
              <span
                key={tag}
                className="rounded-full bg-sand-200/70 px-2.5 py-1 text-[0.68rem] font-semibold text-ocean-900"
              >
                {tag}
              </span>
            ))}
          </div>
          {spot.mapUrl && (
            <a
              href={spot.mapUrl}
              target="_blank"
              rel="noreferrer noopener"
              className="inline-flex shrink-0 items-center gap-1.5 text-[0.8rem] font-bold text-lagoon-800 hover:text-lagoon-600"
            >
              <MapPin className="size-3.5" />
              {t('card.map')}
            </a>
          )}
        </div>
      </div>
    </Card>
  )
}

/* ----------------------------------------------------------- testimonials */

export function TestimonialCard({ review }: { review: Testimonial }) {
  return (
    <figure className="lift-hover flex h-full flex-col rounded-5xl border border-white/80 bg-white/85 p-7 shadow-soft ring-1 ring-lagoon-200/50 backdrop-blur-sm">
      <Quote className="size-7 text-flamingo-400" strokeWidth={1.6} />
      <blockquote className="mt-4 flex-1 text-[1rem] leading-relaxed text-ocean-900">“{review.quote}”</blockquote>
      <figcaption className="mt-6 border-t border-ocean-900/10 pt-5">
        <Stars count={review.rating} className="mb-3" />
        <p className="font-display text-lg text-ocean-950">{review.name}</p>
        <p className="text-[0.8rem] text-ocean-800/85">
          {review.country}
          {review.service && ` · ${review.service}`}
        </p>
      </figcaption>
    </figure>
  )
}

/* --------------------------------------------------------------- packages */

export function PackageCard({ item, currency }: { item: Package; currency: string }) {
  const t = useT()

  return (
    <Card as="article" className="flex h-full flex-col bg-white/82 p-7 hover:-translate-y-1.5 hover:shadow-lift">
      <div className="flex items-start justify-between gap-3">
        <div>
          {item.badge && <Pill tone="flamingo">{item.badge}</Pill>}
          <h3 className="mt-3 font-display text-2xl text-ocean-950">{item.name}</h3>
          <p className="mt-1 text-[0.8rem] font-semibold tracking-wide text-lagoon-800">{item.duration}</p>
        </div>
        <p className="shrink-0 font-display text-3xl text-flamingo-700">{formatPrice(item.price, currency)}</p>
      </div>

      <p className="mt-4 text-[0.95rem] leading-relaxed text-ocean-800/80">{item.description}</p>

      <ul className="mt-5 space-y-2">
        {item.includes.map((line) => (
          <li key={line} className="flex items-start gap-2.5 text-[0.9rem] text-ocean-800/85">
            <Tick className="mt-0.5 text-palm-500" />
            {line}
          </li>
        ))}
      </ul>

      <div className="mt-auto pt-7">
        <Link
          to={`/book?service=${encodeURIComponent(item.name)}`}
          className="inline-flex h-12 w-full items-center justify-center rounded-full bg-gradient-to-r from-flamingo-500 to-coral-500 text-[0.92rem] font-bold text-white shadow-soft transition-all hover:shadow-pink hover:brightness-105"
        >
          {t('card.reserve_package')}
        </Link>
      </div>
    </Card>
  )
}
