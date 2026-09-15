import { useEffect, useRef } from 'react'

export default function StoryReading({ title, text, onClose }) {
  const dialog = useRef(null)
  useEffect(() => {
    const node = dialog.current
    const previous = document.activeElement
    node.showModal()
    return () => {
      node.close()
      if (previous?.isConnected) previous.focus()
    }
  }, [])
  return <dialog className="uu-reading" ref={dialog} aria-labelledby="uu-reading-title" onCancel={event => { event.preventDefault(); onClose() }}>
    <button className="uu-reading-close" type="button" onClick={onClose} aria-label="Cerrar carta"><span aria-hidden="true">×</span></button>
    <h2 id="uu-reading-title">{title}</h2>
    <p>{text}</p>
  </dialog>
}
