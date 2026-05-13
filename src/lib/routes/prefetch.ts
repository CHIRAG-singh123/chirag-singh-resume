// Per-route dynamic import map. Calling a value pre-warms that route chunk
// (the lazy() wrapper de-dupes the import internally). Use it from
// hover/focus/intersection handlers so navigation feels instantaneous.

type Loader = () => Promise<unknown>

export const ROUTE_PREFETCHERS: Record<string, Loader> = {
  '/': () => import('../../pages/HomePage'),
  '/about': () => import('../../pages/AboutPage'),
  '/skills': () =>
    Promise.all([
      import('../../pages/SkillsPage'),
      import('../../components/SkillConstellation'),
    ]).then(() => undefined),
  '/projects': () => import('../../pages/ProjectsPage'),
  '/experience': () => import('../../pages/ExperiencePage'),
  '/contact': () => import('../../pages/ContactPage'),
}

export function prefetchRoute(path: string) {
  // Match the pathname against known prefetchers. For dynamic segments
  // (e.g. /projects/:slug) fall back to the parent route.
  const direct = ROUTE_PREFETCHERS[path]
  if (direct) {
    void direct()
    return
  }
  const parent = Object.keys(ROUTE_PREFETCHERS).find(
    (key) => key !== '/' && path.startsWith(key + '/'),
  )
  if (parent) void ROUTE_PREFETCHERS[parent]!()
}
