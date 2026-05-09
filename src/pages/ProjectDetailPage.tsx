import { motion } from 'framer-motion'
import {
  ArrowLeft,
  ArrowRight,
  ArrowUpRight,
  CheckCircle2,
  ExternalLink,
  Layers,
} from 'lucide-react'
import { useMemo } from 'react'
import { Link, useParams } from 'react-router-dom'
import { GithubIcon } from '../components/BrandIcons'
import { GradientBlobs } from '../components/GradientBlobs'
import { PageTransition } from '../components/PageTransition'
import { SectionHeading } from '../components/SectionHeading'
import { PROJECT_LINKS, projectSlug, resume } from '../data/resume'
import { useDocumentHead } from '../lib/seo/useDocumentHead'
import { cinematicTransition, durations, springs, viewport } from '../motion'
import { NotFoundPage } from './NotFoundPage'

export function ProjectDetailPage() {
  const { slug } = useParams<{ slug: string }>()

  const project = useMemo(
    () => resume.projects.find((p) => projectSlug(p.name) === slug),
    [slug],
  )

  const next = useMemo(() => {
    if (!project) return null
    const i = resume.projects.indexOf(project)
    return resume.projects[(i + 1) % resume.projects.length]
  }, [project])

  useDocumentHead({
    title: project ? `${project.name} — ${project.tagline}` : 'Project not found',
    description: project ? `${project.bullets[0]}` : undefined,
    canonical: project ? `/projects/${projectSlug(project.name)}` : undefined,
    type: 'article',
  })

  if (!project) return <NotFoundPage />

  const githubUrl = PROJECT_LINKS[project.name]

  return (
    <PageTransition>
      <section className="relative overflow-hidden">
        <GradientBlobs variant="soft" />
        <div className="mx-auto max-w-4xl px-4 py-16 sm:px-6 lg:px-8 lg:py-24">
          <Link
            to="/projects"
            className="group inline-flex items-center gap-2 text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
          >
            <ArrowLeft className="h-4 w-4 transition-transform group-hover:-translate-x-0.5" />
            All projects
          </Link>

          <div className="mt-8">
            <SectionHeading
              eyebrow={project.tagline}
              title={project.name}
              align="left"
            />
          </div>

          <motion.div
            variants={{
              hidden: {},
              show: { transition: { staggerChildren: 0.06, delayChildren: 0.05 } },
            }}
            initial="hidden"
            whileInView="show"
            viewport={{ once: viewport.once, amount: 0.2 }}
            className="mt-10 rounded-3xl border border-border bg-card/80 p-8 shadow-xl backdrop-blur sm:p-10"
          >
            <motion.h2
              variants={{
                hidden: { opacity: 0, y: 16, filter: 'blur(6px)' },
                show: {
                  opacity: 1,
                  y: 0,
                  filter: 'blur(0px)',
                  transition: cinematicTransition(durations.base),
                },
              }}
              className="font-display text-lg font-bold uppercase tracking-[0.18em] text-muted-foreground"
            >
              Highlights
            </motion.h2>

            <ul className="mt-5 space-y-4">
              {project.bullets.map((bullet) => (
                <motion.li
                  key={bullet}
                  variants={{
                    hidden: { opacity: 0, x: -16, filter: 'blur(4px)' },
                    show: {
                      opacity: 1,
                      x: 0,
                      filter: 'blur(0px)',
                      transition: cinematicTransition(durations.base),
                    },
                  }}
                  className="flex gap-3 text-base leading-relaxed text-foreground"
                >
                  <CheckCircle2 className="mt-1 h-4 w-4 flex-shrink-0 text-accent" />
                  <span>{bullet}</span>
                </motion.li>
              ))}
            </ul>

            <div className="mt-10 border-t border-border pt-8">
              <h3 className="inline-flex items-center gap-2 font-display text-lg font-bold uppercase tracking-[0.18em] text-muted-foreground">
                <Layers className="h-4 w-4 text-accent" />
                Stack
              </h3>
              <div className="mt-4 flex flex-wrap gap-2">
                {project.stack.map((tech) => (
                  <span
                    key={tech}
                    className="rounded-full border border-border bg-background/60 px-3 py-1 text-xs font-medium uppercase tracking-wide text-muted-foreground"
                  >
                    {tech}
                  </span>
                ))}
              </div>
            </div>

            <div className="mt-10 flex flex-wrap gap-3">
              {githubUrl && (
                <motion.a
                  href={githubUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  whileHover={{ y: -2, transition: springs.hover }}
                  whileTap={{ scale: 0.97, transition: springs.tap }}
                  className="inline-flex items-center gap-2 rounded-full bg-foreground px-5 py-2.5 text-sm font-semibold text-background"
                >
                  <GithubIcon className="h-4 w-4" />
                  View on GitHub
                  <ExternalLink className="h-3.5 w-3.5" />
                </motion.a>
              )}
              <Link
                to="/contact"
                className="inline-flex items-center gap-2 rounded-full border border-border bg-card px-5 py-2.5 text-sm font-semibold text-foreground transition-colors hover:border-accent/60 hover:bg-accent/10"
              >
                Discuss this project
                <ArrowUpRight className="h-4 w-4" />
              </Link>
            </div>
          </motion.div>

          {next && next !== project && (
            <Link
              to={`/projects/${projectSlug(next.name)}`}
              className="group mt-12 flex items-center justify-between gap-4 rounded-2xl border border-border bg-card/60 p-5 transition-colors hover:border-accent/60 hover:bg-accent/10"
            >
              <span>
                <span className="block text-[11px] font-semibold uppercase tracking-[0.2em] text-muted-foreground">
                  Next project
                </span>
                <span className="mt-1 block font-display text-base font-semibold text-foreground sm:text-lg">
                  {next.name}
                </span>
              </span>
              <ArrowRight className="h-5 w-5 text-accent transition-transform group-hover:translate-x-1" />
            </Link>
          )}
        </div>
      </section>
    </PageTransition>
  )
}
