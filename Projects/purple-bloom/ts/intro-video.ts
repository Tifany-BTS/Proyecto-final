(function (): void {
  const video = document.getElementById("intro-video") as HTMLVideoElement | null;
  const toggle = document.getElementById("intro-video-toggle");
  if (!video || !toggle) return;

  function applyPlaying(playing: boolean): void {
    toggle!.setAttribute("aria-pressed", String(playing));
    toggle!.setAttribute("aria-label", playing ? "Pausar video" : "Reproducir video");
  }

  toggle.addEventListener("click", () => {
    if (video.paused) {
      video.play();
    } else {
      video.pause();
    }
  });

  video.addEventListener("play", () => applyPlaying(true));
  video.addEventListener("pause", () => applyPlaying(false));

  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
    video.pause();
  }
})();
