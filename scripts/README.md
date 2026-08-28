# Seed KV Namespace Script

This script helps populate your Cloudflare KV namespace with initial content.

## Quick Start

Run one of these commands from the project root:

```bash
# Seed production KV (default)
node scripts/seed-kv.mjs

# Seed preview KV
node scripts/seed-kv.mjs preview
```

## What It Does

1. Reads the seed content from `shared/seed.ts`
2. Generates a secure password hash for the default password "massage"
3. Writes two keys to your KV namespace:
   - `content:v1` - All site content (services, team, settings, etc.)
   - `auth:password` - Admin password hash

## Prerequisites

- You must be authenticated with Cloudflare: `npx wrangler login`
- The KV namespace must exist in your Cloudflare account

## Manual Alternative

If the script fails, you can manually seed using wrangler:

```bash
# 1. Create a JSON file with seed content
# 2. Upload it:
npx wrangler kv key put "content:v1" --namespace-id=09e7faead934494c8e48ffb806f0ed3e --path=./seed-data.json

# 3. Set admin password (hashed):
npx wrangler kv key put "auth:password" "<hash>" --namespace-id=09e7faead934494c8e48ffb806f0ed3e
```

## Default Credentials

After seeding, you can log into `/admin` with:
- **Password:** `massage`

⚠️ **Important:** Change this default password immediately after first login!
