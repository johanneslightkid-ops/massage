import { useCallback, useEffect, useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { AnimatePresence, motion } from 'motion/react'
import {
  CalendarCheck,
  CircleHelp,
  Compass,
  CreditCard,
  ExternalLink,
  Gift,
  Image as ImageIcon,
  KeyRound,
  LayoutDashboard,
  Loader2,
  LogOut,
  MapPin,
  MessageSquareQuote,
  Settings2,
  Sparkles,
  Star,
  Users,
} from 'lucide-react'
import type { ReactNode } from 'react'
import { collectionSchemas } from '@shared/schema'
import type { CollectionKey, SiteContent } from '@shared/types'
import { api } from '@/lib/api'
import { useContent } from '@/lib/content-store'
import { cn } from '@/lib/utils'
import { useSetMobileNav } from '@/components/layout/mobile-nav'
import { Login } from '@/components/admin/Login'
import { SettingsEditor } from '@/components/admin/SettingsEditor'
import { CollectionEditor } from '@/components/admin/CollectionEditor'
import { BookingsPanel } from '@/components/admin/BookingsPanel'
import { SecurityPanel } from '@/components/admin/SecurityPanel'

const icons: Record<string, ReactNode> = {
  dashboard: <LayoutDashboard className="size-[1.15rem]" />,
  settings: <Settings2 className="size-[1.15rem]" />,
  sparkles: <Sparkles className="size-[1.15rem]" />,
  gift: <Gift className="size-[1.15rem]" />,
  pin: <MapPin className="size-[1.15rem]" />,
  users: <Users className="size-[1.15rem]" />,
  star: <Star className="size-[1.15rem]" />,
  compass: <Compass className="size-[1.15rem]" />,
  quote: <MessageSquareQuote className="size-[1.15rem]" />,
  help: <CircleHelp className="size-[1.15rem]" />,
  card: <CreditCard className="size-[1.15rem]" />,
  image: <ImageIcon className="size-[1.15rem]" />,
  bookings: <CalendarCheck className="size-[1.15rem]" />,
  security: <KeyRound className="size-[1.15rem]" />,
}

interface AdminSection {
  key: string
  label: string
  short: string
  icon: ReactNode
}

const staticSections: AdminSection[] = [
  { key: 'overview', label: 'Overview', short: 'Home', icon: icons.dashboard },
  { key: 'settings', label: 'Site settings', short: 'Site', icon: icons.settings },
]

export function Admin() {
  const { refresh } = useContent()
  const [checking, setChecking] = useState(true)
  const [authed, setAuthed] = useState(false)
  const [usingDefault, setUsingDefault] = useState(false)
  const [content, setContent] = useState<SiteContent | null>(null)
  const [section, setSection] = useState('overview')
  const [newBookings, setNewBookings] = useState(0)

  const sections = useMemo<AdminSection[]>(
    () => [
      ...staticSections,
      ...collectionSchemas.map((schema) => ({
        key: schema.key,
        label: schema.label,
        short: schema.singular === 'Place or tip' ? 'Guide' : schema.label.split(' ')[0],
        icon: icons[schema.icon] ?? icons.sparkles,
      })),
      { key: 'bookings', label: 'Requests', short: 'Requests', icon: icons.bookings },
      { key: 'security', label: 'Password & data', short: 'Password', icon: icons.security },
    ],
    [],
  )

  const loadContent = useCallback(async () => {
    const fresh = await api.adminContent()
    setContent(fresh)
    await refresh()
  }, [refresh])

  useEffect(() => {
    let cancelled = false
    void (async () => {
      try {
        const session = await api.me()
        if (cancelled) return
        setAuthed(session.authed)
        setUsingDefault(session.usingDefaultPassword)
        if (session.authed) await loadContent()
      } catch {
        if (!cancelled) setAuthed(false)
      } finally {
        if (!cancelled) setChecking(false)
      }
    })()
    return () => {
      cancelled = true
    }
  }, [loadContent])

  useEffect(() => {
    if (!authed) return
    void api
      .bookings()
      .then((rows) => setNewBookings(rows.filter((row) => row.status === 'new').length))
      .catch(() => undefined)
  }, [authed])

  // The admin owns the shell for as long as it is open: signed in, the public
  // bottom bar becomes the admin menu; signed out, the sign-in gets the screen.
  useSetMobileNav(
    authed
      ? {
          title: 'Admin',
          activeKey: section,
          items: sections.map((entry) => ({
            key: entry.key,
            label: entry.short,
            icon: entry.icon,
            onSelect: () => setSection(entry.key),
            badge: entry.key === 'bookings' && newBookings > 0 ? newBookings : undefined,
          })),
        }
      : { items: [], activeKey: '' },
    [authed, section, sections, newBookings],
  )

  async function signOut() {
    await api.logout().catch(() => undefined)
    setAuthed(false)
    setContent(null)
    setSection('overview')
  }

  if (checking) {
    return (
      <div className="grid min-h-dvh place-items-center bg-ocean-950 text-sand-200/60">
        <Loader2 className="size-6 animate-spin" />
      </div>
    )
  }

  if (!authed) {
    return (
      <Login
        onSignedIn={async (isDefault) => {
          setUsingDefault(isDefault)
          setAuthed(true)
          await loadContent()
        }}
      />
    )
  }

  const activeSchema = collectionSchemas.find((schema) => schema.key === section)

  return (
    <div className="min-h-dvh bg-sand-100">
      {/* -------------------------------------------------- top bar */}
      <header className="sticky top-0 z-30 border-b border-ocean-900/8 bg-sand-50/92 backdrop-blur-xl">
        <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-5 py-3.5 lg:px-8">
          <div className="min-w-0">
            <p className="text-[0.66rem] font-bold tracking-[0.2em] text-lagoon-600 uppercase">
              {content?.site.brandName ?? 'Admin'}
            </p>
            <p className="truncate font-display text-lg text-ocean-900">
              {sections.find((entry) => entry.key === section)?.label}
            </p>
          </div>
          <div className="flex shrink-0 items-center gap-2">
            <Link
              to="/"
              className="inline-flex h-10 items-center gap-2 rounded-full border border-ocean-900/12 px-4 text-[0.84rem] font-semibold text-ocean-800/70 transition-colors hover:text-ocean-900"
            >
              <ExternalLink className="size-3.5" />
              <span className="hidden sm:inline">View site</span>
            </Link>
            <button
              type="button"
              onClick={signOut}
              className="inline-flex h-10 items-center gap-2 rounded-full bg-ocean-900 px-4 text-[0.84rem] font-semibold text-sand-50 transition-colors hover:bg-ocean-800"
            >
              <LogOut className="size-3.5" />
              <span className="hidden sm:inline">Sign out</span>
            </button>
          </div>
        </div>
      </header>

      <div className="mx-auto flex max-w-6xl gap-8 px-5 py-8 lg:px-8">
        {/* --------------------------------------------- desktop rail */}
        <nav className="sticky top-24 hidden h-fit w-56 shrink-0 lg:block" aria-label="Admin sections">
          <ul className="space-y-1">
            {sections.map((entry) => (
              <li key={entry.key}>
                <button
                  type="button"
                  onClick={() => setSection(entry.key)}
                  className={cn(
                    'flex w-full items-center gap-3 rounded-2xl px-4 py-2.5 text-left text-[0.9rem] font-semibold transition-colors',
                    section === entry.key
                      ? 'bg-ocean-900 text-sand-50'
                      : 'text-ocean-800/65 hover:bg-white hover:text-ocean-900',
                  )}
                >
                  {entry.icon}
                  <span className="flex-1 truncate">{entry.label}</span>
                  {entry.key === 'bookings' && newBookings > 0 && (
                    <span className="grid size-5 place-items-center rounded-full bg-coral-500 text-[0.65rem] font-bold text-white">
                      {newBookings}
                    </span>
                  )}
                </button>
              </li>
            ))}
          </ul>
        </nav>

        {/* -------------------------------------------------- content */}
        <div className="min-w-0 flex-1 pb-32 lg:pb-16">
          {usingDefault && section !== 'security' && (
            <button
              type="button"
              onClick={() => setSection('security')}
              className="mb-6 flex w-full items-center gap-3 rounded-3xl border border-sun-400/40 bg-sun-200/50 p-4 text-left transition-colors hover:bg-sun-200"
            >
              <KeyRound className="size-5 shrink-0 text-sun-600" />
              <span className="text-[0.9rem] font-semibold text-ocean-900">
                You are still using the default password — tap to change it.
              </span>
            </button>
          )}

          <AnimatePresence mode="wait">
            <motion.div
              key={section}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.24, ease: [0.22, 1, 0.36, 1] }}
            >
              {section === 'overview' && content && (
                <Overview content={content} newBookings={newBookings} onJump={setSection} />
              )}

              {section === 'settings' && content && (
                <SettingsEditor settings={content.site} onSaved={loadContent} />
              )}

              {activeSchema && content && (
                <CollectionEditor
                  schema={activeSchema}
                  rows={content[activeSchema.key as CollectionKey] as unknown as Record<string, unknown>[]}
                  onSaved={loadContent}
                />
              )}

              {section === 'bookings' && <BookingsPanel onCount={setNewBookings} />}

              {section === 'security' && (
                <SecurityPanel
                  usingDefaultPassword={usingDefault}
                  onChanged={setUsingDefault}
                  onResetAll={loadContent}
                />
              )}
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </div>
  )
}

