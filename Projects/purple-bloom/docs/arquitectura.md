# Arquitectura del Sistema - Purple Bloom

## 1. Stack Tecnológico
- **Librería de UI:** React
- **Lenguaje:** TypeScript
- **Estilos / Componentes UI:** Mantine UI / Tailwind CSS
- **Control de Versiones:** Git & GitHub

## 2. Organización de Capas (src/)
- /components: Elementos modulares y reutilizables (Navegación, Botones, Tarjetas de Prendas).
- /pages: Vistas que implementan los casos de uso principales (Catalog, ProductDetail, ColorAdvisor, Cart, Checkout).
- /context: Manejo del estado global para el carrito de compras y la sesión.
- /data: Datos estáticos simulados para la demostración del catálogo y combinaciones de colores.
- /types: Definiciones de TypeScript para asegurar el tipado de los datos del dominio.
