---
description: Revisa una página HTML en busca de problemas de accesibilidad (alt, labels, contraste, orden de headings)
argument-hint: [ruta-del-archivo-o-sección]
---

Revisa la accesibilidad de: $ARGUMENTS

Si no se especifica ningún archivo o sección, revisa `index.html` y las demás páginas HTML del proyecto (excluyendo `node_modules`).

Para cada archivo objetivo, léelo completo y evalúa estos cuatro puntos. No asumas nada sin haber leído el HTML y el CSS relevante (variables de color en `:root` para el análisis de contraste).

## 1. Imágenes (`alt`)
- Toda etiqueta `<img>` debe tener atributo `alt`.
- El texto de `alt` debe describir el contenido/función de la imagen, no debe ser genérico ("imagen", "foto") ni redundante con un texto ya visible junto a la imagen.
- Imágenes puramente decorativas deben tener `alt=""` (nunca omitir el atributo) o estar marcadas con `aria-hidden="true"` si son íconos/fondos sin valor informativo.
- Iconos SVG inline decorativos deben llevar `aria-hidden="true"` o `role="presentation"`; si son informativos, deben tener `role="img"` + `aria-label` o un `<title>`.

## 2. Formularios (labels y asociaciones)
- Todo `<input>`, `<textarea>` y `<select>` debe tener un `<label for="...">` asociado por `id`, o `aria-label`/`aria-labelledby` si no hay label visible.
- Los mensajes de error deben estar enlazados al campo mediante `aria-describedby`, y ese `id` debe existir realmente en el DOM.
- Campos requeridos deben usar `required` y/o `aria-required="true"`, y el estado inválido debe reflejarse con `aria-invalid="true"` cuando aplica (revisa el JS/TS asociado si existe).
- Botones de tipo icono (sin texto visible) deben tener `aria-label` descriptivo.

## 3. Contraste de color
- Identifica los pares texto/fondo usados en el sitio (a partir de las variables CSS en `:root`, incluyendo variantes de modo oscuro si existen).
- Para cada par relevante (texto normal, texto secundario/`ink-soft`, texto sobre botones, placeholders, mensajes de error), calcula o estima la relación de contraste y contrástala con WCAG AA: **4.5:1** para texto normal, **3:1** para texto grande (≥18.66px bold o ≥24px) y para componentes de UI/bordes de foco.
- Señala explícitamente cualquier combinación por debajo del umbral, indicando los dos colores (nombre de variable + valor hex) y la relación de contraste aproximada.

## 4. Orden de headings
- Debe existir exactamente un `<h1>` por página.
- La jerarquía debe ser secuencial sin saltos (no pasar de `h2` a `h4` sin un `h3` intermedio), siguiendo el orden del documento, no el orden visual/CSS.
- Cada `<section>`/región principal debe tener un heading que la identifique (o `aria-labelledby` apuntando a uno).
- Los headings deben describir el contenido que sigue, no usarse solo por su tamaño de fuente.

## Formato de salida

Devuelve un informe por archivo revisado con esta estructura:

```
### <archivo>

✅ Aprobado / ⚠️ Con observaciones / ❌ Con errores

**Imágenes (alt):** ...
**Formularios:** ...
**Contraste:** ...
**Headings:** ...
```

Para cada problema encontrado, indica: ubicación exacta (línea o selector), qué está mal, y una corrección concreta (el HTML/CSS corregido, no solo la descripción del problema). No reportes problemas hipotéticos ni "buenas prácticas opcionales" fuera de estos 4 puntos — mantente enfocado en lo que el comando pide.

Al final, pregunta si se desean aplicar las correcciones propuestas antes de editar ningún archivo.
