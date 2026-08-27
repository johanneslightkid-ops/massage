/**
 * Renders public/og.jpg — the card WhatsApp, Facebook and iMessage show when
 * someone shares the site. Re-run after changing the brand name or tagline:
 *
 *   node scripts/make-og.mjs
 */
import { chromium } from 'playwright'
import { writeFileSync, mkdtempSync } from 'node:fs'
import { join } from 'node:path'
import { tmpdir } from 'node:os'

const BRAND = process.env.OG_BRAND ?? 'Ola Serena'
const MARK = process.env.OG_MARK ?? 'Massage & Beach Spa'
const LINE = process.env.OG_LINE ?? 'Los Corales · El Cortecito · Bávaro'
const TAG =
  process.env.OG_TAG ??
  'Full body, deep tissue, hot stone and couples massage — in our studio, on the beach, or in your hotel room.'

const html = `<!doctype html><html><head><meta charset="utf-8">
<link rel="preconnect" href="https://fonts.googleapis.com">
<link href="https://fonts.googleapis.com/css2?family=Fraunces:ital,opsz,wght@0,9..144,400..600;1,9..144,400&family=Manrope:wght@400..800&display=swap" rel="stylesheet">
<style>
  *{margin:0;padding:0;box-sizing:border-box}
  body{width:1200px;height:630px;overflow:hidden;font-family:Manrope,system-ui,sans-serif}
  .card{position:relative;width:1200px;height:630px;overflow:hidden;
    background:linear-gradient(180deg,#06211F 0%,#0A302E 22%,#12474A 46%,#1A7C78 66%,#3FA394 80%,#E9A23B 100%)}
  .glow{position:absolute;left:74%;bottom:24%;width:900px;height:900px;transform:translate(-50%,50%);border-radius:50%;
    background:radial-gradient(circle,rgba(255,246,226,.92) 0%,rgba(248,206,128,.5) 30%,rgba(232,140,102,.22) 52%,rgba(226,112,90,0) 72%)}
  .sun{position:absolute;left:74%;bottom:24%;width:150px;height:150px;transform:translate(-50%,50%);border-radius:50%;background:#FFF4DA;opacity:.9}
  .sea{position:absolute;inset:auto 0 0 0;height:32%;
    background:linear-gradient(180deg,#2AA396 0%,#116561 45%,#06211F 100%);
    -webkit-mask-image:linear-gradient(180deg,transparent 0,#000 30px);
    mask-image:linear-gradient(180deg,transparent 0,#000 30px)}
  .veil{position:absolute;inset:0;
    background:linear-gradient(100deg,rgba(6,33,31,.88) 0%,rgba(6,33,31,.6) 46%,rgba(6,33,31,.18) 72%,rgba(6,33,31,.42) 100%)}
  .grain{position:absolute;inset:0;opacity:.3;mix-blend-mode:soft-light;
    background-image:url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='140' height='140'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='3' stitchTiles='stitch'/%3E%3CfeColorMatrix type='saturate' values='0'/%3E%3C/filter%3E%3Crect width='140' height='140' filter='url(%23n)' opacity='0.55'/%3E%3C/svg%3E")}
  .body{position:relative;z-index:2;padding:74px 80px;height:100%;display:flex;flex-direction:column;justify-content:space-between}
  .brandrow{display:flex;align-items:center;gap:20px}
  .logo{width:76px;height:76px;border-radius:22px;background:rgba(253,250,246,.1);display:grid;place-items:center}
  .name{font-family:Fraunces,Georgia,serif;font-size:40px;color:#FDFAF6;letter-spacing:-.02em;line-height:1.05}
  .mark{font-size:14px;font-weight:800;letter-spacing:.19em;text-transform:uppercase;color:#7CD3C4;margin-top:6px}
  h1{font-family:Fraunces,Georgia,serif;font-weight:400;font-size:82px;line-height:1.02;letter-spacing:-.035em;color:#FDFAF6;max-width:16ch}
  h1 em{font-style:italic;background:linear-gradient(90deg,#F4BE63,#FBE3B6 45%,#F7B09D);-webkit-background-clip:text;background-clip:text;color:transparent}
  p{margin-top:26px;font-size:25px;line-height:1.5;color:rgba(248,241,232,.84);max-width:30ch}
  .chips{display:flex;gap:12px;align-items:center;flex-wrap:wrap}
  .chip{border:1px solid rgba(255,255,255,.24);background:rgba(255,255,255,.09);color:#F8F1E8;
    padding:11px 22px;border-radius:999px;font-size:19px;font-weight:700}
  .wa{background:#25D366;color:#062e17;border:none}
</style></head><body>
<div class="card">
  <div class="glow"></div><div class="sun"></div><div class="sea"></div><div class="veil"></div><div class="grain"></div>
  <div class="body">
    <div class="brandrow">
      <div class="logo">
        <svg width="38" height="38" viewBox="0 0 24 24" fill="none" stroke="#F4BE63" stroke-width="1.8" stroke-linecap="round">
          <path d="M2 15c3 0 3-3 6-3s3 3 6 3 3-3 6-3 3 3 6 3"/>
          <path d="M2 21c3 0 3-3 6-3s3 3 6 3 3-3 6-3 3 3 6 3" opacity=".55"/>
          <path d="M2 9c3 0 3-3 6-3s3 3 6 3 3-3 6-3 3 3 6 3" opacity=".3"/>
        </svg>
      </div>
      <div><div class="name">${BRAND}</div><div class="mark">${MARK}</div></div>
    </div>
    <div>
      <h1>Slow down to <em>island time</em></h1>
      <p>${TAG}</p>
    </div>
    <div class="chips">
      <div class="chip wa">Reserve on WhatsApp</div>
      <div class="chip">${LINE}</div>
    </div>
  </div>
</div></body></html>`

const dir = mkdtempSync(join(tmpdir(), 'og-'))
const file = join(dir, 'og.html')
writeFileSync(file, html)

const browser = await chromium.launch(
  process.env.CHROMIUM_PATH ? { executablePath: process.env.CHROMIUM_PATH } : {},
)
const page = await browser.newPage({ viewport: { width: 1200, height: 630 } })
await page.goto('file://' + file, { waitUntil: 'networkidle' })
await page.waitForTimeout(1200)
await page.screenshot({ path: 'public/og.jpg', type: 'jpeg', quality: 88 })
await browser.close()
console.log('wrote public/og.jpg')
