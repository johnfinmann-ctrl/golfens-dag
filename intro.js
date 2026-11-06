/* ============================================================
   GOLFENS DAG 2027 – intro.js v2.0
   Ny velkomstskærm: golfbane-baggrund + canvas-bolde +
   tre budskaber + "KOM I GANG"-CTA.
   Additiv – rører ikke eksisterende app-kode.
   ============================================================ */
/* Fælles, godkendt Lyngbygaard Golf-bold (foto med logo) til alle canvas-bolde */
window.gdBallImg = window.gdBallImg || (function () {
  const i = new Image();
  i.decoding = 'async';
  i.src = 'assets/images/lyngbygaard-golfbold.webp?v=2.9.0';
  return i;
})();
/* Tegn bolden som billede: logoet følger boldens bevægelse (let svaj + parallakse) og får kugle-skygge */
window.gdDrawLogoBall = function (ctx, cx, cy, r, alpha, t, la) {
  const img = window.gdBallImg;
  if (!img || !img.complete || !img.naturalWidth || r < 1.5 || alpha < 0.02) return;
  const sway = Math.sin(t * 1.1) * 0.22;           // svaj omkring boldens akse
  const dx = Math.sin(t * 0.9) * r * 0.10;          // logoet "ruller" let på kuglen
  const dy = Math.cos(t * 0.7) * r * 0.06;
  ctx.save();
  ctx.globalAlpha = alpha;
  ctx.beginPath(); ctx.arc(cx, cy, r, 0, Math.PI * 2); ctx.clip();
  ctx.translate(cx + dx, cy + dy); ctx.rotate(sway);
  ctx.drawImage(img, -r * 1.1, -r * 1.1, r * 2.2, r * 2.2);
  ctx.setTransform(1, 0, 0, 1, 0, 0);
  ctx.restore();
  // kugle-skygge (perspektiv) – ændrer ikke logoets form
  ctx.save();
  ctx.globalAlpha = alpha;
  ctx.beginPath(); ctx.arc(cx, cy, r, 0, Math.PI * 2); ctx.clip();
  const lx = cx + Math.cos(la || 0) * r * 0.3, ly = cy - r * 0.32;
  const g = ctx.createRadialGradient(lx, ly, r * 0.45, cx, cy, r * 1.04);
  g.addColorStop(0, 'rgba(0,20,10,0)'); g.addColorStop(1, 'rgba(0,20,10,.34)');
  ctx.fillStyle = g; ctx.fillRect(cx - r, cy - r, r * 2, r * 2);
  ctx.restore();
};

