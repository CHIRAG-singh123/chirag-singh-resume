import { motion, type Variants } from 'framer-motion'
import type { ReactNode } from 'react'
import {
  itemVariants,
  listStagger,
  sectionVariants,
  sectionVariantsCinematic,
  sectionVariantsSoft,
  viewport as defaultViewport,
} from '../motion'

type SectionVariant = 'soft' | 'medium' | 'cinematic'

interface AnimatedSectionProps {
  children: ReactNode
  className?: string
  delay?: number
  once?: boolean
  as?: 'section' | 'div' | 'article' | 'header'
  variant?: SectionVariant
  viewportAmount?: number
  stagger?: boolean
}

const variantMap: Record<SectionVariant, Variants> = {
  soft: sectionVariantsSoft,
  medium: sectionVariants,
  cinematic: sectionVariantsCinematic,
}

export function AnimatedSection({
  children,
  className,
  delay = 0,
  once = true,
  as = 'section',
  variant = 'medium',
  viewportAmount,
  stagger = false,
}: AnimatedSectionProps) {
  const MotionTag = motion[as]
  const baseVariants = variantMap[variant]

  const computedVariants: Variants = stagger
    ? {
        hidden: baseVariants.hidden,
        show: {
          ...(typeof baseVariants.show === 'object' && baseVariants.show !== null
            ? baseVariants.show
            : {}),
          transition: {
            ...(typeof baseVariants.show === 'object' &&
            baseVariants.show !== null &&
            'transition' in baseVariants.show &&
            typeof baseVariants.show.transition === 'object'
              ? baseVariants.show.transition
              : {}),
            staggerChildren: 0.08,
            delayChildren: 0.06,
          },
        },
      }
    : baseVariants

  return (
    <MotionTag
      variants={computedVariants}
      initial="hidden"
      whileInView="show"
      viewport={{ once, amount: viewportAmount ?? defaultViewport.amount }}
      transition={{ delay }}
      className={className}
    >
      {children}
    </MotionTag>
  )
}

export const staggerContainer: Variants = listStagger
export const staggerItem: Variants = itemVariants
