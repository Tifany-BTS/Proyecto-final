import { useMemo, useState } from "react";
import { Link, useNavigate } from "react-router";
import { useProducts } from "../hooks/useProducts";
import { useCartStore } from "../stores/use-cart-store";
import { CartTable, type EnrichedCartLine } from "../components/checkout/CartTable";
import { CheckoutForm } from "../components/checkout/CheckoutForm";
import {
  OrderConfirmationModal,
  type ConfirmedOrderSummary,
} from "../components/checkout/OrderConfirmationModal";

export function ViewCartCheckout() {
  const navigate = useNavigate();
  const { data: products } = useProducts();
  const items = useCartStore((state) => state.items);
  const updateQuantity = useCartStore((state) => state.updateQuantity);
  const removeItem = useCartStore((state) => state.removeItem);
  const clearCart = useCartStore((state) => state.clearCart);

  const [confirmedOrder, setConfirmedOrder] = useState<ConfirmedOrderSummary | null>(null);

  const enrichedLines = useMemo<EnrichedCartLine[]>(() => {
    if (!products) return [];
    return items
      .map((item) => {
        const product = products.find((p) => p.id === item.productId);
        if (!product) return null;
        return {
          ...item,
          product,
          subtotal: Number((product.price * item.quantity).toFixed(2)),
        };
      })
      .filter((line): line is EnrichedCartLine => line !== null);
  }, [items, products]);

  const total = useMemo(
    () =>
      Number(
        enrichedLines.reduce((acc, line) => acc + line.subtotal, 0).toFixed(2)
      ),
    [enrichedLines]
  );

  const isEmpty = enrichedLines.length === 0;

  return (
    <section>
      <header style={{ marginBottom: "1.5rem" }}>
        <h1 style={{ margin: "0 0 0.4rem", color: "#3b0764" }}>Carrito y Finalizar Compra</h1>
        <p style={{ margin: 0, color: "#5b4b6a" }}>
          Revisa tus prendas seleccionadas y completa los datos de entrega.
        </p>
      </header>

      {isEmpty ? (
        <div
          style={{
            padding: "2rem",
            borderRadius: 12,
            border: "1px dashed #d8b4fe",
            textAlign: "center",
            marginBottom: "2rem",
          }}
        >
          <p style={{ fontWeight: 600, marginBottom: "0.75rem" }}>Tu carrito está vacío.</p>
          <Link to="/" style={{ color: "#6b21a8", fontWeight: 600 }}>
            Explorar prendas en el catálogo
          </Link>
        </div>
      ) : (
        <CartTable
          lines={enrichedLines}
          total={total}
          onUpdateQuantity={updateQuantity}
          onRemoveItem={removeItem}
        />
      )}

      <div
        style={{
          maxWidth: 540,
          padding: "1.5rem",
          borderRadius: 12,
          border: "1px solid #eadcf2",
          background: "#fff",
        }}
      >
        <h2 style={{ marginTop: 0, fontSize: "1.2rem", color: "#3b0764" }}>Datos del Pedido</h2>
        <CheckoutForm
          disabled={isEmpty}
          onValidSubmit={(customer) => {
            setConfirmedOrder({
              customer,
              lines: enrichedLines,
              total,
            });
            clearCart();
          }}
        />
      </div>

      <OrderConfirmationModal
        order={confirmedOrder}
        onClose={() => {
          setConfirmedOrder(null);
          navigate("/");
        }}
      />
    </section>
  );
}
