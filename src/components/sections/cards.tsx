import { Link } from 'react-router-dom'
import { Clock, Footprints, MapPin, Quote } from 'lucide-react'
import type { DiscoverSpot, Package, Service, Testimonial, Therapist } from '@shared/types'
import { cn, formatPrice } from '@/lib/utils'
import { Motif } from '@/components/art/Motif'
import { SceneImage } from '@/components/art/Decor'
import { Card, Pill, Stars, Tick } from '@/components/ui/Bits'

/* ------------------------------------------------------------- treatments */

export function ServiceCard({
  service,
  currency,
  onBook,
  compact = false,
}: {
  service: Service
  currency: string
  onBook?: (service: Service) => void
  compact?: boolean
}) {
  const cheapest = service.durations?.[0]

  return (
    <Card as="article" className="flex h-full flex-col hover:-translate-y-1 hover:shadow-lift">
      <div className="relative aspect-[16/10] overflow-hidden">
        <SceneImage
          src={service.image}
          seed={service.id}
          alt={service.name}
          className="transition-transform duration-700 ease-[cubic-bezier(.22,1,.36,1)] group-hover:scale-105"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-ocean-950/70 via-transparent to-transparent" />

        <span className="absolute top-4 left-4 grid size-10 place-items-center rounded-2xl bg-sand-50/90 text-ocean-800 backdrop-blur-sm">
          <Motif name={service.icon} className="size-5" />
        </span>

        {service.popular && (
          <span className="absolute top-4 right-4 rounded-full bg-coral-500 px-3 py-1 text-[0.66rem] font-bold tracking-wide text-white uppercase">
            Popular
          </span>
        )}

        <div className="absolute right-4 bottom-4 left-4 flex items-end justify-between gap-3">
          <h3 className="font-display text-[1.35rem] leading-tight text-sand-50">{service.name}</h3>
          {cheapest && (
            <span className="shrink-0 rounded-full bg-sand-50/92 px-3 py-1 text-[0.8rem] font-bold text-ocean-900 backdrop-blur-sm">
              from {formatPrice(cheapest.price, currency)}
            </span>
          )}
        </div>
      </div>

      <div className="flex flex-1 flex-col p-6">
        <p className="text-[0.78rem] font-bold tracking-[0.12em] text-lagoon-600 uppercase">{service.category}</p>
        <p className="mt-2 text-[0.98rem] leading-relaxed text-ocean-800/80">
          {compact ? service.tagline : service.description}
        </p>

        {!compact && service.benefits?.length > 0 && (
          <ul className="mt-5 space-y-2">
            {service.benefits.map((benefit) => (
              <li key={benefit} className="flex items-start gap-2.5 text-[0.9rem] text-ocean-800/85">
                <Tick className="mt-0.5 text-lagoon-500" />
                {benefit}
              </li>
            ))}
          </ul>
        )}

        <div className="mt-6 flex flex-wrap gap-2">
          {service.durations?.map((duration) => (
            <span
              key={duration.minutes}
              className="inline-flex items-center gap-1.5 rounded-full bg-sand-100 px-3 py-1.5 text-[0.8rem] font-semibold text-ocean-800"
            >
              <Clock className="size-3.5 text-lagoon-600" />
              {duration.minutes} min
              <span className="text-ocean-900">· {formatPrice(duration.price, currency)}</span>
            </span>
          ))}
        </div>

        <div className="mt-auto pt-6">
          {onBook ? (
            <button
              type="button"
              onClick={() => onBook(service)}
              className="inline-flex h-11 w-full items-center justify-center rounded-full bg-ocean-900 text-[0.9rem] font-semibold text-sand-50 transition-colors hover:bg-ocean-800"
            >
              Reserve this
            </button>
          ) : (
            <Link
              to={`/book?service=${encodeURIComponent(service.name)}`}
              className="inline-flex h-11 w-full items-center justify-center rounded-full bg-ocean-900 text-[0.9rem] font-semibold text-sand-50 transition-colors hover:bg-ocean-800"
            >
              Reserve this
            </Link>
          )}
        </div>
      </div>
    </Card>
  )
}

/* ------------------------------------------------------------------- team */

const accents: Record<string, string> = {
  ocean: 'from-ocean-800 to-lagoon-600',
  coral: 'from-coral-500 to-sun-400',
  palm: 'from-palm-700 to-lagoon-400',
  sun: 'from-sun-500 to-coral-400',
  seafoam: 'from-lagoon-500 to-seafoam-300',
}

