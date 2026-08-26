import { createContext, useContext, useEffect, useMemo, useState } from 'react'
import type { ReactNode } from 'react'

export interface MobileNavItem {
  key: string
  label: string
  icon: ReactNode
  to?: string
  onSelect?: () => void
  badge?: number
}

export interface MobileNavOverride {
  items: MobileNavItem[]
  activeKey: string
  title?: string
}


interface Store {
  override: MobileNavOverride | null
  setOverride: (value: MobileNavOverride | null) => void
}

const MobileNavContext = createContext<Store | null>(null)

export function MobileNavProvider({ children }: { children: ReactNode }) {
  const [override, setOverride] = useState<MobileNavOverride | null>(null)
  const value = useMemo(() => ({ override, setOverride }), [override])
  return <MobileNavContext.Provider value={value}>{children}</MobileNavContext.Provider>
}

export function useMobileNav(): Store {
  const store = useContext(MobileNavContext)
  if (!store) throw new Error('useMobileNav must be used inside <MobileNavProvider>')
  return store
}

/**
 * Lets a page take over the bottom bar while it is mounted — this is how the
 * admin turns the public tab bar into its own section menu, and hands it back
 * on the way out.
 */
export function useSetMobileNav(value: MobileNavOverride | null, deps: unknown[]) {
  const { setOverride } = useMobileNav()
  useEffect(() => {
    setOverride(value)
    return () => setOverride(null)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps)
}
