import { AnimatePresence, motion, useReducedMotion } from 'framer-motion'
import {
  ArrowRight,
  Briefcase,
  Code2,
  Command as CommandIcon,
  Copy,
  Download,
  ExternalLink,
  GraduationCap,
  Mail,
  MapPin,
  Phone,
  Search,
  Sparkles,
  User,
} from 'lucide-react'
import { GithubIcon, LinkedinIcon } from './BrandIcons'
import {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ComponentType,
  type SVGProps,
} from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { CONTACT_LINKS, PROJECT_LINKS, resume } from '../data/resume'
import { durations, easings } from '../motion'

type IconType = ComponentType<SVGProps<SVGSVGElement> & { className?: string }>

const COMMAND_PALETTE_EVENT = 'commandpalette:open'

interface CommandItem {
  id: string
  label: string
  hint?: string
  icon: IconType
  keywords?: string
  group: 'Pages' | 'Actions' | 'Projects' | 'Contact'
  perform: () => void
}

const isMac =
  typeof navigator !== 'undefined' &&
  /Mac|iPhone|iPad|iPod/i.test(navigator.userAgent)

const PAGES: { path: string; label: string; hint: string; icon: IconType }[] = [
  { path: '/', label: 'Home', hint: 'Hero, featured projects, contact', icon: Sparkles },
  { path: '/about', label: 'About', hint: 'Story, education, certificates', icon: User },
  { path: '/skills', label: 'Skills', hint: 'Languages, frameworks, tools', icon: Code2 },
  { path: '/projects', label: 'Projects', hint: 'Filterable showcase', icon: Briefcase },
  { path: '/experience', label: 'Experience', hint: 'Timeline of work', icon: GraduationCap },
  { path: '/contact', label: 'Contact', hint: 'Phone, email, message form', icon: Mail },
]

function copyToClipboard(value: string) {
  if (typeof navigator === 'undefined') return
  void navigator.clipboard?.writeText(value)
}

