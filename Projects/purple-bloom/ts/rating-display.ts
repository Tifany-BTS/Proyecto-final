(function (): void {
  const STATS_KEY = "rating-stats";
  // The catalog's own star value counts as one vote, so a single new rating
  // moves the average visibly without erasing the product's starting score.
  const SEED_VOTES = 1;

  type Stats = Record<string, { sum: number; count: number }>;

  function getStats(): Stats {
    try {
      const parsed = JSON.parse(localStorage.getItem(STATS_KEY) ?? "{}");
      return parsed && typeof parsed === "object" ? (parsed as Stats) : {};
    } catch {
      return {};
    }
  }

  // Stored totals can be edited or half-cleared by hand; anything that isn't
  // possible with 1-5 star votes is ignored instead of skewing the stars.
  function validEntry(entry: { sum: number; count: number } | undefined): { sum: number; count: number } {
    if (
      !entry ||
      !Number.isInteger(entry.count) ||
      !Number.isFinite(entry.sum) ||
      entry.count < 1 ||
      entry.sum < entry.count ||
      entry.sum > entry.count * 5
    ) {
      return { sum: 0, count: 0 };
    }
    return entry;
  }

  function productIdOf(rating: HTMLElement): string | null {
    const link = rating.closest(".product-card")?.querySelector<HTMLAnchorElement>('a[href*="producto.html?id="]');
    return link ? new URL(link.href, window.location.href).searchParams.get("id") : null;
  }

  function baseRatingOf(rating: HTMLElement): number {
    if (!rating.dataset.baseRating) {
      const shown = rating.querySelector("span")?.textContent ?? "";
      rating.dataset.baseRating = String((shown.match(/★/g) ?? []).length);
    }
    return Number(rating.dataset.baseRating);
  }

  function render(rating: HTMLElement, stats: Stats, animate: boolean): void {
    const id = productIdOf(rating);
    const base = baseRatingOf(rating);
    if (!id || base === 0) return;

    const { sum, count } = validEntry(stats[id]);
    const average = (base * SEED_VOTES + sum) / (SEED_VOTES + count);
    // The stars are filled to the exact average (4.5 = four and a half), so
    // what's drawn always matches the number next to it.
    const fill = Math.round((average / 5) * 1000) / 10;
    const label = average.toFixed(1).replace(".", ",");
    const votes = count > 0 ? ` <span class="product-card__rating-count">${label} (${count})</span>` : "";

    rating.innerHTML =
      `<span class="product-card__rating-stars" style="--rating-fill:${fill}%" aria-hidden="true">★★★★★</span>${votes}` +
      `<span class="visually-hidden">${label} de 5 estrellas${count > 0 ? `, ${count} ${count === 1 ? "calificación" : "calificaciones"}` : ""}</span>`;

    if (animate) {
      rating.classList.remove("product-card__rating--updated");
      void rating.offsetWidth; // restart the animation on repeat ratings
      rating.classList.add("product-card__rating--updated");
    }
  }

  function renderAll(changedId?: string): void {
    const stats = getStats();
    document.querySelectorAll<HTMLElement>(".product-card__rating").forEach((rating) => {
      const isChanged = changedId !== undefined && productIdOf(rating) === changedId;
      if (changedId === undefined || isChanged) render(rating, stats, isChanged);
    });
  }

  document.addEventListener("purplebloom:rated", (event) => {
    renderAll((event as CustomEvent<{ id: string }>).detail?.id);
  });

  // A rating made in another tab updates this one too.
  window.addEventListener("storage", (event) => {
    if (event.key === STATS_KEY || event.key === null) renderAll();
  });

  // Deferred scripts have all run by DOMContentLoaded, so cards drawn by
  // product-detail.js exist by then (readyState is "interactive" until then).
  if (document.readyState !== "complete") {
    document.addEventListener("DOMContentLoaded", () => renderAll());
  } else {
    renderAll();
  }
})();
