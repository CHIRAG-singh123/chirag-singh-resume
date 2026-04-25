import { motion } from 'framer-motion'
import { GraduationCap, MapPin, Mail, Phone, Award } from 'lucide-react'
import { AnimatedSection } from '../components/AnimatedSection'
import { GithubIcon, LinkedinIcon } from '../components/BrandIcons'
import { GradientBlobs } from '../components/GradientBlobs'
import { PageTransition } from '../components/PageTransition'
import { SectionHeading } from '../components/SectionHeading'
import { CONTACT_LINKS, resume } from '../data/resume'

export function AboutPage() {
  return (
    <PageTransition>
      <section className="relative overflow-hidden">
        <GradientBlobs variant="soft" />
        <div className="mx-auto max-w-5xl px-4 py-20 sm:px-6 lg:px-8">
          <SectionHeading
            eyebrow="About Me"
            title={
              <>
                A maker obsessed with <span className="text-accent">AI</span>,
                <br />
                <span className="bg-hero-gradient bg-clip-text text-transparent">
                  full-stack craft, and scale.
                </span>
              </>
            }
          />

          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7 }}
            className="mt-12 rounded-3xl border border-border bg-card/80 p-8 text-lg leading-relaxed text-foreground shadow-xl backdrop-blur sm:p-12"
          >
            <p>{resume.summary}</p>
            <p className="mt-5 text-muted-foreground">
              Outside of shipping code, I love exploring generative AI research, tinkering with
              computer-vision pipelines, and building side projects that solve real problems – from
              campus chatbots to music streaming platforms.
            </p>
          </motion.div>
        </div>
      </section>

      <AnimatedSection className="mx-auto max-w-5xl px-4 pb-12 sm:px-6 lg:px-8">
        <div className="grid gap-4 sm:grid-cols-2">
          <DetailCard icon={MapPin} label="Based in" value={resume.personal.location} />
          <DetailCard
            icon={Mail}
            label="Email"
            value={resume.personal.email}
            href={CONTACT_LINKS.emailHref}
          />
          <DetailCard
            icon={Phone}
            label="Phone"
            value={resume.personal.phone}
            href={CONTACT_LINKS.phoneHref}
          />
          <DetailCard
            icon={GithubIcon}
            label="GitHub"
            value={resume.personal.github}
            href={CONTACT_LINKS.githubHref}
            external
          />
          <DetailCard
            icon={LinkedinIcon}
            label="LinkedIn"
            value={resume.personal.linkedin}
            href={CONTACT_LINKS.linkedinHref}
            external
          />
          <DetailCard icon={Award} label="Role" value={resume.personal.title} />
        </div>
      </AnimatedSection>

      <AnimatedSection className="mx-auto max-w-5xl px-4 py-20 sm:px-6 lg:px-8">
        <SectionHeading
          eyebrow="Education"
          title="Where I learned the craft"
          description="Both degrees completed at L.J University, Ahmedabad."
        />

        <div className="mt-12 grid gap-6 md:grid-cols-2">
          {resume.education.map((ed, idx) => (
            <motion.div
              key={`${ed.degree}-${ed.period}`}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: idx * 0.1 }}
              className="group relative overflow-hidden rounded-2xl border border-border bg-card p-6 shadow-sm transition-all hover:-translate-y-1 hover:border-accent/50 hover:shadow-xl"
            >
              <div className="absolute -right-12 -top-12 h-32 w-32 rounded-full bg-accent/10 blur-2xl transition-all group-hover:bg-accent/20" />
              <span className="inline-flex h-11 w-11 items-center justify-center rounded-xl bg-accent/15 text-accent">
                <GraduationCap className="h-5 w-5" />
              </span>
              <h3 className="mt-4 font-display text-lg font-bold text-foreground sm:text-xl">
                {ed.degree}
              </h3>
              <p className="mt-1 text-sm font-medium text-accent">{ed.school}</p>
              <div className="mt-4 flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-muted-foreground">
                <span>{ed.period}</span>
                <span className="inline-flex items-center gap-1">
                  <MapPin className="h-3.5 w-3.5" />
                  {ed.location}
                </span>
              </div>
            </motion.div>
          ))}
        </div>
      </AnimatedSection>

      <AnimatedSection className="mx-auto max-w-5xl px-4 pb-24 sm:px-6 lg:px-8">
        <SectionHeading
          eyebrow="Certificates"
          title="Credentials & continued learning"
        />
        <div className="mt-10 grid gap-4 md:grid-cols-3">
          {resume.certificates.map((cert, idx) => (
            <motion.div
              key={cert.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.55, delay: idx * 0.08 }}
              className="rounded-2xl border border-border bg-card p-6 shadow-sm transition-all hover:-translate-y-1 hover:border-accent/50 hover:shadow-xl"
            >
              <span className="inline-flex h-10 w-10 items-center justify-center rounded-xl bg-accent/15 text-accent">
                <Award className="h-5 w-5" />
              </span>
              <h3 className="mt-3 font-display text-lg font-semibold text-foreground">
                {cert.title}
              </h3>
              <p className="mt-1 text-sm text-muted-foreground">{cert.description}</p>
            </motion.div>
          ))}
        </div>
        <p className="mt-6 text-center text-sm text-muted-foreground">
          For more certificates, visit my{' '}
          <a
            href={CONTACT_LINKS.courseraHref}
            target="_blank"
            rel="noopener noreferrer"
            className="font-semibold text-accent hover:underline"
          >
            Coursera profile
          </a>
          .
        </p>
      </AnimatedSection>
    </PageTransition>
  )
}

import type { ComponentType, SVGProps } from 'react'

interface DetailCardProps {
  icon: ComponentType<SVGProps<SVGSVGElement> & { className?: string }>
  label: string
  value: string
  href?: string
  external?: boolean
}

function DetailCard({ icon: Icon, label, value, href, external }: DetailCardProps) {
  const content = (
    <div className="flex items-center gap-4">
      <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-accent/15 text-accent">
        <Icon className="h-5 w-5" />
      </span>
      <div>
        <p className="text-[11px] font-semibold uppercase tracking-widest text-muted-foreground">
          {label}
        </p>
        <p className="mt-0.5 text-sm font-medium text-foreground break-all">{value}</p>
      </div>
    </div>
  )
  const className =
    'group block rounded-2xl border border-border bg-card/70 p-5 shadow-sm backdrop-blur transition-all hover:-translate-y-0.5 hover:border-accent/50 hover:shadow-md'
  if (href) {
    return (
      <a
        href={href}
        className={className}
        target={external ? '_blank' : undefined}
        rel={external ? 'noopener noreferrer' : undefined}
      >
        {content}
      </a>
    )
  }
  return <div className={className}>{content}</div>
}
