import { lazy, Suspense } from 'react'
import { BrowserRouter, Route, Routes } from 'react-router-dom'
import { ContentProvider } from './lib/content-store'
import { LanguageProvider } from './lib/translations/LanguageProvider'
import { MobileNavProvider } from './components/layout/mobile-nav'
import { Layout } from './components/layout/Layout'
import { Home } from './pages/Home'
import { PageFallback } from './components/ui/PageFallback'

const Treatments = lazy(() => import('./pages/Treatments').then((m) => ({ default: m.Treatments })))
const Discover = lazy(() => import('./pages/Discover').then((m) => ({ default: m.Discover })))
const Team = lazy(() => import('./pages/Team').then((m) => ({ default: m.Team })))
const Book = lazy(() => import('./pages/Book').then((m) => ({ default: m.Book })))
const Admin = lazy(() => import('./pages/Admin').then((m) => ({ default: m.Admin })))
const NotFound = lazy(() => import('./pages/NotFound').then((m) => ({ default: m.NotFound })))

export function App() {
  return (
    <BrowserRouter>
      <LanguageProvider>
        <ContentProvider>
          <MobileNavProvider>
            <Routes>
              <Route element={<Layout />}>
                <Route index element={<Home />} />
                <Route
                  path="treatments"
                  element={
                    <Suspense fallback={<PageFallback />}>
                      <Treatments />
                    </Suspense>
                  }
                />
                <Route
                  path="discover"
                  element={
                    <Suspense fallback={<PageFallback />}>
                      <Discover />
                    </Suspense>
                  }
                />
                <Route
                  path="team"
                  element={
                    <Suspense fallback={<PageFallback />}>
                      <Team />
                    </Suspense>
                  }
                />
                <Route
                  path="book"
                  element={
                    <Suspense fallback={<PageFallback />}>
                      <Book />
                    </Suspense>
                  }
                />
                <Route
                  path="admin"
                  element={
                    <Suspense fallback={<PageFallback />}>
                      <Admin />
                    </Suspense>
                  }
                />
                <Route
                  path="*"
                  element={
                    <Suspense fallback={<PageFallback />}>
                      <NotFound />
                    </Suspense>
                  }
                />
              </Route>
            </Routes>
          </MobileNavProvider>
        </ContentProvider>
      </LanguageProvider>
    </BrowserRouter>
  )
}
