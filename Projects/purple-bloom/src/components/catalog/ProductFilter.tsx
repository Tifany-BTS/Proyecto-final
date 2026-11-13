interface ProductFilterProps {
  searchTerm: string;
  onSearchChange: (value: string) => void;
  selectedCategory: string;
  onCategoryChange: (category: string) => void;
}

const CATEGORIES = ["Todas", "Blusas", "Vestidos", "Pantalones"];

export function ProductFilter({
  searchTerm,
  onSearchChange,
  selectedCategory,
  onCategoryChange,
}: ProductFilterProps) {
  return (
    <div style={{ display: "flex", flexWrap: "wrap", gap: "1rem", marginBottom: "1.5rem", alignItems: "center" }}>
      <input
        type="search"
        placeholder="Buscar prenda por nombre..."
        aria-label="Buscar prenda por nombre"
        value={searchTerm}
        onChange={(e) => onSearchChange(e.target.value)}
        style={{
          flex: "1 1 260px",
          padding: "0.65rem 0.9rem",
          borderRadius: 8,
          border: "1px solid #d8b4fe",
          fontSize: "0.95rem",
        }}
      />

      <div role="group" aria-label="Filtrar por categoría" style={{ display: "flex", gap: "0.5rem", flexWrap: "wrap" }}>
        {CATEGORIES.map((category) => {
          const active = selectedCategory === category;
          return (
            <button
              key={category}
              type="button"
              onClick={() => onCategoryChange(category)}
              style={{
                padding: "0.55rem 1rem",
                borderRadius: 999,
                border: "1px solid #9333ea",
                background: active ? "#6b21a8" : "#fff",
                color: active ? "#fff" : "#6b21a8",
                fontWeight: 600,
                cursor: "pointer",
              }}
            >
              {category}
            </button>
          );
        })}
      </div>
    </div>
  );
}
