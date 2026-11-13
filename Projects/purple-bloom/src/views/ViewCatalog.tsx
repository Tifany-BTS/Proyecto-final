import { useMemo, useState } from "react";
import { Link } from "react-router";
import { useProducts } from "../hooks/useProducts";
import { ProductCard } from "../components/catalog/ProductCard";

export function ViewCatalog() {
  const { data: products, isLoading, isError } = useProducts();
  const [selectedCategory, setSelectedCategory] = useState<string>("Todas");

  const categories = useMemo(() => {
    if (!products) return ["Todas"];
    const unique = Array.from(new Set(products.map((p) => p.category)));
    return ["Todas", ...unique];
  }, [products]);

  const filteredProducts = useMemo(() => {
    if (!products) return [];
    if (selectedCategory === "Todas") return products;
    return products.filter((p) => p.category === selectedCategory);
  }, [products, selectedCategory]);

  if (isLoading) {
    return (
      <div className="container" style={{ padding: "3rem 1rem" }}>
        <p role="status">Cargando catálogo de Purple Bloom...</p>
      </div>
    );
  }

  if (isError || !products) {
    return (
      <div className="container" style={{ padding: "3rem 1rem" }}>
        <p role="alert">No se pudo cargar el catálogo en este momento.</p>
      </div>
    );
  }

  return (
    <div>
      <section className="surface-aubergine" style={{ padding: "2.75rem 0" }}>
        <div className="container">
          <p className="intro__eyebrow">
            <span className="intro__eyebrow-bar" aria-hidden="true" />
            COLECCIÓN PURPLE BLOOM
          </p>
          <h1 style={{ margin: "0.35rem 0 0.5rem" }}>Catálogo de Prendas</h1>
          <p style={{ margin: "0 0 1rem", maxWidth: 620, opacity: 0.9 }}>
            Explora nuestras 18 prendas seleccionadas o consulta qué tonos combinan contigo en el{" "}
            <Link to="/asistente-colores" style={{ color: "#e9d5ff", fontWeight: 600 }}>
              Asistente de Color
            </Link>
            .
          </p>
        </div>
      </section>

      <section className="catalog" style={{ padding: "2.5rem 0 4rem" }}>
        <div className="container catalog__layout">
          <aside className="catalog__sidebar" aria-label="Filtrar por categoría">
            <h2 className="catalog__sidebar-title">Categorías</h2>
            <ul className="filter-list">
              {categories.map((cat) => (
                <li key={cat}>
                  <button
                    type="button"
                    onClick={() => setSelectedCategory(cat)}
                    className={`filter-list__link ${
                      selectedCategory === cat ? "filter-list__link--active" : ""
                    }`}
                    style={{
                      background: "none",
                      border: "none",
                      cursor: "pointer",
                      textAlign: "left",
                      width: "100%",
                      padding: "0.4rem 0",
                    }}
                  >
                    {cat}
                  </button>
                </li>
              ))}
            </ul>
          </aside>

          <div>
            <div className="catalog__header" style={{ marginBottom: "1.25rem" }}>
              <p style={{ margin: 0 }}>
                Mostrando <strong>{filteredProducts.length}</strong> prendas
                {selectedCategory !== "Todas" ? ` en ${selectedCategory}` : ""}
              </p>
            </div>

            <div className="catalog__grid">
              {filteredProducts.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
