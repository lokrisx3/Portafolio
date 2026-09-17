import Header from './components/Header.jsx'
import { lazy, Suspense, useEffect, useState } from 'react'
import { isFiestasPatrias } from './season'
import './lite.css'

const CONTENT_LOAD_TIMEOUT = 8000
const About = lazy(() => import('./sections/About.jsx'))
const ProfessionalAbout = lazy(() => import('./sections/ProfessionalAbout.jsx'))
const Projects = lazy(() => import('./sections/Projects.jsx'))
const Skills = lazy(() => import('./sections/Skills.jsx'))
const Education = lazy(() => import('./sections/Education.jsx'))

function LoadingScreen({ timedOut }) {
  return (
    <div className="portfolio-loading" role="status" aria-live="polite">
      <span className="portfolio-loading__indicator" aria-hidden="true" />
      <p>{timedOut ? 'La carga está tardando más de lo esperado...' : 'Cargando portafolio...'}</p>
    </div>
  )
}

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
  const [contentLoadTimedOut, setContentLoadTimedOut] = useState(false)
  useEffect(() => {
    const timer = window.setTimeout(() => setContentLoadTimedOut(true), CONTENT_LOAD_TIMEOUT)
    return () => window.clearTimeout(timer)
  }, [])
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

      <Suspense fallback={<LoadingScreen timedOut={contentLoadTimedOut} />}>
        <main>
          <About fiestas={fiestas} lite={lite} />
          <ProfessionalAbout lite={lite} />
          {lite && <Education />}
          <Projects lite={lite} />
          {lite && <Education coursesOnly />}
          <Skills lite={lite} />
        </main>
      </Suspense>
    </div>
  );
}

export default App;
