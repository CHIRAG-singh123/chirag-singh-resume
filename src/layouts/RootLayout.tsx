import { useEffect } from 'react'
import { useLocation } from 'react-router-dom'
import { AnimatedOutlet } from '../components/AnimatedOutlet'
import { BackToTop } from '../components/BackToTop'
import { Footer } from '../components/Footer'
import { Navbar } from '../components/Navbar'
import { ScrollProgress } from '../components/ScrollProgress'

const ROUTE_TITLES: Record<string, string> = {
  '/': 'Chirag Singh — AI-Augmented Software Engineer',
  '/about': 'About — Chirag Singh',
  '/skills': 'Skills — Chirag Singh',
  '/projects': 'Projects — Chirag Singh',
  '/experience': 'Experience — Chirag Singh',
  '/contact': 'Contact — Chirag Singh',
}

export function RootLayout() {
  const location = useLocation()

  useEffect(() => {
    window.scrollTo(0, 0)
    document.title =
      ROUTE_TITLES[location.pathname] ?? 'Chirag Singh — AI-Augmented Software Engineer'
  }, [location.pathname])

  return (
    <div className="relative min-h-screen bg-background text-foreground">
      <ScrollProgress />
      <Navbar />
      <main className="relative">
        <AnimatedOutlet />
      </main>
      <Footer />
      <BackToTop />
    </div>
  )
}
