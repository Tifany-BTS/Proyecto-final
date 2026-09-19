"use strict";
(function () {
    const root = document.getElementById("product-detail");
    if (!root)
        return;
    const params = new URLSearchParams(window.location.search);
    const id = params.get("id");
    const product = id ? findPurpleBloomProduct(id) : undefined;
    const SIZES = ["S", "M", "L", "XL"];
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
    function priceRowHtml(p) {
        const original = originalPriceIfOnOffer(p);
        if (original === undefined) {
            return `<p class="product-detail__price">${formatPrice(p.price)}</p>`;
        }
        return `
      <p class="product-detail__price">${formatPrice(p.price)}</p>
      <span class="product-detail__discount">-${OFFER_DISCOUNT_PERCENT}%</span>
      <span class="product-detail__original-price">${formatPrice(original)}</span>
    `;
    }
    function relatedMediaHtml(p) {
        if (p.imageSrc) {
            return `<img class="product-related__image" src="${p.imageSrc}" alt="" width="400" height="533" loading="lazy">`;
        }
        const variantClass = p.swatch ? ` product-card__image--${p.swatch}` : "";
        return `<div class="product-related__image product-card__image${variantClass}" aria-hidden="true"></div>`;
    }
    function relatedProducts(p, limit) {
        const others = PURPLE_BLOOM_PRODUCTS.filter((candidate) => candidate.id !== p.id);
        const sameCategory = others.filter((candidate) => candidate.category === p.category);
        const rest = others.filter((candidate) => candidate.category !== p.category);
        return [...sameCategory, ...rest].slice(0, limit);
    }
    function relatedHtml(p) {
        const related = relatedProducts(p, 4);
        if (related.length === 0)
            return "";
        return `
      <div class="container product-related" aria-labelledby="related-heading">
        <div class="product-related__header">
          <h2 id="related-heading">También te puede gustar</h2>
        </div>
        <div class="product-related__wrapper">
          <button type="button" class="product-related__arrow product-related__arrow--prev" data-action="related-prev" aria-label="Ver productos anteriores">&lsaquo;</button>
          <ul class="product-related__list" role="list">
            ${related
            .map((item) => `
                  <li class="product-related__item" role="listitem">
                    <a class="product-related__link" href="producto.html?id=${item.id}">
                      <div class="product-related__media">
                        ${isOnOffer(item) ? '<span class="product-related__badge">Oferta</span>' : ""}
                        ${relatedMediaHtml(item)}
                      </div>
                      <span class="product-related__name">${item.name}</span>
                      <span class="product-related__price">${formatPrice(item.price)}</span>
                    </a>
                  </li>
                `)
            .join("")}
          </ul>
          <button type="button" class="product-related__arrow product-related__arrow--next" data-action="related-next" aria-label="Ver más productos">&rsaquo;</button>
        </div>
      </div>
    `;
    }
    function shareHtml(p) {
        const pageUrl = encodeURIComponent(window.location.href);
        const text = encodeURIComponent(p.name);
        const imageUrl = p.imageSrc ? encodeURIComponent(new URL(p.imageSrc, window.location.href).href) : "";
        return `
      <div class="product-detail__share">
        <span class="product-detail__share-label">Compartir</span>
        <a class="product-detail__share-link" href="https://www.facebook.com/sharer/sharer.php?u=${pageUrl}" target="_blank" rel="noopener noreferrer" aria-label="Compartir en Facebook">
          <svg aria-hidden="true" width="16" height="16" viewBox="0 0 24 24" fill="none">
            <path d="M14 8.5h2.5V5h-2.5c-2.2 0-4 1.8-4 4v2H8v3.5h2.5V21H14v-6.5h2.5l.5-3.5h-3V9c0-.3.2-.5.5-.5z" fill="currentColor"/>
          </svg>
        </a>
        <a class="product-detail__share-link" href="https://twitter.com/intent/tweet?url=${pageUrl}&text=${text}" target="_blank" rel="noopener noreferrer" aria-label="Compartir en X">
          <svg aria-hidden="true" width="14" height="14" viewBox="0 0 24 24" fill="none">
            <path d="M18.9 2H22l-7.6 8.7L23.3 22h-7l-5.5-7.2L4.5 22H1.4l8.1-9.3L1 2h7.2l5 6.6L18.9 2zm-1.2 18h1.7L7.4 4H5.6l12.1 16z" fill="currentColor"/>
          </svg>
        </a>
        <a class="product-detail__share-link" href="https://pinterest.com/pin/create/button/?url=${pageUrl}&media=${imageUrl}&description=${text}" target="_blank" rel="noopener noreferrer" aria-label="Compartir en Pinterest">
          <svg aria-hidden="true" width="16" height="16" viewBox="0 0 24 24" fill="none">
            <path d="M12 2C6.5 2 3 5.9 3 10.2c0 2.6 1.4 4.6 3.5 5.4.3.1.6 0 .7-.4l.3-1.1c.1-.3 0-.5-.2-.7-.6-.7-1-1.6-1-2.8 0-3.6 2.7-6.8 7-6.8 3.8 0 5.9 2.3 5.9 5.4 0 4.1-1.8 7.5-4.5 7.5-1.5 0-2.6-1.2-2.2-2.7.4-1.8 1.2-3.7 1.2-5 0-1.1-.6-2.1-1.9-2.1-1.5 0-2.7 1.6-2.7 3.7 0 1.4.5 2.3.5 2.3l-1.9 8.2c-.5 2.3-.1 5.1 0 5.4 0 .2.3.2.4.1.2-.2 2.2-2.7 2.9-5.2l1.1-4.3c.5 1 2.1 1.9 3.7 1.9 4.9 0 8.2-4.5 8.2-10.4C22 5.6 18.2 2 12 2z" fill="currentColor"/>
          </svg>
        </a>
      </div>
    `;
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
        ${mediaHtml(product)}
      </div>
      <div class="product-detail__info">
        <p class="product-detail__category">${product.category}</p>
        <h1 id="product-detail-heading">${product.name}</h1>
        ${shareHtml(product)}
        <div class="product-detail__price-row">${priceRowHtml(product)}</div>
        <p class="product-detail__desc">${product.description}</p>
        <hr class="product-detail__divider">
        <div class="product-detail__options">
          <span class="product-detail__options-label">Talle</span>
          <div class="product-detail__size-list" role="group" aria-label="Elegir talle">
            ${SIZES.map((size, index) => `<button type="button" class="product-detail__size" aria-pressed="${index === 0}">${size}</button>`).join("")}
          </div>
        </div>
        <div class="product-detail__actions">
          <div class="product-detail__qty" role="group" aria-label="Cantidad">
            <button type="button" class="product-detail__qty-btn" data-action="decrease" aria-label="Restar unidad">&minus;</button>
            <span class="product-detail__qty-value" data-qty-value>1</span>
            <button type="button" class="product-detail__qty-btn" data-action="increase" aria-label="Sumar unidad">+</button>
          </div>
          <button type="button" class="btn btn--primary" data-action="add-to-cart" data-product-id="${product.id}" aria-label="Añadir ${product.name} al carrito">
            <svg aria-hidden="true" width="18" height="18" viewBox="0 0 24 24" fill="none">
              <path d="M6 6h15l-1.5 9h-12L6 6z" stroke="currentColor" stroke-width="2" stroke-linejoin="round"/>
              <circle cx="9" cy="20" r="1.5" fill="currentColor"/>
              <circle cx="18" cy="20" r="1.5" fill="currentColor"/>
            </svg>
            Añadir al carrito
          </button>
        </div>
        <button type="button" class="product-detail__wishlist" data-action="add-to-favorite" aria-label="Añadir ${product.name} a favoritos">
          <svg aria-hidden="true" width="16" height="16" viewBox="0 0 24 24" fill="none">
            <path d="M12 21s-7.5-4.6-10-9.1C0.5 8.4 2 5 5.5 5c2 0 3.5 1.2 4.5 2.7C11 6.2 12.5 5 14.5 5 18 5 19.5 8.4 18 11.9 15.5 16.4 12 21 12 21z" stroke="currentColor" stroke-width="2" stroke-linejoin="round"/>
          </svg>
          Añadir a favoritos
        </button>
        <a href="catalogo.html" class="product-detail__back">&larr; Volver al catálogo</a>
      </div>
    </div>
    ${relatedHtml(product)}
  `;
    root.setAttribute("aria-labelledby", "product-detail-heading");
    const sizeButtons = root.querySelectorAll(".product-detail__size");
    sizeButtons.forEach((button) => {
        button.addEventListener("click", () => {
            sizeButtons.forEach((other) => other.setAttribute("aria-pressed", String(other === button)));
        });
    });
    let quantity = 1;
    const qtyValue = root.querySelector("[data-qty-value]");
    root.querySelector('[data-action="decrease"]')?.addEventListener("click", () => {
        if (quantity <= 1 || !qtyValue)
            return;
        quantity -= 1;
        qtyValue.textContent = String(quantity);
    });
    root.querySelector('[data-action="increase"]')?.addEventListener("click", () => {
        if (!qtyValue)
            return;
        quantity += 1;
        qtyValue.textContent = String(quantity);
    });
    const addButton = root.querySelector('[data-action="add-to-cart"]');
    addButton?.addEventListener("click", () => {
        const productId = addButton.getAttribute("data-product-id");
        if (!productId)
            return;
        for (let i = 0; i < quantity; i++) {
            document.dispatchEvent(new CustomEvent("purplebloom:add-to-cart", { detail: { id: productId } }));
        }
    });
    const favoriteButton = root.querySelector('[data-action="add-to-favorite"]');
    favoriteButton?.addEventListener("click", () => {
        document.dispatchEvent(new CustomEvent("purplebloom:add-to-favorite", { detail: { id: product.id } }));
    });
    const relatedList = root.querySelector(".product-related__list");
    function scrollRelated(direction) {
        if (!relatedList)
            return;
        const item = relatedList.querySelector(".product-related__item");
        const gap = 16;
        const amount = item ? item.offsetWidth + gap : 200;
        relatedList.scrollBy({ left: direction * amount, behavior: "smooth" });
    }
    root.querySelector('[data-action="related-prev"]')?.addEventListener("click", () => scrollRelated(-1));
    root.querySelector('[data-action="related-next"]')?.addEventListener("click", () => scrollRelated(1));
})();
