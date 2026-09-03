/**
 * The concierge's judgement, as a pure function.
 *
 * Deliberately not an LLM. A guest choosing a massage on a hotel bed deserves
 * an answer that is instant, identical every time, works offline, costs
 * nothing, and — the part that actually matters — can be unit-tested against
 * the cases where recommending the wrong thing would be harmful.
 *
 * Order of operations is the whole design:
 *
 *   1. Safety first, before any scoring. Some answers mean the site should not
 *      be selling a massage at all, and no amount of tag agreement should be
 *      able to outvote that.
 *   2. Hard exclusions. A journey can rule itself out; pregnancy narrows the
 *      field to journeys the team has explicitly cleared.
 *   3. Only then, scoring — additive tag agreement, highest wins.
 *
 * Scores are an implementation detail and never reach the guest. What reaches
 * the guest is `reasons`: the same match, said out loud as a person would say
 * it. Nobody wants to be told they are an 87% fit for anything.
 */

import type { MassageJourney, Service } from './types.ts'
import {
  INTENSITY_ORDER,
  PRENATAL_SAFE,
  REST_FIRST_CONCERNS,
  TALK_FIRST_CONCERNS,
} from './journey-tags.ts'
import type {
  ConcernTag,
  IntensityChoice,
  IntensityTag,
  MomentTag,
  OccasionTag,
  TimingTag,
  VenueTag,
} from './journey-tags.ts'

/* ------------------------------------------------------------------ input */

export interface GuestAnswers {
  /** Screen 1 — "what kind of day are you having?" */
  moment?: MomentTag
  /** Screen 2 — "how should it feel?" `surprise` means no preference. */
  intensity?: IntensityChoice
  /** Screen 3 — "where would you like your little escape?" */
  venue?: VenueTag
  /** Inferred from the moment, or set by a quick path from the home page. */
  occasion?: OccasionTag
  timing?: TimingTag
  /** Screen 4 — the comfort check. Never persisted, never transmitted. */
  concerns?: ConcernTag[]
}

/* ----------------------------------------------------------------- output */

/**
 * `rest` and `care` are not failure states — they are the right answer to a
 * question the guest asked honestly, and they still lead somewhere human.
 */
export type MatchOutcome = 'ok' | 'care' | 'rest'

export interface JourneyMatch {
  journey: MassageJourney
  /** Internal ranking only. Never rendered. */
  score: number
  /**
   * Dictionary keys, not sentences — the UI renders them in the reader's
   * language. Returning English here would strand the Spanish visitor.
   */
  reasonKeys: MatchReasonKey[]
}

export type MatchReasonKey =
  | 'moment'
  | 'intensity'
  | 'venue'
  | 'occasion'
  | 'timing'
  | 'gentle'
  | 'prenatal'

export interface MatchResult {
  outcome: MatchOutcome
  /** Best first. Empty when the outcome is `rest`. */
  matches: JourneyMatch[]
  /** Which answers triggered `rest` or `care`, so the UI can be specific. */
  flagged: ConcernTag[]
  /**
   * True when nothing scored and we fell back to showing something sensible
   * rather than an empty screen.
   */
  fallback: boolean
}

/* ----------------------------------------------------------------- weights */

/**
 * Chosen so that no two signals can gang up to outrank the guest's own
 * headline answer. The moment they picked first is worth more than everything
 * else combined can casually accumulate.
 */
const WEIGHT = {
  moment: 10,
  momentFocus: 6,
  intensityExact: 6,
  intensityNeighbour: 3,
  /**
   * Asked for gentle and offered firm. Two steps apart is merely imperfect and
   * scores nothing either way; three steps is the guest being handed the
   * opposite of what they asked for, and should lose to a weaker situational
   * match rather than beat it.
   */
  intensityOpposite: -8,
  occasion: 4,
  timing: 3,
  timingFocus: 3,
  venue: 2,
  featured: 1,
} as const

/**
 * Rewards a journey for being *about* the thing the guest picked.
 *
 * "Neck & Shoulder Rescue" claims one moment; "After Adventure Recovery"
 * claims two. Both legitimately match a guest who points at their shoulders,
 * but only one of them is the answer to that question — so a tag counts for
 * more when the journey has staked less on it. Without this, ties fall through
 * to the owner's ordering and the generalist wins by being listed earlier.
 */
