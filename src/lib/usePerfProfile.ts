import { useReducedMotion } from 'framer-motion'
import { useState } from 'react'

function readHardwareCoarse(): boolean {
  if (typeof navigator === 'undefined' || typeof window === 'undefined') return false
  const hc = navigator.hardwareConcurrency ?? 8
  const dm = (navigator as Navigator & { deviceMemory?: number }).deviceMemory
  const coarsePointer =
    typeof window.matchMedia === 'function' && window.matchMedia('(pointer: coarse)').matches
  const compactViewport = window.innerWidth < 768
  return hc <= 4 || (dm !== undefined && dm <= 4) || (coarsePointer && compactViewport)
}

/**
 * Combines prefers-reduced-motion with coarse hardware + touch/mobile heuristics
 * so we can trim paint-heavy effects without relying on the OS a11y toggle alone.
 */
export function usePerfProfile() {
  const reduceMotion = useReducedMotion() ?? false
  const [hardwareCoarse] = useState(readHardwareCoarse)

  const coarseEffects = reduceMotion || hardwareCoarse
  return { reduceMotion, hardwareCoarse, coarseEffects }
}
