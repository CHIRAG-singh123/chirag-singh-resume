// Generates responsive AVIF / WebP / PNG variants of the hero portrait
// once at build/dev time. Run with `npm run images`.
//
// Source : public/Image/Profile.png (5 MB PNG)
// Output : public/Image/Profile-{320,640,960}.{avif,webp,png}
//
// Each variant is square (the avatar circle clips it). 320 px covers
// mobile, 640 px covers retina mobile / desktop, 960 px covers HiDPI.

import { mkdir, stat } from 'node:fs/promises'
import { dirname, join, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'

import sharp from 'sharp'

const __dirname = dirname(fileURLToPath(import.meta.url))
const ROOT = resolve(__dirname, '..')
const SRC = join(ROOT, 'public/Image/Profile.png')
const OUT_DIR = join(ROOT, 'public/Image')

const WIDTHS = [320, 640, 960]
const FORMATS = [
  { ext: 'avif', encoder: (img) => img.avif({ quality: 55, effort: 4 }) },
  { ext: 'webp', encoder: (img) => img.webp({ quality: 78 }) },
  { ext: 'png', encoder: (img) => img.png({ compressionLevel: 9, palette: false }) },
]

async function ensureSrc() {
  try {
    await stat(SRC)
  } catch {
    throw new Error(`Source image not found: ${SRC}`)
  }
}

async function main() {
  await ensureSrc()
  await mkdir(OUT_DIR, { recursive: true })

  const tasks = []
  for (const width of WIDTHS) {
    for (const { ext, encoder } of FORMATS) {
      const outPath = join(OUT_DIR, `Profile-${width}.${ext}`)
      const pipeline = sharp(SRC).resize(width, width, { fit: 'cover' })
      tasks.push(
        encoder(pipeline)
          .toFile(outPath)
          .then((info) =>
            console.log(
              `  ${ext.padEnd(4)} ${String(width).padStart(3)}px → ${(info.size / 1024).toFixed(1)} KB`,
            ),
          ),
      )
    }
  }

  console.log('Generating responsive hero portrait variants…')
  await Promise.all(tasks)
  console.log('Done.')
}

main().catch((err) => {
  console.error(err)
  process.exit(1)
})
