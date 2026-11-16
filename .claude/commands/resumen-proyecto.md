---
description: Genera un resumen en Markdown del estado del proyecto (páginas, pendientes de PLAN.md y últimas decisiones)
argument-hint: [ruta-de-salida.md opcional]
allowed-tools: Read, Glob, Grep, Bash(git log:*), Bash(git status:*)
---

Genera un resumen del estado actual del proyecto en Markdown, con exactamente
tres secciones: **páginas existentes**, **pendientes según PLAN.md** y
**últimas decisiones**. Básate SOLO en lo que exista en el repositorio: no
inventes páginas, pendientes ni decisiones. Si un dato no existe, dilo.

Si se pasó `$ARGUMENTS`, escribe el resumen en esa ruta. Si no, muéstralo en el chat.

## 1. Páginas existentes

Usa Glob para listar los `*.html` (raíz y subcarpetas si las hay). Para cada página:

- Léela y describe su propósito real en una línea, a partir del `<title>`, el
  `<h1>` y sus secciones/`<form>` principales — por lo que la página **es**, no
  por dónde aparece visualmente.
- Clasifícala en **pública** o **interna**: es interna si tiene el header con
  `#internalNav` / `.panel-section` (ej. paneles, usuarios, importar); es
  pública si usa el esqueleto público (`.section` + `.wrap` + `.section-head`).
- Si contiene un `<form>`, indícalo brevemente (ej. "registro de peleador").

No listes archivos inexistentes. No describas aquí páginas "planeadas" — esas
van en Pendientes.

## 2. Pendientes (según PLAN.md)

Lee `PLAN.md` en la raíz.

- Si **no** existe, escribe exactamente:
  `⚠️ No se encontró PLAN.md — no hay pendientes registrados.`
  y no infieras pendientes de ninguna otra fuente.
- Si existe: extrae los checklists conservando el agrupamiento por secciones que
  ya tenga el archivo. Separa lo hecho (`- [x]`) de lo pendiente (`- [ ]`).
- Lista **solo los pendientes** en esta sección y cierra con un conteo:
  `Progreso: X/Y ítems completados`.

## 3. Últimas decisiones

Usa la primera fuente que exista (no mezcles a menos que se complementen):

1. Un registro explícito de decisiones: `DECISIONS.md`, `CLAUDE.md`, o una
   sección "Decisiones" dentro de `PLAN.md`. Resume sus entradas más recientes.
2. Si no hay ninguno, ejecuta `git log --oneline -15` y deriva las decisiones:
   - Descarta commits triviales (typos, formato, "wip", merges) — no los listes.
   - Para los relevantes, redacta **la decisión tomada** (ej. "Se migró a CSS
     modular con agregador `@import`"), no copies el subject del commit tal cual.
   - Incluye la fecha o el hash corto de cada una.

Máximo ~6 decisiones. Si el historial de git es insuficiente, dilo.

## Formato de salida

    # Estado del proyecto — [nombre del repo] · [fecha de hoy]

    > [Una línea de estado real: fase/módulo actual y qué falta para cerrarlo,
    > basada en el progreso de PLAN.md y las páginas presentes. Sin inventar.]

    ## Páginas existentes
    - `index.html` (pública) — descripción breve · [form: … si aplica]

    ## Pendientes (según PLAN.md)
    - [ ] tarea pendiente
    _Progreso: X/Y ítems completados._

    ## Últimas decisiones
    - Decisión concreta — `hash` / fecha

## Reglas

- Cero invención: cada línea debe poder rastrearse a un archivo o commit real.
- Si una sección queda vacía, escríbela igual con una nota ("Sin pendientes.",
  etc.) en vez de omitirla, para que el resumen sea comparable entre corridas.
- No modifiques ningún archivo, salvo escribir la salida si se pasó una ruta.
