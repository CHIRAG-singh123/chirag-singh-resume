import { motion } from 'framer-motion'
import { Boxes, Code2, Cpu, Wrench } from 'lucide-react'
import type { LucideIcon } from 'lucide-react'
import { AnimatedSection } from '../components/AnimatedSection'
import { GradientBlobs } from '../components/GradientBlobs'
import { PageTransition } from '../components/PageTransition'
import { SectionHeading } from '../components/SectionHeading'
import { SkillBadge } from '../components/SkillBadge'
import { resume } from '../data/resume'
import {
  cinematicTransition,
  durations,
  itemVariantsScale,
  sectionVariants,
  springs,
  viewport,
} from '../motion'

const GROUP_ICONS: Record<string, LucideIcon> = {
  Languages: Code2,
  Frameworks: Boxes,
  Technologies: Cpu,
  Tools: Wrench,
}

export function SkillsPage() {
  return (
    <PageTransition>
      <section className="relative overflow-hidden">
        <GradientBlobs variant="soft" />
        <div className="mx-auto max-w-6xl px-4 py-20 sm:px-6 lg:px-8">
          <SectionHeading
            eyebrow="Technical Skills"
            title={
              <>
                A versatile stack for
                <br />
                <span className="bg-hero-gradient bg-clip-text text-transparent">
                  AI + full-stack builds
                </span>
              </>
            }
            description="From language fundamentals to deep-learning frameworks – the tools I reach for to ship products."
          />
        </div>
      </section>

      <AnimatedSection className="mx-auto max-w-6xl px-4 pb-24 sm:px-6 lg:px-8">
        <div className="grid gap-6 md:grid-cols-2">
          {resume.skills.map((group, idx) => {
            const Icon = GROUP_ICONS[group.label] ?? Cpu
            return (
              <motion.div
                key={group.label}
                variants={sectionVariants}
                initial="hidden"
                whileInView="show"
                viewport={{ once: viewport.once, amount: 0.2 }}
                transition={cinematicTransition(durations.medium, idx * 0.08)}
                whileHover={{ y: -6, transition: springs.hover }}
                className="group relative overflow-hidden rounded-3xl border border-border bg-card p-8 shadow-sm transition-[border-color,box-shadow] duration-300 hover:border-accent/50 hover:shadow-xl"
              >
                <div className="absolute -right-16 -top-16 h-48 w-48 rounded-full bg-accent/10 blur-3xl transition-all duration-500 group-hover:bg-accent/25" />

                <div className="relative flex items-center gap-4">
                  <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-hero-gradient bg-[length:200%_200%] text-white shadow-glow animate-gradient-shift">
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
                  {group.items.map((item, i) => (
                    <SkillBadge key={item} label={item} delay={i * 0.03} />
                  ))}
                </div>
              </motion.div>
            )
          })}
        </div>
      </AnimatedSection>

      <AnimatedSection className="mx-auto max-w-6xl px-4 pb-24 sm:px-6 lg:px-8">
        <div className="relative overflow-hidden rounded-3xl border border-border bg-card p-10 shadow-xl">
          <div className="absolute inset-0 -z-10 bg-hero-gradient bg-[length:200%_200%] opacity-10 animate-gradient-shift" />
          <SectionHeading
            eyebrow="Signature strengths"
            title="Specialties I lean into"
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
                initial="hidden"
                whileInView="show"
                viewport={{ once: viewport.once, amount: 0.4 }}
                transition={cinematicTransition(durations.base, idx * 0.06)}
                whileHover={{ y: -4, transition: springs.hover }}
                className="rounded-2xl border border-border bg-background/80 p-5 backdrop-blur transition-[border-color,box-shadow] duration-300 hover:border-accent/50"
              >
                <span className="inline-flex h-8 w-8 items-center justify-center rounded-lg bg-accent/15 text-accent">
                  <Cpu className="h-4 w-4" />
                </span>
                <p className="mt-3 font-display text-base font-semibold text-foreground">
                  {item}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </AnimatedSection>
    </PageTransition>
  )
}
