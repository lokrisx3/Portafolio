import { useEffect, useRef, useState } from 'react'
import { flushSync } from 'react-dom'
import WeatherClock from './WeatherClock.jsx'
import GameSelector from './GameSelector.jsx'
import { getInitialTheme, saveTheme } from '../theme.js'

const navigation = [
  { label: 'INICIO', target: 'inicio' },
  { label: 'SOBRE MÍ', target: 'sobre-mi' },
  { label: 'PROYECTOS', target: 'proyectos' },
  { label: 'HABILIDADES', target: 'habilidades' },
]

function Header({ lite = false, onToggleLite, liteFontSize = 16, onLiteFontSizeChange, liteTheme = 'light', onLiteThemeChange }) {
  const [gamesOpen, setGamesOpen] = useState(false)
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [activeSection, setActiveSection] = useState('inicio')
  const [theme, setTheme] = useState(getInitialTheme)
  const themeTransition = useRef(null)

  useEffect(() => {
    let frame = 0
    const updateActiveSection = () => {
      frame = 0
      const marker = Math.max(76, window.innerHeight * 0.3)
      let current = 'inicio'
      for (const { target } of navigation.slice(1)) {
        const section = document.getElementById(target)
        if (section && section.getBoundingClientRect().top <= marker) current = target
      }
      if (window.scrollY > 0 && window.scrollY + window.innerHeight >= document.documentElement.scrollHeight - 2) {
        current = navigation.at(-1).target
      }
      setActiveSection(current)
    }
    const scheduleUpdate = () => {
      if (!frame) frame = window.requestAnimationFrame(updateActiveSection)
    }
    scheduleUpdate()
    window.addEventListener('scroll', scheduleUpdate, { passive: true })
    window.addEventListener('resize', scheduleUpdate)
    const resizeObserver = new ResizeObserver(scheduleUpdate)
    const main = document.querySelector('main')
    if (main) resizeObserver.observe(main)
    return () => {
      window.cancelAnimationFrame(frame)
      window.removeEventListener('scroll', scheduleUpdate)
      window.removeEventListener('resize', scheduleUpdate)
      resizeObserver.disconnect()
    }
  }, [])

  function toggleTheme() {
    themeTransition.current?.skipTransition()
    const nextTheme = theme === 'dark' ? 'light' : 'dark'
    const updateTheme = () => {
      saveTheme(nextTheme)
      flushSync(() => setTheme(nextTheme))
    }
    if (document.startViewTransition && !window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      themeTransition.current = document.startViewTransition(updateTheme)
    } else {
      updateTheme()
    }
  }

  return (
    <header className="site-header">
      {!lite && <button className="site-brand games-launch" type="button" onClick={() => setGamesOpen(true)} aria-label="Abrir selector de juegos" aria-haspopup="dialog" title="Jugar: Pudú Runner y usUnknown">
        <span>&gt;_</span>
      </button>}
      {!lite && gamesOpen && <GameSelector onClose={() => setGamesOpen(false)} />}
      <button className="lite-toggle" type="button" aria-pressed={lite} onClick={onToggleLite}>Modo lite</button>

      <button
        className="menu-toggle"
        type="button"
        aria-label={isMenuOpen ? 'Cerrar navegación' : 'Abrir navegación'}
        aria-expanded={isMenuOpen}
        aria-controls="main-navigation"
        onClick={() => setIsMenuOpen((isOpen) => !isOpen)}
      >
        <span className="menu-toggle__lines" aria-hidden="true">
          <span /><span /><span />
        </span>
      </button>
      <nav className={isMenuOpen ? 'is-open' : ''} id="main-navigation" aria-label="Navegación principal">
        {navigation.map(({ label, target }, index) => (
          <a className={activeSection === target ? 'active' : ''} aria-current={activeSection === target ? 'location' : undefined} href={`#${target}`} key={target} onClick={() => setIsMenuOpen(false)}>
            <b>[0{index + 1}]</b> <span className="nav-label">{label}</span>
          </a>
        ))}
      </nav>
      {!lite && <WeatherClock />}
      {lite && <label className="lite-font-control">
        <span>Tamaño de letra</span>
        <select value={liteFontSize} onChange={event => onLiteFontSizeChange(Number(event.target.value))}>
          <option value={14}>Pequeña</option>
          <option value={16}>Normal</option>
          <option value={18}>Grande</option>
          <option value={20}>Muy grande</option>
        </select>
      </label>}
      {lite ? <label className="lite-font-control lite-theme-control">
        <span>Apariencia</span>
        <select value={liteTheme} onChange={event => onLiteThemeChange(event.target.value)}>
          <option value="light">Claro</option>
          <option value="reading">Lectura</option>
          <option value="dark">Oscuro</option>
        </select>
      </label> : <button
        className="theme-toggle"
        type="button"
        onClick={toggleTheme}
        aria-label={theme === 'dark' ? 'Activar modo claro' : 'Activar modo oscuro'}
        title={theme === 'dark' ? 'Activar modo claro' : 'Activar modo oscuro'}
      >
        <span className="theme-toggle__icons" aria-hidden="true">
          <svg className="theme-toggle__icon theme-toggle__sun" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" focusable="false">
            <circle cx="12" cy="12" r="4" />
            <path d="M12 2v2m0 16v2M2 12h2m16 0h2M4.93 4.93l1.42 1.42m11.3 11.3 1.42 1.42M4.93 19.07l1.42-1.42m11.3-11.3 1.42-1.42" />
          </svg>
          <svg className="theme-toggle__icon theme-toggle__moon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" focusable="false">
            <path d="M20.5 14.3A9 9 0 0 1 9.7 3.5a9 9 0 1 0 10.8 10.8Z" />
          </svg>
        </span>
      </button>}
    </header>
  )
}

export default Header
