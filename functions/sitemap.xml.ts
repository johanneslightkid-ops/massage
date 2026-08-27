/**
 * Generated rather than static so the URLs always carry whatever domain the
 * site is actually served from — the preview deployment, the workers.dev host
 * or a custom domain — with no configuration to keep in sync.
 */
const PAGES: Array<{ path: string; priority: string; changefreq: string }> = [
  { path: '/', priority: '1.0', changefreq: 'weekly' },
  { path: '/treatments', priority: '0.9', changefreq: 'weekly' },
  { path: '/discover', priority: '0.8', changefreq: 'monthly' },
  { path: '/team', priority: '0.7', changefreq: 'monthly' },
  { path: '/book', priority: '0.9', changefreq: 'monthly' },
]

export const onRequestGet: PagesFunction = ({ request }) => {
  const origin = new URL(request.url).origin
  const today = new Date().toISOString().slice(0, 10)

  const urls = PAGES.map(
    (page) =>
      `  <url>\n    <loc>${origin}${page.path}</loc>\n    <lastmod>${today}</lastmod>\n` +
      `    <changefreq>${page.changefreq}</changefreq>\n    <priority>${page.priority}</priority>\n  </url>`,
  ).join('\n')

  return new Response(
    `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls}\n</urlset>\n`,
    { headers: { 'Content-Type': 'application/xml; charset=utf-8', 'Cache-Control': 'public, max-age=3600' } },
  )
}
