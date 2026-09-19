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
    function buildGroup() {
        const name = `card-size-${++counter}`;
        const group = document.createElement("fieldset");
        group.className = "card-size";
        group.innerHTML = `
      <legend class="card-size__legend">Talla</legend>
      <div class="card-size__options">
        ${SIZES.map((size) => `
          <label class="card-size__option">
            <input type="radio" name="${name}" value="${size}" class="card-size__input">
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
            if (sizeGroupFor(button))
                return;
            button.before(buildGroup());
        });
    }
    // Runs before the buttons' own listeners (capture phase on document) so a
    // click without a size never reaches the add-to-cart handlers.
    document.addEventListener("click", (event) => {
        const button = event.target.closest(CARD_BUTTONS);
        if (!button)
            return;
        const group = sizeGroupFor(button);
        if (!group || group.querySelector("input:checked"))
            return;
        event.stopImmediatePropagation();
        event.preventDefault();
        const error = group.querySelector(".card-size__error");
        if (error)
            error.hidden = false;
        // Restart the shake if the shopper keeps pressing the button.
        group.classList.remove("card-size--invalid");
        void group.offsetWidth;
        group.classList.add("card-size--invalid");
        group.querySelector("input")?.focus();
    }, true);
    // Deferred scripts have all run by DOMContentLoaded (readyState is still
    // "interactive" while they run), so cards rendered by offers.js /
    // product-detail.js exist by then whatever the script order.
    if (document.readyState !== "complete") {
        document.addEventListener("DOMContentLoaded", enhance);
    }
    else {
        enhance();
    }
})();
