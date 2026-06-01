import { motion, useReducedMotion } from 'framer-motion'
import type { ReactNode } from 'react'
import { useRouteMotionBudget } from '../lib/routeMotionBudget'
import { durations, easings, pageVariants } from '../motion'

interface PageTransitionProps {
  children: ReactNode
  className?: string
  variant?: 'default' | 'transformOnly'
}

const transformOnlyVariants = {
  hidden: { opacity: 0, y: 18, scale: 0.992 },
  show: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: {
      duration: durations.medium,
      ease: easings.cinematic,
      when: 'beforeChildren',
      staggerChildren: 0.04,
    },
  },
  exit: {
    opacity: 0,
    y: -10,
    scale: 0.995,
    transition: {
      duration: durations.fast,
      ease: easings.smooth,
    },
  },
} as const

export function PageTransition({
  children,
  className,
  variant = 'default',
}: PageTransitionProps) {
  const shouldReduceMotion = useReducedMotion()
  const rapidRouteSwitching = useRouteMotionBudget()

  if (shouldReduceMotion || rapidRouteSwitching) {
    return (
      <motion.div
        initial={rapidRouteSwitching ? false : { opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: rapidRouteSwitching ? 0.12 : 0.18, ease: [0.4, 0, 0.2, 1] }}
        className={className}
      >
        {children}
      </motion.div>
    )
  }

  return (
    <motion.div
      variants={variant === 'transformOnly' ? transformOnlyVariants : pageVariants}
      initial="hidden"
      animate="show"
      exit="exit"
      className={className}
    >
      {children}
    </motion.div>
  )
}
