# Entregable de la Fase 2: Especificaciones Funcionales, Procesos y Reglas del Negocio (Proyecto Purple Bloom)

## 1. Identificación del Proyecto
* **Nombre del Producto:** Purple Bloom (Plataforma E-commerce de Moda Femenina)
* **Autor / Integrante:** Tifany Maite
* **Cohorte / Programa:** Full Stack Developer
* **Fecha:** 2026-11-08
* **Versión del Documento:** 2.0 (Entregable Acumulativo Fases 1 y 2)
* **Entrega:** Fase 2 - Procesos y Reglas del Negocio
* **Estado:** Pendiente de Revisión Docente / En Revisión

## 2. Problema y Contexto
Las usuarias que buscan prendas de vestir y armar outfits suelen tener dificultades para elegir las prendas y colores que mejor se adecuen a su tono de piel o estilo personal. Purple Bloom busca resolver esto integrando asesoría cromática personalizada dentro de una tienda en línea de ropa femenina intuitiva. 

Durante esta Fase 2, se profundizan las reglas de negocio e interacciones reales de la plataforma para eliminar la ambigüedad en la selección de variantes (tallas/colores), prevenir errores al agregar productos sin stock o sin talla definida, y resolver validaciones transparentes durante la gestión del carrito y la simulación de checkout.

## 3. Usuarios y Objetivos
* **Usuario / Cliente:** Desea explorar prendas de vestir, recibir recomendaciones de color según su tono de piel o prendas personales, consultar características detalladas de cada producto, gestionar su carrito de compras con actualización inmediata de totales y simular la compra de sus productos seleccionados mediante validaciones en tiempo real.

## 4. Descripción General de la Solución
Purple Bloom es una tienda digital interactiva que combina la venta de ropa de mujer con un asistente de color. La usuaria navega por el catálogo general con adición rápida por talla, consulta detalles completos de las prendas (con selectores de variantes y acordeón explicativo), recibe sugerencias de paletas cromáticas mediante interacción táctil sobre imagen/foto real, añade ítems a su carrito y completa un proceso de checkout simplificado e unificado en la misma vista con validaciones síncronas.

## 5. Alcance Inicial y Exclusiones
* **Alcance Base:** Navegación de catálogo (`CU-01`), detalle de producto (`CU-02`), asesor de color interactivo (`CU-03`), gestión del carrito de compras (`CU-04`) y finalización de compra simbólica (`CU-05`), formalizados mediante las especificaciones `SPEC-01-02`, `SPEC-03` y `SPEC-04-05`.
* **Exclusiones Explícitas:** Autenticación de usuarios, backend de persistencia en base de datos de producción, procesamiento real de pagos y pasarelas bancarias (Stripe/PayPal), e integración de filtros automáticos inmediatos en el catálogo tras la asesoría cromática.

## 6. Secciones o Pantallas Previstas
* **Inicio / Catálogo (ViewCatalog):** Muestra la lista de prendas de vestir disponibles con tarjetas interactivos, badges de oferta, valoración por estrellas y botones de selección rápida de talla.
* **Detalle de Producto (ViewProductDetail):** Presenta imágenes de alta resolución, descripción extendida, acordeón de cuidados, variantes (tallas, colores), tipo de entrega (envío o retiro en tienda) y control de stock.
* **Asesor de Color (ViewColorAdvisor):** Asistente interactivo táctil que analiza coordenadas sobre la fotografía de una prenda cargada para identificar el tono exacto y desplegar la guía de combinaciones (*Combina bien*, *Con precaución*, *Evitar*).
* **Carrito y Checkout Unificado (ViewCartCheckout):** Resumen de selección de prendas con controles de incremento/decremento/eliminación, cálculo síncrono del Total general, módulo de canje de puntos y formulario para datos de envío del cliente.

## 7. Casos de Uso de la Versión Inicial