(function () {
  'use strict';

  // v2.9.0: den nye velkomstanimation (velkomst.js) overtager; denne intro er bevaret dormant.
  if (window.GD_VELKOMST) return;

  // ── Session: vis kun første gang ──────────────────────────
  const SESSION_KEY = 'gd2027_intro_v1';
  if (sessionStorage.getItem(SESSION_KEY)) return;

  // ── Reduced-motion ────────────────────────────────────────
  const reducedMotion = window.matchMedia &&
    window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  // ── CSS (inline, ingen ekstra fil) ───────────────────────
  document.documentElement.classList.add('gd-intro-active');
  const style = document.createElement('style');
  style.textContent = `
    /* ─── Overlay ─── */
    #gd-intro {
      position: fixed; inset: 0; z-index: 9000;
      overflow: hidden;
      background: #0d2818;
      display: flex; flex-direction: column;
      align-items: center; justify-content: flex-end;
      padding-bottom: max(2rem, calc(env(safe-area-inset-bottom,0px) + 1.5rem));
    }

    /* ─── Baggrundsbillede ─── */
    #gd-intro-bg {
      position: absolute; inset: 0;
      background: #0d2818 center 40% / cover no-repeat;
      opacity: 0;
      transition: opacity .7s ease;
    }
    #gd-intro-bg.loaded { opacity: 1; }

    /* gradient: lys top → mørkere bund for CTA-læsbarhed */
    #gd-intro-bg::after {
      content: '';
      position: absolute; inset: 0;
      background: linear-gradient(
        to bottom,
        rgba(5,25,12,.18)  0%,
        rgba(5,25,12,.05) 35%,
        rgba(5,25,12,.05) 55%,
        rgba(5,25,12,.55) 78%,
        rgba(5,25,12,.82) 100%
      );
    }

    /* ─── Canvas (bolde) ─── */
    #gd-canvas {
      position: absolute; inset: 0;
      width: 100%; height: 100%;
      pointer-events: none; z-index: 2;
    }

    /* ─── Tekst-lag ─── */
    .gd-top {
      position: absolute; top: 0; left: 0; right: 0;
      display: flex; flex-direction: column; align-items: center;
      padding-top: max(1.1rem, calc(env(safe-area-inset-top,0px) + .8rem));
      z-index: 4; pointer-events: none;
    }
    .gd-logo-circle {
      width: 64px; height: 64px;
      border: 2px solid rgba(255,255,255,.55);
      border-radius: 50%;
      display: flex; align-items: center; justify-content: center;
      background: rgba(255,255,255,.08);
      backdrop-filter: blur(4px); -webkit-backdrop-filter: blur(4px);
      margin-bottom: .45rem;
      opacity: 0; transform: scale(.85);
      transition: opacity .5s ease, transform .5s ease;
    }
    .gd-logo-circle.show { opacity: 1; transform: none; }
    .gd-logo-circle svg { color: #fff; }

    .gd-logo-name {
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
      font-size: clamp(.6rem, 2.5vw, .78rem);
      font-weight: 700; letter-spacing: .2em;
      text-transform: uppercase; color: rgba(255,255,255,.82);
      text-shadow: 0 1px 6px rgba(0,0,0,.5);
      opacity: 0; transition: opacity .5s ease .2s;
    }
    .gd-logo-name.show { opacity: 1; }

    /* ─── Stor velkomsttekst ─── */
    .gd-headline {
      position: absolute; top: 50%; left: 0; right: 0;
      transform: translateY(-60%);
      text-align: center; z-index: 4; pointer-events: none;
      padding: 0 1rem;
    }
    .gd-welkom {
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
      font-size: clamp(.95rem, 4.4vw, 1.4rem); margin-top: .7rem;
      font-weight: 600; letter-spacing: .04em;
      color: #fff;
      text-shadow: 0 2px 10px rgba(0,0,0,.6);
      opacity: 0; transform: translateY(8px);
      transition: opacity .5s ease, transform .5s ease;
    }
    .gd-welkom.show { opacity: 1; transform: none; }

    .gd-title-golf {
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
      font-size: clamp(3.2rem, 15vw, 8rem);
      font-weight: 900; line-height: .95; letter-spacing: -.03em;
      /* Hvid, så titlen er læsbar på den mørkegrønne baggrund (tidl. #0d4a22,
         som kun var tænkt til et lyst foto). Justér ved evt. nyt baggrundsfoto. */
      color: #ffffff;
      text-shadow: 0 2px 0 rgba(0,0,0,.25), 0 4px 20px rgba(0,0,0,.4);
      opacity: 0; transform: translateY(10px);
      transition: opacity .5s ease .15s, transform .5s ease .15s;
    }
    .gd-title-golf.show { opacity: 1; transform: none; }

    .gd-title-dag {
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
      font-size: clamp(3.2rem, 15vw, 8rem);
      font-weight: 900; line-height: .95; letter-spacing: -.03em;
      color: #2a8a3a;
      text-shadow: 0 2px 0 rgba(255,255,255,.15), 0 4px 20px rgba(0,0,0,.35);
      opacity: 0; transform: translateY(10px);
      transition: opacity .5s ease .28s, transform .5s ease .28s;
    }
    .gd-title-dag.show { opacity: 1; transform: none; }

    /* ─── Tre budskaber ─── */
    .gd-bullets {
      position: relative; z-index: 4;
      display: flex; align-items: flex-start; justify-content: center;
      gap: 0; width: 100%; max-width: 500px;
      padding: 0 1rem; margin-bottom: 1rem;
      opacity: 0; transform: translateY(6px);
      transition: opacity .5s ease, transform .5s ease;
    }
    .gd-bullets.show { opacity: 1; transform: none; }

    .gd-bullet {
      flex: 1; text-align: center;
      padding: 0 .5rem;
      position: relative;
    }
    .gd-bullet + .gd-bullet::before {
      content: '';
      position: absolute; left: 0; top: 10%; bottom: 10%;
      width: 1px; background: rgba(255,255,255,.3);
    }
    .gd-bullet-icon {
      margin: 0 auto .35rem;
      color: rgba(255,255,255,.9);
      display: flex; align-items: center; justify-content: center;
    }
    .gd-bullet-icon svg { width: 28px; height: 28px; }
    .gd-bullet-title {
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
      font-size: clamp(.65rem, 2.5vw, .82rem);
      font-weight: 700; text-transform: uppercase;
      letter-spacing: .06em; color: #fff;
      text-shadow: 0 1px 6px rgba(0,0,0,.5);
    }
    .gd-bullet-sub {
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
      font-size: clamp(.58rem, 2vw, .72rem);
      color: rgba(255,255,255,.72);
      text-shadow: 0 1px 4px rgba(0,0,0,.5);
      margin-top: .15rem; line-height: 1.35;
    }

    /* ─── CTA ─── */
    #gd-cta {
      position: relative; z-index: 5;
      background: #2a8a3a;
      color: #fff;
      border: none; border-radius: 99px;
      padding: 1rem 2.4rem;
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
      font-size: clamp(1rem, 4vw, 1.2rem);
      font-weight: 800; letter-spacing: .04em;
      cursor: pointer; min-height: 56px; min-width: 240px;
      box-shadow: 0 4px 24px rgba(42,138,58,.45);
      -webkit-tap-highlight-color: transparent;
      opacity: 0; transform: translateY(8px);
      transition:
        opacity .5s ease,
        transform .5s ease,
        background .15s ease,
        box-shadow .15s ease;
    }
    #gd-cta.show { opacity: 1; transform: none; }
    #gd-cta:active {
      background: #1f6e2d;
      box-shadow: 0 2px 12px rgba(42,138,58,.3);
      transform: scale(.97);
    }

    /* ─── Skip (diskret) ─── */
    #gd-skip {
      position: absolute; top: max(1rem, calc(env(safe-area-inset-top,0px) + .5rem));
      right: 1rem; z-index: 6;
      background: none; border: none;
      color: rgba(255,255,255,.35);
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
      font-size: .72rem; font-weight: 600; letter-spacing: .05em;
      cursor: pointer; padding: .5rem;
      -webkit-tap-highlight-color: transparent;
      opacity: 0; transition: opacity .4s ease 2s;
    }
    #gd-skip.show { opacity: 1; }

    /* ─── Fade-out ─── */
    #gd-intro.fade-out {
      opacity: 0;
      transition: opacity .5s cubic-bezier(.4,0,.2,1);
      pointer-events: none;
    }

    /* ─── Diskret græs nederst (bag tekst og CTA) ─── */
    #gd-intro .gd-turf {
      position: absolute; left: 0; right: 0; bottom: 0; z-index: 1;
      height: clamp(84px, 15vh, 140px); pointer-events: none;
      background: none; opacity: .7;
    }
    #gd-intro .gd-turf::before { height: 80%; }
    #gd-intro .gd-turf::after  { height: 58%; }

    /* ─── Desktop: wider bullets, larger canvas area ─── */
    @media (min-width: 700px) {
      .gd-bullets { max-width: 640px; }
      .gd-bullet-icon svg { width: 34px; height: 34px; }
      #gd-cta { min-width: 300px; padding: 1.1rem 3rem; }
    }
  `;
  document.head.appendChild(style);

  // ── Build DOM ────────────────────────────────────────────
  const overlay = document.createElement('div');
  overlay.id = 'gd-intro';
  overlay.setAttribute('role', 'dialog');
  overlay.setAttribute('aria-modal', 'true');
  overlay.setAttribute('aria-label', 'Velkomst – Golfens Dag 2027');

  overlay.innerHTML = `
    <!-- Baggrundsbillede -->
    <div id="gd-intro-bg"></div>

    <div class="gd-turf" aria-hidden="true"></div>

    <!-- Canvas til golfbolde -->
    <canvas id="gd-canvas" aria-hidden="true"></canvas>

    <!-- Logo øverst -->
    <div class="gd-top">
      <div class="gd-logo-circle" id="gd-lc">
        <svg width="30" height="30" viewBox="0 0 24 24" fill="none"
             stroke="currentColor" stroke-width="1.8" stroke-linecap="round">
          <circle cx="9" cy="17" r="3"/>
          <line x1="16" y1="2" x2="16" y2="19"/>
          <path d="M16 2l5 3-5 3"/>
        </svg>
      </div>
      <div class="gd-logo-name" id="gd-ln">Lyngbygaard Golf</div>
    </div>

    <!-- Stor tekst -->
    <div class="gd-headline">
      <div class="gd-title-golf" id="gd-tf">GOLFENS</div>
      <div class="gd-title-dag" id="gd-td">DAG</div>
      <div class="gd-welkom" id="gd-wk">Velkommen til Lyngbygaard Golfklub</div>
    </div>

    <!-- Tre budskaber -->
    <div class="gd-bullets" id="gd-bl">
      <div class="gd-bullet">
        <div class="gd-bullet-icon">
          <svg fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round" viewBox="0 0 24 24">
            <circle cx="12" cy="8" r="4"/>
            <path d="M4 20c0-4 3.58-7 8-7s8 3 8 7"/>
          </svg>
        </div>
        <div class="gd-bullet-title">Prøv golf</div>
        <div class="gd-bullet-sub">helt uforpligtende</div>
      </div>
      <div class="gd-bullet">
        <div class="gd-bullet-icon">
          <svg fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round" viewBox="0 0 24 24">
            <circle cx="9"  cy="7" r="2.5"/>
            <circle cx="15" cy="7" r="2.5"/>
            <path d="M2 20c0-3.31 3.13-6 7-6"/>
            <path d="M22 20c0-3.31-3.13-6-7-6"/>
            <path d="M9 14c0 0 1.5-.5 3-.5s3 .5 3 .5"/>
          </svg>
        </div>
        <div class="gd-bullet-title">Fællesskab</div>
        <div class="gd-bullet-sub">og gode oplevelser</div>
      </div>
      <div class="gd-bullet">
        <div class="gd-bullet-icon">
          <svg fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round" viewBox="0 0 24 24">
            <circle cx="8"  cy="7" r="2"/>
            <circle cx="16" cy="7" r="2"/>
            <circle cx="12" cy="5" r="2.5"/>
            <path d="M4 20c0-2.5 2-4 4-4h8c2 0 4 1.5 4 4"/>
          </svg>
        </div>
        <div class="gd-bullet-title">For alle</div>
        <div class="gd-bullet-sub">børn, voksne &amp; seniorer</div>
      </div>
    </div>

    <!-- CTA -->
    <button id="gd-cta" aria-label="Kom i gang – åbn Golfens Dag">
      KOM I GANG &nbsp;→
    </button>

    <!-- Diskret skip -->
    <button id="gd-skip" aria-label="Spring intro over">Spring over</button>
  `;

  document.body.appendChild(overlay);

  // ── Helpers ──────────────────────────────────────────────
  const $ = id => document.getElementById(id);

  function show(id, delay = 0) {
    setTimeout(() => $( id )?.classList.add('show'), delay);
  }

  // ── Dismiss (CTA eller skip) ─────────────────────────────
  function dismiss() {
    sessionStorage.setItem(SESSION_KEY, '1');
    document.documentElement.classList.remove('gd-intro-active');
    document.dispatchEvent(new CustomEvent('gd:intro-closed'));
    overlay.classList.add('fade-out');
    overlay.addEventListener('transitionend', () => overlay.remove(), { once: true });
  }

  $('gd-cta').addEventListener('click', dismiss);
  $('gd-skip').addEventListener('click', dismiss);

  // ── Baggrund ─────────────────────────────────────────────
  // Indtil et rent, tekstfrit golffoto foreligger, bruges kun mørkegrøn baggrund.
  // Sæt INTRO_BG_SRC til fx 'assets/images/intro-bg.webp' når billedet er klar
  // (billedet må IKKE indeholde tekst, logo eller knapper). Husk at tilføje
  // filen til ASSETS i service-worker.js og bump versionen.
  const INTRO_BG_SRC = '';
  const bgEl = $('gd-intro-bg');
  if (INTRO_BG_SRC) {
    const bgImg = new Image();
    bgImg.onload  = () => { bgEl.style.backgroundImage = "url('" + INTRO_BG_SRC + "')"; bgEl.classList.add('loaded'); };
    bgImg.onerror = () => bgEl.classList.add('loaded');
    bgImg.src = INTRO_BG_SRC;
  } else {
    bgEl.classList.add('loaded');
  }

  // ── Tekst-timing ─────────────────────────────────────────
  show('gd-lc', 200);
  show('gd-ln', 350);
  show('gd-tf', 500);
  show('gd-td', 700);
  show('gd-wk', 900);
  show('gd-bl', 1300);
  show('gd-cta', 1700);
  show('gd-skip', 2000); // diskret, vises via CSS transition delay

  // ── Reduced motion: ingen bold-animation ─────────────────
  if (reducedMotion) return;

  // ── Canvas: golfbolde ─────────────────────────────────────
  const canvas = $('gd-canvas');
  const ctx    = canvas.getContext('2d');

  function resize() {
    canvas.width  = window.innerWidth;
    canvas.height = window.innerHeight;
  }
  resize();
  window.addEventListener('resize', resize, { passive: true });

  // ── Tegn golfbold (godkendt logo-bold) ───────────────────
  function drawBall(cx, cy, r, alpha, rot, lightAngle, t) {
    window.gdDrawLogoBall(ctx, cx, cy, r, alpha, t, lightAngle);
    if (r < 1.5 || alpha < 0.02) return;
    // blød skygge under bolden (som før)
    ctx.save();
    ctx.globalAlpha = alpha * 0.18;
    const sh = ctx.createRadialGradient(cx+r*.12, cy+r*.88, r*.06, cx+r*.08, cy+r*.82, r*.65);
    sh.addColorStop(0, 'rgba(0,0,0,.55)'); sh.addColorStop(1, 'rgba(0,0,0,0)');
    ctx.fillStyle = sh; ctx.fillRect(cx-r, cy+r*.5, r*2.5, r*1.2);
    ctx.restore();
  }

  // ── Definér bolde ────────────────────────────────────────
  // z: 0 = langt væk (lille), 1 = tæt på (stor). WOW-bold > 1.
  // Bolde bevæger sig i tidsvinduet [startT, endT] sekunder fra animation-start.
  // Animation stopper ved totalDur men velkomstskærmen BLIVER STÅENDE.
  const BALLS = [
    // Største bold: kommer frem øverst til venstre (holdes væk fra tekst og CTA)
    { id:'wow',  sZ:.10, eZ:1.0,  sX:.23, eX:.25,  sY:.34, eY:.20, sT:.8, eT:2.6, rot:0, rs:2.0,  la:-0.6 },
    // Baggrund øverst-midt
    { id:'b1',   sZ:.04, eZ:.26,  sX:.52, eX:.48,  sY:.06, eY:.18, sT:.7, eT:2.5, rot:.3, rs:.5,   la:-0.4 },
    // Stor bold højereside
    { id:'b2',   sZ:.06, eZ:.48,  sX:.95, eX:.82,  sY:.18, eY:.38, sT:1.0,eT:2.8, rot:-.2,rs:.85,  la: 0.2 },
    // Lille bold venstre midt
    { id:'b3',   sZ:.03, eZ:.24,  sX:.08, eX:.18,  sY:.42, eY:.55, sT:.9, eT:2.6, rot:.6, rs:.4,   la:-0.3 },
    // Mellemstor bold midt-bund
    { id:'b4',   sZ:.07, eZ:.42,  sX:.65, eX:.72,  sY:.72, eY:.62, sT:1.2,eT:2.9, rot:-.5,rs:.7,   la: 0.3 },
    // Lille bold højre top
    { id:'b5',   sZ:.03, eZ:.20,  sX:.88, eX:.92,  sY:.08, eY:.15, sT:.8, eT:2.4, rot:.4, rs:.35,  la:-0.1 },
    // Medium bold venstre top
    { id:'b6',   sZ:.05, eZ:.35,  sX:.05, eX:.12,  sY:.22, eY:.38, sT:1.1,eT:2.7, rot:.8, rs:.65,  la: 0.4 },
    // Bageste lille bold midt-højre
    { id:'b7',   sZ:.02, eZ:.17,  sX:.70, eX:.68,  sY:.14, eY:.24, sT:.6, eT:2.2, rot:.2, rs:.28,  la:-0.2 },
  ];

  const ANIM_DUR = 3200; // animation kører i 3.2 sek, overlay forbliver
  let   animStart = null;
  let   raf;
  let   animDone  = false;

  function ease(t) { return t<.5 ? 2*t*t : -1+(4-2*t)*t; }

  function tick(ts) {
    if (!animStart) animStart = ts;
    const elapsed = ts - animStart;
    const t = elapsed / 1000;

    ctx.clearRect(0, 0, canvas.width, canvas.height);
    const W = canvas.width, H = canvas.height;
    const maxR = Math.min(W, H) * 0.50; // basis for små bolde
    const wowR = Math.min(W, H) * 0.17;  // største bold: væsentligt reduceret, aldrig beskåret

    BALLS.forEach(b => {
      if (t < b.sT || t > b.eT + .35) return;
      const dur  = b.eT - b.sT;
      const prog = Math.max(0, Math.min(1, (t - b.sT) / dur));
      const e    = ease(prog);

      const z    = b.sZ + (b.eZ - b.sZ) * e;
      const r    = b.id === 'wow'
                     ? wowR * Math.min(z, 1.0)
                     : maxR * 0.36 * z;
      if (r < 1.5) return;

      // Alpha: fade in + fade out
      let alpha = 1;
      const fi = (t - b.sT)  / .45; if (fi < 1) alpha = Math.max(0, fi);
      const fo = (b.eT - t)  / .55; if (fo < 1) alpha = Math.min(alpha, Math.max(0, fo));
      
      if (alpha < .02) return;

      const cx  = (b.sX + (b.eX - b.sX) * e) * W;
      const cy  = (b.sY + (b.eY - b.sY) * e) * H;
      const rot = b.rot + t * b.rs;

      // Depth blur for very small balls
      if (z < .10) { ctx.filter = `blur(${((.10-z)/.10)*3}px)`; }
      else         { ctx.filter = 'none'; }

      drawBall(cx, cy, r, alpha, rot, b.la, t + b.rot * 3);
      ctx.filter = 'none';
    });

    if (!animDone && elapsed < ANIM_DUR) {
      raf = requestAnimationFrame(tick);
    } else {
      animDone = true;
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      // Overlay FORBLIVER – venter på CTA-klik
    }
  }

  // Start animation 0.5s efter DOM er klar
  setTimeout(() => { raf = requestAnimationFrame(tick); }, 500);

})();