/* ---------------------------------------------------------------- overview */

function Overview({
  content,
  newBookings,
  onJump,
}: {
  content: SiteContent
  newBookings: number
  onJump: (key: string) => void
}) {
  const stats = [
    { label: 'Treatments', value: content.services.length, key: 'services' },
    { label: 'Local tips', value: content.discover.length, key: 'discover' },
    { label: 'Therapists', value: content.team.length, key: 'team' },
    { label: 'New requests', value: newBookings, key: 'bookings' },
  ]

  return (
    <div>
      <header>
        <h1 className="font-display text-3xl text-ocean-900">Hola, {content.site.ownerName.split(' ')[0]}.</h1>
        <p className="mt-1.5 max-w-xl text-[0.92rem] text-ocean-800/60">
          Everything on the website is editable here. Changes go live the moment you save.
        </p>
      </header>

      <div className="mt-7 grid grid-cols-2 gap-3 sm:grid-cols-4">
        {stats.map((stat) => (
          <button
            key={stat.key}
            type="button"
            onClick={() => onJump(stat.key)}
            className="rounded-3xl border border-ocean-900/10 bg-white p-5 text-left transition-all duration-300 hover:-translate-y-0.5 hover:shadow-soft"
          >
            <p className="font-display text-4xl text-ocean-900">{stat.value}</p>
            <p className="mt-1 text-[0.78rem] font-semibold tracking-wide text-ocean-800/50 uppercase">
              {stat.label}
            </p>
          </button>
        ))}
      </div>

      <div className="mt-8 grid gap-4 sm:grid-cols-2">
        <div className="rounded-4xl border border-ocean-900/10 bg-white p-6">
          <h2 className="font-display text-xl text-ocean-900">Start here</h2>
          <ul className="mt-4 space-y-2.5 text-[0.9rem]">
            {[
              ['settings', 'Put your real WhatsApp number in Site settings → Contact'],
              ['services', 'Check the treatment prices against what you actually charge'],
              ['team', 'Replace the team names and add photos'],
              ['discover', 'Add the places you personally send guests to'],
              ['security', 'Change the admin password from the default'],
            ].map(([key, text]) => (
              <li key={key}>
                <button
                  type="button"
                  onClick={() => onJump(key)}
                  className="text-left text-ocean-800/75 transition-colors hover:text-lagoon-600"
                >
                  → {text}
                </button>
              </li>
            ))}
          </ul>
        </div>

        <div className="rounded-4xl border border-ocean-900/10 bg-white p-6">
          <h2 className="font-display text-xl text-ocean-900">How editing works</h2>
          <ul className="mt-4 space-y-2.5 text-[0.9rem] leading-relaxed text-ocean-800/70">
            <li>Tap any row to open it, edit the fields, then press <strong className="text-ocean-900">Save changes</strong> in the bar at the bottom.</li>
            <li>Arrows on the left of each row change the order things appear in on the website.</li>
            <li>Photos are added by pasting an image link — leave it empty and we draw tropical artwork instead.</li>
            <li>Every section has a <strong className="text-ocean-900">Restore defaults</strong> button if an edit goes wrong.</li>
          </ul>
        </div>
      </div>
    </div>
  )
}
