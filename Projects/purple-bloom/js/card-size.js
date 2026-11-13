"use strict";
(function () {
    const SIZES = ["S", "M", "L", "XL"];
    const ERROR_MESSAGE = "Elige una talla para añadir al carrito.";
    const CARD_BUTTONS = '.product-card [data-action="add-to-cart"], .product-card [data-related-add]';
    let counter = 0;
    function sizeGroupFor(button) {
        const previous = button.previousElementSibling;
        return previous instanceof HTMLElement && previous.classList.contains("card-size") ? previous : null;
    }
    function buildGroup(isOutOfStock) {
        const name = `card-size-${++counter}`;
        const group = document.createElement("fieldset");
        group.className = "card-size";
        if (isOutOfStock)
            group.disabled = true;
        group.innerHTML = `
      <legend class="card-size__legend">Talla</legend>
      <div class="card-size__options">
        ${SIZES.map((size) => `
          <label class="card-size__option">
            <input type="radio" name="${name}" value="${size}" class="card-size__input" ${isOutOfStock ? "disabled" : ""}>
            <span class="card-size__chip">${size}</span>
          </label>`).join("")}
      </div>
      <p class="card-size__error" role="alert" hidden>${ERROR_MESSAGE}</p>
    `;
        group.addEventListener("change", () => {
            const error = group.querySelector(".card-size__error");
            if (error)
                error.hidden = true;
            group.classList.remove("card-size--invalid");
        });
        return group;
    }
    function enhance() {
        document.querySelectorAll(CARD_BUTTONS).forEach((button) => {
            const productId = button.getAttribute("data-product-id") || button.getAttribute("data-related-add");
            const product = productId ? findPurpleBloomProduct(productId) : undefined;
            const isOutOfStock = product?.stock === 0;
            if (isOutOfStock) {
                button.disabled = true;
                button.textContent = "Agotado";
                button.setAttribute("aria-label", `${product?.name ?? "Producto"} agotado`);
            }
            if (sizeGroupFor(button))
                return;
            button.before(buildGroup(isOutOfStock));
        });
    }
    // Intercepta el clic antes de los manejadores del carrito para validar stock y talla obligatoria.
    document.addEventListener("click", (event) => {
        const button = event.target.closest(CARD_BUTTONS);
        if (!button)
            return;
        const productId = button.getAttribute("data-product-id") || button.getAttribute("data-related-add");
        const product = productId ? findPurpleBloomProduct(productId) : undefined;
        if (button.disabled || product?.stock === 0) {
            event.stopImmediatePropagation();
            event.preventDefault();
            return;
        }
        const group = sizeGroupFor(button);
        if (!group || group.querySelector("input:checked"))
            return;
        event.stopImmediatePropagation();
        event.preventDefault();
        const error = group.querySelector(".card-size__error");
        if (error)
            error.hidden = false;
        group.classList.remove("card-size--invalid");
        void group.offsetWidth;
        group.classList.add("card-size--invalid");
        group.querySelector("input")?.focus();
    }, true);
    if (document.readyState !== "complete") {
        document.addEventListener("DOMContentLoaded", enhance);
    }
    else {
        enhance();
    }
})();
