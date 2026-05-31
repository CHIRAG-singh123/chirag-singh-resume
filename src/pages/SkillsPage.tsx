import { motion } from 'framer-motion'
import { Boxes, Code2, Cpu, Wrench } from 'lucide-react'
import type { LucideIcon } from 'lucide-react'
import type { CSSProperties } from 'react'
import { AnimatedSection } from '../components/AnimatedSection'
import { GradientBlobs } from '../components/GradientBlobs'
import { PageTransition } from '../components/PageTransition'
import { SectionHeading } from '../components/SectionHeading'
import { SkillBadge } from '../components/SkillBadge'
import { SkillBrandMark } from '../components/SkillBrandMark'
import { SkillConstellation } from '../components/SkillConstellation'
import { resume } from '../data/resume'
import { useDocumentHead } from '../lib/seo/useDocumentHead'
import { usePerfProfile } from '../lib/usePerfProfile'
import {
  cinematicTransition,
  durations,
  itemVariantsScale,
  springs,
  viewport,
} from '../motion'

const GROUP_ICONS: Record<string, LucideIcon> = {
  Languages: Code2,
  Frameworks: Boxes,
  Technologies: Cpu,
  Tools: Wrench,
}

const SKILL_GROUP_SECTION_STYLE = {
  containIntrinsicSize: '960px',
  contentVisibility: 'auto',
} as CSSProperties

const SPECIALTIES_SECTION_STYLE = {
  containIntrinsicSize: '720px',
  contentVisibility: 'auto',
} as CSSProperties

