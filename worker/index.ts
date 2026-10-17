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
import type { SiteContent } from '../shared/types'

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
        el.append(`<script>window.__BOOT__=${scriptJson({ lang, content })}</script>`, { html: true })
      },
    })
    .transform(response)
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
