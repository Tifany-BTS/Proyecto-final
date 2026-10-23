"use strict";
(function () {
    // Foto de perfil de "Mi cuenta" (mi-cuenta.html), al estilo "Editar perfil"
    // de TikTok: un círculo grande con un botoncito de lápiz. El lápiz abre el
    // selector de archivos (sin foto todavía) o el editor (con foto): ahí se
    // encuadra arrastrando, se hace zoom, se gira y se ajustan brillo/
    // contraste/saturación antes de guardar.
    //
    // Calidad: el archivo original se guarda tal cual, sin recomprimir, en
    // IndexedDB (sin el límite de ~5 MB de localStorage), así cada reedición
    // parte de la foto original y no de una copia de una copia. La foto final
    // se exporta a AVATAR_SIZE (nítida incluso en pantallas de alta densidad)
    // dibujándola grande y achicándola por pasos, y va a localStorage con
    // pbAvatarSet (session.ts) para que el header de cualquier página la lea.
    const rootEl = document.getElementById("account-avatar");
    const inputEl = document.getElementById("account-avatar-input");
    const dialogEl = document.getElementById("avatar-editor");
    const canvasEl = document.getElementById("avatar-editor-canvas");
    if (!rootEl ||
        !(inputEl instanceof HTMLInputElement) ||
        !(dialogEl instanceof HTMLDialogElement) ||
        !(canvasEl instanceof HTMLCanvasElement)) {
        return;
    }
    // Reasignados a const con tipo explícito: dentro de las funciones de
    // abajo, TypeScript no conserva el angostamiento de una const capturada.
    const root = rootEl;
    const input = inputEl;
    const dialog = dialogEl;
    const canvas = canvasEl;
    const ctx = canvas.getContext("2d");
    if (!ctx)
        return;
    const context = ctx;
    // Cabecera tipo perfil de TikTok: foto + (nombre, @usuario, números).
    const profile = document.querySelector("[data-account-profile]");
    const nameEl = document.querySelector("[data-profile-name]");
    const handleEl = document.querySelector("[data-profile-handle]");
    const statEls = document.querySelectorAll("[data-profile-stat]");
    const photo = root.querySelector(".account-avatar__photo");
    const initial = root.querySelector(".account-avatar__initial");
    const editBtn = root.querySelector("[data-avatar-edit]");
    const removeBtn = document.querySelector("[data-avatar-remove]");
    const feedback = document.querySelector("[data-avatar-feedback]");
    const zoomInput = dialog.querySelector('[data-edit="zoom"]');
    const filterInputs = Array.from(dialog.querySelectorAll("[data-filter]"));
    const filtersGroup = dialog.querySelector("[data-filters]");
    // 512px: el círculo de Mi cuenta mide 96px CSS, así que alcanza para
    // pantallas de densidad 3x con margen, y pesa pocas decenas de KB.
    const AVATAR_SIZE = 512;
    const OUTPUT_QUALITY = 0.92;
    // La vista previa del editor usa una copia más liviana del original para
    // que arrastrar/hacer zoom sea fluido; la exportación usa el original.
    const PREVIEW_MAX_SIDE = 1600;
    // La foto final se dibuja a AVATAR_SIZE × EXPORT_SUPERSAMPLE y después se
    // achica a la mitad las veces necesarias: mucho más nítido que pasar de
    // 4000px a 512px en un solo salto.
    const EXPORT_SUPERSAMPLE = 4;
    const MAX_FILE_BYTES = 25 * 1024 * 1024;
    const MIN_ZOOM = 1;
    const MAX_ZOOM = 4;
    const KEY_STEP = 0.02;
    const DEFAULT_EDIT = {
        rotation: 0,
        zoom: 1,
        x: 0,
        y: 0,
        brightness: 100,
        contrast: 100,
        saturation: 100,
    };
    // Safari antiguo no soporta ctx.filter: ahí se ocultan los sliders de
    // ajustes en vez de mostrar controles que no hacen nada.
    const supportsFilter = "filter" in context;
    if (filtersGroup && !supportsFilter)
        filtersGroup.hidden = true;
    let original = null;
    let originalBlob = null;
    let preview = null;
    let edit = { ...DEFAULT_EDIT };
    // ---------- Original sin recomprimir (IndexedDB) ----------
    const DB_NAME = "purple-bloom";
    const DB_STORE = "avatar-originals";
    function openDb() {
        return new Promise((resolve, reject) => {
            const request = indexedDB.open(DB_NAME, 1);
            request.onupgradeneeded = () => request.result.createObjectStore(DB_STORE);
            request.onsuccess = () => resolve(request.result);
            request.onerror = () => reject(request.error);
        });
    }
    async function withStore(mode, run) {
        const db = await openDb();
        try {
            return await new Promise((resolve, reject) => {
                const request = run(db.transaction(DB_STORE, mode).objectStore(DB_STORE));
                request.onsuccess = () => resolve(request.result);
                request.onerror = () => reject(request.error);
            });
        }
        finally {
            db.close();
        }
    }
    async function originalGet(email) {
        try {
            const value = await withStore("readonly", (store) => store.get(email));
            return value instanceof Blob ? value : null;
        }
        catch {
            return null;
        }
    }
    async function originalSet(email, blob) {
        try {
            await withStore("readwrite", (store) => store.put(blob, email));
            return true;
        }
        catch {
            return false;
        }
    }
    async function originalDelete(email) {
        try {
            await withStore("readwrite", (store) => store.delete(email));
        }
        catch {
            // Nada que limpiar si IndexedDB no está disponible.
        }
    }
    // ---------- Feedback y estado de la tarjeta ----------
    function say(message, isError = false) {
        if (!feedback)
            return;
        feedback.textContent = message;
        feedback.classList.toggle("form-feedback--error", isError);
        feedback.classList.toggle("form-feedback--success", !isError && message !== "");
    }
    // @usuario a partir del correo (la parte antes de la @), igual que un
    // handle: no hay nombres de usuario reales sin backend.
    function handleFor(email) {
        return `@${email.split("@")[0]}`;
    }
    function renderProfileInfo(user) {
        if (nameEl)
            nameEl.textContent = user.name;
        if (handleEl)
            handleEl.textContent = handleFor(user.email);
        const values = {
            orders: pbOrdersGet().length,
            favorites: pbFavoritesGet().length,
            points: pbPointsGet(),
        };
        statEls.forEach((el) => {
            const value = values[el.dataset.profileStat ?? ""] ?? 0;
            el.textContent = value.toLocaleString("es");
        });
    }
    function render() {
        const user = pbSessionGet();
        if (profile)
            profile.hidden = !user;
        if (!user) {
            if (removeBtn)
                removeBtn.hidden = true;
            return;
        }
        renderProfileInfo(user);
        const src = pbAvatarGet();
        if (photo) {
            photo.hidden = !src;
            if (src) {
                photo.src = src;
                photo.alt = `Foto de perfil de ${user.name}`;
            }
            else {
                photo.removeAttribute("src");
            }
        }
        if (initial) {
            initial.hidden = Boolean(src);
            initial.textContent = user.name.charAt(0).toUpperCase();
        }
        if (editBtn) {
            const label = src ? "Editar foto de perfil" : "Agregar foto de perfil";
            editBtn.setAttribute("aria-label", label);
            editBtn.title = label;
        }
        if (removeBtn)
            removeBtn.hidden = !src;
    }
    // ---------- Carga y reescalado de alta calidad ----------
    function loadImage(blob) {
        return new Promise((resolve, reject) => {
            const url = URL.createObjectURL(blob);
            const img = new Image();
            img.onload = () => {
                URL.revokeObjectURL(url);
                resolve(img);
            };
            img.onerror = () => {
                URL.revokeObjectURL(url);
                reject(new Error("decode"));
            };
            img.src = url;
        });
    }
    function newCanvas(width, height) {
        const out = document.createElement("canvas");
        out.width = Math.max(1, Math.round(width));
        out.height = Math.max(1, Math.round(height));
        const outCtx = out.getContext("2d");
        if (!outCtx)
            throw new Error("canvas");
        outCtx.imageSmoothingEnabled = true;
        outCtx.imageSmoothingQuality = "high";
        return [out, outCtx];
    }
    // Achica a la mitad repetidamente hasta llegar al tamaño pedido: cada paso
    // promedia bien los píxeles, en vez de saltearlos como un salto grande.
    function stepDown(source, width, height, targetW, targetH) {
        let current = source;
        let w = width;
        let h = height;
        while (w / 2 >= targetW && h / 2 >= targetH) {
            const [half, halfCtx] = newCanvas(w / 2, h / 2);
            halfCtx.drawImage(current, 0, 0, half.width, half.height);
            current = half;
            w = half.width;
            h = half.height;
        }
        const [out, outCtx] = newCanvas(targetW, targetH);
        outCtx.drawImage(current, 0, 0, out.width, out.height);
        return out;
    }
    function makePreview(img) {
        const ratio = Math.min(1, PREVIEW_MAX_SIDE / Math.max(img.naturalWidth, img.naturalHeight));
        return stepDown(img, img.naturalWidth, img.naturalHeight, img.naturalWidth * ratio, img.naturalHeight * ratio);
    }
    function sourceSize(source) {
        return source instanceof HTMLImageElement
            ? { w: source.naturalWidth, h: source.naturalHeight }
            : { w: source.width, h: source.height };
    }
    // WebP guarda más detalle que JPEG con el mismo peso; si el navegador no
    // sabe codificarlo, toDataURL devuelve PNG y ahí se usa JPEG.
    function encode(out) {
        const webp = out.toDataURL("image/webp", OUTPUT_QUALITY);
        return webp.startsWith("data:image/webp") ? webp : out.toDataURL("image/jpeg", OUTPUT_QUALITY);
    }
    // ---------- Geometría del recorte ----------
    function rotatedSize(w, h) {
        return edit.rotation % 180 !== 0 ? { w: h, h: w } : { w, h };
    }
    // Escala con zoom 1 = "cover": el lado corto de la foto llena el recorte.
    // Relativa al tamaño de cada fuente, así vista previa y original (de
    // distinto tamaño en píxeles) dan exactamente el mismo encuadre.
    function scaleFor(w, h, side) {
        const rotated = rotatedSize(w, h);
        return (side / Math.min(rotated.w, rotated.h)) * edit.zoom;
    }
    // Impide arrastrar la foto tan lejos que quede un hueco vacío en el recorte.
    function clampOffset() {
        if (!original)
            return;
        const { w, h } = sourceSize(original);
        const rotated = rotatedSize(w, h);
        const s = scaleFor(w, h, 1);
        const maxX = Math.max(0, (rotated.w * s - 1) / 2);
        const maxY = Math.max(0, (rotated.h * s - 1) / 2);
        edit.x = Math.min(maxX, Math.max(-maxX, edit.x));
        edit.y = Math.min(maxY, Math.max(-maxY, edit.y));
    }
    function filterString() {
        return `brightness(${edit.brightness}%) contrast(${edit.contrast}%) saturate(${edit.saturation}%)`;
    }
    // Dibuja `source` con los ajustes actuales en un lienzo cuadrado de `side`
    // px. Lo usan la vista previa y la exportación, así lo que se ve en el
    // editor es exactamente lo que se guarda.
    function drawTo(target, side, source) {
        const { w, h } = sourceSize(source);
        const s = scaleFor(w, h, side);
        target.save();
        target.clearRect(0, 0, side, side);
        target.imageSmoothingEnabled = true;
        target.imageSmoothingQuality = "high";
        target.translate(side / 2 + edit.x * side, side / 2 + edit.y * side);
        target.rotate((edit.rotation * Math.PI) / 180);
        target.scale(s, s);
        if (supportsFilter)
            target.filter = filterString();
        target.drawImage(source, -w / 2, -h / 2);
        target.restore();
    }
    function sizeCanvas() {
        const side = Math.round(canvas.clientWidth * (window.devicePixelRatio || 1));
        if (side > 0 && canvas.width !== side) {
            canvas.width = side;
            canvas.height = side;
        }
    }
    function redraw() {
        sizeCanvas();
        if (preview) {
            drawTo(context, canvas.width, preview);
        }
        else {
            context.clearRect(0, 0, canvas.width, canvas.height);
        }
    }
    // Foto final: se dibuja grande desde el ORIGINAL (no desde la vista
    // previa) y se achica por pasos a AVATAR_SIZE.
    function exportAvatar() {
        if (!original)
            throw new Error("no image");
        const big = AVATAR_SIZE * EXPORT_SUPERSAMPLE;
        const [large, largeCtx] = newCanvas(big, big);
        drawTo(largeCtx, big, original);
        return encode(stepDown(large, big, big, AVATAR_SIZE, AVATAR_SIZE));
    }
    function syncControls() {
        if (zoomInput)
            zoomInput.value = String(edit.zoom);
        filterInputs.forEach((field) => {
            const key = field.dataset.filter;
            field.value = String(edit[key]);
        });
    }
    function setZoom(next) {
        edit.zoom = Math.min(MAX_ZOOM, Math.max(MIN_ZOOM, next));
        clampOffset();
        if (zoomInput)
            zoomInput.value = String(edit.zoom);
        redraw();
    }
    // ---------- Abrir / cerrar el editor ----------
    async function openEditor(blob, startEdit) {
        const img = await loadImage(blob);
        original = img;
        originalBlob = blob;
        preview = makePreview(img);
        edit = { ...DEFAULT_EDIT, ...startEdit };
        syncControls();
        if (!dialog.open)
            dialog.showModal();
        clampOffset();
        redraw();
        canvas.focus();
    }
    function closeEditor() {
        if (dialog.open)
            dialog.close();
        original = null;
        originalBlob = null;
        preview = null;
        editBtn?.focus();
    }
    async function save() {
        const user = pbSessionGet();
        if (!original || !originalBlob || !user)
            return;
        let dataUrl;
        try {
            dataUrl = exportAvatar();
        }
        catch {
            say("No pudimos procesar la foto. Probá con otra.", true);
            return;
        }
        if (!pbAvatarSet(dataUrl)) {
            say("Tu navegador no nos dejó guardar la foto.", true);
            return;
        }
        pbAvatarEditSet({ ...edit });
        const keptOriginal = await originalSet(user.email, originalBlob);
        closeEditor();
        render();
        say(keptOriginal ? "Foto de perfil actualizada." : "Foto actualizada. Tu navegador no nos dejó guardar el original, así que la próxima edición parte de esta versión.");
        pbTrack("Foto de perfil actualizada");
        pbPetalBurst(root);
    }
    // ---------- Elegir archivo ----------
    input.addEventListener("change", async () => {
        const file = input.files?.[0];
        // Se limpia para que elegir de nuevo la misma foto vuelva a disparar "change".
        input.value = "";
        if (!file)
            return;
        if (!file.type.startsWith("image/")) {
            say("Elegí un archivo de imagen (JPG, PNG, WebP…).", true);
            return;
        }
        if (file.size > MAX_FILE_BYTES) {
            say("La imagen es muy pesada. Probá con una de menos de 25 MB.", true);
            return;
        }
        try {
            say("");
            // El File es el original tal cual: no se recomprime en ningún momento.
            await openEditor(file, DEFAULT_EDIT);
        }
        catch {
            say("No pudimos leer esa imagen. Probá con otra (JPG, PNG o WebP).", true);
        }
    });
    // Lápiz: con foto abre el editor desde el original guardado (o, si no
    // está, desde la foto final); sin foto va directo a elegir una.
    editBtn?.addEventListener("click", async () => {
        const user = pbSessionGet();
        const current = pbAvatarGet();
        if (!user || !current) {
            input.click();
            return;
        }
        try {
            const stored = await originalGet(user.email);
            if (stored) {
                await openEditor(stored, pbAvatarEditGet() ?? DEFAULT_EDIT);
            }
            else {
                await openEditor(await (await fetch(current)).blob(), DEFAULT_EDIT);
            }
        }
        catch {
            input.click();
        }
    });
    removeBtn?.addEventListener("click", () => {
        const user = pbSessionGet();
        pbAvatarSet(null);
        if (user)
            void originalDelete(user.email);
        render();
        say("Quitamos tu foto de perfil.");
        editBtn?.focus();
    });
    // ---------- Controles del editor ----------
    zoomInput?.addEventListener("input", () => setZoom(Number(zoomInput.value)));
    filterInputs.forEach((field) => {
        field.addEventListener("input", () => {
            const key = field.dataset.filter;
            edit[key] = Number(field.value);
            redraw();
        });
    });
    dialog.querySelector("[data-edit-rotate]")?.addEventListener("click", () => {
        edit.rotation = (edit.rotation + 90) % 360;
        clampOffset();
        redraw();
    });
    dialog.querySelector("[data-edit-reset]")?.addEventListener("click", () => {
        edit = { ...DEFAULT_EDIT };
        syncControls();
        redraw();
    });
    dialog.querySelector("[data-edit-change]")?.addEventListener("click", () => input.click());
    dialog.querySelector("[data-edit-cancel]")?.addEventListener("click", closeEditor);
    dialog.querySelector("[data-edit-save]")?.addEventListener("click", () => void save());
    // Escape cierra el <dialog> de forma nativa: solo hace falta limpiar.
    dialog.addEventListener("cancel", (event) => {
        event.preventDefault();
        closeEditor();
    });
    // ---------- Arrastrar, pellizcar, rueda y teclado ----------
    const pointers = new Map();
    let pinchStartDistance = 0;
    let pinchStartZoom = 1;
    function pinchDistance() {
        const [a, b] = Array.from(pointers.values());
        return Math.hypot(a.x - b.x, a.y - b.y);
    }
    canvas.addEventListener("pointerdown", (event) => {
        canvas.setPointerCapture(event.pointerId);
        pointers.set(event.pointerId, { x: event.clientX, y: event.clientY });
        if (pointers.size === 2) {
            pinchStartDistance = pinchDistance();
            pinchStartZoom = edit.zoom;
        }
    });
    canvas.addEventListener("pointermove", (event) => {
        const previous = pointers.get(event.pointerId);
        if (!previous)
            return;
        pointers.set(event.pointerId, { x: event.clientX, y: event.clientY });
        if (pointers.size === 2 && pinchStartDistance > 0) {
            setZoom(pinchStartZoom * (pinchDistance() / pinchStartDistance));
            return;
        }
        const side = canvas.clientWidth || 1;
        edit.x += (event.clientX - previous.x) / side;
        edit.y += (event.clientY - previous.y) / side;
        clampOffset();
        redraw();
    });
    function endPointer(event) {
        pointers.delete(event.pointerId);
        if (pointers.size < 2)
            pinchStartDistance = 0;
    }
    canvas.addEventListener("pointerup", endPointer);
    canvas.addEventListener("pointercancel", endPointer);
    canvas.addEventListener("wheel", (event) => {
        event.preventDefault();
        setZoom(edit.zoom * Math.exp(-event.deltaY * 0.0015));
    }, { passive: false });
    canvas.addEventListener("keydown", (event) => {
        const moves = {
            ArrowLeft: [-KEY_STEP, 0],
            ArrowRight: [KEY_STEP, 0],
            ArrowUp: [0, -KEY_STEP],
            ArrowDown: [0, KEY_STEP],
        };
        const move = moves[event.key];
        if (move) {
            event.preventDefault();
            edit.x += move[0];
            edit.y += move[1];
            clampOffset();
            redraw();
        }
        else if (event.key === "+" || event.key === "=") {
            event.preventDefault();
            setZoom(edit.zoom + 0.1);
        }
        else if (event.key === "-") {
            event.preventDefault();
            setZoom(edit.zoom - 0.1);
        }
    });
    window.addEventListener("resize", () => {
        if (dialog.open)
            redraw();
    });
    // El nombre cambia desde "Mis datos"; favoritos se pueden quitar desde la
    // grilla de esta misma página: los números siguen al instante.
    document.addEventListener("purplebloom:session-updated", render);
    document.addEventListener("purplebloom:favorites-changed", render);
    document.addEventListener("purplebloom:orders-changed", render);
    render();
})();
