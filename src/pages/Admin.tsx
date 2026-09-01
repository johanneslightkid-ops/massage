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
  Mic,
  Settings2,
  Sparkles,
  Star,
  Users,
} from 'lucide-react'
import type { ReactNode } from 'react'
import { localizedCollections } from '@shared/schema-i18n'
import type { CollectionKey, SiteContent } from '@shared/types'
import { api } from '@/lib/api'
import { useContent } from '@/lib/content-store'
import { useLanguage } from '@/lib/translations/LanguageProvider'
import { useSeo } from '@/lib/seo'
import { cn } from '@/lib/utils'
import { useSetMobileNav } from '@/components/layout/mobile-nav'
import { LanguageToggle } from '@/components/ui/LanguageToggle'
import { Login } from '@/components/admin/Login'
import { SettingsEditor } from '@/components/admin/SettingsEditor'
import { CollectionEditor } from '@/components/admin/CollectionEditor'
import { BookingsPanel } from '@/components/admin/BookingsPanel'
import { SecurityPanel } from '@/components/admin/SecurityPanel'
import { AssistantPanel } from '@/components/admin/AssistantPanel'

const icons: Record<string, ReactNode> = {
  dashboard: <LayoutDashboard className="size-[1.15rem]" />,
  assistant: <Mic className="size-[1.15rem]" />,
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

export function Admin() {
  const { refresh } = useContent()
  const { t, language } = useLanguage()
  useSeo({ path: '/admin', title: t('admin.title'), description: '', noindex: true })

  const [checking, setChecking] = useState(true)
  const [authed, setAuthed] = useState(false)
  const [usingDefault, setUsingDefault] = useState(false)
  const [content, setContent] = useState<SiteContent | null>(null)
  const [section, setSection] = useState('overview')
  const [newBookings, setNewBookings] = useState(0)

  // Forms are rendered from the schema for the language being edited, so the
  // labels *and* the select options match the document in KV.
  const schemas = useMemo(() => localizedCollections(language), [language])

  const sections = useMemo<AdminSection[]>(
    () => [
      { key: 'overview', label: t('admin.overview'), short: t('admin.overview_short'), icon: icons.dashboard },
      { key: 'assistant', label: t('admin.assistant'), short: t('admin.assistant_short'), icon: icons.assistant },
      { key: 'settings', label: t('admin.settings'), short: t('admin.settings_short'), icon: icons.settings },
      ...schemas.map((schema) => ({
        key: schema.key,
        label: schema.label,
        short: schema.key === 'discover' ? t('admin.guide_short') : schema.label.split(' ')[0],
        icon: icons[schema.icon] ?? icons.sparkles,
      })),
      { key: 'bookings', label: t('admin.bookings'), short: t('admin.bookings_short'), icon: icons.bookings },
      { key: 'security', label: t('admin.security'), short: t('admin.security_short'), icon: icons.security },
    ],
    [schemas, t],
  )

  const loadContent = useCallback(async () => {
    const fresh = await api.adminContent(language)
    setContent(fresh)
    await refresh()
  }, [refresh, language])

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
          title: t('admin.title'),
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
    [authed, section, sections, newBookings, t],
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

  const activeSchema = schemas.find((schema) => schema.key === section)

  return (
    <div className="min-h-dvh bg-gradient-to-b from-sky-50 via-sand-100 to-seafoam-50">
      {/* -------------------------------------------------- top bar */}
      <header className="sticky top-0 z-30 border-b border-sky-900/8 bg-white/85 backdrop-blur-xl">
        <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-5 py-3.5 lg:px-8">
          <div className="min-w-0">
            <p className="text-[0.66rem] font-bold tracking-[0.2em] text-lagoon-700 uppercase">
              {content?.site.brandName ?? t('admin.title')}
            </p>
            <p className="truncate font-display text-lg text-ocean-950">
              {sections.find((entry) => entry.key === section)?.label}
            </p>
          </div>
          <div className="flex shrink-0 items-center gap-2">
            <LanguageToggle variant="inline" />
            <Link
              to="/"
              className="inline-flex h-10 items-center gap-2 rounded-full border border-ocean-900/12 bg-white/60 px-4 text-[0.84rem] font-semibold text-ocean-800/70 transition-colors hover:text-ocean-950"
            >
              <ExternalLink className="size-3.5" />
              <span className="hidden sm:inline">{t('action.view_site')}</span>
            </Link>
            <button
              type="button"
              onClick={signOut}
              className="inline-flex h-10 items-center gap-2 rounded-full bg-gradient-to-r from-sky-700 to-lagoon-600 px-4 text-[0.84rem] font-semibold text-sand-50 transition-all hover:brightness-110"
            >
              <LogOut className="size-3.5" />
              <span className="hidden sm:inline">{t('action.sign_out')}</span>
            </button>
          </div>
        </div>
      </header>

      <div className="mx-auto flex max-w-6xl gap-8 px-5 py-8 lg:px-8">
        {/* --------------------------------------------- desktop rail */}
        <nav className="sticky top-24 hidden h-fit w-56 shrink-0 lg:block" aria-label={t('admin.sections')}>
          <ul className="space-y-1">
            {sections.map((entry) => (
              <li key={entry.key}>
                <button
                  type="button"
                  onClick={() => setSection(entry.key)}
                  className={cn(
                    'flex w-full items-center gap-3 rounded-2xl px-4 py-2.5 text-left text-[0.9rem] font-semibold transition-colors',
                    section === entry.key
                      ? 'bg-gradient-to-r from-sky-700 to-lagoon-600 text-sand-50 shadow-soft'
                      : 'text-ocean-800/65 hover:bg-white hover:text-ocean-950',
                  )}
                >
                  {entry.icon}
                  <span className="flex-1 truncate">{entry.label}</span>
                  {entry.key === 'bookings' && newBookings > 0 && (
                    <span className="grid size-5 place-items-center rounded-full bg-flamingo-500 text-[0.65rem] font-bold text-white">
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
              className="mb-6 flex w-full items-center gap-3 rounded-4xl border border-sun-400/50 bg-sun-200/60 p-4 text-left transition-colors hover:bg-sun-200"
            >
              <KeyRound className="size-5 shrink-0 text-sun-700" />
              <span className="text-[0.9rem] font-semibold text-ocean-950">
                {t('admin.default_password_warning')}
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

              {section === 'assistant' && content && (
                <AssistantPanel content={content} onApplied={loadContent} onJump={setSection} />
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
  const { t } = useLanguage()

  const stats = [
    { label: t('admin.stat.treatments'), value: content.services.length, key: 'services' },
    { label: t('admin.stat.tips'), value: content.discover.length, key: 'discover' },
    { label: t('admin.stat.therapists'), value: content.team.length, key: 'team' },
    { label: t('admin.stat.requests'), value: newBookings, key: 'bookings' },
  ]

  const startHere: Array<[string, string]> = [
    ['settings', t('admin.start.settings')],
    ['services', t('admin.start.services')],
    ['team', t('admin.start.team')],
    ['discover', t('admin.start.discover')],
    ['security', t('admin.start.security')],
  ]

  return (
    <div>
      <header>
        <h1 className="font-display text-3xl text-ocean-950">
          {t('admin.hello', { name: content.site.ownerName.split(' ')[0] })}
        </h1>
        <p className="mt-1.5 max-w-xl text-[0.92rem] text-ocean-800/60">{t('admin.hello_lead')}</p>
      </header>

      {/* The assistant is the fastest way in — give it the top of the page. */}
      <button
        type="button"
        onClick={() => onJump('assistant')}
        className="group mt-7 flex w-full items-center gap-4 overflow-hidden rounded-5xl bg-gradient-to-br from-sky-700 via-lagoon-600 to-palm-600 p-6 text-left text-sand-50 shadow-lift transition-transform hover:scale-[1.005]"
      >
        <span className="grid size-14 shrink-0 place-items-center rounded-[46%_54%_50%_50%/52%_46%_54%_48%] bg-white/20 backdrop-blur-sm">
          <Mic className="size-6" />
        </span>
        <span className="min-w-0">
          <span className="block font-display text-xl">{t('ai.title')}</span>
          <span className="mt-1 block text-[0.88rem] leading-relaxed text-sand-100/85">{t('ai.subtitle')}</span>
        </span>
      </button>

      <div className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-4">
        {stats.map((stat) => (
          <button
            key={stat.key}
            type="button"
            onClick={() => onJump(stat.key)}
            className="rounded-4xl border border-white/70 bg-white/85 p-5 text-left shadow-soft transition-all duration-300 hover:-translate-y-0.5 hover:shadow-lift"
          >
            <p className="font-display text-4xl text-ocean-950">{stat.value}</p>
            <p className="mt-1 text-[0.78rem] font-semibold tracking-wide text-ocean-800/50 uppercase">
              {stat.label}
            </p>
          </button>
        ))}
      </div>

      <div className="mt-8 grid gap-4 sm:grid-cols-2">
        <div className="rounded-5xl border border-white/70 bg-white/85 p-6 shadow-soft">
          <h2 className="font-display text-xl text-ocean-950">{t('admin.start_here')}</h2>
          <ul className="mt-4 space-y-2.5 text-[0.9rem]">
            {startHere.map(([key, text]) => (
              <li key={key}>
                <button
                  type="button"
                  onClick={() => onJump(key)}
                  className="text-left text-ocean-800/75 transition-colors hover:text-lagoon-700"
                >
                  → {text}
                </button>
              </li>
            ))}
          </ul>
        </div>

        <div className="rounded-5xl border border-white/70 bg-white/85 p-6 shadow-soft">
          <h2 className="font-display text-xl text-ocean-950">{t('admin.how_title')}</h2>
          <ul className="mt-4 space-y-2.5 text-[0.9rem] leading-relaxed text-ocean-800/70">
            <li>{t('admin.how1')}</li>
            <li>{t('admin.how2')}</li>
            <li>{t('admin.how3')}</li>
            <li>{t('admin.how4')}</li>
          </ul>
        </div>
      </div>
    </div>
  )
}
