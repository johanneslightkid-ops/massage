#!/usr/bin/env node --test
/**
 * The recommendation engine, tested against real guests.
 *
 * Two kinds of test live here and they are not equally important.
 *
 * The ranking tests check that the concierge gives good advice. If one breaks,
 * a guest gets a merely adequate suggestion.
 *
 * The safety tests check that it declines to give advice at all in the
 * situations where selling a massage would be the wrong thing to do. If one of
 * those breaks, the site recommends a deep tissue massage to someone running a
 * fever. They are written to fail loudly and they are not to be relaxed to
 * make a ranking test pass.
 *
 * Both languages are exercised deliberately: the seeds are separate documents,
 * and the canonical-tag design only pays off if it is checked.
 */

import test from 'node:test'
import assert from 'node:assert/strict'
import { matchJourneys, offeredDurations, leadService, alternativeServices } from '../shared/matcher.ts'
import { journeys } from '../shared/journeys.ts'
import { journeysEs } from '../shared/journeys-es.ts'
import { seedContent } from '../shared/seed.ts'
import { VENUE_TAGS } from '../shared/journey-tags.ts'

const services = seedContent.services
const top = (result) => result.matches[0]?.journey.slug
const slugs = (result) => result.matches.map((m) => m.journey.slug)

/* ----------------------------------------------------- the named scenarios */

test('long flight + relaxing → an arrival journey', () => {
  const result = matchJourneys(journeys, {
    moment: 'just-arrived',
    intensity: 'relaxing',
    venue: 'room',
  })
  assert.equal(result.outcome, 'ok')
  assert.equal(result.fallback, false)
  assert.ok(
    ['just-arrived-reset', 'jet-lag-reset'].includes(top(result)),
    `expected an arrival journey, got ${top(result)}`,
  )
})

test('long flight, in the evening, before sleep → Jet Lag Reset specifically', () => {
  const result = matchJourneys(journeys, {
    moment: 'just-arrived',
    intensity: 'relaxing',
    venue: 'room',
    timing: 'before-sleep',
  })
  assert.equal(top(result), 'jet-lag-reset')
})

test('adventure + firm → After Adventure Recovery', () => {
  const result = matchJourneys(journeys, {
    moment: 'after-adventure',
    intensity: 'firm',
    venue: 'room',
  })
  assert.equal(top(result), 'after-adventure-recovery')
})

test('honeymoon + together → Couples Honeymoon Ritual', () => {
  const result = matchJourneys(journeys, {
    moment: 'celebrating',
    intensity: 'relaxing',
    venue: 'room',
    occasion: 'honeymoon',
  })
  assert.equal(top(result), 'couples-honeymoon-ritual')
})

test('sleep + relaxing → Sleep & Unwind', () => {
  const result = matchJourneys(journeys, {
    moment: 'switch-off',
    intensity: 'relaxing',
    venue: 'room',
    timing: 'before-sleep',
  })
  assert.equal(top(result), 'sleep-and-unwind')
})

test('neck/shoulders + focused → Neck & Shoulder Rescue', () => {
  const result = matchJourneys(journeys, {
    moment: 'targeted',
    intensity: 'firm',
    venue: 'room',
  })
  assert.equal(top(result), 'neck-and-shoulder-rescue')
})

test('pregnancy → Prenatal Comfort, and nothing else at all', () => {
  const result = matchJourneys(journeys, {
    moment: 'expecting',
    intensity: 'gentle',
    venue: 'room',
    concerns: ['pregnant'],
  })
  assert.deepEqual(slugs(result), ['prenatal-comfort'])
})

/* -------------------------------------------------------------- safety */

for (const concern of ['fever', 'swelling', 'intoxicated', 'sunburn']) {
  test(`${concern} → no massage is recommended at all`, () => {
    const result = matchJourneys(journeys, {
      moment: 'switch-off',
      intensity: 'relaxing',
      venue: 'room',
      concerns: [concern],
    })
    assert.equal(result.outcome, 'rest')
    assert.deepEqual(result.matches, [])
    assert.ok(result.flagged.includes(concern))
  })
}

