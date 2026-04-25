import { ArrowLeft, Ghost } from 'lucide-react'
import { Link } from 'react-router-dom'
import { GradientBlobs } from '../components/GradientBlobs'
import { PageTransition } from '../components/PageTransition'

export function NotFoundPage() {
  return (
    <PageTransition>
      <section className="relative overflow-hidden">
        <GradientBlobs />
        <div className="mx-auto flex min-h-[70vh] max-w-3xl flex-col items-center justify-center px-4 py-20 text-center sm:px-6 lg:px-8">
          <span className="flex h-20 w-20 items-center justify-center rounded-3xl bg-accent/15 text-accent">
            <Ghost className="h-9 w-9 animate-bounce" />
          </span>
          <h1 className="mt-6 font-display text-5xl font-bold text-foreground sm:text-6xl">
            404
          </h1>
          <p className="mt-3 max-w-md text-muted-foreground">
            This page didn't make the cut. Let's get you back on track.
          </p>
          <Link
            to="/"
            className="mt-8 inline-flex items-center gap-2 rounded-full bg-hero-gradient bg-[length:200%_200%] px-6 py-3 text-sm font-semibold text-white shadow-glow animate-gradient-shift hover:-translate-y-0.5 transition-transform"
          >
            <ArrowLeft className="h-4 w-4" /> Back home
          </Link>
        </div>
      </section>
    </PageTransition>
  )
}
