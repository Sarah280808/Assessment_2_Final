/* =========================
   ELEMENT REFERENCES
   ========================= */

const video =
  document.querySelector(
    "#custom-video-player"
  );


const playPauseBtn =
  document.querySelector(
    "#play-pause-btn"
  );


const playPauseSymbol =
  document.querySelector(
    "#play-pause-symbol"
  );


const progressBar =
  document.querySelector(
    "#progress-bar"
  );


const progressBarFill =
  document.querySelector(
    "#progress-bar-fill"
  );


const timeDisplay =
  document.querySelector(
    "#time-display"
  );


const videoVisual =
  document.querySelector(
    ".video-visual"
  );


const videoSpotlight =
  document.querySelector(
    ".video-spotlight"
  );


const videoPlayOverlay =
  document.querySelector(
    "#video-play-overlay"
  );


const muteBtn =
  document.querySelector(
    "#mute-btn"
  );


const volumeSlider =
  document.querySelector(
    "#volume-slider"
  );


const immersiveBtn =
  document.querySelector(
    "#immersive-btn"
  );

const signalMessage =
  document.querySelector(
    "#signal-message");

let signalTimer;

/* Native browser controls are removed because
   this project uses a custom interface. */

video.removeAttribute("controls");



/* =========================
   INITIAL PLAYER STATE
   ========================= */

video.volume = 0.7;


/* Autoplay is muted because modern browsers
   commonly block autoplay with sound. */

video.muted = true;

muteBtn.classList.add("muted");



/* =========================
   PLAY / PAUSE
   ========================= */

function togglePlayPause() {

  if (
    video.paused ||
    video.ended
  ) {

    video.play();

  } else {

    video.pause();

  }

}



playPauseBtn.addEventListener(
  "click",
  togglePlayPause
);

function showSignalMessage(message) {

  clearTimeout(signalTimer);

  signalMessage.textContent = message;

  signalMessage.classList.add("show");

  signalTimer = setTimeout(function () {

    signalMessage.classList.remove("show");

  }, 1300);

}

/* Keep visual controls synchronised with
   the actual state of the video. */

video.addEventListener(
  "play",
  function () {
    showSignalMessage("SIGNAL DETECTED");

    playPauseSymbol.textContent =
      "❚❚";


    clearTimeout(
      overlayTimer
    );


    hideVideoOverlay();

  }
);



video.addEventListener(
  "pause",
  function () {
    if (!video.ended) {
    showSignalMessage("SIGNAL INTERRUPTED");
  }


    playPauseSymbol.textContent =
      "▶";


    showVideoOverlayTemporarily();

  }
);



video.addEventListener(
  "ended",
  function () {

    playPauseSymbol.textContent =
      "▶";


    videoPlayOverlay.style.opacity =
      "1";


    videoPlayOverlay.style.pointerEvents =
      "auto";

  }
);



/* =========================
   VIDEO PLAY OVERLAY
   ========================= */

let overlayTimer;



function hideVideoOverlay() {

  videoPlayOverlay.style.opacity =
    "0";


  videoPlayOverlay.style.pointerEvents =
    "none";

}



function showVideoOverlayTemporarily() {

  clearTimeout(
    overlayTimer
  );


  videoPlayOverlay.style.opacity =
    "1";


  videoPlayOverlay.style.pointerEvents =
    "auto";


  overlayTimer =
    setTimeout(
      function () {

        hideVideoOverlay();

      },

      2000
    );

}



videoPlayOverlay.addEventListener(
  "click",
  function () {

    video.play();

  }
);



/* =========================
   VIDEO TIME + PROGRESS
   ========================= */

video.addEventListener(
  "timeupdate",
  updateProgressBar
);



video.addEventListener(
  "loadedmetadata",
  updateProgressBar
);



function updateProgressBar() {

  if (
    !video.duration ||
    isNaN(video.duration)
  ) {

    return;

  }


  const percentage =

    (
      video.currentTime /
      video.duration
    )

    * 100;


  progressBarFill.style.width =
    percentage + "%";


  progressBar.setAttribute(
    "aria-valuenow",
    Math.round(percentage)
  );


  timeDisplay.textContent =

    formatTime(
      video.currentTime
    )

    +

    " / "

    +

    formatTime(
      video.duration
    );

}



function formatTime(seconds) {

  const minutes =
    Math.floor(
      seconds / 60
    );


  const remainingSeconds =
    Math.floor(
      seconds % 60
    );


  return (

    String(minutes)
      .padStart(
        2,
        "0"
      )

    +

    ":"

    +

    String(
      remainingSeconds
    )
      .padStart(
        2,
        "0"
      )

  );

}



