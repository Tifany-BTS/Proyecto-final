import { useState } from "react";
import { Link, NavLink, Outlet } from "react-router";
import { useCartStore } from "../../stores/use-cart-store";

export function MainLayout() {
  const totalItems = useCartStore((state) =>
    state.items.reduce((sum, item) => sum + item.quantity, 0)
  );
  const [notice, setNotice] = useState<string | null>(null);

  const handleStaticAction = (label: string) => {
    setNotice(`${label}: función visual informativa (sin sesión persistente en esta versión).`);
    setTimeout(() => setNotice(null), 3500);
  };

  return (
    <div className="pb-app-shell">
      <header className="site-header" style={{ padding: "1rem 2rem", borderBottom: "1px solid #eadcf2", background: "#fff" }}>
        <div style={{ maxWidth: 1200, margin: "0 auto", display: "flex", flexWrap: "wrap", alignItems: "center", justifyContent: "space-between", gap: "1rem" }}>
          <Link to="/" style={{ textDecoration: "none", fontWeight: 700, fontSize: "1.4rem", color: "#5b2a86" }}>
            Purple Bloom
          </Link>

          <nav aria-label="Navegación principal" style={{ display: "flex", gap: "1.25rem", alignItems: "center", flexWrap: "wrap" }}>
            <NavLink to="/" end style={{ textDecoration: "none", color: "#2d1b3d", fontWeight: 500 }}>
              Catálogo
            </NavLink>
            <NavLink to="/asistente-colores" style={{ textDecoration: "none", color: "#2d1b3d", fontWeight: 500 }}>
              Asistente de Color
            </NavLink>
            <NavLink to="/carrito" style={{ textDecoration: "none", color: "#2d1b3d", fontWeight: 600 }}>
              Carrito (<span data-testid="header-cart-count">{totalItems}</span>)
            </NavLink>
          </nav>

          <div style={{ display: "flex", gap: "0.75rem", alignItems: "center" }}>
            <span style={{ fontSize: "0.75rem", padding: "0.2rem 0.6rem", borderRadius: 999, background: "#f3e8ff", color: "#6b21a8", fontWeight: 600 }}>
              Club VIP
            </span>
            <button
              type="button"
              className="btn-secondary"
              onClick={() => handleStaticAction("Mi cuenta")}
              style={{ padding: "0.4rem 0.8rem", borderRadius: 8, border: "1px solid #d8b4fe", background: "transparent", cursor: "pointer" }}
            >
              Mi cuenta
            </button>
            <button
              type="button"
              className="btn-secondary"
              onClick={() => handleStaticAction("Iniciar sesión")}
              style={{ padding: "0.4rem 0.8rem", borderRadius: 8, border: "1px solid #d8b4fe", background: "transparent", cursor: "pointer" }}
            >
              Iniciar sesión
            </button>
          </div>
        </div>

        {notice && (
          <div
            role="status"
            style={{
              maxWidth: 1200,
              margin: "0.75rem auto 0",
              padding: "0.6rem 1rem",
              borderRadius: 8,
              background: "#f5f3ff",
              color: "#5b21b6",
              border: "1px solid #ddd6fe",
              fontSize: "0.9rem",
            }}
          >
            {notice}
          </div>
        )}
      </header>

      <main style={{ maxWidth: 1200, margin: "0 auto", padding: "2rem 1.5rem" }}>
        <Outlet />
      </main>

      <footer style={{ textAlign: "center", padding: "2rem 1rem", color: "#6b5b7b", borderTop: "1px solid #f0e6f6", marginTop: "3rem" }}>
        <p>Purple Bloom — Moda Femenina y Asesoría Cromática</p>
      </footer>
    </div>
  );
}
