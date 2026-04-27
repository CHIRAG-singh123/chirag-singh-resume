import { motion } from 'framer-motion'
import { durations, easings, springs } from '../motion'

interface SkillBadgeProps {
  label: string
  delay?: number
}

export function SkillBadge({ label, delay = 0 }: SkillBadgeProps) {
  return (
    <motion.span
      initial={{ opacity: 0, scale: 0.85, y: 12, filter: 'blur(4px)' }}
      whileInView={{ opacity: 1, scale: 1, y: 0, filter: 'blur(0px)' }}
      viewport={{ once: true, amount: 0.5 }}
      transition={{ duration: durations.fast, delay, ease: easings.entrance }}
      whileHover={{ y: -4, scale: 1.06, transition: springs.hover }}
      whileTap={{ scale: 0.97, transition: springs.tap }}
      className="group relative inline-flex items-center gap-2 rounded-full border border-border bg-card/70 px-4 py-2 text-sm font-medium text-foreground shadow-sm backdrop-blur transition-colors hover:border-accent/60 hover:bg-accent/10"
    >
      <span className="h-1.5 w-1.5 rounded-full bg-accent transition-transform group-hover:scale-150" />
      {label}
    </motion.span>
  )
}
