import { useState } from "react";
import { ColorAdvisorCanvas } from "../components/color-advisor/ColorAdvisorCanvas";
import {
  CombinationGuide,
  type ColorAnalysisResult,
} from "../components/color-advisor/CombinationGuide";

export function ViewColorAdvisor() {
  const [imageSrc, setImageSrc] = useState("/img/blusa-rosa-palo.jpg");
  const [result, setResult] = useState<ColorAnalysisResult | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const url = URL.createObjectURL(file);
    setImageSrc(url);
    setResult(null);
    setErrorMessage(null);
  };

  return (
    <section>
      <header style={{ marginBottom: "1.5rem" }}>
        <h1 style={{ margin: "0 0 0.4rem", color: "#3b0764" }}>Asistente de Color</h1>
        <p style={{ margin: 0, color: "#5b4b6a" }}>
          Carga una fotografía o usa la muestra y toca sobre la prenda para ver su guía cromática.
        </p>
      </header>

      <div style={{ marginBottom: "1.25rem" }}>
        <label style={{ fontWeight: 600, display: "block", marginBottom: "0.4rem" }}>
          Subir fotografía de prenda:
        </label>
        <input type="file" accept="image/*" onChange={handleFileChange} />
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: "1.5rem", alignItems: "start" }}>
        <ColorAdvisorCanvas
          imageSrc={imageSrc}
          onPointEvaluated={(outcome) => {
            if (outcome.ok) {
              setResult(outcome.result);
              setErrorMessage(null);
            } else {
              setResult(null);
              setErrorMessage(outcome.error);
            }
          }}
        />

        <CombinationGuide
          result={result}
          errorMessage={errorMessage}
          onClear={() => {
            setResult(null);
            setErrorMessage(null);
          }}
        />
      </div>
    </section>
  );
}