### CU-01: Navegación de Catálogo
1. **Identificador y nombre:** `CU-01: Navegación de Catálogo` (`docs/use-cases/cu-01-catalogo.md`)
2. **Actor principal y objetivo:** Usuario / Explorar la lista de prendas de vestir disponibles.
3. **Situación que lo inicia y condiciones previas:** El usuario ingresa a la página principal de Purple Bloom. La tienda debe estar desplegada y accesible.
4. **Pasos del recorrido principal:**
   1. El usuario accede a la sección de Catálogo.
   2. El sistema consulta el listado de productos y lo despliega en pantalla.
   3. El usuario explora las prendas con sus imágenes, nombres y precios.
5. **Alternativas, errores y restricciones:** Si la lista de productos no carga, el sistema muestra un mensaje de advertencia al usuario.
6. **Resultado observable:** Renderizado del catálogo visual completo en pantalla.
7. **Criterios de aceptación:** Todos los productos cargados muestran su título, precio e imagen correspondiente.

### CU-02: Consulta de Detalle de Producto
1. **Identificador y nombre:** `CU-02: Consulta de Detalle de Producto` (`docs/use-cases/cu-02-detalle-producto.md`)
2. **Actor principal y objetivo:** Usuario / Ver la información detallada de una prenda de vestir.
3. **Situación que lo inicia y condiciones previas:** El usuario está visualizando el catálogo de productos.
4. **Pasos del recorrido principal:**
   1. El usuario hace clic sobre una tarjeta de producto específica.
   2. El sistema abre la vista detallada mostrando imágenes adicionales, descripción y variantes de talla/color.
5. **Alternativas, errores y restricciones:** Si la combinación seleccionada no tiene stock, se muestra la etiqueta de "Agotado" y se deshabilita el botón de compra. Si se presiona "AGREGAR A MI CARRITO" conservando el selector en "Selecciona", se bloquea la adición con la alerta: *"Elige una talla para añadir al carrito"*.
6. **Resultado observable:** Módulos de información detallada desplegados correctamente.
7. **Criterios de aceptación:** Al seleccionar un producto, se actualiza la vista con la descripción e imagen correspondiente a dicho ítem.

### CU-03: Asesor de Color / Personalización
1. **Identificador y nombre:** `CU-03: Asesor de Color` (`docs/use-cases/cu-03-asesor-color.md`)
2. **Actor principal y objetivo:** Usuario / Recibir recomendaciones de paletas de color según una imagen o prenda seleccionada.
3. **Situación que lo inicia y condiciones previas:** El usuario ingresa a la herramienta interactiva del Asesor Cromático.
4. **Pasos del recorrido principal:**
   1. El usuario carga una fotografía o activa la cámara para subir una prenda propia.
   2. El usuario hace clic/toca un punto específico sobre la tela en la imagen.
   3. El sistema identifica el tono exacto (RGB/Hex) y despliega la guía de combinaciones cromáticas (*Combina bien*, *Con precaución*, *Evitar*).
5. **Alternativas, errores y restricciones:** Si el usuario presiona fuera de la prenda o sobre un tono no válido, el sistema despliega el aviso visual: *"No se encuentra la blusa o prenda"*.
6. **Resultado observable:** Despliegue de la guía cromática de combinaciones en pantalla.
7. **Criterios de aceptación:** Al seleccionar un punto sobre la prenda, la pantalla muestra la recomendación cromática sin recargar la página.

### CU-04: Gestión del Carrito de Compras
1. **Identificador y nombre:** `CU-04: Gestión del Carrito de Compras` (`docs/use-cases/cu-04-carrito.md`)
2. **Actor principal y objetivo:** Usuario / Añadir, modificar o eliminar prendas seleccionadas para la compra.
3. **Situación que lo inicia y condiciones previas:** El usuario navega por el catálogo o la vista de detalle de producto.
4. **Pasos del recorrido principal:**
   1. El usuario presiona el botón "Añadir al carrito" en un producto eligiendo una talla válida.
   2. El sistema actualiza el contador del header y el resumen del carrito con el subtotal.
   3. El usuario puede ajustar cantidades (`- 1 +`) o eliminar ítems mediante la acción "Quitar" dentro del panel del carrito.
