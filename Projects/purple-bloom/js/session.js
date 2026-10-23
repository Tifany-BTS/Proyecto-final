"use strict";
// Simulated session. Deliberately not IIFE-wrapped at the top level so
// login-form.ts can call pbSessionLogin() — same shared-global pattern as
// analytics.ts / petal-burst.ts. There is no backend: the "session" is just a
// small record in localStorage and nothing here authenticates anyone.
const PB_SESSION_KEY = "pb-session";
function pbSessionGet() {
    try {
        const parsed = JSON.parse(localStorage.getItem(PB_SESSION_KEY) ?? "null");
        if (parsed && typeof parsed.email === "string" && typeof parsed.name === "string") {
            return parsed;
        }
    }
    catch {
        // Storage blocked or corrupt value: behave as signed out.
    }
    return null;
}
function pbProfileKey(email) {
    return `pb-profile:${email}`;
}
function pbProfileGet(email) {
    try {
        const parsed = JSON.parse(localStorage.getItem(pbProfileKey(email)) ?? "null");
        if (parsed && typeof parsed.name === "string")
            return parsed;
    }
    catch {
        // Storage blocked o valor corrupto: como si no hubiera perfil guardado.
    }
    return null;
}
function pbProfileSet(email, profile) {
    try {
        localStorage.setItem(pbProfileKey(email), JSON.stringify(profile));
    }
    catch {
        // Storage blocked: el perfil no persiste entre recargas.
    }
}
function pbSessionLogin(email) {
    const cleanEmail = email.trim().toLowerCase();
    const existingProfile = pbProfileGet(cleanEmail);
    const firstToken = cleanEmail.split("@")[0].split(/[._+-]/)[0] || "clienta";
    const defaultName = firstToken.charAt(0).toUpperCase() + firstToken.slice(1);
    const user = {
        email: cleanEmail,
        name: existingProfile?.name ?? defaultName,
        phone: existingProfile?.phone,
        since: new Date().toISOString(),
    };
    try {
        localStorage.setItem(PB_SESSION_KEY, JSON.stringify(user));
    }
    catch {
        // Storage blocked: the simulated login just won't persist between pages.
    }
    if (!existingProfile)
        pbProfileSet(cleanEmail, { name: user.name, phone: user.phone });
    return user;
}
function pbSessionLogout() {
    try {
        localStorage.removeItem(PB_SESSION_KEY);
    }
    catch {
        // Nothing to clean up if storage is unavailable.
    }
}
// Usado por account-data.ts (Mis datos) para guardar cambios de nombre/
// teléfono. Actualiza tanto la sesión activa como el perfil persistente de
// la cuenta, vuelve a pintar el saludo/avatar/nav en el momento (sin
// recargar) y avisa a quien más le interese (purplebloom:session-updated).
function pbSessionUpdateProfile(fields) {
    const user = pbSessionGet();
    if (!user)
        return null;
    const trimmedName = fields.name?.trim();
    const trimmedPhone = fields.phone?.trim();
    const updated = {
        ...user,
        name: trimmedName || user.name,
        phone: fields.phone !== undefined ? trimmedPhone || undefined : user.phone,
    };
    try {
        localStorage.setItem(PB_SESSION_KEY, JSON.stringify(updated));
    }
    catch {
        // Storage blocked: el cambio no persiste entre recargas.
    }
    pbProfileSet(updated.email, { name: updated.name, phone: updated.phone });
    pbApplySessionToDom();
    document.dispatchEvent(new CustomEvent("purplebloom:session-updated"));
    return updated;
}
// Foto de perfil, guardada por cuenta (pb-avatar:<email>) como data URL
// ya recortada por account-avatar.ts (512px WebP/JPEG de alta calidad, del
// orden de decenas de KB), así el header de cualquier página la lee al toque
// desde localStorage. El archivo original sin recomprimir vive aparte, en
// IndexedDB (ver account-avatar.ts), porque no entraría acá.
function pbAvatarKey(email) {
    return `pb-avatar:${email}`;
}
function pbAvatarGet() {
    const user = pbSessionGet();
    if (!user)
        return null;
    try {
        const stored = localStorage.getItem(pbAvatarKey(user.email));
        return stored && stored.startsWith("data:image/") ? stored : null;
    }
    catch {
        return null;
    }
}
// Guarda (o borra, con null) la foto de la cuenta activa y repinta el avatar
// del header al toque. Devuelve false si el navegador no la pudo guardar
// (storage bloqueado o lleno), para que quien llama pueda avisar.
function pbAvatarSet(dataUrl) {
    const user = pbSessionGet();
    if (!user)
        return false;
    try {
        if (dataUrl) {
            localStorage.setItem(pbAvatarKey(user.email), dataUrl);
        }
        else {
            localStorage.removeItem(pbAvatarKey(user.email));
            localStorage.removeItem(pbAvatarEditKey(user.email));
            // Versión anterior: guardaba el original achicado acá mismo.
            localStorage.removeItem(`pb-avatar-src:${user.email}`);
        }
    }
    catch {
        return false;
    }
    pbApplySessionToDom();
    document.dispatchEvent(new CustomEvent("purplebloom:session-updated"));
    return true;
}
function pbAvatarEditKey(email) {
    return `pb-avatar-edit:${email}`;
}
function pbAvatarEditGet() {
    const user = pbSessionGet();
    if (!user)
        return null;
    try {
        const parsed = JSON.parse(localStorage.getItem(pbAvatarEditKey(user.email)) ?? "null");
        if (parsed && typeof parsed.zoom === "number")
            return parsed;
    }
    catch {
        // Storage blocked o valor corrupto: el editor arranca sin ajustes.
    }
    return null;
}
function pbAvatarEditSet(edit) {
    const user = pbSessionGet();
    if (!user)
        return;
    try {
        localStorage.setItem(pbAvatarEditKey(user.email), JSON.stringify(edit));
    }
    catch {
        // Storage blocked: el editor arrancará sin ajustes la próxima vez.
    }
}
// Simulated loyalty points ("Club Vip Moda"), stored per account in
// localStorage. 1 point is earned per $1 paid; 10 points are worth $1 off.
const PB_POINTS_EARNED_PER_DOLLAR = 1;
const PB_POINTS_PER_DOLLAR_OFF = 10;
const PB_POINTS_WELCOME = 300;
function pbPointsGet() {
    const user = pbSessionGet();
    if (!user)
        return 0;
    const key = `pb-points:${user.email}`;
    try {
        const stored = localStorage.getItem(key);
        if (stored === null) {
            // First visit of this account: seed a welcome balance so the demo has points to redeem.
            localStorage.setItem(key, String(PB_POINTS_WELCOME));
            return PB_POINTS_WELCOME;
        }
        const value = Number(stored);
        return Number.isFinite(value) && value > 0 ? Math.floor(value) : 0;
    }
    catch {
        return 0;
    }
}
function pbPointsSet(points) {
    const user = pbSessionGet();
    if (!user)
        return;
    try {
        localStorage.setItem(`pb-points:${user.email}`, String(Math.max(0, Math.floor(points))));
    }
    catch {
        // Storage blocked: the balance just won't persist.
    }
}
// Favoritos reales (no una simulación de ejemplo): lista de IDs de producto
// guardada por cuenta, mismo patrón que los puntos de arriba. Solo existen
// para una cuenta con sesión iniciada — favorites.ts es quien decide qué
// mostrar a quien no inició sesión.
function pbFavoritesKey(email) {
    return `pb-favorites:${email}`;
}
function pbFavoritesGet() {
    const user = pbSessionGet();
    if (!user)
        return [];
    try {
        const parsed = JSON.parse(localStorage.getItem(pbFavoritesKey(user.email)) ?? "[]");
        return Array.isArray(parsed) ? parsed.filter((id) => typeof id === "string") : [];
    }
    catch {
        return [];
    }
}
function pbFavoritesHas(productId) {
    return pbFavoritesGet().includes(productId);
}
// Agrega o quita productId de la lista y devuelve el nuevo estado (true =
// quedó en favoritos). No hace nada si no hay sesión iniciada.
function pbFavoritesToggle(productId) {
    const user = pbSessionGet();
    if (!user)
        return false;
    const current = pbFavoritesGet();
    const wasFavorite = current.includes(productId);
    const next = wasFavorite ? current.filter((id) => id !== productId) : [...current, productId];
    try {
        localStorage.setItem(pbFavoritesKey(user.email), JSON.stringify(next));
    }
    catch {
        // Storage blocked: el cambio no se guarda entre recargas.
    }
    // Igual que "purplebloom:rated" — cualquier UI que dependa de favoritos
    // (los corazones de otras tarjetas, la grilla de mi-cuenta.html) se
    // actualiza al toque, sin recargar la página.
    document.dispatchEvent(new CustomEvent("purplebloom:favorites-changed", { detail: { id: productId, active: !wasFavorite } }));
    return !wasFavorite;
}
function pbOrdersKey(email) {
    return `pb-orders:${email}`;
}
function pbOrdersGet() {
    const user = pbSessionGet();
    if (!user)
        return [];
    try {
        const parsed = JSON.parse(localStorage.getItem(pbOrdersKey(user.email)) ?? "[]");
        return Array.isArray(parsed) ? parsed : [];
    }
    catch {
        return [];
    }
}
// No hace nada si no hay sesión iniciada: un pedido sin cuenta no tiene
// dónde guardarse, igual que un favorito sin cuenta.
function pbOrdersAdd(order) {
    const user = pbSessionGet();
    if (!user)
        return null;
    const existing = pbOrdersGet();
    const full = {
        ...order,
        id: `PB-${1000 + existing.length + 1}`,
        date: new Date().toISOString(),
    };
    try {
        localStorage.setItem(pbOrdersKey(user.email), JSON.stringify([full, ...existing]));
    }
    catch {
        // Storage blocked: el pedido no queda guardado, pero la compra igual se simula.
    }
    document.dispatchEvent(new CustomEvent("purplebloom:orders-changed"));
    return full;
}
// Pinta todo lo que depende de la sesión (saludo, avatar del header, nav,
// footer, aviso del login) a partir del estado actual de pbSessionGet().
// Separado del IIFE de más abajo para poder llamarlo de nuevo después de
// pbSessionUpdateProfile, sin duplicar esta lógica ahí.
function pbApplySessionToDom() {
    const user = pbSessionGet();
    const accountGreeting = document.querySelector("[data-session-greeting]");
    const logoutButton = document.querySelector("[data-session-logout]");
    if (logoutButton)
        logoutButton.hidden = !user;
    if (accountGreeting) {
        accountGreeting.replaceChildren();
        if (user) {
            accountGreeting.textContent = `Hola, ${user.name}. Sesión simulada con ${user.email}: no hay autenticación real ni datos guardados en un servidor. Tienes ${pbPointsGet()} puntos del Club Vip Moda.`;
        }
        else {
            accountGreeting.append("Todavía no iniciaste sesión, así que ves un ejemplo de tu cuenta. ");
            const link = document.createElement("a");
            link.href = "iniciar-sesion.html";
            link.textContent = "Iniciar sesión";
            accountGreeting.append(link, ".");
        }
    }
    if (!user)
        return;
    const avatarSrc = pbAvatarGet();
    // Mismo avatar circular en los dos lugares donde puede vivir el enlace de
    // "Iniciar sesión": el grupo auxiliar del header (la mayoría de páginas) y
    // el nav inline de catalogo.html (.site-nav__login). Antes este segundo
    // caso se quedaba como texto "Hola, {nombre}" — con un nombre largo eso
    // apretaba el resto del nav; el avatar ocupa lo mismo sin importar el
    // nombre, igual que ya pasa en el resto del sitio.
    document.querySelectorAll(".site-header__login, .site-nav__login").forEach((link) => {
        // El avatar es un círculo con la inicial; el nombre completo queda en
        // el aria-label/title, ya que la letra sola no dice nada por sí misma.
        const avatar = document.createElement("span");
        avatar.className = "site-header__avatar";
        avatar.setAttribute("aria-hidden", "true");
        // Con foto de perfil (Mi cuenta) se muestra la foto; si no, la inicial.
        if (avatarSrc) {
            const img = document.createElement("img");
            img.src = avatarSrc;
            img.alt = "";
            avatar.append(img);
        }
        else {
            avatar.textContent = user.name.charAt(0).toUpperCase();
        }
        link.replaceChildren(avatar);
        // .site-nav__login trae su propio borde (para el estado "Iniciar
        // sesión" sin loguearse) que no aplica una vez que es un avatar.
        link.classList.remove("site-nav__login");
        link.classList.add("site-header__login--avatar");
        link.href = "mi-cuenta.html";
        link.setAttribute("aria-label", `Mi cuenta, sesión iniciada como ${user.name}`);
        link.title = `${user.name} · Mi cuenta`;
        link.removeAttribute("aria-current");
    });
    document.querySelectorAll('.site-footer a[href="iniciar-sesion.html"]').forEach((link) => {
        link.textContent = "Mi cuenta";
        link.href = "mi-cuenta.html";
    });
    const loginFeedback = document.querySelector(".login-form ~ .form-feedback");
    if (loginFeedback) {
        loginFeedback.textContent = `Ya tienes una sesión iniciada como ${user.email}. Puedes ir a Mi cuenta o entrar con otro correo.`;
        loginFeedback.classList.add("form-feedback--success");
    }
}
(function () {
    document.querySelector("[data-session-logout]")?.addEventListener("click", () => {
        pbSessionLogout();
        window.location.href = "iniciar-sesion.html";
    });
    pbApplySessionToDom();
})();
