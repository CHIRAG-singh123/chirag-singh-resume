/**
 * Tech marks via Devicon (MIT) — https://devicon.dev/
 * CSS + icon font from `devicon` npm package (`devicon-plain` + `colored` modifier).
 *
 * Unmapped labels return null; UI components use fallbacks (dots / category icons).
 */

export type SkillIconGlyph =
  | {
      kind: 'devicon'
      /** Single class e.g. `devicon-python-plain` (do not include `colored`). */
      iconClass: string
    }
  | { kind: 'ganNeural' }
  | { kind: 'tqdmLogo' }
  | { kind: 'deepLearningBrain' }
  | { kind: 'computerVisionEye' }
  | { kind: 'imageIoGlyph' }

/** Compound labels that use a non-devicon or custom mark. */
const COMPOUND_CUSTOM: Record<string, SkillIconGlyph> = {
  'generative ai & gans': { kind: 'ganNeural' },
  'computer vision': { kind: 'computerVisionEye' },
}

/** Specialty tiles + matching orbit labels — full-string lowercase match on label. */
const COMPOUND_LABELS: Record<string, string> = {
  'mern & django apps': 'devicon-react-original',
  'nlp & chatbots': 'devicon-anaconda-plain',
  'ml pipelines': 'devicon-jupyter-plain',
  /** Same string as resume item `Production-ready UIs` (Tailwind). */
  'production-ready uis': 'devicon-tailwindcss-plain',
}

/** Normalized key → devicon-* class (without `colored`). */
const DEVICON_BY_KEY: Record<string, string> = {
  python: 'devicon-python-plain',
  java: 'devicon-java-plain',
  javascript: 'devicon-javascript-plain',
  php: 'devicon-php-plain',

  django: 'devicon-django-plain',
  mern: 'devicon-mongodb-plain',
  angular: 'devicon-angular-plain',
  laravel: 'devicon-laravel-plain',
  tensorflow: 'devicon-tensorflow-original',
  keras: 'devicon-keras-plain',
  'scikit-learn': 'devicon-scikitlearn-plain',
  flutter: 'devicon-flutter-plain',

  nlp: 'devicon-anaconda-plain',
  'machine learning': 'devicon-jupyter-plain',
  'api integration': 'devicon-fastapi-plain',
  'responsive web design': 'devicon-css3-plain',
  git: 'devicon-git-plain',

  /** Library chip — distinct from the “Computer Vision” concept (matlab). */
  opencv: 'devicon-opencv-plain',
  matplotlib: 'devicon-matplotlib-plain',
  numpy: 'devicon-numpy-plain',

  mongodb: 'devicon-mongodb-plain',
  express: 'devicon-express-original',
  react: 'devicon-react-original',
  nodejs: 'devicon-nodejs-plain',

  cnn: 'devicon-pytorch-plain',
  tkinter: 'devicon-vscode-plain',
  'google oauth': 'devicon-google-original',
  'google translate': 'devicon-googlecloud-plain',

  typescript: 'devicon-typescript-plain',
  supabase: 'devicon-supabase-plain',
}

export function normalizeSkillKey(raw: string): string {
  let s = raw.trim().toLowerCase()
  s = s.replace(/\s*\([^)]*\)\s*$/, '').trim()
  if (/^mern\b/.test(s)) return 'mern'
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

  const compoundClass = COMPOUND_LABELS[compound]
  if (compoundClass) return { kind: 'devicon', iconClass: compoundClass }

  const key = normalizeSkillKey(label)
  if (key === 'gans') return { kind: 'ganNeural' }
  if (key === 'tqdm') return { kind: 'tqdmLogo' }
  if (key === 'deep learning') return { kind: 'deepLearningBrain' }
  if (key === 'imageio') return { kind: 'imageIoGlyph' }

  const iconClass = DEVICON_BY_KEY[key]
  if (!iconClass) return null
  return { kind: 'devicon', iconClass }
}
