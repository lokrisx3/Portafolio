import { createPortal } from 'react-dom'
import { useEffect, useRef, useState } from 'react'
import { createGame, move, distance, roomAt, names, candidates, route, interact, lines, storyTitles } from './world.js'
import { base, loadArt, render, renderIntro } from './renderer.js'
import './UsUnknown.css'
import StoryReading from './StoryReading.jsx'
import TouchJoystick from './TouchJoystick.jsx'

const defaultGameSettings = {
    volume: 100,
    brightness: 100,
    controlLayout: 'standard',
    buttonLayout: 'center',
    positions: { move: { x: 5, y: 62 }, actions: { x: 44, y: 76 }, aim: { x: 83, y: 62 } },
}

const clamp = (value, min, max) => Math.min(max, Math.max(min, value))

function validPosition(value, fallback) {
    return value && Number.isFinite(value.x) && Number.isFinite(value.y)
        ? { x: clamp(value.x, 0, 90), y: clamp(value.y, 0, 80) }
        : fallback
}

function getSavedGameSettings() {
    try {
        const saved = JSON.parse(localStorage.getItem('usunknown-settings') || '{}')
        return {
            volume: Number.isFinite(saved.volume) ? Math.min(100, Math.max(0, saved.volume)) : defaultGameSettings.volume,
            brightness: Number.isFinite(saved.brightness) ? Math.min(100, Math.max(35, saved.brightness)) : defaultGameSettings.brightness,
            controlLayout: ['standard', 'left-handed'].includes(saved.controlLayout) ? saved.controlLayout : defaultGameSettings.controlLayout,
            buttonLayout: ['left', 'center', 'right'].includes(saved.buttonLayout) ? saved.buttonLayout : defaultGameSettings.buttonLayout,
            positions: {
                move: validPosition(saved.positions?.move, defaultGameSettings.positions.move),
                actions: validPosition(saved.positions?.actions, defaultGameSettings.positions.actions),
                aim: validPosition(saved.positions?.aim, defaultGameSettings.positions.aim),
            },
        }
    } catch { return defaultGameSettings }
}

function DraggableControl({ editing, position, onPositionChange, className, children }) {
    const control = useRef(null)
    const drag = useRef(null)
    const handlePointerDown = event => {
        if (!editing || event.button !== 0) return
        event.preventDefault()
        const parent = event.currentTarget.parentElement.getBoundingClientRect()
        const rect = event.currentTarget.getBoundingClientRect()
        drag.current = { pointerId: event.pointerId, parent, offsetX: event.clientX - rect.left, offsetY: event.clientY - rect.top }
        event.currentTarget.setPointerCapture(event.pointerId)
    }
    const handlePointerMove = event => {
        if (!drag.current || drag.current.pointerId !== event.pointerId) return
        const { parent, offsetX, offsetY } = drag.current
        onPositionChange({
            x: clamp((event.clientX - parent.left - offsetX) / parent.width * 100, 0, 90),
            y: clamp((event.clientY - parent.top - offsetY) / parent.height * 100, 0, 80),
        })
    }
    const release = event => {
        if (drag.current?.pointerId !== event.pointerId) return
        drag.current = null
        if (event.currentTarget.hasPointerCapture(event.pointerId)) event.currentTarget.releasePointerCapture(event.pointerId)
    }
    return <div ref={control} className={className} style={{ left: `${position.x}%`, top: `${position.y}%` }} onPointerDown={handlePointerDown} onPointerMove={handlePointerMove} onPointerUp={release} onPointerCancel={release}>
        {children}
    </div>
}

