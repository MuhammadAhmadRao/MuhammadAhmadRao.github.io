/**
 * audio & media player module - v3 heyclicky inspired
 * Web Audio API synthesized sounds + AirPods anchored popover player
 */

// Soft UI click audio engine
class DesktopAudioEngine {
  constructor() {
    this.ctx = null;
    this.isMuted = false;
  }

  init() {
    if (!this.ctx) {
      const AudioCtx = window.AudioContext || window.webkitAudioContext;
      if (AudioCtx) {
        this.ctx = new AudioCtx();
      }
    }
    if (this.ctx && this.ctx.state === "suspended") {
      this.ctx.resume();
    }
  }

  toggleMute() {
    this.isMuted = !this.isMuted;
    return this.isMuted;
  }

  playSoftClick() {
    if (this.isMuted) return;
    this.init();
    if (!this.ctx) return;

    try {
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      const t = this.ctx.currentTime;

      osc.type = "sine";
      osc.frequency.setValueAtTime(800, t);
      osc.frequency.exponentialRampToValueAtTime(400, t + 0.03);

      gain.gain.setValueAtTime(0.04, t);
      gain.gain.exponentialRampToValueAtTime(0.001, t + 0.03);

      osc.connect(gain);
      gain.connect(this.ctx.destination);

      osc.start(t);
      osc.stop(t + 0.03);
    } catch (e) {
      // Audio autoplay guard
    }
  }
}

window.desktopAudio = new DesktopAudioEngine();

