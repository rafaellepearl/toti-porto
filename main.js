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
  scene.background = new THREE.Color("#0c1440");
  const camera = new THREE.PerspectiveCamera(55, 1, 0.05, 140);

  // ---------- materials & builders ----------
  // No lights: every box gets six fixed shades of its colour, plus an ink outline. Flat, like a comic panel.
  const SHADE = [.86, .86, 1.05, .68, 1, .92], cache = {};
  const flat = c => cache[c] || (cache[c] = new THREE.MeshBasicMaterial({ color: c }));
  const shaded = c => cache["s" + c] || (cache["s" + c] = SHADE.map(k => new THREE.MeshBasicMaterial({ color: new THREE.Color(c).multiplyScalar(k) })));
  const inkLine = new THREE.LineBasicMaterial({ color: INK });
  const tex = cv => { const t = new THREE.CanvasTexture(cv); t.colorSpace = THREE.SRGBColorSpace; t.anisotropy = 8; return t; };
  const mapped = t => new THREE.MeshBasicMaterial({ map: t });
  const withFaces = (c, t, faces) => { const m = shaded(c).slice(); faces.forEach(f => m[f] = mapped(t)); return m; };
  function box(w, h, d, c, x, y, z, o = {}) {
    const geo = new THREE.BoxGeometry(w, h, d), m = new THREE.Mesh(geo, o.mat || shaded(c));
    m.position.set(x, y, z); (o.parent || scene).add(m);
    if (o.edges !== false) m.add(new THREE.LineSegments(new THREE.EdgesGeometry(geo), inkLine));
    return m;
  }
  const ball = (r, c, x, y, z, parent = scene) => { const m = new THREE.Mesh(new THREE.SphereGeometry(r, 18, 12), flat(c)); m.position.set(x, y, z); parent.add(m); return m; };
  let seed = 11; const rnd = () => { seed = seed + 0x6D2B79F5 | 0; let t = Math.imul(seed ^ seed >>> 15, 1 | seed); t = t + Math.imul(t ^ t >>> 7, 61 | t) ^ t; return ((t ^ t >>> 14) >>> 0) / 4294967296; };

  // ---------- outside, at night ----------
  box(90, .1, 50, "#161d3a", 0, -.05, 22, { edges: false });
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
    g.fillStyle = "#ffe9a0"; g.fillRect(0, 0, 512, 256);
    for (let r = 0; r < 3; r++) { for (let i = 0; i < 34; i++) { g.fillStyle = cols[rnd() * 8 | 0]; g.fillRect(6 + i * 15, 12 + r * 82, 12, 62); } g.fillStyle = INK; g.fillRect(0, 76 + r * 82, 512, 8); }
    g.strokeStyle = INK; g.lineWidth = 12; g.strokeRect(0, 0, 512, 256); g.fillRect(250, 0, 12, 256);
    const t = tex(cv); for (const x of [-2.95, 2.95]) box(3.1, 1.55, .06, INK, x, 1.55, .15, { mat: withFaces(INK, t, [4]) });
  }
  const signMat = mapped(tex(paintSign(mk(), "TOTI VIDEO", INK, YEL, 1024, 222)));
  { const m = shaded(INK).slice(); m[4] = signMat; box(6.2, 1.35, .3, INK, 0, 5.4, .2, { mat: m }); box(.12, .5, .12, INK, -2.4, 4.7, .2, { edges: false }); box(.12, .5, .12, INK, 2.4, 4.7, .2, { edges: false }); }
  const glass = new THREE.MeshBasicMaterial({ color: SKY, transparent: true, opacity: .45 });
  const doorL = box(.9, 2.7, .06, SKY, -.45, 1.35, 0, { mat: glass }), doorR = box(.9, 2.7, .06, SKY, .45, 1.35, 0, { mat: glass });

  // ---------- inside ----------
  {
    const cv = mk(); cv.width = cv.height = 64; const g = cv.getContext("2d");
    g.fillStyle = CREAM; g.fillRect(0, 0, 64, 64); g.fillStyle = RED; g.fillRect(0, 0, 32, 32); g.fillRect(32, 32, 32, 32);
    const t = tex(cv); t.wrapS = t.wrapT = THREE.RepeatWrapping; t.repeat.set(5, 8.5); t.magFilter = THREE.NearestFilter;
    box(10, .1, 17, CREAM, 0, -.05, -8.5, { mat: withFaces(CREAM, t, [2]), edges: false });
  }
  box(10, .1, 17, CREAM, 0, 4.25, -8.5, { edges: false });
  for (const s of [-1, 1]) { box(.2, 4.2, 17, YEL, s * 5.1, 2.1, -8.5); box(.22, .3, 17, RED, s * 5.09, 3.85, -8.5, { edges: false }); }
  box(10, 4.2, .2, SKY, 0, 2.1, -17.1);
  for (const z of [-2.5, -6, -9.5, -13]) for (const x of [-2.3, 2.3]) box(1.3, .06, 2.2, "#ffffff", x, 4.17, z, { mat: flat("#ffffff") });

  // which tape lives where: alternating left / right down the aisle
  const spot = i => ({ s: i % 2 ? 1 : -1, z: -3.2 - i * 1.75 });
  const ROWS = [.25, 1.3, 2.35];

  // the lemari: two long shelving units, packed spine-out
  {
    const geo = new THREE.BoxGeometry(.5, .86, .12), grey = SHADE.map(k => new THREE.MeshBasicMaterial({ color: new THREE.Color(k, k, k) }));
    const im = new THREE.InstancedMesh(geo, grey, 700), o = new THREE.Object3D(), col = new THREE.Color();
    const cols = [RED, YEL, BLUE, GREEN, ORANGE, CREAM, SKY, "#f0f0f0", "#2b2926", "#ff9fb0", "#8a4fd0"];
    let n = 0;
    for (const s of [-1, 1]) {
      const c = s < 0 ? BLUE : GREEN;
      box(.08, 3.6, 13.3, c, s * 4.95, 1.95, -8.5);
      for (const y of [...ROWS, 3.4]) box(.68, .07, 13.3, c, s * 4.62, y, -8.5);
      for (const z of [-1.85, -15.15]) box(.68, 3.6, .08, c, s * 4.62, 1.95, z);
      ROWS.forEach((y, r) => {
        for (let z = -2.02; z > -15.05; z -= .135) {
          if (r === 1 && D.tapes.some((_, i) => spot(i).s === s && Math.abs(spot(i).z - z) < .5)) continue;
          if (rnd() < .05 || n >= 700) continue;
          o.position.set(s * 4.6, y + .035 + .43, z); o.rotation.set(rnd() < .07 ? (rnd() - .5) * .45 : 0, 0, 0); o.updateMatrix();
          im.setMatrixAt(n, o.matrix); im.setColorAt(n, col.set(cols[rnd() * cols.length | 0])); n++;
        }
      });
    }
    im.count = n; im.instanceMatrix.needsUpdate = true; if (im.instanceColor) im.instanceColor.needsUpdate = true;
    scene.add(im);
  }

  // the seven tapes
  const insideTex = tex(paintSign(mk(), "BE KIND · REWIND", CREAM, RED, 512, 854));
  const tapes = [], signs = [];
  D.tapes.forEach((d, i) => {
    const { s, z } = spot(i), g = new THREE.Group();
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
    g.position.set(s * 4.3, ROWS[1] + .035 + .45, z); g.rotation.y = -s * Math.PI / 2;
    g.userData = { i, pivot, cas, reels, home: g.position.clone(), homeQ: g.quaternion.clone(), grow: 1 };
    scene.add(g); tapes.push(g);
    // a genre sign swinging above it
    const hang = new THREE.Group(); hang.position.set(s * 4.1, 4.2, z); hang.rotation.y = -s * Math.PI / 2; scene.add(hang);
    const st = tex(paintSign(mk(), d.genre.toUpperCase(), d.colors.bg, d.colors.fg));
    box(1.5, .42, .05, INK, 0, -1.72, 0, { parent: hang, mat: withFaces(INK, st, [4, 5]) });
    for (const x of [-.6, .6]) box(.016, 1.52, .016, INK, x, -.76, 0, { parent: hang, edges: false });
    signs.push(hang);
  });

  // ceiling fans
  const fans = [-5, -11].map(z => {
    const f = new THREE.Group(); f.position.set(0, 3.95, z); scene.add(f);
    box(.08, .3, .08, INK, 0, .15, 0, { parent: f, edges: false }); box(.3, .14, .3, INK, 0, 0, 0, { parent: f });
    for (let k = 0; k < 4; k++) { const a = new THREE.Group(); a.rotation.y = k * Math.PI / 2; f.add(a); box(1.5, .03, .26, ORANGE, .9, 0, 0, { parent: a }); }
    return f;
  });

  // the counter at the back
  box(5.6, 1.1, .9, ORANGE, 0, .55, -15.9); box(5.8, .08, 1.05, CREAM, 0, 1.14, -15.9);
  box(1.3, 1.0, .9, INK, -1.6, 1.7, -15.9);
  const tvCv = mk(); tvCv.width = 256; tvCv.height = 192; const tvG = tvCv.getContext("2d"), tvTex = tex(tvCv);
  box(1.02, .76, .02, INK, -1.6, 1.73, -15.44, { mat: withFaces(INK, tvTex, [4]) });
  box(.7, .34, .5, RED, 1.5, 1.35, -15.9); box(.5, .26, .08, CREAM, 1.5, 1.66, -15.8);
  box(6.4, 1.0, .06, RED, 0, 3.3, -16.97, { mat: withFaces(RED, tex(paintSign(mk(), "BE KIND · REWIND", RED, CREAM, 1024, 160)), [4]) });
  const balloons = [[2.5, RED], [2.85, YEL], [3.2, BLUE]].map(([x, c], k) => {
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
    stops = [
      { kind: "hero", id: "top", p: V(0, 1.7, portrait ? 15 : 10.5), l: V(0, 2.8, 0) },
      { kind: "enter", id: "enter", p: V(0, 1.75, -.6), l: V(0, 1.7, -10) },
      ...D.tapes.map((d, i) => { const { s, z } = spot(i), y = ROWS[1] + .5; return { kind: "tape", id: d.id, i, p: V(s * (portrait ? 1.5 : 2.05), y, z), l: V(s * 4.3, y + (portrait ? -.25 : 0), z) }; }),
      { kind: "counter", id: "counter", p: V(0, 1.7, -12.6), l: V(0, 1.75, -17) }
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
        if (w.link) { const a = el("a", "btn", "▶ Watch"); a.href = w.link; a.target = "_blank"; a.rel = "noopener"; li.append(a); } else li.append(el("span", "out", "Tape checked out — ask at the counter"));
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
    if (out) return; out = { tape: tapes[i], k: 0, lid: 0, dir: 1 };
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
    ps += (p - ps) * (reduce ? 1 : Math.min(1, dt * 4));
    const n = Math.min(stops.length - 2, Math.floor(ps)), e = ease(ps - n), A = stops[n], B = stops[n + 1], mid = Math.sin(Math.PI * e);
    camera.position.lerpVectors(A.p, B.p, e); look.lerpVectors(A.l, B.l, e);
    if (n >= 1) look.z -= 2.8 * mid;                                          // glance down the aisle while crossing it
    if (!reduce) camera.position.y += Math.abs(Math.sin(ps * Math.PI * 5)) * .04 * mid;   // footsteps
    sx += (mx - sx) * .06; sy += (my - sy) * .06; par += ((out ? 0 : 1) - par) * .08;
    camera.lookAt(look); camera.rotateY(-sx * .1 * par); camera.rotateX(-sy * .06 * par); camera.updateMatrixWorld();
    setActive(Math.abs(ps - Math.round(ps)) < .3 ? Math.round(ps) : -1);

    // doors, neon, fans, signs, balloons, robot, dust, TV
    const door = ease(clamp((ps - .2) / .45)); doorL.position.x = -.45 - .9 * door; doorR.position.x = .45 + .9 * door;
    signMat.color.setScalar(!reduce && (Math.sin(t * 9) > .95 || Math.sin(t * 1.3) > .985) ? .45 : 1);
    if (!reduce) {
      fans.forEach((f, k) => f.rotation.y += dt * (3 + k));
      signs.forEach((s, k) => s.rotation.z = Math.sin(t * 1.4 + k * 1.7) * .06);
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
      const s = spot(i).s, on = i === facing || i === hover;
      u.grow += ((i === hover ? 1.1 : 1) - u.grow) * .15; g.scale.setScalar(u.grow);
      g.position.copy(u.home); g.rotation.set(0, -s * Math.PI / 2, 0);
      if (on && !reduce) { g.position.y += Math.sin(t * 2.4) * .015 + .01; g.position.x -= s * .06; g.rotation.y += Math.sin(t * 1.7) * .16; g.rotation.z = Math.sin(t * 2.1) * .03; }
    });

    // the tape in your hands
    if (out) {
      const g = out.tape, u = g.userData;
      if (out.dir > 0) { out.k = clamp(out.k + dt / .9); if (out.k === 1) out.lid = clamp(out.lid + dt / .7); }
      else { out.lid = clamp(out.lid - dt / .35); if (out.lid === 0) out.k = clamp(out.k - dt / .7); }
      if (reduce) { out.k = out.lid = out.dir > 0 ? 1 : 0; }
      const k = ease(out.k), lid = ease(out.lid);
      tgt.set(portrait ? 0 : -.5, portrait ? .62 : 0, portrait ? -1.75 : -1.35); camera.localToWorld(tgt);
      eu.set(reduce ? 0 : Math.sin(t * 1.1) * .05, .3 * lid + (reduce ? 0 : Math.sin(t * .8) * .07), 0);
      tq.copy(camera.quaternion).multiply(q2.setFromEuler(eu));
      g.position.lerpVectors(u.home, tgt, k); g.position.y += Math.sin(Math.PI * k) * .25;
      g.quaternion.slerpQuaternions(u.homeQ, tq, k).multiply(q2.setFromAxisAngle(UP, Math.PI * 2 * k));
      g.scale.setScalar(1);
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
