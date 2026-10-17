/**
 * The mobile-massage Worker.
 *
 * One Worker serves the whole site: the built React app as static assets, the
 * content API, the admin's AI routes and Cloudinary signing. The handlers in
 * `functions/` are the same ones the Pages deployment used — this file only
 * routes to them, so nothing about the API changed in the move.
 *
 * `run_worker_first` in wrangler.toml sends everything except the hashed
 * build assets here. For a page request the Worker reads the content document
 * for the visitor's language from KV and inlines it into the HTML, so the
 * first paint needs no API round-trip and no seed bundle — the single biggest
 * win for a guest on a hotel connection. It also rewrites the title and Open
 * Graph tags per page, which is what WhatsApp's link preview actually reads.
 */

import { onRequest as api } from '../functions/api/[[route]]'
import { onRequest as ai } from '../functions/api/ai/[[route]]'
import { onRequest as uploads } from '../functions/api/uploads/[[route]]'
import { onRequestGet as sitemap } from '../functions/sitemap.xml.ts'
import { onRequestGet as robots } from '../functions/robots.txt.ts'
import { readContent } from '../shared/server'
import { parseBlocks } from '../shared/markdown'
import { MEDIA_ID, mediaKey, type MediaMetadata } from '../shared/media'
import type { BlogPost, SiteContent } from '../shared/types'

export interface Env {
  ASSETS: Fetcher
  CONTENT: KVNamespace
  AI?: Ai
  SITE_NAME?: string
  CLOUDINARY_CLOUD_NAME?: string
  CLOUDINARY_API_KEY?: string
  CLOUDINARY_API_SECRET?: string
}

type Handler = (context: never) => Response | Promise<Response>

/** Calls a Pages Function with the context shape it was written against. */
function callPages(handler: Handler, request: Request, env: Env, ctx: ExecutionContext, route: string[]) {
  const context = {
    request,
    env,
    params: { route },
    data: {},
    functionPath: new URL(request.url).pathname,
    waitUntil: (promise: Promise<unknown>) => ctx.waitUntil(promise),
    passThroughOnException: () => ctx.passThroughOnException(),
    next: () => env.ASSETS.fetch(request),
  }
  return handler(context as never)
}

const LANGS = ['en', 'es'] as const
type Lang = (typeof LANGS)[number]

/** Same precedence as the browser: ?lang= → saved choice (cookie) → Accept-Language. */
function languageFor(request: Request, url: URL): Lang {
  const fromUrl = url.searchParams.get('lang')
  if (fromUrl === 'en' || fromUrl === 'es') return fromUrl
  const cookie = request.headers.get('Cookie')?.match(/(?:^|;\s*)lang=(en|es)\b/)
  if (cookie) return cookie[1] as Lang
  return /^es\b/i.test(request.headers.get('Accept-Language') ?? '') ? 'es' : 'en'
}

const escapeAttr = (value: string) =>
  value.replace(/&/g, '&amp;').replace(/"/g, '&quot;').replace(/</g, '&lt;').replace(/>/g, '&gt;')

/** JSON that is safe inside a <script> element, whatever the owner typed. */
const scriptJson = (value: unknown) =>
  JSON.stringify(value).replace(/</g, '\\u003c').replace(/\u2028/g, '\\u2028').replace(/\u2029/g, '\\u2029')

const escapeHtml = (value: string) => value.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')

/** The blog's inline marks as HTML, for the crawler copy. Links stay links. */
function inlineHtml(text: string): string {
  return escapeHtml(text)
    .replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>')
    .replace(/\*([^*]+)\*/g, '<em>$1</em>')
    .replace(/\[([^\]]+)\]\(((?:https?:\/\/|\/)[^)\s]*)\)/g, '<a href="$2">$1</a>')
}

/**
 * A plain-HTML copy of an article inside <noscript>. Google renders the app,
 * but plenty of crawlers (Bing's lighter passes, link-preview bots, AI search
 * indexers) read only the HTML — this is what lets each post rank on its own.
 */
