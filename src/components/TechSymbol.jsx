const symbols = {
  React: 'react',
  Java: 'java',
  PostgreSQL: 'postgres',
  JavaScript: 'js',
  'Spring Boot': 'spring',
  Python: 'python',
  Django: 'django',
  'C#': 'cs',
  PHP: 'php',
  HTML: 'html',
  CSS: 'css',
  Bootstrap: 'bootstrap',
  MySQL: 'mysql',
  Selenium: 'selenium',
  Git: 'git',
  GitHub: 'github',
  Docker: 'docker',
  Linux: 'linux',
}

function TechSymbol({ name }) {
  const icon = symbols[name]

  if (!icon) return <span className="tech-symbol" aria-hidden="true">•</span>

  return <img className="tech-symbol" src={`https://skillicons.dev/icons?i=${icon}&theme=dark`} alt="" aria-hidden="true" />
}

export default TechSymbol
