"use strict";
(function () {
    const grid = document.querySelector(".catalog__grid");
    const empty = document.querySelector(".catalog__empty");
    if (!grid)
        return;
    const offers = PURPLE_BLOOM_PRODUCTS.filter(isOnOffer);
    function formatPrice(value) {
        return `${value.toFixed(2).replace(".", ",")} €`;
    }
    function mediaHtml(product) {
        if (product.imageSrc) {
            return `<img class="product-card__image" src="${product.imageSrc}" alt="${product.imageAlt ?? product.name}" width="800" height="533" loading="lazy">`;
        }
        const variantClass = product.swatch ? ` product-card__image--${product.swatch}` : "";
        return `<div class="product-card__image${variantClass}" aria-hidden="true"></div>`;
    }
    if (offers.length === 0) {
        grid.innerHTML = "";
        if (empty) {
            empty.hidden = false;
            empty.textContent = "No hay ofertas disponibles en este momento.";
        }
        return;
    }
    grid.innerHTML = offers
        .map((product, index) => {
        const headingId = `offer-${index + 1}-name`;
        return `
        <article class="product-card product-card--compact" role="listitem" aria-labelledby="${headingId}" data-category="${product.category}">
          <span class="product-card__badge">Oferta</span>
          <button type="button" class="product-card__favorite" data-action="add-to-favorite" aria-label="Añadir ${product.name} a favoritos">
            <svg aria-hidden="true" width="16" height="16" viewBox="0 0 24 24" fill="none">
              <path d="M12 21s-7.5-4.6-10-9.1C0.5 8.4 2 5 5.5 5c2 0 3.5 1.2 4.5 2.7C11 6.2 12.5 5 14.5 5 18 5 19.5 8.4 18 11.9 15.5 16.4 12 21 12 21z" stroke="currentColor" stroke-width="2" stroke-linejoin="round"/>
            </svg>
          </button>
          ${mediaHtml(product)}
          <h2 id="${headingId}"><a href="producto.html?id=${product.id}">${product.name}</a></h2>
          <p class="product-card__price">${formatPrice(product.price)}</p>
          <button type="button" class="btn btn--small" data-action="add-to-cart" data-product-id="${product.id}" aria-label="Añadir ${product.name} al carrito">Añadir al carrito</button>
        </article>
      `;
    })
        .join("");
})();
