import { useState } from 'react'
import WeatherClock from './WeatherClock.jsx'

const navigation = [
  { label: 'INICIO', target: 'inicio' },
  { label: 'SOBRE MÍ', target: 'sobre-mi' },
  { label: 'PROYECTOS', target: 'proyectos' },
  { label: 'HABILIDADES', target: 'habilidades' },
]

function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)

  return (
    <header className="site-header" id="inicio">
      <a className="site-brand" href="#inicio" aria-label="Ir al inicio">
        <span>&gt;_</span><i />
      </a>

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
      <button className="theme-toggle" type="button" aria-label="Cambiar tema">☼</button>
    </header>
  )
}

export default Header
