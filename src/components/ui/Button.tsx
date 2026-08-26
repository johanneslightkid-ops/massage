import { Link } from 'react-router-dom'
import type { ReactNode } from 'react'
import { cn } from '@/lib/utils'

type Variant = 'primary' | 'ocean' | 'whatsapp' | 'outline' | 'ghost' | 'sand'
type Size = 'sm' | 'md' | 'lg'

const variants: Record<Variant, string> = {
  primary:
    'bg-coral-500 text-white shadow-soft hover:bg-coral-600 active:bg-coral-600',
  ocean: 'bg-ocean-900 text-sand-50 shadow-soft hover:bg-ocean-800',
  whatsapp: 'bg-[#25D366] text-[#062e17] shadow-soft hover:bg-[#1fbb59]',
  outline:
    'border border-ocean-900/20 bg-transparent text-ocean-900 hover:border-ocean-900/40 hover:bg-ocean-900/5',
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