test('a red flag outranks a perfect match on every other answer', () => {
  const result = matchJourneys(journeys, {
    moment: 'after-adventure',
    intensity: 'firm',
    venue: 'room',
    occasion: 'friends',
    timing: 'after-excursion',
    concerns: ['fever'],
  })
  assert.equal(result.outcome, 'rest')
  assert.equal(result.matches.length, 0)
})

for (const concern of ['recent-surgery', 'acute-injury', 'blood-thinners']) {
  // Every moment, not just one: a firm journey slipped through on `targeted`
  // while passing on `after-adventure`, because it was only scored down.
  for (const moment of ['after-adventure', 'targeted', 'switch-off', 'unsure']) {
    test(`${concern} + ${moment} → talk to us first, and never firm work`, () => {
      const result = matchJourneys(journeys, {
        moment,
        intensity: 'firm',
        venue: 'room',
        concerns: [concern],
      })
      assert.equal(result.outcome, 'care')
      assert.ok(result.flagged.includes(concern))
      for (const match of result.matches) {
        assert.notEqual(
          match.journey.intensity,
          'firm',
          `${match.journey.slug} is firm and must not be suggested for ${concern}`,
        )
      }
    })
  }
}

test('a prenatal journey is never suggested to someone who has not said she is pregnant', () => {
  for (const answers of [
    { moment: 'gentle', intensity: 'gentle', venue: 'room' },
    { moment: 'unsure', intensity: 'gentle' },
    { moment: 'switch-off', intensity: 'gentle', venue: 'room' },
  ]) {
    const result = matchJourneys(journeys, answers)
    for (const match of result.matches) {
      assert.ok(
        !match.journey.safetyFlags.includes('prenatal-safe'),
        `${match.journey.slug} was offered to a guest who never mentioned pregnancy`,
      )
    }
  }
})

test('choosing "I am expecting" is enough — the comfort check need not repeat it', () => {
  const result = matchJourneys(journeys, { moment: 'expecting', intensity: 'gentle' })
  assert.deepEqual(result.matches.map((m) => m.journey.slug), ['prenatal-comfort'])
})

test('pregnancy is an allow-list: a journey without the flag is never shown', () => {
  const untagged = journeys.filter((j) => !j.safetyFlags?.includes('prenatal-safe'))
  assert.ok(untagged.length > 0, 'fixture should contain journeys without the flag')

  const result = matchJourneys(journeys, { moment: 'switch-off', concerns: ['pregnant'] })
  for (const match of result.matches) {
    assert.ok(match.journey.safetyFlags.includes('prenatal-safe'))
  }
})

test('a journey that excludes a state is dropped even when it scores best', () => {
  // The coconut ritual excludes sunburn, but sunburn is a rest-first answer, so
  // use avoidTags directly: deep tissue excludes pregnancy.
  const result = matchJourneys(journeys, {
    moment: 'after-adventure',
    intensity: 'firm',
    concerns: ['pregnant'],
  })
  assert.ok(!slugs(result).includes('after-adventure-recovery'))
})

test('no journeys at all is handled, not crashed', () => {
  const result = matchJourneys([], { moment: 'switch-off' })
  assert.equal(result.outcome, 'care')
  assert.deepEqual(result.matches, [])
  assert.equal(result.fallback, true)
})

/* ------------------------------------------------------------- fallback */

test('"not sure" with no other answer still suggests something', () => {
  const result = matchJourneys(journeys, { moment: 'unsure' })
  assert.equal(result.outcome, 'ok')
  assert.ok(result.matches.length > 0)
  assert.equal(result.fallback, false)
})

test('an empty answer set falls back rather than showing nothing', () => {
  const result = matchJourneys(journeys, {})
  assert.equal(result.fallback, true)
  assert.ok(result.matches.length > 0)
  // Fallback follows the owner's own ordering.
  assert.equal(result.matches[0].journey.order, 1)
})

test('a venue nothing supports still returns options rather than an empty screen', () => {
  const indoorOnly = journeys.filter((j) => j.slug === 'coconut-island-ritual') // room / villa only
  const result = matchJourneys(indoorOnly, { venue: 'terrace' })
  assert.ok(result.matches.length > 0)
  assert.equal(result.fallback, true)
})

/* -------------------------------------------------------------- ranking */

