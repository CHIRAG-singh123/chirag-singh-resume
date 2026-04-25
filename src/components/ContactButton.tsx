import { motion } from 'framer-motion'
import type { ComponentType, SVGProps } from 'react'

type IconComponent = ComponentType<SVGProps<SVGSVGElement> & { className?: string }>

interface ContactButtonProps {
  href: string
  icon: IconComponent
  label: string
  sublabel?: string
  external?: boolean
  variant?: 'solid' | 'outline'
}

export function ContactButton({
  href,
  icon: Icon,
  label,
  sublabel,
  external,
  variant = 'outline',
}: ContactButtonProps) {
  const base =
    'group relative flex items-center gap-3 rounded-2xl px-5 py-3 transition-all focus:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2'
  const style =
    variant === 'solid'
      ? 'bg-accent text-accent-foreground shadow-glow hover:shadow-xl'
      : 'border border-border bg-card/70 text-foreground backdrop-blur hover:border-accent/50 hover:bg-accent/10'
  return (
    <motion.a
      whileHover={{ y: -3 }}
      whileTap={{ scale: 0.97 }}
      href={href}
      target={external ? '_blank' : undefined}
      rel={external ? 'noopener noreferrer' : undefined}
      className={`${base} ${style}`}
    >
      <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-accent/15 text-accent transition-colors group-hover:bg-accent group-hover:text-accent-foreground">
        <Icon className="h-5 w-5" />
      </span>
      <span className="flex flex-col text-left leading-tight">
        <span className="text-sm font-semibold">{label}</span>
        {sublabel && (
          <span className="text-xs font-medium text-muted-foreground">{sublabel}</span>
        )}
      </span>
    </motion.a>
  )
}
