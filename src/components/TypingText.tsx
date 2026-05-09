import { useReducedMotion } from 'framer-motion'
import { useEffect, useMemo, useState } from 'react'

interface TypingTextProps {
  phrases: string[]
  typingSpeed?: number
  deletingSpeed?: number
  pauseMs?: number
  className?: string
  /** When false, types the current phrase once (no delete cycle). */
  loop?: boolean
  /** Wait before the first character appears (e.g. stagger after a count-up). */
  startDelayMs?: number
}

export function TypingText({
  phrases,
  typingSpeed = 30,
  deletingSpeed = 30,
  pauseMs = 1400,
  className,
  loop = true,
  startDelayMs = 0,
}: TypingTextProps) {
  const reduceMotion = useReducedMotion()
  const phraseKey = JSON.stringify(phrases)
  const phraseList = useMemo(
    () => (phrases.length > 0 ? [...phrases] : ['']),
    // eslint-disable-next-line react-hooks/exhaustive-deps -- stable by lexical content via phraseKey
    [phraseKey],
  )

  const [index, setIndex] = useState(0)
  const [text, setText] = useState('')
  const [deleting, setDeleting] = useState(false)
  const [hideCaret, setHideCaret] = useState(false)
  const [started, setStarted] = useState(startDelayMs === 0)

  const current = phraseList[index % phraseList.length] ?? ''

  /** Start delay skipped when reduced motion prefers static labels. */
  useEffect(() => {
    if (reduceMotion) {
      setStarted(true)
      return
    }
    if (startDelayMs === 0) {
      setStarted(true)
      return
    }
    setStarted(false)
    const t = window.setTimeout(() => setStarted(true), startDelayMs)
    return () => window.clearTimeout(t)
  }, [reduceMotion, startDelayMs])

  /** Static copy for reduced-motion users: first phrase is the primary label. */
  useEffect(() => {
    if (!reduceMotion) return
    setText(phraseList[0] ?? '')
    setHideCaret(true)
    setDeleting(false)
  }, [reduceMotion, phraseList])

  /** Reveal caret again when re-typing in loop mode. */
  useEffect(() => {
    if (!loop) return
    if (deleting || text.length < current.length) setHideCaret(false)
  }, [loop, deleting, text, current])

  useEffect(() => {
    if (reduceMotion || !started) return

    let timeout: ReturnType<typeof window.setTimeout>

    if (!deleting && text === current) {
      if (!loop) {
        if (!hideCaret) {
          timeout = window.setTimeout(() => setHideCaret(true), 680)
        }
      } else {
        timeout = window.setTimeout(() => setDeleting(true), pauseMs)
      }
    } else if (deleting && text === '') {
      setDeleting(false)
      setIndex((prev) => (prev + 1) % phraseList.length)
      timeout = window.setTimeout(() => undefined, typingSpeed)
    } else {
      timeout = window.setTimeout(
        () => {
          setText((prev) =>
            deleting ? current.substring(0, prev.length - 1) : current.substring(0, prev.length + 1),
          )
        },
        deleting ? deletingSpeed : typingSpeed,
      )
    }

    return () => window.clearTimeout(timeout)
  }, [
    text,
    deleting,
    index,
    phraseList,
    typingSpeed,
    deletingSpeed,
    pauseMs,
    reduceMotion,
    started,
    loop,
    current,
    hideCaret,
  ])

  const showCaret = !reduceMotion && !hideCaret

  return (
    <span className={className} aria-live="polite">
      {text}
      {showCaret ? (
        <span className="ml-0.5 inline-block h-[1em] w-[2px] translate-y-[0.15em] bg-current align-middle animate-pulse" />
      ) : null}
    </span>
  )
}
