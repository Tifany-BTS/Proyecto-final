---
description: Agrega una sección nueva a una página existente siguiendo el sistema de CSS/TS ya establecido en el proyecto
argument-hint: <página.html> <descripción de la sección>
---

Vas a agregar una sección nueva a una página **existente** del proyecto: $ARGUMENTS

El primer argumento es el archivo HTML objetivo (ej. `index.html`, `paneles.html`). El resto describe qué debe contener/hacer la sección. Si falta cualquiera de los dos, pregunta antes de continuar — no inventes el contenido de la sección.

## 1. Lee antes de escribir

- Lee la página objetivo completa: identifica cómo están armadas sus secciones existentes (`<section class="section" id="...">` + `.wrap` + `.section-head` con `h2`/`p` es el patrón público; `paneles.html`/`usuarios.html`/`importar.html` usan su propio wrapper de página, ej. `.panel-section`). Copia el patrón que ya usa esa página, no inventes uno nuevo.
- Revisa `css/components.css` y `css/pages.css` para ver si ya existe una clase reutilizable que sirva (tarjetas `.role-card`/`.feature-item`/`.stat-card`, tablas `.data-table`, tabs `.panel-tab*`, botones `.btn-primary`/`.btn-secondary`). No dupliques un componente que ya existe — extiéndelo o reutilízalo.
- Si la sección es parecida a otra que ya existe en el proyecto (grid de tarjetas, formulario, banda CTA), usa esa como referencia de marcado y nomenclatura de clases.

## 2. HTML

- Estructura semántica: `<section>` (con `id` si va a recibir un enlace de navegación), encabezado con la jerarquía correcta (normalmente `h2` dentro de un `.section-head`, nunca saltarse a `h3` sin un `h2` antes en esa sección), y contenido en listas (`<ul>`/`<ol>`) cuando sea una colección de ítems — es el patrón que ya siguen `.roles-list`/`.features-list`.
- Cero atributos `style=""` y cero `<style>` inline. Todo el diseño visual es una clase.
- Si la página es pública, respeta el esqueleto que ya duplican todas las páginas públicas (mismo `<head>` anti-FOUC, mismos `<script>` al final en el mismo orden). Si es interna (paneles/usuarios/importar), respeta el header con `#internalNav`/`#userChipName`/`#userChipLogout`.

## 3. CSS — nunca inline, siempre en el módulo correcto de `css/`

`css/styles.css` es solo un agregador `@import` — **nunca le agregues reglas directamente ni le agregues un nuevo `<link>` a ningún HTML**. La regla nueva va en uno de estos archivos, según qué es:

- **`css/components.css`** — si es un widget con identidad visual propia (fondo, borde, radius, padding) que podría reutilizarse en otra página: tarjeta, botón, tabla, tab, chip, etc.
- **`css/pages.css`** — si es composición específica de esta página sin identidad visual propia (un contenedor grid/flex que solo organiza otros elementos, como `.roles-list` o `.stat-grid`).
- **`css/layout.css`** — solo si es parte del shell compartido entre páginas (header, footer, `.section`/`.section-head` genérico, banda CTA). Rara vez aplica para una sección nueva de contenido.

No toques `css/variables.css` salvo que la sección necesite un token verdaderamente nuevo que no exista — primero revisa si ya hay una variable de color/espaciado/tipografía que sirva (`--color-*`, `--space-*`, `--text-*`, `--radius-*`, `--border*`) antes de inventar un valor suelto.

**Mobile-first, en ese orden:**
1. Escribe primero la regla base (sin media query) pensada para <768px — layout en columna, `grid-template-columns:1fr` o `flex-direction:column` si aplica.
2. Si necesita verse distinto en pantallas más grandes, agrega el override **dentro de los bloques `@media` que ya existen en `css/responsive.css`** (`@media (min-width:768px)` y `@media (min-width:1024px)`) — no crees un nuevo bloque `@media` suelto en otro archivo. Agrega las reglas nuevas al final del bloque correspondiente, no reordenes las que ya están.

## 4. TypeScript — solo si la sección necesita interactividad

Si la sección es puramente visual (no tabs, no formulario, no datos que cambian), no toques `ts/` ni `js/`.

Si sí necesita comportamiento (toggle, validación, datos dinámicos, etc.):

- El código va en `ts/`, **nunca directo en `js/`** — `js/` es salida compilada de `tsc`, editarla a mano se pierde en el próximo build.
- Sigue el patrón ya establecido: una IIFE auto-invocada (`(function initX(): void { ... })();`), sin `import`/`export` (son scripts globales, no módulos — `tsconfig.json` no usa ESM en tiempo de ejecución). Si necesitas algo de `session.ts`/`validators.ts`/`theme.ts`, ya está disponible como global siempre que su `<script>` cargue antes en el HTML.
- Gotcha conocido: un `document.getElementById(...)` angostado con `instanceof` en la función externa **no** se mantiene angostado dentro de closures/funciones anidadas definidas después. Vuelve a asignar a un `const` con tipo explícito justo después del guard clause (ver el comentario en `ts/importar.ts`, `ts/paneles.ts` o `ts/usuarios.ts` para el patrón exacto) — no uses `!` (non-null assertion) para evitarlo.
- Agrega el nuevo `<script src="js/tu-archivo.js" defer>` en el HTML en la posición correcta: después de `theme.js` y, si usas roles/sesión, después de `session.js`; antes del script propio de la página si ese ya existe.

## 5. Verifica antes de terminar

1. `npm run build` — debe compilar sin errores de `tsc` (si tocaste `ts/`).
2. Repasa que no quedó ningún `style=""` inline ni un `<link>` nuevo apuntando a otro archivo de `css/`.
3. Si la sección afecta una página con roles (paneles.html), confirma que no rompiste el scoping por rol ya existente.
4. No hay test runner ni linter configurado — si es un cambio visual, avísale al usuario que conviene abrirlo en el navegador (claro/oscuro, mobile/desktop) para confirmarlo, ya que no lo puedes verificar vos mismo salvo que levantes un servidor.
