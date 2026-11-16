"use strict";
(function () {
    const form = document.querySelector(".login-form");
    const feedback = document.querySelector(".form-feedback");
    if (!form || !feedback)
        return;
    const formEl = form;
    const feedbackEl = feedback;
    // Si se llegó desde una tarjeta de "inicia sesión" externa (ej. la de
    // noticias.html) que ya pidió el correo, se precarga aquí en vez de
    // hacer que la persona lo vuelva a escribir.
    const emailFromQuery = new URLSearchParams(window.location.search).get("email");
    if (emailFromQuery) {
        const emailField = formEl.querySelector("#email-login");
        if (emailField)
            emailField.value = emailFromQuery;
    }
    const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const PASSWORD_MIN_LENGTH = 6;
    const rules = [
        {
            id: "email-login",
            validate: (value) => {
                const trimmed = value.trim();
                if (trimmed.length === 0)
                    return "Ingresa tu correo electrónico.";
                if (!EMAIL_PATTERN.test(trimmed))
                    return "Ingresa un correo electrónico válido.";
                return null;
            },
        },
        {
            id: "password-login",
            validate: (value) => {
                if (value.length === 0)
                    return "Ingresa tu contraseña.";
                if (value.length < PASSWORD_MIN_LENGTH)
                    return `La contraseña debe tener al menos ${PASSWORD_MIN_LENGTH} caracteres.`;
                return null;
            },
        },
    ];
    function getField(id) {
        return formEl.querySelector(`#${id}`);
    }
    function getErrorEl(id) {
        return formEl.querySelector(`#${id}-error`);
    }
    function setFieldError(id, message) {
        const field = getField(id);
        const errorEl = getErrorEl(id);
        if (!field || !errorEl)
            return;
        if (message) {
            field.setAttribute("aria-invalid", "true");
            errorEl.textContent = message;
        }
        else {
            field.removeAttribute("aria-invalid");
            errorEl.textContent = "";
        }
    }
    function validateField(rule) {
        const field = getField(rule.id);
        if (!field)
            return true;
        const message = rule.validate(field.value);
        setFieldError(rule.id, message);
        return message === null;
    }
    function showFeedback(message, isError) {
        feedbackEl.textContent = message;
        feedbackEl.classList.toggle("form-feedback--error", isError);
        feedbackEl.classList.toggle("form-feedback--success", !isError);
    }
    const touched = new Set();
    rules.forEach((rule) => {
        const field = getField(rule.id);
        if (!field)
            return;
        field.addEventListener("blur", () => {
            touched.add(rule.id);
            validateField(rule);
        });
        field.addEventListener("input", () => {
            if (touched.has(rule.id))
                validateField(rule);
        });
    });
    // Back/forward cache can restore the page mid-"login": undo the busy state.
    window.addEventListener("pageshow", (event) => {
        if (!event.persisted)
            return;
        formEl.removeAttribute("aria-busy");
        const btn = formEl.querySelector("button[type='submit']");
        if (btn)
            btn.disabled = false;
    });
    formEl.addEventListener("submit", (event) => {
        event.preventDefault();
        let isValid = true;
        let firstInvalidField = null;
        for (const rule of rules) {
            const fieldValid = validateField(rule);
            if (!fieldValid) {
                isValid = false;
                if (!firstInvalidField)
                    firstInvalidField = getField(rule.id);
            }
        }
        if (!isValid) {
            showFeedback("Revisa los campos marcados antes de continuar.", true);
            firstInvalidField?.focus();
            return;
        }
        const email = getField("email-login")?.value ?? "";
        const submitBtn = formEl.querySelector("button[type='submit']");
        const idleLabel = submitBtn?.textContent ?? "Entrar";
        // Simulated network round-trip so the button gives feedback while "signing in".
        if (submitBtn) {
            submitBtn.disabled = true;
            submitBtn.textContent = "Entrando…";
        }
        formEl.setAttribute("aria-busy", "true");
        showFeedback("Verificando tus datos…", false);
        window.setTimeout(() => {
            const user = pbSessionLogin(email);
            formEl.removeAttribute("aria-busy");
            showFeedback(`¡Hola, ${user.name}! Sesión iniciada. Te llevamos a tu cuenta. (Simulación: no hay autenticación real.)`, false);
            formEl.reset();
            if (submitBtn) {
                submitBtn.textContent = idleLabel;
                pbPetalBurst(submitBtn);
            }
            pbTrackBeforeNavigate("Inicio de sesión completado");
            window.setTimeout(() => {
                window.location.href = "mi-cuenta.html";
            }, 1200);
        }, 700);
    });
})();
