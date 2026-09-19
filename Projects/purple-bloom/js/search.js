"use strict";
(function () {
    const form = document.querySelector(".site-search");
    const input = document.querySelector("#buscar");
    const grid = document.querySelector(".catalog__grid");
    const empty = document.querySelector(".catalog__empty");
    const filterButtons = Array.from(document.querySelectorAll(".filter-list__link"));
    if (!form || !input || !grid)
        return;
    const gridEl = grid;
    const inputEl = input;
    const cards = Array.from(gridEl.querySelectorAll(".product-card"));
    const CATEGORY_PARAM = "categoria";
    function getCategoryFromUrl() {
        const raw = new URLSearchParams(window.location.search).get(CATEGORY_PARAM) ?? "";
        const match = filterButtons.find((btn) => (btn.getAttribute("data-category") ?? "").toLowerCase() === raw.toLowerCase());
        return match ? match.getAttribute("data-category") ?? "" : "";
    }
    let activeCategory = getCategoryFromUrl();
    function setActiveButton(category) {
        filterButtons.forEach((btn) => {
            const isActive = (btn.getAttribute("data-category") ?? "") === category;
            btn.classList.toggle("filter-list__link--active", isActive);
            if (isActive) {
                btn.setAttribute("aria-current", "true");
            }
            else {
                btn.removeAttribute("aria-current");
            }
        });
    }
    function runFilter() {
        const query = inputEl.value.trim().toLowerCase();
        let visibleCount = 0;
        cards.forEach((card) => {
            const name = card.querySelector("h2, h3")?.textContent?.toLowerCase() ?? "";
            const category = card.getAttribute("data-category") ?? "";
            const matchesQuery = query === "" || name.includes(query);
            const matchesCategory = activeCategory === "" || category === activeCategory;
            const matches = matchesQuery && matchesCategory;
            card.hidden = !matches;
            if (matches)
                visibleCount += 1;
        });
        if (empty) {
            const trimmed = inputEl.value.trim();
            empty.hidden = visibleCount > 0;
            empty.textContent =
                visibleCount === 0
                    ? trimmed
                        ? `No se encontraron productos para "${trimmed}".`
                        : "No hay productos en esta categoría."
                    : "";
        }
    }
    function updateUrl(category) {
        const url = new URL(window.location.href);
        if (category) {
            url.searchParams.set(CATEGORY_PARAM, category);
        }
        else {
            url.searchParams.delete(CATEGORY_PARAM);
        }
        window.history.pushState({ category }, "", url);
    }
    form.addEventListener("submit", (event) => {
        event.preventDefault();
        runFilter();
    });
    inputEl.addEventListener("input", runFilter);
    filterButtons.forEach((button) => {
        button.addEventListener("click", () => {
            const category = button.getAttribute("data-category") ?? "";
            if (category === activeCategory)
                return;
            activeCategory = category;
            setActiveButton(activeCategory);
            updateUrl(activeCategory);
            runFilter();
        });
    });
    // Supports the browser's back/forward buttons after a filter changed the URL.
    window.addEventListener("popstate", () => {
        activeCategory = getCategoryFromUrl();
        setActiveButton(activeCategory);
        runFilter();
    });
    // Deep-link support: catalogo.html?categoria=Blusas loads pre-filtered.
    setActiveButton(activeCategory);
    runFilter();
})();
