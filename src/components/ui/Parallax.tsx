import { useRef } from 'react'
import type { ReactNode } from 'react'
import { motion, useReducedMotion, useScroll, useSpring, useTransform } from 'motion/react'

/**
 * Depth by scroll. A layer drifts `speed` × 100px against the page while its
 * box crosses the viewport — positive sinks, negative rises — and can turn a
 * little as it goes. Transform-only, so it stays on the compositor and costs
 * the main thread nothing on a phone.
 */
export function Parallax({
  children,
  speed = 0.3,
  rotate = 0,
  className,
}: {
  children?: ReactNode
  speed?: number
  /** Degrees turned across the whole crossing. */
  rotate?: number
  className?: string
}) {
  const ref = useRef<HTMLDivElement>(null)
  const reduced = useReducedMotion()
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start end', 'end start'] })
  const eased = useSpring(scrollYProgress, { stiffness: 120, damping: 30, mass: 0.4 })
  const y = useTransform(eased, [0, 1], [speed * -100, speed * 100])
  const r = useTransform(eased, [0, 1], [-rotate / 2, rotate / 2])

  // The ref sits on a still wrapper: measuring the moving layer itself would
  // feed its own offset back into the scroll progress.
  return (
    <div ref={ref} className={className}>
      {reduced ? children : <motion.div style={{ y, rotate: r }} className="size-full">{children}</motion.div>}
    </div>
  )
}

/** Big type that slides sideways as you scroll past — a moving horizon line. */
export function DriftText({
  children,
  className,
  distance = 18,
}: {
  children: ReactNode
  className?: string
  /** Percent of its own width travelled across the crossing. */
  distance?: number
}) {
  const ref = useRef<HTMLDivElement>(null)
  const reduced = useReducedMotion()
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start end', 'end start'] })
  const x = useTransform(scrollYProgress, [0, 1], [`${distance / 2}%`, `${-distance / 2}%`])

  return (
    <div ref={ref} className="overflow-hidden">
      <motion.div style={reduced ? undefined : { x }} className={className}>
        {children}
      </motion.div>
    </div>
  )
}
