"use strict";
(function () {
    const toggle = document.getElementById("nav-toggle");
    const nav = document.getElementById("site-nav");
    const backdrop = document.getElementById("nav-backdrop");
    function openNav() {
        if (!toggle || !nav || !backdrop)
            return;
        nav.classList.add("site-nav--open");
        toggle.setAttribute("aria-expanded", "true");
        backdrop.hidden = false;
        // Force a frame between removing [hidden] and adding the visible class,
        // so the opacity transition has a starting value to animate from.
        requestAnimationFrame(() => backdrop.classList.add("nav-backdrop--visible"));
        document.body.classList.add("nav-open");
    }
    function closeNav() {
        if (!toggle || !nav || !backdrop)
            return;
        nav.classList.remove("site-nav--open");
        toggle.setAttribute("aria-expanded", "false");
        backdrop.classList.remove("nav-backdrop--visible");
        backdrop.addEventListener("transitionend", () => {
            if (!isNavOpen())
                backdrop.hidden = true;
        }, { once: true });
        document.body.classList.remove("nav-open");
    }
    function isNavOpen() {
        return nav?.classList.contains("site-nav--open") ?? false;
    }
    toggle?.addEventListener("click", () => {
        if (isNavOpen()) {
            closeNav();
        }
        else {
            openNav();
        }
    });
    backdrop?.addEventListener("click", closeNav);
    document.addEventListener("keydown", (event) => {
        if (event.key === "Escape" && isNavOpen())
            closeNav();
    });
    nav?.querySelectorAll("a").forEach((link) => {
        link.addEventListener("click", closeNav);
    });
    window.addEventListener("resize", () => {
        if (window.innerWidth >= 768 && isNavOpen())
            closeNav();
    });
})();
