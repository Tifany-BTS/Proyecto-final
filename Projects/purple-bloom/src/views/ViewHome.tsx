import { useState, useEffect, type FormEvent } from "react";
import { Link } from "react-router";
import { useProducts } from "../hooks/useProducts";
import { ProductCard } from "../components/catalog/ProductCard";

const HERO_SLIDES = [
  {
    image: "/img/hero-coleccion-pasarela.jpg",
    title: "Novedades Purple Bloom",
    subtitle: "Colecciones, tendencias y lanzamientos exclusivos.",
    ctaText: "Ver novedades", ctaTo: "/novedades",
  },
  {
    image: "/img/taller-diseno.jpg",
    title: "Asesoría Cromática",
    subtitle: "Descubre qué tonos realzan cada prenda de tu clóset.",
    ctaText: "Probar asistente",
    ctaTo: "/asistente-colores",
  },
  {
    image: "/img/vestido-violeta.jpg",
    title: "Tendencias de Temporada",
    subtitle: "Siluetas atemporales en lavanda, ciruela y neutros luminosos.",
    ctaText: "Explorar catálogo",
    ctaTo: "/",
  },
];

export function ViewHome() {
  const { data: products } = useProducts();
  const [heroIndex, setHeroIndex] = useState(0);
  const [carouselOffset, setCarouselOffset] = useState(0);
  const [contactSent, setContactSent] = useState(false);

  useEffect(() => {
    const timer = window.setInterval(() => {
      setHeroIndex((prev) => (prev + 1) % HERO_SLIDES.length);
    }, 6000);
    return () => window.clearInterval(timer);
  }, []);

  const currentSlide = HERO_SLIDES[heroIndex];
  const list = products ?? [];
  const visibleCount = 4;
  const maxOffset = Math.max(0, list.length - visibleCount);
  const featured = list.slice(carouselOffset, carouselOffset + visibleCount);

  const handlePrev = () => {
    setCarouselOffset((prev) => (prev <= 0 ? maxOffset : prev - 1));
  };

  const handleNext = () => {
    setCarouselOffset((prev) => (prev >= maxOffset ? 0 : prev + 1));
  };

  const handleContactSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setContactSent(true);
    event.currentTarget.reset();
  };

  return (
    <div id="inicio">
      <section
        className="hero"
        aria-label="Novedades Purple Bloom"
        style={{
          position: "relative",
          minHeight: 480,
          display: "grid",
          placeItems: "center",
          textAlign: "center",
          color: "#ffffff",
          backgroundImage: `linear-gradient(rgba(22, 11, 36, 0.42), rgba(22, 11, 36, 0.52)), url("${currentSlide.image}")`,
          backgroundSize: "cover",
          backgroundPosition: "center",
          overflow: "hidden",
        }}
      >
        <button
          type="button"
          onClick={() => setHeroIndex((prev) => (prev - 1 + HERO_SLIDES.length) % HERO_SLIDES.length)}
          aria-label="Diapositiva anterior"
          style={{
            position: "absolute",
            left: "1.25rem",
            top: "50%",
            transform: "translateY(-50%)",
            width: 40,
            height: 40,
            borderRadius: "999px",
            border: "none",
            background: "rgba(255, 255, 255, 0.25)",
            color: "#ffffff",
            fontSize: "1.2rem",
            cursor: "pointer",
            display: "grid",
            placeItems: "center",
          }}
        >
          ‹
        </button>

        <div className="container" style={{ padding: "4rem 3.5rem", maxWidth: 760 }}>
          <h1
            style={{
              fontFamily: "Georgia, 'Times New Roman', serif",
              fontSize: "clamp(2.2rem, 4.5vw, 3.4rem)",
              fontWeight: 700,
              margin: "0 0 0.75rem",
              textShadow: "0 2px 14px rgba(0,0,0,0.38)",
            }}
          >
            {currentSlide.title}
          </h1>
          <p
            style={{
              fontSize: "clamp(1rem, 1.8vw, 1.2rem)",
              margin: "0 auto 1.75rem",
              opacity: 0.95,
              textShadow: "0 1px 10px rgba(0,0,0,0.35)",
            }}
          >
            {currentSlide.subtitle}
          </p>
          <Link
            to={currentSlide.ctaTo}
            style={{
              display: "inline-block",
              padding: "0.75rem 1.75rem",
              borderRadius: "0.75rem",
              border: "1.5px solid rgba(255, 255, 255, 0.85)",
              background: "rgba(32, 18, 48, 0.32)",
              color: "#ffffff",
              fontWeight: 600,
              textDecoration: "none",
              backdropFilter: "blur(4px)",
            }}
          >
            {currentSlide.ctaText}
          </Link>
        </div>

        <button
          type="button"
          onClick={() => setHeroIndex((prev) => (prev + 1) % HERO_SLIDES.length)}
          aria-label="Siguiente diapositiva"
          style={{
            position: "absolute",
            right: "1.25rem",
            top: "50%",
            transform: "translateY(-50%)",
            width: 40,
            height: 40,
            borderRadius: "999px",
            border: "none",
            background: "rgba(255, 255, 255, 0.25)",
            color: "#ffffff",
            fontSize: "1.2rem",
            cursor: "pointer",
            display: "grid",
            placeItems: "center",
          }}
        >
          ›
        </button>

        <div
          role="group"
          aria-label="Seleccionar diapositiva"
          style={{
            position: "absolute",
            bottom: "1.35rem",
            left: "50%",
            transform: "translateX(-50%)",
            display: "flex",
            gap: "0.6rem",
          }}
        >
          {HERO_SLIDES.map((slide, idx) => (
            <button
              key={slide.title}
              type="button"
              onClick={() => setHeroIndex(idx)}
              aria-label={`Ir a ${slide.title}`}
              aria-pressed={idx === heroIndex}
              style={{
                width: 10,
                height: 10,
                padding: 0,
                borderRadius: "999px",
                border: "none",
                background: idx === heroIndex ? "#ffffff" : "rgba(255, 255, 255, 0.45)",
                cursor: "pointer",
              }}
            />
          ))}
        </div>
      </section>

      <section className="intro surface-ivory" style={{ padding: "3.5rem 0" }}>
        <div className="container">
          <div className="section-header">
            <h2>La experiencia Purple Bloom</h2>
            <p className="intro__features-lead">
              Purple Bloom conecta diseño, catálogo y experiencia de compra en un solo lugar,
              pensado exclusivamente para moda femenina.
            </p>
          </div>

          <ul className="intro__feature-grid">
            <li className="intro__feature">
              <p className="intro__feature-number">01</p>
              <h3 className="intro__feature-title">Asesoría &amp; Estilo</h3>
              <p className="intro__feature-desc">Sugerencias a tu medida al iniciar sesión.</p>
            </li>
            <li className="intro__feature">
              <p className="intro__feature-number">02</p>
              <h3 className="intro__feature-title">Compras sin esfuerzo</h3>
              <p className="intro__feature-desc">Direcciones guardadas y seguimiento en tiempo real.</p>
            </li>
            <li className="intro__feature">
              <p className="intro__feature-number">03</p>
              <h3 className="intro__feature-title">Club VIP Moda</h3>
              <p className="intro__feature-desc">Puntos que se canjean por beneficios reales.</p>
            </li>
            <li className="intro__feature">
              <p className="intro__feature-number">04</p>
              <h3 className="intro__feature-title">Asistente de color</h3>
              <p className="intro__feature-desc">Combina tus prendas con armonía cromática.</p>
            </li>
          </ul>
        </div>
      </section>

      <section
        id="destacados"
        className="favorites section--watermark surface-ivory surface-sky"
        aria-labelledby="favorites-heading"
        style={{ padding: "3.5rem 0" }}
      >
        <div className="container">
          <header className="section-header">
            <h2 id="favorites-heading">Lo más elegido &amp; Tendencias</h2>
            <p>Las piezas más elegidas por nuestra comunidad esta temporada.</p>
          </header>

          <div className="favorites__carousel">
            <button
              type="button"
              className="favorites__arrow favorites__arrow--prev"
              onClick={handlePrev}
              aria-label="Producto anterior"
            >
              <svg aria-hidden="true" width="20" height="20" viewBox="0 0 24 24" fill="none">
                <path
                  d="M15 5l-7 7 7 7"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </button>

            <div className="favorites__grid" id="favorites-track" role="list">
              {featured.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>

            <button
              type="button"
              className="favorites__arrow favorites__arrow--next"
              onClick={handleNext}
              aria-label="Producto siguiente"
            >
              <svg aria-hidden="true" width="20" height="20" viewBox="0 0 24 24" fill="none">
                <path
                  d="M9 5l7 7-7 7"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </button>
          </div>
        </div>
      </section>

      <section className="news-studio" aria-labelledby="news-studio-heading" style={{ padding: "3.5rem 0" }}>
        <div className="container news-studio__layout">
          <div className="news-studio__brand">
            <h2 id="news-studio-heading" className="news-studio__title">
              Así <span className="news-studio__title-accent">diseñamos</span>
            </h2>
            <img
              className="news-studio__photo"
              src="/img/taller-diseno.jpg"
              alt="El equipo de diseño de Purple Bloom bocetando y eligiendo telas en el taller"
              width="900"
              height="1200"
              loading="lazy"
            />
          </div>

          <div className="news-studio__process">
            <h3 className="news-studio__subhead">Color, textura y oficio hechos a mano</h3>
            <p>
              Cada colección empieza en un boceto: una silueta, una paleta de color, una idea de
              cómo debería caer la tela sobre el cuerpo.
            </p>
            <p>
              De ahí pasa a la mesa de corte. Elegimos cada textura a mano, probamos combinaciones
              de color y ajustamos el patrón hasta que la prenda se siente tan bien como se ve.
            </p>
            <p>
              Del boceto a la percha: cada pieza de Purple Bloom pasa por manos reales antes de
              llegar a tu clóset.
            </p>
          </div>

          <ul className="news-studio__team">
            <li className="news-studio__member">
              <div className="news-studio__avatar" aria-hidden="true">VR</div>
              <div>
                <h4 className="news-studio__member-name">Valentina Ríos</h4>
                <p className="news-studio__member-role">Diseñadora principal</p>
                <p className="news-studio__member-desc">
                  Lidera cada colección desde el primer boceto hasta la pasarela.
                </p>
              </div>
            </li>
            <li className="news-studio__member">
              <div className="news-studio__avatar" aria-hidden="true">MF</div>
              <div>
                <h4 className="news-studio__member-name">Mateo Fernández</h4>
                <p className="news-studio__member-role">Diseñador de tejidos</p>
                <p className="news-studio__member-desc">
                  Selecciona las telas y texturas que definen cada temporada.
                </p>
              </div>
            </li>
            <li className="news-studio__member">
              <div className="news-studio__avatar" aria-hidden="true">CD</div>
              <div>
                <h4 className="news-studio__member-name">Camila Duarte</h4>
                <p className="news-studio__member-role">Diseñadora de color</p>
                <p className="news-studio__member-desc">
                  Define las paletas que inspiran cada colección de Purple Bloom.
                </p>
              </div>
            </li>
            <li className="news-studio__member">
              <div className="news-studio__avatar" aria-hidden="true">JS</div>
              <div>
                <h4 className="news-studio__member-name">Joaquín Silva</h4>
                <p className="news-studio__member-role">Patronista</p>
                <p className="news-studio__member-desc">
                  Convierte cada boceto en un patrón que se ajusta a cada cuerpo.
                </p>
              </div>
            </li>
          </ul>
        </div>
      </section>

      <section
        id="contacto"
        className="contact-section surface-ivory surface-sky"
        aria-labelledby="contact-form-heading"
        style={{ padding: "3.5rem 0" }}
      >
        <div className="container">
          <div className="contact-section__panel">
            <div className="contact-section__card">
              <header className="section-header">
                <h2 id="contact-form-heading">Formulario de contacto</h2>
                <p>¿Tienes dudas o comentarios? Escríbenos y te responderemos pronto.</p>
              </header>

              <form className="form-contacto" onSubmit={handleContactSubmit}>
                <div className="form-group">
                  <label htmlFor="nombre">Nombre</label>
                  <div className="field-control">
                    <input id="nombre" type="text" name="nombre" required minLength={2} placeholder=" " />
                  </div>
                </div>
                <div className="form-group">
                  <label htmlFor="email">Correo</label>
                  <div className="field-control">
                    <input id="email" type="email" name="email" required placeholder=" " />
                  </div>
                </div>
                <div className="form-group">
                  <label htmlFor="mensaje">Mensaje</label>
                  <div className="field-control">
                    <textarea id="mensaje" name="mensaje" rows={3} required minLength={10} placeholder=" " />
                  </div>
                </div>
                <button type="submit" className="btn btn--primary">
                  Enviar
                </button>
              </form>

              {contactSent && (
                <div className="form-feedback" role="status" aria-live="polite" style={{ marginTop: "0.75rem" }}>
                  ¡Gracias por escribirnos! Nuestro equipo de Purple Bloom te responderá pronto.
                </div>
              )}
            </div>

            <div className="contact-section__decor" aria-hidden="true">
              <p className="contact-section__decor-text">
                Estamos aquí para ayudarte, escríbenos por el medio que prefieras.
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}