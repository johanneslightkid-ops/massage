import { useCallback, useEffect, useMemo, useState } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import { AnimatePresence, motion, useReducedMotion } from 'motion/react'
import { ArrowLeft, ArrowRight, MessageCircle, RotateCcw, ShieldCheck } from 'lucide-react'
import {
  CONCERN_TAGS,
  INTENSITY_CHOICES,
  MOMENT_TAGS,
  VENUE_TAGS,
  isIntensityChoice,
  isMomentTag,
  isVenueTag,
  venueTagFromName,
} from '@shared/journey-tags'
import type { ConcernTag, IntensityChoice, MomentTag, VenueTag } from '@shared/journey-tags'
import { matchJourneys } from '@shared/matcher'
import type { GuestAnswers, MatchResult } from '@shared/matcher'
import type { Service, Venue } from '@shared/types'
import { useContent } from '@/lib/content-store'
import { useT } from '@/lib/translations/LanguageProvider'
import { useSeo } from '@/lib/seo'
import { cn, sortByOrder, whatsappLink } from '@/lib/utils'
import { moodFor, MOMENT_ICONS, VENUE_ICONS, INTENSITY_ICONS } from '@/lib/journey-ui'
import { Container, Section } from '@/components/ui/Section'
import { ChoiceCard } from '@/components/find/ChoiceCard'
import { JourneyResult } from '@/components/find/JourneyResult'
import { OilSheen } from '@/components/art/Decor'

/* --------------------------------------------------------------- the flow */

const STEPS = ['moment', 'feel', 'venue', 'comfort', 'result'] as const
type Step = (typeof STEPS)[number]

/** The three questions everyone answers; comfort is conditional, result is the end. */
const QUESTION_COUNT = 3

/**
 * Moments where a short comfort check is worth asking, because the answer
 * genuinely changes what we should suggest.
 *
 * It is not shown to everyone. A guest who says they had a great day on a boat
 * and want firm work does not need to be handed a list of medical-sounding
 * checkboxes — that is the moment the site would stop feeling like a concierge
 * and start feeling like an intake form.
 */
const COMFORT_MOMENTS: MomentTag[] = ['expecting', 'gentle', 'targeted', 'after-adventure', 'unsure']

