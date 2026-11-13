import { useState, type MouseEvent } from "react";

interface ColorGuideItem {
  name: string;
  hex: string;
  goodWith: string[];
  cautionWith: string[];
  avoidWith: string[];
}

const PALETTE: ColorGuideItem[] = [
  {
    name: "Rosa Palo Suave",
    hex: "#F4C2C2",
    goodWith: ["Blanco Marfil", "Gris Perla", "Azul Marino"],
    cautionWith: ["Mostaza", "Verde Oliva"],
    avoidWith: ["Naranja Neón", "Rojo Escarlata"],
  },
  {
    name: "Lavanda Botánica",
    hex: "#C8A2C8",
    goodWith: ["Crema", "Plata", "Berenjena Profundo"],
    cautionWith: ["Marrón Chocolate", "Turquesa"],
    avoidWith: ["Amarillo Canario", "Fucsia Intenso"],
  },
  {
    name: "Ciruela Elegante",
    hex: "#673147",
    goodWith: ["Champán", "Rosa Viejo", "Negro Carbón"],
    cautionWith: ["Azul Eléctrico", "Verde Menta"],
    avoidWith: ["Naranja Mandarina", "Verde Lima"],
  },
];

export function ViewColorAdvisor() {
  const [selectedPalette, setSelectedPalette] = useState<ColorGuideItem | null>(null);
  const [outsideError, setOutsideError] = useState<string>("");

  const handleGarmentAreaClick = (event: MouseEvent<HTMLDivElement>) => {
    const rect = event.currentTarget.getBoundingClientRect();
    const relX = (event.clientX - rect.left) / rect.width;
    const relY = (event.clientY - rect.top) / rect.height;

    const isInsideGarment = relX >= 0.22 && relX <= 0.78 && relY >= 0.16 && relY <= 0.86;

    if (!isInsideGarment) {
      setSelectedPalette(null);
      setOutsideError("No se encuentra la blusa o prenda");
      return;
    }

    setOutsideError("");
    const index = Math.min(
      PALETTE.length - 1,
      Math.floor(((relY - 0.16) / 0.7) * PALETTE.length)
    );
    setSelectedPalette(PALETTE[Math.max(0, index)]);
  };

  return (
    <section className="color-assistant-page" style={{ padding: "2.5rem 0 4rem" }}>
      <div className="container">
        <div className="section-header">
          <h1>Asistente de Combinación de Colores</h1>
          <p className="prenda-instrucciones">
            Haz clic sobre la prenda en el lienzo para analizar su tono y obtener tu guía cromática.
          </p>
        </div>

        <div className="color-assistant">
          <div className="color-assistant__uploader">
            <div
              className="prenda-dropzone"
              data-testid="garment-touch-area"
              role="button"
              tabIndex={0}
              aria-label="Lienzo interactivo de prenda para detección de color"
              onClick={handleGarmentAreaClick}
              style={{
                position: "relative",
                width: "100%",
                maxWidth: 420,
                height: 360,
                cursor: "crosshair",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                userSelect: "none",
              }}
            >
              <svg
                width="230"
                height="250"
                viewBox="0 0 220 240"
                aria-hidden="true"
                data-testid="garment-silhouette"
              >
                <path
                  d="M65 25 L90 15 Q110 30 130 15 L155 25 L195 65 L170 90 L150 70 L150 215 L70 215 L70 70 L50 90 L25 65 Z"
                  fill={selectedPalette ? selectedPalette.hex : "#C8A2C8"}
                  stroke="#581C87"
                  strokeWidth="3"
                />
              </svg>
            </div>

            {outsideError && (
              <p role="alert" className="form-feedback form-feedback--error" style={{ marginTop: "1rem" }}>
                {outsideError}
              </p>
            )}
          </div>

          <div>
            {selectedPalette ? (
              <div className="guia-combinaciones-wrap" style={{ padding: "1.5rem" }}>
                <div className="color-resultado" style={{ marginBottom: "1rem" }}>
                  <span
                    className="color-resultado__swatch"
                    style={{
                      display: "inline-block",
                      width: 28,
                      height: 28,
                      borderRadius: "50%",
                      backgroundColor: selectedPalette.hex,
                      border: "1px solid #4c1d95",
                      marginRight: "0.75rem",
                      verticalAlign: "middle",
                    }}
                  />
                  <strong className="color-resultado__texto" style={{ fontSize: "1.15rem" }}>
                    {selectedPalette.name}
                  </strong>
                </div>

                <div className="guia-combinaciones">
                  <p className="guia-combinaciones__fila--bien">
                    <strong>Combina bien:</strong> {selectedPalette.goodWith.join(", ")}
                  </p>
                  <p className="guia-combinaciones__fila--precaucion">
                    <strong>Con precaución:</strong> {selectedPalette.cautionWith.join(", ")}
                  </p>
                  <p className="guia-combinaciones__fila--evitar">
                    <strong>Evitar:</strong> {selectedPalette.avoidWith.join(", ")}
                  </p>
                </div>
              </div>
            ) : (
              <div className="guia-combinaciones-wrap" style={{ padding: "1.5rem" }}>
                <h3>Tu paleta personalizada aparecerá aquí</h3>
                <p>
                  Toca directamente la silueta de la prenda en el recuadro izquierdo para detectar
                  su matiz y recibir recomendaciones de combinación.
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
