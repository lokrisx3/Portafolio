const education = [
  ['Desarrollador Junior Java Full Stack', 'Generation Chile · Bootcamp', 'Ago 2026 · 14 semanas'],
  ['Analista Programador', 'CFT INACAP Santiago Sur', 'Ago 2018 · 5 semestres'],
]

const courses = [
  ['Google IT Automation with Python', 'Coursera'],
  ['Master en JavaScript: Aprende JS, jQuery, Angular, NodeJS', 'Udemy'],
  ['Testing & Quality Assurance: Guía para Pruebas de Software', 'Udemy'],
  ['React y Firebase: Curso Completo, Práctico y desde Cero', 'Udemy'],
  ['Ultimate Docker: guía de cero hasta despliegues', 'Udemy'],
]

export default function Education({ coursesOnly = false }) {
  if (coursesOnly) return (
    <section aria-labelledby="courses-title">
      <h2 id="courses-title">Cursos y certificaciones</h2>
      <ul className="cv-courses">
        {courses.map(([title, provider]) => <li key={title}>{title} <span>· {provider}</span></li>)}
      </ul>
    </section>
  )

  return (
    <section id="formacion" aria-labelledby="education-title">
      <h2 id="education-title">Formación académica</h2>
      <ul className="cv-education">
        {education.map(([title, institution, date]) => (
          <li key={title}>
            <h3>{title}</h3>
            <p>{institution} · Santiago, Chile</p>
            <p className="cv-education-date">{date}</p>
          </li>
        ))}
      </ul>
    </section>
  )
}
