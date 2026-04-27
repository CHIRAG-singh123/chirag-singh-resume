import { motion } from 'framer-motion'
import { Award, Sparkles } from 'lucide-react'
import { AnimatedSection } from '../components/AnimatedSection'
import { GradientBlobs } from '../components/GradientBlobs'
import { PageTransition } from '../components/PageTransition'
import { SectionHeading } from '../components/SectionHeading'
import { TimelineItem } from '../components/TimelineItem'
import { resume } from '../data/resume'
import { cinematicTransition, distances, durations, springs, viewport } from '../motion'

export function ExperiencePage() {
  return (
    <PageTransition>
      <section className="relative overflow-hidden">
        <GradientBlobs variant="soft" />
        <div className="mx-auto max-w-5xl px-4 py-20 sm:px-6 lg:px-8">
          <SectionHeading
            eyebrow="Experience"
            title={
              <>
                Real-world impact across
                <br />
                <span className="bg-hero-gradient bg-clip-text text-transparent">
                  AI + full-stack systems
                </span>
              </>
            }
            description="A timeline of hands-on work – shipping scalable platforms, integrating cloud services, and building for production."
          />
        </div>
      </section>

      <AnimatedSection className="mx-auto max-w-4xl px-4 pb-24 sm:px-6 lg:px-8">
        <ol className="relative">
          {resume.experience.map((item, idx) => (
            <TimelineItem
              key={`${item.title}-${item.period}`}
              item={item}
              index={idx}
              isLast={idx === resume.experience.length - 1}
            />
          ))}
        </ol>
      </AnimatedSection>

      <AnimatedSection className="mx-auto max-w-5xl px-4 pb-24 sm:px-6 lg:px-8">
        <div className="relative overflow-hidden rounded-3xl border border-border bg-card p-10 shadow-xl">
          <div className="absolute inset-0 -z-10 bg-hero-gradient bg-[length:200%_200%] opacity-10 animate-gradient-shift" />
          <SectionHeading
            eyebrow="Key Achievements"
            title="Milestones I'm proud of"
            description="Selected highlights that capture the breadth of my work."
          />

          <ul className="mt-10 grid gap-4 md:grid-cols-2">
            {resume.achievements.map((achievement, idx) => (
              <motion.li
                key={achievement}
                initial={{ opacity: 0, x: -distances.md, filter: 'blur(6px)' }}
                whileInView={{ opacity: 1, x: 0, filter: 'blur(0px)' }}
                viewport={{ once: viewport.once, amount: viewport.amount }}
                transition={cinematicTransition(durations.base, idx * 0.08)}
                whileHover={{ y: -4, transition: springs.hover }}
                className="group flex items-start gap-3 rounded-2xl border border-border bg-background/80 p-5 transition-[border-color,box-shadow] duration-300 hover:border-accent/50"
              >
                <span className="mt-0.5 flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-xl bg-accent/15 text-accent transition-colors group-hover:bg-accent group-hover:text-accent-foreground">
                  <Award className="h-4 w-4" />
                </span>
                <p className="text-sm leading-relaxed text-foreground">{achievement}</p>
              </motion.li>
            ))}
          </ul>

          <div className="mt-8 flex items-center justify-center gap-2 text-xs text-muted-foreground">
            <Sparkles className="h-4 w-4 text-accent" />
            And more in the works – check back soon.
          </div>
        </div>
      </AnimatedSection>
    </PageTransition>
  )
}
