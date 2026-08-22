(function (): void {
  const MESSAGE = "No se pueden guardar productos a favoritos desde el catálogo hasta iniciar sesión.";

  let hideTimer: number | undefined;

  function showToast(message: string): void {
    const toast = document.getElementById("toast");
    if (!toast) return;

    toast.textContent = message;
    toast.hidden = false;

    if (hideTimer) window.clearTimeout(hideTimer);
    hideTimer = window.setTimeout(() => {
      toast.hidden = true;
    }, 4000);
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
