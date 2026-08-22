Comando que revisa el diseño adaptativo y responsive de una página, asegurando el enfoque mobile-first y la ausencia de desbordamientos o elementos rotos:

Revisa la página que te indique el usuario y reporta (o corrige, si el usuario lo pide explícitamente) los problemas de diseño responsive que encuentres.

Reglas:
- Verifica que el enfoque de los estilos sea Mobile-First (los estilos base deben estar diseñados para pantallas pequeñas y usar `@media (min-width: ...)` para pantallas más grandes).
- Revisa los breakpoints principales para asegurar que el contenido se adapte de forma fluida y sin saltos visuales extraños.
- Comprueba que no exista scroll horizontal no deseado (overflow-x) en ninguna resolución, especialmente en pantallas móviles.
- Asegúrate de que las imágenes, videos y elementos multimedia sean flexibles y no sobrepasen el contenedor padre (ej. `max-width: 100%`).
- Verifica que los textos, botones y elementos interactivos mantengan un tamaño táctil adecuado en dispositivos móviles y que no se solapen.
- Revisa que la etiqueta `<meta name="viewport" content="width=device-width, initial-scale=1.0">` esté configurada correctamente en el `<head>`.
- Si encuentras un elemento roto o con overflow en algún breakpoint, señálalo indicando la resolución específica donde ocurre el problema.
- No alteres la estructura semántica ni el contenido de texto si la instrucción solo solicita corregir los estilos de adaptabilidad.