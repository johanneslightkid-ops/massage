/**
 * Cloudinary signed uploads.
 *
 * Endpoints:
 *   POST /api/uploads/sign      → returns a signature so the mobile browser
 *                                 can upload directly to Cloudinary without
 *                                 exposing the API secret (auth required).
 *   GET  /api/uploads/config    → returns cloud_name + api_key + folder so
 *                                 the client knows where to POST.
 */

import { fail, isAuthed, json } from '../../../shared/server'

interface Env {
  CONTENT: KVNamespace
  CLOUDINARY_CLOUD_NAME?: string
  CLOUDINARY_API_KEY?: string
  CLOUDINARY_API_SECRET?: string
}

export const onRequest: PagesFunction<Env> = async (context) => {
  const { request, env, params } = context
  const segments = Array.isArray(params.route) ? params.route : params.route ? [params.route] : []
  const path = segments.join('/')
  const method = request.method.toUpperCase()

  if (method === 'OPTIONS') return new Response(null, { status: 204 })

  if (path === 'config' && method === 'GET') {
    return json({
      cloudName: env.CLOUDINARY_CLOUD_NAME ?? '',
      apiKey:    env.CLOUDINARY_API_KEY ?? '',
      folder:    'ola-serena',
      configured: Boolean(env.CLOUDINARY_CLOUD_NAME && env.CLOUDINARY_API_KEY && env.CLOUDINARY_API_SECRET),
    })
  }

  // Everything else needs a signed-in admin.
  if (!(await isAuthed(request, env.CONTENT))) return fail(401, 'Not signed in.')

  if (path === 'sign' && method === 'POST') {
    const cloudName = env.CLOUDINARY_CLOUD_NAME
    const apiKey    = env.CLOUDINARY_API_KEY
    const apiSecret = env.CLOUDINARY_API_SECRET
    if (!cloudName || !apiKey || !apiSecret) {
      return fail(500, 'Cloudinary is not configured. Set CLOUDINARY_API_SECRET as a secret.')
    }

    const body = (await request.json().catch(() => ({}))) as { folder?: string; publicId?: string }
    const timestamp = Math.floor(Date.now() / 1000)
    const folder = (body.folder || 'ola-serena').replace(/[^a-zA-Z0-9_\-\/]/g, '').slice(0, 80)

    // Parameters to sign — alphabetical order per Cloudinary docs.
    const paramsToSign: Record<string, string | number> = { folder, timestamp }
    if (body.publicId) paramsToSign.public_id = body.publicId.replace(/[^a-zA-Z0-9_\-]/g, '').slice(0, 80)

    const toSign = Object.keys(paramsToSign)
      .sort()
      .map((k) => `${k}=${paramsToSign[k]}`)
      .join('&')

    // Cloudinary signature = SHA-1 of `${toSign}${apiSecret}`
    const encoder = new TextEncoder()
    const buf = await crypto.subtle.digest('SHA-1', encoder.encode(toSign + apiSecret))
    const signature = [...new Uint8Array(buf)]
      .map((b) => b.toString(16).padStart(2, '0'))
      .join('')

    return json({
      cloudName,
      apiKey,
      timestamp,
      signature,
      folder,
      uploadUrl: `https://api.cloudinary.com/v1_1/${cloudName}/auto/upload`,
      publicId: paramsToSign.public_id,
    })
  }

  return fail(404, 'Unknown endpoint.')
}
