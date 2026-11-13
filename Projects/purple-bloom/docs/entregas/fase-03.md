# Entregable de la Fase 3: Diseño Técnico y Plan de Construcción (Proyecto Purple Bloom)

## 1. Identificación del Proyecto
* **Nombre del Producto:** Purple Bloom (Plataforma E-commerce de Moda Femenina)
* **Autor / Integrante:** Tifany Maite (Cevallos Tifany)
* **Cohorte / Programa:** Full Stack Developer
* **Fecha:** 2026-11-10
* **Versión del Documento:** 3.0 (Entregable Acumulativo Fases 1, 2 y 3)
* **Entrega:** Fase 3 - Diseño Técnico y Plan de Construcción
* **Estado:** Pendiente de Revisión Docente / En Revisión

## 2. Problema y Contexto
Las usuarias que buscan prendas de vestir y armar outfits suelen tener dificultades para elegir las prendas y colores que mejor se adecuen a su tono de piel o estilo personal. Purple Bloom busca resolver esto integrando asesoría cromática personalizada dentro de una tienda en línea de ropa femenina intuitiva. 

* **Declaración de Retroalimentación Docente:** A la fecha de emisión de esta entrega, no existe retroalimentación docente previa registrada para las entregas de las Fases 1 y 2. Se declara formalmente la ausencia de dicha retroalimentación sin asumir ni simular aprobaciones docentes previas.

Durante esta Fase 3, se formaliza la arquitectura técnica del frontend, definiendo la navegación declarativa con React Router v8.3.1, la gestión de datos remotos con TanStack Query v5.102.8, la administración global del carrito con Zustand v5.0.15, y las validaciones de formularios con Zod v4.4.3 y Mantine Form v9.4.1.

## 3. Usuarios y Objetivos
* **Usuario / Cliente:** Desea explorar prendas de vestir, buscar y filtrar por categoría, recibir recomendaciones de color mediante el Asistente de Color táctil sobre prendas personales, consultar detalles de cada producto, gestionar su carrito de compras con actualización inmediata de totales y simular la compra de sus productos seleccionados.

## 4. Descripción General de la Solución
Purple Bloom es una tienda digital interactiva que combina la venta de ropa de mujer con un Asistente de Color. La usuaria navega por el catálogo general con filtros por categoría y buscador visual, consulta detalles completos de las prendas (con selectores de variantes de talla/color y acordeón explicativo), recibe sugerencias de paletas cromáticas mediante interacción táctil sobre la foto de una prenda real, añade ítems a su carrito y completa un proceso de checkout simbólico unificado con modal de confirmación.

## 5. Alcance Inicial y Exclusiones
* **Alcance Base:** Navegación de catálogo con búsqueda y filtro (`CU-01`), detalle de producto (`CU-02`), Asistente de Color interactivo por foto (`CU-03`), gestión del carrito de compras (`CU-04`) y finalización de compra simbólica (`CU-05`), formalizados mediante las especificaciones `SPEC-01-02`, `SPEC-03` y `SPEC-04-05`.
* **Exclusiones Explícitas:** Autenticación real de usuarios, backend de persistencia en base de datos de producción, procesamiento real de pagos (Stripe/PayPal) y persistencia de datos en servidores remotos.
* **Declaración de Elementos Simbólicos:** Los componentes visuales presentes en la interfaz ("Mi cuenta", "Favoritos", "Contacto", "Direcciones guardadas", "Pedidos anteriores" y la insignia "Club VIP") son elementos puramente visuales y estéticos en el frontend, sin estado persistente ni backend asociado. Al hacer clic sobre "Mi cuenta" o "Iniciar sesión", el sistema únicamente despliega una notificación informativa de interfaz sin alterar rutas ni estado.

## 6. Secciones o Pantallas Previstas
* **Inicio / Catálogo (`ViewCatalog`):** Muestra el catálogo de prendas disponibles con barra de búsqueda por nombre, selector de categoría, tarjetas de producto con fallback de imagen en caso de carga lenta, precio real e interfaz de selección rápida.
* **Detalle de Producto (`ViewProductDetail`):** Presenta imágenes del producto (ej. Blusa Rosa Palo a $52.99, Vestido Elegante a $84.99), descripción extendida, acordeón de cuidados y selectores de variantes (talla y color).
* **Asistente de Color (`ViewColorAdvisor`):** Herramienta interactiva táctil que analiza coordenadas sobre la fotografía de una prenda cargada para identificar el tono textil y desplegar la guía de combinaciones (*Combina bien*, *Con precaución*, *Evitar*).
* **Carrito y Checkout Unificado (`ViewCartCheckout`):** Resumen de prendas seleccionadas con ajuste de cantidades, cálculo síncrono del Total general, selector de método de entrega y formulario de datos de envío.

## 7. Casos de Uso de la Versión Inicial

### CU-01: Navegación, Búsqueda y Filtro de Catálogo
1. **Identificador y nombre:** `CU-01: Navegación de Catálogo` (`docs/use-cases/cu-01-catalogo.md`)
2. **Actor principal y objetivo:** Usuario / Explorar, filtrar por categoría y buscar prendas de vestir disponibles.
3. **Situación que lo inicia y condiciones previas:** El usuario ingresa a la vista principal de Purple Bloom. La tienda debe estar accesible.
4. **Pasos del recorrido principal:**
   1. El usuario accede al Catálogo.
   2. El sistema despliega el listado completo de productos (ej. Blusa Rosa Palo a $52.99, Pantalón Berenjena a $59.99).
   3. El usuario puede ingresar un término en la barra de búsqueda o seleccionar una categoría ("Blusas", "Vestidos", "Pantalones").
   4. El sistema filtra las prendas coincidentes en pantalla.
