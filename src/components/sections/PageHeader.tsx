import { motion } from 'motion/react'
import type { ReactNode } from 'react'
import { PalmFrond, WaveDivider } from '@/components/art/Decor'
import { Container } from '@/components/ui/Section'

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
    <section className="grain relative overflow-hidden bg-gradient-to-br from-ocean-900 via-ocean-800 to-lagoon-600 pt-16 pb-28 text-sand-50 sm:pt-24 sm:pb-36">
      <PalmFrond className="pointer-events-none absolute -top-12 -left-20 h-80 w-60 animate-sway text-ocean-950/30" />
      <PalmFrond mirrored className="pointer-events-none absolute -top-20 -right-24 h-96 w-72 text-ocean-950/22" />

      <Container className="relative z-10">
        <motion.p
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-[0.7rem] font-bold tracking-[0.22em] text-seafoam-300 uppercase"
        >
          {kicker}
        </motion.p>
        <motion.h1
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.06, ease: [0.22, 1, 0.36, 1] }}
          className="mt-5 max-w-3xl text-[2.4rem] leading-[1.05] sm:text-5xl lg:text-6xl"
        >
          {title}
          {script && <span className="script text-sun-400"> {script}</span>}
        </motion.h1>
        {lead && (
          <motion.p
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.14, ease: [0.22, 1, 0.36, 1] }}
            className="mt-6 max-w-2xl text-[1.02rem] leading-relaxed text-sand-100/80 sm:text-lg"
          >
            {lead}
          </motion.p>
        )}
        {children}
      </Container>

      <WaveDivider from="var(--color-sand-50)" tone="var(--color-ocean-950)" className="absolute inset-x-0 -bottom-px" />
    </section>
  )
}
