import { AnimatePresence, motion, type Variants } from 'framer-motion'
import { ArrowRight, ExternalLink, Filter, Grid3X3, Layers3, Sparkles } from 'lucide-react'
import { useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { AnimatedSection } from '../components/AnimatedSection'
import { GithubIcon } from '../components/BrandIcons'
import { PageTransition } from '../components/PageTransition'
import { ProjectCard } from '../components/ProjectCard'
import { PROJECT_LINKS, projectSlug, resume } from '../data/resume'
import { useDocumentHead } from '../lib/seo/useDocumentHead'
import { usePerfProfile } from '../lib/usePerfProfile'
import { durations, easings, springs } from '../motion'

const FILTER_TAGS_PER_PROJECT = 2
const FEATURED_PROJECT_COUNT = 3

const tagRowVariants: Variants = {
  hidden: {},
  show: {
    transition: {
      staggerChildren: 0.025,
      delayChildren: 0.04,
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

function getProjectScore(project: (typeof resume.projects)[number]) {
  const githubBonus = PROJECT_LINKS[project.name] ? 2 : 0
  return project.bullets.length * 3 + project.stack.length + githubBonus
}

export function ProjectsPage() {
  const { coarseEffects } = usePerfProfile()
  const [activeTag, setActiveTag] = useState<string>('All')

  useDocumentHead({
    title: `Projects - ${resume.personal.name}`,
    description:
      'Production-minded project work across AI, machine learning, full-stack systems, and automation.',
    canonical: '/projects',
  })

  const allTags = useMemo(() => {
    const set = new Set<string>()
    resume.projects.forEach((project) => {
      project.stack.slice(0, FILTER_TAGS_PER_PROJECT).forEach((tech) => set.add(tech))
    })
    return ['All', ...Array.from(set)]
  }, [])

  const filtered = useMemo(() => {
    if (activeTag === 'All') return resume.projects
    return resume.projects.filter((project) => project.stack.includes(activeTag))
  }, [activeTag])

  const featured = useMemo(
    () =>
      [...filtered]
        .sort((left, right) => getProjectScore(right) - getProjectScore(left))
        .slice(0, FEATURED_PROJECT_COUNT),
    [filtered],
  )

  const featuredNames = useMemo(() => new Set(featured.map((project) => project.name)), [featured])
  const showcase = useMemo(
    () => filtered.filter((project) => !featuredNames.has(project.name)),
    [featuredNames, filtered],
  )

  const metrics = useMemo(() => {
    const stackCount = new Set(filtered.flatMap((project) => project.stack)).size
    const githubCount = filtered.filter((project) => PROJECT_LINKS[project.name]).length
    const highlightCount = filtered.reduce((sum, project) => sum + project.bullets.length, 0)

    return [
      { label: 'Projects', value: filtered.length },
      { label: 'Code links', value: githubCount },
      { label: 'Stack', value: stackCount },
      { label: 'Signals', value: highlightCount },
    ]
  }, [filtered])

  return (
    <PageTransition variant="transformOnly">
      <section className="relative overflow-hidden border-b border-border bg-background">
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 bg-grid-pattern bg-grid opacity-[0.05]"
        />
        <div
          aria-hidden
          className="pointer-events-none absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-background to-transparent"
        />

        <div className="relative mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8 lg:py-20">
          <div className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_26rem] lg:items-end">
            <motion.div
              initial={coarseEffects ? { opacity: 0, y: 12 } : { opacity: 0, y: 18 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: durations.base, ease: easings.emphasized }}
            >
              <span className="inline-flex items-center gap-2 rounded-md border border-border bg-card/80 px-3 py-1.5 text-[11px] font-semibold uppercase tracking-[0.18em] text-muted-foreground">
                <Sparkles className="h-3.5 w-3.5 text-accent" />
                Project command board
              </span>

              <h1 className="mt-5 max-w-4xl font-display text-4xl font-bold leading-tight text-foreground sm:text-5xl lg:text-6xl">
                Case studies built from AI systems, product engineering, and full-stack delivery.
              </h1>

              <p className="mt-5 max-w-2xl text-base leading-relaxed text-muted-foreground sm:text-lg">
                A concise project index with direct source links, detail routes, stack signals, and
                outcome-focused highlights.
              </p>
            </motion.div>

            <motion.div
              initial={coarseEffects ? { opacity: 0, y: 10 } : { opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: durations.base, ease: easings.emphasized, delay: 0.05 }}
              className="grid grid-cols-2 gap-3"
            >
              {metrics.map((metric) => (
                <div
                  key={metric.label}
                  className="rounded-lg border border-border bg-card/80 p-4 shadow-sm"
                >
                  <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-muted-foreground">
                    {metric.label}
                  </p>
                  <p className="mt-2 font-display text-3xl font-bold text-foreground">
                    {metric.value}
                  </p>
                </div>
              ))}
            </motion.div>
          </div>

          <div className="mt-10 flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
            <div className="inline-flex items-center gap-2 text-[11px] font-semibold uppercase tracking-[0.18em] text-muted-foreground">
              <Filter className="h-3.5 w-3.5 text-accent" />
              Filter by stack
            </div>

            <motion.div
              initial={coarseEffects ? false : 'hidden'}
              animate="show"
              variants={tagRowVariants}
              className="flex flex-wrap gap-2 lg:justify-end"
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
                    className={`inline-flex items-center justify-center rounded-md border px-3 py-2 text-[11px] font-semibold uppercase tracking-[0.14em] transition-[transform,color,border-color,background-color] duration-200 ${
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
          </div>
        </div>
      </section>

      <AnimatedSection className="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8 lg:py-20">
        {filtered.length === 0 ? (
          <AnimatePresence mode="wait">
            <motion.div
              key={`empty-${activeTag}`}
              initial={coarseEffects ? { opacity: 0, y: 10 } : { opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: durations.base, ease: easings.emphasized }}
              className="rounded-lg border border-dashed border-border bg-card/60 p-10 text-center text-muted-foreground"
            >
              No projects use <span className="font-semibold text-foreground">{activeTag}</span>{' '}
              yet. Try another filter.
            </motion.div>
          </AnimatePresence>
        ) : (
          <>
            <div className="flex flex-col gap-3 border-b border-border pb-5 sm:flex-row sm:items-end sm:justify-between">
              <div>
                <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-muted-foreground">
                  Featured case studies
                </p>
                <h2 className="mt-2 font-display text-2xl font-bold text-foreground sm:text-3xl">
                  High-signal work, ready to inspect
                </h2>
              </div>

              <div className="inline-flex items-center gap-2 self-start rounded-md border border-border bg-card/80 px-3 py-2 text-[11px] font-semibold uppercase tracking-[0.14em] text-muted-foreground sm:self-auto">
                <Layers3 className="h-3.5 w-3.5 text-accent" />
                {featured.length} selected
              </div>
            </div>

            <div className="mt-7 grid gap-5 xl:grid-cols-12">
              {featured.map((project, index) => (
                <motion.div
                  key={project.name}
                  initial={coarseEffects ? { opacity: 0, y: 12 } : { opacity: 0, y: 18 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{
                    duration: durations.base,
                    ease: easings.emphasized,
                    delay: Math.min(index, 2) * 0.04,
                  }}
                  className={index === 0 ? 'xl:col-span-7' : 'xl:col-span-5'}
                >
                  <ProjectCard
                    coarseEffects={coarseEffects}
                    project={project}
                    index={index}
                    githubUrl={PROJECT_LINKS[project.name]}
                    disableReveal
                    bulletLimit={index === 0 ? 2 : 1}
                    stackLimit={index === 0 ? 5 : 4}
                    variant="featured"
                  />
                </motion.div>
              ))}
            </div>

            <div className="mt-14 flex flex-col gap-3 border-b border-border pb-5 sm:flex-row sm:items-end sm:justify-between">
              <div>
                <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-muted-foreground">
                  Project ledger
                </p>
                <h2 className="mt-2 font-display text-2xl font-bold text-foreground sm:text-3xl">
                  Compact scan across the portfolio
                </h2>
              </div>

              <div className="inline-flex items-center gap-2 self-start rounded-md border border-border bg-card/80 px-3 py-2 text-[11px] font-semibold uppercase tracking-[0.14em] text-muted-foreground sm:self-auto">
                <Grid3X3 className="h-3.5 w-3.5 text-accent" />
                {showcase.length} more
              </div>
            </div>

            {showcase.length > 0 ? (
              <div className="mt-7 grid gap-5 md:grid-cols-2 xl:grid-cols-3">
                {showcase.map((project, index) => (
                  <motion.div
                    key={project.name}
                    initial={coarseEffects ? { opacity: 0, y: 10 } : { opacity: 0, y: 16 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{
                      duration: durations.base,
                      ease: easings.emphasized,
                      delay: Math.min(index, 5) * 0.035,
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
              <div className="mt-7 rounded-lg border border-border bg-card/70 p-8 text-sm text-muted-foreground">
                The active filter is concentrated in the featured set above.
              </div>
            )}

            <div className="mt-12 flex flex-col gap-4 rounded-lg border border-border bg-card/80 p-5 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-muted-foreground">
                  Repository map
                </p>
                <p className="mt-1 text-sm text-muted-foreground">
                  Each project card keeps direct details and repository access.
                </p>
              </div>

              <a
                href={resume.personal.githubUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 rounded-md border border-border bg-background/70 px-3.5 py-2 text-sm font-semibold text-foreground transition-colors hover:border-accent/60 hover:text-accent"
              >
                <GithubIcon className="h-4 w-4" />
                GitHub profile
                <ExternalLink className="h-3.5 w-3.5" />
              </a>
            </div>

            {featured[0] ? (
              <div className="mt-8 flex justify-end">
                <Link
                  to={`/projects/${projectSlug(featured[0].name)}`}
                  className="group inline-flex items-center gap-2 rounded-md bg-foreground px-4 py-2.5 text-sm font-semibold text-background transition-transform hover:-translate-y-0.5"
                >
                  Open top case study
                  <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
                </Link>
              </div>
            ) : null}
          </>
        )}
      </AnimatedSection>
    </PageTransition>
  )
}
