import { AnimatePresence, motion, type Variants } from 'framer-motion'
import { ArrowRight, ExternalLink, Filter, Grid3X3, Layers3, Sparkles } from 'lucide-react'
import { useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { AnimatedSection } from '../components/AnimatedSection'
import { GithubIcon } from '../components/BrandIcons'
import { GradientBlobs } from '../components/GradientBlobs'
import { PageTransition } from '../components/PageTransition'
import { ProjectCard } from '../components/ProjectCard'
import { PROJECT_LINKS, projectSlug, resume } from '../data/resume'
import { useDocumentHead } from '../lib/seo/useDocumentHead'
import { usePerfProfile } from '../lib/usePerfProfile'
import { durations, easings, springs } from '../motion'

const FEATURED_TAGS_PER_PROJECT = 2
const FEATURED_PROJECT_COUNT = 3

const tagRowVariants: Variants = {
  hidden: {},
  show: {
    transition: {
      staggerChildren: 0.03,
      delayChildren: 0.05,
    },
  },
}

const tagItemVariants: Variants = {
  hidden: { opacity: 0, y: 8 },
  show: {
    opacity: 1,
    y: 0,
    transition: { duration: durations.fast, ease: easings.cinematic },
  },
}

const cardVariants: Variants = {
  hidden: { opacity: 0, y: 18 },
  show: {
    opacity: 1,
    y: 0,
    transition: { duration: durations.base, ease: easings.emphasized },
  },
}

function getProjectScore(project: (typeof resume.projects)[number]) {
  const githubBonus = PROJECT_LINKS[project.name] ? 2 : 0
  return project.bullets.length * 3 + project.stack.length + githubBonus
}

export function ProjectsPage() {
  const { coarseEffects } = usePerfProfile()

  useDocumentHead({
    title: `Projects - ${resume.personal.name}`,
    description:
      'An editorial look at shipped work across AI, full-stack product engineering, and production-focused software delivery.',
    canonical: '/projects',
  })

  const [activeTag, setActiveTag] = useState<string>('All')

  const allTags = useMemo(() => {
    const set = new Set<string>()
    resume.projects.forEach((project) => {
      project.stack.slice(0, FEATURED_TAGS_PER_PROJECT).forEach((tech) => set.add(tech))
    })
    return ['All', ...Array.from(set)]
  }, [])

  const filtered = useMemo(() => {
    if (activeTag === 'All') return resume.projects
    return resume.projects.filter((project) => project.stack.includes(activeTag))
  }, [activeTag])

  const featured = useMemo(() => {
    return [...filtered]
      .sort((left, right) => getProjectScore(right) - getProjectScore(left))
      .slice(0, FEATURED_PROJECT_COUNT)
  }, [filtered])

  const featuredNames = useMemo(() => new Set(featured.map((project) => project.name)), [featured])

  const showcase = useMemo(() => {
    return filtered.filter((project) => !featuredNames.has(project.name))
  }, [featuredNames, filtered])

  const metrics = useMemo(() => {
    const githubCount = filtered.filter((project) => PROJECT_LINKS[project.name]).length
    const stackCount = new Set(filtered.flatMap((project) => project.stack)).size
    const highlightCount = filtered.reduce((sum, project) => sum + project.bullets.length, 0)

    return [
      { label: 'Visible projects', value: filtered.length },
      { label: 'GitHub links', value: githubCount },
      { label: 'Stack signals', value: stackCount },
      { label: 'Highlights', value: highlightCount },
    ]
  }, [filtered])

  return (
    <PageTransition variant="transformOnly">
      <section className="relative overflow-hidden">
        <GradientBlobs
          variant="soft"
          density={coarseEffects ? 'light' : 'normal'}
          animated={!coarseEffects}
        />
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 bg-grid-pattern bg-grid opacity-[0.04]"
        />

        <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8 lg:py-20">
          <div className="grid gap-8 lg:grid-cols-[minmax(0,1.35fr)_minmax(18rem,0.8fr)] lg:items-end">
            <motion.div
              initial={coarseEffects ? { opacity: 0, y: 12 } : { opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: durations.base, ease: easings.emphasized }}
            >
              <span className="inline-flex items-center gap-2 rounded-full border border-accent/30 bg-accent/10 px-4 py-1.5 text-xs font-semibold uppercase tracking-[0.22em] text-accent">
                <Sparkles className="h-3.5 w-3.5" />
                Project archive
              </span>

              <h1 className="mt-5 max-w-4xl font-display text-4xl font-bold tracking-tight text-foreground sm:text-5xl lg:text-6xl">
                Selected product, AI, and platform work built for real use.
              </h1>

              <p className="mt-5 max-w-2xl text-base leading-relaxed text-muted-foreground sm:text-lg">
                This page keeps the resume data intact and surfaces it in a faster scan: strong
                leads first, dense follow-through after that, and direct detail and GitHub paths
                for every project.
              </p>
            </motion.div>

            <motion.div
              initial={coarseEffects ? { opacity: 0, y: 12 } : { opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: durations.base, ease: easings.emphasized, delay: 0.06 }}
              className="rounded-[1.75rem] border border-border bg-card/80 p-5 shadow-lg"
            >
              <div className="flex items-start justify-between gap-4">
                <div>
                  <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-muted-foreground">
                    Current lens
                  </p>
                  <p className="mt-2 text-2xl font-bold tracking-tight text-foreground">
                    {activeTag}
                  </p>
                </div>
                <div className="rounded-full border border-border bg-background/80 p-2 text-accent">
                  <Filter className="h-4 w-4" />
                </div>
              </div>

              <p className="mt-4 text-sm leading-relaxed text-muted-foreground">
                Featured and showcase sections update from the active stack filter while keeping
                route slugs, GitHub links, and detail navigation unchanged.
              </p>
            </motion.div>
          </div>

          <motion.div
            initial={coarseEffects ? false : 'hidden'}
            animate="show"
            variants={tagRowVariants}
            className="mt-10 flex flex-wrap gap-2"
            aria-label="Filter projects by featured technology"
          >
            {allTags.map((tag) => {
              const active = tag === activeTag
              return (
                <motion.button
                  key={tag}
                  type="button"
                  variants={coarseEffects ? undefined : tagItemVariants}
                  onClick={() => setActiveTag(tag)}
                  whileHover={
                    coarseEffects
                      ? { y: -1, transition: springs.hover }
                      : { y: -2, transition: springs.hover }
                  }
                  whileTap={{ scale: 0.97, transition: springs.tap }}
                  aria-pressed={active}
                  className={`inline-flex items-center justify-center rounded-full border px-4 py-2 text-xs font-semibold uppercase tracking-[0.18em] transition-[transform,color,border-color,background-color] duration-200 ${
                    active
                      ? 'border-accent bg-accent text-accent-foreground shadow-sm'
                      : 'border-border bg-card/80 text-muted-foreground hover:border-accent/45 hover:text-foreground'
                  }`}
                >
                  {tag}
                </motion.button>
              )
            })}
          </motion.div>

          <div className="mt-8 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
            {metrics.map((metric, index) => (
              <motion.div
                key={metric.label}
                initial={coarseEffects ? { opacity: 0, y: 10 } : { opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{
                  duration: durations.base,
                  ease: easings.emphasized,
                  delay: Math.min(index, 3) * 0.05,
                }}
                className="rounded-[1.4rem] border border-border bg-card/80 p-5 shadow-sm"
              >
                <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-muted-foreground">
                  {metric.label}
                </p>
                <p className="mt-3 text-3xl font-bold tracking-tight text-foreground">
                  {metric.value}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <AnimatedSection className="mx-auto max-w-7xl px-4 pb-24 sm:px-6 lg:px-8">
        {filtered.length === 0 ? (
          <AnimatePresence mode="wait">
            <motion.div
              key={`empty-${activeTag}`}
              initial={coarseEffects ? { opacity: 0, y: 10 } : { opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: durations.base, ease: easings.emphasized }}
              className="rounded-[1.8rem] border border-dashed border-border bg-card/60 p-10 text-center text-muted-foreground"
            >
              No projects use <span className="font-semibold text-foreground">{activeTag}</span>{' '}
              yet. Try another filter.
            </motion.div>
          </AnimatePresence>
        ) : (
          <>
            <div className="flex items-center justify-between gap-4">
              <div>
                <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-muted-foreground">
                  Featured rail
                </p>
                <h2 className="mt-2 font-display text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
                  Highest-signal projects first
                </h2>
              </div>

              <div className="hidden items-center gap-2 rounded-full border border-border bg-card/80 px-4 py-2 text-xs font-semibold uppercase tracking-[0.18em] text-muted-foreground sm:inline-flex">
                <Layers3 className="h-3.5 w-3.5 text-accent" />
                {featured.length} featured
              </div>
            </div>

            <div className="mt-8 grid gap-5 xl:grid-cols-12">
              {featured.map((project, index) => {
                const githubUrl = PROJECT_LINKS[project.name]
                const projectPath = `/projects/${projectSlug(project.name)}`

                return (
                  <motion.div
                    key={project.name}
                    variants={coarseEffects ? undefined : cardVariants}
                    initial={coarseEffects ? { opacity: 0, y: 14 } : 'hidden'}
                    animate={coarseEffects ? { opacity: 1, y: 0 } : 'show'}
                    transition={
                      coarseEffects
                        ? {
                            duration: durations.base,
                            ease: easings.emphasized,
                            delay: index * 0.05,
                          }
                        : undefined
                    }
                    className={index === 0 ? 'xl:col-span-7' : 'xl:col-span-5'}
                  >
                    <ProjectCard
                      coarseEffects={coarseEffects}
                      project={project}
                      index={index}
                      githubUrl={githubUrl}
                      disableReveal
                      bulletLimit={2}
                      stackLimit={4}
                      variant="featured"
                    />

                    {index > 0 ? (
                      <div className="mt-3 px-2">
                        <Link
                          to={projectPath}
                          className="inline-flex items-center gap-2 rounded-full border border-border px-3 py-1.5 text-[11px] font-semibold uppercase tracking-[0.18em] text-muted-foreground transition-colors hover:border-accent/50 hover:text-foreground"
                        >
                          Scan details
                          <ArrowRight className="h-3.5 w-3.5" />
                        </Link>
                      </div>
                    ) : null}
                  </motion.div>
                )
              })}
            </div>

            <div className="mt-16 flex items-center justify-between gap-4">
              <div>
                <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-muted-foreground">
                  Showcase grid
                </p>
                <h2 className="mt-2 font-display text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
                  Dense scan for the remaining work
                </h2>
              </div>

              <div className="hidden items-center gap-2 rounded-full border border-border bg-card/80 px-4 py-2 text-xs font-semibold uppercase tracking-[0.18em] text-muted-foreground md:inline-flex">
                <Grid3X3 className="h-3.5 w-3.5 text-accent" />
                {showcase.length} in grid
              </div>
            </div>

            {showcase.length > 0 ? (
              <div className="mt-8 grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
                {showcase.map((project, index) => (
                  <motion.div
                    key={project.name}
                    initial={coarseEffects ? { opacity: 0, y: 12 } : { opacity: 0, y: 18 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{
                      duration: durations.base,
                      ease: easings.emphasized,
                      delay: Math.min(index, 5) * 0.04,
                    }}
                  >
                    <ProjectCard
                      coarseEffects={coarseEffects}
                      project={project}
                      index={featured.length + index}
                      githubUrl={PROJECT_LINKS[project.name]}
                      disableReveal
                      bulletLimit={2}
                      stackLimit={4}
                      variant="compact"
                    />
                  </motion.div>
                ))}
              </div>
            ) : (
              <motion.div
                initial={coarseEffects ? { opacity: 0, y: 10 } : { opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: durations.base, ease: easings.emphasized }}
                className="mt-8 rounded-[1.6rem] border border-border bg-card/70 p-8 text-sm text-muted-foreground"
              >
                The active filter currently concentrates the strongest matches in the featured rail.
                Open details or GitHub from those cards above.
              </motion.div>
            )}

            <div className="mt-12 rounded-[1.8rem] border border-border bg-card/75 p-5 sm:p-6">
              <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-muted-foreground">
                    Link integrity
                  </p>
                  <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                    Every project keeps its existing detail route and GitHub source path. The page
                    only changes scan order and presentation.
                  </p>
                </div>

                <a
                  href={resume.personal.githubUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 rounded-full border border-border bg-background/80 px-4 py-2 text-sm font-semibold text-foreground transition-colors hover:border-accent/60 hover:bg-accent/10"
                >
                  <GithubIcon className="h-4 w-4" />
                  Visit GitHub profile
                  <ExternalLink className="h-4 w-4" />
                </a>
              </div>
            </div>
          </>
        )}
      </AnimatedSection>
    </PageTransition>
  )
}
