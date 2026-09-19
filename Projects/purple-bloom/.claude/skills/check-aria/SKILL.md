---
name: accesibilidad-aria
description: >
  Revisa y corrige atributos ARIA, roles semánticos y etiquetas de formulario
  en el formulario de contacto.html. Úsala cada vez que se modifique un
  bloque
---

# Accesibilidad ARIA

## Checklist antes de dar por terminado un bloque
1. Todo <input> tiene un <label> asociado por for/id (el for del label
   coincide con el id del input — no con el name) o, si no hay label
   visible, aria-label.
2. Los landmarks (header, nav, main, footer) no se duplican sin aria-label
   que los distinga.
3. Las imágenes decorativas llevan alt="" ; las informativas, alt
   descriptivo.
4. Los mensajes de error de formulario usan aria-live o aria-describedby.