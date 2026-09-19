(function (): void {
  const form = document.querySelector<HTMLFormElement>(".register-form");
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
      id: "nombre-registro",
      validate: (value) => {
        const trimmed = value.trim();
        if (trimmed.length === 0) return "Ingresá tu nombre.";
        if (trimmed.length < 2) return "El nombre es demasiado corto.";
        return null;
      },
    },
    {
      id: "email-registro",
      validate: (value) => {
        const trimmed = value.trim();
        if (trimmed.length === 0) return "Ingresá tu correo electrónico.";
        if (!EMAIL_PATTERN.test(trimmed)) return "Ingresá un correo electrónico válido.";
        return null;
      },
    },
    {
      id: "password-registro",
      validate: (value) => {
        if (value.length === 0) return "Ingresá una contraseña.";
        if (value.length < PASSWORD_MIN_LENGTH) return `La contraseña debe tener al menos ${PASSWORD_MIN_LENGTH} caracteres.`;
        return null;
      },
    },
    {
      id: "password-confirmar",
      validate: (value) => {
        const passwordField = formEl.querySelector<HTMLInputElement>("#password-registro");
        if (value.length === 0) return "Confirmá tu contraseña.";
        if (passwordField && value !== passwordField.value) return "Las contraseñas no coinciden.";
        return null;
      },
    },
  ];

  function getField(id: string): HTMLInputElement | null {
    return formEl.querySelector<HTMLInputElement>(`#${id}`);
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
      // Re-check the confirm field live once the password field changes,
      // since its validity depends on the password field's current value.
      if (rule.id === "password-registro" && touched.has("password-confirmar")) {
        const confirmRule = rules.find((r) => r.id === "password-confirmar");
        if (confirmRule) validateField(confirmRule);
      }
    });
  });

  formEl.addEventListener("submit", (event: SubmitEvent) => {
    event.preventDefault();

    let isValid = true;
    let firstInvalidField: HTMLInputElement | null = null;

    for (const rule of rules) {
      const fieldValid = validateField(rule);
      if (!fieldValid) {
        isValid = false;
        if (!firstInvalidField) firstInvalidField = getField(rule.id);
      }
    }

    if (!isValid) {
      feedbackEl.textContent = "Revisá los campos marcados antes de continuar.";
      feedbackEl.classList.add("form-feedback--error");
      feedbackEl.classList.remove("form-feedback--success");
      firstInvalidField?.focus();
      return;
    }

    feedbackEl.textContent = "¡Cuenta creada! Te llevamos a tu cuenta. (Simulación: no se guardó ningún dato en un servidor.)";
    feedbackEl.classList.add("form-feedback--success");
    feedbackEl.classList.remove("form-feedback--error");
    formEl.reset();

    window.setTimeout(() => {
      window.location.href = "mi-cuenta.html";
    }, 1200);
  });
})();
