# Kilos y Gramos ⚖️

App web educativa para practicar **suma y resta de masas (kg / g)** mediante el
**modelo de barras**, dirigida a una niña (Luanna) con un **panel de control para
Papá**. Ejercicios autogenerados, progreso persistente y seguimiento en vivo vía
Firebase.

> Antes "PesoMás". Renombrada a **Kilos y Gramos**.

---

## 1. Qué hace

- **Juego (`index.html`)**: 10 fases de dificultad creciente, 10 niveles por fase.
  En cada pregunta: enunciado con objetos y sus masas, modelo de barras visual,
  pizarra de dibujo para que la niña haga su procedimiento, y 4 opciones (A–D)
  con feedback inmediato, pistas, racha y estrellas.
- **Panel de Papá (`admin.html`)**: estadísticas, sesión en vivo, historial de
  respuestas (con captura de la pizarra), y **habilitar/deshabilitar fases**.

---

## 2. Stack

- **HTML/CSS/JS puro** (sin build, sin framework). Se sirve como estático.
- **Fuente**: Nunito (Google Fonts).
- **Firebase 9 (compat)**:
  - **Firestore**: progreso, config de fases, historial, sesiones.
  - **Realtime Database**: estado "en vivo" del jugador.
- **Persistencia local (`localStorage`)** como respaldo cuando Firebase falla.

No requiere instalación. Abrir `index.html` con cualquier servidor estático
(p.ej. `npx serve`, Live Server, o hosting de Firebase/GitHub Pages).

---

## 3. Estructura de archivos

```
masaypeso/
├─ index.html          # App de juego (firebase, exercises, sound, canvas, game)
├─ admin.html          # Panel de Papá (firebase, exercises, admin)
├─ guia.html           # Guía de uso interactiva (autocontenida)
├─ css/
│  └─ styles.css       # TODOS los estilos (juego + admin + responsive)
├─ js/
│  ├─ firebase-config.js  # Config Firebase, contraseña admin, refs FB
│  ├─ exercises.js        # Escenarios, fases y generadores de ejercicios
│  ├─ sound.js            # Sonidos (WebAudio): acierto/error/victoria
│  ├─ canvas.js           # Pizarra avanzada (módulo Pizarra)
│  ├─ game.js             # Lógica del juego, render y flujo
│  └─ admin.js            # Lógica del panel de Papá
├─ sellos/             # Imágenes de sellos de calificación (AD/A/B/C)
└─ ejercicios/         # PDFs de referencia (nivel/estilo de los problemas)
```

> Nota: `js/game - copia.js` es un respaldo manual sin usar. Se puede eliminar.

---

## 4. Modelo de datos (Firebase)

Definido en `js/firebase-config.js` → objeto `FB`:

| Ref | Ruta | Contenido |
|-----|------|-----------|
| `progressRef()` | `progress/luanna` (Firestore) | estrellas, racha, fase/nivel actual, estrellas por fase |
| `configRef()` | `config/phases` (Firestore) | `{ enabled: [bool x10] }` qué fases están habilitadas |
| `historyCol()` | `history` (Firestore) | una entrada por respuesta (pregunta, opciones, resultado, PNG pizarra) |
| `sessionsCol()` | `sessions` (Firestore) | inicio/fin de cada sesión de juego |
| `liveRef()` | `live/luanna` (RTDB) | estado en vivo: fase, nivel, pregunta, online |

**Forma de `progress`** (ver `defaultProgress()` en `game.js`):
```js
{ stars, streak, bestStreak, maxPhaseReached,
  phaseStars:[10], currentPhase, currentLevel, currentQuestion }
```

Si una operación de Firebase falla, todo cae a `localStorage`
(`pm_progress`, `pm_config`, `pm_history`, `pm_sessions`).

---

## 5. Ejercicios (`exercises.js`)

**Coherencia narrativa:** los problemas se construyen sobre **escenarios**
(`SCENARIOS`) donde los objetos se relacionan con lógica — mercado/canasta,
cocina/receta, mochila escolar, frutería. Cada generador toma objetos del
**mismo** escenario, así nunca aparecen combinaciones sin sentido. El modelo de
barras sirve para **componer** (sumar) y **descomponer** (restar), como en los
PDFs de referencia.

**Categorización estricta:** cada fase produce solo su tipo (Fase 2 = restas,
Fase 6 = suma de 3, etc.).

Constantes clave:

- `SCENARIOS`: escenarios temáticos; cada item tiene `name`, `label` (con
  artículo), `plural`, `icon` y rango de masa `wMin/wMax`.
- `PHASE_META`: las 10 fases (nombre + descripción).
- `LEVELS_PER_PHASE = 10`, `QUESTIONS_PER_LEVEL = 10`.

Las 10 fases y su generador:

