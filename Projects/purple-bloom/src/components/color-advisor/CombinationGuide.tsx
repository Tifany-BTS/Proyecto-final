export interface ColorAnalysisResult {
  detectedName: string;
  hex: string;
  rgb: string;
  combinaBien: string[];
  conPrecaucion: string[];
  evitar: string[];
}

interface CombinationGuideProps {
  result: ColorAnalysisResult | null;
  errorMessage: string | null;
  onClear: () => void;
}

export function CombinationGuide({ result, errorMessage, onClear }: CombinationGuideProps) {
  if (errorMessage) {
    return (
      <div
        role="alert"
        style={{
          padding: "1.25rem",
          borderRadius: 12,
          border: "1px solid #fecaca",
          background: "#fef2f2",
          color: "#b91c1c",
          fontWeight: 600,
        }}
      >
        {errorMessage}
      </div>
    );
  }

  if (!result) {
    return (
      <div
        style={{
          padding: "1.25rem",
          borderRadius: 12,
          border: "1px dashed #d8b4fe",
          color: "#5b4b6a",
        }}
      >
        Toca o haz clic sobre la prenda en la imagen para analizar su tono y recibir recomendaciones.
      </div>
    );
  }

  return (
    <div
      style={{
        padding: "1.5rem",
        borderRadius: 12,
        border: "1px solid #eadcf2",
        background: "#fff",
      }}
    >
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: "1rem", marginBottom: "1rem" }}>
        <div style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
          <span
            aria-hidden="true"
            style={{
              width: 32,
              height: 32,
              borderRadius: "50%",
              background: result.hex,
              border: "1px solid #ccc",
              display: "inline-block",
            }}
          />
          <div>
            <strong style={{ display: "block", fontSize: "1.1rem" }}>{result.detectedName}</strong>
            <small style={{ color: "#6b5b7b" }}>
              {result.hex} · {result.rgb}
            </small>
          </div>
        </div>

        <button
          type="button"
          onClick={onClear}
          style={{
            padding: "0.45rem 0.9rem",
            borderRadius: 8,
            border: "1px solid #d8b4fe",
            background: "#faf5ff",
            color: "#6b21a8",
            fontWeight: 600,
            cursor: "pointer",
          }}
        >
          Limpiar selección
        </button>
      </div>

      <div style={{ display: "grid", gap: "0.9rem" }}>
        <div>
          <strong style={{ color: "#15803d" }}>Combina bien:</strong>
          <p style={{ margin: "0.25rem 0 0" }}>{result.combinaBien.join(", ")}</p>
        </div>
        <div>
          <strong style={{ color: "#b45309" }}>Con precaución:</strong>
          <p style={{ margin: "0.25rem 0 0" }}>{result.conPrecaucion.join(", ")}</p>
        </div>
        <div>
          <strong style={{ color: "#b91c1c" }}>Evitar:</strong>
          <p style={{ margin: "0.25rem 0 0" }}>{result.evitar.join(", ")}</p>
        </div>
      </div>
    </div>
  );
}
