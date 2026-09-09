const projects = [
  {
    number: '01',
    type: 'APLICACIÓN WEB',
    title: 'VISIUM',
    description: 'Participé como desarrollador Full Stack y Scrum Master en una plataforma de gestión para ópticas, con módulos de pacientes, fichas clínicas y consultas.',
    stack: ['React', 'Java', 'Spring Boot', 'PostgreSQL', 'IA'],
    accent: 'purple',
  },
  {
    number: '02',
    type: 'AUTOMATIZACIÓN',
    title: 'F29DOWNLOADER',
    description: 'Desarrollé una aplicación de escritorio para automatizar la navegación y descarga de Formularios 29 desde la plataforma del SII.',
    stack: ['C#', 'Windows Forms', 'Playwright', 'IA'],
    accent: 'cyan',
  },
  {
    number: '03',
    type: 'EXTENSIÓN DE CHROME',
    title: 'PUDUTAROT',
    description: 'Creé y publiqué una extensión de Chrome para seleccionar cartas de tarot y consultar sus significados.',
    stack: ['HTML', 'JavaScript', 'JSON', 'CSS', 'IA'],
    accent: 'green',
  },
  {
    number: '04',
    type: 'FUNCIONALIDAD WEB',
    title: 'SISTEMA DE TRACKING GPS',
    description: 'Implementé un sistema de seguimiento GPS para Automaster.',
    stack: ['PHP', 'JavaScript', 'CSS', 'MySQL'],
    accent: 'purple',
  },
]

function Projects() {
  return (
    <section className="projects-section" id="proyectos" aria-labelledby="projects-title">
      <div className="projects-heading">
        <div>
          <p className="terminal-kicker">[03] PROYECTOS SELECCIONADOS</p>
          <h2 id="projects-title">COSAS QUE HE<br />CONSTRUIDO<span className="title-dot">.</span></h2>
        </div>
        <p>Proyectos de desarrollo web, automatización y aplicaciones de escritorio en los que he trabajado.</p>
      </div>

      <div className="projects-grid">
        {projects.map((project) => (
          <article className={`project-card project-card--${project.accent}`} key={project.number}>
            <div className="project-card__topline"><span>[{project.number}]</span><span>{project.type}</span></div>
            <div className="project-preview" aria-hidden="true"><i /><i /><i /><b>{project.number}</b><em /><small /></div>
            <h3>{project.title}</h3>
            <p>{project.description}</p>
            <ul className="project-stack" aria-label={`Tecnologías de ${project.title}`}>
              {project.stack.map((technology) => <li key={technology}><TechSymbol name={technology} />{technology}</li>)}
            </ul>
          </article>
        ))}
      </div>
    </section>
  )
}

export default Projects
import TechSymbol from '../components/TechSymbol.jsx'
