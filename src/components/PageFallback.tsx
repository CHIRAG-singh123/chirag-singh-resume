import { motion, useReducedMotion } from 'framer-motion'
import { durations, easings } from '../motion'

export function PageFallback() {
  const reduce = useReducedMotion()

  return (
    <div
      role="status"
      aria-live="polite"
      aria-label="Loading page"
      className="relative mx-auto flex min-h-[60vh] max-w-7xl items-center justify-center px-4 py-20 sm:px-6 lg:px-8"
    >
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.18, ease: easings.smooth }}
        className="flex flex-col items-center gap-4"
      >
        <div className="relative h-12 w-12">
          <motion.span
            aria-hidden="true"
            className="absolute inset-0 rounded-full border-2 border-border"
          />
          <motion.span
            aria-hidden="true"
            className="absolute inset-0 rounded-full border-2 border-transparent border-t-accent"
            animate={reduce ? undefined : { rotate: 360 }}
            transition={
              reduce
                ? undefined
                : { duration: durations.cinematic, ease: 'linear', repeat: Infinity }
            }
          />
        </div>
        <span className="text-xs font-semibold uppercase tracking-[0.22em] text-muted-foreground">
          Loading
        </span>
      </motion.div>
    </div>
  )
}
