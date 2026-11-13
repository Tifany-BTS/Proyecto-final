import { useMemo, useState } from "react";
import { useProducts } from "../hooks/useProducts";
import { ProductFilter } from "../components/catalog/ProductFilter";
import { ProductGrid } from "../components/catalog/ProductGrid";

export function ViewCatalog() {
  const { data, isLoading, isError } = useProducts();
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("Todas");

  const filteredProducts = useMemo(() => {
    if (!data) return [];
    return data.filter((product) => {
      const matchesCategory =
        selectedCategory === "Todas" || product.category === selectedCategory;
      const matchesSearch = product.name
        .toLowerCase()
        .includes(searchTerm.trim().toLowerCase());
      return matchesCategory && matchesSearch;
    });
  }, [data, searchTerm, selectedCategory]);

  return (
    <section>
      <header style={{ marginBottom: "1.5rem" }}>
        <h1 style={{ margin: "0 0 0.4rem", color: "#3b0764" }}>Catálogo Purple Bloom</h1>
        <p style={{ margin: 0, color: "#5b4b6a" }}>
          Explora nuestras prendas femeninas y combina tus tonos ideales.
        </p>
      </header>

      <ProductFilter
        searchTerm={searchTerm}
        onSearchChange={setSearchTerm}
        selectedCategory={selectedCategory}
        onCategoryChange={setSelectedCategory}
      />

      {isLoading && <p role="status">Cargando catálogo de prendas...</p>}
      {isError && <p role="alert">Error al cargar el catálogo.</p>}
      {!isLoading && !isError && data && (
        data.length === 0 ? (
          <p>No hay prendas disponibles</p>
        ) : (
          <ProductGrid products={filteredProducts} />
        )
      )}
    </section>
  );
}
