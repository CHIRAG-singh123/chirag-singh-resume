import { motion } from 'framer-motion'
import type { ReactNode } from 'react'
import { cinematicTransition, durations, fadeBlurUp, headingVariants, viewport } from '../motion'

interface SectionHeadingProps {
  eyebrow?: string
  title: ReactNode
  description?: ReactNode
  align?: 'left' | 'center'
}

export function SectionHeading({
  eyebrow,
  title,
  description,
  align = 'center',
}: SectionHeadingProps) {
  const alignment = align === 'center' ? 'items-center text-center' : 'items-start text-left'
  return (
    <div className={`flex flex-col gap-4 ${alignment}`}>
      {eyebrow && (
        <motion.span
          variants={fadeBlurUp}
          initial="hidden"
          whileInView="show"
          viewport={{ once: viewport.once, amount: viewport.amount }}
          className="inline-flex items-center gap-2 rounded-full border border-accent/30 bg-accent/10 px-4 py-1.5 text-xs font-semibold uppercase tracking-[0.22em] text-accent"
        >
          <span className="h-1.5 w-1.5 rounded-full bg-accent animate-pulse" />
          {eyebrow}
        </motion.span>
      )}
      <motion.h2
        variants={headingVariants}
        initial="hidden"
        whileInView="show"
        viewport={{ once: viewport.once, amount: viewport.amount }}
        className="font-display text-3xl font-bold tracking-tight text-foreground sm:text-4xl md:text-5xl"
      >
        {title}
      </motion.h2>
      {description && (
        <motion.p
          variants={fadeBlurUp}
          initial="hidden"
          whileInView="show"
          viewport={{ once: viewport.once, amount: viewport.amount }}
          transition={cinematicTransition(durations.base, 0.12)}
          className={`max-w-2xl text-base text-muted-foreground sm:text-lg ${
            align === 'center' ? 'mx-auto' : ''
          }`}
        >
          {description}
        </motion.p>
      )}
    </div>
  )
}
