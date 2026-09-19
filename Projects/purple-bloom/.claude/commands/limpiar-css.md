---
description: Revisa css/styles.css en busca de clases sin usar y valores sin tokenizar
---

Revisá `css/styles.css` de este proyecto (Purple Bloom) y reportá, sin modificar nada:

1. **Clases sin usar**: clases definidas en `css/styles.css` que no aparecen en ningún `class="..."` de `index.html`, `catalogo.html`, `iniciar-sesion.html` ni `privacidad.html`, y que tampoco se agregan dinámicamente desde `ts/*.ts` (o su compilado `js/*.js`) vía `classList.add`/`classList.toggle`/`setAttribute`. Antes de reportar una clase como "sin usar", revisá `ts/nav.ts`, `ts/theme.ts`, `ts/contact-form.ts` y `ts/login-form.ts` para confirmar que ninguno la aplique en tiempo de ejecución (por ejemplo `site-nav--open`, `nav-open`, `form-feedback--success`, `form-feedback--error` se agregan así, no están escritas en el HTML).

2. **Valores sin tokenizar**: colores (hex o `rgb()`), espaciados (`margin`/`padding`/`gap`) o tipografía (`font-size`/`font-weight`) escritos directo como valor literal, fuera del bloque de tokens en `:root` y sus overrides de modo oscuro. Deberían usar `var(--...)` en su lugar, salvo los casos ya documentados como fijos a propósito (ver el comentario al inicio del archivo: `--color-primary-dark`, `--hero-overlay`, el color de los links del footer, `--color-on-primary`, y los overrides fijos de validación dentro de `.site-footer`).

Reportá los hallazgos en una lista clara. Para cada clase sin usar del punto 1, sugerí explícitamente si conviene eliminar esa regla del CSS. No edites ningún archivo vos mismo — esto es solo diagnóstico y sugerencias, la decisión de borrar la toma el usuario.
