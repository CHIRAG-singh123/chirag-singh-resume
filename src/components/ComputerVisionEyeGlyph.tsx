import type { SVGProps } from 'react'
import { ORBIT_CUSTOM_GLYPH_SCALE } from '../lib/orbitIconScale'

/**
 * Stylized “machine eye” — almond lid, bright iris, scan hint — for Computer Vision.
 */
export function ComputerVisionEyeGlyph({ className = '', ...rest }: SVGProps<SVGSVGElement>) {
  const merged = ['skill-orbit-glow', className]
    .filter(Boolean)
    .join(' ')

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
          d="M 4.2 8.6 V 5.8 H 7 M 16 5.8 H 19.2 V 8.6 M 19.2 15.4 V 18.2 H 16 M 7 18.2 H 4.2 V 15.4"
          stroke="rgba(255, 255, 255, 0.45)"
          strokeWidth={1.05}
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path
          d="M 5.2 12.1
           C 5.2 9.15 8.15 6.25 12 6.25
           C 15.85 6.25 18.8 9.15 18.8 12.1
           C 18.8 15 15.85 17.75 12 17.75
           C 8.15 17.75 5.2 15 5.2 12.1 Z"
          fill="rgba(224, 242, 254, 0.55)"
          stroke="rgba(255, 255, 255, 0.9)"
          strokeWidth={1.2}
          strokeLinejoin="round"
        />
        <path
          d="M 5.3 10.2 C 8.8 7.8 15.2 7.8 18.7 10.2"
          stroke="rgba(15, 23, 42, 0.35)"
          strokeWidth={1}
          strokeLinecap="round"
        />
        <circle cx="12" cy="12.3" r="4.55" fill="#22d3ee" stroke="rgba(255,255,255,0.75)" strokeWidth={0.85} />
        <circle cx="12" cy="12.3" r="2.35" fill="#0f172a" />
        <circle cx="13.15" cy="11.2" r="0.75" fill="rgba(255,255,255,0.85)" />
        <path d="M 7.8 12.3 H 16.2" stroke="rgba(255,255,255,0.35)" strokeWidth={0.55} strokeLinecap="round" />
      </g>
    </svg>
  )
}
