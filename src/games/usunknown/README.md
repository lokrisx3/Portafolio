# UsUnknown — versión React

Se abre desde **>_ → usUnknown → Jugar**. Al cerrar el juego se vuelve al selector.
El código se carga bajo demanda y los recursos usan la base de Vite (/Portafolio/).

## Contenido migrado

- Plano de 1920 × 1440, cuatro habitaciones y mobiliario con colisiones.
- Elena con el atlas original de reposo y ocho cuadros de marcha.
- Asesino: atlas de ocho cuadros exportado del modelo procedural original en Godot, con la misma cámara e iluminación.
- Cuatro llaves aleatorias, persecución con navegación en cuadrícula, puertas, notas, derrota, escape y reinicio.
- Introducción de diez segundos: bosque, Elena en capas, lluvia y relámpagos; acercamiento, agarre y apertura del pomo.
- Música de menú, lluvia, truenos y pasos originales; silencio y pausa al perder el foco.
- Teclado, ratón y botones táctiles; carga diferida y cierre con recuperación del foco.

La lógica se reimplementa en JavaScript y el dibujo usa Canvas 2D: no requiere Godot ni WebAssembly en el navegador. Los efectos de iluminación se adaptaron a Canvas; la linterna se detiene en las paredes y puertas. En táctil se mantiene el botón Correr en lugar del doble toque del original. El modelo 3D del asesino se reproduce como atlas, no como geometría 3D en tiempo real.

## Controles

WASD / flechas: caminar. Shift: correr. E: puertas/notas/salida. F: linterna.
Esc: pausa. R: reiniciar. T: controles táctiles.
Espacio, Enter o Esc omiten la introducción. También hay botones visibles.

## Archivos

- world.js: plano, colisiones, navegación y reglas de interacción.
- renderer.js: dibujo de la mansión y de la cinemática.
- UsUnknown.jsx: ciclo de juego, interfaz, entradas y audio.
- public/usunknown/art y public/usunknown/audio: copias de los recursos de App-UsUnknown/us-unknown.
- scripts/export-assassin.gd: exporta el modelo original con Godot; recibe la ruta de destino tras --.
- world.test.mjs: comprueba todas las posiciones de llaves, puertas, encierro, colisiones, salida y reinicio.
- scripts/test-usunknown-browser.mjs: pruebas Chromium y capturas; requiere PLAYWRIGHT_PACKAGE apuntando a playwright-core instalado y Vite en 127.0.0.1:5178.

## Comprobaciones

Desde Portafolio-front:

    node src/games/usunknown/world.test.mjs
    npm run lint
    npm run build

Para las pruebas de navegador, arrancar Vite con:

    node node_modules/vite/bin/vite.js --host 127.0.0.1 --port 5178

Luego definir PLAYWRIGHT_PACKAGE y ejecutar:

    node scripts/test-usunknown-browser.mjs

Las capturas se escriben en test-results (ignorado por Git).
Los recursos de arte y audio provienen del proyecto original; se conservan sus nombres. El atlas asesino-correr.png se deriva de scenes/asesino_modelo.tscn y scripts/assassin_model.gd.
