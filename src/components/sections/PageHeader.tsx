import { motion } from 'motion/react'
import type { ReactNode } from 'react'
import { MonsteraLeaf, OilSheen, PalmFrond, WaveDivider } from '@/components/art/Decor'
import { Container } from '@/components/ui/Section'

/**
 * The banner every inner page opens with. The <OilSheen /> layer keeps the
 * gradient moving very slowly, so the block reads as wet colour rather than a
 * flat print — the same idea as the hero, at a quieter volume.
 */
export function PageHeader({
  kicker,
  title,
  script,
  lead,
  children,
}: {
  kicker: string
  title: string
  script?: string
  lead?: string
  children?: ReactNode
}) {
  return (
    <section className="grain relative overflow-hidden bg-gradient-to-br from-sky-900 via-sky-800 to-lagoon-700 pt-16 pb-28 text-sand-50 sm:pt-24 sm:pb-36">
      <OilSheen />
      <PalmFrond className="pointer-events-none absolute -top-12 -left-20 h-80 w-60 animate-sway text-sky-950/35" />
      <MonsteraLeaf
        mirrored
        className="pointer-events-none absolute -top-16 -right-20 h-96 w-72 text-palm-950/25"
      />

      <Container className="relative z-10">
        <motion.p
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="inline-flex items-center gap-2 text-[0.7rem] font-bold tracking-[0.22em] text-seafoam-200 uppercase"
        >
          <span className="h-1.5 w-1.5 rounded-full bg-sun-400" aria-hidden="true" />
          {kicker}
        </motion.p>
        <motion.h1
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.06, ease: [0.22, 1, 0.36, 1] }}
          className="mt-5 max-w-3xl text-[2.4rem] leading-[1.05] text-sand-50 sm:text-5xl lg:text-6xl"
        >
          {title}
          {script && (
            <span className="script bg-gradient-to-r from-sun-300 via-flamingo-300 to-lagoon-200 bg-clip-text text-transparent">
              {' '}
              {script}
            </span>
          )}
        </motion.h1>
        {lead && (
          <motion.p
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.14, ease: [0.22, 1, 0.36, 1] }}
            className="mt-6 max-w-2xl text-[1.02rem] leading-relaxed text-sand-100/85 sm:text-lg"
          >
            {lead}
          </motion.p>
        )}
        {children}
      </Container>

      <WaveDivider from="var(--color-sand-50)" tone="var(--color-sky-950)" className="absolute inset-x-0 -bottom-px" />
    </section>
  )
}
