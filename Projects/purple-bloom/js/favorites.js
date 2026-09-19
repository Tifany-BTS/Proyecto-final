"use strict";
(function () {
    const MESSAGE = "No se pueden guardar productos a favoritos desde el catálogo hasta iniciar sesión.";
    const HIDE_DELAY_MS = 4000;
    let hideTimer;
    function hideToast(toast) {
        toast.classList.add("toast--hiding");
        toast.addEventListener("transitionend", () => {
            if (toast.classList.contains("toast--hiding"))
                toast.hidden = true;
        }, { once: true });
    }
    function showToast(message) {
        const toast = document.getElementById("toast");
        if (!toast)
            return;
        if (hideTimer)
            window.clearTimeout(hideTimer);
        toast.textContent = message;
        toast.classList.remove("toast--hiding");
        toast.hidden = false;
        hideTimer = window.setTimeout(() => hideToast(toast), HIDE_DELAY_MS);
    }
    function productIdNear(button) {
        return button.closest("article")?.querySelector("[data-product-id]")?.getAttribute("data-product-id") ?? null;
    }
    function wireFavoriteButtons() {
        document.querySelectorAll('[data-action="add-to-favorite"]').forEach((button) => {
            button.addEventListener("click", () => {
                showToast(MESSAGE);
                pbTrack("Producto agregado a favoritos", { productId: productIdNear(button) });
            });
        });
    }
    // The product-detail page builds its favorite button after this script has
    // already run its initial querySelectorAll above (same reason cart.ts
    // listens for "purplebloom:add-to-cart" instead of a direct listener).
    document.addEventListener("purplebloom:add-to-favorite", (event) => {
        showToast(MESSAGE);
        pbTrack("Producto agregado a favoritos", { productId: event.detail?.id });
    });
    wireFavoriteButtons();
})();
