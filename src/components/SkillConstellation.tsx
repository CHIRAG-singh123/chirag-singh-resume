import {
  animate,
  AnimatePresence,
  motion,
  useAnimationFrame,
  useMotionValue,
  useMotionValueEvent,
  useReducedMotion,
  useTransform,
} from 'framer-motion'
import type { LucideIcon } from 'lucide-react'
import { Boxes, Code2, Cpu, Wrench } from 'lucide-react'
import {
  createElement,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ComponentType,
  type SVGProps,
} from 'react'
import type { SkillGroup } from '../lib/resume/types'
import { getBrandIcon } from '../lib/skillBrandIcons'
import { TypingText } from './TypingText'
import { siFillRelativeLuminance, siGlyphNeedsLightBackdrop } from '../lib/siGlyphVisibility'
import { durations, easings } from '../motion'

type IconType = ComponentType<SVGProps<SVGSVGElement> & { className?: string }>

interface SkillConstellationProps {
  groups: SkillGroup[]
}

const GROUP_ICONS: Record<string, LucideIcon> = {
  Languages: Code2,
  Frameworks: Boxes,
  Technologies: Cpu,
  Tools: Wrench,
}

/** Large enough that outer-ring nodes + hover scale stay inside the viewBox. */
const VIEW = 580
const CENTER = VIEW / 2

// Innermost ring → outermost ring. Padded so the labels don't clip
// the SVG bounding box.
const RING_RADII = [110, 165, 215, 255]
// Seconds for one full revolution per ring.
const ROTATION_DURATIONS = [80, 100, 130, 160]
// How long the popup stays visible before auto-dismissing.
const POPUP_DISMISS_MS = 2200
/** Viewport for nested brand / fallback glyph (Simple Icons use 0 0 24 24). */
const NODE_ICON_VIEW = 24
const NODE_ICON_HALF = NODE_ICON_VIEW / 2
/** Backing disc behind the glyph (slightly larger than the icon). */
const NODE_DISC_R = 14
/** Transparent hover/focus target — smaller r reduces unused SVG bbox. */
const NODE_HIT_R = 17

/** Stable ref for constellation hub typing (avoid remount loops from inline literals). */
const SKILL_CENTER_LABELS = ['SKILLS']

interface SimpleIconGlyphProps {
  xOffset: number
  yOffset: number
  size: number
  path: string
  hex: string
}

/** Simple Icons are single-color; boosts contrast on dark constellation chips. */
function SimpleIconGlyph({ xOffset, yOffset, size, path, hex }: SimpleIconGlyphProps) {
  const L = siFillRelativeLuminance(hex)
  const backdrop = siGlyphNeedsLightBackdrop(L)
  return (
    <svg x={xOffset} y={yOffset} width={size} height={size} viewBox="0 0 24 24" aria-hidden>
      {backdrop ? <circle cx={12} cy={12} r={10} fill="#f4f6fa" opacity={0.97} /> : null}
      <path fill={`#${hex}`} d={path} />
    </svg>
  )
}

/** Light inner pad + fixed 24×24 slot for multi-color SVGs (matplotlib, Java) on dark chips. */
function BrandRasterGlyph({
  xOffset,
  yOffset,
  size,
  src,
  alt,
}: {
  xOffset: number
  yOffset: number
  size: number
  src: string
  alt: string
}) {
  return (
    <svg
      x={xOffset}
      y={yOffset}
      width={size}
      height={size}
      viewBox="0 0 24 24"
      role="img"
      aria-label={alt}
    >
      <title>{alt}</title>
      <circle cx={12} cy={12} r={10.75} fill="#f4f6fa" opacity={0.98} />
      <image
        href={src}
        x={2}
        y={2}
        width={20}
        height={20}
        preserveAspectRatio="xMidYMid meet"
      />
    </svg>
  )
}

