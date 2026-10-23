(function (): void {
  // "Mis pedidos" (mi-cuenta.html): ya no son los dos pedidos de ejemplo
  // fijos, son el historial real de checkouts de esta cuenta (guardado por
  // cart.ts en cada compra vía pbOrdersAdd). Sigue sin haber pago ni envío
  // real, así que cada pedido queda en un único estado "Confirmado" en vez
  // de inventar un "Entregado"/"En camino" que nadie procesó de verdad.
  const list = document.getElementById("account-orders-list");
  const emptyStateEl = document.getElementById("account-orders-empty");
  const guestStateEl = document.getElementById("account-orders-guest");
  if (!list || !emptyStateEl || !guestStateEl) return;

  // Reasignados a const con tipo explícito: dentro de render() (definido
  // después de este guard), TypeScript no conserva el angostamiento de una
  // const capturada por closure.
  const listEl: HTMLElement = list;
  const emptyEl: HTMLElement = emptyStateEl;
  const guestEl: HTMLElement = guestStateEl;

  const dateFormatter = new Intl.DateTimeFormat("es", { day: "numeric", month: "long", year: "numeric" });

  function formatPrice(value: number): string {
    return `$${value.toFixed(2)}`;
  }

  function itemsSummary(order: PbOrder): string {
    return order.items
      .map((item) => {
        const variant = [item.color, item.size ? `talla ${item.size}` : ""].filter(Boolean).join(", ");
        return `${item.qty} × ${item.name}${variant ? ` (${variant})` : ""}`;
      })
      .join(", ");
  }

  function orderHtml(order: PbOrder): string {
    const date = new Date(order.date);
    const formattedDate = Number.isNaN(date.getTime()) ? "" : dateFormatter.format(date);
    return `
      <article class="account-order">
        <div class="account-order__info">
          <p class="account-order__number">Pedido #${order.id}</p>
          <p class="account-order__date">${formattedDate} · ${order.deliveryMethod === "tienda" ? "Retiro en tienda" : "Envío a domicilio"}</p>
          <p class="account-order__items">${itemsSummary(order)}</p>
        </div>
        <p class="account-order__status account-order__status--transit">Confirmado</p>
        <p class="account-order__total">${formatPrice(order.total)}</p>
      </article>
    `;
  }

  function render(): void {
    const user = pbSessionGet();
    if (!user) {
      listEl.hidden = true;
      listEl.innerHTML = "";
      emptyEl.hidden = true;
      guestEl.hidden = false;
      return;
    }
    guestEl.hidden = true;

    const orders = pbOrdersGet();
    if (orders.length === 0) {
      listEl.hidden = true;
      listEl.innerHTML = "";
      emptyEl.hidden = false;
      return;
    }

    emptyEl.hidden = true;
    listEl.hidden = false;
    listEl.innerHTML = orders.map(orderHtml).join("");
  }

  render();

  document.addEventListener("purplebloom:orders-changed", render);

  window.addEventListener("storage", (event) => {
    if (event.key === null || event.key.startsWith("pb-orders:")) render();
  });
})();
