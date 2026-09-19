(function (): void {
  // --- Dialogs -------------------------------------------------------

  function initDialogs(): void {
    const dialogs = document.querySelectorAll<HTMLDialogElement>(".c-dialog");

    dialogs.forEach((dialog) => {
      const triggerId = dialog.getAttribute("data-dialog-trigger");
      const trigger = triggerId ? document.getElementById(triggerId) : null;
      let opener: HTMLElement | null = null;

      trigger?.addEventListener("click", () => {
        opener = document.activeElement as HTMLElement | null;
        dialog.showModal();
      });

      dialog.addEventListener("close", () => {
        opener?.focus();
      });

      dialog.querySelectorAll<HTMLButtonElement>("[data-dialog-cancel], [data-dialog-confirm]").forEach((button) => {
        button.addEventListener("click", () => {
          dialog.close();
        });
      });
    });
  }

  // --- Menús -----------------------------------------------------------

  function initMenus(): void {
    const toggles = document.querySelectorAll<HTMLButtonElement>(".c-menu-account-toggle");

    function closeMenu(toggle: HTMLButtonElement, menu: HTMLUListElement): void {
      menu.hidden = true;
      toggle.setAttribute("aria-expanded", "false");
    }

    function openMenu(toggle: HTMLButtonElement, menu: HTMLUListElement): void {
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
      if (!(menu instanceof HTMLUListElement)) return;

      toggle.addEventListener("click", () => {
        if (menu.hidden) {
          openMenu(toggle, menu);
        } else {
          closeMenu(toggle, menu);
        }
      });

      document.addEventListener("keydown", (event: KeyboardEvent) => {
        if (event.key === "Escape" && !menu.hidden) {
          closeMenu(toggle, menu);
          toggle.focus();
        }
      });

      document.addEventListener("click", (event: MouseEvent) => {
        const target = event.target;
        if (!(target instanceof Node)) return;
        if (!menu.hidden && !menu.contains(target) && !toggle.contains(target)) {
          closeMenu(toggle, menu);
        }
      });
    });
  }

  // --- Toasts ------------------------------------------------------------

  const TOAST_LIFETIME_MS = 5000;
  const MAX_VISIBLE_TOASTS = 3;

  function dismissToast(toast: HTMLElement): void {
    toast.remove();
  }

  function enforceMaxToasts(container: HTMLElement): void {
    const toasts = Array.from(container.querySelectorAll<HTMLElement>(".c-toast"));
    const overflow = toasts.length - MAX_VISIBLE_TOASTS;
    for (let i = 0; i < overflow; i++) {
      dismissToast(toasts[i]);
    }
  }

  function scheduleDismiss(toast: HTMLElement): void {
    window.setTimeout(() => dismissToast(toast), TOAST_LIFETIME_MS);
  }

  function initToasts(): void {
    const container = document.querySelector<HTMLElement>(".c-toast-container");
    if (!container) return;

    container.querySelectorAll<HTMLElement>(".c-toast").forEach(scheduleDismiss);
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

  function initToastTriggers(): void {
    const container = document.querySelector<HTMLElement>(".c-toast-container");
    if (!container) return;

    document.querySelectorAll<HTMLButtonElement>("[data-toast-message]").forEach((trigger) => {
      trigger.addEventListener("click", () => {
        const toast = document.createElement("div");
        toast.className = "c-toast";
        const variant = trigger.dataset.toastVariant;
        if (variant) toast.classList.add(`c-toast--${variant}`);
        toast.textContent = trigger.dataset.toastMessage ?? "";
        container.appendChild(toast);
      });
    });
  }

  // --- Alerts ------------------------------------------------------------

  function initAlerts(): void {
    document.querySelectorAll<HTMLButtonElement>(".c-alert-close").forEach((button) => {
      button.addEventListener("click", () => {
        button.closest(".c-alert")?.remove();
      });
    });
  }

  // --- Buscador ----------------------------------------------------------

  function initSearch(): void {
    document.querySelectorAll<HTMLFormElement>(".c-search").forEach((form) => {
      const input = form.querySelector<HTMLInputElement>("input");
      const status = form.parentElement?.querySelector<HTMLElement>("[data-search-status]");

      form.addEventListener("submit", (event: SubmitEvent) => {
        event.preventDefault();
        if (!status) return;
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

  function validateInput(field: HTMLInputElement): string | null {
    if (field.type === "email") {
      const value = field.value.trim();
      if (value.length === 0) return "Ingresa tu correo electrónico.";
      if (!EMAIL_PATTERN.test(value)) return "Ingresa un correo electrónico válido.";
    }

    if (field.type === "password") {
      if (field.value.length === 0) return "Ingresa tu contraseña.";
      if (field.value.length < PASSWORD_MIN_LENGTH) {
        return `La contraseña debe tener al menos ${PASSWORD_MIN_LENGTH} caracteres.`;
      }
    }

    return null;
  }

  function initForms(): void {
    document.querySelectorAll<HTMLFormElement>(".c-form").forEach((form) => {
      const feedback = form.querySelector<HTMLElement>(".c-form-feedback");
      const fields = Array.from(form.querySelectorAll<HTMLInputElement>(".c-input--validated"));
      if (!feedback || fields.length === 0) return;

      const feedbackEl = feedback;
      const touched = new Set<HTMLInputElement>();

      function validateField(field: HTMLInputElement): boolean {
        const message = validateInput(field);
        const errorEl = form.querySelector<HTMLElement>(`#${field.id}-error`);

        if (message) {
          field.setAttribute("aria-invalid", "true");
        } else {
          field.removeAttribute("aria-invalid");
        }
        if (errorEl) errorEl.textContent = message ?? "";

        return message === null;
      }

      function showFeedback(message: string, isError: boolean): void {
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
          if (touched.has(field)) validateField(field);
        });
      });

      form.addEventListener("submit", (event: SubmitEvent) => {
        event.preventDefault();

        let firstInvalidField: HTMLInputElement | null = null;

        for (const field of fields) {
          touched.add(field);
          if (!validateField(field) && !firstInvalidField) firstInvalidField = field;
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
