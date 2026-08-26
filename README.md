# Ola Serena — massage studio site for Los Corales, Bávaro

A mobile-first website for a small, women-run massage business in Los Corales / El Cortecito
(Bávaro, Punta Cana): treatments and prices, a local tourist guide to the neighbourhood,
WhatsApp reservations, payment options, and a password-protected admin where the owner can
edit **every** piece of content on the site.

Built on Cloudflare Pages: a React front end served as static assets, a Pages **Function**
for the API, and a **KV namespace** as the content store.

---

## Stack

| Layer | Choice |
| --- | --- |
| UI | React 19 + TypeScript |
| Build | Vite 8 (Rolldown) |
| Styling | Tailwind CSS v4 (CSS-first `@theme`) |
| Routing | React Router 7 |
| Motion | Motion 13 (`motion/react`) |
| Icons | lucide-react (brand marks drawn in `src/components/art/Brand.tsx`) |
| Type | Fraunces (display) + Manrope (UI), via Google Fonts |
| API | Cloudflare Pages Functions |
| Storage | Cloudflare Workers KV |
| Deploy | `wrangler pages deploy` |

No image assets ship with the site. Every card, hero and portrait falls back to a
deterministic, seeded SVG tropical scene (`src/components/art/Decor.tsx`), so the page is
fast and complete before the owner has uploaded a single photo — and any photo URL pasted
in the admin replaces the artwork.

---

## Getting started

```bash
npm install

# front end only, with hot reload (API calls proxy to :8788)
npm run dev

# the real thing: Functions + KV + static assets, exactly as deployed
npm run cf:dev          # → http://127.0.0.1:8788
```

`wrangler pages dev` uses a local KV simulation, so nothing you do locally touches
production data. The first request seeds KV from `shared/seed.ts`.

Other scripts:

```bash
npm run typecheck       # tsc --noEmit
npm run test:e2e        # full admin → KV → public site round trip (needs cf:dev running)
npm run cf:deploy       # build + deploy to Cloudflare Pages
```

> `playwright` is a dev dependency only, for `test:e2e`. It downloads a Chromium build on
> install; set `PLAYWRIGHT_SKIP_BROWSER_DOWNLOAD=1` if you only want to edit the site.

---

## Admin

Open `/admin`. **The starting password is `massage`.**

Change it immediately under **Password & data** — the admin nags about it on every screen
until you do. Passwords are stored as PBKDF2-SHA256 hashes (150k iterations, per-password
salt), never in plain text, and login is rate-limited to 10 attempts per IP per 10 minutes.

The admin can create, edit, reorder, duplicate and delete records in every collection:

- **Site settings** — brand, hero, WhatsApp number, contact, address, opening hours,
  languages, owner story, surcharges and cancellation policy
- **Treatments** — names, descriptions, benefits, categories, and any number of
  duration/price pairs per treatment
- **Packages**, **Where we work**, **Team**, **Why massage here**
- **Discover Bávaro** — the local guide: places, categories, insider tips, walking
  distances, map links, tags
- **Guest reviews**, **FAQ**, **Payment methods**, **Gallery**
- **Requests** — reservations submitted through the site's form, with status tracking
- **Password & data** — change the password, restore the starting content

Every section also has **Restore defaults**, which puts that section back to the shipped
content without touching anything else.

On a phone the site's bottom tab bar **becomes the admin menu** while you are signed in —
same bar, dark styling, horizontally scrollable through all fourteen sections, with a badge
on Requests when something new arrives. Signing out hands the public menu back.

### Adding a field

The admin forms are generated, not hand-written. To add a field to any record type:

1. add the property to the interface in `shared/types.ts`
2. add a matching entry to that collection's `fields` array in `shared/schema.ts`
3. give it a value in `shared/seed.ts`

The form control, the blank-record shape and the save path all follow automatically.
`FieldInput` supports text, textarea, number, money, boolean, list-of-strings, image URL
with preview, select, duration/price rows and label/value pairs.

---

