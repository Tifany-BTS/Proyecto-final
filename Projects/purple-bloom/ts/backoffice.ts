(function (): void {
  // --- Toasts --------------------------------------------------------------

  const TOAST_LIFETIME_MS = 5000;
  const MAX_VISIBLE_TOASTS = 3;

  function showToast(message: string, variant?: string): void {
    const container = document.querySelector<HTMLElement>(".c-toast-container");
    if (!container) return;

    const toast = document.createElement("div");
    toast.className = "c-toast";
    if (variant) toast.classList.add(`c-toast--${variant}`);
    toast.textContent = message;
    container.appendChild(toast);

    window.setTimeout(() => toast.remove(), TOAST_LIFETIME_MS);

    const toasts = Array.from(container.querySelectorAll<HTMLElement>(".c-toast"));
    toasts.slice(0, Math.max(0, toasts.length - MAX_VISIBLE_TOASTS)).forEach((old) => old.remove());
  }

  function initToastTriggers(): void {
    document.querySelectorAll<HTMLElement>("[data-toast-message]").forEach((trigger) => {
      trigger.addEventListener("click", () => {
        showToast(trigger.dataset.toastMessage ?? "", trigger.dataset.toastVariant);
      });
    });
  }

  // --- Menú de cuenta --------------------------------------------------------

  function initMenus(): void {
    document.querySelectorAll<HTMLButtonElement>(".c-menu-account-toggle").forEach((toggle) => {
      const menuId = toggle.getAttribute("aria-controls");
      const menu = menuId ? document.getElementById(menuId) : null;
      if (!(menu instanceof HTMLUListElement)) return;

      const setOpen = (open: boolean): void => {
        menu.hidden = !open;
        toggle.setAttribute("aria-expanded", String(open));
      };

      toggle.addEventListener("click", () => setOpen(Boolean(menu.hidden)));

      document.addEventListener("keydown", (event: KeyboardEvent) => {
        if (event.key === "Escape" && !menu.hidden) {
          setOpen(false);
          toggle.focus();
        }
      });

      document.addEventListener("click", (event: MouseEvent) => {
        const target = event.target;
        if (!(target instanceof Node)) return;
        if (!menu.hidden && !menu.contains(target) && !toggle.contains(target)) setOpen(false);
      });

      menu.querySelector<HTMLButtonElement>("[data-logout]")?.addEventListener("click", () => {
        setOpen(false);
        showToast("Sesión cerrada (simulado).", "success");
      });
    });
  }

  // --- Alertas ---------------------------------------------------------------

  function initAlerts(): void {
    document.querySelectorAll<HTMLButtonElement>(".c-alert-close").forEach((button) => {
      button.addEventListener("click", () => {
        button.closest(".c-alert")?.remove();
      });
    });
  }

  // --- Buscador --------------------------------------------------------------

  function initSearch(): void {
    document.querySelectorAll<HTMLFormElement>(".c-search").forEach((form) => {
      const input = form.querySelector<HTMLInputElement>("input");

      form.addEventListener("submit", (event: SubmitEvent) => {
        event.preventDefault();
        const query = input?.value.trim() ?? "";
        showToast(query ? `Buscando: ${query}` : "Escribe algo para buscar.");
      });
    });
  }

  // --- Eliminar pedido (diálogo de confirmación) ------------------------------

  function initOrderDelete(): void {
    const dialog = document.querySelector<HTMLDialogElement>("#dialog-delete-order");
    if (!dialog) return;

    const targetEl = dialog.querySelector<HTMLElement>("[data-dialog-target]");
    let opener: HTMLElement | null = null;
    let orderId = "";

    document.querySelectorAll<HTMLButtonElement>("[data-delete-order]").forEach((button) => {
      button.addEventListener("click", () => {
        opener = button;
        orderId = button.dataset.deleteOrder ?? "";
        if (targetEl) targetEl.textContent = orderId;
        dialog.showModal();
      });
    });

    dialog.addEventListener("close", () => {
      if (opener?.isConnected) opener.focus();
    });

    dialog.querySelector<HTMLButtonElement>("[data-dialog-cancel]")?.addEventListener("click", () => {
      dialog.close();
    });

    dialog.querySelector<HTMLButtonElement>("[data-dialog-confirm]")?.addEventListener("click", () => {
      const row = opener?.closest("tr") ?? null;
      const tbody = row?.parentElement ?? null;
      const neighbour = row?.nextElementSibling ?? row?.previousElementSibling ?? null;
      const nextFocus = neighbour?.querySelector<HTMLElement>("[data-delete-order]") ?? null;

      row?.remove();

      if (tbody && tbody.children.length === 0) {
        const emptyRow = document.createElement("tr");
        const cell = document.createElement("td");
        cell.colSpan = 6;
        cell.className = "c-table-empty";
        cell.textContent = "No hay pedidos recientes.";
        emptyRow.appendChild(cell);
        tbody.appendChild(emptyRow);
      }

      opener = nextFocus ?? document.querySelector<HTMLElement>("#pedidos-heading");
      dialog.close();
      opener?.focus();
      showToast(`Pedido ${orderId} eliminado.`, "success");
    });
  }

  // --- Formularios del perfil ------------------------------------------------
  // Mismo patrón que ts/login-form.ts: valida en blur, revalida en vivo los
  // campos ya tocados y, al enviar, valida todo, enfoca el primero inválido y
  // resume el resultado en .c-form-feedback.

  const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  const PASSWORD_MIN_LENGTH = 6;

  type Rule = (value: string, form: HTMLFormElement) => string | null;

  const rules: Record<string, Rule> = {
    "p-nombre": (value) => (value.trim().length === 0 ? "Ingresa tu nombre." : null),
    "p-email": (value) => {
      const trimmed = value.trim();
      if (trimmed.length === 0) return "Ingresa tu correo electrónico.";
      if (!EMAIL_PATTERN.test(trimmed)) return "Ingresa un correo electrónico válido.";
      return null;
    },
    "p-actual": (value) => (value.length === 0 ? "Ingresa tu contraseña actual." : null),
    "p-nueva": (value) => {
      if (value.length === 0) return "Ingresa una contraseña nueva.";
      if (value.length < PASSWORD_MIN_LENGTH) {
        return `La contraseña debe tener al menos ${PASSWORD_MIN_LENGTH} caracteres.`;
      }
      return null;
    },
    "p-confirmar": (value, form) => {
      if (value.length === 0) return "Confirma la nueva contraseña.";
      const nueva = form.querySelector<HTMLInputElement>("#p-nueva");
      return nueva && value !== nueva.value ? "Las contraseñas no coinciden." : null;
    },
  };

  function initValidatedForms(): void {
    document.querySelectorAll<HTMLFormElement>("[data-validated-form]").forEach((form) => {
      const feedback = form.querySelector<HTMLElement>(".c-form-feedback");
      const fields = Array.from(form.querySelectorAll<HTMLInputElement>("input[id]")).filter(
        (field) => field.id in rules,
      );
      if (!feedback || fields.length === 0) return;

      const feedbackEl = feedback;
      const touched = new Set<HTMLInputElement>();

      function validateField(field: HTMLInputElement): boolean {
        const message = rules[field.id](field.value, form);
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
          touched.forEach((touchedField) => validateField(touchedField));
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

        showFeedback(form.dataset.successMessage ?? "Cambios guardados.", false);

        if (form.hasAttribute("data-reset-on-success")) {
          form.reset();
          touched.clear();
        }
      });
    });
  }

  // --- Preferencia de tema (misma clave "theme" que ts/theme.ts) ---------------

  function initThemeSwitch(): void {
    const input = document.querySelector<HTMLInputElement>("[data-theme-switch]");
    if (!input) return;

    const root = document.documentElement;
    const explicit = root.getAttribute("data-theme");
    input.checked = explicit ? explicit === "dark" : window.matchMedia("(prefers-color-scheme: dark)").matches;

    input.addEventListener("change", () => {
      const theme = input.checked ? "dark" : "light";
      root.setAttribute("data-theme", theme);
      try {
        localStorage.setItem("theme", theme);
      } catch {
        // Sin almacenamiento disponible: el cambio aplica solo a esta visita.
      }
    });
  }

  initAlerts();
  initMenus();
  initOrderDelete();
  initSearch();
  initThemeSwitch();
  initToastTriggers();
  initValidatedForms();
})();
