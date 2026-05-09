/** Relative luminance of sRGB hex (no #), WCAG-ish. Range ~0=black ... 1=white. */

function channelToLin(c255: number) {
  const c = c255 / 255
  return c <= 0.03928 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4
}

export function siFillRelativeLuminance(hexSansHash: string): number {
  const h = hexSansHash.trim().replace(/^#/, '')
  if (h.length !== 6 || !/^[0-9a-fA-F]{6}$/.test(h)) return 0
  const n = parseInt(h, 16)
  const r = (n >> 16) & 255
  const g = (n >> 8) & 255
  const b = n & 255
  const R = channelToLin(r)
  const G = channelToLin(g)
  const B = channelToLin(b)
  return 0.2126 * R + 0.7152 * G + 0.0722 * B
}

/** Mono SI marks this dark disappear on dark discs — add neutral light pad underneath. */
export function siGlyphNeedsLightBackdrop(luminance: number) {
  return luminance < 0.265
}
