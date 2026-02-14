const startButton = document.getElementById("startButton");
const headline = document.getElementById("headline");
const badBunnyImage = document.getElementById("badBunnyImage");
const weddingStack = document.getElementById("weddingStack");
const buttonRow = document.getElementById("buttonRow");
const yesButton = document.getElementById("yesButton");
const noButton = document.getElementById("noButton");
const song = document.getElementById("song");
const app = document.getElementById("app");

let hasStarted = false;
let celebrationDone = false;
let yesScale = 1;

const YES_TARGET_SCALE = 1.5;
const YES_GROWTH_STEP = 0.08;

function burstConfetti(spread = 80, particleCount = 120) {
  if (typeof confetti !== "function") {
    return;
  }

  confetti({
    particleCount,
    spread,
    origin: { y: 0.62 },
  });
}

function revealWithDelay(element, delayMs) {
  window.setTimeout(() => {
    element.classList.remove("hidden");
    element.classList.add("reveal");
  }, delayMs);
}

function launchTimeline() {
  burstConfetti(92, 150);
  revealWithDelay(badBunnyImage, 200);
  revealWithDelay(weddingStack, 1200);
  revealWithDelay(headline, 2000);
  revealWithDelay(buttonRow, 2000);
}

function hideStartButton() {
  startButton.style.display = "none";
}

function showStartButton() {
  startButton.style.display = "inline-block";
}

async function playSong() {
  song.volume = 0.8;
  await song.play();
}

function startExperience() {
  if (hasStarted) {
    return;
  }

  hasStarted = true;
  hideStartButton();
  launchTimeline();
}

function growYesButton() {
  yesScale = Math.min(YES_TARGET_SCALE, yesScale + YES_GROWTH_STEP);
  yesButton.style.transform = `scale(${yesScale})`;
}

function triggerNoButtonNudge() {
  noButton.classList.remove("nudging");
  // Restart animation if interactions happen back-to-back.
  void noButton.offsetWidth;
  noButton.classList.add("nudging");
}

function celebrateYes() {
  if (celebrationDone) {
    return;
  }

  celebrationDone = true;
  burstConfetti(100, 180);
  window.setTimeout(() => burstConfetti(120, 160), 180);
  headline.textContent = "Tú eres mía… y yo soy tuyo";
  app.classList.add("celebrating");

  noButton.style.display = "none";
  yesButton.textContent = "Yay!";
  yesButton.style.transform = "scale(1)";
}

function initEvents() {
  startButton.addEventListener("click", async () => {
    if (hasStarted) {
      return;
    }

    hideStartButton();

    try {
      await playSong();
      hasStarted = true;
      launchTimeline();
    } catch {
      showStartButton();
    }
  });

  yesButton.addEventListener("click", celebrateYes);

  noButton.addEventListener("mouseenter", () => {
    triggerNoButtonNudge();
    growYesButton();
  });
  noButton.addEventListener("touchstart", () => {
    triggerNoButtonNudge();
    growYesButton();
  }, { passive: true });
  noButton.addEventListener("click", () => {
    triggerNoButtonNudge();
    growYesButton();
  });

  window.addEventListener("resize", () => {
    yesButton.style.transform = `scale(${yesScale})`;
  });
}

function watchMissingAssets() {
  const assets = [badBunnyImage, weddingStack.querySelector(".wedding"), song];

  assets.forEach((asset) => {
    asset.addEventListener("error", () => {
      console.warn("Missing or failed asset:", asset.currentSrc || asset.src);
    });
  });
}

async function init() {
  initEvents();
  watchMissingAssets();
  hideStartButton();

  try {
    await playSong();
    startExperience();
  } catch {
    showStartButton();
  }
}

init();
