Comando que revisa los metadatos y la semántica HTML relevante para SEO de una página, sin modificar contenido visual ni copy:

Revisa la página que te indique el usuario y reporta (o corrige,
si el usuario lo pide explícitamente) los problemas de SEO que
encuentres.

Reglas:
- Revisa el `<title>`: debe ser único por página, describir el
  contenido real y tener una longitud razonable (~50-60 caracteres)
- Revisa `<meta name="description">`: debe existir, ser específica
  de la página (no genérica ni copiada de otra) y tener entre
  ~120-160 caracteres
- Revisa las etiquetas Open Graph (`og:title`, `og:description`,
  `og:image`, `og:url`, `og:type`) y Twitter Card
  (`twitter:card`, `twitter:title`, `twitter:description`,
  `twitter:image`): deben estar presentes y coherentes con el
  `<title>`/`<meta description>` de esa misma página
- Revisa el `<link rel="canonical">`: debe apuntar a la URL real
  de esa página. Si el dominio es un placeholder (ver `PLAN.md` /
  `CLAUDE.md`), señálalo pero cámbialo de forma consistente en las
  4 páginas HTML, nunca solo en una
- Si hay JSON-LD (`<script type="application/ld+json">`), valida
  que el JSON sea válido y que los campos reflejen el contenido
  real de la página
- Revisa jerarquía semántica: un único `<h1>` por página, y que los
  encabezados seguientes no salten niveles (h2 antes que h3, etc.)
- Revisa que se usen etiquetas HTML5 semánticas (`header`, `nav`,
  `main`, `footer`, `section`, `article`) en vez de `div` genéricos
  donde corresponda
- Revisa que las imágenes relevantes para el contenido tengan
  `alt` descriptivo (no vacío ni redundante tipo "imagen")
- Revisa que `<html lang="...">` esté declarado y sea correcto
  para el idioma del contenido
- No toques el texto visible ni el diseño: los cambios se limitan
  a `<head>`, atributos (`alt`, `lang`, `rel`) y estructura de
  encabezados/etiquetas semánticas
- Si el mismo problema aparece en las 4 páginas (ej. dominio
  placeholder, orden de tags), corrígelo de forma consistente en
  todas, no solo en la que se mencionó
