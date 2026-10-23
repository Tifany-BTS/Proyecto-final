# CU-04: Gestión del Carrito de Compras

- **Actor Principal:** Usuario / Cliente
- **Objetivo:** Revisar, modificar cantidades o eliminar los productos seleccionados antes de confirmar la compra.
- **Iniciador:** El usuario hace clic en el icono del carrito o añade un ítem desde el catálogo/detalle.
- **Condiciones Previas:** Haber navegado por el catálogo.

## Pasos del Recorrido Principal

1. El usuario abre la vista del carrito.
2. El sistema muestra la lista de ítems agregados, sus cantidades, precios unitarios y el total calculado.
3. El usuario ajusta cantidades o elimina algún ítem.
4. El sistema recalcula en tiempo real los subtotales y la suma total.



## Alternativas y Excepciones

- **A1 (Carrito vacío):** Si no hay elementos, el sistema muestra un mensaje de carrito vacío y un botón para explorar el catálogo.



## Criterios de Aceptación

- CA-01: El carrito refleja con exactitud la suma de los productos incluidos.
- CA-02: Permite modificar o eliminar elementos recalculando el total de inmediato.

