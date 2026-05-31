import { AnimatePresence, motion } from 'framer-motion'
import { Command as CommandIcon, Menu, X } from 'lucide-react'
import { useEffect, useRef, useState } from 'react'
import { NavLink, useLocation } from 'react-router-dom'
import { resume } from '../data/resume'
import { prefetchRoute } from '../lib/routes/prefetch'
import { durations, easings, springs } from '../motion'
import { useOpenCommandPalette } from './CommandPalette'
import { ThemeToggle } from './ThemeToggle'

interface NavLinkDef {
  to: string
  label: string
  end?: boolean
}

const NAV_LINKS: NavLinkDef[] = [
  { to: '/', label: 'Home', end: true },
  { to: '/about', label: 'About' },
  { to: '/skills', label: 'Skills' },
  { to: '/projects', label: 'Projects' },
  { to: '/experience', label: 'Experience' },
  { to: '/contact', label: 'Contact' },
]

const isMac =
  typeof navigator !== 'undefined' && /Mac|iPhone|iPad|iPod/i.test(navigator.userAgent)

export function Navbar() {
  const [open, setOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const location = useLocation()
  const toggleRef = useRef<HTMLButtonElement>(null)
  const openPalette = useOpenCommandPalette()

  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 16)
    handler()
    window.addEventListener('scroll', handler, { passive: true })
    return () => window.removeEventListener('scroll', handler)
  }, [])

  useEffect(() => {
    setOpen(false)
  }, [location.pathname])

  // Close mobile menu on Escape and return focus to its toggle.
  useEffect(() => {
    if (!open) return
    function onKey(e: KeyboardEvent) {
      if (e.key === 'Escape') {
        e.preventDefault()
        setOpen(false)
        toggleRef.current?.focus()
      }
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [open])

  const initials = resume.personal.name
    .split(' ')
    .map((part) => part[0])
    .join('')

  const linkPrefetch = (to: string) => ({
    onMouseEnter: () => prefetchRoute(to),
    onMouseDown: () => prefetchRoute(to),
    onFocus: () => prefetchRoute(to),
    onTouchStart: () => prefetchRoute(to),
  })

  return (
    <motion.header
      initial={{ y: -80, opacity: 0, filter: 'blur(8px)' }}
      animate={{ y: 0, opacity: 1, filter: 'blur(0px)' }}
      transition={{ duration: durations.medium, ease: easings.cinematic }}
      className={`sticky top-0 z-50 w-full transition-all duration-300 ${
        scrolled
          ? 'backdrop-blur-xl bg-background/70 border-b border-border shadow-sm'
          : 'bg-transparent'
      }`}
    >
      <nav
        className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3 sm:px-6 lg:px-8"
        aria-label="Primary"
      >
        <NavLink to="/" className="group flex items-center gap-3" {...linkPrefetch('/')}>
          <span className="relative flex h-10 w-10 items-center justify-center overflow-hidden rounded-xl bg-hero-gradient bg-[length:200%_200%] animate-gradient-shift font-display font-bold text-white shadow-md">
            <span className="relative z-10 text-sm tracking-widest">{initials}</span>
            <span className="absolute inset-0 bg-white/0 transition-colors duration-300 group-hover:bg-white/10" />
          </span>
          <span className="hidden flex-col leading-tight sm:flex">
            <span className="text-sm font-semibold text-foreground">
              {resume.personal.name}
            </span>
            <span className="text-[11px] font-medium uppercase tracking-widest text-muted-foreground">
              {resume.personal.title}
            </span>
          </span>
        </NavLink>

        <ul className="hidden items-center gap-1 md:flex">
          {NAV_LINKS.map((link) => (
            <li key={link.to}>
              <NavLink
                to={link.to}
                end={link.end}
                {...linkPrefetch(link.to)}
                className={({ isActive }) =>
                  `relative rounded-full px-4 py-2 text-sm font-medium transition-colors ${
                    isActive
                      ? 'text-foreground'
                      : 'text-muted-foreground hover:text-foreground'
                  }`
                }
              >
                {({ isActive }) => (
                  <>
                    {isActive && (
                      <motion.span
                        layoutId="nav-active"
                        transition={springs.layout}
                        className="absolute inset-0 -z-10 rounded-full bg-accent/15 ring-1 ring-accent/40"
                      />
                    )}
                    {link.label}
                  </>
                )}
              </NavLink>
            </li>
          ))}
        </ul>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={openPalette}
            className="hidden items-center gap-2 rounded-full border border-border bg-card/70 px-3 py-1.5 text-[11px] font-medium text-muted-foreground transition-colors hover:border-accent/50 hover:text-foreground md:inline-flex"
            aria-label="Open command palette"
            title="Open command palette"
          >
            <CommandIcon className="h-3.5 w-3.5" />
            <span>{isMac ? '⌘' : 'Ctrl'} K</span>
          </button>
          <ThemeToggle />
          <button
            ref={toggleRef}
            type="button"
            className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-border bg-card/70 text-foreground md:hidden"
            aria-label={open ? 'Close navigation' : 'Open navigation'}
            aria-expanded={open}
            aria-controls="primary-mobile-nav"
            onClick={() => setOpen((prev) => !prev)}
          >
            {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </nav>

      <AnimatePresence>
        {open && (
          <motion.div
            id="primary-mobile-nav"
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: durations.fast, ease: easings.smooth }}
            className="md:hidden overflow-hidden border-t border-border bg-background/90 backdrop-blur-xl"
          >
            <ul className="mx-auto flex max-w-7xl flex-col gap-1 px-4 py-4 sm:px-6">
              {NAV_LINKS.map((link, idx) => (
                <motion.li
                  key={link.to}
                  initial={{ opacity: 0, x: -20, filter: 'blur(4px)' }}
                  animate={{ opacity: 1, x: 0, filter: 'blur(0px)' }}
                  transition={{ delay: 0.05 * idx, duration: durations.fast, ease: easings.cinematic }}
                >
                  <NavLink
                    to={link.to}
                    end={link.end}
                    {...linkPrefetch(link.to)}
                    className={({ isActive }) =>
                      `block rounded-xl px-4 py-3 text-sm font-medium transition-colors ${
                        isActive
                          ? 'bg-accent/15 text-foreground ring-1 ring-accent/30'
                          : 'text-muted-foreground hover:bg-muted hover:text-foreground'
                      }`
                    }
                  >
                    {link.label}
                  </NavLink>
                </motion.li>
              ))}
              <li className="mt-2">
                <button
                  type="button"
                  onClick={openPalette}
                  className="flex w-full items-center justify-between gap-2 rounded-xl border border-border bg-card/70 px-4 py-3 text-sm font-medium text-foreground"
                >
                  <span className="inline-flex items-center gap-2">
                    <CommandIcon className="h-4 w-4 text-accent" />
                    Quick search
                  </span>
                  <span className="text-[11px] uppercase tracking-widest text-muted-foreground">
                    {isMac ? '⌘ K' : 'Ctrl K'}
                  </span>
                </button>
              </li>
            </ul>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.header>
  )
}