5. **Alternativas, errores y restricciones:** Si el carrito se queda sin productos, muestra el estado explícito "El carrito está vacío".
6. **Resultado observable:** Actualización en tiempo real del contador y suma total de la compra.
7. **Criterios de aceptación:** Modificar cantidades o eliminar un ítem recalcula automáticamente el valor total.

### CU-05: Finalización de Compra / Checkout
1. **Identificador y nombre:** `CU-05: Finalización de Compra / Checkout` (`docs/use-cases/cu-05-checkout.md`)
2. **Actor principal y objetivo:** Usuario / Simular la confirmación de la orden de compra.
3. **Situación que lo inicia y condiciones previas:** El usuario tiene al menos un producto en el carrito y se encuentra en la vista de Checkout.
4. **Pasos del recorrido principal:**
   1. El usuario selecciona el método de entrega (envío a domicilio / retiro en tienda) y completa el formulario de envío simbólico.
   2. El usuario presiona "Confirmar compra".
   3. El sistema valida los datos, procesa la orden simbólica, vacía el carrito y reinicia el contador del header a 0.
5. **Alternativas, errores y restricciones:** Si falta completar algún campo obligatorio (Nombre, Dirección, Correo), el sistema resalta los campos con un icono `✕`, muestra las alertas por campo y el aviso general: *"Revisa los campos marcados antes de continuar."*.
6. **Resultado observable:** Mensaje/modal de éxito de la orden realizada y limpieza del carrito.
7. **Criterios de aceptación:** Se genera el mensaje de confirmación y el estado del carrito vuelve a 0 ítems.

## 8. Decisiones y Preguntas Pendientes
* **Decisiones Confirmadas:**
  * Unificación de especificaciones de flujo continuo: `CU-01`+`CU-02` en `SPEC-01-02` y `CU-04`+`CU-05` en `SPEC-04-05`.
  * Definición de la interacción táctil en fotos reales para el Asistente de Color (`SPEC-03`).
  * Integración de los mensajes de error explícitos observados en las interfaces gráficas reales.
* **Preguntas Pendientes:** No existen preguntas abiertas ni decisiones pendientes que bloqueen el cierre de la Fase 2.

## 9. Decisiones Propias y Uso de IA
Para la elaboración, estructuración y validación funcional de esta segunda fase utilicé como agente de soporte a Claude Code, habiendo verificado previamente la instalación activa de Agent Harness Kit (AHK) 3.0.0 y las herramientas MCP en el entorno de desarrollo local.

Durante el análisis del alcance de esta fase, decidí de forma personal unificar las fichas de casos de uso continuos en documentos de especificación funcionales consolidados. Específicamente, en lugar de manejar la adición de carrito y el checkout como pantallas aisladas, se definieron como un flujo integrado de checkout simbólico unificado en una sola vista.

Un cambio clave respecto a la Fase 1 ocurrió en el **Asesor de Color (`CU-03`)**: inicialmente se planteaba un cuestionario o test con preguntas estáticas de piel; sin embargo, tras revisar la interacción real, decidí cambiar este mecanismo hacia una experiencia basada en la interacción táctil sobre fotos reales cargadas por la usuaria.

* **Ejemplo Válido de Regla:** En la vista de detalle de producto, la usuaria selecciona "Talla: M", "Color: Rosa" y presiona "AGREGAR A MI CARRITO". El sistema valida la selección y añade el producto incrementando el contador a 1.
* **Ejemplo Inválido / Alternativo:** La usuaria presiona "AGREGAR A MI CARRITO" manteniendo la opción por defecto "Talla: Selecciona". El sistema bloquea el evento, detiene la adición y despliega la notificación visual: *"Elige una talla para añadir al carrito"*.

