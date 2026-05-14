import { memo } from 'react'
import { motion } from 'framer-motion'
import { durations, easings, springs } from '../motion'
import { SkillBrandMark } from './SkillBrandMark'

interface SkillBadgeProps {
  coarseEffects?: boolean
  label: string
  delay?: number
}

/** Skill chip in category cards - uses the same icon mapping as the orbit. */
export const SkillBadge = memo(function SkillBadge({
  coarseEffects = false,
  label,
  delay = 0,
}: SkillBadgeProps) {
  return (
    <motion.span
      initial={coarseEffects ? undefined : { opacity: 0, scale: 0.92, y: 10 }}
      whileInView={coarseEffects ? undefined : { opacity: 1, scale: 1, y: 0 }}
      viewport={{ once: true, amount: 0.5 }}
      transition={{ duration: durations.fast, delay, ease: easings.entrance }}
      whileHover={{ y: -4, scale: 1.06, transition: springs.hover }}
      whileTap={{ scale: 0.97, transition: springs.tap }}
      className={`group relative inline-flex items-center gap-2 rounded-full border border-border px-4 py-2 text-sm font-medium text-foreground shadow-sm transition-colors hover:border-accent/60 hover:bg-accent/10 ${
        coarseEffects ? 'bg-card/85' : 'bg-card/70 backdrop-blur'
      }`}
    >
      <SkillBrandMark
        label={label}
        className="h-9 w-9 shrink-0"
        fallback={
          <span className="h-1.5 w-1.5 shrink-0 rounded-full bg-accent transition-transform group-hover:scale-150" />
        }
      />
      {label}
    </motion.span>
  )
})
