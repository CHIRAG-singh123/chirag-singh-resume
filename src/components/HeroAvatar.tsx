import { AnimatePresence, motion, useReducedMotion } from 'framer-motion'
import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { CONTACT_LINKS } from '../data/resume'
import { getOrbitSkillIconScale } from '../lib/orbitIconScale'
import { getSkillIcon, type SkillIconGlyph } from '../lib/skillBrandIcons'
import { usePerfProfile } from '../lib/usePerfProfile'
import { durations, easings } from '../motion'
import { SkillIcon } from './SkillIcon'

const buildSrcSet = (sources: { src: string; width: number }[]) =>
  sources.map((source) => `${source.src} ${source.width}w`).join(', ')

const POPUP_DISMISS_MS = 2200
const POPUP_EDGE_PADDING = 12
const POPUP_VERTICAL_OFFSET = 10
const ORBIT_REVEAL_DELAY_MS = 34
const ORBIT_REVEAL_DELAY_COARSE_MS = 96
const ORBIT_REVEAL_BATCH_SIZE = 2

interface OrbitLogo {
  label: string
  popupLabel: string
  className: string
  sizeClass: string
}

interface PreparedOrbitLogo extends OrbitLogo {
  icon: SkillIconGlyph | null
  iconScale: number
}

interface OrbitRenderItem extends PreparedOrbitLogo {
  orbit: 'primary' | 'secondary'
  index: number
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

function decodePortrait(image: HTMLImageElement) {
  if (typeof image.decode !== 'function') return Promise.resolve()
  return image.decode().catch(() => undefined)
}

function prepareOrbitLogo(logo: OrbitLogo): PreparedOrbitLogo {
  return {
    ...logo,
    icon: getSkillIcon(logo.label),
    iconScale: getOrbitSkillIconScale(logo.label),
  }
}

export function HeroAvatar() {
  const shouldReduceMotion = useReducedMotion() ?? false
  const { coarseEffects, hardwareCoarse } = usePerfProfile()
  const portrait = CONTACT_LINKS.profileImage
  const rootRef = useRef<HTMLDivElement>(null)
  const portraitRef = useRef<HTMLImageElement>(null)
  const popupAnchorRef = useRef<HTMLDivElement>(null)
  const popupCardRef = useRef<HTMLDivElement>(null)
  const logoRefs = useRef(new Map<string, HTMLButtonElement>())
  const dismissTimerRef = useRef<number | null>(null)
  const orbitRevealTimerRef = useRef<number | null>(null)
  const orbitRevealFrameRef = useRef<number>(0)
  const popupTrackFrameRef = useRef<number>(0)
  const popupLogoRef = useRef<OrbitLogo | null>(null)
  const orbitPipelineStartedRef = useRef(false)
  const [popup, setPopup] = useState<OrbitLogo | null>(null)
  const [portraitReady, setPortraitReady] = useState(false)
  const [visiblePrimaryCount, setVisiblePrimaryCount] = useState(0)
  const [visibleSecondaryCount, setVisibleSecondaryCount] = useState(0)
  const [orbitSpinReady, setOrbitSpinReady] = useState(false)
  const motionReduced = shouldReduceMotion
  const primaryCounterSpinClass = motionReduced
    ? ''
    : 'motion-reduce:animate-none animate-[spin_28s_linear_infinite] [animation-direction:reverse]'
  const secondaryCounterSpinClass = motionReduced
    ? ''
    : 'motion-reduce:animate-none animate-[spin_33.6s_linear_infinite]'
  const orbitSpinEnabled = !motionReduced && orbitSpinReady
  const orbitRevealDelay = coarseEffects ? ORBIT_REVEAL_DELAY_COARSE_MS : ORBIT_REVEAL_DELAY_MS
  const haloClass = hardwareCoarse
    ? 'hidden'
    : motionReduced
      ? 'opacity-[0.18] blur-2xl'
      : 'opacity-40 blur-3xl animate-gradient-shift'
  const primaryOrbitLogos = useMemo(
    () => PRIMARY_ORBIT_LOGOS.map(prepareOrbitLogo),
    [],
  )
  const secondaryOrbitLogos = useMemo(
    () => SECONDARY_ORBIT_LOGOS.map(prepareOrbitLogo),
    [],
  )

  const orbitSequence = useMemo<OrbitRenderItem[]>(
    () => [
      ...primaryOrbitLogos.map((logo, index) => ({ ...logo, orbit: 'primary' as const, index })),
      ...secondaryOrbitLogos.map((logo, index) => ({
        ...logo,
        orbit: 'secondary' as const,
        index,
      })),
    ],
    [primaryOrbitLogos, secondaryOrbitLogos],
  )

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
    const image = portraitRef.current
    if (!image) return undefined

    let cancelled = false

    const markReady = () => {
      if (!cancelled) setPortraitReady(true)
    }

    const handleReady = () => {
      void decodePortrait(image).finally(markReady)
    }

    if (image.complete) {
      handleReady()
    } else {
      image.addEventListener('load', handleReady)
      image.addEventListener('error', markReady)
    }

    return () => {
      cancelled = true
      image.removeEventListener('load', handleReady)
      image.removeEventListener('error', markReady)
    }
  }, [])

  useEffect(
    () => () => {
      if (dismissTimerRef.current !== null) window.clearTimeout(dismissTimerRef.current)
      if (orbitRevealTimerRef.current !== null) window.clearTimeout(orbitRevealTimerRef.current)
      if (orbitRevealFrameRef.current) cancelAnimationFrame(orbitRevealFrameRef.current)
      if (popupTrackFrameRef.current) cancelAnimationFrame(popupTrackFrameRef.current)
    },
    [],
  )

  useEffect(() => {
    if (!portraitReady || orbitPipelineStartedRef.current) return

    orbitPipelineStartedRef.current = true

    const revealNext = (sequenceIndex: number) => {
      const batch = orbitSequence.slice(sequenceIndex, sequenceIndex + ORBIT_REVEAL_BATCH_SIZE)
      if (batch.length === 0) {
        orbitRevealFrameRef.current = requestAnimationFrame(() => {
          setOrbitSpinReady(true)
        })
        return
      }

      for (const item of batch) {
        if (item.orbit === 'primary') {
          setVisiblePrimaryCount((current) => Math.max(current, item.index + 1))
        } else {
          setVisibleSecondaryCount((current) => Math.max(current, item.index + 1))
        }
      }

      const nextIndex = sequenceIndex + ORBIT_REVEAL_BATCH_SIZE
      if (nextIndex >= orbitSequence.length) {
        orbitRevealFrameRef.current = requestAnimationFrame(() => {
          setOrbitSpinReady(true)
        })
        return
      }

      orbitRevealTimerRef.current = window.setTimeout(() => {
        orbitRevealFrameRef.current = requestAnimationFrame(() => revealNext(nextIndex))
      }, orbitRevealDelay)
    }

    orbitRevealFrameRef.current = requestAnimationFrame(() => revealNext(0))

    return () => {
      if (orbitRevealTimerRef.current !== null) {
        window.clearTimeout(orbitRevealTimerRef.current)
        orbitRevealTimerRef.current = null
      }
      if (orbitRevealFrameRef.current) {
        cancelAnimationFrame(orbitRevealFrameRef.current)
        orbitRevealFrameRef.current = 0
      }
    }
  }, [orbitRevealDelay, orbitSequence, portraitReady])

  useEffect(() => {
    if (!popup) return

    const handleResize = () => {
      const openLogo = popupLogoRef.current
      if (openLogo) syncPopupAnchor(openLogo)
    }

    const track = () => {
      const openLogo = popupLogoRef.current
      if (!openLogo) return
      syncPopupAnchor(openLogo)
      if (orbitSpinEnabled) {
        popupTrackFrameRef.current = requestAnimationFrame(track)
      }
    }

    handleResize()
    window.addEventListener('resize', handleResize)

    if (orbitSpinEnabled) {
      popupTrackFrameRef.current = requestAnimationFrame(track)
    }

    return () => {
      window.removeEventListener('resize', handleResize)
      if (popupTrackFrameRef.current) cancelAnimationFrame(popupTrackFrameRef.current)
      popupTrackFrameRef.current = 0
    }
  }, [orbitSpinEnabled, popup, syncPopupAnchor])

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
      className="relative mx-auto aspect-square w-64 overflow-visible sm:w-80 md:w-[22rem]"
    >
      <div
        className={`absolute inset-[-12%] rounded-full bg-hero-gradient bg-[length:300%_300%] ${haloClass}`}
        aria-hidden="true"
      />

      {visiblePrimaryCount > 0 ? (
        <div
          className={`pointer-events-none absolute inset-0 will-change-transform ${
            orbitSpinEnabled ? 'motion-reduce:animate-none animate-[spin_28s_linear_infinite]' : ''
          }`}
        >
          {primaryOrbitLogos.slice(0, visiblePrimaryCount).map((logo) => (
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
                  glyph={logo.icon}
                  tone="badge"
                  className={`${logo.sizeClass} max-h-full max-w-full shrink-0`}
                  style={{ transform: `scale(${logo.iconScale})` }}
                />
              </span>
            </button>
          ))}
        </div>
      ) : null}

      {visibleSecondaryCount > 0 ? (
        <div
          className={`pointer-events-none absolute inset-[-15%] will-change-transform ${
            orbitSpinEnabled
              ? 'motion-reduce:animate-none animate-[spin_33.6s_linear_infinite] [animation-direction:reverse]'
              : ''
          }`}
        >
          {secondaryOrbitLogos.slice(0, visibleSecondaryCount).map((logo) => (
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
                  glyph={logo.icon}
                  tone="badge"
                  className={`${logo.sizeClass} max-h-full max-w-full shrink-0`}
                  style={{ transform: `scale(${logo.iconScale})` }}
                />
              </span>
            </button>
          ))}
        </div>
      ) : null}

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
            ref={portraitRef}
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
              <span
                className={
                  coarseEffects
                    ? 'inline-flex max-w-full items-center justify-center rounded-full border border-border bg-card px-3.5 py-2 text-center text-[11px] font-semibold uppercase leading-snug tracking-[0.16em] text-foreground shadow-md whitespace-normal'
                    : 'inline-flex max-w-full items-center justify-center rounded-full border border-border bg-card/95 px-3.5 py-2 text-center text-[11px] font-semibold uppercase leading-snug tracking-[0.16em] text-foreground shadow-md backdrop-blur-sm whitespace-normal'
                }
              >
                {popup.popupLabel}
              </span>
            </motion.div>
          ) : null}
        </AnimatePresence>
      </div>
    </motion.div>
  )
}
