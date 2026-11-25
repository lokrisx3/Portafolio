# Portafolio · Cristian Fritz Sepúlveda

Portafolio personal de Cristian Fritz Sepúlveda, Desarrollador Full Stack y Analista Programador. Presenta el perfil profesional, la experiencia laboral, la formación académica, los proyectos y las habilidades técnicas y de colaboración.

La interfaz combina estética pixel art con un modo claro inspirado en Windows 98, un modo oscuro ambientado en un estudio nocturno, una vista alternativa de **Modo CV** optimizada para lectura rápida y un selector **Arcade** con minijuegos integrados.

## Características

- **Secciones modulares con carga diferida**: inicio, perfil profesional, proyectos y habilidades (más formación académica y cursos en Modo CV) cargadas mediante `React.lazy` y `Suspense`.
- **Modo CV (Lite)**: vista documental enfocada en lectura, con control de tamaño de letra (`14px` a `20px`) y selector de apariencia (`Claro`, `Lectura` y `Oscuro`) persistidos en `localStorage`.
- **Scroll suave y superposición de secciones**: desplazamiento fluido con **Lenis** y apilamiento `sticky` entre secciones tanto en escritorio como en móvil, respetando `prefers-reduced-motion`, pausándose al abrir modales y desactivándose automáticamente en Modo CV.
- **Selector de tema Claro / Oscuro**: alternancia con animación de sol/luna y transición de vista (`View Transitions API`), recordando la preferencia en `localStorage` o tomando el tema del sistema en la primera visita.
- **Temática estacional de Fiestas Patrias**: activación automática durante septiembre (zona horaria de Chile) con guirnaldas e ilustraciones pixel art dedicadas.
- **Notebook interactivo**: permite alternar en pantalla entre la fotografía real y el retrato pixel art.
- **Arcade integrado (`>_`)**: cuatro experiencias cargadas bajo demanda:
  - **Pudú Runner**: juego *endless runner* en Canvas con sistema de monedas, récords y tienda desbloqueable de skins y escenarios en `localStorage`.
  - **usUnknown**: juego de terror y exploración en Canvas con iluminación por *raycasting*, audio ambiental, controles táctiles personalizables y opciones persistentes.
  - **Frío en la carne**: relato breve de ficción interactiva con decisiones ramificadas.
  - **Amnein (Próximamente)**: adelanto y visor responsivo de bocetos del *beat ’em up* pixel art en desarrollo.
- **Ilustraciones SVG propias** para cada proyecto destacado, identificadas como ilustraciones y no como capturas reales.
- **Fecha, hora y clima en vivo** de Santiago mediante la API de Open-Meteo.
- **Despliegue automatizado** en GitHub Pages mediante GitHub Actions.

## Tecnologías

React 19, JavaScript, Vite 8, Lenis, Radix UI y CSS. ESLint para análisis estático y GitHub Actions para la compilación y el despliegue continuo.

Los iconos tecnológicos de la portada se cargan desde Skill Icons y las tipografías desde Google Fonts. Estos recursos y la consulta meteorológica requieren conexión a Internet.

## Proyectos presentados

| Proyecto                | Descripción                                                                                     |
| ----------------------- | ----------------------------------------------------------------------------------------------- |
| Visium                  | Plataforma de gestión para ópticas; participación como desarrollador Full Stack y Scrum Master. |
| F29Downloader           | Aplicación de escritorio para automatizar la descarga de Formularios 29 desde el SII.           |
| Pudutarot               | Extensión de Chrome para seleccionar cartas de tarot y consultar sus significados.              |
| Sistema de tracking GPS | Funcionalidad de seguimiento GPS implementada para Automaster.                                  |

Este repositorio contiene el portafolio que presenta estos trabajos, no el código fuente de las cuatro aplicaciones.

## Desarrollo local

```bash
# Instalar dependencias
npm install

# Iniciar servidor de desarrollo
npm run dev

# Exponer en red local para probar desde móvil u otro dispositivo
npm run dev -- --host

# Ejecutar análisis estático y compilación de producción
npm run lint
npm run build
```

## Estructura

```text
.github/workflows/deploy.yml  Compilación y despliegue automático en GitHub Pages
public/                       Portadas SVG, bocetos de Amnein y recursos de usUnknown
src/
  assets/                     Fotografías y escenarios pixel art
  components/                 Cabecera, reloj/clima, selector Arcade, Pudú Runner, Frío en la carne e iconos
  games/
    frio-en-la-carne/         Guion interactivo en JSON
    usunknown/                Motor, renderizado Canvas, mundo, audio y controles táctiles
  hooks/
    useLenisStack.js          Integración de Lenis, superposición sticky y navegación por secciones
  sections/                   Inicio, perfil profesional, educación, proyectos y habilidades
  App.jsx                     Composición principal y gestión del Modo CV / Portafolio
  main.jsx                    Punto de entrada e inicialización del tema
  theme.js                    Selección y persistencia del tema claro/oscuro
  season.js                   Detección automática de temporada (Fiestas Patrias)
  index.css                   Estilos generales y diseño adaptable
  lite.css                    Estilos y temas del Modo CV
  themes.css                  Paletas de tema claro/oscuro y View Transitions
  stack-scroll.css            Reglas de apilamiento sticky para las secciones
  fiestas-patrias.css         Decoración estacional de septiembre
  intro.css                   Animación de escritura y cursor
  pixel-assets.css            Composición del notebook y retratos
  project-artwork.css         Estilos de las ilustraciones de proyectos
changelog.md                  Registro histórico de cambios del proyecto
vite.config.js                Configuración de Vite y ruta base
```

## Personalizar el contenido

- Presentación, foto y enlaces: `src/sections/About.jsx`.
- Perfil y experiencia laboral: `src/sections/ProfessionalAbout.jsx`.
- Formación académica y certificaciones (Modo CV): `src/sections/Education.jsx`.
- Proyectos y tecnologías: `src/sections/Projects.jsx`.
- Habilidades técnicas y de colaboración: `src/sections/Skills.jsx`.
- Ilustraciones de proyectos: `src/components/ProjectArtwork.jsx`.
- Selector Arcade y juegos: `src/components/GameSelector.jsx`, `src/components/PuduRunner.jsx`, `src/components/FrioEnLaCarne.jsx` y `src/games/usunknown/`.
- Paletas, Modo CV y scroll: `src/themes.css`, `src/lite.css`, `src/stack-scroll.css` y `src/hooks/useLenisStack.js`.

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
