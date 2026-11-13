# Fase 1: Definición Funcional y Casos de Uso - Purple Bloom

## 1. Identificación del Proyecto

- **Nombre del producto:** Purple Bloom
- **Autor / Integrante:** Tifany Maite
- **Cohorte / Programa:** Full Stack Developer
- **Fecha:** 2026
- **Versión del documento:** 1.0
- **Entrega:** Fase 1 · Definición funcional

## 2. Problema y Contexto

Las usuarias que buscan prendas de vestir y armar outfits suelen tener dificultades para elegir las prendas y colores que mejor se adecuen a su tono de piel o estilo personal. Purple Bloom busca resolver esto integrando asesoría cromática personalizada dentro de una tienda en línea de ropa femenina intuitiva.

## 3. Usuarios y Objetivos

- **Usuario / Cliente:** Desea explorar prendas de vestir, recibir recomendaciones de color según sus gustos y tono de piel, gestionar su carrito y simular la compra de sus productos seleccionados.

## 4. Descripción General de la Solución

Purple Bloom es una tienda digital interactiva que combina la venta de ropa de mujer con un asistente de color. La usuaria navega el catálogo, consulta detalles de las prendas, recibe sugerencias de paletas cromáticas, añade ítems a su carrito y completa un proceso de checkout simplificado.

## 5. Alcance Inicial y Exclusiones

- **Alcance Base:** Navegación, detalle de producto, asesor de color, gestión de carrito y checkout.
- **Exclusiones:** Autenticación de usuarios, backend persistence, procesamiento real de pagos y pasarelas bancarias.

## 6. Secciones o Pantallas Previstas

- **Inicio / Catálogo:** Muestra la lista de prendas de vestir disponibles.
- **Detalle de Producto (`ProductDetail`):** Presenta imágenes, descripción, variantes (tallas, colores) y precio.
- **Asesor de Color (`ColorAdvisor`):** Asistente interactivo para recomendar gamas de colores según el tono de piel.
- **Carrito (`Cart`):** Resumen de selección de prendas, cantidades y totales.
- **Checkout (`Checkout`):** Formulario de envío y confirmación de orden simbólica.

## 7. Casos de Uso de la Versión Inicial

- `CU-01`: Navegación de Catálogo (`docs/use-cases/cu-01-catalogo.md`)
- `CU-02`: Consulta de Detalle de Producto (`docs/use-cases/cu-02-detalle-producto.md`)
- `CU-03`: Asesor de Color / Personalización (`docs/use-cases/cu-03-asesor-color.md`)
- `CU-04`: Gestión del Carrito de Compras (`docs/use-cases/cu-04-carrito.md`)
- `CU-05`: Finalización de Compra / Checkout (`docs/use-cases/cu-05-checkout.md`)

---

### Fichas de Casos de Uso

#### CU-01: Navegación de Catálogo
1. **Identificador y nombre:** CU-01: Navegación de Catálogo
2. **Actor principal y objetivo:** Usuario / Explorar la lista de prendas de vestir disponibles.
3. **Situación que lo inicia y condiciones previas:** El usuario ingresa a la página principal de Purple Bloom. La tienda debe estar desplegada y accesible.
4. **Pasos del recorrido principal:**
   - 1. El usuario accede a la sección de Catálogo.
   - 2. El sistema consulta el listado de productos y lo despliega en pantalla.
   - 3. El usuario explora las prendas con sus imágenes, nombres y precios.
5. **Alternativas, errores y restricciones:** Si la lista de productos no carga, el sistema muestra un mensaje de advertencia al usuario.
6. **Resultado observable:** Renderizado del catálogo visual completo en pantalla.
7. **Criterios de aceptación:** Todos los productos cargados muestran su título, precio e imagen correspondiente.

---

#### CU-02: Consulta de Detalle de Producto
1. **Identificador y nombre:** CU-02: Consulta de Detalle de Producto
2. **Actor principal y objetivo:** Usuario / Ver la información detallada de una prenda de vestir.
3. **Situación que lo inicia y condiciones previas:** El usuario está visualizando el catálogo de productos.
4. **Pasos del recorrido principal:**
   - 1. El usuario hace clic sobre una tarjeta de producto específica.
   - 2. El sistema abre la vista detallada mostrando imágenes adicionales, descripción y variantes de talla/color.
5. **Alternativas, errores y restricciones:** Si el producto no tiene stock, se muestra la etiqueta de "Agotado".
6. **Resultado observable:** Módulos de información detallada desplegados correctamente.
7. **Criterios de aceptación:** Al seleccionar un producto, se actualiza la vista con la descripción e imagen correspondiente a dicho ítem.

---

#### CU-03: Asesor de Color / Personalización
1. **Identificador y nombre:** CU-03: Asesor de Color
2. **Actor principal y objetivo:** Usuario / Recibir recomendaciones de paletas de color según su tono de piel o preferencia.
3. **Situación que lo inicia y condiciones previas:** El usuario ingresa a la herramienta interactiva del Asesor Cromático.
4. **Pasos del recorrido principal:**
   - 1. El usuario interactúa con la prueba o selector de tonos de piel/estaciones.
   - 2. El sistema calcula el tipo de paleta (por ejemplo, Primavera u Otoño).
   - 3. El sistema muestra la gama de colores sugerida y destaca los productos de la tienda que coinciden con esa paleta.
