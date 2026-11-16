(function (): void {
  // Reseñas de producto (producto.html). Cada cuenta puede dejar una reseña
  // por producto —estrellas, cómo le quedó la talla y un comentario—, y
  // editarla o borrarla después. Cada reseña muestra la foto de perfil,
  // nombre y @usuario de quien la escribió (Mi cuenta), como un comentario
  // de TikTok. No hay backend: se guardan en este navegador
  // (pb-reviews:<id de producto>), así que solo las ve quien las escribió en
  // este mismo navegador — la sección lo dice, igual que Mi cuenta.
  const sectionEl = document.getElementById("product-reviews");
  const productId = new URLSearchParams(window.location.search).get("id");
  const product = productId ? findPurpleBloomProduct(productId) : undefined;
  if (!sectionEl || !product) return;

  // Reasignados a const con tipo explícito: dentro de las funciones de
  // abajo, TypeScript no conserva el angostamiento de una const capturada.
  const section: HTMLElement = sectionEl;
  const productRef: PurpleBloomProduct = product;

  type Fit = "chica" | "justa" | "grande";

  interface Review {
    email: string;
    name: string;
    rating: number;
    fit: Fit;
    text: string;
    date: string;
  }

  const FIT_LABELS: Record<Fit, string> = {
    chica: "Me quedó chica",
    justa: "Talla justa",
    grande: "Me quedó grande",
  };
  const STAR_LABELS = ["Malo", "Regular", "Bueno", "Muy bueno", "¡Me encanta!"];
  const MIN_TEXT = 10;
  const MAX_TEXT = 500;
  const STAR_PATH = "M12 2.5l2.9 6.2 6.8.8-5 4.7 1.3 6.7L12 17.6 6 20.9l1.3-6.7-5-4.7 6.8-.8L12 2.5z";

  const storageKey = `pb-reviews:${productRef.id}`;

  // ---------- Datos ----------

  function isReview(value: unknown): value is Review {
    const r = value as Review;
    return (
      Boolean(r) &&
      typeof r.email === "string" &&
      typeof r.name === "string" &&
      typeof r.text === "string" &&
      typeof r.date === "string" &&
      Number.isInteger(r.rating) &&
      r.rating >= 1 &&
      r.rating <= 5 &&
      (r.fit === "chica" || r.fit === "justa" || r.fit === "grande")
    );
  }

  function getReviews(): Review[] {
    try {
      const parsed = JSON.parse(localStorage.getItem(storageKey) ?? "[]");
      return Array.isArray(parsed) ? parsed.filter(isReview) : [];
    } catch {
      return [];
    }
  }

  function saveReviews(reviews: Review[]): boolean {
    try {
      localStorage.setItem(storageKey, JSON.stringify(reviews));
      return true;
    } catch {
      return false;
    }
  }

  // Foto de perfil de quien escribió la reseña (no solo de la cuenta activa):
  // se lee en vivo, así si alguien cambia su foto en Mi cuenta, sus reseñas
  // se actualizan solas.
  function avatarOf(email: string): string | null {
    try {
      const stored = localStorage.getItem(`pb-avatar:${email}`);
      return stored && stored.startsWith("data:image/") ? stored : null;
    } catch {
      return null;
    }
  }

  // ---------- Helpers de HTML ----------

  function escapeHtml(value: string): string {
    return value
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;")
      .replace(/'/g, "&#39;");
  }

  function starsHtml(value: number, className: string): string {
    const fill = Math.round((value / 5) * 1000) / 10;
    return `<span class="${className}" style="--rating-fill:${fill}%" aria-hidden="true">★★★★★</span>`;
  }

  function avatarHtml(email: string, name: string): string {
    const src = avatarOf(email);
    return src
      ? `<img class="review__avatar" src="${src}" alt="" width="48" height="48">`
      : `<span class="review__avatar review__avatar--initial" aria-hidden="true">${escapeHtml(name.charAt(0).toUpperCase())}</span>`;
  }

  function formatDate(iso: string): string {
    const date = new Date(iso);
    return Number.isNaN(date.getTime())
      ? ""
      : date.toLocaleDateString("es", { day: "numeric", month: "long", year: "numeric" });
  }

  function handleOf(email: string): string {
    return `@${email.split("@")[0]}`;
  }

  // ---------- Resumen ----------

  function summaryHtml(reviews: Review[]): string {
    if (reviews.length === 0) {
      return `<p class="product-reviews__empty">Todavía no hay reseñas de ${escapeHtml(productRef.name)}. ¡Sé la primera en opinar!</p>`;
    }
    const average = reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length;
    const label = average.toFixed(1).replace(".", ",");
    const fits = (["chica", "justa", "grande"] as Fit[]).map((fit) => {
      const count = reviews.filter((r) => r.fit === fit).length;
      const percent = Math.round((count / reviews.length) * 100);
      return `
        <li class="product-reviews__fit-row">
          <span>${FIT_LABELS[fit]}</span>
          <span class="product-reviews__fit-bar" aria-hidden="true"><span style="width:${percent}%"></span></span>
          <span class="product-reviews__fit-value">${percent}%</span>
        </li>`;
    });
    return `
      <div class="product-reviews__summary">
        <div class="product-reviews__score">
          <p class="product-reviews__average">${label}</p>
          ${starsHtml(average, "product-reviews__stars")}
          <p class="product-reviews__count">${reviews.length} ${reviews.length === 1 ? "reseña" : "reseñas"}</p>
          <span class="visually-hidden">Promedio ${label} de 5 estrellas.</span>
        </div>
        <div class="product-reviews__fit">
          <p class="product-reviews__fit-title">¿Cómo queda la talla?</p>
          <ul class="product-reviews__fit-list" role="list">${fits.join("")}</ul>
        </div>
      </div>`;
  }

  // ---------- Formulario ----------

  function formHtml(user: PbSessionUser, mine: Review | undefined): string {
    const rating = mine?.rating ?? 0;
    const stars = [1, 2, 3, 4, 5]
      .map(
        (value) => `
          <label class="review-form__star" title="${STAR_LABELS[value - 1]}">
            <input type="radio" name="review-rating" value="${value}" class="review-form__star-input" ${value === rating ? "checked" : ""}>
            <svg aria-hidden="true" width="28" height="28" viewBox="0 0 24 24"><path d="${STAR_PATH}"/></svg>
            <span class="visually-hidden">${value} ${value === 1 ? "estrella" : "estrellas"}: ${STAR_LABELS[value - 1]}</span>
          </label>`
      )
      .join("");
    const fits = (Object.keys(FIT_LABELS) as Fit[])
      .map(
        (fit) => `
          <label class="review-form__fit">
            <input type="radio" name="review-fit" value="${fit}" class="review-form__fit-input" ${mine?.fit === fit ? "checked" : ""}>
            <span class="review-form__fit-chip">${FIT_LABELS[fit]}</span>
          </label>`
      )
      .join("");

    return `
      <form class="review-form" novalidate>
        <div class="review-form__author">
          ${avatarHtml(user.email, user.name)}
          <div>
            <p class="review__name">${escapeHtml(user.name)}</p>
            <p class="review__handle">${escapeHtml(handleOf(user.email))}</p>
          </div>
        </div>

        <fieldset class="review-form__group">
          <legend class="review-form__legend">Tu calificación</legend>
          <div class="review-form__stars">${stars}</div>
          <span class="review-form__star-label" data-star-label aria-hidden="true">${rating ? STAR_LABELS[rating - 1] : ""}</span>
        </fieldset>

        <fieldset class="review-form__group">
          <legend class="review-form__legend">¿Cómo te quedó la talla?</legend>
          <div class="review-form__fits">${fits}</div>
        </fieldset>

        <div class="form-group">
          <label for="review-text">Tu comentario</label>
          <textarea id="review-text" name="review-text" rows="4" maxlength="${MAX_TEXT}" placeholder=" " aria-describedby="review-text-count">${escapeHtml(mine?.text ?? "")}</textarea>
          <span class="review-form__count" id="review-text-count" data-text-count>${(mine?.text ?? "").length}/${MAX_TEXT}</span>
        </div>

        <div class="review-form__actions">
          <button type="submit" class="btn btn--primary">${mine ? "Actualizar reseña" : "Publicar reseña"}</button>
          ${mine ? '<button type="button" class="btn btn--outline" data-review-delete>Borrar mi reseña</button>' : ""}
        </div>
        <p class="form-feedback" data-review-feedback aria-live="polite"></p>
      </form>`;
  }

  function guestHtml(): string {
    return `
      <p class="product-reviews__guest">
        <a href="iniciar-sesion.html">Iniciá sesión</a> para dejar tu reseña con tu foto de perfil.
      </p>`;
  }

  // ---------- Lista ----------

  function reviewHtml(review: Review, isMine: boolean): string {
    return `
      <li class="review${isMine ? " review--mine" : ""}">
        ${avatarHtml(review.email, review.name)}
        <div class="review__body">
          <div class="review__meta">
            <p class="review__name">${escapeHtml(review.name)}${isMine ? ' <span class="review__badge">Tu reseña</span>' : ""}</p>
            <p class="review__handle">${escapeHtml(handleOf(review.email))} · ${formatDate(review.date)}</p>
          </div>
          <p class="review__rating">
            ${starsHtml(review.rating, "review__stars")}
            <span class="visually-hidden">${review.rating} de 5 estrellas.</span>
            <span class="review__fit">${FIT_LABELS[review.fit]}</span>
          </p>
          <p class="review__text">${escapeHtml(review.text)}</p>
        </div>
      </li>`;
  }

  // ---------- Render ----------

  function render(message?: { text: string; isError?: boolean }): void {
    const user = pbSessionGet();
    const reviews = getReviews().sort((a, b) => b.date.localeCompare(a.date));
    const found = user ? reviews.find((r) => r.email === user.email) : undefined;
    // La propia se muestra con el nombre actual (puede haberlo cambiado en
    // Mis datos después de escribirla).
    const mine = found && user ? { ...found, name: user.name } : undefined;
    if (found && mine) reviews.splice(reviews.indexOf(found), 1, mine);
    // La reseña propia va primero, como en las apps de reseñas.
    const ordered = mine ? [mine, ...reviews.filter((r) => r !== mine)] : reviews;

    section.innerHTML = `
      <div class="container">
        <header class="section-header">
          <h2 id="reviews-heading">Reseñas</h2>
          <p>Lo que opinan quienes ya compraron ${escapeHtml(productRef.name)}.</p>
        </header>
        <div class="product-reviews__layout">
          <div class="product-reviews__side">
            ${summaryHtml(reviews)}
            ${user ? formHtml(user, mine) : guestHtml()}
          </div>
          ${ordered.length > 0 ? `<ul class="product-reviews__list" role="list">${ordered.map((r) => reviewHtml(r, r === mine)).join("")}</ul>` : ""}
        </div>
        <p class="content-note">Las reseñas se guardan en este navegador: no hay un servidor que las comparta con otras personas.</p>
      </div>`;

    if (message) {
      const feedback = section.querySelector<HTMLElement>("[data-review-feedback]");
      if (feedback) {
        feedback.textContent = message.text;
        feedback.classList.add(message.isError ? "form-feedback--error" : "form-feedback--success");
      }
    }
    if (user) wireForm(user);
  }

  function paintStars(form: HTMLFormElement, value: number): void {
    form.querySelectorAll<HTMLElement>(".review-form__star").forEach((star, i) => {
      star.classList.toggle("review-form__star--filled", i < value);
    });
  }

  function wireForm(user: PbSessionUser): void {
    const form = section.querySelector<HTMLFormElement>(".review-form");
    if (!form) return;
    const textField = form.querySelector<HTMLTextAreaElement>("#review-text");
    const counter = form.querySelector<HTMLElement>("[data-text-count]");
    const starLabel = form.querySelector<HTMLElement>("[data-star-label]");
    const feedback = form.querySelector<HTMLElement>("[data-review-feedback]");

    const checkedRating = (): number => Number(form.querySelector<HTMLInputElement>('input[name="review-rating"]:checked')?.value ?? 0);
    paintStars(form, checkedRating());

    form.querySelectorAll<HTMLInputElement>('input[name="review-rating"]').forEach((radio) => {
      radio.addEventListener("change", () => {
        const value = Number(radio.value);
        paintStars(form, value);
        if (starLabel) starLabel.textContent = STAR_LABELS[value - 1];
      });
    });

    // Vista previa al pasar el mouse; al salir vuelve a lo elegido.
    const starsBox = form.querySelector<HTMLElement>(".review-form__stars");
    form.querySelectorAll<HTMLElement>(".review-form__star").forEach((star, i) => {
      star.addEventListener("mouseenter", () => paintStars(form, i + 1));
    });
    starsBox?.addEventListener("mouseleave", () => paintStars(form, checkedRating()));

    textField?.addEventListener("input", () => {
      if (counter) counter.textContent = `${textField.value.length}/${MAX_TEXT}`;
    });

    function fail(text: string, focus?: HTMLElement | null): void {
      if (feedback) {
        feedback.textContent = text;
        feedback.classList.add("form-feedback--error");
        feedback.classList.remove("form-feedback--success");
      }
      focus?.focus();
    }

    form.addEventListener("submit", (event) => {
      event.preventDefault();
      const rating = checkedRating();
      const fit = form.querySelector<HTMLInputElement>('input[name="review-fit"]:checked')?.value as Fit | undefined;
      const text = textField?.value.trim() ?? "";

      if (!rating) return fail("Elegí cuántas estrellas le das.", form.querySelector<HTMLInputElement>('input[name="review-rating"]'));
      if (!fit) return fail("Contanos cómo te quedó la talla.", form.querySelector<HTMLInputElement>('input[name="review-fit"]'));
      if (text.length < MIN_TEXT) return fail(`Escribí al menos ${MIN_TEXT} caracteres en tu comentario.`, textField);

      const others = getReviews().filter((r) => r.email !== user.email);
      const hadReview = others.length !== getReviews().length;
      const review: Review = { email: user.email, name: user.name, rating, fit, text: text.slice(0, MAX_TEXT), date: new Date().toISOString() };
      if (!saveReviews([review, ...others])) return fail("Tu navegador no nos dejó guardar la reseña.");

      pbTrack(hadReview ? "Reseña actualizada" : "Reseña publicada", { producto: productRef.id, estrellas: rating });
      render({ text: hadReview ? "Actualizamos tu reseña." : "¡Gracias! Publicamos tu reseña." });
      const submit = section.querySelector<HTMLElement>('.review-form button[type="submit"]');
      if (submit) pbPetalBurst(submit);
    });

    form.querySelector("[data-review-delete]")?.addEventListener("click", () => {
      saveReviews(getReviews().filter((r) => r.email !== user.email));
      pbTrack("Reseña borrada", { producto: productRef.id });
      render({ text: "Borramos tu reseña." });
    });
  }

  // Antes de "Te recomendamos" (lo dibuja product-detail.js, que corre antes
  // que este script): las opiniones van pegadas al producto que describen.
  const related = document.querySelector(".product-related");
  if (related) related.before(section);
  section.hidden = false;

  // Un cambio de nombre o de foto en otra pestaña se refleja acá también.
  window.addEventListener("storage", (event) => {
    if (event.key === null || event.key === storageKey || event.key.startsWith("pb-avatar:")) render();
  });

  render();
})();