5. **Alternativas, errores y restricciones:** Si la lista no carga o una imagen de producto falla (ej. Blusa Estampada o Pantalón Wide Leg), el sistema despliega un fondo degradado estilizado como fallback visual sin interrumpir la visualización del título y precio.
6. **Resultado observable:** Catálogo renderizado correctamente con prendas filtradas y datos legibles.
7. **Criterios de aceptación:** Todos los productos mostrados exhiben título, precio real e imagen o tarjeta visual equivalente (`CA-01`).

### CU-02: Consulta de Detalle de Producto
1. **Identificador y nombre:** `CU-02: Consulta de Detalle de Producto` (`docs/use-cases/cu-02-detalle-producto.md`)
2. **Actor principal y objetivo:** Usuario / Ver la información detallada de una prenda de vestir.
3. **Situación que lo inicia y condiciones previas:** El usuario interactúa con una tarjeta de producto en el catálogo.
4. **Pasos del recorrido principal:**
   1. El usuario hace clic sobre un producto (ej. Blusa Rosa Palo).
   2. El sistema abre la vista de detalle mostrando precio ($52.99), variantes de talla/color y acordeón explicativo.
5. **Alternativas, errores y restricciones:** Si la variante seleccionada no cuenta con inventario, se deshabilita el botón de compra con la etiqueta "Agotado" (`CA-02`). Si se presiona "AGREGAR A MI CARRITO" conservando "Selecciona" en la talla, el sistema emite el aviso: *"Elige una talla para añadir al carrito"* (`CA-03`).
6. **Resultado observable:** Vista detallada de la prenda en pantalla.
7. **Criterios de aceptación:** La vista se actualiza con las especificaciones del ítem seleccionado (`CA-02`, `CA-03`).

### CU-03: Asistente de Color / Personalización
1. **Identificador y nombre:** `CU-03: Asistente de Color` (`docs/use-cases/cu-03-asesor-color.md`)
2. **Actor principal y objetivo:** Usuario / Recibir recomendaciones cromáticas interactuando con la foto de una prenda.
3. **Situación que lo inicia y condiciones previas:** El usuario accede al módulo Asistente de Color.
4. **Pasos del recorrido principal:**
   1. El usuario carga una foto o activa la cámara para capturar su prenda.
   2. El usuario presiona/toca un punto específico sobre la prenda en la imagen.
   3. El sistema analiza el valor del píxel (RGB/Hex) y despliega la guía de combinaciones (*Combina bien*, *Con precaución*, *Evitar*).
5. **Alternativas, errores y restricciones:** Si el clic se realiza fuera de la prenda o en una zona de bajo contraste, el sistema notifica: *"No se encuentra la blusa o prenda"* (`CA-05`).
6. **Resultado observable:** Despliegue inmediato de la paleta y sugerencias cromáticas.
7. **Criterios de aceptación:** El sistema renderiza la guía cromática sin recargar la página (`CA-04`, `CA-05`).

### CU-04: Gestión del Carrito de Compras
1. **Identificador y nombre:** `CU-04: Gestión del Carrito de Compras` (`docs/use-cases/cu-04-carrito.md`)
2. **Actor principal y objetivo:** Usuario / Añadir, modificar cantidades o remover prendas del carrito.
3. **Situación que lo inicia y condiciones previas:** El usuario interactúa desde el catálogo o la vista de detalle.
4. **Pasos del recorrido principal:**
   1. El usuario selecciona una talla válida y presiona "AGREGAR A MI CARRITO".
   2. El sistema incrementa el contador del header y calcula el subtotal.
   3. El usuario ajusta cantidades (`- 1 +`) o remueve ítems con la acción "Quitar".
5. **Alternativas, errores y restricciones:** Al vaciar todos los ítems, se muestra el estado: "El carrito está vacío".
6. **Resultado observable:** Actualización inmediata del resumen y total del carrito.
7. **Criterios de aceptación:** La modificación o eliminación de prendas recalcula automáticamente el Total general.

### CU-05: Finalización de Compra / Checkout
1. **Identificador y nombre:** `CU-05: Finalización de Compra / Checkout` (`docs/use-cases/cu-05-checkout.md`)
2. **Actor principal y objetivo:** Usuario / Simular la confirmación de la orden de compra.
3. **Situación que lo inicia:** El usuario navega a Checkout con al menos 1 ítem en el carrito.
4. **Pasos del recorrido principal:**
   1. El usuario selecciona el método de entrega ("Envío a domicilio" o "Retiro en tienda").
   2. Si selecciona "Envío a domicilio", el campo de dirección es obligatorio. Si elige "Retiro en tienda", la dirección se deshabilita con la leyenda "No aplica para retiro".
   3. El usuario completa los datos requeridos (Nombre, Correo) y presiona "Confirmar compra".
   4. El sistema valida los datos con Zod, abre el `OrderConfirmationModal` mostrando el resumen de la orden, y mantiene el carrito intacto hasta que la usuaria presiona "Finalizar y Cerrar" en el Modal, momento en el cual se ejecuta `clearCart()` y el contador vuelve a 0.
5. **Alternativas, errores y restricciones:** Si existen campos vacíos o con formato inválido, se destacan los inputs en rojo y se muestran los mensajes de error por campo.
6. **Resultado observable:** Despliegue del modal de orden procesada y posterior limpieza del carrito al confirmar el cierre (`CA-06`).
7. **Criterios de aceptación:** Formulario validado con éxito, gestión del modal y reinicio del contador a 0 ítems (`CA-06`).

