(function (): void {
  // Arma "Mis favoritos" (mi-cuenta.html) a partir de los favoritos reales
  // de la cuenta (session.ts) en vez de las dos tarjetas de ejemplo que
  // había antes. Mismas funciones de armado de tarjeta que offers.ts, para
  // que una prenda favorita se vea igual acá que en el resto del sitio.
  const gridEl = document.getElementById("account-favorites-grid");
  const emptyStateEl = document.getElementById("account-favorites-empty");
  const guestStateEl = document.getElementById("account-favorites-guest");
  if (!gridEl || !emptyStateEl || !guestStateEl) return;

  // Reasignados a const con tipo explícito: dentro de las funciones
  // anidadas más abajo (definidas después de este guard), TypeScript no
  // conserva el angostamiento de una const capturada por closure.
  const grid: HTMLElement = gridEl;
  const emptyEl: HTMLElement = emptyStateEl;
  const guestEl: HTMLElement = guestStateEl;

  function formatPrice(value: number): string {
    return `$${value.toFixed(2)}`;
  }

  function mediaHtml(product: PurpleBloomProduct): string {
    if (product.imageSrc) {
      return `<img class="product-card__image" src="${product.imageSrc}" alt="${product.imageAlt ?? product.name}" width="800" height="533" loading="lazy">`;
    }
    const variantClass = product.swatch ? ` product-card__image--${product.swatch}` : "";
    return `<div class="product-card__image${variantClass}" aria-hidden="true"></div>`;
  }

  function ratingHtml(product: PurpleBloomProduct): string {
    const stars = "★".repeat(product.rating) + "☆".repeat(5 - product.rating);
    return `<p class="product-card__rating"><span aria-hidden="true">${stars}</span><span class="visually-hidden">${product.rating} de 5 estrellas</span></p>`;
  }

  function priceHtml(product: PurpleBloomProduct): string {
    const original = originalPriceIfOnOffer(product);
    if (original === undefined) {
      return `<p class="product-card__price">${formatPrice(product.price)}</p>`;
    }
    return `
      <div class="product-card__price-row">
        <p class="product-card__price">${formatPrice(product.price)}</p>
        <span class="product-card__original-price">${formatPrice(original)}</span>
        <span class="product-card__discount">-${OFFER_DISCOUNT_PERCENT}%</span>
      </div>
    `;
  }

  function cardHtml(product: PurpleBloomProduct, index: number): string {
    const headingId = `account-fav-${index + 1}-name`;
    return `
      <article class="product-card" role="listitem" aria-labelledby="${headingId}">
        ${isOnOffer(product) ? '<span class="product-card__badge">Oferta</span>' : ""}
        ${mediaHtml(product)}
        <button type="button" class="product-card__favorite product-card__favorite--active" data-action="add-to-favorite" data-product-id="${product.id}" aria-pressed="true" aria-label="Quitar ${product.name} de favoritos">
          <svg aria-hidden="true" width="16" height="16" viewBox="0 0 24 24" fill="none">
            <path d="M12 21s-7.5-4.6-10-9.1C0.5 8.4 2 5 5.5 5c2 0 3.5 1.2 4.5 2.7C11 6.2 12.5 5 14.5 5 18 5 19.5 8.4 18 11.9 15.5 16.4 12 21 12 21z" stroke="currentColor" stroke-width="2" stroke-linejoin="round"/>
          </svg>
        </button>
        <h3 id="${headingId}"><a href="producto.html?id=${product.id}">${product.name}</a></h3>
        ${ratingHtml(product)}
        ${priceHtml(product)}
        <a href="producto.html?id=${product.id}" class="btn btn--primary">Ver producto</a>
      </article>
    `;
  }

  function render(): void {
    const user = pbSessionGet();
    if (!user) {
      grid.hidden = true;
      grid.innerHTML = "";
      emptyEl.hidden = true;
      guestEl.hidden = false;
      return;
    }
    guestEl.hidden = true;

    const products = pbFavoritesGet()
      .map((id) => findPurpleBloomProduct(id))
      .filter((product): product is PurpleBloomProduct => Boolean(product));

    if (products.length === 0) {
      grid.hidden = true;
      grid.innerHTML = "";
      emptyEl.hidden = false;
      return;
    }

    emptyEl.hidden = true;
    grid.hidden = false;
    grid.innerHTML = products.map(cardHtml).join("");
  }

  render();

  // Quitar un favorito desde esta misma grilla (favorites.ts hace el toggle
  // real y dispara este evento) tiene que sacar la tarjeta al instante, no
  // recién en la próxima visita.
  document.addEventListener("purplebloom:favorites-changed", render);

  window.addEventListener("storage", (event) => {
    if (event.key === null || event.key.startsWith("pb-favorites:")) render();
  });
})();
