---
description: Revisa que los formularios del proyecto tengan validación nativa correcta (required, pattern y tipos de input adecuados)
argument-hint: "[archivo opcional a revisar]"
---

Revisa la validación nativa de formularios en este proyecto y reporta cualquier problema encontrado.

Si el usuario indicó un archivo en `$ARGUMENTS`, revisa solo ese archivo. Si no, busca todos los archivos HTML del proyecto que contengan al menos una etiqueta `<form>`.

Para cada campo `<input>`, `<select>` y `<textarea>` dentro de un formulario, verifica:

1. **Atributo `required`**: ¿el campo es obligatorio según su etiqueta/contexto (por ejemplo, nombre, correo, contraseña) y tiene `required` presente? Señala cualquier campo que debería ser obligatorio pero no lo tiene, y cualquier campo marcado `required` que en realidad sea opcional.

2. **Atributo `type` adecuado**: el tipo de input debe coincidir con el dato esperado, sin usar `type="text"` de forma genérica cuando existe un tipo más específico:
   - Correo electrónico → `type="email"`
   - Teléfono → `type="tel"`
   - Contraseña → `type="password"`
   - Números → `type="number"`
   - Fechas → `type="date"`
   - URLs → `type="url"`
   - Búsqueda → `type="search"`
   Señala cualquier campo que use un tipo incorrecto o demasiado genérico para el dato que captura.

3. **Atributo `pattern`**: cuando el tipo nativo no basta para validar el formato exacto (por ejemplo, un teléfono de 10 dígitos, un código postal, o un formato específico), verifica si existe un atributo `pattern` con una expresión regular adecuada. Señala los campos donde falta `pattern` y el formato esperado no queda garantizado solo por el `type`.

Para cada hallazgo, indica: el archivo, el campo (`id`/`name`), qué falta o está mal, y una sugerencia concreta de corrección (el atributo exacto que debería agregarse, con su valor).

Al final, da un resumen breve: cuántos campos se revisaron, cuántos cumplen completamente, y una lista priorizada de correcciones pendientes. No apliques cambios automáticamente — solo reporta, a menos que el usuario pida explícitamente que corrijas los problemas encontrados.
