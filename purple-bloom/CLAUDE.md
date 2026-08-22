# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
npm install       # installs the only dependency: typescript
npm run build     # compiles ts/*.ts -> js/*.js (runs `tsc`)
```

There is no dev server script and no test runner (`npm test` is a stub that just exits with an error — there are no tests in this repo). To preview the site locally, serve the project root with any static file server, e.g.:

```bash
python -m http.server 8000
```

There is no lint command configured.

## Architecture

This is a **static, framework-free, multi-page site** — plain HTML/CSS + a small amount of TypeScript, no backend, no bundler, no client-side routing.

### Pages are independent, not templated

`index.html`, `catalogo.html`, and `iniciar-sesion.html` each contain their own full copy of the `<head>` meta tags, the sticky header (logo, hamburger nav, theme toggle, search), and the footer. There is no includes/partials mechanism, so **any change to shared chrome (nav links, header markup, footer) must be manually repeated across all three files**. Keep the three copies in sync when editing one.

### CSS: one stylesheet, fully token-driven, mobile-first

Everything lives in `css/styles.css`. All colors, spacing, and typography are CSS custom properties defined in `:root` — there should be no raw hex colors, px/rem spacing, or font-size/weight values in rules outside of the token block. When adding styles, add or reuse a token rather than hardcoding a value.

- **Dark mode**: tokens are redefined twice — once under `@media (prefers-color-scheme: dark)` (guarded by `:root:not([data-theme="light"])`) and once under `:root[data-theme="dark"]` (explicit user override via the theme toggle, wins over system preference). A few tokens (`--color-primary-dark`, `--hero-overlay`, the footer link color, `--color-on-primary`) are intentionally **fixed across themes** — see the comment block at the top of the file for which ones and why (they sit on permanently-dark brand panels like the hero/footer that never invert).
- **Mobile-first**: every `@media` query in the file is `min-width` (640/768/1024px breakpoints). Base (unqualified) rules are the mobile layout; breakpoints only add complexity going up. Don't introduce `max-width` queries.
- Layout is Flexbox/Grid throughout — Grid for card/sidebar layouts, Flexbox for one-dimensional alignment (header, forms, buttons).

### TypeScript: compiled to plain scripts, not ES modules

Source in `/ts`, compiled by `tsc` (see `tsconfig.json`) to `/js`, loaded via `<script src="js/*.js" defer>` tags — **not** `type="module"`. Because of this, each `ts/*.ts` file wraps its top-level code in an IIFE (`(function () { ... })();`); without it, multiple compiled scripts sharing the same global scope collide on variable names. Follow this pattern for any new script.

`/js` is generated output — never hand-edit it, edit the matching file in `/ts` and run `npm run build`.

Current scripts:
- `nav.ts` — hamburger drawer open/close (off-canvas on mobile, inline nav from 768px), closes on Escape/backdrop/outside click/link click.
- `theme.ts` — light/dark toggle, persisted to `localStorage`, respects system preference when no explicit choice is stored. Each page also has an inline (non-deferred) script in `<head>` that reads `localStorage` and sets `data-theme` before first paint, to avoid a flash of the wrong theme.
- `contact-form.ts` / `login-form.ts` — client-side validation for the contact form (index.html footer) and login form (iniciar-sesion.html). Both follow the same pattern: validate on blur, then live-revalidate on input once a field has been touched; on submit, validate all fields, focus the first invalid one, and show a summary in a `.form-feedback` live region. There is no backend — "success" is a simulated message only.

### Hero carousel is pure CSS

The homepage hero (`index.html`) is a radio-input carousel (`:checked ~` sibling selectors drive slide transforms, dot/arrow state) with no JS involved. Keyboard accessibility is handled by hiding the radios with the `.visually-hidden`-style clip technique (not `opacity:0`, which would also hide the focus ring) and forwarding `:focus-visible` from each radio to its corresponding dot via sibling selectors. Each slide's full-bleed photo background is applied with `.hero__carousel:has(#hero-slide-N:checked)`, layered under the shared `--hero-overlay` gradient token.

### Images

`/img` holds pre-optimized JPEGs only (product photos, hero backgrounds). Source images have been AI-generated externally and resized/compressed before being added — there's no build step for images, so any new image must already be web-sized before being committed.

### Product/planning docs

`PLAN.md` is a product-level (not code-level) roadmap: current positioning decisions and a phased plan for pages/sections still to be built. Check it before starting new feature work — it reflects intent that isn't yet in the code.
