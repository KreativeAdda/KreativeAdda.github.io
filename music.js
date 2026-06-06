function setupKreativeMusic(content) {
  const audio = document.querySelector("#siteMusic");
  const toggle = document.querySelector("#musicToggle");
  if (!audio || !toggle || !content.music?.enabled || !content.music?.src) { if (toggle) toggle.hidden = true; return; }
  const timeKey = "kreativeAddaMusicTime";
  const playKey = "kreativeAddaMusicPlaying";
  audio.src = content.music.src;
  audio.volume = 0.45;
  audio.addEventListener("loadedmetadata", () => {
    const savedTime = Number(localStorage.getItem(timeKey) || 0);
    if (savedTime > 0 && savedTime < audio.duration) audio.currentTime = savedTime;
  }, { once: true });
  const saveState = () => {
    if (!Number.isNaN(audio.currentTime)) localStorage.setItem(timeKey, String(audio.currentTime));
    localStorage.setItem(playKey, audio.paused ? "false" : "true");
  };
  const setPlaying = (isPlaying) => {
    toggle.textContent = isPlaying ? "Pause music" : "Play music";
    toggle.classList.toggle("playing", isPlaying);
    localStorage.setItem(playKey, isPlaying ? "true" : "false");
  };
  const tryPlay = () => audio.play().then(() => setPlaying(true)).catch(() => setPlaying(false));
  toggle.addEventListener("click", () => {
    if (audio.paused) tryPlay();
    else { audio.pause(); setPlaying(false); saveState(); }
  });
  audio.addEventListener("timeupdate", saveState);
  window.addEventListener("pagehide", saveState);
  window.addEventListener("beforeunload", saveState);
  window.addEventListener("pointerdown", function unlockMusic() {
    if (localStorage.getItem(playKey) !== "false" && audio.paused) tryPlay();
    window.removeEventListener("pointerdown", unlockMusic);
  }, { once: true });
  if (localStorage.getItem(playKey) !== "false") tryPlay();
  else setPlaying(false);
}