## 10. Fuentes y Comprobaciones de esta Fase
* **Fuentes Documentales:**
  * Casos de uso originales en `docs/use-cases/` (`CU-01` a `CU-05`).
  * Especificaciones funcionales aprobadas en `docs/specs/` (`SPEC-01-02-catalogo-detalle.md`, `SPEC-03-asesor-color.md`, `SPEC-04-05-carrito-checkout.md`).
  * Bitácora de desarrollo del proyecto en `docs/proceso.md`.
  * Síntesis anterior conservada en `docs/entregas/fase-01.md`.
* **Comprobaciones Realizadas:**
  * `ahk --version`: Confirmada la versión CLI 3.0.0 activa.
  * `ahk doctor` y `specs.list`: Diagnóstico de entorno y herramientas MCP ejecutados exitosamente.
  * `ahk health` con `pnpm build`: Verificación de compilación exitosa sin errores en la plantilla frontend.
  * **Validación Documental:** Verificación visual y técnica de que la documentación mantenga explícitamente el estado **"Pendiente de Revisión Docente / En Revisión"** en todos sus encabezados.

---

## 11. Procesos Detallados

### P-01: Exploración y Selección de Variante de Prenda (`SPEC-01-02`)
* **ID Documental:** `P-01`
* **Casos Relacionados:** `CU-01`, `CU-02`
* **Actor:** Usuario / Cliente.
* **Inicio:** Clic en una tarjeta de producto desde el catálogo o ingreso directo a la vista de detalle (`ViewProductDetail`).
* **Condiciones Previas:** La tienda cuenta con el catálogo de productos disponible en el sistema.
* **Datos de Entrada:** Selector de color (botones de tono), selector de talla (desplegable), cantidad (control de incremento/decremento numérico), tipo de entrega (envío a domicilio / retiro en tienda).
* **Pasos Usuario / Producto:**
  1. El usuario visualiza la imagen, precio, descripción y opciones del producto.
  2. El usuario selecciona la talla deseada (distinta de la opción inicial "Selecciona").
  3. El usuario presiona el botón "AGREGAR A MI CARRITO".
  4. El sistema comprueba que la talla elegida sea válida y que exista inventario disponible.
  5. El sistema actualiza el estado global de la sesión, añade el producto y recalcula el contador del header.
* **Resultado:** Prenda registrada exitosamente en la lista temporal del carrito de compras.

### P-02: Diagnóstico Cromático e Interacción Táctil (`SPEC-03`)
* **ID Documental:** `P-02`
* **Casos Relacionados:** `CU-03`
* **Actor:** Usuario / Cliente.
* **Inicio:** Clic en "Subir Foto" o "Usar Cámara" en el panel del Asistente de Color (`ViewColorAdvisor`).
* **Condiciones Previas:** La usuaria dispone de un archivo de imagen o cámara en su dispositivo.
* **Datos de Entrada:** Coordenadas del clic $(X, Y)$ sobre la foto de la prenda renderizada en pantalla.
* **Pasos Usuario / Producto:**
  1. La usuaria carga la imagen de la prenda que desea analizar.
  2. La usuaria hace clic/toca un punto específico sobre la tela de la prenda.
  3. El sistema lee el valor de píxel en la coordenada indicada e identifica el tono textil exacto (código Hex/RGB).
  4. El sistema despliega de forma inmediata la guía de combinaciones en tres niveles (*Combina bien*, *Con precaución*, *Evitar*).
* **Resultado:** Despliegue en pantalla de la paleta y guía de combinación cromática.

