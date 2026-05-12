import { normalizeSkillKey } from './skillBrandIcons'

/** Scale custom 24×24 SVG content so it matches typical devicon footprint in the orbit cell. */
export const ORBIT_CUSTOM_GLYPH_SCALE = 0.862

/**
 * Devicon glyphs vary a lot in perceived size at the same font-size.
 * Orbit-only multipliers tune toward equal visual weight (container is fixed).
 */
const ORBIT_DEVICON_FONT_SCALE: Record<string, number> = {
  php: 1.14,
  java: 1.12,
  django: 1.12,
  git: 1.1,
  angular: 1.08,
  laravel: 1.08,
  flutter: 1.06,
  mongodb: 1.06,
  mern: 1.06,
  express: 1.05,
  nodejs: 1.05,
  react: 0.96,
  nlp: 1.04,
  'machine learning': 1.03,
  'api integration': 1.02,
  'responsive web design': 1.02,
  matplotlib: 1.03,
  javascript: 0.9,
  python: 0.92,
  tensorflow: 0.91,
  keras: 0.94,
  'scikit-learn': 0.97,
  opencv: 0.96,
  numpy: 0.96,
  cnn: 0.94,
  typescript: 0.96,
  supabase: 1,
  tkinter: 1.05,
  'google oauth': 0.96,
  'google translate': 1.02,
  'production-ready uis': 0.97,
}

/** Multiplier applied to `fontSize` for this label’s devicon on the orbit only. */
export function getOrbitDeviconFontScale(label: string): number {
  const key = normalizeSkillKey(label)
  return ORBIT_DEVICON_FONT_SCALE[key] ?? 1
}
