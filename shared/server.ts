import { seedContent } from './seed'
import type { Booking, CollectionKey, SiteContent } from './types'

export const KV_KEYS = {
  content: (lang: string = 'en') => `content:${lang}:v1`,
  password: 'auth:password',
  session: (token: string) => `session:${token}`,
  booking: (id: string) => `booking:${id}`,
  loginAttempts: (ip: string) => `throttle:login:${ip}`,
} as const

export const SESSION_COOKIE = 'os_session'
export const SESSION_TTL_SECONDS = 60 * 60 * 12
export const DEFAULT_PASSWORD = 'massage'

const PBKDF2_ITERATIONS = 100_000
const encoder = new TextEncoder()

/* ------------------------------------------------------------------ crypto */

function toBase64(bytes: Uint8Array): string {
  let binary = ''
  for (const byte of bytes) binary += String.fromCharCode(byte)
  return btoa(binary)
}

function fromBase64(value: string): Uint8Array {
  const binary = atob(value)
  const bytes = new Uint8Array(binary.length)
  for (let i = 0; i < binary.length; i++) bytes[i] = binary.charCodeAt(i)
  return bytes
}

async function derive(password: string, salt: Uint8Array): Promise<string> {
  const key = await crypto.subtle.importKey('raw', encoder.encode(password), 'PBKDF2', false, ['deriveBits'])
  const bits = await crypto.subtle.deriveBits(
    { name: 'PBKDF2', salt: salt as BufferSource, iterations: PBKDF2_ITERATIONS, hash: 'SHA-256' },
    key,
    256,
  )
  return toBase64(new Uint8Array(bits))
}

export async function hashPassword(password: string): Promise<string> {
  const salt = crypto.getRandomValues(new Uint8Array(16))
  const hash = await derive(password, salt)
  return `pbkdf2$${PBKDF2_ITERATIONS}$${toBase64(salt)}$${hash}`
}

export async function verifyPassword(password: string, stored: string): Promise<boolean> {
  const [scheme, , saltB64, expected] = stored.split('$')
  if (scheme !== 'pbkdf2' || !saltB64 || !expected) return false
  const actual = await derive(password, fromBase64(saltB64))
  return timingSafeEqual(actual, expected)
}

/** Constant-time-ish string compare, so a wrong password leaks no timing signal. */
function timingSafeEqual(a: string, b: string): boolean {
  if (a.length !== b.length) return false
  let diff = 0
  for (let i = 0; i < a.length; i++) diff |= a.charCodeAt(i) ^ b.charCodeAt(i)
  return diff === 0
}

export function randomToken(): string {
  return toBase64(crypto.getRandomValues(new Uint8Array(32)))
    .replace(/[^a-zA-Z0-9]/g, '')
    .slice(0, 40)
}

/* ----------------------------------------------------------------- content */

/**
 * Reads content from KV, seeding it on first run. Unknown keys from an older
 * deployment are filled in from the seed so a schema addition never 500s.
 */
export async function readContent(kv: KVNamespace, lang: string = 'en'): Promise<SiteContent> {
  const raw = await kv.get(KV_KEYS.content(lang), 'json')
  if (!raw) {
    await kv.put(KV_KEYS.content(lang), JSON.stringify(seedContent))
    return structuredClone(seedContent)
  }
  return mergeWithSeed(raw as Partial<SiteContent>)
}

export function mergeWithSeed(stored: Partial<SiteContent>): SiteContent {
  const base = structuredClone(seedContent)
  return {
    ...base,
    ...stored,
    site: { ...base.site, ...(stored.site ?? {}) },
  }
}

export async function writeContent(kv: KVNamespace, content: SiteContent, lang: string = 'en'): Promise<void> {
  await kv.put(KV_KEYS.content(lang), JSON.stringify(content))
}

export const COLLECTION_KEYS: CollectionKey[] = [
  'services',
  'venues',
  'team',
  'benefits',
  'discover',
  'testimonials',
  'faqs',
  'packages',
  'payments',
  'gallery',
]

export function isCollectionKey(value: string): value is CollectionKey {
  return (COLLECTION_KEYS as string[]).includes(value)
}

/* ---------------------------------------------------------------- sessions */

export async function ensurePassword(kv: KVNamespace): Promise<void> {
  const existing = await kv.get(KV_KEYS.password)
  if (!existing) await kv.put(KV_KEYS.password, await hashPassword(DEFAULT_PASSWORD))
}

export async function isDefaultPassword(kv: KVNamespace): Promise<boolean> {
  const stored = await kv.get(KV_KEYS.password)
  if (!stored) return true
  return verifyPassword(DEFAULT_PASSWORD, stored)
}

export function readCookie(request: Request, name: string): string | null {
  const header = request.headers.get('Cookie')
  if (!header) return null
  for (const part of header.split(';')) {
    const [key, ...rest] = part.trim().split('=')
    if (key === name) return decodeURIComponent(rest.join('='))
  }
  return null
}

export function sessionTokenFrom(request: Request): string | null {
  const auth = request.headers.get('Authorization')
  if (auth?.startsWith('Bearer ')) return auth.slice(7).trim()
  return readCookie(request, SESSION_COOKIE)
}

export async function isAuthed(request: Request, kv: KVNamespace): Promise<boolean> {
  const token = sessionTokenFrom(request)
  if (!token) return false
  return (await kv.get(KV_KEYS.session(token))) !== null
}

export function sessionCookie(token: string, maxAge: number, secure: boolean): string {
  const parts = [
    `${SESSION_COOKIE}=${token}`,
    'Path=/',
    'HttpOnly',
    'SameSite=Strict',
    `Max-Age=${maxAge}`,
  ]
  if (secure) parts.push('Secure')
  return parts.join('; ')
}

/* -------------------------------------------------------------- throttling */

export interface Throttle {
  blocked: boolean
  remaining: number
}

export async function checkLoginThrottle(kv: KVNamespace, ip: string): Promise<Throttle> {
  const raw = await kv.get(KV_KEYS.loginAttempts(ip))
  const count = raw ? Number(raw) : 0
  return { blocked: count >= 10, remaining: Math.max(0, 10 - count) }
}

export async function recordFailedLogin(kv: KVNamespace, ip: string): Promise<void> {
  const key = KV_KEYS.loginAttempts(ip)
  const count = Number((await kv.get(key)) ?? 0) + 1
  await kv.put(key, String(count), { expirationTtl: 600 })
}

export async function clearLoginThrottle(kv: KVNamespace, ip: string): Promise<void> {
  await kv.delete(KV_KEYS.loginAttempts(ip))
}

/* ---------------------------------------------------------------- bookings */

export async function listBookings(kv: KVNamespace): Promise<Booking[]> {
  const list = await kv.list({ prefix: 'booking:' })
  const rows = await Promise.all(list.keys.map((k) => kv.get(k.name, 'json') as Promise<Booking | null>))
  return rows
    .filter((b): b is Booking => Boolean(b))
    .sort((a, b) => b.createdAt.localeCompare(a.createdAt))
}

/* ----------------------------------------------------------------- helpers */

export function json(data: unknown, init: ResponseInit = {}): Response {
  return new Response(JSON.stringify(data), {
    ...init,
    headers: {
      'Content-Type': 'application/json; charset=utf-8',
      'Cache-Control': 'no-store',
      ...(init.headers ?? {}),
    },
  })
}

export function fail(status: number, message: string): Response {
  return json({ error: message }, { status })
}

/** Trim + cap free-text so a bad actor cannot write megabytes into KV. */
export function clean(value: unknown, max = 500): string {
  return typeof value === 'string' ? value.trim().slice(0, max) : ''
}