export function CommandPalette() {
  const navigate = useNavigate()
  const location = useLocation()
  const reduceMotion = useReducedMotion()
  const [open, setOpen] = useState(false)
  const [query, setQuery] = useState('')
  const [activeIndex, setActiveIndex] = useState(0)
  const inputRef = useRef<HTMLInputElement>(null)
  const lastFocusRef = useRef<HTMLElement | null>(null)

  const close = useCallback(() => {
    setOpen(false)
    setQuery('')
    setActiveIndex(0)
    lastFocusRef.current?.focus?.()
  }, [])

  const items = useMemo<CommandItem[]>(() => {
    const pageItems: CommandItem[] = PAGES.map((page) => ({
      id: `page:${page.path}`,
      label: `Go to ${page.label}`,
      hint: page.hint,
      icon: page.icon,
      keywords: `${page.label} ${page.hint}`.toLowerCase(),
      group: 'Pages',
      perform: () => navigate(page.path),
    }))

    const projectItems: CommandItem[] = resume.projects.map((project) => ({
      id: `project:${project.name}`,
      label: project.name,
      hint: project.tagline,
      icon: Briefcase,
      keywords: `${project.name} ${project.tagline} ${project.stack.join(' ')}`.toLowerCase(),
      group: 'Projects',
      perform: () => {
        const url = PROJECT_LINKS[project.name]
        if (url) {
          window.open(url, '_blank', 'noopener,noreferrer')
        } else {
          navigate('/projects')
        }
      },
    }))

    const actionItems: CommandItem[] = [
      {
        id: 'action:download-resume',
        label: 'Download resume (PDF)',
        hint: 'Latest CV',
        icon: Download,
        keywords: 'download resume cv pdf',
        group: 'Actions',
        perform: () => {
          window.open(CONTACT_LINKS.resumeHref, '_blank', 'noopener,noreferrer')
        },
      },
      {
        id: 'action:copy-email',
        label: 'Copy email address',
        hint: resume.personal.email,
        icon: Copy,
        keywords: `copy email ${resume.personal.email}`,
        group: 'Actions',
        perform: () => copyToClipboard(resume.personal.email),
      },
      {
        id: 'action:copy-phone',
        label: 'Copy phone number',
        hint: resume.personal.phone,
        icon: Copy,
        keywords: `copy phone ${resume.personal.phone}`,
        group: 'Actions',
        perform: () => copyToClipboard(resume.personal.phone),
      },
    ]

    const contactItems: CommandItem[] = [
      {
        id: 'contact:email',
        label: 'Email me',
        hint: resume.personal.email,
        icon: Mail,
        keywords: `email mail ${resume.personal.email}`,
        group: 'Contact',
        perform: () => {
          window.location.href = CONTACT_LINKS.emailHref
        },
      },
      {
        id: 'contact:phone',
        label: 'Call me',
        hint: resume.personal.phone,
        icon: Phone,
        keywords: 'call phone',
        group: 'Contact',
        perform: () => {
          window.location.href = CONTACT_LINKS.phoneHref
        },
      },
      {
        id: 'contact:github',
        label: 'Open GitHub',
        hint: resume.personal.github,
        icon: GithubIcon,
        keywords: 'github code repos',
        group: 'Contact',
        perform: () => window.open(CONTACT_LINKS.githubHref, '_blank', 'noopener,noreferrer'),
      },
      {
        id: 'contact:linkedin',
        label: 'Open LinkedIn',
        hint: resume.personal.linkedin,
        icon: LinkedinIcon,
        keywords: 'linkedin profile',
        group: 'Contact',
        perform: () => window.open(CONTACT_LINKS.linkedinHref, '_blank', 'noopener,noreferrer'),
      },
      {
        id: 'contact:location',
        label: 'View location on Maps',
        hint: resume.personal.location,
        icon: MapPin,
        keywords: 'location map ahmedabad',
        group: 'Contact',
        perform: () =>
          window.open(
            `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
              resume.personal.location,
            )}`,
            '_blank',
            'noopener,noreferrer',
          ),
      },
    ]

    return [...pageItems, ...actionItems, ...contactItems, ...projectItems]
  }, [navigate])

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase()
    if (!q) return items
    return items.filter((item) =>
      `${item.label} ${item.keywords ?? ''}`.toLowerCase().includes(q),
    )
  }, [items, query])

  const grouped = useMemo(() => {
    const groups = new Map<CommandItem['group'], CommandItem[]>()
    for (const item of filtered) {
      const list = groups.get(item.group) ?? []
      list.push(item)
      groups.set(item.group, list)
    }
    return Array.from(groups.entries())
  }, [filtered])

  useEffect(() => {
    setActiveIndex(0)
  }, [query])

  useEffect(() => {
    function onKey(event: KeyboardEvent) {
      const isOpenCombo =
        (event.key === 'k' || event.key === 'K') && (event.metaKey || event.ctrlKey)
      const isSlash = event.key === '/' && !event.metaKey && !event.ctrlKey && !open
      const target = event.target as HTMLElement | null
      const inEditable =
        target?.tagName === 'INPUT' ||
        target?.tagName === 'TEXTAREA' ||
        target?.isContentEditable

      if (isOpenCombo) {
        event.preventDefault()
        if (!open) {
          lastFocusRef.current = document.activeElement as HTMLElement | null
          setOpen(true)
        } else {
          close()
        }
        return
      }

      if (isSlash && !inEditable) {
        event.preventDefault()
        lastFocusRef.current = document.activeElement as HTMLElement | null
        setOpen(true)
      }
    }

    function onProgrammaticOpen() {
      lastFocusRef.current = document.activeElement as HTMLElement | null
      setOpen(true)
    }

    window.addEventListener('keydown', onKey)
    window.addEventListener(COMMAND_PALETTE_EVENT, onProgrammaticOpen)
    return () => {
      window.removeEventListener('keydown', onKey)
      window.removeEventListener(COMMAND_PALETTE_EVENT, onProgrammaticOpen)
    }
  }, [open, close])

  useEffect(() => {
    if (!open) return
    const id = window.setTimeout(() => inputRef.current?.focus(), 50)
    return () => window.clearTimeout(id)
  }, [open])

  // Close on route change (mouse-driven navigation)
  useEffect(() => {
    if (open) close()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [location.pathname])

  const runItem = useCallback(
    (item: CommandItem) => {
      item.perform()
      close()
    },
    [close],
  )

  function onInputKeyDown(event: React.KeyboardEvent<HTMLInputElement>) {
    if (event.key === 'ArrowDown') {
      event.preventDefault()
      setActiveIndex((idx) => Math.min(idx + 1, filtered.length - 1))
    } else if (event.key === 'ArrowUp') {
      event.preventDefault()
      setActiveIndex((idx) => Math.max(idx - 1, 0))
    } else if (event.key === 'Enter') {
      event.preventDefault()
      const item = filtered[activeIndex]
      if (item) runItem(item)
    } else if (event.key === 'Escape') {
      event.preventDefault()
      close()
    }
  }

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          key="cmdk"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: durations.fast, ease: easings.smooth }}
          className="fixed inset-0 z-[200] flex items-start justify-center px-4 pt-[12vh] sm:pt-[18vh]"
          role="dialog"
          aria-modal="true"
          aria-label="Command palette"
          onMouseDown={(e) => {
            if (e.target === e.currentTarget) close()
          }}
        >
          <motion.div
            aria-hidden="true"
            className="absolute inset-0 bg-background/70 backdrop-blur-sm"
            onClick={close}
          />
          <motion.div
            initial={
              reduceMotion
                ? { opacity: 0 }
                : { opacity: 0, y: -16, scale: 0.97, filter: 'blur(6px)' }
            }
            animate={
              reduceMotion
                ? { opacity: 1 }
                : { opacity: 1, y: 0, scale: 1, filter: 'blur(0px)' }
            }
            exit={
              reduceMotion
                ? { opacity: 0 }
                : { opacity: 0, y: -8, scale: 0.98, filter: 'blur(4px)' }
            }
            transition={{ duration: durations.base, ease: easings.emphasized }}
            className="relative w-full max-w-xl overflow-hidden rounded-2xl border border-border bg-card shadow-xl"
          >
            <div className="flex items-center gap-3 border-b border-border px-4 py-3">
              <Search className="h-4 w-4 text-muted-foreground" aria-hidden="true" />
              <input
                ref={inputRef}
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                onKeyDown={onInputKeyDown}
                type="text"
                placeholder="Type to search pages, actions, projects…"
                className="flex-1 bg-transparent text-sm text-foreground placeholder:text-muted-foreground focus:outline-none"
                aria-label="Search commands"
                autoComplete="off"
                spellCheck={false}
              />
              <kbd className="hidden rounded border border-border bg-background/60 px-1.5 py-0.5 text-[10px] font-semibold text-muted-foreground sm:inline-block">
                Esc
              </kbd>
            </div>

            <div
              className="max-h-[60vh] overflow-y-auto p-2"
              role="listbox"
              aria-label="Command results"
            >
              {filtered.length === 0 ? (
                <p className="px-4 py-8 text-center text-sm text-muted-foreground">
                  No results for "<span className="text-foreground">{query}</span>"
                </p>
              ) : (
                grouped.map(([group, list]) => (
                  <div key={group} className="mb-2 last:mb-0">
                    <p className="px-3 pb-1 pt-2 text-[10px] font-semibold uppercase tracking-[0.2em] text-muted-foreground">
                      {group}
                    </p>
                    <ul>
                      {list.map((item) => {
                        const overallIndex = filtered.indexOf(item)
                        const isActive = overallIndex === activeIndex
                        const Icon = item.icon
                        return (
                          <li key={item.id}>
                            <button
                              type="button"
                              role="option"
                              aria-selected={isActive}
                              onMouseEnter={() => setActiveIndex(overallIndex)}
                              onClick={() => runItem(item)}
                              className={`flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-left transition-colors ${
                                isActive
                                  ? 'bg-accent/15 text-foreground'
                                  : 'text-foreground/90 hover:bg-muted'
                              }`}
                            >
                              <span
                                className={`flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-lg ${
                                  isActive
                                    ? 'bg-accent/20 text-accent'
                                    : 'bg-muted text-muted-foreground'
                                }`}
                              >
                                <Icon className="h-4 w-4" />
                              </span>
                              <span className="flex flex-1 flex-col">
                                <span className="text-sm font-medium">{item.label}</span>
                                {item.hint && (
                                  <span className="text-[11px] text-muted-foreground">
                                    {item.hint}
                                  </span>
                                )}
                              </span>
                              {item.group === 'Projects' || item.group === 'Contact' ? (
                                <ExternalLink className="h-3.5 w-3.5 text-muted-foreground" />
                              ) : (
                                <ArrowRight className="h-3.5 w-3.5 text-muted-foreground" />
                              )}
                            </button>
                          </li>
                        )
                      })}
                    </ul>
                  </div>
                ))
              )}
            </div>

            <div className="flex items-center justify-between gap-3 border-t border-border bg-background/40 px-4 py-2 text-[11px] text-muted-foreground">
              <span className="inline-flex items-center gap-1.5">
                <CommandIcon className="h-3.5 w-3.5" />
                {isMac ? 'Cmd + K' : 'Ctrl + K'}
              </span>
              <span className="inline-flex items-center gap-2">
                <kbd className="rounded border border-border bg-background/60 px-1.5 py-0.5 font-semibold">
                  ↑
                </kbd>
                <kbd className="rounded border border-border bg-background/60 px-1.5 py-0.5 font-semibold">
                  ↓
                </kbd>
                navigate
                <kbd className="ml-2 rounded border border-border bg-background/60 px-1.5 py-0.5 font-semibold">
                  ↵
                </kbd>
                run
              </span>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}

export function useOpenCommandPalette() {
  return useCallback(() => {
    window.dispatchEvent(new CustomEvent(COMMAND_PALETTE_EVENT))
  }, [])
}
