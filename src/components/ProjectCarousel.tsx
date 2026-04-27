import { AnimatePresence, motion, useReducedMotion } from 'framer-motion'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import { useCallback, useEffect, useRef, useState } from 'react'
import { ProjectCard } from './ProjectCard'
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

function getVisibleCount(): number {
  if (typeof window === 'undefined') return VISIBLE_DESKTOP
  if (window.matchMedia('(min-width: 1024px)').matches) return VISIBLE_DESKTOP
  if (window.matchMedia('(min-width: 768px)').matches) return VISIBLE_TABLET
  return VISIBLE_MOBILE
}

export function ProjectCarousel({
  projects,
  githubMap,
  intervalMs = 2500,
}: ProjectCarouselProps) {
  const shouldReduceMotion = useReducedMotion()
  const [startIdx, setStartIdx] = useState(0)
  const [visibleCount, setVisibleCount] = useState<number>(VISIBLE_DESKTOP)
  const [paused, setPaused] = useState(false)
  const expandedSet = useRef<Set<string>>(new Set())
  const [hasExpanded, setHasExpanded] = useState(false)

  const total = projects.length

  useEffect(() => {
    const update = () => setVisibleCount(getVisibleCount())
    update()
    window.addEventListener('resize', update)
    return () => window.removeEventListener('resize', update)
  }, [])

  useEffect(() => {
    if (paused || hasExpanded || shouldReduceMotion || total <= visibleCount) return
    const id = window.setInterval(() => {
      setStartIdx((s) => (s + 1) % total)
    }, intervalMs)
    return () => window.clearInterval(id)
  }, [paused, hasExpanded, shouldReduceMotion, total, visibleCount, intervalMs])

  const handleExpandChange = useCallback((projectName: string, expanded: boolean) => {
    if (expanded) {
      expandedSet.current.add(projectName)
    } else {
      expandedSet.current.delete(projectName)
    }
    setHasExpanded(expandedSet.current.size > 0)
  }, [])

  const visible = Array.from({ length: Math.min(visibleCount, total) }, (_, i) => {
    return projects[(startIdx + i) % total]
  })

  const slideTransition = {
    layout: { duration: durations.medium, ease: easings.cinematic },
    duration: durations.medium,
    ease: easings.cinematic,
  } as const

  return (
    <div
      className="relative"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      onFocusCapture={() => setPaused(true)}
      onBlurCapture={() => setPaused(false)}
    >
      <div
        className={`grid auto-rows-fr items-stretch gap-6 ${
          visibleCount === 3
            ? 'md:grid-cols-2 lg:grid-cols-3'
            : visibleCount === 2
              ? 'md:grid-cols-2'
              : ''
        }`}
      >
        <AnimatePresence mode="popLayout" initial={false}>
          {visible.map((project) => (
            <motion.div
              key={project.name}
              layout
              initial={
                shouldReduceMotion
                  ? { opacity: 0 }
                  : { opacity: 0, x: 96, filter: 'blur(10px)', scale: 0.96 }
              }
              animate={
                shouldReduceMotion
                  ? { opacity: 1 }
                  : { opacity: 1, x: 0, filter: 'blur(0px)', scale: 1 }
              }
              exit={
                shouldReduceMotion
                  ? { opacity: 0 }
                  : { opacity: 0, x: -96, filter: 'blur(10px)', scale: 0.96 }
              }
              transition={shouldReduceMotion ? { duration: 0.18 } : slideTransition}
              className="flex h-full min-h-[26rem]"
            >
              <ProjectCard
                project={project}
                index={0}
                githubUrl={githubMap[project.name]}
                disableReveal
                onExpandChange={(exp) => handleExpandChange(project.name, exp)}
              />
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      {total > visibleCount && (
        <div className="mt-8 flex items-center justify-center gap-6">
          <motion.button
            type="button"
            onClick={() => setStartIdx((s) => (s - 1 + total) % total)}
            aria-label="Previous projects"
            whileHover={{ scale: 1.1, x: -2, transition: springs.hover }}
            whileTap={{ scale: 0.9, transition: springs.tap }}
            className="inline-flex h-8 w-8 items-center justify-center rounded-full border border-border bg-card/70 text-muted-foreground backdrop-blur transition-colors hover:border-accent hover:text-accent"
          >
            <ChevronLeft className="h-4 w-4" />
          </motion.button>

          <div className="flex items-center gap-2" role="tablist" aria-label="Project carousel">
            {Array.from({ length: total }).map((_, i) => {
              const isActive = i === startIdx
              const projectAtIdx = projects[i]
              return (
                <motion.button
                  key={projectAtIdx?.name ?? i}
                  type="button"
                  role="tab"
                  aria-selected={isActive}
                  aria-label={`Show ${projectAtIdx?.name ?? `slide ${i + 1}`}`}
                  onClick={() => setStartIdx(i)}
                  whileHover={{ scale: 1.15, transition: springs.hover }}
                  whileTap={{ scale: 0.9, transition: springs.tap }}
                  className={`h-1.5 rounded-full transition-[width,background-color] duration-300 ${
                    isActive
                      ? 'w-8 bg-accent shadow-glow'
                      : 'w-2.5 bg-border hover:bg-accent/50'
                  }`}
                />
              )
            })}
          </div>

          <motion.button
            type="button"
            onClick={() => setStartIdx((s) => (s + 1) % total)}
            aria-label="Next projects"
            whileHover={{ scale: 1.1, x: 2, transition: springs.hover }}
            whileTap={{ scale: 0.9, transition: springs.tap }}
            className="inline-flex h-8 w-8 items-center justify-center rounded-full border border-border bg-card/70 text-muted-foreground backdrop-blur transition-colors hover:border-accent hover:text-accent"
          >
            <ChevronRight className="h-4 w-4" />
          </motion.button>
        </div>
      )}
    </div>
  )
}
