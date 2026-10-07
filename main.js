/* TOTI VIDEO — a flat, drawn video store. No 3D: every picture is 2D canvas, and the only motion is inside the drawings. */
import { paintCover, INK, CREAM, RED, YEL, BLUE, GREEN, ORANGE, SKY } from "./covers.js";

const D = window.DATA, $ = s => document.querySelector(s);
const reduce = matchMedia("(prefers-reduced-motion: reduce)").matches;
const el = (tag, cls, text) => { const e = document.createElement(tag); if (cls) e.className = cls; if (text != null) e.textContent = text; return e; };
const rng = s => () => { s |= 0; s = s + 0x6D2B79F5 | 0; let t = Math.imul(s ^ s >>> 15, 1 | s); t = t + Math.imul(t ^ t >>> 7, 61 | t) ^ t; return ((t ^ t >>> 14) >>> 0) / 4294967296; };
const DISP = '"Bowlby One", Impact, sans-serif', OSD = "VT323, monospace";

// drawing helpers: flat fill + one even ink line
const poly = (x, pts, fill, lw = 3) => { x.beginPath(); pts.forEach((p, i) => i ? x.lineTo(p[0], p[1]) : x.moveTo(p[0], p[1])); x.closePath(); if (fill) { x.fillStyle = fill; x.fill(); } if (lw) { x.strokeStyle = INK; x.lineWidth = lw; x.lineJoin = "round"; x.stroke(); } };
const rect = (x, a, b, w, h, fill, lw = 3) => { if (fill) { x.fillStyle = fill; x.fillRect(a, b, w, h); } if (lw) { x.strokeStyle = INK; x.lineWidth = lw; x.strokeRect(a, b, w, h); } };
const circ = (x, a, b, r, fill, lw = 3) => { x.beginPath(); x.arc(a, b, r, 0, 7); if (fill) { x.fillStyle = fill; x.fill(); } if (lw) { x.strokeStyle = INK; x.lineWidth = lw; x.stroke(); } };
const line = (x, a, b, c, d, col = INK, lw = 2) => { x.beginPath(); x.moveTo(a, b); x.lineTo(c, d); x.strokeStyle = col; x.lineWidth = lw; x.stroke(); };
const hatch = (x, a, b, w, h, gap = 6, slant = .5) => { x.save(); x.beginPath(); x.rect(a, b, w, h); x.clip(); x.strokeStyle = INK; x.lineWidth = 1.2; x.beginPath(); for (let i = -h; i < w + h; i += gap) { x.moveTo(a + i, b); x.lineTo(a + i - h * slant, b + h); } x.stroke(); x.restore(); };

await Promise.race([
  Promise.all(['40px "Bowlby One"', "40px Anton", '40px "Space Mono"', "40px VT323"].map(f => document.fonts.load(f))).catch(() => {}),
  new Promise(r => setTimeout(r, 2500))
]);

// ---------- text ----------
$("#h-name").innerHTML = D.owner.name.replace(" ", "<br>"); $("#h-roles").textContent = D.owner.roles; $("#c-roles").textContent = D.owner.roles;
$("#c-mail").textContent = D.owner.email; $("#c-mail").href = "mailto:" + D.owner.email; $("#c-tel").textContent = D.owner.phone; $("#c-tel").href = "tel:" + D.owner.tel;
$("#yr").textContent = new Date().getFullYear();
{ const M = ["JAN", "FEB", "MAR", "APR", "MAY", "JUN", "JUL", "AUG", "SEP", "OCT", "NOV", "DEC"], p2 = n => String(n).padStart(2, "0");
  const tick = () => { const d = new Date(), h = d.getHours(); $("#clock").textContent = `${h < 12 ? "AM" : "PM"} ${h % 12 || 12}:${p2(d.getMinutes())}  ${M[d.getMonth()]}. ${p2(d.getDate())} ${d.getFullYear()}`; };
  tick(); setInterval(tick, 10000); }

