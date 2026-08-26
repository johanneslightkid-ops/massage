import { useEffect, useState } from 'react'
import { Loader2, RefreshCw, Trash2 } from 'lucide-react'
import type { Booking } from '@shared/types'
import { api } from '@/lib/api'
import { bookingStatusLabels, cn, formatDateTime } from '@/lib/utils'

const statusStyles: Record<Booking['status'], string> = {
  new: 'bg-sun-200 text-sun-600',
  confirmed: 'bg-seafoam-100 text-lagoon-600',
  done: 'bg-sand-200 text-ocean-800',
  cancelled: 'bg-coral-100 text-coral-600',
}

export function BookingsPanel({ onCount }: { onCount?: (count: number) => void }) {
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
      setError(cause instanceof Error ? cause.message : 'Could not load requests.')
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
      setError(cause instanceof Error ? cause.message : 'Could not update.')
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
          <h1 className="font-display text-3xl text-ocean-900">Reservation requests</h1>
          <p className="mt-1.5 max-w-xl text-[0.92rem] text-ocean-800/60">
            Everything sent through the form on the website. Requests are kept for six months.
          </p>
        </div>
        <button
          type="button"
          onClick={load}
          className="inline-flex h-11 items-center gap-2 rounded-full border border-ocean-900/12 px-5 text-[0.86rem] font-semibold text-ocean-800/70 transition-colors hover:text-ocean-900"
        >
          <RefreshCw className={cn('size-4', busy && 'animate-spin')} />
          Refresh
        </button>
      </header>

      {error && <p className="mt-6 rounded-2xl bg-coral-100 p-4 text-[0.88rem] text-coral-600">{error}</p>}

      {rows === null ? (
        <div className="mt-10 flex items-center gap-3 text-ocean-800/50">
          <Loader2 className="size-4 animate-spin" />
          Loading…
        </div>
      ) : rows.length === 0 ? (
        <div className="mt-8 rounded-3xl border border-dashed border-ocean-900/15 p-12 text-center text-ocean-800/50">
          No requests yet. They appear here the moment someone uses the reservation form.
        </div>
      ) : (
        <ul className="mt-8 space-y-3">
          {rows.map((booking) => (
            <li key={booking.id} className="rounded-3xl border border-ocean-900/10 bg-white p-5">
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div>
                  <p className="font-display text-xl text-ocean-900">{booking.name}</p>
                  <p className="mt-0.5 text-[0.82rem] text-ocean-800/50">{formatDateTime(booking.createdAt)}</p>
                </div>
                <span
                  className={cn(
                    'rounded-full px-3 py-1 text-[0.7rem] font-bold tracking-wide uppercase',
                    statusStyles[booking.status],
                  )}
                >
                  {bookingStatusLabels[booking.status]}
                </span>
              </div>

              <dl className="mt-4 grid gap-x-6 gap-y-2 text-[0.88rem] sm:grid-cols-2">
                {[
                  ['Treatment', booking.service],
                  ['Duration', booking.duration],
                  ['Where', booking.venue],
                  ['Hotel / room', booking.hotel],
                  ['Date', booking.date],
                  ['Time', booking.time],
                  ['People', booking.people],
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
                <p className="mt-4 rounded-2xl bg-sand-100 p-4 text-[0.88rem] leading-relaxed text-ocean-800/80">
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
                        ? 'bg-ocean-900 text-sand-50'
                        : 'border border-ocean-900/12 text-ocean-800/60 hover:text-ocean-900',
                    )}
                  >
                    {bookingStatusLabels[status]}
                  </button>
                ))}
                <button
                  type="button"
                  onClick={() => remove(booking)}
                  aria-label="Delete request"
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