/* ============================================================
   MICRO-ANIMATION (Begynder-siden)
   window.gdMicroBall(canvasEl, onComplete)
   ============================================================ */
window.gdMicroBall = function (canvas, onComplete) {
  if (!canvas) { if (onComplete) onComplete(); return; }
  const ctx = canvas.getContext('2d');
  const W   = canvas.width  = canvas.offsetWidth  || 300;
  const H   = canvas.height = canvas.offsetHeight || 160;

  const rm  = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (rm)   { if (onComplete) onComplete(); return; }

  const maxR  = Math.min(W, H) * 0.20;
  const dur   = 1100;
  let   start = null;
  let   frame;

  function drawMini(cx, cy, r, alpha, rot) {
    window.gdDrawLogoBall(ctx, cx, cy, r, alpha, rot * 2.2, -0.5);
  }

  function tick(ts) {
    if (!start) start = ts;
    const t    = Math.min((ts-start)/dur, 1);
    const ease = t<.5 ? 2*t*t : -1+(4-2*t)*t;
    ctx.clearRect(0,0,W,H);
    const z   = .35 + ease*.65;
    const r   = maxR * z;
    const cx  = W * (.9 - ease*.02);
    const cy  = H * (.62 - ease*.34);
    const rot = t * 2.2;
    let alpha = 1;
    if (t < .18) alpha = t/.18;
    if (t > .76) alpha = (1-t)/.24;
    alpha *= .95;
    alpha = Math.max(0,Math.min(1,alpha));
    ctx.filter = z < .15 ? `blur(${(.15-z)*6}px)` : 'none';
    drawMini(cx, cy, r, alpha, rot);
    ctx.filter = 'none';
    if (t < 1) { frame = requestAnimationFrame(tick); }
    else { ctx.clearRect(0,0,W,H); if (onComplete) onComplete(); }
  }
  frame = requestAnimationFrame(tick);
};
