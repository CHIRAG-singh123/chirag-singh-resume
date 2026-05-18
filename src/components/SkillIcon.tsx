import { memo, type CSSProperties, type ReactNode, type SVGProps } from 'react'
import { getSkillIcon, type SkillIconGlyph } from '../lib/skillBrandIcons'
import { getSkillSvgIcon, getSkillSvgIconDataUri } from '../lib/skillSvgIcons'
import { ComputerVisionEyeGlyph } from './ComputerVisionEyeGlyph'
import { DeepLearningBrainGlyph } from './DeepLearningBrainGlyph'
import { GanNeuralGlyph } from './GanNeuralGlyph'
import { ImageIoGlyph } from './ImageIoGlyph'
import { TqdmGlyph } from './TqdmGlyph'

type SkillIconTone = 'badge' | 'orbit'
type CustomSkillIconKind = Exclude<SkillIconGlyph, { kind: 'svg' }>['kind']

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

const CUSTOM_GLYPH_BODIES: Record<CustomSkillIconKind, string> = {
  computerVisionEye: `<path d="M 4.2 8.6 V 5.8 H 7 M 16 5.8 H 19.2 V 8.6 M 19.2 15.4 V 18.2 H 16 M 7 18.2 H 4.2 V 15.4" stroke="rgba(255, 255, 255, 0.45)" stroke-width="1.05" stroke-linecap="round" stroke-linejoin="round"/><path d="M 5.2 12.1 C 5.2 9.15 8.15 6.25 12 6.25 C 15.85 6.25 18.8 9.15 18.8 12.1 C 18.8 15 15.85 17.75 12 17.75 C 8.15 17.75 5.2 15 5.2 12.1 Z" fill="rgba(224, 242, 254, 0.55)" stroke="rgba(255, 255, 255, 0.9)" stroke-width="1.2" stroke-linejoin="round"/><path d="M 5.3 10.2 C 8.8 7.8 15.2 7.8 18.7 10.2" stroke="rgba(15, 23, 42, 0.35)" stroke-width="1" stroke-linecap="round"/><circle cx="12" cy="12.3" r="4.55" fill="#22d3ee" stroke="rgba(255,255,255,0.75)" stroke-width="0.85"/><circle cx="12" cy="12.3" r="2.35" fill="#0f172a"/><circle cx="13.15" cy="11.2" r="0.75" fill="rgba(255,255,255,0.85)"/><path d="M 7.8 12.3 H 16.2" stroke="rgba(255,255,255,0.35)" stroke-width="0.55" stroke-linecap="round"/>`,
  deepLearningBrain: `<path d="M 9.35 5.05 C 7.1 5.55 5.35 7.55 5.15 10.15 C 4.95 13.35 6.65 16.35 9.05 17.65 C 10.05 18.15 11.25 18.05 12 17.35 C 12.75 18.05 13.95 18.15 14.95 17.65 C 17.35 16.35 19.05 13.35 18.85 10.15 C 18.65 7.55 16.9 5.55 14.65 5.05 C 13.35 4.75 12.55 5.45 12 6.25 C 11.45 5.45 10.65 4.75 9.35 5.05 Z" fill="#22d3ee" stroke="rgba(255, 255, 255, 0.92)" stroke-width="1.35" stroke-linejoin="round" stroke-linecap="round"/><path d="M 12 6.85 C 11.55 10.5 11.55 13.5 12 17.15" fill="none" stroke="rgba(15, 23, 42, 0.28)" stroke-width="0.9" stroke-linecap="round"/>`,
  ganNeural: `<g stroke="rgba(255,255,255,0.88)" stroke-width="0.75" stroke-linecap="round" opacity="1"><line x1="12" y1="12" x2="12" y2="5.2"/><line x1="12" y1="12" x2="17.4" y2="8.4"/><line x1="12" y1="12" x2="17.4" y2="15.6"/><line x1="12" y1="12" x2="12" y2="18.8"/><line x1="12" y1="12" x2="6.6" y2="15.6"/><line x1="12" y1="12" x2="6.6" y2="8.4"/></g><circle cx="12" cy="12" r="3.05" fill="#e9d5ff" stroke="rgba(255,255,255,0.95)" stroke-width="0.45"/><circle cx="12" cy="5.2" r="1.85" fill="#67e8f9" stroke="rgba(255,255,255,0.85)" stroke-width="0.35"/><circle cx="17.4" cy="8.4" r="1.65" fill="#fbbf24" stroke="rgba(255,255,255,0.85)" stroke-width="0.35"/><circle cx="17.4" cy="15.6" r="1.65" fill="#f472b6" stroke="rgba(255,255,255,0.85)" stroke-width="0.35"/><circle cx="12" cy="18.8" r="1.65" fill="#4ade80" stroke="rgba(255,255,255,0.85)" stroke-width="0.35"/><circle cx="6.6" cy="15.6" r="1.65" fill="#a78bfa" stroke="rgba(255,255,255,0.85)" stroke-width="0.35"/><circle cx="6.6" cy="8.4" r="1.65" fill="#38bdf8" stroke="rgba(255,255,255,0.85)" stroke-width="0.35"/>`,
  imageIoGlyph: `<rect x="4.35" y="4.85" width="15.3" height="11.9" rx="1.35" fill="rgba(56, 189, 248, 0.22)" stroke="rgba(255, 255, 255, 0.88)" stroke-width="1.15"/><rect x="5.35" y="5.9" width="13.3" height="4.35" rx="0.35" fill="rgba(14, 165, 233, 0.45)"/><circle cx="16.1" cy="7.55" r="1.15" fill="#fef08a" stroke="rgba(255,255,255,0.35)" stroke-width="0.35"/><path d="M 5.4 16.65 L 8.15 11.9 L 10.35 14.2 L 13.2 9.85 L 16.85 13.4 L 18.6 11.1 L 18.6 16.65 Z" fill="#0ea5e9" stroke="rgba(255,255,255,0.25)" stroke-width="0.45" stroke-linejoin="round"/><circle cx="7.25" cy="7.1" r="0.45" fill="rgba(255,255,255,0.65)"/><circle cx="8.85" cy="7.75" r="0.35" fill="rgba(255,255,255,0.45)"/><path d="M 2.85 19.4 L 4.95 17.9 M 2.85 19.4 L 4.95 20.9" stroke="#67e8f9" stroke-width="1.15" stroke-linecap="round" stroke-linejoin="round"/><path d="M 21.15 19.4 L 19.05 17.9 M 21.15 19.4 L 19.05 20.9" stroke="#67e8f9" stroke-width="1.15" stroke-linecap="round" stroke-linejoin="round"/><path d="M 4.8 19.35 H 19.2" stroke="rgba(255,255,255,0.4)" stroke-width="0.65" stroke-linecap="round" stroke-dasharray="1.2 1.35"/>`,
  tqdmLogo: `<path d="M 9.88 19.92 A 8.2 8.2 0 1 1 14.12 19.92" fill="none" stroke="#308af7" stroke-width="2.35" stroke-linecap="round"/><path d="M 10.6 17.22 A 5.4 5.4 0 1 1 13.4 17.22" fill="none" stroke="#ffce3d" stroke-width="2.05" stroke-linecap="round"/><circle cx="12" cy="12" r="2.15" fill="#308af7"/>`,
}

