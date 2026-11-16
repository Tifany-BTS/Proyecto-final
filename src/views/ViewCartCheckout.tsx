import { useMemo, useState } from "react";
import { Link, useNavigate } from "react-router";
import { useCommitOrderStock, useProducts } from "../hooks/useProducts";
import { getStockForSize } from "../services/product-service";
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
  const commitOrderStock = useCommitOrderStock();
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
    <section className="cart-page" style={{ padding: "2.5rem 0 4rem" }}>
      <div className="container">
        <div className="section-header">
          <h1>Carrito y Finalizar Compra</h1>
          <p>Revisa tus prendas seleccionadas y completa los datos de entrega.</p>
        </div>

        {isEmpty ? (
          <div className="cart-page__empty" style={{ marginBottom: "2rem" }}>
            <p style={{ fontWeight: 600, marginBottom: "0.75rem" }}>Tu carrito está vacío.</p>
            <Link to="/" className="btn btn--primary">
              Explorar prendas en el catálogo
            </Link>
          </div>
        ) : (
          <CartTable
            lines={enrichedLines}
            total={total}
            onUpdateQuantity={(productId, size, color, nextQty) => {
              const product = products?.find((p) => p.id === productId);
              if (!product) {
                updateQuantity(productId, size, color, nextQty);
                return;
              }
              const otherColorsSameSizeQty = items
                .filter(
                  (i) =>
                    i.productId === productId &&
                    i.size === size &&
                    i.color !== color
                )
                .reduce((sum, i) => sum + i.quantity, 0);
              const sizeStock = getStockForSize(product, size);
              const maxAllowed = Math.max(0, sizeStock - otherColorsSameSizeQty);
              updateQuantity(productId, size, color, Math.min(nextQty, maxAllowed));
            }}
            onRemoveItem={removeItem}
          />
        )}

        <div className="cart-summary" style={{ maxWidth: 560, padding: "1.5rem" }}>
          <h2 style={{ marginTop: 0 }}>Datos del Pedido</h2>
          <CheckoutForm
            disabled={isEmpty}
            onValidSubmit={(customer) => {
              const snapshotLines = [...enrichedLines];
              const snapshotTotal = total;

              commitOrderStock(
                snapshotLines.map((line) => ({
                  productId: line.productId,
                  size: line.size,
                  quantity: line.quantity,
                }))
              );

              clearCart();

              setConfirmedOrder({
                customer,
                lines: snapshotLines,
                total: snapshotTotal,
              });
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
      </div>
    </section>
  );
}
