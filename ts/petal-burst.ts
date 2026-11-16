// Shared petal-burst delight effect. Deliberately not IIFE-wrapped so other
// scripts (login-form.ts, register-form.ts, contact-form.ts, cart.ts) can
// call pbPetalBurst() directly after a real success — the same pattern
// analytics.ts uses to share pbTrack()/pbTrackBeforeNavigate() globally.
const PB_PETAL_COUNT = 7;
const PB_PETAL_BURST_MS = 550;
const PB_REDUCE_MOTION = window.matchMedia("(prefers-reduced-motion: reduce)");

function pbPetalBurst(target: Element): void {
  if (PB_REDUCE_MOTION.matches) return;

  const rect = target.getBoundingClientRect();
  const burst = document.createElement("span");
  burst.className = "petal-burst";
  burst.style.left = `${rect.left + rect.width / 2}px`;
  burst.style.top = `${rect.top + rect.height / 2}px`;

  for (let i = 0; i < PB_PETAL_COUNT; i++) {
    const angle = (360 / PB_PETAL_COUNT) * i + (Math.random() * 24 - 12);
    const distance = 34 + Math.random() * 14;
    const rad = (angle * Math.PI) / 180;

    const petal = document.createElement("span");
    petal.className = "petal-burst__petal";
    petal.style.setProperty("--petal-x", `${Math.cos(rad) * distance}px`);
    petal.style.setProperty("--petal-y", `${Math.sin(rad) * distance}px`);
    petal.style.setProperty("--petal-rot", `${angle + (Math.random() * 30 - 15)}deg`);
    petal.style.setProperty("--petal-delay", `${Math.random() * 40}ms`);
    petal.style.setProperty(
      "--petal-color",
      i % 2 === 0 ? "var(--color-primary)" : "var(--color-primary-light)"
    );
    burst.appendChild(petal);
  }

  document.body.appendChild(burst);
  window.setTimeout(() => burst.remove(), PB_PETAL_BURST_MS + 60);
}

(function (): void {
  function isPlainLeftClick(event: MouseEvent): boolean {
    return event.button === 0 && !event.metaKey && !event.ctrlKey && !event.shiftKey && !event.altKey;
  }

  // Elements that burst on click and then, if they navigate to another
  // page, delay just long enough for the burst to be visible before leaving.
  function wireBurstThenNavigate(el: Element, origin: Element): void {
    el.addEventListener("click", (event) => {
      if (!(event instanceof MouseEvent) || !isPlainLeftClick(event)) return;
      pbPetalBurst(origin);

      const href = el.getAttribute("href");
      if (!href || href.startsWith("#")) return;

      event.preventDefault();
      window.setTimeout(() => {
        window.location.href = href;
      }, 200);
    });
  }

  document.querySelectorAll(".site-logo").forEach((logo) => {
    const mark = logo.querySelector(".site-logo__mark");
    if (mark) wireBurstThenNavigate(logo, mark);
  });

  document.querySelectorAll("[data-petal-burst-nav]").forEach((el) => {
    wireBurstThenNavigate(el, el);
  });
})();
