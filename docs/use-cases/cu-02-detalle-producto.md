# CU-02: Consulta de Detalle de Producto

- **Actor Principal:** Usuario / Cliente
- **Objetivo:** Consultar la información detallada de un producto seleccionado (imágenes, especificaciones, precio y disponibilidad) antes de decidir su compra o personalización.
- **Iniciador:** El usuario hace clic sobre una tarjeta de producto en el catálogo.
- **Condiciones Previas:** El producto existe en el catálogo de la tienda.

## Pasos del Recorrido Principal

1. El usuario selecciona un producto del catálogo general.
2. El sistema muestra la pantalla de detalle del producto con sus imágenes, descripción, variantes, precio y stock.
3. El usuario selecciona una variante específica (por ejemplo, tono o tamaño).
4. El sistema actualiza el precio y la disponibilidad en pantalla según la variante elegida.



## Alternativas y Excepciones

- **A1 (Producto sin stock):** Si el producto o la variante elegida no tiene inventario, el sistema muestra el estado "Agotado" y deshabilita el botón de adición al carrito.
- **A2 (Enlace inválido):** Si se intenta acceder a un producto inexistente, el sistema muestra una pantalla de error 404 con opción de volver al catálogo.



## Criterios de Aceptación

- CA-01: Al seleccionar un producto, la vista carga la información correcta del ítem.
- CA-02: Seleccionar una variante actualiza dinámicamente la información visual y de stock.
- CA-03: En caso de stock cero, se inhabilita la acción de compra.

