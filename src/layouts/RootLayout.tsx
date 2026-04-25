import { useEffect } from 'react'
import { Outlet, useLocation } from 'react-router-dom'
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
    // Avoid non-standard scroll behavior values during route transitions
    window.scrollTo(0, 0)
    document.title =
      ROUTE_TITLES[location.pathname] ?? 'Chirag Singh — AI-Augmented Software Engineer'
  }, [location.pathname])

  return (
    <div className="relative min-h-screen bg-background text-foreground">
      <ScrollProgress />
      <Navbar />
      <main className="relative">
        <Outlet />
      </main>
      <Footer />
      <BackToTop />
    </div>
  )
}
