(function (): void {
  const loader = document.getElementById("page-loader");
  if (!loader) return;

  function hide(): void {
    loader!.classList.add("page-loader--hidden");
    loader!.addEventListener("transitionend", () => loader!.remove(), { once: true });
  }

  if (document.readyState === "complete") {
    hide();
  } else {
    window.addEventListener("load", hide, { once: true });
  }
})();
