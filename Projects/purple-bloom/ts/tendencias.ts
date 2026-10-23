(function (): void {
  // Flechas de la tira "Inspiración de estilo" en tendencias.html: el
  // desplazamiento real lo hace scroll-snap nativo (ver .trends-inspo__track
  // en tendencias.css); las flechas solo llaman scrollBy, sin loop infinito
  // ni clones — a diferencia del carrusel de favoritos, no hace falta
  // autoplay aquí, así que no vale la pena reutilizar esa lógica más compleja.
  const track = document.getElementById("trends-inspo-track");
  if (!track) return;

  const prevBtn = document.querySelector<HTMLButtonElement>('[data-action="inspo-prev"]');
  const nextBtn = document.querySelector<HTMLButtonElement>('[data-action="inspo-next"]');

  function step(): number {
    const item = track!.querySelector("li");
    if (!item) return track!.clientWidth;
    const gap = parseFloat(getComputedStyle(track!).columnGap || "0");
    return item.getBoundingClientRect().width + gap;
  }

  prevBtn?.addEventListener("click", () => {
    track.scrollBy({ left: -step(), behavior: "smooth" });
  });

  nextBtn?.addEventListener("click", () => {
    track.scrollBy({ left: step(), behavior: "smooth" });
  });
})();