## 8. Decisiones y Preguntas Pendientes
* **Decisiones Confirmadas:**
  * Declaración explícita de componentes estáticos visuales ("Mi cuenta" y "Club VIP") sin persistencia local en `localStorage` ni backend real.
  * Incorporación formal de búsqueda y filtros por categoría en `CU-01`.
  * Inclusión del campo `deliveryMethod` ("Envío a domicilio" | "Retiro en tienda") en el checkout para condicionar la obligatoriedad de la dirección.
  * Adopción del stack técnico fijado en la consigna: React Router v8.3.1, TanStack Query v5.102.8, Zustand v5.0.15, Zod v4.4.3 con Mantine Form v9.4.1 y Mantine Modal v9.4.1.
* **Bloqueos Técnicos y Preguntas Pendientes:**
  * **Ausencia de API Backend Remota:** Actualmente no existe un endpoint backend remoto ni servidor API provisto para el catálogo. **Se declara formalmente como un bloqueo técnico abierto pendiente de acuerdo con el docente**. Como hipótesis de trabajo documental para esta Fase 3, se proyecta una capa de servicio en `src/services/product-service.ts` para simular la respuesta asíncrona, sin dar por resuelto el servicio remoto definitivo.

## 9. Decisiones Propias y Uso de IA
Como responsable del frontend de Purple Bloom, trabajé junto a Claude Code en la toma de decisiones técnicas para garantizar una solución escalable y mantenible.

* **Decisión Técnica Evaluada:** Para la administración del carrito en Zustand (`use-cart-store.ts`), evalué si almacenar el objeto completo del producto (`{ id, name, price, image, ... }`) o almacenar **únicamente la referencia del producto (`productId`), la talla, el color y la cantidad**.
* **Alternativa y Consecuencias:** Guardar la prenda completa en el store global habría duplicado los datos de precios e imágenes que ya administra TanStack Query en la caché remota del catálogo, corriendo el riesgo de desincronización si el precio cambia. Elegí almacenar únicamente las referencias (`productId`, `size`, `color`, `quantity`). La interfaz resuelve el nombre y precio cruzando el `productId` con la caché de TanStack Query al renderizar el resumen.
* **Recomendación que Necesité Entender:** Comprendí que Zustand no debe usarse para duplicar la respuesta remota del catálogo. TanStack Query es el único dueño del estado remoto, mientras que Zustand administra el estado del cliente compartido entre el Header, el Catálogo y la vista de Checkout.
* **Recorrido Técnico Explicado:** Cuando la usuaria selecciona la talla M en la *Blusa Rosa Palo* (`/producto/blusa-rosa-palo`) y presiona "AGREGAR A MI CARRITO", la vista `ViewProductDetail` invoca la acción `addItem()` de `useCartStore`. Zustand almacena la referencia (`productId: "blusa-rosa-palo"`, `size: "M"`, `quantity: 1`). El componente `Header.tsx` escucha este cambio mediante un selector atómico e incrementa el contador síncronamente. En `/carrito`, `ViewCartCheckout` lee los ítems del store y cruza las referencias con la caché de TanStack Query para calcular el Subtotal y Total General.
* **Qué Evidencia Falta:** Falta la ejecución real de pruebas de integración en navegador con un servidor backend y base de datos de producción reales. Actualmente las comprobaciones se limitan a pruebas puras en memoria con Vitest y compilación con Vite (`pnpm build`).

---

## 10. Fuentes y Comprobaciones de esta Fase
* **Fuentes Documentales:**
  * Casos de uso originales en `docs/use-cases/` (`CU-01` a `CU-05`).
  * Especificaciones funcionales aprobadas en `docs/specs/` (`SPEC-01-02`, `SPEC-03`, `SPEC-04-05`).
  * Especificaciones técnicas en `docs/specs/` (`SPEC-TECH-01`, `SPEC-TECH-02`, `SPEC-TECH-03` en estado `draft` pendiente de reconciliación).
* **Documentación Oficial de Librerías Consultadas (Vigentes):**
  * **React Router:** Versión `8.3.1`, Concepto: Declarative Routing & Routes, Enlace: `https://reactrouter.com`, Consulta: 2026-10-19.
  * **TanStack Query:** Versión `5.102.8`, Concepto: `useQuery` Hooks & Query Keys, Enlace: `https://tanstack.com/query`, Consulta: 2026-10-19.
  * **Zustand:** Versión `5.0.15`, Concepto: Store Creation & Selectors, Enlace: `https://zustand-demo.pmnd.rs`, Consulta: 2026-10-19.
  * **Zod:** Versión `4.4.3` (imports desde `zod/v4`), Concepto: Schema Definition & Parsing, Enlace: `https://zod.dev`, Consulta: 2026-10-19.
  * **Mantine Form & Core:** Versión `9.4.1`, Concepto: `useForm` & `Modal`, Enlace: `https://mantine.dev`, Consulta: 2026-10-19.
* **Comprobaciones del Entorno Ejecutadas Realmente:**
  * `node --version`: `v22.22.0` (Línea Node 22).
  * `pnpm --version`: `11.17.0`.
  * `ahk --version`: `3.0.0`.
  * `ahk doctor` y `specs.list`: Diagnóstico de herramientas MCP verificado.
  * `ahk health`: Compilación limpia verificada en la base existente.

---

## 11. Procesos Detallados
* **P-01: Exploración, Búsqueda y Selección de Prenda:**
  * **Casos:** `CU-01`, `CU-02`. **Actor:** Usuario.
  * **Pasos:** El usuario busca por texto o filtra por categoría, hace clic en la tarjeta (`/producto/blusa-rosa-palo`), selecciona talla válida (S, M, L, XL) y presiona "AGREGAR A MI CARRITO".
