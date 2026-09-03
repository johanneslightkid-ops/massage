/**
 * Presentation for the guided flow: what each answer looks like, and how a
 * match is explained out loud.
 *
 * The matcher deals in canonical tags and returns dictionary keys. This turns
 * both into things a guest can see and read — kept out of the components so
 * the page stays about layout and the vocabulary stays in one place.
 */

import type { MomentTag, VenueTag, IntensityChoice } from '@shared/journey-tags'
import type { JourneyMatch, GuestAnswers } from '@shared/matcher'
import type { MotifName } from '@/components/art/Motif'

/* ------------------------------------------------------------------ moods */

/**
 * Each opening answer tints the page.
 *
 * Kept to a wash behind the content rather than a themed skin: the guest is
 * choosing a massage, not admiring a colour scheme, and the text has to stay
 * the most legible thing on screen. Every value is drawn from the existing
 * tropical palette in `index.css`.
 */
export interface Mood {
  /** Ambient page wash — replaces the default body gradient while active. */
  wash: string
  /** Accent used for the selected state and progress. */
  accent: string
  /** Soft ground for the answer chips. */
  chip: string
}

const MOODS: Record<string, Mood> = {
  // Arrival — wide daylight sky, air moving.
  'just-arrived': {
    wash: 'radial-gradient(1200px 620px at 10% -8%, #e8f7fe 0%, transparent 62%), radial-gradient(900px 540px at 92% 8%, #f4fbff 0%, transparent 60%), linear-gradient(180deg, #ffffff 0%, #fbfdff 100%)',
    accent: 'from-sky-700 to-lagoon-600',
    chip: 'bg-sky-50',
  },
  // Adventure — brighter, warmer, more energy in the light.
  'after-adventure': {
    wash: 'radial-gradient(1150px 600px at 88% -6%, #fef8e6 0%, transparent 60%), radial-gradient(900px 560px at 6% 20%, #e3f9ed 0%, transparent 62%), linear-gradient(180deg, #ffffff 0%, #fefcf5 100%)',
    accent: 'from-sun-600 to-palm-500',
    chip: 'bg-sun-100',
  },
  // Switching off — lagoon water, soft and shaded.
  'switch-off': {
    wash: 'radial-gradient(1200px 640px at 14% -10%, #e9fcfb 0%, transparent 64%), radial-gradient(880px 520px at 90% 30%, #f4fbff 0%, transparent 60%), linear-gradient(180deg, #ffffff 0%, #fafeff 100%)',
    accent: 'from-lagoon-600 to-sky-700',
    chip: 'bg-seafoam-100',
  },
  // Celebration — sunset coral and pink.
  celebrating: {
    wash: 'radial-gradient(1150px 620px at 86% -8%, #fff0f5 0%, transparent 62%), radial-gradient(900px 540px at 8% 26%, #fef8e6 0%, transparent 60%), linear-gradient(180deg, #ffffff 0%, #fffbfc 100%)',
    accent: 'from-flamingo-600 to-coral-500',
    chip: 'bg-flamingo-100',
  },
  // Gentle — pale seafoam, nothing loud anywhere.
  gentle: {
    wash: 'radial-gradient(1100px 600px at 20% -8%, #f4fefd 0%, transparent 62%), radial-gradient(880px 520px at 88% 24%, #e9fcfb 0%, transparent 58%), linear-gradient(180deg, #ffffff 0%, #fbfffe 100%)',
    accent: 'from-lagoon-500 to-palm-400',
    chip: 'bg-seafoam-50',
  },
}

const DEFAULT_MOOD: Mood = {
  wash: '',
  accent: 'from-sky-700 to-lagoon-600',
  chip: 'bg-sky-50',
}

/** Several moments share a mood — celebrating and travelling together, say. */
const MOOD_ALIASES: Record<MomentTag, string> = {
  'just-arrived': 'just-arrived',
  'after-adventure': 'after-adventure',
  'switch-off': 'switch-off',
  targeted: 'after-adventure',
  celebrating: 'celebrating',
  'with-someone': 'celebrating',
  gentle: 'gentle',
  expecting: 'gentle',
  unsure: 'switch-off',
}

export function moodFor(moment: MomentTag | undefined): Mood {
  if (!moment) return DEFAULT_MOOD
  return MOODS[MOOD_ALIASES[moment]] ?? DEFAULT_MOOD
}

/* ------------------------------------------------------------------ icons */

export const MOMENT_ICONS: Record<MomentTag, MotifName> = {
  'just-arrived': 'plane',
  'after-adventure': 'compass',
  'switch-off': 'wave',
  targeted: 'spark',
  celebrating: 'heart',
  'with-someone': 'heart',
  gentle: 'leaf',
  expecting: 'moon',
  unsure: 'shell',
}

export const VENUE_ICONS: Record<VenueTag, MotifName> = {
  room: 'bed',
  villa: 'home',
  terrace: 'palm',
}

export const INTENSITY_ICONS: Record<IntensityChoice, MotifName> = {
  gentle: 'leaf',
  relaxing: 'wave',
  balanced: 'shell',
  firm: 'spark',
  surprise: 'sun',
}

/* --------------------------------------------------------------- reasons */

/**
 * Turns a match into the sentence a person would actually say.
 *
 * The matcher says *which* things agreed; the guest's own answers say what
 * those things were. Joining them here means the explanation is specific
 * ("because you have just arrived and would rather stay in your room") rather
 * than the generic praise a scoring system tends to produce.
 *
 * `Intl.ListFormat` handles the "a, b and c" / "a, b y c" difference, which is
 * exactly the sort of detail that gives away a translated interface.
 */
export function reasonSentence(
  match: JourneyMatch,
  answers: GuestAnswers,
  locale: string,
  t: (key: string, vars?: Record<string, string | number>) => string,
): string | null {
  const parts: string[] = []

  for (const key of match.reasonKeys) {
    if (key === 'moment' && answers.moment) parts.push(t(`find.because.${answers.moment}`))
    if (key === 'intensity' && answers.intensity && answers.intensity !== 'surprise') {
      parts.push(t(`find.because_feel.${answers.intensity}`))
    }
    if (key === 'venue' && answers.venue) parts.push(t(`find.because_venue.${answers.venue}`))
    if (key === 'gentle') parts.push(t('find.because_care'))
    if (key === 'prenatal') parts.push(t('find.because_prenatal'))
  }

  if (parts.length === 0) return null

  const joined =
    typeof Intl !== 'undefined' && 'ListFormat' in Intl
      ? new Intl.ListFormat(locale, { style: 'long', type: 'conjunction' }).format(parts)
      : parts.join(', ')

  return t('find.because', { reasons: joined })
}
