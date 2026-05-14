import { memo, type CSSProperties, type ReactNode, type SVGProps } from 'react'
import { getSkillIcon, type SkillIconGlyph } from '../lib/skillBrandIcons'
import { getSkillSvgIcon } from '../lib/skillSvgIcons'
import { ComputerVisionEyeGlyph } from './ComputerVisionEyeGlyph'
import { DeepLearningBrainGlyph } from './DeepLearningBrainGlyph'
import { GanNeuralGlyph } from './GanNeuralGlyph'
import { ImageIoGlyph } from './ImageIoGlyph'
import { TqdmGlyph } from './TqdmGlyph'

type SkillIconTone = 'badge' | 'orbit'

interface SkillIconProps extends Omit<SVGProps<SVGSVGElement>, 'children'> {
  fallback?: ReactNode
  glyph?: SkillIconGlyph | null
  label?: string
  tone?: SkillIconTone
}

function renderCustomGlyph(
  glyph: Exclude<SkillIconGlyph, { kind: 'svg' }>,
  className: string,
  props: SVGProps<SVGSVGElement>,
) {
  if (glyph.kind === 'ganNeural') return <GanNeuralGlyph className={className} {...props} />
  if (glyph.kind === 'tqdmLogo') return <TqdmGlyph className={className} {...props} />
  if (glyph.kind === 'deepLearningBrain') {
    return <DeepLearningBrainGlyph className={className} {...props} />
  }
  if (glyph.kind === 'computerVisionEye') {
    return <ComputerVisionEyeGlyph className={className} {...props} />
  }
  return <ImageIoGlyph className={className} {...props} />
}

export const SkillIcon = memo(function SkillIcon({
  fallback = null,
  glyph: providedGlyph,
  label,
  tone = 'badge',
  className = '',
  style,
  ...svgProps
}: SkillIconProps) {
  const glyph = providedGlyph ?? (label ? getSkillIcon(label) : null)
  if (!glyph) return <>{fallback}</>

  const toneClass = tone === 'orbit' ? 'skill-icon-orbit' : 'skill-icon-mark'
  const mergedClassName = [toneClass, className].filter(Boolean).join(' ')

  if (glyph.kind !== 'svg') {
    const customClassName = [mergedClassName, `skill-icon-custom-${tone}`].join(' ')
    return renderCustomGlyph(glyph, customClassName, svgProps)
  }

  const source = getSkillSvgIcon(glyph.name)
  const mergedStyle: CSSProperties | undefined = glyph.color
    ? { ...style, color: glyph.color }
    : style

  return (
    <svg
      viewBox={source.viewBox}
      className={mergedClassName}
      style={mergedStyle}
      dangerouslySetInnerHTML={{ __html: source.body }}
      {...svgProps}
    />
  )
})