| # | Fase | Generador | Tipo |
|---|------|-----------|------|
| 1 | Suma simple | `gen1` | a + b |
| 2 | Resta simple | `gen2` | total − a |
| 3 | Encontrar el total | `gen3` | suma con conversión kg↔g |
| 4 | Objeto faltante | `gen4` | despejar oculto |
| 5 | Problemas mixtos | `gen5` | suma o resta al azar |
| 6 | Tres objetos | `gen6` | a + b + c |
| 7 | Cuatro objetos | `gen7` | a + b + c + d |
| 8 | Problemas inversos | `gen8` | relación multiplicativa (doble/triple/mitad) o aditiva ("X g más que") |
| 9 | Problemas encadenados | `gen9` | componer y descomponer (agregar + retirar) |
| 10 | Máxima complejidad | `gen10` | relaciones encadenadas tipo receta (×k y ÷2) |

El nivel y estilo replican las fichas en `ejercicios/` (modelo de barras,
relaciones tipo "el doble que", masas en kg + g, información extra).

**Helpers útiles**: `fmt`/`fmtPlain` (formato "1 kg 250 g"), `roundStep`
(redondeo a pasos limpios), `buildOptions` (distractores plausibles),
`generateExercise(phaseIdx)` (punto de entrada; evita repetir las últimas 24
combinaciones vía `localStorage`).

### Cómo agregar una fase
1. Añadir entrada en `PHASE_META`.
2. Crear un `genX()` que devuelva `{ qHTML, parts, totalValue, targetValue, hint, explain }`.
3. Registrarlo en `GENERATORS` (orden = índice de fase).
4. El resto (selector de fases, candado, admin) se ajusta solo a `PHASE_TOTAL`.

---

## 6. Flujo del juego (`game.js`)

En cada ejercicio el encabezado muestra **"Fase N · Nivel M"** (ver
`headerHTML` en `game.js`). La pizarra se **limpia automáticamente** al pasar
al siguiente ejercicio o al salir (reset en `buildDOM` de `canvas.js`).

**Navegación (cabecera, posición fija):**
- En un ejercicio: **⏻ Cerrar sesión** (vuelve a elegir usuario) y **‹ Volver a
  las fases**.
- En el selector de fases: **‹ Volver a elegir usuario** (mismo lugar). Se
  eliminó el antiguo botón "‹ Salir" inferior.

**Reanudar al recargar:** estando en un ejercicio, recargar la página (F5) **no
cuenta como abandono**: el ejercicio exacto se guarda en `sessionStorage`
(`pm_resume`) y se restaura (`resumeSession`). El abandono solo se registra al
salir a propósito (volver a fases o cerrar sesión). La sesión activa se marca con
`pm_active`.

`renderWelcome` → elegir perfil
- **Luanna**: `loginLuanna` carga progreso + config → `renderPhaseSelect`
  → `enterPhase` → `renderPlay` (pregunta) → `pick` (responder)
  → `nextQuestion` → al terminar la fase `finishPhase` → `renderEndPhase`.
- **Papá**: modal de contraseña → redirige a `admin.html`.

Calificación al cerrar fase: `pct ≥90 AD`, `≥75 A`, `≥50 B`, resto `C`.

Una fase sólo se puede jugar/continuar si está habilitada en `config/phases`
(controlado por Papá). Ver `isEnabled` / `isUnlocked`.

---

## 7. Panel de Papá (`admin.js`)

- Acceso: contraseña `ADMIN_PASSWORD` en `firebase-config.js`
  (actual: `papa2026`). El acceso se marca en `sessionStorage`.
- Pestañas: **En vivo**, **Historial**, **Estadísticas**, **Fases**.
- **Historial** y **Estadísticas** se filtran/agrupan **por día**
  (helpers `dayKey`, `dayLabel`, `distinctDays`). Estadísticas separa métricas
  del día (aciertos, precisión, tiempo) de las acumuladas (estrellas, racha).
- **Fases:** botón de encendido/apagado (`.phase-power`) que escribe en
  `config/phases.enabled`; el juego lo respeta al recargar el selector.

> ⚠️ La contraseña y la `apiKey` de Firebase están en el cliente (visibles para
> cualquiera). Es un control "de juguete" para una niña, no seguridad real. Si
> se necesita seguridad, mover a Firebase Auth + reglas de seguridad.

---

## 8. Pizarra (`canvas.js`)

Módulo `Pizarra` (IIFE). API: `mount(container)`, `clear`, `undo`, `redo`,
`hasContent`, `exportPNG(maxW)`, `resize`. Pointer Events (dedo y mouse),
escala por `devicePixelRatio`. El PNG se guarda en el historial al responder.
**Se limpia automáticamente** en cada `mount` (al pasar de ejercicio o reentrar).

