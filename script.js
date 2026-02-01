const yesBtn = document.getElementById("yesBtn");
const noBtn = document.getElementById("noBtn");
const buttons = document.getElementById("buttons");
const videoWrap = document.getElementById("videoWrap");
const heartsLayer = document.getElementById("heartsLayer");

let noDodges = 0;

function rand(min, max) {
  return Math.random() * (max - min) + min;
}

/* ---------- Falling hearts background ---------- */
const heartEmojis = ["💗","💖","💘","💞","💕","🌸","✨","💋","💐","🌷","🌹","🦕"];

function spawnHeart() {
  const el = document.createElement("div");
  el.className = "heart";
  el.textContent = heartEmojis[Math.floor(Math.random() * heartEmojis.length)];

  const x = rand(0, window.innerWidth);
  const drift = rand(-120, 120) + "px";
  const r = rand(-25, 25) + "deg";
  const dur = rand(7.5, 13.5);

  el.style.setProperty("--x", x + "px");
  el.style.setProperty("--drift", drift);
  el.style.setProperty("--r", r);
  el.style.animationDuration = dur + "s";
  el.style.fontSize = rand(18, 40) + "px";
  el.style.opacity = rand(0.35, 0.9);

  heartsLayer.appendChild(el);
  el.addEventListener("animationend", () => el.remove());
}

// steady stream
setInterval(() => {
  // λίγα κάθε φορά για να μην “βαραίνει”
  for (let i = 0; i < 2; i++) spawnHeart();
}, 450);

/* ---------- NO button dodge ---------- */
function moveNoButton() {
  noDodges++;

  const box = buttons.getBoundingClientRect();
  const btn = noBtn.getBoundingClientRect();

  const padding = 8;
  const maxX = Math.max(padding, box.width - btn.width - padding);
  const maxY = Math.max(padding, box.height - btn.height - padding);

  const x = rand(padding, maxX);
  const y = rand(padding, maxY);

  // move within the buttons container
  noBtn.style.left = `${x}px`;
  noBtn.style.top = `${y}px`;
  noBtn.style.right = "auto";

  // make YES a bit more tempting
  const grow = Math.min(1.22, 1 + noDodges * 0.03);
  yesBtn.style.transform = `scale(${grow})`;
  yesBtn.style.filter = `brightness(${Math.min(1.12, 1 + noDodges * 0.01)})`;
}

// For desktop hover
noBtn.addEventListener("mouseenter", moveNoButton);
// For mobile / touch
noBtn.addEventListener("pointerdown", (e) => {
  e.preventDefault();
  moveNoButton();
});

// Extra: αν ο χρήστης πάει να το “πλησιάσει” με το ποντίκι, φεύγει νωρίτερα
buttons.addEventListener("pointermove", (e) => {
  const r = noBtn.getBoundingClientRect();
  const dx = e.clientX - (r.left + r.width / 2);
  const dy = e.clientY - (r.top + r.height / 2);
  const dist = Math.hypot(dx, dy);

  if (dist < 90) moveNoButton();
});

/* ---------- Emoji confetti (guaranteed) ---------- */
function emojiConfetti(durationMs = 2000) {
  const emojis = ["💗","💖","💘","🌸","💐","✨","🥰","🍓","🫶","💝"];

  const endAt = Date.now() + durationMs;
  const spawnRate = 45; // ms

  const timer = setInterval(() => {
    const el = document.createElement("div");
    el.className = "confetti";
    el.textContent = emojis[Math.floor(Math.random() * emojis.length)];

    const x = rand(0, window.innerWidth);
    const drift = rand(-180, 180) + "px";
    const r = rand(-40, 40) + "deg";
    const dur = rand(1.3, 2.3);

    el.style.setProperty("--x", x + "px");
    el.style.setProperty("--drift", drift);
    el.style.setProperty("--r", r);
    el.style.animationDuration = dur + "s";
    el.style.fontSize = rand(22, 48) + "px";

    document.body.appendChild(el);
    el.addEventListener("animationend", () => el.remove());

    if (Date.now() >= endAt) clearInterval(timer);
  }, spawnRate);
}

/* ---------- YES click ---------- */
yesBtn.addEventListener("click", () => {
  emojiConfetti(2200);

  // swap buttons -> video
  buttons.hidden = true;
  videoWrap.hidden = false;

  const q = document.getElementById("question");
  q.textContent = "Yaaay! 💞";
});
