"use strict";
(function () {
    const form = document.querySelector(".form-contacto");
    const feedback = document.querySelector(".form-feedback");
    if (!form || !feedback)
        return;
    const formEl = form;
    const feedbackEl = feedback;
    const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const PHONE_PATTERN = /^[0-9+\-\s()]{7,}$/;
    const rules = [
        {
            id: "nombre",
            validate: (value) => {
                const trimmed = value.trim();
                if (trimmed.length === 0)
                    return "Ingresa tu nombre.";
                if (trimmed.length < 2)
                    return "El nombre es demasiado corto.";
                return null;
            },
        },
        {
            id: "email",
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
            id: "telefono",
            validate: (value) => {
                const trimmed = value.trim();
                if (trimmed.length === 0)
                    return null;
                if (!PHONE_PATTERN.test(trimmed))
                    return "Ingresa un número de teléfono válido.";
                return null;
            },
        },
        {
            id: "mensaje",
            validate: (value) => {
                const trimmed = value.trim();
                if (trimmed.length === 0)
                    return "Escribe tu mensaje.";
                if (trimmed.length < 10)
                    return "Cuéntanos un poco más (mínimo 10 caracteres).";
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
        showFeedback("¡Gracias! Tu mensaje fue enviado correctamente.", false);
        formEl.reset();
    });
})();
