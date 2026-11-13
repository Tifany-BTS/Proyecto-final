import { useState, type FormEvent } from "react";
import { Link } from "react-router";

const POLL_OPTIONS = [
  "Blusas satinadas y tejidos ligeros",
  "Conjuntos sastreros en lavanda y ciruela",
  "Vestidos midi con caída fluida",
  "Accesorios y pañuelos en tonos pastel",
];

export function ViewNews() {
  const [selectedVote, setSelectedVote] = useState<string>(POLL_OPTIONS[0]);
  const [voteSubmitted, setVoteSubmitted] = useState(false);

  const handleVote = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setVoteSubmitted(true);
  };

  return (
    <div style={{ background: "#1e0d33", color: "#f6f0fc" }}>
      <section
        style={{
          position: "relative",
          padding: "4.5rem 0 3.5rem",
          backgroundImage:
            'linear-gradient(180deg, rgba(24, 10, 42, 0.62) 0%, rgba(30, 13, 51, 0.96) 100%), url("/img/hero-coleccion-pasarela.jpg")',
          backgroundSize: "cover",
          backgroundPosition: "center top",
        }}
      >
        <div className="container">
          <h1
            style={{
              fontFamily: "Georgia, 'Times New Roman', serif",
              fontSize: "clamp(2.2rem, 4.5vw, 3.3rem)",
              margin: "0 0 0.75rem",
              color: "#ffffff",
            }}
          >
            Novedades y noticias
          </h1>
          <p style={{ maxWidth: 560, margin: "0 0 2rem", color: "#e5d6f5", fontSize: "1.05rem" }}>
            Las últimas noticias sobre la marca, lanzamientos de temporada y herramientas
            pensadas para tu estilo.
          </p>

          <div
            style={{
              maxWidth: 460,
              padding: "1.35rem 1.5rem",
              borderRadius: "1rem",
              background: "rgba(38, 17, 64, 0.85)",
              border: "1px solid rgba(200, 162, 200, 0.25)",
              boxShadow: "0 14px 34px rgba(0, 0, 0, 0.3)",
            }}
          >
            <h2
              style={{
                fontSize: "1.2rem",
                margin: "0 0 0.4rem",
                borderLeft: "3px solid #c084fc",
                paddingLeft: "0.75rem",
              }}
            >
              Purple Bloom más cerca de ti
            </h2>
            <p style={{ margin: "0 0 1rem", fontSize: "0.92rem", color: "#d8c4ee" }}>
              Conoce colecciones y noticias en un solo lugar.
            </p>
            <Link
              to="/"
              style={{
                display: "inline-block",
                padding: "0.5rem 1.15rem",
                borderRadius: "0.6rem",
                border: "1px solid rgba(255,255,255,0.55)",
                color: "#ffffff",
                textDecoration: "none",
                fontSize: "0.88rem",
                fontWeight: 600,
              }}
            >
              Ver catálogo
            </Link>
          </div>
        </div>
      </section>

      <section style={{ padding: "1.5rem 0 3rem" }}>
        <div
          className="container"
          style={{
            display: "grid",
            gridTemplateColumns: "minmax(0, 2fr) minmax(260px, 1fr)",
            gap: "1.75rem",
            alignItems: "start",
          }}
        >
          <article
            style={{
              background: "#2a1444",
              borderRadius: "1.15rem",
              padding: "1.5rem",
              border: "1px solid rgba(200, 162, 200, 0.16)",
            }}
          >
            <p
              style={{
                fontSize: "0.75rem",
                letterSpacing: "0.12em",
                textTransform: "uppercase",
                color: "#c084fc",
                margin: "0 0 0.75rem",
                fontWeight: 700,
              }}
            >
              NOTICIAS
            </p>
            <img
              src="/img/hero-coleccion-pasarela.jpg"
              alt="Colecciones y pasarelas Purple Bloom"
              style={{
                width: "100%",
                maxHeight: 430,
                objectFit: "cover",
                borderRadius: "0.85rem",
                marginBottom: "1.25rem",
              }}
            />
            <h2 style={{ fontSize: "1.45rem", margin: "0 0 0.65rem", color: "#ffffff" }}>
              Colecciones y pasarelas: los tonos que marcan el Otoño-Invierno
            </h2>
            <p style={{ color: "#dfd0f0", lineHeight: 1.65, marginBottom: "1.5rem" }}>
              El paso de gama malva, ciruela, berenjena y neutros luminosos redefine cada
              silueta de temporada con texturas suaves y cortes fluidos que acompañan tu ritmo
              diario.
            </p>

            <div
              style={{
                display: "grid",
                gap: "1rem",
                borderTop: "1px solid rgba(200, 162, 200, 0.18)",
                paddingTop: "1.25rem",
              }}
            >
              <div style={{ display: "flex", gap: "1rem", alignItems: "center" }}>
                <img
                  src="/img/blusa-lavanda.jpg"
                  alt="Purple Bloom sigue creciendo"
                  style={{ width: 64, height: 64, objectFit: "cover", borderRadius: "0.65rem" }}
                />
                <div>
                  <h3 style={{ margin: "0 0 0.25rem", fontSize: "1.02rem" }}>
                    Purple Bloom sigue creciendo
                  </h3>
                  <p style={{ margin: 0, fontSize: "0.9rem", color: "#d5c2ea" }}>
                    Renovamos nuestra tienda online para que elegir tus prendas favoritas sea cada
                    vez más simple.
                  </p>
                </div>
              </div>

              <div style={{ display: "flex", gap: "1rem", alignItems: "center" }}>
                <img
                  src="/img/vestido-casual.jpg"
                  alt="Estrenamos el asistente de combinación de colores"
                  style={{ width: 64, height: 64, objectFit: "cover", borderRadius: "0.65rem" }}
                />
                <div>
                  <h3 style={{ margin: "0 0 0.25rem", fontSize: "1.02rem" }}>
                    Estrenamos el asistente de combinación de colores
                  </h3>
                  <p style={{ margin: 0, fontSize: "0.9rem", color: "#d5c2ea" }}>
                    Toca cualquier prenda, detecta su tono exacto y descubre con qué colores
                    combinarla sin esfuerzo.
                  </p>
                </div>
              </div>
            </div>
          </article>

          <aside style={{ display: "grid", gap: "1.25rem" }}>
            <div
              style={{
                background: "#2a1444",
                borderRadius: "1.15rem",
                padding: "1.35rem",
                border: "1px solid rgba(200, 162, 200, 0.16)",
              }}
            >
              <p
                style={{
                  fontSize: "0.75rem",
                  letterSpacing: "0.12em",
                  textTransform: "uppercase",
                  color: "#c084fc",
                  margin: "0 0 1rem",
                  fontWeight: 700,
                }}
              >
                LO MÁS VISTO
              </p>
              <ul style={{ listStyle: "none", padding: 0, margin: 0, display: "grid", gap: "0.9rem" }}>
                <li style={{ display: "flex", gap: "0.75rem", alignItems: "center" }}>
                  <img
                    src="/img/blusa-lavanda.jpg"
                    alt=""
                    style={{ width: 48, height: 48, borderRadius: "0.55rem", objectFit: "cover" }}
                  />
                  <div>
                    <strong style={{ display: "block", fontSize: "0.88rem" }}>
                      Moda Otoño-Invierno 2026: ¿qué se viene esta temporada?
                    </strong>
                    <span style={{ fontSize: "0.76rem", color: "#bfa8d9" }}>Tendencias</span>
                  </div>
                </li>
                <li style={{ display: "flex", gap: "0.75rem", alignItems: "center" }}>
                  <img
                    src="/img/vestido-casual.jpg"
                    alt=""
                    style={{ width: 48, height: 48, borderRadius: "0.55rem", objectFit: "cover" }}
                  />
                  <div>
                    <strong style={{ display: "block", fontSize: "0.88rem" }}>
                      Lanzamiento exclusivo: nuevos colores
                    </strong>
                    <span style={{ fontSize: "0.76rem", color: "#bfa8d9" }}>Colección</span>
                  </div>
                </li>
                <li style={{ display: "flex", gap: "0.75rem", alignItems: "center" }}>
                  <img
                    src="/img/hero-coleccion-pasarela.jpg"
                    alt=""
                    style={{ width: 48, height: 48, borderRadius: "0.55rem", objectFit: "cover" }}
                  />
                  <div>
                    <strong style={{ display: "block", fontSize: "0.88rem" }}>
                      Nueva colección de temporada
                    </strong>
                    <span style={{ fontSize: "0.76rem", color: "#bfa8d9" }}>Editorial</span>
                  </div>
                </li>
              </ul>

              <div
                style={{
                  marginTop: "1.35rem",
                  paddingTop: "1.15rem",
                  borderTop: "1px solid rgba(200, 162, 200, 0.18)",
                }}
              >
                <h3 style={{ margin: "0 0 0.35rem", fontSize: "1rem" }}>
                  ¿Ya probaste el asistente de color?
                </h3>
                <p style={{ margin: "0 0 0.85rem", fontSize: "0.85rem", color: "#d5c2ea" }}>
                  Descubre al instante qué tonos armonizan con tus prendas favoritas.
                </p>
                <Link
                  to="/asistente-colores"
                  style={{
                    display: "inline-block",
                    padding: "0.45rem 1rem",
                    borderRadius: "999px",
                    background: "#c084fc",
                    color: "#1e0d33",
                    fontWeight: 700,
                    fontSize: "0.85rem",
                    textDecoration: "none",
                  }}
                >
                  Probar ahora
                </Link>
              </div>

              <form
                onSubmit={handleVote}
                style={{
                  marginTop: "1.35rem",
                  paddingTop: "1.15rem",
                  borderTop: "1px solid rgba(200, 162, 200, 0.18)",
                }}
              >
                <p
                  style={{
                    fontSize: "0.72rem",
                    letterSpacing: "0.1em",
                    textTransform: "uppercase",
                    color: "#c084fc",
                    margin: "0 0 0.25rem",
                  }}
                >
                  TU OPINIÓN CUENTA
                </p>
                <h3 style={{ margin: "0 0 0.4rem", fontSize: "1.1rem" }}>Diseña con nosotras</h3>
                <p style={{ margin: "0 0 0.85rem", fontSize: "0.85rem", color: "#d5c2ea" }}>
                  ¿Qué tipo de prendas te gustaría ver en la próxima cápsula?
                </p>

                <div style={{ display: "grid", gap: "0.5rem", marginBottom: "0.85rem" }}>
                  {POLL_OPTIONS.map((option) => (
                    <label
                      key={option}
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: "0.55rem",
                        padding: "0.55rem 0.75rem",
                        borderRadius: "0.6rem",
                        background:
                          selectedVote === option
                            ? "rgba(192, 132, 252, 0.25)"
                            : "rgba(18, 7, 32, 0.55)",
                        border: "1px solid rgba(200, 162, 200, 0.22)",
                        fontSize: "0.84rem",
                        cursor: "pointer",
                      }}
                    >
                      <input
                        type="radio"
                        name="capsule-poll"
                        checked={selectedVote === option}
                        onChange={() => {
                          setSelectedVote(option);
                          setVoteSubmitted(false);
                        }}
                      />
                      <span>{option}</span>
                    </label>
                  ))}
                </div>

                <button
                  type="submit"
                  style={{
                    width: "100%",
                    padding: "0.6rem 1rem",
                    borderRadius: "0.6rem",
                    border: "none",
                    background: "#ffffff",
                    color: "#1e0d33",
                    fontWeight: 700,
                    cursor: "pointer",
                  }}
                >
                  Votar
                </button>
                {voteSubmitted && (
                  <p role="status" style={{ margin: "0.6rem 0 0", fontSize: "0.82rem", color: "#d8b4fe" }}>
                    ¡Gracias por tu voto! Registramos tu preferencia por "{selectedVote}".
                  </p>
                )}
              </form>
            </div>
          </aside>
        </div>
      </section>

      <section style={{ padding: "0 0 3.5rem" }}>
        <div className="container" style={{ display: "grid", gap: "1.5rem" }}>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))",
              background: "#2a1444",
              borderRadius: "1.15rem",
              overflow: "hidden",
              border: "1px solid rgba(200, 162, 200, 0.16)",
            }}
          >
            <img
              src="/img/hero-coleccion-pasarela.jpg"
              alt="Nueva colección de temporada"
              style={{ width: "100%", height: 240, objectFit: "cover" }}
            />
            <div style={{ padding: "1.75rem", display: "grid", alignContent: "center" }}>
              <span style={{ fontSize: "0.75rem", letterSpacing: "0.12em", color: "#c084fc" }}>
                COLECCIÓN
              </span>
              <h2 style={{ margin: "0.4rem 0 0.65rem" }}>Nueva colección de temporada</h2>
              <p style={{ margin: "0 0 1.15rem", color: "#dfd0f0", fontSize: "0.94rem" }}>
                Presentamos nuestra propuesta de temporada: siluetas fluidas, vestidos midi y
                prendas versátiles pensadas para acompañarte todo el día.
              </p>
              <div>
                <Link
                  to="/"
                  style={{
                    display: "inline-block",
                    padding: "0.55rem 1.2rem",
                    borderRadius: "0.6rem",
                    border: "1px solid rgba(255,255,255,0.6)",
                    color: "#ffffff",
                    textDecoration: "none",
                    fontSize: "0.88rem",
                  }}
                >
                  Ver colección
                </Link>
              </div>
            </div>
          </div>

          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))",
              background: "#2a1444",
              borderRadius: "1.15rem",
              overflow: "hidden",
              border: "1px solid rgba(200, 162, 200, 0.16)",
            }}
          >
            <img
              src="/img/vestido-casual.jpg"
              alt="Lanzamiento exclusivo nuevos colores"
              style={{ width: "100%", height: 240, objectFit: "cover", background: "#f7f3fb" }}
            />
            <div style={{ padding: "1.75rem", display: "grid", alignContent: "center" }}>
              <span style={{ fontSize: "0.75rem", letterSpacing: "0.12em", color: "#c084fc" }}>
                LANZAMIENTO
              </span>
              <h2 style={{ margin: "0.4rem 0 0.65rem" }}>Lanzamiento exclusivo: nuevos colores</h2>
              <p style={{ margin: "0 0 1.15rem", color: "#dfd0f0", fontSize: "0.94rem" }}>
                Ampliamos nuestra paleta con tonos lavanda, violeta y berenjena en piezas clave
                de nuestro catálogo.
              </p>
              <div>
                <Link
                  to="/"
                  style={{
                    display: "inline-block",
                    padding: "0.55rem 1.2rem",
                    borderRadius: "0.6rem",
                    border: "1px solid rgba(255,255,255,0.6)",
                    color: "#ffffff",
                    textDecoration: "none",
                    fontSize: "0.88rem",
                  }}
                >
                  Ver catálogo
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="news-studio" aria-labelledby="news-studio-heading" style={{ padding: "3.5rem 0" }}>
        <div className="container news-studio__layout">
          <div className="news-studio__brand">
            <h2 id="news-studio-heading" className="news-studio__title">
              Purple <span className="news-studio__title-accent">Bloom</span>
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
    </div>
  );
}