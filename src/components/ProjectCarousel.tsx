import { AnimatePresence, motion, useInView, useReducedMotion } from 'framer-motion'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import { useEffect, useRef, useState } from 'react'
import { GithubIcon } from './BrandIcons'
import { ProjectCard } from './ProjectCard'
import { usePerfProfile } from '../lib/usePerfProfile'
import type { Project } from '../lib/resume/types'
import { durations, easings, springs } from '../motion'

interface ProjectCarouselProps {
  projects: Project[]
  githubMap: Record<string, string>
  intervalMs?: number
}

const VISIBLE_DESKTOP = 3
const VISIBLE_TABLET = 2
const VISIBLE_MOBILE = 1
const COARSE_INTERVAL_MS = 4200

type VisibleProject = {
  project: Project
  projectIndex: number
}

function getVisibleCount(): number {
  if (typeof window === 'undefined') return VISIBLE_DESKTOP
  if (window.matchMedia('(min-width: 1024px)').matches) return VISIBLE_DESKTOP
  if (window.matchMedia('(min-width: 768px)').matches) return VISIBLE_TABLET
  return VISIBLE_MOBILE
}

function wrapIndex(index: number, total: number): number {
  if (total <= 0) return 0
  return ((index % total) + total) % total
}

function getVisibleProjects(projects: Project[], startIdx: number, count: number): VisibleProject[] {
  const total = projects.length
  if (total === 0) return []

  const slots: VisibleProject[] = []
  for (let offset = 0; offset < count; offset += 1) {
    const projectIndex = wrapIndex(startIdx + offset, total)
    const project = projects[projectIndex]
    if (project) slots.push({ project, projectIndex })
  }
  return slots
}

