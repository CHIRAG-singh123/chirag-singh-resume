import { motion, useInView, useMotionValue, useReducedMotion, useSpring } from 'framer-motion'
import { useEffect, useRef } from 'react'
import type { LucideIcon } from 'lucide-react'
import { cinematicTransition, durations, springs } from '../motion'

interface StatCardProps {
  icon: LucideIcon
  value: number
  suffix?: string
  label: string
  delay?: number
}

export function StatCard({ icon: Icon, value, suffix = '+', label, delay = 0 }: StatCardProps) {
  const ref = useRef<HTMLDivElement | null>(null)
  const inView = useInView(ref, { once: true, amount: 0.4 })
  const shouldReduceMotion = useReducedMotion()
  const motionValue = useMotionValue(0)
  const spring = useSpring(motionValue, { damping: 22, stiffness: 110 })
  const numberRef = useRef<HTMLSpanElement | null>(null)

  useEffect(() => {
    if (!inView) return
    if (shouldReduceMotion) {
      motionValue.jump(value)
      if (numberRef.current) numberRef.current.textContent = value.toString()
      return
    }
    motionValue.set(value)
  }, [inView, motionValue, shouldReduceMotion, value])

  useEffect(() => {
    return spring.on('change', (latest) => {
      if (numberRef.current) {
        numberRef.current.textContent = Math.round(latest).toString()
      }
    })
  }, [spring])

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 24, filter: 'blur(6px)' }}
      whileInView={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
      viewport={{ once: true, amount: 0.3 }}
      transition={cinematicTransition(durations.medium, delay)}
      whileHover={{ y: -4, transition: springs.hover }}
      className="relative overflow-hidden rounded-2xl border border-border bg-card p-5 shadow-sm transition-[border-color,box-shadow] duration-300 hover:border-accent/50 hover:shadow-lg"
    >
      <div className="flex items-center gap-3">
        <span className="inline-flex h-10 w-10 items-center justify-center rounded-xl bg-accent/15 text-accent">
          <Icon className="h-5 w-5" />
        </span>
        <div className="flex items-baseline gap-1">
          <span
            ref={numberRef}
            className="font-display text-3xl font-bold text-foreground"
          >
            0
          </span>
          <span className="font-display text-xl font-bold text-accent">{suffix}</span>
        </div>
      </div>
      <p className="mt-2 text-sm text-muted-foreground">{label}</p>
      <span
        aria-hidden="true"
        className="pointer-events-none absolute -right-10 -top-10 h-28 w-28 rounded-full bg-accent/10 blur-2xl"
      />
    </motion.div>
  )
}