const CUSTOM_GLYPH_DATA_URI_CACHE = new Map<CustomSkillIconKind, string>()

function getCustomGlyphDataUri(kind: CustomSkillIconKind) {
  const cached = CUSTOM_GLYPH_DATA_URI_CACHE.get(kind)
  if (cached) return cached

  const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none">${CUSTOM_GLYPH_BODIES[kind]}</svg>`
  const uri = `data:image/svg+xml,${encodeURIComponent(svg)}`

  CUSTOM_GLYPH_DATA_URI_CACHE.set(kind, uri)
  return uri
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
    if (tone === 'badge') {
      return (
        <img
          src={getCustomGlyphDataUri(glyph.kind)}
          alt=""
          aria-hidden
          draggable={false}
          className={customClassName}
          style={style}
        />
      )
    }
    return renderCustomGlyph(glyph, customClassName, svgProps)
  }

  const mergedStyle: CSSProperties | undefined = glyph.color
    ? { ...style, color: glyph.color }
    : style

  const source = getSkillSvgIcon(glyph.name)

  if (tone === 'badge' && glyph.color) {
    return (
      <svg
        viewBox={source.viewBox}
        className={mergedClassName}
        style={mergedStyle}
        aria-hidden
        dangerouslySetInnerHTML={{ __html: source.body }}
        {...svgProps}
      />
    )
  }

  if (tone === 'badge') {
    return (
      <img
        src={getSkillSvgIconDataUri(glyph.name, glyph.color)}
        alt=""
        aria-hidden
        draggable={false}
        className={mergedClassName}
        style={mergedStyle}
      />
    )
  }

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