function focusBonus(budget: number, breadth: number | undefined): number {
  if (!breadth || breadth < 1) return 0
  return Math.round(budget / breadth)
}

/** How far apart two intensities are on the gentle → firm line. */
function intensityDistance(a: IntensityTag, b: IntensityTag): number {
  return Math.abs(INTENSITY_ORDER.indexOf(a) - INTENSITY_ORDER.indexOf(b))
}

/* ------------------------------------------------------------ the matcher */

export function matchJourneys(
  journeys: MassageJourney[],
  answers: GuestAnswers,
  limit = 3,
): MatchResult {
  const concerns = answers.concerns ?? []

  /* 1. Safety, before anything else ------------------------------------- */

  const restFlags = concerns.filter((concern) => REST_FIRST_CONCERNS.includes(concern))
  if (restFlags.length > 0) {
    // Nothing is recommended. Not a softer journey, not a shorter one —
    // the honest answer is that today is not the day.
    return { outcome: 'rest', matches: [], flagged: restFlags, fallback: false }
  }

  const careFlags = concerns.filter((concern) => TALK_FIRST_CONCERNS.includes(concern))

  /* 2. Hard exclusions --------------------------------------------------- */

  const expecting = concerns.includes('pregnant') || answers.moment === 'expecting'

  const eligible = journeys.filter((journey) => {
    // The journey excludes this guest's situation itself.
    if (journey.avoidTags?.some((tag) => concerns.includes(tag))) return false

    // Pregnancy is allow-list, not deny-list: silence means not cleared.
    if (expecting && !journey.safetyFlags?.includes(PRENATAL_SAFE)) return false

    /*
     * ...and the reverse, which is easy to miss: a prenatal journey must not
     * be suggested to someone who has not said she is pregnant. It otherwise
     * surfaces for anyone asking for gentle work, which is presumptuous at
     * best. Being cleared for pregnancy is not the same as being appropriate
     * for everyone.
     */
    if (!expecting && journey.guestTags?.includes('expecting')) return false

    /*
     * When a guest has mentioned surgery, a fresh injury or blood thinners,
     * firm work is not merely a poor fit — it is the thing not to do. Scoring
     * it down leaves it on the page whenever the situational match is strong
     * enough; removing it means it cannot appear at all.
     */
    if (careFlags.length > 0 && journey.intensity === 'firm') return false

    return true
  })

  if (eligible.length === 0) {
    // Every journey ruled itself out. Still not a dead end — the team can help.
    return { outcome: 'care', matches: [], flagged: [...careFlags, ...(expecting ? ['pregnant' as const] : [])], fallback: true }
  }

  /* 3. Scoring ----------------------------------------------------------- */

  const wantsGentle = expecting || careFlags.length > 0

  const scored: Array<JourneyMatch & { signals: number }> = eligible.map((journey) => {
    let score = 0
    const reasonKeys: MatchReasonKey[] = []

    /**
     * Signals are what the *guest's answers* agreed with. The featured
     * tie-breaker below is not one, which is why it is counted separately:
     * otherwise a guest who answered nothing would look like a match for
     * everything the owner promoted.
     */
    let signals = 0

    if (answers.moment && journey.guestTags?.includes(answers.moment)) {
      score += WEIGHT.moment + focusBonus(WEIGHT.momentFocus, journey.guestTags.length)
      reasonKeys.push('moment')
      signals += 1
    }

    if (answers.intensity && answers.intensity !== 'surprise') {
      const distance = intensityDistance(answers.intensity, journey.intensity)
      if (distance === 0) {
        score += WEIGHT.intensityExact
        reasonKeys.push('intensity')
        signals += 1
      } else if (distance === 1) {
        score += WEIGHT.intensityNeighbour
        signals += 1
      } else if (distance >= 3) {
        score += WEIGHT.intensityOpposite
      }
    }

    if (answers.occasion && journey.occasionTags?.includes(answers.occasion)) {
      score += WEIGHT.occasion
      reasonKeys.push('occasion')
      signals += 1
    }

    if (answers.timing && journey.timingTags?.includes(answers.timing)) {
      score += WEIGHT.timing + focusBonus(WEIGHT.timingFocus, journey.timingTags.length)
      reasonKeys.push('timing')
      signals += 1
    }

    if (answers.venue) {
      // An empty venue list means "anywhere", which is compatible but not a
      // reason worth saying out loud.
      const anywhere = !journey.venueTags || journey.venueTags.length === 0
      if (anywhere) {
        score += WEIGHT.venue
      } else if (journey.venueTags.includes(answers.venue)) {
        score += WEIGHT.venue
        reasonKeys.push('venue')
        signals += 1
      } else {
        // Cannot actually be delivered where they asked for it.
        score -= WEIGHT.moment
      }
    }

    /*
     * When the guest has told us something that calls for care, gentler work
     * is not merely preferred, it is the point — so it outweighs a strong
     * situational match rather than nudging it.
     */
    if (wantsGentle) {
      if (journey.intensity === 'gentle') {
        score += WEIGHT.moment
        reasonKeys.push('gentle')
        signals += 1
      } else if (journey.intensity === 'firm') {
        score -= WEIGHT.moment * 2
      }
    }

    if (expecting) reasonKeys.push('prenatal')

    // Breaks ties towards what the owner chose to promote.
    if (journey.featured) score += WEIGHT.featured

    return { journey, score, reasonKeys, signals }
  })

  /*
   * Sort is fully deterministic: score, then the owner's ordering, then id.
   * Two runs with the same content and the same answers give the same answer
   * in the same order — which is what makes the tests meaningful.
   */
  scored.sort(
    (a, b) =>
      b.score - a.score ||
      (a.journey.order ?? 0) - (b.journey.order ?? 0) ||
      a.journey.id.localeCompare(b.journey.id),
  )

  const positive = scored.filter((entry) => entry.signals > 0 && entry.score > 0)

  /*
   * "I'm not sure" is a legitimate answer, and so is a combination nothing was
   * tagged for. Falling back to the owner's own ordering beats an empty screen
   * — but it is flagged, so the UI can phrase it as a suggestion rather than
   * as a match.
   */
  const fallback = positive.length === 0
  const chosen = (fallback ? scored : positive)
    .slice(0, limit)
    .map(({ journey, score, reasonKeys }) => ({ journey, score, reasonKeys }))

  return {
    outcome: careFlags.length > 0 ? 'care' : 'ok',
    matches: chosen,
    flagged: careFlags,
    fallback,
  }
}

