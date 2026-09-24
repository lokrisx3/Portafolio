import { lazy, Suspense, useEffect, useRef, useState } from 'react'
import { createPortal } from 'react-dom'
import './GameSelector.css'

const PuduRunner = lazy(() => import('./PuduRunner.jsx'))
const UsUnknown = lazy(() => import('../games/usunknown/UsUnknown.jsx'))
const FrioEnLaCarne = lazy(() => import('./FrioEnLaCarne.jsx'))

function SelectorDialog({ onClose, onSelect, loading = false }) {
  const dialog = useRef(null)

  useEffect(() => {
    const previousFocus = document.activeElement
    const oldOverflow = document.body.style.overflow
    dialog.current.showModal()
    document.body.style.overflow = 'hidden'
    return () => {
      document.body.style.overflow = oldOverflow
      previousFocus?.focus()
    }
  }, [])

  return createPortal(
    <dialog ref={dialog} className="games-dialog" aria-labelledby="games-title" onCancel={onClose}>
      <div className="games-top"><span>&gt;_ ARCADE</span><button type="button" onClick={onClose} aria-label="Cerrar selector de juegos">✕</button></div>
      <div className="games-title-row">
        <h2 id="games-title">Elige tu juego<span>_</span></h2>
        <span className="games-badge">PROTOTIPO</span>
      </div>
      {loading ? <p role="status">Cargando juego…</p> : <>
        <p>Una pausa, tres aventuras.</p>
        <div className="games-grid">
          <button type="button" className="games-card" onClick={() => onSelect('pudu')}>
            <img className="games-art games-art--pudu" src={`${import.meta.env.BASE_URL}pudu-runner-cover.svg`} alt="Un pudú pixelado saltando una roca entre árboles" />
            <span className="games-genre">01 / CARRERA INFINITA</span>
            <strong>Pudú Runner</strong>
            <span className="games-play">JUGAR →</span>
          </button>
          <button type="button" className="games-card games-card--frio" onClick={() => onSelect('frio')}>
            <img className="games-art games-art--frio" src={`${import.meta.env.BASE_URL}frio-en-la-carne-cover.svg`} alt="Cuatro soldados de espaldas avanzan por un bosque nevado hacia un búnker" />
            <span className="games-genre">03 / FICCIÓN INTERACTIVA</span>
            <strong>Frío en la carne</strong>
            <span>Una historia breve donde cada decisión abre una puerta… o algo peor.</span>
            <span className="games-play">LEER →</span>
          </button>
          <button type="button" className="games-card games-card--horror" onClick={() => onSelect('usunknown')}>
            <img className="games-art" src={`${import.meta.env.BASE_URL}usunknown/art/menu-mansion.png`} alt="Una mansión bajo la tormenta" />
            <span className="games-genre">02 / TERROR Y EXPLORACIÓN</span>
            <strong>usUnknown</strong>
            <span>Encuentra cuatro llaves y escapa de la mansión.</span>
            <span className="games-play">JUGAR →</span>
          </button>
        </div>
      </>}
    </dialog>, document.body,
  )
}

export default function GameSelector({ onClose }) {
  const [game, setGame] = useState(null)
  const selectGame = gameName => {
    if (gameName === 'usunknown') document.documentElement.requestFullscreen?.().catch(() => { })
    setGame(gameName)
  }
  const closeGame = () => {
    if (document.fullscreenElement) document.exitFullscreen?.()
    setGame(null)
  }
  if (!game) return <SelectorDialog onClose={onClose} onSelect={selectGame} />
  const Game = game === 'pudu' ? PuduRunner : game === 'frio' ? FrioEnLaCarne : UsUnknown
  return <Suspense fallback={<SelectorDialog loading onClose={closeGame} />}>
    <Game onClose={closeGame} />
  </Suspense>
}
