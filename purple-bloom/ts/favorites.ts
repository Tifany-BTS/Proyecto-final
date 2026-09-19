(function (): void {
  const MESSAGE = "No se pueden guardar productos a favoritos desde el catálogo hasta iniciar sesión.";
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

  function wireFavoriteButtons(): void {
    document.querySelectorAll<HTMLElement>('[data-action="add-to-favorite"]').forEach((button) => {
      button.addEventListener("click", () => {
        showToast(MESSAGE);
      });
    });
  }

  // The product-detail page builds its favorite button after this script has
  // already run its initial querySelectorAll above (same reason cart.ts
  // listens for "purplebloom:add-to-cart" instead of a direct listener).
  document.addEventListener("purplebloom:add-to-favorite", () => {
    showToast(MESSAGE);
  });

  wireFavoriteButtons();
})();
