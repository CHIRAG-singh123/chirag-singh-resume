import { motion } from 'framer-motion'
import { CONTACT_LINKS } from '../data/resume'

export function HeroAvatar() {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.8, rotate: -6 }}
      animate={{ opacity: 1, scale: 1, rotate: 0 }}
      transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
      className="relative mx-auto aspect-square w-64 sm:w-80 md:w-[22rem]"
    >
      <div
        className="absolute inset-[-12%] rounded-full bg-hero-gradient bg-[length:300%_300%] opacity-40 blur-3xl animate-gradient-shift"
        aria-hidden="true"
      />

      <motion.div
        className="absolute inset-0 rounded-full border border-dashed border-accent/40"
        animate={{ rotate: 360 }}
        transition={{ repeat: Infinity, duration: 28, ease: 'linear' }}
      >
        <span className="absolute -top-1.5 left-1/2 h-3 w-3 -translate-x-1/2 rounded-full bg-accent shadow-glow" />
      </motion.div>
      <motion.div
        className="absolute inset-3 rounded-full border border-dashed border-accent-secondary/40"
        animate={{ rotate: -360 }}
        transition={{ repeat: Infinity, duration: 22, ease: 'linear' }}
      >
        <span className="absolute bottom-0 left-1/2 h-2.5 w-2.5 -translate-x-1/2 rounded-full bg-accent-secondary shadow-glow-secondary" />
      </motion.div>

      <div className="absolute inset-6 overflow-hidden rounded-full border border-border bg-card shadow-xl">
        <img
          src={CONTACT_LINKS.profileImage}
          alt="Chirag Singh"
          className="h-full w-full object-cover"
          loading="eager"
          decoding="async"
        />
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-tr from-accent/10 via-transparent to-accent-secondary/20 mix-blend-overlay" />
      </div>

      <motion.span
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.7 }}
        className="absolute -bottom-4 left-1/2 -translate-x-1/2 whitespace-nowrap rounded-full border border-border bg-card/90 px-4 py-1.5 text-xs font-semibold uppercase tracking-widest text-foreground shadow-md backdrop-blur"
      >
        <span className="mr-2 inline-block h-2 w-2 rounded-full bg-chart-positive animate-pulse" />
        Open to Opportunities
      </motion.span>
    </motion.div>
  )
}
