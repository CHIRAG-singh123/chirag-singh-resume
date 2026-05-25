import { motion } from 'framer-motion'
import {
  ArrowLeft,
  ArrowRight,
  ArrowUpRight,
  ExternalLink,
  Layers3,
  ListChecks,
} from 'lucide-react'
import { useMemo } from 'react'
import { Link, useParams } from 'react-router-dom'
import { GithubIcon } from '../components/BrandIcons'
import { PageTransition } from '../components/PageTransition'
import { ProjectStackChip } from '../components/ProjectStackChip'
import { PROJECT_LINKS, projectSlug, resume } from '../data/resume'
import { useDocumentHead } from '../lib/seo/useDocumentHead'
import { usePerfProfile } from '../lib/usePerfProfile'
import { durations, easings, springs } from '../motion'
import { NotFoundPage } from './NotFoundPage'

export function ProjectDetailPage() {
  const { slug } = useParams<{ slug: string }>()
  const { coarseEffects } = usePerfProfile()

  const project = useMemo(
    () => resume.projects.find((candidate) => projectSlug(candidate.name) === slug),
    [slug],
  )

  const next = useMemo(() => {
    if (!project) return null
    const index = resume.projects.indexOf(project)
    return resume.projects[(index + 1) % resume.projects.length]
  }, [project])

  useDocumentHead({
    title: project ? `${project.name} - ${project.tagline}` : 'Project not found',
    description: project ? project.bullets[0] : undefined,
    canonical: project ? `/projects/${projectSlug(project.name)}` : undefined,
    type: 'article',
  })

  if (!project) return <NotFoundPage />

  const githubUrl = PROJECT_LINKS[project.name]
  const metrics = [
    { label: 'Highlights', value: project.bullets.length },
    { label: 'Stack', value: project.stack.length },
  ]

  return (
    <PageTransition variant="transformOnly">
      <section className="relative overflow-hidden border-b border-border bg-background">
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 bg-grid-pattern bg-grid opacity-[0.05]"
        />

        <div className="relative mx-auto max-w-6xl px-4 py-14 sm:px-6 lg:px-8 lg:py-20">
          <Link
            to="/projects"
            className="group inline-flex items-center gap-2 rounded-md border border-border bg-card/80 px-3 py-2 text-sm font-semibold text-muted-foreground transition-colors hover:border-accent/60 hover:text-foreground"
          >
            <ArrowLeft className="h-4 w-4 transition-transform group-hover:-translate-x-0.5" />
            All projects
          </Link>

          <div className="mt-8 grid gap-8 lg:grid-cols-[minmax(0,1fr)_20rem] lg:items-end">
            <motion.div
              initial={coarseEffects ? { opacity: 0, y: 10 } : { opacity: 0, y: 18 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: durations.base, ease: easings.emphasized }}
            >
              <p className="inline-flex items-center gap-2 rounded-md border border-border bg-card/80 px-3 py-1.5 text-[11px] font-semibold uppercase tracking-[0.18em] text-muted-foreground">
                <Layers3 className="h-3.5 w-3.5 text-accent" />
                {project.stack[0] ?? project.tagline}
              </p>

              <h1 className="mt-5 max-w-4xl font-display text-4xl font-bold leading-tight text-foreground sm:text-5xl lg:text-6xl">
                {project.name}
              </h1>

              <p className="mt-4 max-w-2xl text-lg font-semibold text-accent">
                {project.tagline}
              </p>

              <p className="mt-4 max-w-3xl text-base leading-relaxed text-muted-foreground sm:text-lg">
                {project.bullets[0]}
              </p>
            </motion.div>

            <motion.div
              initial={coarseEffects ? { opacity: 0, y: 10 } : { opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: durations.base, ease: easings.emphasized, delay: 0.05 }}
              className="grid grid-cols-2 gap-2 lg:grid-cols-1"
            >
              {metrics.map((metric) => (
                <div
                  key={metric.label}
                  className="rounded-lg border border-border bg-card/80 p-4 shadow-sm"
                >
                  <p className="text-[10px] font-semibold uppercase tracking-[0.16em] text-muted-foreground">
                    {metric.label}
                  </p>
                  <p className="mt-2 font-display text-2xl font-bold text-foreground">
                    {metric.value}
                  </p>
                </div>
              ))}
            </motion.div>
          </div>

          <div className="mt-8 flex flex-wrap gap-3">
            {githubUrl ? (
              <motion.a
                href={githubUrl}
                target="_blank"
                rel="noopener noreferrer"
                whileHover={{ y: coarseEffects ? -1 : -2, transition: springs.hover }}
                whileTap={{ scale: 0.97, transition: springs.tap }}
                className="inline-flex items-center gap-2 rounded-md bg-foreground px-4 py-2.5 text-sm font-semibold text-background"
              >
                <GithubIcon className="h-4 w-4" />
                View on GitHub
                <ExternalLink className="h-3.5 w-3.5" />
              </motion.a>
            ) : null}

            <Link
              to="/contact"
              className="inline-flex items-center gap-2 rounded-md border border-border bg-card/80 px-4 py-2.5 text-sm font-semibold text-foreground transition-colors hover:border-accent/60 hover:text-accent"
            >
              Discuss this project
              <ArrowUpRight className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </section>

      <section className="mx-auto grid max-w-6xl gap-8 px-4 py-12 sm:px-6 lg:grid-cols-[minmax(0,1fr)_20rem] lg:px-8 lg:py-16">
        <motion.div
          initial={coarseEffects ? { opacity: 0, y: 10 } : { opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: durations.base, ease: easings.emphasized }}
          className="min-w-0"
        >
          <div className="flex items-center gap-2 border-b border-border pb-4">
            <ListChecks className="h-4 w-4 text-accent" />
            <h2 className="font-display text-2xl font-bold text-foreground">Execution Notes</h2>
          </div>

          <div className="mt-6 grid gap-4">
            {project.bullets.map((bullet, index) => (
              <motion.div
                key={bullet}
                initial={coarseEffects ? { opacity: 0, y: 8 } : { opacity: 0, y: 14 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{
                  duration: durations.base,
                  ease: easings.emphasized,
                  delay: Math.min(index, 5) * 0.04,
                }}
                className="grid gap-4 rounded-lg border border-border bg-card/80 p-5 sm:grid-cols-[2.75rem_1fr]"
              >
                <span className="inline-flex h-10 w-10 items-center justify-center rounded-md border border-border bg-background/70 font-mono text-xs font-bold text-accent">
                  {String(index + 1).padStart(2, '0')}
                </span>
                <p className="text-base leading-relaxed text-foreground">{bullet}</p>
              </motion.div>
            ))}
          </div>
        </motion.div>

        <aside className="space-y-6">
          <div className="rounded-lg border border-border bg-card/80 p-5">
            <div className="flex items-center gap-2 border-b border-border pb-4">
              <Layers3 className="h-4 w-4 text-accent" />
              <h2 className="font-display text-lg font-bold text-foreground">Stack</h2>
            </div>
            <div className="mt-4 flex flex-wrap gap-2">
              {project.stack.map((tech, index) => (
                <ProjectStackChip
                  key={tech}
                  label={tech}
                  tone={index === 0 ? 'accent' : 'compact'}
                />
              ))}
            </div>
          </div>
        </aside>
      </section>

      {next && next !== project ? (
        <section className="mx-auto max-w-6xl px-4 pb-16 sm:px-6 lg:px-8">
          <Link
            to={`/projects/${projectSlug(next.name)}`}
            className="group flex items-center justify-between gap-4 rounded-lg border border-border bg-card/80 p-5 transition-colors hover:border-accent/60 hover:bg-accent/10"
          >
            <span>
              <span className="block text-[11px] font-semibold uppercase tracking-[0.18em] text-muted-foreground">
                Next case study
              </span>
              <span className="mt-1 block font-display text-lg font-bold text-foreground">
                {next.name}
              </span>
            </span>
            <ArrowRight className="h-5 w-5 text-accent transition-transform group-hover:translate-x-1" />
          </Link>
        </section>
      ) : null}
    </PageTransition>
  )
}
