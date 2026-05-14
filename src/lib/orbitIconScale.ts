import { normalizeSkillKey } from './skillBrandIcons'

/** Scale custom 24x24 SVG content so it matches the rest of the orbit glyphs. */
export const ORBIT_CUSTOM_GLYPH_SCALE = 1

/**
 * Brand glyphs vary in perceived size at the same viewport box.
 * Orbit-only multipliers tune toward equal visual weight.
 */
const ORBIT_ICON_SCALE: Record<string, number> = {
  php: 1.14,
  java: 1.12,
  django: 1.12,
  git: 1.1,
  angular: 1.08,
  laravel: 1.08,
  flutter: 1.06,
  mongodb: 1.06,
  'computer vision': 1.12,
  'deep learning': 1.12,
  mern: 1.06,
  express: 1.05,
  gans: 1.14,
  imageio: 1.14,
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
  tqdm: 1.16,
  typescript: 0.96,
  supabase: 1,
  tkinter: 1.05,
  'google oauth': 0.96,
  'google translate': 1.02,
  'production-ready uis': 0.97,
}

/** Multiplier applied to the orbit icon box for this label. */
export function getOrbitSkillIconScale(label: string): number {
  const key = normalizeSkillKey(label)
  return ORBIT_ICON_SCALE[key] ?? 1
}

/** Backward-compatible alias for older call sites. */
export const getOrbitDeviconFontScale = getOrbitSkillIconScale
