import { ExternalLink, MapPin } from 'lucide-react'
import { useT } from '@/lib/translations/LanguageProvider'
import { cn } from '@/lib/utils'

interface GoogleMapProps {
  embedUrl?: string
  viewUrl?: string
  address?: string
  className?: string
  height?: number
}

/**
 * The service area on a map. An embed URL renders the live map; with only a plain
 * Maps link we show a card that opens it — never a static-map image, which
 * needs a billed API key the owner does not have.
 */
export function GoogleMap({ embedUrl, viewUrl, address, className, height = 380 }: GoogleMapProps) {
  const t = useT()

  if (!embedUrl && !viewUrl) return null

  return (
    <div
      className={cn(
        'relative overflow-hidden rounded-5xl border border-white/70 shadow-lift ring-1 ring-sky-900/5',
        className,
      )}
    >
      {embedUrl ? (
        <iframe
          src={embedUrl}
          style={{ border: 0, height: `${height}px` }}
          allowFullScreen
          loading="lazy"
          referrerPolicy="no-referrer-when-downgrade"
          className="block w-full"
          title={t('map.title')}
        />
      ) : (
        <div
          className="grid place-items-center bg-gradient-to-br from-sky-100 via-seafoam-100 to-sun-100 p-10 text-center"
          style={{ minHeight: `${Math.min(height, 260)}px` }}
        >
          <div>
            <MapPin className="mx-auto size-10 text-lagoon-600" />
            {address && <p className="mt-4 font-display text-xl text-ocean-950">{address}</p>}
          </div>
        </div>
      )}

      {viewUrl && (
        <a
          href={viewUrl}
          target="_blank"
          rel="noreferrer noopener"
          className="absolute right-4 bottom-4 inline-flex h-11 items-center gap-2 rounded-full bg-white/95 px-5 text-[0.86rem] font-semibold text-ocean-950 shadow-soft backdrop-blur-sm transition-transform hover:scale-[1.03]"
        >
          <ExternalLink className="size-4 text-lagoon-600" />
          {t('map.open')}
        </a>
      )}
    </div>
  )
}
