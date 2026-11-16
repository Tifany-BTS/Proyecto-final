## Bitácora de Decisiones

### Decisión 1: Definición de Actores y Alcance

- **Alcance elegido:** B2C exclusivo para Clienta / Visitante.
- **Actores definidos:** 
  1. **Visitante:** Navegación libre, consulta de catálogo, detalle de prendas y recomendador interactivo de colores.
  2. **Clienta:** Capacidades de visitante más gestión de carrito de compras y checkout simulado.

### Decisión 2: Estructura de Casos de Uso

- Se definen 5 casos de uso principales para el proyecto **Purple Bloom**:
  - **CU-01:** Explorar Catálogo y Filtrar Productos
  - **CU-02:** Ver Detalle de Producto
  - **CU-03:** Asesor de Combinación y Paleta de Colores (sección independiente)
  - **CU-04:** Gestionar Carrito de Compras
  - **CU-05:** Simular Pago y Confirmación de Pedido

# Registro de Decisiones y Proceso - Fase 1

## Decisiones Confirmadas

1. **Alcance de la Versión Inicial:**

   - **Incluido:** Catálogo, Ficha de Producto (CU-02), Asesor de Color (CU-03), Carrito (CU-04) y Checkout básico (CU-05).

   - **Excluido:** Autenticación de usuarios, gestión de perfiles, integración con pasarelas de pago reales y panel de administración.

   - **Motivo:** Mantener la entrega dentro de un alcance manejable y enfocado en la experiencia principal de navegación y personalización sin sobrecargar la arquitectura inicial.

2. **Herramientas de Entorno:**

   - Confirmada la versión AHK 3.0.0 y la preparación del entorno mediante plantilla base React + Vite sin modificar la carpeta `src/`.

