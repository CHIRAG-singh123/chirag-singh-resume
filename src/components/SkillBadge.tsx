import { memo } from 'react'
import { SkillBrandMark } from './SkillBrandMark'

interface SkillBadgeProps {
  coarseEffects?: boolean
  label: string
}

/** Skill chip in category cards - uses the same icon mapping as the orbit. */
export const SkillBadge = memo(function SkillBadge({
  coarseEffects = false,
  label,
}: SkillBadgeProps) {
  return (
    <span
      className={`skill-badge group relative inline-flex items-center gap-2 rounded-full border border-border px-4 py-2 text-sm font-medium text-foreground shadow-sm transition-[background-color,border-color,transform] duration-200 hover:-translate-y-1 hover:border-accent/60 hover:bg-accent/10 active:scale-[0.98] ${
        coarseEffects ? 'bg-card/85' : 'bg-card/70'
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
    </span>
  )
})