function articleHtml(post: BlogPost): string {
  const blocks = parseBlocks(post.body)
    .map((block) => {
      switch (block.kind) {
        case 'h2':
        case 'h3':
          return `<${block.kind}>${inlineHtml(block.text)}</${block.kind}>`
        case 'quote':
          return `<blockquote>${inlineHtml(block.text)}</blockquote>`
        case 'ul':
        case 'ol':
          return `<${block.kind}>${block.items.map((item) => `<li>${inlineHtml(item)}</li>`).join('')}</${block.kind}>`
        default:
          return `<p>${inlineHtml(block.text)}</p>`
      }
    })
    .join('')
  return `<noscript><article><h1>${escapeHtml(post.title)}</h1><p>${escapeHtml(post.excerpt)}</p>${blocks}</article></noscript>`
}

function blogIndexHtml(posts: BlogPost[]): string {
  const items = posts
    .map((post) => `<li><a href="/blog/${encodeURIComponent(post.slug)}">${escapeHtml(post.title)}</a> — ${escapeHtml(post.excerpt)}</li>`)
    .join('')
  return `<noscript><nav><ul>${items}</ul></nav></noscript>`
}

function pageMeta(content: SiteContent, pathname: string): { title: string; description: string; image?: string } {
  const site = content.site
  const base = { title: `${site.brandName} · ${site.tagline}`.slice(0, 120), description: site.heroSubtitle }
  const post = pathname.match(/^\/blog\/([^/]+)\/?$/)
  if (post) {
    const found = (content.posts ?? []).find((entry) => entry.published && entry.slug === decodeURIComponent(post[1]))
    if (found) {
      return {
        title: `${found.title} · ${site.brandName}`,
        description: found.excerpt,
        image: found.coverImage || undefined,
      }
    }
  }
  return base
}

async function renderPage(request: Request, env: Env, url: URL): Promise<Response> {
  const asset = await env.ASSETS.fetch(new Request(new URL('/', url), request))
  if (!asset.ok || !(asset.headers.get('Content-Type') ?? '').includes('text/html')) return asset

  const lang = languageFor(request, url)
  let content: SiteContent | null = null
  try {
    content = await readContent(env.CONTENT, lang)
  } catch {
    // KV unavailable: ship the page anyway, the app falls back to its seed.
  }

  const headers = new Headers(asset.headers)
  headers.set('Cache-Control', 'no-cache')
  headers.set('Content-Language', lang)
  headers.delete('Content-Length')
  headers.delete('ETag')
  const response = new Response(asset.body, { status: 200, headers })
  if (!content) return response

  const meta = pageMeta(content, url.pathname)
  const image = meta.image ?? new URL('/og.jpg', url).toString()
  const doc = content

  /*
   * hreflang: each page exists in both languages. A post has its own slug per
   * language, so its twin (same id) is looked up in the other document.
   */
  const other: Lang = lang === 'en' ? 'es' : 'en'
  const postSlug = url.pathname.match(/^\/blog\/([^/]+)\/?$/)?.[1]
  const post = postSlug
    ? (content.posts ?? []).find((entry) => entry.published && entry.slug === decodeURIComponent(postSlug))
    : undefined
  const hrefFor: Record<Lang, string> = {
    [lang]: `${url.origin}${url.pathname}?lang=${lang}`,
    [other]: `${url.origin}${url.pathname}?lang=${other}`,
  } as Record<Lang, string>
  if (post) {
    try {
      const twin = (await readContent(env.CONTENT, other)).posts?.find((entry) => entry.id === post.id)
      hrefFor[other] = twin ? `${url.origin}/blog/${encodeURIComponent(twin.slug)}?lang=${other}` : ''
    } catch {
      hrefFor[other] = ''
    }
  }
  const alternates = LANGS.filter((code) => hrefFor[code])
    .map((code) => `<link rel="alternate" hreflang="${code}" href="${escapeAttr(hrefFor[code])}">`)
    .concat(`<link rel="alternate" hreflang="x-default" href="${escapeAttr(hrefFor.en || hrefFor[lang])}">`)
    .join('')

  const crawlerCopy = post
    ? articleHtml(post)
    : /^\/blog\/?$/.test(url.pathname)
      ? blogIndexHtml((content.posts ?? []).filter((entry) => entry.published))
      : ''

  return new HTMLRewriter()
    .on('html', {
      element: (el) => {
        el.setAttribute('lang', lang)
      },
    })
    .on('title', {
      element: (el) => {
        el.setInnerContent(meta.title)
      },
    })
    .on('meta[name="description"]', { element: (el) => void el.setAttribute('content', meta.description) })
    .on('meta[property="og:title"]', { element: (el) => void el.setAttribute('content', meta.title) })
    .on('meta[property="og:description"]', { element: (el) => void el.setAttribute('content', meta.description) })
    .on('meta[property="og:site_name"]', { element: (el) => void el.setAttribute('content', content.site.brandName) })
    .on('meta[property="og:image"]', { element: (el) => void el.setAttribute('content', image) })
    .on('meta[name="twitter:image"]', { element: (el) => void el.setAttribute('content', image) })
    .on('meta[property="og:locale"]', { element: (el) => void el.setAttribute('content', lang === 'es' ? 'es_DO' : 'en_US') })
    .on('head', {
      element: (el) => {
        el.append(`<meta property="og:url" content="${escapeAttr(url.origin + url.pathname)}">`, { html: true })
        el.append(alternates, { html: true })
        el.append(`<script>window.__BOOT__=${scriptJson({ lang, content: doc })}</script>`, { html: true })
      },
    })
    .on('body', {
      element: (el) => {
        if (crawlerCopy) el.append(crawlerCopy, { html: true })
      },
    })
    .transform(response)
}