* **P-02: Diagnóstico Cromático en Asistente de Color:**
  * **Casos:** `CU-03`. **Actor:** Usuario.
  * **Pasos:** Carga de foto, clic táctil en coordenada textil (X, Y), lectura de píxel (RGB/Hex) y despliegue de la guía de combinaciones.
* **P-03: Carrito y Checkout Simbólico Unificado:**
  * **Casos:** `CU-04`, `CU-05`. **Actor:** Usuario.
  * **Pasos:** Revisión del carrito en `/carrito`, selección del método de entrega ("home" | "pickup"), llenado de datos (`ejemplo@correo.com`), submit validado con Zod, apertura de `OrderConfirmationModal`, procesado de la orden y reinicio del carrito a 0.

## 12. Reglas del Negocio
* **RN-01 (Obligatoriedad de Talla):**
  * **Condición:** El usuario intenta agregar un producto conservando la opción "Selecciona" en la talla.
  * **Efecto:** El sistema detiene la adición y despliega: *"Elige una talla para añadir al carrito"*.
  * **Procesos Afectados:** `P-01`, `CU-02`.
* **RN-02 (Stock Agotado):**
  * **Condición:** La variante seleccionada no tiene inventario disponible (`stock == 0`).
  * **Efecto:** Se deshabilita el botón de compra con la etiqueta "Agotado".
  * **Procesos Afectados:** `P-01`, `CU-02`.
* **RN-03 (Detección Táctil Textil):**
  * **Condición:** El clic en la foto del Asistente de Color ocurre fuera del área textil de la prenda o en una zona de baja tolerancia de color.
  * **Efecto:** El sistema notifica: *"No se encuentra la blusa o prenda"*.
  * **Procesos Afectados:** `P-02`, `CU-03`.
* **RN-04 (Campos Obligatorios Checkout):**
  * **Condición:** El formulario de checkout se envía con campos obligatorios vacíos o la dirección vacía teniendo seleccionado "Envío a domicilio".
  * **Efecto:** El sistema bloquea el submit, resalta los inputs en rojo, despliega los avisos por campo (*"Ingresa tu nombre completo."*, *"Correo electrónico no válido."*, *"Ingresa tu dirección de envío."*) y notifica el aviso general: *"Revisa los campos marcados antes de continuar."*.
  * **Procesos Afectados:** `P-03`, `CU-05`.
* **RN-05 (Reinicio de Carrito):**
  * **Condición:** El formulario de checkout es procesado exitosamente.
  * **Efecto:** Se vacía el listado de compras de Zustand (`clearCart()`), se reinicia el contador del Header a 0 y se despliega el `OrderConfirmationModal`. Si la usuaria cierra el modal sin enviar la orden (o antes de presionar confirmar), el estado permanece intacto.
  * **Procesos Afectados:** `P-03`, `CU-05`.

## 13. Datos Necesarios y su Significado
* **Introducidos por Usuario:** 
  * `TallaSeleccionada`: Obligatorio (Valores: S, M, L, XL; requiere selección distinta de "Selecciona").
  * `CantidadProducto`: Obligatorio (Valor entero $\ge 1$).
  * `DeliveryMethod`: Obligatorio (Valores: `'home'` | `'pickup'`).
  * `NombreCliente`: Obligatorio (Mínimo 1 carácter).
  * `DireccionEnvio`: Obligatorio si `DeliveryMethod == 'home'` (Deshabilitado si `DeliveryMethod == 'pickup'`).
  * `CorreoCliente`: Obligatorio (Formato de correo electrónico válido, ej. `ejemplo@correo.com`).
* **Conocidos o Calculados:** 
  * `PrecioUnitario`: Precio real del catálogo (ej. Blusa Rosa Palo $52.99; incluye etiqueta de descuento/oferta si aplica).
  * `StockDisponible`: Unidades disponibles en inventario ($>0$ disponible, $=0$ agotado).
  * `SubtotalItem`: Multiplicación de Precio Unitario por Cantidad.
  * `TotalOrden`: Suma de subtotales del carrito.
  * `ContadorHeader`: Suma total de unidades en el carrito.

## 14. Validaciones, Permisos y Restricciones
* **Validaciones del Cliente (Navegador):** Validación síncrona en el cliente mediante Mantine Form y Zod (talla obligatoria, formato de correo, campos vacíos y dirección condicional al método de entrega).
* **Garantías de Servicios Externos (Backend - Fuera del Navegador):** La verificación real de inventario disponible en base de datos, el procesamiento de cobros y el envío de correos de confirmación dependen de servicios de backend externos (no ejecutados en el cliente).

---

## 15. Estados y Cambios Permitidos
* **Ciclo del Carrito:** `Estado Vacío` (Contador en 0) -> `Estado Con Ítems` (Ítems en lista) -> `Estado Procesado` (Limpieza total tras confirmar y cerrar el Modal).

## 16. Cálculos y Ejemplos
* **Subtotal por Ítem:** Subtotal = Precio Unitario * Cantidad.
  * *Ejemplo Real:* Blusa Rosa Palo ($52.99) con Cantidad 2 -> Subtotal = $105.98.
* **Total General:** Total = Suma de Subtotales por Ítem.
  * *Ejemplo Real:* Blusa Rosa Palo ($105.98) + Vestido Elegante ($84.99) -> Total General = $190.97.

## 17. Alternativas, Errores y Recuperación
* **Formulario Incompleto:** Los inputs se marcan con borde rojo y mensaje de error específico. La usuaria corrige la información sin perder las prendas agregadas al carrito.
* **Clic Inexacto en Foto:** Se despliega el mensaje de aviso *"No se encuentra la blusa o prenda"*; la imagen permanece cargada para permitir un nuevo toque táctil.

