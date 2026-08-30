let overlayTimer;
const videoPlayOverlay =
  document.querySelector("#video-play-overlay");
const video = document.querySelector("#custom-video-player");
const playPauseBtn = document.querySelector("#play-pause-btn");
const playPauseImg = document.querySelector("#play-pause-img");
const progressBar = document.querySelector("#progress-bar-fill");
const videoVisual = document.querySelector(".video-visual");
const videoSpotlight = document.querySelector(".video-spotlight");
const immersiveBtn = document.querySelector("#immersive-btn");
const mediaPlayer = document.querySelector(".media-player");

videoVisual.addEventListener("mousemove", function (event) {
  const rect = videoVisual.getBoundingClientRect();

  const x = event.clientX - rect.left;
  const y = event.clientY - rect.top;

  videoSpotlight.style.left = x + "px";
  videoSpotlight.style.top = y + "px";
  videoSpotlight.style.opacity = "1";
});

videoPlayOverlay.addEventListener("click", function () {
  video.play();
});

videoVisual.addEventListener("mouseleave", function () {
  videoSpotlight.style.opacity = "0";
});
video.removeAttribute("controls");
// playPauseBtn.addEventListener("click", togglePlayPause);
video.addEventListener("timeupdate", updateProgressBar);

video.addEventListener("play", function () {
  clearTimeout(overlayTimer);

  videoPlayOverlay.style.opacity = "0";
  videoPlayOverlay.style.pointerEvents = "none";
});

video.addEventListener("pause", function () {
  clearTimeout(overlayTimer);

  videoPlayOverlay.style.opacity = "1";
  videoPlayOverlay.style.pointerEvents = "auto";

  overlayTimer = setTimeout(function () {
    videoPlayOverlay.style.opacity = "0";
    videoPlayOverlay.style.pointerEvents = "none";
  }, 2000);
});

video.addEventListener("ended", function () {
  videoPlayOverlay.style.opacity = "1";
  videoPlayOverlay.style.pointerEvents = "auto";
});

videoPlayOverlay.addEventListener("click", function () {
  video.play();
});

function togglePlayPause() {
  if (video.paused || video.ended) {

    video.muted = false;
    video.play();

    playPauseImg.src = "https://img.icons8.com/ios-glyphs/30/pause--v1.png";

  } else {

    video.pause();

    playPauseImg.src = "https://img.icons8.com/ios-glyphs/30/play--v1.png";
  }
}

function updateProgressBar() {
  const value = (video.currentTime / video.duration) * 100;
  progressBar.style.width = value + "%";
}
// Add other functionalities here

let immersiveMode = false;

immersiveBtn.addEventListener("click", toggleImmersiveMode);

function toggleImmersiveMode() {

  immersiveMode = !immersiveMode;

  document.body.classList.toggle("immersive-mode", immersiveMode);

  if (immersiveMode) {
    immersiveBtn.textContent = "EXIT THE STATIC";
    video.play();
  } else {
    immersiveBtn.textContent = "ENTER THE STATIC";
  }
}