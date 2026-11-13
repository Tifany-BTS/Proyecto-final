import type { PurpleBloomProduct } from "../../services/product-service";
import type { CartItem } from "../../stores/use-cart-store";

export interface EnrichedCartLine extends CartItem {
  product: PurpleBloomProduct;
  subtotal: number;
}

interface CartTableProps {
  lines: EnrichedCartLine[];
  total: number;
  onUpdateQuantity: (productId: string, size: string, color: string, quantity: number) => void;
  onRemoveItem: (productId: string, size: string, color: string) => void;
}

export function CartTable({
  lines,
  total,
  onUpdateQuantity,
  onRemoveItem,
}: CartTableProps) {
  return (
    <div style={{ overflowX: "auto", marginBottom: "2rem" }}>
      <table style={{ width: "100%", borderCollapse: "collapse", textAlign: "left" }}>
        <thead>
          <tr style={{ borderBottom: "2px solid #eadcf2" }}>
            <th style={{ padding: "0.75rem" }}>Prenda</th>
            <th style={{ padding: "0.75rem" }}>Talla</th>
            <th style={{ padding: "0.75rem" }}>Color</th>
            <th style={{ padding: "0.75rem" }}>Precio</th>
            <th style={{ padding: "0.75rem" }}>Cantidad</th>
            <th style={{ padding: "0.75rem" }}>Subtotal</th>
            <th style={{ padding: "0.75rem" }}>Acción</th>
          </tr>
        </thead>
        <tbody>
          {lines.map((line) => (
            <tr key={`${line.productId}-${line.size}-${line.color}`} style={{ borderBottom: "1px solid #f3e8ff" }}>
              <td style={{ padding: "0.75rem", fontWeight: 600 }}>{line.product.name}</td>
              <td style={{ padding: "0.75rem" }}>{line.size}</td>
              <td style={{ padding: "0.75rem" }}>{line.color}</td>
              <td style={{ padding: "0.75rem" }}>${line.product.price.toFixed(2)}</td>
              <td style={{ padding: "0.75rem" }}>
                <div style={{ display: "inline-flex", alignItems: "center", gap: "0.4rem" }}>
                  <button
                    type="button"
                    aria-label={`Disminuir cantidad de ${line.product.name}`}
                    onClick={() =>
                      onUpdateQuantity(line.productId, line.size, line.color, line.quantity - 1)
                    }
                    style={{ width: 28, height: 28, borderRadius: 6, border: "1px solid #d8b4fe", cursor: "pointer" }}
                  >
                    −
                  </button>
                  <span style={{ minWidth: 24, textAlign: "center", fontWeight: 600 }}>
                    {line.quantity}
                  </span>
                  <button
                    type="button"
                    aria-label={`Aumentar cantidad de ${line.product.name}`}
                    onClick={() =>
                      onUpdateQuantity(line.productId, line.size, line.color, line.quantity + 1)
                    }
                    style={{ width: 28, height: 28, borderRadius: 6, border: "1px solid #d8b4fe", cursor: "pointer" }}
                  >
                    +
                  </button>
                </div>
              </td>
              <td style={{ padding: "0.75rem", fontWeight: 700 }}>${line.subtotal.toFixed(2)}</td>
              <td style={{ padding: "0.75rem" }}>
                <button
                  type="button"
                  onClick={() => onRemoveItem(line.productId, line.size, line.color)}
                  style={{
                    padding: "0.35rem 0.7rem",
                    borderRadius: 6,
                    border: "1px solid #fecaca",
                    background: "#fef2f2",
                    color: "#b91c1c",
                    cursor: "pointer",
                  }}
                >
                  Eliminar
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <div style={{ textAlign: "right", marginTop: "1rem", fontSize: "1.25rem", fontWeight: 700, color: "#3b0764" }}>
        Total a pagar: <span data-testid="cart-total">${total.toFixed(2)}</span>
      </div>
    </div>
  );
}
