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

const cvSkillGroups = [
  ['Frontend', ['JavaScript', 'React', 'HTML', 'CSS', 'Bootstrap']],
  ['Backend y bases de datos', ['Java', 'Spring Boot', 'Python', 'Django', 'C#', 'PHP', 'PostgreSQL', 'MySQL']],
  ['Automatización y calidad', ['Selenium', 'Playwright', 'Pruebas de software', 'Gestión de incidencias con Jira']],
  ['Herramientas', ['Git', 'GitHub', 'Docker', 'Linux', 'IA generativa']],
  ['Prácticas de desarrollo', ['API REST', 'CRUD', 'Programación orientada a objetos', 'MVC', 'Diseño adaptable']],
  ['Colaboración', ['Scrum', 'Metodologías ágiles', 'Trabajo en equipo', 'Comunicación', 'Adaptabilidad', 'Asertividad', 'Creatividad']],
]

function Skills({ lite = false }) {
  if (lite) return (
    <section className="skills-section" id="habilidades" aria-labelledby="skills-title">
      <h2 id="skills-title">Competencias técnicas y de trabajo</h2>
      <dl className="cv-skills">
        {cvSkillGroups.map(([title, concepts]) => (
          <div key={title}>
            <dt>{title}</dt>
            <dd><ul className="cv-concepts">{concepts.map(concept => <li key={concept}>{concept}</li>)}</ul></dd>
          </div>
        ))}
      </dl>
    </section>
  )
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
                    {!lite && group.number === '01'
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
