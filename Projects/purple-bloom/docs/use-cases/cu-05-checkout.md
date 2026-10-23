# CU-05: Finalización de Compra (Checkout)

- **Actor Principal:** Usuario / Cliente
- **Objetivo:** Ingresar los datos de envío y pago para completar la orden de compra.
- **Iniciador:** El usuario presiona el botón "Proceder al Pago" dentro del carrito.
- **Condiciones Previas:** El carrito debe contener al menos un producto con stock disponible.

## Pasos del Recorrido Principal

1. El usuario accede a la pantalla de Checkout.
2. El sistema solicita los datos de contacto, dirección de entrega y método de pago.
3. El usuario completa el formulario y confirma el pedido.
4. El sistema procesa la orden y muestra la pantalla de confirmación con el resumen del pedido.



## Alternativas y Excepciones

- **A1 (Formulario incompleto):** Si faltan campos obligatorios, el sistema marca los errores y no permite procesar el envío.



## Criterios de Aceptación

- CA-01: La compra solo se confirma si todos los campos obligatorios se completan correctamente.
- CA-02: Al finalizar, el usuario recibe una pantalla de confirmación con el detalle de su pedido.

