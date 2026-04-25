const KNOWN_SECTIONS = [
  'SUMMARY',
  'TECHNICAL SKILLS',
  'PROJECTS',
  'EXPERIENCE',
  'KEY ACHIEVEMENTS',
  'CERTIFICATES',
  'EDUCATION',
] as const

export type RawSectionName = (typeof KNOWN_SECTIONS)[number]
export type RawSections = Partial<Record<RawSectionName, string>>

export function splitResumeTextBySection(raw: string): RawSections {
  const lines = raw.split(/\r?\n/)
  const sections: RawSections = {}
  let current: RawSectionName | null = null
  let buffer: string[] = []

  const flush = () => {
    if (current) {
      sections[current] = (sections[current] ?? '') + buffer.join('\n').trim()
    }
    buffer = []
  }

  for (const line of lines) {
    const trimmed = line.trim()
    const matchedHeading = KNOWN_SECTIONS.find((h) => h === trimmed)
    if (matchedHeading) {
      flush()
      current = matchedHeading
      continue
    }
    if (current) buffer.push(line)
  }
  flush()
  return sections
}
