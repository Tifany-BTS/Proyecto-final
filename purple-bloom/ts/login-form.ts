(function (): void {
  const form = document.querySelector<HTMLFormElement>(".login-form");
  const feedback = document.querySelector<HTMLElement>(".form-feedback");

  if (!form || !feedback) return;

  const formEl = form;
  const feedbackEl = feedback;

  const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  const PASSWORD_MIN_LENGTH = 6;

  interface FieldRule {
    id: string;
    validate: (value: string) => string | null;
  }

  const rules: FieldRule[] = [
    {
      id: "email-login",
      validate: (value) => {
        const trimmed = value.trim();
        if (trimmed.length === 0) return "Ingresa tu correo electrónico.";
        if (!EMAIL_PATTERN.test(trimmed)) return "Ingresa un correo electrónico válido.";
        return null;
      },
    },
    {
      id: "password-login",
      validate: (value) => {
        if (value.length === 0) return "Ingresa tu contraseña.";
        if (value.length < PASSWORD_MIN_LENGTH) return `La contraseña debe tener al menos ${PASSWORD_MIN_LENGTH} caracteres.`;
        return null;
      },
    },
  ];

  function getField(id: string): HTMLInputElement | HTMLTextAreaElement | null {
    return formEl.querySelector<HTMLInputElement | HTMLTextAreaElement>(`#${id}`);
  }

  function getErrorEl(id: string): HTMLElement | null {
    return formEl.querySelector<HTMLElement>(`#${id}-error`);
  }

  function setFieldError(id: string, message: string | null): void {
    const field = getField(id);
    const errorEl = getErrorEl(id);
    if (!field || !errorEl) return;

    if (message) {
      field.setAttribute("aria-invalid", "true");
      errorEl.textContent = message;
    } else {
      field.removeAttribute("aria-invalid");
      errorEl.textContent = "";
    }
  }

  function validateField(rule: FieldRule): boolean {
    const field = getField(rule.id);
    if (!field) return true;
    const message = rule.validate(field.value);
    setFieldError(rule.id, message);
    return message === null;
  }

  function showFeedback(message: string, isError: boolean): void {
    feedbackEl.textContent = message;
    feedbackEl.classList.toggle("form-feedback--error", isError);
    feedbackEl.classList.toggle("form-feedback--success", !isError);
  }

  const touched = new Set<string>();

  rules.forEach((rule) => {
    const field = getField(rule.id);
    if (!field) return;

    field.addEventListener("blur", () => {
      touched.add(rule.id);
      validateField(rule);
    });

    field.addEventListener("input", () => {
      if (touched.has(rule.id)) validateField(rule);
    });
  });

  formEl.addEventListener("submit", (event: SubmitEvent) => {
    event.preventDefault();

    let isValid = true;
    let firstInvalidField: HTMLInputElement | HTMLTextAreaElement | null = null;

    for (const rule of rules) {
      const fieldValid = validateField(rule);
      if (!fieldValid) {
        isValid = false;
        if (!firstInvalidField) firstInvalidField = getField(rule.id);
      }
    }

    if (!isValid) {
      showFeedback("Revisa los campos marcados antes de continuar.", true);
      firstInvalidField?.focus();
      return;
    }

    showFeedback("Credenciales válidas. Te llevamos a tu cuenta. (Simulación: no hay autenticación real.)", false);
    formEl.reset();

    window.setTimeout(() => {
      window.location.href = "mi-cuenta.html";
    }, 1200);
  });
})();
