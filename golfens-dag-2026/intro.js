/* ============================================================
   GOLFENS DAG 2026 – intro.js v1.0
   Golfbold-intro: additiv, rører ikke eksisterende kode.
   ============================================================ */

(function () {
  'use strict';

  // ── Vis intro kun én gang pr. session ──
  const SESSION_KEY = 'gd2026_intro_shown';
  const already = sessionStorage.getItem(SESSION_KEY);

  // ── Reduced-motion check ──
  const reducedMotion = window.matchMedia &&
    window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  // ── Opret intro-container ──
  const overlay = document.createElement('div');
  overlay.id = 'gd-intro';
  overlay.setAttribute('aria-label', 'Intro-animation – Golfens Dag 2026');
  overlay.setAttribute('aria-live', 'polite');

  // ── CSS injiceres inline (ingen ekstra fil) ──
  const style = document.createElement('style');
  style.textContent = `
    #gd-intro {
      position: fixed;
      inset: 0;
      z-index: 9000;
      background: #0B3D2B;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      overflow: hidden;
      /* Safe-area: ingen tekst under notch */
      padding-top: env(safe-area-inset-top, 0px);
      padding-bottom: env(safe-area-inset-bottom, 0px);
    }
    #gd-intro.gd-fade-out {
      opacity: 0;
      transition: opacity 0.55s cubic-bezier(.4,0,.2,1);
      pointer-events: none;
    }

    /* ── Tekst ── */
    .gd-intro-text {
      position: relative;
      z-index: 10;
      text-align: center;
      pointer-events: none;
    }
    .gd-intro-eyebrow {
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Helvetica, Arial, sans-serif;
      font-size: clamp(.75rem, 3vw, .92rem);
      font-weight: 700;
      color: rgba(255,255,255,.5);
      letter-spacing: .2em;
      text-transform: uppercase;
      opacity: 0;
      transform: translateY(6px);
      transition: opacity .45s ease, transform .45s ease;
    }
    .gd-intro-eyebrow.show { opacity: 1; transform: none; }

    .gd-intro-title {
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Helvetica, Arial, sans-serif;
      font-size: clamp(2.4rem, 11vw, 4.5rem);
      font-weight: 900;
      color: #fff;
      letter-spacing: -.03em;
      line-height: 1.05;
      margin-top: .4rem;
      opacity: 0;
      transform: translateY(10px);
      transition: opacity .5s ease .18s, transform .5s ease .18s;
    }
    .gd-intro-title .accent { color: #C4973A; }
    .gd-intro-title.show { opacity: 1; transform: none; }

    /* ── Canvas (bolde) ── */
    #gd-canvas {
      position: absolute;
      inset: 0;
      width: 100%;
      height: 100%;
      pointer-events: none;
    }

    /* ── Skip-knap ── */
    #gd-skip {
      position: absolute;
      bottom: max(1.5rem, calc(env(safe-area-inset-bottom, 0px) + 1rem));
      right: 1.25rem;
      background: rgba(255,255,255,.08);
      border: 1px solid rgba(255,255,255,.18);
      border-radius: 99px;
      color: rgba(255,255,255,.55);
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Helvetica, Arial, sans-serif;
      font-size: .8rem;
      font-weight: 600;
      padding: .5rem 1rem;
      cursor: pointer;
      -webkit-tap-highlight-color: transparent;
      z-index: 20;
      opacity: 0;
      transition: opacity .3s ease .8s, background .15s;
      letter-spacing: .02em;
    }
    #gd-skip.visible { opacity: 1; }
    #gd-skip:active { background: rgba(255,255,255,.14); }
  `;
  document.head.appendChild(style);

  // ── Reduced motion: simpel fade ──
  if (already || reducedMotion) {
    if (already) return; // ingen intro
    // Reduced motion: simpel fade uden bolde
    overlay.innerHTML = `
      <div class="gd-intro-text">
        <div class="gd-intro-eyebrow" id="gd-ey">Velkommen til</div>
        <div class="gd-intro-title" id="gd-tt">Golfens <span class="accent">Dag</span></div>
      </div>
      <button id="gd-skip" aria-label="Spring intro over">Spring over</button>
    `;
    document.body.appendChild(overlay);
    sessionStorage.setItem(SESSION_KEY, '1');
    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        document.getElementById('gd-ey').classList.add('show');
        document.getElementById('gd-tt').classList.add('show');
        document.getElementById('gd-skip').classList.add('visible');
      });
    });
    const dismiss = () => {
      overlay.classList.add('gd-fade-out');
      overlay.addEventListener('transitionend', () => overlay.remove(), { once: true });
    };
    document.getElementById('gd-skip').addEventListener('click', dismiss);
    setTimeout(dismiss, 2000);
    return;
  }

  // ── Full animation ──
  overlay.innerHTML = `
    <canvas id="gd-canvas" aria-hidden="true"></canvas>
    <div class="gd-intro-text">
      <div class="gd-intro-eyebrow" id="gd-ey">Velkommen til</div>
      <div class="gd-intro-title" id="gd-tt">Golfens <span class="accent">Dag</span></div>
    </div>
    <button id="gd-skip" aria-label="Spring intro over">Spring over</button>
  `;
  document.body.appendChild(overlay);
  sessionStorage.setItem(SESSION_KEY, '1');

  const canvas = document.getElementById('gd-canvas');
  const ctx = canvas.getContext('2d');

  // ── Resize canvas ──
  function resize() {
    canvas.width  = window.innerWidth;
    canvas.height = window.innerHeight;
  }
  resize();
  window.addEventListener('resize', resize, { passive: true });

  // ── Tegn realistisk golfbold (dimples via Canvas) ──
  function drawBall(cx, cy, r, alpha, rotZ, lightX) {
    if (r < 1) return;
    ctx.save();
    ctx.globalAlpha = alpha;

    // Clip til bold
    ctx.beginPath();
    ctx.arc(cx, cy, r, 0, Math.PI * 2);
    ctx.clip();

    // Basis-hvid gradient (lys fra øverst-venstre)
    const lx = cx + lightX * r * 0.4;
    const ly = cy - r * 0.35;
    const grad = ctx.createRadialGradient(lx, ly, r * 0.05, cx, cy, r * 1.05);
    grad.addColorStop(0,    'rgba(255,255,255,1)');
    grad.addColorStop(0.35, 'rgba(240,240,238,1)');
    grad.addColorStop(0.7,  'rgba(210,212,208,1)');
    grad.addColorStop(1,    'rgba(170,175,168,1)');
    ctx.fillStyle = grad;
    ctx.fillRect(cx - r, cy - r, r * 2, r * 2);

    // Dimple-mønster (rotation via rotZ)
    const dimpleR = Math.max(1.5, r * 0.088);
    const dimpleShadow = `rgba(120,130,118,${Math.min(0.55, 0.35 + r * 0.003)})`;
    const dimpleLight  = `rgba(255,255,255,${Math.min(0.65, 0.4 + r * 0.002)})`;

    // 5 rækker af dimples
    const rows = [
      { y: -0.6, count: 5, xOff: 0 },
      { y: -0.25, count: 8, xOff: 0.2 },
      { y:  0.05, count: 9, xOff: 0 },
      { y:  0.35, count: 7, xOff: 0.15 },
      { y:  0.62, count: 4, xOff: 0 },
    ];

    ctx.save();
    ctx.translate(cx, cy);
    ctx.rotate(rotZ);

    rows.forEach(row => {
      const yPos = row.y * r;
      const rowR = Math.sqrt(Math.max(0, r * r - yPos * yPos));
      for (let i = 0; i < row.count; i++) {
        const angle = (i / row.count) * Math.PI * 2 + row.xOff;
        const xPos = Math.cos(angle) * rowR * 0.85;
        // Dimple: shadow rim
        ctx.beginPath();
        ctx.arc(xPos, yPos, dimpleR, 0, Math.PI * 2);
        ctx.fillStyle = dimpleShadow;
        ctx.fill();
        // Dimple: specular
        ctx.beginPath();
        ctx.arc(xPos - dimpleR * 0.3, yPos - dimpleR * 0.3, dimpleR * 0.55, 0, Math.PI * 2);
        ctx.fillStyle = dimpleLight;
        ctx.fill();
      }
    });
    ctx.restore();

    // Specular highlight
    const specGrad = ctx.createRadialGradient(lx - r*0.1, ly - r*0.1, r*0.02, lx, ly, r*0.45);
    specGrad.addColorStop(0, 'rgba(255,255,255,0.75)');
    specGrad.addColorStop(1, 'rgba(255,255,255,0)');
    ctx.fillStyle = specGrad;
    ctx.fillRect(cx - r, cy - r, r * 2, r * 2);

    // Ambient shadow under bold
    ctx.restore();
    ctx.save();
    ctx.globalAlpha = alpha * 0.22;
    const shadowGrad = ctx.createRadialGradient(cx + r*0.15, cy + r*0.95, r*0.1, cx + r*0.1, cy + r*0.9, r*0.7);
    shadowGrad.addColorStop(0, 'rgba(0,0,0,0.6)');
    shadowGrad.addColorStop(1, 'rgba(0,0,0,0)');
    ctx.fillStyle = shadowGrad;
    ctx.fillRect(cx - r, cy, r * 2.5, r * 1.2);
    ctx.restore();
  }

  // ── Definér bolde ──
  // Perspektivdybde: z 0=langt væk → 1=tæt på
  // Én bold er "WOW"-bolden der passerer tæt forbi
  const W = canvas.width, H = canvas.height;

  const balls = [
    // WOW-bold: starter lille, vokser STOR, passerer fra højre
    {
      id: 'wow',
      startZ: 0.0,  endZ: 1.3,   // over 1.0 = den skyder forbi
      startX: 0.72, endX: 1.1,   // fra midten-højre → ud af skærmen højre
      startY: 0.42, endY: 0.68,
      startT: 1.6,  endT: 3.0,   // tidsvindue i sekunder
      rot: 0, rotSpeed: 1.8,
      lightX: -0.3,
    },
    // Baggrund: lille bold, bevæger sig langsomt venstre → ind
    {
      id: 'b1',
      startZ: 0.08, endZ: 0.38,
      startX: 0.15, endX: 0.35,
      startY: 0.25, endY: 0.45,
      startT: 0.8,  endT: 2.8,
      rot: 0.5, rotSpeed: 0.6,
      lightX: 0.2,
    },
    // Mellemste bold, ovenfra-højre
    {
      id: 'b2',
      startZ: 0.05, endZ: 0.55,
      startX: 0.85, endX: 0.62,
      startY: 0.12, endY: 0.38,
      startT: 1.0,  endT: 2.9,
      rot: -0.3, rotSpeed: 0.9,
      lightX: -0.2,
    },
    // Lavere, langsom bold fra venstre
    {
      id: 'b3',
      startZ: 0.12, endZ: 0.42,
      startX: 0.05, endX: 0.28,
      startY: 0.72, endY: 0.60,
      startT: 1.2,  endT: 3.0,
      rot: 0.8, rotSpeed: 0.5,
      lightX: 0.3,
    },
    // Lille bold øverst i midten
    {
      id: 'b4',
      startZ: 0.04, endZ: 0.22,
      startX: 0.48, endX: 0.52,
      startY: 0.08, endY: 0.18,
      startT: 0.9,  endT: 2.5,
      rot: 0.2, rotSpeed: 0.4,
      lightX: 0.1,
    },
    // Bold fra højre-nedenfor, medium
    {
      id: 'b5',
      startZ: 0.06, endZ: 0.48,
      startX: 0.92, endX: 0.75,
      startY: 0.80, endY: 0.65,
      startT: 1.4,  endT: 3.1,
      rot: -0.6, rotSpeed: 0.7,
      lightX: -0.1,
    },
    // Bageste lille bold, venstre top
    {
      id: 'b6',
      startZ: 0.03, endZ: 0.18,
      startX: 0.22, endX: 0.30,
      startY: 0.10, endY: 0.20,
      startT: 1.0,  endT: 2.6,
      rot: 0.4, rotSpeed: 0.35,
      lightX: 0.25,
    },
  ];

  // ── Animation loop ──
  const totalDuration = 3400; // ms
  let startTime = null;
  let animFrame;
  let done = false;

  function easeInOut(t) {
    return t < 0.5 ? 2*t*t : -1+(4-2*t)*t;
  }

  function tick(ts) {
    if (!startTime) startTime = ts;
    const elapsed = ts - startTime;
    const t = elapsed / 1000; // sekunder

    // Ryd canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    const W = canvas.width, H = canvas.height;
    const maxR = Math.min(W, H) * 0.52; // WOW-boldens max-radius

    // Tegn bolde
    balls.forEach(b => {
      if (t < b.startT || t > b.endT + 0.3) return;

      const dur = b.endT - b.startT;
      const progress = Math.max(0, Math.min(1, (t - b.startT) / dur));
      const ease = easeInOut(progress);

      // Interpolér position og dybde
      const z = b.startZ + (b.endZ - b.startZ) * ease;

      // Radius: lineær ift. z
      let r;
      if (b.id === 'wow') {
        r = maxR * Math.min(z, 1.0);
      } else {
        r = maxR * 0.38 * z;
      }

      // Alpha: fade in ved start, fade out ved slut
      let alpha = 1;
      const fadeIn  = (t - b.startT) / 0.4;
      const fadeOut = (b.endT - t) / 0.5;
      if (fadeIn < 1)  alpha = Math.max(0, fadeIn);
      if (fadeOut < 1) alpha = Math.min(alpha, Math.max(0, fadeOut));

      // WOW-bold extra: fade out hurtigt når den er ude
      if (b.id === 'wow' && z > 1.0) {
        alpha = Math.max(0, 1 - (z - 1.0) * 4);
      }

      if (alpha < 0.01 || r < 2) return;

      const cx = (b.startX + (b.endX - b.startX) * ease) * W;
      const cy = (b.startY + (b.endY - b.startY) * ease) * H;

      // Rotation
      const rot = b.rot + t * b.rotSpeed;

      // Blur for depth (bolde meget langt væk)
      if (z < 0.12 && !b.id === 'wow') {
        ctx.filter = `blur(${Math.max(0, (0.12 - z) * 6)}px)`;
      } else {
        ctx.filter = 'none';
      }

      drawBall(cx, cy, r, alpha, rot, b.lightX);
      ctx.filter = 'none';
    });

    // Tekst-trigger
    if (t >= 0.3) document.getElementById('gd-ey')?.classList.add('show');
    if (t >= 0.6) document.getElementById('gd-tt')?.classList.add('show');
    if (t >= 0.8) document.getElementById('gd-skip')?.classList.add('visible');

    if (!done && elapsed < totalDuration) {
      animFrame = requestAnimationFrame(tick);
    } else if (!done) {
      done = true;
      dismiss();
    }
  }

  function dismiss() {
    done = true;
    if (animFrame) cancelAnimationFrame(animFrame);
    window.removeEventListener('resize', resize);
    overlay.classList.add('gd-fade-out');
    overlay.addEventListener('transitionend', () => {
      overlay.remove();
    }, { once: true });
  }

  // Start animation
  requestAnimationFrame(tick);

  // Skip-knap
  document.getElementById('gd-skip')?.addEventListener('click', dismiss);

})();

