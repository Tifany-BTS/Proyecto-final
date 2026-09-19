"use strict";
(function () {
    const header = document.querySelector(".site-header");
    if (!header)
        return;
    const SCROLLED_THRESHOLD = 10;
    function applyScrolled() {
        header.classList.toggle("site-header--scrolled", window.scrollY > SCROLLED_THRESHOLD);
    }
    applyScrolled();
    window.addEventListener("scroll", applyScrolled, { passive: true });
})();
