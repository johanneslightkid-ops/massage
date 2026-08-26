import { motion } from 'motion/react'
import type { ReactNode } from 'react'

const directions = {
  up: { y: 22, x: 0 },
  down: { y: -22, x: 0 },
  left: { y: 0, x: 26 },
  right: { y: 0, x: -26 },
  none: { y: 0, x: 0 },
} as const

export function Reveal({
  children,
  delay = 0,
  from = 'up',
  className,
  once = true,
}: {
  children: ReactNode
  delay?: number
  from?: keyof typeof directions
  className?: string
  once?: boolean
}) {
  const offset = directions[from]
  return (
    <motion.div
      className={className}
      initial={{ opacity: 0, ...offset }}
      whileInView={{ opacity: 1, y: 0, x: 0 }}
      viewport={{ once, margin: '-60px' }}
      transition={{ duration: 0.65, delay, ease: [0.22, 1, 0.36, 1] }}
    >
      {children}
    </motion.div>
  )
}

/** Staggers a list of children without each one needing its own delay prop. */
export function RevealGroup({
  children,
  className,
  step = 0.07,
}: {
  children: ReactNode[]
  className?: string
  step?: number
}) {
  return (
    <div className={className}>
      {children.map((child, index) => (
        <Reveal key={index} delay={Math.min(index * step, 0.45)}>
          {child}
        </Reveal>
      ))}
    </div>
  )
}
