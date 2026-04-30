// CURSOR
const cursor = document.getElementById('cursor');
const cursorDot = document.getElementById('cursor-dot');
const crossH = document.getElementById('cursor-crossh-h');
const crossV = document.getElementById('cursor-crossh-v');

let mx = 0, my = 0, cx = 0, cy = 0;
document.addEventListener('mousemove', e => {
  mx = e.clientX; my = e.clientY;
  cursorDot.style.left = mx + 'px';
  cursorDot.style.top = my + 'px';
  crossH.style.top = my + 'px';
  crossV.style.left = mx + 'px';
});
(function animateCursor() {
  cx += (mx - cx) * 0.15;
  cy += (my - cy) * 0.15;
  cursor.style.left = cx + 'px';
  cursor.style.top = cy + 'px';
  requestAnimationFrame(animateCursor);
})();

// CLOCK
function updateClock() {
  const now = new Date();
  const pad = n => String(n).padStart(2, '0');
  document.getElementById('live-clock').textContent =
    pad(now.getHours()) + ':' + pad(now.getMinutes()) + ':' + pad(now.getSeconds());
}
setInterval(updateClock, 1000);
updateClock();

// CANVAS BACKGROUND
const canvas = document.getElementById('bg-canvas');
const ctx = canvas.getContext('2d');
let W, H;
function resize() {
  W = canvas.width = window.innerWidth;
  H = canvas.height = window.innerHeight;
}
resize();
window.addEventListener('resize', resize);

const GRID = 60;
const particles = Array.from({ length: 80 }, () => ({
  x: Math.random() * 2000,
  y: Math.random() * 2000,
  vx: (Math.random() - 0.5) * 0.3,
  vy: (Math.random() - 0.5) * 0.3,
  size: Math.random() * 1.5 + 0.5,
  alpha: Math.random() * 0.5 + 0.1
}));

let scrollY = 0;
window.addEventListener('scroll', () => { scrollY = window.scrollY; });

function drawBg() {
  ctx.clearRect(0, 0, W, H);

  ctx.strokeStyle = 'rgba(0,212,255,0.04)';
  ctx.lineWidth = 1;
  const offX = (scrollY * 0.1) % GRID;
  const offY = (scrollY * 0.05) % GRID;
  for (let x = -GRID + offX; x < W + GRID; x += GRID) {
    ctx.beginPath(); ctx.moveTo(x, 0); ctx.lineTo(x, H); ctx.stroke();
  }
  for (let y = -GRID + offY; y < H + GRID; y += GRID) {
    ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(W, y); ctx.stroke();
  }

  particles.forEach(p => {
    p.x += p.vx; p.y += p.vy;
    if (p.x < 0) p.x = W; if (p.x > W) p.x = 0;
    if (p.y < 0) p.y = H; if (p.y > H) p.y = 0;
    ctx.beginPath();
    ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
    ctx.fillStyle = `rgba(0,212,255,${p.alpha})`;
    ctx.fill();
  });

  for (let i = 0; i < particles.length; i++) {
    for (let j = i + 1; j < particles.length; j++) {
      const dx = particles[i].x - particles[j].x;
      const dy = particles[i].y - particles[j].y;
      const dist = Math.sqrt(dx * dx + dy * dy);
      if (dist < 120) {
        ctx.strokeStyle = `rgba(0,212,255,${0.08 * (1 - dist / 120)})`;
        ctx.lineWidth = 0.5;
        ctx.beginPath();
        ctx.moveTo(particles[i].x, particles[i].y);
        ctx.lineTo(particles[j].x, particles[j].y);
        ctx.stroke();
      }
    }
  }

  requestAnimationFrame(drawBg);
}
drawBg();

// TYPEWRITER
const phrases = [
  'Backend Developer',
  'Systems Architect',
  'Aspiring SWE',
  'API Engineer',
  'Problem Solver',
];
let phraseIdx = 0, charIdx = 0, deleting = false, wait = 0;
const typeEl = document.getElementById('typewriter-text');
function typeLoop() {
  if (wait > 0) { wait--; setTimeout(typeLoop, 50); return; }
  const phrase = phrases[phraseIdx];
  if (!deleting) {
    charIdx++;
    typeEl.textContent = phrase.slice(0, charIdx);
    if (charIdx === phrase.length) { deleting = true; wait = 30; }
    setTimeout(typeLoop, 80);
  } else {
    charIdx--;
    typeEl.textContent = phrase.slice(0, charIdx);
    if (charIdx === 0) { deleting = false; phraseIdx = (phraseIdx + 1) % phrases.length; }
    setTimeout(typeLoop, 40);
  }
}
typeLoop();

// SCROLL FADE + METRIC BARS
const observer = new IntersectionObserver((entries) => {
  entries.forEach(e => {
    if (e.isIntersecting) {
      e.target.classList.add('appear');
      e.target.querySelectorAll('.metric-row').forEach(r => r.classList.add('appear'));
      observer.unobserve(e.target);
    }
  });
}, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });

document.querySelectorAll('.fade-in').forEach(el => observer.observe(el));

// ACTIVE NAV LINK
const sections = document.querySelectorAll('section[id], header[id]');
const navLinks = document.querySelectorAll('.nav-links a');
const navObs = new IntersectionObserver((entries) => {
  entries.forEach(e => {
    if (e.isIntersecting) {
      navLinks.forEach(l => l.style.color = '');
      const active = document.querySelector(`.nav-links a[href="#${e.target.id}"]`);
      if (active) active.style.color = 'var(--cyan)';
    }
  });
}, { threshold: 0.4 });
sections.forEach(s => navObs.observe(s));
