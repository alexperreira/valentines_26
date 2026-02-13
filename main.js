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
let dodgeEnabled = false;
let lastNoMoveAt = 0;
let yesScale = 1;

const MOVE_COOLDOWN_MS = 1600;
const NO_TRIGGER_DISTANCE = 140;
const NO_MIN_ESCAPE_DISTANCE = 16;
const NO_MAX_ESCAPE_DISTANCE = 28;
const YES_GROWTH_STEP = 0.015;
const YES_MARGIN = 24;
const lastPointer = {
  x: window.innerWidth / 2,
  y: window.innerHeight / 2,
};

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

function getYesMaxScale() {
  const baseWidth = yesButton.offsetWidth || 1;
  const baseHeight = yesButton.offsetHeight || 1;
  const maxByWidth = (window.innerWidth - YES_MARGIN) / baseWidth;
  const maxByHeight = (window.innerHeight - YES_MARGIN) / baseHeight;
  return Math.max(1, Math.min(maxByWidth, maxByHeight, 1.25));
}

function growYesButton() {
  const maxScale = getYesMaxScale();
  yesScale = Math.min(maxScale, yesScale + YES_GROWTH_STEP);
  yesButton.style.transform = `scale(${yesScale})`;
}

function getNoButtonSize() {
  const rect = noButton.getBoundingClientRect();
  const width = rect.width || noButton.offsetWidth || 120;
  const height = rect.height || noButton.offsetHeight || 48;
  return { width, height };
}

function anchorNoButtonToViewport() {
  if (noButton.classList.contains("mischief")) {
    return;
  }

  const margin = 12;
  const rect = noButton.getBoundingClientRect();
  const width = rect.width || noButton.offsetWidth || 120;
  const height = rect.height || noButton.offsetHeight || 48;
  const maxLeft = Math.max(margin, window.innerWidth - width - margin);
  const maxTop = Math.max(margin, window.innerHeight - height - margin);
  const anchoredLeft = Math.min(Math.max(rect.left, margin), maxLeft);
  const anchoredTop = Math.min(Math.max(rect.top, margin), maxTop);

  noButton.style.position = "fixed";
  noButton.style.zIndex = "40";
  noButton.style.margin = "0";
  noButton.style.left = `${Math.round(anchoredLeft)}px`;
  noButton.style.top = `${Math.round(anchoredTop)}px`;
  noButton.classList.add("mischief");
}

function getBestEscapePosition(pointerX, pointerY) {
  const margin = 12;
  const { width, height } = getNoButtonSize();
  const maxLeft = Math.max(margin, window.innerWidth - width - margin);
  const maxTop = Math.max(margin, window.innerHeight - height - margin);
  const rect = noButton.getBoundingClientRect();
  const currentCenterX = rect.left + width / 2;
  const currentCenterY = rect.top + height / 2;

  const awayAngle = Math.atan2(currentCenterY - pointerY, currentCenterX - pointerX);
  let bestCandidate = { left: rect.left, top: rect.top, score: -Infinity };

  for (let i = 0; i < 10; i += 1) {
    const angleOffset = ((Math.random() * 150 - 75) * Math.PI) / 180;
    const travel = randomInt(NO_MIN_ESCAPE_DISTANCE, NO_MAX_ESCAPE_DISTANCE);
    const escapeAngle = awayAngle + angleOffset;
    const unitX = Math.cos(escapeAngle);
    const unitY = Math.sin(escapeAngle);

    const nextCenterX = currentCenterX + unitX * travel;
    const nextCenterY = currentCenterY + unitY * travel;

    const clampedCenterX = Math.min(Math.max(nextCenterX, margin + width / 2), maxLeft + width / 2);
    const clampedCenterY = Math.min(Math.max(nextCenterY, margin + height / 2), maxTop + height / 2);
    const candidateLeft = Math.round(clampedCenterX - width / 2);
    const candidateTop = Math.round(clampedCenterY - height / 2);

    const candidateCenterX = candidateLeft + width / 2;
    const candidateCenterY = candidateTop + height / 2;
    const pointerDistance = Math.hypot(pointerX - candidateCenterX, pointerY - candidateCenterY);
    const moveDistance = Math.hypot(candidateCenterX - currentCenterX, candidateCenterY - currentCenterY);
    const score = pointerDistance - moveDistance * 0.4;

    if (score > bestCandidate.score) {
      bestCandidate = { left: candidateLeft, top: candidateTop, score };
    }
  }

  if (!Number.isFinite(bestCandidate.left) || !Number.isFinite(bestCandidate.top)) {
    return { left: Math.round(rect.left), top: Math.round(rect.top) };
  }

  return { left: bestCandidate.left, top: bestCandidate.top };
}

function moveNoButton(pointerX = lastPointer.x, pointerY = lastPointer.y, force = false) {
  if (!dodgeEnabled || celebrationDone || noButton.style.display === "none") {
    return;
  }

  const now = Date.now();
  if (!force && now - lastNoMoveAt < MOVE_COOLDOWN_MS) {
    return;
  }

  anchorNoButtonToViewport();

  const position = getBestEscapePosition(pointerX, pointerY);
  noButton.style.left = `${position.left}px`;
  noButton.style.top = `${position.top}px`;

  growYesButton();

  lastNoMoveAt = now;
}

function handlePointerMove(event) {
  if (!dodgeEnabled || celebrationDone || noButton.style.display === "none") {
    return;
  }

  lastPointer.x = event.clientX;
  lastPointer.y = event.clientY;

  const rect = noButton.getBoundingClientRect();
  const centerX = rect.left + rect.width / 2;
  const centerY = rect.top + rect.height / 2;
  const distance = Math.hypot(event.clientX - centerX, event.clientY - centerY);

  if (distance <= NO_TRIGGER_DISTANCE) {
    moveNoButton(event.clientX, event.clientY);
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

  noButton.addEventListener("touchstart", (event) => {
    event.preventDefault();
    const touch = event.touches[0];
    const x = touch ? touch.clientX : lastPointer.x;
    const y = touch ? touch.clientY : lastPointer.y;
    moveNoButton(x, y, true);
  });

  noButton.addEventListener("click", (event) => {
    event.preventDefault();
    moveNoButton(lastPointer.x, lastPointer.y, true);
  });

  document.addEventListener("mousemove", handlePointerMove);
  window.addEventListener("resize", () => {
    yesScale = Math.min(yesScale, getYesMaxScale());
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
