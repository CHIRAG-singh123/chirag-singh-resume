import { AnimatePresence, motion, useReducedMotion } from 'framer-motion'
import { useCallback, useEffect, useRef, useState } from 'react'
import { CONTACT_LINKS } from '../data/resume'
import { durations, easings } from '../motion'
import { SkillIcon } from './SkillIcon'

const buildSrcSet = (sources: { src: string; width: number }[]) =>
  sources.map((s) => `${s.src} ${s.width}w`).join(', ')

const POPUP_DISMISS_MS = 2200
const POPUP_EDGE_PADDING = 12
const POPUP_VERTICAL_OFFSET = 10

interface OrbitLogo {
  label: string
  popupLabel: string
  className: string
  sizeClass: string
}

const PRIMARY_ORBIT_LOGOS: OrbitLogo[] = [
  {
    label: 'Keras',
    popupLabel: 'Keras',
    className: 'left-1/2 top-0 -translate-x-1/2 -translate-y-1/2',
    sizeClass: 'h-8 w-8',
  },
  {
    label: 'TensorFlow',
    popupLabel: 'TensorFlow',
    className: 'right-[12%] top-[13%] translate-x-1/2 -translate-y-1/2',
    sizeClass: 'h-7 w-7',
  },
  {
    label: 'MERN',
    popupLabel: 'MERN (MongoDB, Express.js, React, Node.js)',
    className: 'right-0 top-1/2 translate-x-1/2 -translate-y-1/2',
    sizeClass: 'h-7 w-7',
  },
  {
    label: 'Python',
    popupLabel: 'Python',
    className: 'right-[16%] bottom-[10%] translate-x-1/2 translate-y-1/2',
    sizeClass: 'h-7 w-7',
  },
  {
    label: 'API Integration',
    popupLabel: 'API Integration',
    className: 'left-[34%] bottom-[1%] -translate-x-1/2 translate-y-1/2',
    sizeClass: 'h-7 w-7',
  },
  {
    label: 'Flutter',
    popupLabel: 'Flutter',
    className: 'left-0 top-[58%] -translate-x-1/2 -translate-y-1/2',
    sizeClass: 'h-8 w-8',
  },
  {
    label: 'Angular',
    popupLabel: 'Angular',
    className: 'left-[15%] top-[16%] -translate-x-1/2 -translate-y-1/2',
    sizeClass: 'h-7 w-7',
  },
]

const SECONDARY_ORBIT_LOGOS: OrbitLogo[] = [
  {
    label: 'NLP',
    popupLabel: 'NLP',
    className: 'left-1/2 top-[2%] -translate-x-1/2 -translate-y-1/2',
    sizeClass: 'h-7 w-7',
  },
  {
    label: 'JavaScript',
    popupLabel: 'JavaScript',
    className: 'right-[12%] top-[16%] translate-x-1/2 -translate-y-1/2',
    sizeClass: 'h-7 w-7',
  },
  {
    label: 'NumPy',
    popupLabel: 'NumPy',
    className: 'right-[1%] top-[49%] translate-x-1/2 -translate-y-1/2',
    sizeClass: 'h-7 w-7',
  },
  {
    label: 'Django',
    popupLabel: 'Django',
    className: 'right-[17%] bottom-[7%] translate-x-1/2 translate-y-1/2',
    sizeClass: 'h-7 w-7',
  },
  {
    label: 'TQMD',
    popupLabel: 'TQDM',
    className: 'left-[23%] bottom-[4%] -translate-x-1/2 translate-y-1/2',
    sizeClass: 'h-7 w-7',
  },
  {
    label: 'React',
    popupLabel: 'React',
    className: 'left-[1%] top-[58%] -translate-x-1/2 -translate-y-1/2',
    sizeClass: 'h-7 w-7',
  },
  {
    label: 'Laravel',
    popupLabel: 'Laravel',
    className: 'left-[13%] top-[19%] -translate-x-1/2 -translate-y-1/2',
    sizeClass: 'h-7 w-7',
  },
]

