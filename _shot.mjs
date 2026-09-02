import { chromium } from 'playwright'
const dir = '/tmp/claude-0/-home-user-massage/605f16c1-a2f2-5b60-aacc-fb1021da9981/scratchpad'
const b = await chromium.launch({ executablePath: '/opt/pw-browsers/chromium' })
const errors = []
const page = await b.newPage({ viewport: { width: 390, height: 844 }, deviceScaleFactor: 2 })
page.on('console', m => { if (m.type() === 'error') errors.push(m.text()) })
page.on('pageerror', e => errors.push('PAGEERROR: ' + e.message))

await page.goto('http://localhost:4178/find-your-massage', { waitUntil: 'networkidle' })
await page.screenshot({ path: `${dir}/1-moment.png` })

await page.getByRole('button', { name: /had an adventure/i }).click()
await page.waitForTimeout(600)
await page.screenshot({ path: `${dir}/2-feel.png` })

await page.getByRole('button', { name: /firm and focused/i }).click()
await page.waitForTimeout(600)
await page.screenshot({ path: `${dir}/3-venue.png` })

const venueBtns = await page.locator('button[aria-pressed]').all()
await venueBtns[0].click()
await page.waitForTimeout(600)
await page.screenshot({ path: `${dir}/4-comfort.png` })

await page.getByRole('button', { name: /none of these/i }).click()
await page.waitForTimeout(800)
await page.screenshot({ path: `${dir}/5-result.png`, fullPage: true })

const heading = await page.locator('h3').first().textContent()
const bookHref = await page.getByRole('link', { name: /book this massage/i }).first().getAttribute('href')
console.log('RESULT JOURNEY:', heading)
console.log('BOOK HREF:', bookHref)
console.log('URL:', page.url())
console.log('ERRORS:', errors.length ? errors : 'none')
await b.close()
