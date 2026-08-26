/**
 * End-to-end check of the whole content pipeline: sign in with the default
 * password, create / edit / reorder / delete a treatment, save settings, and
 * confirm each change reaches KV and shows up on the public pages.
 *
 * Start the Functions layer first:  npm run cf:dev
 * Then:                             npm run test:e2e
 *
 * Everything is restored to the seed content at the end.
 */
import { chromium } from 'playwright'

const BASE = process.env.BASE_URL ?? 'http://127.0.0.1:8788'
const browser = await chromium.launch(
  process.env.CHROMIUM_PATH ? { executablePath: process.env.CHROMIUM_PATH } : {},
)
const ctx = await browser.newContext({ viewport: { width: 1440, height: 950 } })
const page = await ctx.newPage()
const fails = []
const ok = (label, pass) => { console.log(`${pass ? 'PASS' : 'FAIL'}  ${label}`); if (!pass) fails.push(label) }

await page.goto(BASE + '/admin', { waitUntil: 'networkidle' })
await page.fill('input[type=password]', 'massage')
await page.click('button[type=submit]')
await page.waitForSelector('text=Hola,', { timeout: 15000 })
ok('sign in with default password', true)

// --- UPDATE ---------------------------------------------------------------
await page.getByRole('navigation', { name: 'Admin sections' }).getByText('Treatments', { exact: true }).first().click()
await page.waitForTimeout(600)
await page.getByRole('button', { name: /Full Body Relaxing Massage/ }).first().click()
await page.waitForTimeout(500)
const nameInput = page.locator('li:has-text("Full Body Relaxing Massage") input').first()
await nameInput.fill('Sunset Full Body Massage')
await page.getByRole('button', { name: 'Save changes' }).click()
await page.waitForSelector('text=Saved', { timeout: 15000 })
ok('edit + save a treatment', true)

const afterUpdate = await page.evaluate(async () => (await (await fetch('/api/content', { cache: 'no-store' })).json()).services.map(s => s.name))
ok('rename is live on the public API', afterUpdate.includes('Sunset Full Body Massage'))

// --- CREATE ---------------------------------------------------------------
await page.getByRole('button', { name: /Add treatment/ }).click()
await page.waitForTimeout(400)
const newRow = page.locator('li:has-text("Untitled treatment")').first()
await newRow.locator('input').first().fill('Bamboo Massage')
await page.getByRole('button', { name: 'Save changes' }).click()
await page.waitForSelector('text=Saved', { timeout: 15000 })
const afterCreate = await page.evaluate(async () => (await (await fetch('/api/content', { cache: 'no-store' })).json()).services.map(s => s.name))
ok('create a treatment', afterCreate.includes('Bamboo Massage'))
ok('count grew by one', afterCreate.length === afterUpdate.length + 1)

// --- REORDER --------------------------------------------------------------
const firstBefore = afterCreate[0]
await page.locator('li').filter({ hasText: 'Deep Tissue & Sports' }).first().getByRole('button', { name: 'Move up' }).click()
await page.getByRole('button', { name: 'Save changes' }).click()
await page.waitForSelector('text=Saved', { timeout: 15000 })
const afterMove = await page.evaluate(async () => {
  const c = await (await fetch('/api/content', { cache: 'no-store' })).json()
  return [...c.services].sort((a, b) => a.order - b.order).map(s => s.name)
})
ok('reorder persists', afterMove[0] === 'Deep Tissue & Sports' && firstBefore !== 'Deep Tissue & Sports')

// --- DELETE ---------------------------------------------------------------
await page.locator('li').filter({ hasText: 'Bamboo Massage' }).first().getByRole('button', { name: 'Delete' }).click()
await page.getByRole('button', { name: 'Save changes' }).click()
await page.waitForSelector('text=Saved', { timeout: 15000 })
const afterDelete = await page.evaluate(async () => (await (await fetch('/api/content', { cache: 'no-store' })).json()).services.map(s => s.name))
ok('delete a treatment', !afterDelete.includes('Bamboo Massage'))

// --- SETTINGS -------------------------------------------------------------
await page.getByRole('navigation', { name: 'Admin sections' }).getByText('Site settings', { exact: true }).first().click()
await page.waitForTimeout(500)
await page.getByRole('button', { name: 'Contact & WhatsApp' }).click()
await page.waitForTimeout(400)
await page.locator('input').first().fill('18095557777')
await page.getByRole('button', { name: 'Save changes' }).click()
await page.waitForSelector('text=Saved', { timeout: 15000 })
const site = await page.evaluate(async () => (await (await fetch('/api/content', { cache: 'no-store' })).json()).site)
ok('settings save reaches KV', site.whatsapp === '18095557777')

// --- PUBLIC SITE REFLECTS IT ---------------------------------------------
await page.goto(BASE + '/treatments', { waitUntil: 'networkidle' })
await page.waitForTimeout(1200)
const bodyText = await page.textContent('body')
ok('public page shows the renamed treatment', bodyText.includes('Sunset Full Body Massage'))
const waHref = await page.getAttribute('a[href*="wa.me"]', 'href')
ok('WhatsApp links use the saved number', waHref.includes('18095557777'))

// --- BOOKING FLOW ---------------------------------------------------------
await page.goto(BASE + '/book', { waitUntil: 'networkidle' })
await page.waitForTimeout(900)
await page.getByRole('button', { name: /Hot Stone Massage/ }).first().click()
await page.getByPlaceholder('How should we greet you?').fill('Playwright Guest')
await page.getByPlaceholder(/Resort name/).fill('Test Resort, room 9')
const sendEnabled = await page.getByRole('button', { name: /Send on WhatsApp/ }).isEnabled()
ok('reserve button unlocks once the form is valid', sendEnabled)
const preview = await page.textContent('details pre')
ok('WhatsApp message is assembled', preview.includes('Hot Stone Massage') && preview.includes('Playwright Guest'))

// --- RESTORE --------------------------------------------------------------
await page.goto(BASE + '/admin', { waitUntil: 'networkidle' })
await page.waitForSelector('text=Hola,', { timeout: 15000 })
await page.evaluate(async () => {
  await fetch('/api/admin/reset', { method: 'POST', headers: { 'content-type': 'application/json' }, body: JSON.stringify({ section: 'all' }) })
})
const restored = await page.evaluate(async () => (await (await fetch('/api/content', { cache: 'no-store' })).json()))
ok('restore defaults brings back the seed', restored.services.length === 13 && restored.site.whatsapp === '18095550123')

console.log(fails.length ? `\n${fails.length} FAILED: ${fails.join(', ')}` : '\nAll checks passed.')
await browser.close()
process.exit(fails.length ? 1 : 0)