/**
 * An uploaded photo or video from KV. Byte ranges are honoured because Safari
 * will not play a video from a server that ignores them.
 */
async function serveMedia(request: Request, env: Env, id: string): Promise<Response> {
  if (!MEDIA_ID.test(id)) return new Response('Not found', { status: 404 })
  const { value, metadata } = await env.CONTENT.getWithMetadata<MediaMetadata>(mediaKey(id), {
    type: 'arrayBuffer',
    cacheTtl: 60 * 60 * 24,
  })
  if (!value) return new Response('Not found', { status: 404 })

  const total = value.byteLength
  const headers = new Headers({
    'Content-Type': metadata?.type ?? 'application/octet-stream',
    // Every upload gets a new id, so a URL never changes what it points at.
    'Cache-Control': 'public, max-age=31536000, immutable',
    'Accept-Ranges': 'bytes',
    'X-Content-Type-Options': 'nosniff',
    'Content-Security-Policy': "default-src 'none'; sandbox",
  })
  const body = (bytes: ArrayBuffer) => (request.method === 'HEAD' ? null : bytes)

  const range = request.headers.get('Range')?.match(/^bytes=(\d*)-(\d*)$/)
  if (range && (range[1] || range[2])) {
    const start = range[1] ? Number(range[1]) : Math.max(0, total - Number(range[2]))
    const end = range[1] && range[2] ? Math.min(Number(range[2]), total - 1) : total - 1
    if (start >= total || start > end) {
      headers.set('Content-Range', `bytes */${total}`)
      return new Response(null, { status: 416, headers })
    }
    headers.set('Content-Range', `bytes ${start}-${end}/${total}`)
    headers.set('Content-Length', String(end - start + 1))
    return new Response(body(value.slice(start, end + 1)), { status: 206, headers })
  }

  headers.set('Content-Length', String(total))
  return new Response(body(value), { headers })
}

export default {
  async fetch(request, env, ctx): Promise<Response> {
    const url = new URL(request.url)
    const { pathname } = url

    if (pathname.startsWith('/api/')) {
      const rest = pathname.slice('/api/'.length).split('/').filter(Boolean)
      if (rest[0] === 'ai') return callPages(ai as Handler, request, env, ctx, rest.slice(1))
      if (rest[0] === 'uploads') return callPages(uploads as Handler, request, env, ctx, rest.slice(1))
      return callPages(api as Handler, request, env, ctx, rest)
    }

    const media = pathname.match(/^\/media\/([^/]+)$/)
    if (media && (request.method === 'GET' || request.method === 'HEAD')) return serveMedia(request, env, media[1])

    if (pathname === '/sitemap.xml') return callPages(sitemap as Handler, request, env, ctx, [])
    if (pathname === '/robots.txt') return callPages(robots as Handler, request, env, ctx, [])
    if (pathname === '/whatsapp') return Response.redirect(new URL('/book', url).toString(), 302)

    // A real file in the build (manifest, icon, og image…) is served as is.
    const accept = request.headers.get('Accept') ?? ''
    const isPage = request.method === 'GET' && (accept.includes('text/html') || !/\.[a-z0-9]{2,5}$/i.test(pathname))
    if (!isPage) return env.ASSETS.fetch(request)

    return renderPage(request, env, url)
  },
} satisfies ExportedHandler<Env>
