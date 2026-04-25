import { motion, useMotionTemplate, useMotionValue } from 'framer-motion'
import { ArrowUpRight, ExternalLink } from 'lucide-react'
import type { MouseEvent } from 'react'
import { GithubIcon } from './BrandIcons'
import type { Project } from '../lib/resume/types'

interface ProjectCardProps {
  project: Project
  index: number
  githubUrl?: string
}

export function ProjectCard({ project, index, githubUrl }: ProjectCardProps) {
  const mouseX = useMotionValue(0)
  const mouseY = useMotionValue(0)

  const handleMouseMove = (e: MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect()
    mouseX.set(e.clientX - rect.left)
    mouseY.set(e.clientY - rect.top)
  }

  const spotlight = useMotionTemplate`radial-gradient(320px circle at ${mouseX}px ${mouseY}px, rgba(168, 218, 220, 0.18), transparent 70%)`

  return (
    <motion.article
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.2 }}
      transition={{ duration: 0.6, delay: index * 0.08, ease: [0.22, 1, 0.36, 1] }}
      onMouseMove={handleMouseMove}
      className="group relative flex h-full flex-col overflow-hidden rounded-2xl border border-border bg-card p-6 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:border-accent/50 hover:shadow-xl"
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
            whileHover={{ y: -2, scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
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
        {project.bullets.map((bullet) => (
          <li key={bullet} className="flex gap-3 text-sm leading-relaxed text-muted-foreground">
            <span className="mt-2 h-1.5 w-1.5 flex-shrink-0 rounded-full bg-accent" />
            <span>{bullet}</span>
          </li>
        ))}
      </ul>

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
