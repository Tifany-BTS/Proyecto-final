(function (): void {
  interface ColorRef {
    name: string;
    hex: string;
    neutral: boolean;
  }

  interface Hsl {
    h: number;
    s: number;
    l: number;
  }

  const COLOR_LIST: ColorRef[] = [
    { name: "Negro", hex: "#1a1a1a", neutral: true },
    { name: "Blanco", hex: "#f5f5f3", neutral: true },
    { name: "Gris", hex: "#9e9e9e", neutral: true },
    { name: "Gris claro", hex: "#d3d3d3", neutral: true },
    { name: "Gris oscuro", hex: "#4a4a4a", neutral: true },
    { name: "Beige", hex: "#e8dcc4", neutral: true },
    { name: "Crema", hex: "#f2ead6", neutral: true },
    { name: "Camel", hex: "#c19a6b", neutral: true },
    { name: "Marrón", hex: "#6f4e37", neutral: true },
    { name: "Café oscuro", hex: "#3e2723", neutral: true },
    { name: "Azul marino", hex: "#1a2744", neutral: true },
    { name: "Dorado", hex: "#cba135", neutral: true },
    { name: "Plateado", hex: "#c0c0c2", neutral: true },
    { name: "Rojo", hex: "#d32f2f", neutral: false },
    { name: "Vinotinto", hex: "#6d1b2f", neutral: false },
    { name: "Rosa", hex: "#f48fb1", neutral: false },
    { name: "Rosa palo", hex: "#eccdd4", neutral: false },
    { name: "Fucsia", hex: "#e91e8c", neutral: false },
    { name: "Naranja", hex: "#f57c00", neutral: false },
    { name: "Coral", hex: "#ff7f6b", neutral: false },
    { name: "Amarillo", hex: "#fdd835", neutral: false },
    { name: "Mostaza", hex: "#d4ac2b", neutral: false },
    { name: "Verde", hex: "#43a047", neutral: false },
    { name: "Verde oliva", hex: "#6b6e2e", neutral: false },
    { name: "Verde esmeralda", hex: "#0f9960", neutral: false },
    { name: "Verde menta", hex: "#98e8c1", neutral: false },
    { name: "Turquesa", hex: "#26c6da", neutral: false },
    { name: "Azul", hex: "#1e88e5", neutral: false },
    { name: "Azul cielo", hex: "#90caf9", neutral: false },
    { name: "Índigo", hex: "#3949ab", neutral: false },
    { name: "Morado", hex: "#7b1fa2", neutral: false },
    { name: "Violeta", hex: "#9575cd", neutral: false },
    { name: "Lavanda", hex: "#d6c8f0", neutral: false },
  ];

  function hexToRgb(hex: string): [number, number, number] {
    const clean = hex.replace("#", "");
    const r = parseInt(clean.substring(0, 2), 16);
    const g = parseInt(clean.substring(2, 4), 16);
    const b = parseInt(clean.substring(4, 6), 16);
    return [r, g, b];
  }

  function rgbToHex(r: number, g: number, b: number): string {
    const toHex = (n: number): string => n.toString(16).padStart(2, "0");
    return `#${toHex(r)}${toHex(g)}${toHex(b)}`.toUpperCase();
  }

  function rgbToHsl(r: number, g: number, b: number): Hsl {
    const rn = r / 255;
    const gn = g / 255;
    const bn = b / 255;
    const max = Math.max(rn, gn, bn);
    const min = Math.min(rn, gn, bn);
    const l = (max + min) / 2;
    let h = 0;
    let s = 0;
    if (max !== min) {
      const d = max - min;
      s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
      switch (max) {
        case rn:
          h = (gn - bn) / d + (gn < bn ? 6 : 0);
          break;
        case gn:
          h = (bn - rn) / d + 2;
          break;
        default:
          h = (rn - gn) / d + 4;
      }
      h *= 60;
    }
    return { h, s: s * 100, l: l * 100 };
  }

  function colorDistance(a: [number, number, number], b: [number, number, number]): number {
    const rMean = (a[0] + b[0]) / 2;
    const dr = a[0] - b[0];
    const dg = a[1] - b[1];
    const db = a[2] - b[2];
    return Math.sqrt(
      (2 + rMean / 256) * dr * dr + 4 * dg * dg + (2 + (255 - rMean) / 256) * db * db
    );
  }

  function findClosestColor(rgb: [number, number, number]): ColorRef {
    let closest = COLOR_LIST[0];
    let best = Infinity;
    for (const candidate of COLOR_LIST) {
      const distance = colorDistance(rgb, hexToRgb(candidate.hex));
      if (distance < best) {
        best = distance;
        closest = candidate;
      }
    }
    return closest;
  }

  function circularHueDiff(h1: number, h2: number): number {
    const diff = Math.abs(h1 - h2) % 360;
    return diff > 180 ? 360 - diff : diff;
  }

  type Verdict = "bien" | "precaucion" | "evitar";

  interface Combination {
    color: ColorRef;
    verdict: Verdict;
    icon: string;
    description: string;
  }

  const VERDICT_ICON: Record<Verdict, string> = {
    bien: "✓",
    precaucion: "⚠",
    evitar: "✕",
  };

  function evaluateCombination(baseHsl: Hsl, baseIsNeutral: boolean, candidate: ColorRef): Combination {
    const candidateHsl = rgbToHsl(...hexToRgb(candidate.hex));

    if (candidate.neutral || baseIsNeutral) {
      return {
        color: candidate,
        verdict: "bien",
        icon: VERDICT_ICON.bien,
        description: "Los tonos neutros combinan con prácticamente cualquier color.",
      };
    }

    const hueDiff = circularHueDiff(baseHsl.h, candidateHsl.h);
    const avgSat = (baseHsl.s + candidateHsl.s) / 2;

    if (hueDiff < 20) {
      return {
        color: candidate,
        verdict: "bien",
        icon: VERDICT_ICON.bien,
        description: "Tonos análogos: combinación armoniosa y segura.",
      };
    }
    if (hueDiff < 55) {
      return {
        color: candidate,
        verdict: "bien",
        icon: VERDICT_ICON.bien,
        description: "Tonos cercanos en la rueda cromática: combinan con naturalidad.",
      };
    }
    if (hueDiff < 100) {
      return {
        color: candidate,
        verdict: "precaucion",
        icon: VERDICT_ICON.precaucion,
        description: "Contraste medio: combina si equilibras las proporciones (uno como color principal, el otro como acento).",
      };
    }
    if (hueDiff < 150) {
      if (avgSat > 50) {
        return {
          color: candidate,
          verdict: "evitar",
          icon: VERDICT_ICON.evitar,
          description: "Dos tonos muy saturados y en tensión: evita usarlos en partes iguales.",
        };
      }
      return {
        color: candidate,
        verdict: "precaucion",
        icon: VERDICT_ICON.precaucion,
        description: "Contraste marcado: funciona bien si uno de los dos es un tono suave o apagado.",
      };
    }
    if (avgSat > 50) {
      return {
        color: candidate,
        verdict: "precaucion",
        icon: VERDICT_ICON.precaucion,
        description: "Colores casi opuestos (complementarios): combinación audaz y de alto impacto, úsala con moderación.",
      };
    }
    return {
      color: candidate,
      verdict: "bien",
      icon: VERDICT_ICON.bien,
      description: "Opuestos en tono suave: producen un contraste agradable y sutil.",
    };
  }

  function buildGuide(rgb: [number, number, number]): Combination[] {
    const baseHsl = rgbToHsl(...rgb);
    const baseIsNeutral = baseHsl.s < 12 || baseHsl.l < 10 || baseHsl.l > 92;
    const evaluated = COLOR_LIST.map((c) => evaluateCombination(baseHsl, baseIsNeutral, c));

    const bien = evaluated.filter((e) => e.verdict === "bien");
    const precaucion = evaluated.filter((e) => e.verdict === "precaucion");
    const evitar = evaluated.filter((e) => e.verdict === "evitar");

    return [...bien.slice(0, 6), ...precaucion.slice(0, 3), ...evitar.slice(0, 3)];
  }

  function init(): void {
    const fileInput = document.getElementById("prenda-input");
    const cameraBtn = document.getElementById("camara-btn");
    const captureBtn = document.getElementById("captura-btn");
    const video = document.getElementById("prenda-video");
    const canvas = document.getElementById("prenda-canvas");
    const dropZone = document.getElementById("prenda-dropzone");
    const placeholder = document.getElementById("prenda-placeholder");
    const resultPanel = document.getElementById("color-resultado");
    const swatchEl = document.getElementById("color-swatch");
    const nameEl = document.getElementById("color-nombre");
    const valuesEl = document.getElementById("color-valores");
    const guideBody = document.getElementById("guia-combinaciones");
    const instructions = document.getElementById("prenda-instrucciones");

    if (
      !(fileInput instanceof HTMLInputElement) ||
      !(canvas instanceof HTMLCanvasElement) ||
      !(dropZone instanceof HTMLElement) ||
      !(resultPanel instanceof HTMLElement) ||
      !(swatchEl instanceof HTMLElement) ||
      !(nameEl instanceof HTMLElement) ||
      !(valuesEl instanceof HTMLElement) ||
      !(guideBody instanceof HTMLElement)
    ) {
      return;
    }

    const rawCtx = canvas.getContext("2d", { willReadFrequently: true });
    if (!rawCtx) return;

    const canvasEl: HTMLCanvasElement = canvas;
    const ctx: CanvasRenderingContext2D = rawCtx;
    const resultPanelEl: HTMLElement = resultPanel;
    const swatchElEl: HTMLElement = swatchEl;
    const nameElEl: HTMLElement = nameEl;
    const valuesElEl: HTMLElement = valuesEl;
    const guideBodyEl: HTMLElement = guideBody;

    // Eliminar botón superior antiguo si existía
    const oldTopBtn = document.getElementById("limpiar-seleccion-btn");
    if (oldTopBtn && oldTopBtn.parentElement !== resultPanelEl) {
      oldTopBtn.remove();
    }

    // Colocar el botón "Limpiar selección" dentro de la tarjeta de resultado, a la derecha
    resultPanelEl.style.display = resultPanelEl.hidden ? "none" : "flex";
    resultPanelEl.style.alignItems = "center";
    resultPanelEl.style.justifyContent = "space-between";
    resultPanelEl.style.gap = "1rem";

    let clearBtn = document.getElementById("limpiar-seleccion-btn") as HTMLButtonElement | null;
    if (!clearBtn) {
      clearBtn = document.createElement("button");
      clearBtn.type = "button";
      clearBtn.id = "limpiar-seleccion-btn";
      clearBtn.className = "btn btn--small btn--outline";
      clearBtn.textContent = "Limpiar selección";
      clearBtn.style.marginLeft = "auto";
      clearBtn.style.flexShrink = "0";
      resultPanelEl.appendChild(clearBtn);
    }

    // Aviso de error cuando se toca fuera de la prenda
    let errorBanner = document.getElementById("prenda-error-aviso");
    if (!errorBanner) {
      errorBanner = document.createElement("p");
      errorBanner.id = "prenda-error-aviso";
      errorBanner.setAttribute("role", "alert");
      errorBanner.hidden = true;
      errorBanner.style.cssText =
        "margin-top: 1rem; padding: 0.75rem 1rem; border-radius: 8px; background: #fee2e2; color: #991b1b; font-weight: 600; text-align: center;";
      dropZone.after(errorBanner);
    }
    const errorBannerEl: HTMLElement = errorBanner;

    let stream: MediaStream | null = null;
    let backgroundSamples: [number, number, number][] = [];

    function sampleImageBackground(): void {
      const w = canvasEl.width;
      const h = canvasEl.height;
      if (w < 10 || h < 10) return;

      const points: [number, number][] = [
        [3, 3],
        [w - 4, 3],
        [3, h - 4],
        [w - 4, h - 4],
        [Math.floor(w / 2), 3],
        [3, Math.floor(h / 2)],
        [w - 4, Math.floor(h / 2)],
      ];

      backgroundSamples = points.map(([px, py]) => {
        const d = ctx.getImageData(px, py, 1, 1).data;
        return [d[0], d[1], d[2]];
      });
    }

    function setResultVisible(visible: boolean): void {
      resultPanelEl.hidden = !visible;
      resultPanelEl.style.display = visible ? "flex" : "none";
    }

    function clearSelectionKeepPhoto(): void {
      errorBannerEl.hidden = true;
      setResultVisible(false);
      swatchElEl.style.backgroundColor = "transparent";
      nameElEl.textContent = "—";
      valuesElEl.textContent = "—";
      guideBodyEl.innerHTML =
        '<tr><td colspan="3">Detecta un color en la prenda para ver sugerencias de combinación.</td></tr>';
    }

    clearBtn.addEventListener("click", () => {
      clearSelectionKeepPhoto();
    });

    function stopStream(): void {
      if (stream) {
        stream.getTracks().forEach((track) => track.stop());
        stream = null;
      }
      if (video instanceof HTMLVideoElement) video.hidden = true;
      if (captureBtn instanceof HTMLElement) captureBtn.hidden = true;
    }

    function showCanvas(): void {
      canvasEl.hidden = false;
      errorBannerEl.hidden = true;
      if (placeholder instanceof HTMLElement) placeholder.hidden = true;
      if (instructions instanceof HTMLElement) instructions.hidden = false;
    }

    function drawImageToCanvas(source: CanvasImageSource, width: number, height: number): void {
      const maxSide = 900;
      const scale = Math.min(1, maxSide / Math.max(width, height));
      canvasEl.width = Math.round(width * scale);
      canvasEl.height = Math.round(height * scale);
      ctx.clearRect(0, 0, canvasEl.width, canvasEl.height);
      ctx.drawImage(source, 0, 0, canvasEl.width, canvasEl.height);
      sampleImageBackground();
      clearSelectionKeepPhoto();
      showCanvas();
    }

    function loadImageFile(file: File): void {
      const img = new Image();
      img.onload = () => {
        drawImageToCanvas(img, img.naturalWidth, img.naturalHeight);
        URL.revokeObjectURL(img.src);
      };
      img.src = URL.createObjectURL(file);
    }

    fileInput.addEventListener("change", () => {
      const file = fileInput.files && fileInput.files[0];
      if (file) {
        stopStream();
        loadImageFile(file);
      }
    });

    dropZone.addEventListener("dragover", (event) => {
      event.preventDefault();
      dropZone.classList.add("prenda-dropzone--activa");
    });
    dropZone.addEventListener("dragleave", () => {
      dropZone.classList.remove("prenda-dropzone--activa");
    });
    dropZone.addEventListener("drop", (event) => {
      event.preventDefault();
      dropZone.classList.remove("prenda-dropzone--activa");
      const file = event.dataTransfer && event.dataTransfer.files[0];
      if (file && file.type.startsWith("image/")) {
        stopStream();
        loadImageFile(file);
      }
    });

    if (cameraBtn instanceof HTMLElement && video instanceof HTMLVideoElement) {
      cameraBtn.addEventListener("click", async () => {
        try {
          stream = await navigator.mediaDevices.getUserMedia({
            video: { facingMode: "environment" },
            audio: false,
          });
          video.srcObject = stream;
          video.hidden = false;
          errorBannerEl.hidden = true;
          if (placeholder instanceof HTMLElement) placeholder.hidden = true;
          canvasEl.hidden = true;
          await video.play();
          if (captureBtn instanceof HTMLElement) captureBtn.hidden = false;
        } catch {
          window.alert(
            "No se pudo acceder a la cámara. Puedes subir una foto de la prenda en su lugar."
          );
        }
      });
    }

    if (captureBtn instanceof HTMLElement && video instanceof HTMLVideoElement) {
      captureBtn.addEventListener("click", () => {
        drawImageToCanvas(video, video.videoWidth, video.videoHeight);
        stopStream();
      });
    }

    function isOutsideGarment(x: number, y: number, pixel: Uint8ClampedArray): boolean {
      const [r, g, b, alpha] = pixel;
      if (alpha < 50) return true;

      // Comprobar textura local (los fondos de foto son lisos, la tela tiene trama o variaciones)
      const sampleX = Math.min(Math.max(x - 2, 0), canvasEl.width - 5);
      const sampleY = Math.min(Math.max(y - 2, 0), canvasEl.height - 5);
      const block = ctx.getImageData(sampleX, sampleY, 5, 5).data;
      let maxDiff = 0;
      for (let i = 0; i < block.length; i += 4) {
        const diff = Math.abs(block[i] - r) + Math.abs(block[i + 1] - g) + Math.abs(block[i + 2] - b);
        if (diff > maxDiff) maxDiff = diff;
      }

      // 1) Fondo blanco/gris claro muy liso
      if (r >= 225 && g >= 225 && b >= 225 && maxDiff < 14) {
        return true;
      }

      // 2) Coincide con el color del borde/fondo de la foto y es una superficie lisa
      if (maxDiff < 14 && backgroundSamples.length > 0) {
        const matchesBg = backgroundSamples.some(
          (bg) => colorDistance([r, g, b], bg) < 28
        );
        if (matchesBg) return true;
      }

      return false;
    }

    function renderResult(rgb: [number, number, number]): void {
      errorBannerEl.hidden = true;
      const hex = rgbToHex(...rgb);
      const closest = findClosestColor(rgb);

      setResultVisible(true);
      swatchElEl.style.backgroundColor = hex;
      nameElEl.textContent = closest.name;
      valuesElEl.textContent = `RGB(${rgb[0]}, ${rgb[1]}, ${rgb[2]}) · ${hex}`;

      const guide = buildGuide(rgb);
      guideBodyEl.innerHTML = guide
        .map((item) => {
          const verdictText =
            item.verdict === "bien" ? "Combina bien" : item.verdict === "precaucion" ? "Con precaución" : "Evitar";
          return `
            <tr class="guia-combinaciones__fila guia-combinaciones__fila--${item.verdict}">
              <td class="guia-combinaciones__muestra">
                <span class="guia-combinaciones__chip" style="background-color:${item.color.hex}" aria-hidden="true"></span>
                ${item.color.name}
              </td>
              <td class="guia-combinaciones__veredicto">
                <span class="guia-combinaciones__icono" aria-hidden="true">${item.icon}</span>
                ${verdictText}
              </td>
              <td>${item.description}</td>
            </tr>`;
        })
        .join("");

      resultPanelEl.scrollIntoView({ behavior: "smooth", block: "nearest" });
    }

    canvasEl.addEventListener("click", (event) => {
      const rect = canvasEl.getBoundingClientRect();
      const scaleX = canvasEl.width / rect.width;
      const scaleY = canvasEl.height / rect.height;
      const x = Math.min(Math.max(Math.round((event.clientX - rect.left) * scaleX), 0), canvasEl.width - 1);
      const y = Math.min(Math.max(Math.round((event.clientY - rect.top) * scaleY), 0), canvasEl.height - 1);
      const pixel = ctx.getImageData(x, y, 1, 1).data;

      if (isOutsideGarment(x, y, pixel)) {
        errorBannerEl.textContent = "No se encuentra la blusa o prenda";
        errorBannerEl.hidden = false;
        return;
      }

      renderResult([pixel[0], pixel[1], pixel[2]]);
    });
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})();