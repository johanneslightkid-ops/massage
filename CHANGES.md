# Tropical light redesign · Full Spanish · Cloudinary · Conversational AI

This iteration of `johanneslightkid-ops/massage` adds:

## 1. Tropical light palette (`src/index.css`)
* White is now the main canvas. Layered with **lush palm greens**, **crystal sea blues**, **sandy golden yellows** and **flamingo pinks**, all as gentle tints.
* Old dark ocean/lagoon values re-balanced towards a sunlit look.
* Brand-new tokens: `flamingo-*`, `palm-*` extended range, `sun-*` extended, `page-wash` ambient gradient, `tropical-scatter` SVG watermark of sea stars / palms / corals, and `tropical-gradient` / `sunset-gradient` utilities.

## 2. Full Spanish content in KV
* `shared/seed-es.ts` — full ES seed derived from the EN seed, with hand-translated site copy, treatments, team bios, benefits, FAQs, packages, payments, gallery captions and Discover-Bávaro tips.
* `shared/server.ts` — reads/writes per-language KV keys (`content:en:v1` / `content:es:v1`), seeded from the matching source.

## 3. Deploy-time KV auto-sync
* `scripts/sync-kv.mjs` — pushes both `content:en:v1` and `content:es:v1` to the Cloudflare KV namespace via REST API (auth: `CLOUDFLARE_API_TOKEN` + `CLOUDFLARE_ACCOUNT_ID`) or via `npx wrangler` locally.
* `postbuild` npm hook: after each `npm run build` (Cloudflare Pages runs `npm run build` on every deploy), if the token env vars are present, the sync runs automatically — so a deploy = KV enriched with the latest translations.
* Idempotent: existing keys are left alone unless `FORCE=1`.

## 4. Cloudinary signed uploads (no upload preset)
* `functions/api/uploads/[[route]].ts` — `POST /api/uploads/sign` returns a Cloudinary signature (SHA-1 of the parameter set + secret) and `GET /api/uploads/config` publishes the cloud name / api key to the browser.
* `src/components/admin/FieldInput.tsx` — the image field now:
  * offers `capture="environment"` so mobile users get the rear camera directly,
  * uploads to Cloudinary using the signed endpoint,
  * falls back to inline WebP data-URLs if Cloudinary isn't reachable.

## 5. Conversational admin AI (Cloudflare Workers AI, free)
* `functions/api/ai/[[route]].ts` upgraded:
  * `@cf/meta/llama-3.1-8b-instruct` for chat + guided-Q&A system prompt (asks one thing at a time, returns `<action>{...}</action>` blocks the client can apply).
  * `@cf/openai/whisper` for STT.
  * `@cf/myshell-ai/melotts` (with `@cf/facebook/mms-tts` fallback) for TTS.
  * Batch translation mode (`POST /api/ai/translate` with `{fields:{key:text,...}, targetLang}`) so the admin can auto-populate the other language on save.
* `src/lib/ai-assistant.ts` reworked to call `/api/ai/chat` with full message history, parse the `<action>` block and forward it to the admin content handler.

## 6. Environment scaffolding
* `.env.example` documenting all keys (Cloudflare + Cloudinary).
* `wrangler.toml` publishes `CLOUDINARY_CLOUD_NAME` / `CLOUDINARY_API_KEY` (public), while `CLOUDINARY_API_SECRET` must be set as a Pages **secret** (`wrangler pages secret put CLOUDINARY_API_SECRET`).

## What to run after applying the patch
```zsh
cd ~/Projects/massage
npm install
# One-off KV seed (both languages):
CLOUDFLARE_ACCOUNT_ID=… CLOUDFLARE_API_TOKEN=… npm run sync:kv
# Local dev:
npm run cf:dev
# Deploy:
npm run cf:deploy
```

Set the Cloudinary secret once on Pages:
```zsh
npx wrangler pages secret put CLOUDINARY_API_SECRET
```
