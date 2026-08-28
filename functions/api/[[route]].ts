import { seedContent } from '../../shared/seed'
import type { Booking, SiteContent } from '../../shared/types'
import {
  DEFAULT_PASSWORD,
  KV_KEYS,
  SESSION_TTL_SECONDS,
  checkLoginThrottle,
  clean,
  clearLoginThrottle,
  ensurePassword,
  fail,
  hashPassword,
  isAuthed,
  isCollectionKey,
  isDefaultPassword,
  json,
  listBookings,
  randomToken,
  readContent,
  recordFailedLogin,
  sessionCookie,
  sessionTokenFrom,
  verifyPassword,
  writeContent,
} from '../../shared/server'

interface Env {
  CONTENT: KVNamespace
  SITE_NAME?: string
}

export const onRequest: PagesFunction<Env> = async (context) => {
  const { request, env, params } = context
  const kv = env.CONTENT

  if (!kv) return fail(500, 'KV namespace CONTENT is not bound. Check wrangler.toml.')

  const segments = Array.isArray(params.route) ? params.route : params.route ? [params.route] : []
  const path = segments.join('/')
  const method = request.method.toUpperCase()
  const url = new URL(request.url)
  const secure = url.protocol === 'https:'
  const ip = request.headers.get('CF-Connecting-IP') ?? 'unknown'
  const lang = url.searchParams.get('lang') || 'en'

  if (method === 'OPTIONS') return new Response(null, { status: 204 })

  try {
    /* ----------------------------------------------------------- public */

    if (path === 'content' && method === 'GET') {
      // No caching here: an owner who saves in /admin expects the change on the
      // site immediately, and KV already caches reads at the edge for us.
      return json(await readContent(kv, lang))
    }

    if (path === 'bookings' && method === 'POST') {
      const body = (await request.json().catch(() => ({}))) as Record<string, unknown>
      const name = clean(body.name, 120)
      const contact = clean(body.contact, 160)
      if (!name || !contact) return fail(400, 'Name and a way to reach you are both required.')

      const booking: Booking = {
        id: `${Date.now()}-${randomToken().slice(0, 8)}`,
        createdAt: new Date().toISOString(),
        name,
        contact,
        service: clean(body.service, 160),
        duration: clean(body.duration, 60),
        venue: clean(body.venue, 160),
        date: clean(body.date, 40),
        time: clean(body.time, 40),
        people: clean(body.people, 40),
        hotel: clean(body.hotel, 200),
        notes: clean(body.notes, 1500),
        status: 'new',
      }
      await kv.put(KV_KEYS.booking(booking.id), JSON.stringify(booking), {
        expirationTtl: 60 * 60 * 24 * 180,
      })
      return json({ ok: true, id: booking.id }, { status: 201 })
    }

    /* ------------------------------------------------------------ admin */

    if (path === 'admin/login' && method === 'POST') {
      await ensurePassword(kv)
      const throttle = await checkLoginThrottle(kv, ip)
      if (throttle.blocked) return fail(429, 'Too many attempts. Wait ten minutes and try again.')

      const body = (await request.json().catch(() => ({}))) as { password?: string }
      const stored = (await kv.get(KV_KEYS.password)) ?? ''
      const ok = await verifyPassword(body.password ?? '', stored)

      if (!ok) {
        await recordFailedLogin(kv, ip)
        const left = (await checkLoginThrottle(kv, ip)).remaining
        return fail(401, left > 0 ? `Wrong password. ${left} attempts left.` : 'Wrong password.')
      }

      await clearLoginThrottle(kv, ip)
      const token = randomToken()
      await kv.put(KV_KEYS.session(token), JSON.stringify({ ip, at: Date.now() }), {
        expirationTtl: SESSION_TTL_SECONDS,
      })
      return json(
        { ok: true, usingDefaultPassword: await isDefaultPassword(kv) },
        { headers: { 'Set-Cookie': sessionCookie(token, SESSION_TTL_SECONDS, secure) } },
      )
    }

    if (path === 'admin/logout' && method === 'POST') {
      const token = sessionTokenFrom(request)
      if (token) await kv.delete(KV_KEYS.session(token))
      return json({ ok: true }, { headers: { 'Set-Cookie': sessionCookie('', 0, secure) } })
    }

    if (path === 'admin/me' && method === 'GET') {
      await ensurePassword(kv)
      const authed = await isAuthed(request, kv)
      return json({ authed, usingDefaultPassword: authed ? await isDefaultPassword(kv) : false })
    }

    // Everything past this point requires a session.
    if (path.startsWith('admin/')) {
      if (!(await isAuthed(request, kv))) return fail(401, 'Not signed in.')
    } else {
      return fail(404, 'Unknown endpoint.')
    }

    if (path === 'admin/content' && method === 'GET') {
      return json(await readContent(kv, lang))
    }

    if (path === 'admin/content' && method === 'PUT') {
      const body = (await request.json().catch(() => null)) as SiteContent | null
      if (!body || typeof body !== 'object') return fail(400, 'Invalid content payload.')
      const current = await readContent(kv, lang)
      await writeContent(kv, { ...current, ...body, site: { ...current.site, ...(body.site ?? {}) } }, lang)
      return json({ ok: true })
    }

    if (path === 'admin/settings' && method === 'PUT') {
      const body = (await request.json().catch(() => null)) as Record<string, unknown> | null
      if (!body) return fail(400, 'Invalid settings payload.')
      const current = await readContent(kv, lang)
      await writeContent(kv, { ...current, site: { ...current.site, ...body } as SiteContent['site'] }, lang)
      return json({ ok: true })
    }

    if (path.startsWith('admin/collection/') && method === 'PUT') {
      const key = path.slice('admin/collection/'.length)
      if (!isCollectionKey(key)) return fail(400, `Unknown collection "${key}".`)
      const body = (await request.json().catch(() => null)) as unknown
      if (!Array.isArray(body)) return fail(400, 'Expected an array of records.')
      const current = await readContent(kv, lang)
      await writeContent(kv, { ...current, [key]: body } as SiteContent, lang)
      return json({ ok: true, count: body.length })
    }

    if (path === 'admin/password' && method === 'POST') {
      const body = (await request.json().catch(() => ({}))) as { current?: string; next?: string }
      const stored = (await kv.get(KV_KEYS.password)) ?? ''
      if (!(await verifyPassword(body.current ?? '', stored))) return fail(403, 'Current password is not correct.')
      const next = (body.next ?? '').trim()
      if (next.length < 4) return fail(400, 'Choose a password of at least 4 characters.')
      await kv.put(KV_KEYS.password, await hashPassword(next))
      return json({ ok: true, usingDefaultPassword: next === DEFAULT_PASSWORD })
    }

    if (path === 'admin/bookings' && method === 'GET') {
      return json(await listBookings(kv))
    }

    if (path.startsWith('admin/bookings/')) {
      const id = path.slice('admin/bookings/'.length)
      const key = KV_KEYS.booking(id)

      if (method === 'DELETE') {
        await kv.delete(key)
        return json({ ok: true })
      }

      if (method === 'PATCH') {
        const existing = (await kv.get(key, 'json')) as Booking | null
        if (!existing) return fail(404, 'Booking not found.')
        const body = (await request.json().catch(() => ({}))) as Partial<Booking>
        const updated: Booking = { ...existing, ...body, id: existing.id, createdAt: existing.createdAt }
        await kv.put(key, JSON.stringify(updated), { expirationTtl: 60 * 60 * 24 * 180 })
        return json({ ok: true, booking: updated })
      }
    }

    if (path === 'admin/reset' && method === 'POST') {
      const body = (await request.json().catch(() => ({}))) as { section?: string }
      const section = body.section ?? 'all'
      if (section === 'all') {
        await writeContent(kv, structuredClone(seedContent), lang)
        return json({ ok: true, section })
      }
      if (section === 'site') {
        const current = await readContent(kv, lang)
        await writeContent(kv, { ...current, site: structuredClone(seedContent.site) }, lang)
        return json({ ok: true, section })
      }
      if (isCollectionKey(section)) {
        const current = await readContent(kv, lang)
        await writeContent(kv, { ...current, [section]: structuredClone(seedContent[section]) } as SiteContent, lang)
        return json({ ok: true, section })
      }
      return fail(400, `Cannot reset "${section}".`)
    }

    return fail(404, 'Unknown endpoint.')
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Unexpected error'
    return fail(500, message)
  }
}
