import { AnimatePresence, motion, useMotionTemplate, useMotionValue } from 'framer-motion'
import { ArrowUpRight, ChevronDown, ExternalLink } from 'lucide-react'
import { useEffect, useState, type MouseEvent } from 'react'
import { GithubIcon } from './BrandIcons'
import type { Project } from '../lib/resume/types'
import {
  cinematicTransition,
  durations,
  easings,
  sectionVariants,
  springs,
  viewport,
} from '../motion'

const COLLAPSED_BULLETS = 2

interface ProjectCardProps {
  project: Project
  index: number
  githubUrl?: string
  disableReveal?: boolean
  onExpandChange?: (expanded: boolean) => void
}

export function ProjectCard({
  project,
  index,
  githubUrl,
  disableReveal = false,
  onExpandChange,
}: ProjectCardProps) {
  const mouseX = useMotionValue(0)
  const mouseY = useMotionValue(0)

  const [expanded, setExpanded] = useState(false)
  const hasMoreBullets = project.bullets.length > COLLAPSED_BULLETS
  const visibleBullets = project.bullets.slice(0, COLLAPSED_BULLETS)
  const hiddenBullets = project.bullets.slice(COLLAPSED_BULLETS)

  useEffect(() => {
    onExpandChange?.(expanded)
  }, [expanded, onExpandChange])

  useEffect(() => {
    return () => {
      onExpandChange?.(false)
    }
  }, [onExpandChange])

  const handleMouseMove = (e: MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect()
    mouseX.set(e.clientX - rect.left)
    mouseY.set(e.clientY - rect.top)
  }

  const spotlight = useMotionTemplate`radial-gradient(320px circle at ${mouseX}px ${mouseY}px, rgba(168, 218, 220, 0.18), transparent 70%)`

  return (
    <motion.article
      variants={disableReveal ? undefined : sectionVariants}
      initial={disableReveal ? false : 'hidden'}
      whileInView={disableReveal ? undefined : 'show'}
      viewport={disableReveal ? undefined : { once: viewport.once, amount: 0.2 }}
      transition={disableReveal ? undefined : cinematicTransition(durations.medium, index * 0.08)}
      whileHover={{ y: -6, transition: springs.hover }}
      onMouseMove={handleMouseMove}
      className="group relative flex h-full w-full flex-col overflow-hidden rounded-2xl border border-border bg-card p-6 shadow-sm transition-[border-color,box-shadow] duration-300 hover:border-accent/50 hover:shadow-xl"
    >
      <motion.div
        className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-300 group-hover:opacity-100"
        style={{ background: spotlight }}
      />

      <div className="relative flex items-start justify-between gap-4">
        <div>
          <h3 className="font-display text-xl font-bold tracking-tight text-foreground sm:text-2xl">
            {project.name}
          </h3>
          <p className="mt-1 text-sm font-medium text-muted-foreground">{project.tagline}</p>
        </div>
        {githubUrl ? (
          <motion.a
            href={githubUrl}
            target="_blank"
            rel="noopener noreferrer"
            aria-label={`Open ${project.name} on GitHub`}
            whileHover={{ y: -2, scale: 1.04, transition: springs.hover }}
            whileTap={{ scale: 0.96, transition: springs.tap }}
            className="group/link inline-flex items-center gap-2 rounded-full border border-border bg-card/70 px-3 py-1.5 text-xs font-medium text-foreground transition-colors hover:border-accent hover:text-accent"
          >
            <GithubIcon className="h-4 w-4" />
            GitHub
            <ExternalLink className="h-3.5 w-3.5 transition-transform group-hover/link:-translate-y-0.5 group-hover/link:translate-x-0.5" />
          </motion.a>
        ) : (
          <span className="flex h-10 w-10 items-center justify-center rounded-full border border-border bg-background transition-all duration-300 group-hover:border-accent group-hover:bg-accent group-hover:text-accent-foreground">
            <ArrowUpRight className="h-4 w-4 transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
          </span>
        )}
      </div>

      <ul className="relative mt-5 space-y-3">
        {visibleBullets.map((bullet) => (
          <li key={bullet} className="flex gap-3 text-sm leading-relaxed text-muted-foreground">
            <span className="mt-2 h-1.5 w-1.5 flex-shrink-0 rounded-full bg-accent" />
            <span>{bullet}</span>
          </li>
        ))}

        <AnimatePresence initial={false}>
          {expanded &&
            hiddenBullets.map((bullet) => (
              <motion.li
                key={bullet}
                initial={{ opacity: 0, height: 0, y: -6 }}
                animate={{ opacity: 1, height: 'auto', y: 0 }}
                exit={{ opacity: 0, height: 0, y: -6 }}
                transition={{ duration: durations.fast, ease: easings.cinematic }}
                className="flex gap-3 overflow-hidden text-sm leading-relaxed text-muted-foreground"
              >
                <span className="mt-2 h-1.5 w-1.5 flex-shrink-0 rounded-full bg-accent" />
                <span>{bullet}</span>
              </motion.li>
            ))}
        </AnimatePresence>
      </ul>

      {hasMoreBullets && (
        <motion.button
          type="button"
          onClick={() => setExpanded((v) => !v)}
          aria-expanded={expanded}
          aria-controls={`project-${project.name}-details`}
          whileHover={{ x: 2, transition: springs.hover }}
          whileTap={{ scale: 0.96, transition: springs.tap }}
          className="relative mt-3 inline-flex items-center gap-1.5 self-start rounded-full text-xs font-semibold uppercase tracking-wider text-accent transition-colors hover:text-accent/80"
        >
          {expanded ? 'Read less' : 'Read more'}
          <motion.span
            animate={{ rotate: expanded ? 180 : 0 }}
            transition={{ duration: durations.fast, ease: easings.cinematic }}
            className="inline-flex"
          >
            <ChevronDown className="h-3.5 w-3.5" />
          </motion.span>
        </motion.button>
      )}

      <div className="relative mt-auto flex flex-wrap gap-2 pt-6">
        {project.stack.map((tech) => (
          <span
            key={tech}
            className="inline-flex items-center rounded-full border border-border bg-background/60 px-2.5 py-1 text-[11px] font-medium uppercase tracking-wide text-muted-foreground"
          >
            {tech}
          </span>
        ))}
      </div>
    </motion.article>
  )
}
