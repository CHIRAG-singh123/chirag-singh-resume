import { AnimatePresence, motion, useInView, useReducedMotion } from 'framer-motion'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import { useEffect, useRef, useState } from 'react'
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
const COARSE_INTERVAL_MS = 3600

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
  const { coarseEffects } = usePerfProfile()
  const rootRef = useRef<HTMLDivElement>(null)
  const inView = useInView(rootRef, { amount: 0.25 })
  const [startIdx, setStartIdx] = useState(0)
  const [visibleCount, setVisibleCount] = useState<number>(VISIBLE_DESKTOP)
  const [paused, setPaused] = useState(false)

  const total = projects.length

  useEffect(() => {
    const update = () => setVisibleCount(getVisibleCount())
    update()
    window.addEventListener('resize', update)
    return () => window.removeEventListener('resize', update)
  }, [])

  useEffect(() => {
    if (paused || shouldReduceMotion || !inView || total <= visibleCount) return
    const effectiveIntervalMs = coarseEffects ? Math.max(intervalMs, COARSE_INTERVAL_MS) : intervalMs
    const id = window.setInterval(() => {
      setStartIdx((s) => (s + 1) % total)
    }, effectiveIntervalMs)
    return () => window.clearInterval(id)
  }, [paused, shouldReduceMotion, inView, total, visibleCount, intervalMs, coarseEffects])

  const visible = Array.from({ length: Math.min(visibleCount, total) }, (_, i) => {
    return projects[(startIdx + i) % total]
  })

  const slideTransition = coarseEffects
    ? {
        duration: durations.fast,
        ease: easings.cinematic,
      }
    : {
        layout: { duration: durations.medium, ease: easings.cinematic },
        duration: durations.medium,
        ease: easings.cinematic,
      }

  return (
    <div
      ref={rootRef}
      className="relative"
      style={{ contentVisibility: 'auto', containIntrinsicSize: '560px' }}
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
        <AnimatePresence mode={coarseEffects ? 'sync' : 'popLayout'} initial={false}>
          {visible.map((project) => (
            <motion.div
              key={project.name}
              layout={!coarseEffects}
              initial={
                shouldReduceMotion
                  ? { opacity: 0 }
                  : coarseEffects
                    ? { opacity: 0, x: 48 }
                    : { opacity: 0, x: 96, scale: 0.96 }
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
                    ? { opacity: 0, x: -48 }
                    : { opacity: 0, x: -96, scale: 0.96 }
              }
              transition={shouldReduceMotion ? { duration: 0.18 } : slideTransition}
              className="flex h-full min-h-[26rem]"
            >
              <ProjectCard
                coarseEffects={coarseEffects}
                project={project}
                index={0}
                githubUrl={githubMap[project.name]}
                disableReveal
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
            whileHover={
              coarseEffects
                ? { scale: 1.04, x: -1, transition: springs.hover }
                : { scale: 1.1, x: -2, transition: springs.hover }
            }
            whileTap={{ scale: 0.9, transition: springs.tap }}
            className={`inline-flex h-8 w-8 items-center justify-center rounded-full border border-border bg-card/70 text-muted-foreground transition-colors hover:border-accent hover:text-accent ${
              coarseEffects ? '' : 'backdrop-blur'
            }`}
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
                  whileHover={{
                    scale: coarseEffects ? 1.08 : 1.15,
                    transition: springs.hover,
                  }}
                  whileTap={{ scale: 0.9, transition: springs.tap }}
                  className={`h-1.5 rounded-full transition-[width,background-color] duration-300 ${
                    isActive
                      ? coarseEffects
                        ? 'w-8 bg-accent shadow-sm'
                        : 'w-8 bg-accent shadow-glow'
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
            whileHover={
              coarseEffects
                ? { scale: 1.04, x: 1, transition: springs.hover }
                : { scale: 1.1, x: 2, transition: springs.hover }
            }
            whileTap={{ scale: 0.9, transition: springs.tap }}
            className={`inline-flex h-8 w-8 items-center justify-center rounded-full border border-border bg-card/70 text-muted-foreground transition-colors hover:border-accent hover:text-accent ${
              coarseEffects ? '' : 'backdrop-blur'
            }`}
          >
            <ChevronRight className="h-4 w-4" />
          </motion.button>
        </div>
      )}
    </div>
  )
}