## 18. Criterios de Aceptación y Ejemplos Comprobables
* **CA-01 (Catálogo y Fallback):** Dado que la usuaria navega por el catálogo, cuando visualiza los productos, entonces cada tarjeta exhibe su título, precio e imagen o fondo degradado de fallback si falla la imagen.
* **CA-02 (Variante Agotada):** Dado que una variante de prenda no tiene inventario, cuando la usuaria la selecciona, entonces el botón de compra se inhabilita mostrando el texto "Agotado".
* **CA-03 (Validación de Talla):** Dado que la opción elegida es "Selecciona", cuando la usuaria presiona "AGREGAR A MI CARRITO", entonces el sistema bloquea la adición y exige seleccionar una talla.
* **CA-04 (Asistente de Color):** Dado que la usuaria toca un punto textil en la foto, entonces el Asistente de Color despliega la guía de combinaciones cromáticas.
* **CA-05 (Error por Clic Inexacto):** Dado que el toque ocurre fuera de la prenda, entonces el sistema muestra el mensaje *"No se encuentra la blusa o prenda"*.
* **CA-06 (Validación Checkout y Modal):** Dado que el formulario tiene campos vacíos o inválidos, se muestran mensajes en rojo. Si el formulario es correcto, se abre el `OrderConfirmationModal` con el detalle del pedido y se vacía el carrito a 0 únicamente al confirmar el cierre.

## 19. Relación entre Casos, Procesos, Reglas y Criterios (Matriz de Trazabilidad Funcional)

| Caso de Uso Fuente | Proceso | Reglas del Negocio | Datos / Estados Relevantes | Criterios de Aceptación | Especificación Fuente |
| --- | --- | --- | --- | --- | --- |
| CU-01, CU-02 | P-01 | RN-01 | TallaSeleccionada / Estado Con Ítems | CA-01, CA-03 | docs/specs/SPEC-01-02-catalogo-detalle.md |
| CU-01, CU-02 | P-01 | RN-02 | Estado Stock / Botón Inhabilitado | CA-02 | docs/specs/SPEC-01-02-catalogo-detalle.md |
| CU-03 | P-02 | RN-03 | Coordenadas (X, Y) / Guía Cromática | CA-04, CA-05 | docs/specs/SPEC-03-asesor-color.md |
| CU-04, CU-05 | P-03 | RN-04 | DeliveryMethod, DireccionEnvio / Errores Rojo | CA-06 | docs/specs/SPEC-04-05-carrito-checkout.md |
| CU-04, CU-05 | P-03 | RN-05 | TotalOrden / Estado Vacío (Al Cerrar Modal) | CA-06 | docs/specs/SPEC-04-05-carrito-checkout.md |

## 20. Cambios Respecto de la Primera Entrega
1. **Historial de Evolución (Fase 1 a Fase 2):** Incorporación formal del Asistente de Color táctil como valor diferencial de la plataforma. Estandarización de las fichas de producto con variantes de talla/color y acordeones explicativos de cuidado textil.
2. **Correcciones de la Fase 2:** Unificación del nombre oficial del módulo a **Asistente de Color**, sustitución de placeholders ficticios por prendas con datos reales (Blusa Rosa Palo a $52.99, Vestido Elegante a $84.99) e integración del fallback visual con fondo degradado para tarjetas de catálogo.

---

## 21. Stack y Matriz de Herramientas Obligatorias

| Herramienta Requerida | Versión | Requisito / Regla | Responsabilidad Concreta | Componente Consumidor | Estado de Dependencia | Comprobación Prevista |
| --- | --- | --- | --- | --- | --- | --- |
| **React & React DOM** | 19.2.8 | Arquitectura Base | Renderizado de UI y props en Vite | `src/components/` | Instalada en plantilla base | Compilación Vite (`pnpm build`) |
| **React Router** | 8.3.1 | `CU-01` a `CU-05` | Navegación declarativa por rutas | `src/router/app-router.tsx` | Propuesta para integración | Comprobación manual de rutas |
| **TanStack Query** | 5.102.8 | `CU-01`, `SPEC-01-02` | Consulta remota del catálogo y caché | `useProducts` hook | Propuesta para integración | Test de estados `isLoading`, `data` |
| **Zustand** | 5.0.15 | `CU-04`, `RN-05` | Estado global del cliente para carrito | `useCartStore` | Propuesta para integración | Test de acciones `addItem`, `clearCart` |
| **Mantine Form & Zod** | 9.4.1 / 4.4.3 | `RN-04`, `CA-05` | Validación condicional de formulario | `CheckoutForm` | Propuesta para integración | Test puro en Vitest de schema Zod |
| **Mantine Modal & Core**| 9.4.1 | `CU-05`, `CA-06` | Modal visual de confirmación simbólica | `OrderConfirmationModal` | Propuesta para integración | Comprobación manual de UI |

* **Motivo de Elección y Compatibilidad Declarada:** Las herramientas seleccionadas son los estándares oficiales de la cohorte. Comparten compatibilidad garantizada sobre Node 22 (`v22.22.0`) y Vite. Mantine Form y Mantine Core comparten exactamente la versión `9.4.1`, y Zod `4.4.3` utiliza imports desde `zod/v4`.

## 22. Arquitectura y Responsabilidades
Estructura de carpetas modular por responsabilidades del frontend (nombres de carpetas y archivos en `kebab-case`, componentes en `PascalCase`):

