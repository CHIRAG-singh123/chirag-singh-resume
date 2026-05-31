import { useEffect } from 'react'
import { useLocation } from 'react-router-dom'
import { AnimatedOutlet } from '../components/AnimatedOutlet'
import { BackToTop } from '../components/BackToTop'
import { CommandPalette } from '../components/CommandPalette'
import { Footer } from '../components/Footer'
import { Navbar } from '../components/Navbar'
import { ScrollProgress } from '../components/ScrollProgress'
import { prefetchRoutes } from '../lib/routes/prefetch'
import { PersonJsonLd } from '../lib/seo/JsonLd'

const HEAVY_ROUTE_PATHS = ['/', '/about', '/skills', '/projects'] as const

export function RootLayout() {
  const location = useLocation()

  useEffect(() => {
    window.scrollTo(0, 0)
  }, [location.pathname])

  useEffect(() => {
    const warmRoutes = () => prefetchRoutes(HEAVY_ROUTE_PATHS)
    const idleWindow = window as Window &
      typeof globalThis & {
        requestIdleCallback?: (callback: IdleRequestCallback, options?: IdleRequestOptions) => number
        cancelIdleCallback?: (handle: number) => void
      }

    if (typeof idleWindow.requestIdleCallback === 'function') {
      const handle = idleWindow.requestIdleCallback(() => warmRoutes(), { timeout: 600 })
      return () => idleWindow.cancelIdleCallback?.(handle)
    }

    const handle = window.setTimeout(warmRoutes, 60)
    return () => window.clearTimeout(handle)
  }, [])

  return (
    <div className="relative min-h-screen bg-background text-foreground">
      <a href="#main-content" className="skip-link">
        Skip to main content
      </a>
      <PersonJsonLd />
      <ScrollProgress />
      <Navbar />
      <main id="main-content" tabIndex={-1} className="relative">
        <AnimatedOutlet />
      </main>
      <Footer />
      <BackToTop />
      <CommandPalette />
    </div>
  )
}
