import type { Transition, Variants } from 'framer-motion'

export const easings = {
  cinematic: [0.22, 1, 0.36, 1] as [number, number, number, number],
  smooth: [0.4, 0, 0.2, 1] as [number, number, number, number],
  emphasized: [0.16, 1, 0.3, 1] as [number, number, number, number],
  entrance: [0.34, 1.56, 0.64, 1] as [number, number, number, number],
}

export const durations = {
  fast: 0.32,
  base: 0.55,
  medium: 0.7,
  slow: 0.9,
  cinematic: 1.05,
}

export const distances = {
  xs: 8,
  sm: 16,
  md: 28,
  lg: 44,
  xl: 64,
}

export const springs = {
  layout: { type: 'spring', stiffness: 360, damping: 32 } as const,
  hover: { type: 'spring', stiffness: 320, damping: 22, mass: 0.6 } as const,
  tap: { type: 'spring', stiffness: 600, damping: 28 } as const,
  press: { type: 'spring', stiffness: 540, damping: 30, mass: 0.5 } as const,
  bouncy: { type: 'spring', stiffness: 280, damping: 18, mass: 0.7 } as const,
}

export const viewport = {
  once: true,
  amount: 0.18,
} as const

export const reducedTransition: Transition = {
  duration: 0.18,
  ease: easings.smooth,
}

export const reducedFade: Variants = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: reducedTransition },
  exit: { opacity: 0, transition: reducedTransition },
}

export const cinematicTransition = (duration = durations.medium, delay = 0): Transition => ({
  duration,
  ease: easings.cinematic,
  delay,
})

export const emphasizedTransition = (duration = durations.medium, delay = 0): Transition => ({
  duration,
  ease: easings.emphasized,
  delay,
})