/** Fully-connected 3×2×2 MLP — square layout, theme colors, stays upright with ring counter-rotate. */
function NeuralNetGlyph({
  xOffset,
  yOffset,
  size,
}: {
  xOffset: number
  yOffset: number
  size: number
}) {
  const sw = 0.7
  return (
    <svg x={xOffset} y={yOffset} width={size} height={size} viewBox="0 0 24 24" aria-hidden>
      <g
        stroke="var(--color-muted-foreground)"
        strokeWidth={sw}
        strokeLinecap="round"
        opacity={0.62}
        fill="none"
      >
        <line x1="5" y1="7.2" x2="11.85" y2="9.1" />
        <line x1="5" y1="7.2" x2="11.85" y2="14.9" />
        <line x1="5" y1="12" x2="11.85" y2="9.1" />
        <line x1="5" y1="12" x2="11.85" y2="14.9" />
        <line x1="5" y1="16.8" x2="11.85" y2="9.1" />
        <line x1="5" y1="16.8" x2="11.85" y2="14.9" />
        <line x1="12.15" y1="9.1" x2="19" y2="10" />
        <line x1="12.15" y1="9.1" x2="19" y2="14" />
        <line x1="12.15" y1="14.9" x2="19" y2="10" />
        <line x1="12.15" y1="14.9" x2="19" y2="14" />
      </g>
      <circle cx="5" cy="7.2" r="2.15" fill="var(--color-chart-primary)" opacity={0.95} />
      <circle cx="5" cy="12" r="2.15" fill="var(--color-chart-secondary)" opacity={0.95} />
      <circle cx="5" cy="16.8" r="2.15" fill="var(--color-chart-tertiary)" opacity={0.95} />
      <circle cx="12" cy="9.1" r="2.45" fill="var(--color-accent)" opacity={0.92} />
      <circle cx="12" cy="14.9" r="2.45" fill="var(--color-accent-secondary)" opacity={0.92} />
      <circle cx="19" cy="10" r="2.2" fill="var(--color-chart-primary)" opacity={0.95} />
      <circle cx="19" cy="14" r="2.2" fill="var(--color-chart-secondary)" opacity={0.95} />
    </svg>
  )
}

function polar(cx: number, cy: number, r: number, angleRad: number) {
  return [cx + r * Math.cos(angleRad), cy + r * Math.sin(angleRad)] as const
}

interface NodeDatum {
  id: string
  label: string
  ring: number
  angle: number
  groupLabel: string
  Icon: IconType
}

interface PopupState {
  node: NodeDatum
}

