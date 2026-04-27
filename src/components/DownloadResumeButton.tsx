import { motion } from 'framer-motion'
import { Download } from 'lucide-react'
import { CONTACT_LINKS, resume } from '../data/resume'
import { springs } from '../motion'

interface DownloadResumeButtonProps {
  variant?: 'primary' | 'ghost'
  size?: 'md' | 'lg'
  label?: string
}

export function DownloadResumeButton({
  variant = 'primary',
  size = 'md',
  label = 'Download Resume',
}: DownloadResumeButtonProps) {
  const downloadFilename = `${resume.personal.name.replace(/\s+/g, '_')}_Resume.pdf`

  const base =
    'group relative inline-flex items-center gap-2 overflow-hidden rounded-full font-semibold transition-all focus:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2'
  const sizing = size === 'lg' ? 'px-7 py-3.5 text-base' : 'px-5 py-2.5 text-sm'

  if (variant === 'ghost') {
    return (
      <motion.a
        whileHover={{ y: -3, scale: 1.02, transition: springs.hover }}
        whileTap={{ scale: 0.97, transition: springs.tap }}
        href={CONTACT_LINKS.resumeHref}
        download={downloadFilename}
        className={`${base} ${sizing} border border-border bg-card/70 text-foreground backdrop-blur hover:border-accent/50 hover:bg-accent/10`}
      >
        <Download className="h-4 w-4 transition-transform group-hover:-translate-y-0.5" />
        {label}
      </motion.a>
    )
  }

  return (
    <motion.a
      whileHover={{ y: -3, scale: 1.03, transition: springs.hover }}
      whileTap={{ scale: 0.97, transition: springs.tap }}
      href={CONTACT_LINKS.resumeHref}
      download={downloadFilename}
      className={`${base} ${sizing} bg-hero-gradient bg-[length:200%_200%] text-white shadow-glow animate-gradient-shift`}
    >
      <span className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/30 to-transparent transition-transform duration-700 ease-out group-hover:translate-x-full" />
      <Download className="relative h-4 w-4 transition-transform group-hover:-translate-y-0.5" />
      <span className="relative">{label}</span>
    </motion.a>
  )
}
