import { useState } from "react";
import { Link, useParams } from "react-router";
import { useProducts } from "../hooks/useProducts";
import { useCartStore } from "../stores/use-cart-store";

const AVAILABLE_SIZES = ["XS", "S", "M", "L", "XL"];

export function ViewProductDetail() {
  const { id } = useParams<{ id: string }>();
  const { data: products, isLoading } = useProducts();
  const product = products?.find((p) => p.id === id);
  const addItem = useCartStore((state) => state.addItem);

  const [selectedSize, setSelectedSize] = useState("");
  const [selectedColor, setSelectedColor] = useState("");
  const [quantity, setQuantity] = useState(1);
  const [sizeError, setSizeError] = useState("");
  const [addedFeedback, setAddedFeedback] = useState(false);
  const [imgFailed, setImgFailed] = useState(false);

  if (isLoading) {
    return (
      <div className="container" style={{ padding: "3rem 1rem" }}>
        <p role="status">Cargando detalles de la prenda...</p>
      </div>
    );
  }

  if (!product) {
    return (
      <section className="container product-detail__not-found" style={{ padding: "3rem 1rem" }}>
        <h2>Prenda no encontrada</h2>
        <p>La referencia solicitada no está disponible en el catálogo actual.</p>
        <Link to="/" className="btn btn--primary">
          Volver al catálogo
        </Link>
      </section>
    );
  }

  const colorOptions = product.colors ?? [];
  const activeColorObj = colorOptions.find((c) => c.name === selectedColor) ?? colorOptions[0];
  const activeColorName = activeColorObj?.name || "Único";
  const currentImageSrc = activeColorObj?.imageSrc || product.imageSrc;
  const isOutOfStock = product.stock === 0;
  const showFallback = !currentImageSrc || imgFailed;

  const handleAddToCart = () => {
    if (isOutOfStock) return;

    if (!selectedSize) {
      setSizeError("Elige una talla para añadir al carrito");
      setAddedFeedback(false);
      return;
    }

    setSizeError("");
    addItem({
      productId: product.id,
      size: selectedSize,
      color: activeColorName,
      quantity,
    });
    setAddedFeedback(true);
  };

  return (
    <section className="product-detail" style={{ padding: "2.5rem 0 4rem" }}>
      <div className="container">
        <Link to="/" className="product-detail__back" style={{ display: "inline-block", marginBottom: "1.25rem" }}>
          ← Volver al catálogo
        </Link>

        <div className="product-detail__layout">
          <div className="product-detail__media">
            {showFallback ? (
              <div
                className="product-detail__image"
                data-testid={`detail-fallback-${product.id}`}
                style={{
                  minHeight: 380,
                  background: "linear-gradient(135deg, #f3e8ff 0%, #c084fc 100%)",
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  justifyContent: "center",
                  color: "#3b0764",
                  padding: "1.5rem",
                  textAlign: "center",
                }}
              >
                <span style={{ fontSize: "2.2rem" }}>✿</span>
                <strong style={{ fontSize: "1.2rem" }}>{product.name}</strong>
                <span>{product.category}</span>
              </div>
            ) : (
              <img
                src={currentImageSrc}
                alt={product.name}
                className="product-detail__image"
                onError={() => setImgFailed(true)}
              />
            )}
          </div>

          <div className="product-detail__info">
            <span className="product-detail__code">{product.category}</span>
            <h1 style={{ margin: "0.3rem 0 0.6rem" }}>{product.name}</h1>

            <div className="product-detail__price-row">
              <span className="product-detail__price">${product.price.toFixed(2)}</span>
              <span style={{ fontSize: "0.9rem", opacity: 0.75 }}>
                {isOutOfStock ? "Sin existencias" : `Stock disponible: ${product.stock}`}
              </span>
            </div>

            <hr className="product-detail__divider" />
            <p style={{ lineHeight: 1.6 }}>{product.description}</p>

            {colorOptions.length > 0 && (
              <div className="product-detail__field">
                <label htmlFor="detail-color" className="product-detail__field-label">
                  Color
                </label>
                <select
                  id="detail-color"
                  className="product-detail__select"
                  value={activeColorName}
                  onChange={(e) => {
                    setSelectedColor(e.target.value);
                    setImgFailed(false);
                  }}
                  disabled={isOutOfStock}
                >
                  {colorOptions.map((color) => (
                    <option key={color.name} value={color.name}>
                      {color.name}
                    </option>
                  ))}
                </select>
              </div>
            )}

            <div className="product-detail__field">
              <label htmlFor="detail-size" className="product-detail__field-label">
                Talla
              </label>
              <select
                id="detail-size"
                className="product-detail__select"
                value={selectedSize}
                onChange={(e) => {
                  setSelectedSize(e.target.value);
                  if (e.target.value) setSizeError("");
                }}
                disabled={isOutOfStock}
              >
                <option value="">Selecciona una talla</option>
                {AVAILABLE_SIZES.map((size) => (
                  <option key={size} value={size}>
                    {size}
                  </option>
                ))}
              </select>

              {sizeError && (
                <p role="alert" className="product-detail__field-error">
                  {sizeError}
                </p>
              )}
            </div>

            <div className="product-detail__field">
              <label htmlFor="detail-qty" className="product-detail__field-label">
                Cantidad
              </label>
              <input
                id="detail-qty"
                type="number"
                className="product-detail__select"
                min={1}
                max={Math.max(1, product.stock)}
                value={quantity}
                onChange={(e) => setQuantity(Math.max(1, Number(e.target.value) || 1))}
                disabled={isOutOfStock}
                style={{ width: 96 }}
              />
            </div>

            <div className="product-detail__actions">
              <button
                type="button"
                className="btn btn--primary"
                disabled={isOutOfStock}
                onClick={handleAddToCart}
                style={{ width: "100%", padding: "0.95rem 1.25rem" }}
              >
                {isOutOfStock ? "Agotado" : "AGREGAR A MI CARRITO"}
              </button>
            </div>

            {addedFeedback && (
              <p role="status" className="form-feedback form-feedback--success" style={{ marginTop: "0.9rem" }}>
                Prenda añadida al carrito ({activeColorName}, talla {selectedSize}).
              </p>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
