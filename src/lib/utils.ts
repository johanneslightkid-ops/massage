import type { Booking, Duration, Service, SiteSettings } from '@shared/types'

/** Tiny classnames helper — no dependency needed for what we do here. */
export function cn(...parts: Array<string | false | null | undefined>): string {
  return parts.filter(Boolean).join(' ')
}

export function sortByOrder<T extends { order: number }>(rows: T[] | undefined): T[] {
  return [...(rows ?? [])].sort((a, b) => (a.order ?? 0) - (b.order ?? 0))
}

export function formatPrice(amount: number, currency = 'USD'): string {
  const symbol = currency === 'USD' ? '$' : currency === 'EUR' ? '€' : `${currency} `
  return `${symbol}${Math.round(amount)}`
}

export function priceFrom(service: Pick<Service, 'durations'>): number {
  if (!service.durations?.length) return 0
  return Math.min(...service.durations.map((d) => d.price))
}

export function durationLabel(duration: Duration): string {
  return `${duration.minutes} min`
}

/** Builds a wa.me deep link; strips anything that is not a digit from the number. */
export function whatsappLink(site: Pick<SiteSettings, 'whatsapp' | 'whatsappGreeting'>, message?: string): string {
  const number = (site.whatsapp || '').replace(/\D/g, '')
  const text = encodeURIComponent(message ?? site.whatsappGreeting ?? 'Hola!')
  return `https://wa.me/${number}?text=${text}`
}

export interface BookingDraft {
  service: string
  duration: string
  venue: string
  date: string
  time: string
  people: string
  name: string
  hotel: string
  notes: string
}

/** Turns the reservation form into a message the owner can act on in one read. */
export function bookingMessage(draft: BookingDraft, brand: string): string {
  const lines = [`Hola ${brand}! I would like to reserve a massage.`, '']
  const add = (label: string, value: string) => {
    if (value?.trim()) lines.push(`${label}: ${value.trim()}`)
  }
  add('Name', draft.name)
  add('Treatment', draft.service)
  add('Duration', draft.duration)
  add('Where', draft.venue)
  add('Hotel / room', draft.hotel)
  add('Date', draft.date)
  add('Time', draft.time)
  add('People', draft.people)
  add('Notes', draft.notes)
  return lines.join('\n')
}

export function formatDateTime(iso: string): string {
  const date = new Date(iso)
  if (Number.isNaN(date.getTime())) return iso
  return date.toLocaleString(undefined, {
    day: 'numeric',
    month: 'short',
    hour: '2-digit',
    minute: '2-digit',
  })
}

export const bookingStatusLabels: Record<Booking['status'], string> = {
  new: 'New',
  confirmed: 'Confirmed',
  done: 'Done',
  cancelled: 'Cancelled',
}

/** Stable pseudo-random 0..1 from a string — used to vary generated artwork. */
export function seededUnit(seed: string): number {
  let hash = 2166136261
  for (let i = 0; i < seed.length; i++) {
    hash ^= seed.charCodeAt(i)
    hash = Math.imul(hash, 16777619)
  }
  return ((hash >>> 0) % 1000) / 1000
}

export function slugify(value: string): string {
  return value
    .toLowerCase()
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
}
