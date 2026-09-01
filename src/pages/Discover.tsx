import { useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { MapPin, Search, Sparkles, X } from 'lucide-react'
import { useContent } from '@/lib/content-store'
import { useT } from '@/lib/translations/LanguageProvider'
import { useSeo } from '@/lib/seo'
import { cn, sortByOrder } from '@/lib/utils'
import { orderSpotCategories } from '@/lib/taxonomy'
import { Container, Section, SectionHead } from '@/components/ui/Section'
import { Reveal } from '@/components/ui/Reveal'
import { SpotCard } from '@/components/sections/cards'
import { GoogleMap } from '@/components/ui/GoogleMap'
import { OilSheen } from '@/components/art/Decor'
import { PageHeader } from '@/components/sections/PageHeader'
import { CtaBand } from '@/components/sections/blocks'
import { Pill } from '@/components/ui/Bits'

/** Sentinel for "no category filter" — never shown to the reader as-is. */
const ALL = ' all'

export function Discover() {
  const { content } = useContent()
  const t = useT()
  const site = content.site
  const spots = useMemo(() => sortByOrder(content.discover), [content.discover])

  useSeo({
    path: '/discover',
    title: `${t('discover.title')} ${t('discover.script')} · ${site.brandName}`,
    description: t('discover.lead'),
  })

  // Labels are whatever the content says in this language; the canonical order
  // is applied by `orderSpotCategories`, which understands both languages.
  const categories = useMemo(
    () => [ALL, ...orderSpotCategories(spots.map((spot) => spot.category).filter(Boolean))],
    [spots],
  )

  const [active, setActive] = useState(ALL)
  const [query, setQuery] = useState('')

  const shown = useMemo(() => {
    const needle = query.trim().toLowerCase()
    return spots.filter((spot) => {
      if (active !== ALL && spot.category !== active) return false
      if (!needle) return true
      return [spot.name, spot.blurb, spot.tip, spot.category, ...spot.tags]
        .join(' ')
        .toLowerCase()
        .includes(needle)
    })
  }, [spots, active, query])

  const walkable = spots.filter((spot) => spot.walkMinutes > 0 && spot.walkMinutes <= 10).length

  return (
    <>
      <PageHeader
        kicker={`${site.neighborhood} · ${site.city}`}
        title={t('discover.title')}
        script={t('discover.script')}
        lead={t('discover.lead')}
      >
        <div className="mt-9 flex flex-wrap gap-2">
          <Pill tone="glass">
            <MapPin className="size-3.5" />
            {t('discover.walkable', { count: walkable })}
          </Pill>
          <Pill tone="glass">
            <Sparkles className="size-3.5" />
            {t('discover.tips', { count: spots.length })}
          </Pill>
        </div>
      </PageHeader>

      {/* Sticky filter rail — the primary control on a phone. */}
      <div className="sticky top-[var(--header-h,0px)] z-30 border-b border-sky-900/8 bg-sand-50/94 backdrop-blur-xl">
        <Container className="py-3">
          <div className="flex items-center gap-3">
            <div className="relative flex-1">
              <Search className="pointer-events-none absolute top-1/2 left-4 size-4 -translate-y-1/2 text-ocean-800/40" />
              <input
                type="search"
                value={query}
                onChange={(event) => setQuery(event.target.value)}
                placeholder={t('discover.search_placeholder')}
                aria-label={t('discover.search_label')}
                className="h-11 w-full rounded-full border border-sky-900/10 bg-white/85 pr-10 pl-11 text-[0.92rem] text-ocean-950 placeholder:text-ocean-800/40 focus:border-lagoon-400 focus:outline-none"
              />
              {query && (
                <button
                  type="button"
                  onClick={() => setQuery('')}
                  aria-label={t('discover.clear_search')}
                  className="absolute top-1/2 right-3 grid size-7 -translate-y-1/2 place-items-center rounded-full text-ocean-800/45 hover:bg-ocean-900/5"
                >
                  <X className="size-4" />
                </button>
              )}
            </div>
          </div>

          <div className="no-scrollbar edge-fade -mx-5 mt-3 flex gap-2 overflow-x-auto px-5 sm:mx-0 sm:px-0">
            {categories.map((category) => (
              <button
                key={category}
                type="button"
                onClick={() => setActive(category)}
                className={cn(
                  'shrink-0 rounded-full px-4 py-2 text-[0.82rem] font-semibold transition-all duration-300',
                  active === category
                    ? 'bg-gradient-to-r from-sky-700 to-lagoon-600 text-sand-50 shadow-soft'
                    : 'border border-ocean-900/12 bg-white/50 text-ocean-800/70 hover:border-lagoon-400/60 hover:text-ocean-950',
                )}
              >
                {category === ALL ? t('filter.all') : category}
              </button>
            ))}
          </div>
        </Container>
      </div>

      <Section className="py-12 sm:py-16">
        <Container>
          <p className="text-[0.82rem] font-semibold text-ocean-800/50">
            {shown.length === 1
              ? t('discover.count_one', { count: shown.length })
              : t('discover.count_other', { count: shown.length })}
            {active !== ALL && t('discover.count_in', { category: active })}
          </p>

          <div className="mt-6 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {shown.map((spot, index) => (
              <Reveal key={spot.id} delay={Math.min(index * 0.04, 0.28)} className="h-full">
                <SpotCard spot={spot} />
              </Reveal>
            ))}
          </div>

          {shown.length === 0 && (
            <div className="mt-16 text-center">
              <p className="font-display text-2xl text-ocean-950">{t('discover.empty_title')}</p>
              <p className="mt-2 text-ocean-800/60">{t('discover.empty_lead')}</p>
              <button
                type="button"
                onClick={() => {
                  setQuery('')
                  setActive(ALL)
                }}
                className="mt-6 inline-flex h-11 items-center rounded-full bg-gradient-to-r from-sky-700 to-lagoon-600 px-6 text-[0.9rem] font-semibold text-sand-50 shadow-soft"
              >
                {t('discover.reset')}
              </button>
            </div>
          )}
        </Container>
      </Section>

      <Section tone="cream" className="grain relative overflow-hidden py-20 sm:py-28">
        <OilSheen soft blend="normal" />
        <Container className="relative z-10">
          <SectionHead
            eyebrow={t('discover.pairs.eyebrow')}
            title={t('discover.pairs.title')}
            script={t('discover.pairs.script')}
            lead={t('discover.pairs.lead')}
          />
          <Reveal delay={0.12}>
            <div className="mt-10 flex flex-wrap gap-3">
              <Link
                to="/book"
                className="inline-flex h-14 items-center rounded-full bg-gradient-to-r from-flamingo-500 to-coral-500 px-7 text-[0.95rem] font-bold text-white shadow-soft transition-all hover:shadow-pink hover:brightness-105"
              >
                {t('discover.pairs.cta')}
              </Link>
              <Link
                to="/treatments"
                className="inline-flex h-14 items-center rounded-full border border-ocean-900/15 bg-white/60 px-7 text-[0.95rem] font-semibold text-ocean-950 backdrop-blur-sm transition-colors hover:bg-white"
              >
                {t('discover.pairs.secondary')}
              </Link>
            </div>
          </Reveal>
        </Container>
      </Section>

      {(site.mapEmbedUrl || site.mapUrl) && (
        <Section className="py-16 sm:py-20">
          <Container>
            <SectionHead
              eyebrow={t('map.eyebrow')}
              title={t('map.title')}
              script={t('map.script')}
              lead={t('map.lead', { neighborhood: site.neighborhood })}
            />
            <Reveal delay={0.1}>
              <GoogleMap
                className="mt-10"
                embedUrl={site.mapEmbedUrl}
                viewUrl={site.mapUrl}
                address={`${site.addressLine} · ${site.neighborhood}`}
              />
            </Reveal>
          </Container>
        </Section>
      )}

      <CtaBand />
    </>
  )
}
