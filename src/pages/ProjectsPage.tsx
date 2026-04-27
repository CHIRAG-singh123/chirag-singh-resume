import { motion } from 'framer-motion'
import { useMemo, useState } from 'react'
import { AnimatedSection } from '../components/AnimatedSection'
import { GradientBlobs } from '../components/GradientBlobs'
import { PageTransition } from '../components/PageTransition'
import { ProjectCard } from '../components/ProjectCard'
import { SectionHeading } from '../components/SectionHeading'
import { resume } from '../data/resume'
import { springs } from '../motion'

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
    resume.projects.forEach((p) => p.stack.forEach((tech) => set.add(tech)))
    return ['All', ...Array.from(set).sort()]
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

          <div className="mt-10 flex flex-wrap justify-center gap-2">
            {allTags.map((tag) => {
              const active = tag === activeTag
              return (
                <motion.button
                  type="button"
                  key={tag}
                  onClick={() => setActiveTag(tag)}
                  whileHover={{ y: -2, transition: springs.hover }}
                  whileTap={{ scale: 0.95, transition: springs.tap }}
                  className={`relative rounded-full px-4 py-1.5 text-xs font-semibold uppercase tracking-widest transition-colors ${
                    active
                      ? 'text-accent-foreground'
                      : 'text-muted-foreground hover:text-foreground'
                  }`}
                >
                  {active && (
                    <motion.span
                      layoutId="project-tag"
                      transition={springs.layout}
                      className="absolute inset-0 -z-10 rounded-full bg-hero-gradient bg-[length:200%_200%] animate-gradient-shift"
                    />
                  )}
                  <span
                    className={
                      active ? '' : 'rounded-full border border-border bg-card/70 px-3 py-1 -m-3'
                    }
                  >
                    {tag}
                  </span>
                </motion.button>
              )
            })}
          </div>
        </div>
      </section>

      <AnimatedSection className="mx-auto max-w-7xl px-4 pb-24 sm:px-6 lg:px-8">
        <motion.div
          layout
          className="grid gap-6 md:grid-cols-2 xl:grid-cols-3"
        >
          {filtered.map((project, idx) => (
            <ProjectCard
              key={project.name}
              project={project}
              index={idx}
              githubUrl={PROJECT_GITHUB[project.name]}
            />
          ))}
        </motion.div>

        {filtered.length === 0 && (
          <div className="mt-12 rounded-3xl border border-dashed border-border bg-card/60 p-10 text-center text-muted-foreground">
            No projects use <span className="font-semibold text-foreground">{activeTag}</span> yet.
            Try another tag!
          </div>
        )}
      </AnimatedSection>
    </PageTransition>
  )
}