/* ============================================================
   MICRO-ANIMATION – "Klar til dit første slag?"
   Bruges ét sted i begynder-sektionen.
   Kaldes via: window.gdMicroBall(canvasEl, onComplete)
   ============================================================ */
window.gdMicroBall = function (canvas, onComplete) {
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  const W = canvas.width  = canvas.offsetWidth;
  const H = canvas.height = canvas.offsetHeight;

  const reducedMotion = window.matchMedia &&
    window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  if (reducedMotion) {
    if (onComplete) onComplete();
    return;
  }

  const maxR   = Math.min(W, H) * 0.38;
  const dur    = 1100; // ms
  let   start  = null;
  let   frame;

  function tick(ts) {
    if (!start) start = ts;
    const t    = (ts - start) / dur;
    const ease = t < 0.5 ? 2*t*t : -1+(4-2*t)*t;

    ctx.clearRect(0, 0, W, H);

    const z  = 0.08 + ease * 0.88;
    const r  = maxR * z;
    const cx = W * (0.72 - ease * 0.22); // høj-til-venstre
    const cy = H * (0.30 + ease * 0.38);
    const rot = t * 2.2;

    // Alpha: fade in + ud
    let alpha = 1;
    if (t < 0.2) alpha = t / 0.2;
    if (t > 0.75) alpha = (1 - t) / 0.25;
    alpha = Math.max(0, Math.min(1, alpha));

    // Blur far bolde
    ctx.filter = z < 0.15 ? `blur(${(0.15-z)*8}px)` : 'none';

    // Tegn bold (inline mini-version)
    if (r > 2 && alpha > 0.02) {
      ctx.save();
      ctx.globalAlpha = alpha;
      ctx.beginPath();
      ctx.arc(cx, cy, r, 0, Math.PI*2);
      ctx.clip();
      const lx = cx - r*0.28, ly = cy - r*0.32;
      const g = ctx.createRadialGradient(lx, ly, r*0.05, cx, cy, r*1.05);
      g.addColorStop(0,   '#fff');
      g.addColorStop(0.4, '#f0f0ee');
      g.addColorStop(0.75,'#d4d6d0');
      g.addColorStop(1,   '#aab0a8');
      ctx.fillStyle = g;
      ctx.fillRect(cx-r, cy-r, r*2, r*2);

      // Dimples (simplified)
      ctx.save();
      ctx.translate(cx, cy);
      ctx.rotate(rot);
      const dr = Math.max(1.2, r*0.09);
      for (let row = -2; row <= 2; row++) {
        const yy = row * r * 0.3;
        const rowR = Math.sqrt(Math.max(0, r*r - yy*yy)) * 0.8;
        const cnt = 4 + Math.abs(row);
        for (let i = 0; i < cnt; i++) {
          const ang = (i/cnt)*Math.PI*2 + row*0.4;
          const xx = Math.cos(ang)*rowR;
          ctx.beginPath();
          ctx.arc(xx, yy, dr, 0, Math.PI*2);
          ctx.fillStyle = 'rgba(110,120,108,0.45)';
          ctx.fill();
          ctx.beginPath();
          ctx.arc(xx-dr*0.3, yy-dr*0.3, dr*0.5, 0, Math.PI*2);
          ctx.fillStyle = 'rgba(255,255,255,0.55)';
          ctx.fill();
        }
      }
      ctx.restore();

      // Specular
      const sg = ctx.createRadialGradient(lx, ly, r*0.01, lx, ly, r*0.4);
      sg.addColorStop(0, 'rgba(255,255,255,0.7)');
      sg.addColorStop(1, 'rgba(255,255,255,0)');
      ctx.fillStyle = sg;
      ctx.fillRect(cx-r, cy-r, r*2, r*2);
      ctx.restore();
    }

    if (t < 1) {
      frame = requestAnimationFrame(tick);
    } else {
      ctx.clearRect(0, 0, W, H);
      if (onComplete) onComplete();
    }
  }

  frame = requestAnimationFrame(tick);
};
