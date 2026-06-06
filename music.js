function setupKreativeMusic(content) {
  const audio = document.querySelector("#siteMusic");
  const toggle = document.querySelector("#musicToggle");
  if (!audio || !toggle || !content.music?.enabled || !content.music?.src) { if (toggle) toggle.hidden = true; return; }

  audio.src = content.music.src;
  audio.volume = 0.45;

  const setPlaying = (isPlaying) => {
    toggle.textContent = isPlaying ? "Pause music" : "Play music";
    toggle.classList.toggle("playing", isPlaying);
  };

  const tryPlay = () => {
    audio.currentTime = 0;
    audio.play().then(() => setPlaying(true)).catch(() => setPlaying(false));
  };

  toggle.addEventListener("click", () => {
    if (audio.paused) tryPlay();
    else { audio.pause(); setPlaying(false); }
  });

  window.addEventListener("pointerdown", function unlockMusic() {
    if (audio.paused) tryPlay();
    window.removeEventListener("pointerdown", unlockMusic);
  }, { once: true });

  tryPlay();
}
