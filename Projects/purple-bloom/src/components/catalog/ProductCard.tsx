import { useState } from "react";
import { Link } from "react-router";
import type { PurpleBloomProduct } from "../../services/product-service";

interface ProductCardProps {
  product: PurpleBloomProduct;
}

export function ProductCard({ product }: ProductCardProps) {
  const [imgFailed, setImgFailed] = useState(false);
  const showFallback = !product.imageSrc || imgFailed;

  const fallbackGradient =
    product.swatch === "alt2"
      ? "linear-gradient(135deg, #d8b4fe 0%, #818cf8 100%)"
      : "linear-gradient(135deg, #f5d0fe 0%, #c084fc 100%)";

  return (
    <article
      className="product-card"
      style={{
        border: "1px solid #eadcf2",
        borderRadius: 12,
        overflow: "hidden",
        background: "#fff",
        display: "flex",
        flexDirection: "column",
      }}
    >
      <Link to={`/producto/${product.id}`} style={{ textDecoration: "none", color: "inherit" }}>
        {showFallback ? (
          <div
            data-testid={`fallback-${product.id}`}
            role="img"
            aria-label={product.name}
            style={{
              height: 240,
              background: fallbackGradient,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              color: "#3b0764",
              fontWeight: 600,
              padding: "1rem",
              textAlign: "center",
            }}
          >
            {product.name}
          </div>
        ) : (
          <img
            src={`/${product.imageSrc}`}
            alt={product.imageAlt ?? product.name}
            onError={() => setImgFailed(true)}
            style={{ width: "100%", height: 240, objectFit: "cover", display: "block" }}
          />
        )}
      </Link>

      <div style={{ padding: "1rem", display: "flex", flexDirection: "column", gap: "0.5rem", flex: 1 }}>
        <span style={{ fontSize: "0.78rem", color: "#7e22ce", fontWeight: 600 }}>
          {product.category}
        </span>
        <h3 style={{ margin: 0, fontSize: "1.05rem" }}>
          <Link to={`/producto/${product.id}`} style={{ textDecoration: "none", color: "#1f122b" }}>
            {product.name}
          </Link>
        </h3>
        <p style={{ margin: 0, fontWeight: 700, fontSize: "1.1rem", color: "#5b2a86" }}>
          ${product.price.toFixed(2)}
        </p>
        {product.stock === 0 && (
          <span style={{ fontSize: "0.8rem", color: "#b91c1c", fontWeight: 600 }}>
            Agotado
          </span>
        )}
        <div style={{ marginTop: "auto", paddingTop: "0.5rem" }}>
          <Link
            to={`/producto/${product.id}`}
            style={{
              display: "inline-block",
              width: "100%",
              textAlign: "center",
              padding: "0.55rem 0.9rem",
              borderRadius: 8,
              background: "#6b21a8",
              color: "#fff",
              textDecoration: "none",
              fontWeight: 600,
              fontSize: "0.9rem",
            }}
          >
            Ver detalle
          </Link>
        </div>
      </div>
    </article>
  );
}
