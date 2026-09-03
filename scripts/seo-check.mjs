/**
 * Checks what search engines and link-preview crawlers actually see: a distinct
 * title, description and canonical per route, /admin kept out of the index, and
 * LocalBusiness + FAQPage structured data built from the live KV content.
 *
 * Start the Functions layer first:  npm run cf:dev
 * Then:                             npm run test:seo
 */
import { chromium } from 'playwright'
const BASE = process.env.BASE_URL ?? 'http://127.0.0.1:8788'
const browser = await chromium.launch(
  process.env.CHROMIUM_PATH ? { executablePath: process.env.CHROMIUM_PATH } : {},
)
const ctx = await browser.newContext({ viewport: { width: 1280, height: 900 } })
const page = await ctx.newPage()
let bad = 0
const ok = (l, p) => { console.log(`${p ? 'PASS' : 'FAIL'}  ${l}`); if (!p) bad++ }

for (const path of ['/', '/treatments', '/find-your-massage', '/discover', '/team', '/book', '/admin']) {
  await page.goto(BASE + path, { waitUntil: 'networkidle' })
  await page.waitForTimeout(1100)
  const r = await page.evaluate(() => ({
    title: document.title,
    desc: document.querySelector('meta[name=description]')?.content ?? '',
    canonical: document.querySelector('link[rel=canonical]')?.href ?? '',
    robots: document.querySelector('meta[name=robots]')?.content ?? '',
    ld: [...document.querySelectorAll('script[type="application/ld+json"]')].map((s) => JSON.parse(s.textContent)),
  }))
  console.log(`\n${path}`)
  console.log(`  title     ${r.title}`)
  console.log(`  canonical ${r.canonical}`)
  console.log(`  robots    ${r.robots}`)
  console.log(`  ld types  ${r.ld.map((b) => (Array.isArray(b['@type']) ? b['@type'].join('+') : b['@type'])).join(', ') || '—'}`)
  if (path === '/admin') {
    ok('admin is noindex', r.robots.includes('noindex'))
  } else {
    ok(`${path} has a unique descriptive title`, r.title.length > 20)
    ok(`${path} has a description`, r.desc.length > 60)
    ok(`${path} canonical matches the route`, r.canonical.endsWith(path === '/' ? '/' : path))
    ok(`${path} is indexable`, r.robots.includes('index') && !r.robots.includes('noindex'))
  }
  if (path === '/') {
    const biz = r.ld.find((b) => String(b['@type']).includes('DaySpa'))
    ok('LocalBusiness schema present', Boolean(biz))
    ok('  ...with a postal address', Boolean(biz?.address?.streetAddress))
    ok('  ...with opening hours parsed from free text', Array.isArray(biz?.openingHoursSpecification) && biz.openingHoursSpecification.length > 0)
    ok('  ...with the treatment catalogue', (biz?.hasOfferCatalog?.itemListElement ?? []).length >= 10)
    ok('  ...with payment methods', typeof biz?.paymentAccepted === 'string')
    ok('  ...and no self-serving review rating', !('aggregateRating' in (biz ?? {})))
    console.log('  hours →', JSON.stringify(biz?.openingHoursSpecification))
    ok('FAQPage schema present', r.ld.some((b) => b['@type'] === 'FAQPage'))
  }
}

// titles must differ between routes
const titles = []
for (const p of ['/', '/treatments', '/discover', '/team', '/book']) {
  await page.goto(BASE + p, { waitUntil: 'networkidle' })
  await page.waitForTimeout(800)
  titles.push(await page.title())
}
ok('every route has a distinct title', new Set(titles).size === titles.length)

// JSON-LD must not pile up when navigating client-side
await page.goto('http://127.0.0.1:8788/', { waitUntil: 'networkidle' })
await page.waitForTimeout(900)
for (const label of ['Treatments', 'Discover Bávaro', 'Home']) {
  await page.getByRole('navigation').first().getByRole('link', { name: label, exact: true }).click()
  await page.waitForTimeout(700)
}
const count = await page.evaluate(() => document.querySelectorAll('script[type="application/ld+json"]').length)
ok(`JSON-LD blocks do not accumulate across navigation (found ${count})`, count === 2)

console.log(bad ? `\n${bad} FAILED` : '\nAll SEO checks passed.')
await browser.close()
process.exit(bad ? 1 : 0)
