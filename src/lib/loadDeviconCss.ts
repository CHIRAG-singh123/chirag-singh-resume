let loadPromise: Promise<void> | null = null

/** Loads Devicon stylesheet once (Vite injects on dynamic import). Call from routes that render devicons. */
export function ensureDeviconsCssLoaded(): Promise<void> {
  if (!loadPromise) {
    loadPromise = import('devicon/devicon.min.css').then(() => undefined)
  }
  return loadPromise
}