### P-03: Gestión del Carrito y Checkout Simbólico Unificado (`SPEC-04-05`)
* **ID Documental:** `P-03`
* **Casos Relacionados:** `CU-04`, `CU-05`
* **Actor:** Usuario / Cliente.
* **Inicio:** Clic en el botón "Confirmar compra" dentro de la vista unificada de Carrito y Checkout (`ViewCartCheckout`).
* **Condiciones Previas:** El carrito contiene al menos 1 artículo con valor Total $> 0$.
* **Datos de Entrada:** Formulario de envío: `Nombre completo`, `Dirección de envío`, `Correo electrónico`, elección de método de entrega.
* **Pasos Usuario / Producto:**
  1. La usuaria revisa los ítems en el carrito, pudiendo modificar cantidades (`- 1 +`) o presionar "Quitar".
  2. La usuaria completa los campos de texto del formulario de checkout simbólico.
  3. La usuaria presiona el botón "Confirmar compra".
  4. El sistema valida que ninguno de los campos obligatorios se encuentre vacío.
  5. El sistema procesa la orden simbólica de compra, vacía la lista de ítems del carrito y restablece el contador visual del header a 0.
* **Resultado:** Despliegue de la pantalla/modal de confirmación de la orden procesada.

## 12. Reglas del Negocio

### RN-01: Obligatoriedad de Selección de Talla
* **Condición:** La usuaria intenta agregar un producto a su carrito desde la vista de detalle.
* **Comportamiento Exigido:** El valor del selector desplegable de talla debe ser distinto de la opción por defecto *"Selecciona"*.
* **Efecto al Incumplir:** Se bloquea la adición al carrito y el sistema muestra la alerta visual: *"Elige una talla para añadir al carrito"*.
* **Procesos Afectados:** `P-01`.

### RN-02: Control de Inventario Agotado (Stock Cero)
* **Condición:** La combinación de talla y color seleccionada no cuenta con unidades disponibles en el inventario.
* **Comportamiento Exigido:** La interfaz debe presentar el badge o sello visual *"Agotado"* y deshabilitar las interacciones de compra.
* **Efecto al Incumplir:** El botón "AGREGAR A MI CARRITO" se mantiene completamente desactivado e inhabilitado.
* **Procesos Afectados:** `P-01`.

### RN-03: Detección Táctil Específica sobre Área Textil
* **Condición:** La usuaria hace clic sobre la foto cargada en el Asistente de Color.
* **Comportamiento Exigido:** La coordenada del clic debe corresponder al área delimitada de una prenda de vestir con contraste válido.
* **Efecto al Incumplir:** Si el clic se realiza sobre el fondo o área no reconocida, el sistema despliega el aviso de advertencia: *"No se encuentra la blusa o prenda"*.
* **Procesos Afectados:** `P-02`.

### RN-04: Llenado de Campos Obligatorios en Formulario de Checkout
* **Condición:** La usuaria presiona el botón "Confirmar compra" en la vista de Checkout.
* **Comportamiento Exigido:** Todos los campos de datos personales (Nombre completo, Dirección de envío, Correo) deben contener texto válido.
* **Efecto al Incumplir:** Se bloquea la confirmación, se resaltan los campos incompletos con borde rojo e icono `✕`, se muestran las alertas individuales ("Ingresa tu nombre completo.", "Ingresa tu dirección de envío.") y se despliega la alerta general inferior: *"Revisa los campos marked antes de continuar."*.
* **Procesos Afectados:** `P-03`.

### RN-05: Reinicio de Estado del Carrito tras Compra Exitosa
* **Condición:** La orden de compra es validada y confirmada con datos válidos.
* **Comportamiento Exigido:** El sistema debe vaciar la lista de ítems del carrito y reiniciar automáticamente el contador numérico del header a 0.
* **Procesos Afectados:** `P-03`.

## 13. Datos Necesarios y su Significado
* **Información Introducida por el Usuario:**
  * `TallaSeleccionada`: Cadena de texto ('S', 'M', 'L', 'XL'). Campo obligatorio.
  * `ColorSeleccionado`: Identificador de variante cromática. Campo obligatorio.
  * `CantidadProducto`: Número entero positivo ($\ge 1$). Modificable en el detalle o carrito.
  * `NombreCliente`: Cadena de texto. Obligatorio para envío.
  * `DireccionEnvio`: Cadena de texto. Obligatorio para entrega a domicilio.
  * `CorreoCliente`: Cadena de texto con estructura válida de e-mail. Obligatorio.
