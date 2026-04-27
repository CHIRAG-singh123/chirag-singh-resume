import type { Variants } from 'framer-motion'
import { cinematicTransition, distances, durations, easings, emphasizedTransition } from './tokens'

export const pageVariants: Variants = {
  hidden: {
    opacity: 0,
    y: distances.md,
    filter: 'blur(10px)',
    scale: 0.985,
  },
  show: {
    opacity: 1,
    y: 0,
    filter: 'blur(0px)',
    scale: 1,
    transition: {
      duration: durations.cinematic,
      ease: easings.emphasized,
      when: 'beforeChildren',
      staggerChildren: 0.05,
    },
  },
  exit: {
    opacity: 0,
    y: -distances.sm,
    filter: 'blur(6px)',
    scale: 0.99,
    transition: {
      duration: durations.fast,
      ease: easings.smooth,
    },
  },
}

export const sectionVariants: Variants = {
  hidden: {
    opacity: 0,
    y: distances.md,
    filter: 'blur(8px)',
  },
  show: {
    opacity: 1,
    y: 0,
    filter: 'blur(0px)',
    transition: emphasizedTransition(durations.medium),
  },
}

export const sectionVariantsSoft: Variants = {
  hidden: { opacity: 0, y: distances.sm },
  show: {
    opacity: 1,
    y: 0,
    transition: cinematicTransition(durations.base),
  },
}

export const sectionVariantsCinematic: Variants = {
  hidden: {
    opacity: 0,
    y: distances.lg,
    filter: 'blur(12px)',
    scale: 0.98,
  },
  show: {
    opacity: 1,
    y: 0,
    filter: 'blur(0px)',
    scale: 1,
    transition: {
      duration: durations.slow,
      ease: easings.emphasized,
    },
  },
}

export const fadeBlurUp: Variants = {
  hidden: { opacity: 0, y: distances.sm, filter: 'blur(6px)' },
  show: {
    opacity: 1,
    y: 0,
    filter: 'blur(0px)',
    transition: cinematicTransition(durations.base),
  },
}

export const fadeBlurDown: Variants = {
  hidden: { opacity: 0, y: -distances.sm, filter: 'blur(6px)' },
  show: {
    opacity: 1,
    y: 0,
    filter: 'blur(0px)',
    transition: cinematicTransition(durations.base),
  },
}

export const slideInLeft: Variants = {
  hidden: { opacity: 0, x: -distances.md },
  show: {
    opacity: 1,
    x: 0,
    transition: cinematicTransition(durations.base),
  },
}

export const slideInRight: Variants = {
  hidden: { opacity: 0, x: distances.md },
  show: {
    opacity: 1,
    x: 0,
    transition: cinematicTransition(durations.base),
  },
}

export const scaleIn: Variants = {
  hidden: { opacity: 0, scale: 0.85 },
  show: {
    opacity: 1,
    scale: 1,
    transition: { duration: durations.base, ease: easings.entrance },
  },
}

export const listStagger: Variants = {
  hidden: {},
  show: {
    transition: {
      staggerChildren: 0.08,
      delayChildren: 0.08,
    },
  },
}

export const listStaggerFast: Variants = {
  hidden: {},
  show: {
    transition: {
      staggerChildren: 0.045,
      delayChildren: 0.04,
    },
  },
}

export const itemVariants: Variants = {
  hidden: { opacity: 0, y: distances.sm, filter: 'blur(4px)' },
  show: {
    opacity: 1,
    y: 0,
    filter: 'blur(0px)',
    transition: cinematicTransition(durations.base),
  },
}

export const itemVariantsScale: Variants = {
  hidden: { opacity: 0, scale: 0.92, y: distances.xs },
  show: {
    opacity: 1,
    scale: 1,
    y: 0,
    transition: { duration: durations.base, ease: easings.entrance },
  },
}

export const headingVariants: Variants = {
  hidden: { opacity: 0, y: distances.sm, filter: 'blur(8px)' },
  show: {
    opacity: 1,
    y: 0,
    filter: 'blur(0px)',
    transition: emphasizedTransition(durations.medium),
  },
}
