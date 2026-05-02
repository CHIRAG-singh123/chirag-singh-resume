import { AnimatePresence, motion } from 'framer-motion'
import { ArrowUp } from 'lucide-react'
import { useEffect, useState } from 'react'
import { createPortal } from 'react-dom'
import { cinematicTransition, durations, springs } from '../motion'

export function BackToTop() {
  const [visible, setVisible] = useState(false)
  const [mounted, setMounted] = useState(false)

  useEffect(() => setMounted(true), [])

  useEffect(() => {
    const onScroll = () => setVisible(window.scrollY > 320)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  const floatingButton = (
    <AnimatePresence>
      {visible && (
        <motion.button
          type="button"
          initial={{ opacity: 0, scale: 0.7, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.7, y: 20 }}
          transition={cinematicTransition(durations.fast)}
          whileHover={{ scale: 1.08, y: -4, transition: springs.hover }}
          whileTap={{ scale: 0.92, transition: springs.tap }}
          onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
          aria-label="Back to top"
          className="back-to-top-button !fixed !left-auto !overflow-visible bottom-[max(1.25rem,env(safe-area-inset-bottom,0px))] right-[max(1.25rem,env(safe-area-inset-right,0px))] z-[100] inline-flex h-12 w-12 shrink-0 items-center justify-center rounded-full border border-white/10 bg-hero-gradient bg-[length:200%_200%] text-white shadow-glow animate-gradient-shift focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background sm:bottom-8 sm:right-8"
        >
          <ArrowUp className="h-5 w-5" />
        </motion.button>
      )}
    </AnimatePresence>
  )

  if (!mounted) return null

  return createPortal(floatingButton, document.body)
}
