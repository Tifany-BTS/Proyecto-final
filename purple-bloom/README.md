# Purple Bloom

Sitio estático (HTML + CSS + TypeScript) para Purple Bloom, una tienda de ropa. Ver [PLAN.md](PLAN.md) para el roadmap de producto.

## Sistema de componentes del backoffice (`playground.html`)

`playground.html` es un catálogo visual de componentes de interfaz —alerts, botones, checkboxes/radios, dialogs, menús y toasts— pensado para el futuro **panel de administración (backoffice)** del proyecto integrador, separado del sitio público que ve la clienta. Se puede abrir localmente en `/playground.html` sirviendo el proyecto con cualquier servidor estático.

### Por qué se estilizaron estos componentes

Los componentes empezaron como "cascarones" CSS (selectores sin reglas), por lo que se renderizaban con los **estilos por defecto del navegador** (botones grises nativos, `<dialog>` sin tipografía ni sombra propias, etc.). Se decidió estilizarlos por tres razones:

1. **Consistencia de marca** — un control nativo del navegador no comunica la identidad visual de Purple Bloom (morado, tipografía, radios de borde), y cualquier pantalla de administración construida sobre esos componentes se vería inconsistente con el resto del sitio.
2. **Affordance real** — un elemento interactivo debe comunicar visualmente que lo es y en qué estado está. Sin estilos explícitos de `hover` / `pressed` / `disabled`, quien use el backoffice no tiene retroalimentación de si un clic va a funcionar, si ya lo presionó, o si esa acción está bloqueada — crítico en un panel donde se ejecutan acciones sensibles (eliminar un producto, publicar cambios).
3. **Accesibilidad** — los estados añadidos (`:focus-visible` con contorno visible, `disabled` con `opacity` y `cursor: not-allowed`) siguen el mismo patrón ya validado en `css/styles.css` para el sitio público, en vez de introducir un sistema nuevo.

Todos los estilos se construyeron sobre los **tokens de `css/variable.css`** (`--color-primary`, `--space-*`, `--radius`, `--shadow`, etc.) en lugar de valores sueltos, de modo que un cambio futuro en la paleta de marca se propaga automáticamente sin editar cada componente.

### Estados validados por variante de botón

| Variante | Idle | Hover | Pressed | Disabled |
|---|---|---|---|---|
| Primary | `--color-primary` | `--color-primary-dark` | mezcla más oscura + `translateY(1px)` | `opacity: .5; cursor: not-allowed` |
| Secondary | `--color-surface` | `--color-accent` | `--color-border` + `translateY(1px)` | ídem |
| Destructive | `--semantic-error` | mezcla 85% negro | mezcla 70% negro + `translateY(1px)` | ídem |
| Icon | `--color-surface` | `--color-accent` | `--color-border` + `translateY(1px)` | ídem |

### Cómo se complementa con el backoffice del proyecto integrador

`playground.html` no es una página que vea la clienta: es el catálogo de componentes reutilizables para las pantallas administrativas todavía por construir (gestión de catálogo, pedidos, etc.). La idea es que, al implementar esas pantallas, no se rediseñe cada botón o alerta desde cero — se reutilizan las mismas clases (`c-btn--primary`, `c-btn--destructive`, `c-alert--success`, `c-dialog`, `c-menu-account`, `c-toast`, etc.), que ya están:

- Probadas visualmente en sus estados (idle / hover / pressed / disabled).
- Documentadas junto al componente, con el comportamiento de teclado y foco explicado al lado (relevante para un panel donde se navega mucho con teclado).
- Alineadas con los patrones típicos de un backoffice: confirmar una acción destructiva (`c-dialog` + botón `--destructive`), avisar éxito/error de una operación (`c-alert` / `c-toast`), filtrar una tabla (`c-check-group` / `c-radio-group`) y navegar el menú de cuenta (`c-menu-account`).

En otras palabras: este trabajo no es decorativo, es la base de diseño para que la implementación de las pantallas reales del backoffice sea ensamblar componentes ya validados en vez de diseñar y probar affordance desde cero en cada pantalla nueva.

## Comandos

```bash
npm install       # instala la única dependencia: typescript
npm run build     # compila ts/*.ts -> js/*.js (ejecuta tsc)
```

No hay dev server ni test runner configurados. Para previsualizar el sitio localmente, sirve la raíz del proyecto con cualquier servidor estático, por ejemplo:

```bash
python -m http.server 8000
```
