"use strict";
(function () {
    const root = document.getElementById("product-detail");
    if (!root)
        return;
    const params = new URLSearchParams(window.location.search);
    const id = params.get("id");
    const product = id ? findPurpleBloomProduct(id) : undefined;
    function formatPrice(value) {
        return `${value.toFixed(2).replace(".", ",")} €`;
    }
    function mediaHtml(p) {
        if (p.imageSrc) {
            return `<img class="product-detail__image" src="${p.imageSrc}" alt="${p.imageAlt ?? p.name}" width="800" height="800">`;
        }
        const variantClass = p.swatch ? ` product-card__image--${p.swatch}` : "";
        return `<div class="product-detail__image product-card__image${variantClass}" aria-hidden="true"></div>`;
    }
    if (!product) {
        root.innerHTML = `
      <div class="container product-detail__not-found">
        <h1>Producto no encontrado</h1>
        <p>El producto que buscás ya no está disponible o el enlace es incorrecto.</p>
        <a href="catalogo.html" class="btn btn--primary">Ver catálogo</a>
      </div>
    `;
        return;
    }
    document.title = `${product.name} | Purple Bloom`;
    root.innerHTML = `
    <div class="container product-detail__layout">
      <div class="product-detail__media">
        ${isOnOffer(product) ? '<span class="product-card__badge">Oferta</span>' : ""}
        <button type="button" class="product-card__favorite" data-action="add-to-favorite" aria-label="Añadir ${product.name} a favoritos">
          <svg aria-hidden="true" width="16" height="16" viewBox="0 0 24 24" fill="none">
            <path d="M12 21s-7.5-4.6-10-9.1C0.5 8.4 2 5 5.5 5c2 0 3.5 1.2 4.5 2.7C11 6.2 12.5 5 14.5 5 18 5 19.5 8.4 18 11.9 15.5 16.4 12 21 12 21z" stroke="currentColor" stroke-width="2" stroke-linejoin="round"/>
          </svg>
        </button>
        ${mediaHtml(product)}
      </div>
      <div class="product-detail__info">
        <p class="product-detail__category">${product.category}</p>
        <h1 id="product-detail-heading">${product.name}</h1>
        <p class="product-detail__price">${formatPrice(product.price)}</p>
        <p class="product-detail__desc">${product.description}</p>
        <button type="button" class="btn btn--primary" data-action="add-to-cart" data-product-id="${product.id}" aria-label="Añadir ${product.name} al carrito">Añadir al carrito</button>
        <a href="catalogo.html" class="product-detail__back">&larr; Volver al catálogo</a>
      </div>
    </div>
  `;
    root.setAttribute("aria-labelledby", "product-detail-heading");
    const addButton = root.querySelector('[data-action="add-to-cart"]');
    addButton?.addEventListener("click", () => {
        const productId = addButton.getAttribute("data-product-id");
        if (!productId)
            return;
        const event = new CustomEvent("purplebloom:add-to-cart", { detail: { id: productId } });
        document.dispatchEvent(event);
    });
    const favoriteButton = root.querySelector('[data-action="add-to-favorite"]');
    favoriteButton?.addEventListener("click", () => {
        document.dispatchEvent(new CustomEvent("purplebloom:add-to-favorite"));
    });
})();