* **`src/components/`**: Componentes visuales UI
  * **`layout/`**: `Header.tsx` (consumidor principal de `use-cart-store.ts`), `MainLayout.tsx`, `Footer.tsx`
  * **`catalog/`**: `ProductCard.tsx`, `ProductGrid.tsx`, `ProductFilter.tsx`
  * **`detail/`**: `VariantSelector.tsx`, `ProductAccordion.tsx`
  * **`color-advisor/`**: `ColorAdvisorCanvas.tsx`, `CombinationGuide.tsx`
  * **`checkout/`**: `CartTable.tsx`, `CheckoutForm.tsx`, `OrderConfirmationModal.tsx`
  * **`src/services/`**: Capa de servicios y comunicación remota (`product-service.ts`)
* **`src/hooks/`**: Custom hooks de datos remotos (`use-products.ts` con TanStack Query)
* **`src/router/`**: Declaración de rutas declarativas (`app-router.tsx`)
* **`src/stores/`**: Stores globales de Zustand (`use-cart-store.ts`)
* **`src/schemas/`**: Schemas de validación Zod (`checkout-schema.ts`)
* **`src/views/`**: Vistas de pantalla (`ViewCatalog.tsx`, `ViewProductDetail.tsx`, `ViewColorAdvisor.tsx`, `ViewCartCheckout.tsx`, `ViewNotFound.tsx`)

## 23. Navegación con React Router

| Ruta Publicada | Pantalla / Vista | Propósito de la Ruta | Parámetros | Casos Cubiertos |
| --- | --- | --- | --- | --- |
| `/` | `ViewCatalog` | Catálogo general con buscador y filtro por categoría | Ninguno | `CU-01` |
| `/producto/:slug` | `ViewProductDetail` | Consulta detallada y variantes por prenda | `:slug` (ej. `blusa-rosa-palo`) | `CU-02` |
| `/asistente-colores` | `ViewColorAdvisor` | Asistente de Color táctil sobre foto de prenda | Ninguno | `CU-03` |
| `/carrito` | `ViewCartCheckout` | Resumen de carrito y formulario de checkout | Ninguno | `CU-04`, `CU-05` |
| `*` | `ViewNotFound` | Pantalla de ruta no encontrada (404) | Ninguno | Excepción |

* **Navegación y Enlaces de Vuelta:** Navegación declarativa mediante `<Link to="...">`. En `ViewProductDetail`, se ofrece el enlace de retorno "Volver al catálogo" (`/`).
* **Manejo de Slugs e `:id` Inexistentes:** Al ingresar una URL con un slug no registrado (ej. `/producto/prenda-inexistente`), TanStack Query devuelve `data: null`, lo que activa la redirección declarativa a la vista `ViewNotFound` (404).
* **Falla de Consulta en Checkout:** Si la consulta de productos falla al ingresar a `/carrito`, la vista despliega un mensaje de advertencia y deshabilita la confirmación del pedido.
* **SPA Fallback al Recargar en Hosting:** Al recargar directamente una URL profunda (ej. `/asistente-colores`) en Netlify o servidor web, se configura la regla de reescritura en `public/_redirects` (`/* /index.html 200`) para delegar el control del enrutamiento a React Router en el cliente.
* **Interacción en "Mi cuenta" / "Club VIP":** Al hacer clic en "Mi cuenta" o "Iniciar sesión", el sistema despliega un banner informativo dentro de la pantalla sin cambiar de ruta ni simular login.

## 24. Propiedad del Estado y Uso de Zustand

| Dato del Sistema | Administrador del Estado | Justificación de Ubicación |
| --- | --- | --- |
| Texto de búsqueda | Estado local React (`useState`) en `ViewCatalog` | Estado efímero de filtro de pantalla |
| Categoría seleccionada | Estado local React (`useState`) en `ViewCatalog` | Estado efímero de filtro de pantalla |
| Talla y color seleccionados | Estado local React (`useState`) en `ViewProductDetail` | Selección previa a presionar agregar al carrito |
| Imagen y coordenadas $(X, Y)$ | Estado local React (`useState`) en `ViewColorAdvisor` | Datos del análisis cromático temporal |
| Campos de Checkout | `Mantine Form` en `CheckoutForm` | Estado borrador del formulario y mensajes de error |
| Estado del Modal (abierto/cerrado) | Estado local React (`useState`) en `ViewCartCheckout` | Control de visibilidad del diálogo visual |
| Ítems del carrito | `Zustand` (`use-cart-store.ts`) | Estado global cliente consumido por `Header`, Catálogo y Checkout |

---
## 25. Datos, Servicios y Límites de Integración
* **Capa de Servicios (`src/services/product-service.ts`):** Define la función `fetchProducts()` que retorna una promesa con la lista de productos reales del catálogo.
* **Declaración de Bloqueo Técnico Explicito:** Se declara la ausencia de un endpoint backend remoto o servidor API provisto. Este bloqueo de integración se resuelve en el frontend simulando una petición asíncrona remota mediante `product-service.ts`, la cual es consumida por TanStack Query.
* **Integración TanStack Query:** Hook `useProducts` con la Query Key `['products']`. Administra los estados de consulta sin duplicarlos en Zustand.
* **Límites de Seguridad:** No se utilizan claves ni tokens privados en el navegador.

