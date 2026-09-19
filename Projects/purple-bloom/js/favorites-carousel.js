"use strict";
(function () {
    const track = document.getElementById("favorites-track");
    const carousel = document.querySelector(".favorites__carousel");
    if (!track || !carousel)
        return;
    const prevBtn = carousel.querySelector('[data-action="favorites-prev"]');
    const nextBtn = carousel.querySelector('[data-action="favorites-next"]');
    const dots = Array.from(carousel.querySelectorAll(".favorites__dot"));
    // Track layout is [clone-of-last, real-0, real-1, ..., real-(N-1), clone-of-first],
    // so autoplay can always move left and land on a visual duplicate, then jump back
    // to the matching real slide with the transition switched off for a seamless loop.
    const slides = Array.from(track.querySelectorAll(".product-card"));
    const slideCount = dots.length;
    const lastRealIndex = slideCount; // index of the last real card within `slides`
    let index = 1; // starts on the first real card
    let isAnimating = false;
    const AUTOPLAY_DURATION = 4000;
    const MANUAL_DURATION = 600;
    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    function cardStep() {
        const gap = parseFloat(getComputedStyle(track).columnGap || "0");
        return slides[0].getBoundingClientRect().width + gap;
    }
    function updateDots() {
        const active = (((index - 1) % slideCount) + slideCount) % slideCount;
        dots.forEach((dot, i) => dot.classList.toggle("favorites__dot--active", i === active));
    }
    function setPosition(durationMs) {
        track.style.transitionDuration = durationMs === null ? "0ms" : `${durationMs}ms`;
        track.style.transform = `translateX(${-index * cardStep()}px)`;
    }
    function moveTo(target, durationMs) {
        if (isAnimating)
            return;
        isAnimating = true;
        index = target;
        setPosition(durationMs);
        updateDots();
    }
    function next(durationMs) {
        moveTo(index + 1, durationMs);
    }
    function prev(durationMs) {
        moveTo(index - 1, durationMs);
    }
    track.addEventListener("transitionend", (event) => {
        if (event.target !== track || event.propertyName !== "transform")
            return;
        isAnimating = false;
        if (index === 0) {
            index = lastRealIndex;
            setPosition(null);
        }
        else if (index === slides.length - 1) {
            index = 1;
            setPosition(null);
        }
    });
    window.addEventListener("resize", () => setPosition(null));
    dots.forEach((dot, i) => {
        dot.addEventListener("click", () => {
            moveTo(i + 1, MANUAL_DURATION);
            restartAutoplay();
        });
    });
    nextBtn?.addEventListener("click", () => {
        next(MANUAL_DURATION);
        restartAutoplay();
    });
    prevBtn?.addEventListener("click", () => {
        prev(MANUAL_DURATION);
        restartAutoplay();
    });
    let timer;
    function stopAutoplay() {
        if (timer !== undefined) {
            window.clearInterval(timer);
            timer = undefined;
        }
    }
    function startAutoplay() {
        if (reduceMotion)
            return;
        stopAutoplay();
        timer = window.setInterval(() => next(AUTOPLAY_DURATION), AUTOPLAY_DURATION);
    }
    function restartAutoplay() {
        stopAutoplay();
        startAutoplay();
    }
    // Hover-to-pause: examining a card shouldn't fight the carousel moving
    // under the cursor. Keyboard focus gets the same treatment.
    carousel.addEventListener("mouseenter", stopAutoplay);
    carousel.addEventListener("mouseleave", startAutoplay);
    carousel.addEventListener("focusin", stopAutoplay);
    carousel.addEventListener("focusout", startAutoplay);
    setPosition(null);
    updateDots();
    startAutoplay();
})();