5. **Alternativas, errores y restricciones:** Si el usuario no selecciona ninguna opción, el botón para calcular sugerencias permanece inactivo.
6. **Resultado observable:** Despliegue de la paleta de colores personalizada y filtrado visual de ropa.
7. **Criterios de aceptación:** Al completar el test, la pantalla muestra la recomendación cromática sin recargar la página.

---

#### CU-04: Gestión del Carrito de Compras
1. **Identificador y nombre:** CU-04: Gestión del Carrito de Compras
2. **Actor principal y objetivo:** Usuario / Añadir, modificar o eliminar prendas seleccionadas para la compra.
3. **Situación que lo inicia y condiciones previas:** El usuario navega por el catálogo o el Asesor Cromático.
4. **Pasos del recorrido principal:**
   - 1. El usuario presiona el botón "Añadir al carrito" en un producto.
   - 2. El sistema actualiza el contador y el resumen del carrito con el subtotal.
   - 3. El usuario puede ajustar cantidades o eliminar ítems dentro del lateral del carrito.
5. **Alternativas, errores y restricciones:** Si el carrito se queda sin productos, muestra el estado "El carrito está vacío".
6. **Resultado observable:** Actualización en tiempo real del contador y suma total de la compra.
7. **Criterios de aceptación:** Modificar cantidades o eliminar un ítem recalcula automáticamente el valor total.

---

#### CU-05: Finalización de Compra / Checkout
1. **Identificador y nombre:** CU-05: Finalización de Compra / Checkout
2. **Actor principal y objetivo:** Usuario / Simular la confirmación de la orden de compra.
3. **Situación que lo inicia y condiciones previas:** El usuario tiene al menos un producto en el carrito y presiona "Finalizar compra".
4. **Pasos del recorrido principal:**
   - 1. El usuario completa el formulario de envío simbólico.
   - 2. El usuario confirma el pedido.
   - 3. El sistema vacía el carrito y despliega una pantalla/mensaje de confirmación de orden.
5. **Alternativas, errores y restricciones:** Si falta completar algún campo del formulario, el sistema exige llenarlo antes de enviar.
6. **Resultado observable:** Mensaje de éxito de la orden realizada y limpieza del carrito.
7. **Criterios de aceptación:** Se genera el mensaje de confirmación y el estado del carrito vuelve a 0 ítems.

## 8. Decisiones y Preguntas Pendientes

- **Confirmado:** Integración del flujo completo en el alcance funcional inicial sin requerir inicio de sesión.
- **Pendiente:** Definición de más categorías de ropa femenina para fases posteriores.

## 9. Decisiones Propias y Uso de IA

Para la elaboración y estructuración funcional de este proyecto utilicé como agente de soporte a **Claude Code**, verificando previamente la instalación activa de **Agent Harness Kit (AHK) 3.0.0** mediante los comandos de entorno y la inicialización de sus herramientas MCP. 

Durante la definición del alcance, decidí de forma personal **excluir la implementación de un backend con pasarela de pagos real y la persistencia de usuarios**. Esta decisión la tomé para priorizar el desarrollo y la usabilidad de la interfaz de usuario en el frontend, concentrando el esfuerzo principal en la experiencia interactiva del Asesor Cromático y la gestión fluida del catálogo de ropa femenina.

En cuanto a la navegación de la aplicación, el **recorrido principal** de un usuario consiste en ingresar a la tienda "Purple Bloom", explorar las prendas en el catálogo y acceder al Asesor Cromático. Allí interactúa con la prueba de color para recibir una recomendación personalizada basada en su tono de piel, lo que le permite filtrar o seleccionar prendas que se ajusten a su paleta ideal, agregarlas al carrito y completar un proceso de checkout simulado sin fricciones. 

En una **situación alternativa o de error** (por ejemplo, si el cliente intenta agregar al carrito una prenda sin seleccionar su talla/variante, o si intenta calcular la paleta cromática sin responder las preguntas del test), el sistema bloquea la acción manteniendo el botón inactivo o desplegando un aviso visual contextual que le indica qué campo falta por completar. Asimismo, si un producto consultado no cuenta con stock disponible, la interfaz inhabilita la opción de compra e informa el estado para evitar inconsistencias en el carrito.

## 10. Fuentes y Comprobaciones de esta Fase

- **Archivos fuente e identificadores:** Casos de uso conservados en `docs/use-cases/` (`CU-01` a `CU-05`), bitácora de proceso en `docs/proceso.md` y síntesis en `docs/entregas/fase-01.md`.
- **ahk --version:** Confirmada la versión CLI `3.0.0` activa en el entorno local.
- **Plantilla abierta en el navegador:** Verificado el arranque inicial de React y Vite sin errores en pantalla.
- **ahk doctor y acceso a specs.*:** Verificado el diagnóstico del entorno y la lectura de herramientas MCP; confirma disponibilidad del flujo documental sin validar decisiones de negocio.
- **Validación de los casos mediante AHK:** Comprobación del formato, estado y metadatos estructurados de los archivos en `docs/use-cases/`.
- **ahk health configurado con pnpm build:** Comprobación de compilación exitosa (`build`) de la plantilla base; no evalúa funcionalidades futuras.
- **Lectura final del documento:** Verificación visual de los 10 apartados, enlaces, ortografía y coherencia general previa a la exportación en PDF.