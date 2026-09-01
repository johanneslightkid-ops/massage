import { useEffect, useState } from 'react'
import { Loader2, RefreshCw, Trash2 } from 'lucide-react'
import type { Booking } from '@shared/types'
import { api } from '@/lib/api'
import { useLanguage } from '@/lib/translations/LanguageProvider'
import { bookingStatusKeys, cn, formatDateTime } from '@/lib/utils'

const statusStyles: Record<Booking['status'], string> = {
  new: 'bg-sun-200 text-sun-700',
  confirmed: 'bg-seafoam-100 text-lagoon-700',
  done: 'bg-sand-200 text-ocean-800',
  cancelled: 'bg-coral-100 text-coral-600',
}

export function BookingsPanel({ onCount }: { onCount?: (count: number) => void }) {
  const { t, locale } = useLanguage()
  const [rows, setRows] = useState<Booking[] | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [busy, setBusy] = useState(false)

  async function load() {
    setBusy(true)
    try {
      const data = await api.bookings()
      setRows(data)
      onCount?.(data.filter((row) => row.status === 'new').length)
      setError(null)
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : t('admin.bookings_load_error'))
    } finally {
      setBusy(false)
    }
  }

  useEffect(() => {
    void load()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  async function setStatus(booking: Booking, status: Booking['status']) {
    setRows((current) => current?.map((row) => (row.id === booking.id ? { ...row, status } : row)) ?? null)
    try {
      await api.updateBooking(booking.id, { status })
      await load()
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : t('admin.bookings_update_error'))
    }
  }

  async function remove(booking: Booking) {
    setRows((current) => current?.filter((row) => row.id !== booking.id) ?? null)
    await api.deleteBooking(booking.id).catch(() => undefined)
    await load()
  }

  return (
    <div>
      <header className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <h1 className="font-display text-3xl text-ocean-950">{t('admin.bookings_title')}</h1>
          <p className="mt-1.5 max-w-xl text-[0.92rem] text-ocean-800/60">
            {t('admin.bookings_lead')}
          </p>
        </div>
        <button
          type="button"
          onClick={load}
          className="inline-flex h-11 items-center gap-2 rounded-full border border-ocean-900/12 px-5 text-[0.86rem] font-semibold text-ocean-800/70 transition-colors hover:text-ocean-900"
        >
          <RefreshCw className={cn('size-4', busy && 'animate-spin')} />
          {t('action.refresh')}
        </button>
      </header>

      {error && <p className="mt-6 rounded-2xl bg-coral-100 p-4 text-[0.88rem] text-coral-600">{error}</p>}

      {rows === null ? (
        <div className="mt-10 flex items-center gap-3 text-ocean-800/50">
          <Loader2 className="size-4 animate-spin" />
          {t('action.loading')}
        </div>
      ) : rows.length === 0 ? (
        <div className="mt-8 rounded-3xl border border-dashed border-ocean-900/15 p-12 text-center text-ocean-800/50">
          {t('admin.bookings_empty')}
        </div>
      ) : (
        <ul className="mt-8 space-y-3">
          {rows.map((booking) => (
            <li key={booking.id} className="rounded-4xl border border-white/70 bg-white/90 p-5 shadow-soft">
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div>
                  <p className="font-display text-xl text-ocean-950">{booking.name}</p>
                  <p className="mt-0.5 text-[0.82rem] text-ocean-800/50">{formatDateTime(booking.createdAt, locale)}</p>
                </div>
                <span
                  className={cn(
                    'rounded-full px-3 py-1 text-[0.7rem] font-bold tracking-wide uppercase',
                    statusStyles[booking.status],
                  )}
                >
                  {t(bookingStatusKeys[booking.status])}
                </span>
              </div>

              <dl className="mt-4 grid gap-x-6 gap-y-2 text-[0.88rem] sm:grid-cols-2">
                {[
                  [t('wa.treatment'), booking.service],
                  [t('wa.duration'), booking.duration],
                  [t('wa.where'), booking.venue],
                  [t('wa.hotel'), booking.hotel],
                  [t('wa.date'), booking.date],
                  [t('wa.time'), booking.time],
                  [t('wa.people'), booking.people],
                ]
                  .filter(([, value]) => Boolean(value))
                  .map(([label, value]) => (
                    <div key={label} className="flex gap-2">
                      <dt className="shrink-0 text-ocean-800/45">{label}:</dt>
                      <dd className="font-medium text-ocean-900">{value}</dd>
                    </div>
                  ))}
              </dl>

              {booking.notes && (
                <p className="mt-4 rounded-2xl bg-sky-50 p-4 text-[0.88rem] leading-relaxed text-ocean-800/80">
                  {booking.notes}
                </p>
              )}

              <div className="mt-5 flex flex-wrap items-center gap-2">
                {(['new', 'confirmed', 'done', 'cancelled'] as const).map((status) => (
                  <button
                    key={status}
                    type="button"
                    onClick={() => setStatus(booking, status)}
                    className={cn(
                      'h-9 rounded-full px-4 text-[0.8rem] font-semibold transition-colors',
                      booking.status === status
                        ? 'bg-gradient-to-r from-sky-700 to-lagoon-600 text-sand-50'
                        : 'border border-ocean-900/12 text-ocean-800/60 hover:text-ocean-900',
                    )}
                  >
                    {t(bookingStatusKeys[status])}
                  </button>
                ))}
                <button
                  type="button"
                  onClick={() => remove(booking)}
                  aria-label={t('admin.delete_request')}
                  className="ml-auto grid size-9 place-items-center rounded-xl text-ocean-800/40 transition-colors hover:bg-coral-100 hover:text-coral-600"
                >
                  <Trash2 className="size-4" />
                </button>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}
