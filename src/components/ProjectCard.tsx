import { motion } from 'framer-motion'
import { ArrowUpRight, ExternalLink } from 'lucide-react'
import { Link } from 'react-router-dom'
import { GithubIcon } from './BrandIcons'
import { ProjectStackChip } from './ProjectStackChip'
import { projectSlug } from '../data/resume'
import { prefetchRoute } from '../lib/routes/prefetch'
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
const DEFAULT_STACK_LIMIT = 4

interface ProjectCardProps {
  coarseEffects: boolean
  project: Project
  index: number
  githubUrl?: string
  disableReveal?: boolean
  bulletLimit?: number
  stackLimit?: number
  variant?: 'default' | 'featured' | 'compact'
}

export function ProjectCard({
  coarseEffects,
  project,
  index,
  githubUrl,
  disableReveal = false,
  bulletLimit = COLLAPSED_BULLETS,
  stackLimit = DEFAULT_STACK_LIMIT,
  variant = 'default',
}: ProjectCardProps) {
  const lightEffects = coarseEffects
  const projectPath = `/projects/${projectSlug(project.name)}`
  const visibleBullets = project.bullets.slice(0, bulletLimit)
  const visibleStack = project.stack.slice(0, stackLimit)
  const isFeatured = variant === 'featured'
  const isCompact = variant === 'compact'

  return (
    <motion.article
      variants={disableReveal ? undefined : sectionVariants}
      initial={disableReveal ? false : 'hidden'}
      whileInView={disableReveal ? undefined : 'show'}
      viewport={disableReveal ? undefined : { once: viewport.once, amount: 0.2 }}
      transition={disableReveal ? undefined : cinematicTransition(durations.medium, index * 0.06)}
      whileHover={{
        y: lightEffects ? -3 : -6,
        transition: springs.hover,
      }}
      className={`group relative flex h-full w-full flex-col overflow-hidden border border-border bg-card shadow-sm transition-[transform,border-color,box-shadow] duration-300 hover:border-accent/45 ${
        isFeatured
          ? 'rounded-[1.75rem] p-6 sm:p-7'
          : isCompact
            ? 'rounded-[1.6rem] p-5'
            : 'rounded-2xl p-6'
      } ${lightEffects ? 'hover:shadow-lg' : 'hover:shadow-xl'}`}
    >
      <div
        className={`pointer-events-none absolute inset-x-0 top-0 h-1 ${
          isFeatured
            ? 'bg-hero-gradient opacity-100'
            : 'bg-gradient-to-r from-accent via-accent-secondary to-chart-tertiary opacity-80'
        }`}
        aria-hidden="true"
      />

      <div
        className={`pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-300 group-hover:opacity-100 ${
          lightEffects
            ? 'bg-[radial-gradient(circle_at_top,rgba(168,218,220,0.08),transparent_68%)]'
            : 'bg-[radial-gradient(circle_at_top,rgba(168,218,220,0.14),transparent_70%)]'
        }`}
      />

      <div className="relative flex items-start justify-between gap-4">
        <div className="min-w-0">
          <span className="inline-flex items-center gap-2 text-[11px] font-semibold uppercase tracking-[0.22em] text-muted-foreground">
            <span className="text-accent">{String(index + 1).padStart(2, '0')}</span>
            <span>{project.stack.slice(0, 2).join(' / ')}</span>
          </span>

          <h3
            className={`mt-3 font-display font-bold tracking-tight text-foreground ${
              isFeatured ? 'text-2xl sm:text-[2rem]' : 'text-xl sm:text-2xl'
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

          <p
            className={`mt-2 max-w-2xl text-muted-foreground ${
              isFeatured ? 'text-sm sm:text-base' : 'text-sm'
            }`}
          >
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
              lightEffects
                ? { y: -1, transition: springs.hover }
                : { y: -2, scale: 1.03, transition: springs.hover }
            }
            whileTap={{ scale: 0.96, transition: springs.tap }}
            className="inline-flex shrink-0 items-center gap-2 rounded-full border border-border bg-card/80 px-3 py-1.5 text-xs font-semibold uppercase tracking-[0.18em] text-foreground transition-colors hover:border-accent hover:text-accent"
          >
            <GithubIcon className="h-4 w-4" />
            GitHub
            <ExternalLink className="h-3.5 w-3.5" />
          </motion.a>
        ) : null}
      </div>

      <ul
        className={`relative mt-5 space-y-3 ${
          isFeatured ? 'max-w-2xl' : ''
        }`}
      >
        {visibleBullets.map((bullet) => (
          <li key={bullet} className="flex gap-3 text-sm leading-relaxed text-muted-foreground">
            <span className="mt-2 h-1.5 w-1.5 flex-shrink-0 rounded-full bg-accent" />
            <span>{bullet}</span>
          </li>
        ))}
      </ul>

      <div className="relative mt-5 flex flex-wrap gap-2">
        {visibleStack.map((tech) => (
          <ProjectStackChip key={tech} label={tech} />
        ))}
        {project.stack.length > visibleStack.length ? (
          <span className="inline-flex items-center rounded-full border border-dashed border-border px-3 py-1.5 text-[11px] font-semibold uppercase tracking-[0.18em] text-muted-foreground">
            +{project.stack.length - visibleStack.length} more
          </span>
        ) : null}
      </div>

      <div className="relative mt-auto flex flex-wrap items-center gap-3 pt-6">
        <Link
          to={projectPath}
          onMouseEnter={() => prefetchRoute(projectPath)}
          onFocus={() => prefetchRoute(projectPath)}
          className="inline-flex items-center gap-2 rounded-full bg-foreground px-4 py-2 text-sm font-semibold text-background transition-transform duration-300 hover:-translate-y-0.5"
        >
          Details
          <ArrowUpRight className="h-4 w-4" />
        </Link>

        {githubUrl ? (
          <a
            href={githubUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 rounded-full border border-border bg-card/80 px-4 py-2 text-sm font-semibold text-foreground transition-colors hover:border-accent/60 hover:bg-accent/10"
          >
            <GithubIcon className="h-4 w-4" />
            Open GitHub
          </a>
        ) : null}
      </div>
    </motion.article>
  )
}
