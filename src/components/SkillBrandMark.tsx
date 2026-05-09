import type { ReactNode } from 'react'
import { getBrandIcon } from '../lib/skillBrandIcons'
import { siFillRelativeLuminance, siGlyphNeedsLightBackdrop } from '../lib/siGlyphVisibility'

/** Inline brand glyph for chips — mirrors constellation semantics (including light SI backdrops). */
export function SkillBrandMark({
  label,
  fallback,
  className = 'h-[18px] w-[18px] shrink-0',
}: {
  label: string
  fallback?: ReactNode
  /** Container for the mark (SVG / img sizing). */
  className?: string
}) {
  const brand = getBrandIcon(label)
  if (!brand) return fallback ?? null

  if (brand.kind === 'si') {
    const L = siFillRelativeLuminance(brand.hex)
    const backdrop = siGlyphNeedsLightBackdrop(L)
    return (
      <span className={`inline-flex items-center justify-center ${className}`}>
        <svg viewBox="0 0 24 24" className="h-full w-full" aria-hidden>
          {backdrop ? <circle cx={12} cy={12} r={10} fill="#f4f6fa" opacity={0.97} /> : null}
          <path fill={`#${brand.hex}`} d={brand.path} />
        </svg>
      </span>
    )
  }

  if (brand.kind === 'svgRaster') {
    return (
      <span
        className={`inline-flex items-center justify-center overflow-hidden rounded-md border border-border bg-[#f4f6fa] p-px ${className}`}
      >
        <img
          src={brand.src}
          alt=""
          draggable={false}
          decoding="async"
          className="h-full w-full object-contain"
        />
      </span>
    )
  }

  const sw = 0.65
  return (
    <span className={`inline-flex items-center justify-center ${className}`}>
      <svg viewBox="0 0 24 24" className="h-full w-full text-muted-foreground" aria-hidden>
        <g stroke="currentColor" strokeWidth={sw} strokeLinecap="round" opacity={0.65} fill="none">
          <line x1="5" y1="7.2" x2="11.85" y2="9.1" />
          <line x1="5" y1="7.2" x2="11.85" y2="14.9" />
          <line x1="5" y1="12" x2="11.85" y2="9.1" />
          <line x1="5" y1="12" x2="11.85" y2="14.9" />
          <line x1="5" y1="16.8" x2="11.85" y2="9.1" />
          <line x1="5" y1="16.8" x2="11.85" y2="14.9" />
          <line x1="12.15" y1="9.1" x2="19" y2="10" />
          <line x1="12.15" y1="9.1" x2="19" y2="14" />
          <line x1="12.15" y1="14.9" x2="19" y2="10" />
          <line x1="12.15" y1="14.9" x2="19" y2="14" />
        </g>
        <circle cx="5" cy="7.2" r="2.05" fill="var(--color-chart-primary)" opacity={0.95} />
        <circle cx="5" cy="12" r="2.05" fill="var(--color-chart-secondary)" opacity={0.95} />
        <circle cx="5" cy="16.8" r="2.05" fill="var(--color-chart-tertiary)" opacity={0.95} />
        <circle cx="12" cy="9.1" r="2.35" fill="var(--color-accent)" opacity={0.92} />
        <circle cx="12" cy="14.9" r="2.35" fill="var(--color-accent-secondary)" opacity={0.92} />
        <circle cx="19" cy="10" r="2.1" fill="var(--color-chart-primary)" opacity={0.95} />
        <circle cx="19" cy="14" r="2.1" fill="var(--color-chart-secondary)" opacity={0.95} />
      </svg>
    </span>
  )
}