/* --------------------------------------------------------------- helpers */

/** The service a journey is actually delivered as, if it still exists. */
export function leadService(
  journey: MassageJourney,
  services: Service[],
): Service | undefined {
  for (const id of journey.recommendedServiceIds ?? []) {
    const found = services.find((service) => service.id === id)
    if (found) return found
  }
  return undefined
}

/**
 * The lengths worth offering: what the journey names, kept to what the service
 * can actually be booked for. Content drifts — a duration removed from a
 * service must not survive on a journey card as a bookable option.
 */
export function offeredDurations(journey: MassageJourney, services: Service[]): number[] {
  const service = leadService(journey, services)
  if (!service) return journey.durationMinutes ?? []

  const available = new Set(service.durations.map((duration) => duration.minutes))
  const offered = (journey.durationMinutes ?? []).filter((minutes) => available.has(minutes))

  return offered.length > 0 ? offered : service.durations.map((duration) => duration.minutes)
}

/** The alternatives a guest is shown behind "show me another option". */
export function alternativeServices(journey: MassageJourney, services: Service[]): Service[] {
  return (journey.alternativeServiceIds ?? [])
    .map((id) => services.find((service) => service.id === id))
    .filter((service): service is Service => Boolean(service))
}

/**
 * The journeys a given treatment delivers — the reverse of `leadService`.
 *
 * This is what lets a treatment card say what it is *for* without anyone
 * writing that twice. "Deep Tissue & Sports" is the massage; that it is the
 * one for the day after the ATV tour is something the journeys already know.
 * Recommended uses come first, then alternatives, so the card leads with the
 * situations this treatment is actually the answer to.
 */
export function journeysForService(
  serviceId: string,
  journeys: MassageJourney[],
): MassageJourney[] {
  const primary: MassageJourney[] = []
  const secondary: MassageJourney[] = []

  for (const journey of journeys) {
    if (journey.recommendedServiceIds?.includes(serviceId)) primary.push(journey)
    else if (journey.alternativeServiceIds?.includes(serviceId)) secondary.push(journey)
  }

  const byOrder = (a: MassageJourney, b: MassageJourney) => (a.order ?? 0) - (b.order ?? 0)
  return [...primary.sort(byOrder), ...secondary.sort(byOrder)]
}
