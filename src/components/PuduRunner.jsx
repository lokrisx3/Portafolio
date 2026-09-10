import { useEffect, useRef, useState } from 'react'
import './PuduRunner.css'
import { drawFestiveCity } from './puduCity'
import { SKINS, SCENES, readProgress, saveProgress, addDistance, purchase } from './puduProgress'

const WIDTH = 800
const GROUND = 252
const freshGame = () => ({ phase: 'ready', y: 0, velocity: 0, distance: 0, obstacles: [], next: 1.3, time: 0, coins: [], nextCoin: 6, credited: 0 })

export default function PuduRunner({ onClose }) {
  const dialog = useRef(null)
  const canvas = useRef(null)
  const game = useRef(freshGame())
  const [progress, setProgress] = useState(readProgress)
  const wallet = useRef(progress)
  const [storageFailed, setStorageFailed] = useState(false)
  const [shop, setShop] = useState(false)
  const paused = useRef(false)
  const best = progress.best
  function updateProgress(next) {
    wallet.current = next
    setProgress(next)
    setStorageFailed(!saveProgress(next))
  }
  function toggleShop() {
    paused.current = !paused.current
    setShop(paused.current)
  }
  const [phase, setPhase] = useState('ready')
  const [score, setScore] = useState(0)

  function jump() {
    if (paused.current) return
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
    const surface = canvas.current
    const equippedSkin = SKINS.find(item => item.id === progress.skin) || SKINS[0]
    const equippedScene = SCENES.find(item => item.id === progress.scene) || SCENES[0]
    // This small pixel-art scene does not need GPU-backed canvas rendering.
    const ctx = surface.getContext('2d', { willReadFrequently: true })
    if (!ctx) return
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
      if (state.phase === 'running' && !paused.current) {
        const speed = Math.min(480, 260 + state.distance * 0.8)
        state.time += dt
        state.distance += dt * speed / 35
        const meters = Math.floor(state.distance) - state.credited
        if (meters > 0) {
          const nextProgress = addDistance(wallet.current, meters, state.credited)
          state.credited += meters
          updateProgress({ ...nextProgress, best: Math.max(wallet.current.best, state.credited) })
        }
        state.nextCoin -= dt
        if (state.nextCoin <= 0) {
          state.coins.push({ x: WIDTH + 20, y: GROUND - 70 - Math.random() * 35 })
          state.nextCoin = 6 + Math.random() * 4
        }
        state.coins.forEach(coin => { coin.x -= speed * dt })
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
        state.coins = state.coins.filter(coin => {
          if (coin.x + 9 > 102 && coin.x - 9 < 156 && coin.y + 9 > GROUND - state.y - 58 && coin.y - 9 < GROUND - state.y) {
            updateProgress({ ...wallet.current, coins: wallet.current.coins + 1 })
            return false
          }
          return coin.x > -20
        })
        if (state.obstacles.some((obstacle) => 146 > obstacle.x + 4 && 106 < obstacle.x + obstacle.w - 3 && GROUND - state.y - 4 > GROUND - obstacle.h + 4)) {
          state.phase = 'over'
          setPhase('over')
        }
        setScore(Math.floor(state.distance))
      }

      const scenery = equippedScene.colors
      const fur = equippedSkin.colors
      rect(0, 0, WIDTH, 320, scenery[0])
      for (let i = 0; i < 30; i++) rect((i * 137 + 19) % WIDTH, (i * 41) % 145 + 12, 2, 2, '#71968e')
      rect(650, 34, 32, 32, '#e5e8b0')
      rect(643, 28, 27, 27, scenery[0])
      if (equippedScene.id === 'fiestas') {
        drawFestiveCity(ctx, rect, state.distance, GROUND)
      } else for (let i = 0; i < 12; i++) {
        const x = ((i * 89 - state.distance * 3) % 1068 + 1068) % 1068 - 90
        const height = 75 + (i % 3) * 27
        rect(x + 25, GROUND - height, 9, height, scenery[1])
        rect(x + 8, GROUND - height + 20, 44, 32, scenery[2])
        rect(x, GROUND - height + 47, 60, 27, scenery[2])
      }
      rect(0, GROUND, WIDTH, 5, scenery[3])
      rect(0, GROUND + 5, WIDTH, 63, scenery[4])
      for (let i = 0; i < 28; i++) rect(((i * 37 - state.distance * 35) % 1036 + 1036) % 1036, 272 + i % 4 * 10, 9, 3, scenery[5])
      state.obstacles.forEach(({ x, w, h }) => {
        rect(x, GROUND - h + 6, w, h - 6, '#667e81')
        rect(x + 5, GROUND - h, w - 10, 8, '#99adaa')
        rect(x + 5, GROUND - h + 10, 5, h - 16, '#829994')
      })
      state.coins.forEach(({ x, y }) => {
        rect(x - 6, y - 10, 12, 20, '#c48926')
        rect(x - 9, y - 6, 18, 12, '#ffda67')
        rect(x - 2, y - 6, 3, 12, '#fff2b3')
      })
      const y = GROUND - state.y
      const step = state.phase === 'running' && state.y === 0 ? Math.floor(state.time * 12) % 2 * 5 : 0
      rect(102, y - 35, 37, 24, fur[0])
      rect(106, y - 31, 29, 14, fur[1])
      rect(129, y - 48, 21, 27, fur[1])
      rect(144, y - 36, 12, 11, fur[2])
      rect(132, y - 58, 6, 14, fur[0])
      rect(144, y - 56, 6, 12, fur[0])
      rect(134, y - 55, 2, 7, '#e4b98e')
      rect(143, y - 43, 4, 4, '#101b22')
      rect(153, y - 35, 4, 5, '#101b22')
      rect(104, y - 13, 7, 13 - step, fur[3])
      rect(128, y - 13, 7, 8 + step, fur[3])
      rect(98, y - 34, 6, 7, '#e4b98e')
      if (equippedSkin.id === 'huaso') {
        // Striped chamanto and a straw chupalla with a dark hatband.
        rect(101, y - 36, 34, 23, '#a32d35')
        rect(105, y - 36, 4, 23, '#f0dfbb')
        rect(113, y - 36, 5, 23, '#273d66')
        rect(122, y - 36, 4, 23, '#f0dfbb')
        rect(101, y - 15, 34, 3, '#e6bc78')
        for (let i = 0; i < 7; i++) rect(102 + i * 5, y - 12, 2, 3, '#e6bc78')
        rect(130, y - 26, 15, 4, '#f0dfbb')
        rect(136, y - 22, 4, 6, '#f0dfbb')
        rect(130, y - 62, 20, 11, '#d7b56b')
        rect(133, y - 63, 14, 3, '#f0d28c')
        rect(130, y - 54, 20, 3, '#513829')
        rect(121, y - 51, 38, 4, '#e6c780')
      }
      if (equippedSkin.id === 'gothic') {
        // Violet fringe, dark collar and silver studs.
        rect(129, y - 49, 22, 6, '#211e30')
        rect(137, y - 47, 5, 10, '#b58ad7')
        rect(129, y - 25, 19, 5, '#171522')
        rect(132, y - 24, 2, 2, '#e0d9ec')
        rect(139, y - 24, 2, 2, '#e0d9ec')
        rect(136, y - 20, 3, 4, '#b58ad7')
        rect(134, y - 55, 2, 7, '#b58ad7')
        rect(148, y - 49, 3, 4, '#e0d9ec')
        rect(98, y - 34, 6, 7, '#51465f')
      }
      frame = requestAnimationFrame(render)
    }
    function restoreCanvas() {
      cancelAnimationFrame(frame)
      last = 0
      render(performance.now())
    }
    surface.addEventListener('contextrestored', restoreCanvas)
    restoreCanvas()
    return () => {
      cancelAnimationFrame(frame)
      surface.removeEventListener('contextrestored', restoreCanvas)
    }
  }, [progress.skin, progress.scene])

  return (
    <dialog ref={dialog} className="pudu-dialog" aria-labelledby="pudu-title" onCancel={onClose}>
      <div className="pudu-top"><span>ARCADE / 01</span><button type="button" onClick={onClose} aria-label="Cerrar Pudú Runner">✕</button></div>
      <div className="pudu-heading"><div><p>UN PEQUEÑO HABITANTE DEL BOSQUE</p><h2 id="pudu-title">PUDÚ RUNNER<span>_</span></h2></div><span className="pudu-badge">PROTOTIPO</span></div>
      <div className="pudu-scores"><span>DISTANCIA <b>{String(score).padStart(4, '0')} m</b></span><span>RÉCORD <b>{String(best).padStart(4, '0')} m</b></span></div>
      <div className="pudu-economy"><span>◈ {progress.coins} monedas · {score % 100}/100 m</span><button type="button" onClick={toggleShop} aria-expanded={shop} aria-controls="pudu-shop">{shop ? 'VOLVER AL JUEGO' : 'TIENDA ◈'}</button></div>
      <div className="pudu-stage" hidden={shop}>
        <canvas ref={canvas} width="800" height="320" tabIndex={0} onPointerDown={(event) => { event.currentTarget.focus(); jump() }} aria-label="Pudú Runner. Pulsa espacio, flecha arriba o toca para saltar sobre las rocas." />
        {phase !== 'running' && <div className="pudu-overlay" aria-live="polite"><strong>{phase === 'over' ? '¡OTRO SALTO, OTRA AVENTURA!' : 'EL BOSQUE TE ESPERA'}</strong><span>{phase === 'over' ? `Recorriste ${score} metros. ¿Vamos otra vez?` : 'Salta las rocas y llega lo más lejos que puedas.'}</span></div>}
      </div>
      <section id="pudu-shop" className="pudu-shop" hidden={!shop} aria-label="Tienda">
        <p>Personaliza tu aventura · El juego está en pausa.</p>
        {[["skin", "Skins del pudú", SKINS, progress.ownedSkins], ["scene", "Escenarios", SCENES, progress.ownedScenes]].map(([type, title, items, owned]) => <div key={type}>
          <h3>{title}</h3><div className="pudu-shop-grid">{items.map(item => {
            const selected = progress[type] === item.id
            const bought = owned.includes(item.id)
            return <article className="pudu-product" key={item.id}>
              <div className={`pudu-preview pudu-preview-${type} pudu-preview-${item.id}`} style={{ '--preview': item.colors[0], '--detail': item.colors[1], '--accent': item.colors[3] }} aria-hidden="true"><i /></div>
              <h4>{item.name}</h4><span>{bought ? 'En tu colección' : `${item.price} monedas`}</span>
              <button type="button" disabled={selected || (!bought && progress.coins < item.price)} onClick={() => updateProgress(purchase(wallet.current, type, item.id))}>{selected ? 'EQUIPADO' : bought ? 'EQUIPAR' : progress.coins < item.price ? 'FALTAN MONEDAS' : 'COMPRAR Y EQUIPAR'}</button>
            </article>
          })}</div>
        </div>)}
      </section>
      <div className="pudu-controls" hidden={shop}><p><kbd>ESPACIO</kbd> / <kbd>↑</kbd> o toca el bosque</p><button type="button" onClick={() => { jump(); canvas.current.focus() }}>{phase === 'ready' ? 'COMENZAR →' : phase === 'over' ? 'REINTENTAR ↻' : 'SALTAR ↑'}</button></div>
      <p className="pudu-footnote">Cada 100 m en esta partida = 1 moneda · Recoge monedas doradas al saltar.<br />Progreso guardado en este navegador · Esc para salir</p>
      {storageFailed && <p className="pudu-footnote" role="status">No se pudo guardar en localStorage. El progreso solo se conservará mientras el juego esté abierto.</p>}
    </dialog>
  )
}