## 26. Formularios, Zod y Mantine Modal
* **Formulario de Checkout en `CheckoutForm`:**
  * **Valores Iniciales:** `{ fullName: '', email: '', deliveryMethod: 'home', shippingAddress: '' }`.
  * **Schema Zod (`checkout-schema.ts` importado desde `zod/v4`):**
    ```typescript
    import { z } from 'zod/v4';

    export const checkoutSchema = z.object({
      fullName: z.string().min(1, { message: "Ingresa tu nombre completo." }),
      email: z.string().email({ message: "Correo electrónico no válido." }),
      deliveryMethod: z.enum(['home', 'pickup']),
      shippingAddress: z.string().optional(),
    }).refine((data) => {
      if (data.deliveryMethod === 'home' && (!data.shippingAddress || data.shippingAddress.trim() === '')) {
        return false;
      }
      return true;
    }, {
      message: "Ingresa tu dirección de envío.",
      path: ["shippingAddress"],
    });

    export type CheckoutFormValues = z.infer<typeof checkoutSchema>;
    ```
  * **Aclaración de `z.infer`:** Se utiliza `z.infer` exclusivamente para la inferencia de tipos estáticos en TypeScript durante la compilación; no ejecuta la validación de datos en tiempo de ejecución.
  * **Integración Mantine Form:** Conectado mediante `zodResolver(checkoutSchema)`. Si el formulario es inválido, resalta los campos en rojo y despliega los mensajes por campo. Si es válido, dispara el submit.
* **Componente Interactivo `OrderConfirmationModal`:**
  * **Propósito:** Mostrar la confirmación y resumen de la orden procesada.
  * **Disparador y Estado:** Abierto cuando el formulario se envía con éxito.
  * **Cierre y Cancelación:** El modal se puede cerrar mediante la cruz de cierre (`X`), haciendo clic en el backdrop o presionando el botón "Finalizar y Cerrar". Al presionar la cruz de cierre o cancelar, el modal se cierra y el carrito conserva sus ítems intactos.
  * **Éxito y Confirmación:** Al presionar "Finalizar y Cerrar", se ejecuta la acción `clearCart()` de Zustand, vaciando el carrito y reiniciando el contador del Header a 0.

## 27. Recorridos Técnicos y Sincronización con TanStack Query
1. **Catálogo y Filtrado (`CU-01`):** La usuaria ingresa a `/` -> `ViewCatalog` ejecuta `useProducts` con la Query Key `['products']`.
   * **Derivación de Estado sin Effects:** El texto de búsqueda y la categoría viven en `useState`. El filtrado de prendas se calcula mediante un dato derivado (`const filteredProducts = useMemo(...)`), **sin utilizar `useEffect` ni disparar peticiones adicionales**. Si no existen coincidencias, se despliega el estado "Sin resultados de búsqueda".
   * **Estados TanStack Query:** `isLoading` (spinner), `isError` (mensaje de error), vacío (leyenda "No hay productos") y `isSuccess` (`ProductGrid`).
2. **Detalle de Producto (`CU-02`):** La usuaria navega a `/producto/blusa-rosa-palo` -> `useProducts` consulta la Query Key `['products', slug]`. Si el slug no existe, renderiza `ViewNotFound`. La usuaria selecciona talla M (`useState`) y presiona "AGREGAR A MI CARRITO" -> invoca `addItem()` en Zustand (`use-cart-store.ts`).
3. **Asistente de Color (`CU-03`):** Carga imagen (`useState`) -> Toca coordenada -> Muestra `CombinationGuide`.
4. **Checkout y Modal (`CU-05`):** Navega a `/carrito` -> `CheckoutForm` valida con `schemaResolver(checkoutSchema)` -> Submit procesa la orden, vacía el carrito en Zustand (`clearCart()`) y abre `OrderConfirmationModal`.
* **Sin Mutaciones Remotas:** Confirmación simbólica en el cliente sin backend remoto (`useMutation` no requerido).

## 28. Estrategia de Verificación y Límites de Evidencia

| Criterio / Módulo | Comprobación Prevista | Resultado Esperado | Entorno / Herramienta | Límite de la Evidencia |
| --- | --- | --- | --- | --- |
| Schema Checkout Zod | Test unitario de `checkoutSchema` con datos válidos e inválidos | Retorna `success: true` en válidos y mensajes de error específicos en inválidos | Vitest (Prueba Pura) | Valida únicamente la lógica del esquema Zod en memoria; no prueba inputs HTML. |
| Cálculos de Carrito | Test unitario de cálculo de Subtotal y Total General | Multiplicación exacta de precio por cantidad y suma de subtotales | Vitest (Prueba Pura) | Comprueba la fórmula matemática pura; no evalúa renderizado visual. |
| Store Zustand (`use-cart-store.ts`) | Test de funciones `addItem()` y `clearCart()` | Modificación del arreglo `items` en memoria y reinicio a 0 | Vitest (Prueba Pura) | Prueba lógica de estado pura; no simula la experiencia final de usuario. |
| Detección Cromática | Test unitario de lectura de píxel RGB a Hex | Retorno correcto de la paleta de sugerencia cromática | Vitest (Prueba Pura) | Comprueba la conversión matemática pura; no simula la cámara ni el lienzo HTML. |
| Navegación Declarativa | Recorrido manual por rutas `/`, `/producto/:slug`, `/asistente-colores`, `/carrito` | Cambio fluido de vista y respuesta 404 ante rutas desconocidas | Comprobación Manual en Navegador | Valida comportamiento visual en el cliente; no constituye un test automatizado. |
| Formulario y Modal | Llenado manual de formulario de checkout y submit | Resaltado de campos en rojo ante errores y apertura de Modal al procesar | Comprobación Manual en Navegador | Comprueba la experiencia de usuario real; no garantiza persistencia en base de datos. |
| Verificación de Build | Ejecución de `pnpm build` (script `health`) | Compilación limpia de TypeScript y Vite | CLI (Ejecutado Realmente) | Garantiza la integridad del código fuente; no demuestra disponibilidad de servicios externos. |
| Plan de Publicación | Publicación planificada en Netlify con regla `_redirects` | Carga de SPA y resolución de rutas directas | Plan Futuro (No Ejecutado) | Plan documental futuro; no está ejecutado en esta entrega. |

