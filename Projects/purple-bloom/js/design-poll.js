"use strict";
(function () {
    // "Diseña con nosotras" (noticias.html): encuesta de una sola pregunta
    // con radios reales (el estado visual del círculo lo pinta el CSS por
    // selectores de hermano, sin JS). Sin backend: al enviar solo se valida
    // que haya una opción elegida y se muestra un agradecimiento, mismo
    // patrón que contact-form.ts.
    const form = document.getElementById("design-poll-form");
    const feedback = form?.querySelector(".form-feedback") ?? null;
    if (!form || !feedback)
        return;
    const formEl = form;
    const feedbackEl = feedback;
    function showFeedback(message, isError) {
        feedbackEl.textContent = message;
        feedbackEl.classList.toggle("form-feedback--error", isError);
        feedbackEl.classList.toggle("form-feedback--success", !isError);
    }
    formEl.addEventListener("submit", (event) => {
        event.preventDefault();
        const selected = formEl.querySelector('input[name="design-poll"]:checked');
        if (!selected) {
            showFeedback("Elegí una opción antes de votar.", true);
            return;
        }
        showFeedback("¡Gracias por tu voto! Lo sumamos a las ideas para la próxima colección.", false);
        pbTrack("Encuesta de diseño respondida", { opcion: selected.value });
        formEl.querySelectorAll('input[name="design-poll"]').forEach((input) => {
            input.disabled = true;
        });
        const submitBtn = formEl.querySelector("button[type='submit']");
        if (submitBtn) {
            submitBtn.disabled = true;
            pbPetalBurst(submitBtn);
        }
    });
})();
