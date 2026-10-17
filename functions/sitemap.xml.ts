import { mergeWithSeed } from '../shared/server'
import type { SiteContent } from '../shared/types'

/**
 * Generated rather than static so the URLs always carry whatever domain the
 * site is actually served from — the preview deployment, the workers.dev host
 * or a custom domain — with no configuration to keep in sync.
 *
 * Blog posts are read from KV in every language: each language has its own
 * slug, and each slug is a page Google should know about.
 */
const PAGES: Array<{ path: string; priority: string; changefreq: string }> = [
  { path: '/', priority: '1.0', changefreq: 'weekly' },
  { path: '/treatments', priority: '0.9', changefreq: 'weekly' },
  { path: '/find-your-massage', priority: '0.9', changefreq: 'weekly' },
  { path: '/blog', priority: '0.8', changefreq: 'weekly' },
  { path: '/discover', priority: '0.8', changefreq: 'monthly' },
  { path: '/team', priority: '0.7', changefreq: 'monthly' },
  { path: '/book', priority: '0.9', changefreq: 'monthly' },
]

interface Env {
  CONTENT?: KVNamespace
}

async function postUrls(kv: KVNamespace | undefined): Promise<Array<{ path: string; lastmod: string }>> {
  if (!kv) return []
  const out: Array<{ path: string; lastmod: string }> = []
  for (const lang of ['en', 'es']) {
    // Merged with the seed, exactly as the site reads it: a document written
    // before the blog existed still lists the posts the site shows.
    const stored = (await kv.get(`content:${lang}:v1`, 'json').catch(() => null)) as Partial<SiteContent> | null
    const doc = mergeWithSeed(stored ?? {}, lang)
    for (const post of doc.posts ?? []) {
      if (!post.published || !post.slug) continue
      out.push({ path: `/blog/${encodeURIComponent(post.slug)}?lang=${lang}`, lastmod: post.publishedAt })
    }
  }
  return out
}

export const onRequestGet: PagesFunction<Env> = async ({ request, env }) => {
  const origin = new URL(request.url).origin
  const today = new Date().toISOString().slice(0, 10)

  const entry = (path: string, lastmod: string, changefreq: string, priority: string) =>
    `  <url>\n    <loc>${origin}${path.replace(/&/g, '&amp;')}</loc>\n    <lastmod>${lastmod}</lastmod>\n` +
    `    <changefreq>${changefreq}</changefreq>\n    <priority>${priority}</priority>\n  </url>`

  const urls = [
    ...PAGES.map((page) => entry(page.path, today, page.changefreq, page.priority)),
    ...(await postUrls(env.CONTENT)).map((post) => entry(post.path, post.lastmod || today, 'monthly', '0.6')),
  ].join('\n')

  return new Response(
    `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls}\n</urlset>\n`,
    { headers: { 'Content-Type': 'application/xml; charset=utf-8', 'Cache-Control': 'public, max-age=3600' } },
  )
}