## How the content flows

```
shared/seed.ts ──first request──▶ KV "content:v1" ──GET /api/content──▶ ContentProvider ──▶ pages
                                        ▲
                                        └── PUT /api/admin/{settings,collection/:key} ◀── /admin
```

`readContent()` merges whatever is in KV over the seed, so adding a field to the model never
500s an existing deployment — old records simply pick up the new default.

`GET /api/content` is deliberately uncached (`no-store`): KV already caches reads at the
edge, and an owner who saves in the admin expects the change on the site immediately.

### API

| Method | Path | Auth | Purpose |
| --- | --- | --- | --- |
| `GET` | `/api/content` | – | The whole content document |
| `POST` | `/api/bookings` | – | Save a reservation request |
| `POST` | `/api/admin/login` | – | Password → session cookie |
| `POST` | `/api/admin/logout` | ✓ | End the session |
| `GET` | `/api/admin/me` | – | Session state + default-password warning |
| `GET` | `/api/admin/content` | ✓ | Fresh content for the editor |
| `PUT` | `/api/admin/settings` | ✓ | Patch site settings |
| `PUT` | `/api/admin/collection/:key` | ✓ | Replace one collection |
| `POST` | `/api/admin/password` | ✓ | Change the password |
| `GET` | `/api/admin/bookings` | ✓ | List requests |
| `PATCH`/`DELETE` | `/api/admin/bookings/:id` | ✓ | Update status / delete |
| `POST` | `/api/admin/reset` | ✓ | Restore seed content (all, `site`, or one collection) |

Sessions are opaque 40-character tokens held in KV with a 12-hour TTL, delivered in an
`HttpOnly; SameSite=Strict` cookie. Reservation requests expire from KV after 180 days.

---

## Reservations & payment

The reservation form builds a complete WhatsApp message — treatment, duration, venue,
hotel and room, date, time, party size, notes — and opens `wa.me` with it pre-filled, while
also POSTing the request to KV so it appears under **Requests** in the admin even if the
guest never sends the message.

Payment methods (cash, Stripe, Banco Popular / Azul, PayPal) are content, not code: each has
a name, description and an optional payment-link URL, all editable in the admin, and each can
be switched off. Nothing on the site collects card details — links open the provider's own
checkout.

---

## Deploying

The KV namespaces already exist and are wired up in `wrangler.toml`:

| Binding | Environment | Namespace ID |
| --- | --- | --- |
| `CONTENT` | production & local | `09e7faead934494c8e48ffb806f0ed3e` |
| `CONTENT` | preview | `e21d3f61654b4a11986a7ac04da9f018` |

```bash
npx wrangler login
npm run cf:deploy
```

First deploy creates the Pages project (`ola-serena`); later deploys update it. Point a
custom domain at the project in the Cloudflare dashboard when you are ready.

To use a different account, create fresh namespaces and swap the IDs:

```bash
npx wrangler kv namespace create massage-site-content
npx wrangler kv namespace create massage-site-content-preview
```

---

## Layout of the repo

```
functions/api/[[route]].ts   the entire API — one catch-all Pages Function
shared/types.ts              content model, used by the app and the Function
shared/seed.ts               the starting content (all of it editable at /admin)
shared/schema.ts             field descriptors that generate the admin forms
shared/server.ts             KV access, PBKDF2 hashing, sessions, throttling
src/pages/                   Home, Treatments, Discover, Team, Book, Admin, NotFound
src/components/sections/     hero, cards and the reusable page blocks
src/components/admin/        login, generated forms, collection editor, bookings
src/components/art/          SVG palms, waves, motifs, generated scenes
src/lib/                     API client, content store, helpers
scripts/e2e.mjs              end-to-end test of the admin → KV → site round trip
```

---

## A note on the content

Names, prices, photos, the WhatsApp number and the team are placeholders chosen to look
right, not real details — replace them in the admin before going live. The Bávaro guide
entries describe real places and give real practical advice, but check current opening
hours and prices before relying on them.
