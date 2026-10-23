"use strict";
(function () {
    const posts = document.querySelectorAll(".news-post");
    if (!posts.length)
        return;
    if (!("IntersectionObserver" in window)) {
        posts.forEach((post) => post.classList.add("news-post--visible"));
        return;
    }
    const observer = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
            if (entry.isIntersecting) {
                entry.target.classList.add("news-post--visible");
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.2 });
    posts.forEach((post) => observer.observe(post));
    // Red de seguridad: si algo evita que el observer dispare a tiempo para
    // una tarjeta (una herramienta de captura de pantalla completa que
    // redimensiona la página sin generar eventos de scroll reales, una
    // pestaña en segundo plano, un navegador raro), esa tarjeta se queda en
    // opacity:0 para siempre — invisible sin ninguna forma de recuperarla.
    // Pasado un tiempo razonable, se revela todo igual, sin animación.
    window.setTimeout(() => {
        posts.forEach((post) => post.classList.add("news-post--visible"));
        observer.disconnect();
    }, 1500);
})();
