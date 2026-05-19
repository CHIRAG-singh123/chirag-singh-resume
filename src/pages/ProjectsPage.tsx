import { AnimatePresence, motion, type Variants } from 'framer-motion'
import { useMemo, useState } from 'react'
import { AnimatedSection } from '../components/AnimatedSection'
import { GradientBlobs } from '../components/GradientBlobs'
import { PageTransition } from '../components/PageTransition'
import { ProjectCard } from '../components/ProjectCard'
import { SectionHeading } from '../components/SectionHeading'
import { PROJECT_LINKS, resume } from '../data/resume'
import { useDocumentHead } from '../lib/seo/useDocumentHead'
import { usePerfProfile } from '../lib/usePerfProfile'
import { durations, easings, springs } from '../motion'

const FEATURED_TAGS_PER_PROJECT = 2

const tagRowVariants: Variants = {
  hidden: {},
  show: {
    transition: {
      staggerChildren: 0.035,
      delayChildren: 0.08,
    },
  },
}

const tagItemVariants: Variants = {
  hidden: { opacity: 0, y: 8, scale: 0.96 },
  show: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: { duration: durations.fast, ease: easings.cinematic },
  },
}

export function ProjectsPage() {
  const { coarseEffects } = usePerfProfile()

  useDocumentHead({
    title: `Projects — ${resume.personal.name}`,
    description:
      'End-to-end work, from research to production: GANs, sentiment analysis, MERN platforms, and more.',
    canonical: '/projects',
  })

  const allTags = useMemo(() => {
    const set = new Set<string>()
    resume.projects.forEach((p) =>
      p.stack.slice(0, FEATURED_TAGS_PER_PROJECT).forEach((tech) => set.add(tech)),
    )
    return ['All', ...Array.from(set)]
  }, [])

  const [activeTag, setActiveTag] = useState<string>('All')

  const filtered = useMemo(() => {
    if (activeTag === 'All') return resume.projects
    return resume.projects.filter((p) => p.stack.includes(activeTag))
  }, [activeTag])

  return (
    <PageTransition variant="transformOnly">
      <section className="relative overflow-hidden">
        <GradientBlobs
          variant="soft"
          density={coarseEffects ? 'light' : 'normal'}
          animated={!coarseEffects}
        />
        <div className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8">
          <SectionHeading
            eyebrow="Projects"
            title={
              <>
                End-to-end work, from
                <br />
                <span className="bg-hero-gradient bg-clip-text text-transparent">
                  research to production
                </span>
              </>
            }
            description="Browse by tech – every project here shipped, from GANs in Python to full-stack MERN apps."
          />

          <motion.div
            variants={tagRowVariants}
            initial={coarseEffects ? false : 'hidden'}
            animate="show"
            className="mt-10 flex flex-wrap justify-center gap-2"
            aria-label="Filter projects by featured technology"
          >
            {allTags.map((tag) => {
              const active = tag === activeTag
              return (
                <motion.button
                  type="button"
                  key={tag}
                  variants={coarseEffects ? undefined : tagItemVariants}
                  onClick={() => setActiveTag(tag)}
                  whileHover={
                    coarseEffects
                      ? { y: -1, transition: springs.hover }
                      : { y: -2, scale: 1.04, transition: springs.hover }
                  }
                  whileTap={{ scale: 0.94, transition: springs.tap }}
                  aria-pressed={active}
                  className={`relative isolate inline-flex items-center justify-center rounded-full border px-4 py-1.5 text-xs font-semibold uppercase tracking-widest transition-[color,border-color,background-color,box-shadow] duration-300 ${
                    active
                      ? 'border-transparent text-[#17171a]'
                      : 'border-border bg-card/70 text-muted-foreground hover:border-accent/50 hover:bg-accent/10 hover:text-foreground'
                  }`}
                >
                  {active && (
                    <motion.span
                      layoutId="project-tag"
                      transition={springs.layout}
                      className={`absolute inset-0 -z-10 rounded-full bg-hero-gradient bg-[length:200%_200%] ${
                        coarseEffects ? 'shadow-md' : 'shadow-glow animate-gradient-shift'
                      }`}
                    />
                  )}
                  <span className="relative z-10">
                    {tag}
                  </span>
                </motion.button>
              )
            })}
          </motion.div>
        </div>
      </section>

      <AnimatedSection className="mx-auto max-w-7xl px-4 pb-24 sm:px-6 lg:px-8">
        <motion.div
          layout={!coarseEffects}
          transition={coarseEffects ? undefined : springs.layout}
          className="grid gap-6 md:grid-cols-2 xl:grid-cols-3"
        >
          <AnimatePresence mode="popLayout" initial={false}>
            {filtered.map((project, idx) => (
              <motion.div
                key={project.name}
                layout={!coarseEffects}
                initial={coarseEffects ? { opacity: 0, y: 14 } : { opacity: 0, y: 20, scale: 0.98 }}
                animate={{
                  opacity: 1,
                  y: 0,
                  ...(coarseEffects ? {} : { scale: 1 }),
                  transition: {
                    duration: coarseEffects ? durations.fast : durations.base,
                    ease: easings.emphasized,
                    delay: coarseEffects ? 0 : Math.min(idx, 5) * 0.04,
                  },
                }}
                exit={{
                  opacity: 0,
                  y: -12,
                  ...(coarseEffects ? {} : { scale: 0.98 }),
                  transition: { duration: durations.fast, ease: easings.smooth },
                }}
              >
                <ProjectCard
                  coarseEffects={coarseEffects}
                  project={project}
                  index={idx}
                  githubUrl={PROJECT_LINKS[project.name]}
                  disableReveal
                />
              </motion.div>
            ))}
          </AnimatePresence>
        </motion.div>

        <AnimatePresence mode="wait">
          {filtered.length === 0 && (
            <motion.div
              key={`empty-${activeTag}`}
              initial={coarseEffects ? { opacity: 0, y: 10 } : { opacity: 0, y: 16, scale: 0.98 }}
              animate={{
                opacity: 1,
                y: 0,
                ...(coarseEffects ? {} : { scale: 1 }),
                transition: { duration: durations.base, ease: easings.emphasized },
              }}
              exit={{
                opacity: 0,
                y: -8,
                ...(coarseEffects ? {} : { scale: 0.98 }),
                transition: { duration: durations.fast, ease: easings.smooth },
              }}
              className="mt-12 rounded-3xl border border-dashed border-border bg-card/60 p-10 text-center text-muted-foreground"
            >
              No projects use <span className="font-semibold text-foreground">{activeTag}</span>{' '}
              yet. Try another tag!
            </motion.div>
          )}
        </AnimatePresence>
      </AnimatedSection>
    </PageTransition>
  )
}