Funciones:
- **Herramientas:** lápiz (✏️), **selección/mover** (⬚), borrador (🧽),
  **formas** (menú desplegable: cuadrado/triángulo/círculo/línea — al elegir una
  se cierra el menú), mano (✋).
- **Selección (⬚):** clic sostenido para **arrastrar un recuadro** (visible
  mientras se delimita) y seleccionar las formas dentro; un clic simple
  selecciona una sola. Luego se arrastra la selección para moverla; `Supr` borra.
- **Papel:** cuadriculado fijo.
- **Zoom:** controles `➖ % ➕` sobre el lienzo. Doble toque en la **mano**
  restablece la vista. Da más espacio interno **sin** cambiar el recuadro.
- **Color:** un único selector (`<input type=color>`).
- **Grosor:** deslizador; un **punto indicador dentro del lienzo** (arriba a la
  izquierda) crece/encoge según el grosor y refleja el color.
- **Limpiar todo** (🗑️) y deshacer/rehacer.
- **Atajos:** `B` lápiz · `V` selección · `E` borrador · `M` formas (cuadrado por
  defecto) · `H` mano · `Supr`/`Backspace` borra la forma seleccionada ·
  `Ctrl+Z` deshacer · `Ctrl+Y` rehacer. Funcionan también justo después de usar
  el deslizador de grosor o el color (se libera el foco automáticamente).

Arquitectura: los trazos se guardan en **coordenadas de mundo** y se pintan con
una transformación `escala + desplazamiento`. Hay una **capa de trazos**
(canvas offscreen) separada del papel, para que el borrador no afecte la
cuadrícula. Cada trazo es `{tool,color,size,type,pts}` con
`type ∈ free|line|rect|triangle|circle`.

## 8b. Sonidos (`sound.js`)

Módulo `Sound` con WebAudio (sin archivos). API: `Sound.correct()`,
`Sound.wrong()`, `Sound.victory()`, `Sound.enabled(bool)`. Se disparan en
`pick()` (acierto/error) y `finishPhase()` (victoria). El `AudioContext` se crea
y reanuda dentro del gesto del usuario.

## 8c. Avatares y guía

- **Avatares:** imágenes remotas en `AVATARS` (game.js); si fallan, hacen
  fallback a emoji vía `onerror`.
- **Guía de uso:** `guia.html`, autocontenida (CSS/JS inline) con demo
  interactiva de la pizarra y barras animadas. Se abre desde el botón
  **ℹ️ Información** en el login (debajo de "Papá").
- **Navegación:** en los ejercicios, el engranaje fue reemplazado por una
  **flecha ‹** (volver a fases). El selector de fases ya no muestra engranaje.

---

## 9. Responsive (CSS)

Diseño **mobile-first con ancho homogéneo capado** en todos los dispositivos.
El **alto crece según el contenido** de cada ejercicio (no hay scroll interno;
la página entera hace scroll).

Variable central: `--app-max` (ancho del contenedor `.phone-shell`).

| Dispositivo | Breakpoint | Comportamiento |
|-------------|-----------|----------------|
| 📱 Celular | `≤480px` | Pantalla completa, sin marco ni bordes redondeados |
| 📲 Tablet | `481–1024px` | Marco centrado, `--app-max: 500px` |
| 💻 Laptop / 🖥️ 1920×1080 | `≥1025px` | Columna centrada homogénea, `--app-max: 480px` |

En monitores anchos **no se ocupa todo el ancho** a propósito: las Fases
mantienen un ancho uniforme y legible, centradas. El panel admin
(`.admin-shell`) usa su propio ancho (`max-width: 980px`) con su breakpoint a
640px.

Reglas anti-desborde: `overflow-x:hidden` en `body`, `min-width:0` y
`max-width:100%` en los hijos del contenedor.

---

## 10. Desarrollo local

```bash
# Cualquier servidor estático sirve. Ejemplo:
npx serve .
# luego abrir http://localhost:3000/index.html
```

No hay paso de build ni dependencias npm. Editar archivos y recargar.

### Para escalar a futuro
- **Más jugadores**: hoy todo está fijado a `luanna` (refs y rutas). Parametrizar
  el id de usuario en `FB.*` y el header del juego.
- **Seguridad**: Firebase Auth + reglas; sacar contraseña del cliente.
- **Más fases/tipos**: ver §5.
- **i18n**: textos están embebidos en español dentro de los generadores y render.

---

## 11. Convenciones de color (clases CSS)

Cada objeto/serie usa un color con sufijo de clase consistente:
`v` lavanda, `b` azul, `o` naranja, `p` rosa, `t` menta (total).
Se aplican en `IC_BG`, `IC_STR`, `FILL_C`, `BV_C` (`exercises.js`) y en las
clases `hl-*`, `fill-*`, `bv-*`, `ic-*` (`styles.css`).
