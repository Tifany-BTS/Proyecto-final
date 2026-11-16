import { Link } from "react-router";

export function ViewNotFound() {
  return (
    <section style={{ textAlign: "center", padding: "3rem 1rem" }}>
      <h1>404 - Página no encontrada</h1>
      <p>La ruta solicitada no existe en Purple Bloom.</p>
      <Link to="/">Volver al catálogo</Link>
    </section>
  );
}
