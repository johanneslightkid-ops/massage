import type { Booking, CollectionKey, SiteContent, SiteSettings } from '@shared/types'

async function request<T>(path: string, init?: RequestInit): Promise<T> {
  const response = await fetch(`/api${path}`, {
    credentials: 'same-origin',
    // Never read a stale body from the HTTP cache — the admin refetches content
    // straight after saving and must see what it just wrote.
    cache: 'no-store',
    headers: init?.body ? { 'Content-Type': 'application/json' } : undefined,
    ...init,
  })

  const text = await response.text()
  const data = text ? (JSON.parse(text) as unknown) : null

  if (!response.ok) {
    const message =
      data && typeof data === 'object' && 'error' in data
        ? String((data as { error: unknown }).error)
        : `Request failed (${response.status})`
    throw new Error(message)
  }
  return data as T
}

export interface AdminSession {
  authed: boolean
  usingDefaultPassword: boolean
}

export const api = {
  getContent: (lang: string = 'en') => request<SiteContent>(`/content?lang=${lang}`),

  createBooking: (payload: Record<string, string>) =>
    request<{ ok: true; id: string }>('/bookings', { method: 'POST', body: JSON.stringify(payload) }),

  me: () => request<AdminSession>('/admin/me'),

  login: (password: string) =>
    request<{ ok: true; usingDefaultPassword: boolean }>('/admin/login', {
      method: 'POST',
      body: JSON.stringify({ password }),
    }),

  logout: () => request<{ ok: true }>('/admin/logout', { method: 'POST' }),

  adminContent: (lang: string = 'en') => request<SiteContent>(`/admin/content?lang=${lang}`),

  saveSettings: (settings: Partial<SiteSettings>, lang: string = 'en') =>
    request<{ ok: true }>(`/admin/settings?lang=${lang}`, { method: 'PUT', body: JSON.stringify(settings) }),

  saveCollection: (key: CollectionKey, rows: unknown[], lang: string = 'en') =>
    request<{ ok: true; count: number }>(`/admin/collection/${key}?lang=${lang}`, {
      method: 'PUT',
      body: JSON.stringify(rows),
    }),

  changePassword: (current: string, next: string) =>
    request<{ ok: true; usingDefaultPassword: boolean }>('/admin/password', {
      method: 'POST',
      body: JSON.stringify({ current, next }),
    }),

  bookings: () => request<Booking[]>('/admin/bookings'),

  updateBooking: (id: string, patch: Partial<Booking>) =>
    request<{ ok: true; booking: Booking }>(`/admin/bookings/${id}`, {
      method: 'PATCH',
      body: JSON.stringify(patch),
    }),

  deleteBooking: (id: string) => request<{ ok: true }>(`/admin/bookings/${id}`, { method: 'DELETE' }),

  reset: (section: string) =>
    request<{ ok: true; section: string }>('/admin/reset', {
      method: 'POST',
      body: JSON.stringify({ section }),
    }),
}
