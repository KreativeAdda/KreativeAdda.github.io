function setupKreativeMusic(content) {
  const audio = document.querySelector("#siteMusic");
  const toggle = document.querySelector("#musicToggle");
  if (!audio || !toggle || !content.music?.enabled || !content.music?.src) { if (toggle) toggle.hidden = true; return; }

  const timeKey = "kreativeAddaMusicTime";
  const playKey = "kreativeAddaMusicPlaying";
  const shouldResume = localStorage.getItem(playKey) === "true";

  audio.src = content.music.src;
  audio.volume = 0.45;

  const saveTime = () => {
    if (!Number.isNaN(audio.currentTime)) localStorage.setItem(timeKey, String(audio.currentTime));
  };

  const setButton = (state) => {
    const isPlaying = state === "playing";
    toggle.textContent = isPlaying ? "Pause music" : state === "resume" ? "Resume music" : "Play music";
    toggle.classList.toggle("playing", isPlaying);
  };

  const restoreTime = () => {
    const savedTime = Number(localStorage.getItem(timeKey) || 0);
    if (savedTime > 0 && Number.isFinite(audio.duration) && savedTime < audio.duration) {
      audio.currentTime = savedTime;
    }
  };

  const startMusic = () => {
    localStorage.setItem(playKey, "true");
    restoreTime();
    return audio.play().then(() => setButton("playing")).catch(() => setButton("resume"));
  };

  const pauseMusic = () => {
    audio.pause();
    saveTime();
    localStorage.setItem(playKey, "false");
    setButton("paused");
  };

  audio.addEventListener("loadedmetadata", () => {
    restoreTime();
    if (shouldResume) startMusic();
    else setButton("paused");
  }, { once: true });

  audio.addEventListener("timeupdate", saveTime);
  window.addEventListener("pagehide", saveTime);
  window.addEventListener("beforeunload", saveTime);

  toggle.addEventListener("click", () => {
    if (audio.paused) startMusic();
    else pauseMusic();
  });

  window.addEventListener("pointerdown", function unlockMusic() {
    if (localStorage.getItem(playKey) === "true" && audio.paused) startMusic();
    window.removeEventListener("pointerdown", unlockMusic);
  }, { once: true });

  setButton(shouldResume ? "resume" : "paused");
}
