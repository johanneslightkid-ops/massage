#!/usr/bin/env node
/**
 * Runs after `vite build`, including inside the Cloudflare Pages build.
 *
 * Seeding KV needs a network route to api.cloudflare.com. The Pages build
 * container has one; a developer laptop behind a restrictive proxy may not.
 * So the build is the most reliable place to do it — set these two variables
 * in the Pages project (Settings → Variables and Secrets, Production *and*
 * Preview) and every deploy keeps KV in step with the code:
 *
 *   CLOUDFLARE_ACCOUNT_ID   the account the Pages project deploys into
 *   CLOUDFLARE_API_TOKEN    a token with "Workers KV Storage: Edit"
 *
 * It runs `sync-kv.mjs` in SAFE mode: keys that already exist are left alone,
 * so a deploy can never overwrite what the owner edited in /admin. The first
 * deploy after adding the variables writes the documents; every deploy after
 * that is a no-op.
 *
 * A seeding failure never fails the build. Shipping the site with stale KV
 * beats not shipping it at all, and the error is printed in full so it is
 * obvious in the build log.
 */

import { spawnSync } from 'node:child_process'

const hasToken = Boolean(process.env.CLOUDFLARE_API_TOKEN)
const hasAccount = Boolean(process.env.CLOUDFLARE_ACCOUNT_ID)

if (!hasToken || !hasAccount) {
  const missing = [!hasAccount && 'CLOUDFLARE_ACCOUNT_ID', !hasToken && 'CLOUDFLARE_API_TOKEN']
    .filter(Boolean)
    .join(' and ')

  console.log(`\n[postbuild] KV sync skipped — ${missing} not set.`)
  console.log('[postbuild] The site will build and deploy, but every visitor sees the')
  console.log('[postbuild] built-in seed and /admin has nothing to edit until KV holds')
  console.log('[postbuild] content:en:v1 and content:es:v1.')
  console.log('[postbuild] Fix: add both in the Pages project under')
  console.log('[postbuild] Settings → Variables and Secrets, then redeploy. See DEPLOYMENT.md.\n')
  process.exit(0)
}

console.log('\n[postbuild] Credentials present — syncing KV (safe mode, existing keys kept).')

const result = spawnSync(process.execPath, ['scripts/sync-kv.mjs'], { stdio: 'inherit' })

if (result.status !== 0) {
  console.error('\n[postbuild] KV sync FAILED. The deploy continues; the site will serve the')
  console.error('[postbuild] built-in seed until this is resolved. Common causes:')
  console.error('[postbuild]   - the token lacks "Workers KV Storage: Edit"')
  console.error('[postbuild]   - the token belongs to a different account than CLOUDFLARE_ACCOUNT_ID')
  console.error('[postbuild]   - the namespace id in wrangler.toml is not in that account')
  console.error('[postbuild] See "Bindings and the two-account trap" in DEPLOYMENT.md.\n')
}

// Always succeed: a KV hiccup must not take the whole deploy down with it.
process.exit(0)