* **Información Conocida o Calculada por el Producto:**
  * `PrecioUnitario`: Valor decimal representativo del precio de la prenda.
  * `SubtotalItem`: Calculado automáticamente multiplicando `PrecioUnitario` por `CantidadProducto`.
  * `TotalOrden`: Sumatoria síncrona de los subtotales de todos los ítems agregados al carrito.
  * `ContadorHeader`: Número entero visualizado en la parte superior que suma las unidades totales seleccionadas.

## 14. Validaciones, Permisos y Restricciones
* **Validación de Talla:** El sistema restringe la acción de compra si `TallaSeleccionada == "Selecciona"`. Despliega el mensaje: *"Elige una talla para añadir al carrito"*.
* **Validación de Imagen Textil:** Si las coordenadas del clic devuelven valores fuera de rango o píxeles correspondientes a zonas transparentes/blancas del fondo, la aplicación restringe el cálculo y notifica: *"No se encuentra la blusa o prenda"*.
* **Validación del Formulario de Envío:** Si la usuaria envía el formulario con datos nulos, el producto suspende la transacción simbólica, marca los campos en rojo y despliega: *"Revisa los campos marcados antes de continuar."*. La usuaria puede corregir la información sin perder los ítems del carrito.

## 15. Estados y Cambios Permitidos
* **Ciclo de Estado de la Sesión del Carrito de Compras:**
  1. `Estado Vacío`: Estado inicial del sistema o posterior a una compra confirmada. Presenta la interfaz con el mensaje *"El carrito está vacío"*, contador en 0 y deshabilita la opción de checkout.
  2. `Estado Con Ítems`: Se activa automáticamente al añadir 1 o más prendas válidas. Permite ajustar cantidades, eliminar ítems y desbloquea el formulario de checkout.
  3. `Estado Procesado / Vaciado`: Transición que ocurre de forma síncrona al confirmar el formulario de checkout válido; limpia la lista de ítems y retorna la sesión al `Estado Vacío`.

## 16. Cálculos y Ejemplos
* **Fórmula de Subtotal por Ítem:**
  $$\text{Subtotal} = \text{Precio Unitario} \times \text{Cantidad}$$
  * *Ejemplo Válido:* Blusa Moda Rosa a $\$25.00$ con Cantidad $2 \rightarrow \text{Subtotal} = \$50.00$.
* **Fórmula de Total General de la Orden:**
  $$\text{Total General} = \sum \text{Subtotales de Ítems}$$
  * *Ejemplo Válido:* Item 1 ($\$50.00$) + Item 2 ($\$30.00$) $\rightarrow \text{Total General} = \$80.00$.
* **Excepción de Cálculo:** Si la cantidad de un producto se reduce a 0 o se presiona "Quitar", el ítem se remueve de la sumatoria y el Total recalcula instantáneamente.

## 17. Alternativas, Errores y Recuperación
* **Formulario Incompleto en Checkout:** El sistema bloquea el envío y marca en rojo los campos vacíos. La usuaria completa la información requerida y presiona "Confirmar compra" nuevamente sin perder los productos seleccionados.
* **Clic Inexacto en Asesor de Color:** Al presionar sobre una zona no válida, el mensaje *"No se encuentra la blusa o prenda"* notifica la anomalía pero mantiene la imagen cargada, permitiendo realizar un nuevo clic sobre la tela.
* **Eliminación Total de Ítems:** Si la usuaria remueve todas las prendas del carrito, el sistema muestra el estado *"El carrito está vacío"*, orientándola a regresar al catálogo.

## 18. Criterios de Aceptación y Ejemplos Comprobables
* **CA-01 (Validación de Talla Requerida):**
  * *Dado que* la usuaria está en la vista de detalle de una prenda y mantiene la opción "Selecciona", *cuando* presiona "AGREGAR A MI CARRITO", *entonces* la adición se detiene y la pantalla muestra *"Elige una talla para añadir al carrito"*.