/* =========================
   SEEK TIMELINE
   ========================= */

function seekVideo(event) {

  if (
    !video.duration ||
    isNaN(video.duration)
  ) {

    return;

  }


  const rect =
    progressBar
      .getBoundingClientRect();


  let position =

    (
      event.clientX -
      rect.left
    )

    /

    rect.width;


  /* Prevent values below 0
     or above 1. */

  position =
    Math.max(
      0,
      Math.min(
        1,
        position
      )
    );


  video.currentTime =
    position *
    video.duration;

}



/* Click anywhere on timeline */

progressBar.addEventListener(
  "click",
  seekVideo
);



/* Drag along timeline */

let isSeeking =
  false;



progressBar.addEventListener(
  "pointerdown",
  function (event) {

    isSeeking = true;


    progressBar.setPointerCapture(
      event.pointerId
    );


    seekVideo(event);

  }
);



progressBar.addEventListener(
  "pointermove",
  function (event) {

    if (!isSeeking) {
      return;
    }


    seekVideo(event);

  }
);



progressBar.addEventListener(
  "pointerup",
  function () {

    isSeeking = false;

  }
);



progressBar.addEventListener(
  "pointercancel",
  function () {

    isSeeking = false;

  }
);



/* =========================
   SOUND / MUTE
   ========================= */

muteBtn.addEventListener(
  "click",
  function () {

    video.muted =
      !video.muted;


    updateMuteInterface();

  }
);



function updateMuteInterface() {

  const silent =

    video.muted ||

    video.volume === 0;


  muteBtn.classList.toggle(
    "muted",
    silent
  );


  if (silent) {

    muteBtn.setAttribute(
      "aria-label",
      "Unmute sound"
    );

  } else {

    muteBtn.setAttribute(
      "aria-label",
      "Mute sound"
    );

  }

}



/* =========================
   VOLUME
   ========================= */

volumeSlider.addEventListener(
  "input",
  function () {

    const newVolume =
      Number(
        volumeSlider.value
      );


    video.volume =
      newVolume;


    if (
      newVolume === 0
    ) {

      video.muted =
        true;

    } else {

      video.muted =
        false;

    }


    updateMuteInterface();

  }
);



/* =========================
   VIDEO SPOTLIGHT
   ========================= */

videoVisual.addEventListener(
  "mousemove",
  function (event) {

    const rect =
      videoVisual
        .getBoundingClientRect();


    const x =
      event.clientX -
      rect.left;


    const y =
      event.clientY -
      rect.top;


    videoSpotlight.style.left =
      x + "px";


    videoSpotlight.style.top =
      y + "px";


    videoSpotlight.style.opacity =
      "1";

  }
);



videoVisual.addEventListener(
  "mouseleave",
  function () {

    videoSpotlight.style.opacity =
      "0";

  }
);



/* =========================
   IMMERSIVE MODE
   ========================= */

let immersiveMode =
  false;



immersiveBtn.addEventListener(
  "click",
  toggleImmersiveMode
);



function toggleImmersiveMode() {

  immersiveMode =
    !immersiveMode;


  document.body
    .classList
    .toggle(
      "immersive-mode",
      immersiveMode
    );


  if (immersiveMode) {

    immersiveBtn.textContent =
      "EXIT THE STATIC";


    video.play();

  } else {

    immersiveBtn.textContent =
      "ENTER THE STATIC";

  }

}

const details = document.querySelectorAll(".detail");

const detailObserver = new IntersectionObserver(
  function (entries) {

    entries.forEach(function (entry) {

      if (entry.isIntersecting) {

        entry.target.classList.add("visible");

      }

    });

  },
  {
    threshold: 0.2
  }
);

details.forEach(function (detail) {

  detailObserver.observe(detail);

});

const siteTitle = document.querySelector("#site-title");

let titleClicks = 0;
let titleClickTimer;

siteTitle.addEventListener("click", function () {

  titleClicks++;

  clearTimeout(titleClickTimer);

  titleClickTimer = setTimeout(function () {

    titleClicks = 0;

  }, 800);

  if (titleClicks === 3) {

    titleClicks = 0;

    activateSecretStatic();

  }

});

function activateSecretStatic() {

  document.body.classList.add("secret-static");

  showSignalMessage("SIGNAL LOST");

  setTimeout(function () {

    document.body.classList.remove("secret-static");

  }, 3000);

}