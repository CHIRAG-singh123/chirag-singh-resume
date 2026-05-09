import { useEffect } from 'react'
import { useLocation } from 'react-router-dom'
import { AnimatedOutlet } from '../components/AnimatedOutlet'
import { BackToTop } from '../components/BackToTop'
import { CommandPalette } from '../components/CommandPalette'
import { Footer } from '../components/Footer'
import { Navbar } from '../components/Navbar'
import { ScrollProgress } from '../components/ScrollProgress'
import { PersonJsonLd } from '../lib/seo/JsonLd'

export function RootLayout() {
  const location = useLocation()

  useEffect(() => {
    window.scrollTo(0, 0)
  }, [location.pathname])

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
