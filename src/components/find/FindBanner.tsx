import { Link } from 'react-router-dom'
import { ArrowRight } from 'lucide-react'
import type { MassageJourney } from '@shared/types'
import { useT } from '@/lib/translations/LanguageProvider'
import { moodFor, MOMENT_ICONS } from '@/lib/journey-ui'
import { sortByOrder, cn } from '@/lib/utils'
import { Motif } from '@/components/art/Motif'
import { Container, Section } from '@/components/ui/Section'
import { Reveal } from '@/components/ui/Reveal'
import { LeafBlob, MonsteraLeaf, OilSheen } from '@/components/art/Decor'

/**
 * The front door, on the home page directly under the hero.
 *
 * The catalogue is the reference library; this is the way in for the guest who
 * does not know a Swedish massage from a lymphatic one and should not have to.
 * The quick paths are shortcuts straight past the first question for the cases
 * that need no explaining at all.
 */
export function FindBanner({ journeys }: { journeys: MassageJourney[] }) {
  const t = useT()

  /*
   * Quick paths come from the journeys the owner marked as featured, reduced
   * to the distinct opening answers they cover. Content decides what is on the
   * home page — not a list hard-coded here.
   */
  const quickPaths = (() => {
    const seen = new Set<string>()
    const paths: Array<{ moment: string; journey: MassageJourney }> = []
    for (const journey of sortByOrder(journeys).filter((entry) => entry.featured)) {
      const moment = journey.guestTags?.[0]
      if (!moment || seen.has(moment)) continue
      seen.add(moment)
      paths.push({ moment, journey })
    }
    return paths.slice(0, 5)
  })()

  return (
    <Section className="relative overflow-hidden py-16 sm:py-24">
      <OilSheen className="opacity-60" />
      <Container className="relative">
        <div className="relative overflow-hidden rounded-[2.5rem] border border-white/70 bg-white/80 p-7 shadow-lift ring-1 ring-sky-900/5 backdrop-blur-sm sm:p-11">
          {/*
            Desktop gets the concierge panel the brief asked for: the questions
            on the left, tropical atmosphere on the right. On a phone the art is
            dropped entirely rather than stacked — it would push the button
            below the fold, and the button is the point.
          */}
          <div className="pointer-events-none absolute -top-16 -right-24 hidden w-[30rem] lg:block" aria-hidden>
            <LeafBlob className="absolute inset-0 text-seafoam-200/70" />
            <MonsteraLeaf className="absolute top-10 right-16 w-64 text-palm-300/60 animate-sway" />
            <MonsteraLeaf className="absolute top-40 right-52 w-44 text-lagoon-300/50" mirrored />
          </div>

          <div className="relative max-w-2xl lg:max-w-[34rem]">
            <p className="text-[0.72rem] font-bold tracking-[0.2em] text-lagoon-800 uppercase">
              {t('find.home_kicker')}
            </p>
            <h2 className="mt-3 font-display text-[2rem] leading-[1.1] text-ocean-950 sm:text-[2.8rem]">
              {t('find.home_title')}
            </h2>
            <p className="mt-4 leading-relaxed text-ocean-800/85">{t('find.home_lead')}</p>

            <Link
              to="/find-your-massage"
              className="mt-7 inline-flex h-14 items-center justify-center gap-2.5 rounded-full bg-gradient-to-r from-sky-700 to-lagoon-600 px-8 text-[1rem] font-bold text-sand-50 shadow-soft transition-all duration-300 hover:brightness-110"
            >
              {t('find.home_cta')}
              <ArrowRight className="size-4.5" />
            </Link>
          </div>

          {quickPaths.length > 0 && (
            <div className="relative mt-9">
              <p className="text-[0.78rem] font-semibold text-ocean-800/85">{t('find.quick_paths')}</p>
              <div className="no-scrollbar edge-fade -mx-7 mt-3 flex gap-2.5 overflow-x-auto px-7 sm:mx-0 sm:flex-wrap sm:px-0">
                {quickPaths.map(({ moment, journey }) => {
                  const mood = moodFor(moment as never)
                  return (
                    <Link
                      key={moment}
                      to={`/find-your-massage?m=${moment}`}
                      className={cn(
                        'inline-flex min-h-12 shrink-0 items-center gap-2.5 rounded-full border border-ocean-900/12 bg-white/70 py-2.5 pr-5 pl-2.5 text-[0.88rem] font-semibold text-ocean-950 transition-colors hover:border-lagoon-400/60 hover:bg-white',
                      )}
                    >
                      <span
                        className={cn(
                          'grid size-8 shrink-0 place-items-center rounded-[46%_54%_48%_52%/52%_48%_52%_48%] bg-gradient-to-br text-sand-50',
                          mood.accent,
                        )}
                      >
                        <Motif name={MOMENT_ICONS[moment as never]} className="size-4" />
                      </span>
                      {journey.name}
                    </Link>
                  )
                })}
              </div>
            </div>
          )}
        </div>
      </Container>
    </Section>
  )
}

/** The compact version, for the top of the treatments catalogue. */
export function FindPrompt() {
  const t = useT()
  return (
    <Reveal>
      <Link
        to="/find-your-massage"
        className="group flex flex-wrap items-center gap-x-4 gap-y-2 rounded-[1.75rem] border border-lagoon-300/60 bg-gradient-to-br from-seafoam-50 to-sky-50 p-5 transition-colors hover:border-lagoon-400 sm:p-6"
      >
        <span className="min-w-0 flex-1">
          <span className="block font-display text-[1.2rem] text-ocean-950">{t('find.treatments_prompt')}</span>
          <span className="mt-0.5 block text-[0.9rem] text-ocean-800/80">{t('find.treatments_lead')}</span>
        </span>
        <span className="inline-flex h-12 shrink-0 items-center gap-2 rounded-full bg-gradient-to-r from-sky-700 to-lagoon-600 px-6 text-[0.9rem] font-bold whitespace-nowrap text-sand-50 shadow-soft transition-transform group-hover:scale-[1.02]">
          {t('find.home_cta')}
          <ArrowRight className="size-4" />
        </span>
      </Link>
    </Reveal>
  )
}
