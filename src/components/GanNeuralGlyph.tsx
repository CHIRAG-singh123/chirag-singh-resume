import type { SVGProps } from 'react'
import { ORBIT_CUSTOM_GLYPH_SCALE } from '../lib/orbitIconScale'

/**
 * High-contrast “nucleus + satellites” for GANs (neurons / protons). Uses vivid fills +
 * light strokes so the mark stays readable on charcoal without a backing plate.
 */
export function GanNeuralGlyph({ className = '', ...rest }: SVGProps<SVGSVGElement>) {
  const merged = ['skill-orbit-glow', className].filter(Boolean).join(' ')
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden
      className={merged}
      {...rest}
    >
      <g transform={`translate(12 12) scale(${ORBIT_CUSTOM_GLYPH_SCALE}) translate(-12 -12)`}>
        <g
          stroke="rgba(255,255,255,0.88)"
          strokeWidth={0.75}
          strokeLinecap="round"
          opacity={1}
        >
          <line x1="12" y1="12" x2="12" y2="5.2" />
          <line x1="12" y1="12" x2="17.4" y2="8.4" />
          <line x1="12" y1="12" x2="17.4" y2="15.6" />
          <line x1="12" y1="12" x2="12" y2="18.8" />
          <line x1="12" y1="12" x2="6.6" y2="15.6" />
          <line x1="12" y1="12" x2="6.6" y2="8.4" />
        </g>
        <circle cx="12" cy="12" r="3.05" fill="#e9d5ff" stroke="rgba(255,255,255,0.95)" strokeWidth={0.45} />
        <circle cx="12" cy="5.2" r="1.85" fill="#67e8f9" stroke="rgba(255,255,255,0.85)" strokeWidth={0.35} />
        <circle cx="17.4" cy="8.4" r="1.65" fill="#fbbf24" stroke="rgba(255,255,255,0.85)" strokeWidth={0.35} />
        <circle cx="17.4" cy="15.6" r="1.65" fill="#f472b6" stroke="rgba(255,255,255,0.85)" strokeWidth={0.35} />
        <circle cx="12" cy="18.8" r="1.65" fill="#4ade80" stroke="rgba(255,255,255,0.85)" strokeWidth={0.35} />
        <circle cx="6.6" cy="15.6" r="1.65" fill="#a78bfa" stroke="rgba(255,255,255,0.85)" strokeWidth={0.35} />
        <circle cx="6.6" cy="8.4" r="1.65" fill="#38bdf8" stroke="rgba(255,255,255,0.85)" strokeWidth={0.35} />
      </g>
    </svg>
  )
}
