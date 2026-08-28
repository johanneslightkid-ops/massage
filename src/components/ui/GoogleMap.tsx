import { ExternalLink, MapPin } from 'lucide-react';
import { cn } from '@/lib/utils';

interface GoogleMapProps {
  embedUrl?: string;
  viewUrl?: string;
  address?: string;
  className?: string;
  height?: number;
  showControls?: boolean;
}

export function GoogleMap({
  embedUrl,
  viewUrl,
  address,
  className,
  height = 400,
  showControls = true,
}: GoogleMapProps) {
  if (!embedUrl && !viewUrl) {
    return (
      <div className={cn('flex flex-col items-center justify-center rounded-4xl border border-ocean-900/10 bg-sand-100 p-8 text-center', className)}>
        <MapPin className="mb-4 size-12 text-ocean-900/20" />
        <p className="text-[0.9rem] font-medium text-ocean-800/60">
          No map configured. Please add a Google Maps URL in the admin settings.
        </p>
      </div>
    );
  }

  return (
    <div className={cn('relative overflow-hidden rounded-4xl border border-ocean-900/10 shadow-soft', className)}>
      {/* Map Container */}
      <div 
        className="relative w-full"
        style={{ height: `${height}px` }}
      >
        {embedUrl ? (
          <iframe
            src={embedUrl}
            width="100%"
            height="100%"
            style={{ border: 0 }}
            allowFullScreen
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
            className="absolute inset-0 h-full w-full"
            title="Google Maps"
          />
        ) : viewUrl ? (
          <div 
            className="absolute inset-0 h-full w-full bg-sand-100"
            style={{
              backgroundImage: `url(https://maps.googleapis.com/maps/api/staticmap?center=${encodeURIComponent(address || '')}&zoom=15&size=800x400&key=YOUR_API_KEY)`,
              backgroundSize: 'cover',
              backgroundPosition: 'center',
            }}
          >
            {/* Fallback: Link to Google Maps */}
            <div className="absolute inset-0 flex items-center justify-center bg-ocean-900/40 backdrop-blur-sm">
              <a
                href={viewUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-3 rounded-full bg-white px-6 py-3 font-semibold text-ocean-900 shadow-soft transition-transform hover:scale-105"
              >
                <MapPin className="size-5" />
                Open in Google Maps
                <ExternalLink className="size-4" />
              </a>
            </div>
          </div>
        ) : null}
      </div>

      {/* Optional Controls */}
      {showControls && (viewUrl || embedUrl) && (
        <div className="flex items-center justify-between border-t border-ocean-900/10 bg-white px-4 py-3">
          <div className="flex items-center gap-2 text-[0.85rem] text-ocean-800/60">
            <MapPin className="size-4 text-lagoon-600" />
            {address || 'View location'}
          </div>
          
          {viewUrl && (
            <a
              href={viewUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 rounded-full bg-ocean-900 px-4 py-2 text-[0.8rem] font-semibold text-sand-50 transition-colors hover:bg-ocean-800"
            >
              Open Maps
              <ExternalLink className="size-3.5" />
            </a>
          )}
        </div>
      )}
    </div>
  );
}

/**
 * Compact map card for mobile displays
 */
export function MapCard({
  embedUrl,
  viewUrl,
  address,
  className,
}: Omit<GoogleMapProps, 'height' | 'showControls'>) {
  return (
    <div className={cn('group relative overflow-hidden rounded-3xl border border-ocean-900/10 bg-white shadow-soft', className)}>
      <div className="aspect-[16/10] w-full overflow-hidden">
        {embedUrl ? (
          <iframe
            src={embedUrl}
            width="100%"
            height="100%"
            style={{ border: 0 }}
            allowFullScreen
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
            className="h-full w-full transition-transform duration-500 group-hover:scale-105"
            title="Google Maps"
          />
        ) : viewUrl ? (
          <a
            href={viewUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="flex h-full w-full items-center justify-center bg-gradient-to-br from-lagoon-500 to-ocean-600 text-white"
          >
            <div className="text-center">
              <MapPin className="mx-auto mb-2 size-8 opacity-80" />
              <span className="text-[0.85rem] font-medium">Open in Maps</span>
            </div>
          </a>
        ) : (
          <div className="flex h-full w-full items-center justify-center bg-sand-100 text-ocean-800/40">
            <MapPin className="size-10" />
          </div>
        )}
      </div>
      
      {address && (
        <div className="border-t border-ocean-900/10 bg-white px-4 py-3">
          <p className="flex items-center gap-2 text-[0.8rem] font-medium text-ocean-800/70">
            <MapPin className="size-3.5 shrink-0 text-lagoon-600" />
            <span className="truncate">{address}</span>
          </p>
        </div>
      )}
    </div>
  );
}