export default function UsUnknown({ onClose }) {
    const canvas = useRef(null), host = useRef(null), runtime = useRef(null)
    const audioTracks = useRef({})
    const initialVolume = useRef(null)
    const touchMode = useRef(false)
    const [view, setView] = useState({ state: 'loading', count: 0, room: 'Vestíbulo', message: '' })
    const [touch, setTouch] = useState(() => matchMedia('(pointer: coarse)').matches)
    const [fullscreen, setFullscreen] = useState(false)
    const [showOptions, setShowOptions] = useState(false)
    const [editingControls, setEditingControls] = useState(false)
    const [gameSettings, setGameSettings] = useState(getSavedGameSettings)
    if (initialVolume.current === null) initialVolume.current = gameSettings.volume
    useEffect(() => { touchMode.current = touch }, [touch])
    const updateSetting = (name, value) => setGameSettings(current => ({ ...current, [name]: value }))
    const updatePosition = (name, position) => setGameSettings(current => ({ ...current, positions: { ...current.positions, [name]: position } }))
    const updateControlLayout = value => setGameSettings(current => ({ ...current, controlLayout: value, positions: { ...current.positions, move: value === 'standard' ? { x: 5, y: 62 } : { x: 83, y: 62 }, aim: value === 'standard' ? { x: 83, y: 62 } : { x: 5, y: 62 } } }))
    const updateButtonLayout = value => setGameSettings(current => ({ ...current, buttonLayout: value, positions: { ...current.positions, actions: { x: value === 'left' ? 5 : value === 'right' ? 83 : 44, y: 76 } } }))
    useEffect(() => {
        localStorage.setItem('usunknown-settings', JSON.stringify(gameSettings))
        Object.values(audioTracks.current).forEach(audio => { audio.volume = audio.baseVolume * gameSettings.volume / 100 })
    }, [gameSettings])
    // Keep multi-touch controls from triggering browser zoom, including Safari gestures.
    useEffect(() => {
        const node = host.current
        const preventGesture = e => { if (e.cancelable) e.preventDefault() }
        const preventPinch = e => { if (e.touches.length > 1) preventGesture(e) }
        const preventWheelZoom = e => { if (e.ctrlKey) preventGesture(e) }
        const listeners = [['touchstart', preventPinch], ['touchmove', preventPinch], ['gesturestart', preventGesture], ['gesturechange', preventGesture], ['wheel', preventWheelZoom]]
        for (const [type, handler] of listeners) node.addEventListener(type, handler, { passive: false })
        return () => { for (const [type, handler] of listeners) node.removeEventListener(type, handler) }
    }, [])
    // Restore keyboard input after React removes the modal and releases its focus trap.
    useEffect(() => {
        if (view.state === 'playing' || view.state === 'intro') host.current?.focus()
    }, [view.state])
    useEffect(() => {
        let alive = true, frame = 0, last = 0, images, game = createGame(), state = 'loading', intro = 0, previous = 'playing', hudTime = 0, reading = null
        const pressed = new Set(), reduced = matchMedia('(prefers-reduced-motion: reduce)').matches
        let analog = { x: 0, y: 0 }; const tracks = {}
        for (const [name, file, loop, volume] of [['music', 'piano-ambient', true, .3], ['rain', 'rainambient', true, .4], ['intro', 'lluviacinematica', true, .5], ['thunder', 'truenocinematica', false, .5], ['walk', 'pasos', true, .35], ['run', 'correr', true, .4], ['enemy', 'correrasesino', true, .45]]) {
            const audio = new Audio(base + 'audio/' + file + '.mp3'); audio.loop = loop; audio.baseVolume = volume; audio.volume = volume * initialVolume.current / 100; tracks[name] = audio
        }
        audioTracks.current = tracks
        const play = name => { if (tracks[name].paused) tracks[name].play().catch(() => { }) }
        const sync = () => setView({ state, reading, count: game.collected.length, room: names[roomAt(game.player)] || 'Vestíbulo', message: game.messageTime > 0 ? game.message : '', light: game.light })
        const change = next => { state = next; pressed.clear(); analog = { x: 0, y: 0 }; if (next === 'playing' || next === 'intro') host.current?.focus(); Object.values(tracks).forEach(a => a.pause()); if (next === 'title') play('music'); if (next === 'intro') play('intro'); if (next === 'playing') play('rain'); sync() }
        const action = name => {
            if (name === 'touch') { analog = { x: 0, y: 0 }; pressed.clear(); setTouch(v => !v); return }
            if (name === 'fullscreen') { if (document.fullscreenElement) { document.exitFullscreen?.() } else { host.current?.requestFullscreen?.().catch(() => { }) } return }
            if (name === 'options') { setShowOptions(true); return }
            if (name === 'close-options') { setShowOptions(false); return }
            if (name === 'main-menu') { reading = null; game = createGame(); intro = 0; change('title'); return }
            if (name === 'start' || name === 'restart') { reading = null; game = createGame(); intro = 0; change(name === 'start' ? 'intro' : 'playing'); return }
            if (name === 'skip' && state === 'intro') { change('playing'); return }
            if (name === 'pause') { if (state === 'playing' || state === 'intro') { previous = state; change('paused') } else if (state === 'paused') change(previous); return }
            if (name === 'dismiss' && state === 'reading') { reading = null; change('playing'); return }
            if (state !== 'playing') return
            if (name === 'light') game.light = !game.light
            if (name === 'use') { const message = interact(game); if (message === 'escaped') change('won'); else if (lines.includes(message)) { reading = { title: storyTitles[lines.indexOf(message)], text: message }; change('reading') } else { game.message = message; game.messageTime = 4 } }
            sync()
        }
        runtime.current = { action, moveStick: value => { analog = state === 'playing' ? value : { x: 0, y: 0 } }, aimStick: value => { if (state !== 'playing') return; if (Math.hypot(value.x, value.y) > 0) { game.angle = Math.atan2(value.y, value.x); game.mouse = true } else { game.mouse = false; if (Math.hypot(analog.x, analog.y) > 0) game.angle = Math.atan2(analog.y, analog.x) } } }
        const key = e => {
            if (state === 'reading') { if (e.type === 'keydown' && e.code === 'Escape') { e.preventDefault(); action('dismiss') } return }
            const map = { KeyW: 'up', ArrowUp: 'up', KeyS: 'down', ArrowDown: 'down', KeyA: 'left', ArrowLeft: 'left', KeyD: 'right', ArrowRight: 'right', ShiftLeft: 'run', ShiftRight: 'run' }
            if (map[e.code]) { e.preventDefault(); if (e.type === 'keydown') pressed.add(map[e.code]); else pressed.delete(map[e.code]); return }
            if (e.type !== 'keydown' || e.repeat) return
            if (state === 'intro' && ['Escape', 'Space', 'Enter'].includes(e.code)) { e.preventDefault(); action('skip'); return }
            const command = { KeyE: 'use', KeyF: 'light', Escape: 'pause', KeyR: 'restart', KeyT: 'touch' }[e.code]
            if (command) { e.preventDefault(); action(command) }
        }
        const blur = () => { pressed.clear(); if (state === 'playing' || state === 'intro') action('pause') }
        const visibility = () => { if (document.hidden) blur() }
        const aim = e => { if (e.pointerType === 'touch') return; const r = canvas.current.getBoundingClientRect(); const c = game.camera || { x: 320, y: 360 }; game.angle = Math.atan2((e.clientY - r.top) * 720 / r.height + c.y - game.player.y, (e.clientX - r.left) * 1280 / r.width + c.x - game.player.x); game.mouse = true }
        const tick = now => {
            if (!alive) return
            const dt = Math.min((now - last) / 1000 || 0, .033); last = now
            if (state === 'intro') {
                const before = intro; intro += dt; renderIntro(canvas.current.getContext('2d'), intro, images, reduced)
                if ([1.1, 3.6].some(t => before < t && intro >= t)) { tracks.thunder.currentTime = 0; play('thunder') }
                if (intro >= 10) change('playing')
            }
            if (state === 'playing') {
                game.time += dt; game.messageTime -= dt
                const usingStick = Math.hypot(analog.x, analog.y) > 0
                const dx = usingStick ? analog.x : Number(pressed.has('right')) - Number(pressed.has('left')), dy = usingStick ? analog.y : Number(pressed.has('down')) - Number(pressed.has('up')), len = Math.hypot(dx, dy)
                const old = { ...game.player }, running = usingStick ? len >= .85 : pressed.has('run')
                if (len) { move(game.player, dx / Math.max(1, len) * (running ? 310 : 190) * dt, dy / Math.max(1, len) * (running ? 310 : 190) * dt, game.closed); if (touchMode.current && !game.mouse) game.angle = Math.atan2(dy, dx) }
                const travelled = distance(old, game.player); game.moving = travelled > .01; game.steps += travelled
                for (const sound of ['walk', 'run']) { if (game.moving && sound === (running ? 'run' : 'walk')) play(sound); else tracks[sound].pause() }
                game.keys.forEach((k, i) => {
                    if (game.collected.includes(i) || distance(k, game.player) > 34) return
                    if (game.enemy) { game.message = 'Primero encierra a la presencia en su habitación.'; game.messageTime = 2; return }
                    game.collected.push(i)
                    const points = candidates[i].filter(p => distance(p, game.player) >= 180 && route(p, game.player, game.closed).length)
                    const spawn = points[Math.floor(Math.random() * points.length)]
                    if (spawn) game.enemy = { ...spawn, path: [], repath: 0 }
                    game.message = '¡Corre al pasillo y cierra la puerta con E!'; game.messageTime = 5
                })
                if (game.enemy) {
                    const e = game.enemy; e.repath -= dt
                    if (e.repath <= 0) { e.path = route(e, game.player, game.closed); e.repath = .3 }
                    const target = e.path[0]
                    if (target) { const d = distance(e, target), step = Math.min(d, 220 * dt); if (d > .01) move(e, (target.x - e.x) / d * step, (target.y - e.y) / d * step, game.closed); if (d < 8) e.path.shift() }
                    play('enemy')
                    if (distance(e, game.player) < 32) change('lost')
                } else tracks.enemy.pause()
                render(canvas.current.getContext('2d'), game, images)
                hudTime += dt; if (hudTime > .15) { sync(); hudTime = 0 }
            }
            frame = requestAnimationFrame(tick)
        }
        loadArt().then(art => { if (!alive) return; images = art; change('title'); frame = requestAnimationFrame(tick) }).catch(() => { if (alive) change('error') })
        const node = host.current, previousFocus = document.activeElement
        node.focus()
        node.addEventListener('keydown', key); node.addEventListener('keyup', key); canvas.current.addEventListener('pointermove', aim)
        window.addEventListener('blur', blur); document.addEventListener('visibilitychange', visibility)
        const appRoot = document.getElementById('root'), wasInert = appRoot?.inert; if (appRoot) appRoot.inert = true; const oldOverflow = document.body.style.overflow; document.body.style.overflow = 'hidden'
        return () => { alive = false; cancelAnimationFrame(frame); runtime.current = null; audioTracks.current = {}; Object.values(tracks).forEach(a => { a.pause(); a.removeAttribute('src'); a.load() }); node.removeEventListener('keydown', key); node.removeEventListener('keyup', key); window.removeEventListener('blur', blur); document.removeEventListener('visibilitychange', visibility); if (document.fullscreenElement === node) document.exitFullscreen?.(); document.body.style.overflow = oldOverflow; if (appRoot) appRoot.inert = wasInert; previousFocus?.focus() }
    }, [])
    useEffect(() => { const updateFullscreen = () => setFullscreen(document.fullscreenElement === host.current); document.addEventListener('fullscreenchange', updateFullscreen); return () => document.removeEventListener('fullscreenchange', updateFullscreen) }, [])
    const action = name => runtime.current?.action(name)
    return createPortal(<div className={touch ? "uu uu-touch-mode" : "uu"} ref={host} tabIndex={-1} role="dialog" aria-modal="true" aria-label="usUnknown" onKeyDown={e => {
        if (e.key !== 'Tab') return
        const nodes = [...host.current.querySelectorAll('button:not([disabled])')], first = nodes[0], last = nodes.at(-1)
        if (e.shiftKey && (document.activeElement === first || document.activeElement === host.current)) { e.preventDefault(); last?.focus() }
        else if (!e.shiftKey && (document.activeElement === last || document.activeElement === host.current)) { e.preventDefault(); first?.focus() }
    }}>
        <header className="uu-toolbar"><div>{['playing', 'intro'].includes(view.state) ? <button onClick={() => action('pause')}>Pausa</button> : view.state === 'paused' ? null : <button onClick={onClose}>Cerrar juego ×</button>}</div></header>
        <div className="uu-stage">
            <canvas ref={canvas} width="1280" height="720" aria-label="Explora la mansión con WASD o flechas. Corre con Shift, usa E e ilumina con F." />
            {['loading', 'title', 'error'].includes(view.state) && <div className="uu-cover" style={{ backgroundImage: 'linear-gradient(90deg,#060a12ed,#060a1240),url(' + base + 'art/menu-mansion.png)' }}><div><h1>USUNKNOWN</h1>{view.state === 'title' ? <><button className="uu-primary" onClick={() => action('start')}>Entrar en la mansión →</button><button onClick={() => action('options')}>Opciones</button></> : <p role="status">{view.state === 'error' ? 'No se pudieron cargar las imágenes. Cierra el juego y vuelve a intentarlo.' : 'Preparando la mansión…'}</p>}</div></div>}
            {showOptions && <div className="uu-options" role="dialog" aria-modal="true" aria-labelledby="uu-options-title"><div className="uu-options__panel"><p className="uu-eyebrow">USUNKNOWN</p><h2 id="uu-options-title">Opciones</h2><label>Volumen del sonido <output>{gameSettings.volume}%</output><input type="range" min="0" max="100" value={gameSettings.volume} onChange={e => updateSetting('volume', Number(e.target.value))} /></label><label>Brillo de pantalla <output>{gameSettings.brightness}%</output><input type="range" min="35" max="100" value={gameSettings.brightness} onChange={e => updateSetting('brightness', Number(e.target.value))} /></label><label>Distribución de controles<select value={gameSettings.controlLayout} onChange={e => updateControlLayout(e.target.value)}><option value="standard">Mover a la izquierda</option><option value="left-handed">Mover a la derecha</option></select></label><label>Distribución de botones<select value={gameSettings.buttonLayout} onChange={e => updateButtonLayout(e.target.value)}><option value="left">A la izquierda</option><option value="center">Al centro</option><option value="right">A la derecha</option></select></label><button aria-pressed={touch} onClick={() => action('touch')}>Táctil: {touch ? 'Activo' : 'Inactivo'}</button><button aria-pressed={fullscreen} onClick={() => action('fullscreen')}>Pantalla completa: {fullscreen ? 'Activa' : 'Inactiva'}</button><button onClick={() => { setShowOptions(false); setEditingControls(true) }}>Personalizar controles</button><button className="uu-primary" onClick={() => action('close-options')}>Volver</button></div></div>}
            {view.state === 'intro' && <button className="uu-skip" onClick={() => action('skip')}>Saltar intro · Espacio →</button>}
            {view.state === 'playing' && <>{view.message && <p className="uu-message" role="status">{view.message}</p>}</>}
            {['paused', 'won', 'lost'].includes(view.state) && <div className={`uu-overlay${view.state === 'paused' ? ' uu-overlay--paused' : ''}`}><p className="uu-eyebrow">USUNKNOWN</p><h2>{view.state === 'paused' ? 'Pausa' : view.state === 'won' ? 'Has escapado.' : 'Fin de la partida'}</h2>{view.state === 'paused' && <><button className="uu-primary" onClick={() => action('pause')}>Continuar</button><button onClick={() => action('options')}>Opciones</button><button onClick={onClose}>Cerrar juego ×</button><button onClick={() => action('main-menu')}>Menú principal</button></>}<button onClick={() => action('restart')}>Volver a comenzar</button><button onClick={() => action('start')}>Ver cinemática</button></div>}
        </div>
        {view.state === 'reading' && view.reading && <StoryReading title={view.reading.title} text={view.reading.text} onClose={() => action('dismiss')} />}
        {touch && (view.state === 'playing' || editingControls) && <div className={`uu-touch${editingControls ? ' is-editing' : ''}`} data-control-layout={gameSettings.controlLayout} data-button-layout={gameSettings.buttonLayout}><DraggableControl editing={editingControls} position={gameSettings.positions.move} onPositionChange={position => updatePosition('move', position)} className="uu-touch-control uu-touch-control--move"><TouchJoystick label="Mover" onChange={value => runtime.current?.moveStick(value)} /></DraggableControl><DraggableControl editing={editingControls} position={gameSettings.positions.actions} onPositionChange={position => updatePosition('actions', position)} className="uu-touch-control uu-touch-control--actions"><div className="uu-touch-actions"><button onClick={() => action('light')}>Luz</button><button onClick={() => action('use')}>Usar</button></div></DraggableControl><DraggableControl editing={editingControls} position={gameSettings.positions.aim} onPositionChange={position => updatePosition('aim', position)} className="uu-touch-control uu-touch-control--aim"><TouchJoystick label="Linterna" onChange={value => runtime.current?.aimStick(value)} /></DraggableControl></div>}
        {editingControls && <div className="uu-control-edit-bar"><span>Arrastra los controles a tu gusto</span><button onClick={() => setEditingControls(false)}>Listo</button></div>}
        <footer className="uu-footer">{touch ? "Izquierdo: mover · Al borde: correr · Derecho: apuntar" : "WASD / flechas: caminar · Shift: correr · E: usar · F: linterna · Esc: pausa"}</footer>
        <div className="uu-brightness" style={{ opacity: (100 - gameSettings.brightness) / 100 }} aria-hidden="true" />
    </div>, document.body)
}
