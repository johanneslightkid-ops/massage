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
import { writeFileSync, unlinkSync } from 'node:fs'
import { pathToFileURL } from 'node:url'

/**
 * These are the namespaces that actually exist on the account
 * (`npx wrangler kv namespace list`), and they must stay in step with
 * wrangler.toml — a binding pointing at a namespace that is not there fails at
 * request time, not at deploy time, which is a horrible way to find out.
 */
const NAMESPACES = {
  production: process.env.KV_NAMESPACE_ID || '09e7faead934494c8e48ffb806f0ed3e',
  preview: process.env.KV_NAMESPACE_PREVIEW_ID || 'e21d3f61654b4a11986a7ac04da9f018',
}

const LANGS = ['en', 'es']

/** Must match PBKDF2_ITERATIONS in shared/server.ts, or no password verifies. */
const PBKDF2_ITERATIONS = 100_000
const DEFAULT_PASSWORD = 'massage'

const env = process.argv[2] || 'production'
const namespaceId = NAMESPACES[env]
if (!namespaceId) {
  console.error(`Unknown environment "${env}". Use production | preview.`)
  process.exit(1)
}

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
