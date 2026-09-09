# Portafolio · Cristian Fritz Sepúlveda

Portafolio personal de Cristian Fritz Sepúlveda, Desarrollador Full Stack y Analista Programador. Presenta el perfil profesional, la experiencia laboral, los proyectos y las habilidades descritas en el CV.

La interfaz combina pixel art con un modo claro inspirado en Windows 98 y un modo oscuro con un estudio nocturno.

## Características

- Secciones de inicio, perfil profesional, proyectos y habilidades.
- Diseño adaptable y navegación móvil.
- Selector de tema con animación de sol y luna. La preferencia se guarda en `localStorage`; en la primera visita se utiliza el tema del sistema.
- Notebook ilustrado que permite alternar entre la fotografía real y el retrato pixel art.
- Ilustraciones SVG propias para cada proyecto, identificadas como ilustraciones y no como capturas reales.
- Fecha y hora del navegador, y clima de Santiago mediante Open-Meteo.
- Enlaces a GitHub y LinkedIn.
- Despliegue automatizado en GitHub Pages.

## Tecnologías

React 19, JavaScript, Vite 8 y CSS. ESLint para análisis estático y GitHub Actions para la compilación y el despliegue.

Los iconos tecnológicos se cargan desde Skill Icons y las tipografías desde Google Fonts. Estos recursos y la consulta del clima requieren conexión a Internet.


## Proyectos presentados

| Proyecto                | Descripción                                                                                     |
| ----------------------- | ----------------------------------------------------------------------------------------------- |
| Visium                  | Plataforma de gestión para ópticas; participación como desarrollador Full Stack y Scrum Master. |
| F29Downloader           | Aplicación de escritorio para automatizar la descarga de Formularios 29 desde el SII.           |
| Pudutarot               | Extensión de Chrome para seleccionar cartas de tarot y consultar sus significados.              |
| Sistema de tracking GPS | Funcionalidad de seguimiento GPS implementada para Automaster.                                  |

Este repositorio contiene el portafolio que presenta estos trabajos, no el código de las cuatro aplicaciones.

## Estructura

```text
.github/workflows/deploy.yml  Compilación y despliegue en Pages
src/
  assets/                    Fotografías y fondos pixel art
  components/                Cabecera, reloj, iconos e ilustraciones
  sections/                  Inicio, perfil, proyectos y habilidades
  App.jsx                    Composición de la página
  main.jsx                   Entrada e inicialización del tema
  theme.js                   Selección y persistencia del tema
  index.css                  Estilos generales y adaptables
  themes.css                 Temas y transiciones
  pixel-assets.css           Notebook y composición de imágenes
  project-artwork.css        Estilos de las ilustraciones de proyectos
docs/                        CV y documentación de referencia
vite.config.js               Configuración de Vite y ruta base
```

## Personalizar el contenido

- Presentación, foto y enlaces: `src/sections/About.jsx`.
- Perfil y experiencia: `src/sections/ProfessionalAbout.jsx`.
- Proyectos y tecnologías: `src/sections/Projects.jsx`.
- Habilidades: `src/sections/Skills.jsx`.
- Ilustraciones de proyectos: `src/components/ProjectArtwork.jsx`.
- Paleta y estilos de temas: `src/themes.css`.

## Publicar en GitHub Pages

El workflow de `.github/workflows/deploy.yml` se ejecuta al subir cambios a `main` o manualmente desde Actions. Instala las dependencias con `npm ci`, ejecuta ESLint, compila y publica el contenido de `dist/`.

1. En el repositorio, abre **Settings → Pages → Build and deployment**.
2. Selecciona **GitHub Actions** como fuente.
3. Sube los cambios a `main` y revisa la ejecución en **Actions**.
4. Abre la URL que indique el despliegue completado.

La configuración actual de Vite utiliza `base: '/Portafolio/'`. Esta ruta debe coincidir con el nombre del repositorio que publica el sitio. Si publicas desde `Portafolio-front`, cambia la base a `/Portafolio-front/`; para un dominio propio o un sitio raíz, utiliza `/`.

No es necesario subir `dist/` ni crear una rama `gh-pages`.

## Autor

**Cristian Fritz Sepúlveda**

- [GitHub](https://github.com/lokrisx3)
- [LinkedIn](https://www.linkedin.com/in/cfritzsepulveda/)
