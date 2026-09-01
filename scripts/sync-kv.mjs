#!/usr/bin/env node
/**
 * Push the seed content into Cloudflare KV, for both languages.
 *
 *   node scripts/sync-kv.mjs                  production, skip keys that exist
 *   node scripts/sync-kv.mjs preview          the preview namespace
 *   FORCE=1 node scripts/sync-kv.mjs          overwrite what is already there
 *
 * Without FORCE this is safe to run on every deploy: a key that already exists
 * is left alone, so content edited in /admin is never overwritten by a build.
 * With FORCE it replaces the documents outright — that is the "reset the site
 * to the seed" button, and it discards admin edits.
 *
 * Auth, in order:
 *   1. CLOUDFLARE_API_TOKEN + CLOUDFLARE_ACCOUNT_ID  (CI, build hooks)
 *   2. `npx wrangler`, already logged in              (a developer machine)
 */

import { execSync } from 'node:child_process'
import { readFileSync, writeFileSync, unlinkSync } from 'node:fs'
import { pathToFileURL } from 'node:url'

/**
 * The namespace ids come from wrangler.toml rather than being repeated here.
 *
 * They were duplicated once, drifted, and the deploy failed with "KV namespace
 * … not found" — the seed went to one namespace while the Functions read
 * another. One source of truth is the fix. Set KV_NAMESPACE_ID /
 * KV_NAMESPACE_PREVIEW_ID to override without editing either file.
 */
function namespaceFromWrangler(env) {
  const toml = readFileSync('./wrangler.toml', 'utf-8')
  const section = env === 'preview' ? 'env.preview.kv_namespaces' : 'env.production.kv_namespaces'

  // Find `[[<section>]]` and take the first `id = "…"` beneath it, stopping at
  // the next section header so a neighbouring block is never picked up.
  const start = toml.indexOf(`[[${section}]]`)
  const body = start >= 0 ? toml.slice(start + section.length + 4) : toml
  const scoped = body.split(/^\s*\[/m)[0]
  const match = scoped.match(/id\s*=\s*"([0-9a-f]{32})"/i)

  if (!match) throw new Error(`No kv_namespaces id for "${section}" in wrangler.toml`)
  return match[1]
}

const LANGS = ['en', 'es']

/** Must match PBKDF2_ITERATIONS in shared/server.ts, or no password verifies. */
const PBKDF2_ITERATIONS = 100_000
const DEFAULT_PASSWORD = 'massage'

const env = process.argv[2] || 'production'
if (env !== 'production' && env !== 'preview') {
  console.error(`Unknown environment "${env}". Use production | preview.`)
  process.exit(1)
}

const namespaceId =
  (env === 'preview' ? process.env.KV_NAMESPACE_PREVIEW_ID : process.env.KV_NAMESPACE_ID) ||
  namespaceFromWrangler(env)

const ACCOUNT_ID = process.env.CLOUDFLARE_ACCOUNT_ID
const API_TOKEN = process.env.CLOUDFLARE_API_TOKEN
const FORCE = process.env.FORCE === '1'
const useApi = Boolean(API_TOKEN && ACCOUNT_ID)

const api = (key) =>
  `https://api.cloudflare.com/client/v4/accounts/${ACCOUNT_ID}/storage/kv/namespaces/${namespaceId}/values/${encodeURIComponent(key)}`

/* ----------------------------------------------------------------- seeds */

/**
 * Node strips the type annotations itself, so the seeds are imported as real
 * modules rather than scraped out of the source with a brace counter — if a
 * seed does not parse, this fails loudly instead of uploading half a document.
 */
async function loadSeed(lang) {
  const file = lang === 'es' ? 'shared/seed-es.ts' : 'shared/seed.ts'
  const exported = lang === 'es' ? 'seedContentEs' : 'seedContent'
  const module = await import(pathToFileURL(`${process.cwd()}/${file}`).href)
  const seed = module[exported]
  if (!seed || typeof seed !== 'object' || !seed.site) {
    throw new Error(`${file} did not export a usable ${exported}`)
  }
  return seed
}

/* -------------------------------------------------------------- password */

async function hashPassword(password) {
  const salt = crypto.getRandomValues(new Uint8Array(16))
  const key = await crypto.subtle.importKey(
    'raw',
    new TextEncoder().encode(password),
    'PBKDF2',
    false,
    ['deriveBits'],
  )
  const bits = await crypto.subtle.deriveBits(
    { name: 'PBKDF2', salt, iterations: PBKDF2_ITERATIONS, hash: 'SHA-256' },
    key,
    256,
  )
  const b64 = (bytes) => Buffer.from(bytes).toString('base64')
  return `pbkdf2$${PBKDF2_ITERATIONS}$${b64(salt)}$${b64(new Uint8Array(bits))}`
}

/* ------------------------------------------------------------------- kv */

async function exists(key) {
  if (!useApi) return false
  const res = await fetch(api(key), { headers: { Authorization: `Bearer ${API_TOKEN}` } })
  return res.ok
}

async function put(key, value) {
  if (useApi) {
    const res = await fetch(api(key), {
      method: 'PUT',
      headers: { Authorization: `Bearer ${API_TOKEN}`, 'Content-Type': 'text/plain' },
      body: value,
    })
    if (!res.ok) throw new Error(`KV PUT ${key} failed: ${res.status} ${await res.text()}`)
    return
  }

  const tmp = `./.kv-${key.replace(/[^a-z0-9]/gi, '-')}.tmp`
  writeFileSync(tmp, value)
  try {
    execSync(`npx wrangler kv key put "${key}" --namespace-id=${namespaceId} --path="${tmp}"`, {
      stdio: 'inherit',
    })
  } finally {
    unlinkSync(tmp)
  }
}

/* ----------------------------------------------------------------- main */

async function main() {
  console.log(`\n🌊 KV sync — ${env}, namespace ${namespaceId}`)
  console.log('   (from wrangler.toml — the Functions read this exact namespace)')
  console.log(`   auth: ${useApi ? 'REST API token' : 'wrangler CLI'}`)
  console.log(`   mode: ${FORCE ? 'FORCE (overwrites existing values)' : 'safe (skips existing keys)'}\n`)

  for (const lang of LANGS) {
    const key = `content:${lang}:v1`
    const seed = await loadSeed(lang)

    if (!FORCE && (await exists(key))) {
      console.log(`  ↷ ${key} already present — skipped (FORCE=1 to overwrite)`)
      continue
    }
    await put(key, JSON.stringify(seed))
    console.log(`  ✓ ${key} — ${Object.keys(seed).length} sections`)
  }

  // The password is never forced: overwriting it would lock the owner out of a
  // site she had already secured.
  if (await exists('auth:password')) {
    console.log('  ↷ auth:password already set — left alone')
  } else {
    await put('auth:password', await hashPassword(DEFAULT_PASSWORD))
    console.log(`  ✓ auth:password — default "${DEFAULT_PASSWORD}", change it in /admin`)
  }

  console.log('\n✨ Done.\n')
}

main().catch((error) => {
  console.error(`\n❌ ${error.message}\n`)
  if (!useApi) {
    console.error('Set CLOUDFLARE_API_TOKEN and CLOUDFLARE_ACCOUNT_ID, or run `npx wrangler login`.\n')
  }
  process.exit(1)
})
