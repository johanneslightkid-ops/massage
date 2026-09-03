/**
 * Content model shared by the React front end and the Cloudflare Functions.
 * Every collection here is editable from /admin, so keep the shapes flat and
 * describable — `shared/schema.ts` turns each one into an admin form.
 */

import type {
  AvoidTag,
  FocusTag,
  IntensityTag,
  OccasionTag,
  MomentTag,
  TimingTag,
  VenueTag,
} from './journey-tags'

export interface Hours {
  label: string
  value: string
}

export interface SiteSettings {
  brandName: string
  brandMark: string
  tagline: string
  heroKicker: string
  heroTitle: string
  heroHighlight: string
  heroSubtitle: string
  heroImage: string
  heroCtaPrimary: string
  heroCtaSecondary: string

  ownerName: string
  ownerRole: string
  ownerQuote: string
  ownerStory: string
  ownerPhoto: string

  whatsapp: string
  whatsappGreeting: string
  phoneDisplay: string
  email: string

  addressLine: string
  neighborhood: string
  city: string
  mapUrl: string
  mapEmbedUrl: string

  hours: Hours[]
  languages: string[]

  instagram: string
  facebook: string
  tiktok: string

  announcementEnabled: boolean
  announcementText: string

  currency: string
  travelNote: string
  setupNote: string
  cancellationPolicy: string
}

export interface Duration {
  minutes: number
  price: number
}

export interface Service {
  id: string
  name: string
  slug: string
  tagline: string
  description: string
  benefits: string[]
  durations: Duration[]
  category: string
  icon: string
  image: string
  featured: boolean
  popular: boolean
  order: number
}

/**
 * A Journey is the concierge layer: a *situation* a guest recognises, mapped
 * onto the professional treatments that suit it.
 *
 * The three content layers stay deliberately distinct, and the words are not
 * interchangeable:
 *
 *   Service  a professional modality — "Deep Tissue & Sports"
 *   Journey  a moment on holiday     — "After Adventure Recovery"
 *   Package  a commercial bundle     — "The Whole Week", with a price
 *
 * A guest who already knows they want deep tissue goes straight to Treatments.
 * A guest who only knows their legs ache after an ATV tour gets a Journey. The
 * Journey then names the real modality, so nobody has to learn massage
 * vocabulary before they can choose.
 *
 * Prose fields are per-language (one KV document each). Tag fields are
 * canonical keys shared by both — see `shared/journey-tags.ts` for why.
 */
export interface MassageJourney {
  id: string
  slug: string

  name: string
  tagline: string
  description: string

  /** Service ids this journey is actually delivered as. First one leads. */
  recommendedServiceIds: string[]
  /** Equally good substitutes, offered as "show me another option". */
  alternativeServiceIds: string[]

  /** Which "what kind of day" answers this journey speaks to. */
  guestTags: MomentTag[]
  occasionTags: OccasionTag[]
  timingTags: TimingTag[]
  /** Where it can actually be delivered. Empty means anywhere. */
  venueTags: VenueTag[]
  focusTags: FocusTag[]

  intensity: IntensityTag
  /** Offered lengths, in minutes — must exist on the recommended service. */
  durationMinutes: number[]

  /** Guest-facing reasons, written as a person would say them out loud. */
  whyItFits: string[]
  /** What the therapist will actually do, in plain language. */
  whatToExpect: string[]

  /**
   * Capabilities this journey is cleared for. `prenatal-safe` is the one the
   * matcher acts on: without it, a journey is never shown to a guest who has
   * said she is expecting.
   */
  safetyFlags: string[]
  /** Guest states that rule this journey out entirely. */
  avoidTags: AvoidTag[]

  badge: string
  image: string
  featured: boolean
  order: number
}

export interface Venue {
  id: string
  name: string
  subtitle: string
  description: string
  icon: string
  note: string
  order: number
}

export interface Therapist {
  id: string
  name: string
  role: string
  bio: string
  specialties: string[]
  languages: string[]
  years: string
  photo: string
  accent: string
  order: number
}

export interface Benefit {
  id: string
  title: string
  description: string
  icon: string
  order: number
}

export interface DiscoverSpot {
  id: string
  name: string
  category: string
  blurb: string
  tip: string
  walkMinutes: number
  priceLevel: string
  mapUrl: string
  image: string
  tags: string[]
  order: number
}

export interface Testimonial {
  id: string
  name: string
  country: string
  quote: string
  rating: number
  service: string
  stayedAt: string
  order: number
}

export interface Faq {
  id: string
  question: string
  answer: string
  order: number
}

export interface Package {
  id: string
  name: string
  description: string
  includes: string[]
  price: number
  duration: string
  badge: string
  order: number
}

export interface PaymentMethod {
  id: string
  name: string
  description: string
  icon: string
  url: string
  enabled: boolean
  order: number
}

export interface GalleryItem {
  id: string
  caption: string
  image: string
  order: number
}

export interface Booking {
  id: string
  createdAt: string
  name: string
  contact: string
  service: string
  duration: string
  venue: string
  date: string
  time: string
  people: string
  hotel: string
  notes: string
  status: 'new' | 'confirmed' | 'done' | 'cancelled'
}

export interface SiteContent {
  site: SiteSettings
  services: Service[]
  journeys: MassageJourney[]
  venues: Venue[]
  team: Therapist[]
  benefits: Benefit[]
  discover: DiscoverSpot[]
  testimonials: Testimonial[]
  faqs: Faq[]
  packages: Package[]
  payments: PaymentMethod[]
  gallery: GalleryItem[]
}

/** Keys of SiteContent that hold an array of records — everything CRUD-able. */
export type CollectionKey = Exclude<keyof SiteContent, 'site'>

export interface RecordBase {
  id: string
  order: number
}
