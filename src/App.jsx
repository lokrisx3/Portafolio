import Header from './components/Header.jsx'
import About from './sections/About.jsx'
import ProfessionalAbout from './sections/ProfessionalAbout.jsx'
import Projects from './sections/Projects.jsx'
import Skills from './sections/Skills.jsx'
import { useEffect, useState } from 'react'
import { isFiestasPatrias } from './season'
import './lite.css'

function App() {
  const [liteTheme, setLiteTheme] = useState(() => {
    try {
      const saved = localStorage.getItem('portfolio-lite-theme')
      return ['light', 'reading', 'dark'].includes(saved) ? saved : 'light'
    } catch { return 'light' }
  })
  const changeLiteTheme = (theme) => {
    if (!['light', 'reading', 'dark'].includes(theme)) return
    setLiteTheme(theme)
    try { localStorage.setItem('portfolio-lite-theme', theme) } catch { /* Keep selection for this visit. */ }
  }
  const [liteFontSize, setLiteFontSize] = useState(() => {
    try {
      const saved = Number(localStorage.getItem('portfolio-lite-font-size'))
      return [14, 16, 18, 20].includes(saved) ? saved : 16
    } catch { return 16 }
  })
  const changeLiteFontSize = (size) => {
    if (![14, 16, 18, 20].includes(size)) return
    setLiteFontSize(size)
    try { localStorage.setItem('portfolio-lite-font-size', String(size)) } catch { /* Keep selection for this visit. */ }
  }
  const [lite, setLite] = useState(() => {
    try { return localStorage.getItem('portfolio-lite') === 'true' } catch { return false }
  })
  const toggleLite = () => {
    const next = !lite
    setLite(next)
    try { localStorage.setItem('portfolio-lite', String(next)) } catch { /* Keep selection for this visit. */ }
  }
  const [fiestas, setFiestas] = useState(isFiestasPatrias)
  useEffect(() => {
    const refreshSeason = () => setFiestas(isFiestasPatrias())
    const timer = window.setInterval(refreshSeason, 60_000)
    document.addEventListener('visibilitychange', refreshSeason)
    return () => {
      window.clearInterval(timer)
      document.removeEventListener('visibilitychange', refreshSeason)
    }
  }, [])
  return (
    <div id="inicio" data-fiestas={!lite && fiestas} data-lite-theme={lite ? liteTheme : undefined} className={lite ? 'portfolio-lite' : undefined} style={lite ? { '--lite-font-size': `${liteFontSize}px` } : undefined}>
      <Header lite={lite} onToggleLite={toggleLite} liteFontSize={liteFontSize} onLiteFontSizeChange={changeLiteFontSize} liteTheme={liteTheme} onLiteThemeChange={changeLiteTheme} />

      <main>
        <About fiestas={fiestas} lite={lite} />
        <ProfessionalAbout />
        <Projects lite={lite} />
        <Skills lite={lite} />
      </main>
    </div>
  );
}

export default App;