export function HeroAvatar() {
  const shouldReduceMotion = useReducedMotion() ?? false
  const portrait = CONTACT_LINKS.profileImage
  const rootRef = useRef<HTMLDivElement>(null)
  const popupAnchorRef = useRef<HTMLDivElement>(null)
  const popupCardRef = useRef<HTMLDivElement>(null)
  const logoRefs = useRef(new Map<string, HTMLButtonElement>())
  const dismissTimerRef = useRef<number | null>(null)
  const popupLogoRef = useRef<OrbitLogo | null>(null)
  const rafPopupRef = useRef<number>(0)
  const [popup, setPopup] = useState<OrbitLogo | null>(null)
  const primaryCounterSpinClass = shouldReduceMotion
    ? ''
    : 'motion-reduce:animate-none animate-[spin_28s_linear_infinite] [animation-direction:reverse]'
  const secondaryCounterSpinClass = shouldReduceMotion
    ? ''
    : 'motion-reduce:animate-none animate-[spin_33.6s_linear_infinite]'
  const orbitSpinEnabled = !shouldReduceMotion

  const syncPopupAnchor = useCallback((logo: OrbitLogo) => {
    const root = rootRef.current
    const button = logoRefs.current.get(logo.label)
    const wrap = popupAnchorRef.current
    if (!root || !button || !wrap) return

    const rootRect = root.getBoundingClientRect()
    const buttonRect = button.getBoundingClientRect()
    const centerX = buttonRect.left + buttonRect.width / 2 - rootRect.left
    const centerY = buttonRect.top + buttonRect.height / 2 - rootRect.top
    const popupWidth = popupCardRef.current?.offsetWidth ?? 0
    const popupHeight = popupCardRef.current?.offsetHeight ?? 0
    const minCenterX = POPUP_EDGE_PADDING + popupWidth / 2
    const maxCenterX = rootRect.width - POPUP_EDGE_PADDING - popupWidth / 2
    const clampedCenterX = popupWidth
      ? Math.min(Math.max(centerX, minCenterX), maxCenterX)
      : centerX
    const shouldShowBelow = popupHeight
      ? centerY - popupHeight - POPUP_VERTICAL_OFFSET < POPUP_EDGE_PADDING
      : false

    wrap.style.left = `${clampedCenterX}px`
    wrap.style.top = `${centerY}px`
    wrap.style.transform = shouldShowBelow
      ? `translate(-50%, ${POPUP_VERTICAL_OFFSET}px)`
      : `translate(-50%, calc(-100% - ${POPUP_VERTICAL_OFFSET}px))`
  }, [])

  useEffect(() => {
    if (!popup) return

    const handleResize = () => {
      const openLogo = popupLogoRef.current
      if (openLogo) syncPopupAnchor(openLogo)
    }

    handleResize()
    window.addEventListener('resize', handleResize)

    if (!orbitSpinEnabled) {
      return () => window.removeEventListener('resize', handleResize)
    }

    const tick = () => {
      const openLogo = popupLogoRef.current
      if (!openLogo) return
      syncPopupAnchor(openLogo)
      rafPopupRef.current = requestAnimationFrame(tick)
    }

    rafPopupRef.current = requestAnimationFrame(tick)
    return () => {
      window.removeEventListener('resize', handleResize)
      if (rafPopupRef.current) cancelAnimationFrame(rafPopupRef.current)
      rafPopupRef.current = 0
    }
  }, [orbitSpinEnabled, popup, syncPopupAnchor])

  useEffect(
    () => () => {
      if (dismissTimerRef.current !== null) window.clearTimeout(dismissTimerRef.current)
      if (rafPopupRef.current) cancelAnimationFrame(rafPopupRef.current)
    },
    [],
  )

  function showPopup(logo: OrbitLogo) {
    if (dismissTimerRef.current !== null) {
      window.clearTimeout(dismissTimerRef.current)
      dismissTimerRef.current = null
    }

    popupLogoRef.current = logo
    setPopup(logo)
    syncPopupAnchor(logo)
    requestAnimationFrame(() => syncPopupAnchor(logo))
  }

  function clearPopup(logoLabel: string) {
    dismissTimerRef.current = window.setTimeout(() => {
      if (popupLogoRef.current?.label !== logoLabel) return
      popupLogoRef.current = null
      setPopup(null)
      dismissTimerRef.current = null
    }, POPUP_DISMISS_MS)
  }

  return (
    <motion.div
      ref={rootRef}
      initial={{ opacity: 0, scale: 0.8, rotate: shouldReduceMotion ? 0 : -6 }}
      animate={{ opacity: 1, scale: 1, rotate: 0 }}
      transition={{ duration: durations.slow, ease: easings.cinematic }}
      className="relative mx-auto aspect-square w-64 sm:w-80 md:w-[22rem]"
    >
      <div
        className="absolute inset-[-12%] rounded-full bg-hero-gradient bg-[length:300%_300%] opacity-40 blur-3xl animate-gradient-shift"
        aria-hidden="true"
      />

      <div
        className="pointer-events-none absolute inset-0 will-change-transform motion-reduce:animate-none animate-[spin_28s_linear_infinite]"
      >
        {PRIMARY_ORBIT_LOGOS.map((logo) => (
          <button
            key={logo.label}
            ref={(element) => {
              if (element) logoRefs.current.set(logo.label, element)
              else logoRefs.current.delete(logo.label)
            }}
            type="button"
            onMouseEnter={() => showPopup(logo)}
            onMouseLeave={() => clearPopup(logo.label)}
            onFocus={() => showPopup(logo)}
            onBlur={() => clearPopup(logo.label)}
            aria-label={logo.popupLabel}
            className={`pointer-events-auto absolute z-[2] flex items-center justify-center rounded-full bg-transparent p-0 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent/60 ${logo.className} ${logo.sizeClass}`}
          >
            <span className={primaryCounterSpinClass}>
              <SkillIcon
                label={logo.label}
                tone="orbit"
                className={`${logo.sizeClass} shrink-0`}
                aria-hidden
              />
            </span>
          </button>
        ))}
      </div>

      <div
        className="pointer-events-none absolute inset-[-15%] will-change-transform motion-reduce:animate-none animate-[spin_33.6s_linear_infinite] [animation-direction:reverse]"
      >
        {SECONDARY_ORBIT_LOGOS.map((logo) => (
          <button
            key={logo.label}
            ref={(element) => {
              if (element) logoRefs.current.set(logo.label, element)
              else logoRefs.current.delete(logo.label)
            }}
            type="button"
            onMouseEnter={() => showPopup(logo)}
            onMouseLeave={() => clearPopup(logo.label)}
            onFocus={() => showPopup(logo)}
            onBlur={() => clearPopup(logo.label)}
            aria-label={logo.popupLabel}
            className={`pointer-events-auto absolute z-[2] flex items-center justify-center rounded-full bg-transparent p-0 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent/60 ${logo.className} ${logo.sizeClass}`}
          >
            <span className={secondaryCounterSpinClass}>
              <SkillIcon
                label={logo.label}
                tone="orbit"
                className={`${logo.sizeClass} shrink-0`}
                aria-hidden
              />
            </span>
          </button>
        ))}
      </div>

      <div className="absolute inset-6 overflow-hidden rounded-full border border-border bg-card shadow-xl">
        <picture>
          <source
            type="image/avif"
            srcSet={buildSrcSet(portrait.avif)}
            sizes={portrait.sizes}
          />
          <source
            type="image/webp"
            srcSet={buildSrcSet(portrait.webp)}
            sizes={portrait.sizes}
          />
          <img
            src={portrait.fallback}
            alt={portrait.alt}
            width={portrait.width}
            height={portrait.height}
            fetchPriority="high"
            loading="eager"
            decoding="async"
            className="h-full w-full object-cover"
          />
        </picture>
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-tr from-accent/10 via-transparent to-accent-secondary/20 mix-blend-overlay" />
      </div>

      <div
        ref={popupAnchorRef}
        className="pointer-events-none absolute z-[3]"
        style={{ transform: 'translate(-50%, calc(-100% - 8px))' }}
      >
        <AnimatePresence>
          {popup ? (
            <motion.div
              ref={popupCardRef}
              key={popup.label}
              initial={{ opacity: 0, y: 6, scale: 0.96 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 4, scale: 0.98 }}
              transition={{ duration: durations.fast, ease: easings.cinematic }}
              className="max-w-[min(18rem,calc(100vw-2rem))]"
            >
              <span className="inline-flex max-w-full items-center justify-center rounded-full border border-border bg-card/95 px-3.5 py-2 text-center text-[11px] font-semibold uppercase leading-snug tracking-[0.16em] text-foreground shadow-md backdrop-blur-sm whitespace-normal">
                {popup.popupLabel}
              </span>
            </motion.div>
          ) : null}
        </AnimatePresence>
      </div>
    </motion.div>
  )
}
