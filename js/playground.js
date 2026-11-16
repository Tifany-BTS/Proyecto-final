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
    function initToastTriggers() {
        const container = document.querySelector(".c-toast-container");
        if (!container)
            return;
        document.querySelectorAll("[data-toast-message]").forEach((trigger) => {
            trigger.addEventListener("click", () => {
                const toast = document.createElement("div");
                toast.className = "c-toast";
                const variant = trigger.dataset.toastVariant;
                if (variant)
                    toast.classList.add(`c-toast--${variant}`);
                toast.textContent = trigger.dataset.toastMessage ?? "";
                container.appendChild(toast);
            });
        });
    }
    // --- Alerts ------------------------------------------------------------
    function initAlerts() {
        document.querySelectorAll(".c-alert-close").forEach((button) => {
            button.addEventListener("click", () => {
                button.closest(".c-alert")?.remove();
            });
        });
    }
    // --- Buscador ----------------------------------------------------------
    function initSearch() {
        document.querySelectorAll(".c-search").forEach((form) => {
            const input = form.querySelector("input");
            const status = form.parentElement?.querySelector("[data-search-status]");
            form.addEventListener("submit", (event) => {
                event.preventDefault();
                if (!status)
                    return;
                const query = input?.value.trim() ?? "";
                status.textContent = query ? `Buscando: ${query}` : "Escribe algo para buscar.";
            });
        });
    }
    // --- Formularios -------------------------------------------------------
    // Misma lógica que ts/login-form.ts: valida en blur, revalida en vivo una vez
    // "tocado" el campo y, al enviar, valida todo, enfoca el primer campo inválido
    // y resume el resultado en .c-form-feedback.
    const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const PASSWORD_MIN_LENGTH = 6;
    function validateInput(field) {
        if (field.type === "email") {
            const value = field.value.trim();
            if (value.length === 0)
                return "Ingresa tu correo electrónico.";
            if (!EMAIL_PATTERN.test(value))
                return "Ingresa un correo electrónico válido.";
        }
        if (field.type === "password") {
            if (field.value.length === 0)
                return "Ingresa tu contraseña.";
            if (field.value.length < PASSWORD_MIN_LENGTH) {
                return `La contraseña debe tener al menos ${PASSWORD_MIN_LENGTH} caracteres.`;
            }
        }
        return null;
    }
    function initForms() {
        document.querySelectorAll(".c-form").forEach((form) => {
            const feedback = form.querySelector(".c-form-feedback");
            const fields = Array.from(form.querySelectorAll(".c-input--validated"));
            if (!feedback || fields.length === 0)
                return;
            const feedbackEl = feedback;
            const touched = new Set();
            function validateField(field) {
                const message = validateInput(field);
                const errorEl = form.querySelector(`#${field.id}-error`);
                if (message) {
                    field.setAttribute("aria-invalid", "true");
                }
                else {
                    field.removeAttribute("aria-invalid");
                }
                if (errorEl)
                    errorEl.textContent = message ?? "";
                return message === null;
            }
            function showFeedback(message, isError) {
                feedbackEl.textContent = message;
                feedbackEl.classList.toggle("c-form-feedback--error", isError);
                feedbackEl.classList.toggle("c-form-feedback--success", !isError);
            }
            fields.forEach((field) => {
                field.addEventListener("blur", () => {
                    touched.add(field);
                    validateField(field);
                });
                field.addEventListener("input", () => {
                    if (touched.has(field))
                        validateField(field);
                });
            });
            form.addEventListener("submit", (event) => {
                event.preventDefault();
                let firstInvalidField = null;
                for (const field of fields) {
                    touched.add(field);
                    if (!validateField(field) && !firstInvalidField)
                        firstInvalidField = field;
                }
                if (firstInvalidField) {
                    showFeedback("Revisa los campos marcados antes de continuar.", true);
                    firstInvalidField.focus();
                    return;
                }
                showFeedback("Credenciales válidas. (Simulación: no hay autenticación real.)", false);
                form.reset();
                touched.clear();
            });
        });
    }
    initAlerts();
    initDialogs();
    initForms();
    initMenus();
    initSearch();
    initToasts();
    initToastTriggers();
})();
