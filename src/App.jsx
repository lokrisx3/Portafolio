import Header from './components/Header.jsx'
import About from './sections/About.jsx'
import ProfessionalAbout from './sections/ProfessionalAbout.jsx'
import Projects from './sections/Projects.jsx'
import Skills from './sections/Skills.jsx'
import { useEffect, useState } from 'react'
import { isFiestasPatrias } from './season'

function App() {
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
    <div id="inicio" data-fiestas={fiestas}>
      <Header />

      <main>
        <About fiestas={fiestas} />
        <ProfessionalAbout />
        <Projects />
        <Skills />
      </main>
    </div>
  );
}

export default App;
