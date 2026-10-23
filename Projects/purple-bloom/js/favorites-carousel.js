"use strict";
(function () {
    // Carrusel "Lo más elegido" (index.html). Avanza solo en un loop infinito
    // y sin cortes; las flechas y los puntos lo controlan a mano. Al usarlos,
    // el avance automático se detiene (quien eligió mirar una prenda no quiere
    // que se le escape) y vuelve solo unos segundos después del último clic.
    const trackEl = document.getElementById("favorites-track");
    const carouselEl = document.querySelector(".favorites__carousel");
    if (!trackEl || !carouselEl)
        return;
    // Reasignados a const con tipo explícito: dentro de las funciones de
    // abajo, TypeScript no conserva el angostamiento de una const capturada.
    const track = trackEl;
    const carousel = carouselEl;
    const prevBtn = carousel.querySelector('[data-action="favorites-prev"]');
    const nextBtn = carousel.querySelector('[data-action="favorites-next"]');
    // Los puntos están debajo del carrusel, fuera de .favorites__carousel (son
    // hermanos dentro de la sección): se buscan en la sección, no adentro.
    const dotsScope = carousel.closest(".favorites") ?? document;
    const dots = Array.from(dotsScope.querySelectorAll(".favorites__dot"));
    const pauseBtn = dotsScope.querySelector('[data-action="favorites-pause"]');
    const realSlides = Array.from(track.querySelectorAll(".product-card"));
    const slideCount = realSlides.length;
    if (slideCount === 0)
        return;
    // Loop infinito: la pista queda [copia de todas, reales, copia de todas].
    // Con una copia completa a cada lado, siempre hay tarjetas llenando la
    // vista (se ven 3-4 a la vez), así que nunca aparece un hueco al final.
    // Al terminar cada movimiento, si quedó parada sobre una copia, salta sin
    // animación a la tarjeta real equivalente: el salto es invisible porque
    // ambas se ven idénticas.
    function makeClone(card) {
        const clone = card.cloneNode(true);
        clone.inert = true;
        clone.setAttribute("aria-hidden", "true");
        clone.removeAttribute("role");
        clone.removeAttribute("aria-labelledby");
        // Sin ids duplicados (los títulos fav-N-name los usan las reales).
        clone.querySelectorAll("[id]").forEach((el) => el.removeAttribute("id"));
        return clone;
    }
    track.prepend(...realSlides.map(makeClone));
    track.append(...realSlides.map(makeClone));
    const AUTOPLAY_DURATION = 4000;
    const MANUAL_DURATION = 450;
    // Cuánto espera, después del último clic en flechas/puntos, para volver
    // a avanzar solo.
    const RESUME_DELAY = 6000;
    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    let index = slideCount; // primera tarjeta real
    let isAnimating = false;
    let currentDuration = 0;
    let hasKeyboardFocus = false;
    // Pausa pedida con el botón: a diferencia del mouse o el foco, dura hasta
    // que la persona vuelva a darle play.
    let userPaused = false;
    let resumeTimer;
    let timer;
    function cardStep() {
        const first = track.querySelector(".product-card");
        const gap = parseFloat(getComputedStyle(track).columnGap || "0") || 0;
        return (first?.getBoundingClientRect().width ?? 0) + gap;
    }
    function realIndex() {
        return (((index - slideCount) % slideCount) + slideCount) % slideCount;
    }
    function updateDots() {
        const active = realIndex();
        dots.forEach((dot, i) => {
            const isActive = i === active;
            dot.classList.toggle("favorites__dot--active", isActive);
            dot.setAttribute("aria-current", String(isActive));
        });
    }
    function setPosition(durationMs) {
        track.style.transitionDuration = durationMs === null ? "0ms" : `${durationMs}ms`;
        track.style.transform = `translateX(${-index * cardStep()}px)`;
    }
    // Si quedó sobre una copia, vuelve a la real equivalente sin animación.
    function normalize() {
        if (index < slideCount)
            index += slideCount;
        else if (index >= slideCount * 2)
            index -= slideCount;
        setPosition(null);
    }
    function moveTo(target, durationMs) {
        // Mismo lugar (p. ej. el punto de la tarjeta actual): no hay transición,
        // así que tampoco llegaría un transitionend que libere isAnimating.
        if (target === index)
            return;
        index = target;
        isAnimating = true;
        currentDuration = durationMs;
        setPosition(durationMs);
        updateDots();
    }
    // Corta un movimiento en curso para que las flechas respondan al instante.
    // Si era el automático (lento, 4s), toma la posición visible en este
    // momento y la redondea a la tarjeta más cercana, así no salta de golpe.
    // Si era manual (clics seguidos), salta a la tarjeta a la que ya iba: cada
    // clic suma uno más desde ahí y ninguno se pierde.
    function interruptAnimation() {
        if (!isAnimating)
            return;
        if (currentDuration === AUTOPLAY_DURATION) {
            const matrix = new DOMMatrixReadOnly(getComputedStyle(track).transform);
            const step = cardStep() || 1;
            index = Math.round(-matrix.m41 / step);
        }
        isAnimating = false;
        normalize();
        void track.offsetWidth; // aplica el salto antes de la próxima transición
    }
    track.addEventListener("transitionend", (event) => {
        if (event.target !== track || event.propertyName !== "transform")
            return;
        isAnimating = false;
        normalize();
    });
    // ---------- Avance automático ----------
    function stopAutoplay() {
        if (timer !== undefined) {
            window.clearInterval(timer);
            timer = undefined;
        }
    }
    function startAutoplay() {
        if (reduceMotion || userPaused || resumeTimer !== undefined)
            return;
        stopAutoplay();
        timer = window.setInterval(() => {
            if (!isAnimating)
                moveTo(index + 1, AUTOPLAY_DURATION);
        }, AUTOPLAY_DURATION);
    }
    // ---------- Control manual: flechas y puntos ----------
    // Cualquier control manual detiene el avance automático, y RESUME_DELAY
    // después del último clic vuelve a arrancar solo. Cada clic reinicia la
    // cuenta, así que mientras se siga usando las flechas no se mueve solo.
    // Reanuda aunque el mouse siga encima: al hacer clic en una flecha el
    // puntero queda sobre el carrusel, y si no, nunca volvería a moverse.
    function takeControl() {
        stopAutoplay();
        interruptAnimation();
        window.clearTimeout(resumeTimer);
        resumeTimer = window.setTimeout(() => {
            resumeTimer = undefined;
            if (!hasKeyboardFocus)
                startAutoplay();
        }, RESUME_DELAY);
    }
    function step(delta) {
        takeControl();
        // Clics muy seguidos: si todavía se está moviendo, se corta y sigue.
        if (isAnimating)
            interruptAnimation();
        moveTo(index + delta, MANUAL_DURATION);
    }
    nextBtn?.addEventListener("click", () => step(1));
    prevBtn?.addEventListener("click", () => step(-1));
    dots.forEach((dot, i) => {
        dot.addEventListener("click", () => {
            takeControl();
            if (isAnimating)
                interruptAnimation();
            moveTo(slideCount + i, MANUAL_DURATION);
        });
    });
    // Pausa mientras el mouse está encima (sin hacer clic), para poder mirar
    // una tarjeta tranquila; al salir sigue. Si hay una reanudación pendiente
    // por un clic reciente, esa manda (startAutoplay espera a que termine).
    carousel.addEventListener("mouseenter", () => {
        if (resumeTimer === undefined)
            stopAutoplay();
    });
    carousel.addEventListener("mouseleave", startAutoplay);
    // Con teclado sí se pausa mientras el foco esté adentro (:focus-visible
    // distingue el foco de teclado del que deja un clic de mouse en la flecha,
    // que si no frenaría la reanudación para siempre).
    carousel.addEventListener("focusin", (event) => {
        if (event.target.matches(":focus-visible")) {
            hasKeyboardFocus = true;
            stopAutoplay();
        }
    });
    carousel.addEventListener("focusout", (event) => {
        if (carousel.contains(event.relatedTarget))
            return;
        hasKeyboardFocus = false;
        startAutoplay();
    });
    // ---------- Botón de pausa ----------
    // Sin él, en pantallas táctiles (sin hover ni foco de teclado) no habría
    // forma de detener el avance automático (WCAG 2.2.2). Con movimiento
    // reducido no hay avance automático, así que el botón no hace falta.
    function setPaused(paused) {
        userPaused = paused;
        pauseBtn.dataset.paused = String(paused);
        pauseBtn.setAttribute("aria-label", paused ? "Reanudar carrusel" : "Pausar carrusel");
        if (paused) {
            stopAutoplay();
            interruptAnimation();
            window.clearTimeout(resumeTimer);
            resumeTimer = undefined;
        }
        else {
            startAutoplay();
        }
    }
    if (pauseBtn) {
        if (reduceMotion) {
            pauseBtn.hidden = true;
        }
        else {
            pauseBtn.addEventListener("click", () => setPaused(!userPaused));
        }
    }
    window.addEventListener("resize", () => {
        interruptAnimation();
        setPosition(null);
    });
    setPosition(null);
    updateDots();
    startAutoplay();
})();
