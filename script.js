/* =========================================================
   BIRTHDAY APP — script.js
   =========================================================
   CONFIGURABLE: Change JUMPSCARE_DELAY_SECONDS to set how
   long (in seconds) Phase 4 stays visible before the scare.
   ========================================================= */

const JUMPSCARE_DELAY_SECONDS = 10; // ← change this for testing

/* ---------- helpers ---------- */
function show(id) {
  const el = document.getElementById(id);
  el.classList.remove('fade-out');
  el.classList.add('active');
}

function hide(id, cb) {
  const el = document.getElementById(id);
  el.classList.add('fade-out');
  setTimeout(() => {
    el.classList.remove('active', 'fade-out');
    if (cb) cb();
  }, 1000);
}

/* =========================================================
   PHASE 1 — GREETING
   ========================================================= */
function buildStars() {
  const container = document.getElementById('stars');
  for (let i = 0; i < 120; i++) {
    const s = document.createElement('div');
    s.className = 'star';
    const size = Math.random() * 3 + 1;
    s.style.cssText = `
      width:${size}px; height:${size}px;
      top:${Math.random()*100}%;
      left:${Math.random()*100}%;
      --d:${(Math.random()*2+1).toFixed(1)}s;
      --o:${(Math.random()*0.5+0.3).toFixed(2)};
      animation-delay:${(Math.random()*3).toFixed(1)}s;
    `;
    container.appendChild(s);
  }
}

function launchConfetti() {
  const container = document.getElementById('confetti');
  const colors = ['#f5c842','#ff6b9d','#4ecdc4','#ff9f43','#a29bfe','#fd79a8'];
  for (let i = 0; i < 80; i++) {
    const c = document.createElement('div');
    c.className = 'cp';
    c.style.cssText = `
      left:${Math.random()*100}%;
      top:${Math.random()*40+5}%;
      background:${colors[Math.floor(Math.random()*colors.length)]};
      width:${Math.random()*10+6}px;
      height:${Math.random()*10+6}px;
      border-radius:${Math.random() > 0.5 ? '50%' : '2px'};
      --fd:${(Math.random()*3+2).toFixed(1)}s;
      --fd2:${(Math.random()*2).toFixed(1)}s;
    `;
    container.appendChild(c);
  }
}

/* =========================================================
   PHASE 2 — CAKE & KNIFE
   ========================================================= */
function runCakeAnimation() {
  show('phase-cake');

  const knifeWrapper = document.getElementById('knifeWrapper');
  const cake         = document.getElementById('cake');
  const cakeLeft     = document.getElementById('cakeLeft');
  const cakeRight    = document.getElementById('cakeRight');

  // Delay before the knife swings
  setTimeout(() => {
    knifeWrapper.classList.add('cutting');

    // When blade hits cake (~1.1s), hide original cake, show halves
    setTimeout(() => {
      cake.classList.add('cut');
      cakeLeft.classList.add('splitting');
      cakeRight.classList.add('splitting');
    }, 1100);

    // Fade out the whole phase after animation finishes
    setTimeout(() => {
      hide('phase-cake', startPhase3);
    }, 3500);

  }, 1400); // time before knife starts moving
}

/* =========================================================
   PHASE 3 — WISH INPUT
   ========================================================= */
function startPhase3() {
  show('phase-wish');
}

function submitWish() {
  hide('phase-wish', showResults);
}

/* =========================================================
   PHASE 4 — RESULTS
   ========================================================= */
function showResults() {
  show('phase-results');

  // Stagger reveal of each wish item
  const items = document.querySelectorAll('.wish-item');
  items.forEach((item, i) => {
    setTimeout(() => item.classList.add('reveal'), 300 + i * 400);
  });

  // Schedule jump scare
  setTimeout(triggerJumpScare, JUMPSCARE_DELAY_SECONDS * 1000);
}

/* =========================================================
   PHASE 5 — JUMP SCARE
   ========================================================= */
function triggerJumpScare() {
  hide('phase-results', () => {
    show('phase-jumpscare');

    // Flash the screen white first for extra impact
    document.body.style.background = '#fff';
    setTimeout(() => { document.body.style.background = ''; }, 100);

    // Optionally: play a beep sound if AudioContext is available
    try {
      const ctx = new (window.AudioContext || window.webkitAudioContext)();
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(220, ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(880, ctx.currentTime + 0.3);
      gain.gain.setValueAtTime(0.6, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.5);
      osc.start();
      osc.stop(ctx.currentTime + 0.5);
    } catch(e) { /* audio not available */ }
  });
}

/* =========================================================
   BOOT SEQUENCE
   ========================================================= */
window.addEventListener('DOMContentLoaded', () => {
  buildStars();
  launchConfetti();

  show('phase-greeting');

  // Phase 1 → Phase 2 after 4 seconds
  setTimeout(() => {
    hide('phase-greeting', runCakeAnimation);
  }, 4000);
});
