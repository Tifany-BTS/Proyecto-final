import { useState } from "react";

interface ProductAccordionProps {
  material: string;
  care: "mano" | "maquina" | "ambos";
}

export function ProductAccordion({ material, care }: ProductAccordionProps) {
  const [openSection, setOpenSection] = useState<"material" | "care" | null>("material");

  const careText =
    care === "mano"
      ? "Lavar a mano con agua fría y jabón neutro. Secar a la sombra."
      : care === "maquina"
        ? "Lavado suave a máquina máx. 30 °C. No usar secadora."
        : "Apto para lavado a mano o ciclo delicado a máquina en frío.";

  return (
    <div style={{ borderTop: "1px solid #eadcf2", marginTop: "1.5rem" }}>
      <div style={{ borderBottom: "1px solid #eadcf2" }}>
        <button
          type="button"
          aria-expanded={openSection === "material"}
          onClick={() => setOpenSection(openSection === "material" ? null : "material")}
          style={{
            width: "100%",
            textAlign: "left",
            padding: "0.85rem 0",
            background: "transparent",
            border: "none",
            fontWeight: 600,
            cursor: "pointer",
            display: "flex",
            justifyContent: "space-between",
          }}
        >
          <span>Composición y Material</span>
          <span>{openSection === "material" ? "−" : "+"}</span>
        </button>
        {openSection === "material" && (
          <p style={{ margin: "0 0 0.85rem", color: "#4b3b5c" }}>{material}</p>
        )}
      </div>

      <div style={{ borderBottom: "1px solid #eadcf2" }}>
        <button
          type="button"
          aria-expanded={openSection === "care"}
          onClick={() => setOpenSection(openSection === "care" ? null : "care")}
          style={{
            width: "100%",
            textAlign: "left",
            padding: "0.85rem 0",
            background: "transparent",
            border: "none",
            fontWeight: 600,
            cursor: "pointer",
            display: "flex",
            justifyContent: "space-between",
          }}
        >
          <span>Cuidados de la prenda</span>
          <span>{openSection === "care" ? "−" : "+"}</span>
        </button>
        {openSection === "care" && (
          <p style={{ margin: "0 0 0.85rem", color: "#4b3b5c" }}>{careText}</p>
        )}
      </div>
    </div>
  );
}
