import { seedContent } from './seed.ts'
import { seedContentEs } from './seed-es.ts'
import type { SiteContent } from './types'

export const SUPPORTED_LANGS = ['en', 'es'] as const
export type SeedLang = (typeof SUPPORTED_LANGS)[number]

export function isSeedLang(value: string): value is SeedLang {
  return (SUPPORTED_LANGS as readonly string[]).includes(value)
}

/**
 * The starting content for a language. Kept in its own module so the browser
 * bundle can use it for the first paint without pulling in the Workers-only
 * session and crypto helpers that live in `shared/server.ts`.
 */
export function seedFor(lang: string): SiteContent {
  return lang === 'es' ? seedContentEs : seedContent
}
