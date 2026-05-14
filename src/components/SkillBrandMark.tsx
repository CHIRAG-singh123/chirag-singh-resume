import type { ReactNode } from 'react'
import { SkillIcon } from './SkillIcon'

/** Inline tech glyph for chips - matches constellation icon mapping. */
export function SkillBrandMark({
  label,
  fallback,
  className = 'h-9 w-9 shrink-0',
}: {
  label: string
  fallback?: ReactNode
  /** Container for the mark (sizing). */
  className?: string
}) {
  return (
    <span className={`inline-flex items-center justify-center ${className}`} aria-hidden>
      <SkillIcon
        label={label}
        tone="badge"
        className="h-full w-full shrink-0"
        fallback={fallback ?? null}
      />
    </span>
  )
}
