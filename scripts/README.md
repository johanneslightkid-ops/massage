# Scripts

## `sync-kv.mjs` — push the seed content into KV

```bash
npm run sync:kv            # production, writes only missing keys
npm run sync:kv:preview    # the preview namespace
npm run seed               # FORCE=1 — overwrites the content documents
npm run seed:preview
```

Writes `content:en:v1`, `content:es:v1` and (only if absent) `auth:password`.

Without `FORCE=1` an existing key is left alone, which is why `postbuild` can
run it on every deploy without erasing what the owner edited in `/admin`.
`FORCE=1` replaces the content documents outright — the deliberate reset.

Auth: `CLOUDFLARE_API_TOKEN` + `CLOUDFLARE_ACCOUNT_ID` if both are set,
otherwise `npx wrangler` on a machine that is already logged in.

The seeds are imported as real modules (Node strips the TypeScript itself), so a
broken seed fails the script instead of uploading a truncated document.

## `e2e.mjs` — smoke test a running site

```bash
npm run test:e2e
```

## `seo-check.mjs` — per-route metadata and JSON-LD

```bash
npm run test:seo
```

## `make-og.mjs` — regenerate `public/og.jpg`

```bash
npm run og
```
