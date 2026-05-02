import { AnimatePresence, motion, type Variants } from 'framer-motion'
import { useMemo, useState } from 'react'
import { AnimatedSection } from '../components/AnimatedSection'
import { GradientBlobs } from '../components/GradientBlobs'
import { PageTransition } from '../components/PageTransition'
import { ProjectCard } from '../components/ProjectCard'
import { SectionHeading } from '../components/SectionHeading'
import { resume } from '../data/resume'
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
  hidden: { opacity: 0, y: 10, scale: 0.9, filter: 'blur(4px)' },
  show: {
    opacity: 1,
    y: 0,
    scale: 1,
    filter: 'blur(0px)',
    transition: { duration: durations.fast, ease: easings.cinematic },
  },
}

const PROJECT_GITHUB: Record<string, string> = {
  Zentro: 'https://github.com/CHIRAG-singh123/ERP-CRM-Zentro',
  'Sentiment Analysis': 'https://github.com/CHIRAG-singh123/tweets-sentiment-analysis',
  'IGAN-Face-Generation': 'https://github.com/CHIRAG-singh123/IGAN-Face-Generation',
  'Admission Bot': 'https://github.com/CHIRAG-singh123/admission-bot.git',
  'LJ Learning Platform': 'https://github.com/ayushpatel112233/Online-Learing-app',
  'Rhythm Realm': 'https://github.com/CHIRAG-singh123/music-streamer-mern',
  CustomerSync: 'https://github.com/CHIRAG-singh123/CRM',
}

export function ProjectsPage() {
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
    <PageTransition>
      <section className="relative overflow-hidden">
        <GradientBlobs variant="soft" />
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
            initial="hidden"
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
                  variants={tagItemVariants}
                  onClick={() => setActiveTag(tag)}
                  whileHover={{ y: -2, scale: 1.04, transition: springs.hover }}
                  whileTap={{ scale: 0.94, transition: springs.tap }}
                  aria-pressed={active}
                  className={`relative rounded-full px-4 py-1.5 text-xs font-semibold uppercase tracking-widest transition-colors duration-300 ${
                    active
                      ? 'text-accent-foreground'
                      : 'text-muted-foreground hover:text-foreground'
                  }`}
                >
                  {active && (
                    <motion.span
                      layoutId="project-tag"
                      transition={springs.layout}
                      className="absolute inset-0 -z-10 rounded-full bg-hero-gradient bg-[length:200%_200%] shadow-glow animate-gradient-shift"
                    />
                  )}
                  <span
                    className={
                      active
                        ? ''
                        : 'rounded-full border border-border bg-card/70 px-3 py-1 -m-3 transition-colors duration-300 hover:border-accent/50 hover:bg-accent/10'
                    }
                  >
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
          layout
          transition={springs.layout}
          className="grid gap-6 md:grid-cols-2 xl:grid-cols-3"
        >
          <AnimatePresence mode="popLayout" initial={false}>
            {filtered.map((project, idx) => (
              <motion.div
                key={project.name}
                layout
                initial={{ opacity: 0, y: 24, scale: 0.96, filter: 'blur(6px)' }}
                animate={{
                  opacity: 1,
                  y: 0,
                  scale: 1,
                  filter: 'blur(0px)',
                  transition: {
                    duration: durations.base,
                    ease: easings.emphasized,
                    delay: Math.min(idx, 5) * 0.05,
                  },
                }}
                exit={{
                  opacity: 0,
                  y: -12,
                  scale: 0.96,
                  filter: 'blur(6px)',
                  transition: { duration: durations.fast, ease: easings.smooth },
                }}
              >
                <ProjectCard
                  project={project}
                  index={idx}
                  githubUrl={PROJECT_GITHUB[project.name]}
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
              initial={{ opacity: 0, y: 16, scale: 0.97, filter: 'blur(6px)' }}
              animate={{
                opacity: 1,
                y: 0,
                scale: 1,
                filter: 'blur(0px)',
                transition: { duration: durations.base, ease: easings.emphasized },
              }}
              exit={{
                opacity: 0,
                y: -8,
                scale: 0.98,
                filter: 'blur(4px)',
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