* **CA-02 (Variante Agotada / Sin Inventario):**
  * *Dado que* una prenda no cuenta con stock disponible en la variante elegida, *cuando* la usuaria la visualiza, *entonces* la pantalla despliega el sello *"Agotado"* y desactiva el botón de compra.
* **CA-03 (Recomendación Cromática por Clic):**
  * *Dado que* la usuaria cargó una foto en el Asesor de Color, *cuando* hace clic sobre un punto de la tela, *entonces* el sistema identifica el tono y despliega la guía de combinaciones (*Combina bien*, *Con precaución*, *Evitar*).
* **CA-04 (Área No Válida en Foto):**
  * *Dado que* la usuaria hace clic fuera de la prenda en la imagen, *entonces* la aplicación muestra la alerta *"No se encuentra la blusa o prenda"*.
* **CA-05 (Validación de Formulario en Checkout):**
  * *Dado que* el carrito tiene productos pero faltan campos en el formulario de envío, *cuando* la usuaria presiona "Confirmar compra", *entonces* el sistema resalta los campos con `✕` y muestra *"Revisa los campos marcados antes de continuar."*.
* **CA-06 (Confirmación de Orden y Limpieza):**
  * *Dado que* la usuaria llenó correctamente el formulario de envío, *cuando* presiona "Confirmar compra", *entonces* el sistema procesa la orden simbólica, limpia el carrito y reinicia el contador visual a 0.

## 19. Relación entre Casos, Procesos, Reglas y Criterios (Matriz de Trazabilidad)

| Caso de Uso Fuente | Proceso | Reglas del Negocio | Datos / Estados Relevantes | Criterios de Aceptación | Especificación Fuente |
| --- | --- | --- | --- | --- | --- |
| CU-01, CU-02 | P-01 | RN-01 | TallaSeleccionada / Estado Con Ítems | CA-01 | docs/specs/SPEC-01-02-catalogo-detalle.md |
| CU-01, CU-02 | P-01 | RN-02 | Estado Stock / Botón Inhabilitado | CA-02 | docs/specs/SPEC-01-02-catalogo-detalle.md |
| CU-03 | P-02 | RN-03 | Coordenadas (X, Y) / Guía Cromática | CA-03, CA-04 | docs/specs/SPEC-03-asesor-color.md |
| CU-04, CU-05 | P-03 | RN-04 | NombreCliente, DireccionEnvio / Campos Rojo | CA-05 | docs/specs/SPEC-04-05-carrito-checkout.md |
| CU-04, CU-05 | P-03 | RN-05 | TotalOrden / Estado Vacío (Reiniciado a 0) | CA-06 | docs/specs/SPEC-04-05-carrito-checkout.md |

## 20. Cambios Respecto de la Primera Entrega
1. **Unificación de Especificaciones Continuas:** Se consolidaron `CU-01` y `CU-02` dentro de `SPEC-01-02`, y `CU-04` y `CU-05` dentro de `SPEC-04-05` para reflejar la experiencia real de navegación continua en la aplicación web.
2. **Evolución Interactiva del Asesor de Color:** Se sustituyó el enfoque teórico de cuestionario por la interacción táctil directa sobre fotografías reales del usuario en `SPEC-03`.
3. **Formalización de Validaciones de Interfaz:** Se incorporaron explícitamente en las reglas de negocio los mensajes de error reales que emite la aplicación (*"Elige una talla para añadir al carrito"*, *"No se encuentra la blusa o prenda"*, *"Revisa los campos marcados antes de continuar."*).
4. **Respeto al Estado de Evaluación Docente:** Se mantuvo la clasificación del documento en estado **"Pendiente de Revisión Docente / En Revisión"**, reflejando que las especificaciones no han recibido aún la evaluación formal por parte del profesor.