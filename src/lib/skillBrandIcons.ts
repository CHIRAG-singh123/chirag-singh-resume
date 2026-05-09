/**
 * Brand marks via Simple Icons (CC0-1.0) — https://simpleicons.org/
 *
 * Inventory (normalized key → source):
 * - si: python, javascript, php, django, angular, laravel, tensorflow, keras,
 *       scikit-learn, nlp, machine learning (Jupyter),
 *       responsive web design (CSS), git, opencv (OpenCV), numpy,
 *       tqdm, gans (NVIDIA), imageio (ImageJ), mern (MongoDB for MERN stack label).
 * - svgRaster (official / multi-color, custom public/Image/**): matplotlib, java,
 *       api integration (robotic-chatbot mascot), computer vision (Image/computer-vision.svg).
 * - neuralNet: deep learning (inline MLP diagram — readable at icon size, no orbit tilt issues).
 *
 * Trademark / license: vendor headers on SVGs under public/Image/brands/.
 */

import type { SimpleIcon } from 'simple-icons'
import {
  siAngular,
  siCss,
  siDjango,
  siGit,
  siImagej,
  siJavascript,
  siJupyter,
  siKeras,
  siMongodb,
  siNumpy,
  siNvidia,
  siOpencv,
  siPhp,
  siPython,
  siScikitlearn,
  siSpacy,
  siLaravel,
  siTensorflow,
  siTqdm,
} from 'simple-icons'

export type SkillBrandGlyph =
  /** Simple Icons: single path + brand hex (mono). */
  | { kind: 'si'; path: string; hex: string }
  /** Full-color or complex SVG served from `public/`. */
  | { kind: 'svgRaster'; src: string; alt: string; viewBox: string }
  /** Small inline network diagram (constellation-only). */
  | { kind: 'neuralNet' }

function publicAssetUrl(path: string): string {
  const base = import.meta.env.BASE_URL
  const normalized = path.startsWith('/') ? path.slice(1) : path
  if (base.endsWith('/')) return `${base}${normalized}`
  return `${base}/${normalized}`
}

/** Canonical keys after {@link normalizeSkillKey} → Simple Icon data. */
const BRAND_BY_KEY: Record<string, SimpleIcon> = {
  python: siPython,
  javascript: siJavascript,
  php: siPhp,
  django: siDjango,
  angular: siAngular,
  laravel: siLaravel,
  tensorflow: siTensorflow,
  keras: siKeras,
  'scikit-learn': siScikitlearn,

  nlp: siSpacy,
  'machine learning': siJupyter,
  'responsive web design': siCss,
  git: siGit,

  opencv: siOpencv,
  numpy: siNumpy,
  tqdm: siTqdm,

  gans: siNvidia,
  imageio: siImagej,

  mern: siMongodb,
}

export function normalizeSkillKey(raw: string): string {
  let s = raw.trim().toLowerCase()
  s = s.replace(/\s*\([^)]*\)\s*$/, '').trim()
  return s
}

const SVG_RASTER: Record<
  string,
  { relativePath: string; alt: string; viewBox: string }
> = {
  matplotlib: {
    relativePath: 'Image/matplotlib-icon.svg',
    alt: 'Matplotlib',
    viewBox: '0 0 72 72',
  },
  java: {
    relativePath: 'Image/brands/java.svg',
    alt: 'Java',
    viewBox: '0 0 128 128',
  },
  'api integration': {
    relativePath: 'Image/API-Intigration.svg',
    alt: 'API Integration',
    viewBox: '0 0 512 512',
  },
  'computer vision': {
    relativePath: 'Image/computer-vision.svg',
    alt: 'Computer vision',
    viewBox: '0 0 512 512',
  },
}

export function getBrandIcon(label: string): SkillBrandGlyph | null {
  const key = normalizeSkillKey(label)
  if (key === 'deep learning') return { kind: 'neuralNet' }
  const raster = SVG_RASTER[key]
  if (raster) {
    return {
      kind: 'svgRaster',
      src: publicAssetUrl(raster.relativePath),
      alt: raster.alt,
      viewBox: raster.viewBox,
    }
  }
  const icon = BRAND_BY_KEY[key]
  if (!icon) return null
  return { kind: 'si', path: icon.path, hex: icon.hex }
}
