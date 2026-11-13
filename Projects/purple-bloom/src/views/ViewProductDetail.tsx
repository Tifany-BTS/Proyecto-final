import { useEffect, useState } from "react";
import { Link, useParams } from "react-router";
import { useProducts } from "../hooks/useProducts";
import { useCartStore } from "../stores/use-cart-store";
import { VariantSelector } from "../components/detail/VariantSelector";
import { ProductAccordion } from "../components/detail/ProductAccordion";

export function ViewProductDetail() {
  const { id } = useParams<{ id: string }>();
  const { data: products, isLoading } = useProducts();
  const addItem = useCartStore((state) => state.addItem);

  const product = products?.find((p) => p.id === id);

  const [selectedColor, setSelectedColor] = useState("");
  const [selectedSize, setSelectedSize] = useState("Selecciona");
  const [sizeError, setSizeError] = useState<string | null>(null);
  const [addedFeedback, setAddedFeedback] = useState<string | null>(null);

  useEffect(() => {
    if (product) {
      setSelectedColor(product.colors?.[0]?.name ?? "Único");
      setSelectedSize("Selecciona");
      setSizeError(null);
      setAddedFeedback(null);
    }
  }, [product]);

  if (isLoading) {
    return <p role="status">Cargando detalle de prenda...</p>;
  }

  if (!product) {
    return (
      <section>
        <h1>Prenda no encontrada</h1>
        <Link to="/">Volver al catálogo</Link>
      </section>
    );
  }

  const activeColorVariant = product.colors?.find((c) => c.name === selectedColor);
  const displayImage = activeColorVariant?.imageSrc ?? product.imageSrc;

  const handleAddToCart = () => {
    if (product.stock <= 0) return;

    if (selectedSize === "Selecciona") {
      setSizeError("Elige una talla para añadir al carrito");
      setAddedFeedback(null);
      return;
    }

    setSizeError(null);
    addItem({
      productId: product.id,
      size: selectedSize,
      color: selectedColor || "Único",
      quantity: 1,
    });
    setAddedFeedback(`Se añadió ${product.name} (Talla ${selectedSize}) al carrito.`);
  };

  return (
    <section>
      <p style={{ marginBottom: "1.25rem" }}>
        <Link to="/" style={{ color: "#6b21a8", textDecoration: "none", fontWeight: 600 }}>
          ← Volver al catálogo
        </Link>
      </p>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: "2rem" }}>
        <div>
          {displayImage ? (
            <img
              src={`/${displayImage}`}
              alt={activeColorVariant?.imageAlt ?? product.name}
              style={{ width: "100%", maxHeight: 440, objectFit: "cover", borderRadius: 12 }}
            />
          ) : (
            <div
              style={{
                height: 360,
                borderRadius: 12,
                background: "linear-gradient(135deg, #f5d0fe 0%, #c084fc 100%)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontWeight: 700,
                color: "#3b0764",
              }}
            >
              {product.name}
            </div>
          )}
        </div>

        <div>
          <span style={{ color: "#7e22ce", fontWeight: 600 }}>{product.category}</span>
          <h1 style={{ margin: "0.3rem 0", color: "#2d1b3d" }}>{product.name}</h1>
          <p style={{ fontSize: "1.5rem", fontWeight: 700, color: "#5b2a86", margin: "0.5rem 0 1rem" }}>
            ${product.price.toFixed(2)}
          </p>
          <p style={{ color: "#4b3b5c", lineHeight: 1.6 }}>{product.description}</p>

          <VariantSelector
            colors={product.colors ?? []}
            selectedColor={selectedColor}
            onColorChange={setSelectedColor}
            selectedSize={selectedSize}
            onSizeChange={(s) => {
              setSelectedSize(s);
              if (s !== "Selecciona") setSizeError(null);
            }}
            stock={product.stock}
            sizeError={sizeError}
            onAddToCart={handleAddToCart}
          />

          {addedFeedback && (
            <p role="status" style={{ marginTop: "1rem", color: "#15803d", fontWeight: 600 }}>
              {addedFeedback}
            </p>
          )}

          <ProductAccordion material={product.material} care={product.care} />
        </div>
      </div>
    </section>
  );
}