export function ProjectCarousel({
  projects,
  githubMap,
  intervalMs = 2800,
}: ProjectCarouselProps) {
  const shouldReduceMotion = useReducedMotion()
  const { coarseEffects } = usePerfProfile()
  const rootRef = useRef<HTMLDivElement>(null)
  const inView = useInView(rootRef, { amount: 0.25 })
  const [startIdx, setStartIdx] = useState(0)
  const [visibleCount, setVisibleCount] = useState<number>(VISIBLE_DESKTOP)
  const [paused, setPaused] = useState(false)
  const total = projects.length
  const visibleTotal = Math.min(visibleCount, total)
  const safeStartIdx = wrapIndex(startIdx, total)

  useEffect(() => {
    const update = () => setVisibleCount(getVisibleCount())
    update()
    window.addEventListener('resize', update)
    return () => window.removeEventListener('resize', update)
  }, [])

  useEffect(() => {
    if (total > 0 && startIdx >= total) setStartIdx(0)
  }, [startIdx, total])

  useEffect(() => {
    if (paused || shouldReduceMotion || !inView || total <= visibleCount) return
    const effectiveIntervalMs = coarseEffects ? Math.max(intervalMs, COARSE_INTERVAL_MS) : intervalMs
    const id = window.setInterval(() => {
      setStartIdx((current) => (current + 1) % total)
    }, effectiveIntervalMs)
    return () => window.clearInterval(id)
  }, [paused, shouldReduceMotion, inView, total, visibleCount, intervalMs, coarseEffects])

  if (total === 0) return null

  const activeProject = projects[safeStartIdx] ?? projects[0]
  if (!activeProject) return null

  const visible = getVisibleProjects(projects, safeStartIdx, visibleTotal)

  const repoCount = projects.reduce((count, project) => {
    return githubMap[project.name] ? count + 1 : count
  }, 0)
  const slideTransition = coarseEffects
    ? { duration: durations.fast, ease: easings.cinematic }
    : { duration: durations.medium, ease: easings.cinematic }

  return (
    <section
      ref={rootRef}
      className="relative [contain-intrinsic-size:560px] [content-visibility:auto]"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      onFocusCapture={() => setPaused(true)}
      onBlurCapture={() => setPaused(false)}
      aria-label="Featured project carousel"
    >
      <div className="mb-5 flex flex-col gap-3 border-b border-border pb-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="min-w-0">
          <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-muted-foreground">
            Now highlighting
          </p>
          <p className="mt-1 truncate font-display text-lg font-bold text-foreground">
            {activeProject.name}
          </p>
        </div>

        <div className="flex items-center gap-2">
          <span className="inline-flex items-center gap-2 rounded-md border border-border bg-card/70 px-3 py-2 text-[11px] font-semibold uppercase tracking-[0.14em] text-muted-foreground">
            <GithubIcon className="h-3.5 w-3.5 text-accent" />
            {repoCount} code links
          </span>
          <span className="rounded-md border border-border bg-card/70 px-3 py-2 font-mono text-xs font-bold text-foreground">
            {String(safeStartIdx + 1).padStart(2, '0')} / {String(total).padStart(2, '0')}
          </span>
        </div>
      </div>

      <div
        className={`grid auto-rows-fr items-stretch gap-5 ${
          visibleCount === 3
            ? 'md:grid-cols-2 lg:grid-cols-3'
            : visibleCount === 2
              ? 'md:grid-cols-2'
              : ''
        }`}
      >
        <AnimatePresence mode={coarseEffects ? 'sync' : 'popLayout'} initial={false}>
          {visible.map(({ project, projectIndex }, offset) => (
            <motion.div
              key={project.name}
              layout={!coarseEffects}
              initial={
                shouldReduceMotion
                  ? { opacity: 0 }
                  : coarseEffects
                    ? { opacity: 0, x: 32 }
                    : { opacity: 0, x: 64, scale: 0.98 }
              }
              animate={
                shouldReduceMotion
                  ? { opacity: 1 }
                  : coarseEffects
                    ? { opacity: 1, x: 0 }
                    : { opacity: 1, x: 0, scale: 1 }
              }
              exit={
                shouldReduceMotion
                  ? { opacity: 0 }
                  : coarseEffects
                    ? { opacity: 0, x: -32 }
                    : { opacity: 0, x: -64, scale: 0.98 }
              }
              transition={shouldReduceMotion ? { duration: 0.18 } : slideTransition}
              className="flex h-full min-h-[22rem]"
            >
              <ProjectCard
                coarseEffects={coarseEffects}
                project={project}
                index={projectIndex}
                githubUrl={githubMap[project.name]}
                disableReveal
                bulletLimit={2}
                stackLimit={4}
                descriptionMode="summary"
                variant={offset === 0 ? 'featured' : 'compact'}
              />
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      {total > visibleCount ? (
        <div className="mt-6 flex items-center justify-between gap-4">
          <motion.button
            type="button"
            onClick={() => setStartIdx((current) => (current - 1 + total) % total)}
            aria-label="Previous projects"
            whileHover={{ x: coarseEffects ? -1 : -2, transition: springs.hover }}
            whileTap={{ scale: 0.94, transition: springs.tap }}
            className="inline-flex h-10 w-10 items-center justify-center rounded-md border border-border bg-card/80 text-muted-foreground transition-colors hover:border-accent/60 hover:text-accent"
          >
            <ChevronLeft className="h-4 w-4" />
          </motion.button>

          <div className="flex flex-1 items-center gap-2" role="tablist" aria-label="Project slides">
            {projects.map((project, index) => {
              const active = index === safeStartIdx
              return (
                <button
                  key={project.name}
                  type="button"
                  role="tab"
                  aria-selected={active}
                  aria-label={`Show ${project.name}`}
                  onClick={() => setStartIdx(index)}
                  className={`h-1.5 rounded-full transition-[width,background-color] duration-200 ${
                    active ? 'w-10 shrink-0 bg-accent' : 'flex-1 bg-border hover:bg-accent/40'
                  }`}
                />
              )
            })}
          </div>

          <motion.button
            type="button"
            onClick={() => setStartIdx((current) => (current + 1) % total)}
            aria-label="Next projects"
            whileHover={{ x: coarseEffects ? 1 : 2, transition: springs.hover }}
            whileTap={{ scale: 0.94, transition: springs.tap }}
            className="inline-flex h-10 w-10 items-center justify-center rounded-md border border-border bg-card/80 text-muted-foreground transition-colors hover:border-accent/60 hover:text-accent"
          >
            <ChevronRight className="h-4 w-4" />
          </motion.button>
        </div>
      ) : null}
    </section>
  )
}
