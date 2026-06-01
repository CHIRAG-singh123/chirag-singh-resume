import {
  createContext,
  useContext,
  useLayoutEffect,
  useRef,
  useState,
  type ReactNode,
} from 'react'
import { useLocation } from 'react-router-dom'

const RAPID_NAV_WINDOW_MS = 850
const RAPID_NAV_RESET_MS = 1400
const RAPID_NAV_STREAK_THRESHOLD = 2

const RouteMotionBudgetContext = createContext(false)

export function RouteMotionBudgetProvider({ children }: { children: ReactNode }) {
  const location = useLocation()
  const lastPathRef = useRef(location.pathname)
  const lastChangeAtRef = useRef(0)
  const streakRef = useRef(0)
  const clearTimerRef = useRef<number | null>(null)
  const [rapidRouteSwitching, setRapidRouteSwitching] = useState(false)

  useLayoutEffect(() => {
    if (location.pathname === lastPathRef.current) return

    const now = typeof performance !== 'undefined' ? performance.now() : Date.now()
    const gap = now - lastChangeAtRef.current

    streakRef.current = gap <= RAPID_NAV_WINDOW_MS ? streakRef.current + 1 : 1
    lastChangeAtRef.current = now
    lastPathRef.current = location.pathname

    if (streakRef.current >= RAPID_NAV_STREAK_THRESHOLD) {
      setRapidRouteSwitching(true)
    }

    if (clearTimerRef.current !== null) {
      window.clearTimeout(clearTimerRef.current)
    }

    clearTimerRef.current = window.setTimeout(() => {
      streakRef.current = 0
      setRapidRouteSwitching(false)
      clearTimerRef.current = null
    }, RAPID_NAV_RESET_MS)
  }, [location.pathname])

  useLayoutEffect(
    () => () => {
      if (clearTimerRef.current !== null) {
        window.clearTimeout(clearTimerRef.current)
      }
    },
    [],
  )

  return (
    <RouteMotionBudgetContext.Provider value={rapidRouteSwitching}>
      {children}
    </RouteMotionBudgetContext.Provider>
  )
}

export function useRouteMotionBudget() {
  return useContext(RouteMotionBudgetContext)
}
