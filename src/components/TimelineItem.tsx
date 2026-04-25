import { motion } from 'framer-motion'
import { Briefcase } from 'lucide-react'
import type { ExperienceItem } from '../lib/resume/types'

interface TimelineItemProps {
  item: ExperienceItem
  index: number
  isLast?: boolean
}

export function TimelineItem({ item, index, isLast = false }: TimelineItemProps) {
  return (
    <motion.li
      initial={{ opacity: 0, x: -24 }}
      whileInView={{ opacity: 1, x: 0 }}
      viewport={{ once: true, amount: 0.3 }}
      transition={{ duration: 0.55, delay: index * 0.1, ease: [0.22, 1, 0.36, 1] }}
      className="relative flex gap-6 pb-10 last:pb-0"
    >
      <div className="relative flex flex-col items-center">
        <span className="relative flex h-12 w-12 items-center justify-center rounded-full bg-hero-gradient bg-[length:200%_200%] text-white shadow-glow animate-gradient-shift">
          <Briefcase className="h-5 w-5" />
          <span className="absolute inset-0 rounded-full ring-2 ring-accent/40 animate-pulse-ring" />
        </span>
        {!isLast && (
          <span className="mt-2 w-px flex-1 bg-gradient-to-b from-accent/60 via-border to-transparent" />
        )}
      </div>

      <div className="flex-1 rounded-2xl border border-border bg-card p-6 shadow-sm">
        <div className="flex flex-wrap items-start justify-between gap-2">
          <div>
            <h3 className="font-display text-lg font-bold text-foreground sm:text-xl">
              {item.title}
            </h3>
            <p className="text-sm font-medium text-accent">{item.company}</p>
          </div>
          <span className="inline-flex items-center rounded-full border border-border bg-background px-3 py-1 text-xs font-medium text-muted-foreground">
            {item.period}
          </span>
        </div>
        <ul className="mt-4 space-y-3">
          {item.bullets.map((bullet) => (
            <li
              key={bullet}
              className="flex gap-3 text-sm leading-relaxed text-muted-foreground"
            >
              <span className="mt-2 h-1.5 w-1.5 flex-shrink-0 rounded-full bg-accent" />
              <span>{bullet}</span>
            </li>
          ))}
        </ul>
      </div>
    </motion.li>
  )
}
