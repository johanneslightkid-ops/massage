import { Link, useLocation } from 'react-router-dom'
import { motion } from 'motion/react'
import { Home, Sparkles, Compass, CalendarHeart, Users } from 'lucide-react'
import type { ReactNode } from 'react'
import { cn } from '@/lib/utils'
import { useT } from '@/lib/translations/LanguageProvider'
import { useMobileNav } from './mobile-nav'

interface TabItem {
  key: string
  label: string
  icon: ReactNode
  to?: string
  onSelect?: () => void
  badge?: number
}

/** Labels come from the dictionary, so the bar follows the language toggle. */
const publicTabs: Array<Omit<TabItem, 'label'> & { labelKey: string }> = [
  { key: '/', labelKey: 'tab.home', icon: <Home className="size-[1.15rem]" />, to: '/' },
  { key: '/treatments', labelKey: 'tab.treatments', icon: <Sparkles className="size-[1.15rem]" />, to: '/treatments' },
  { key: '/discover', labelKey: 'tab.discover', icon: <Compass className="size-[1.15rem]" />, to: '/discover' },
  { key: '/team', labelKey: 'tab.team', icon: <Users className="size-[1.15rem]" />, to: '/team' },
  { key: '/book', labelKey: 'tab.book', icon: <CalendarHeart className="size-[1.15rem]" />, to: '/book' },
]

/**
 * The bottom bar is the primary navigation on phones. On the admin page the
 * admin screen pushes its own items in, so the same bar becomes the admin menu.
 */
export function TabBar() {
  const location = useLocation()
  const t = useT()
  const { override } = useMobileNav()

  const items: TabItem[] =
    override?.items ?? publicTabs.map((tab) => ({ ...tab, label: t(tab.labelKey) }))
  const activeKey = override?.activeKey ?? location.pathname
  const isAdmin = Boolean(override)

  // A page can hand over an empty menu to get a full-screen surface.
  if (items.length === 0) return null

  return (
    <nav
      aria-label={isAdmin ? t('admin.sections') : t('nav.main')}
      className={cn('fixed inset-x-0 bottom-0 z-50 lg:hidden', 'pb-[env(safe-area-inset-bottom,0px)]')}
    >
      <div
        className={cn(
          'mx-3 mb-3 rounded-[2rem] border shadow-lift transition-colors duration-500',
          isAdmin
            ? 'border-white/10 bg-ocean-950/92 backdrop-blur-xl'
            : 'border-white/70 bg-white/85 ring-1 ring-sky-900/5 backdrop-blur-xl',
        )}
      >
        {isAdmin && override?.title && (
          <p className="border-b border-white/10 px-4 py-1.5 text-center text-[0.62rem] font-bold tracking-[0.2em] text-seafoam-300 uppercase">
            {override.title}
          </p>
        )}
        <ul
          className={cn(
            'no-scrollbar flex items-stretch',
            items.length > 5 ? 'gap-1 overflow-x-auto px-2' : 'justify-around px-1',
          )}
        >
          {items.map((item) => {
            const active = item.to
              ? item.to === '/'
                ? activeKey === '/'
                : activeKey.startsWith(item.to)
              : activeKey === item.key

            const inner = (
              <span className="relative flex flex-col items-center gap-1 px-1 py-2.5">
                {active && (
                  <motion.span
                    layoutId={isAdmin ? 'tab-glow-admin' : 'tab-glow'}
                    className={cn(
                      'absolute inset-x-0 -top-0.5 bottom-0 -z-10 rounded-[1.4rem]',
                      isAdmin
                        ? 'bg-white/12'
                        : 'bg-gradient-to-b from-sky-100 to-seafoam-100 ring-1 ring-sky-300/50',
                    )}
                    transition={{ type: 'spring', stiffness: 400, damping: 34 }}
                  />
                )}
                <span className="relative">
                  {item.icon}
                  {Boolean(item.badge) && (
                    <span className="absolute -top-1.5 -right-2 grid h-4 min-w-4 place-items-center rounded-full bg-flamingo-500 px-1 text-[0.6rem] font-bold text-white">
                      {item.badge}
                    </span>
                  )}
                </span>
                <span className="text-[0.6rem] font-bold tracking-wide whitespace-nowrap">{item.label}</span>
              </span>
            )

            const className = cn(
              'flex min-w-[4.1rem] shrink-0 justify-center rounded-[1.4rem] transition-colors',
              isAdmin
                ? active
                  ? 'text-sand-50'
                  : 'text-sand-200/55 hover:text-sand-100'
                : active
                  ? 'text-sky-800'
                  : 'text-ocean-800/50 hover:text-ocean-950',
            )

            return (
              <li key={item.key} className="flex-1">
                {item.to ? (
                  <Link to={item.to} className={className} aria-current={active ? 'page' : undefined}>
                    {inner}
                  </Link>
                ) : (
                  <button
                    type="button"
                    onClick={item.onSelect}
                    className={cn(className, 'w-full')}
                    aria-current={active ? 'true' : undefined}
                  >
                    {inner}
                  </button>
                )}
              </li>
            )
          })}
        </ul>
      </div>
    </nav>
  )
}
