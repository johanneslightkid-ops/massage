import { useEffect, useRef, useState } from 'react'
import { Link, NavLink, useLocation } from 'react-router-dom'
import { AnimatePresence, motion } from 'motion/react'
import { Menu, X, MessageCircle, MapPin, Clock, Globe } from 'lucide-react'
import { useContent } from '@/lib/content-store'
import { cn, whatsappLink } from '@/lib/utils'
import { Motif } from '@/components/art/Motif'
import { LanguageToggle } from '@/components/ui/LanguageToggle'

export const publicNav = [
  { to: '/', label: 'Home' },
  { to: '/treatments', label: 'Treatments' },
  { to: '/discover', label: 'Discover Bávaro' },
  { to: '/team', label: 'Our team' },
  { to: '/book', label: 'Reserve' },
]

export function Header() {
  const { content } = useContent()
  const site = content.site
  const [open, setOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const headerRef = useRef<HTMLElement>(null)
  const location = useLocation()

  useEffect(() => setOpen(false), [location.pathname])

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  useEffect(() => {
    document.body.style.overflow = open ? 'hidden' : ''
    return () => {
      document.body.style.overflow = ''
    }
  }, [open])

  // Publish the header height so sticky sub-bars (the Discover filters) can
  // park directly underneath it instead of sliding out of sight.
  useEffect(() => {
    const node = headerRef.current
    if (!node) return
    const publish = () =>
      document.documentElement.style.setProperty('--header-h', `${node.offsetHeight}px`)
    publish()
    const observer = new ResizeObserver(publish)
    observer.observe(node)
    return () => observer.disconnect()
  }, [])

  return (
    <>
      {site.announcementEnabled && site.announcementText && (
        <div className="relative z-40 bg-ocean-900 px-4 py-2 text-center text-[0.74rem] leading-snug font-medium tracking-wide text-seafoam-100">
          <span className="mx-auto block max-w-3xl">{site.announcementText}</span>
        </div>
      )}

      <header
        ref={headerRef}
        className={cn(
          'sticky top-0 z-50 transition-all duration-500',
          scrolled ? 'glass border-b border-ocean-900/8 shadow-soft' : 'bg-transparent',
        )}
      >
        <div className="mx-auto flex w-full max-w-6xl items-center justify-between gap-4 px-5 py-3.5 sm:px-8">
          <Link to="/" className="group flex min-w-0 items-center gap-2.5 sm:gap-3" aria-label={site.brandName}>
            <span className="grid size-11 place-items-center rounded-2xl bg-ocean-900 text-sun-400 shadow-soft transition-transform duration-500 group-hover:-rotate-6">
              <Motif name="wave" className="size-5" strokeWidth={1.8} />
            </span>
            <span className="min-w-0 leading-tight">
              <span className="block truncate font-display text-[1.05rem] font-semibold tracking-tight text-ocean-900 sm:text-[1.15rem]">
                {site.brandName}
              </span>
              <span className="block truncate text-[0.58rem] font-semibold tracking-[0.12em] text-lagoon-600 uppercase sm:text-[0.64rem] sm:tracking-[0.16em]">
                {site.brandMark}
              </span>
            </span>
          </Link>

          <nav className="hidden items-center gap-1 lg:flex">
            {publicNav.map((item) => (
              <NavLink
                key={item.to}
                to={item.to}
                end={item.to === '/'}
                className={({ isActive }) =>
                  cn(
                    'relative rounded-full px-4 py-2 text-[0.9rem] font-semibold transition-colors',
                    isActive ? 'text-ocean-900' : 'text-ocean-800/65 hover:text-ocean-900',
                  )
                }
              >
                {({ isActive }) => (
                  <>
                    {item.label}
                    {isActive && (
                      <motion.span
                        layoutId="nav-pill"
                        className="absolute inset-0 -z-10 rounded-full bg-sand-200/70"
                        transition={{ type: 'spring', stiffness: 380, damping: 32 }}
                      />
                    )}
                  </>
                )}
              </NavLink>
            ))}
          </nav>

          <div className="flex shrink-0 items-center gap-2">
            <LanguageToggle variant="icon" />
            
            <a
              href={whatsappLink(site)}
              target="_blank"
              rel="noreferrer noopener"
              className="hidden items-center gap-2 rounded-full bg-[#25D366] px-5 py-2.5 text-[0.88rem] font-bold text-[#062e17] shadow-soft transition-transform duration-300 hover:scale-[1.03] sm:inline-flex"
            >
              <MessageCircle className="size-4" strokeWidth={2.4} />
              WhatsApp
            </a>

            <button
              type="button"
              onClick={() => setOpen((value) => !value)}
              aria-label={open ? 'Close menu' : 'Open menu'}
              aria-expanded={open}
              className="grid size-11 place-items-center rounded-2xl border border-ocean-900/12 bg-white/70 text-ocean-900 backdrop-blur-sm transition-colors hover:bg-white lg:hidden"
            >
              {open ? <X className="size-5" /> : <Menu className="size-5" />}
            </button>
          </div>
        </div>
      </header>

      <AnimatePresence>
        {open && (
          <motion.div
            className="fixed inset-0 z-40 lg:hidden"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
          >
            <button
              type="button"
              aria-label="Close menu"
              className="absolute inset-0 bg-ocean-950/45 backdrop-blur-sm"
              onClick={() => setOpen(false)}
            />
            <motion.nav
              className="grain absolute inset-x-0 top-0 overflow-hidden rounded-b-5xl bg-sand-50 pt-24 pb-8 shadow-lift"
              initial={{ y: '-100%' }}
              animate={{ y: 0 }}
              exit={{ y: '-100%' }}
              transition={{ type: 'spring', stiffness: 320, damping: 34 }}
            >
              <div className="relative z-10 px-6">
                <ul className="space-y-1">
                  {publicNav.map((item, index) => (
                    <motion.li
                      key={item.to}
                      initial={{ opacity: 0, x: -14 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.06 + index * 0.05 }}
                    >
                      <NavLink
                        to={item.to}
                        end={item.to === '/'}
                        className={({ isActive }) =>
                          cn(
                            'flex items-center justify-between rounded-3xl px-5 py-4 font-display text-2xl transition-colors',
                            isActive ? 'bg-ocean-900 text-sand-50' : 'text-ocean-900 hover:bg-sand-100',
                          )
                        }
                      >
                        {item.label}
                        <span className="text-sm opacity-50">→</span>
                      </NavLink>
                    </motion.li>
                  ))}
                </ul>

                <div className="mt-6 space-y-3 rounded-3xl bg-sand-100 p-5 text-sm text-ocean-800">
                  <p className="flex items-start gap-3">
                    <MapPin className="mt-0.5 size-4 shrink-0 text-lagoon-600" />
                    <span>
                      {site.addressLine}
                      <br />
                      {site.neighborhood} · {site.city}
                    </span>
                  </p>
                  <p className="flex items-start gap-3">
                    <Clock className="mt-0.5 size-4 shrink-0 text-lagoon-600" />
                    <span>{site.hours[0]?.value ?? ''}</span>
                  </p>
                </div>

                {/* Language selector in mobile menu */}
                <div className="mt-4 flex items-center justify-center">
                  <LanguageToggle variant="inline" />
                </div>

                <a
                  href={whatsappLink(site)}
                  target="_blank"
                  rel="noreferrer noopener"
                  className="mt-4 flex h-14 items-center justify-center gap-2 rounded-full bg-[#25D366] font-bold text-[#062e17]"
                >
                  <MessageCircle className="size-5" strokeWidth={2.4} />
                  Message us on WhatsApp
                </a>
              </div>
            </motion.nav>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}
