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
})();
