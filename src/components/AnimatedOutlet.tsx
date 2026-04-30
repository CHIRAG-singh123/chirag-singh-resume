import { AnimatePresence } from 'framer-motion'
import { cloneElement } from 'react'
import { useLocation, useOutlet } from 'react-router-dom'

export function AnimatedOutlet() {
  const location = useLocation()
  const element = useOutlet()

  return (
    <AnimatePresence mode="wait">
      {element ? cloneElement(element, { key: location.pathname }) : null}
    </AnimatePresence>
  )
}
