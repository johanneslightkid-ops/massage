import { Link, useLocation } from 'react-router-dom'
import { motion } from 'motion/react'
import { Home, Sparkles, Compass, CalendarHeart, Users } from 'lucide-react'
import type { ReactNode } from 'react'
import { cn } from '@/lib/utils'
import { useMobileNav } from './mobile-nav'

interface TabItem {
  key: string
  label: string
  icon: ReactNode
  to?: string
  onSelect?: () => void
  badge?: number
}

const publicTabs: TabItem[] = [
  { key: '/', label: 'Home', icon: <Home className="size-[1.15rem]" /> , to: '/' },
  { key: '/treatments', label: 'Massage', icon: <Sparkles className="size-[1.15rem]" />, to: '/treatments' },
  { key: '/discover', label: 'Discover', icon: <Compass className="size-[1.15rem]" />, to: '/discover' },
  { key: '/team', label: 'Team', icon: <Users className="size-[1.15rem]" />, to: '/team' },
  { key: '/book', label: 'Reserve', icon: <CalendarHeart className="size-[1.15rem]" />, to: '/book' },
]

/**
 * The bottom bar is the primary navigation on phones. On the admin page the
 * admin screen pushes its own items in, so the same bar becomes the admin menu.
 */
export function TabBar() {
  const location = useLocation()
  const { override } = useMobileNav()

  const items = override?.items ?? publicTabs
  const activeKey = override?.activeKey ?? location.pathname
  const isAdmin = Boolean(override)

  // A page can hand over an empty menu to get a full-screen surface.
  if (items.length === 0) return null

  return (
    <nav
      aria-label={isAdmin ? 'Admin sections' : 'Main navigation'}
      className={cn(
        'fixed inset-x-0 bottom-0 z-50 lg:hidden',
        'pb-[env(safe-area-inset-bottom,0px)]',
      )}
    >
      <div
        className={cn(
          'mx-3 mb-3 rounded-[1.75rem] border shadow-lift transition-colors duration-500',
          isAdmin
            ? 'border-white/10 bg-ocean-950/92 backdrop-blur-xl'
            : 'border-ocean-900/8 bg-sand-50/92 backdrop-blur-xl',
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
                      'absolute inset-x-0 -top-0.5 bottom-0 -z-10 rounded-2xl',
                      isAdmin ? 'bg-white/12' : 'bg-ocean-900/8',
                    )}
                    transition={{ type: 'spring', stiffness: 400, damping: 34 }}
                  />
                )}
                <span className="relative">
                  {item.icon}
                  {Boolean(item.badge) && (
                    <span className="absolute -top-1.5 -right-2 grid h-4 min-w-4 place-items-center rounded-full bg-coral-500 px-1 text-[0.6rem] font-bold text-white">
                      {item.badge}
                    </span>
                  )}
                </span>
                <span className="text-[0.6rem] font-bold tracking-wide whitespace-nowrap">{item.label}</span>
              </span>
            )

            const className = cn(
              'flex min-w-[4.1rem] shrink-0 justify-center rounded-2xl transition-colors',
              isAdmin
                ? active
                  ? 'text-sand-50'
                  : 'text-sand-200/55 hover:text-sand-100'
                : active
                  ? 'text-ocean-900'
                  : 'text-ocean-800/50 hover:text-ocean-900',
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