// ---------- outside: the store at night ----------
{
  const cv = $("#scene"), x = cv.getContext("2d"), TAPES = [RED, YEL, BLUE, GREEN, ORANGE, CREAM, INK, SKY];
  let W, H, stars, tapes, mesas;
  function size() {
    const d = Math.min(devicePixelRatio || 1, 2); W = cv.clientWidth; H = cv.clientHeight; cv.width = W * d; cv.height = H * d; x.setTransform(d, 0, 0, d, 0, 0);
    const r = rng(77);
    stars = Array.from({ length: Math.round(W * H / 9000) }, () => ({ x: r() * W, y: r() * H * .62, p: r() * 7, s: .6 + r() * 1.6, big: r() < .12 }));
    tapes = Array.from({ length: 300 }, () => TAPES[r() * 8 | 0]);
    mesas = []; for (let a = -20; a < W;) { const w = 60 + r() * 150, h = H * (.05 + r() * .16); mesas.push([a, w, h, r() < .5]); a += w + r() * 70; }
    draw(0);
  }
  function draw(t) {
    const hz = H * .7, wide = W > 820, cx = wide ? W * .62 : W * .5;
    // sky in three flat bands
    rect(x, 0, 0, W, hz, "#1b2f6b", 0); rect(x, 0, hz * .7, W, hz * .3, "#27459a", 0); rect(x, 0, hz * .9, W, hz * .1, "#3d67b8", 0);
    for (const s of stars) { const a = .35 + .65 * Math.sin(t * s.s + s.p) ** 2; x.globalAlpha = a; x.fillStyle = CREAM; if (s.big) { x.fillRect(s.x - 5, s.y - 1, 10, 2); x.fillRect(s.x - 1, s.y - 5, 2, 10); } else x.fillRect(s.x, s.y, 2, 2); }
    x.globalAlpha = 1;
    // ringed moon, hatched on its dark side
    const mr = Math.min(W, H) * .09, mx = wide ? W * .88 : W * .8, my = H * (wide ? .2 : .46);
    circ(x, mx, my, mr, CREAM); x.save(); x.beginPath(); x.arc(mx, my, mr - 2, 0, 7); x.clip(); x.beginPath(); x.arc(mx + mr * .5, my + mr * .2, mr, 0, 7); x.fillStyle = "#e9b6a0"; x.fill(); x.clip(); hatch(x, mx - mr, my - mr, mr * 2, mr * 2, 5); x.restore();
    x.beginPath(); x.ellipse(mx, my, mr * 1.7, mr * .3, -.35, .15, Math.PI - .15); x.strokeStyle = INK; x.lineWidth = 7; x.stroke(); x.strokeStyle = YEL; x.lineWidth = 3; x.stroke();
    // mesas
    for (const [a, w, h, alt] of mesas) { const c = alt ? "#d9703a" : "#e9a06a"; poly(x, [[a, hz], [a + 8, hz - h], [a + w * .55, hz - h], [a + w * .6, hz - h * .7], [a + w - 6, hz - h * .7], [a + w, hz]], c); hatch(x, a + w * .6, hz - h * .7, w * .4, h * .7, 5, 0); }
    // the lot
    rect(x, 0, hz, W, H - hz, "#24386f", 0); line(x, 0, hz, W, hz, INK, 3);
    for (let i = 1, y = hz; i < 14; i++) { y += i * i; if (y > H) break; line(x, 0, y, W, y, "rgba(27,26,23,.5)", 1.2); }
    for (let i = -4; i <= 4; i++) if (i) line(x, cx + i * 40, hz + 8, cx + i * W * .2, H, YEL, 3);
    // ---- the store ----
    const bw = Math.min(W * .88, H * .8, 640), bh = bw * .42, base = hz + H * .11, bx = cx - bw / 2, by = base - bh;
    const flick = reduce ? 1 : (Math.sin(t * 7) > .96 || Math.sin(t * 1.1) > .99 ? .35 : 1);
    poly(x, [[bx + bw * .03, base], [bx + bw * .97, base], [bx + bw * 1.2, H], [bx - bw * .2, H]], "rgba(251,238,180,.16)", 0);
    rect(x, bx, by, bw, bh, RED); hatch(x, bx + bw * .9, by, bw * .1, bh, 6);
    const n = 20, ay = by + bh * .06, ah = bh * .1; for (let i = 0; i < n; i++) rect(x, bx + bw * i / n, ay, bw / n + 1, ah, i % 2 ? CREAM : YEL, 0); rect(x, bx - 6, ay, bw + 12, ah, null);
    rect(x, bx - bw * .02, by - bw * .03, bw * 1.04, bw * .035, BLUE);
    const wy = by + bh * .25, wh = bh * .58, ww = bw * .36; let k = 0;
    for (const wx of [bx + bw * .04, bx + bw * .6]) {
      rect(x, wx, wy, ww, wh, "#fbeeb4", 0);
      for (let j = 0; j < 3; j++) { const th = wh / 3, tw = ww / 24; for (let i = 0; i < 24; i++) { rect(x, wx + i * tw + 1.5, wy + j * th + th * .2, tw - 2, th * .72, tapes[k++ % 300], 1); } line(x, wx, wy + (j + 1) * th - 1, wx + ww, wy + (j + 1) * th - 1, INK, 3); }
      line(x, wx + ww / 2, wy, wx + ww / 2, wy + wh, INK, 3); rect(x, wx, wy, ww, wh, null, 4);
    }
    const dw = bw * .13, dy = by + bh * .3; rect(x, cx - dw / 2, dy, dw, base - dy, SKY, 4); line(x, cx, dy, cx, base, INK, 3); hatch(x, cx - dw / 2, dy, dw * .3, (base - dy) * .5, 7, 1);
    x.font = `${bw * .05}px ${OSD}`; x.textAlign = "center"; x.textBaseline = "middle"; x.fillStyle = reduce || Math.sin(t * 1.6) > -.5 ? YEL : "#7a4a3a"; x.fillText("OPEN", cx, by + bh * .225);
    const sw = bw * .74, sh = bw * .15, sx = cx - sw / 2, sy = by - bw * .03 - sh - bw * .025;
    line(x, sx + sw * .15, sy + sh, sx + sw * .15, by, INK, 5); line(x, sx + sw * .85, sy + sh, sx + sw * .85, by, INK, 5);
    rect(x, sx, sy, sw, sh, INK, 4); rect(x, sx + 6, sy + 6, sw - 12, sh - 12, null, 0); x.strokeStyle = YEL; x.globalAlpha = flick; x.lineWidth = 2; x.strokeRect(sx + 6, sy + 6, sw - 12, sh - 12);
    x.font = `${sh * .6}px ${DISP}`; x.fillStyle = YEL; x.fillText("TOTI VIDEO", cx, sy + sh * .55); x.globalAlpha = 1;
    // lamp post and a customer bringing a tape back
    const lx = wide ? bx + bw * 1.12 : bx - bw * .06, lh = bh * 1.5;
    if (lx > 16 && lx < W - 16) { line(x, lx, base + 18, lx, base - lh, INK, 6); line(x, lx, base - lh, lx - bw * .06, base - lh, INK, 6); rect(x, lx - bw * .09, base - lh, bw * .05, 8, YEL, 2.5); }
    const fs = bh * .5, fx = cx + bw * .2, fy = base + H * .04;
    poly(x, [[fx - fs * .26, fy], [fx - fs * .1, fy - fs * .7], [fx + fs * .1, fy - fs * .7], [fx + fs * .28, fy]], GREEN); circ(x, fx, fy - fs * .8, fs * .11, "#e9b6a0");
    x.beginPath(); x.ellipse(fx, fy - fs * .9, fs * .24, fs * .05, 0, 0, 7); x.fillStyle = ORANGE; x.fill(); x.strokeStyle = INK; x.lineWidth = 3; x.stroke();
    rect(x, fx - fs * .42, fy - fs * .5, fs * .16, fs * .26, CREAM, 2.5);
  }
  addEventListener("resize", size); size();
  if (!reduce) { let last = 0; const loop = ms => { if (ms - last > 110 && scrollY < innerHeight && !document.hidden) { last = ms; draw(ms / 1000); } requestAnimationFrame(loop); }; requestAnimationFrame(loop); }
}

