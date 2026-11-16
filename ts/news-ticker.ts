(function (): void {
  // Botón pausa/reanuda del ticker de titulares (noticias.html). Mismo
  // patrón que .theme-toggle: aria-pressed refleja si está corriendo, el
  // aria-label describe la próxima acción, y los íconos se alternan por
  // CSS según ese mismo atributo — no hay estado propio en JS más allá del
  // que ya vive en el DOM.
  const track = document.getElementById("news-ticker-track");
  const toggle = document.getElementById("news-ticker-toggle");
  if (!track || !toggle) return;

  function applyPlaying(playing: boolean): void {
    track!.classList.toggle("news-ticker__track--paused", !playing);
    toggle!.setAttribute("aria-pressed", String(playing));
    toggle!.setAttribute("aria-label", playing ? "Pausar titulares" : "Reanudar titulares");
  }

  toggle.addEventListener("click", () => {
    applyPlaying(toggle.getAttribute("aria-pressed") === "false");
  });

  // El botón se oculta por CSS bajo prefers-reduced-motion (nada que
  // pausar), pero si esa preferencia cambia en caliente sin recargar la
  // página, esto evita dejar la pista corriendo igual.
  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
    applyPlaying(false);
  }
})();
