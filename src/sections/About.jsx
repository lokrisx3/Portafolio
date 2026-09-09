import { useState } from 'react'
import coffeeMug from '../assets/pixel-coffee-mug.png'
import laptop from '../assets/pixel-laptop-profile.png'
import realProfile from '../assets/foto-perfil-cut.png'
import pixelProfile from '../assets/foto-perfil-pixel.png'
import nightSpaceStudio from '../assets/night-space-studio.png'

function PixelLaptop() {
  const [imageMode, setImageMode] = useState('generative')

  return <div className="desk-scene" aria-label="Notebook con foto de perfil de Cristian">
    <img className="pixel-mug" src={coffeeMug} alt="Taza de café pixel art" />
    <div className="generated-notebook">
      <img className="pixel-laptop" src={laptop} alt="Notebook pixel art" />
      <img
        className="real-profile-on-screen"
        src={imageMode === 'real' ? realProfile : pixelProfile}
        alt={imageMode === 'real' ? 'Foto real de Cristian Fritz Sepúlveda' : 'Retrato pixel art de Cristian Fritz Sepúlveda'}
      />
      <button className="screen-arrow screen-arrow-left" type="button" onClick={() => setImageMode('real')} aria-label="Mostrar foto real" aria-pressed={imageMode === 'real'}>‹</button>
      <button className="screen-arrow screen-arrow-right" type="button" onClick={() => setImageMode('generative')} aria-label="Mostrar retrato generativo" aria-pressed={imageMode === 'generative'}>›</button>
    </div>
  </div>
}

function About() {
  return (
    <section className="about-section" aria-labelledby="about-title" style={{ '--studio-scene': `url(${nightSpaceStudio})` }}>
      <div className="about-copy">
        <p className="section-label">HOLA, SOY</p>
        <h1 id="about-title">CRISTIAN FRITZ<br />SEPÚLVEDA<span className="cursor" /></h1>
        <p className="about-role">DESARROLLADOR FULL STACK<br /><span>ANALISTA PROGRAMADOR</span></p>
        <p className="about-description">
          Más de 5 años de experiencia profesional en TI,<br />con foco en desarrollo de software, automatización,<br />monitoreo y QA de aplicaciones web.
        </p>

        <div className="hero-tech-strip">
          <img
            src="https://skillicons.dev/icons?i=java,js,python,cs,php,html,css,react,spring,django,bootstrap,postgres,mysql,selenium,git,github,docker,linux&theme=dark&perline=18"
            alt="Java, JavaScript, Python, C#, PHP, HTML, CSS, React, Spring Boot, Django, Bootstrap, PostgreSQL, MySQL, Selenium, Git, GitHub, Docker y Linux"
          />
        </div>

        <div className="profile-links" aria-label="Perfiles profesionales">
          <a href="https://github.com/lokrisx3" target="_blank" rel="noreferrer"><span aria-hidden="true">GH</span> GITHUB</a>
          <a href="https://www.linkedin.com/in/cfritzsepulveda/" target="_blank" rel="noreferrer"><span aria-hidden="true">in</span> LINKEDIN</a>
        </div>
      </div>

      <PixelLaptop />
      <div className="section-rgb-divider" aria-hidden="true" />
    </section>
  )
}

export default About
