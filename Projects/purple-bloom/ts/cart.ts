(function (): void {
  type CartLine = { id: string; qty: number; color?: string };

  const CART_KEY = "cart";

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
          findPurpleBloomProduct(line.id) !== undefined
      );

      const lines: CartLine[] = [];
      for (const line of valid) {
        const product = findPurpleBloomProduct(line.id);
        const color = product?.colors?.some((option) => option.name === line.color) ? line.color : undefined;
        const existing = lines.find((other) => other.id === line.id && other.color === color);
        if (existing) {
          existing.qty += line.qty;
        } else {
          lines.push(color ? { id: line.id, qty: line.qty, color } : { id: line.id, qty: line.qty });
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

  function addToCart(id: string, color?: string): void {
    const lines = getCart();
    const product = findPurpleBloomProduct(id);
    const chosenColor = resolveColor(product, color);
    const existing = lines.find((line) => line.id === id && line.color === chosenColor);
    if (existing) {
      existing.qty += 1;
    } else {
      lines.push(chosenColor ? { id, qty: 1, color: chosenColor } : { id, qty: 1 });
    }
    saveCart(lines);
    updateBadges();
    renderCartPage();

    pbTrack("Producto agregado al carrito", {
      productId: id,
      productName: product?.name,
      color: chosenColor,
      price: product?.price,
    });

    // rating-prompt.ts listens for this to ask the shopper to rate the item.
    document.dispatchEvent(new CustomEvent("purplebloom:cart-added", { detail: { id } }));
  }

  function setQty(id: string, color: string | undefined, qty: number): void {
    let lines = getCart();
    if (qty < 1) {
      lines = lines.filter((line) => !(line.id === id && line.color === color));
    } else {
      const existing = lines.find((line) => line.id === id && line.color === color);
      if (existing) existing.qty = qty;
    }
    saveCart(lines);
    updateBadges();
    renderCartPage();
  }

  function removeFromCart(id: string, color: string | undefined): void {
    const lines = getCart().filter((line) => !(line.id === id && line.color === color));
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
    const totalEl = document.getElementById("cart-total");
    const submitBtn = document.getElementById("checkout-submit");
    if (!itemsEl) return;

    const lines = getCart();

    if (lines.length === 0) {
      itemsEl.innerHTML =
        '<p class="cart-page__empty">Tu carrito está vacío. <a href="catalogo.html">Explorá el catálogo</a>.</p>' +
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
          return `
            <article class="cart-item" data-cart-item="${product.id}">
              <div class="cart-item__product">
                ${productMediaHtml(product, line.color)}
                <div class="cart-item__info">
                  <h2 class="cart-item__name"><a href="producto.html?id=${product.id}">${product.name}</a></h2>
                  ${line.color ? `<p class="cart-item__color">Color: ${line.color}</p>` : ""}
                  <p class="cart-item__price">${formatPrice(product.price)}</p>
                </div>
              </div>
              <div class="cart-item__qty">
                <button type="button" class="cart-item__qty-btn" data-action="decrease" data-id="${product.id}" data-color="${line.color ?? ""}" aria-label="Quitar una unidad de ${product.name}">&minus;</button>
                <span class="cart-item__qty-value">${line.qty}</span>
                <button type="button" class="cart-item__qty-btn" data-action="increase" data-id="${product.id}" data-color="${line.color ?? ""}" aria-label="Agregar una unidad de ${product.name}">+</button>
              </div>
              <p class="cart-item__line-price">${formatPrice(linePrice)}</p>
              <div class="cart-item__footer">
                <button type="button" class="cart-item__remove" data-action="remove" data-id="${product.id}" data-color="${line.color ?? ""}" aria-label="Quitar ${product.name} del carrito">
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

    if (totalEl) totalEl.textContent = formatPrice(cartTotal(lines));
    if (submitBtn instanceof HTMLButtonElement) submitBtn.disabled = lines.length === 0;
  }

  function wireAddToCartButtons(): void {
    document.querySelectorAll<HTMLElement>('[data-action="add-to-cart"]').forEach((button) => {
      button.addEventListener("click", () => {
        const id = button.getAttribute("data-product-id");
        if (id) addToCart(id);
      });
    });

    // The product-detail page builds its "Añadir al carrito" button after
    // this script has already run its initial querySelectorAll above, so it
    // dispatches this event instead of relying on a listener attached here.
    document.addEventListener("purplebloom:add-to-cart", (event) => {
      const detail = (event as CustomEvent<{ id: string; color?: string }>).detail;
      if (detail?.id) addToCart(detail.id, detail.color);
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
      const current = getCart().find((line) => line.id === id && line.color === color)?.qty ?? 0;

      if (action === "increase") setQty(id, color, current + 1);
      if (action === "decrease") setQty(id, color, current - 1);
      if (action === "remove") removeFromCart(id, color);
    });
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
          if (trimmed.length === 0) return "Ingresá tu nombre completo.";
          if (trimmed.length < 2) return "El nombre es demasiado corto.";
          return null;
        },
      },
      {
        id: "checkout-direccion",
        validate: (value) => {
          const trimmed = value.trim();
          if (trimmed.length === 0) return "Ingresá tu dirección de envío.";
          if (trimmed.length < 5) return "Ingresá una dirección completa.";
          return null;
        },
      },
      {
        id: "checkout-email",
        validate: (value) => {
          const trimmed = value.trim();
          const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
          if (trimmed.length === 0) return "Ingresá tu correo electrónico.";
          if (!EMAIL_PATTERN.test(trimmed)) return "Ingresá un correo electrónico válido.";
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
        feedbackEl.textContent = "Revisá los campos marcados antes de continuar.";
        feedbackEl.classList.add("form-feedback--error");
        feedbackEl.classList.remove("form-feedback--success");
        firstInvalid?.focus();
        return;
      }

      const purchasedLines = getCart();
      pbTrack("Checkout completado", {
        items: cartCount(purchasedLines),
        total: cartTotal(purchasedLines),
        deliveryMethod: deliveryMethod(),
      });

      saveCart([]);
      updateBadges();
      renderCartPage();
      const wasPickup = isPickup;
      formEl.reset();
      syncDelivery();
      feedbackEl.textContent = wasPickup
        ? "¡Gracias por tu compra! Te avisaremos por correo cuando esté listo para retirar en tienda. (Simulación: no se procesó ningún pago real.)"
        : "¡Gracias por tu compra! Te enviamos la confirmación por correo. (Simulación: no se procesó ningún pago real.)";
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
