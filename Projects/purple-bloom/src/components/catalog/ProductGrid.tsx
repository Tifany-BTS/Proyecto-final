import type { PurpleBloomProduct } from "../../services/product-service";
import { ProductCard } from "./ProductCard";

interface ProductGridProps {
  products: PurpleBloomProduct[];
}

export function ProductGrid({ products }: ProductGridProps) {
  if (products.length === 0) {
    return <p>No hay prendas disponibles</p>;
  }

  return (
    <div
      style={{
        display: "grid",
        gridTemplateColumns: "repeat(auto-fill, minmax(240px, 1fr))",
        gap: "1.5rem",
      }}
    >
      {products.map((product) => (
        <ProductCard key={product.id} product={product} />
      ))}
    </div>
  );
}
