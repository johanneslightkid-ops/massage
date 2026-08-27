import { Link } from 'react-router-dom'
import { PalmFrond } from '@/components/art/Decor'
import { useSeo } from '@/lib/seo'

export function NotFound() {
  useSeo({ path: '/404', title: 'Page not found', description: '', noindex: true })

  return (
    <section className="grain relative grid min-h-[70svh] place-items-center overflow-hidden bg-ocean-900 px-6 text-center text-sand-50">
      <PalmFrond className="pointer-events-none absolute -top-10 -left-16 h-80 w-60 animate-sway text-ocean-950/40" />
      <PalmFrond mirrored className="pointer-events-none absolute -right-16 -bottom-16 h-80 w-60 text-ocean-950/30" />

      <div className="relative z-10">
        <p className="script text-6xl text-sun-400">404</p>
        <h1 className="mt-4 text-3xl sm:text-4xl">This page drifted out with the tide.</h1>
        <p className="mx-auto mt-4 max-w-md text-sand-100/70">
          Nothing here — but the beach is still two minutes away.
        </p>
        <Link
          to="/"
          className="mt-8 inline-flex h-13 items-center rounded-full bg-sand-50 px-7 py-3.5 font-semibold text-ocean-900 transition-transform hover:scale-[1.02]"
        >
          Back to the start
        </Link>
      </div>
    </section>
  )
}
