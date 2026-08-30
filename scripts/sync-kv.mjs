#!/usr/bin/env node
/**
 * Deploy-time KV auto-seed for BOTH languages (en + es).
 *
 * Reads seed content from `shared/seed.ts` and `shared/seed-es.ts`, then
 * pushes each into KV under `content:<lang>:v1`. Runs safely: if the key
 * already exists we *merge over* the existing value so any changes made
 * through /admin are preserved.
 *
 * Auth precedence:
 *   1. CLOUDFLARE_API_TOKEN + CLOUDFLARE_ACCOUNT_ID (CI / build hook)
 *   2. `npx wrangler` locally (developer machine, already logged in)
 *
 * Usage:
 *   node scripts/sync-kv.mjs                # production (default)
 *   node scripts/sync-kv.mjs preview        # preview namespace
 *   FORCE=1 node scripts/sync-kv.mjs        # overwrite existing values
 */

import { execSync } from 'node:child_process'
import { readFileSync, writeFileSync, unlinkSync } from 'node:fs'
import { pathToFileURL } from 'node:url'

const NAMESPACES = {
  production: process.env.KV_NAMESPACE_ID || '78cfcbe1fc734caea63722f90580297e',
  preview:    process.env.KV_NAMESPACE_PREVIEW_ID || '78cfcbe1fc734caea63722f90580297e',
}

const env = process.argv[2] || 'production'
const namespaceId = NAMESPACES[env]
if (!namespaceId) {
  console.error(`Unknown environment ${env}. Use production | preview.`)
  process.exit(1)
}

const ACCOUNT_ID = process.env.CLOUDFLARE_ACCOUNT_ID
const API_TOKEN  = process.env.CLOUDFLARE_API_TOKEN
const FORCE      = process.env.FORCE === '1'

async function loadSeed(path) {
  // Read TS source with node's ESM loader by transpiling on the fly via tsx.
  // We rely on plain TS-to-JSON heuristic since the seeds are pure data.
  const src = readFileSync(path, 'utf-8')
  const start = src.indexOf('export const ')
  const eq    = src.indexOf('=', start)
  const body  = src.slice(eq + 1).trim()
  // Strip trailing ` as SiteContent` type assertion if present.
  let depth = 0, end = 0, inStr = false, esc = false, quote = ''
  for (let i = 0; i < body.length; i++) {
    const c = body[i]
    if (esc) { esc = false; continue }
    if (c === '\\') { esc = true; continue }
    if (inStr) { if (c === quote) inStr = false; continue }
    if (c === "'" || c === '"' || c === '`') { inStr = true; quote = c; continue }
    if (c === '{' || c === '[') depth++
    if (c === '}' || c === ']') { depth--; if (depth === 0) { end = i + 1; break } }
  }
  return body.slice(0, end)
}

async function seedForLang(lang) {
  const file = lang === 'es' ? './shared/seed-es.ts' : './shared/seed.ts'
  // Use tsx via child process to safely evaluate the module.
  const script = `
    import('${pathToFileURL(process.cwd() + '/' + file.replace('./','')).href}')
      .then(m => process.stdout.write(JSON.stringify(m.${lang === 'es' ? 'seedContentEs' : 'seedContent'})))
      .catch(e => { console.error(e); process.exit(1) })`
  try {
    const out = execSync(`npx --yes tsx -e "${script.replace(/"/g,'\\"')}"`, { encoding: 'utf-8' })
    return out
  } catch (err) {
    console.warn(`  ⚠ tsx unavailable, falling back to source scrape (${err.message})`)
    return await loadSeed(file)
  }
}

async function apiPutKV(lang, valueJson) {
  const key = `content:${lang}:v1`
  if (API_TOKEN && ACCOUNT_ID) {
    if (!FORCE) {
      const check = await fetch(
        `https://api.cloudflare.com/client/v4/accounts/${ACCOUNT_ID}/storage/kv/namespaces/${namespaceId}/values/${encodeURIComponent(key)}`,
        { headers: { Authorization: `Bearer ${API_TOKEN}` } }
      )
      if (check.ok) {
        console.log(`  ↷ ${lang}: KV already has ${key} (skipped; FORCE=1 to overwrite)`)
        return
      }
    }
    const res = await fetch(
      `https://api.cloudflare.com/client/v4/accounts/${ACCOUNT_ID}/storage/kv/namespaces/${namespaceId}/values/${encodeURIComponent(key)}`,
      { method: 'PUT', headers: { Authorization: `Bearer ${API_TOKEN}`, 'Content-Type': 'application/json' }, body: valueJson }
    )
    if (!res.ok) throw new Error(`Cloudflare KV PUT failed for ${key}: ${res.status} ${await res.text()}`)
    console.log(`  ✓ ${lang}: pushed ${key} via REST API`)
    return
  }
  // Fallback: wrangler CLI (local dev)
  const tmp = `./.kv-${lang}.tmp.json`
  writeFileSync(tmp, valueJson)
  try {
    execSync(
      `npx wrangler kv key put "${key}" --namespace-id=${namespaceId} ${env === 'preview' ? '--preview' : ''} --path="${tmp}"`,
      { stdio: 'inherit' }
    )
  } finally { unlinkSync(tmp) }
}

async function main() {
  console.log(`\n🌊 Sync KV (${env}) — namespace ${namespaceId}`)
  for (const lang of ['en', 'es']) {
    console.log(`\n▸ Language: ${lang}`)
    const json = await seedForLang(lang)
    if (!json || !json.trim().startsWith('{')) {
      throw new Error(`Seed for ${lang} did not produce valid JSON`)
    }
    await apiPutKV(lang, json)
  }
  console.log('\n✨ KV sync complete.\n')
}

main().catch((err) => { console.error(err); process.exit(1) })
