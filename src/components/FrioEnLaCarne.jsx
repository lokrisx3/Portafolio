import { useEffect, useMemo, useRef, useState } from 'react'
import chapters from '../games/frio-en-la-carne/story.json'
import './FrioEnLaCarne.css'

export default function FrioEnLaCarne({ onClose }) {
  const dialog = useRef(null)
  const [chapterId, setChapterId] = useState('start')
  const chapter = chapters[chapterId]
  const story = chapter.text || chapter.ending
  const words = useMemo(() => story.split(/(\s+)/), [story])

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

  return (
    <dialog ref={dialog} className="frio-dialog" aria-labelledby="frio-title" onCancel={onClose}>
      <header className="frio-top"><span>FICCIÓN INTERACTIVA · 01</span><button type="button" onClick={onClose} aria-label="Cerrar Frío en la carne">✕</button></header>
      <p className="frio-eyebrow">UNA HISTORIA DE INVIERNO</p>
      <h2 id="frio-title">Frío en la carne<span>_</span></h2>
      <article className="frio-scene" aria-live="polite" key={chapterId}>
        <h3>{chapter.title}</h3>
        <p className="frio-story" aria-label={story}>{words.map((word, index) => /\s+/.test(word) ? word : <span className="frio-word" aria-hidden="true" key={`${chapterId}-${index}`} style={{ '--word-index': index }}>{word}</span>)}</p>
      </article>
      {chapter.choices ? <div className="frio-choices" aria-label="Elige qué hacer">{chapter.choices.map(([next, label], index) => <button type="button" key={next + label} onClick={() => setChapterId(next)}><span>0{index + 1}</span>{label}<b>→</b></button>)}</div> : <button className="frio-restart" type="button" onClick={() => setChapterId('start')}>Volver a empezar ↻</button>}
      <footer>Los monstruos más crueles son los que aprendemos a imaginar.</footer>
    </dialog>
  )
}
