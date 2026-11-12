# Changelog — Portafolio Cristian Fritz

Registro histórico de cambios del proyecto generado a partir del historial de commits de Git (`main`).

---

## [2026-09-20 a 2026-09-28] — Nuevos Juegos, Arcade y Pulido Visual

### Agregado
- **Amnein (Próximamente)** (`35a7591` — 2026-09-26): Incorporación de la tarjeta y visor de bocetos para el beat 'em up pixel art *Amnein* (`portadaAmnein.png`, `boceto1.png`, `boceto2.png`) en `GameSelector` y en la sección de proyectos (`Projects.jsx`).
- **Frío en la carne** (`272ba6a`, `46b910a` — 2026-09-23): Nuevo juego de ficción interactiva (`FrioEnLaCarne.jsx`, `FrioEnLaCarne.css`, `story.json`) con portada dedicada (`frio-en-la-carne-cover.svg`) integrado al selector Arcade.
- **Portada de Pudú Runner** (`b980efb` — 2026-09-22): Ilustración de portada SVG (`public/pudu-runner-cover.svg`) para el selector de juegos.

### Modificado / Corregido
- **Visor de bocetos responsivo** (`44abc41` — 2026-09-28): Ajustes de diseño responsivo en `GameSelector.css` para el visor de imágenes de *Amnein*.
- **Descripción en selector de juegos** (`136b3f0` — 2026-09-27): Corrección de texto descriptivo en `GameSelector.jsx`.
- **Rework HUD de Pudú Runner** (`0a0b72c` — 2026-09-20): Simplificación y rediseño de la interfaz del juego (`PuduRunner.jsx`, `PuduRunner.css`) y ajustes en `GameSelector`.

---

## [2026-09-15 a 2026-09-18] — Modo CV (Lite), Educación y Juego *usUnknown*

### Agregado
- **Sección de Educación y Cursos** (`79d7887` — 2026-09-18): Nuevo componente `src/sections/Education.jsx` para mostrar formación académica y certificaciones en el Modo CV.
- **Modo CV / Lite** (`12bfb7f` — 2026-09-16): Implementación de vista alternativa orientada a currículum (`src/lite.css`), con selector de tamaño de fuente, temas de lectura (`light`, `reading`, `dark`) y adaptación de todas las secciones (`About`, `Projects`, `Skills`, `Header`).
- **Prioridad y estados de carga** (`1fcb50b` — 2026-09-16): Carga diferida (`React.lazy` y `Suspense`) para las secciones del portafolio junto con pantalla de estado de carga en `App.jsx`.
- **Juego de terror *usUnknown* y Selector Arcade** (`e5ff5a0` — 2026-09-15):
  - Incorporación del juego de exploración y terror `src/games/usunknown/` (`UsUnknown.jsx`, `world.js`, `renderer.js`, `lantern.js`, `scenery.js`, `storyObjects.js`, `StoryReading.jsx`).
  - Recursos gráficos SVG/PNG en `public/usunknown/art/` y efectos de sonido/música ambiental en `public/usunknown/audio/`.
  - Nuevo modal selector de juegos (`GameSelector.jsx` y `GameSelector.css`).
  - Scripts de pruebas automatizadas (`scripts/test-usunknown-browser.mjs`, `scripts/test-story-focus.mjs`, `world.test.mjs`).
- **Controles táctiles en *usUnknown*** (`9741ab9` — 2026-09-15): Componente `TouchJoystick.jsx` y pruebas (`test-usunknown-joysticks.mjs`) para soporte móvil.

### Modificado / Corregido
- **Mejoras integrales al Modo CV** (`1eea9d1` — 2026-09-17): Refinamiento de estilos de impresión/lectura en `lite.css` y ampliación de contenido en `ProfessionalAbout.jsx`, `Skills.jsx`, `Projects.jsx` y `About.jsx`.
- **Expansión y mejoras de *usUnknown*** (`0464e30`, `adddd27` — 2026-09-16): Rediseño de interfaz, ajuste de tamaño de botones, mejoras en el mapa (`world.js`) y mecánicas del juego.
- **Corrección de estilos y modos** (`6ff2124`, `b1b9066` — 2026-09-16): Ajustes visuales entre modo portafolio y modo lite, limpieza de fondo en botón de cambio de estilo y actualización de dependencias.
- **Prevención de zoom multitouch** (`6ca99d0` — 2026-09-16): Bloqueo de gestos de zoom accidental durante partidas táctiles en `UsUnknown`.