export function TherapistCard({ person }: { person: Therapist }) {
  return (
    <Card as="article" className="flex h-full flex-col hover:-translate-y-1 hover:shadow-lift">
      <div className="relative aspect-[4/5] overflow-hidden">
        {person.photo ? (
          <img
            src={person.photo}
            alt={person.name}
            loading="lazy"
            className="size-full object-cover transition-transform duration-700 group-hover:scale-105"
          />
        ) : (
          <div
            className={cn(
              'grid size-full place-items-center bg-gradient-to-br',
              accents[person.accent] ?? accents.ocean,
            )}
          >
            <span className="font-display text-[4.5rem] leading-none text-sand-50/90">
              {person.name.charAt(0)}
            </span>
          </div>
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-ocean-950/75 via-ocean-950/10 to-transparent" />
        <div className="absolute right-5 bottom-5 left-5">
          <h3 className="font-display text-2xl text-sand-50">{person.name}</h3>
          <p className="mt-1 text-[0.82rem] font-semibold text-seafoam-200">{person.role}</p>
        </div>
        <span className="absolute top-4 right-4 rounded-full bg-sand-50/90 px-3 py-1 text-[0.68rem] font-bold text-ocean-900">
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

        <p className="mt-auto pt-5 text-[0.78rem] font-medium text-ocean-800/55">
          Speaks {person.languages.join(' · ')}
        </p>
      </div>
    </Card>
  )
}

/* --------------------------------------------------------------- discover */

const categoryTone: Record<string, 'sand' | 'lagoon' | 'coral' | 'sun' | 'ocean'> = {
  Beach: 'lagoon',
  'Eat & Drink': 'coral',
  Nightlife: 'ocean',
  Excursion: 'sun',
  Shopping: 'sand',
  Essentials: 'ocean',
  'Getting around': 'sand',
}

export function SpotCard({ spot }: { spot: DiscoverSpot }) {
  return (
    <Card as="article" className="flex h-full flex-col hover:-translate-y-1 hover:shadow-lift">
      <div className="relative aspect-[16/9] overflow-hidden">
        <SceneImage
          src={spot.image}
          seed={spot.id}
          alt={spot.name}
          className="transition-transform duration-700 group-hover:scale-105"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-ocean-950/65 to-transparent" />
        <div className="absolute top-3 left-3">
          <Pill tone={categoryTone[spot.category] ?? 'sand'} className="shadow-soft">
            {spot.category}
          </Pill>
        </div>
        <h3 className="absolute right-4 bottom-3 left-4 font-display text-xl leading-tight text-sand-50">
          {spot.name}
        </h3>
      </div>

      <div className="flex flex-1 flex-col p-5">
        <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-[0.76rem] font-semibold text-ocean-800/60">
          {spot.walkMinutes > 0 && (
            <span className="inline-flex items-center gap-1.5">
              <Footprints className="size-3.5 text-lagoon-600" />
              {spot.walkMinutes} min walk
            </span>
          )}
          {spot.priceLevel && spot.priceLevel !== '—' && <span>{spot.priceLevel}</span>}
        </div>

        <p className="mt-3 text-[0.93rem] leading-relaxed text-ocean-800/80">{spot.blurb}</p>

        {spot.tip && (
          <p className="mt-4 rounded-2xl bg-seafoam-50 p-4 text-[0.86rem] leading-relaxed text-ocean-800">
            <span className="font-bold text-lagoon-600">Our tip · </span>
            {spot.tip}
          </p>
        )}

        <div className="mt-auto flex items-center justify-between gap-3 pt-5">
          <div className="flex flex-wrap gap-1.5">
            {spot.tags.slice(0, 2).map((tag) => (
              <span key={tag} className="rounded-full bg-sand-100 px-2.5 py-1 text-[0.68rem] font-semibold text-ocean-800/70">
                {tag}
              </span>
            ))}
          </div>
          {spot.mapUrl && (
            <a
              href={spot.mapUrl}
              target="_blank"
              rel="noreferrer noopener"
              className="inline-flex shrink-0 items-center gap-1.5 text-[0.8rem] font-bold text-lagoon-600 hover:text-lagoon-500"
            >
              <MapPin className="size-3.5" />
              Map
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
    <figure className="flex h-full flex-col rounded-4xl border border-white/10 bg-white/5 p-7 backdrop-blur-sm">
      <Quote className="size-7 text-sun-400/70" strokeWidth={1.6} />
      <blockquote className="mt-4 flex-1 text-[1rem] leading-relaxed text-sand-100/90">
        “{review.quote}”
      </blockquote>
      <figcaption className="mt-6 border-t border-white/10 pt-5">
        <Stars count={review.rating} className="mb-3" />
        <p className="font-display text-lg text-sand-50">{review.name}</p>
        <p className="text-[0.8rem] text-sand-200/60">
          {review.country}
          {review.service && ` · ${review.service}`}
        </p>
      </figcaption>
    </figure>
  )
}

/* --------------------------------------------------------------- packages */

export function PackageCard({ item, currency }: { item: Package; currency: string }) {
  return (
    <Card as="article" className="flex h-full flex-col bg-white/80 p-7 hover:-translate-y-1 hover:shadow-lift">
      <div className="flex items-start justify-between gap-3">
        <div>
          {item.badge && <Pill tone="coral">{item.badge}</Pill>}
          <h3 className="mt-3 font-display text-2xl text-ocean-900">{item.name}</h3>
          <p className="mt-1 text-[0.8rem] font-semibold tracking-wide text-lagoon-600">{item.duration}</p>
        </div>
        <p className="shrink-0 font-display text-3xl text-coral-500">{formatPrice(item.price, currency)}</p>
      </div>

      <p className="mt-4 text-[0.95rem] leading-relaxed text-ocean-800/80">{item.description}</p>

      <ul className="mt-5 space-y-2">
        {item.includes.map((line) => (
          <li key={line} className="flex items-start gap-2.5 text-[0.9rem] text-ocean-800/85">
            <Tick className="mt-0.5 text-lagoon-500" />
            {line}
          </li>
        ))}
      </ul>

      <div className="mt-auto pt-7">
        <Link
          to={`/book?service=${encodeURIComponent(item.name)}`}
          className="inline-flex h-12 w-full items-center justify-center rounded-full bg-coral-500 text-[0.92rem] font-bold text-white transition-colors hover:bg-coral-600"
        >
          Reserve this package
        </Link>
      </div>
    </Card>
  )
}
