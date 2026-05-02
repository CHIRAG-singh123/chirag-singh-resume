import { motion } from 'framer-motion'
import { Copy, Mail, MapPin, Phone, Check } from 'lucide-react'
import { useState } from 'react'
import { AnimatedSection } from '../components/AnimatedSection'
import { GithubIcon, LinkedinIcon } from '../components/BrandIcons'
import { ContactButton } from '../components/ContactButton'
import { DownloadResumeButton } from '../components/DownloadResumeButton'
import { GradientBlobs } from '../components/GradientBlobs'
import { PageTransition } from '../components/PageTransition'
import { SectionHeading } from '../components/SectionHeading'
import { CONTACT_LINKS, resume } from '../data/resume'
import { sectionVariantsCinematic, springs, viewport } from '../motion'

export function ContactPage() {
  const [name, setName] = useState('')
  const [userEmail, setUserEmail] = useState('')
  const [subject, setSubject] = useState('')
  const [body, setBody] = useState('')
  const [copied, setCopied] = useState<'phone' | 'email' | null>(null)

  const copy = async (type: 'phone' | 'email', value: string) => {
    try {
      await navigator.clipboard.writeText(value)
      setCopied(type)
      setTimeout(() => setCopied(null), 1800)
    } catch {
      /* ignore */
    }
  }

  const buildDraft = () => {
    const finalSubject = subject || `Hello from ${name || 'your site visitor'}`
    const bodyLines: string[] = []
    if (name) bodyLines.push(`Name: ${name}`)
    if (userEmail) bodyLines.push(`Reply to: ${userEmail}`)
    if (body) {
      bodyLines.push('')
      bodyLines.push(body)
    }
    return { finalSubject, bodyText: bodyLines.join('\n') }
  }

  const mailtoLink = () => {
    const { finalSubject, bodyText } = buildDraft()
    const params = new URLSearchParams()
    params.set('subject', finalSubject)
    if (bodyText) params.set('body', bodyText)
    return `mailto:${resume.personal.email}?${params
      .toString()
      .replace(/\+/g, '%20')}`
  }

  const gmailComposeUrl = () => {
    const { finalSubject, bodyText } = buildDraft()
    const query = [
      'view=cm',
      'fs=1',
      `to=${encodeURIComponent(resume.personal.email)}`,
      `su=${encodeURIComponent(finalSubject)}`,
    ]
    if (bodyText) query.push(`body=${encodeURIComponent(bodyText)}`)
    return `https://mail.google.com/mail/?${query.join('&')}`
  }

  const openCompose = () => {
    window.open(gmailComposeUrl(), '_blank', 'noopener,noreferrer')
  }

  return (
    <PageTransition>
      <section className="relative overflow-hidden">
        <GradientBlobs />
        <div className="mx-auto max-w-6xl px-4 py-20 sm:px-6 lg:px-8">
          <SectionHeading
            eyebrow="Contact"
            title={
              <>
                Let's build something
                <br />
                <span className="bg-hero-gradient bg-clip-text text-transparent">
                  meaningful together
                </span>
              </>
            }
            description="Reach out by phone, email, or send a quick message below. The form opens Gmail in your browser with a pre-filled draft."
          />
        </div>
      </section>

      <AnimatedSection className="mx-auto max-w-6xl px-4 pb-12 sm:px-6 lg:px-8">
        <div className="grid gap-4 md:grid-cols-2">
          <motion.div
            whileHover={{ y: -6, transition: springs.hover }}
            className="group relative overflow-hidden rounded-3xl border border-border bg-card p-6 shadow-sm"
          >
            <div className="absolute -right-16 -top-16 h-44 w-44 rounded-full bg-accent/10 blur-3xl" />
            <div className="flex items-center gap-4">
              <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-accent/15 text-accent">
                <Phone className="h-5 w-5" />
              </span>
              <div>
                <p className="text-[11px] font-semibold uppercase tracking-widest text-muted-foreground">
                  Phone
                </p>
                <p className="font-display text-lg font-semibold text-foreground">
                  {resume.personal.phone}
                </p>
              </div>
            </div>
            <div className="mt-5 flex flex-wrap gap-2">
              <a
                href={CONTACT_LINKS.phoneHref}
                className="inline-flex items-center gap-2 rounded-full bg-accent px-4 py-2 text-xs font-semibold uppercase tracking-widest text-accent-foreground shadow-glow transition-all hover:-translate-y-0.5"
              >
                <Phone className="h-4 w-4" /> Call
              </a>
              <button
                type="button"
                onClick={() => copy('phone', resume.personal.phone)}
                className="inline-flex items-center gap-2 rounded-full border border-border bg-background px-4 py-2 text-xs font-semibold uppercase tracking-widest text-foreground hover:border-accent/50 hover:bg-accent/10"
              >
                {copied === 'phone' ? (
                  <>
                    <Check className="h-4 w-4 text-chart-positive" /> Copied
                  </>
                ) : (
                  <>
                    <Copy className="h-4 w-4" /> Copy
                  </>
                )}
              </button>
            </div>
          </motion.div>

          <motion.div
            whileHover={{ y: -6, transition: springs.hover }}
            className="group relative overflow-hidden rounded-3xl border border-border bg-card p-6 shadow-sm"
          >
            <div className="absolute -right-16 -top-16 h-44 w-44 rounded-full bg-accent-secondary/20 blur-3xl" />
            <div className="flex items-center gap-4">
              <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-accent-secondary/20 text-accent">
                <Mail className="h-5 w-5" />
              </span>
              <div>
                <p className="text-[11px] font-semibold uppercase tracking-widest text-muted-foreground">
                  Email
                </p>
                <p className="font-display text-lg font-semibold text-foreground break-all">
                  {resume.personal.email}
                </p>
              </div>
            </div>
            <div className="mt-5 flex flex-wrap gap-2">
              <a
                href={CONTACT_LINKS.emailHref}
                className="inline-flex items-center gap-2 rounded-full bg-hero-gradient bg-[length:200%_200%] px-4 py-2 text-xs font-semibold uppercase tracking-widest text-white shadow-glow animate-gradient-shift transition-transform hover:-translate-y-0.5"
              >
                <Mail className="h-4 w-4" /> Open mail app
              </a>
              <button
                type="button"
                onClick={() => copy('email', resume.personal.email)}
                className="inline-flex items-center gap-2 rounded-full border border-border bg-background px-4 py-2 text-xs font-semibold uppercase tracking-widest text-foreground hover:border-accent/50 hover:bg-accent/10"
              >
                {copied === 'email' ? (
                  <>
                    <Check className="h-4 w-4 text-chart-positive" /> Copied
                  </>
                ) : (
                  <>
                    <Copy className="h-4 w-4" /> Copy
                  </>
                )}
              </button>
            </div>
          </motion.div>
        </div>
      </AnimatedSection>

      <AnimatedSection className="mx-auto max-w-6xl px-4 pb-12 sm:px-6 lg:px-8">
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          <ContactButton
            href={CONTACT_LINKS.linkedinHref}
            icon={LinkedinIcon}
            label="LinkedIn"
            sublabel={resume.personal.linkedin}
            external
          />
          <ContactButton
            href={CONTACT_LINKS.githubHref}
            icon={GithubIcon}
            label="GitHub"
            sublabel={resume.personal.github}
            external
          />
          <ContactButton
            href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(resume.personal.location)}`}
            icon={MapPin}
            label="Location"
            sublabel={resume.personal.location}
            external
          />
        </div>
      </AnimatedSection>

      <AnimatedSection className="mx-auto max-w-4xl px-4 pb-24 sm:px-6 lg:px-8">
        <motion.form
          variants={sectionVariantsCinematic}
          initial="hidden"
          whileInView="show"
          viewport={{ once: viewport.once, amount: 0.15 }}
          onSubmit={(e) => {
            e.preventDefault()
            openCompose()
          }}
          className="relative overflow-hidden rounded-3xl border border-border bg-card p-8 shadow-xl sm:p-10"
        >
          <div className="absolute inset-0 -z-10 bg-hero-gradient bg-[length:200%_200%] opacity-10 animate-gradient-shift" />

          <h3 className="font-display text-2xl font-bold text-foreground sm:text-3xl">
            Send a quick message
          </h3>
          <p className="mt-1 text-sm text-muted-foreground">
            Fill this in and hit Send. Gmail opens in a new tab with a pre-filled draft
            addressed to me &mdash; review and send from your own account.
          </p>

          <div className="mt-8 grid gap-4 sm:grid-cols-2">
            <label className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">
              Your name
              <input
                value={name}
                onChange={(e) => setName(e.target.value)}
                type="text"
                required
                placeholder="Jane Doe"
                className="mt-2 w-full rounded-xl border border-input bg-background px-4 py-3 text-sm font-normal text-foreground normal-case tracking-normal placeholder:text-muted-foreground focus:border-accent focus:outline-none focus:ring-2 focus:ring-ring"
              />
            </label>
            <label className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">
              Your email
              <input
                value={userEmail}
                onChange={(e) => setUserEmail(e.target.value)}
                type="email"
                required
                placeholder="you@example.com"
                className="mt-2 w-full rounded-xl border border-input bg-background px-4 py-3 text-sm font-normal text-foreground normal-case tracking-normal placeholder:text-muted-foreground focus:border-accent focus:outline-none focus:ring-2 focus:ring-ring"
              />
            </label>
            <label className="sm:col-span-2 text-xs font-semibold uppercase tracking-widest text-muted-foreground">
              Subject
              <input
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
                type="text"
                placeholder="Collaboration / Opportunity / Hi"
                className="mt-2 w-full rounded-xl border border-input bg-background px-4 py-3 text-sm font-normal text-foreground normal-case tracking-normal placeholder:text-muted-foreground focus:border-accent focus:outline-none focus:ring-2 focus:ring-ring"
              />
            </label>
            <label className="sm:col-span-2 text-xs font-semibold uppercase tracking-widest text-muted-foreground">
              Message
              <textarea
                value={body}
                onChange={(e) => setBody(e.target.value)}
                rows={5}
                required
                placeholder="Tell me a bit about your project or idea..."
                className="mt-2 w-full rounded-xl border border-input bg-background px-4 py-3 text-sm font-normal text-foreground normal-case tracking-normal placeholder:text-muted-foreground focus:border-accent focus:outline-none focus:ring-2 focus:ring-ring"
              />
            </label>
          </div>

          <div className="mt-8 flex flex-wrap items-center justify-between gap-4">
            <p className="text-xs text-muted-foreground">
              Opens Gmail compose in a new tab.{' '}
              <a
                href={mailtoLink()}
                className="font-semibold text-foreground underline-offset-4 hover:underline"
              >
                Prefer your desktop mail app?
              </a>
            </p>
            <div className="flex flex-wrap gap-3">
              <DownloadResumeButton variant="ghost" />
              <button
                type="submit"
                className="group inline-flex items-center gap-2 rounded-full bg-hero-gradient bg-[length:200%_200%] px-6 py-3 text-sm font-semibold text-white shadow-glow animate-gradient-shift transition-transform hover:-translate-y-0.5"
              >
                <Mail className="h-4 w-4 transition-transform group-hover:-translate-y-0.5" />
                Send via Gmail
              </button>
            </div>
          </div>
        </motion.form>
      </AnimatedSection>
    </PageTransition>
  )
}
