import { motion } from 'framer-motion'
import { GraduationCap, MapPin, Mail, Phone, Award } from 'lucide-react'
import type { CSSProperties, ComponentType, SVGProps } from 'react'
import { AnimatedSection } from '../components/AnimatedSection'
import { GithubIcon, LinkedinIcon } from '../components/BrandIcons'
import { GradientBlobs } from '../components/GradientBlobs'
import { PageTransition } from '../components/PageTransition'
import { SectionHeading } from '../components/SectionHeading'
import { CONTACT_LINKS, resume } from '../data/resume'
import { useDocumentHead } from '../lib/seo/useDocumentHead'
import { usePerfProfile } from '../lib/usePerfProfile'
import {
  cinematicTransition,
  durations,
  itemVariants,
  itemVariantsScale,
  sectionVariantsCinematic,
  springs,
  viewport,
} from '../motion'

const ABOUT_EDUCATION_SECTION_STYLE = {
  containIntrinsicSize: '980px',
  contentVisibility: 'auto',
} as CSSProperties

const ABOUT_CERTIFICATES_SECTION_STYLE = {
  containIntrinsicSize: '720px',
  contentVisibility: 'auto',
} as CSSProperties

export function AboutPage() {
  const { coarseEffects } = usePerfProfile()

  useDocumentHead({
    title: `About — ${resume.personal.name}`,
    description: `Learn more about ${resume.personal.name}: education at LJ University, certifications, and the values behind the work.`,
    canonical: '/about',
    type: 'profile',
  })

  const detailCardClass = coarseEffects
    ? 'group block rounded-2xl border border-border bg-card p-5 shadow-sm transition-[border-color,box-shadow] hover:border-accent/50 hover:shadow-md'
    : 'group block rounded-2xl border border-border bg-card/70 p-5 shadow-sm backdrop-blur transition-all hover:-translate-y-0.5 hover:border-accent/50 hover:shadow-md'

  return (
    <PageTransition variant="transformOnly">
      <section className="relative overflow-hidden">
        <GradientBlobs
          variant="soft"
          density={coarseEffects ? 'light' : 'normal'}
          animated={!coarseEffects}
        />
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
            variants={sectionVariantsCinematic}
            initial={coarseEffects ? false : 'hidden'}
            whileInView={coarseEffects ? undefined : 'show'}
            viewport={coarseEffects ? undefined : { once: viewport.once, amount: viewport.amount }}
            className={`mt-12 rounded-3xl border border-border p-8 text-lg leading-relaxed text-foreground shadow-xl sm:p-12 ${
              coarseEffects ? 'bg-card' : 'bg-card/80 backdrop-blur'
            }`}
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
          <DetailCard
            icon={MapPin}
            label="Based in"
            value={resume.personal.location}
            className={detailCardClass}
          />
          <DetailCard
            icon={Mail}
            label="Email"
            value={resume.personal.email}
            href={CONTACT_LINKS.emailHref}
            className={detailCardClass}
          />
          <DetailCard
            icon={Phone}
            label="Phone"
            value={resume.personal.phone}
            href={CONTACT_LINKS.phoneHref}
            className={detailCardClass}
          />
          <DetailCard
            icon={GithubIcon}
            label="GitHub"
            value={resume.personal.github}
            href={CONTACT_LINKS.githubHref}
            external
            className={detailCardClass}
          />
          <DetailCard
            icon={LinkedinIcon}
            label="LinkedIn"
            value={resume.personal.linkedin}
            href={CONTACT_LINKS.linkedinHref}
            external
            className={detailCardClass}
          />
          <DetailCard
            icon={Award}
            label="Role"
            value={resume.personal.title}
            className={detailCardClass}
          />
        </div>
      </AnimatedSection>

      <div style={ABOUT_EDUCATION_SECTION_STYLE}>
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
                variants={itemVariants}
                initial={coarseEffects ? false : 'hidden'}
                whileInView={coarseEffects ? undefined : 'show'}
                viewport={coarseEffects ? undefined : { once: viewport.once, amount: viewport.amount }}
                transition={
                  coarseEffects
                    ? { duration: durations.fast }
                    : cinematicTransition(durations.medium, idx * 0.1)
                }
                whileHover={coarseEffects ? undefined : { y: -6, transition: springs.hover }}
                className="group relative overflow-hidden rounded-2xl border border-border bg-card p-6 shadow-sm transition-[border-color,box-shadow] duration-300 hover:border-accent/50 hover:shadow-xl"
              >
                {coarseEffects ? null : (
                  <div className="absolute -right-12 -top-12 h-32 w-32 rounded-full bg-accent/10 blur-2xl transition-all group-hover:bg-accent/20" />
                )}
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
      </div>

      <div style={ABOUT_CERTIFICATES_SECTION_STYLE}>
        <AnimatedSection className="mx-auto max-w-5xl px-4 pb-24 sm:px-6 lg:px-8">
          <SectionHeading
            eyebrow="Certificates"
            title="Credentials & continued learning"
          />
          <div className="mt-10 grid gap-4 md:grid-cols-3">
            {resume.certificates.map((cert, idx) => (
              <motion.div
                key={cert.title}
                variants={itemVariantsScale}
                initial={coarseEffects ? false : 'hidden'}
                whileInView={coarseEffects ? undefined : 'show'}
                viewport={coarseEffects ? undefined : { once: viewport.once, amount: viewport.amount }}
                transition={
                  coarseEffects
                    ? { duration: durations.fast }
                    : cinematicTransition(durations.base, idx * 0.08)
                }
                whileHover={coarseEffects ? undefined : { y: -5, transition: springs.hover }}
                className="rounded-2xl border border-border bg-card p-6 shadow-sm transition-[border-color,box-shadow] duration-300 hover:border-accent/50 hover:shadow-xl"
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
      </div>
    </PageTransition>
  )
}

interface DetailCardProps {
  icon: ComponentType<SVGProps<SVGSVGElement> & { className?: string }>
  label: string
  value: string
  href?: string
  external?: boolean
  className: string
}

function DetailCard({ icon: Icon, label, value, href, external, className }: DetailCardProps) {
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
