import { motion } from 'framer-motion'
import { ArrowUpRight, ExternalLink, Layers3 } from 'lucide-react'
import { Link } from 'react-router-dom'
import { GithubIcon } from './BrandIcons'
import { ProjectStackChip } from './ProjectStackChip'
import { projectSlug } from '../data/resume'
import { prefetchRoute } from '../lib/routes/prefetch'
import type { Project } from '../lib/resume/types'
import {
  cinematicTransition,
  durations,
  sectionVariants,
  springs,
  viewport,
} from '../motion'

const DEFAULT_BULLET_LIMIT = 2
const DEFAULT_STACK_LIMIT = 4

interface ProjectCardProps {
  coarseEffects: boolean
  project: Project
  index: number
  githubUrl?: string
  disableReveal?: boolean
  bulletLimit?: number
  stackLimit?: number
  descriptionMode?: 'bullets' | 'summary'
  variant?: 'default' | 'featured' | 'compact'
}

export function ProjectCard({
  coarseEffects,
  project,
  index,
  githubUrl,
  disableReveal = false,
  bulletLimit = DEFAULT_BULLET_LIMIT,
  stackLimit = DEFAULT_STACK_LIMIT,
  descriptionMode = 'bullets',
  variant = 'default',
}: ProjectCardProps) {
  const projectPath = `/projects/${projectSlug(project.name)}`
  const visibleBullets = project.bullets.slice(0, bulletLimit)
  const visibleStack = project.stack.slice(0, stackLimit)
  const hiddenStackCount = project.stack.length - visibleStack.length
  const summaryText = visibleBullets.join(' ')
  const isFeatured = variant === 'featured'
  const isCompact = variant === 'compact'
  const primaryStack = project.stack[0] ?? 'Project'
  const secondaryStack = project.stack[1] ?? project.tagline

  return (
    <motion.article
      variants={disableReveal ? undefined : sectionVariants}
      initial={disableReveal ? false : 'hidden'}
      whileInView={disableReveal ? undefined : 'show'}
      viewport={disableReveal ? undefined : { once: viewport.once, amount: 0.2 }}
      transition={disableReveal ? undefined : cinematicTransition(durations.medium, index * 0.05)}
      whileHover={
        coarseEffects
          ? { y: -2, transition: springs.hover }
          : { y: -5, transition: springs.hover }
      }
      className={`group relative isolate flex h-full min-w-0 flex-col overflow-hidden rounded-lg border border-border bg-card shadow-sm transition-[transform,border-color,box-shadow] duration-300 hover:border-accent/55 ${
        coarseEffects ? 'hover:shadow-md' : 'hover:shadow-lg'
      } ${isFeatured ? 'p-6 sm:p-7' : isCompact ? 'p-5' : 'p-6'}`}
    >
      <div
        className="pointer-events-none absolute inset-y-0 left-0 w-1 bg-hero-gradient opacity-90"
        aria-hidden
      />
      <div
        className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-accent/70 via-accent-secondary/45 to-transparent"
        aria-hidden
      />

      <div className="relative flex items-start justify-between gap-4">
        <div className="min-w-0">
          <div className="flex flex-wrap items-center gap-2">
            <span className="inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-md border border-border bg-background/70 font-mono text-xs font-bold text-accent">
              {String(index + 1).padStart(2, '0')}
            </span>
            <span className="inline-flex items-center gap-1.5 rounded-md border border-border bg-background/60 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[0.16em] text-muted-foreground">
              <Layers3 className="h-3 w-3 text-accent" />
              {primaryStack}
            </span>
          </div>

          <h3
            className={`mt-4 font-display font-bold leading-tight text-foreground ${
              isFeatured ? 'text-2xl sm:text-3xl' : 'text-xl sm:text-2xl'
            }`}
          >
            <Link
              to={projectPath}
              onMouseEnter={() => prefetchRoute(projectPath)}
              onFocus={() => prefetchRoute(projectPath)}
              className="rounded-sm transition-colors hover:text-accent focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
            >
              {project.name}
            </Link>
          </h3>

          <p className="mt-2 text-sm font-semibold uppercase tracking-[0.16em] text-muted-foreground">
            {project.tagline}
          </p>
        </div>

        {githubUrl ? (
          <motion.a
            href={githubUrl}
            target="_blank"
            rel="noopener noreferrer"
            aria-label={`Open ${project.name} on GitHub`}
            whileHover={
              coarseEffects
                ? { y: -1, transition: springs.hover }
                : { y: -2, scale: 1.03, transition: springs.hover }
            }
            whileTap={{ scale: 0.96, transition: springs.tap }}
            className="inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-md border border-border bg-background/70 text-foreground transition-colors hover:border-accent/60 hover:text-accent"
          >
            <GithubIcon className="h-4 w-4" />
          </motion.a>
        ) : null}
      </div>

      {descriptionMode === 'summary' ? (
        <div className="relative mt-5">
          <p className="line-clamp-2 text-sm leading-relaxed text-muted-foreground">
            {summaryText}
          </p>
          <Link
            to={projectPath}
            onMouseEnter={() => prefetchRoute(projectPath)}
            onFocus={() => prefetchRoute(projectPath)}
            className="mt-2 inline-flex text-xs font-semibold text-accent transition-colors hover:text-accent-secondary"
          >
            Read more
          </Link>
        </div>
      ) : (
        <div className="relative mt-5 grid gap-3">
          {visibleBullets.map((bullet) => (
            <p
              key={bullet}
              className="grid grid-cols-[0.75rem_1fr] gap-3 text-sm leading-relaxed text-muted-foreground"
            >
              <span className="mt-2 h-1.5 w-1.5 rounded-full bg-accent" aria-hidden />
              <span>{bullet}</span>
            </p>
          ))}
        </div>
      )}

      <div className="relative mt-6 flex flex-wrap gap-2">
        {visibleStack.map((tech, stackIndex) => (
          <ProjectStackChip
            key={tech}
            label={tech}
            tone={stackIndex === 0 && isFeatured ? 'accent' : isCompact ? 'compact' : 'default'}
          />
        ))}
        {hiddenStackCount > 0 ? (
          <span className="inline-flex items-center rounded-md border border-dashed border-border bg-background/40 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[0.14em] text-muted-foreground">
            +{hiddenStackCount} more
          </span>
        ) : null}
      </div>

      <div className="relative mt-auto pt-6">
        <div className="mb-4 flex items-center justify-between border-t border-border pt-4 text-[10px] font-semibold uppercase tracking-[0.16em] text-muted-foreground">
          <span>{secondaryStack}</span>
          <span>{project.bullets.length} highlights</span>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <Link
            to={projectPath}
            onMouseEnter={() => prefetchRoute(projectPath)}
            onFocus={() => prefetchRoute(projectPath)}
            className="inline-flex items-center gap-2 rounded-md bg-foreground px-3.5 py-2 text-sm font-semibold text-background transition-transform duration-200 hover:-translate-y-0.5"
          >
            Details
            <ArrowUpRight className="h-4 w-4" />
          </Link>

          {githubUrl ? (
            <a
              href={githubUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 rounded-md border border-border bg-background/60 px-3.5 py-2 text-sm font-semibold text-foreground transition-colors hover:border-accent/60 hover:text-accent"
            >
              <GithubIcon className="h-4 w-4" />
              GitHub
              <ExternalLink className="h-3.5 w-3.5" />
            </a>
          ) : null}
        </div>
      </div>
    </motion.article>
  )
}
