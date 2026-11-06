/* ============================================================
   Golfens Dag 2027 – velkomst.js (v2.9.0, TESTVERSION)
   Ny velkomstanimation: bolden med Lyngbygaard Golf-logo ruller
   over green'en mod flaget (morgenlys-baggrund).
   - Bolden er en rigtig 3D-kugle (WebGL): dimples, lys, rotation
     og logo-decal følger overfladen. Ingen videofil.
   - Spilles kun én gang pr. session (nøgle gd2027_intro_v1).
   - "Spring over" + Esc. Respekterer prefers-reduced-motion.
   - Gammel intro (intro.js) ligger uændret og dormant; den
     slukkes af window.GD_VELKOMST (sat i index.html).
   ============================================================ */
(function () {
  'use strict';

  // ── CONFIG ───────────────────────────────────────────────
  const CONFIG = {
    SESSION_KEY: 'gd2027_intro_v1',
    BG_SRC: 'assets/images/velkomst-golfbane.webp?v=2.9.0',
    DECAL_SRC: 'assets/images/lyngbygaard-logo-decal.webp?v=2.9.0',
    FALLBACK_BALL_SRC: 'assets/images/lyngbygaard-golfbold.webp?v=2.9.0',
    BG_W: 1529, BG_H: 860,          // baggrundsbilledets pixelmål
    FLAG_BASE: [765, 628],          // hul/flagstangens fod i billedet
    FLAG_RECT: [758, 388, 790, 468],// flagdug + stang-top (x0,y0,x1,y1) i billedet
    FOCUS_Y: 560,                   // lodret fokus ved beskæring
    T_BG_FADE: 500,
    T_BALL_START: 350,
    T_BALL_END: 3900,
    T_TEXT: 2300,
    T_SKIP: 700,
    T_DISMISS: 5200,
    T_DISMISS_REDUCED: 3200,
    ROLL_EASE: 2.3,                 // ease-out-eksponent (bolden bremser naturligt)
    DEPTH_K: 2.2,                   // perspektiv: skærm-y → jordplan-afstand
    DIMPLES: 336
  };

  try { if (sessionStorage.getItem(CONFIG.SESSION_KEY)) return; } catch (e) {}
  if (document.getElementById('gd-intro')) return;

  const reduced = !!(window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches);

  // ── Session: markér straks (kun én afspilning pr. session) ─
  try { sessionStorage.setItem(CONFIG.SESSION_KEY, '1'); } catch (e) {}

  // ── CSS ──────────────────────────────────────────────────
  document.documentElement.classList.add('gd-intro-active');
  const style = document.createElement('style');
  style.textContent = `
    html.gd-intro-active, html.gd-intro-active body { overflow: hidden; }
    #gd-intro { position: fixed; inset: 0; z-index: 9000; overflow: hidden; background: #0d2818;
      opacity: 1; transition: opacity .6s ease; touch-action: none; }
    #gd-intro.out { opacity: 0; pointer-events: none; }
    #gd-intro .gdv-bg { position: absolute; max-width: none; opacity: 0; transition: opacity ${CONFIG.T_BG_FADE}ms ease; user-select: none; -webkit-user-drag: none; }
    #gd-intro .gdv-bg.on { opacity: 1; }
    #gd-intro .gdv-shadow { position: absolute; left: 0; top: 0; pointer-events: none; opacity: 0; will-change: transform;
      background:
        radial-gradient(ellipse 42% 46% at 50% 50%, rgba(6,20,8,.74) 0%, rgba(6,20,8,.42) 55%, rgba(6,20,8,0) 100%),
        radial-gradient(ellipse 50% 50% at 50% 50%, rgba(6,20,8,.30) 0%, rgba(6,20,8,0) 100%); }
    #gd-intro .gdv-ball { position: absolute; left: 0; top: 0; pointer-events: none; opacity: 0; will-change: transform; }
    #gd-intro .gdv-bg.on ~ .gdv-shadow, #gd-intro .gdv-bg.on ~ .gdv-ball { opacity: 1; }
    #gd-intro .gdv-title { position: absolute; left: 0; right: 0; top: clamp(26px, 11vh, 140px);
      margin: 0; padding: 0 1.25rem; text-align: center; text-wrap: balance;
      font-family: var(--font, 'Inter', system-ui, sans-serif); font-weight: 600;
      font-size: clamp(1.7rem, min(5.6vw, 8.5vh), 2.9rem); letter-spacing: .015em; line-height: 1.15; color: #0b3d2b;
      text-shadow: 0 0 26px rgba(255,244,214,.9), 0 1px 2px rgba(255,248,230,.7);
      opacity: 0; transform: translateY(10px); filter: blur(6px);
      transition: opacity 1.1s ease, transform 1.1s ease, filter 1.1s ease; }
    #gd-intro .gdv-title::after { content: ''; display: block; width: 56px; height: 2px; margin: .75rem auto 0; background: #C9A45C; }
    #gd-intro .gdv-title.show { opacity: 1; transform: none; filter: none; }
    #gd-intro .gdv-skip { position: absolute; right: max(1rem, env(safe-area-inset-right)); bottom: max(1rem, env(safe-area-inset-bottom));
      min-height: 44px; padding: 0 1.1rem; border-radius: 999px; border: 1px solid rgba(255,255,255,.35);
      background: rgba(8,40,26,.55); color: rgba(255,255,255,.92); font: 500 .85rem/1 var(--font, system-ui, sans-serif);
      letter-spacing: .02em; cursor: pointer; opacity: 0; transition: opacity .6s ease, background .2s ease;
      -webkit-backdrop-filter: blur(6px); backdrop-filter: blur(6px); -webkit-tap-highlight-color: transparent; }
    #gd-intro .gdv-skip.show { opacity: 1; }
    #gd-intro .gdv-skip:hover, #gd-intro .gdv-skip:focus-visible { background: rgba(8,40,26,.8); outline: 2px solid #C9A45C; outline-offset: 2px; }
    @media (prefers-reduced-motion: reduce) {
      #gd-intro .gdv-title { transform: none; filter: none; transition: opacity .8s ease; }
    }
  `;
  document.head.appendChild(style);

  // ── DOM ──────────────────────────────────────────────────
  const overlay = document.createElement('div');
  overlay.id = 'gd-intro';
  overlay.setAttribute('role', 'dialog');
  overlay.setAttribute('aria-label', 'Velkommen til Golfens Dag 2027');
  overlay.innerHTML =
    '<img class="gdv-bg" alt="" decoding="async" draggable="false">' +
    '<div class="gdv-shadow" aria-hidden="true"></div>' +
    '<p class="gdv-title">Prøv golf på Lyngbygaard</p>' +
    '<button type="button" class="gdv-skip" aria-label="Spring velkomstanimationen over">Spring over</button>';
  document.body.appendChild(overlay);

  const bgEl = overlay.querySelector('.gdv-bg');
  const shadowEl = overlay.querySelector('.gdv-shadow');
  const titleEl = overlay.querySelector('.gdv-title');
  const skipEl = overlay.querySelector('.gdv-skip');

  // ── Små matematik-hjælpere (3×3, række-major) ─────────────
  const clamp = (v, a, b) => Math.min(b, Math.max(a, v));
  const mmul = (A, B) => {
    const C = new Array(9);
    for (let r = 0; r < 3; r++) for (let c = 0; c < 3; c++)
      C[r * 3 + c] = A[r * 3] * B[c] + A[r * 3 + 1] * B[3 + c] + A[r * 3 + 2] * B[6 + c];
    return C;
  };
  const mT = (A) => [A[0], A[3], A[6], A[1], A[4], A[7], A[2], A[5], A[8]];
  const rod = (x, y, z, th) => {
    const c = Math.cos(th), s = Math.sin(th), t = 1 - c;
    return [t * x * x + c, t * x * y - s * z, t * x * z + s * y,
            t * x * y + s * z, t * y * y + c, t * y * z - s * x,
            t * x * z - s * y, t * y * z + s * x, t * z * z + c];
  };
  const IDENT = [1, 0, 0, 0, 1, 0, 0, 0, 1];

  // ── Layout (afhænger af viewport) ─────────────────────────
  const L = { vw: 0, vh: 0, s: 1, ox: 0, oy: 0, S: [0, 0], C: [0, 0], E: [0, 0], rS: 40, rE: 40, flag: null, side: 0, dpr: 1 };
  const STEPS = 480;
  let rotTab = null;          // orientering pr. stien-trin (række-major 3×3)

  function bez(p) {
    const q = 1 - p;
    return [q * q * L.S[0] + 2 * q * p * L.C[0] + p * p * L.E[0],
            q * q * L.S[1] + 2 * q * p * L.C[1] + p * p * L.E[1]];
  }
  const radiusAt = (p) => L.rS + (L.rE - L.rS) * (1 - Math.pow(1 - p, 1.6));

  function buildRotations() {
    // Rulning uden glidning: dθ = jordstrækning / radius, akse = op × retning.
    const delta = [IDENT.slice()];
    let cur = IDENT.slice();
    let prev = bez(0);
    for (let i = 1; i <= STEPS; i++) {
      const p = i / STEPS, pt = bez(p);
      const dx = pt[0] - prev[0], dy = pt[1] - prev[1];
      const vx = dx, vz = dy * CONFIG.DEPTH_K;          // jordplan (z mod beskueren)
      const dist = Math.hypot(vx, vz);
      if (dist > 1e-6) {
        const ax = vz, az = -vx, n = Math.hypot(ax, az);  // akse = (0,1,0) × (vx,0,vz)
        cur = mmul(rod(ax / n, 0, az / n, dist / radiusAt(p)), cur);
      }
      delta.push(cur);
      prev = pt;
    }
    // Slutorientering: logoet vender mod beskueren, let drejet mod flaget
    const target = mmul(rod(0, 1, 0, 0.10), rod(1, 0, 0, 0.05));
    const R0 = mmul(mT(delta[STEPS]), target);
    rotTab = delta.map(d => mmul(d, R0));
  }

  function layout() {
    const vw = overlay.clientWidth || window.innerWidth, vh = overlay.clientHeight || window.innerHeight;
    L.vw = vw; L.vh = vh;
    const s = Math.max(vw / CONFIG.BG_W, vh / CONFIG.BG_H);
    const W = CONFIG.BG_W * s, H = CONFIG.BG_H * s;
    const ox = clamp(vw / 2 - CONFIG.FLAG_BASE[0] * s, vw - W, 0);
    const oy = clamp(vh * 0.55 - CONFIG.FOCUS_Y * s, vh - H, 0);
    L.s = s; L.ox = ox; L.oy = oy;
    bgEl.style.width = W + 'px'; bgEl.style.height = H + 'px';
    bgEl.style.left = ox + 'px'; bgEl.style.top = oy + 'px';
    const F = [ox + CONFIG.FLAG_BASE[0] * s, oy + CONFIG.FLAG_BASE[1] * s];
    const fr = CONFIG.FLAG_RECT;
    L.flag = { x0: ox + fr[0] * s, y0: oy + fr[1] * s, x1: ox + fr[2] * s, y1: oy + fr[3] * s, baseX: F[0], baseY: F[1] };
    L.rE = clamp(Math.min(vw * 0.15, vh * 0.105), 38, 96);
    L.rS = L.rE * 1.35;
    L.E = [F[0] - 1.55 * L.rE, F[1] + 0.6 * L.rE];
    L.S = [-L.rS * 1.3, L.E[1] + 0.07 * vh];
    L.C = [L.E[0] * 0.6, L.S[1] + (L.E[1] - L.S[1]) * 0.1];
    L.dpr = Math.min(window.devicePixelRatio || 1, 2.5);
    L.side = Math.ceil(L.rS * 2 + 6);
    buildRotations();
    if (ball && ball.resize) ball.resize();
  }

  // ── Bold-rendering ────────────────────────────────────────
  let ball = null;      // { draw(p), resize(), el }

  const VERT = 'attribute vec2 a; void main(){ gl_Position = vec4(a, 0.0, 1.0); }';
  const FRAG = `
    precision highp float;
    uniform vec2 uRes; uniform float uRad; uniform mat3 uInv; uniform sampler2D uDecal;
    const float N = ${CONFIG.DIMPLES}.0;
    const float GA = 2.39996323;
    const vec3 LIGHT = vec3(0.50, 0.66, 0.56);
    vec3 fib(float i) {
      float z = 1.0 - (2.0 * i + 1.0) / N;
      float r = sqrt(max(1.0 - z * z, 0.0));
      float a = i * GA;
      return vec3(r * cos(a), r * sin(a), z);
    }
    void main() {
      vec2 q = (gl_FragCoord.xy - 0.5 * uRes) / uRad;
      float len = length(q);
      float edge = 1.0 - smoothstep(1.0 - 1.6 / uRad, 1.0, len);
      if (edge <= 0.0) { gl_FragColor = vec4(0.0); return; }
      float z = sqrt(max(1.0 - len * len, 0.0));
      vec3 n = normalize(vec3(q, max(z, 0.02)));
      vec3 p = uInv * n;

      // nærmeste dimple (Fibonacci-gitter, kun et lodret vindue testes)
      float ic = (1.0 - p.z) * 0.5 * N - 0.5;
      float i0 = floor(ic) - 40.0;
      float best = -2.0; vec3 cen = vec3(0.0, 0.0, 1.0);
      for (int k = 0; k < 81; k++) {
        float idx = clamp(i0 + float(k), 0.0, N - 1.0);
        vec3 f = fib(idx);
        float dd = dot(p, f);
        if (dd > best) { best = dd; cen = f; }
      }
      float ang = acos(clamp(best, -1.0, 1.0));
      const float R = 0.098;
      float u = ang / R;
      float inside = 1.0 - smoothstep(0.86, 1.0, u);
      float prof = (1.0 - u * u); prof = max(prof, 0.0);
      float slope = 4.0 * 0.016 * u * prof / R * inside;   // dh/dd
      vec3 tdir = normalize(p - cen * best + vec3(1e-5));
      vec3 pn = normalize(p - slope * tdir);                // forstyrret normal (lokal)
      // tilbage til view-rum: uInv er R^T, så R = transpose(uInv)
      vec3 nv = normalize(vec3(
        dot(pn, vec3(uInv[0][0], uInv[0][1], uInv[0][2])),
        dot(pn, vec3(uInv[1][0], uInv[1][1], uInv[1][2])),
        dot(pn, vec3(uInv[2][0], uInv[2][1], uInv[2][2]))));
      vec3 Ld = normalize(LIGHT);
      float form = 0.74 + 0.30 * clamp(dot(n, Ld) * 0.8 + 0.2, 0.0, 1.0);          // kugleform
      float det = (dot(nv, Ld) - dot(n, Ld)) * 0.70;                               // dimple-relief
      float ao = 1.0 - 0.16 * inside * prof;                                // dybde i skålen
      float shade = clamp((form + det) * ao, 0.0, 1.2);
      vec3 col = vec3(0.99, 0.985, 0.97) * shade;
      col *= vec3(1.0, 0.985, 0.955);                                              // varmt morgenlys
      col += vec3(-0.012, 0.016, -0.012) * smoothstep(0.0, -0.9, n.y);             // grønt tilbagekast
      col *= 1.0 - 0.14 * pow(1.0 - n.z, 2.2);                                     // kant

      // logo (decal, plan projektion på kuglens forside i lokalt rum)
      vec2 uv = vec2(0.4967 + p.x * 0.5218 / 0.88, 0.6457 - p.y * 1.0436 / 0.88);
      float fade = smoothstep(0.05, 0.40, p.z);
      vec4 d = texture2D(uDecal, uv);
      float a = d.a * fade;
      vec3 ink = d.rgb * clamp(shade * 0.96 + 0.04, 0.0, 1.1);
      col = mix(col, ink, a);

      // blank glans i dimples
      vec3 H = normalize(Ld + vec3(0.0, 0.0, 1.0));
      float spec = pow(max(dot(nv, H), 0.0), 70.0) * 0.34 * (1.0 - 0.7 * a);
      col += spec;
      col = clamp(col, 0.0, 1.0);
      gl_FragColor = vec4(col * edge, edge);
    }`;

  function makeGLBall(decalImg) {
    const canvas = document.createElement('canvas');
    canvas.className = 'gdv-ball';
    canvas.setAttribute('aria-hidden', 'true');
    const gl = canvas.getContext('webgl', { alpha: true, premultipliedAlpha: true, antialias: false, preserveDrawingBuffer: true });
    if (!gl) return null;
    function sh(type, src) {
      const o = gl.createShader(type); gl.shaderSource(o, src); gl.compileShader(o);
      if (!gl.getShaderParameter(o, gl.COMPILE_STATUS)) throw new Error(gl.getShaderInfoLog(o));
      return o;
    }
    let prog;
    try {
      prog = gl.createProgram();
      gl.attachShader(prog, sh(gl.VERTEX_SHADER, VERT));
      gl.attachShader(prog, sh(gl.FRAGMENT_SHADER, FRAG));
      gl.linkProgram(prog);
      if (!gl.getProgramParameter(prog, gl.LINK_STATUS)) throw new Error(gl.getProgramInfoLog(prog));
    } catch (e) { return null; }
    gl.useProgram(prog);
    const buf = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, buf);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 1, -1, -1, 1, 1, 1]), gl.STATIC_DRAW);
    const loc = gl.getAttribLocation(prog, 'a');
    gl.enableVertexAttribArray(loc);
    gl.vertexAttribPointer(loc, 2, gl.FLOAT, false, 0, 0);
    const tex = gl.createTexture();
    gl.bindTexture(gl.TEXTURE_2D, tex);
    gl.pixelStorei(gl.UNPACK_PREMULTIPLY_ALPHA_WEBGL, false);
    gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, decalImg);
    gl.generateMipmap(gl.TEXTURE_2D);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR_MIPMAP_LINEAR);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
    const uRes = gl.getUniformLocation(prog, 'uRes'), uRad = gl.getUniformLocation(prog, 'uRad'),
          uInv = gl.getUniformLocation(prog, 'uInv'), uDecal = gl.getUniformLocation(prog, 'uDecal');
    gl.uniform1i(uDecal, 0);
    gl.enable(gl.BLEND); gl.blendFunc(gl.ONE, gl.ONE_MINUS_SRC_ALPHA);

    const api = {
      el: canvas,
      resize() {
        const px = Math.round(L.side * L.dpr);
        canvas.width = px; canvas.height = px;
        canvas.style.width = L.side + 'px'; canvas.style.height = L.side + 'px';
        gl.viewport(0, 0, px, px);
      },
      draw(p) {
        const idx = clamp(Math.round(p * STEPS), 0, STEPS);
        const pos = bez(p), r = radiusAt(p);
        const R = rotTab[idx];
        gl.clearColor(0, 0, 0, 0); gl.clear(gl.COLOR_BUFFER_BIT);
        gl.uniform2f(uRes, canvas.width, canvas.height);
        gl.uniform1f(uRad, r * L.dpr);
        // R række-major → uploades som kolonne-major = R^T i GLSL (= uInv)
        gl.uniformMatrix3fv(uInv, false, new Float32Array(R));
        gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
        canvas.style.transform = 'translate3d(' + (pos[0] - L.side / 2) + 'px,' + (pos[1] - L.side / 2) + 'px,0)';
        placeShadow(pos, r);
      },
      destroy() { const e = gl.getExtension('WEBGL_lose_context'); if (e) e.loseContext(); }
    };
    return api;
  }

  // Reserve uden WebGL: det godkendte bold-billede (2D-rotation)
  function makeImgBall() {
    const img = document.createElement('img');
    img.className = 'gdv-ball'; img.alt = ''; img.src = CONFIG.FALLBACK_BALL_SRC; img.draggable = false;
    img.style.maxWidth = 'none';
    let ang = 0;
    return {
      el: img, resize() {},
      draw(p) {
        const pos = bez(p), r = radiusAt(p);
        // samlet drejning ≈ strækning / radius
        ang = (1 - Math.pow(1 - p, 1.0)) * (Math.hypot(L.E[0] - L.S[0], (L.E[1] - L.S[1]) * CONFIG.DEPTH_K) / ((L.rS + L.rE) / 2)) * 57.2958;
        img.style.width = img.style.height = (2 * r) + 'px';
        img.style.transform = 'translate3d(' + (pos[0] - r) + 'px,' + (pos[1] - r) + 'px,0) rotate(' + (ang - 80) + 'deg)';
        placeShadow(pos, r);
      }, destroy() {}
    };
  }

  function placeShadow(pos, r) {
    const w = r * 2.7, h = r * 0.78;
    shadowEl.style.width = w + 'px'; shadowEl.style.height = h + 'px';
    // lyset kommer fra øverst til højre → skyggen falder lidt mod venstre/foran
    shadowEl.style.transform = 'translate3d(' + (pos[0] - w / 2 - r * 0.22) + 'px,' + (pos[1] + r * 0.74 - h / 2) + 'px,0)';
  }

  // ── Dismiss ──────────────────────────────────────────────
  let done = false, rafId = 0;
  const timers = [];
  function later(fn, ms) { timers.push(setTimeout(fn, ms)); }
  function dismiss() {
    if (done) return; done = true;
    cancelAnimationFrame(rafId); timers.forEach(clearTimeout);
    window.removeEventListener('resize', onResize);
    document.removeEventListener('keydown', onKey);
    document.documentElement.classList.remove('gd-intro-active');
    document.dispatchEvent(new CustomEvent('gd:intro-closed'));
    overlay.classList.add('out');
    setTimeout(() => { if (ball && ball.destroy) ball.destroy(); overlay.remove(); style.remove(); }, 700);
  }
  function onKey(e) { if (e.key === 'Escape') dismiss(); }
  function onResize() { if (!done) { layout(); if (!playing && ball) ball.draw(reduced ? 1 : lastP); } }
  skipEl.addEventListener('click', dismiss);
  document.addEventListener('keydown', onKey);
  window.addEventListener('resize', onResize, { passive: true });

  // ── Afspilning ───────────────────────────────────────────
  let playing = false, lastP = 0, t0 = 0;

  function frame(now) {
    if (done) return;
    const t = now - t0;
    const u = clamp((t - CONFIG.T_BALL_START) / (CONFIG.T_BALL_END - CONFIG.T_BALL_START), 0, 1);
    lastP = 1 - Math.pow(1 - u, CONFIG.ROLL_EASE);
    ball.draw(lastP);
    if (u < 1) rafId = requestAnimationFrame(frame); else playing = false;
  }

  function start() {
    layout();
    bgEl.classList.add('on');
    overlay.insertBefore(ball.el, titleEl);
    t0 = performance.now();
    if (reduced) {
      ball.draw(1);
      later(() => titleEl.classList.add('show'), 250);
      later(() => skipEl.classList.add('show'), 400);
      later(dismiss, CONFIG.T_DISMISS_REDUCED);
    } else {
      ball.draw(0); playing = true;
      rafId = requestAnimationFrame(frame);
      later(() => titleEl.classList.add('show'), CONFIG.T_TEXT);
      later(() => skipEl.classList.add('show'), CONFIG.T_SKIP);
      later(dismiss, CONFIG.T_DISMISS);
    }
    window.gdVelkomst = {
      elapsed: () => performance.now() - t0,
      info: () => ({ vw: L.vw, vh: L.vh, flag: L.flag, end: { x: L.E[0], y: L.E[1], r: L.rE }, start: { x: L.S[0], y: L.S[1], r: L.rS }, webgl: !!(ball.el && ball.el.tagName === 'CANVAS') })
    };
  }

  // ── Indlæs billeder, derefter start ──────────────────────
  function loadImg(src) {
    return new Promise((res) => { const i = new Image(); i.onload = () => res(i); i.onerror = () => res(null); i.src = src; });
  }
  let begun = false;
  Promise.all([loadImg(CONFIG.BG_SRC), loadImg(CONFIG.DECAL_SRC)]).then(([bg, decal]) => {
    if (done || begun) return; begun = true;
    if (bg) bgEl.src = CONFIG.BG_SRC;
    let b = null;
    if (decal) { try { b = makeGLBall(decal); } catch (e) { b = null; } }
    ball = b || makeImgBall();
    start();
  });
  // sikkerhedsnet: hvis billederne aldrig kommer, må appen ikke hænge på intro
  later(() => { if (!begun) dismiss(); }, 9000);
})();