## 29. Plan de Construcción, Dependencias y Riesgos

* **Etapa 1: Layout Base y Header Consumidor**
  * **Objetivo:** Implementar `MainLayout.tsx` y `Header.tsx` como consumidor principal del store global.
  * **Criterio de Cierre:** Header renderizado con contador del carrito en 0.
* **Etapa 2: Enrutamiento Declarativo**
  * **Objetivo:** Configurar React Router v8.3.1 y vistas principales (`ViewCatalog`, `ViewProductDetail`, `ViewColorAdvisor`, `ViewCartCheckout`, `ViewNotFound`).
  * **Criterio de Cierre:** Navegación por rutas y respuesta 404 ante slugs inexistentes.
* **Etapa 3: Capa de Servicios y Consulta Remota del Catálogo**
  * **Objetivo:** Implementar `product-service.ts` y hook `use-products.ts` con TanStack Query.
  * **Criterio de Cierre:** Tarjetas de catálogo con datos del mock, filtrado derivado con `useMemo` y fallback de imagen.
* **Etapa 4: Módulo Asistente de Color**
  * **Objetivo:** Construir la herramienta de diagnóstico cromático por coordenadas.
  * **Criterio de Cierre:** Selección de punto textil muestra sugerencias cromáticas.
* **Etapa 5: Store Global del Carrito con Zustand**
  * **Objetivo:** Implementar `use-cart-store.ts` para agregar y vaciar ítems.
  * **Criterio de Cierre:** Actualización del contador en Header y recálculo de subtotal en tiempo real.
* **Etapa 6: Formulario de Checkout, Zod y Mantine Modal**
  * **Objetivo:** Validar formulario condicional y presentar confirmación en Modal.
  * **Criterio de Cierre:** Validación en rojo ante errores, apertura de Modal y reinicio del carrito a 0.
* **Etapa 7: Pruebas Unitarias Puras en Vitest**
  * **Objetivo:** Ejecutar suite de pruebas unitarias puras para schemas, tienda Zustand y cálculos.
  * **Criterio de Cierre:** Ejecución de `pnpm test` con 100% de tests puros aprobados.
* **Etapa 8: Plan de Publicación en Netlify**
  * **Objetivo:** Configurar `public/_redirects` para garantizar el soporte de SPA en Netlify.
  * **Criterio de Cierre:** Documentación de la regla `/* /index.html 200` para despliegue futuro.

* **Gestión de Riesgos Técnicos:**
  * **Riesgo en RN-03 (Detección de Área Textil en Asistente de Color):** La falta de un criterio objetivo para evaluar "área textil vs. fondo o bajo contraste" dificulta la verificación. **Solución:** Se define un algoritmo de tolerancia cromática en memoria que analiza la opacidad del canal Alfa ($A > 0$) y la luminancia del píxel en la coordenada $(X, Y)$ elegida.

## 30. Trazabilidad Técnica y Cambios Respecto de la Segunda Entrega

| Caso / Regla | Especificación Funcional | Especificación Técnica | Componente Responsable | Herramienta Obligatoria | Criterio y Comprobación Previstos |
| --- | --- | --- | --- | --- | --- |
| Arquitectura UI | N/A | SPEC-TECH-01 | `MainLayout`, `Header` | React & React DOM v19.2.8 | Compilación Vite (`pnpm build`) |
| Navegación | `CU-01` a `CU-05` | SPEC-TECH-01 | `AppRouter` (`src/router/`) | React Router v8.3.1 | Comprobación manual de rutas |
| `CU-01` / `RN-01` | `SPEC-01-02` | SPEC-TECH-01 | `ProductGrid` / `useProducts` | TanStack Query v5.102.8 | `CA-01`, `CA-07` / Check manual |
| `CU-02` / `RN-01` | `SPEC-01-02` | SPEC-TECH-01 | `VariantSelector` | React State (`useState`) | `CA-01` / Comprobación manual |
| `CU-02` / `RN-02` | `SPEC-01-02` | SPEC-TECH-01 | `VariantSelector` | React State (`useState`) | `CA-02` / Comprobación manual |
| `CU-03` / `RN-03` | `SPEC-03` | SPEC-TECH-02 | `ColorAdvisorCanvas` | React State (`useState`) | `CA-03`, `CA-08` / Test Vitest |
| `CU-04` / `RN-04` | `SPEC-04-05` | SPEC-TECH-03 | `use-cart-store.ts` | Zustand v5.0.15 | `CA-04` / Test Vitest |
| `CU-04` / `RN-05` | `SPEC-04-05` | SPEC-TECH-03 | `use-cart-store.ts` | Zustand v5.0.15 | `CA-04` / Test Vitest |
| `CU-05` / `RN-04` | `SPEC-04-05` | SPEC-TECH-03 | `CheckoutForm` | Mantine Form + Zod v4.4.3 | `CA-05` / Test Vitest |
| UI & Modal | `CU-05` / `RN-05` | SPEC-TECH-03 | `OrderConfirmationModal` | Mantine Modal & Core v9.4.1 | `CA-06` / Check manual |

* **Registro Separado de Cambios:**
  * **Cambios Registrados:** No se han introducido cambios funcionales adicionales sobre las reglas aprobadas en la Fase 2. Las adiciones corresponden exclusivamente a las decisiones de diseño técnico para la integración del frontend con las 6 herramientas requeridas.
  * **Motivos y Fuentes Afectadas:** Definición del stack técnico sobre `docs/specs/SPEC-TECH-01`, `SPEC-TECH-02` y `SPEC-TECH-03` en cumplimiento de la consigna de la Fase 3.