export function FindYourMassage() {
  const { content } = useContent()
  const t = useT()
  const still = useReducedMotion()
  const site = content.site

  const journeys = useMemo(() => sortByOrder(content.journeys ?? []), [content.journeys])
  const services = useMemo(() => sortByOrder(content.services), [content.services])
  const venues = useMemo(() => sortByOrder(content.venues), [content.venues])

  useSeo({
    path: '/find-your-massage',
    title: `${t('find.title')} ${t('find.script')} · ${site.brandName}, ${site.neighborhood}`,
    description: t('find.seo_description'),
  })

  /*
   * The three massage answers live in the URL so the language switcher, a
   * refresh and the browser's own back button all keep the guest's place — and
   * so a half-finished flow can be shared or bookmarked.
   *
   * The comfort answers deliberately do NOT. They stay in component state for
   * the length of the visit: not in the URL, not in history, not in a shared
   * link, not in localStorage, and never sent anywhere.
   */
  const [params, setParams] = useSearchParams()
  const [concerns, setConcerns] = useState<ConcernTag[]>([])
  const [comfortDone, setComfortDone] = useState(false)
  const [altIndex, setAltIndex] = useState(0)

  const moment = readParam(params.get('m'), isMomentTag)
  const feel = readParam(params.get('f'), isIntensityChoice)
  const venue = readParam(params.get('v'), isVenueTag)

  const setAnswer = useCallback(
    (key: 'm' | 'f' | 'v', value: string) => {
      const next = new URLSearchParams(params)
      next.set(key, value)
      setParams(next, { replace: false })
    },
    [params, setParams],
  )

  const restart = useCallback(() => {
    setConcerns([])
    setComfortDone(false)
    setAltIndex(0)
    setParams(new URLSearchParams(), { replace: false })
  }, [setParams])

  /* Which screen are we on --------------------------------------------- */

  const needsComfort = moment ? COMFORT_MOMENTS.includes(moment) : false

  const step: Step = !moment
    ? 'moment'
    : !feel
      ? 'feel'
      : !venue
        ? 'venue'
        : needsComfort && !comfortDone
          ? 'comfort'
          : 'result'

  const questionIndex = step === 'moment' ? 1 : step === 'feel' ? 2 : step === 'venue' ? 3 : QUESTION_COUNT

  const back = useCallback(() => {
    if (step === 'result' && needsComfort && comfortDone) {
      setComfortDone(false)
      return
    }
    const next = new URLSearchParams(params)
    if (step === 'result' || step === 'comfort') next.delete('v')
    else if (step === 'venue') next.delete('f')
    else if (step === 'feel') next.delete('m')
    setParams(next, { replace: false })
  }, [step, needsComfort, comfortDone, params, setParams])

  /* Matching ------------------------------------------------------------ */

  const answers: GuestAnswers = useMemo(
    () => ({ moment, intensity: feel, venue, concerns }),
    [moment, feel, venue, concerns],
  )

  const result = useMemo(
    () => (step === 'result' ? matchJourneys(journeys, answers, 3) : null),
    [step, journeys, answers],
  )

  // A new set of answers should start from the best match again.
  useEffect(() => setAltIndex(0), [moment, feel, venue, concerns])

  const mood = moodFor(moment)

  /*
   * The mood wash replaces the page gradient while the flow is open, and is
   * put back on the way out — the rest of the site should not inherit it.
   */
  useEffect(() => {
    if (!mood.wash) return
    const body = document.body
    const previous = body.style.background
    body.style.background = mood.wash
    body.style.backgroundAttachment = 'fixed'
    return () => {
      body.style.background = previous
    }
  }, [mood.wash])

  const venueName = venue
    ? venues.find((candidate) => venueTagFromName(candidate.name) === venue)?.name
    : undefined

  const transition = still
    ? { duration: 0 }
    : { duration: 0.42, ease: [0.22, 1, 0.36, 1] as const }

  return (
    <div className="relative overflow-hidden">
      <OilSheen className="opacity-50" />

      <Section className="clear-tabbar relative py-10 sm:py-16">
        <Container className="relative max-w-4xl">
          {/* ------------------------------------------------ progress */}
          {step !== 'result' && (
            <div className="mb-8 flex items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                {moment && (
                  <button
                    type="button"
                    onClick={back}
                    className="inline-flex h-10 items-center gap-1.5 rounded-full border border-ocean-900/12 bg-white/70 px-4 text-[0.85rem] font-semibold text-ocean-800/75 transition-colors hover:border-lagoon-400/60 hover:text-ocean-950"
                  >
                    <ArrowLeft className="size-4" />
                    {t('find.back')}
                  </button>
                )}
                <p className="text-[0.78rem] font-bold tracking-[0.16em] text-lagoon-700 uppercase">
                  {t('find.step_of', { current: questionIndex, total: QUESTION_COUNT })}
                </p>
              </div>

              <div
                className="flex gap-1.5"
                role="progressbar"
                aria-label={t('find.progress')}
                aria-valuenow={questionIndex}
                aria-valuemin={1}
                aria-valuemax={QUESTION_COUNT}
              >
                {Array.from({ length: QUESTION_COUNT }, (_, i) => (
                  <span
                    key={i}
                    className={cn(
                      'h-1.5 rounded-full transition-all duration-500',
                      i < questionIndex ? `w-8 bg-gradient-to-r ${mood.accent}` : 'w-4 bg-ocean-900/12',
                    )}
                  />
                ))}
              </div>
            </div>
          )}

          <AnimatePresence mode="wait">
            <motion.div
              key={step}
              initial={still ? false : { opacity: 0, y: 18 }}
              animate={{ opacity: 1, y: 0 }}
              exit={still ? undefined : { opacity: 0, y: -12 }}
              transition={transition}
            >
              {/* ---------------------------------------------- step 1 */}
              {step === 'moment' && (
                <>
                  <Heading kicker={t('find.kicker')} title={t('find.q_moment')} sub={t('find.q_moment_sub')} />
                  <div className="mt-8 grid gap-3 sm:grid-cols-2">
                    {MOMENT_TAGS.map((tag, index) => (
                      <ChoiceCard
                        key={tag}
                        index={index}
                        icon={MOMENT_ICONS[tag]}
                        title={t(`find.moment.${tag}`)}
                        subtitle={t(`find.moment.${tag}.sub`)}
                        selected={moment === tag}
                        accent={mood.accent}
                        onClick={() => setAnswer('m', tag)}
                      />
                    ))}
                  </div>
                </>
              )}

              {/* ---------------------------------------------- step 2 */}
              {step === 'feel' && (
                <>
                  <Heading title={t('find.q_feel')} sub={t('find.q_feel_sub')} />
                  <div className="mt-8 grid gap-3 sm:grid-cols-2">
                    {INTENSITY_CHOICES.map((choice: IntensityChoice, index) => (
                      <ChoiceCard
                        key={choice}
                        index={index}
                        icon={INTENSITY_ICONS[choice]}
                        title={t(`find.feel.${choice}`)}
                        subtitle={t(`find.feel.${choice}.sub`)}
                        selected={feel === choice}
                        accent={mood.accent}
                        onClick={() => setAnswer('f', choice)}
                      />
                    ))}
                  </div>
                </>
              )}

              {/* ---------------------------------------------- step 3 */}
              {step === 'venue' && (
                <>
                  <Heading title={t('find.q_venue')} sub={t('find.q_venue_sub')} />
                  <div className="mt-8 grid gap-3 sm:grid-cols-3">
                    {VENUE_TAGS.map((tag: VenueTag, index) => {
                      const record = venues.find((candidate) => venueTagFromName(candidate.name) === tag)
                      return (
                        <ChoiceCard
                          key={tag}
                          index={index}
                          icon={VENUE_ICONS[tag]}
                          title={record?.name ?? t(`find.venue.${tag}`)}
                          subtitle={record?.subtitle ?? t(`find.venue.${tag}.sub`)}
                          selected={venue === tag}
                          accent={mood.accent}
                          onClick={() => setAnswer('v', tag)}
                        />
                      )
                    })}
                  </div>
                </>
              )}

              {/* ---------------------------------------------- step 4 */}
              {step === 'comfort' && (
                <>
                  <Heading title={t('find.q_comfort')} sub={t('find.q_comfort_sub')} />

                  <p className="mt-5 flex items-start gap-2.5 rounded-[1.4rem] bg-seafoam-50 p-4 text-[0.85rem] leading-relaxed text-ocean-800/75 ring-1 ring-lagoon-200/60">
                    <ShieldCheck className="mt-0.5 size-4 shrink-0 text-lagoon-600" aria-hidden />
                    {t('find.comfort_privacy')}
                  </p>

                  <div className="mt-6 flex flex-wrap gap-2.5">
                    {CONCERN_TAGS.map((tag) => {
                      const on = concerns.includes(tag)
                      return (
                        <button
                          key={tag}
                          type="button"
                          role="switch"
                          aria-checked={on}
                          onClick={() =>
                            setConcerns((current) =>
                              current.includes(tag)
                                ? current.filter((item) => item !== tag)
                                : [...current, tag],
                            )
                          }
                          className={cn(
                            'min-h-12 rounded-full border px-5 text-[0.9rem] font-semibold transition-colors',
                            on
                              ? 'border-lagoon-400 bg-white text-ocean-950 shadow-soft'
                              : 'border-ocean-900/12 bg-white/60 text-ocean-800/70 hover:border-lagoon-400/60',
                          )}
                        >
                          {t(`find.concern.${tag}`)}
                        </button>
                      )
                    })}
                  </div>

                  <div className="mt-8 grid gap-3 sm:flex sm:flex-wrap">
                    <button
                      type="button"
                      onClick={() => {
                        setConcerns([])
                        setComfortDone(true)
                      }}
                      className={secondaryAction}
                    >
                      {t('find.comfort_none')}
                    </button>
                    <button
                      type="button"
                      onClick={() => setComfortDone(true)}
                      className={cn(
                        'inline-flex h-13 min-h-12 w-full items-center justify-center gap-2 rounded-full bg-gradient-to-r px-7 font-bold text-sand-50 shadow-soft transition-all hover:brightness-110 sm:w-auto',
                        mood.accent,
                      )}
                    >
                      {t('find.comfort_continue')}
                      <ArrowRight className="size-4" />
                    </button>
                  </div>
                </>
              )}

              {/* --------------------------------------------- results */}
              {step === 'result' && result && (
                <Results
                  result={result}
                  answers={answers}
                  services={services}
                  venues={venues}
                  currency={site.currency}
                  venueName={venueName}
                  altIndex={altIndex}
                  onAnother={() => setAltIndex((i) => i + 1)}
                  onRestart={restart}
                  onBack={back}
                  whatsapp={whatsappLink(site)}
                />
              )}
            </motion.div>
          </AnimatePresence>

          {step === 'moment' && (
            <p className="mt-10 text-center text-[0.88rem] text-ocean-800/60">
              <Link to="/treatments" className="font-semibold text-lagoon-700 underline-offset-4 hover:underline">
                {t('find.intro_note')}
              </Link>
            </p>
          )}
        </Container>
      </Section>
    </div>
  )
}

