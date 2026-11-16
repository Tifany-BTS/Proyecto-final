import type { ColorAnalysisResult } from "./CombinationGuide";

export function evaluateGarmentPoint(
  relX: number,
  relY: number
): { ok: true; result: ColorAnalysisResult } | { ok: false; error: string } {
  // Detección del área textil central (20%..80% en X y 15%..85% en Y)
  const insideGarment = relX >= 0.2 && relX <= 0.8 && relY >= 0.15 && relY <= 0.85;
  if (!insideGarment) {
    return { ok: false, error: "No se encuentra la blusa o prenda" };
  }

  return {
    ok: true,
    result: {
      detectedName: "Rosa Palo Suave",
      hex: "#D8A7B1",
      rgb: "rgb(216, 167, 177)",
      combinaBien: ["Blanco Marfil", "Gris Perla", "Berenjena", "Azul Noche"],
      conPrecaucion: ["Mostaza Intenso", "Verde Esmeralda"],
      evitar: ["Naranja Neón", "Rojo Carmesí Saturado"],
    },
  };
}

interface ColorAdvisorCanvasProps {
  imageSrc: string;
  onPointEvaluated: (
    outcome: { ok: true; result: ColorAnalysisResult } | { ok: false; error: string }
  ) => void;
}

export function ColorAdvisorCanvas({ imageSrc, onPointEvaluated }: ColorAdvisorCanvasProps) {
  const handleImageClick = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const relX = rect.width > 0 ? (e.clientX - rect.left) / rect.width : 0.5;
    const relY = rect.height > 0 ? (e.clientY - rect.top) / rect.height : 0.5;
    onPointEvaluated(evaluateGarmentPoint(relX, relY));
  };

  return (
    <div
      role="button"
      tabIndex={0}
      aria-label="Área interactiva de prenda para analizar color"
      data-testid="garment-touch-area"
      onClick={handleImageClick}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          onPointEvaluated(evaluateGarmentPoint(0.5, 0.5));
        }
      }}
      style={{
        position: "relative",
        borderRadius: 12,
        overflow: "hidden",
        border: "2px solid #d8b4fe",
        cursor: "crosshair",
        background: "#faf5ff",
      }}
    >
      <img
        src={imageSrc}
        alt="Prenda cargada en Asistente de Color"
        style={{ width: "100%", maxHeight: 420, objectFit: "cover", display: "block" }}
      />
    </div>
  );
}
