"use strict";
(function () {
    // --- Dialogs -------------------------------------------------------
    function initDialogs() {
        const dialogs = document.querySelectorAll(".c-dialog");
        dialogs.forEach((dialog) => {
            const triggerId = dialog.getAttribute("data-dialog-trigger");
            const trigger = triggerId ? document.getElementById(triggerId) : null;
            let opener = null;
            trigger?.addEventListener("click", () => {
                opener = document.activeElement;
                dialog.showModal();
            });
            dialog.addEventListener("close", () => {
                opener?.focus();
            });
            dialog.querySelectorAll("[data-dialog-cancel], [data-dialog-confirm]").forEach((button) => {
                button.addEventListener("click", () => {
                    dialog.close();
                });
            });
        });
    }
    // --- Menús -----------------------------------------------------------
    function initMenus() {
        const toggles = document.querySelectorAll(".c-menu-account-toggle");
        function closeMenu(toggle, menu) {
            menu.hidden = true;
            toggle.setAttribute("aria-expanded", "false");
        }
        function openMenu(toggle, menu) {
            toggles.forEach((otherToggle) => {
                const otherMenuId = otherToggle.getAttribute("aria-controls");
                const otherMenu = otherMenuId ? document.getElementById(otherMenuId) : null;
                if (otherMenu instanceof HTMLUListElement && otherToggle !== toggle) {
                    closeMenu(otherToggle, otherMenu);
                }
            });
            menu.hidden = false;
            toggle.setAttribute("aria-expanded", "true");
        }
        toggles.forEach((toggle) => {
            const menuId = toggle.getAttribute("aria-controls");
            const menu = menuId ? document.getElementById(menuId) : null;
            if (!(menu instanceof HTMLUListElement))
                return;
            toggle.addEventListener("click", () => {
                if (menu.hidden) {
                    openMenu(toggle, menu);
                }
                else {
                    closeMenu(toggle, menu);
                }
            });
            document.addEventListener("keydown", (event) => {
                if (event.key === "Escape" && !menu.hidden) {
                    closeMenu(toggle, menu);
                    toggle.focus();
                }
            });
            document.addEventListener("click", (event) => {
                const target = event.target;
                if (!(target instanceof Node))
                    return;
                if (!menu.hidden && !menu.contains(target) && !toggle.contains(target)) {
                    closeMenu(toggle, menu);
                }
            });
        });
    }
    // --- Toasts ------------------------------------------------------------
    const TOAST_LIFETIME_MS = 5000;
    const MAX_VISIBLE_TOASTS = 3;
    function dismissToast(toast) {
        toast.remove();
    }
    function enforceMaxToasts(container) {
        const toasts = Array.from(container.querySelectorAll(".c-toast"));
        const overflow = toasts.length - MAX_VISIBLE_TOASTS;
        for (let i = 0; i < overflow; i++) {
            dismissToast(toasts[i]);
        }
    }
    function scheduleDismiss(toast) {
        window.setTimeout(() => dismissToast(toast), TOAST_LIFETIME_MS);
    }
    function initToasts() {
        const container = document.querySelector(".c-toast-container");
        if (!container)
            return;
        container.querySelectorAll(".c-toast").forEach(scheduleDismiss);
        enforceMaxToasts(container);
        const observer = new MutationObserver((mutations) => {
            mutations.forEach((mutation) => {
                mutation.addedNodes.forEach((node) => {
                    if (node instanceof HTMLElement && node.classList.contains("c-toast")) {
                        scheduleDismiss(node);
                    }
                });
            });
            enforceMaxToasts(container);
        });
        observer.observe(container, { childList: true });
    }
    initDialogs();
    initMenus();
    initToasts();
})();