// ============================================================================
// AirPods Mac-Style Anchored Popover Player
// ============================================================================
document.addEventListener("DOMContentLoaded", () => {
  const triggerBtn = document.getElementById("airpods-trigger");
  const popover = document.getElementById("airpods-popover");
  const closeBtn = document.getElementById("airpods-close");
  const eqEl = document.getElementById("airpods-eq");

  const playBtn = document.getElementById("player-play-btn");
  const playSvg = document.getElementById("play-svg");
  const pauseSvg = document.getElementById("pause-svg");
  const progressBar = document.getElementById("player-progress");
  const timeCurrent = document.getElementById("player-time-current");
  const timeDuration = document.getElementById("player-time-duration");
  const volumeSlider = document.getElementById("player-volume");
  const titleEl = document.getElementById("player-title");
  const artistEl = document.getElementById("player-artist");
  const missingNotice = document.getElementById("player-missing-notice");
  const popoverBody = popover ? popover.querySelector(".airpods-popover-body") : null;
  const playbackRow = popover ? popover.querySelector(".airpods-playback-row") : null;
  const volumeRow = popover ? popover.querySelector(".airpods-volume-row") : null;

  if (!triggerBtn || !popover) return;

  // 1. Popover open / close / toggle state with inert & focus management
  function openPopover() {
    popover.removeAttribute("hidden");
    popover.removeAttribute("inert");
    popover.inert = false;
    triggerBtn.setAttribute("aria-expanded", "true");

    // Focus first interactive control in popover
    requestAnimationFrame(() => {
      const focusable = popover.querySelector("button, [href], input");
      if (focusable) focusable.focus();
    });
  }

  function closePopover() {
    popover.setAttribute("hidden", "");
    popover.setAttribute("inert", "");
    popover.inert = true;
    triggerBtn.setAttribute("aria-expanded", "false");
  }

  function togglePopover() {
    const isClosed = popover.hasAttribute("hidden") || popover.inert;
    if (isClosed) {
      openPopover();
    } else {
      closePopover();
      triggerBtn.focus();
    }
  }

  // Ensure closed and inert on initialization
  closePopover();

  // Click on headphones icon toggles popover
  triggerBtn.addEventListener("click", (e) => {
    e.stopPropagation();
    togglePopover();
  });

  // Close button inside popover
  if (closeBtn) {
    closeBtn.addEventListener("click", (e) => {
      e.stopPropagation();
      closePopover();
      triggerBtn.focus();
    });
  }

  // Esc key closes popover
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && !popover.hasAttribute("hidden")) {
      e.preventDefault();
      closePopover();
      triggerBtn.focus();
    }
  });

  // Outside click closes popover
  document.addEventListener("click", (e) => {
    if (!popover.hasAttribute("hidden")) {
      if (!popover.contains(e.target) && !triggerBtn.contains(e.target)) {
        closePopover();
      }
    }
  });

  // Prevent clicks inside popover from bubbling up to document click
  popover.addEventListener("click", (e) => {
    e.stopPropagation();
  });

  // 2. Song source configuration from data.js
  const songData = (window.portfolioData && window.portfolioData.song) || {
    type: "link",
    title: "lady (hear me tonight)",
    artist: "modjo",
    url: "https://youtu.be/mMfxI3r_LyA",
    src: null,
    spotifyEmbedUrl: null
  };

  const songType = songData.type || "link";
  if (titleEl) titleEl.textContent = songData.title || "lady (hear me tonight)";
  if (artistEl) artistEl.textContent = songData.artist || "modjo";

  // Render according to songType: "link" | "spotify" | "mp3"
  const taglineEl = popover ? popover.querySelector(".airpods-tagline") : null;
  if (popover) popover.setAttribute("data-song-type", songType);

  if (songType === "link") {
    // Hide native audio playback, volume controls and tagline
    if (playbackRow) playbackRow.style.display = "none";
    if (volumeRow) volumeRow.style.display = "none";
    if (playBtn) playBtn.style.display = "none";
    if (progressBar) progressBar.style.display = "none";
    if (volumeSlider) volumeSlider.style.display = "none";
    if (missingNotice) missingNotice.style.display = "none";
    if (taglineEl) taglineEl.style.display = "none";

    // Add "listen on youtube ↗" button
    let ytBtn = popover.querySelector(".airpods-yt-link-btn");
    if (!ytBtn && popoverBody) {
      ytBtn = document.createElement("a");
      ytBtn.className = "airpods-yt-link-btn";
      ytBtn.href = songData.url || "https://youtu.be/mMfxI3r_LyA";
      ytBtn.target = "_blank";
      ytBtn.rel = "noopener noreferrer";
      ytBtn.innerHTML = `listen on youtube ↗`;
      popoverBody.appendChild(ytBtn);
    }
  } else if (songType === "spotify") {
    // Hide native audio playback and volume controls
    if (playbackRow) playbackRow.style.display = "none";
    if (volumeRow) volumeRow.style.display = "none";
    if (missingNotice) missingNotice.style.display = "none";

    // Add Spotify 80px iframe
    let spotifyFrame = popover.querySelector(".airpods-spotify-frame");
    if (!spotifyFrame && popoverBody && songData.spotifyEmbedUrl) {
      spotifyFrame = document.createElement("iframe");
      spotifyFrame.className = "airpods-spotify-frame";
      spotifyFrame.src = songData.spotifyEmbedUrl;
      spotifyFrame.width = "100%";
      spotifyFrame.height = "80";
      spotifyFrame.loading = "lazy";
      spotifyFrame.allow = "encrypted-media";
      spotifyFrame.style.border = "0";
      spotifyFrame.style.borderRadius = "8px";
      spotifyFrame.style.marginTop = "8px";
      popoverBody.appendChild(spotifyFrame);
    }
  } else if (songType === "mp3" && songData.src) {
    // MP3 native audio player
    if (playbackRow) playbackRow.style.display = "flex";
    if (volumeRow) volumeRow.style.display = "flex";

    const audio = new Audio(songData.src);
    audio.preload = "metadata";
    let isSeeking = false;
    let audioMissing = false;

    function formatTime(seconds) {
      if (!seconds || isNaN(seconds) || seconds < 0) return "0:00";
      const mins = Math.floor(seconds / 60);
      const secs = Math.floor(seconds % 60);
      return `${mins}:${secs.toString().padStart(2, "0")}`;
    }

    function showMissingNotice() {
      audioMissing = true;
      if (missingNotice) {
        missingNotice.textContent = `audio file not found at ${songData.src}`;
        missingNotice.style.display = "block";
      }
    }

    function hideMissingNotice() {
      audioMissing = false;
      if (missingNotice) missingNotice.style.display = "none";
    }

    // Volume persistence in localStorage inside try/catch
    const STORAGE_KEY = "ahmad_airpods_volume";
    function getSavedVolume() {
      try {
        const saved = localStorage.getItem(STORAGE_KEY);
        if (saved !== null) {
          const parsed = parseFloat(saved);
          if (!isNaN(parsed) && parsed >= 0 && parsed <= 1) return parsed;
        }
      } catch (err) {}
      return 0.8;
    }

    function saveVolume(val) {
      try {
        localStorage.setItem(STORAGE_KEY, val.toString());
      } catch (err) {}
    }

    const initialVol = getSavedVolume();
    audio.volume = initialVol;
    if (volumeSlider) {
      volumeSlider.value = initialVol;
      volumeSlider.addEventListener("input", (e) => {
        const v = parseFloat(e.target.value);
        audio.volume = v;
        saveVolume(v);
      });
    }

    function setPlayingUI(playing) {
      if (playing) {
        if (playSvg) playSvg.style.display = "none";
        if (pauseSvg) pauseSvg.style.display = "block";
        if (eqEl) eqEl.classList.add("is-playing");
        if (playBtn) playBtn.setAttribute("aria-label", "pause");
      } else {
        if (playSvg) playSvg.style.display = "block";
        if (pauseSvg) pauseSvg.style.display = "none";
        if (eqEl) eqEl.classList.remove("is-playing");
        if (playBtn) playBtn.setAttribute("aria-label", "play");
      }
    }

    if (playBtn) {
      playBtn.addEventListener("click", () => {
        if (audio.paused) {
          if (audioMissing) {
            showMissingNotice();
            return;
          }
          const playPromise = audio.play();
          if (playPromise !== undefined) {
            playPromise
              .then(() => setPlayingUI(true))
              .catch(() => {
                showMissingNotice();
                setPlayingUI(false);
              });
          }
        } else {
          audio.pause();
          setPlayingUI(false);
        }
      });
    }

    audio.addEventListener("play", () => setPlayingUI(true));
    audio.addEventListener("pause", () => setPlayingUI(false));
    audio.addEventListener("ended", () => {
      setPlayingUI(false);
      audio.currentTime = 0;
      if (progressBar) progressBar.value = 0;
      if (timeCurrent) timeCurrent.textContent = "0:00";
    });

    audio.addEventListener("loadedmetadata", () => {
      if (timeDuration) timeDuration.textContent = formatTime(audio.duration);
      hideMissingNotice();
    });

    audio.addEventListener("error", () => {
      showMissingNotice();
      setPlayingUI(false);
    });

    audio.addEventListener("timeupdate", () => {
      if (isSeeking) return;
      if (audio.duration && !isNaN(audio.duration)) {
        const progressPercent = (audio.currentTime / audio.duration) * 100;
        if (progressBar) progressBar.value = progressPercent;
        if (timeCurrent) timeCurrent.textContent = formatTime(audio.currentTime);
        if (timeDuration) timeDuration.textContent = formatTime(audio.duration);
      } else {
        if (timeCurrent) timeCurrent.textContent = formatTime(audio.currentTime);
      }
    });

    if (progressBar) {
      progressBar.addEventListener("input", () => {
        isSeeking = true;
        if (audio.duration && !isNaN(audio.duration)) {
          const seekTime = (progressBar.value / 100) * audio.duration;
          if (timeCurrent) timeCurrent.textContent = formatTime(seekTime);
        }
      });

      progressBar.addEventListener("change", () => {
        if (audio.duration && !isNaN(audio.duration)) {
          audio.currentTime = (progressBar.value / 100) * audio.duration;
        }
        isSeeking = false;
      });
    }
  }
});
