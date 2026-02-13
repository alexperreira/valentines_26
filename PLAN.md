# Valentine’s Day Card — Execution Plan

## Project Overview

We are building a single static HTML page that serves as a goofy Valentine’s Day card.
It should:

1. Display a full-screen pink background.
2. On page load or first click:
   - Play a Bad Bunny song.
   - Trigger confetti celebration (use a JS confetti library).
3. Animate in:
   - A hilariously poorly-cropped Bad Bunny image.
   - A poorly cropped “Super Bowl wedding” image with custom faces overlaid.
4. Show centered text: **“Be my valentine?”**
5. Show two buttons: **Yes** and **No**.
   - If the user tries to click **No**, the button runs away.
   - Clicking **Yes** triggers a celebratory state.

## Assets (place in `/assets/`)

- `badbunny.png` — poorly cropped Bad Bunny image
- `superbowl-wedding.png` — main wedding photo
- `your-face.png` — your face overlay
- `her-face.png` — her face overlay
- `song.mp3` — Bad Bunny song (local file)
- Optional: extra GIF or celebration image for the Yes screen

## Dependencies

- Use **canvas-confetti** for confetti effects via CDN:
  `<script src="https://cdn.jsdelivr.net/npm/canvas-confetti@latest/dist/confetti.browser.min.js"></script>`
  (This library triggers confetti easily with a single call like `confetti()`.) :contentReference[oaicite:0]{index=0}

## HTML Structure

- A fullscreen container with pink background.
- A hidden audio element for the song.
- Image elements for Bad Bunny and the wedding photo + face overlays.
- A headline text element.
- Yes / No buttons.

## Behavior

### Audio Playback

- Attempt autoplay on page load.
- If the audio is blocked by the browser, show a big **“Tap to Play the Vibes!”** button first.
  On click, play audio and start animations.

### Confetti

- On page load or user interaction, trigger a confetti burst.
- Use a moderate amount of particles so it feels celebratory.

### Image / Animation Timeline

Use `setTimeout` to sequence:

1. t = 0.0s — confetti burst and audio begins.
2. t = 0.2s — Bad Bunny image fades/slides in.
3. t = 1.2s — Wedding photo and face overlays animate into view.
4. t = 2.0s — Headline and buttons fade in.

### Buttons

#### Yes Button

- On click:
  - Trigger another confetti burst.
  - Change text to a celebratory message like:
    “Correct answer 😌” or “I knew it.”
  - Optional: animate hearts or additional visuals.

#### No Button

- When the cursor/finger gets near:
  - Move the button to a random position on screen.
  - Ensure it stays visible but dodges close proximity.
  - On mobile, reposition on `touchstart`.

### Dodging Logic (No Button)

- Listen for `mousemove` events.
- Check distance between cursor and button.
- If within ~100px radius, teleport button to a random location within the viewport.
- On mobile, use any attempted tap on the No button area to trigger relocation.

## Styling

- Use CSS for:
  - Fullscreen pink background (`pink`, `#ffcad4`, etc.)
  - Centered content
  - Fun font for the headline
  - Buttons styled to look humorous (rounded, bold)

## JavaScript Responsibilities

1. Load audio and manage playback.
2. Trigger confetti using `confetti()` calls.
3. Animate entry of images and text (CSS classes or JS transitions).
4. Dodge logic for the “No” button.
5. Yes button interaction state change.

## Final States

- **Yes:** celebration + final message.
- **No:** perpetual dodge + optional changing labels like:
  - “Nope”
  - “Seriously?”
  - “Come on…”
  - Eventually disappears after many attempts.

## Optional Enhancements

- Add subtle background animation (e.g., slight pulse).
- Add goofy sound effects for dodging the “No” button.
- Add keyboard accessibility fallback.

## Deliverables

Codex should output:

- `index.html`
- `styles.css`
- `main.js`

Each file should be clearly commented and structured.