test('venue incompatibility pushes a journey down', () => {
  const studioOnly = matchJourneys(journeys, { moment: 'switch-off', venue: 'room' })
  const beach = matchJourneys(journeys, { moment: 'switch-off', venue: 'beach' })
  // The coconut ritual is studio-only, so it must never lead a beach request.
  assert.notEqual(top(beach), 'coconut-island-ritual')
  assert.ok(studioOnly.matches.length > 0)
})

test('"surprise me" does not penalise any intensity', () => {
  const surprise = matchJourneys(journeys, { moment: 'switch-off', intensity: 'surprise' })
  const none = matchJourneys(journeys, { moment: 'switch-off' })
  assert.deepEqual(slugs(surprise), slugs(none))
})

test('gentle preference beats a firm situational match', () => {
  const result = matchJourneys(journeys, { moment: 'targeted', intensity: 'gentle' })
  assert.notEqual(result.matches[0].journey.intensity, 'firm')
})

test('results are capped and ordered best first', () => {
  const result = matchJourneys(journeys, { moment: 'switch-off' }, 3)
  assert.ok(result.matches.length <= 3)
  for (let i = 1; i < result.matches.length; i++) {
    assert.ok(result.matches[i - 1].score >= result.matches[i].score)
  }
})

test('matching is deterministic — same input, same order, every time', () => {
  const answers = { moment: 'switch-off', intensity: 'relaxing', venue: 'beach' }
  const first = slugs(matchJourneys(journeys, answers))
  for (let i = 0; i < 5; i++) {
    assert.deepEqual(slugs(matchJourneys(journeys, answers)), first)
  }
})

test('reasons are dictionary keys, never sentences', () => {
  const result = matchJourneys(journeys, {
    moment: 'after-adventure',
    intensity: 'firm',
    venue: 'room',
    timing: 'after-excursion',
  })
  const keys = result.matches[0].reasonKeys
  assert.ok(keys.length > 0)
  for (const key of keys) {
    assert.match(key, /^[a-z]+$/, `${key} looks like prose, not a key`)
  }
})

/* ------------------------------------------------------------- language */

test('Spanish content ranks identically to English', () => {
  const answers = { moment: 'after-adventure', intensity: 'firm', venue: 'room' }
  assert.deepEqual(slugs(matchJourneys(journeysEs, answers)), slugs(matchJourneys(journeys, answers)))
})

test('Spanish honours the same safety rules', () => {
  const rest = matchJourneys(journeysEs, { moment: 'switch-off', concerns: ['fever'] })
  assert.equal(rest.outcome, 'rest')

  const pregnant = matchJourneys(journeysEs, { moment: 'expecting', concerns: ['pregnant'] })
  assert.deepEqual(pregnant.matches.map((m) => m.journey.slug), ['prenatal-comfort'])
})

/* -------------------------------------------------------------- services */

test('every journey resolves to a real service', () => {
  for (const journey of journeys) {
    assert.ok(leadService(journey, services), `${journey.slug} has no resolvable service`)
  }
})

test('offered durations are always bookable on the service', () => {
  for (const journey of journeys) {
    const service = leadService(journey, services)
    const available = new Set(service.durations.map((d) => d.minutes))
    for (const minutes of offeredDurations(journey, services)) {
      assert.ok(available.has(minutes), `${journey.slug} offers ${minutes} min, ${service.id} does not`)
    }
  }
})

test('a duration removed from the service disappears from the journey', () => {
  const trimmed = services.map((s) =>
    s.id === 'svc-relax' ? { ...s, durations: [{ minutes: 60, price: 70 }] } : s,
  )
  const arrival = journeys.find((j) => j.slug === 'just-arrived-reset')
  assert.deepEqual(offeredDurations(arrival, trimmed), [60])
})

test('a service deleted from the catalogue does not crash the card', () => {
  const withoutRelax = services.filter((s) => s.id !== 'svc-relax')
  const arrival = journeys.find((j) => j.slug === 'just-arrived-reset')
  assert.equal(leadService(arrival, withoutRelax), undefined)
  assert.deepEqual(offeredDurations(arrival, withoutRelax), arrival.durationMinutes)
})

test('alternatives resolve and skip anything deleted', () => {
  const arrival = journeys.find((j) => j.slug === 'just-arrived-reset')
  assert.ok(alternativeServices(arrival, services).length > 0)
  assert.equal(alternativeServices(arrival, []).length, 0)
})
