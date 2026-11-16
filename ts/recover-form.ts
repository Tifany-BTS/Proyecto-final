(function (): void {
  const form = document.querySelector<HTMLFormElement>(".recover-form");
  const feedback = document.querySelector<HTMLElement>(".form-feedback");

  if (!form || !feedback) return;

  const formEl = form;
  const feedbackEl = feedback;

  const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  function getField(): HTMLInputElement | null {
    return formEl.querySelector<HTMLInputElement>("#email-recuperar");
  }

  function setFieldError(message: string | null): void {
    const field = getField();
    const errorEl = document.getElementById("email-recuperar-error");
    if (!field || !errorEl) return;

    if (message) {
      field.setAttribute("aria-invalid", "true");
      errorEl.textContent = message;
    } else {
      field.removeAttribute("aria-invalid");
      errorEl.textContent = "";
    }
  }

  function validate(value: string): string | null {
    const trimmed = value.trim();
    if (trimmed.length === 0) return "Ingresá tu correo electrónico.";
    if (!EMAIL_PATTERN.test(trimmed)) return "Ingresá un correo electrónico válido.";
    return null;
  }

  const field = getField();
  let touched = false;

  field?.addEventListener("blur", () => {
    touched = true;
    setFieldError(validate(field.value));
  });

  field?.addEventListener("input", () => {
    if (touched) setFieldError(validate(field.value));
  });

  formEl.addEventListener("submit", (event: SubmitEvent) => {
    event.preventDefault();

    const currentField = getField();
    const message = currentField ? validate(currentField.value) : "Ingresá tu correo electrónico.";
    setFieldError(message);

    if (message) {
      feedbackEl.textContent = "Revisá el campo marcado antes de continuar.";
      feedbackEl.classList.add("form-feedback--error");
      feedbackEl.classList.remove("form-feedback--success");
      currentField?.focus();
      return;
    }

    feedbackEl.textContent = "Si el correo existe en nuestra base, te enviamos un enlace para restablecer tu contraseña. (Simulación: no se envió ningún correo real.)";
    feedbackEl.classList.add("form-feedback--success");
    feedbackEl.classList.remove("form-feedback--error");
    formEl.reset();
  });
})();
