/* TOTI VIDEO — every picture on the site is drawn here, on canvas. */
(() => {
  const $ = (s, el = document) => el.querySelector(s);
  const INK = "#0a0814", CREAM = "#f6ecd0", PINK = "#ff5fa2", CYAN = "#6fe3d6", SAND = "#f2d9a0";
  const DISP = '"Bowlby One", Impact, sans-serif', OSD = 'VT323, monospace';
  const reduce = matchMedia("(prefers-reduced-motion: reduce)").matches;
  let fxOn = true;

  // ---------- helpers ----------
  const hash = s => { let h = 2166136261; for (const c of s) { h ^= c.charCodeAt(0); h = Math.imul(h, 16777619); } return h >>> 0; };
  const rng = seed => () => { seed |= 0; seed = seed + 0x6D2B79F5 | 0; let t = Math.imul(seed ^ seed >>> 15, 1 | seed); t = t + Math.imul(t ^ t >>> 7, 61 | t) ^ t; return ((t ^ t >>> 14) >>> 0) / 4294967296; };
  const poly = (x, pts, fill, stroke = INK, lw = 2) => {
    x.beginPath(); pts.forEach((p, i) => i ? x.lineTo(p[0], p[1]) : x.moveTo(p[0], p[1])); x.closePath();
    if (fill) { x.fillStyle = fill; x.fill(); }
    if (stroke) { x.strokeStyle = stroke; x.lineWidth = lw; x.lineJoin = "round"; x.stroke(); }
  };
  const box = (x, a, b, w, h, fill, stroke = INK, lw = 2) => {
    if (fill) { x.fillStyle = fill; x.fillRect(a, b, w, h); }
    if (stroke) { x.strokeStyle = stroke; x.lineWidth = lw; x.strokeRect(a, b, w, h); }
  };
  const circ = (x, a, b, r, fill, stroke = INK, lw = 2) => {
    x.beginPath(); x.arc(a, b, r, 0, 7);
    if (fill) { x.fillStyle = fill; x.fill(); }
    if (stroke) { x.strokeStyle = stroke; x.lineWidth = lw; x.stroke(); }
  };
  const line = (x, a, b, c, d, col = INK, lw = 1) => { x.beginPath(); x.moveTo(a, b); x.lineTo(c, d); x.strokeStyle = col; x.lineWidth = lw; x.stroke(); };
  // fine parallel hatching inside the current clip — the comic-book shading
  const hatch = (x, a, b, w, h, gap, col, slant = 0.5) => {
    x.strokeStyle = col; x.lineWidth = 1; x.beginPath();
    for (let i = -h; i < w + h; i += gap) { x.moveTo(a + i, b); x.lineTo(a + i - h * slant, b + h); }
    x.stroke();
  };
  const bands = (x, a, b, w, h, cols) => {
    const n = cols.length; let y0 = 0;
    cols.forEach((c, i) => { const y1 = h * (1 - Math.pow(1 - (i + 1) / n, 1.6)); x.fillStyle = c; x.fillRect(a, b + y0, w, y1 - y0 + 1); y0 = y1; });
  };
  const figure = (x, a, b, s, col = INK, rim = CREAM) => {   // small wanderer in a long coat and wide hat
    poly(x, [[a - s * .28, b], [a - s * .1, b - s * .72], [a + s * .1, b - s * .72], [a + s * .3, b]], col, rim, 1);
    circ(x, a, b - s * .82, s * .11, col, rim, 1);
    x.beginPath(); x.ellipse(a, b - s * .9, s * .26, s * .05, 0, 0, 7); x.fillStyle = col; x.fill(); x.strokeStyle = rim; x.lineWidth = 1; x.stroke();
  };
  const ridge = (x, r, a, w, base, minH, maxH, steps, fill, hatchCol) => {
    const pts = [[a, base]]; let h = minH + r() * (maxH - minH);
    for (let i = 0; i < steps; i++) {
      const x0 = a + w * i / steps, x1 = a + w * (i + 1) / steps;
      if (r() < .55) h = minH + r() * (maxH - minH);
      pts.push([x0 + 2, base - h], [x1 - 2, base - h]);
    }
    pts.push([a + w, base]);
    poly(x, pts, fill, INK, 1.5);
    if (hatchCol) { x.save(); x.beginPath(); pts.forEach((p, i) => i ? x.lineTo(p[0], p[1]) : x.moveTo(p[0], p[1])); x.clip(); hatch(x, a, base - maxH, w, maxH, 6, hatchCol, 0); x.restore(); }
  };

  // ---------- hero: the store at night ----------
  function hero() {
    const cv = $("#scene"), x = cv.getContext("2d");
    let W, H, stars, tapes, seedR;
    const TAPE_COLS = [PINK, CYAN, "#ff9a56", "#3b2a78", "#e0607e", "#1f4a5f", CREAM, "#6a2f7d"];
    function size() {
      const d = Math.min(devicePixelRatio || 1, 2);
      W = cv.clientWidth; H = cv.clientHeight; cv.width = W * d; cv.height = H * d; x.setTransform(d, 0, 0, d, 0, 0);
      const r = rng(77);
      stars = Array.from({ length: Math.round(W * H / 5500) }, () => ({ x: r() * W, y: r() * H * .68, r: r() * 1.3 + .3, p: r() * 7, s: .5 + r() * 2, cross: r() < .07 }));
      tapes = Array.from({ length: 400 }, () => TAPE_COLS[r() * TAPE_COLS.length | 0]);
      draw(0);
    }
    function draw(t) {
      const hz = H * .68, wide = W > 820;
      const cx = wide ? W * .62 : W * .5;
      // sky in flat bands
      bands(x, 0, 0, W, hz, ["#06051a", "#0b0926", "#120e36", "#1b1448", "#2a1a5c", "#43226c", "#6a2f7d", "#a8477f", "#e0607e"]);
      // stars
      for (const s of stars) {
        x.globalAlpha = .45 + .55 * Math.sin(t * s.s + s.p) ** 2; x.fillStyle = CREAM;
        if (s.cross) { x.fillRect(s.x - 4, s.y - .5, 8, 1); x.fillRect(s.x - .5, s.y - 4, 1, 8); } else x.fillRect(s.x, s.y, s.r, s.r);
      }
      x.globalAlpha = 1;
      // ringed planet
      const pr = Math.min(W, H) * .1, px = wide ? W * .86 : W * .8, py = H * (wide ? .2 : .44);
      x.save(); x.beginPath(); x.arc(px, py, pr, 0, 7); x.clip();
      x.fillStyle = "#f3e3b3"; x.fillRect(px - pr, py - pr, pr * 2, pr * 2);
      x.beginPath(); x.arc(px + pr * .45, py + pr * .25, pr * 1.05, 0, 7); x.fillStyle = "#e39a6f"; x.fill();
      x.save(); x.clip(); hatch(x, px - pr, py - pr, pr * 2, pr * 2, 5, "rgba(10,8,20,.45)", .6); x.restore();
      x.restore(); circ(x, px, py, pr, null, INK, 2);
      x.beginPath(); x.ellipse(px, py, pr * 1.7, pr * .32, -.35, .12, Math.PI - .12); x.strokeStyle = CYAN; x.lineWidth = 3; x.stroke();
      // drifting crystals
      [[.12, .5, 1], [.3, .34, .6], [.5, .16, .8]].forEach(([fx, fy, s], i) => {
        const a = W * fx, b = H * fy + Math.sin(t * .6 + i * 2) * 6, k = 14 * s * (wide ? 1.3 : 1);
        poly(x, [[a, b - k * 1.6], [a + k, b], [a, b + k * 1.6], [a - k, b]], "#43226c", INK, 1.5);
        poly(x, [[a, b - k * 1.6], [a + k, b], [a, b + k * .2]], CYAN, INK, 1);
      });
      // mesas
      const r = rng(5);
      ridge(x, r, -10, W + 20, hz, H * .03, H * .15, 14, "#3a2569", "rgba(10,8,20,.35)");
      ridge(x, r, -10, W + 20, hz, H * .01, H * .06, 22, "#22164a", null);
      // ground
      x.fillStyle = "#0e1730"; x.fillRect(0, hz, W, H - hz);
      for (let i = 1, y = hz; i < 16; i++) { y += i * i * .9; if (y > H) break; line(x, 0, y, W, y, "#1b2a4a", 1); }
      for (let i = -9; i <= 9; i++) line(x, cx + i * 12, hz, cx + i * W * .16, H, "rgba(242,217,160,.16)", 2);

      // ---- the store ----
      const bw = Math.min(W * .86, H * .8, 640), bh = bw * .42, base = hz + H * .11, bx = cx - bw / 2, by = base - bh;
      const flick = reduce || !fxOn ? 1 : (Math.sin(t * 9) > .93 || Math.sin(t * 1.3) > .985 ? .45 : 1);
      // light spilling on the lot
      poly(x, [[bx + bw * .03, base], [bx + bw * .97, base], [bx + bw * 1.25, H], [bx - bw * .25, H]], "rgba(246,214,122,.12)", null);
      poly(x, [[cx - bw * .07, base], [cx + bw * .07, base], [cx + bw * .2, H], [cx - bw * .2, H]], "rgba(111,227,214,.16)", null);
      box(x, bx, by, bw, bh, "#241a52");
      x.save(); x.beginPath(); x.rect(bx + bw * .9, by, bw * .1, bh); x.clip(); hatch(x, bx + bw * .9, by, bw * .1, bh, 5, "rgba(10,8,20,.6)"); x.restore();
      // awning
      const ay = by + bh * .06, ah = bh * .09, n = 22;
      for (let i = 0; i < n; i++) { x.fillStyle = i % 2 ? CREAM : PINK; x.fillRect(bx + bw * i / n, ay, bw / n + 1, ah); }
      box(x, bx, ay, bw, ah, null);
      box(x, bx - bw * .02, by - bw * .025, bw * 1.04, bw * .03, "#3b2a78");
      // windows full of tapes
      const wy = by + bh * .24, wh = bh * .6, ww = bw * .36; let k = 0;
      [bx + bw * .04, bx + bw * .6].forEach(wx => {
        box(x, wx, wy, ww, wh, "#f6d67a");
        const rows = 3, th = wh / rows;
        for (let j = 0; j < rows; j++) {
          const tw = ww / 26;
          for (let i = 0; i < 26; i++) { x.fillStyle = tapes[k++ % 400]; x.fillRect(wx + i * tw + 1, wy + j * th + th * .22, tw - 1.5, th * .7); }
          line(x, wx, wy + (j + 1) * th - 1, wx + ww, wy + (j + 1) * th - 1, INK, 2);
        }
        line(x, wx + ww / 2, wy, wx + ww / 2, wy + wh, INK, 3);
        box(x, wx, wy, ww, wh, null, INK, 3);
      });
      // door
      const dw = bw * .13, dy = by + bh * .3;
      box(x, cx - dw / 2, dy, dw, base - dy, "#9af0e4", INK, 3);
      line(x, cx, dy, cx, base, INK, 2); box(x, cx + dw * .08, dy + (base - dy) * .5, dw * .06, bh * .1, INK, null);
      x.font = `${bw * .045}px ${OSD}`; x.textAlign = "center"; x.textBaseline = "middle";
      x.fillStyle = Math.sin(t * 2) > -.6 ? CYAN : "#27504f"; x.shadowColor = CYAN; x.shadowBlur = 10;
      x.fillText("OPEN", cx, by + bh * .22); x.shadowBlur = 0;
      // roof sign
      const sw = bw * .74, sh = bw * .15, sx = cx - sw / 2, sy = by - bw * .025 - sh - bw * .02;
      line(x, sx + sw * .15, sy + sh, sx + sw * .15, by, INK, 4); line(x, sx + sw * .85, sy + sh, sx + sw * .85, by, INK, 4);
      box(x, sx, sy, sw, sh, "#0d0a24", INK, 3); box(x, sx + 5, sy + 5, sw - 10, sh - 10, null, `rgba(111,227,214,${.8 * flick})`, 2);
      x.font = `${sh * .62}px ${DISP}`; x.globalAlpha = flick;
      x.shadowColor = PINK; x.shadowBlur = 24; x.fillStyle = PINK; x.fillText("TOTI VIDEO", cx, sy + sh * .54);
      x.shadowBlur = 6; x.fillStyle = "#ffe3ef"; x.fillText("TOTI VIDEO", cx, sy + sh * .54);
      x.shadowBlur = 0; x.globalAlpha = 1;
      // neon reflected in the wet lot
      x.fillStyle = `rgba(255,95,162,${.14 * flick})`;
      for (let i = 0; i < 6; i++) x.fillRect(cx - sw * (.4 - i * .03), base + 14 + i * 13, sw * (.8 - i * .06), 4);
      // lamp post
      const sd = wide ? -1 : 1, lx = wide ? bx + bw * 1.13 : bx - bw * .16, lh = bh * 1.5;
      if (lx > 20 && lx < W - 20) {
        poly(x, [[lx + sd * bw * .05, base - lh], [lx + sd * bw * .2, H], [lx - sd * bw * .1, H]], "rgba(246,236,208,.08)", null);
        line(x, lx, base + 20, lx, base - lh, INK, 5); line(x, lx, base - lh, lx + sd * bw * .06, base - lh, INK, 5);
        box(x, lx + sd * bw * .055 - bw * .025, base - lh, bw * .05, 7, CREAM, INK, 2);
      }
      // a customer returning a tape
      const fs = bh * .52, fxp = cx + bw * .2, fy = base + H * .04;
      figure(x, fxp, fy, fs); box(x, fxp - fs * .42, fy - fs * .5, fs * .16, fs * .26, CYAN, INK, 1.5);
    }
    addEventListener("resize", size); size();
    document.fonts && document.fonts.ready.then(() => draw(0));
    if (!reduce) { let last = 0; const loop = ms => { if (fxOn && ms - last > 80) { last = ms; draw(ms / 1000); } requestAnimationFrame(loop); }; requestAnimationFrame(loop); }
  }

  // ---------- tape covers ----------
  const PALS = [
    { sky: ["#141033", "#2c1c5e", "#6a2f7d", "#e0607e"], ground: "#1b2a4a", far: "#3a2569", acc: CYAN, sun: "#f6e3b0" },
    { sky: ["#0d1b2a", "#16324f", "#2a6f7f", "#f2b872"], ground: "#3b1f4f", far: "#1f4a5f", acc: PINK, sun: CREAM },
    { sky: ["#1a0f2e", "#4a1942", "#a23b5a", "#ff9a56"], ground: "#16203a", far: "#5b2350", acc: CYAN, sun: "#ffe9a8" },
    { sky: ["#081a24", "#0f3b46", "#3f8f86", "#f2d9a0"], ground: "#2a1840", far: "#14505a", acc: "#ff7a59", sun: "#fff3cf" }
  ];
  const MOTIF = {
    memory(x, g, P, r) {       // picture frames drifting up into the night
      for (let i = 0; i < 5; i++) {
        const w = 26 + r() * 22, a = g.x + 14 + r() * (g.w - w - 28), b = g.y + 14 + i * (g.hy - g.y - 50) / 5 + r() * 10;
        x.save(); x.translate(a + w / 2, b + w * .4); x.rotate((r() - .5) * .6);
        box(x, -w / 2, -w * .4, w, w * .8, CREAM, INK, 1.5); box(x, -w / 2 + 4, -w * .4 + 4, w - 8, w * .8 - 8, i % 2 ? P.acc : P.sky[2], INK, 1);
        x.restore();
      }
      figure(x, g.x + g.w * .5, g.hy + 30, 44);
    },
    phone(x, g, P) {           // a lit phone booth, receiver off the hook
      const a = g.x + g.w * .56, b = g.hy + 26, w = 48, h = 108;
      box(x, a, b - h, w, h, P.far); box(x, a + 6, b - h + 16, w - 12, h * .55, P.sun); box(x, a - 4, b - h - 8, w + 8, 10, P.acc);
      line(x, a + w / 2, b - h + 16, a + w / 2, b - h + 16 + h * .55, INK, 1.5); line(x, a + 6, b - h + 45, a + w - 6, b - h + 45, INK, 1.5);
      x.beginPath(); x.moveTo(a + 10, b - 40); for (let i = 0; i < 9; i++) x.quadraticCurveTo(a - 8 - i * 8, b - 30 + (i % 2 ? -12 : 12), a - 14 - i * 8, b - 30 + i * 2);
      x.strokeStyle = INK; x.lineWidth = 2; x.stroke();
      x.save(); x.translate(a - 92, b - 14); x.rotate(-.5); box(x, -16, -5, 32, 10, CREAM); circ(x, -14, 3, 7, CREAM); circ(x, 14, 3, 7, CREAM); x.restore();
    },
    pitch(x, g, P) {           // floodlit pitch, the ball hung like a moon
      x.fillStyle = "#1f6a55"; x.fillRect(g.x, g.hy, g.w, g.y + g.h - g.hy);
      for (let i = 0; i < 6; i += 2) { x.fillStyle = "rgba(246,236,208,.1)"; x.fillRect(g.x, g.hy + i * 12, g.w, 12); }
      const c = g.x + g.w / 2; line(x, g.x, g.hy + 34, g.x + g.w, g.hy + 34, CREAM, 2);
      x.beginPath(); x.ellipse(c, g.hy + 34, 44, 15, 0, 0, 7); x.strokeStyle = CREAM; x.lineWidth = 2; x.stroke();
      [g.x + 26, g.x + g.w - 26].forEach(a => { line(x, a, g.hy + 8, a, g.hy - 90, INK, 3); box(x, a - 12, g.hy - 104, 24, 14, P.sun); poly(x, [[a - 12, g.hy - 90], [a + 12, g.hy - 90], [c + (a < c ? -10 : 10), g.hy + 30]], "rgba(255,243,207,.13)", null); });
      circ(x, c, g.y + 62, 26, CREAM); poly(x, [[c, g.y + 50], [c + 11, g.y + 58], [c + 7, g.y + 71], [c - 7, g.y + 71], [c - 11, g.y + 58]], INK, null);
    },
    city(x, g, P, r) {         // skyline with a few windows still on
      for (let a = g.x; a < g.x + g.w;) {
        const w = 16 + r() * 22, h = 40 + r() * 120;
        box(x, a, g.hy + 20 - h, w, h, r() < .5 ? P.far : INK, INK, 1.5);
        for (let j = 0; j < h / 12 - 1; j++) for (let i = 0; i < w / 8 - 1; i++) if (r() < .3) { x.fillStyle = r() < .7 ? P.sun : P.acc; x.fillRect(a + 4 + i * 8, g.hy + 26 - h + j * 12, 4, 6); }
        a += w;
      }
      figure(x, g.x + g.w * .28, g.hy + 58, 30);
    },
    eye(x, g, P) {             // something huge is watching
      const c = g.x + g.w / 2, m = g.y + 78, w = g.w * .42;
      for (let i = 0; i < 14; i++) { const a = Math.PI + i * Math.PI / 13; line(x, c + Math.cos(a) * w * 1.05, m + Math.sin(a) * 50, c + Math.cos(a) * w * 1.4, m + Math.sin(a) * 78, P.sun, 1.5); }
      x.beginPath(); x.moveTo(c - w, m); x.quadraticCurveTo(c, m - 62, c + w, m); x.quadraticCurveTo(c, m + 62, c - w, m); x.closePath();
      x.fillStyle = CREAM; x.fill(); x.strokeStyle = INK; x.lineWidth = 2.5; x.stroke();
      circ(x, c, m, 26, P.acc); circ(x, c, m, 11, INK, null); circ(x, c - 8, m - 8, 4, CREAM, null);
      figure(x, c - 30, g.hy + 44, 34); line(x, c - 30, g.hy + 44, c + 60, g.hy + 62, "rgba(10,8,20,.6)", 5);
    },
    antenna(x, g, P) {         // broadcast mast, signal going out
      const c = g.x + g.w / 2, top = g.y + 54, b = g.hy + 30;
      x.strokeStyle = P.acc; x.lineWidth = 2;
      for (let i = 1; i < 6; i++) { x.globalAlpha = 1 - i * .15; x.beginPath(); x.arc(c, top, i * 17, -2.5, -.64); x.stroke(); x.beginPath(); x.arc(c, top, i * 17, .64, 2.5); x.stroke(); }
      x.globalAlpha = 1;
      line(x, c, top, c - 26, b, INK, 3); line(x, c, top, c + 26, b, INK, 3);
      for (let i = 1; i < 7; i++) { const y = top + (b - top) * i / 7, w = 26 * i / 7, y0 = top + (b - top) * (i - 1) / 7, w0 = 26 * (i - 1) / 7; line(x, c - w, y, c + w, y, INK, 1.5); line(x, c - w0, y0, c + w, y, INK, 1); line(x, c + w0, y0, c - w, y, INK, 1); }
      circ(x, c, top, 6, PINK);
      box(x, c + 44, b - 18, 30, 18, P.far); box(x, c + 50, b - 12, 8, 6, P.sun, null);
    },
    boxes(x, g, P, r) {        // parcels stacked on the horizon
      const s = 34, cols = [SAND, "#e39a6f", P.acc];
      [[0, 0], [1, 0], [2, 0], [.5, 1], [1.5, 1], [1, 2], [3.3, 0]].forEach(([i, j], n) => {
        const a = g.x + 26 + i * (s + 2), b = g.hy + 44 - j * s;
        box(x, a, b - s, s, s, cols[n % 3]); poly(x, [[a, b - s], [a + 9, b - s - 9], [a + s + 9, b - s - 9], [a + s, b - s]], CREAM);
        poly(x, [[a + s, b - s], [a + s + 9, b - s - 9], [a + s + 9, b - 9], [a + s, b]], P.far); line(x, a + s / 2, b - s, a + s / 2, b - s * .6, INK, 3);
      });
      x.setLineDash([6, 6]); x.beginPath(); x.moveTo(g.x + 10, g.y + 96); x.quadraticCurveTo(g.x + g.w * .5, g.y + 10, g.x + g.w - 22, g.y + 66); x.strokeStyle = CREAM; x.lineWidth = 2; x.stroke(); x.setLineDash([]);
      poly(x, [[g.x + g.w - 14, g.y + 74], [g.x + g.w - 32, g.y + 66], [g.x + g.w - 20, g.y + 54]], CREAM);
    },
    houses(x, g, P, r) {       // a new town, lights on
      for (let row = 0; row < 2; row++) for (let i = 0; i < 4 - row; i++) {
        const w = 40 + row * 10, a = g.x + 8 + i * (w + 10) + row * 14, b = g.hy + 8 + row * 44, h = 26 + row * 6;
        box(x, a, b - h, w, h, row ? SAND : P.far); poly(x, [[a - 4, b - h], [a + w / 2, b - h - 20 - row * 4], [a + w + 4, b - h]], i % 2 ? PINK : "#ff9a56");
        box(x, a + 6, b - h + 7, 9, 9, P.sun, INK, 1); box(x, a + w - 16, b - 16, 9, 16, INK, null);
      }
      [g.x + g.w - 26, g.x + 20].forEach(a => { line(x, a, g.hy + 62, a, g.hy + 34, INK, 3); circ(x, a, g.hy + 26, 13, "#3f8f86"); });
    },
    morph(x, g, P) {           // one shape becoming another
      const m = g.y + 84, c = g.x + g.w / 2;
      box(x, c - 84, m - 24, 48, 48, P.far); x.save(); x.beginPath(); x.rect(c - 84, m - 24, 48, 48); x.clip(); hatch(x, c - 84, m - 24, 48, 48, 5, "rgba(10,8,20,.5)"); x.restore();
      circ(x, c + 60, m, 28, P.acc);
      for (let i = 0; i < 5; i++) circ(x, c - 24 + i * 12, m + Math.sin(i * 1.4) * 8, 2 + i * .6, CREAM, null);
      poly(x, [[c - 20, g.hy + 50], [c + 8, g.hy - 14], [c + 36, g.hy + 50]], PINK); figure(x, c - 52, g.hy + 54, 30);
    }
  };

  function wrap(x, text, max) {
    const out = []; let cur = "";
    for (const w of text.split(" ")) { const t = cur ? cur + " " + w : w; if (x.measureText(t).width > max && cur) { out.push(cur); cur = w; } else cur = t; }
    if (cur) out.push(cur); return out;
  }

  function cover(cv, it, tag) {
    const W = 240, H = 400, d = Math.min(devicePixelRatio || 1, 2) * (cv.id === "box-cover" ? 1.5 : 1);
    cv.width = W * d; cv.height = H * d; const x = cv.getContext("2d"); x.setTransform(d, 0, 0, d, 0, 0);
    const r = rng(hash(it.title)), P = PALS[it.pal ?? (r() * PALS.length | 0)];
    x.fillStyle = "#0d0a24"; x.fillRect(0, 0, W, H);
    // label strip
    x.font = `17px ${OSD}`; x.textBaseline = "middle"; x.textAlign = "left"; if (x.measureText("TOTI VIDEO  " + tag.toUpperCase()).width < W - 24) { x.fillStyle = CREAM; x.fillText("TOTI VIDEO", 12, 20); }
    x.textAlign = "right"; x.fillStyle = P.acc; x.fillText(tag.toUpperCase(), W - 12, 20);
    // art panel
    const g = { x: 10, y: 34, w: W - 20, h: 232 }; g.hy = g.y + g.h * .66;
    x.save(); x.beginPath(); x.rect(g.x, g.y, g.w, g.h); x.clip();
    bands(x, g.x, g.y, g.w, g.hy - g.y, P.sky);
    for (let i = 0; i < 40; i++) { x.fillStyle = CREAM; x.globalAlpha = .4 + r() * .6; x.fillRect(g.x + r() * g.w, g.y + r() * g.h * .5, 1.4, 1.4); } x.globalAlpha = 1;
    if (!["pitch", "eye"].includes(it.art)) { const sx = g.x + 30 + r() * (g.w - 130), sy = g.y + 34 + r() * 30; circ(x, sx, sy, 15 + r() * 10, P.sun, INK, 1.5); }
    ridge(x, r, g.x - 4, g.w + 8, g.hy, 8, 40, 9, P.far, "rgba(10,8,20,.3)");
    x.fillStyle = P.ground; x.fillRect(g.x, g.hy, g.w, g.h);
    for (let i = 1, y = g.hy; i < 9; i++) { y += i * 2.4; line(x, g.x, y, g.x + g.w, y, "rgba(10,8,20,.35)", 1); }
    (MOTIF[it.art] || MOTIF.city)(x, g, P, r);
    x.restore(); box(x, g.x, g.y, g.w, g.h, null, CREAM, 2);
    // title
    const t = it.title.toUpperCase(); let fs = 30, lines;
    x.textAlign = "left"; x.textBaseline = "alphabetic";
    do { x.font = `${fs}px ${DISP}`; lines = wrap(x, t, W - 24); fs -= 2; } while ((lines.length > 4 || lines.length * (fs + 2) * 1.02 > 92 || lines.some(l => x.measureText(l).width > W - 20)) && fs > 9);
    fs += 2; const lh = fs * 1.02; let y = 278 + fs * .85;
    for (const l of lines) { x.fillStyle = PINK; x.fillText(l, 14, y + 2); x.fillStyle = CREAM; x.fillText(l, 12, y); y += lh; }
    x.font = `17px ${OSD}`; x.fillStyle = P.acc; x.fillText([it.year, "VHS"].filter(Boolean).join("  ·  "), 12, H - 12);
    // colour bars down in the corner
    ["#f6ecd0", "#ffe14d", CYAN, "#5fd66a", PINK, "#e0443a", "#3b5bd6"].forEach((c, i) => { x.fillStyle = c; x.fillRect(W - 12 - (7 - i) * 8, H - 24, 8, 12); });
    // sticker
    if (it.sticker) {
      x.save(); x.translate(W - 44, 70); x.rotate(.28); circ(x, 0, 0, 30, it.sticker === "LIVE" ? "#e0443a" : "#ffe14d", INK, 2);
      x.fillStyle = it.sticker === "LIVE" ? CREAM : INK; x.textAlign = "center"; x.textBaseline = "middle";
      const w = it.sticker.split(" "); x.font = `${w.length > 1 ? 15 : 20}px ${DISP}`; w.forEach((s, i) => x.fillText(s, 0, (i - (w.length - 1) / 2) * 16 + 1)); x.restore();
    }
    // shelf wear
    x.strokeStyle = "rgba(246,236,208,.1)"; x.lineWidth = 1;
    for (let i = 0; i < 9; i++) { const a = r() * W, b = r() * H; x.beginPath(); x.moveTo(a, b); x.lineTo(a + (r() - .5) * 60, b + (r() - .5) * 14); x.stroke(); }
    x.fillStyle = "rgba(246,236,208,.12)"; x.fillRect(0, 0, 3, H); x.fillStyle = "rgba(0,0,0,.35)"; x.fillRect(W - 4, 0, 4, H);
  }

  // ---------- build the shelves ----------
  function shelves() {
    const root = $("#aisles"), dlg = $("#box"), all = [];
    DATA.aisles.forEach((a, i) => {
      const sec = document.createElement("section"); sec.className = "aisle"; sec.id = a.id;
      sec.innerHTML = `<div class="sign"><span>Aisle ${String(i + 1).padStart(2, "0")} · ${a.tag}</span><h2>${a.name}</h2></div><div class="shelf"></div>`;
      a.tapes.forEach(it => {
        const b = document.createElement("button"); b.className = "tape"; b.type = "button";
        b.setAttribute("aria-label", `${it.title}${it.year ? ", " + it.year : ""} — ${it.role}. Open details.`);
        const cv = document.createElement("canvas"); b.append(cv); all.push([cv, it, a.tag]);
        b.onclick = () => {
          $("#box-tag").textContent = [a.tag, it.year].filter(Boolean).join(" · ");
          $("#box-title").textContent = it.title; $("#box-role").textContent = it.role;
          $("#box-blurb").textContent = it.blurb || ""; $("#box-notes").textContent = it.notes || "";
          $("#box-link").hidden = !it.link; $("#box-out").hidden = !!it.link; if (it.link) $("#box-link").href = it.link;
          cover($("#box-cover"), it, a.tag); dlg.showModal();
        };
        $(".shelf", sec).append(b);
      });
      root.append(sec);
    });
    const paint = () => all.forEach(a => cover(...a));
    paint(); document.fonts && document.fonts.ready.then(paint);
    $("#eject").onclick = () => dlg.close();
    dlg.addEventListener("click", e => { if (e.target === dlg) dlg.close(); });

    const wall = $("#photo-wall");
    if (DATA.photos.length) DATA.photos.forEach(p => { const f = document.createElement("figure"); const im = new Image(); im.src = p.src; im.alt = p.caption || "Photograph by Efraim Toti"; im.loading = "lazy"; const c = document.createElement("figcaption"); c.textContent = p.caption || ""; f.append(im, c); wall.append(f); });
    else wall.innerHTML = `<div class="out">All copies currently rented out — prints back on the wall soon</div>`;
  }

  // ---------- VHS layer, clock, barcode, favicon ----------
  function vhs() {
    const cv = $("#noise"), x = cv.getContext("2d"), im = x.createImageData(320, 180), px = new Uint32Array(im.data.buffer);
    const snow = () => { for (let i = 0; i < px.length; i++) px[i] = Math.random() < .5 ? 0xffffffff : 0xff000000; x.putImageData(im, 0, 0); };
    snow(); if (!reduce) setInterval(() => fxOn && !document.hidden && snow(), 90);
    const start = Date.now(), M = ["JAN", "FEB", "MAR", "APR", "MAY", "JUN", "JUL", "AUG", "SEP", "OCT", "NOV", "DEC"], p = n => String(n).padStart(2, "0");
    const tick = () => {
      const d = new Date(), h = d.getHours(), s = (Date.now() - start) / 1000 | 0;
      $("#clock").textContent = `${h < 12 ? "AM" : "PM"} ${h % 12 || 12}:${p(d.getMinutes())}  ${M[d.getMonth()]}. ${p(d.getDate())} ${d.getFullYear()}`;
      $("#counter").textContent = `${s / 3600 | 0}:${p((s / 60 | 0) % 60)}:${p(s % 60)}`;
    };
    tick(); setInterval(tick, 1000);
    const b = $("#fx"); b.onclick = () => { fxOn = !fxOn; document.body.classList.toggle("clean", !fxOn); b.setAttribute("aria-pressed", fxOn); };
  }
  function barcode() {
    const cv = $("#barcode"), x = cv.getContext("2d"), r = rng(hash("efraimtoti")); x.fillStyle = INK;
    for (let a = 14; a < cv.width - 14;) { const w = 1 + (r() * 4 | 0); if (r() < .6) x.fillRect(a, 8, w, cv.height - 16); a += w + 1; }
  }
  function favicon() {
    const cv = document.createElement("canvas"); cv.width = cv.height = 64; const x = cv.getContext("2d");
    x.fillStyle = INK; x.fillRect(0, 0, 64, 64); box(x, 5, 15, 54, 34, "#3b2a78", PINK, 3); box(x, 13, 22, 38, 16, CREAM, null);
    circ(x, 22, 30, 5, INK, null); circ(x, 42, 30, 5, INK, null);
    const l = document.createElement("link"); l.rel = "icon"; l.href = cv.toDataURL(); document.head.append(l);
  }

  $("#yr").textContent = new Date().getFullYear();
  hero(); shelves(); vhs(); barcode(); favicon();
})();
