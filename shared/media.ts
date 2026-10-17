/**
 * Photos and videos the owner uploads, stored in the content KV namespace and
 * served by the Worker at `/media/<id>`.
 *
 * This is the fallback when Cloudinary is not configured. It keeps uploads
 * out of the content document — which the Worker inlines into every page — so
 * a team video never rides along with the HTML.
 */

/** Workers KV refuses values over 25 MiB. */
export const MEDIA_MAX_BYTES = 25 * 1024 * 1024

export const mediaKey = (id: string) => `media:${id}`

export const mediaUrl = (id: string) => `/media/${id}`

/** Ids are random UUIDs; anything else in the path is a 404. */
export const MEDIA_ID = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/

/**
 * Raster images and video only. SVG is excluded: it can carry script, and it
 * would be served from the same origin as the admin.
 */
export function isAllowedMediaType(type: string): boolean {
  return /^(image\/(jpeg|png|webp|gif|avif|heic|heif)|video\/(mp4|quicktime|webm|ogg|3gpp|x-m4v))$/.test(type)
}

export interface MediaMetadata {
  type: string
}
