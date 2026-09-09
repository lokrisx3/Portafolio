const strengths = [
  ['01', 'DESARROLLO FULL STACK', 'Desarrollo y mantengo aplicaciones web, con funcionalidades Front-End y Back-End.'],
  ['02', 'AUTOMATIZACIÓN Y QA', 'Automatizo eventos de usuario para monitoreo y control de calidad de sitios web y aplicaciones móviles.'],
  ['03', 'GESTIÓN DE INCIDENCIAS', 'Resuelvo incidentes técnicos, documento errores funcionales y requerimientos, y gestiono incidencias en Jira.'],
]

const experience = [
  ['ABR–AGO 2026', 'GENERATION CHILE · DESARROLLADOR FULL STACK', 'Proyecto Visium: desarrollo de módulos de pacientes, fichas clínicas y consultas con Java, Spring Boot, PostgreSQL y React. Participación como Scrum Master.'],
  ['NOV 2022–ABR 2024', 'ATENTUS · DESARROLLADOR JUNIOR', 'Desarrollo y mantenimiento de 5 sitios web con React, JavaScript, Python y Django. Gestión de datos en PostgreSQL y control de versiones con Git en Linux.'],
  ['SEP 2019–NOV 2022', 'ATENTUS · INGENIERO ATENCIÓN AL CLIENTE', 'Más de 20 automatizaciones con Selenium y JavaScript, resolución de aproximadamente 100 tickets y migración a Selenium de las automatizaciones de Banco de Chile.'],
  ['DIC 2018–ABR 2019', 'RAC CONSULTORES · PRÁCTICA PROFESIONAL', 'Asistente de Certificador Senior: pruebas de calidad en formularios y aplicaciones web, documentación de errores y requerimientos, y gestión de incidencias en Jira.'],
]

function ProfessionalAbout() {
  return (
    <section className="professional-section" id="sobre-mi" aria-labelledby="professional-title">
      <div className="professional-intro">
        <p className="terminal-kicker">[02] PERFIL PROFESIONAL</p>
        <h2 id="professional-title">SOBRE MÍ<span className="title-dot">.</span></h2>
        <p>
          Soy desarrollador Full Stack y Analista Programador con más de 5 años de experiencia
          profesional en TI. Mi experiencia abarca desarrollo y mantenimiento de aplicaciones,
          automatización de eventos de usuario, resolución de incidentes y documentación de requerimientos.
        </p>
      </div>

      <div className="strength-grid">
        {strengths.map(([number, title, description]) => (
          <article className="strength-card" key={number}>
            <span>{number}</span>
            <h3>{title}</h3>
            <p>{description}</p>
          </article>
        ))}
      </div>

      <div className="experience-panel" aria-label="Resumen de experiencia laboral">
        <div className="experience-heading">
          <p className="terminal-kicker">// TRAYECTORIA</p>
          <h3>EXPERIENCIA LABORAL</h3>
        </div>
        <ol className="experience-list">
          {experience.map(([meta, title, description]) => (
            <li key={title}>
              <span>{meta}</span>
              <div>
                <h4>{title}</h4>
                <p>{description}</p>
              </div>
            </li>
          ))}
        </ol>
      </div>
    </section>
  )
}

export default ProfessionalAbout
