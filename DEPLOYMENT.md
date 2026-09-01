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

## Bindings and the two-account trap

This repository has been configured against **two different Cloudflare
accounts**, and the mismatch is the single easiest way to break the deploy:

| Thing | Account |
| --- | --- |
| Pages projects `massage-playero`, `loscorales` | `d5272033401c64f8cc6ce650a8321cb2` |
| Worker `massage`, KV `massage-site-content` | `441c9800bf1a29d18bff02f4adf8e9c9` |

A namespace id is only meaningful inside its own account. Listing namespaces
while logged into one account and pasting an id into `wrangler.toml` for a
project that deploys into the *other* is what produces:

```
Error: Failed to publish your Function. Got error: KV namespace '…' not found.
```

So before changing an id, confirm which account the Pages project deploys into
and list namespaces **in that account**:

```bash
npx wrangler login
npx wrangler kv namespace list        # ids are account-scoped
```

`wrangler.toml` is the single source of truth for the id — `scripts/sync-kv.mjs`
reads it rather than keeping its own copy, so the seed always lands in the
namespace the Functions actually read.

## Bindings are not inherited by environments

Pages deploys every build into `env.preview` or `env.production`. A binding
declared only at the top level of `wrangler.toml` is **absent from the deployed
Functions** — the build log says so:

```
- "ai" exists at the top level, but not on "env.production".
```

That is not cosmetic: with `[ai]` only at the top level the admin assistant
returns `503 Cloudflare Workers AI is not bound` in production while working
perfectly in local dev. Every binding is repeated in all three blocks for this
reason.

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
