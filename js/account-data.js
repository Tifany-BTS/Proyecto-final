"use strict";
(function () {
    // "Mis datos" (mi-cuenta.html): ya no son guiones fijos, son el nombre y
    // teléfono reales de la cuenta (session.ts), editables acá mismo. El
    // correo se muestra pero no se puede editar desde este formulario: es la
    // clave que ya usan favoritos/pedidos/puntos para guardar todo lo demás
    // de esta cuenta, así que cambiarlo acá "movería" a otra cuenta en vez de
    // simplemente renombrar esta.
    const form = document.getElementById("account-data-form");
    const guestStateEl = document.getElementById("account-data-guest");
    if (!(form instanceof HTMLFormElement) || !guestStateEl)
        return;
    // Reasignado a const con tipo explícito: dentro de render()/el listener de
    // submit (definidos después de este guard), TypeScript no conserva el
    // angostamiento de una const capturada por closure.
    const guestEl = guestStateEl;
    const formEl = form;
    const feedbackEl = formEl.querySelector(".form-feedback");
    const nameField = formEl.querySelector("#account-nombre");
    const emailField = formEl.querySelector("#account-email");
    const phoneField = formEl.querySelector("#account-telefono");
    function render() {
        const user = pbSessionGet();
        if (!user) {
            formEl.hidden = true;
            guestEl.hidden = false;
            return;
        }
        guestEl.hidden = true;
        formEl.hidden = false;
        if (nameField)
            nameField.value = user.name;
        if (emailField)
            emailField.value = user.email;
        if (phoneField)
            phoneField.value = user.phone ?? "";
    }
    formEl.addEventListener("submit", (event) => {
        event.preventDefault();
        const name = nameField?.value.trim() ?? "";
        if (name.length < 2) {
            if (feedbackEl) {
                feedbackEl.textContent = "Ingresá un nombre válido.";
                feedbackEl.classList.add("form-feedback--error");
                feedbackEl.classList.remove("form-feedback--success");
            }
            nameField?.focus();
            return;
        }
        pbSessionUpdateProfile({ name, phone: phoneField?.value ?? "" });
        pbTrack("Datos de cuenta actualizados");
        if (feedbackEl) {
            feedbackEl.textContent = "Guardamos tus datos en este navegador.";
            feedbackEl.classList.add("form-feedback--success");
            feedbackEl.classList.remove("form-feedback--error");
        }
        const submitBtn = formEl.querySelector("button[type='submit']");
        if (submitBtn)
            pbPetalBurst(submitBtn);
    });
    render();
})();
