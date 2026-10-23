"use strict";
(function () {
    // Asistente de combinación de colores de ropa (asistente-colores.html):
    // sube/captura una foto de una prenda, la pinta en un <canvas>, y al
    // tocar/clicar sobre ella extrae el color del píxel, lo nombra contra un
    // listado amplio de colores base en español y genera una guía de
    // combinaciones (✓ / ⚠ / ✕) basada en relación de matiz (HSL), no solo en
    // una tabla fija de parejas.
    // Listado amplio de colores base de ropa en español. "neutral: true" marca
    // los tonos que la mayoría de guías de estilo tratan como comodín (incluye
    // metálicos y azul marino, que en moda se usan como neutro clásico).
    const COLOR_LIST = [
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
    function hexToRgb(hex) {
        const clean = hex.replace("#", "");
        const r = parseInt(clean.substring(0, 2), 16);
        const g = parseInt(clean.substring(2, 4), 16);
        const b = parseInt(clean.substring(4, 6), 16);
        return [r, g, b];
    }
    function rgbToHex(r, g, b) {
        const toHex = (n) => n.toString(16).padStart(2, "0");
        return `#${toHex(r)}${toHex(g)}${toHex(b)}`.toUpperCase();
    }
    function rgbToHsl(r, g, b) {
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
    // "redmean": aproximación perceptual de distancia de color, más fiel que
    // una distancia euclidiana simple en RGB sin necesitar convertir a Lab.
    function colorDistance(a, b) {
        const rMean = (a[0] + b[0]) / 2;
        const dr = a[0] - b[0];
        const dg = a[1] - b[1];
        const db = a[2] - b[2];
        return Math.sqrt((2 + rMean / 256) * dr * dr + 4 * dg * dg + (2 + (255 - rMean) / 256) * db * db);
    }
    function findClosestColor(rgb) {
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
    function circularHueDiff(h1, h2) {
        const diff = Math.abs(h1 - h2) % 360;
        return diff > 180 ? 360 - diff : diff;
    }
    const VERDICT_ICON = {
        bien: "✓",
        precaucion: "⚠",
        evitar: "✕",
    };
    function evaluateCombination(baseHsl, baseIsNeutral, candidate) {
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
                    description: "Dos tonos muy saturados y en tensión: compiten entre sí, evita usarlos en partes iguales.",
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
    function buildGuide(rgb) {
        const baseHsl = rgbToHsl(...rgb);
        const baseIsNeutral = baseHsl.s < 12 || baseHsl.l < 10 || baseHsl.l > 92;
        const evaluated = COLOR_LIST.map((c) => evaluateCombination(baseHsl, baseIsNeutral, c));
        const bien = evaluated.filter((e) => e.verdict === "bien");
        const precaucion = evaluated.filter((e) => e.verdict === "precaucion");
        const evitar = evaluated.filter((e) => e.verdict === "evitar");
        // Guía compacta: prioriza variedad de veredictos sobre exhaustividad.
        return [...bien.slice(0, 6), ...precaucion.slice(0, 3), ...evitar.slice(0, 3)];
    }
    function init() {
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
        if (!(fileInput instanceof HTMLInputElement) ||
            !(canvas instanceof HTMLCanvasElement) ||
            !(dropZone instanceof HTMLElement) ||
            !(resultPanel instanceof HTMLElement) ||
            !(swatchEl instanceof HTMLElement) ||
            !(nameEl instanceof HTMLElement) ||
            !(valuesEl instanceof HTMLElement) ||
            !(guideBody instanceof HTMLElement)) {
            return;
        }
        const rawCtx = canvas.getContext("2d", { willReadFrequently: true });
        if (!rawCtx)
            return;
        // Alias con tipo no-nulo explícito: los closures de abajo (drawImageToCanvas,
        // renderResult, listeners) no heredan el estrechamiento de tipo de los
        // guardas de arriba, así que se declaran de nuevo con un tipo concreto.
        const canvasEl = canvas;
        const ctx = rawCtx;
        const resultPanelEl = resultPanel;
        const swatchElEl = swatchEl;
        const nameElEl = nameEl;
        const valuesElEl = valuesEl;
        const guideBodyEl = guideBody;
        let stream = null;
        function stopStream() {
            if (stream) {
                stream.getTracks().forEach((track) => track.stop());
                stream = null;
            }
            if (video instanceof HTMLVideoElement)
                video.hidden = true;
            if (captureBtn instanceof HTMLElement)
                captureBtn.hidden = true;
        }
        function showCanvas() {
            canvasEl.hidden = false;
            if (placeholder instanceof HTMLElement)
                placeholder.hidden = true;
            if (instructions instanceof HTMLElement)
                instructions.hidden = false;
        }
        function drawImageToCanvas(source, width, height) {
            // Limita el lado mayor para mantener el trabajo de pintado/lectura de
            // píxeles ligero en móviles, conservando la proporción original.
            const maxSide = 900;
            const scale = Math.min(1, maxSide / Math.max(width, height));
            canvasEl.width = Math.round(width * scale);
            canvasEl.height = Math.round(height * scale);
            ctx.clearRect(0, 0, canvasEl.width, canvasEl.height);
            ctx.drawImage(source, 0, 0, canvasEl.width, canvasEl.height);
            showCanvas();
        }
        function loadImageFile(file) {
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
                    if (placeholder instanceof HTMLElement)
                        placeholder.hidden = true;
                    canvasEl.hidden = true;
                    await video.play();
                    if (captureBtn instanceof HTMLElement)
                        captureBtn.hidden = false;
                }
                catch (error) {
                    window.alert("No se pudo acceder a la cámara. Puedes subir una foto de la prenda en su lugar.");
                }
            });
        }
        if (captureBtn instanceof HTMLElement && video instanceof HTMLVideoElement) {
            captureBtn.addEventListener("click", () => {
                drawImageToCanvas(video, video.videoWidth, video.videoHeight);
                stopStream();
            });
        }
        function renderResult(rgb) {
            const hex = rgbToHex(...rgb);
            const closest = findClosestColor(rgb);
            resultPanelEl.hidden = false;
            swatchElEl.style.backgroundColor = hex;
            nameElEl.textContent = closest.name;
            valuesElEl.textContent = `RGB(${rgb[0]}, ${rgb[1]}, ${rgb[2]}) · ${hex}`;
            const guide = buildGuide(rgb);
            guideBodyEl.innerHTML = guide
                .map((item) => {
                const verdictText = item.verdict === "bien" ? "Combina bien" : item.verdict === "precaucion" ? "Con precaución" : "Evitar";
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
            const x = Math.round((event.clientX - rect.left) * scaleX);
            const y = Math.round((event.clientY - rect.top) * scaleY);
            const pixel = ctx.getImageData(Math.min(Math.max(x, 0), canvasEl.width - 1), Math.min(Math.max(y, 0), canvasEl.height - 1), 1, 1).data;
            renderResult([pixel[0], pixel[1], pixel[2]]);
        });
    }
    if (document.readyState === "loading") {
        document.addEventListener("DOMContentLoaded", init);
    }
    else {
        init();
    }
})();
