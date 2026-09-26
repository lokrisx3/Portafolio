import TechSymbol from '../components/TechSymbol.jsx'
import ProjectArtwork from '../components/ProjectArtwork.jsx'
import { useState } from 'react'

const gameImages = [
  { src: '/docs/img/img/boceto1.png', alt: 'Primer boceto de Amnein' },
  { src: '/docs/img/img/boceto2.png', alt: 'Segundo boceto de Amnein' },
]

const projects = [
  {
    number: '01',
    type: 'APLICACIÓN WEB',
    title: 'VISIUM',
    artwork: 'visium',
    duration: '3 meses',
    description: 'Participé como desarrollador Full Stack y Scrum Master en una plataforma de gestión para ópticas, con módulos de pacientes, fichas clínicas y consultas.',
    stack: ['React', 'Java', 'Spring Boot', 'PostgreSQL', 'IA'],
    accent: 'purple',
  },
  {
    number: '02',
    type: 'AUTOMATIZACIÓN',
    title: 'F29DOWNLOADER',
    artwork: 'downloader',
    duration: '1 mes',
    cvStack: ['.NET 8', 'C#', 'Windows Forms', 'Playwright', 'SQLite', 'ClosedXML'],
    description: 'Desarrollé una aplicación de escritorio para automatizar la navegación y descarga de Formularios 29 desde la plataforma del SII.',
    stack: ['C#', 'Windows Forms', 'Playwright', 'IA'],
    accent: 'cyan',
  },
  {
    number: '03',
    type: 'EXTENSIÓN DE CHROME',
    title: 'PUDUTAROT',
    artwork: 'tarot',
    duration: '1 mes',
    url: 'https://chromewebstore.google.com/detail/nfeefcdjlmaoapbgenolnokcbaeleijp?utm_source=item-share-cb',
    description: 'Creé y publiqué una extensión de Chrome para seleccionar cartas de tarot y consultar sus significados.',
    stack: ['HTML', 'JavaScript', 'JSON', 'CSS', 'IA'],
    accent: 'green',
  },
  {
    number: '04',
    type: 'FUNCIONALIDAD WEB',
    title: 'SISTEMA DE TRACKING GPS',
    artwork: 'gps',
    duration: '1 semestre',
    description: 'Implementé un sistema de seguimiento GPS para Automaster.',
    stack: ['PHP', 'JavaScript', 'CSS', 'MySQL'],
    accent: 'purple',
  },
]

function Projects({ lite = false }) {
  const [showGameSketches, setShowGameSketches] = useState(false)
  return (
    <section className="projects-section" id="proyectos" aria-labelledby="projects-title">
      <div className="projects-heading">
        <div>
          <p className="terminal-kicker">[03] PROYECTOS</p>
          <h2 id="projects-title">{lite ? 'Proyectos' : <>COSAS QUE HE<br />CONSTRUIDO<span className="title-dot">.</span></>}</h2>
        </div>
        <p>Proyectos de desarrollo web, automatización y aplicaciones de escritorio en los que he trabajado.</p>
      </div>

      <div className="projects-grid">

        {projects.map((project) => (
          <article className={`project-card project-card--${project.accent}`} key={project.number}>
            <div className="project-card__topline"><span>[{project.number}]</span><span>{project.type}</span></div>
            {!lite && <ProjectArtwork kind={project.artwork} />}
            <h3>{project.title}</h3>
            {lite && <p className="cv-project-meta">{project.type.toLocaleLowerCase('es')} · {project.duration}</p>}
            <p>{project.description}</p>
            <ul className="project-stack" aria-label={`Tecnologías de ${project.title}`}>
              {(lite ? project.cvStack ?? project.stack : project.stack).map((technology) => <li key={technology}>{!lite && <TechSymbol name={technology} />}{lite && technology === 'IA' ? 'Apoyo con IA' : technology}</li>)}
            </ul>
            {project.url && (
              <a className="project-link" href={project.url} target="_blank" rel="noopener noreferrer">
                Ver en Chrome Web Store <span aria-hidden="true">↗</span>
              </a>
            )}
          </article>
        ))}
      </div>
      {showGameSketches && <div className="game-sketch-overlay" role="dialog" aria-modal="true" aria-label="Bocetos del juego Amnein" onClick={() => setShowGameSketches(false)}>
        <div className="game-sketch-panel" onClick={event => event.stopPropagation()}>
          <div className="game-sketch-heading"><div><span>EN DESARROLLO</span><h3>Bocetos de Amnein</h3></div><button type="button" onClick={() => setShowGameSketches(false)} aria-label="Cerrar bocetos">×</button></div>
          <div className="game-sketch-images">{gameImages.map(image => <figure key={image.src}><img src={image.src} alt={image.alt} /><figcaption>{image.alt}</figcaption></figure>)}</div>
        </div>
      </div>}
    </section>
  )
}

export default Projects