/* ------------------------------------------------------------- fragments */

function Heading({ kicker, title, sub }: { kicker?: string; title: string; sub?: string }) {
  return (
    <header>
      {kicker && (
        <p className="mb-2 text-[0.72rem] font-bold tracking-[0.2em] text-lagoon-700 uppercase">{kicker}</p>
      )}
      <h1 className="font-display text-[1.9rem] leading-[1.12] text-ocean-950 sm:text-[2.6rem]">{title}</h1>
      {sub && <p className="mt-3 max-w-2xl leading-relaxed text-ocean-800/70">{sub}</p>}
    </header>
  )
}

const secondaryAction =
  'inline-flex h-13 min-h-12 w-full items-center justify-center gap-2 rounded-full border border-ocean-900/15 bg-white/70 px-6 text-center font-semibold whitespace-nowrap text-ocean-950 transition-colors hover:border-lagoon-400/60 hover:bg-white sm:w-auto'

function readParam<T extends string>(raw: string | null, guard: (value: unknown) => value is T): T | undefined {
  return raw && guard(raw) ? raw : undefined
}

/* --------------------------------------------------------------- results */

function Results({
  result,
  answers,
  services,
  venues,
  currency,
  venueName,
  altIndex,
  onAnother,
  onRestart,
  onBack,
  whatsapp,
}: {
  result: MatchResult
  answers: GuestAnswers
  services: Service[]
  venues: Venue[]
  currency: string
  venueName?: string
  altIndex: number
  onAnother: () => void
  onRestart: () => void
  onBack: () => void
  whatsapp: string
}) {
  const t = useT()

  /* ---- the honest stop: today is not the day for a massage ------------ */
  if (result.outcome === 'rest') {
    return (
      <section className="rounded-[2.25rem] border border-white/70 bg-white/85 p-7 shadow-lift ring-1 ring-sky-900/5 backdrop-blur-sm sm:p-10">
        <h1 className="font-display text-[1.9rem] leading-tight text-ocean-950 sm:text-[2.4rem]">
          {t('find.rest_title')}
        </h1>
        <p className="mt-4 leading-relaxed text-ocean-800/80">{t('find.rest_body')}</p>
        <div className="mt-8 flex flex-wrap gap-3">
          <a
            href={whatsapp}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex h-13 min-h-12 items-center justify-center gap-2.5 rounded-full bg-[#25D366] px-7 font-bold text-[#062e17] shadow-soft transition-transform hover:scale-[1.02]"
          >
            <MessageCircle className="size-5" strokeWidth={2.4} />
            {t('find.rest_cta')}
          </a>
          <button
            type="button"
            onClick={onBack}
            className="inline-flex h-13 min-h-12 items-center justify-center gap-2 rounded-full border border-ocean-900/15 bg-white/70 px-6 font-semibold text-ocean-950 transition-colors hover:border-lagoon-400/60"
          >
            <ArrowLeft className="size-4" />
            {t('find.rest_back')}
          </button>
        </div>
      </section>
    )
  }

  const primary = result.matches[altIndex % Math.max(result.matches.length, 1)]
  const others = result.matches.filter((entry) => entry !== primary)

  return (
    <div>
      <header className="mb-7">
        <p className="mb-2 text-[0.72rem] font-bold tracking-[0.2em] text-lagoon-700 uppercase">
          {t('find.result_kicker')}
        </p>
        <h1 className="font-display text-[1.9rem] leading-[1.12] text-ocean-950 sm:text-[2.4rem]">
          {t('find.result_lead')}
        </h1>
      </header>

      {/* ---- talk to us first, then a gentler suggestion --------------- */}
      {result.outcome === 'care' && (
        <section className="mb-7 rounded-[1.75rem] border border-sun-300/70 bg-sun-100/70 p-5 sm:p-6">
          <h2 className="font-display text-[1.3rem] text-ocean-950">{t('find.care_title')}</h2>
          <p className="mt-2.5 text-[0.95rem] leading-relaxed text-ocean-800/80">{t('find.care_body')}</p>
          <a
            href={whatsapp}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-4 inline-flex h-12 min-h-12 items-center gap-2.5 rounded-full bg-[#25D366] px-6 font-bold text-[#062e17] shadow-soft transition-transform hover:scale-[1.02]"
          >
            <MessageCircle className="size-4.5" strokeWidth={2.4} />
            {t('find.care_cta')}
          </a>
        </section>
      )}

      {result.fallback && result.matches.length > 0 && (
        <p className="mb-6 rounded-[1.4rem] bg-sky-50 p-4 text-[0.9rem] leading-relaxed text-ocean-800/75 ring-1 ring-sky-200/70">
          {t('find.fallback_note')}
        </p>
      )}

      {primary && (
        <JourneyResult
          match={primary}
          answers={answers}
          services={services}
          venues={venues}
          currency={currency}
          venueName={venueName}
        />
      )}

      {result.matches.length === 0 && (
        <p className="rounded-[1.4rem] bg-sky-50 p-5 text-center leading-relaxed text-ocean-800/75">
          {t('find.fallback_note')}
        </p>
      )}

      {/*
        Stacked on a phone rather than squeezed onto one row — three buttons
        side by side wrapped every label onto two cramped lines.
      */}
      <div className="mt-6 grid gap-3 sm:flex sm:flex-wrap">
        {result.matches.length > 1 && (
          <button type="button" onClick={onAnother} className={secondaryAction}>
            <RotateCcw className="size-4" />
            {t('find.cta_another')}
          </button>
        )}
        <Link to="/treatments" className={secondaryAction}>
          {t('find.cta_all')}
        </Link>
        <button
          type="button"
          onClick={onRestart}
          className="inline-flex h-12 items-center justify-center gap-2 rounded-full px-5 text-[0.88rem] font-semibold text-ocean-800/60 transition-colors hover:text-ocean-950"
        >
          {t('find.restart')}
        </button>
      </div>

      {others.length > 0 && (
        <section className="mt-12">
          <h2 className={cn('font-display text-[1.35rem] text-ocean-950')}>{t('find.alt_title')}</h2>
          <div className="mt-5 grid gap-4 sm:grid-cols-2">
            {others.map((entry) => (
              <JourneyResult
                key={entry.journey.id}
                match={entry}
                answers={answers}
                services={services}
                venues={venues}
                currency={currency}
                venueName={venueName}
                primary={false}
              />
            ))}
          </div>
        </section>
      )}
    </div>
  )
}