// ---------- inside: the lemari ----------
{
  const root = $("#lemari"), r = rng(21), cols = [RED, YEL, GREEN, ORANGE, CREAM, SKY, "#e9b6a0", "#3a3835", "#c9dba0", "#f3c9a8"];
  const spines = (row, n) => { for (let i = 0; i < n; i++) { const s = el("i", "spine"); s.style.background = cols[r() * cols.length | 0]; s.style.height = 82 + r() * 14 + "%"; s.style.width = 12 + r() * 9 + "px"; if (r() < .07) { s.style.transform = "rotate(7deg)"; s.style.margin = "0 6px"; } row.append(s); } };
  [[0, 1, 2], [3, 4], [5, 6]].forEach(ids => {
    const row = el("div", "row"); spines(row, 26);
    ids.forEach(i => {
      const d = D.tapes[i], b = el("button", "tape"); b.type = "button"; b.setAttribute("aria-label", `${d.name} — ${d.genre}. Open the tape.`);
      b.append(paintCover(document.createElement("canvas"), d), el("span", "tag", d.genre)); b.onclick = () => openTape(d);
      row.append(b); spines(row, ids.length === 3 ? 4 : 9);
    });
    spines(row, 22); root.append(row, el("div", "board"));
  });
}

// ---------- the counter TV ----------
{
  const cv = $("#tv"), x = cv.getContext("2d"), BARS = [CREAM, YEL, SKY, GREEN, ORANGE, RED, BLUE];
  const draw = t => {
    x.clearRect(0, 0, 360, 300);
    line(x, 150, 44, 110, 6, INK, 4); line(x, 200, 44, 250, 10, INK, 4); circ(x, 110, 6, 5, RED, 2.5); circ(x, 250, 10, 5, RED, 2.5);
    rect(x, 20, 44, 320, 220, ORANGE, 4); hatch(x, 20, 230, 320, 34, 7); rect(x, 40, 264, 30, 22, INK, 0); rect(x, 290, 264, 30, 22, INK, 0);
    BARS.forEach((c, i) => rect(x, 40 + i * 30, 64, 30, 150, c, 0));
    rect(x, 40, 176, 210, 38, INK, 0); x.font = `34px ${OSD}`; x.textAlign = "left"; x.textBaseline = "middle"; x.fillStyle = YEL; x.fillText("TOTI TV", 50, 196);
    if (reduce || Math.floor(t * 1.2) % 2) { x.fillStyle = CREAM; x.fillText("▶", 216, 196); }
    if (!reduce) rect(x, 40, 64 + (t * 26) % 144, 210, 5, "rgba(255,255,255,.4)", 0);
    rect(x, 40, 64, 210, 150, null, 4);
    circ(x, 296, 96, 18, CREAM); line(x, 296, 96, 296 + Math.cos(-1) * 16, 96 + Math.sin(-1) * 16, INK, 3); circ(x, 296, 150, 18, CREAM); line(x, 296, 150, 310, 142, INK, 3);
    for (let i = 0; i < 5; i++) line(x, 276, 186 + i * 7, 316, 186 + i * 7, INK, 2);
  };
  draw(0); if (!reduce) setInterval(() => !document.hidden && draw(performance.now() / 1000), 160);
}

