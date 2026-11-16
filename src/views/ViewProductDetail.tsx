import { useState } from "react";
import { Link, useParams } from "react-router";
import { useProducts } from "../hooks/useProducts";
import { getStockForSize, PRODUCT_SIZES } from "../services/product-service";
import { useCartStore } from "../stores/use-cart-store";

export function ViewProductDetail() {
  const { id } = useParams<{ id: string }>();
  const { data: products, isLoading } = useProducts();
  const product = products?.find((p) => p.id === id);
  const items = useCartStore((state) => state.items);
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

  const availableBySize = Object.fromEntries(
    PRODUCT_SIZES.map((size) => {
      const inCartForSize = items
        .filter((item) => item.productId === product.id && item.size === size)
        .reduce((sum, item) => sum + item.quantity, 0);
      const remaining = Math.max(0, getStockForSize(product, size) - inCartForSize);
      return [size, remaining];
    })
  ) as Record<(typeof PRODUCT_SIZES)[number], number>;

  const totalAvailableAllSizes = PRODUCT_SIZES.reduce(
    (sum, size) => sum + availableBySize[size],
    0
  );

  const availableStock = selectedSize
    ? (availableBySize[selectedSize as (typeof PRODUCT_SIZES)[number]] ?? 0)
    : totalAvailableAllSizes;

  const isProductCompletelyOut = totalAvailableAllSizes === 0;
  const isSelectedSizeOut = Boolean(selectedSize) && availableStock === 0;
  const isOutOfStock = isProductCompletelyOut || isSelectedSizeOut;
  const effectiveQty = isOutOfStock ? 1 : Math.min(quantity, Math.max(1, availableStock));
  const showFallback = !currentImageSrc || imgFailed;

  const handleAddToCart = () => {
    if (isOutOfStock) return;

    if (!selectedSize) {
      setSizeError("Elige una talla para añadir al carrito");
      setAddedFeedback(false);
      return;
    }

    const qtyToAdd = Math.min(effectiveQty, availableStock);
    if (qtyToAdd <= 0) return;

    setSizeError("");
    addItem({
      productId: product.id,
      size: selectedSize,
      color: activeColorName,
      quantity: qtyToAdd,
    });

    const nextAvailable = availableStock - qtyToAdd;
    setQuantity(nextAvailable > 0 ? Math.min(effectiveQty, nextAvailable) : 1);
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
              <span
                style={{
                  fontSize: "0.9rem",
                  fontWeight: 600,
                  color: isOutOfStock ? "#b91c1c" : "#15803d",
                }}
              >
                {isProductCompletelyOut
                  ? "Sin existencias (Agotado)"
                  : isSelectedSizeOut
                    ? `Talla ${selectedSize} agotada`
                    : selectedSize
                      ? `Stock talla ${selectedSize}: ${availableStock}`
                      : `Stock disponible: ${availableStock}`}
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
                  disabled={isProductCompletelyOut}
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
                  const nextSize = e.target.value;
                  setSelectedSize(nextSize);
                  setAddedFeedback(false);
                  if (nextSize) {
                    setSizeError("");
                    const nextStock = availableBySize[nextSize as (typeof PRODUCT_SIZES)[number]] ?? 1;
                    setQuantity((prev) => Math.max(1, Math.min(prev, Math.max(1, nextStock))));
                  }
                }}
                disabled={isProductCompletelyOut}
              >
                <option value="">Selecciona una talla</option>
                {PRODUCT_SIZES.map((size) => {
                  const rem = availableBySize[size];
                  return (
                    <option key={size} value={size}>
                      {rem > 0 ? `${size} (${rem} disp.)` : `${size} (Agotada)`}
                    </option>
                  );
                })}
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
                max={Math.max(1, availableStock)}
                value={effectiveQty}
                onChange={(e) => {
                  const val = Math.max(1, Number(e.target.value) || 1);
                  setQuantity(Math.min(val, Math.max(1, availableStock)));
                }}
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
                style={{
                  width: "100%",
                  padding: "0.95rem 1.25rem",
                  opacity: isOutOfStock ? 0.55 : 1,
                  cursor: isOutOfStock ? "not-allowed" : "pointer",
                }}
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