---

## [2026-09-09 a 2026-09-10] — Secciones Completas, Modo Claro/Oscuro, *Pudú Runner* y Fiestas Patrias

### Agregado
- **Animación de escritura (Typewriter)** (`a203d5e` — 2026-09-10): Nuevo componente `Typewriter.jsx` y hoja de estilos `src/intro.css` para la presentación inicial.
- **Temática de Fiestas Patrias (18 de Septiembre)** (`b1320e9`, `73e04de` — 2026-09-09): Detección automática del mes de septiembre en Chile (`src/season.js`), estilos festivos (`src/fiestas-patrias.css`) y assets pixel art (`pixel-chupalla.png`, `pixel-terremoto.png`).
- **Mini-juego *Pudú Runner* y Tienda** (`574cff2`, `ca37368` — 2026-09-09):
  - Juego endless runner integrado en el header (`PuduRunner.jsx`, `PuduRunner.css`).
  - Sistema de progreso, mejoras y ciudad (`puduCity.js`, `puduProgress.js`).
- **Despliegue automático e ilustraciones de proyectos** (`9233952` — 2026-09-09):
  - Workflow de GitHub Actions (`.github/workflows/deploy.yml`) para GitHub Pages.
  - Componente `ProjectArtwork.jsx` y estilos `project-artwork.css` para cabeceras visuales de cada proyecto.
- **Modo Claro / Oscuro** (`60f9d62` — 2026-09-09): Sistema de temas con transición visual (`src/theme.js`, `src/themes.css`), botón de alternancia en `Header.jsx` y fondo diurno (`daylight-studio.png`).
- **Secciones de Proyectos, Habilidades e Iconografía Técnica** (`6cb3c53` — 2026-09-09):
  - Nuevas secciones `Projects.jsx` y `Skills.jsx`.
  - Componente `TechSymbol.jsx` para íconos de tecnologías.
  - Verificación de datos profesionales y expansión de `src/index.css`.

### Modificado / Corregido
- **Corrección en animación de escritura** (`c7d5e34` — 2026-09-10): Limpieza en `index.html` y ajuste de cursor/animación en `src/intro.css`.
- **Limpieza de repositorio (`docs/`)** (`606be30` — 2026-09-10): Se deja de versionar la carpeta `docs/` con PDFs y archivos auxiliares.
- **Identidad visual y metadatos** (`f6b95ce`, `bc29d4e`, `14bfc1f` — 2026-09-09): Actualización de título en `index.html`, nuevo `favicon.svg` y ajustes de estilos en header y proyectos.
- **Documentación (`README.md`)** (`817a8a8`, `fb5add0` — 2026-09-09): Redacción y posterior simplificación del `README.md` del repositorio.
- **Ajustes de estilos e imágenes** (`b50bc4c`, `6311f2f` — 2026-09-09): Corrección de rutas/base en `vite.config.js`, `pixel-assets.css` y maquetación general en `index.css`.

---

## [2026-08-24 a 2026-09-01] — Fundación del Proyecto e Interfaz Pixel Art

### Agregado
- **Sección Sobre Mí Profesional y Clima/Reloj en vivo** (`dac1ef4`, `397a83b` — 2026-09-01):
  - Nueva sección `src/sections/ProfessionalAbout.jsx`.
  - Componente `src/components/WeatherClock.jsx` con consulta de clima y hora local.
- **Interfaz y Escenario Pixel Art** (`eff7eed`, `f559a30`, `656799b`, `3afb81d` — 2026-08-31):
  - Diseño de estética retro/pixel art en `src/pixel-assets.css`, `Header.jsx` y `About.jsx`.
  - Incorporación de recursos gráficos (`foto-perfil-cut.png`, `foto-perfil-pixel.png`, `pixel-coffee-mug.png`, `pixel-laptop-profile.png`, `night-space-studio.png`).
- **Versión 0.1 — Estructura del Portafolio** (`ed60e9f` — 2026-08-30): Creación de la estructura modular en `src/components/Header.jsx` y `src/sections/About.jsx`, reemplazando la plantilla por defecto de Vite.
- **Inicialización del Proyecto** (`97da066`, `d655b8c`, `165dd0c` — 2026-08-24):
  - Primer commit con `README.md` y `.gitignore`.
  - Configuración base con React 19, Vite y ESLint (`package.json`, `vite.config.js`, `eslint.config.js`).

