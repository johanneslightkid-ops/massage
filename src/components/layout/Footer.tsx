import { Link } from 'react-router-dom'
import { Mail, Phone, MapPin, MessageCircle, Lock } from 'lucide-react'
import { FacebookGlyph, InstagramGlyph, TikTokGlyph } from '@/components/art/Brand'
import { useContent } from '@/lib/content-store'
import { whatsappLink } from '@/lib/utils'
import { Motif } from '@/components/art/Motif'
import { PalmFrond, WaveDivider } from '@/components/art/Decor'
import { publicNav } from './Header'

export function Footer() {
  const { content } = useContent()
  const site = content.site
  const year = new Date().getFullYear()

  return (
    <footer className="grain relative overflow-hidden bg-ocean-950 text-sand-100">
      <WaveDivider from="var(--color-ocean-950)" tone="var(--color-lagoon-400)" flip className="absolute inset-x-0 -top-px" />

      <PalmFrond className="pointer-events-none absolute -top-10 -right-16 h-72 w-56 animate-sway text-lagoon-400/12" />
      <PalmFrond mirrored className="pointer-events-none absolute -bottom-16 -left-20 h-80 w-60 text-lagoon-400/10" />

      <div className="relative z-10 mx-auto w-full max-w-6xl px-5 pt-24 pb-10 sm:px-8">
        <div className="grid gap-12 md:grid-cols-[1.4fr_1fr_1fr]">
          <div>
            <div className="flex items-center gap-3">
              <span className="grid size-12 place-items-center rounded-2xl bg-sand-50/10 text-sun-400">
                <Motif name="wave" className="size-6" strokeWidth={1.8} />
              </span>
              <div>
                <p className="font-display text-2xl text-sand-50">{site.brandName}</p>
                <p className="text-[0.66rem] font-semibold tracking-[0.18em] text-seafoam-300 uppercase">
                  {site.brandMark}
                </p>
              </div>
            </div>
            <p className="mt-6 max-w-sm text-[0.96rem] leading-relaxed text-sand-200/70">{site.tagline}</p>

            <div className="mt-7 flex flex-wrap gap-2">
              {site.languages.map((language) => (
                <span
                  key={language}
                  className="rounded-full border border-white/12 px-3 py-1 text-[0.7rem] font-semibold text-sand-200/80"
                >
                  {language}
                </span>
              ))}
            </div>
          </div>

          <div>
            <p className="text-[0.68rem] font-bold tracking-[0.2em] text-seafoam-300 uppercase">Explore</p>
            <ul className="mt-5 space-y-3 text-[0.95rem]">
              {publicNav.map((item) => (
                <li key={item.to}>
                  <Link to={item.to} className="text-sand-200/75 transition-colors hover:text-sand-50">
                    {item.label}
                  </Link>
                </li>
              ))}
              <li>
                <Link to="/book#payment" className="text-sand-200/75 transition-colors hover:text-sand-50">
                  Ways to pay
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <p className="text-[0.68rem] font-bold tracking-[0.2em] text-seafoam-300 uppercase">Find us</p>
            <ul className="mt-5 space-y-4 text-[0.92rem] text-sand-200/75">
              <li className="flex gap-3">
                <MapPin className="mt-0.5 size-4 shrink-0 text-lagoon-300" />
                <span>
                  {site.addressLine}
                  <br />
                  {site.neighborhood}
                  <br />
                  {site.city}
                </span>
              </li>
              <li className="flex gap-3">
                <Phone className="mt-0.5 size-4 shrink-0 text-lagoon-300" />
                <a href={`tel:${site.phoneDisplay.replace(/\s/g, '')}`} className="hover:text-sand-50">
                  {site.phoneDisplay}
                </a>
              </li>
              <li className="flex gap-3">
                <Mail className="mt-0.5 size-4 shrink-0 text-lagoon-300" />
                <a href={`mailto:${site.email}`} className="hover:text-sand-50">
                  {site.email}
                </a>
              </li>
            </ul>

            <div className="mt-6 space-y-2 text-[0.85rem] text-sand-200/60">
              {site.hours.map((entry) => (
                <p key={entry.label} className="flex justify-between gap-4">
                  <span>{entry.label}</span>
                  <span className="text-sand-100">{entry.value}</span>
                </p>
              ))}
            </div>

            <div className="mt-6 flex gap-2">
              <a
                href={whatsappLink(site)}
                target="_blank"
                rel="noreferrer noopener"
                aria-label="WhatsApp"
                className="grid size-10 place-items-center rounded-full bg-[#25D366] text-[#062e17]"
              >
                <MessageCircle className="size-4" strokeWidth={2.4} />
              </a>
              {site.instagram && (
                <a
                  href={site.instagram}
                  target="_blank"
                  rel="noreferrer noopener"
                  aria-label="Instagram"
                  className="grid size-10 place-items-center rounded-full border border-white/12 text-sand-100 transition-colors hover:bg-white/10"
                >
                  <InstagramGlyph />
                </a>
              )}
              {site.facebook && (
                <a
                  href={site.facebook}
                  target="_blank"
                  rel="noreferrer noopener"
                  aria-label="Facebook"
                  className="grid size-10 place-items-center rounded-full border border-white/12 text-sand-100 transition-colors hover:bg-white/10"
                >
                  <FacebookGlyph />
                </a>
              )}
              {site.tiktok && (
                <a
                  href={site.tiktok}
                  target="_blank"
                  rel="noreferrer noopener"
                  aria-label="TikTok"
                  className="grid size-10 place-items-center rounded-full border border-white/12 text-sand-100 transition-colors hover:bg-white/10"
                >
                  <TikTokGlyph />
                </a>
              )}
            </div>
          </div>
        </div>

        <div className="mt-14 flex flex-col gap-4 border-t border-white/10 pt-7 text-[0.78rem] text-sand-200/50 sm:flex-row sm:items-center sm:justify-between">
          <p>
            © {year} {site.brandName} · {site.city}, Dominican Republic
          </p>
          <div className="flex items-center gap-5">
            <span>Therapeutic & relaxation massage only</span>
            <Link to="/admin" className="inline-flex items-center gap-1.5 transition-colors hover:text-sand-100">
              <Lock className="size-3" />
              Admin
            </Link>
          </div>
        </div>
      </div>
    </footer>
  )
}
