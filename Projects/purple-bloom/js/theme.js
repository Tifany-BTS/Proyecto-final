"use strict";
(function () {
    const STORAGE_KEY = "theme";
    const toggle = document.getElementById("theme-toggle");
    const media = window.matchMedia("(prefers-color-scheme: dark)");
    function getStoredTheme() {
        const value = localStorage.getItem(STORAGE_KEY);
        return value === "light" || value === "dark" ? value : null;
    }
    function getEffectiveTheme() {
        return getStoredTheme() ?? (media.matches ? "dark" : "light");
    }
    function applyTheme(theme) {
        document.documentElement.setAttribute("data-theme", theme);
        if (!toggle)
            return;
        toggle.setAttribute("data-theme", theme);
        toggle.setAttribute("aria-pressed", String(theme === "dark"));
        toggle.setAttribute("aria-label", theme === "dark" ? "Cambiar a modo claro" : "Cambiar a modo oscuro");
    }
    applyTheme(getEffectiveTheme());
    toggle?.addEventListener("click", () => {
        const next = getEffectiveTheme() === "dark" ? "light" : "dark";
        localStorage.setItem(STORAGE_KEY, next);
        applyTheme(next);
    });
    media.addEventListener("change", (event) => {
        if (!getStoredTheme())
            applyTheme(event.matches ? "dark" : "light");
    });
})();
