import { Link } from "react-router";
import { useProducts } from "../hooks/useProducts";
import { ProductCard } from "../components/catalog/ProductCard";

export function ViewHome() {
  const { data: products } = useProducts();
  const featured = (products ?? []).slice(0, 4);

  return (
    <div>
      <section className="hero surface-aubergine">
        <div className="container hero__content" style={{ padding: "4.5rem 1.5rem" }}>
          <p className="intro__eyebrow">
            <span className="intro__eyebrow-bar" aria-hidden="true" />
            COLECCIÓN BOTÁNICA 2026
          </p>
          <h1 style={{ fontSize: "clamp(2rem, 4vw, 3.2rem)", margin: "0.5rem 0 1rem" }}>
            Viste con armonía, elegancia y tu paleta ideal
          </h1>
          <p style={{ maxWidth: 620, marginBottom: "1.75rem", opacity: 0.92 }}>
            Descubre prendas seleccionadas en tonos lavanda, ciruela y neutros luminosos,
            acompañadas de nuestro asistente inteligente de combinación de colores.
          </p>
          <div style={{ display: "flex", gap: "1rem", flexWrap: "wrap" }}>
            <Link to="/" className="btn btn--primary hero__cta">
              Explorar Catálogo
            </Link>
            <Link to="/asistente-colores" className="btn btn--outline">
              Probar Asistente de Color
            </Link>
          </div>
        </div>
      </section>

      <section className="intro surface-ivory" style={{ padding: "3.5rem 0" }}>
        <div className="container">
          <div className="section-header">
            <h2>La experiencia Purple Bloom</h2>
            <p>Diseño atemporal pensado para realzar tu estilo diario sin complicaciones.</p>
          </div>

          <div className="intro__feature-grid">
            <article className="intro__feature">
              <span className="intro__feature-number">01</span>
              <h3 className="intro__feature-title">Curaduría Cromática</h3>
              <p className="intro__feature-desc">
                Cada prenda está diseñada para combinar fácilmente entre sí en cápsulas versátiles.
              </p>
            </article>
            <article className="intro__feature">
              <span className="intro__feature-number">02</span>
              <h3 className="intro__feature-title">Asesoría Instantánea</h3>
              <p className="intro__feature-desc">
                Toca cualquier prenda en nuestro estudio de color para descubrir qué tonos la favorecen.
              </p>
            </article>
            <article className="intro__feature">
              <span className="intro__feature-number">03</span>
              <h3 className="intro__feature-title">Envío Ágil o Retiro</h3>
              <p className="intro__feature-desc">
                Recibe tu pedido en casa o retíralo en boutique sin costo adicional.
              </p>
            </article>
          </div>
        </div>
      </section>

      <section className="favorites" style={{ padding: "3.5rem 0" }}>
        <div className="container">
          <div className="section-header">
            <h2>Favoritas de la Temporada</h2>
            <p>Las piezas más buscadas de nuestra colección actual.</p>
          </div>
          <div className="favorites__grid">
            {featured.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
