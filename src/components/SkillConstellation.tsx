import {
  animate,
  AnimatePresence,
  motion,
  useInView,
  useMotionValue,
  useMotionValueEvent,
  useReducedMotion,
} from 'framer-motion'
import type { LucideIcon } from 'lucide-react'
import { Boxes, Code2, Cpu, Wrench } from 'lucide-react'
import { createElement, useCallback, useEffect, useMemo, useRef, useState } from 'react'
import type { SkillIconGlyph } from '../lib/skillBrandIcons'
import { getOrbitSkillIconScale } from '../lib/orbitIconScale'
import { getSkillIcon } from '../lib/skillBrandIcons'
import type { SkillGroup } from '../lib/resume/types'
import { durations, easings } from '../motion'
import { SkillIcon } from './SkillIcon'
import { TypingText } from './TypingText'

interface SkillConstellationProps {
  /** Resume skill groups - one node per item; hub count = total items (e.g. 27). */
  groups: SkillGroup[]
  coarseEffects?: boolean
}

const GROUP_ICONS: Record<string, LucideIcon> = {
  Languages: Code2,
  Frameworks: Boxes,
  Technologies: Cpu,
  Tools: Wrench,
}

/** Large enough that outer-ring nodes + hover scale stay inside the viewBox. */
const VIEW = 720
const CENTER = VIEW / 2

const RING_RADII = [126, 188, 242, 286]
const ROTATION_DURATIONS = [80, 100, 130, 160]
const POPUP_DISMISS_MS = 2200
const SIZE_MORE = 1.4
const NODE_HIT_R = Math.round(18 * 1.45 * SIZE_MORE)
const NODE_ICON_BASE_PX = Math.round(15 * 1.45 * SIZE_MORE)

const SKILL_CENTER_LABELS = ['SKILLS']

function polar(cx: number, cy: number, r: number, angleRad: number) {
  return [cx + r * Math.cos(angleRad), cy + r * Math.sin(angleRad)] as const
}

interface RingNodeDatum {
  fallbackIcon: LucideIcon
  groupLabel: string
  icon: SkillIconGlyph | null
  iconScale: number
  id: string
  label: string
  x: number
  y: number
}

interface RingDatum {
  clockwise: boolean
  durationSeconds: number
  nodes: RingNodeDatum[]
  radius: number
  ringIndex: number
}

interface PopupState {
  node: RingNodeDatum
}