export function SkillsPage() {
  const { coarseEffects } = usePerfProfile()

  useDocumentHead({
    title: `Skills — ${resume.personal.name}`,
    description:
      'A versatile stack spanning AI/ML frameworks, full-stack web development, and modern tooling.',
    canonical: '/skills',
  })

  const animatedGradientClass = coarseEffects
    ? 'bg-hero-gradient bg-[length:200%_200%] bg-clip-text text-transparent'
    : 'bg-hero-gradient bg-[length:200%_200%] bg-clip-text text-transparent animate-gradient-shift'

  const groupHaloClass = coarseEffects
    ? 'hidden'
    : 'absolute -right-16 -top-16 h-48 w-48 rounded-full bg-accent/8 opacity-70 transition-opacity duration-300 group-hover:opacity-100'

  const specialtySurfaceClass = coarseEffects
    ? 'rounded-2xl border border-border bg-background/85 p-5 transition-[border-color,box-shadow] duration-300 hover:border-accent/50'
    : 'rounded-2xl border border-border bg-background/80 p-5 backdrop-blur transition-[border-color,box-shadow] duration-300 hover:border-accent/50'

  return (
    <PageTransition
      variant="transformOnly"
      className={coarseEffects ? 'skills-page-lite' : undefined}
    >
      <section className="relative overflow-x-hidden overflow-y-visible">
        <GradientBlobs
          variant="soft"
          density={coarseEffects ? 'light' : 'normal'}
          animated={!coarseEffects}
        />
        <div className="mx-auto max-w-6xl px-4 py-20 sm:px-6 lg:px-8">
          <SectionHeading
            eyebrow="Technical Skills"
            title={
              <>
                A versatile stack for
                <br />
                <span className={`font-bold tracking-tight ${animatedGradientClass}`}>
                  AI + full-stack builds
                </span>
              </>
            }
            description="From language fundamentals to deep-learning frameworks – the tools I reach for to ship products."
          />

          <div className="mt-8 sm:mt-10">
            <SkillConstellation groups={resume.skills} coarseEffects={coarseEffects} />
          </div>
        </div>
      </section>

      <div style={SKILL_GROUP_SECTION_STYLE}>
        <AnimatedSection
          className="mx-auto max-w-6xl px-4 pb-24 sm:px-6 lg:px-8"
          variant="soft"
        >
          <div className="grid gap-6 md:grid-cols-2">
            {resume.skills.map((group, idx) => {
              const Icon = GROUP_ICONS[group.label] ?? Cpu
              return (
                <motion.div
                  key={group.label}
                  variants={itemVariantsScale}
                  initial={coarseEffects ? false : 'hidden'}
                  whileInView={coarseEffects ? undefined : 'show'}
                  viewport={coarseEffects ? undefined : { once: viewport.once, amount: 0.2 }}
                  transition={
                    coarseEffects
                      ? { duration: durations.fast }
                      : cinematicTransition(durations.medium, idx * 0.08)
                  }
                  whileHover={coarseEffects ? undefined : { y: -6, transition: springs.hover }}
                  className="group relative overflow-hidden rounded-3xl border border-border bg-card p-8 shadow-sm transition-[border-color,box-shadow] duration-300 hover:border-accent/50 hover:shadow-xl"
                >
                  <div className={groupHaloClass} />

                  <div className="relative flex items-center gap-4">
                    <span
                      className={`flex h-12 w-12 items-center justify-center rounded-2xl bg-hero-gradient bg-[length:200%_200%] text-white ${
                        coarseEffects ? 'shadow-sm' : 'shadow-md'
                      }`}
                    >
                      <Icon className="h-5 w-5" />
                    </span>
                    <div>
                      <h3 className="font-display text-xl font-bold text-foreground sm:text-2xl">
                        {group.label}
                      </h3>
                      <p className="text-xs font-medium uppercase tracking-widest text-muted-foreground">
                        {group.items.length} tools in rotation
                      </p>
                    </div>
                  </div>

                  <div className="relative mt-6 flex flex-wrap gap-2">
                    {group.items.map((item) => (
                      <SkillBadge
                        key={item}
                        label={item}
                        coarseEffects={coarseEffects}
                      />
                    ))}
                  </div>
                </motion.div>
              )
            })}
          </div>
        </AnimatedSection>
      </div>

      <div style={SPECIALTIES_SECTION_STYLE}>
        <AnimatedSection
          className="mx-auto max-w-6xl px-4 pb-24 sm:px-6 lg:px-8"
          variant="soft"
        >
          <div className="relative overflow-hidden rounded-3xl border border-border bg-card p-10 shadow-xl">
            <div
              className={`absolute inset-0 -z-10 bg-hero-gradient bg-[length:200%_200%] opacity-10 ${
                coarseEffects ? '' : 'animate-gradient-shift'
              }`}
            />
            <SectionHeading
              eyebrow="Signature strengths"
              title={
                <>
                  Specialties I <span className={`font-bold tracking-tight ${animatedGradientClass}`}>lean into</span>
                </>
              }
              description="Themes that show up repeatedly across my projects."
            />
            <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {[
                'Generative AI & GANs',
                'MERN & Django apps',
                'Computer Vision',
                'NLP & Chatbots',
                'ML Pipelines',
                'Production-ready UIs',
              ].map((item, idx) => (
                <motion.div
                  key={item}
                  variants={itemVariantsScale}
                  initial={coarseEffects ? false : 'hidden'}
                  whileInView={coarseEffects ? undefined : 'show'}
                  viewport={coarseEffects ? undefined : { once: viewport.once, amount: 0.4 }}
                  transition={
                    coarseEffects
                      ? { duration: durations.fast }
                      : cinematicTransition(durations.base, idx * 0.06)
                  }
                  whileHover={coarseEffects ? undefined : { y: -4, transition: springs.hover }}
                  className={specialtySurfaceClass}
                >
                  <span className="inline-flex h-8 w-8 items-center justify-center rounded-lg bg-accent/15 text-accent">
                    <SkillBrandMark
                      label={item}
                      className="h-9 w-9"
                      fallback={<Cpu className="h-7 w-7" />}
                    />
                  </span>
                  <p className="mt-3 font-display text-base font-bold tracking-tight text-foreground">
                    {item}
                  </p>
                </motion.div>
              ))}
            </div>
          </div>
        </AnimatedSection>
      </div>
    </PageTransition>
  )
}