// ---------- opening a tape ----------
const dlg = $("#box"), body = $("#panel-body"), cas = $("#cassette"), cx2 = cas.getContext("2d");
let spin = null;
function drawCassette(d, t) {
  const x = cx2; x.clearRect(0, 0, 320, 200);
  x.beginPath(); x.roundRect(6, 6, 308, 188, 14); x.fillStyle = "#3a3835"; x.fill(); x.strokeStyle = INK; x.lineWidth = 4; x.stroke();
  rect(x, 28, 22, 264, 44, CREAM); x.font = `26px ${DISP}`; x.textAlign = "center"; x.textBaseline = "middle"; x.fillStyle = INK; x.fillText(d.name.toUpperCase(), 160, 46, 240);
  rect(x, 44, 82, 232, 78, SKY); hatch(x, 44, 82, 60, 30, 6);
  [[104, 1], [216, -1]].forEach(([a, dir], n) => {
    circ(x, a, 121, 34 - n * 8, "#6b4a3a", 2.5); circ(x, a, 121, 17, CREAM);
    for (let i = 0; i < 3; i++) { const g = t * 1.6 * dir + i * 2.094; line(x, a, 121, a + Math.cos(g) * 16, 121 + Math.sin(g) * 16, INK, 3); }
    circ(x, a, 121, 4, INK, 0);
  });
  [YEL, RED, BLUE].forEach((c, i) => rect(x, 28 + i * 22, 170, 22, 10, c, 0)); x.font = `18px ${OSD}`; x.textAlign = "right"; x.fillStyle = CREAM; x.fillText("TOTI VIDEO · E-180", 292, 176);
}
function openTape(d) {
  dlg.style.setProperty("--bg", d.colors.bg); dlg.style.setProperty("--fg", d.colors.fg); dlg.style.setProperty("--acc", d.colors.acc);
  paintCover($("#box-cover"), d);
  const h2 = el("h2", "", d.name); h2.id = "box-title";
  body.replaceChildren(el("p", "p-genre", d.genre + " · Toti Video"), h2, el("p", "p-tag", d.tagline), el("p", "p-blurb", d.blurb), el("h3", "", "On this tape"));
  if (d.works.length) {
    const ol = el("ol", "works");
    d.works.forEach(w => {
      const li = el("li"); li.append(el("b", "", w.title), el("span", "meta", [w.year, w.role].filter(Boolean).join(" · ")), el("p", "", w.text));
      const yt = w.link && w.link.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/shorts\/)([\w-]{11})/);
      if (yt) { const f = el("iframe", "yt"); f.src = "https://www.youtube-nocookie.com/embed/" + yt[1]; f.title = w.title; f.loading = "lazy"; f.allow = "accelerometer; encrypted-media; picture-in-picture; fullscreen"; f.allowFullscreen = true; li.append(f); }
      if (w.link) { const a = el("a", "btn", w.linkLabel || (yt ? "▶ Watch on YouTube" : "▶ Watch")); a.href = w.link; a.target = "_blank"; a.rel = "noopener"; li.append(a); }
      else li.append(el("span", "out", "Tape checked out — ask at the counter"));
      ol.append(li);
    });
    body.append(ol);
  }
  if (d.photos && d.photos.length) {
    const grid = el("div", "photos");
    d.photos.forEach(p => { const f = el("figure"), im = new Image(); im.src = p.src; im.alt = p.caption || "Photograph by " + D.owner.name; im.loading = "lazy"; f.append(im, el("figcaption", "", p.caption || "")); grid.append(f); });
    body.append(grid);
  } else if (!d.works.length) body.append(el("p", "out", d.empty || ""));
  drawCassette(d, 0); clearInterval(spin); if (!reduce) spin = setInterval(() => drawCassette(d, performance.now() / 1000), 80);
  dlg.showModal(); dlg.scrollTop = 0;
}
dlg.addEventListener("close", () => { clearInterval(spin); body.replaceChildren(); });
$("#close").onclick = () => dlg.close();
dlg.addEventListener("click", e => { if (e.target === dlg) dlg.close(); });
