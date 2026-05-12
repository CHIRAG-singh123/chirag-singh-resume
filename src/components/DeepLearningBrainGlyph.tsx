import type { SVGProps } from 'react'
import { ORBIT_CUSTOM_GLYPH_SCALE } from '../lib/orbitIconScale'

/** Bilateral brain silhouette — solid fill + light rim so it matches weight of devicon marks on dark UI. */
export function DeepLearningBrainGlyph({ className = '', ...rest }: SVGProps<SVGSVGElement>) {
  const merged = ['skill-orbit-glow', className]
    .filter(Boolean)
    .join(' ')
  const brainPath =
    'M 9.35 5.05 C 7.1 5.55 5.35 7.55 5.15 10.15 C 4.95 13.35 6.65 16.35 9.05 17.65 C 10.05 18.15 11.25 18.05 12 17.35 C 12.75 18.05 13.95 18.15 14.95 17.65 C 17.35 16.35 19.05 13.35 18.85 10.15 C 18.65 7.55 16.9 5.55 14.65 5.05 C 13.35 4.75 12.55 5.45 12 6.25 C 11.45 5.45 10.65 4.75 9.35 5.05 Z'

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
        <path
          d={brainPath}
          fill="#22d3ee"
          stroke="rgba(255, 255, 255, 0.92)"
          strokeWidth={1.35}
          strokeLinejoin="round"
          strokeLinecap="round"
        />
        <path
          d="M 12 6.85 C 11.55 10.5 11.55 13.5 12 17.15"
          fill="none"
          stroke="rgba(15, 23, 42, 0.28)"
          strokeWidth={0.9}
          strokeLinecap="round"
        />
      </g>
    </svg>
  )
}
