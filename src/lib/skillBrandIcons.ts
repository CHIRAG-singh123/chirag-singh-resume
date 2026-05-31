import type { SkillSvgIconName } from './skillSvgIcons'

/**
 * Skill marks resolve to a small inline-SVG subset plus a handful of custom glyphs.
 *
 * Unmapped labels return null; UI components use fallbacks (dots / category icons).
 *
 * Orbit tooltips and marks use the same strings as resume skill items; changing a label
 * here or in resume data should stay consistent with `SkillConstellation` node ids.
 */
export type SkillIconGlyph =
  | {
      kind: 'svg'
      color?: string
      name: SkillSvgIconName
    }
  | { kind: 'ganNeural' }
  | { kind: 'tqdmLogo' }
  | { kind: 'deepLearningBrain' }
  | { kind: 'computerVisionEye' }
  | { kind: 'imageIoGlyph' }

function svg(name: SkillSvgIconName, color?: string): SkillIconGlyph {
  return { kind: 'svg', name, color }
}

/** Compound labels that use a non-SVG-mapped custom mark. */
const COMPOUND_CUSTOM: Record<string, SkillIconGlyph> = {
  'generative ai & gans': { kind: 'ganNeural' },
  'computer vision': { kind: 'computerVisionEye' },
}

/** Specialty tiles + matching orbit labels - full-string lowercase match on label. */
const COMPOUND_LABELS: Record<string, SkillIconGlyph> = {
  'mern & django apps': svg('react'),
  'nlp & chatbots': svg('anaconda'),
  'ml pipelines': svg('jupyter'),
  /** Same string as resume item `Production-ready UIs` (Tailwind). */
  'production-ready uis': svg('tailwind'),
}

/** Normalized key -> inline SVG metadata. */
const DEVICON_BY_KEY: Record<string, SkillIconGlyph> = {
  python: svg('python'),
  java: svg('java'),
  javascript: svg('javascript'),
  php: svg('php'),

  django: svg('django'),
  mern: svg('mongodb'),
  angular: svg('angular', '#dd0031'),
  laravel: svg('laravel'),
  inertiajs: svg('inertiajs'),
  tensorflow: svg('tensorflow'),
  keras: svg('keras'),
  'scikit-learn': svg('scikitlearn'),
  flutter: svg('flutter'),

  nlp: svg('anaconda'),
  'machine learning': svg('jupyter'),
  'api integration': svg('fastapi'),
  'responsive web design': svg('css3'),
  git: svg('git'),

  /** Library chip - distinct from the "Computer Vision" concept. */
  opencv: svg('opencv'),
  matplotlib: svg('matplotlib'),
  numpy: svg('numpy'),

  mongodb: svg('mongodb'),
  express: svg('express'),
  react: svg('react'),
  nodejs: svg('nodejs'),

  cnn: svg('pytorch'),
  tkinter: svg('vscode', '#2f80ed'),
  'google oauth': svg('google'),
  'google translate': svg('googleCloud'),

  typescript: svg('typescript'),
  supabase: svg('supabase', '#3ecf8e'),
}

export function normalizeSkillKey(raw: string): string {
  let s = raw.trim().toLowerCase()
  s = s.replace(/\s*\([^)]*\)\s*$/, '').trim()
  if (/^mern\b/.test(s)) return 'mern'
  if (s === 'inertia.js' || s === 'inertiajs') return 'inertiajs'
  if (s === 'node.js' || s === 'nodejs') return 'nodejs'
  if (s === 'express.js' || s === 'express') return 'express'
  if (s === 'scikit learn') return 'scikit-learn'
  if (s === 'tqmd') return 'tqdm'
  return s
}

export function getSkillIcon(label: string): SkillIconGlyph | null {
  const compound = label.trim().toLowerCase()
  const customCompound = COMPOUND_CUSTOM[compound]
  if (customCompound) return customCompound

  const compoundIcon = COMPOUND_LABELS[compound]
  if (compoundIcon) return compoundIcon

  const key = normalizeSkillKey(label)
  if (key === 'gans') return { kind: 'ganNeural' }
  if (key === 'tqdm') return { kind: 'tqdmLogo' }
  if (key === 'deep learning') return { kind: 'deepLearningBrain' }
  if (key === 'imageio') return { kind: 'imageIoGlyph' }

  return DEVICON_BY_KEY[key] ?? null
}
