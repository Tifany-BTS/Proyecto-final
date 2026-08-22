"use strict";
(function () {
    const CART_KEY = "cart";
    function getCart() {
        const raw = localStorage.getItem(CART_KEY);
        if (!raw)
            return [];
        try {
            const parsed = JSON.parse(raw);
            if (!Array.isArray(parsed))
                return [];
            return parsed.filter((line) => typeof line.id === "string" &&
                typeof line.qty === "number" &&
                findPurpleBloomProduct(line.id) !== undefined);
        }
        catch {
            return [];
        }
    }
    function saveCart(lines) {
        localStorage.setItem(CART_KEY, JSON.stringify(lines));
    }
    function addToCart(id) {
        const lines = getCart();
        const existing = lines.find((line) => line.id === id);
        if (existing) {
            existing.qty += 1;
        }
        else {
            lines.push({ id, qty: 1 });
        }
        saveCart(lines);
        updateBadges();
        renderCartPage();
    }
    function setQty(id, qty) {
        let lines = getCart();
        if (qty < 1) {
            lines = lines.filter((line) => line.id !== id);
        }
        else {
            const existing = lines.find((line) => line.id === id);
            if (existing)
                existing.qty = qty;
        }
        saveCart(lines);
        updateBadges();
        renderCartPage();
    }
    function removeFromCart(id) {
        const lines = getCart().filter((line) => line.id !== id);
        saveCart(lines);
        updateBadges();
        renderCartPage();
    }
    function cartCount(lines) {
        return lines.reduce((sum, line) => sum + line.qty, 0);
    }
    function cartTotal(lines) {
        return lines.reduce((sum, line) => {
            const product = findPurpleBloomProduct(line.id);
            return product ? sum + product.price * line.qty : sum;
        }, 0);
    }
    function formatPrice(value) {
        return `${value.toFixed(2).replace(".", ",")} €`;
    }
    function updateBadges() {
        const lines = getCart();
        const count = cartCount(lines);
        document.querySelectorAll(".cart-fab__count").forEach((badge) => {
            badge.textContent = String(count);
            badge.hidden = count === 0;
        });
        const liveRegion = document.getElementById("carrito");
        if (liveRegion) {
            liveRegion.textContent =
                count === 0 ? "Carrito de compras: vacío." : `Carrito de compras: ${count} producto${count === 1 ? "" : "s"}.`;
        }
    }
    function productMediaHtml(product) {
        if (product.imageSrc) {
            return `<img class="cart-item__image" src="${product.imageSrc}" alt="" width="80" height="80">`;
        }
        const variantClass = product.swatch ? ` product-card__image--${product.swatch}` : "";
        return `<div class="cart-item__image product-card__image${variantClass}" aria-hidden="true"></div>`;
    }
    function renderCartPage() {
        const itemsEl = document.getElementById("cart-items");
        const totalEl = document.getElementById("cart-total");
        const submitBtn = document.getElementById("checkout-submit");
        if (!itemsEl)
            return;
        const lines = getCart();
        if (lines.length === 0) {
            itemsEl.innerHTML =
                '<p class="cart-page__empty">Tu carrito está vacío. <a href="catalogo.html">Explorá el catálogo</a>.</p>';
        }
        else {
            itemsEl.innerHTML = lines
                .map((line) => {
                const product = findPurpleBloomProduct(line.id);
                if (!product)
                    return "";
                const subtotal = product.price * line.qty;
                return `
            <article class="cart-item" data-cart-item="${product.id}">
              ${productMediaHtml(product)}
              <div class="cart-item__info">
                <h2 class="cart-item__name"><a href="producto.html?id=${product.id}">${product.name}</a></h2>
                <p class="cart-item__price">${formatPrice(product.price)}</p>
              </div>
              <div class="cart-item__qty">
                <button type="button" class="cart-item__qty-btn" data-action="decrease" data-id="${product.id}" aria-label="Quitar una unidad de ${product.name}">&minus;</button>
                <span class="cart-item__qty-value">${line.qty}</span>
                <button type="button" class="cart-item__qty-btn" data-action="increase" data-id="${product.id}" aria-label="Agregar una unidad de ${product.name}">+</button>
              </div>
              <p class="cart-item__subtotal">${formatPrice(subtotal)}</p>
              <button type="button" class="cart-item__remove" data-action="remove" data-id="${product.id}" aria-label="Quitar ${product.name} del carrito">Quitar</button>
            </article>
          `;
            })
                .join("");
        }
        if (totalEl)
            totalEl.textContent = formatPrice(cartTotal(lines));
        if (submitBtn instanceof HTMLButtonElement)
            submitBtn.disabled = lines.length === 0;
    }
    function wireAddToCartButtons() {
        document.querySelectorAll('[data-action="add-to-cart"]').forEach((button) => {
            button.addEventListener("click", () => {
                const id = button.getAttribute("data-product-id");
                if (id)
                    addToCart(id);
            });
        });
        // The product-detail page builds its "Añadir al carrito" button after
        // this script has already run its initial querySelectorAll above, so it
        // dispatches this event instead of relying on a listener attached here.
        document.addEventListener("purplebloom:add-to-cart", (event) => {
            const id = event.detail?.id;
            if (id)
                addToCart(id);
        });
    }
    function wireCartItemActions() {
        const itemsEl = document.getElementById("cart-items");
        if (!itemsEl)
            return;
        itemsEl.addEventListener("click", (event) => {
            const target = event.target;
            const button = target.closest("[data-action]");
            if (!button)
                return;
            const id = button.getAttribute("data-id");
            const action = button.getAttribute("data-action");
            if (!id || !action)
                return;
            const current = getCart().find((line) => line.id === id)?.qty ?? 0;
            if (action === "increase")
                setQty(id, current + 1);
            if (action === "decrease")
                setQty(id, current - 1);
            if (action === "remove")
                removeFromCart(id);
        });
    }
    function wireCheckoutForm() {
        const form = document.getElementById("checkout-form");
        const feedback = document.getElementById("checkout-feedback");
        if (!(form instanceof HTMLFormElement) || !feedback)
            return;
        const formEl = form;
        const feedbackEl = feedback;
        const rules = [
            {
                id: "checkout-nombre",
                validate: (value) => {
                    const trimmed = value.trim();
                    if (trimmed.length === 0)
                        return "Ingresá tu nombre completo.";
                    if (trimmed.length < 2)
                        return "El nombre es demasiado corto.";
                    return null;
                },
            },
            {
                id: "checkout-direccion",
                validate: (value) => {
                    const trimmed = value.trim();
                    if (trimmed.length === 0)
                        return "Ingresá tu dirección de envío.";
                    if (trimmed.length < 5)
                        return "Ingresá una dirección completa.";
                    return null;
                },
            },
            {
                id: "checkout-email",
                validate: (value) => {
                    const trimmed = value.trim();
                    const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
                    if (trimmed.length === 0)
                        return "Ingresá tu correo electrónico.";
                    if (!EMAIL_PATTERN.test(trimmed))
                        return "Ingresá un correo electrónico válido.";
                    return null;
                },
            },
        ];
        function getField(id) {
            return formEl.querySelector(`#${id}`);
        }
        function setFieldError(id, message) {
            const field = getField(id);
            const errorEl = document.getElementById(`${id}-error`);
            if (!field || !errorEl)
                return;
            if (message) {
                field.setAttribute("aria-invalid", "true");
                errorEl.textContent = message;
            }
            else {
                field.removeAttribute("aria-invalid");
                errorEl.textContent = "";
            }
        }
        formEl.addEventListener("submit", (event) => {
            event.preventDefault();
            if (getCart().length === 0)
                return;
            let isValid = true;
            let firstInvalid = null;
            for (const rule of rules) {
                const field = getField(rule.id);
                if (!field)
                    continue;
                const message = rule.validate(field.value);
                setFieldError(rule.id, message);
                if (message) {
                    isValid = false;
                    if (!firstInvalid)
                        firstInvalid = field;
                }
            }
            if (!isValid) {
                feedbackEl.textContent = "Revisá los campos marcados antes de continuar.";
                feedbackEl.classList.add("form-feedback--error");
                feedbackEl.classList.remove("form-feedback--success");
                firstInvalid?.focus();
                return;
            }
            saveCart([]);
            updateBadges();
            renderCartPage();
            formEl.reset();
            feedbackEl.textContent = "¡Gracias por tu compra! Te enviamos la confirmación por correo. (Simulación: no se procesó ningún pago real.)";
            feedbackEl.classList.add("form-feedback--success");
            feedbackEl.classList.remove("form-feedback--error");
        });
    }
    updateBadges();
    wireAddToCartButtons();
    wireCartItemActions();
    wireCheckoutForm();
    renderCartPage();
})();
