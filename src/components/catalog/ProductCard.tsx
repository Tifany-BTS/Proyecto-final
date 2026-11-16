import { useState } from "react";
import { Link } from "react-router";
import { useCartStore } from "../../stores/use-cart-store";
import type { PurpleBloomProduct } from "../../services/product-service";

interface ProductCardProps {
  product: PurpleBloomProduct;
}

export function ProductCard({ product }: ProductCardProps) {
  const [imgFailed, setImgFailed] = useState(false);
  const cartItems = useCartStore((state) => state.items);
  const inCartQty = cartItems
    .filter((item) => item.productId === product.id)
    .reduce((sum, item) => sum + item.quantity, 0);
  const remainingStock = Math.max(0, product.stock - inCartQty);
  const isOutOfStock = remainingStock === 0;
  const showFallback = !product.imageSrc || imgFailed;

  return (
    <article className="product-card" data-testid={`product-card-${product.id}`}>
      {isOutOfStock && (
        <span className="product-card__badge">Agotado</span>
      )}

      {showFallback ? (
        <div
          className="product-card__image"
          data-testid={`fallback-${product.id}`}
          role="img"
          aria-label={`Vista previa de ${product.name}`}
          style={{
            background: "linear-gradient(135deg, #f3e8ff 0%, #d8b4fe 55%, #a855f7 100%)",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            color: "#3b0764",
            padding: "1rem",
            textAlign: "center",
            minHeight: 240,
          }}
        >
          <span style={{ fontSize: "1.6rem", marginBottom: "0.25rem" }}>✿</span>
          <strong style={{ fontSize: "0.95rem" }}>{product.name}</strong>
          <small style={{ opacity: 0.8 }}>{product.category}</small>
        </div>
      ) : (
        <img
          src={product.imageSrc}
          alt={product.name}
          className="product-card__image"
          onError={() => setImgFailed(true)}
        />
      )}

      <div className="product-card__body" style={{ padding: "1rem" }}>
        <p style={{ margin: "0 0 0.25rem", fontSize: "0.78rem", opacity: 0.7 }}>
          {product.category}
        </p>
        <h3 style={{ margin: "0 0 0.4rem", fontSize: "1.05rem" }}>
          <Link to={`/producto/${product.id}`} style={{ textDecoration: "none", color: "inherit" }}>
            {product.name}
          </Link>
        </h3>
        <p className="product-card__desc">{product.description}</p>
        <p
          style={{
            margin: "0.35rem 0 0",
            fontSize: "0.8rem",
            fontWeight: 600,
            color: isOutOfStock ? "#b91c1c" : "#15803d",
          }}
        >
          {isOutOfStock ? "Agotado" : `Disponibles: ${remainingStock}`}
        </p>

        <div className="product-card__price-row" style={{ marginTop: "0.75rem" }}>
          <span className="product-card__price">${product.price.toFixed(2)}</span>
          <Link
            to={`/producto/${product.id}`}
            className="btn btn--primary btn--small"
            style={{ marginLeft: "auto" }}
          >
            Ver detalle
          </Link>
        </div>
      </div>
    </article>
  );
}
