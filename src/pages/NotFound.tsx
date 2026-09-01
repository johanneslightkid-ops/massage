import { Link } from 'react-router-dom'
import { MonsteraLeaf, OilSheen, PalmFrond } from '@/components/art/Decor'
import { useT } from '@/lib/translations/LanguageProvider'
import { useSeo } from '@/lib/seo'

export function NotFound() {
  const t = useT()
  useSeo({ path: '/404', title: t('notfound.seo'), description: '', noindex: true })

  return (
    <section className="grain relative grid min-h-[70svh] place-items-center overflow-hidden bg-gradient-to-br from-sky-900 via-ocean-900 to-palm-800 px-6 text-center text-sand-50">
      <OilSheen />
      <PalmFrond className="pointer-events-none absolute -top-10 -left-16 h-80 w-60 animate-sway text-sky-950/40" />
      <MonsteraLeaf mirrored className="pointer-events-none absolute -right-16 -bottom-16 h-80 w-64 text-palm-950/30" />

      <div className="relative z-10">
        <p className="script bg-gradient-to-r from-sun-300 to-flamingo-300 bg-clip-text text-6xl text-transparent">404</p>
        <h1 className="mt-4 text-3xl text-sand-50 sm:text-4xl">{t('notfound.title')}</h1>
        <p className="mx-auto mt-4 max-w-md text-sand-100/75">{t('notfound.lead')}</p>
        <Link
          to="/"
          className="mt-8 inline-flex h-14 items-center rounded-full bg-sand-50 px-7 font-semibold text-ocean-950 shadow-lift transition-transform hover:scale-[1.02]"
        >
          {t('notfound.cta')}
        </Link>
      </div>
    </section>
  )
}
