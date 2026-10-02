/* ==========================================================================
   LOGO REVEAL - engine
   Canvas 2D, fully deterministic: render(t) always produces the same frame
   for the same time, so you can scrub / screenshot / record any moment.

   Design timeline (seconds, stretched by config.duration / 4.5):
     0.00-0.50  black, dust, faint centre light
     0.50-1.20  geometric construction lines + outline drawing, particles converge
     1.20-1.80  silhouette -> real logo revealed (focus pull)
     1.80-2.40  fully formed, first light sweep, glow, subtle depth
     2.40-3.00  micro camera zoom, calm particles
     3.00-3.60  final light sweep, particles pass, short flash
     3.60-4.50  everything settles; logo stays perfectly sharp & flat in the centre
   ========================================================================== */
(() => {
  'use strict';

  const CFG = window.REVEAL_CONFIG;
  const DATA = window.LOGO_CONTOURS;
  const DESIGN_DURATION = 4.5;
  const K = CFG.duration / DESIGN_DURATION;           // time stretch factor

  /* ------------------------------ helpers ------------------------------ */
  const clamp = (x, a = 0, b = 1) => Math.min(b, Math.max(a, x));
  const lerp = (a, b, t) => a + (b - a) * t;
  const smooth = (x) => { x = clamp(x); return x * x * x * (x * (x * 6 - 15) + 10); };
  const easeOutCubic = (x) => 1 - Math.pow(1 - clamp(x), 3);
  const easeInOutCubic = (x) => { x = clamp(x); return x < 0.5 ? 4 * x * x * x : 1 - Math.pow(-2 * x + 2, 3) / 2; };
  const easeInOutSine = (x) => -(Math.cos(Math.PI * clamp(x)) - 1) / 2;
  const win = (t, a, b) => clamp((t - a) / (b - a));
  const bump = (t, c, rise, fall) => (t < c ? smooth((t - c + rise) / rise) : 1 - smooth((t - c) / fall));
  const rng = (seed) => () => {                      // mulberry32
    seed |= 0; seed = (seed + 0x6D2B79F5) | 0;
    let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
  const hex = (h) => { h = h.replace('#', ''); return [0, 2, 4].map((i) => parseInt(h.slice(i, i + 2), 16)); };
  const rgba = (c, a) => `rgba(${c[0]},${c[1]},${c[2]},${a})`;
  const mk = (w, h) => { const c = document.createElement('canvas'); c.width = Math.max(1, w | 0); c.height = Math.max(1, h | 0); return c; };

  const COL = {
    bg: CFG.colors.background, line: hex(CFG.colors.line), particle: hex(CFG.colors.particle),
    glow: hex(CFG.colors.glow), sweep: hex(CFG.colors.sweep), flash: hex(CFG.colors.flash)
  };

  /* ------------------------------ state ------------------------------ */
  const canvas = document.getElementById('stage');
  const TRANSPARENT = CFG.transparent || new URLSearchParams(location.search).get('transparent') === '1';
  if (TRANSPARENT) document.documentElement.classList.add('transparent');
  const ctx = canvas.getContext('2d', { alpha: TRANSPARENT });
  const hintEl = document.getElementById('hint');
  const S = {};                                      // everything size-dependent
  let img = null;
  let tDesign = 0;                                   // current design time
  let playing = true, ended = false, paused = false;
  let lastPerf = 0;
  const audio = new window.AudioFX(CFG);

  /* ------------------- image resampling (high quality) ------------------- */
  function resample(src, w, h) {
    let cur = src, cw = src.width, ch = src.height;
    while (cw / 2 >= w && ch / 2 >= h) {
      const nw = Math.max(w, Math.floor(cw / 2)), nh = Math.max(h, Math.floor(ch / 2));
      const c = mk(nw, nh), x = c.getContext('2d');
      x.imageSmoothingEnabled = true; x.imageSmoothingQuality = 'high';
      x.drawImage(cur, 0, 0, nw, nh);
      cur = c; cw = nw; ch = nh;
    }
    const out = mk(w, h), x = out.getContext('2d');
    x.imageSmoothingEnabled = true; x.imageSmoothingQuality = 'high';
    x.drawImage(cur, 0, 0, w, h);
    return out;
  }

  function tinted(white, fill) {                     // same shape, new colour
    const c = mk(white.width, white.height), x = c.getContext('2d');
    x.drawImage(white, 0, 0);
    x.globalCompositeOperation = 'source-in';
    x.fillStyle = fill; x.fillRect(0, 0, c.width, c.height);
    return c;
  }

  function makeHalo(white, blurPx, pad) {
    const c = mk(white.width + pad * 2, white.height + pad * 2), x = c.getContext('2d');
    if ('filter' in x) {
      x.filter = `blur(${blurPx}px)`; x.drawImage(white, pad, pad); x.filter = 'none';
    } else {                                         // fallback for browsers without ctx.filter
      const f = Math.max(2, Math.round(blurPx));
      const sm = mk(Math.ceil(c.width / f), Math.ceil(c.height / f));
      sm.getContext('2d').drawImage(white, pad / f, pad / f, white.width / f, white.height / f);
      x.imageSmoothingQuality = 'high'; x.drawImage(sm, 0, 0, c.width, c.height);
    }
    x.globalCompositeOperation = 'source-in';
    x.fillStyle = rgba(COL.glow, 1); x.fillRect(0, 0, c.width, c.height);
    return c;
  }

  function sprite(size, stops, color) {
    const c = mk(size, size), x = c.getContext('2d');
    const g = x.createRadialGradient(size / 2, size / 2, 0, size / 2, size / 2, size / 2);
    stops.forEach(([o, a]) => g.addColorStop(o, rgba(color, a)));
    x.fillStyle = g; x.fillRect(0, 0, size, size);
    return c;
  }

  /* ------------------------------ build ------------------------------ */
  function build() {
    const dpr = Math.min(window.devicePixelRatio || 1, CFG.maxDpr);
    const W = Math.round(window.innerWidth * dpr), H = Math.round(window.innerHeight * dpr);
    canvas.width = W; canvas.height = H;
    Object.assign(S, { dpr, W, H });

    const aspect = img.width / img.height;
    const lh0 = Math.min(H * CFG.logo.heightFraction, (W * CFG.logo.maxWidthFraction) / aspect);
    const maxZoom = 1 + CFG.camera.zoom;
    let cw = Math.round(lh0 * aspect * maxZoom), ch = Math.round(lh0 * maxZoom);
    if ((W - cw) % 2) cw++;                          // keep the final frame pixel-aligned
    if ((H - ch) % 2) ch++;
    S.maxZoom = maxZoom; S.cw = cw; S.ch = ch;
    S.lw = cw / maxZoom; S.lh = ch / maxZoom;        // logo size in world units (zoom = 1)

    // --- logo caches (rendered once, at the largest size the camera will ever need)
    S.white = resample(img, cw, ch);
    const face = tinted(S.white, '#fff');
    {
      const x = face.getContext('2d');
      x.globalCompositeOperation = 'source-in';
      const g = x.createLinearGradient(0, 0, 0, ch);
      g.addColorStop(0, CFG.colors.logoTop); g.addColorStop(1, CFG.colors.logoBottom);
      x.fillStyle = g; x.fillRect(0, 0, cw, ch);
    }
    S.face = face;
    S.tones = ['#16181c', '#33373e', '#737985'].map((c) => tinted(S.white, c));
    S.tmp = mk(cw, ch); S.tmp2 = mk(cw, ch);
    S.pad = Math.round(cw * 0.32);
    S.haloWide = makeHalo(S.white, cw * 0.075, S.pad);
    S.haloTight = makeHalo(S.white, cw * 0.018, S.pad);

    S.spSoft = sprite(64, [[0, 1], [0.25, 0.5], [1, 0]], COL.particle);
    S.spSharp = sprite(32, [[0, 1], [0.35, 0.85], [0.55, 0.2], [1, 0]], COL.particle);
    S.spHead = sprite(64, [[0, 1], [0.2, 0.55], [1, 0]], COL.line);

    // --- vignette (does not touch the logo area)
    S.vig = mk(W, H);
    {
      const x = S.vig.getContext('2d'), r = Math.hypot(W, H) / 2;
      const g = x.createRadialGradient(W / 2, H / 2, r * 0.55, W / 2, H / 2, r);
      g.addColorStop(0, 'rgba(0,0,0,0)'); g.addColorStop(1, 'rgba(0,0,0,0.65)');
      x.fillStyle = g; x.fillRect(0, 0, W, H);
    }

    buildGeometry();
    buildParticles();
  }

  /* ------------------------- contours & geometry ------------------------- */
  function buildGeometry() {
    const { lw, lh } = S;
    S.ring = { x: (DATA.meta.ring.cx - 0.5) * lw, y: (DATA.meta.ring.cy - 0.5) * lh, r: DATA.meta.ring.r * lw };

    const paths = DATA.paths.map((pts) => {
      const P = pts.map(([u, v]) => [(u - 0.5) * lw, (v - 0.5) * lh]);
      P.push(P[0]);
      const len = [0];
      for (let i = 1; i < P.length; i++) len.push(len[i - 1] + Math.hypot(P[i][0] - P[i - 1][0], P[i][1] - P[i - 1][1]));
      const cx = P.reduce((a, p) => a + p[0], 0) / P.length, cy = P.reduce((a, p) => a + p[1], 0) / P.length;
      return { P, len, total: len[len.length - 1], d: Math.hypot(cx, cy) };
    });
    // inner shapes first, outer ring last
    const order = paths.map((p, i) => i).sort((a, b) => paths[a].d - paths[b].d);
    order.forEach((idx, rank) => { paths[idx].ts = 0.55 + (rank / Math.max(1, paths.length - 1)) * 0.42; });
    S.paths = paths;
  }

  function pointOnPaths(s) {                         // point at distance s along all paths
    for (const p of S.paths) {
      if (s <= p.total) {
        for (let i = 1; i < p.len.length; i++) {
          if (p.len[i] >= s) {
            const f = (s - p.len[i - 1]) / (p.len[i] - p.len[i - 1] || 1);
            return [lerp(p.P[i - 1][0], p.P[i][0], f), lerp(p.P[i - 1][1], p.P[i][1], f)];
          }
        }
      }
      s -= p.total;
    }
    return [0, 0];
  }

  /* ------------------------------ particles ------------------------------ */
  function buildParticles() {
    const { W, H, lw, lh, dpr } = S;
    const R = rng(7);

    S.dust = Array.from({ length: CFG.particles.ambient }, () => {
      const z = R();
      return {
        u: R(), v: R(), z,
        vx: (R() - 0.5) * 16 * (0.4 + z) * dpr, vy: -(3 + R() * 10) * (0.4 + z) * dpr,
        ph: R() * 6.28, f: 0.6 + R() * 1.4, a: 0.18 + R() * 0.5, s: 0.7 + R() * 1.2
      };
    });

    const total = S.paths.reduce((a, p) => a + p.total, 0);
    const N = CFG.particles.formation;
    S.form = Array.from({ length: N }, (_, i) => {
      const [tx, ty] = pointOnPaths(((i + R() * 0.8) / N) * total);
      const ang = R() * Math.PI * 2, rad = (0.75 + R() * 0.95) * lh;
      const ta = 1.05 + R() * 0.75, dur = 0.5 + R() * 0.4;
      return {
        sx: Math.cos(ang) * rad * (W / H > 1 ? 1.25 : 0.9), sy: Math.sin(ang) * rad,
        tx, ty, ta, dur, curl: (R() - 0.5) * 0.5, w: 0.6 + R() * 0.9, a: 0.5 + R() * 0.5
      };
    });

    const M = CFG.particles.pass;
    S.pass = Array.from({ length: M }, () => {
      const near = R() < 0.25;
      return {
        t0: 2.95 + R() * 0.5, spd: (near ? 1.5 : 0.9) * (0.8 + R() * 0.5),
        y: (R() - 0.5) * 1.15 * lh, wob: (R() - 0.5) * 0.12 * lh, wf: 2 + R() * 3,
        near, a: near ? 0.35 : 0.5 + R() * 0.5, w: near ? 2.2 : 0.7 + R() * 0.9
      };
    });
  }

  /* ------------------------------ drawing ------------------------------ */
  const sprites = (x, y, size, a, sp) => {
    ctx.globalAlpha = clamp(a);
    ctx.drawImage(sp, x - size / 2, y - size / 2, size, size);
  };

  function drawDust(t, zoom) {
    const { W, H, dpr } = S;
    const appear = smooth(t / 0.7) * lerp(1, 0.4, smooth(win(t, 3.6, 4.5)));
    if (appear <= 0) return;
    const spanX = W * 1.2, spanY = H * 1.2;
    ctx.globalCompositeOperation = 'lighter';
    for (const p of S.dust) {
      let x = ((p.u * spanX + p.vx * t) % spanX + spanX) % spanX - spanX / 2;
      let y = ((p.v * spanY + p.vy * t) % spanY + spanY) % spanY - spanY / 2;
      const zs = 1 + (zoom - 1) * (0.5 + p.z * 1.5);   // parallax
      x *= zs; y *= zs;
      const blur = Math.abs(p.z - 0.55) * 2;           // depth-of-field
      const tw = 0.55 + 0.45 * Math.sin(t * p.f + p.ph);
      const size = p.s * dpr * (2.2 + blur * 5);
      sprites(x, y, size, p.a * tw * appear / (1 + blur * 2.2), blur > 0.55 ? S.spSoft : S.spSharp);
    }
    ctx.globalAlpha = 1; ctx.globalCompositeOperation = 'source-over';
  }

  function drawCentreGlow(t) {
    const g = CFG.glow.intensity;
    let a = 0.05 * smooth(win(t, 0.05, 0.5)) + 0.10 * smooth(win(t, 0.5, 1.4));
    a *= 1 - 0.65 * smooth(win(t, 2.0, 3.0));
    a *= g;
    if (a <= 0.001) return;
    const R = S.lh * 0.62;
    const gr = ctx.createRadialGradient(0, 0, 0, 0, 0, R);
    gr.addColorStop(0, rgba(COL.glow, a)); gr.addColorStop(0.4, rgba(COL.glow, a * 0.33)); gr.addColorStop(1, rgba(COL.glow, 0));
    ctx.globalCompositeOperation = 'lighter';
    ctx.fillStyle = gr; ctx.fillRect(-R, -R, R * 2, R * 2);
    ctx.globalCompositeOperation = 'source-over';
  }

  function drawConstruction(t, zoom) {
    const env = smooth(win(t, 0.45, 0.7)) * (1 - smooth(win(t, 1.5, 2.0)));
    if (env <= 0.002) return;
    const { ring } = S, dpr = S.dpr, lwid = (dpr * 1.1) / zoom;
    ctx.globalCompositeOperation = 'lighter';
    ctx.lineCap = 'round';

    // ring drawn from the top, both directions
    const pr = easeInOutCubic(win(t, 0.5, 1.25));
    const sweepA = pr * Math.PI;
    if (pr > 0) {
      ctx.strokeStyle = rgba(COL.line, 0.5 * env); ctx.lineWidth = lwid;
      ctx.beginPath(); ctx.arc(ring.x, ring.y, ring.r * 1.0, -Math.PI / 2 - sweepA, -Math.PI / 2 + sweepA); ctx.stroke();
      ctx.strokeStyle = rgba(COL.line, 0.08 * env); ctx.lineWidth = lwid * 4;
      ctx.beginPath(); ctx.arc(ring.x, ring.y, ring.r * 1.0, -Math.PI / 2 - sweepA, -Math.PI / 2 + sweepA); ctx.stroke();
      // inner faint ring
      const pr2 = easeInOutCubic(win(t, 0.65, 1.35));
      ctx.strokeStyle = rgba(COL.line, 0.16 * env); ctx.lineWidth = lwid * 0.8;
      ctx.beginPath(); ctx.arc(ring.x, ring.y, ring.r * 0.86, -Math.PI / 2 - pr2 * Math.PI, -Math.PI / 2 + pr2 * Math.PI); ctx.stroke();

      // tick marks that appear as the arc passes
      ctx.strokeStyle = rgba(COL.line, 0.38 * env); ctx.lineWidth = lwid * 0.9;
      ctx.beginPath();
      for (let i = 0; i < 72; i++) {
        const a = (i / 72) * Math.PI * 2;                // 0 = top, clockwise
        const dAng = Math.min(a, Math.PI * 2 - a);
        if (dAng > sweepA) continue;
        const major = i % 18 === 0, r0 = ring.r * 1.03, r1 = ring.r * (major ? 1.075 : 1.05);
        const sx = Math.sin(a), sy = -Math.cos(a);
        ctx.moveTo(ring.x + sx * r0, ring.y + sy * r0); ctx.lineTo(ring.x + sx * r1, ring.y + sy * r1);
      }
      ctx.stroke();

      // bright heads
      if (pr < 1) for (const sgn of [-1, 1]) {
        const a = sgn * sweepA;
        sprites(ring.x + Math.sin(a) * ring.r, ring.y - Math.cos(a) * ring.r, 16 * dpr / zoom, 0.7 * env, S.spHead);
      }
      ctx.globalAlpha = 1;
    }

    // axes + diagonals expanding from the centre
    const pa = easeOutCubic(win(t, 0.55, 1.15));
    const axis = (dx, dy, len, alpha, w) => {
      const L = len * pa;
      if (L <= 0) return;
      const g = ctx.createLinearGradient(-dx * L, -dy * L, dx * L, dy * L);
      g.addColorStop(0, rgba(COL.line, 0)); g.addColorStop(0.5, rgba(COL.line, alpha * env)); g.addColorStop(1, rgba(COL.line, 0));
      ctx.strokeStyle = g; ctx.lineWidth = w;
      ctx.beginPath(); ctx.moveTo(-dx * L, -dy * L); ctx.lineTo(dx * L, dy * L); ctx.stroke();
    };
    axis(0, 1, ring.r * 1.12, 0.55, lwid);
    axis(1, 0, ring.r * 1.12, 0.45, lwid);
    const d = Math.SQRT1_2;
    axis(d, d, ring.r * 0.9, 0.18, lwid * 0.8);
    axis(d, -d, ring.r * 0.9, 0.18, lwid * 0.8);
    ctx.globalCompositeOperation = 'source-over';
  }

  function drawContours(t, zoom) {
    const alphaOut = 1 - smooth(win(t, 1.65, 2.15));
    if (alphaOut <= 0.002 || t < 0.5) return;
    const lwid = (S.dpr * 1.15) / zoom;
    ctx.globalCompositeOperation = 'lighter';
    ctx.lineJoin = 'round'; ctx.lineCap = 'round';
    for (const p of S.paths) {
      const prog = easeInOutCubic(win(t, p.ts, p.ts + 0.6));
      if (prog <= 0) continue;
      const target = p.total * prog;
      let hx = p.P[0][0], hy = p.P[0][1];
      ctx.beginPath(); ctx.moveTo(hx, hy);
      for (let i = 1; i < p.P.length; i++) {
        if (p.len[i] <= target) { hx = p.P[i][0]; hy = p.P[i][1]; ctx.lineTo(hx, hy); }
        else {
          const f = (target - p.len[i - 1]) / (p.len[i] - p.len[i - 1] || 1);
          hx = lerp(p.P[i - 1][0], p.P[i][0], f); hy = lerp(p.P[i - 1][1], p.P[i][1], f);
          ctx.lineTo(hx, hy); break;
        }
      }
      ctx.strokeStyle = rgba(COL.line, 0.10 * alphaOut); ctx.lineWidth = lwid * 4.5; ctx.stroke();
      ctx.strokeStyle = rgba(COL.line, 0.9 * alphaOut); ctx.lineWidth = lwid; ctx.stroke();
      if (prog < 1) sprites(hx, hy, 12 * S.dpr / zoom, 0.75, S.spHead);
    }
    ctx.globalAlpha = 1; ctx.globalCompositeOperation = 'source-over';
  }

  function drawHalo(t) {
    let h = smooth(win(t, 1.5, 2.4));
    h *= lerp(1, 0.6, smooth(win(t, 3.6, 4.5)));
    h = h * 0.42 + 0.22 * bump(t, 3.56, 0.25, 0.7);
    h *= CFG.glow.intensity;
    if (h <= 0.002) return;
    const { lw, lh, pad, maxZoom } = S;
    const p = pad / maxZoom, w = lw + p * 2, hh = lh + p * 2;
    ctx.globalCompositeOperation = 'lighter';
    ctx.globalAlpha = clamp(h * 0.55); ctx.drawImage(S.haloWide, -lw / 2 - p, -lh / 2 - p, w, hh);
    ctx.globalAlpha = clamp(h * 0.45); ctx.drawImage(S.haloTight, -lw / 2 - p, -lh / 2 - p, w, hh);
    ctx.globalAlpha = 1; ctx.globalCompositeOperation = 'source-over';
  }

  function drawDepth(t, yaw) {
    const depth = smooth(win(t, 1.6, 2.4)) * (1 - smooth(win(t, 3.4, 4.5)));
    if (depth <= 0.002 || CFG.depth.layers < 1) return;
    const { lw, lh, dpr } = S, n = CFG.depth.layers, th = CFG.depth.thickness * dpr * depth;
    ctx.globalAlpha = smooth(win(t, 1.7, 2.1));
    for (let i = n; i >= 1; i--) {
      const k = i / n, off = th * k;
      const tone = S.tones[k > 0.66 ? 0 : k > 0.33 ? 1 : 2];
      ctx.drawImage(tone, -lw / 2 + off * (0.4 + 0.9 * yaw), -lh / 2 + off * 0.55, lw, lh);
    }
    ctx.globalAlpha = 1;
  }

  function drawFace(t) {
    const { lw, lh, cw, ch, maxZoom, dpr } = S;
    if (t < 1.25) return;
    ctx.imageSmoothingEnabled = true; ctx.imageSmoothingQuality = 'high';

    // silhouette ghost before the real reveal
    const rv = win(t, 1.4, 1.85);
    if (rv < 1) {
      ctx.globalAlpha = 0.07 * smooth(win(t, 1.25, 1.45));
      ctx.drawImage(S.white, -lw / 2, -lh / 2, lw, lh);
      ctx.globalAlpha = 1;
    }
    if (rv <= 0) return;
    if (rv >= 1) { ctx.drawImage(S.face, -lw / 2, -lh / 2, lw, lh); return; }

    // radial wipe reveal with a focus pull (blur -> sharp)
    const e = easeInOutCubic(rv);
    const maxR = Math.hypot(cw, ch) / 2, soft = ch * 0.22;
    const Rc = e * (maxR + soft);
    const tx = S.tmp.getContext('2d');
    tx.globalCompositeOperation = 'copy'; tx.drawImage(S.face, 0, 0);
    tx.globalCompositeOperation = 'destination-in';
    let g = tx.createRadialGradient(cw / 2, ch / 2, Math.max(0, Rc - soft), cw / 2, ch / 2, Math.max(1, Rc));
    g.addColorStop(0, 'rgba(0,0,0,1)'); g.addColorStop(1, 'rgba(0,0,0,0)');
    tx.fillStyle = g; tx.fillRect(0, 0, cw, ch);
    tx.globalCompositeOperation = 'source-over';

    const blur = Math.pow(1 - rv, 1.6) * 5 * dpr;
    if (blur > 0.3 && 'filter' in ctx) ctx.filter = `blur(${blur.toFixed(2)}px)`;
    ctx.drawImage(S.tmp, -lw / 2, -lh / 2, lw, lh);
    ctx.filter = 'none';

    // bright rim travelling with the wipe edge
    const t2 = S.tmp2.getContext('2d');
    t2.globalCompositeOperation = 'copy'; t2.drawImage(S.white, 0, 0);
    t2.globalCompositeOperation = 'destination-in';
    g = t2.createRadialGradient(cw / 2, ch / 2, Math.max(0, Rc - soft * 1.2), cw / 2, ch / 2, Math.max(1, Rc + soft * 0.1));
    g.addColorStop(0, 'rgba(0,0,0,0)'); g.addColorStop(0.75, 'rgba(0,0,0,0.9)'); g.addColorStop(1, 'rgba(0,0,0,0)');
    t2.fillStyle = g; t2.fillRect(0, 0, cw, ch);
    t2.globalCompositeOperation = 'source-over';
    ctx.globalCompositeOperation = 'lighter';
    ctx.globalAlpha = 0.36 * (1 - rv * 0.5);
    ctx.drawImage(S.tmp2, -lw / 2, -lh / 2, lw, lh);
    ctx.globalAlpha = 1; ctx.globalCompositeOperation = 'source-over';
  }

  function drawSweep(p, bandFrac, strength, angleDeg) {
    if (p <= 0 || p >= 1 || strength <= 0) return;
    const { lw, lh, cw, ch } = S;
    const x = S.tmp2.getContext('2d');
    x.globalCompositeOperation = 'source-over';
    x.clearRect(0, 0, cw, ch);
    const a = (angleDeg * Math.PI) / 180, nx = Math.cos(a), ny = Math.sin(a);
    const cx = lerp(-0.25, 1.25, p) * cw, cy = ch / 2, hw = (bandFrac * cw) / 2;
    const g = x.createLinearGradient(cx - nx * hw, cy - ny * hw, cx + nx * hw, cy + ny * hw);
    const c = COL.sweep;
    g.addColorStop(0, rgba(c, 0)); g.addColorStop(0.3, rgba(c, 0.16)); g.addColorStop(0.5, rgba(c, 1));
    g.addColorStop(0.7, rgba(c, 0.16)); g.addColorStop(1, rgba(c, 0));
    x.fillStyle = g; x.fillRect(0, 0, cw, ch);
    x.globalCompositeOperation = 'destination-in'; x.drawImage(S.white, 0, 0);
    x.globalCompositeOperation = 'source-over';
    ctx.globalCompositeOperation = 'lighter';
    ctx.globalAlpha = clamp(strength * CFG.sweep.intensity, 0, 1.4);
    ctx.drawImage(S.tmp2, -lw / 2, -lh / 2, lw, lh);
    ctx.globalAlpha = 1; ctx.globalCompositeOperation = 'source-over';
  }

  function drawFormation(t, zoom) {
    ctx.globalCompositeOperation = 'lighter'; ctx.lineCap = 'round';
    const dpr = S.dpr;
    const posAt = (q, tt) => {
      const p = (tt - (q.ta - q.dur)) / q.dur;
      const e = easeOutCubic(p), cp = Math.sin(Math.PI * e) * q.curl;
      const dx = q.tx - q.sx, dy = q.ty - q.sy;
      return [q.sx + dx * e - dy * cp, q.sy + dy * e + dx * cp, p];
    };
    for (const q of S.form) {
      if (t < q.ta - q.dur || t > q.ta + 0.5) continue;
      const [x, y, p] = posAt(q, t);
      const [x0, y0] = posAt(q, t - 0.02);
      const a = q.a * smooth(p * 4) * (1 - smooth(win(t, q.ta, q.ta + 0.5)));
      if (a <= 0.003) continue;
      ctx.strokeStyle = rgba(COL.particle, a * 0.55); ctx.lineWidth = (q.w * dpr) / zoom;
      ctx.beginPath(); ctx.moveTo(x0, y0); ctx.lineTo(x, y); ctx.stroke();
      sprites(x, y, 5.5 * dpr * q.w / zoom, a, S.spSharp);
    }
    ctx.globalAlpha = 1; ctx.globalCompositeOperation = 'source-over';
  }

  function drawPass(t, zoom) {
    if (t < 2.9 || t > 4.2) return;
    const { W, dpr } = S;
    ctx.globalCompositeOperation = 'lighter'; ctx.lineCap = 'round';
    const span = (W / zoom) * 1.3;
    for (const q of S.pass) {
      const prog = (t - q.t0) * q.spd / 0.95;
      if (prog <= 0 || prog >= 1) continue;
      const xAt = (pp) => -span / 2 + span * pp;
      const yAt = (pp) => q.y + Math.sin(pp * q.wf + q.t0 * 5) * q.wob;
      const x = xAt(prog), y = yAt(prog);
      const a = q.a * Math.sin(Math.PI * prog);
      if (q.near) {
        sprites(x, y, 16 * dpr * q.w / zoom, a * 0.5, S.spSoft);
      } else {
        const pp0 = Math.max(0, prog - 0.05);
        ctx.strokeStyle = rgba(COL.particle, a * 0.7); ctx.lineWidth = (q.w * dpr) / zoom;
        ctx.beginPath(); ctx.moveTo(xAt(pp0), yAt(pp0)); ctx.lineTo(x, y); ctx.stroke();
        sprites(x, y, 5 * dpr * q.w / zoom, a, S.spSharp);
      }
    }
    ctx.globalAlpha = 1; ctx.globalCompositeOperation = 'source-over';
  }

  function drawFlash(t) {
    const f = CFG.flash.intensity * bump(t, 3.52, 0.05, 0.16);
    if (f <= 0.002) return;
    const R = S.lh * 0.8;
    const g = ctx.createRadialGradient(0, 0, 0, 0, 0, R);
    g.addColorStop(0, rgba(COL.flash, f)); g.addColorStop(0.35, rgba(COL.flash, f * 0.5)); g.addColorStop(1, rgba(COL.flash, 0));
    ctx.globalCompositeOperation = 'lighter';
    ctx.fillStyle = g; ctx.fillRect(-R, -R, R * 2, R * 2);
    ctx.globalCompositeOperation = 'source-over';
  }

  /* ------------------------------ render ------------------------------ */
  function render(t) {
    const { W, H, dpr } = S;
    ctx.setTransform(1, 0, 0, 1, 0, 0);
    ctx.globalAlpha = 1; ctx.globalCompositeOperation = 'source-over';
    if (TRANSPARENT) ctx.clearRect(0, 0, W, H);
    else { ctx.fillStyle = CFG.colors.background; ctx.fillRect(0, 0, W, H); }

    // virtual camera
    const camEnv = smooth(t / 1.0) * (1 - smooth(win(t, 3.2, 4.2)));
    const camX = Math.sin(t * 0.85 + 0.6) * CFG.camera.drift * dpr * camEnv;
    const camY = Math.cos(t * 0.6) * CFG.camera.drift * 0.6 * dpr * camEnv;
    const zp = 0.3 * smooth(t / 3.0) + 0.7 * smooth((t - 2.0) / 1.0);
    const zoom = 1 + CFG.camera.zoom * zp;
    const yaw = (-1 + 2 * smooth(win(t, 1.6, 3.2))) * (1 - smooth(win(t, 3.3, 4.5)));

    ctx.setTransform(1, 0, 0, 1, W / 2 + camX, H / 2 + camY);
    drawDust(t, zoom);
    ctx.scale(zoom, zoom);

    drawCentreGlow(t);
    drawConstruction(t, zoom);
    drawContours(t, zoom);
    drawHalo(t);
    drawDepth(t, yaw);
    drawFace(t);
    drawSweep(easeInOutSine(win(t, 1.85, 2.45)), 0.24, 0.6, 14);     // first soft sweep
    drawSweep(easeInOutCubic(win(t, 3.0, 3.6)), 0.14, 1.0, 14);      // final sweep
    drawFormation(t, zoom);
    drawPass(t, zoom);
    drawFlash(t);

    ctx.setTransform(1, 0, 0, 1, 0, 0);
    if (!TRANSPARENT) ctx.drawImage(S.vig, 0, 0);
  }

  /* ------------------------------ loop & controls ------------------------------ */
  function frame(now) {
    requestAnimationFrame(frame);
    const dt = Math.min((now - lastPerf) / 1000, 0.1);
    lastPerf = now;
    if (playing && !paused) {
      tDesign += (dt * CFG.speed) / K;
      if (!ended && tDesign >= DESIGN_DURATION) {
        ended = true;
        showHint();
        if (CFG.loop) setTimeout(restart, 600);
      }
      if (ended && CFG.idleAfterEnd === 'freeze' && !CFG.loop) { playing = false; tDesign = DESIGN_DURATION; }
    }
    render(tDesign);
  }

  function restart() {
    tDesign = 0; ended = false; playing = true; paused = false;
    hintEl.classList.remove('show');
    audio.schedule(0, CFG.speed / K);
  }

  let hintTimer = 0;
  function showHint() {
    if (!CFG.hints) return;
    hintEl.classList.add('show');
    clearTimeout(hintTimer);
    hintTimer = setTimeout(() => hintEl.classList.remove('show'), 4200);
  }

  window.addEventListener('keydown', (e) => {
    const k = e.key.toLowerCase();
    if (k === 'r' || k === ' ') { e.preventDefault(); restart(); }
    else if (k === 's') { audio.toggle(tDesign); if (audio.on) audio.schedule(tDesign, CFG.speed / K); }
    else if (k === 'f') { document.fullscreenElement ? document.exitFullscreen() : document.documentElement.requestFullscreen?.(); }
  });
  canvas.addEventListener('click', () => { if (ended) restart(); });
  window.addEventListener('resize', () => { if (img) build(); });

  // Public API (handy for QA, scrubbing, recording)
  window.LogoReveal = {
    seek(t) { paused = true; tDesign = t; render(t); },
    play() { paused = false; },
    restart,
    config: CFG
  };

  /* ------------------------------ boot ------------------------------ */
  const params = new URLSearchParams(location.search);
  const im = new Image();
  im.onload = () => {
    img = im;
    build();
    if (params.has('t')) { paused = true; tDesign = parseFloat(params.get('t')); }
    if (CFG.audio.enabled) audio.on = true;
    lastPerf = performance.now();
    requestAnimationFrame(frame);
  };
  im.onerror = () => { document.body.insertAdjacentHTML('beforeend', '<p class="err">Could not load ' + CFG.logo.src + '</p>'); };
  im.src = CFG.logo.src;
})();
