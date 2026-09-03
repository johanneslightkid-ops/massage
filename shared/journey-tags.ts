/**
 * The vocabulary the concierge thinks in.
 *
 * These tags are the contract between three places that must agree exactly:
 * the seeds, the admin forms, and the matcher. So they are **canonical keys,
 * never display text** — `just-arrived`, not "I just arrived" or "Acabo de
 * llegar".
 *
 * That matters more here than anywhere else in the codebase. Content is stored
 * as one KV document per language, so a Spanish journey and an English journey
 * are different records. If tags were localized labels the matcher would score
 * correctly in English and silently fail in Spanish. Keeping them canonical
 * means one matcher, one set of tests, both languages.
 *
 * Labels for humans live in the UI dictionary (`src/lib/translations`) for the
 * guest, and in `shared/schema-i18n.ts` for the owner editing in /admin.
 */

/* ------------------------------------------------------- what kind of day */

/**
 * The opening question: not "which massage" but "what is happening to you".
 * Every option is a situation a tourist recognises without knowing any massage
 * terminology at all.
 */
export const MOMENT_TAGS = [
  'just-arrived',
  'after-adventure',
  'switch-off',
  'targeted',
  'celebrating',
  'with-someone',
  'gentle',
  'expecting',
  'unsure',
] as const
export type MomentTag = (typeof MOMENT_TAGS)[number]

/* ------------------------------------------------------------- occasions */

export const OCCASION_TAGS = [
  'honeymoon',
  'anniversary',
  'birthday',
  'date-night',
  'celebration',
  'couple',
  'friends',
  'family',
  'solo',
  'first-massage',
] as const
export type OccasionTag = (typeof OCCASION_TAGS)[number]

/* --------------------------------------------------------------- timing */

export const TIMING_TAGS = [
  'arrival-day',
  'morning',
  'afternoon',
  'golden-hour',
  'evening',
  'before-sleep',
  'after-excursion',
  'multi-day',
] as const
export type TimingTag = (typeof TIMING_TAGS)[number]

/* ---------------------------------------------------------------- venues */

/**
 * Every massage happens where the guest already is. There is no studio to
 * travel to and, for now, no service on the public beach — so these are not
 * *our* locations, they are the kinds of space we carry a table into.
 *
 * The distinction still earns its place in the matcher: a scrub wants a shower
 * a few steps away, two tables need floor space, and a stone heater needs an
 * outlet. `venueTagFromName` maps the owner's editable venue names onto these,
 * so renaming "Your hotel or resort room" never breaks matching.
 */
export const VENUE_TAGS = ['room', 'villa', 'terrace'] as const
export type VenueTag = (typeof VENUE_TAGS)[number]

/* ------------------------------------------------------------- intensity */

export const INTENSITY_TAGS = ['gentle', 'relaxing', 'balanced', 'firm'] as const
export type IntensityTag = (typeof INTENSITY_TAGS)[number]

/** What the guest picks — `surprise` means "no preference, you choose". */
export const INTENSITY_CHOICES = [...INTENSITY_TAGS, 'surprise'] as const
export type IntensityChoice = (typeof INTENSITY_CHOICES)[number]

/** Neighbouring intensities still fit, just less well than an exact match. */
export const INTENSITY_ORDER: IntensityTag[] = ['gentle', 'relaxing', 'balanced', 'firm']

/* ------------------------------------------------------------ body focus */

export const FOCUS_TAGS = [
  'full-body',
  'back-neck-shoulders',
  'legs-feet',
  'head-scalp',
  'skin',
] as const
export type FocusTag = (typeof FOCUS_TAGS)[number]

/* ---------------------------------------------------------------- safety */

/**
 * The short, friendly comfort check — and the only place the site asks anything
 * personal at all.
 *
 * No age, no weight, no gender, no medical history. Each entry exists solely
 * because it changes whether recommending an ordinary massage right now would
 * be the wrong thing to do. Answers are held in component state for the length
 * of the visit and never persisted, never sent to an AI, never put in the
 * WhatsApp message and never counted in analytics.
 */
export const CONCERN_TAGS = [
  'pregnant',
  'recent-surgery',
  'acute-injury',
  'blood-thinners',
  'fever',
  'swelling',
  'sunburn',
  'intoxicated',
] as const
export type ConcernTag = (typeof CONCERN_TAGS)[number]

/**
 * Situations where the kind thing is to not sell a massage at all.
 *
 * The site says so warmly and without naming a condition — it is not a
 * diagnosis, and massage is never offered here as the remedy. Cooling down,
 * fluids, rest or a doctor come first; we are glad to help afterwards.
 */
export const REST_FIRST_CONCERNS: ConcernTag[] = ['fever', 'swelling', 'intoxicated', 'sunburn']

/**
 * Situations that are not a stop, but are not ours to decide on a web page
 * either. The guest is invited to talk to the team first so a therapist — and
 * where it matters, their own clinician — can weigh in.
 */
export const TALK_FIRST_CONCERNS: ConcernTag[] = ['recent-surgery', 'acute-injury', 'blood-thinners']

/**
 * Pregnancy is neither: it narrows the recommendation to journeys explicitly
 * marked prenatal-appropriate by the studio, and nothing else.
 */
export const PRENATAL_SAFE = 'prenatal-safe'

/** Journeys may exclude themselves for a guest state via `avoidTags`. */
export const AVOID_TAGS = [...CONCERN_TAGS] as const
export type AvoidTag = ConcernTag

/* ---------------------------------------------------------------- guards */

const membership = <T extends readonly string[]>(list: T) => {
  const set = new Set<string>(list)
  return (value: unknown): value is T[number] => typeof value === 'string' && set.has(value)
}

export const isMomentTag = membership(MOMENT_TAGS)
export const isOccasionTag = membership(OCCASION_TAGS)
export const isTimingTag = membership(TIMING_TAGS)
export const isVenueTag = membership(VENUE_TAGS)
export const isIntensityTag = membership(INTENSITY_TAGS)
export const isIntensityChoice = membership(INTENSITY_CHOICES)
export const isFocusTag = membership(FOCUS_TAGS)
export const isConcernTag = membership(CONCERN_TAGS)

/**
 * Venue records are owner-editable, so their *names* cannot be matched on.
 * Recognise the three shapes the studio works in from either language, and
 * fall back to undefined rather than guessing — an unrecognised venue simply
 * stops constraining the recommendation.
 */
export function venueTagFromName(name: string): VenueTag | undefined {
  const text = name.toLowerCase()
  if (/terrace|terraza|balcon|balcón|garden|jard|patio|poolside|piscina/.test(text)) return 'terrace'
  if (/villa|apartment|apartamento|airbnb|casa|penthouse/.test(text)) return 'villa'
  if (/room|hotel|resort|habitaci|suite|cuarto/.test(text)) return 'room'
  return undefined
}
