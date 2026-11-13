interface VariantSelectorProps {
  colors: { name: string; imageSrc: string; imageAlt: string }[];
  selectedColor: string;
  onColorChange: (color: string) => void;
  selectedSize: string;
  onSizeChange: (size: string) => void;
  stock: number;
  sizeError: string | null;
  onAddToCart: () => void;
}

const SIZES = ["Selecciona", "XS", "S", "M", "L", "XL"];

export function VariantSelector({
  colors,
  selectedColor,
  onColorChange,
  selectedSize,
  onSizeChange,
  stock,
  sizeError,
  onAddToCart,
}: VariantSelectorProps) {
  const isOutOfStock = stock <= 0;

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
      {colors.length > 0 && (
        <div>
          <label style={{ display: "block", fontWeight: 600, marginBottom: "0.4rem" }}>
            Color: {selectedColor}
          </label>
          <div style={{ display: "flex", gap: "0.5rem", flexWrap: "wrap" }}>
            {colors.map((c) => {
              const active = selectedColor === c.name;
              return (
                <button
                  key={c.name}
                  type="button"
                  onClick={() => onColorChange(c.name)}
                  style={{
                    padding: "0.4rem 0.85rem",
                    borderRadius: 8,
                    border: active ? "2px solid #6b21a8" : "1px solid #d8b4fe",
                    background: active ? "#f3e8ff" : "#fff",
                    fontWeight: active ? 700 : 500,
                    cursor: "pointer",
                  }}
                >
                  {c.name}
                </button>
              );
            })}
          </div>
        </div>
      )}

      <div>
        <label htmlFor="select-size" style={{ display: "block", fontWeight: 600, marginBottom: "0.4rem" }}>
          Talla
        </label>
        <select
          id="select-size"
          value={selectedSize}
          onChange={(e) => onSizeChange(e.target.value)}
          disabled={isOutOfStock}
          style={{
            padding: "0.6rem 0.9rem",
            borderRadius: 8,
            border: sizeError ? "2px solid #dc2626" : "1px solid #d8b4fe",
            minWidth: 180,
          }}
        >
          {SIZES.map((s) => (
            <option key={s} value={s}>
              {s}
            </option>
          ))}
        </select>
        {sizeError && (
          <p role="alert" style={{ color: "#dc2626", margin: "0.4rem 0 0", fontWeight: 600 }}>
            {sizeError}
          </p>
        )}
      </div>

      <div>
        <button
          type="button"
          disabled={isOutOfStock}
          onClick={onAddToCart}
          style={{
            padding: "0.85rem 1.5rem",
            borderRadius: 10,
            border: "none",
            background: isOutOfStock ? "#9ca3af" : "#6b21a8",
            color: "#fff",
            fontWeight: 700,
            fontSize: "1rem",
            cursor: isOutOfStock ? "not-allowed" : "pointer",
          }}
        >
          {isOutOfStock ? "Agotado" : "AGREGAR A MI CARRITO"}
        </button>
      </div>
    </div>
  );
}
