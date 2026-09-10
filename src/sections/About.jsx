import { useState } from 'react'
import terremoto from '../assets/pixel-terremoto.png'
import coffeeMug from '../assets/pixel-coffee-mug.png'
import laptop from '../assets/pixel-laptop-profile.png'
import realProfile from '../assets/foto-perfil-cut.png'
import pixelProfile from '../assets/foto-perfil-pixel.png'
import chupalla from '../assets/pixel-chupalla.png'
import nightSpaceStudio from '../assets/night-space-studio.png'
import daylightStudio from '../assets/daylight-studio.png'

function PixelLaptop({ fiestas }) {
  const [imageMode, setImageMode] = useState('real')
  const toggleProfile = () => setImageMode((mode) => mode === 'real' ? 'generative' : 'real')
  const nextProfileLabel = imageMode === 'real' ? 'Mostrar retrato pixel art' : 'Mostrar foto real'

  return <div className="desk-scene" aria-label="Notebook con foto de perfil de Cristian">
    <img className={fiestas ? 'pixel-mug pixel-terremoto' : 'pixel-mug'} src={fiestas ? terremoto : coffeeMug} alt={fiestas ? 'Terremoto chileno con helado de piña y granadina, en pixel art' : 'Taza de café pixel art'} />
    <div className="generated-notebook">
      <img className="pixel-laptop" src={laptop} alt="Notebook pixel art" />
      <div className="profile-screen-composition">
      <img
        className="real-profile-on-screen"
        data-image-mode={imageMode}
        src={imageMode === 'real' ? realProfile : pixelProfile}
        alt={imageMode === 'real' ? 'Foto real de Cristian Fritz Sepúlveda' : 'Retrato pixel art de Cristian Fritz Sepúlveda'}
      />
      {fiestas && imageMode === 'generative' && <img className="profile-chupalla" src={chupalla} alt="Chupalla chilena" />}
      </div>
      <button className="screen-arrow screen-arrow-left" type="button" onClick={toggleProfile} aria-label={nextProfileLabel}>‹</button>
      <button className="screen-arrow screen-arrow-right" type="button" onClick={toggleProfile} aria-label={nextProfileLabel}>›</button>
    </div>
  </div>
}

function About({ fiestas }) {
  return (
    <section className="about-section" aria-labelledby="about-title" style={{ '--studio-scene': `url(${nightSpaceStudio})`, '--daylight-scene': `url(${daylightStudio})` }}>
      {fiestas && <div className="fiestas-bunting" aria-hidden="true">{Array.from({ length: 24 }, (_, i) => <span key={i} />)}</div>}
      <div className="about-copy">
        {fiestas && <p className="fiestas-label"><span className="chilean-flag" aria-hidden="true">★</span> FIESTAS PATRIAS</p>}
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

      <PixelLaptop fiestas={fiestas} />
      <div className="section-rgb-divider" aria-hidden="true" />
    </section>
  )
}

export default About
