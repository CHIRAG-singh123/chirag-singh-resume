import { Mail, MapPin, Phone } from 'lucide-react'
import { GithubIcon, LinkedinIcon } from './BrandIcons'
import { CONTACT_LINKS, resume } from '../data/resume'

export function Footer() {
  const year = new Date().getFullYear()
  return (
    <footer className="relative mt-24 border-t border-border bg-background/80">
      <div className="pointer-events-none absolute inset-x-0 -top-32 h-32 bg-gradient-to-b from-transparent to-background" />
      <div className="mx-auto grid max-w-7xl gap-8 px-4 py-12 sm:px-6 lg:grid-cols-3 lg:px-8">
        <div>
          <h3 className="font-display text-xl font-bold text-foreground">
            {resume.personal.name}
          </h3>
          <p className="mt-2 text-sm text-muted-foreground">
            {resume.personal.title}. Building AI-powered, full-stack products with care.
          </p>
        </div>

        <div>
          <h4 className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">
            Reach me
          </h4>
          <ul className="mt-3 space-y-2 text-sm">
            <li>
              <a
                href={CONTACT_LINKS.phoneHref}
                className="flex items-center gap-2 text-foreground hover:text-accent"
              >
                <Phone className="h-4 w-4" />
                {resume.personal.phone}
              </a>
            </li>
            <li>
              <a
                href={CONTACT_LINKS.emailHref}
                className="flex items-center gap-2 text-foreground hover:text-accent"
              >
                <Mail className="h-4 w-4" />
                {resume.personal.email}
              </a>
            </li>
            <li className="flex items-center gap-2 text-muted-foreground">
              <MapPin className="h-4 w-4" />
              {resume.personal.location}
            </li>
          </ul>
        </div>

        <div>
          <h4 className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">
            Elsewhere
          </h4>
          <ul className="mt-3 flex flex-wrap gap-2">
            <li>
              <a
                href={CONTACT_LINKS.githubHref}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 rounded-full border border-border bg-card/70 px-3 py-1.5 text-xs font-medium text-foreground transition-colors hover:border-accent hover:text-accent"
              >
                <GithubIcon className="h-4 w-4" /> GitHub
              </a>
            </li>
            <li>
              <a
                href={CONTACT_LINKS.linkedinHref}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 rounded-full border border-border bg-card/70 px-3 py-1.5 text-xs font-medium text-foreground transition-colors hover:border-accent hover:text-accent"
              >
                <LinkedinIcon className="h-4 w-4" /> LinkedIn
              </a>
            </li>
          </ul>
        </div>
      </div>
      <div className="border-t border-border">
        <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-2 px-4 py-4 text-xs text-muted-foreground sm:flex-row sm:px-6 lg:px-8">
          <span>
            &copy; {year} {resume.personal.name}. Crafted with React, Tailwind, and Framer
            Motion.
          </span>
          <span>Designed for clarity, built for speed.</span>
        </div>
      </div>
    </footer>
  )
}
