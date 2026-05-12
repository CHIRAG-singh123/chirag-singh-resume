import type { SVGProps } from 'react'
import { ORBIT_CUSTOM_GLYPH_SCALE } from '../lib/orbitIconScale'

/**
 * “Read / write imagery” — framed picture + mountains + bidirectional I/O arrows (ImageIO).
 */
export function ImageIoGlyph({ className = '', ...rest }: SVGProps<SVGSVGElement>) {
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
        <rect
          x="4.35"
          y="4.85"
          width="15.3"
          height="11.9"
          rx="1.35"
          fill="rgba(56, 189, 248, 0.22)"
          stroke="rgba(255, 255, 255, 0.88)"
          strokeWidth={1.15}
        />
        <rect x="5.35" y="5.9" width="13.3" height="4.35" rx="0.35" fill="rgba(14, 165, 233, 0.45)" />
        <circle cx="16.1" cy="7.55" r="1.15" fill="#fef08a" stroke="rgba(255,255,255,0.35)" strokeWidth={0.35} />
        <path
          d="M 5.4 16.65 L 8.15 11.9 L 10.35 14.2 L 13.2 9.85 L 16.85 13.4 L 18.6 11.1 L 18.6 16.65 Z"
          fill="#0ea5e9"
          stroke="rgba(255,255,255,0.25)"
          strokeWidth={0.45}
          strokeLinejoin="round"
        />
        <circle cx="7.25" cy="7.1" r="0.45" fill="rgba(255,255,255,0.65)" />
        <circle cx="8.85" cy="7.75" r="0.35" fill="rgba(255,255,255,0.45)" />
        <path
          d="M 2.85 19.4 L 4.95 17.9 M 2.85 19.4 L 4.95 20.9"
          stroke="#67e8f9"
          strokeWidth={1.15}
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path
          d="M 21.15 19.4 L 19.05 17.9 M 21.15 19.4 L 19.05 20.9"
          stroke="#67e8f9"
          strokeWidth={1.15}
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path
          d="M 4.8 19.35 H 19.2"
          stroke="rgba(255,255,255,0.4)"
          strokeWidth={0.65}
          strokeLinecap="round"
          strokeDasharray="1.2 1.35"
        />
      </g>
    </svg>
  )
}
