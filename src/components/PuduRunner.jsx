import { useEffect, useRef, useState } from 'react'
import './PuduRunner.css'

const WIDTH = 800
const GROUND = 252
const freshGame = () => ({ phase: 'ready', y: 0, velocity: 0, distance: 0, obstacles: [], next: 1.3, time: 0 })

function readRecord() {
  try { return Number(localStorage.getItem('pudu-runner-record')) || 0 } catch { return 0 }
}

export default function PuduRunner({ onClose }) {
  const dialog = useRef(null)
  const canvas = useRef(null)
  const game = useRef(freshGame())
  const [best, setBest] = useState(readRecord)
  const record = useRef(best)
  const [phase, setPhase] = useState('ready')
  const [score, setScore] = useState(0)

  function jump() {
    const state = game.current
    if (state.phase !== 'running') {
      game.current = { ...freshGame(), phase: 'running', velocity: 610 }
      setScore(0)
      setPhase('running')
    } else if (state.y === 0) state.velocity = 610
  }

  useEffect(() => {
    const previousFocus = document.activeElement
    dialog.current.showModal()
    const oldOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    const handleKey = (event) => {
      if (['Space', 'ArrowUp'].includes(event.code) && event.target.tagName !== 'BUTTON') {
        event.preventDefault()
        if (!event.repeat) jump()
      }
    }
    document.addEventListener('keydown', handleKey)
    return () => {
      document.body.style.overflow = oldOverflow
      document.removeEventListener('keydown', handleKey)
      previousFocus?.focus()
    }
  }, [])

  useEffect(() => {
    const ctx = canvas.current.getContext('2d')
    let frame
    let last = 0
    function rect(x, y, w, h, color) {
      ctx.fillStyle = color
      ctx.fillRect(Math.round(x), Math.round(y), w, h)
    }
    function render(now) {
      const dt = document.hidden ? 0 : Math.min((now - (last || now)) / 1000, 0.035)
      last = now
      const state = game.current
      if (state.phase === 'running') {
        const speed = Math.min(480, 260 + state.distance * 0.8)
        state.time += dt
        state.distance += dt * speed / 35
        state.velocity -= 1700 * dt
        state.y = Math.max(0, state.y + state.velocity * dt)
        if (state.y === 0) state.velocity = 0
        state.next -= dt
        if (state.next <= 0) {
          state.obstacles.push({ x: WIDTH + 20, w: 24 + Math.floor(Math.random() * 14), h: 25 + Math.floor(Math.random() * 18) })
          state.next = 1.25 + Math.random() * 0.65
        }
        state.obstacles.forEach((obstacle) => { obstacle.x -= speed * dt })
        state.obstacles = state.obstacles.filter((obstacle) => obstacle.x > -50)
        if (state.obstacles.some((obstacle) => 146 > obstacle.x + 4 && 106 < obstacle.x + obstacle.w - 3 && GROUND - state.y - 4 > GROUND - obstacle.h + 4)) {
          state.phase = 'over'
          setPhase('over')
          const result = Math.floor(state.distance)
          record.current = Math.max(record.current, result)
          setBest(record.current)
          try { localStorage.setItem('pudu-runner-record', String(record.current)) } catch { /* The game also works without storage. */ }
        }
        setScore(Math.floor(state.distance))
      }

      rect(0, 0, WIDTH, 320, '#09141d')
      for (let i = 0; i < 30; i++) rect((i * 137 + 19) % WIDTH, (i * 41) % 145 + 12, 2, 2, '#71968e')
      rect(650, 34, 32, 32, '#e5e8b0')
      rect(643, 28, 27, 27, '#09141d')
      for (let i = 0; i < 12; i++) {
        const x = ((i * 89 - state.distance * 3) % 1068 + 1068) % 1068 - 90
        const height = 75 + (i % 3) * 27
        rect(x + 25, GROUND - height, 9, height, '#172e32')
        rect(x + 8, GROUND - height + 20, 44, 32, '#193b39')
        rect(x, GROUND - height + 47, 60, 27, '#193b39')
      }
      rect(0, GROUND, WIDTH, 5, '#8adc80')
      rect(0, GROUND + 5, WIDTH, 63, '#172b2b')
      for (let i = 0; i < 28; i++) rect(((i * 37 - state.distance * 35) % 1036 + 1036) % 1036, 272 + i % 4 * 10, 9, 3, '#35534a')
      state.obstacles.forEach(({ x, w, h }) => {
        rect(x, GROUND - h + 6, w, h - 6, '#667e81')
        rect(x + 5, GROUND - h, w - 10, 8, '#99adaa')
        rect(x + 5, GROUND - h + 10, 5, h - 16, '#829994')
      })
      const y = GROUND - state.y
      const step = state.phase === 'running' && state.y === 0 ? Math.floor(state.time * 12) % 2 * 5 : 0
      rect(102, y - 35, 37, 24, '#af7648')
      rect(106, y - 31, 29, 14, '#c38b56')
      rect(129, y - 48, 21, 27, '#c38b56')
      rect(144, y - 36, 12, 11, '#d5a471')
      rect(132, y - 58, 6, 14, '#af7648')
      rect(144, y - 56, 6, 12, '#af7648')
      rect(134, y - 55, 2, 7, '#e4b98e')
      rect(143, y - 43, 4, 4, '#101b22')
      rect(153, y - 35, 4, 5, '#101b22')
      rect(104, y - 13, 7, 13 - step, '#895738')
      rect(128, y - 13, 7, 8 + step, '#895738')
      rect(98, y - 34, 6, 7, '#e4b98e')
      frame = requestAnimationFrame(render)
    }
    frame = requestAnimationFrame(render)
    return () => cancelAnimationFrame(frame)
  }, [])

  return (
    <dialog ref={dialog} className="pudu-dialog" aria-labelledby="pudu-title" onCancel={onClose}>
      <div className="pudu-top"><span>ARCADE / 01</span><button type="button" onClick={onClose} aria-label="Cerrar Pudú Runner">✕</button></div>
      <div className="pudu-heading"><div><p>UN PEQUEÑO HABITANTE DEL BOSQUE</p><h2 id="pudu-title">PUDÚ RUNNER<span>_</span></h2></div><span className="pudu-badge">PROTOTIPO</span></div>
      <div className="pudu-scores"><span>DISTANCIA <b>{String(score).padStart(4, '0')} m</b></span><span>RÉCORD <b>{String(best).padStart(4, '0')} m</b></span></div>
      <div className="pudu-stage">
        <canvas ref={canvas} width="800" height="320" tabIndex={0} onPointerDown={(event) => { event.currentTarget.focus(); jump() }} aria-label="Pudú Runner. Pulsa espacio, flecha arriba o toca para saltar sobre las rocas." />
        {phase !== 'running' && <div className="pudu-overlay" aria-live="polite"><strong>{phase === 'over' ? '¡OTRO SALTO, OTRA AVENTURA!' : 'EL BOSQUE TE ESPERA'}</strong><span>{phase === 'over' ? `Recorriste ${score} metros. ¿Vamos otra vez?` : 'Salta las rocas y llega lo más lejos que puedas.'}</span></div>}
      </div>
      <div className="pudu-controls"><p><kbd>ESPACIO</kbd> / <kbd>↑</kbd> o toca el bosque</p><button type="button" onClick={() => { jump(); canvas.current.focus() }}>{phase === 'ready' ? 'COMENZAR →' : phase === 'over' ? 'REINTENTAR ↻' : 'SALTAR ↑'}</button></div>
      <p className="pudu-footnote">Pequeñas patas. Grandes aventuras. · Esc para salir</p>
    </dialog>
  )
}
