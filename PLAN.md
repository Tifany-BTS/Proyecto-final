# Purple Bloom — Plan de producto

Análisis del proyecto como producto (tienda online B2C de moda femenina), no solo como código. Reemplaza el plan anterior (SaaS B2B), que nunca llegó a implementarse más allá de la intención — el código ya se comportaba como tienda. Aprobado el 2026-08-21.

## Decisiones de posicionamiento (ya definidas)

- **Posicionamiento**: tienda online B2C. Purple Bloom le vende ropa directamente a clientas finales, no una plataforma a marcas. El catálogo, carrito y favoritos pasan a ser funcionalidad real del embudo de compra, no una vitrina ilustrativa.
- **Fidelidad**: sigue siendo un prototipo estático (HTML/CSS/TypeScript sin backend). El carrito/checkout va a simular un flujo de compra completo con el mismo nivel de simulación que ya tiene el login: validación real en el cliente, sin pago ni persistencia real.
- **Login**: pasa a ser el login de una clienta, no de una marca. El destino real deja de ser un panel de administración y pasa a ser una cuenta de clienta (pedidos, direcciones, favoritos guardados).

## Diagnóstico — qué falta y qué está débil

**Problema de fondo detectado**: ~~gran parte del copy visible... `iniciar-sesion.html`... `privacidad.html`...~~ — resuelto: reescritos ambos (ver Fase 1).

**Funcionalidad de compra incompleta**: resuelta.
- ~~El carrito no lleva a ningún lado~~ — `carrito.html` + `ts/cart.ts` (localStorage), badge en el `cart-fab` de `index.html`/`catalogo.html`/`producto.html`.
- ~~No existe página de detalle de producto~~ — `producto.html?id=...` (plantilla única, datos en `ts/products-data.ts`).
- ~~Los filtros de categoría... no filtran nada~~ — `catalogo.html` ahora usa botones con `data-category` + `ts/search.ts` (combina filtro y búsqueda).
- ~~El buscador... no ejecuta ninguna búsqueda~~ — resuelto (fase anterior).
- ~~El link "Favoritos" del nav apunta a la sección editorial~~ — sección renombrada a "Lo más elegido" (id `destacados`); nav "Favoritos" ahora apunta a `mi-cuenta.html#favoritos-guardados`.
- ~~No hay registro de cuenta, recuperar contraseña, ni historial de pedidos~~ — `registro.html`, `recuperar-contrasena.html`, `mi-cuenta.html` (mockup estático) creados.

**Débil en lo existente (heredado)**: ~~footer delgado sin contacto de empresa ni redes sociales; sin página de términos; sin página 404~~ — resuelto: footer con contacto (`hola@tu-dominio.com`, sin redes sociales todavía por falta de cuentas reales), `terminos.html` y `404.html` creados.

## Fase 1 — Corregir el desalineamiento de copy

- [x] `iniciar-sesion.html`: reescribir "accedé a tu panel de administración... gestionar tu catálogo y pedidos" por copy de login de clienta (ver tus pedidos, guardar tus favoritos).
- [x] `privacidad.html`: reescribir las secciones sobre "marcas que usan la plataforma" y "panel de administración" hacia datos de clientas (cuenta, pedidos, pagos).
- [x] Renombrar la sección "Favoritos de la temporada" del home (ej. "Lo más elegido") para no compartir nombre con la futura lista personal de favoritos.

## Fase 2 — Completar el embudo de compra

- [x] `carrito.html` (nueva): resumen de carrito + checkout simulado, mismo nivel de fidelidad que el login (validación real en cliente, sin pago real). El ícono flotante de carrito pasa a enlazar acá.
- [x] Página de detalle de producto (nueva, plantilla reutilizable): los product-cards de `index.html` y `catalogo.html` se vuelven clickeables hacia ahí.
- [x] Filtros de categoría funcionales en `catalogo.html` (Blusas/Vestidos/Pantalones filtran el grid con TypeScript, sin backend).
- [x] Buscador funcional (client-side, sobre el set de productos ya cargado en la página).

## Fase 3 — Cuenta de clienta

- [x] `registro.html` (nueva): crear cuenta, mismo patrón de validación en tiempo real que `login-form.ts`/`contact-form.ts`.
- [x] Link "¿Olvidaste tu contraseña?" en `iniciar-sesion.html`.
- [x] `mi-cuenta.html` (nueva, mockup estático): pedidos pasados, datos personales, lista de favoritos guardados — destino real del login.

## Fase 4 — Legales y pulido

- [x] `terminos.html` (nueva, contenido básico).
- [x] Página 404 simple.
- [x] Footer: agregar contacto de empresa (redes sociales pendientes — no hay cuentas reales todavía).
- [x] Actualizar `sitemap.xml` y `robots.txt` con las páginas nuevas (`robots.txt` no necesitó cambios: ya permite todo sin reglas por página; `sitemap.xml` sumó `terminos.html` y `registro.html` — las únicas páginas nuevas indexables, el resto lleva `noindex`).
- [x] Meta tags (title, description, Open Graph, Twitter Card) para cada página nueva, siguiendo el patrón ya usado.

## Se mantiene sin cambios

Sistema de diseño (design tokens en `css/styles.css`), tema claro/oscuro, nav drawer + hamburguesa, validación de formularios existente (contacto/login), estructura mobile-first, imágenes ya integradas (hero, favoritos/producto), la página `privacidad.html` como archivo (se reescribe su contenido, no su existencia).
