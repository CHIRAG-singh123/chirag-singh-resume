import { motion } from 'framer-motion'

interface SkillBadgeProps {
  label: string
  delay?: number
}

export function SkillBadge({ label, delay = 0 }: SkillBadgeProps) {
  return (
    <motion.span
      initial={{ opacity: 0, scale: 0.85, y: 12 }}
      whileInView={{ opacity: 1, scale: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.4, delay }}
      whileHover={{ y: -4, scale: 1.05 }}
      className="group relative inline-flex items-center gap-2 rounded-full border border-border bg-card/70 px-4 py-2 text-sm font-medium text-foreground shadow-sm backdrop-blur transition-colors hover:border-accent/60 hover:bg-accent/10"
    >
      <span className="h-1.5 w-1.5 rounded-full bg-accent transition-transform group-hover:scale-150" />
      {label}
    </motion.span>
  )
}
