# Deploying Massage Playero

The site is a Vite/React front end on Cloudflare Pages, with the CMS living in a
single KV namespace and the API in `functions/`.

---

## 1. Seed KV (once, before the first deploy)

The site reads its content from KV. Until the keys exist, every visitor sees the
built-in seed and nothing is editable.

```bash
npx wrangler login          # first time only
npm run seed                # production
npm run seed:preview        # the preview namespace
```

`npm run seed` is `FORCE=1 node scripts/sync-kv.mjs` — it **overwrites** the
content documents with the seed. That is what you want on a first deploy and
when you deliberately want to reset the site; it is *not* what you want once
the owner has edited anything.

For the safe version — write only the keys that do not exist yet — run:

```bash
npm run sync:kv
```

This is also what `postbuild` runs automatically when `CLOUDFLARE_API_TOKEN` and
`CLOUDFLARE_ACCOUNT_ID` are set in the build environment, so a deploy never
silently erases the owner's work.

### Without wrangler (CI, a build hook, a remote shell)

```bash
export CLOUDFLARE_ACCOUNT_ID=<your account id>
export CLOUDFLARE_API_TOKEN=<a token with "Workers KV Storage: Edit">
FORCE=1 node scripts/sync-kv.mjs
```

The script prints which auth path it took and whether it is in FORCE or safe
mode before it writes anything.

---

## 2. Deploy

```bash
npm run cf:deploy
```

---

## 3. Sign in

1. Open `https://<your site>/admin`
2. The starting password is `massage`
3. Change it under **Password & data** straight away

---

## What is in the KV namespace

| Key                | Written by            | Contents                                   |
| ------------------ | --------------------- | ------------------------------------------ |
| `content:en:v1`    | `sync-kv.mjs`, /admin | The whole English site document             |
| `content:es:v1`    | `sync-kv.mjs`, /admin | The whole Spanish site document             |
| `auth:password`    | `sync-kv.mjs`, /admin | PBKDF2 hash of the admin password           |
| `booking:*`        | the booking form      | One reservation request, expires after 180d |
| `session:*`        | admin sign-in         | One admin session, expires after 12h        |
| `throttle:login:*` | failed sign-ins       | Rate-limit counter, expires after 10m       |

**One document per language.** The admin edits whichever language the toggle in
the top bar is set to, and the AI assistant writes both at once — it translates
each change into the other language as it saves.

The PBKDF2 iteration count in `scripts/sync-kv.mjs` must match
`PBKDF2_ITERATIONS` in `shared/server.ts`. If they drift apart, the seeded
password will never verify and nobody can sign in.

---

## Bindings

`wrangler.toml` must point at namespaces that actually exist. Check with:

```bash
npx wrangler kv namespace list
```

| Binding   | Environment          | Namespace ID                       |
| --------- | -------------------- | ---------------------------------- |
| `CONTENT` | production and local | `09e7faead934494c8e48ffb806f0ed3e` |
| `CONTENT` | preview              | `e21d3f61654b4a11986a7ac04da9f018` |
| `AI`      | all                  | Workers AI, no id needed            |

A binding that names a namespace which is not on the account does not fail the
deploy — it fails at request time, with a 500 from `/api/content`.

---

## Workers AI

The `[ai]` binding in `wrangler.toml` powers the admin assistant. No API key is
involved: Cloudflare provisions the binding for the deployment, and every AI
route in `functions/api/ai/` refuses requests without an admin session.

Models used:

| Route                | Model                          | For                             |
| -------------------- | ------------------------------ | ------------------------------- |
| `/api/ai/chat`       | `@cf/meta/llama-3.1-8b-instruct` | The guided conversation         |
| `/api/ai/translate`  | `@cf/meta/llama-3.1-8b-instruct` | Mirroring edits into the other language |
| `/api/ai/stt`        | `@cf/openai/whisper`           | The microphone                  |
| `/api/ai/tts`        | `@cf/myshell-ai/melotts`       | Spoken replies (fallback only)  |

`GET /api/ai/status` reports whether the binding actually arrived — useful when
the assistant says the AI is unavailable.

The microphone also needs `Permissions-Policy: microphone=(self)` in
`public/_headers`. With the default `microphone=()` the browser blocks the page
from recording and the assistant is text-only.

---

## Photo uploads

Photo fields upload straight to Cloudinary from the browser, signed by
`/api/uploads/sign` so the secret never reaches the client:

```bash
npx wrangler pages secret put CLOUDINARY_API_SECRET
```

With `CLOUDINARY_CLOUD_NAME`, `CLOUDINARY_API_KEY` and the secret unset, uploads
fall back to a resized inline WebP data URL — fine for a couple of photos,
bad for a gallery.
