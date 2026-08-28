# 🌴 Ola Serena - Deployment & KV Setup Guide

## Quick Start

### 1. Seed Your KV Namespace (Required Before First Deploy)

Your Cloudflare KV namespace needs initial content before the site will work.

```bash
# Login to Cloudflare (first time only)
npx wrangler login

# Seed production KV namespace
npm run seed

# OR seed preview namespace
npm run seed:preview
```

This will:
- ✅ Populate `content:v1` with all site data (services, team, settings, etc.)
- ✅ Set up admin password hash (default password: `massage`)
- ✅ Make your site ready to display content

### 2. Deploy to Cloudflare Pages

```bash
npm run cf:deploy
```

### 3. Access Admin Panel

After deployment:
1. Go to `https://your-site.com/admin`
2. Login with password: `massage`
3. **⚠️ IMPORTANT:** Change the default password immediately!

---

## What's in the KV Namespace?

| Key | Description | Example Value |
|-----|-------------|---------------|
| `content:v1` | Main site content | `{ site: {...}, services: [...] }` |
| `auth:password` | Admin password hash | `pbkdf2$150000$...` |
| `booking:*` | Customer bookings (auto-created) | `{ id, name, contact, ... }` |
| `session:*` | Admin sessions (auto-created) | `{ ip, at }` |
| `throttle:*` | Login attempt throttling (auto-created) | `{ count, until }` |

---

## Manual KV Seeding (Alternative)

If the automated script fails:

### Option A: Using Wrangler CLI Directly

```bash
# 1. Export seed content to JSON
# (You can copy from shared/seed.ts or use the built dist)

# 2. Upload content
npx wrangler kv key put "content:v1" --namespace-id=09e7faead934494c8e48ffb806f0ed3e --path=./seed-data.json

# 3. Generate and upload password hash
# Use Node.js to generate: 
node -e "
crypto.getRandomValues = require('crypto').randomFillSync;
const salt = crypto.getRandomValues(new Uint8Array(16));
// ... (see scripts/seed-kv.mjs for full implementation)
"
```

### Option B: Via Cloudflare Dashboard

1. Go to https://dash.cloudflare.com
2. Workers & Pages → Your Project → Storage → KV
3. Select the `CONTENT` namespace
4. Click "Create Key"
5. Add keys manually:
   - Key: `content:v1`, Value: [JSON from shared/seed.ts]
   - Key: `auth:password`, Value: [hashed password]

---

## Troubleshooting

### Site shows blank/error after deploy

**Most likely cause:** KV namespace is empty

**Solution:**
```bash
npm run seed
npm run cf:deploy
```

### "KV namespace CONTENT is not bound"

Check your `wrangler.toml` has:
```toml
[[kv_namespaces]]
binding = "CONTENT"
id = "09e7faead934494c8e48ffb806f0ed3e"
```

### Can't login to admin

1. Re-seed the KV: `npm run seed`
2. Try default password: `massage`
3. Check browser console for errors

### Preview deployment has different data

Preview uses a separate KV namespace. Seed it separately:
```bash
npm run seed:preview
```

---

## Environment Details

### Production
- **KV Namespace ID:** `09e7faead934494c8e48ffb806f0ed3e`
- **Deploy command:** `npm run cf:deploy`

### Preview
- **KV Namespace ID:** `e21d3f61654b4a11986a7ac04da9f018`
- **Deploy command:** `npm run cf:deploy --env preview`

---

## Security Notes

- 🔐 Default admin password is `massage` - **change it immediately**
- 🔒 Password hashes use PBKDF2 with 150,000 iterations
- 🛡️ Login throttling prevents brute force attacks
- 🔑 Sessions expire after 12 hours

To change admin password:
1. Login to `/admin`
2. Go to Settings → Change Password
3. Enter current and new password

---

## AI Assistant Features

The site includes an AI assistant (Cloudflare Workers AI) that can:
- 🎤 Accept voice input (with microphone)
- 🔊 Speak responses (text-to-speech)
- 🌐 Translate between English and Spanish
- ✏️ Create/update/delete site content via conversation
- ⚙️ Configure settings hands-free

### Enable AI Features

Add to `wrangler.toml`:
```toml
[ai]
binding = "AI"
```

Then access via `/admin` → AI Assistant button (bottom right)

---

## Google Maps Integration

Set your location via Admin → Site Settings → Location & Hours:
- **Map Embed URL:** Get from Google Maps → Share → Embed
- **Map Link URL:** Regular Google Maps link for fallback

Example embed URL:
```
https://www.google.com/maps/embed?pb=!1m18!...
```

---

## Need Help?

1. Check this guide first
2. Review error logs in Cloudflare Dashboard
3. Run `npm run seed` to ensure KV has data
4. Verify build passes: `npm run build`
