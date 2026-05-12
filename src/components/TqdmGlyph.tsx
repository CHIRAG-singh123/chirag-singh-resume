import type { SVGProps } from 'react'
import { ORBIT_CUSTOM_GLYPH_SCALE } from '../lib/orbitIconScale'

/** tqdm-style mark: central blue dot + yellow inner arc + blue outer arc (gap at bottom). */
export function TqdmGlyph({ className = '', ...rest }: SVGProps<SVGSVGElement>) {
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
        <path
          d="M 9.88 19.92 A 8.2 8.2 0 1 1 14.12 19.92"
          fill="none"
          stroke="#308af7"
          strokeWidth={2.35}
          strokeLinecap="round"
        />
        <path
          d="M 10.6 17.22 A 5.4 5.4 0 1 1 13.4 17.22"
          fill="none"
          stroke="#ffce3d"
          strokeWidth={2.05}
          strokeLinecap="round"
        />
        <circle cx="12" cy="12" r="2.15" fill="#308af7" />
      </g>
    </svg>
  )
}
