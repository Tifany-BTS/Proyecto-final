(function (): void {
  const header = document.querySelector<HTMLElement>(".site-header");
  if (!header) return;

  const SCROLLED_THRESHOLD = 10;

  function applyScrolled(): void {
    header!.classList.toggle("site-header--scrolled", window.scrollY > SCROLLED_THRESHOLD);
  }

  applyScrolled();
  window.addEventListener("scroll", applyScrolled, { passive: true });
})();
