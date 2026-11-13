# CU-03: Asistente de Color / Personalización

- **Actor Principal:** Usuario / Cliente
- **Objetivo:** Recibir recomendaciones cromáticas interactuando con la foto de una prenda.
- **Iniciador:** El usuario accede al módulo Asistente de Color (`/asistente-colores`).
- **Condiciones Previas:** El dispositivo cuenta con soporte para cargar archivos de imagen (JPG/PNG).

## Pasos del Recorrido Principal

1. El usuario carga una foto de su prenda en formato JPG o PNG.
2. El usuario toca un punto específico sobre la prenda en la imagen.
3. El sistema analiza el valor del píxel (RGB/Hex) y despliega la guía de combinaciones (*Combina bien*, *Con precaución*, *Evitar*).

## Alternativas y Excepciones

- **A1 (Área inválida o fuera de la prenda):** Si el clic ocurre fuera de la prenda o en fondo neutro/transparente, el sistema notifica: *"No se encuentra la blusa o prenda"* (`RN-03`).
- **A2 (Archivo inválido):** Si el archivo no es una imagen válida, emite el aviso: *"Selecciona una imagen válida (JPG/PNG)"*.

## Criterios de Aceptación

- **CA-03:** Dado que la usuaria toca un punto textil en la foto, entonces el Asistente de Color despliega la guía de combinaciones cromáticas.
- **CA-04:** Dado que el toque táctil ocurre fuera de la prenda o en área transparente, entonces el sistema muestra el mensaje *"No se encuentra la blusa o prenda"*.