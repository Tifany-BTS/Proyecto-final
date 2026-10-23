(function (): void {
  // size: talla elegida en la tarjeta o en la página de producto. Opcional
  // porque los carritos guardados antes de que existiera no la tienen.
  type CartLine = { id: string; qty: number; color?: string; size?: string };

  const CART_KEY = "cart";

  // Misma prenda en otro color u otra talla es otra línea del carrito.
  function isSameLine(line: CartLine, id: string, color?: string, size?: string): boolean {
    return line.id === id && line.color === color && line.size === size;
  }

  function makeLine(id: string, qty: number, color?: string, size?: string): CartLine {
    const line: CartLine = { id, qty };
    if (color) line.color = color;
    if (size) line.size = size;
    return line;
  }

  function getCart(): CartLine[] {
    const raw = localStorage.getItem(CART_KEY);
    if (!raw) return [];
    try {
      const parsed = JSON.parse(raw) as CartLine[];
      if (!Array.isArray(parsed)) return [];
      const valid = parsed.filter(
        (line) =>
          typeof line.id === "string" &&
          typeof line.qty === "number" &&
          (line.color === undefined || typeof line.color === "string") &&
          (line.size === undefined || typeof line.size === "string") &&
          findPurpleBloomProduct(line.id) !== undefined
      );

      const lines: CartLine[] = [];
      for (const line of valid) {
        const product = findPurpleBloomProduct(line.id);
        const color = product?.colors?.some((option) => option.name === line.color) ? line.color : undefined;
        const existing = lines.find((other) => isSameLine(other, line.id, color, line.size));
        if (existing) {
          existing.qty += line.qty;
        } else {
          lines.push(makeLine(line.id, line.qty, color, line.size));
        }
      }
      return lines;
    } catch {
      return [];
    }
  }

  function saveCart(lines: CartLine[]): void {
    localStorage.setItem(CART_KEY, JSON.stringify(lines));
  }

  // Products with colour variants are always stored with a colour (the
  // default one if none was picked), so "add from a card" and "add from the
  // product page" end up on the same cart line.
  function resolveColor(product: PurpleBloomProduct | undefined, color?: string): string | undefined {
    if (!product?.colors) return undefined;
    return product.colors.some((option) => option.name === color) ? color : product.colors[0].name;
  }

  // qty: la página de producto agrega varias unidades de una vez; se suman en
  // una sola llamada para que el aviso de calificación y la analítica salgan
  // una vez, no una por unidad.
  function addToCart(id: string, color?: string, size?: string, qty = 1): void {
    const lines = getCart();
    const product = findPurpleBloomProduct(id);
    const chosenColor = resolveColor(product, color);
    const existing = lines.find((line) => isSameLine(line, id, chosenColor, size));
    if (existing) {
      existing.qty += qty;
    } else {
      lines.push(makeLine(id, qty, chosenColor, size));
    }
    saveCart(lines);
    updateBadges();
    renderCartPage();

    pbTrack("Producto agregado al carrito", {
      productId: id,
      productName: product?.name,
      color: chosenColor,
      size,
      quantity: qty,
      price: product?.price,
    });

    // rating-prompt.ts listens for this to ask the shopper to rate the item.
    document.dispatchEvent(new CustomEvent("purplebloom:cart-added", { detail: { id } }));
  }

  function setQty(id: string, color: string | undefined, size: string | undefined, qty: number): void {
    let lines = getCart();
    if (qty < 1) {
      lines = lines.filter((line) => !isSameLine(line, id, color, size));
    } else {
      const existing = lines.find((line) => isSameLine(line, id, color, size));
      if (existing) existing.qty = qty;
    }
    saveCart(lines);
    updateBadges();
    renderCartPage();
  }

  function removeFromCart(id: string, color: string | undefined, size: string | undefined): void {
    const lines = getCart().filter((line) => !isSameLine(line, id, color, size));
    saveCart(lines);
    updateBadges();
    renderCartPage();
  }

  function cartCount(lines: CartLine[]): number {
    return lines.reduce((sum, line) => sum + line.qty, 0);
  }

  function cartTotal(lines: CartLine[]): number {
    return lines.reduce((sum, line) => {
      const product = findPurpleBloomProduct(line.id);
      return product ? sum + product.price * line.qty : sum;
    }, 0);
  }

  function formatPrice(value: number): string {
    return `$${value.toFixed(2)}`;
  }

  function roundCents(value: number): number {
    return Math.round(value * 100) / 100;
  }

  // Points the shopper can spend on this cart: capped by their balance and by
  // the cart total (10 points = $1, so the discount never exceeds the total).
  function maxRedeemablePoints(subtotal: number, balance: number): number {
    return Math.min(balance, Math.floor(subtotal * PB_POINTS_PER_DOLLAR_OFF));
  }

  function pointsToDollars(points: number): number {
    return roundCents(points / PB_POINTS_PER_DOLLAR_OFF);
  }

  function redeemCheckbox(): HTMLInputElement | null {
    const el = document.getElementById("points-redeem-check");
    return el instanceof HTMLInputElement ? el : null;
  }

  // Points the shopper is redeeming right now (0 unless signed in, ticked and eligible).
  function currentRedeemedPoints(subtotal: number): number {
    if (!pbSessionGet()) return 0;
    const check = redeemCheckbox();
    if (!check || !check.checked) return 0;
    return maxRedeemablePoints(subtotal, pbPointsGet());
  }

  function updateBadges(): void {
    const lines = getCart();
    const count = cartCount(lines);

    document.querySelectorAll<HTMLElement>(".cart-fab__count").forEach((badge) => {
      const previousCount = badge.dataset.count;
      badge.textContent = String(count);
      badge.hidden = count === 0;
      badge.dataset.count = String(count);

      if (previousCount !== undefined && previousCount !== String(count) && count > 0) {
        badge.classList.remove("cart-fab__count--bump");
        void badge.offsetWidth; // restart the animation if it's already running
        badge.classList.add("cart-fab__count--bump");
      }
    });

    const liveRegion = document.getElementById("carrito");
    if (liveRegion) {
      liveRegion.textContent =
        count === 0 ? "Carrito de compras: vacío." : `Carrito de compras: ${count} producto${count === 1 ? "" : "s"}.`;
    }
  }

  function productMediaHtml(product: PurpleBloomProduct, color?: string): string {
    const src = product.colors?.find((option) => option.name === color)?.imageSrc ?? product.imageSrc;
    if (src) {
      return `<img class="cart-item__image" src="${src}" alt="" width="80" height="80">`;
    }
    const variantClass = product.swatch ? ` product-card__image--${product.swatch}` : "";
    return `<div class="cart-item__image product-card__image${variantClass}" aria-hidden="true"></div>`;
  }

  function renderCartPage(): void {
    const itemsEl = document.getElementById("cart-items");
    const submitBtn = document.getElementById("checkout-submit");
    if (!itemsEl) return;

    const lines = getCart();

    if (lines.length === 0) {
      itemsEl.innerHTML =
        '<p class="cart-page__empty">Tu carrito está vacío. <a href="catalogo.html">Explora el catálogo</a>.</p>' +
        '<img class="cart-page__empty-image" src="img/carrito-vacio.png" alt="" width="480" height="274">';
    } else {
      // Table-style card: a Producto / Cantidad / Precio header, then one
      // block per line. The last block's footer also carries the cart subtotal.
      const rows = lines
        .map((line, index) => {
          const product = findPurpleBloomProduct(line.id);
          if (!product) return "";
          const linePrice = product.price * line.qty;
          const isLast = index === lines.length - 1;
          // Nombre accesible con talla y color: si hay dos líneas de la misma
          // prenda, "Quitar Blusa Lavanda" no diría cuál de las dos.
          const variant = [line.color, line.size ? `talla ${line.size}` : ""].filter(Boolean).join(", ");
          const label = variant ? `${product.name} (${variant})` : product.name;
          const lineData = `data-id="${product.id}" data-color="${line.color ?? ""}" data-size="${line.size ?? ""}"`;
          return `
            <article class="cart-item" data-cart-item="${product.id}">
              <div class="cart-item__product">
                ${productMediaHtml(product, line.color)}
                <div class="cart-item__info">
                  <h2 class="cart-item__name"><a href="producto.html?id=${product.id}">${product.name}</a></h2>
                  ${line.color ? `<p class="cart-item__color">Color: ${line.color}</p>` : ""}
                  ${line.size ? `<p class="cart-item__color">Talla: ${line.size}</p>` : ""}
                  <p class="cart-item__price">${formatPrice(product.price)}</p>
                </div>
              </div>
              <div class="cart-item__qty">
                <button type="button" class="cart-item__qty-btn" data-action="decrease" ${lineData} aria-label="Quitar una unidad de ${label}">&minus;</button>
                <span class="cart-item__qty-value"><span class="visually-hidden">Cantidad: </span>${line.qty}</span>
                <button type="button" class="cart-item__qty-btn" data-action="increase" ${lineData} aria-label="Agregar una unidad de ${label}">+</button>
              </div>
              <p class="cart-item__line-price">${formatPrice(linePrice)}</p>
              <div class="cart-item__footer">
                <button type="button" class="cart-item__remove" data-action="remove" ${lineData} aria-label="Quitar ${label} del carrito">
                  <svg aria-hidden="true" width="16" height="16" viewBox="0 0 24 24" fill="none">
                    <path d="M4 7h16M10 11v6M14 11v6M6 7l1 12a2 2 0 002 2h6a2 2 0 002-2l1-12M9 7V4h6v3" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"/>
                  </svg>
                  Quitar
                </button>
                ${isLast ? `<p class="cart-item__subtotal">Subtotal: <strong>${formatPrice(cartTotal(lines))}</strong></p>` : ""}
              </div>
            </article>
          `;
        })
        .join("");

      itemsEl.innerHTML = `
        <div class="cart-table">
          <div class="cart-table__head" aria-hidden="true">
            <span>Producto</span>
            <span>Cantidad</span>
            <span>Precio</span>
          </div>
          ${rows}
        </div>
      `;
    }

    renderTotals(cartTotal(lines));
    if (submitBtn instanceof HTMLButtonElement) submitBtn.disabled = lines.length === 0;
  }

  // Total, points discount line and the "redeem points" block in the summary.
  function renderTotals(subtotal: number): void {
    const totalEl = document.getElementById("cart-total");
    const discountEl = document.getElementById("cart-points-discount");
    const infoEl = document.getElementById("points-redeem-info");
    const optionEl = document.getElementById("points-redeem-option");
    const labelEl = document.getElementById("points-redeem-label");
    const check = redeemCheckbox();
    if (!totalEl) return;

    const user = pbSessionGet();
    const balance = user ? pbPointsGet() : 0;
    const usable = user ? maxRedeemablePoints(subtotal, balance) : 0;

    if (check && usable === 0) check.checked = false;

    const redeemed = currentRedeemedPoints(subtotal);
    const discount = pointsToDollars(redeemed);
    const finalTotal = roundCents(Math.max(0, subtotal - discount));

    totalEl.textContent = formatPrice(finalTotal);

    if (discountEl) {
      discountEl.hidden = redeemed === 0;
      discountEl.textContent = redeemed > 0 ? `Puntos canjeados (${redeemed} pts): −${formatPrice(discount)}` : "";
    }

    if (infoEl) {
      if (!user) {
        infoEl.innerHTML =
          'Con el Club Vip Moda ganas puntos en cada compra y los canjeas por descuentos. <a href="iniciar-sesion.html">Inicia sesión</a> para usarlos.';
      } else {
        const earned = Math.floor(finalTotal * PB_POINTS_EARNED_PER_DOLLAR);
        infoEl.textContent = `Tienes ${balance} puntos (equivalen a ${formatPrice(pointsToDollars(balance))}). Con esta compra ganas ${earned} puntos.`;
      }
    }

    if (optionEl) optionEl.hidden = !user || usable === 0;
    if (labelEl) labelEl.textContent = `Canjear ${usable} puntos y ahorrar ${formatPrice(pointsToDollars(usable))}`;
  }

  // Talla marcada en el selector que card-size.ts pone justo antes del botón
  // de la tarjeta (card-size.ts ya frena el clic si no hay ninguna).
  function cardSize(button: HTMLElement): string | undefined {
    const group = button.previousElementSibling;
    if (!(group instanceof HTMLElement) || !group.classList.contains("card-size")) return undefined;
    return group.querySelector<HTMLInputElement>("input:checked")?.value;
  }

  function wireAddToCartButtons(): void {
    document.querySelectorAll<HTMLElement>('[data-action="add-to-cart"]').forEach((button) => {
      button.addEventListener("click", () => {
        const id = button.getAttribute("data-product-id");
        if (id) addToCart(id, undefined, cardSize(button));
      });
    });

    // The product-detail page builds its "Añadir al carrito" button after
    // this script has already run its initial querySelectorAll above, so it
    // dispatches this event instead of relying on a listener attached here.
    document.addEventListener("purplebloom:add-to-cart", (event) => {
      const detail = (event as CustomEvent<{ id: string; color?: string; size?: string; qty?: number }>).detail;
      if (detail?.id) addToCart(detail.id, detail.color, detail.size, detail.qty ?? 1);
    });
  }

  function wireCartItemActions(): void {
    const itemsEl = document.getElementById("cart-items");
    if (!itemsEl) return;

    itemsEl.addEventListener("click", (event) => {
      const target = event.target as HTMLElement;
      const button = target.closest<HTMLElement>("[data-action]");
      if (!button) return;

      const id = button.getAttribute("data-id");
      const action = button.getAttribute("data-action");
      if (!id || !action) return;

      const color = button.getAttribute("data-color") || undefined;
      const size = button.getAttribute("data-size") || undefined;
      const current = getCart().find((line) => isSameLine(line, id, color, size))?.qty ?? 0;

      if (action === "increase") setQty(id, color, size, current + 1);
      if (action === "decrease") setQty(id, color, size, current - 1);
      if (action === "remove") removeFromCart(id, color, size);

      restoreFocus(button, action);
    });
  }

  // Cada cambio vuelve a dibujar la lista, así que el botón que tenía el foco
  // desaparece y el foco de teclado se iría al inicio de la página. Se devuelve
  // al mismo botón de la línea nueva; si la línea ya no existe (se quitó), al
  // título del carrito.
  function restoreFocus(oldButton: HTMLElement, action: string): void {
    const itemsEl = document.getElementById("cart-items");
    if (!itemsEl) return;
    const sameButton = Array.from(itemsEl.querySelectorAll<HTMLElement>(`[data-action="${action}"]`)).find(
      (candidate) =>
        candidate.dataset.id === oldButton.dataset.id &&
        candidate.dataset.color === oldButton.dataset.color &&
        candidate.dataset.size === oldButton.dataset.size
    );
    if (sameButton) {
      sameButton.focus();
      return;
    }
    const heading = document.getElementById("cart-heading");
    if (heading) {
      heading.tabIndex = -1;
      heading.focus();
    }
  }

  function wireCheckoutForm(): void {
    const form = document.getElementById("checkout-form");
    const feedback = document.getElementById("checkout-feedback");
    if (!(form instanceof HTMLFormElement) || !feedback) return;

    const formEl = form;
    const feedbackEl = feedback;

    const rules: { id: string; validate: (value: string) => string | null }[] = [
      {
        id: "checkout-nombre",
        validate: (value) => {
          const trimmed = value.trim();
          if (trimmed.length === 0) return "Ingresa tu nombre completo.";
          if (trimmed.length < 2) return "El nombre es demasiado corto.";
          return null;
        },
      },
      {
        id: "checkout-direccion",
        validate: (value) => {
          const trimmed = value.trim();
          if (trimmed.length === 0) return "Ingresa tu dirección de envío.";
          if (trimmed.length < 5) return "Ingresa una dirección completa.";
          return null;
        },
      },
      {
        id: "checkout-email",
        validate: (value) => {
          const trimmed = value.trim();
          const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
          if (trimmed.length === 0) return "Ingresa tu correo electrónico.";
          if (!EMAIL_PATTERN.test(trimmed)) return "Ingresa un correo electrónico válido.";
          return null;
        },
      },
    ];

    function getField(id: string): HTMLInputElement | null {
      return formEl.querySelector<HTMLInputElement>(`#${id}`);
    }

    function setFieldError(id: string, message: string | null): void {
      const field = getField(id);
      const errorEl = document.getElementById(`${id}-error`);
      if (!field || !errorEl) return;
      if (message) {
        field.setAttribute("aria-invalid", "true");
        errorEl.textContent = message;
      } else {
        field.removeAttribute("aria-invalid");
        errorEl.textContent = "";
      }
    }

    const addressGroup = document.getElementById("checkout-direccion-group");
    const pickupNote = document.getElementById("checkout-retiro-note");

    function deliveryMethod(): "domicilio" | "tienda" {
      const chosen = formEl.querySelector<HTMLInputElement>('input[name="entrega"]:checked');
      return chosen?.value === "tienda" ? "tienda" : "domicilio";
    }

    // Store pickup needs no shipping address, so that field (and its
    // validation) only applies to home delivery.
    function syncDelivery(): void {
      const isPickup = deliveryMethod() === "tienda";
      const address = getField("checkout-direccion");
      if (addressGroup) addressGroup.hidden = isPickup;
      if (pickupNote) pickupNote.hidden = !isPickup;
      if (address) address.required = !isPickup;
      if (isPickup) setFieldError("checkout-direccion", null);
    }

    formEl.querySelectorAll<HTMLInputElement>('input[name="entrega"]').forEach((radio) => {
      radio.addEventListener("change", syncDelivery);
    });
    syncDelivery();

    redeemCheckbox()?.addEventListener("change", () => renderTotals(cartTotal(getCart())));

    // Mismo patrón que contact-form.ts / login-form.ts: valida al salir del
    // campo y, una vez tocado, se revalida mientras se escribe.
    const touched = new Set<string>();
    for (const rule of rules) {
      const field = getField(rule.id);
      if (!field) continue;
      const validate = (): void => {
        if (rule.id === "checkout-direccion" && deliveryMethod() === "tienda") return;
        setFieldError(rule.id, rule.validate(field.value));
      };
      field.addEventListener("blur", () => {
        touched.add(rule.id);
        validate();
      });
      field.addEventListener("input", () => {
        if (touched.has(rule.id)) validate();
      });
    }

    formEl.addEventListener("submit", (event) => {
      event.preventDefault();

      if (getCart().length === 0) return;

      let isValid = true;
      let firstInvalid: HTMLInputElement | null = null;

      const isPickup = deliveryMethod() === "tienda";

      for (const rule of rules) {
        if (isPickup && rule.id === "checkout-direccion") continue;
        const field = getField(rule.id);
        if (!field) continue;
        const message = rule.validate(field.value);
        setFieldError(rule.id, message);
        if (message) {
          isValid = false;
          if (!firstInvalid) firstInvalid = field;
        }
      }

      if (!isValid) {
        feedbackEl.textContent = "Revisa los campos marcados antes de continuar.";
        feedbackEl.classList.add("form-feedback--error");
        feedbackEl.classList.remove("form-feedback--success");
        firstInvalid?.focus();
        return;
      }

      const purchasedLines = getCart();
      const subtotal = cartTotal(purchasedLines);
      const redeemed = currentRedeemedPoints(subtotal);
      const paidTotal = roundCents(Math.max(0, subtotal - pointsToDollars(redeemed)));
      pbTrack("Checkout completado", {
        items: cartCount(purchasedLines),
        total: paidTotal,
        deliveryMethod: deliveryMethod(),
        pointsRedeemed: redeemed,
      });

      // Simulated loyalty: spend the redeemed points, then earn new ones on what was paid.
      let pointsMessage = "";
      if (pbSessionGet()) {
        const earned = Math.floor(paidTotal * PB_POINTS_EARNED_PER_DOLLAR);
        const newBalance = pbPointsGet() - redeemed + earned;
        pbPointsSet(newBalance);
        pointsMessage = ` ${redeemed > 0 ? `Canjeaste ${redeemed} puntos. ` : ""}Ganaste ${earned} puntos: ahora tienes ${newBalance}.`;

        // Pedido real (no un ejemplo fijo): queda guardado para esta cuenta y
        // "Mis pedidos" en mi-cuenta.html lo lee de ahí.
        pbOrdersAdd({
          items: purchasedLines.map((line) => {
            const product = findPurpleBloomProduct(line.id);
            return { id: line.id, name: product?.name ?? line.id, qty: line.qty, color: line.color, size: line.size, price: product?.price ?? 0 };
          }),
          total: paidTotal,
          deliveryMethod: deliveryMethod(),
        });
      }

      saveCart([]);
      updateBadges();
      renderCartPage();
      const wasPickup = isPickup;
      formEl.reset();
      touched.clear();
      syncDelivery();
      renderCartPage();
      feedbackEl.textContent =
        (wasPickup
          ? "¡Gracias por tu compra! Te avisaremos por correo cuando esté listo para retirar en tienda."
          : "¡Gracias por tu compra! Te enviamos la confirmación por correo.") +
        pointsMessage +
        " (Simulación: no se procesó ningún pago real.)";
      feedbackEl.classList.add("form-feedback--success");
      feedbackEl.classList.remove("form-feedback--error");

      const submitBtn = document.getElementById("checkout-submit");
      if (submitBtn) pbPetalBurst(submitBtn);
    });
  }

  updateBadges();
  wireAddToCartButtons();
  wireCartItemActions();
  wireCheckoutForm();
  renderCartPage();
})();
