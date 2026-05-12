import type { ReactNode } from 'react'
import { ComputerVisionEyeGlyph } from './ComputerVisionEyeGlyph'
import { DeepLearningBrainGlyph } from './DeepLearningBrainGlyph'
import { GanNeuralGlyph } from './GanNeuralGlyph'
import { ImageIoGlyph } from './ImageIoGlyph'
import { TqdmGlyph } from './TqdmGlyph'
import { getSkillIcon } from '../lib/skillBrandIcons'

const SIZE_MORE = 1.4
/** Match orbit devicon size so chips and ring marks look consistent. */
const DEVICON_FONT_PX = Math.round(15 * 1.45 * SIZE_MORE)

/** Inline tech glyph for chips — matches constellation devicon mapping. */
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
  const glyph = getSkillIcon(label)
  if (!glyph) return fallback ?? null

  if (glyph.kind === 'ganNeural') {
    return (
      <span className={`inline-flex items-center justify-center ${className}`} aria-hidden>
        <GanNeuralGlyph className="h-full w-full" />
      </span>
    )
  }

  if (glyph.kind === 'tqdmLogo') {
    return (
      <span className={`inline-flex items-center justify-center ${className}`} aria-hidden>
        <TqdmGlyph className="h-full w-full" />
      </span>
    )
  }

  if (glyph.kind === 'deepLearningBrain') {
    return (
      <span className={`inline-flex items-center justify-center ${className}`} aria-hidden>
        <DeepLearningBrainGlyph className="h-full w-full" />
      </span>
    )
  }

  if (glyph.kind === 'computerVisionEye') {
    return (
      <span className={`inline-flex items-center justify-center ${className}`} aria-hidden>
        <ComputerVisionEyeGlyph className="h-full w-full" />
      </span>
    )
  }

  if (glyph.kind === 'imageIoGlyph') {
    return (
      <span className={`inline-flex items-center justify-center ${className}`} aria-hidden>
        <ImageIoGlyph className="h-full w-full" />
      </span>
    )
  }

  return (
    <span className={`inline-flex items-center justify-center ${className}`} aria-hidden>
      <i
        className={`${glyph.iconClass} colored skill-ion-lift`}
        style={{ fontSize: DEVICON_FONT_PX, lineHeight: 1 }}
      />
    </span>
  )
}
