import { useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { MapPin, Search, Sparkles, X } from 'lucide-react'
import { useContent } from '@/lib/content-store'
import { cn, sortByOrder } from '@/lib/utils'
import { Container, Section, SectionHead } from '@/components/ui/Section'
import { Reveal } from '@/components/ui/Reveal'
import { SpotCard } from '@/components/sections/cards'
import { PageHeader } from '@/components/sections/PageHeader'
import { CtaBand } from '@/components/sections/blocks'
import { Pill } from '@/components/ui/Bits'

const ORDER = ['Beach', 'Eat & Drink', 'Excursion', 'Nightlife', 'Shopping', 'Essentials', 'Getting around']

export function Discover() {
  const { content } = useContent()
  const spots = useMemo(() => sortByOrder(content.discover), [content.discover])

  const categories = useMemo(() => {
    const present = new Set(spots.map((spot) => spot.category))
    return ['All', ...ORDER.filter((category) => present.has(category))]
  }, [spots])

  const [active, setActive] = useState('All')
  const [query, setQuery] = useState('')

  const shown = useMemo(() => {
    const needle = query.trim().toLowerCase()
    return spots.filter((spot) => {
      if (active !== 'All' && spot.category !== active) return false
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
        kicker={`${content.site.neighborhood} · ${content.site.city}`}
        title="The guide we give"
        script="our own friends"
        lead="Five of us live and work on this beach. Here is what is genuinely worth your time within a short walk of the studio — plus the practical things that make a first trip to the Dominican Republic easier."
      >
        <div className="mt-9 flex flex-wrap gap-2">
          <Pill tone="glass">
            <MapPin className="size-3.5" />
            {walkable} places within a 10-minute walk
          </Pill>
          <Pill tone="glass">
            <Sparkles className="size-3.5" />
            {spots.length} local tips
          </Pill>
        </div>
      </PageHeader>

      {/* Sticky filter rail — the primary control on a phone. */}
      <div className="sticky top-[var(--header-h,0px)] z-30 border-b border-ocean-900/8 bg-sand-50/95 backdrop-blur-xl">
        <Container className="py-3">
          <div className="flex items-center gap-3">
            <div className="relative flex-1">
              <Search className="pointer-events-none absolute top-1/2 left-4 size-4 -translate-y-1/2 text-ocean-800/40" />
              <input
                type="search"
                value={query}
                onChange={(event) => setQuery(event.target.value)}
                placeholder="Search beaches, food, tips…"
                aria-label="Search the guide"
                className="h-11 w-full rounded-full border border-ocean-900/10 bg-white/80 pr-10 pl-11 text-[0.92rem] text-ocean-900 placeholder:text-ocean-800/40 focus:border-lagoon-400 focus:outline-none"
              />
              {query && (
                <button
                  type="button"
                  onClick={() => setQuery('')}
                  aria-label="Clear search"
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
                    ? 'bg-ocean-900 text-sand-50 shadow-soft'
                    : 'border border-ocean-900/12 text-ocean-800/70 hover:border-ocean-900/25 hover:text-ocean-900',
                )}
              >
                {category}
              </button>
            ))}
          </div>
        </Container>
      </div>

      <Section className="py-12 sm:py-16">
        <Container>
          <p className="text-[0.82rem] font-semibold text-ocean-800/50">
            {shown.length} {shown.length === 1 ? 'place' : 'places'}
            {active !== 'All' && ` in ${active}`}
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
              <p className="font-display text-2xl text-ocean-900">Nothing matched that.</p>
              <p className="mt-2 text-ocean-800/60">Try a different word, or ask us on WhatsApp — we know the answer.</p>
              <button
                type="button"
                onClick={() => {
                  setQuery('')
                  setActive('All')
                }}
                className="mt-6 inline-flex h-11 items-center rounded-full bg-ocean-900 px-6 text-[0.9rem] font-semibold text-sand-50"
              >
                Reset the guide
              </button>
            </div>
          )}
        </Container>
      </Section>

      <Section tone="cream" className="grain py-20 sm:py-28">
        <Container>
          <SectionHead
            eyebrow="Plan the day around it"
            title="Massage pairs well with"
            script="an excursion day"
            lead="Saona, Macao, Hoyo Azul — they are long days on your feet. The evening after is when a massage does the most good, and we work until 22:00."
          />
          <Reveal delay={0.12}>
            <div className="mt-10 flex flex-wrap gap-3">
              <Link
                to="/book"
                className="inline-flex h-13 items-center rounded-full bg-coral-500 px-7 py-3.5 text-[0.95rem] font-bold text-white shadow-soft transition-colors hover:bg-coral-600"
              >
                Reserve an evening slot
              </Link>
              <Link
                to="/treatments"
                className="inline-flex h-13 items-center rounded-full border border-ocean-900/15 px-7 py-3.5 text-[0.95rem] font-semibold text-ocean-900 transition-colors hover:bg-ocean-900/5"
              >
                See treatments
              </Link>
            </div>
          </Reveal>
        </Container>
      </Section>

      <CtaBand />
    </>
  )
}
