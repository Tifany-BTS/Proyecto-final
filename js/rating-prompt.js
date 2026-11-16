"use strict";
(function () {
    const RATINGS_KEY = "ratings";
    const STATS_KEY = "rating-stats";
    const AUTO_CLOSE_MS = 9000;
    const THANKS_CLOSE_MS = 2200;
    const LABELS = ["Malo", "Regular", "Bueno", "Muy bueno", "¡Me encanta!"];
    const STAR_PATH = "M12 2.5l2.9 6.2 6.8.8-5 4.7 1.3 6.7L12 17.6 6 20.9l1.3-6.7-5-4.7 6.8-.8L12 2.5z";
    let panel = null;
    let currentId = null;
    let closeTimer;
    function getRatings() {
        try {
            const parsed = JSON.parse(localStorage.getItem(RATINGS_KEY) ?? "{}");
            return parsed && typeof parsed === "object" ? parsed : {};
        }
        catch {
            return {};
        }
    }
    function previousRating(id) {
        const value = getRatings()[id];
        return Number.isInteger(value) && value >= 1 && value <= 5 ? value : 0;
    }
    function saveRating(id, value) {
        try {
            const ratings = getRatings();
            const previous = previousRating(id);
            ratings[id] = value;
            localStorage.setItem(RATINGS_KEY, JSON.stringify(ratings));
            // Running totals behind the stars shown on the product cards
            // (rating-display.ts). Re-rating replaces the earlier vote — but only
            // if that vote is actually in the totals (they could have been cleared
            // separately), otherwise it counts as a new one.
            const parsed = JSON.parse(localStorage.getItem(STATS_KEY) ?? "{}");
            const stats = (parsed && typeof parsed === "object" ? parsed : {});
            const saved = stats[id];
            const entry = saved && Number.isInteger(saved.count) && saved.count >= 1 && saved.sum >= saved.count && saved.sum <= saved.count * 5
                ? saved
                : { sum: 0, count: 0 };
            if (previous && entry.count > 0) {
                entry.sum += value - previous;
            }
            else {
                entry.sum += value;
                entry.count += 1;
            }
            stats[id] = entry;
            localStorage.setItem(STATS_KEY, JSON.stringify(stats));
        }
        catch {
            // Private mode / storage blocked: the rating simply isn't remembered.
        }
    }
    function scheduleClose(ms) {
        window.clearTimeout(closeTimer);
        closeTimer = window.setTimeout(closePanel, ms);
    }
    function closePanel() {
        window.clearTimeout(closeTimer);
        const el = panel;
        if (!el)
            return;
        panel = null;
        currentId = null;
        el.classList.add("rating-prompt--hiding");
        const remove = () => el.remove();
        // Star animations bubble up too, so only the panel's own exit counts.
        el.addEventListener("animationend", (event) => {
            if (event.target === el)
                remove();
        });
        window.setTimeout(remove, 400); // fallback if animationend never fires
    }
    function paint(el, value) {
        el.querySelectorAll(".rating-prompt__star").forEach((star, i) => {
            star.classList.toggle("is-on", i < value);
        });
        const label = el.querySelector(".rating-prompt__label");
        if (label)
            label.textContent = value > 0 ? LABELS[value - 1] : "Toca una estrella para calificar";
    }
    function submit(el, id, value) {
        saveRating(id, value);
        pbTrack("Producto calificado", { productId: id, rating: value });
        document.dispatchEvent(new CustomEvent("purplebloom:rated", { detail: { id } }));
        el.classList.add("rating-prompt--done");
        el.querySelectorAll(".rating-prompt__star").forEach((star, i) => {
            star.disabled = true;
            star.setAttribute("aria-checked", String(i === value - 1));
            // Stagger the celebration left to right, up to the chosen star.
            star.style.setProperty("--pop-delay", `${i * 80}ms`);
            star.classList.toggle("is-on", i < value);
            star.classList.toggle("is-popping", i < value);
        });
        paint(el, value);
        const title = el.querySelector(".rating-prompt__title");
        if (title)
            title.textContent = "¡Gracias por tu calificación!";
        const chosen = el.querySelectorAll(".rating-prompt__star")[value - 1];
        if (chosen)
            window.setTimeout(() => pbPetalBurst(chosen), (value - 1) * 80 + 120);
        scheduleClose(THANKS_CLOSE_MS);
    }
    function openPanel(id) {
        const product = findPurpleBloomProduct(id);
        if (!product)
            return;
        // Buying several units fires one event each: keep the open panel as is.
        if (panel && currentId === id && !panel.classList.contains("rating-prompt--done")) {
            scheduleClose(AUTO_CLOSE_MS);
            return;
        }
        panel?.remove();
        const previous = previousRating(id);
        const el = document.createElement("section");
        el.className = "rating-prompt";
        el.setAttribute("role", "dialog");
        el.setAttribute("aria-label", `Calificar ${product.name}`);
        el.innerHTML = `
      <button type="button" class="rating-prompt__close" aria-label="Cerrar">&times;</button>
      <p class="rating-prompt__added">Añadido al carrito &middot; ${product.name}</p>
      <p class="rating-prompt__title">${previous > 0 ? "Tu calificación de esta prenda" : "¿Qué te parece esta prenda?"}</p>
      <div class="rating-prompt__stars" role="radiogroup" aria-label="Calificación de 1 a 5 estrellas">
        ${[1, 2, 3, 4, 5]
            .map((n) => `
          <button type="button" class="rating-prompt__star" role="radio" aria-checked="${n === previous}" aria-label="${n} ${n === 1 ? "estrella" : "estrellas"}" data-value="${n}" style="--enter-delay:${n * 70}ms">
            <svg viewBox="0 0 24 24" width="36" height="36" aria-hidden="true"><path d="${STAR_PATH}"/></svg>
          </button>`)
            .join("")}
      </div>
      <p class="rating-prompt__label" aria-live="polite"></p>
    `;
        const stars = el.querySelector(".rating-prompt__stars");
        stars?.addEventListener("pointerover", (event) => {
            const star = event.target.closest(".rating-prompt__star");
            if (star && !el.classList.contains("rating-prompt--done"))
                paint(el, Number(star.dataset.value));
        });
        stars?.addEventListener("pointerleave", () => {
            if (!el.classList.contains("rating-prompt--done"))
                paint(el, previous);
        });
        stars?.addEventListener("focusin", (event) => {
            const star = event.target.closest(".rating-prompt__star");
            if (star)
                paint(el, Number(star.dataset.value));
        });
        // Radio-group keyboard behaviour: arrows move between the stars.
        stars?.addEventListener("keydown", (event) => {
            const step = event.key === "ArrowRight" || event.key === "ArrowUp" ? 1 : event.key === "ArrowLeft" || event.key === "ArrowDown" ? -1 : 0;
            if (step === 0)
                return;
            const all = Array.from(el.querySelectorAll(".rating-prompt__star"));
            const index = all.indexOf(document.activeElement);
            if (index === -1)
                return;
            event.preventDefault();
            all[(index + step + all.length) % all.length].focus();
        });
        stars?.addEventListener("click", (event) => {
            const star = event.target.closest(".rating-prompt__star");
            if (star)
                submit(el, id, Number(star.dataset.value));
        });
        el.querySelector(".rating-prompt__close")?.addEventListener("click", closePanel);
        el.addEventListener("keydown", (event) => {
            if (event.key === "Escape")
                closePanel();
        });
        // Don't yank the panel away while the shopper is deciding.
        el.addEventListener("pointerenter", () => window.clearTimeout(closeTimer));
        el.addEventListener("pointerleave", () => {
            if (!el.classList.contains("rating-prompt--done"))
                scheduleClose(AUTO_CLOSE_MS);
        });
        document.body.appendChild(el);
        panel = el;
        currentId = id;
        paint(el, previous);
        scheduleClose(AUTO_CLOSE_MS);
    }
    document.addEventListener("purplebloom:cart-added", (event) => {
        const id = event.detail?.id;
        if (id)
            openPanel(id);
    });
})();
