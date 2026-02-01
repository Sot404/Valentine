const yesBtn = document.getElementById("yesBtn");
const noBtn = document.getElementById("noBtn");
const buttons = document.getElementById("buttons");
const videoWrap = document.getElementById("videoWrap");

let noDodges = 0;

function rand(min, max) {
  return Math.random() * (max - min) + min;
}

function dodgeNo() {
  noDodges++;

  // Περιορίζουμε την κίνηση μέσα στο "κουτί" των κουμπιών
  const box = buttons.getBoundingClientRect();
  const btn = noBtn.getBoundingClientRect();

  const maxX = box.width - btn.width;
  const maxY = box.height - btn.height;

  const x = rand(0, Math.max(0, maxX));
  const y = rand(0, Math.max(0, maxY));

  noBtn.style.right = "auto";
  noBtn.style.left = `${x}px`;
  noBtn.style.top = `${y}px`;

  // Bonus: όσο προσπαθεί να πατήσει ΟΧΙ, το ΝΑΙ γίνεται λίγο πιο "ελκυστικό"
  const grow = Math.min(1.18, 1 + noDodges * 0.03);
  yesBtn.style.transform = `scale(${grow})`;
}

noBtn.addEventListener("mouseenter", dodgeNo);
noBtn.addEventListener("pointerdown", (e) => {
  e.preventDefault();
  dodgeNo();
});

function emojiConfetti(durationMs = 2200) {
  const emojis = ["💗","💖","💘","🌸","💐","✨","🥰","🍓","🫶"];
  const start = performance.now();

  function spawn() {
    const el = document.createElement("div");
    el.textContent = emojis[Math.floor(Math.random()*emojis.length)];
    el.style.position = "fixed";
    el.style.left = `${rand(0, window.innerWidth)}px`;
    el.style.top = `-30px`;
    el.style.fontSize = `${rand(20, 44)}px`;
    el.style.pointerEvents = "none";
    el.style.filter = "drop-shadow(0 8px 10px rgba(0,0,0,.12))";
    el.style.transform = `rotate(${rand(-30, 30)}deg)`;
    document.body.appendChild(el);

    const fall = el.animate(
      [
        { transform: el.style.transform + " translateY(0px)", opacity: 1 },
        { transform: el.style.transform + ` translateY(${window.innerHeight + 80}px)`, opacity: 0.95 }
      ],
      {
        duration: rand(1200, 2200),
        easing: "cubic-bezier(.2,.8,.2,1)"
      }
    );

    // μικρό side drift
    el.animate(
      [
        { marginLeft: "0px" },
        { marginLeft: `${rand(-120, 120)}px` }
      ],
      {
        duration: rand(900, 1600),
        easing: "ease-in-out"
      }
    );

    fall.onfinish = () => el.remove();
  }

  function loop(t) {
    if (t - start < durationMs) {
      // spawn a few per frame chunk
      for (let i=0; i<4; i++) spawn();
      requestAnimationFrame(loop);
    }
  }
  requestAnimationFrame(loop);
}

yesBtn.addEventListener("click", () => {
  emojiConfetti(2400);

  // αντικατάσταση κουμπιών με video
  buttons.hidden = true;
  videoWrap.hidden = false;

  // Optional: κείμενο αλλαγής
  const q = document.getElementById("question");
  q.textContent = "Yaaay! 💞";
});
