import { motion } from 'framer-motion'
import {
  ArrowRight,
  Award,
  Briefcase,
  Code2,
  GraduationCap,
  MapPin,
  Sparkles,
} from 'lucide-react'
import { Link } from 'react-router-dom'
import { AnimatedSection, staggerContainer, staggerItem } from '../components/AnimatedSection'
import { GithubIcon, LinkedinIcon } from '../components/BrandIcons'
import { ContactButton } from '../components/ContactButton'
import { DownloadResumeButton } from '../components/DownloadResumeButton'
import { GradientBlobs } from '../components/GradientBlobs'
import { HeroAvatar } from '../components/HeroAvatar'
import { PageTransition } from '../components/PageTransition'
import { ProjectCard } from '../components/ProjectCard'
import { SectionHeading } from '../components/SectionHeading'
import { StatCard } from '../components/StatCard'
import { TypingText } from '../components/TypingText'
import { CONTACT_LINKS, resume } from '../data/resume'

export function HomePage() {
  const featuredProjects = resume.projects.slice(0, 3)

  return (
    <PageTransition>
      <section className="relative overflow-hidden">
        <GradientBlobs />
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 bg-grid-pattern bg-grid opacity-[0.04]"
        />

        <div className="mx-auto grid max-w-7xl items-center gap-12 px-4 py-16 sm:px-6 lg:grid-cols-[1.2fr_1fr] lg:gap-16 lg:px-8 lg:py-24">
          <motion.div
            variants={staggerContainer}
            initial="hidden"
            animate="show"
            className="relative z-10"
          >
            <motion.span
              variants={staggerItem}
              className="inline-flex items-center gap-2 rounded-full border border-accent/30 bg-accent/10 px-4 py-1.5 text-xs font-semibold uppercase tracking-[0.22em] text-accent"
            >
              <Sparkles className="h-3.5 w-3.5" />
              Available for new challenges
            </motion.span>

            <motion.h1
              variants={staggerItem}
              className="mt-6 font-display text-4xl font-bold leading-[1.05] tracking-tight text-foreground sm:text-5xl md:text-6xl lg:text-7xl"
            >
              Hi, I'm <span className="text-accent">{resume.personal.name.split(' ')[0]}</span>
              <br />
              <span className="bg-hero-gradient bg-[length:200%_200%] bg-clip-text text-transparent animate-gradient-shift">
                <TypingText
                  phrases={[
                    'AI-Augmented Software Engineer',
                    'Full-Stack Builder',
                    'ML / GAN Enthusiast',
                    'MERN & Django Dev',
                  ]}
                />
              </span>
            </motion.h1>

            <motion.p
              variants={staggerItem}
              className="mt-6 max-w-xl text-base leading-relaxed text-muted-foreground sm:text-lg"
            >
              {resume.summary}
            </motion.p>

            <motion.div
              variants={staggerItem}
              className="mt-8 flex flex-wrap items-center gap-3"
            >
              <DownloadResumeButton size="lg" />
              <Link
                to="/contact"
                className="group inline-flex items-center gap-2 rounded-full border border-border bg-card/70 px-6 py-3 text-sm font-semibold text-foreground backdrop-blur transition-all hover:-translate-y-0.5 hover:border-accent/60 hover:bg-accent/10"
              >
                Contact Me
                <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
              </Link>
            </motion.div>

            <motion.div
              variants={staggerItem}
              className="mt-8 flex flex-wrap items-center gap-x-5 gap-y-2 text-sm text-muted-foreground"
            >
              <span className="inline-flex items-center gap-2">
                <MapPin className="h-4 w-4 text-accent" />
                {resume.personal.location}
              </span>
              <a
                href={CONTACT_LINKS.githubHref}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 hover:text-accent"
              >
                <GithubIcon className="h-4 w-4" />
                {resume.personal.github}
              </a>
              <a
                href={CONTACT_LINKS.linkedinHref}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 hover:text-accent"
              >
                <LinkedinIcon className="h-4 w-4" />
                {resume.personal.linkedin}
              </a>
            </motion.div>
          </motion.div>

          <div className="relative">
            <HeroAvatar />
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 pb-16 sm:px-6 lg:px-8">
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <StatCard
            icon={Code2}
            value={resume.projects.length}
            label="Projects Shipped"
            delay={0}
          />
          <StatCard
            icon={Briefcase}
            value={resume.experience.length}
            label="Professional Role"
            delay={0.08}
          />
          <StatCard
            icon={Award}
            value={resume.achievements.length}
            label="Key Achievements"
            delay={0.16}
          />
          <StatCard
            icon={GraduationCap}
            value={resume.education.length}
            label="Degrees at LJU"
            delay={0.24}
          />
        </div>
      </section>

      <AnimatedSection className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8">
        <SectionHeading
          eyebrow="Featured Work"
          title={
            <>
              Projects that blend
              <br />
              <span className="bg-hero-gradient bg-clip-text text-transparent">
                AI with craft
              </span>
            </>
          }
          description="A glimpse into what I've built – from GANs and sentiment engines to full-stack platforms used in production."
        />

        <div className="mt-12 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {featuredProjects.map((project, idx) => (
            <ProjectCard key={project.name} project={project} index={idx} />
          ))}
        </div>

        <div className="mt-10 flex justify-center">
          <Link
            to="/projects"
            className="group inline-flex items-center gap-2 rounded-full border border-border bg-card/70 px-6 py-3 text-sm font-semibold text-foreground backdrop-blur transition-all hover:-translate-y-0.5 hover:border-accent/60 hover:bg-accent/10"
          >
            View all projects
            <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
          </Link>
        </div>
      </AnimatedSection>

      <AnimatedSection className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8">
        <div className="relative overflow-hidden rounded-3xl border border-border bg-card p-10 text-center shadow-xl sm:p-14">
          <div className="absolute inset-0 -z-10 bg-hero-gradient bg-[length:200%_200%] opacity-10 animate-gradient-shift" />
          <SectionHeading
            eyebrow="Let's collaborate"
            title="Have a project in mind?"
            description="Phone, email, or mailbox – pick whichever works for you. I'll get back within a day."
          />

          <div className="mt-10 grid gap-3 sm:grid-cols-2 sm:justify-items-center">
            <ContactButton
              href={CONTACT_LINKS.phoneHref}
              icon={Briefcase}
              label="Call me"
              sublabel={resume.personal.phone}
            />
            <ContactButton
              href={CONTACT_LINKS.emailHref}
              icon={Sparkles}
              label="Email me"
              sublabel={resume.personal.email}
            />
          </div>

          <div className="mt-8 flex flex-wrap justify-center gap-3">
            <DownloadResumeButton />
            <Link
              to="/contact"
              className="inline-flex items-center gap-2 rounded-full border border-border bg-background px-5 py-2.5 text-sm font-semibold text-foreground hover:border-accent/50 hover:bg-accent/10"
            >
              More ways to reach me
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </AnimatedSection>
    </PageTransition>
  )
}
