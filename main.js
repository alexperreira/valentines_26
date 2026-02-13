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
let noMoveCount = 0;
let dodgeEnabled = false;

const noLabels = [
  "No",
  "Nope",
  "Seriously?",
  "Come on...",
  "Not happening",
  "Try Yes",
  "Be nice",
];

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

  window.setTimeout(() => {
    dodgeEnabled = true;
  }, 2150);
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

function randomInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function moveNoButton() {
  if (!dodgeEnabled || celebrationDone) {
    return;
  }

  noButton.classList.add("mischief");

  const buttonRect = noButton.getBoundingClientRect();
  const margin = 12;
  const maxLeft = Math.max(margin, window.innerWidth - buttonRect.width - margin);
  const maxTop = Math.max(margin, window.innerHeight - buttonRect.height - margin);
  const left = randomInt(margin, Math.floor(maxLeft));
  const top = randomInt(margin, Math.floor(maxTop));

  noButton.style.left = `${left}px`;
  noButton.style.top = `${top}px`;

  noMoveCount += 1;
  const labelIndex = Math.min(noLabels.length - 1, noMoveCount);
  noButton.textContent = noLabels[labelIndex];

  if (noMoveCount > 18) {
    noButton.style.display = "none";
  }
}

function handlePointerMove(event) {
  if (!dodgeEnabled || celebrationDone || noButton.style.display === "none") {
    return;
  }

  const rect = noButton.getBoundingClientRect();
  const centerX = rect.left + rect.width / 2;
  const centerY = rect.top + rect.height / 2;
  const dx = event.clientX - centerX;
  const dy = event.clientY - centerY;
  const distance = Math.hypot(dx, dy);

  if (distance <= 100) {
    moveNoButton();
  }
}

function celebrateYes() {
  if (celebrationDone) {
    return;
  }

  celebrationDone = true;
  burstConfetti(100, 180);
  window.setTimeout(() => burstConfetti(120, 160), 180);
  headline.textContent = "Correct answer. I knew it.";
  app.classList.add("celebrating");

  noButton.style.display = "none";
  yesButton.textContent = "Yay!";
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

  noButton.addEventListener("mouseenter", moveNoButton);
  noButton.addEventListener("touchstart", (event) => {
    event.preventDefault();
    moveNoButton();
  });
  noButton.addEventListener("click", (event) => {
    event.preventDefault();
    moveNoButton();
  });

  document.addEventListener("mousemove", handlePointerMove);
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
