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
import { getOrbitDeviconFontScale } from '../lib/orbitIconScale'
import { getSkillIcon } from '../lib/skillBrandIcons'
import { ComputerVisionEyeGlyph } from './ComputerVisionEyeGlyph'
import { DeepLearningBrainGlyph } from './DeepLearningBrainGlyph'
import { GanNeuralGlyph } from './GanNeuralGlyph'
import { ImageIoGlyph } from './ImageIoGlyph'
import { TqdmGlyph } from './TqdmGlyph'
import { TypingText } from './TypingText'
import { durations, easings } from '../motion'

type IconType = ComponentType<SVGProps<SVGSVGElement> & { className?: string }>

interface SkillConstellationProps {
  /** Resume skill groups — one node per item; hub count = total items (e.g. 27). */
  groups: SkillGroup[]
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

// Innermost ring → outermost ring. Radii kept so nodes + hover scale stay inside viewBox.
const RING_RADII = [126, 188, 242, 286]
// Seconds for one full revolution per ring.
const ROTATION_DURATIONS = [80, 100, 130, 160]
// How long the popup stays visible before auto-dismissing.
const POPUP_DISMISS_MS = 2200
/** Layout radius for foreignObject / custom SVG glyphs (icons have no visible ring). */
const SIZE_MORE = 1.4
const NODE_DISC_R = Math.round(15 * 1.45 * SIZE_MORE)
const NODE_HIT_R = Math.round(18 * 1.45 * SIZE_MORE)
const ORBIT_DEVICON_PX = Math.round(15 * 1.45 * SIZE_MORE)

/** Stable ref for constellation hub typing (avoid remount loops from inline literals). */
const SKILL_CENTER_LABELS = ['SKILLS']

function posMod360(deg: number): number {
  return ((deg % 360) + 360) % 360
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
    const ringR = RING_RADII[node.ring]!
    const [lx, ly] = polar(0, 0, ringR, totalAngle)
    const x = CENTER + lx
    const y = CENTER + ly
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
        mv.set(posMod360((time / durMs) * 360 * dir))
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

          {/* Per-ring rotating group: translate to hub, rotate around (0,0) */}
          {RING_RADII.map((r, i) => {
            const ringNodes = nodes.filter((n) => n.ring === i)
            if (ringNodes.length === 0) return null
            return (
              <g key={`ring-nodes-${i}`} transform={`translate(${CENTER} ${CENTER})`}>
                <motion.g
                  style={{
                    rotate: ringMVs[i],
                    transformOrigin: '0px 0px',
                  }}
                >
                  {ringNodes.map((node, idx) => {
                    const [x, y] = polar(0, 0, r, node.angle)
                    const active = hoveredId === node.id
                    const skillIcon = getSkillIcon(node.label)
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
                              animate={{ scale: active ? 1.08 : 1 }}
                              transition={{ type: 'spring', stiffness: 420, damping: 28 }}
                              style={{ transformOrigin: '0px 0px' }}
                            >
                              {skillIcon?.kind === 'ganNeural' ? (
                                <GanNeuralGlyph
                                  x={-NODE_DISC_R}
                                  y={-NODE_DISC_R}
                                  width={foSize}
                                  height={foSize}
                                />
                              ) : skillIcon?.kind === 'tqdmLogo' ? (
                                <TqdmGlyph
                                  x={-NODE_DISC_R}
                                  y={-NODE_DISC_R}
                                  width={foSize}
                                  height={foSize}
                                />
                              ) : skillIcon?.kind === 'deepLearningBrain' ? (
                                <DeepLearningBrainGlyph
                                  x={-NODE_DISC_R}
                                  y={-NODE_DISC_R}
                                  width={foSize}
                                  height={foSize}
                                />
                              ) : skillIcon?.kind === 'computerVisionEye' ? (
                                <ComputerVisionEyeGlyph
                                  x={-NODE_DISC_R}
                                  y={-NODE_DISC_R}
                                  width={foSize}
                                  height={foSize}
                                />
                              ) : skillIcon?.kind === 'imageIoGlyph' ? (
                                <ImageIoGlyph
                                  x={-NODE_DISC_R}
                                  y={-NODE_DISC_R}
                                  width={foSize}
                                  height={foSize}
                                />
                              ) : skillIcon?.kind === 'devicon' ? (
                                <foreignObject
                                  x={-NODE_DISC_R}
                                  y={-NODE_DISC_R}
                                  width={foSize}
                                  height={foSize}
                                  className="overflow-visible"
                                  pointerEvents="none"
                                >
                                  <div
                                    className="pointer-events-none flex h-full w-full items-center justify-center bg-transparent"
                                    // @ts-expect-error — valid on foreignObject HTML wrapper
                                    xmlns="http://www.w3.org/1999/xhtml"
                                  >
                                    <i
                                      className={`${skillIcon.iconClass} colored skill-ion-lift`}
                                      style={{
                                        fontSize: Math.round(
                                          ORBIT_DEVICON_PX * getOrbitDeviconFontScale(node.label),
                                        ),
                                        lineHeight: 1,
                                      }}
                                      aria-hidden
                                    />
                                  </div>
                                </foreignObject>
                              ) : (
                                <foreignObject
                                  x={-NODE_DISC_R}
                                  y={-NODE_DISC_R}
                                  width={foSize}
                                  height={foSize}
                                  className="overflow-visible"
                                >
                                  <div
                                    className="pointer-events-none flex h-full w-full items-center justify-center bg-transparent text-accent"
                                    // @ts-expect-error — valid on foreignObject HTML wrapper
                                    xmlns="http://www.w3.org/1999/xhtml"
                                  >
                                    {createElement(node.Icon, {
                                      width: ORBIT_DEVICON_PX,
                                      height: ORBIT_DEVICON_PX,
                                      className: 'max-h-full max-w-full shrink-0',
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
              </g>
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
