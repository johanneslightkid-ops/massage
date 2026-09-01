import { Link } from 'react-router-dom'
import type { ReactNode } from 'react'
import { cn } from '@/lib/utils'

type Variant = 'primary' | 'ocean' | 'sky' | 'palm' | 'whatsapp' | 'outline' | 'ghost' | 'sand'
type Size = 'sm' | 'md' | 'lg'

const variants: Record<Variant, string> = {
  primary:
    'bg-gradient-to-br from-flamingo-500 to-coral-500 text-white shadow-soft hover:shadow-pink hover:brightness-105',
  ocean: 'bg-ocean-900 text-sand-50 shadow-soft hover:bg-ocean-800',
  sky: 'bg-gradient-to-br from-sky-600 to-lagoon-600 text-white shadow-soft hover:brightness-105',
  palm: 'bg-gradient-to-br from-palm-600 to-lagoon-600 text-white shadow-soft hover:brightness-105',
  whatsapp: 'bg-[#25D366] text-[#062e17] shadow-soft hover:bg-[#1fbb59]',
  outline:
    'border border-ocean-900/15 bg-white/60 text-ocean-900 backdrop-blur-sm hover:border-lagoon-400/60 hover:bg-white',
  ghost: 'text-ocean-800 hover:bg-ocean-900/5',
  sand: 'bg-sand-100 text-ocean-900 hover:bg-sand-200',
}

const sizes: Record<Size, string> = {
  sm: 'h-10 px-4 text-sm',
  md: 'h-12 px-6 text-[0.95rem]',
  lg: 'h-14 px-7 text-base',
}

const base =
  'inline-flex items-center justify-center gap-2 rounded-full font-semibold tracking-tight transition-all duration-300 ease-[cubic-bezier(.22,1,.36,1)] active:scale-[0.97] disabled:pointer-events-none disabled:opacity-50'

interface CommonProps {
  variant?: Variant
  size?: Size
  className?: string
  children: ReactNode
}

export function Button({
  variant = 'primary',
  size = 'md',
  className,
  children,
  ...props
}: CommonProps & React.ButtonHTMLAttributes<HTMLButtonElement>) {
  return (
    <button className={cn(base, variants[variant], sizes[size], className)} {...props}>
      {children}
    </button>
  )
}

export function ButtonLink({
  to,
  variant = 'primary',
  size = 'md',
  className,
  children,
}: CommonProps & { to: string }) {
  return (
    <Link to={to} className={cn(base, variants[variant], sizes[size], className)}>
      {children}
    </Link>
  )
}

export function ButtonAnchor({
  href,
  variant = 'primary',
  size = 'md',
  className,
  children,
  ...props
}: CommonProps & React.AnchorHTMLAttributes<HTMLAnchorElement>) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noreferrer noopener"
      className={cn(base, variants[variant], sizes[size], className)}
      {...props}
    >
      {children}
    </a>
  )
}
