import { useEffect } from 'react'
import type { Faq, Service, SiteSettings } from '@shared/types'

/* ------------------------------------------------------------- head tags */

function upsertMeta(attr: 'name' | 'property', key: string, value: string) {
  let tag = document.head.querySelector<HTMLMetaElement>(`meta[${attr}="${key}"]`)
  if (!tag) {
    tag = document.createElement('meta')
    tag.setAttribute(attr, key)
    document.head.appendChild(tag)
  }
  tag.setAttribute('content', value)
}

function upsertLink(rel: string, href: string) {
  let tag = document.head.querySelector<HTMLLinkElement>(`link[rel="${rel}"]`)
  if (!tag) {
    tag = document.createElement('link')
    tag.setAttribute('rel', rel)
    document.head.appendChild(tag)
  }
  tag.setAttribute('href', href)
}

export interface SeoInput {
  title: string
  description: string
  path: string
  /** Keeps a page out of search results — used for /admin. */
  noindex?: boolean
}

/**
 * Per-route title, description, canonical and Open Graph tags. Static crawlers
 * that do not run JavaScript still get the defaults baked into index.html; this
 * sharpens things for Google, which does render.
 */
export function useSeo({ title, description, path, noindex = false }: SeoInput) {
  useEffect(() => {
    const url = `${window.location.origin}${path}`
    document.title = title
    upsertMeta('name', 'description', description)
    upsertMeta('property', 'og:title', title)
    upsertMeta('property', 'og:description', description)
    upsertMeta('property', 'og:url', url)
    upsertMeta('name', 'twitter:title', title)
    upsertMeta('name', 'twitter:description', description)
    upsertLink('canonical', url)
    upsertMeta('name', 'robots', noindex ? 'noindex, nofollow' : 'index, follow')
  }, [title, description, path, noindex])
}

/* ---------------------------------------------------------- structured data */

const DAY_WORDS: Array<[RegExp, string]> = [
  [/monday|lunes/i, 'Monday'],
  [/tuesday|martes/i, 'Tuesday'],
  [/wednesday|mi[eé]rcoles/i, 'Wednesday'],
  [/thursday|jueves/i, 'Thursday'],
  [/friday|viernes/i, 'Friday'],
  [/saturday|s[aá]bado/i, 'Saturday'],
  [/sunday|domingo/i, 'Sunday'],
]

const WEEK = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday']

/**
 * Hours are free text in the CMS ("Monday – Saturday", "9:00 – 21:00"), so this
 * only emits a specification when both halves parse cleanly. Anything it cannot
 * read with confidence is skipped rather than guessed at.
 */
function openingHours(hours: SiteSettings['hours']) {
  const specs: Array<Record<string, unknown>> = []

  for (const entry of hours) {
    const times = entry.value.match(/(\d{1,2}:\d{2})\s*[–—-]\s*(\d{1,2}:\d{2})/)
    if (!times) continue

    const named = DAY_WORDS.filter(([pattern]) => pattern.test(entry.label)).map(([, day]) => day)
    if (named.length === 0) continue

    // "Monday – Saturday" names two days but means the range between them.
    let days = named
    if (named.length === 2 && /[–—-]|to|a\s/i.test(entry.label)) {
      const from = WEEK.indexOf(named[0])
      const to = WEEK.indexOf(named[1])
      if (from >= 0 && to >= from) days = WEEK.slice(from, to + 1)
    }

    specs.push({
      '@type': 'OpeningHoursSpecification',
      dayOfWeek: days,
      opens: times[1].padStart(5, '0'),
      closes: times[2].padStart(5, '0'),
    })
  }

  return specs
}

export function localBusinessSchema(
  site: SiteSettings,
  services: Service[],
  payments: string[],
  origin: string,
) {
  const specs = openingHours(site.hours)

  return {
    '@context': 'https://schema.org',
    '@type': ['HealthAndBeautyBusiness', 'DaySpa'],
    '@id': `${origin}/#business`,
    name: site.brandName,
    description: site.tagline,
    url: origin,
    image: `${origin}/og.jpg`,
    ...(site.phoneDisplay ? { telephone: site.phoneDisplay.replace(/\s/g, '') } : {}),
    ...(site.email ? { email: site.email } : {}),
    address: {
      '@type': 'PostalAddress',
      streetAddress: site.addressLine,
      addressLocality: site.neighborhood,
      addressRegion: site.city,
      addressCountry: 'DO',
    },
    areaServed: [site.neighborhood, site.city, 'Punta Cana', 'Cap Cana', 'Uvero Alto'].filter(Boolean),
    ...(specs.length ? { openingHoursSpecification: specs } : {}),
    priceRange: '$$',
    currenciesAccepted: 'USD, DOP',
    ...(payments.length ? { paymentAccepted: payments.join(', ') } : {}),
    knowsLanguage: site.languages,
    sameAs: [site.instagram, site.facebook, site.tiktok].filter(Boolean),
    hasOfferCatalog: {
      '@type': 'OfferCatalog',
      name: 'Massage treatments',
      itemListElement: services.map((service) => ({
        '@type': 'Offer',
        priceCurrency: site.currency,
        ...(service.durations[0] ? { price: String(service.durations[0].price) } : {}),
        itemOffered: {
          '@type': 'Service',
          name: service.name,
          description: service.tagline || service.description,
          serviceType: service.category,
        },
      })),
    },
  }
}

export function faqSchema(faqs: Faq[]) {
  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faqs.map((faq) => ({
      '@type': 'Question',
      name: faq.question,
      acceptedAnswer: { '@type': 'Answer', text: faq.answer },
    })),
  }
}

/** Writes one or more JSON-LD blocks into <head>, replacing the previous set. */
export function useJsonLd(blocks: Array<Record<string, unknown>>) {
  const serialised = JSON.stringify(blocks)
  useEffect(() => {
    const parsed = JSON.parse(serialised) as Array<Record<string, unknown>>
    const nodes = parsed.map((block) => {
      const script = document.createElement('script')
      script.type = 'application/ld+json'
      script.dataset.seo = 'true'
      script.textContent = JSON.stringify(block)
      document.head.appendChild(script)
      return script
    })
    return () => nodes.forEach((node) => node.remove())
  }, [serialised])
}
