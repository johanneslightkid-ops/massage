import { useEffect } from 'react'
import { Outlet, useLocation } from 'react-router-dom'
import { Header } from './Header'
import { Footer } from './Footer'
import { TabBar } from './TabBar'
import { WhatsAppFab } from './WhatsAppFab'
import { useMobileNav } from './mobile-nav'

function ScrollToTop() {
  const { pathname, hash } = useLocation()
  useEffect(() => {
    if (hash) {
      const target = document.querySelector(hash)
      if (target) {
        target.scrollIntoView({ behavior: 'smooth', block: 'start' })
        return
      }
    }
    window.scrollTo({ top: 0, behavior: 'instant' as ScrollBehavior })
  }, [pathname, hash])
  return null
}

export function Layout() {
  const { override } = useMobileNav()
  const inAdmin = Boolean(override)
  // No bar, no reserved space — the admin sign-in wants the whole screen.
  const hasTabBar = !override || override.items.length > 0

  return (
    <div className="flex min-h-dvh flex-col">
      <ScrollToTop />
      {!inAdmin && <Header />}
      <main className={hasTabBar ? 'flex-1 pad-safe lg:pb-0' : 'flex-1'}>
        <Outlet />
      </main>
      {!inAdmin && <Footer />}
      <TabBar />
      <WhatsAppFab />
    </div>
  )
}
