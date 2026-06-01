// Per-route dynamic import map. Calling a value pre-warms that route chunk
// (the lazy() wrapper de-dupes the import internally). Use it from
// hover/focus/intersection handlers so navigation feels instantaneous.

type Loader = () => Promise<unknown>

const warmedRoutes = new Set<string>()

export const ROUTE_PREFETCHERS: Record<string, Loader> = {
  '/': () => import('../../pages/HomePage'),
  '/about': () => import('../../pages/AboutPage'),
  '/skills': () => import('../../pages/SkillsPage'),
  '/projects': () => import('../../pages/ProjectsPage'),
  '/experience': () => import('../../pages/ExperiencePage'),
  '/contact': () => import('../../pages/ContactPage'),
}

export function prefetchRoute(path: string) {
  const warm = (resolvedPath: string, loader: Loader) => {
    if (warmedRoutes.has(resolvedPath)) return
    warmedRoutes.add(resolvedPath)
    void loader().catch(() => {
      warmedRoutes.delete(resolvedPath)
    })
  }

  // Match the pathname against known prefetchers. For dynamic segments
  // (e.g. /projects/:slug) fall back to the parent route.
  const direct = ROUTE_PREFETCHERS[path]
  if (direct) {
    warm(path, direct)
    return
  }
  const parent = Object.keys(ROUTE_PREFETCHERS).find(
    (key) => key !== '/' && path.startsWith(key + '/'),
  )
  if (parent) warm(parent, ROUTE_PREFETCHERS[parent]!)
}

export function prefetchRoutes(paths: readonly string[]) {
  paths.forEach((path) => prefetchRoute(path))
}