export function SkillConstellation({
  groups,
  coarseEffects = false,
}: SkillConstellationProps) {
  const reduceMotion = useReducedMotion() ?? false
  const rootRef = useRef<HTMLDivElement>(null)
  const stageRef = useRef<HTMLDivElement>(null)
  const svgRef = useRef<SVGSVGElement>(null)
  const popupAnchorRef = useRef<HTMLDivElement>(null)
  const anchorCircleRefs = useRef(new Map<string, SVGCircleElement>())
  const dismissTimerRef = useRef<number | null>(null)
  const popupNodeRef = useRef<RingNodeDatum | null>(null)
  const rafPopupRef = useRef<number>(0)
  const inView = useInView(rootRef, { amount: 0.1 })

  const [hoveredId, setHoveredId] = useState<string | null>(null)
  const [popup, setPopup] = useState<PopupState | null>(null)

  const countMv = useMotionValue(0)
  const [hubCount, setHubCount] = useState(0)
  useMotionValueEvent(countMv, 'change', (value) => {
    setHubCount(Math.round(value))
  })

  const ringData = useMemo<RingDatum[]>(
    () =>
      groups.map((group, ringIndex) => {
        const fallbackIcon = GROUP_ICONS[group.label] ?? Cpu
        const radius = RING_RADII[ringIndex] ?? RING_RADII[RING_RADII.length - 1]
        const nodeCount = group.items.length

        return {
          clockwise: ringIndex % 2 === 0,
          durationSeconds: ROTATION_DURATIONS[ringIndex] ?? 100,
          radius,
          ringIndex,
          nodes: group.items.map((item, itemIndex) => {
            const angle = (itemIndex / nodeCount) * Math.PI * 2 - Math.PI / 2
            const [x, y] = polar(0, 0, radius, angle)

            return {
              fallbackIcon,
              groupLabel: group.label,
              icon: getSkillIcon(item),
              iconScale: getOrbitSkillIconScale(item),
              id: `${group.label}-${item}`,
              label: item,
              x,
              y,
            }
          }),
        }
      }),
    [groups],
  )

  const totalNodes = useMemo(
    () => ringData.reduce((count, ring) => count + ring.nodes.length, 0),
    [ringData],
  )

  const staticVisuals = reduceMotion || coarseEffects
  const orbitSpinEnabled = !staticVisuals
  const hubGradientClass = staticVisuals ? '' : 'skill-hub-gradient-anim'
  const hubLabelAnimated = !staticVisuals

  useEffect(() => {
    if (staticVisuals) {
      countMv.set(totalNodes)
      return
    }

    countMv.set(0)
    const controls = animate(countMv, totalNodes, {
      duration: 1.28,
      ease: [0.22, 1, 0.36, 1],
    })
    return () => controls.stop()
  }, [countMv, staticVisuals, totalNodes])

  const syncPopupAnchor = useCallback((node: RingNodeDatum) => {
    const stage = stageRef.current
    const circle = anchorCircleRefs.current.get(node.id)
    const wrap = popupAnchorRef.current
    if (!stage || !circle || !wrap) return

    const stageRect = stage.getBoundingClientRect()
    const circleRect = circle.getBoundingClientRect()
    const centerX = circleRect.left + circleRect.width / 2 - stageRect.left
    const centerY = circleRect.top + circleRect.height / 2 - stageRect.top

    wrap.style.left = `${centerX}px`
    wrap.style.top = `${centerY}px`
  }, [])

  useEffect(() => {
    const svg = svgRef.current
    if (!svg || !orbitSpinEnabled) return
    if (inView) svg.unpauseAnimations()
    else svg.pauseAnimations()
  }, [inView, orbitSpinEnabled])

  useEffect(() => {
    if (!popup) return

    const handleResize = () => {
      const openNode = popupNodeRef.current
      if (openNode) syncPopupAnchor(openNode)
    }

    handleResize()
    window.addEventListener('resize', handleResize)

    if (!orbitSpinEnabled) {
      return () => window.removeEventListener('resize', handleResize)
    }

    const tick = () => {
      const openNode = popupNodeRef.current
      if (!openNode) return
      syncPopupAnchor(openNode)
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
      if (dismissTimerRef.current !== null) {
        window.clearTimeout(dismissTimerRef.current)
      }
      if (rafPopupRef.current) cancelAnimationFrame(rafPopupRef.current)
    },
    [],
  )

  function showPopup(node: RingNodeDatum) {
    setHoveredId(node.id)
    popupNodeRef.current = node
    syncPopupAnchor(node)
    setPopup({ node })

    if (dismissTimerRef.current !== null) {
      window.clearTimeout(dismissTimerRef.current)
    }

    dismissTimerRef.current = window.setTimeout(() => {
      popupNodeRef.current = null
      setPopup(null)
      dismissTimerRef.current = null
    }, POPUP_DISMISS_MS)

    requestAnimationFrame(() => syncPopupAnchor(node))
  }

  function clearHover(nodeId: string) {
    setHoveredId((current) => (current === nodeId ? null : current))
    setPopup((current) => {
      if (current?.node.id !== nodeId) return current
      popupNodeRef.current = null
      return null
    })

    if (dismissTimerRef.current !== null) {
      window.clearTimeout(dismissTimerRef.current)
      dismissTimerRef.current = null
    }
  }

  const shellClass = [
    'relative mx-auto w-full max-w-[640px]',
    !inView ? 'skill-const-pause' : '',
    coarseEffects ? 'skill-orbit-coarse' : '',
  ]
    .filter(Boolean)
    .join(' ')

  return (
    <div ref={rootRef} className={shellClass}>
      <div
        ref={stageRef}
        className="relative aspect-square w-full"
        style={{ contain: 'layout paint' }}
      >
        <svg
          ref={svgRef}
          overflow="visible"
          viewBox={`0 0 ${VIEW} ${VIEW}`}
          role="img"
          aria-label={`Skills orbit: ${totalNodes} items in ${groups.length} groups. Select a node on a ring for its name.`}
          className="absolute inset-0 block h-full w-full"
        >
          <defs>
            <radialGradient id="skill-core" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor="var(--color-accent)" stopOpacity="0.6" />
              <stop offset="60%" stopColor="var(--color-accent)" stopOpacity="0.15" />
              <stop offset="100%" stopColor="var(--color-accent)" stopOpacity="0" />
            </radialGradient>
            <linearGradient id="skill-ring" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="var(--color-accent)" stopOpacity="0.6" />
              <stop offset="100%" stopColor="var(--color-accent-secondary)" stopOpacity="0.6" />
            </linearGradient>
          </defs>

          <circle cx={CENTER} cy={CENTER} r={70} fill="url(#skill-core)" />

          {ringData.map((ring, ringIndex) => (
            <motion.circle
              key={`ring-${ring.ringIndex}`}
              cx={CENTER}
              cy={CENTER}
              r={ring.radius}
              fill="none"
              stroke="url(#skill-ring)"
              strokeOpacity="0.3"
              strokeDasharray="3 6"
              strokeWidth={1}
              initial={staticVisuals ? undefined : { pathLength: 0, opacity: 0 }}
              animate={staticVisuals ? undefined : { pathLength: 1, opacity: 1 }}
              transition={{
                pathLength: {
                  duration: 1.1,
                  ease: easings.cinematic,
                  delay: staticVisuals ? 0 : ringIndex * 0.08,
                },
                opacity: { duration: 0.5, delay: staticVisuals ? 0 : ringIndex * 0.08 },
              }}
            />
          ))}

          {ringData.map((ring) => (
            <g key={`ring-nodes-${ring.ringIndex}`} transform={`translate(${CENTER} ${CENTER})`}>
              <g>
                {orbitSpinEnabled ? (
                  <animateTransform
                    attributeName="transform"
                    type="rotate"
                    from="0 0 0"
                    to={ring.clockwise ? '360 0 0' : '-360 0 0'}
                    dur={`${ring.durationSeconds}s`}
                    repeatCount="indefinite"
                  />
                ) : null}

                {ring.nodes.map((node, nodeIndex) => {
                  const active = hoveredId === node.id
                  const iconSize = Math.round(NODE_ICON_BASE_PX * node.iconScale)
                  const iconOffset = iconSize / 2

                  return (
                    <motion.g
                      key={node.id}
                      initial={staticVisuals ? undefined : { opacity: 0, scale: 0.92 }}
                      animate={staticVisuals ? undefined : { opacity: 1, scale: 1 }}
                      transition={{
                        duration: staticVisuals ? 0 : durations.base,
                        ease: easings.entrance,
                        delay: staticVisuals
                          ? 0
                          : 0.24 + nodeIndex * 0.025 + ring.ringIndex * 0.05,
                      }}
                      onMouseEnter={() => showPopup(node)}
                      onMouseLeave={() => clearHover(node.id)}
                      onFocus={() => showPopup(node)}
                      onBlur={() => clearHover(node.id)}
                      style={{ cursor: 'pointer' }}
                      tabIndex={0}
                      role="button"
                      aria-label={`${node.label} — ${node.groupLabel}`}
                    >
                      <title>
                        {node.label} — {node.groupLabel}
                      </title>
                      <circle
                        ref={(element) => {
                          if (element) anchorCircleRefs.current.set(node.id, element)
                          else anchorCircleRefs.current.delete(node.id)
                        }}
                        cx={node.x}
                        cy={node.y}
                        r={NODE_HIT_R}
                        fill="transparent"
                        pointerEvents="all"
                      />
                      <g transform={`translate(${node.x} ${node.y})`} pointerEvents="none">
                        <g>
                          {orbitSpinEnabled ? (
                            <animateTransform
                              attributeName="transform"
                              type="rotate"
                              from="0 0 0"
                              to={ring.clockwise ? '-360 0 0' : '360 0 0'}
                              dur={`${ring.durationSeconds}s`}
                              repeatCount="indefinite"
                            />
                          ) : null}
                          <g className={`orbit-node-scale ${active ? 'is-active' : ''}`}>
                            {node.icon ? (
                              <SkillIcon
                                glyph={node.icon}
                                tone="orbit"
                                x={-iconOffset}
                                y={-iconOffset}
                                width={iconSize}
                                height={iconSize}
                                aria-hidden
                              />
                            ) : (
                              createElement(node.fallbackIcon, {
                                x: -iconOffset,
                                y: -iconOffset,
                                width: iconSize,
                                height: iconSize,
                                className: 'skill-icon-orbit max-h-full max-w-full shrink-0',
                                'aria-hidden': true,
                              })
                            )}
                          </g>
                        </g>
                      </g>
                    </motion.g>
                  )
                })}
              </g>
            </g>
          ))}

          <motion.g
            initial={staticVisuals ? undefined : { opacity: 0.88, scale: 0.94 }}
            animate={staticVisuals ? undefined : { opacity: 1, scale: 1 }}
            transition={{ duration: 0.58, ease: easings.cinematic, delay: staticVisuals ? 0 : 0.18 }}
          >
            <circle
              cx={CENTER}
              cy={CENTER}
              r={54}
              fill="none"
              stroke="var(--color-accent)"
              strokeWidth={3.5}
              className={staticVisuals ? 'opacity-[0.34]' : 'skill-hub-ring-pulse'}
            />
            <circle
              cx={CENTER}
              cy={CENTER}
              r={48}
              fill="var(--color-card)"
              stroke="var(--color-accent)"
              strokeWidth={1.5}
            />
          </motion.g>
        </svg>

        <div className="pointer-events-none absolute inset-0 z-[1] flex items-center justify-center">
          <motion.div
            className="flex max-w-[36%] flex-col items-center justify-center text-center sm:max-w-[32%]"
            initial={staticVisuals ? undefined : { opacity: 0, y: 8 }}
            animate={staticVisuals ? undefined : { opacity: 1, y: 0 }}
            transition={{ duration: 0.52, delay: staticVisuals ? 0 : 0.2, ease: easings.cinematic }}
          >
            <span className="inline-block font-display text-[clamp(1.2rem,5.5vw,1.55rem)] font-bold leading-none tabular-nums tracking-tight">
              <span
                className={`block bg-hero-gradient bg-[length:200%_200%] bg-clip-text text-transparent ${hubGradientClass}`}
              >
                {hubCount}
              </span>
            </span>
            <span
              className={`mt-1.5 inline-block bg-hero-gradient bg-[length:200%_200%] bg-clip-text text-transparent ${hubGradientClass}`}
            >
              {hubLabelAnimated ? (
                <TypingText
                  phrases={SKILL_CENTER_LABELS}
                  loop={false}
                  typingSpeed={40}
                  startDelayMs={440}
                  className="font-display text-[clamp(0.75rem,3.15vw,1.05rem)] font-bold uppercase tracking-wide"
                />
              ) : (
                <span className="font-display text-[clamp(0.75rem,3.15vw,1.05rem)] font-bold uppercase tracking-wide">
                  {SKILL_CENTER_LABELS[0]}
                </span>
              )}
            </span>
          </motion.div>
        </div>

        <div
          ref={popupAnchorRef}
          className="pointer-events-none absolute z-10"
          style={{ transform: 'translate(-50%, calc(-100% - 8px))' }}
        >
          <AnimatePresence>
            {popup && (
              <motion.div
                key={popup.node.id}
                initial={staticVisuals ? undefined : { opacity: 0, y: 6, scale: 0.96 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 4, scale: 0.98 }}
                transition={{ duration: durations.fast, ease: easings.cinematic }}
              >
                <span
                  className={
                    staticVisuals
                      ? 'inline-flex items-center whitespace-nowrap rounded-full border border-border bg-card px-4 py-1.5 text-xs font-semibold uppercase tracking-widest text-foreground shadow-md'
                      : 'inline-flex items-center whitespace-nowrap rounded-full border border-border bg-card/95 px-4 py-1.5 text-xs font-semibold uppercase tracking-widest text-foreground shadow-md backdrop-blur-sm'
                  }
                >
                  {popup.node.label}
                </span>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      <ul className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-4">
        {groups.map((group) => {
          const Icon = GROUP_ICONS[group.label] ?? Cpu
          return (
            <li
              key={group.label}
              className="flex items-center gap-2 rounded-xl border border-border bg-card/70 px-3 py-2 text-xs font-medium text-foreground"
            >
              <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-accent/15 text-accent">
                <Icon className="h-3.5 w-3.5" />
              </span>
              <span>
                <span className="block">{group.label}</span>
                <span className="text-[10px] uppercase tracking-widest text-muted-foreground">
                  {group.items.length} items
                </span>
              </span>
            </li>
          )
        })}
      </ul>

      <p className="sr-only" aria-live="polite">
        {popup ? `${popup.node.label}, ${popup.node.groupLabel}` : ''}
      </p>
    </div>
  )
}
