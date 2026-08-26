import { cn } from '@/lib/utils'

export type MotifName =
  | 'wave' | 'leaf' | 'sun' | 'spark' | 'heart' | 'palm' | 'moon' | 'shell'
  | 'home' | 'bed' | 'plane' | 'compass'

const paths: Record<MotifName, React.ReactNode> = {
  wave: (
    <>
      <path d="M2 15c3 0 3-3 6-3s3 3 6 3 3-3 6-3 3 3 6 3" />
      <path d="M2 21c3 0 3-3 6-3s3 3 6 3 3-3 6-3 3 3 6 3" opacity=".55" />
      <path d="M2 9c3 0 3-3 6-3s3 3 6 3 3-3 6-3 3 3 6 3" opacity=".3" />
    </>
  ),
  leaf: (
    <>
      <path d="M20 4C10 4 4 10 4 19c0 0 .4 1 1 1 9 0 15-6 15-16Z" />
      <path d="M4.8 19.2 15 9" />
    </>
  ),
  sun: (
    <>
      <circle cx="12" cy="12" r="4.4" />
      <path d="M12 2v2.4M12 19.6V22M2 12h2.4M19.6 12H22M5 5l1.7 1.7M17.3 17.3 19 19M19 5l-1.7 1.7M6.7 17.3 5 19" />
    </>
  ),
  spark: (
    <>
      <path d="M12 2.5c.8 4.9 3.8 7.9 8.7 8.7-4.9.8-7.9 3.8-8.7 8.7-.8-4.9-3.8-7.9-8.7-8.7 4.9-.8 7.9-3.8 8.7-8.7Z" />
      <path d="M19 17.5c.3 1.6 1.2 2.5 2.8 2.8-1.6.3-2.5 1.2-2.8 2.8-.3-1.6-1.2-2.5-2.8-2.8 1.6-.3 2.5-1.2 2.8-2.8Z" opacity=".55" />
    </>
  ),
  heart: <path d="M12 20.5s-7.5-4.4-7.5-9.6A4.4 4.4 0 0 1 12 8.3a4.4 4.4 0 0 1 7.5 2.6c0 5.2-7.5 9.6-7.5 9.6Z" />,
  palm: (
    <>
      <path d="M12 21c0-5.5.7-9.5 2-12" />
      <path d="M14 9c2.6-3 5.8-3.6 8-1.5" />
      <path d="M14 9c1-3.8-.4-6.6-3.4-7.5" />
      <path d="M14 9c-3.3-1.7-6.4-.9-8 2" />
      <path d="M14 9c-2.4 1.2-3.6 3.6-3.2 6.4" />
    </>
  ),
  moon: <path d="M20 14.4A8.6 8.6 0 0 1 9.6 4 8.6 8.6 0 1 0 20 14.4Z" />,
  shell: (
    <>
      <path d="M12 21c-5 0-9-4.2-9-9.4C3 6.3 7 3 12 3s9 3.3 9 8.6C21 16.8 17 21 12 21Z" />
      <path d="M12 21V3M12 21c-2.2-3-3.4-6.3-3.6-9.9M12 21c2.2-3 3.4-6.3 3.6-9.9" opacity=".5" />
    </>
  ),
  home: (
    <>
      <path d="M3.5 10.5 12 3.5l8.5 7" />
      <path d="M5.5 12v8.5h13V12" />
      <path d="M10 20.5v-5h4v5" />
    </>
  ),
  bed: (
    <>
      <path d="M3 18v-7a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2v7" />
      <path d="M3 15h18M3 18v2M21 18v2" />
      <path d="M7.5 9V7.5a1.5 1.5 0 0 1 1.5-1.5h6a1.5 1.5 0 0 1 1.5 1.5V9" />
    </>
  ),
  plane: <path d="M10.5 20.5 12 15l7.5-2.5a2 2 0 0 0 0-3.8L3.5 3.2a.5.5 0 0 0-.6.7l3.4 7.2-3.4 7.2a.5.5 0 0 0 .6.7l4.4-1.6" />,
  compass: (
    <>
      <circle cx="12" cy="12" r="9" />
      <path d="m15.5 8.5-2 5.2-5.2 2 2-5.2 5.2-2Z" />
    </>
  ),
}

export function Motif({
  name,
  className,
  strokeWidth = 1.5,
}: {
  name: MotifName | string
  className?: string
  strokeWidth?: number
}) {
  const key = (name in paths ? name : 'spark') as MotifName
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={strokeWidth}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      className={cn('size-6', className)}
    >
      {paths[key]}
    </svg>
  )
}
