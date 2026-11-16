Comando que revisa y mejora el feedback visual del formulario usando los estados nativos de CSS (:valid, :invalid, :focus), sin depender solo de los mensajes por defecto del navegador:


Revisa el formulario de la página que te indique el usuario y
agrega (o corrige) el feedback visual para cada campo.

Reglas:
- Usa los estados :valid, :invalid y :focus de CSS para cambiar
  borde y fondo del input, no JavaScript para esto
- Usa :not(:placeholder-shown) junto con :invalid para que el
  campo no se marque en rojo antes de que el usuario escriba algo
- El color nunca es la única pista: agrega también un ícono o un
  mensaje de texto (por accesibilidad)
- El mensaje de error va en un elemento propio (ej. <span
  class="error-msg">), nunca dejes el mensaje nativo del navegador
  como única señal
- Los estilos van en @css/ como reglas nuevas, nunca inline
- Respeta las variables CSS ya definidas (colores, breakpoints)
- Mobile-first: escribe primero el estilo base, luego los @media
  para pantallas más grandes