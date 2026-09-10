import { useEffect, useState } from 'react'

// Characters retain their space so typing never shifts the surrounding layout.
export default function Typewriter({ text, delay = 0, speed = 18 }) {
  const [elapsed, setElapsed] = useState(0)
  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return
    const started = performance.now()
    const duration = delay + Array.from(text).length * speed
    const timer = window.setInterval(() => {
      const next = performance.now() - started
      setElapsed(next)
      if (next >= duration) window.clearInterval(timer)
    }, 30)
    return () => window.clearInterval(timer)
  }, [text, delay, speed])

  return <span className="typewriter">
    <span className="intro-sr-only">{text}</span>
    <span aria-hidden="true">
      {Array.from(text).map((character, index) => character === '\n'
        ? <br key={index} />
        : <span className="typewriter-character" data-pending={elapsed < delay + index * speed} key={index}>{character}</span>)}
    </span>
  </span>
}
