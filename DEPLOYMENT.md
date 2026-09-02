# Deploying Massage Playero

The site is a Vite/React front end on Cloudflare Pages, with the CMS living in a
single KV namespace and the API in `functions/`.

---

## 1. Seed KV

The site reads its content from KV. Until `content:en:v1` and `content:es:v1`
exist, every visitor sees the built-in seed and `/admin` has nothing to edit.

Seeding needs a network route to `api.cloudflare.com`. Pick whichever of these
you actually have.

### A. From the Pages build — no local network access needed

The Pages build container sits inside Cloudflare's network, so it can always
reach the API even when your laptop or a sandboxed environment cannot. The
build already tries: `postbuild` runs the sync whenever credentials are
present, and prints this when they are not:

```
[postbuild] KV sync skipped — CLOUDFLARE_ACCOUNT_ID and CLOUDFLARE_API_TOKEN not set.
```

To switch it on, add two variables to the Pages project — **Settings →
Variables and Secrets**, for both Production and Preview:

| Name | Value |
| --- | --- |
| `CLOUDFLARE_ACCOUNT_ID` | the account the Pages project deploys into |
| `CLOUDFLARE_API_TOKEN` | a token with **Workers KV Storage: Edit** on that account |

Then redeploy. The build log will show each key written and a read-back check:

```
  ✓ content:en:v1 — 11 sections
  ✓ content:es:v1 — 11 sections
  ✓ auth:password — default "massage", change it in /admin
  ✓ verified: content:en:v1 reads back with 8 treatments
```

This runs in **safe mode**: keys that already exist are left untouched, so it
is harmless on every subsequent deploy and can stay on permanently. A seeding
failure never fails the build — the site still ships, and the log says why.

#### Forcing a reseed from the build

Safe mode never overwrites, so it cannot repair content that has already been
edited into a mess. To reset the site to the seed, add a third variable and
redeploy:

| Name | Value |
| --- | --- |
| `KV_SEED_FORCE` | `1` |

The build log then says so before it writes anything:

```
[postbuild] KV_SEED_FORCE=1 — syncing KV in FORCE mode.
[postbuild] The content documents are being OVERWRITTEN with the seed.
```

**Remove the variable once that deploy finishes.** Left in place it re-flattens
the owner's content on every future deploy — including the automatic one that
follows the next push. The admin password is still never forced, so a reseed
cannot lock anyone out of a site she has already secured.

It is `KV_SEED_FORCE` rather than a bare `FORCE` on purpose: the variable sits
in a Pages project among unrelated settings, where a name that does not say
what it forces is a trap.

### B. From a machine that can reach Cloudflare

```bash
npx wrangler login          # first time only
npm run sync:kv             # safe: writes only missing keys
npm run seed                # FORCE=1: overwrites the content documents
```

Or with a token instead of an interactive login:

```bash
export CLOUDFLARE_ACCOUNT_ID=<account id>
export CLOUDFLARE_API_TOKEN=<token with Workers KV Storage: Edit>
FORCE=1 node scripts/sync-kv.mjs
```

`FORCE=1` replaces the content documents outright — the deliberate "reset the
site to the seed" button. Without it, existing keys are kept. Either way the
password is only written when absent, so re-running can never lock the owner
out of a site she has already secured.

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

The conversation drives writes through an `<action>{…}</action>` block in the
model's reply. An 8B model mangles that protocol often — fencing the JSON,
writing prose around it, leaving a trailing comma, omitting the id a `delete`
needs — so `src/lib/assistant-protocol.ts` recovers what is unambiguous and
emits **no action** for anything else, rather than guessing at a write to the
live site. `npm test` covers those cases:

```bash
npm test
```

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