export function SkillConstellation({ groups }: SkillConstellationProps) {
  const reduceMotion = useReducedMotion()

  const countMv = useMotionValue(0)
  const [hubCount, setHubCount] = useState(0)
  useMotionValueEvent(countMv, 'change', (v) => {
    setHubCount(Math.round(v))
  })

  // Per-ring rotation motion values (component supports up to 4 rings).
  const r0 = useMotionValue(0)
  const r1 = useMotionValue(0)
  const r2 = useMotionValue(0)
  const r3 = useMotionValue(0)
  const ringMVs = useMemo(() => [r0, r1, r2, r3], [r0, r1, r2, r3])
  /** Keep glyphs upright — ring groups rotate the whole orbit. */
  const negR0 = useTransform(r0, (deg) => -deg)
  const negR1 = useTransform(r1, (deg) => -deg)
  const negR2 = useTransform(r2, (deg) => -deg)
  const negR3 = useTransform(r3, (deg) => -deg)
  const negRingRotate = useMemo(() => [negR0, negR1, negR2, negR3], [negR0, negR1, negR2, negR3])

  const popupLeftPct = useMotionValue(0)
  const popupTopPct = useMotionValue(0)
  const popupLeft = useTransform(popupLeftPct, (v) => `${v}%`)
  const popupTop = useTransform(popupTopPct, (v) => `${v}%`)

  const [hoveredId, setHoveredId] = useState<string | null>(null)
  const [popup, setPopup] = useState<PopupState | null>(null)
  const dismissTimerRef = useRef<number | null>(null)
  /** Ref mirror of open popup node so rAF always reads latest without stale state. */
  const popupNodeRef = useRef<NodeDatum | null>(null)

  const nodes = useMemo<NodeDatum[]>(() => {
    const list: NodeDatum[] = []
    groups.forEach((group, ringIdx) => {
      const Icon = GROUP_ICONS[group.label] ?? Cpu
      const count = group.items.length
      group.items.forEach((item, i) => {
        const angle = (i / count) * Math.PI * 2 - Math.PI / 2
        list.push({
          id: `${group.label}-${item}`,
          label: item,
          ring: ringIdx,
          angle,
          groupLabel: group.label,
          Icon,
        })
      })
    })
    return list
  }, [groups])

  /** Hub number counts up when the section mounts (respects reduced motion). */
  useEffect(() => {
    const n = nodes.length
    if (reduceMotion) {
      countMv.set(n)
      setHubCount(n)
      return
    }
    countMv.set(0)
    setHubCount(0)
    const c = animate(countMv, n, { duration: 1.28, ease: [0.22, 1, 0.36, 1] })
    return () => c.stop()
  }, [nodes.length, reduceMotion, countMv])

  function syncPopupAnchor(node: NodeDatum) {
    const θdeg = ringMVs[node.ring]?.get() ?? 0
    const θrad = (θdeg * Math.PI) / 180
    const totalAngle = node.angle + θrad
    const [x, y] = polar(CENTER, CENTER, RING_RADII[node.ring]!, totalAngle)
    popupLeftPct.set((x / VIEW) * 100)
    popupTopPct.set((y / VIEW) * 100)
  }

  // Drive ring rotation from a single rAF loop. Popup anchor follows the
  // moving node via motion values (no React re-render per frame).
  useAnimationFrame((time) => {
    if (!reduceMotion) {
      ringMVs.forEach((mv, i) => {
        const dir = i % 2 === 0 ? 1 : -1
        const durMs = (ROTATION_DURATIONS[i] ?? 100) * 1000
        mv.set(((time / durMs) * 360 * dir) % 360)
      })
    }
    const open = popupNodeRef.current
    if (open) {
      syncPopupAnchor(open)
    }
  })

  // Always clean up any pending dismiss timer.
  useEffect(
    () => () => {
      if (dismissTimerRef.current !== null) {
        window.clearTimeout(dismissTimerRef.current)
      }
    },
    [],
  )

  function showPopup(node: NodeDatum) {
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
  }

  function clearHover(nodeId: string) {
    // Only clear if we're still tracking this node — protects against
    // pointer leaving node A immediately before entering node B.
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

  return (
    <div className="relative mx-auto w-full max-w-[640px]">
      <div className="relative aspect-square w-full">
        <svg
          overflow="visible"
          viewBox={`0 0 ${VIEW} ${VIEW}`}
          role="img"
          aria-label={`Skills orbit: ${nodes.length} items in ${groups.length} groups. Select a node on a ring for its name.`}
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

          {/* Glow core */}
          <circle cx={CENTER} cy={CENTER} r={70} fill="url(#skill-core)" />

          {/* Rings */}
          {RING_RADII.map((r, i) => (
            <motion.circle
              key={`ring-${i}`}
              cx={CENTER}
              cy={CENTER}
              r={r}
              fill="none"
              stroke="url(#skill-ring)"
              strokeOpacity="0.3"
              strokeDasharray="3 6"
              strokeWidth={1}
              initial={{ pathLength: 0, opacity: 0 }}
              animate={{ pathLength: 1, opacity: 1 }}
              transition={{
                pathLength: { duration: 1.1, ease: easings.cinematic, delay: i * 0.08 },
                opacity: { duration: 0.5, delay: i * 0.08 },
              }}
            />
          ))}

          {/* Per-ring rotating group of nodes */}
          {RING_RADII.map((r, i) => {
            const ringNodes = nodes.filter((n) => n.ring === i)
            if (ringNodes.length === 0) return null
            return (
              <motion.g
                key={`ring-nodes-${i}`}
                style={{
                  rotate: ringMVs[i],
                  transformBox: 'fill-box',
                  transformOrigin: 'center',
                }}
              >
                {ringNodes.map((node, idx) => {
                  const [x, y] = polar(CENTER, CENTER, r, node.angle)
                  const active = hoveredId === node.id
                  const brand = getBrandIcon(node.label)
                  const foSize = NODE_DISC_R * 2
                  return (
                    <motion.g
                      key={node.id}
                      initial={{ opacity: 0, scale: 0 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{
                        duration: durations.base,
                        ease: easings.entrance,
                        delay: 0.4 + idx * 0.04 + i * 0.05,
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
                      {/* Larger transparent hit area so the dot is easy to hover */}
                      <circle
                        cx={x}
                        cy={y}
                        r={NODE_HIT_R}
                        fill="transparent"
                        pointerEvents="all"
                      />
                      <g transform={`translate(${x} ${y})`} pointerEvents="none">
                        <motion.g
                          style={{
                            rotate: negRingRotate[i]!,
                            transformOrigin: '0px 0px',
                          }}
                        >
                          <motion.g
                            animate={{ scale: active ? 1.12 : 1 }}
                            transition={{ type: 'spring', stiffness: 420, damping: 28 }}
                            style={{ transformOrigin: '0px 0px' }}
                          >
                            <circle
                              cx={0}
                              cy={0}
                              r={NODE_DISC_R}
                              fill="var(--color-card)"
                              stroke="var(--color-border)"
                              strokeWidth={active ? 2 : 1}
                            />
                            {brand ? (
                              brand.kind === 'si' ? (
                                <SimpleIconGlyph
                                  xOffset={-NODE_ICON_HALF}
                                  yOffset={-NODE_ICON_HALF}
                                  size={NODE_ICON_VIEW}
                                  path={brand.path}
                                  hex={brand.hex}
                                />
                              ) : brand.kind === 'neuralNet' ? (
                                <NeuralNetGlyph
                                  xOffset={-NODE_ICON_HALF}
                                  yOffset={-NODE_ICON_HALF}
                                  size={NODE_ICON_VIEW}
                                />
                              ) : (
                                <BrandRasterGlyph
                                  xOffset={-NODE_ICON_HALF}
                                  yOffset={-NODE_ICON_HALF}
                                  size={NODE_ICON_VIEW}
                                  src={brand.src}
                                  alt={brand.alt}
                                />
                              )
                            ) : (
                              <foreignObject
                                x={-NODE_DISC_R}
                                y={-NODE_DISC_R}
                                width={foSize}
                                height={foSize}
                                className="overflow-visible"
                              >
                                {/* XHTML namespace is required inside foreignObject; React's div types omit `xmlns`. */}
                                <div
                                  className="pointer-events-none flex h-7 w-7 items-center justify-center rounded-full border border-border bg-card text-accent"
                                  // @ts-expect-error — valid on foreignObject HTML wrapper
                                  xmlns="http://www.w3.org/1999/xhtml"
                                >
                                  {createElement(node.Icon, {
                                    className: 'h-3.5 w-3.5',
                                    'aria-hidden': true,
                                  })}
                                </div>
                              </foreignObject>
                            )}
                          </motion.g>
                        </motion.g>
                      </g>
                    </motion.g>
                  )
                })}
              </motion.g>
            )
          })}

          {/* Centre badge — text lives in HTML overlay for hero-matched typing */}
          <motion.g
            initial={reduceMotion ? undefined : { opacity: 0.88, scale: 0.94 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.58, ease: easings.cinematic, delay: reduceMotion ? 0 : 0.18 }}
          >
            <motion.circle
              cx={CENTER}
              cy={CENTER}
              r={54}
              fill="none"
              stroke="var(--color-accent)"
              strokeWidth={3.5}
              initial={{ opacity: reduceMotion ? 0.34 : 0 }}
              animate={
                reduceMotion
                  ? { opacity: 0.34 }
                  : { opacity: [0.14, 0.42, 0.14] }
              }
              transition={
                reduceMotion
                  ? { duration: 0.4 }
                  : { duration: 3.2, repeat: Infinity, ease: 'easeInOut' }
              }
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
            initial={reduceMotion ? undefined : { opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.52, delay: reduceMotion ? 0 : 0.2, ease: easings.cinematic }}
          >
            <span className="inline-block font-display text-[clamp(1.2rem,5.5vw,1.55rem)] font-bold leading-none tabular-nums tracking-tight">
              <span className="block bg-hero-gradient bg-[length:200%_200%] bg-clip-text text-transparent animate-gradient-shift">
                {hubCount}
              </span>
            </span>
            <span className="mt-1.5 inline-block bg-hero-gradient bg-[length:200%_200%] bg-clip-text text-transparent animate-gradient-shift">
              <TypingText
                phrases={SKILL_CENTER_LABELS}
                loop={false}
                typingSpeed={40}
                startDelayMs={440}
                className="font-display text-[clamp(0.75rem,3.15vw,1.05rem)] font-bold tracking-wide uppercase"
              />
            </span>
          </motion.div>
        </div>

        {/* Hover popup — styled like the hero "OPEN TO OPPORTUNITIES" pill */}
        <AnimatePresence>
          {popup && (
            <motion.div
              key={popup.node.id}
              initial={{ opacity: 0, y: 6, scale: 0.92, filter: 'blur(4px)' }}
              animate={{ opacity: 1, y: 0, scale: 1, filter: 'blur(0px)' }}
              exit={{ opacity: 0, y: 4, scale: 0.95, filter: 'blur(3px)' }}
              transition={{ duration: durations.fast, ease: easings.cinematic }}
              className="pointer-events-none absolute z-10"
              style={{
                left: popupLeft,
                top: popupTop,
                transform: 'translate(-50%, calc(-100% - 18px))',
              }}
            >
              <span className="inline-flex items-center whitespace-nowrap rounded-full border border-border bg-card/95 px-4 py-1.5 text-xs font-semibold uppercase tracking-widest text-foreground shadow-md backdrop-blur">
                {popup.node.label}
              </span>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Group legend */}
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

      {/* Live announcement of currently focused node */}
      <p className="sr-only" aria-live="polite">
        {popup ? `${popup.node.label}, ${popup.node.groupLabel}` : ''}
      </p>
    </div>
  )
}
