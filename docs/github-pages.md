# Publicar en GitHub Pages

1. En el repositorio, abre Settings → Pages → Build and deployment y selecciona GitHub Actions como Source.
2. Sube los cambios a `main`. El workflow comprueba y compila el proyecto con Node.js 24, y publica únicamente `dist`.
3. Revisa el resultado en Actions. También puedes ejecutarlo con Run workflow.

Dirección prevista: https://lokrisx3.github.io/Portafolio-front/

Para comprobar localmente: ejecuta `npm run build` y `npm run preview`, y abre http://localhost:4173/Portafolio-front/.

La ruta base está en `vite.config.js`. Si cambias el nombre del repositorio o utilizas un dominio propio, actualiza `base`.

No necesitas subir `dist` ni crear una rama `gh-pages`. El despliegue utiliza el token automático de GitHub Actions.

Guía oficial: https://vite.dev/guide/static-deploy.html#github-pages
