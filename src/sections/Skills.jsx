const skillGroups = [
  {
    number: '01',
    title: 'DESARROLLO',
    description: 'Lenguajes, frameworks y bases de datos.',
    skills: ['JavaScript', 'React', 'Java', 'Spring Boot', 'Python', 'Django', 'C#', 'PHP', 'HTML', 'CSS', 'Bootstrap', 'PostgreSQL', 'MySQL'],
    accent: 'purple',
  },
  {
    number: '02',
    title: 'CALIDAD',
    description: 'Automatización, pruebas y herramientas de desarrollo.',
    skills: ['Selenium', 'Playwright', 'Testing', 'Git', 'GitHub', 'Docker', 'Linux', 'Jira', 'IA generativa'],
    accent: 'cyan',
  },
  {
    number: '03',
    title: 'FORMA DE TRABAJAR',
    description: 'Conceptos técnicos, metodologías y habilidades de colaboración.',
    skills: ['API REST', 'CRUD', 'OOP', 'MVC', 'Responsive Design', 'Scrum', 'Metodologías ágiles', 'Trabajo en equipo', 'Comunicación', 'Adaptabilidad', 'Asertividad', 'Creatividad'],
    accent: 'green',
  },
]

function Skills() {
  return (
    <section className="skills-section" id="habilidades" aria-labelledby="skills-title">
      <div className="skills-heading">
        <p className="terminal-kicker">[04] HABILIDADES</p>
        <h2 id="skills-title">STACK Y HERRAMIENTAS<span className="title-dot">.</span></h2>
        <p>Tecnologías, herramientas, metodologías y habilidades de trabajo en equipo.</p>
      </div>

      <div className="skills-terminal">
        <div className="skills-terminal__bar" aria-hidden="true"><i /><i /><i /><span>skills.config</span></div>
        <div className="skills-grid">
          {skillGroups.map((group) => (
            <article className={`skill-group skill-group--${group.accent}`} key={group.number}>
              <span className="skill-group__number">{group.number}</span>
              <h3>{group.title}</h3>
              <p>{group.description}</p>
              <ul>
                {group.skills.map((skill) => (
                  <li key={skill}>
                    {group.number === '01'
                      ? <TechSymbol name={skill} />
                      : <span className="skill-bullet" aria-hidden="true" />}
                    {skill}
                  </li>
                ))}
              </ul>
            </article>
          ))}
        </div>
      </div>
    </section>
  )
}

export default Skills
import TechSymbol from '../components/TechSymbol.jsx'
