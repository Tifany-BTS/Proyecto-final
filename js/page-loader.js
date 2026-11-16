"use strict";
(function () {
    const loader = document.getElementById("page-loader");
    if (!loader)
        return;
    // Tope de espera: "load" también aguarda a imágenes y scripts de terceros
    // (analítica), y si alguno tarda la flor taparía una página que ya se puede
    // usar. Lo que pase primero, "load" o el tope, oculta el loader.
    const MAX_WAIT = 1500;
    let hidden = false;
    function hide() {
        if (hidden)
            return;
        hidden = true;
        loader.classList.add("page-loader--hidden");
        loader.addEventListener("transitionend", () => loader.remove(), { once: true });
    }
    if (document.readyState === "complete") {
        hide();
    }
    else {
        window.addEventListener("load", hide, { once: true });
        window.setTimeout(hide, MAX_WAIT);
    }
})();
