/* TOTI VIDEO — the 3D store. Geometry is boxes, textures are painted on canvas (covers.js). */
import * as THREE from "three";
import { paintCover, paintSign, INK, CREAM, RED, YEL, BLUE, GREEN, ORANGE, SKY } from "./covers.js";

const D = window.DATA, $ = s => document.querySelector(s);
const reduce = matchMedia("(prefers-reduced-motion: reduce)").matches;
const V = (x, y, z) => new THREE.Vector3(x, y, z);
const clamp = (v, a = 0, b = 1) => Math.max(a, Math.min(b, v));
const ease = k => k * k * (3 - 2 * k);
const mk = () => document.createElement("canvas");
const el = (tag, cls, text) => { const e = document.createElement(tag); if (cls) e.className = cls; if (text != null) e.textContent = text; return e; };

start().catch(err => { console.error(err); document.body.classList.add("no3d"); });

async function start() {
  // cover lettering needs the fonts; don't wait forever for them
  await Promise.race([
    Promise.all(['40px "Bowlby One"', "40px Anton", '40px "Space Mono"', "40px VT323"].map(f => document.fonts.load(f))).catch(() => {}),
    new Promise(r => setTimeout(r, 2500))
  ]);

  const renderer = new THREE.WebGLRenderer({ canvas: $("#gl"), antialias: true });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
  const scene = new THREE.Scene();
  scene.background = new THREE.Color("#1b2f6b");
  const camera = new THREE.PerspectiveCamera(55, 1, 0.05, 140);

  // ---------- materials & builders ----------
  // No lights: every box gets six fixed shades of its colour, plus an ink outline. Flat, like a comic panel.
  const SHADE = [.93, .93, 1, .84, 1, .96], cache = {};   // ligne claire: nearly flat
  const hullMat = new THREE.MeshBasicMaterial({ color: INK, side: THREE.BackSide });
  const flat = c => cache[c] || (cache[c] = new THREE.MeshBasicMaterial({ color: c }));
  const shaded = c => cache["s" + c] || (cache["s" + c] = SHADE.map(k => new THREE.MeshBasicMaterial({ color: new THREE.Color(c).multiplyScalar(k) })));
  const inkLine = new THREE.LineBasicMaterial({ color: INK });
  const tex = cv => { const t = new THREE.CanvasTexture(cv); t.colorSpace = THREE.SRGBColorSpace; t.anisotropy = 8; return t; };
  const mapped = t => new THREE.MeshBasicMaterial({ map: t });
  const withFaces = (c, t, faces) => { const m = shaded(c).slice(); faces.forEach(f => m[f] = mapped(t)); return m; };
  function box(w, h, d, c, x, y, z, o = {}) {
    const geo = new THREE.BoxGeometry(w, h, d), m = new THREE.Mesh(geo, o.mat || shaded(c));
    m.position.set(x, y, z); (o.parent || scene).add(m);
    if (o.edges !== false) {
      m.add(new THREE.LineSegments(new THREE.EdgesGeometry(geo), inkLine));
      // a slightly larger inside-out copy in ink gives every object one even, bold outline
      if (o.hull !== false && Math.max(w, h, d) < 7) { const k = new THREE.Mesh(geo, hullMat); k.scale.set(1 + .03 / w, 1 + .03 / h, 1 + .03 / d); m.add(k); }
    }
    return m;
  }
  const ball = (r, c, x, y, z, parent = scene) => { const m = new THREE.Mesh(new THREE.SphereGeometry(r, 18, 12), flat(c)); m.position.set(x, y, z); parent.add(m); return m; };
  let seed = 11; const rnd = () => { seed = seed + 0x6D2B79F5 | 0; let t = Math.imul(seed ^ seed >>> 15, 1 | seed); t = t + Math.imul(t ^ t >>> 7, 61 | t) ^ t; return ((t ^ t >>> 14) >>> 0) / 4294967296; };

  // ---------- outside, at night ----------
  box(140, .1, 90, "#2b4384", 0, -.05, 0, { edges: false });
  // mesas on the horizon
  [[-34, 15, 10], [-17, 9, 8], [10, 12, 9], [26, 18, 11], [44, 10, 9]].forEach(([x, h, w], k) => {
    const c = k % 2 ? "#d9703a" : "#e9a06a"; box(w, h, 6, c, x, h / 2, -46); box(w * .55, h * .22, 5, c, x + w * .12, h * 1.11, -46);
  });
  for (let i = -3; i <= 3; i++) box(.14, .02, 5, YEL, i * 2.7, .01, 6.5, { edges: false });
  {
    const n = 320, a = new Float32Array(n * 3);
    for (let i = 0; i < n; i++) { a[i * 3] = (rnd() - .5) * 150; a[i * 3 + 1] = 5 + rnd() * 50; a[i * 3 + 2] = -30 - rnd() * 30; }
    const g = new THREE.BufferGeometry(); g.setAttribute("position", new THREE.BufferAttribute(a, 3));
    scene.add(new THREE.Points(g, new THREE.PointsMaterial({ color: CREAM, size: .35 })));
  }
  ball(3.2, CREAM, -17, 19, -40);
  box(.14, 5.2, .14, INK, -7.2, 2.6, 4, { edges: false }); ball(.32, YEL, -7.2, 5.3, 4);
  // facade
  box(4.1, 4.2, .25, RED, -2.95, 2.1, 0); box(4.1, 4.2, .25, RED, 2.95, 2.1, 0); box(1.8, 1.5, .25, RED, 0, 3.45, 0);
  box(10.8, .3, 17.8, BLUE, 0, 4.4, -8.5);
  {
    const cv = mk(); cv.width = 512; cv.height = 64; const g = cv.getContext("2d");
    for (let i = 0; i < 16; i++) { g.fillStyle = i % 2 ? CREAM : YEL; g.fillRect(i * 32, 0, 32, 64); }
    const t = tex(cv); box(10.4, .4, 1.1, YEL, 0, 3.0, .6, { mat: withFaces(YEL, t, [2, 3, 4]) });
  }
  {
    const cv = mk(); cv.width = 512; cv.height = 256; const g = cv.getContext("2d"), cols = [RED, YEL, BLUE, GREEN, ORANGE, CREAM, INK, SKY];
    g.fillStyle = "#fbeeb4"; g.fillRect(0, 0, 512, 256);
    for (let r = 0; r < 3; r++) { for (let i = 0; i < 34; i++) { g.fillStyle = cols[rnd() * 8 | 0]; g.fillRect(6 + i * 15, 12 + r * 82, 12, 62); } g.fillStyle = INK; g.fillRect(0, 76 + r * 82, 512, 8); }
    g.strokeStyle = INK; g.lineWidth = 12; g.strokeRect(0, 0, 512, 256); g.fillRect(250, 0, 12, 256);
    const t = tex(cv); for (const x of [-2.95, 2.95]) box(3.1, 1.55, .06, INK, x, 1.55, .15, { mat: withFaces(INK, t, [4]) });
  }
  const signMat = mapped(tex(paintSign(mk(), "TOTI VIDEO", INK, YEL, 1024, 222)));
  { const m = shaded(INK).slice(); m[4] = signMat; box(6.2, 1.35, .3, INK, 0, 5.4, .2, { mat: m }); box(.12, .5, .12, INK, -2.4, 4.7, .2, { edges: false }); box(.12, .5, .12, INK, 2.4, 4.7, .2, { edges: false }); }
  const glass = new THREE.MeshBasicMaterial({ color: SKY, transparent: true, opacity: .45 });
  const doorL = box(.9, 2.7, .06, SKY, -.45, 1.35, 0, { mat: glass, hull: false }), doorR = box(.9, 2.7, .06, SKY, .45, 1.35, 0, { mat: glass, hull: false });

  // ---------- inside ----------
  {
    // floor: flat sand tiles, each drawn with a thin ink line and a little hatching
    const cv = mk(); cv.width = cv.height = 128; const g = cv.getContext("2d");
    g.fillStyle = "#ecd9a6"; g.fillRect(0, 0, 128, 128); g.strokeStyle = INK; g.lineWidth = 3; g.strokeRect(0, 0, 128, 128);
    g.lineWidth = 1.5; for (let i = 0; i < 4; i++) { g.beginPath(); g.moveTo(88 + i * 8, 118); g.lineTo(98 + i * 8, 100); g.stroke(); }
    const t = tex(cv); t.wrapS = t.wrapT = THREE.RepeatWrapping; t.repeat.set(7, 12);
    box(10, .1, 17, "#ecd9a6", 0, -.05, -8.5, { mat: withFaces("#ecd9a6", t, [2]), edges: false });
  }
  box(10, .1, 17, CREAM, 0, 4.25, -8.5, { edges: false });
  {
    // walls: one flat colour, a skirting line, and pen hatching where the ceiling throws shadow
    const wallTex = (c, rx) => {
      const cv = mk(); cv.width = cv.height = 256; const g = cv.getContext("2d");
      g.fillStyle = c; g.fillRect(0, 0, 256, 256); g.strokeStyle = INK; g.lineWidth = 1.5;
      for (let x = 0; x < 270; x += 8) { g.beginPath(); g.moveTo(x, 0); g.lineTo(x - 10, 18 + (x * 7) % 16); g.stroke(); }
      g.lineWidth = 4; g.beginPath(); g.moveTo(0, 238); g.lineTo(256, 238); g.stroke();
      const t = tex(cv); t.wrapS = THREE.RepeatWrapping; t.repeat.set(rx, 1); return t;
    };
    const side = wallTex("#f3c9a8", 6);
    for (const s of [-1, 1]) box(.2, 4.2, 17, "#f3c9a8", s * 5.1, 2.1, -8.5, { mat: withFaces("#f3c9a8", side, [0, 1]) });
    box(10, 4.2, .2, SKY, 0, 2.1, -17.1, { mat: withFaces(SKY, wallTex(SKY, 4), [4]) });
  }
  for (const z of [-2.5, -6, -9.5, -13]) for (const x of [-2.3, 2.3]) box(1.3, .06, 2.2, "#ffffff", x, 4.17, z, { mat: flat("#ffffff") });

  // the seven tapes stand face-out on the wall behind the counter, so you can see them all without moving
  const tapePos = i => i < 4 ? V(-1.65 + i * 1.1, 2.95, -16.6) : V(-1.1 + (i - 4) * 1.1, 1.85, -16.6);
  const ROWS = [.25, 1.3, 2.35];

  // the lemari: two long shelving units down the sides, packed spine-out
  {
    const geo = new THREE.BoxGeometry(.5, .86, .12), grey = SHADE.map(k => new THREE.MeshBasicMaterial({ color: new THREE.Color(k, k, k) }));
    const im = new THREE.InstancedMesh(geo, grey, 700), o = new THREE.Object3D(), col = new THREE.Color();
    const cols = [RED, YEL, BLUE, GREEN, ORANGE, CREAM, SKY, "#e9b6a0", "#3a3835", "#c9dba0", "#f3c9a8"];
    let n = 0;
    for (const s of [-1, 1]) {
      const c = s < 0 ? BLUE : GREEN;
      box(.08, 3.6, 13.3, c, s * 4.95, 1.95, -8.5);
      for (const y of [...ROWS, 3.4]) box(.68, .07, 13.3, c, s * 4.62, y, -8.5);
      for (const z of [-1.85, -15.15]) box(.68, 3.6, .08, c, s * 4.62, 1.95, z);
      ROWS.forEach(y => {
        for (let z = -2.02; z > -15.05; z -= .135) {
          if (rnd() < .05 || n >= 700) continue;
          o.position.set(s * 4.6, y + .035 + .43, z); o.rotation.set(rnd() < .07 ? (rnd() - .5) * .45 : 0, 0, 0); o.updateMatrix();
          im.setMatrixAt(n, o.matrix); im.setColorAt(n, col.set(cols[rnd() * cols.length | 0])); n++;
        }
      });
    }
    im.count = n; im.instanceMatrix.needsUpdate = true; if (im.instanceColor) im.instanceColor.needsUpdate = true;
    scene.add(im);
  }
  // the display unit on the back wall
  box(4.7, 2.5, .08, BLUE, 0, 2.5, -16.96);
  for (const y of [1.33, 2.43, 3.55]) box(4.7, .07, .5, BLUE, 0, y, -16.75);
  for (const x of [-2.35, 2.35]) box(.08, 2.3, .5, BLUE, x, 2.44, -16.75);
  box(2.6, .42, .06, YEL, 0, 3.86, -16.9, { mat: withFaces(YEL, tex(paintSign(mk(), "NOW RENTING", YEL, INK, 512, 84)), [4]) });

  // the seven tapes
  const insideTex = tex(paintSign(mk(), "BE KIND · REWIND", CREAM, RED, 512, 854));
  const tapes = [];
  D.tapes.forEach((d, i) => {
    const g = new THREE.Group();
    box(.54, .9, .1, INK, 0, 0, -.01, { parent: g });
    const pivot = new THREE.Group(); pivot.position.set(-.27, 0, .04); g.add(pivot);
    const lm = shaded(INK).slice(); lm[4] = mapped(tex(paintCover(mk(), d))); lm[5] = mapped(insideTex);
    box(.54, .9, .02, INK, .27, 0, .01, { parent: pivot, mat: lm });
    const cas = new THREE.Group(); cas.visible = false; g.add(cas);
    box(.44, .27, .05, "#2b2926", 0, 0, 0, { parent: cas });
    box(.32, .07, .054, CREAM, 0, -.075, 0, { parent: cas, edges: false });
    const reels = [-.1, .1].map(x => {
      const r = new THREE.Mesh(new THREE.CylinderGeometry(.048, .048, .056, 20), flat(CREAM));
      r.rotation.x = Math.PI / 2; r.position.set(x, .035, 0); cas.add(r);
      box(.085, .058, .014, INK, 0, 0, 0, { parent: r, edges: false }); box(.014, .058, .085, INK, 0, 0, 0, { parent: r, edges: false });
      return r;
    });
    g.position.copy(tapePos(i));
    g.userData = { i, pivot, cas, reels, home: g.position.clone(), homeQ: g.quaternion.clone(), pop: 0 };
    scene.add(g); tapes.push(g);
  });

  // ceiling fans
  const fans = [-5, -11].map(z => {
    const f = new THREE.Group(); f.position.set(0, 3.95, z); scene.add(f);
    box(.08, .3, .08, INK, 0, .15, 0, { parent: f, edges: false }); box(.3, .14, .3, INK, 0, 0, 0, { parent: f });
    for (let k = 0; k < 4; k++) { const a = new THREE.Group(); a.rotation.y = k * Math.PI / 2; f.add(a); box(1.5, .03, .26, ORANGE, .9, 0, 0, { parent: a }); }
    return f;
  });

  // the counter at the back
  box(7.6, 1.1, .9, ORANGE, 0, .55, -15.9, { mat: withFaces(ORANGE, tex(paintSign(mk(), "BE KIND · REWIND", ORANGE, INK, 1024, 148)), [4]) });
  box(7.8, .08, 1.05, CREAM, 0, 1.14, -15.9);
  box(1.2, 1.0, .9, INK, -3.15, 1.68, -15.9);
  const tvCv = mk(); tvCv.width = 256; tvCv.height = 192; const tvG = tvCv.getContext("2d"), tvTex = tex(tvCv);
  box(.94, .72, .02, INK, -3.15, 1.7, -15.44, { mat: withFaces(INK, tvTex, [4]) });
  box(.7, .34, .5, RED, 3.0, 1.35, -15.9); box(.5, .26, .08, CREAM, 3.0, 1.66, -15.8);
  const balloons = [[3.5, RED], [3.75, YEL], [4.0, BLUE]].map(([x, c], k) => {
    const b = new THREE.Group(); b.position.set(x, 2.5 + k * .22, -15.7); scene.add(b);
    const m = ball(.3, c, 0, 0, 0, b); m.scale.y = 1.2; box(.012, 1.4, .012, INK, 0, -1.05, 0, { parent: b, edges: false });
    return b;
  });
  // a floor-cleaning robot doing its rounds
  const bot = new THREE.Group(); scene.add(bot);
  { const c = new THREE.Mesh(new THREE.CylinderGeometry(.3, .3, .14, 24), flat(GREEN)); c.position.y = .09; bot.add(c);
    const top = new THREE.Mesh(new THREE.CylinderGeometry(.2, .2, .04, 24), flat(YEL)); top.position.y = .18; bot.add(top);
    for (const x of [-.1, .1]) { ball(.06, CREAM, x, .2, .16, bot); ball(.03, INK, x, .2, .21, bot); }
    box(.012, .3, .012, INK, 0, .34, -.1, { parent: bot, edges: false }); ball(.04, RED, 0, .5, -.1, bot); }
  // dust in the tube light
  const dustN = 260, dustA = new Float32Array(dustN * 3);
  for (let i = 0; i < dustN; i++) { dustA[i * 3] = (rnd() - .5) * 9; dustA[i * 3 + 1] = rnd() * 4; dustA[i * 3 + 2] = -rnd() * 17; }
  const dustGeo = new THREE.BufferGeometry(); dustGeo.setAttribute("position", new THREE.BufferAttribute(dustA, 3));
  scene.add(new THREE.Points(dustGeo, new THREE.PointsMaterial({ color: "#ffffff", size: .03, transparent: true, opacity: .8 })));

  // ---------- the walk: one stop per screen of scroll ----------
  let stops = [];
  const stopsEl = $("#stops"), dots = $("#dots");
  function layout() {
    const w = window.innerWidth, h = window.innerHeight, portrait = w / h < .85;
    renderer.setSize(w, h, false); camera.aspect = w / h; camera.fov = portrait ? 72 : 55; camera.updateProjectionMatrix();
    // one walk in a straight line, then the camera stays put: every tape and the counter share the same view
    const shelf = { p: V(0, 2.0, portrait ? -10.2 : -12.1), l: V(0, 2.3, -17) };
    stops = [
      { kind: "hero", id: "top", p: V(0, 1.7, portrait ? 15 : 10.5), l: V(0, 2.8, 0) },
      { kind: "enter", id: "enter", p: V(0, 1.8, -.6), l: V(0, 2.1, -17) },
      ...D.tapes.map((d, i) => ({ kind: "tape", id: d.id, i, p: shelf.p, l: shelf.l })),
      { kind: "counter", id: "front-desk", p: shelf.p, l: shelf.l }
    ];
  }
  layout(); addEventListener("resize", layout);
  stops.forEach((s, n) => {
    const sec = el("section", "stop"); sec.id = s.id; stopsEl.append(sec);
    const a = el("a"); a.href = "#" + s.id; a.setAttribute("aria-label", s.kind === "tape" ? D.tapes[s.i].name : s.kind === "hero" ? "Outside" : s.kind === "enter" ? "Entrance" : "Counter"); dots.append(a);
  });

  // ---------- text ----------
  $("#h-name").innerHTML = D.owner.name.replace(" ", "<br>"); $("#h-roles").textContent = D.owner.roles; $("#c-roles").textContent = D.owner.roles;
  $("#c-mail").textContent = D.owner.email; $("#c-mail").href = "mailto:" + D.owner.email; $("#c-tel").textContent = D.owner.phone; $("#c-tel").href = "tel:" + D.owner.tel;
  let active = -2;
  function setActive(n) {
    if (n === active) return; active = n; const s = stops[n];
    document.body.dataset.stop = s ? s.kind : "";
    [...dots.children].forEach((a, k) => a.classList.toggle("on", k === n));
    if (s && s.kind === "tape") { const d = D.tapes[s.i]; $("#cap-genre").textContent = d.genre; $("#cap-title").textContent = d.name; $("#cap-tag").textContent = d.tagline; }
  }
  const panel = $("#panel"), body = $("#panel-body");
  function fillPanel(d) {
    panel.style.setProperty("--bg", d.colors.bg); panel.style.setProperty("--fg", d.colors.fg); panel.style.setProperty("--acc", d.colors.acc);
    body.replaceChildren(el("p", "p-genre", d.genre + " · Toti Video"), el("h2", "", d.name), el("p", "p-tag", d.tagline), el("p", "p-blurb", d.blurb), el("h3", "", "On this tape"));
    if (d.works.length) {
      const ol = el("ol", "works");
      d.works.forEach(w => {
        const li = el("li"); li.append(el("b", "", w.title), el("span", "meta", [w.year, w.role].filter(Boolean).join(" · ")), el("p", "", w.text));
        const yt = w.link && w.link.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/shorts\/)([\w-]{11})/);
        if (yt) { const f = el("iframe", "yt"); f.src = "https://www.youtube-nocookie.com/embed/" + yt[1]; f.title = w.title; f.loading = "lazy"; f.allow = "accelerometer; encrypted-media; picture-in-picture; fullscreen"; f.allowFullscreen = true; li.append(f); }
        if (w.link) { const a = el("a", "btn", w.linkLabel || (yt ? "▶ Watch on YouTube" : "▶ Watch")); a.href = w.link; a.target = "_blank"; a.rel = "noopener"; li.append(a); } else li.append(el("span", "out", "Tape checked out — ask at the counter"));
        ol.append(li);
      });
      body.append(ol);
    }
    if (d.photos && d.photos.length) {
      const grid = el("div", "photos");
      d.photos.forEach(p => { const f = el("figure"), im = new Image(); im.src = p.src; im.alt = p.caption || "Photograph by " + D.owner.name; im.loading = "lazy"; f.append(im, el("figcaption", "", p.caption || "")); grid.append(f); });
      body.append(grid);
    } else if (!d.works.length) body.append(el("p", "out", d.empty || ""));
  }

  // ---------- taking a tape off the shelf ----------
  let out = null;   // { tape, k: flight 0..1, lid: 0..1, dir: 1 opening | -1 closing }
  function openTape(i) {
    if (out) return; out = { tape: tapes[i], k: 0, lid: 0, dir: 1, from: tapes[i].position.clone(), fromQ: tapes[i].quaternion.clone() };
    fillPanel(D.tapes[i]); panel.hidden = false; panel.scrollTop = 0;
    requestAnimationFrame(() => { panel.classList.add("show"); document.body.classList.add("opened"); });
    document.documentElement.style.overflow = "hidden"; $("#close").focus({ preventScroll: true });
  }
  function closeTape() {
    if (!out || out.dir < 0) return; out.dir = -1;
    panel.classList.remove("show"); document.body.classList.remove("opened"); document.documentElement.style.overflow = "";
    setTimeout(() => { if (!out) panel.hidden = true; }, 900);
  }
  $("#open").onclick = () => { const s = stops[active]; if (s && s.kind === "tape") openTape(s.i); };
  $("#close").onclick = closeTape;
  addEventListener("keydown", e => { if (e.key === "Escape") closeTape(); });

  // pointer: look around, hover, click
  const ray = new THREE.Raycaster(), ptr = new THREE.Vector2(9, 9); ray.params.Line.threshold = 0;
  let mx = 0, my = 0, sx = 0, sy = 0, par = 1, hover = -1, downAt = null;
  const pick = () => {
    ray.setFromCamera(ptr, camera);
    for (const h of ray.intersectObjects(tapes, true)) { if (!h.object.isMesh) continue; let o = h.object; while (o && o.userData.i === undefined) o = o.parent; if (o) return o.userData.i; }
    return -1;
  };
  addEventListener("pointermove", e => { mx = e.clientX / innerWidth * 2 - 1; my = e.clientY / innerHeight * 2 - 1; ptr.set(mx, -my); });
  addEventListener("pointerdown", e => { downAt = [e.clientX, e.clientY]; });
  addEventListener("pointerup", e => {
    if (!downAt || Math.hypot(e.clientX - downAt[0], e.clientY - downAt[1]) > 8 || (e.target.closest && e.target.closest(".ui"))) return;
    ptr.set(e.clientX / innerWidth * 2 - 1, -(e.clientY / innerHeight * 2 - 1));
    if (out) { closeTape(); return; }
    const i = pick(); if (i < 0) return;
    const s = stops[active]; if (s && s.kind === "tape" && s.i === i) openTape(i); else document.getElementById(D.tapes[i].id).scrollIntoView();
  });

  // VHS clock
  { const t0 = Date.now(), M = ["JAN", "FEB", "MAR", "APR", "MAY", "JUN", "JUL", "AUG", "SEP", "OCT", "NOV", "DEC"], p2 = n => String(n).padStart(2, "0");
    const tick = () => { const d = new Date(), h = d.getHours(), s = (Date.now() - t0) / 1000 | 0;
      $("#clock").textContent = `${h < 12 ? "AM" : "PM"} ${h % 12 || 12}:${p2(d.getMinutes())}  ${M[d.getMonth()]}. ${p2(d.getDate())} ${d.getFullYear()}`;
      $("#counter-time").textContent = `${s / 3600 | 0}:${p2((s / 60 | 0) % 60)}:${p2(s % 60)}`; };
    tick(); setInterval(tick, 1000); }

  // ---------- every frame ----------
  const clock = new THREE.Clock(), look = V(0, 0, 0), tgt = V(0, 0, 0), tq = new THREE.Quaternion(), q2 = new THREE.Quaternion(), eu = new THREE.Euler(), UP = V(0, 1, 0);
  let ps = window.scrollY / window.innerHeight, frameN = 0, bx = 60, by = 40, bvx = 1.6, bvy = 1.1;
  function frame() {
    requestAnimationFrame(frame);
    const dt = Math.min(clock.getDelta(), .05), t = clock.elapsedTime; frameN++;
    const portrait = camera.aspect < .85;

    // camera along the rail
    const p = clamp(window.scrollY / window.innerHeight, 0, stops.length - 1);
    ps += (p - ps) * (reduce ? 1 : Math.min(1, dt * 2.5));
    const n = Math.min(stops.length - 2, Math.floor(ps)), e = ease(ps - n), A = stops[n], B = stops[n + 1];
    camera.position.lerpVectors(A.p, B.p, e); look.lerpVectors(A.l, B.l, e);
    sx += (mx - sx) * .06; sy += (my - sy) * .06; par += ((out ? 0 : 1) - par) * .08;
    camera.lookAt(look); camera.rotateY(-sx * .02 * par); camera.rotateX(-sy * .012 * par); camera.updateMatrixWorld();
    setActive(Math.abs(ps - Math.round(ps)) < .3 ? Math.round(ps) : -1);

    // doors, neon, fans, signs, balloons, robot, dust, TV
    const door = ease(clamp((ps - .2) / .45)); doorL.position.x = -.45 - .9 * door; doorR.position.x = .45 + .9 * door;
    signMat.color.setScalar(!reduce && (Math.sin(t * 9) > .95 || Math.sin(t * 1.3) > .985) ? .45 : 1);
    if (!reduce) {
      fans.forEach(f => f.rotation.y += dt * 1.1);
      balloons.forEach((b, k) => { b.position.y = 2.5 + k * .22 + Math.sin(t * 1.2 + k) * .08; b.rotation.z = Math.sin(t * .9 + k * 2) * .08; });
      const rx = Math.sin(t * .31) * 1.1, rz = -8.5 + Math.sin(t * .17) * 5.5, dx = Math.cos(t * .31) * .31 * 1.1, dz = Math.cos(t * .17) * .17 * 5.5;
      bot.position.set(rx, 0, rz); bot.rotation.y = Math.atan2(dx, dz);
      for (let i = 0; i < dustN; i++) { dustA[i * 3 + 1] += dt * (.04 + (i % 7) * .012); dustA[i * 3] += Math.sin(t + i) * dt * .03; if (dustA[i * 3 + 1] > 4.1) dustA[i * 3 + 1] = 0; }
      dustGeo.attributes.position.needsUpdate = true;
    }
    if (frameN % 4 === 0) {
      [CREAM, YEL, SKY, GREEN, ORANGE, RED, BLUE].forEach((c, i) => { tvG.fillStyle = c; tvG.fillRect(i * 37, 0, 37, 192); });
      bx += bvx * 4; by += bvy * 4; if (bx < 0 || bx > 136) bvx *= -1; if (by < 0 || by > 142) bvy *= -1;
      tvG.fillStyle = INK; tvG.fillRect(bx, by, 120, 50); tvG.fillStyle = YEL; tvG.font = "34px VT323, monospace"; tvG.textBaseline = "middle"; tvG.textAlign = "center"; tvG.fillText("TOTI TV", bx + 60, by + 26);
      tvG.fillStyle = "rgba(255,255,255,.25)"; tvG.fillRect(0, (t * 60) % 192, 256, 6); tvTex.needsUpdate = true;
    }

    // tapes on the shelf: the one you're facing rocks, the one under the pointer grows
    if (frameN % 3 === 0 && !out && matchMedia("(hover: hover)").matches) { hover = pick(); document.body.style.cursor = hover >= 0 ? "pointer" : ""; }
    const facing = stops[active] && stops[active].kind === "tape" ? stops[active].i : -1;
    tapes.forEach((g, i) => {
      const u = g.userData; if (out && out.tape === g) return;
      u.pop += ((i === facing ? 1 : i === hover ? .35 : 0) - u.pop) * .08;       // the chosen tape eases forward; nothing else moves
      g.position.copy(u.home); g.position.z += .45 * u.pop; g.position.y += .04 * u.pop; g.scale.setScalar(1 + .16 * u.pop);
      g.rotation.set(0, i === facing && !reduce ? Math.sin(t * .8) * .05 * u.pop : 0, 0);
    });

    // the tape in your hands
    if (out) {
      const g = out.tape, u = g.userData;
      if (out.dir > 0) { out.k = clamp(out.k + dt / .9); if (out.k === 1) out.lid = clamp(out.lid + dt / .7); }
      else { out.lid = clamp(out.lid - dt / .35); if (out.lid === 0) out.k = clamp(out.k - dt / .7); }
      if (reduce) { out.k = out.lid = out.dir > 0 ? 1 : 0; }
      const k = ease(out.k), lid = ease(out.lid);
      tgt.set(portrait ? 0 : -.5, portrait ? .62 : 0, portrait ? -1.75 : -1.35); camera.localToWorld(tgt);
      eu.set(0, .3 * lid + (reduce ? 0 : Math.sin(t * .6) * .025), 0);
      tq.copy(camera.quaternion).multiply(q2.setFromEuler(eu));
      g.position.lerpVectors(out.from, tgt, k);
      g.quaternion.slerpQuaternions(out.fromQ, tq, k);
      g.scale.setScalar(1 + .16 * u.pop * (1 - k));
      u.pivot.rotation.y = -2.35 * lid;
      const c = ease(clamp((out.lid - .45) / .55)); u.cas.visible = out.lid > .3;
      u.cas.position.set(0, -.02 + .04 * c, .03 + .2 * c); u.cas.rotation.z = (1 - c) * .5; u.cas.scale.setScalar(.7 + .3 * c);
      u.reels.forEach(r => r.rotation.y += dt * 4);
      if (out.dir < 0 && out.k === 0) { u.cas.visible = false; u.pivot.rotation.y = 0; out = null; }
    }
    renderer.render(scene, camera);
  }
  frame();
}
