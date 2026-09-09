import { useRef, useState } from 'react'
import { flushSync } from 'react-dom'
import WeatherClock from './WeatherClock.jsx'
import PuduRunner from './PuduRunner.jsx'
import { getInitialTheme, saveTheme } from '../theme.js'

const navigation = [
  { label: 'INICIO', target: 'inicio' },
  { label: 'SOBRE MÍ', target: 'sobre-mi' },
  { label: 'PROYECTOS', target: 'proyectos' },
  { label: 'HABILIDADES', target: 'habilidades' },
]

function Header() {
  const [runnerOpen, setRunnerOpen] = useState(false)
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [theme, setTheme] = useState(getInitialTheme)
  const themeTransition = useRef(null)

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
    <header className="site-header" id="inicio">
      <button className="site-brand runner-launch" type="button" onClick={() => setRunnerOpen(true)} aria-label="Jugar Pudú Runner" title="¿Una pausa? Juega Pudú Runner">
        <span>&gt;_</span>
      </button>
      {runnerOpen && <PuduRunner onClose={() => setRunnerOpen(false)} />}

      <button
        className="menu-toggle"
        type="button"
        aria-label={isMenuOpen ? 'Cerrar navegación' : 'Abrir navegación'}
        aria-expanded={isMenuOpen}
        aria-controls="main-navigation"
        onClick={() => setIsMenuOpen((isOpen) => !isOpen)}
      >
        {isMenuOpen ? '×' : '☰'}
      </button>
      <nav className={isMenuOpen ? 'is-open' : ''} id="main-navigation" aria-label="Navegación principal">
        {navigation.map(({ label, target }, index) => (
          <a className={index === 0 ? 'active' : ''} href={`#${target}`} key={target} onClick={() => setIsMenuOpen(false)}>
            <b>[0{index + 1}]</b> {label}
          </a>
        ))}
      </nav>
      <WeatherClock />
      <button
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
      </button>
    </header>
  )
}

export default Header
