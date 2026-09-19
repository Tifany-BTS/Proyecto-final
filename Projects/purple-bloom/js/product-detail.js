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
        return `$${value.toFixed(2)}`;
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
            return `<img class="product-card__image" src="${p.imageSrc}" alt="${p.imageAlt ?? p.name}" width="800" height="533" loading="lazy">`;
        }
        const variantClass = p.swatch ? ` product-card__image--${p.swatch}` : "";
        return `<div class="product-card__image${variantClass}" aria-hidden="true"></div>`;
    }
    function ratingHtml(p) {
        const stars = "★".repeat(p.rating) + "☆".repeat(5 - p.rating);
        return `<p class="product-card__rating"><span aria-hidden="true">${stars}</span><span class="visually-hidden">${p.rating} de 5 estrellas</span></p>`;
    }
    function relatedPriceHtml(p) {
        const original = originalPriceIfOnOffer(p);
        if (original === undefined) {
            return `<p class="product-card__price">${formatPrice(p.price)}</p>`;
        }
        return `
      <div class="product-card__price-row">
        <p class="product-card__price">${formatPrice(p.price)}</p>
        <span class="product-card__original-price">${formatPrice(original)}</span>
        <span class="product-card__discount">-${OFFER_DISCOUNT_PERCENT}%</span>
      </div>
    `;
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
          <h2 id="related-heading">Te recomendamos</h2>
        </div>
        <div class="product-related__wrapper">
          <button type="button" class="product-related__arrow product-related__arrow--prev" data-action="related-prev" aria-label="Ver productos anteriores">&lsaquo;</button>
          <ul class="product-related__list" role="list">
            ${related
            .map((item) => `
                  <li class="product-related__item" role="listitem">
                    <article class="product-card" aria-labelledby="related-${item.id}-name">
                      ${isOnOffer(item) ? '<span class="product-card__badge">Oferta</span>' : ""}
                      ${relatedMediaHtml(item)}
                      <h3 id="related-${item.id}-name"><a href="producto.html?id=${item.id}">${item.name}</a></h3>
                      ${ratingHtml(item)}
                      ${relatedPriceHtml(item)}
                      <button type="button" class="btn btn--small" data-related-add="${item.id}" aria-label="Añadir ${item.name} al carrito">Añadir al carrito</button>
                      <button type="button" class="product-card__favorite" data-related-favorite="${item.id}" aria-label="Añadir ${item.name} a favoritos">
                        <svg aria-hidden="true" width="16" height="16" viewBox="0 0 24 24" fill="none">
                          <path d="M12 21s-7.5-4.6-10-9.1C0.5 8.4 2 5 5.5 5c2 0 3.5 1.2 4.5 2.7C11 6.2 12.5 5 14.5 5 18 5 19.5 8.4 18 11.9 15.5 16.4 12 21 12 21z" stroke="currentColor" stroke-width="2" stroke-linejoin="round"/>
                        </svg>
                      </button>
                    </article>
                  </li>
                `)
            .join("")}
          </ul>
          <button type="button" class="product-related__arrow product-related__arrow--next" data-action="related-next" aria-label="Ver más productos">&rsaquo;</button>
        </div>
      </div>
    `;
    }
    const CARE_ICONS = {
        mano: `<svg aria-hidden="true" width="28" height="28" viewBox="0 0 24 24" fill="none"><path d="M8 13V6a1.5 1.5 0 013 0v5m0-6a1.5 1.5 0 013 0v6m0-5a1.5 1.5 0 013 0v7c0 4-2.5 7-6 7s-5-2-6.5-5L4 14a1.5 1.5 0 012.3-1.8L8 14" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/></svg>`,
        maquina: `<svg aria-hidden="true" width="28" height="28" viewBox="0 0 24 24" fill="none"><rect x="4" y="3" width="16" height="18" rx="2" stroke="currentColor" stroke-width="1.5"/><circle cx="12" cy="13.5" r="4" stroke="currentColor" stroke-width="1.5"/><circle cx="8" cy="6.5" r="0.9" fill="currentColor"/><path d="M11.5 6.5H16" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/></svg>`,
    };
    const CARE_TEXT = {
        mano: {
            title: "Lavado a mano",
            desc: "No usar lavadora. Agua fría y jabón neutro; no retorcer.",
            icons: CARE_ICONS.mano,
        },
        maquina: {
            title: "Lavado en lavadora",
            desc: "Ciclo delicado con agua fría (30 °C máx.). No usar secadora.",
            icons: CARE_ICONS.maquina,
        },
        ambos: {
            title: "A mano o en lavadora",
            desc: "Puedes lavarla a mano o en lavadora con ciclo delicado y agua fría.",
            icons: CARE_ICONS.mano + CARE_ICONS.maquina,
        },
    };
    function careHtml(p) {
        const care = CARE_TEXT[p.care];
        return `
      <details class="product-detail__accordion">
        <summary>Cuidados y material</summary>
        <div class="product-detail__accordion-body">
          <ul class="product-detail__care" role="list">
            <li class="product-detail__care-item">
              <span class="product-detail__care-icons">${care.icons}</span>
              <span class="product-detail__care-text">
                <span class="product-detail__care-title">${care.title}</span>
                <span class="product-detail__care-desc">${care.desc}</span>
              </span>
            </li>
            <li class="product-detail__care-item">
              <span class="product-detail__care-icons">
                <svg aria-hidden="true" width="28" height="28" viewBox="0 0 24 24" fill="none"><rect x="4" y="4" width="16" height="16" rx="2" stroke="currentColor" stroke-width="1.5"/><path d="M4 9.5l2 2 2-2 2 2 2-2 2 2 2-2 2 2" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/></svg>
              </span>
              <span class="product-detail__care-text">
                <span class="product-detail__care-title">Material</span>
                <span class="product-detail__care-desc">${p.material}</span>
              </span>
            </li>
          </ul>
        </div>
      </details>
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
    const productIndex = PURPLE_BLOOM_PRODUCTS.findIndex((candidate) => candidate.id === product.id);
    const productCode = `PB-${String(productIndex + 1).padStart(4, "0")}`;
    function swatchHtml(p) {
        if (p.imageSrc) {
            return `<img class="product-detail__swatch-fill" src="${p.imageSrc}" alt="" width="48" height="48">`;
        }
        const variantClass = p.swatch ? ` product-detail__swatch-fill--${p.swatch}` : "";
        return `<span class="product-detail__swatch-fill${variantClass}" aria-hidden="true"></span>`;
    }
    const colorOptions = product.colors ?? [];
    function swatchesHtml(p) {
        if (colorOptions.length === 0) {
            return `<button type="button" class="product-detail__swatch" aria-pressed="true" aria-label="Color de la prenda">${swatchHtml(p)}</button>`;
        }
        return colorOptions
            .map((option, index) => `
          <button type="button" class="product-detail__swatch" data-color="${option.name}" aria-pressed="${index === 0}" aria-label="Color ${option.name}" title="${option.name}">
            <img class="product-detail__swatch-fill" src="${option.imageSrc}" alt="" width="48" height="48">
          </button>`)
            .join("");
    }
    root.innerHTML = `
    <div class="container product-detail__layout">
      <div class="product-detail__media">
        ${mediaHtml(product)}
      </div>
      <div class="product-detail__info">
        <a href="catalogo.html" class="product-detail__back">&larr; Regresar</a>
        <h1 id="product-detail-heading">${product.name}</h1>
        <p class="product-detail__code">Código: ${productCode}</p>
        <button type="button" class="product-detail__wishlist" data-action="add-to-favorite" aria-label="Añadir ${product.name} a favoritos">
          <svg aria-hidden="true" width="24" height="24" viewBox="0 0 24 24" fill="none">
            <path d="M12 21s-7.5-4.6-10-9.1C0.5 8.4 2 5 5.5 5c2 0 3.5 1.2 4.5 2.7C11 6.2 12.5 5 14.5 5 18 5 19.5 8.4 18 11.9 15.5 16.4 12 21 12 21z" stroke="currentColor" stroke-width="2" stroke-linejoin="round"/>
          </svg>
          Agregar a favoritos
        </button>
        <div class="product-detail__price-row">${priceRowHtml(product)}</div>
        <hr class="product-detail__divider">

        <div class="product-detail__field">
          <span class="product-detail__field-label">Color:</span>
          <div class="product-detail__swatches" role="group" aria-label="Colores disponibles">${swatchesHtml(product)}</div>
          ${colorOptions.length > 0 ? `<span class="product-detail__color-name" data-color-name aria-live="polite">${colorOptions[0].name}</span>` : ""}
        </div>
        <div class="product-detail__field">
          <label class="product-detail__field-label" for="product-size">Talla:</label>
          <select id="product-size" class="product-detail__select" aria-describedby="product-size-error">
            <option value="">Selecciona</option>
            ${SIZES.map((size) => `<option value="${size}">${size}</option>`).join("")}
          </select>
        </div>
        <p class="product-detail__field-error" id="product-size-error" role="alert" hidden>Elige una talla antes de agregar al carrito.</p>

        <ul class="product-detail__delivery" role="list">
          <li class="product-detail__delivery-item">
            <svg aria-hidden="true" width="28" height="28" viewBox="0 0 24 24" fill="none">
              <path d="M12 3l8 4v10l-8 4-8-4V7l8-4z" stroke="currentColor" stroke-width="1.5" stroke-linejoin="round"/>
              <path d="M4 7l8 4 8-4M12 11v10" stroke="currentColor" stroke-width="1.5" stroke-linejoin="round"/>
            </svg>
            Envío a domicilio
          </li>
          <li class="product-detail__delivery-item">
            <svg aria-hidden="true" width="28" height="28" viewBox="0 0 24 24" fill="none">
              <path d="M4 9l1.5-5h13L20 9M4 9v11h16V9M4 9c0 1.7 1.3 3 3 3s3-1.3 3-3c0 1.7 1.3 3 3 3s3-1.3 3-3c0 1.7 1.3 3 3 3" stroke="currentColor" stroke-width="1.5" stroke-linejoin="round"/>
              <path d="M10 20v-5h4v5" stroke="currentColor" stroke-width="1.5" stroke-linejoin="round"/>
            </svg>
            Retiro en tienda
          </li>
        </ul>

        <div class="product-detail__actions">
          <div class="product-detail__qty" role="group" aria-label="Cantidad">
            <button type="button" class="product-detail__qty-btn" data-action="decrease" aria-label="Restar unidad">&minus;</button>
            <span class="product-detail__qty-value" data-qty-value>1</span>
            <button type="button" class="product-detail__qty-btn" data-action="increase" aria-label="Sumar unidad">+</button>
          </div>
          <button type="button" class="btn btn--primary" data-action="add-to-cart" data-product-id="${product.id}" aria-label="Añadir ${product.name} al carrito">
            Agregar a mi carrito
          </button>
        </div>

        <details class="product-detail__accordion">
          <summary>Detalle de producto</summary>
          <div class="product-detail__accordion-body">
            <p>${product.description}</p>
            <p class="product-detail__meta">Categoría: ${product.category}</p>
          </div>
        </details>
        ${careHtml(product)}

        ${shareHtml(product)}
      </div>
    </div>
    ${relatedHtml(product)}
  `;
    root.setAttribute("aria-labelledby", "product-detail-heading");
    if (window.matchMedia("(min-width: 1024px)").matches) {
        root.querySelectorAll(".product-detail__accordion").forEach((accordion) => {
            accordion.open = true;
        });
    }
    const sizeSelect = root.querySelector("#product-size");
    const sizeError = root.querySelector("#product-size-error");
    sizeSelect?.addEventListener("change", () => {
        if (sizeError)
            sizeError.hidden = true;
        sizeSelect.removeAttribute("aria-invalid");
    });
    // Colour swatches: picking one swaps the main photo and remembers the
    // choice for the cart.
    let selectedColor = colorOptions[0]?.name;
    const mainImage = root.querySelector(".product-detail__image");
    const colorName = root.querySelector("[data-color-name]");
    root.querySelectorAll(".product-detail__swatch[data-color]").forEach((swatch) => {
        swatch.addEventListener("click", () => {
            const option = colorOptions.find((candidate) => candidate.name === swatch.dataset.color);
            if (!option || option.name === selectedColor)
                return;
            selectedColor = option.name;
            root.querySelectorAll(".product-detail__swatch").forEach((other) => {
                other.setAttribute("aria-pressed", String(other === swatch));
            });
            if (colorName)
                colorName.textContent = option.name;
            if (mainImage) {
                mainImage.src = option.imageSrc;
                mainImage.alt = option.imageAlt;
                mainImage.classList.remove("product-detail__image--swap");
                void mainImage.offsetWidth; // restart the fade if colours are switched quickly
                mainImage.classList.add("product-detail__image--swap");
            }
            pbTrack("Color de producto elegido", { productId: product.id, color: option.name });
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
        if (sizeSelect && !sizeSelect.value) {
            if (sizeError)
                sizeError.hidden = false;
            sizeSelect.setAttribute("aria-invalid", "true");
            sizeSelect.focus();
            return;
        }
        for (let i = 0; i < quantity; i++) {
            document.dispatchEvent(new CustomEvent("purplebloom:add-to-cart", { detail: { id: productId, color: selectedColor } }));
        }
    });
    const favoriteButton = root.querySelector('[data-action="add-to-favorite"]');
    favoriteButton?.addEventListener("click", () => {
        document.dispatchEvent(new CustomEvent("purplebloom:add-to-favorite", { detail: { id: product.id } }));
    });
    root.querySelectorAll("[data-related-add]").forEach((button) => {
        button.addEventListener("click", () => {
            const relatedId = button.getAttribute("data-related-add");
            if (relatedId)
                document.dispatchEvent(new CustomEvent("purplebloom:add-to-cart", { detail: { id: relatedId } }));
        });
    });
    root.querySelectorAll("[data-related-favorite]").forEach((button) => {
        button.addEventListener("click", () => {
            const relatedId = button.getAttribute("data-related-favorite");
            if (relatedId)
                document.dispatchEvent(new CustomEvent("purplebloom:add-to-favorite", { detail: { id: relatedId } }));
        });
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
