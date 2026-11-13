import { Link, NavLink, Outlet } from "react-router";
import { useCartStore } from "../../stores/use-cart-store";

export function MainLayout() {
  const totalCount = useCartStore((state) =>
    state.items.reduce((acc, item) => acc + item.quantity, 0)
  );

  return (
    <div className="app-shell">
      <header className="site-header">
        <div className="container site-header__inner">
          <Link to="/" className="site-logo" aria-label="Purple Bloom Inicio">
            <span className="site-logo__mark" aria-hidden="true">✿</span>
            <span className="site-logo__text">
              <span className="site-logo__name">Purple Bloom</span>
              <span className="site-logo__tagline">Moda &amp; Asesoría Cromática</span>
            </span>
          </Link>

          <nav className="site-nav" aria-label="Navegación principal">
            <ul className="site-nav__list">
              <li>
                <NavLink to="/inicio">Inicio</NavLink>
              </li>
              <li>
                <NavLink to="/" end>
                  Catálogo
                </NavLink>
              </li>
              <li>
                <NavLink to="/asistente-colores">Asistente de Color</NavLink>
              </li>
              <li>
                <NavLink to="/carrito" className="site-nav__cart-link">
                  Carrito (<span data-testid="header-cart-count">{totalCount}</span>)
                </NavLink>
              </li>
            </ul>
          </nav>
        </div>
      </header>

      <main>
        <Outlet />
      </main>

      <footer className="site-footer">
        <div className="container site-footer__grid">
          <div className="site-footer__brand">
            <span className="site-footer__flower" aria-hidden="true">✿</span>
            <strong>Purple Bloom</strong>
            <p className="site-footer__copy">
              Boutique digital femenina y estudio de armonía cromática.
            </p>
          </div>
          <div className="site-footer__powered">
            <p>© 2026 Purple Bloom — Todos los derechos reservados.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
