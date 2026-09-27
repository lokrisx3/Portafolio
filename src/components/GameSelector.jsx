import { lazy, Suspense, useEffect, useRef, useState } from 'react'
import { createPortal } from 'react-dom'
import './GameSelector.css'

const PuduRunner = lazy(() => import('./PuduRunner.jsx'))
const UsUnknown = lazy(() => import('../games/usunknown/UsUnknown.jsx'))
const FrioEnLaCarne = lazy(() => import('./FrioEnLaCarne.jsx'))

function SelectorDialog({ onClose, onSelect, loading = false, amnein = false }) {
  const dialog = useRef(null)
  const [expandedSketch, setExpandedSketch] = useState(null)

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
    <dialog ref={dialog} className="games-dialog" aria-labelledby="games-title" onCancel={onClose} onKeyDown={event => {
      if (expandedSketch === null) return
      if (event.key === 'ArrowRight') setExpandedSketch(index => (index + 1) % 2)
      if (event.key === 'ArrowLeft') setExpandedSketch(index => (index + 1) % 2)
      if (event.key === 'Escape') { event.preventDefault(); setExpandedSketch(null) }
    }}>
      <div className="games-top"><span>&gt;_ ARCADE</span><button type="button" onClick={onClose} aria-label="Cerrar selector de juegos">✕</button></div>
      <div className="games-title-row">
        <h2 id="games-title">Elige tu juego<span>_</span></h2>
        <span className="games-badge">PROTOTIPO</span>
      </div>
      {loading ? <p role="status">Cargando juego…</p> : <>
        <p>{amnein ? 'Aventura narrativa de terror psicológico: explora una mansión y descubre los misterios de una historia marcada por la memoria y el miedo.' : 'Una pausa, cuatro aventuras.'}</p>
        {amnein ? <div className="games-sketch-preview">{['boceto1.png', 'boceto2.png'].map((name, index) => <figure key={name}><button className="games-sketch-thumb" type="button" onClick={() => setExpandedSketch(index)} aria-label={`Ampliar boceto ${index + 1}`}><img src={`${import.meta.env.BASE_URL}amnein/${name}`} alt={`Boceto ${index + 1} de Amnein`} /><span>AMPLIAR ↗</span></button><figcaption>Boceto {index + 1}</figcaption></figure>)}</div> : <div className="games-grid">
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
          <button type="button" className="games-card games-card--amnein" onClick={() => onSelect('amnein')}>
            <img className="games-art games-art--amnein" src={`${import.meta.env.BASE_URL}amnein/portadaAmnein.png`} alt="Portada del juego Amnein" />
            <span className="games-genre">04 / JUEGO EN DESARROLLO</span>
            <strong>Amnein</strong>
            <span className="games-coming-soon">PRÓXIMAMENTE</span>
            <span>Beat ’em up pixel art ambientado en un Santiago distópico: cuatro personajes combaten por sus barrios con combos y habilidades especiales.</span>
            <span className="games-play">VER BOCETOS →</span>
          </button>
        </div>}
      </>}
      {expandedSketch !== null && <div className="sketch-viewer" role="group" aria-label={`Boceto ${expandedSketch + 1} ampliado`}>
        <button className="sketch-viewer__close" type="button" onClick={() => setExpandedSketch(null)} aria-label="Cerrar visor">×</button>
        <button className="sketch-viewer__nav sketch-viewer__nav--previous" type="button" onClick={() => setExpandedSketch(index => (index + 1) % 2)} aria-label="Ver boceto anterior">‹</button>
        <figure><img src={`${import.meta.env.BASE_URL}amnein/boceto${expandedSketch + 1}.png`} alt={`Boceto ${expandedSketch + 1} de Amnein ampliado`} /><figcaption>Boceto {expandedSketch + 1} de 2</figcaption></figure>
        <button className="sketch-viewer__nav sketch-viewer__nav--next" type="button" onClick={() => setExpandedSketch(index => (index + 1) % 2)} aria-label="Ver siguiente boceto">›</button>
      </div>}
    </dialog>, document.body,
  )
}

export default function GameSelector({ onClose }) {
  const [game, setGame] = useState(null)
  const selectGame = gameName => {
    if (gameName === 'amnein') {
      setGame('amnein')
      return
    }
    if (gameName === 'usunknown') document.documentElement.requestFullscreen?.().catch(() => { })
    setGame(gameName)
  }
  const closeGame = () => {
    if (document.fullscreenElement) document.exitFullscreen?.()
    setGame(null)
  }
  if (!game) return <SelectorDialog onClose={onClose} onSelect={selectGame} />
  if (game === 'amnein') return <SelectorDialog onClose={closeGame} onSelect={() => setGame(null)} amnein />
  const Game = game === 'pudu' ? PuduRunner : game === 'frio' ? FrioEnLaCarne : UsUnknown
  return <Suspense fallback={<SelectorDialog loading onClose={closeGame} />}>
    <Game onClose={closeGame} />
  </Suspense>
}
