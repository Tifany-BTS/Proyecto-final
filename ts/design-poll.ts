(function (): void {
  // "Diseña con nosotras" (noticias.html): encuesta de una sola pregunta
  // con radios reales (el estado visual del círculo lo pinta el CSS por
  // selectores de hermano, sin JS). Sin backend: al enviar solo se valida
  // que haya una opción elegida y se muestra un agradecimiento, mismo
  // patrón que contact-form.ts.
  const form = document.getElementById("design-poll-form") as HTMLFormElement | null;
  const feedback = form?.querySelector<HTMLElement>(".form-feedback") ?? null;
  if (!form || !feedback) return;

  const formEl = form;
  const feedbackEl = feedback;

  function showFeedback(message: string, isError: boolean): void {
    feedbackEl.textContent = message;
    feedbackEl.classList.toggle("form-feedback--error", isError);
    feedbackEl.classList.toggle("form-feedback--success", !isError);
  }

  formEl.addEventListener("submit", (event: SubmitEvent) => {
    event.preventDefault();

    const selected = formEl.querySelector<HTMLInputElement>('input[name="design-poll"]:checked');
    if (!selected) {
      showFeedback("Elegí una opción antes de votar.", true);
      return;
    }

    showFeedback("¡Gracias por tu voto! Lo sumamos a las ideas para la próxima colección.", false);
    pbTrack("Encuesta de diseño respondida", { opcion: selected.value });

    formEl.querySelectorAll<HTMLInputElement>('input[name="design-poll"]').forEach((input) => {
      input.disabled = true;
    });
    const submitBtn = formEl.querySelector<HTMLButtonElement>("button[type='submit']");
    if (submitBtn) {
      submitBtn.disabled = true;
      pbPetalBurst(submitBtn);
    }
  });
})();