### Modificado / Corregido
- **Actualización de imagen de perfil** (`a61df05` — 2026-09-01): Reemplazo y ajuste de `src/assets/foto-perfil-cut.png`.
- **Ajuste de decoración pixel art** (`656799b`, `3afb81d` — 2026-08-31): Eliminación de `pixel-plant.png` y actualización del fondo `night-space-studio.png`.

---

## Historial Cronológico de Commits

| Fecha | Commit | Autor | Mensaje |
| :--- | :--- | :--- | :--- |
| 2026-09-28 | `44abc41` | lokrisx3 | responsive visor |
| 2026-09-27 | `136b3f0` | lokrisx3 | fix descripcion |
| 2026-09-26 | `35a7591` | lokrisx3 | Proximamente |
| 2026-09-23 | `46b910a` | lokrisx3 | files juego |
| 2026-09-23 | `272ba6a` | lokrisx3 | juego narrativo test |
| 2026-09-22 | `b980efb` | lokrisx3 | portadapudu |
| 2026-09-20 | `0a0b72c` | lokrisx3 | rework hud pudu runner |
| 2026-09-18 | `79d7887` | lokrisx3 | archivo faltante |
| 2026-09-17 | `1eea9d1` | lokrisx3 | mejoras modo cv |
| 2026-09-16 | `adddd27` | lokrisx3 | mejorar al juego usunknown |
| 2026-09-16 | `0464e30` | lokrisx3 | menos tamaño boton |
| 2026-09-16 | `1fcb50b` | lokrisx3 | se agrega prioridad de carga |
| 2026-09-16 | `b1b9066` | lokrisx3 | se quita fondo de boton cambio de estil |
| 2026-09-16 | `6ff2124` | lokrisx3 | fix estilos y modos |
| 2026-09-16 | `12bfb7f` | lokrisx3 | modo lite |
| 2026-09-16 | `6ca99d0` | lokrisx3 | fix zoom multitouch |
| 2026-09-15 | `9741ab9` | lokrisx3 | controles tactiles |
| 2026-09-15 | `e5ff5a0` | lokrisx3 | se agrega juego de halloween |
| 2026-09-10 | `c7d5e34` | lokrisx3 | se arregla animacion de escritura |
| 2026-09-10 | `606be30` | lokrisx3 | Dejar de versionar la carpeta docs |
| 2026-09-10 | `a203d5e` | lokrisx3 | fix de render |
| 2026-09-09 | `73e04de` | lokrisx3 | ajustes de tematica |
| 2026-09-09 | `b1320e9` | lokrisx3 | tematica 18 |
| 2026-09-09 | `ca37368` | lokrisx3 | tienda pudu |
| 2026-09-09 | `574cff2` | lokrisx3 | pudu |
| 2026-09-09 | `14bfc1f` | lokrisx3 | favicon |
| 2026-09-09 | `bc29d4e` | lokrisx3 | icono |
| 2026-09-09 | `f6b95ce` | lokrisx3 | cambio titulo |
| 2026-09-09 | `fb5add0` | lokrisx3 | readme |
| 2026-09-09 | `6311f2f` | lokrisx3 | fix |
| 2026-09-09 | `817a8a8` | lokrisx3 | readme |
| 2026-09-09 | `b50bc4c` | lokrisx3 | fix imagen |
| 2026-09-09 | `9233952` | lokrisx3 | imagenes para proyectos |
| 2026-09-09 | `60f9d62` | lokrisx3 | estilo claro/oscuro |
| 2026-09-09 | `6cb3c53` | lokrisx3 | informacion verificada |
| 2026-09-01 | `a61df05` | lokrisx3 | fix img |
| 2026-09-01 | `397a83b` | lokrisx3 | consulta de tiempo |
| 2026-09-01 | `dac1ef4` | lokrisx3 | se agrega seccion sobre mi y tiempo |
| 2026-08-31 | `3afb81d` | Cristian Fritz | se quita planta |
| 2026-08-31 | `656799b` | Cristian Fritz | fondo de pagina |
| 2026-08-31 | `f559a30` | Cristian Fritz | reposicion fixed |
| 2026-08-31 | `eff7eed` | Cristian Fritz | interfaz pixel art |
| 2026-08-30 | `ed60e9f` | Cristian Fritz | 0.1 |
| 2026-08-24 | `165dd0c` | Cristian Fritz | codigo base |
| 2026-08-24 | `d655b8c` | Cristian Fritz | gitignore |
| 2026-08-24 | `97da066` | Cristian Fritz | first commit |
