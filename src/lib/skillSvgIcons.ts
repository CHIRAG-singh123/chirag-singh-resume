import angularSvg from 'devicon/icons/angular/angular-plain.svg?raw'
import anacondaSvg from 'devicon/icons/anaconda/anaconda-original.svg?raw'
import css3Svg from 'devicon/icons/css3/css3-plain.svg?raw'
import djangoSvg from 'devicon/icons/django/django-plain.svg?raw'
import expressSvg from 'devicon/icons/express/express-original.svg?raw'
import fastapiSvg from 'devicon/icons/fastapi/fastapi-original.svg?raw'
import flutterSvg from 'devicon/icons/flutter/flutter-plain.svg?raw'
import gitSvg from 'devicon/icons/git/git-plain.svg?raw'
import googleSvg from 'devicon/icons/google/google-original.svg?raw'
import googleCloudSvg from 'devicon/icons/googlecloud/googlecloud-original.svg?raw'
import javaSvg from 'devicon/icons/java/java-plain.svg?raw'
import javascriptSvg from 'devicon/icons/javascript/javascript-plain.svg?raw'
import jupyterSvg from 'devicon/icons/jupyter/jupyter-original.svg?raw'
import kerasSvg from 'devicon/icons/keras/keras-original.svg?raw'
import laravelSvg from 'devicon/icons/laravel/laravel-original.svg?raw'
import matplotlibSvg from 'devicon/icons/matplotlib/matplotlib-plain.svg?raw'
import mongodbSvg from 'devicon/icons/mongodb/mongodb-plain.svg?raw'
import nodejsSvg from 'devicon/icons/nodejs/nodejs-plain.svg?raw'
import numpySvg from 'devicon/icons/numpy/numpy-plain.svg?raw'
import opencvSvg from 'devicon/icons/opencv/opencv-original.svg?raw'
import phpSvg from 'devicon/icons/php/php-original.svg?raw'
import pythonSvg from 'devicon/icons/python/python-plain.svg?raw'
import pytorchSvg from 'devicon/icons/pytorch/pytorch-original.svg?raw'
import reactSvg from 'devicon/icons/react/react-original.svg?raw'
import scikitlearnSvg from 'devicon/icons/scikitlearn/scikitlearn-original.svg?raw'
import supabaseSvg from 'devicon/icons/supabase/supabase-plain.svg?raw'
import tailwindSvg from 'devicon/icons/tailwindcss/tailwindcss-original.svg?raw'
import tensorflowSvg from 'devicon/icons/tensorflow/tensorflow-original.svg?raw'
import typescriptSvg from 'devicon/icons/typescript/typescript-plain.svg?raw'
import vscodeSvg from 'devicon/icons/vscode/vscode-plain.svg?raw'

export interface SkillSvgSource {
  body: string
  viewBox: string
}

function applyCurrentColorToShapes(markup: string) {
  return markup.replace(
    /<(path|circle|ellipse|polygon|polyline|rect)([^>]*)>/g,
    (match, tag: string, attrs: string) => {
      if (/\sfill=/.test(attrs) || /\sstyle=/.test(attrs)) return match
      return `<${tag}${attrs} fill="currentColor">`
    },
  )
}

function toInlineSvg(source: string, monochrome = false): SkillSvgSource {
  const viewBox = source.match(/viewBox="([^"]+)"/)?.[1] ?? '0 0 128 128'
  const body = source
    .replace(/^[\s\S]*?<svg[^>]*>/, '')
    .replace(/<\/svg>\s*$/, '')
    .trim()

  return {
    body: monochrome ? applyCurrentColorToShapes(body) : body,
    viewBox,
  }
}

const SKILL_SVG_ICONS = {
  angular: toInlineSvg(angularSvg, true),
  anaconda: toInlineSvg(anacondaSvg),
  css3: toInlineSvg(css3Svg),
  django: toInlineSvg(djangoSvg),
  express: toInlineSvg(expressSvg, true),
  fastapi: toInlineSvg(fastapiSvg),
  flutter: toInlineSvg(flutterSvg),
  git: toInlineSvg(gitSvg),
  google: toInlineSvg(googleSvg),
  googleCloud: toInlineSvg(googleCloudSvg),
  java: toInlineSvg(javaSvg),
  javascript: toInlineSvg(javascriptSvg),
  jupyter: toInlineSvg(jupyterSvg),
  keras: toInlineSvg(kerasSvg),
  laravel: toInlineSvg(laravelSvg),
  matplotlib: toInlineSvg(matplotlibSvg),
  mongodb: toInlineSvg(mongodbSvg),
  nodejs: toInlineSvg(nodejsSvg),
  numpy: toInlineSvg(numpySvg),
  opencv: toInlineSvg(opencvSvg),
  php: toInlineSvg(phpSvg),
  python: toInlineSvg(pythonSvg),
  pytorch: toInlineSvg(pytorchSvg),
  react: toInlineSvg(reactSvg),
  scikitlearn: toInlineSvg(scikitlearnSvg),
  supabase: toInlineSvg(supabaseSvg, true),
  tailwind: toInlineSvg(tailwindSvg),
  tensorflow: toInlineSvg(tensorflowSvg),
  typescript: toInlineSvg(typescriptSvg),
  vscode: toInlineSvg(vscodeSvg, true),
} as const

export type SkillSvgIconName = keyof typeof SKILL_SVG_ICONS

export function getSkillSvgIcon(name: SkillSvgIconName): SkillSvgSource {
  return SKILL_SVG_ICONS[name]
}

const DATA_URI_CACHE = new Map<string, string>()

export function getSkillSvgIconDataUri(name: SkillSvgIconName, color?: string): string {
  const cacheKey = color ? `${name}:${color}` : name
  const cached = DATA_URI_CACHE.get(cacheKey)
  if (cached) return cached

  const source = getSkillSvgIcon(name)
  const body = color ? source.body.replace(/currentColor/g, color) : source.body
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="${source.viewBox}">${body}</svg>`
  const uri = `data:image/svg+xml,${encodeURIComponent(svg)}`

  DATA_URI_CACHE.set(cacheKey, uri)
  return uri
}
