import { useState, type FormEvent } from "react";
import { Link, NavLink, Outlet } from "react-router";
import { useCartStore } from "../../stores/use-cart-store";

interface UserSession {
  name: string;
  email: string;
}

export function MainLayout() {
  const totalCount = useCartStore((state) =>
    state.items.reduce((acc, item) => acc + item.quantity, 0)
  );

  const [session, setSession] = useState<UserSession | null>(null);
  const [loginOpen, setLoginOpen] = useState(false);
  const [nameInput, setNameInput] = useState("Camila");
  const [emailInput, setEmailInput] = useState("camila@purplebloom.com");

  const handleLoginSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const cleanName = nameInput.trim() || "Clienta VIP";
    const cleanEmail = emailInput.trim() || "clienta@purplebloom.com";
    setSession({ name: cleanName, email: cleanEmail });
    setLoginOpen(false);
  };

  return (
    <div className="app-shell">
      <a className="skip-link" href="#contenido-principal">
        Saltar al contenido principal
      </a>

      <header className="site-header" role="banner">
        <div className="container site-header__inner">
          <Link to="/inicio" className="site-logo" aria-label="Purple Bloom Inicio">
            <svg
              className="site-logo__mark"
              aria-hidden="true"
              viewBox="0 0 64 64"
              width="32"
              height="32"
              fill="currentColor"
            >
              <path d="M32,32 C24,28 18,16 32,4 C46,16 40,28 32,32 Z" />
              <path d="M32,32 C24,28 18,16 32,4 C46,16 40,28 32,32 Z" transform="rotate(90 32 32)" />
              <path d="M32,32 C24,28 18,16 32,4 C46,16 40,28 32,32 Z" transform="rotate(180 32 32)" />
              <path d="M32,32 C24,28 18,16 32,4 C46,16 40,28 32,32 Z" transform="rotate(270 32 32)" />
              <circle cx="32" cy="32" r="2.6" />
            </svg>
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
              <li>
                {session ? (
                  <div style={{ display: "inline-flex", alignItems: "center", gap: "0.55rem" }}>
                    <span
                      aria-label={`Sesión iniciada como ${session.name}`}
                      title={`${session.name} (${session.email})`}
                      style={{
                        width: 34,
                        height: 34,
                        borderRadius: "999px",
                        background: "rgba(155, 114, 207, 0.22)",
                        border: "1.5px solid currentColor",
                        display: "inline-flex",
                        alignItems: "center",
                        justifyContent: "center",
                        flexShrink: 0,
                      }}
                    >
                      <svg aria-hidden="true" width="18" height="18" viewBox="0 0 24 24" fill="none">
                        <circle cx="12" cy="8" r="4" stroke="currentColor" strokeWidth="2" />
                        <path
                          d="M4.5 20c1.6-3.6 4.4-5.2 7.5-5.2s5.9 1.6 7.5 5.2"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                        />
                      </svg>
                    </span>
                    <span style={{ fontSize: "0.9rem", fontWeight: 600 }}>{session.name}</span>
                    <button
                      type="button"
                      onClick={() => setSession(null)}
                      style={{
                        background: "transparent",
                        border: "1px solid currentColor",
                        borderRadius: "999px",
                        padding: "0.2rem 0.6rem",
                        fontSize: "0.78rem",
                        color: "inherit",
                        cursor: "pointer",
                      }}
                    >
                      Salir
                    </button>
                  </div>
                ) : (
                  <button
                    type="button"
                    onClick={() => setLoginOpen(true)}
                    style={{
                      display: "inline-flex",
                      alignItems: "center",
                      gap: "0.4rem",
                      background: "rgba(255,255,255,0.12)",
                      border: "1px solid rgba(255,255,255,0.35)",
                      borderRadius: "999px",
                      padding: "0.35rem 0.85rem",
                      color: "inherit",
                      fontSize: "0.9rem",
                      cursor: "pointer",
                    }}
                  >
                    <svg aria-hidden="true" width="16" height="16" viewBox="0 0 24 24" fill="none">
                      <circle cx="12" cy="8" r="4" stroke="currentColor" strokeWidth="2" />
                      <path
                        d="M5 20c1.5-3.4 4.1-5 7-5s5.5 1.6 7 5"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                      />
                    </svg>
                    <span>Iniciar sesión</span>
                  </button>
                )}
              </li>
            </ul>
          </nav>
        </div>
      </header>

      {loginOpen && (
        <div
          role="dialog"
          aria-modal="true"
          aria-labelledby="login-modal-title"
          style={{
            position: "fixed",
            inset: 0,
            background: "rgba(22, 11, 36, 0.65)",
            display: "grid",
            placeItems: "center",
            zIndex: 1200,
            padding: "1rem",
          }}
        >
          <div
            style={{
              background: "var(--surface, #fff)",
              color: "var(--text, #1f142b)",
              borderRadius: "1rem",
              maxWidth: 400,
              width: "100%",
              padding: "1.75rem",
              boxShadow: "0 20px 48px rgba(0,0,0,0.28)",
            }}
          >
            <h2 id="login-modal-title" style={{ marginTop: 0 }}>
              Iniciar sesión en Purple Bloom
            </h2>
            <p style={{ fontSize: "0.92rem", opacity: 0.82 }}>
              Accede a tus recomendaciones de color y guarda tus piezas favoritas.
            </p>
            <form onSubmit={handleLoginSubmit} style={{ display: "grid", gap: "0.9rem" }}>
              <label style={{ display: "grid", gap: "0.3rem", fontSize: "0.9rem" }}>
                <span>Nombre</span>
                <input
                  type="text"
                  value={nameInput}
                  onChange={(e) => setNameInput(e.target.value)}
                  required
                  style={{ padding: "0.55rem 0.75rem", borderRadius: "0.5rem", border: "1px solid #cbbce0" }}
                />
              </label>
              <label style={{ display: "grid", gap: "0.3rem", fontSize: "0.9rem" }}>
                <span>Correo electrónico</span>
                <input
                  type="email"
                  value={emailInput}
                  onChange={(e) => setEmailInput(e.target.value)}
                  required
                  style={{ padding: "0.55rem 0.75rem", borderRadius: "0.5rem", border: "1px solid #cbbce0" }}
                />
              </label>
              <div style={{ display: "flex", gap: "0.65rem", justifyContent: "flex-end", marginTop: "0.5rem" }}>
                <button
                  type="button"
                  className="btn btn--outline"
                  onClick={() => setLoginOpen(false)}
                >
                  Cancelar
                </button>
                <button type="submit" className="btn btn--primary">
                  Entrar
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      <main id="contenido-principal">
        <Outlet />
      </main>

      <Link to="/carrito" className="cart-fab" aria-label="Abrir bolsa flotante">
        <svg aria-hidden="true" width="24" height="24" viewBox="0 0 24 24" fill="none">
          <path
            d="M6 6h15l-1.5 9h-12L6 6z"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinejoin="round"
          />
          <circle cx="9" cy="20" r="1.5" fill="currentColor" />
          <circle cx="18" cy="20" r="1.5" fill="currentColor" />
        </svg>
        <span className="cart-fab__label">Mi bolsa</span>
        <span className="cart-fab__count" hidden={totalCount === 0}>
          {totalCount}
        </span>
      </Link>

      <footer className="site-footer" role="contentinfo">
        <div className="container site-footer__grid">
          <nav className="site-footer__links" aria-labelledby="footer-links-heading">
            <h2 id="footer-links-heading">Enlaces</h2>
            <ul>
              <li>
                <Link to="/inicio">Portada</Link>
              </li>
              <li>
                <Link to="/">Colección</Link>
              </li>
              <li>
                <Link to="/asistente-colores">Asistente de color</Link>
              </li>
              <li>
                <Link to="/carrito">Resumen de compra</Link>
              </li>
            </ul>
          </nav>

          <div className="site-footer__powered" aria-labelledby="powered-heading">
            <svg
              className="site-footer__flower"
              aria-hidden="true"
              viewBox="0 0 64 64"
              width="28"
              height="28"
              fill="currentColor"
            >
              <path d="M32,32 C24,28 18,16 32,4 C46,16 40,28 32,32 Z" />
              <path d="M32,32 C24,28 18,16 32,4 C46,16 40,28 32,32 Z" transform="rotate(90 32 32)" />
              <path d="M32,32 C24,28 18,16 32,4 C46,16 40,28 32,32 Z" transform="rotate(180 32 32)" />
              <path d="M32,32 C24,28 18,16 32,4 C46,16 40,28 32,32 Z" transform="rotate(270 32 32)" />
              <circle cx="32" cy="32" r="2.2" />
            </svg>
            <h2 id="powered-heading">Purple Bloom</h2>
            <p>Moda femenina online.</p>
            <p className="site-footer__copy">© 2026 Purple Bloom. Todos los derechos reservados.</p>
          </div>

          <div className="site-footer__brand">
            <img src="/img/logo-purple-bloom.png" alt="Purple Bloom" width="480" height="100" />
          </div>
        </div>
      </footer>
    </div>
  );
}