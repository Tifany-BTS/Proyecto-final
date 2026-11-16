(function (): void {
  // Favoritos reales, no una simulación: con sesión iniciada, el corazón
  // agrega o quita el producto de verdad (localStorage, vía pbFavoritesToggle
  // en session.ts) y se refleja al instante en cualquier botón de esa misma
  // prenda que haya en la página, sin recargar. Sin sesión, se mantiene el
  // aviso para iniciar sesión primero — eso sí sigue siendo una restricción
  // real, no un placeholder.
  const GUEST_MESSAGE = "Iniciá sesión para guardar productos en tus favoritos.";
  const HIDE_DELAY_MS = 4000;

  let hideTimer: number | undefined;

  function hideToast(toast: HTMLElement): void {
    toast.classList.add("toast--hiding");
    toast.addEventListener(
      "transitionend",
      () => {
        if (toast.classList.contains("toast--hiding")) toast.hidden = true;
      },
      { once: true }
    );
  }

  function showToast(message: string): void {
    const toast = document.getElementById("toast");
    if (!toast) return;

    if (hideTimer) window.clearTimeout(hideTimer);

    toast.textContent = message;
    toast.classList.remove("toast--hiding");
    toast.hidden = false;

    hideTimer = window.setTimeout(() => hideToast(toast), HIDE_DELAY_MS);
  }

  // El botón propio lleva data-product-id (el de la ficha de producto y los
  // de "Te recomendamos") o, si no, se busca en el <article> que lo contiene
  // — el mismo <article> donde vive el botón "Añadir al carrito", que ya
  // trae data-product-id en cada tarjeta del catálogo/inicio/ofertas.
  function productIdNear(button: HTMLElement): string | null {
    return button.dataset.productId ?? button.closest("article")?.querySelector<HTMLElement>("[data-product-id]")?.getAttribute("data-product-id") ?? null;
  }

  // Calcula las dos variantes del aria-label ("Añadir X a favoritos" /
  // "Quitar X de favoritos") una sola vez por botón y las cachea en el
  // dataset, para no ir acumulando reemplazos de texto en cada toggle.
  function ensureLabels(button: HTMLElement): { add: string; remove: string } {
    if (!button.dataset.favoriteLabelAdd) {
      const current = button.getAttribute("aria-label") ?? "Añadir a favoritos";
      const add = /^Añadir /.test(current) ? current : `Añadir ${current}`;
      const remove = add.replace(/^Añadir /, "Quitar ").replace(/ a favoritos$/, " de favoritos");
      button.dataset.favoriteLabelAdd = add;
      button.dataset.favoriteLabelRemove = remove;
    }
    return { add: button.dataset.favoriteLabelAdd as string, remove: button.dataset.favoriteLabelRemove as string };
  }

  function syncButton(button: HTMLElement, productId: string): void {
    const active = pbFavoritesHas(productId);
    button.classList.toggle("product-card__favorite--active", active);
    button.classList.toggle("product-detail__wishlist--active", active);
    button.setAttribute("aria-pressed", String(active));

    const labels = ensureLabels(button);
    button.setAttribute("aria-label", active ? labels.remove : labels.add);

    // Solo el botón grande de la ficha de producto lleva texto visible
    // (envuelto en este span); los corazones de las tarjetas no tienen.
    const labelEl = button.querySelector<HTMLElement>("[data-favorite-label]");
    if (labelEl) labelEl.textContent = active ? "Quitar de favoritos" : "Agregar a favoritos";
  }

  function syncAllButtons(): void {
    document.querySelectorAll<HTMLElement>('[data-action="add-to-favorite"]').forEach((button) => {
      const id = productIdNear(button);
      if (id) syncButton(button, id);
    });
  }

  // Delegado en document (no querySelectorAll+forEach al cargar el script):
  // así funciona igual con los corazones que ya están en el HTML y con los
  // que arman offers.ts/product-detail.ts más tarde, sin depender del orden
  // en que se ejecuta cada script.
  document.addEventListener("click", (event) => {
    const button = (event.target as HTMLElement).closest<HTMLElement>('[data-action="add-to-favorite"]');
    if (!button) return;

    const id = productIdNear(button);
    if (!id) return;

    if (!pbSessionGet()) {
      showToast(GUEST_MESSAGE);
      pbTrack("Favorito bloqueado por sesión", { productId: id });
      return;
    }

    const active = pbFavoritesToggle(id);
    syncButton(button, id);
    pbTrack(active ? "Producto agregado a favoritos" : "Producto quitado de favoritos", { productId: id });
    if (active) pbPetalBurst(button);
  });

  syncAllButtons();

  // Disparado por pbFavoritesToggle en cualquier parte de la página (incluida
  // la propia grilla de "Mis favoritos" en mi-cuenta.html): vuelve a pintar
  // todos los corazones con el estado real más reciente.
  document.addEventListener("purplebloom:favorites-changed", syncAllButtons);

  // Favoritos marcados en otra pestaña (por ejemplo, la misma cuenta abierta
  // en dos ventanas) actualizan esta pestaña sin recargar.
  window.addEventListener("storage", (event) => {
    if (event.key === null || event.key.startsWith("pb-favorites:")) syncAllButtons();
  });
})();
