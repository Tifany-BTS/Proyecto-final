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
    const { gsap, Flip } = window;
    if (gsap && Flip)
        gsap.registerPlugin(Flip);
    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
    let currentFlip;
    // Flip: foto de dónde está cada tarjeta, se aplica el filtro, y Flip anima
    // desde la posición vieja a la nueva. Las que quedan se deslizan a su
    // lugar; las que salen se desvanecen (más rápido que las que entran, para
    // que la grilla se sienta ágil).
    function runFilter(animate = false) {
        const canFlip = animate && gsap && Flip && !reduceMotion.matches;
        // Si todavía se está animando el filtro anterior (p. ej. al escribir
        // rápido), se termina de golpe para medir desde un estado limpio.
        if (currentFlip?.isActive())
            currentFlip.progress(1);
        const state = canFlip ? Flip.getState(cards) : null;
        const startHeight = gridEl.offsetHeight;
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
        if (state && gsap && Flip) {
            // Con absolute: true las tarjetas salen del flujo y la grilla quedaría
            // con altura 0: el footer subiría por detrás de ellas. Se fija la
            // altura vieja y se anima hacia la nueva, a la par de las tarjetas.
            const endHeight = gridEl.offsetHeight;
            gridEl.style.height = `${startHeight}px`;
            // La transición CSS de transform de .product-card (hover) pelearía con
            // los transforms que Flip escribe en cada frame.
            gridEl.classList.add("catalog__grid--flipping");
            const flip = Flip.from(state, {
                duration: 0.45,
                ease: "power2.inOut",
                absolute: true,
                // delay: las que entran esperan a que las que salen casi no se vean;
                // si no, los textos de ambas se enciman en el mismo lugar.
                onEnter: (els) => gsap.fromTo(els, { opacity: 0, scale: 0.92 }, { opacity: 1, scale: 1, duration: 0.35, delay: 0.1, ease: "power2.out" }),
                onLeave: (els) => gsap.to(els, { opacity: 0, scale: 0.92, duration: 0.25, ease: "power2.in" }),
                // Al terminar, Flip borra sus estilos inline. Si la clase se quitara
                // en ese mismo cuadro, la transición CSS animaría ese cambio y la
                // tarjeta saltaría: se espera a que el navegador pinte primero. Si en
                // ese lapso arrancó otro filtro, la clase es suya y no se toca.
                onComplete: () => {
                    gridEl.style.height = "";
                    requestAnimationFrame(() => requestAnimationFrame(() => {
                        if (currentFlip !== flip)
                            return;
                        gridEl.classList.remove("catalog__grid--flipping");
                    }));
                },
            });
            flip.to(gridEl, { height: endHeight, duration: 0.45, ease: "power2.inOut" }, 0);
            currentFlip = flip;
        }
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
    inputEl.addEventListener("input", () => runFilter(true));
    filterButtons.forEach((button) => {
        button.addEventListener("click", () => {
            const category = button.getAttribute("data-category") ?? "";
            if (category === activeCategory)
                return;
            activeCategory = category;
            setActiveButton(activeCategory);
            updateUrl(activeCategory);
            runFilter(true);
        });
    });
    // Supports the browser's back/forward buttons after a filter changed the URL.
    window.addEventListener("popstate", () => {
        activeCategory = getCategoryFromUrl();
        setActiveButton(activeCategory);
        runFilter(true);
    });
    // Deep-link support: catalogo.html?categoria=Blusas loads pre-filtered.
    setActiveButton(activeCategory);
    runFilter();
})();
