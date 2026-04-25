import { useEffect, useState } from 'react'

interface TypingTextProps {
  phrases: string[]
  typingSpeed?: number
  deletingSpeed?: number
  pauseMs?: number
  className?: string
}

export function TypingText({
  phrases,
  typingSpeed = 70,
  deletingSpeed = 35,
  pauseMs = 1400,
  className,
}: TypingTextProps) {
  const [index, setIndex] = useState(0)
  const [text, setText] = useState('')
  const [deleting, setDeleting] = useState(false)

  useEffect(() => {
    const current = phrases[index % phrases.length] ?? ''
    let timeout: ReturnType<typeof setTimeout>

    if (!deleting && text === current) {
      timeout = setTimeout(() => setDeleting(true), pauseMs)
    } else if (deleting && text === '') {
      setDeleting(false)
      setIndex((prev) => (prev + 1) % phrases.length)
      timeout = setTimeout(() => undefined, typingSpeed)
    } else {
      timeout = setTimeout(
        () => {
          setText((prev) =>
            deleting ? current.substring(0, prev.length - 1) : current.substring(0, prev.length + 1),
          )
        },
        deleting ? deletingSpeed : typingSpeed,
      )
    }

    return () => clearTimeout(timeout)
  }, [text, deleting, index, phrases, typingSpeed, deletingSpeed, pauseMs])

  return (
    <span className={className} aria-live="polite">
      {text}
      <span className="ml-0.5 inline-block h-[1em] w-[2px] translate-y-[0.15em] bg-current align-middle animate-pulse" />
    </span>
  )
}
