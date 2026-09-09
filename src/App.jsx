import Header from './components/Header.jsx'
import About from './sections/About.jsx'
import ProfessionalAbout from './sections/ProfessionalAbout.jsx'
import Projects from './sections/Projects.jsx'
import Skills from './sections/Skills.jsx'

function App() {
  return (
    <>
      <Header />

      <main>
        <About />
        <ProfessionalAbout />
        <Projects />
        <Skills />
      </main>
    </>
  );
}

export default App;
