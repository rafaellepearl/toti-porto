(() => {
/* Cover paintings for the tapes — plain 2D canvas, later wrapped onto the 3D boxes.
   Each one is an original picture in the manner of a film genre. */
const INK = "#1b1a17", CREAM = "#f6ecd2", RED = "#e2452f", YEL = "#f4c542", BLUE = "#3d7dc4", GREEN = "#5fae7b", ORANGE = "#f08a4b", SKY = "#9ad4ea";
const DISP = '"Bowlby One", Impact, sans-serif', TALL = 'Anton, Impact, sans-serif', MONO = '"Space Mono", monospace', OSD = 'VT323, monospace';
const W = 512, H = 854;

const rng = s => () => { s |= 0; s = s + 0x6D2B79F5 | 0; let t = Math.imul(s ^ s >>> 15, 1 | s); t = t + Math.imul(t ^ t >>> 7, 61 | t) ^ t; return ((t ^ t >>> 14) >>> 0) / 4294967296; };
const P = (g, pts, fill, stroke = INK, lw = 5) => { g.beginPath(); pts.forEach((p, i) => i ? g.lineTo(p[0], p[1]) : g.moveTo(p[0], p[1])); g.closePath(); if (fill) { g.fillStyle = fill; g.fill(); } if (stroke) { g.strokeStyle = stroke; g.lineWidth = lw; g.lineJoin = "round"; g.stroke(); } };
const R = (g, x, y, w, h, fill, stroke = INK, lw = 5) => { if (fill) { g.fillStyle = fill; g.fillRect(x, y, w, h); } if (stroke) { g.strokeStyle = stroke; g.lineWidth = lw; g.strokeRect(x, y, w, h); } };
const O = (g, x, y, r, fill, stroke = INK, lw = 5) => { g.beginPath(); g.arc(x, y, r, 0, 7); if (fill) { g.fillStyle = fill; g.fill(); } if (stroke) { g.strokeStyle = stroke; g.lineWidth = lw; g.stroke(); } };
const L = (g, a, b, c, d, col = INK, lw = 4) => { g.beginPath(); g.moveTo(a, b); g.lineTo(c, d); g.strokeStyle = col; g.lineWidth = lw; g.lineCap = "round"; g.stroke(); };
// text that shrinks to fit a width
const T = (g, s, x, y, size, font, fill, o = {}) => {
  g.font = `${size}px ${font}`; g.textAlign = o.align || "center"; g.textBaseline = "middle";
  if (o.max) { const w = g.measureText(s).width; if (w > o.max) { size *= o.max / w; g.font = `${size}px ${font}`; } }
  if (o.extrude) for (let i = o.extrude; i > 0; i--) { g.fillStyle = o.exCol || INK; g.fillText(s, x + i, y + i); }
  if (o.stroke) { g.strokeStyle = o.stroke; g.lineWidth = o.lw || 8; g.lineJoin = "round"; g.strokeText(s, x, y); }
  g.fillStyle = fill; g.fillText(s, x, y);
};
const rays = (g, cx, cy, n, r, col) => { g.fillStyle = col; for (let i = 0; i < n; i += 2) { const a = i * Math.PI * 2 / n, b = (i + 1) * Math.PI * 2 / n; g.beginPath(); g.moveTo(cx, cy); g.lineTo(cx + Math.cos(a) * r, cy + Math.sin(a) * r); g.lineTo(cx + Math.cos(b) * r, cy + Math.sin(b) * r); g.fill(); } };
// a small person; opts: arms up, tripod
const person = (g, x, y, s, col = INK, o = {}) => {
  P(g, [[x - s * .16, y], [x - s * .13, y - s * .62], [x + s * .13, y - s * .62], [x + s * .16, y]], col, null);
  O(g, x, y - s * .76, s * .12, col, null);
  if (o.up) { L(g, x - s * .1, y - s * .58, x - s * .34, y - s * .98, col, s * .08); L(g, x + s * .1, y - s * .58, x + s * .34, y - s * .98, col, s * .08); }
  if (o.tripod) { const tx = x + s * .5; L(g, tx, y - s * .6, tx - s * .16, y, col, s * .04); L(g, tx, y - s * .6, tx + s * .16, y, col, s * .04); L(g, tx, y - s * .6, tx, y, col, s * .04); R(g, tx - s * .14, y - s * .78, s * .28, s * .18, col, null); L(g, x + s * .1, y - s * .5, tx - s * .1, y - s * .66, col, s * .06); }
};

const ART = {
  adventure(g, t) {
    R(g, 0, 0, W, H, ORANGE, null); rays(g, 256, 500, 28, 900, "#f5a05f");
    O(g, 256, 500, 150, YEL);
    // stepped temple
    for (let i = 0; i < 5; i++) R(g, 256 - 210 + i * 36, 690 - (i + 1) * 46, 420 - i * 72, 46, i % 2 ? "#4a9667" : GREEN);
    R(g, 226, 414, 60, 46, YEL); R(g, 232, 644, 48, 46, INK, null); for (let i = 0; i < 5; i++) L(g, 256, 690 - i * 46, 256, 690 - (i + 1) * 46 + 46, INK, 3);
    // jungle
    for (const [x, d] of [[0, 1], [W, -1]]) for (let i = 0; i < 5; i++) P(g, [[x, 560 + i * 40], [x + d * (170 - i * 14), 520 + i * 52], [x, 640 + i * 40]], i % 2 ? "#3a7d55" : "#4a9667");
    R(g, 0, 690, W, 164, "#b5713f", null); L(g, 0, 690, W, 690, INK, 5);
    // the dotted route and the X
    g.setLineDash([16, 14]); g.beginPath(); g.moveTo(40, 830); g.bezierCurveTo(180, 700, 330, 860, 420, 740); g.strokeStyle = RED; g.lineWidth = 8; g.stroke(); g.setLineDash([]);
    L(g, 404, 716, 444, 756, RED, 10); L(g, 444, 716, 404, 756, RED, 10);
    person(g, 110, 790, 120, INK, { tripod: 1 });
    g.save(); g.translate(256, 190); g.transform(1, -.14, 0, 1, 0, 0);
    T(g, t[0], 0, -56, 130, DISP, YEL, { max: 440, extrude: 12, exCol: RED, stroke: INK }); T(g, t[1], 0, 70, 130, DISP, YEL, { max: 440, extrude: 12, exCol: RED, stroke: INK });
    g.restore();
    T(g, "THE CAMERA WAS THE MAP", 256, 36, 30, TALL, CREAM, { max: 440 });
  },
  grindhouse(g, t) {
    const r = rng(9); R(g, 0, 0, W, H, YEL, null);
    g.fillStyle = "rgba(230,51,35,.35)"; for (let y = 430; y < H; y += 22) for (let x = (y / 22 % 2) * 11; x < W; x += 22) { g.beginPath(); g.arc(x, y, (y - 420) / 60, 0, 7); g.fill(); }
    // the eye
    g.beginPath(); g.moveTo(26, 440); g.quadraticCurveTo(256, 250, 486, 440); g.quadraticCurveTo(256, 630, 26, 440); g.closePath(); g.fillStyle = CREAM; g.fill(); g.strokeStyle = INK; g.lineWidth = 9; g.stroke();
    for (let i = 0; i < 9; i++) { const a = r() * 7; L(g, 256 + Math.cos(a) * 200, 440 + Math.sin(a) * 70, 256 + Math.cos(a) * 120, 440 + Math.sin(a) * 50, RED, 3); }
    O(g, 256, 440, 92, RED, INK, 8); O(g, 256, 440, 40, INK, null); O(g, 226, 410, 14, CREAM, null);
    for (let i = 0; i < 13; i++) L(g, 60 + i * 33, 330 - Math.sin(i / 12 * Math.PI) * 90, 50 + i * 34, 290 - Math.sin(i / 12 * Math.PI) * 110, INK, 6);
    // hands coming up
    for (const x of [90, 400]) { P(g, [[x - 60, H], [x - 50, 730], [x + 50, 730], [x + 60, H]], INK, null); for (let i = 0; i < 4; i++) { g.fillStyle = INK; g.beginPath(); g.roundRect(x - 50 + i * 26, 640 - (i % 3) * 22, 20, 110, 10); g.fill(); } }
    // dripping title
    g.save(); g.translate(256, 130); g.rotate(-.06);
    t.forEach((s, i) => T(g, s, 0, i * 104 - 44, 120, DISP, RED, { max: 450, stroke: INK, lw: 10 }));
    g.restore();
    for (let i = 0; i < 12; i++) { const x = 60 + i * 35 + r() * 10, h = 20 + r() * 70; g.fillStyle = RED; g.beginPath(); g.roundRect(x, 232, 12, h, 6); g.fill(); }
    g.save(); g.translate(410, 640); g.rotate(.2); rays(g, 0, 0, 24, 82, INK); O(g, 0, 0, 62, RED, INK, 5); T(g, "IN SHOCKING", 0, -12, 20, TALL, CREAM); T(g, "COLOUR", 0, 14, 28, TALL, CREAM); g.restore();
    T(g, "NOT FOR THE FAINT OF HEART", 256, 36, 30, TALL, INK, { max: 440 });
  },
  noir(g, t) {
    const r = rng(4); R(g, 0, 0, W, H, INK, null);
    P(g, [[330, 250], [W + 80, H], [60, H]], BLUE, null);
    for (let x = 0; x < W;) { const w = 40 + r() * 50, h = 150 + r() * 260; R(g, x, 640 - h, w, h, "#2a5a94", INK, 3); for (let j = 0; j < h / 34 - 1; j++) for (let i = 0; i < w / 20 - 1; i++) if (r() < .3) R(g, x + 9 + i * 20, 652 - h + j * 34, 9, 16, YEL, null); x += w; }
    R(g, 0, 640, W, 214, "#0a0908", null); P(g, [[300, 640], [420, 640], [W + 60, H], [120, H]], BLUE, null);
    L(g, 330, 640, 330, 250, CREAM, 8); L(g, 330, 250, 380, 250, CREAM, 8); O(g, 386, 262, 18, YEL, CREAM, 4);
    // the man and his long shadow
    P(g, [[250, 700], [150, H], [330, H], [300, 700]], "rgba(0,0,0,.75)", null);
    P(g, [[236, 700], [246, 520], [316, 520], [330, 700]], INK, CREAM, 3); O(g, 281, 494, 26, INK, CREAM, 3);
    g.beginPath(); g.ellipse(281, 478, 54, 11, 0, 0, 7); g.fillStyle = INK; g.fill(); g.strokeStyle = CREAM; g.lineWidth = 3; g.stroke(); R(g, 258, 446, 46, 30, INK, CREAM, 3);
    R(g, 318, 566, 44, 30, CREAM, null); O(g, 340, 581, 9, INK, null); rays(g, 372, 560, 16, 46, YEL);
    // blinds
    g.fillStyle = "rgba(255,244,214,.13)"; for (let y = -200; y < H; y += 58) P(g, [[0, y + 160], [W, y], [W, y + 22], [0, y + 182]], "rgba(255,244,214,.13)", null);
    T(g, t[0], 30, 118, 150, TALL, CREAM, { align: "left", max: 452 }); T(g, t[1], 30, 240, 150, TALL, YEL, { align: "left", max: 300 });
    R(g, 30, 312, 120, 8, RED, null); T(g, "A CASE HE COULDN'T PUT DOWN", 30, 36, 28, TALL, CREAM, { align: "left", max: 440 });
  },
  sports(g, t) {
    const r = rng(2); R(g, 0, 0, W, 520, SKY, null); rays(g, 256, 520, 22, 800, "#b5e0f0");
    R(g, 0, 440, W, 90, RED); for (let i = 0; i < 260; i++) O(g, r() * W, 448 + r() * 74, 5, [CREAM, YEL, INK, BLUE][i % 4], null);
    for (let i = 0; i < 8; i++) P(g, [[256 + (i - 4) * 40, 530], [256 + (i - 3) * 40, 530], [256 + (i - 3) * 190, H], [256 + (i - 4) * 190, H]], i % 2 ? GREEN : "#4a9667", null);
    L(g, 0, 530, W, 530, INK, 5); g.beginPath(); g.ellipse(256, 760, 210, 60, 0, 0, 7); g.strokeStyle = CREAM; g.lineWidth = 7; g.stroke(); L(g, 0, 760, W, 760, CREAM, 7);
    for (const x of [56, 456]) { L(g, x, 530, x, 300, INK, 9); R(g, x - 40, 262, 80, 44, INK, null); for (let i = 0; i < 6; i++) O(g, x - 26 + (i % 3) * 26, 274 + (i / 3 | 0) * 20, 8, YEL, null); rays(g, x, 284, 16, 96, "rgba(255,244,214,.55)"); }
    // the ball, struck
    for (let i = 0; i < 5; i++) L(g, 180 - i * 30, 640 - i * 6, 300 - i * 6, 420 + i * 16, CREAM, 5);
    O(g, 356, 372, 70, CREAM, INK, 7); P(g, [[356, 340], [386, 362], [374, 398], [338, 398], [326, 362]], INK, null); for (const [a, b] of [[356, 340], [386, 362], [374, 398], [338, 398], [326, 362]]) L(g, a, b, 356 + (a - 356) * 2.2, 372 + (b - 372) * 2.2, INK, 5);
    person(g, 150, 800, 210, INK, { up: 1 });
    g.save(); g.translate(256, 150); g.transform(1, 0, -.18, 1, 0, 0);
    T(g, t[0], 0, -54, 120, DISP, CREAM, { max: 440, stroke: INK, lw: 14, extrude: 8, exCol: RED }); T(g, t[1], 0, 50, 120, DISP, YEL, { max: 440, stroke: INK, lw: 14, extrude: 8, exCol: RED });
    g.restore(); T(g, "THE COMEBACK NOBODY SAW COMING", 256, 36, 28, TALL, INK, { max: 440 });
  },
  space(g, t) {
    const r = rng(6); R(g, 0, 0, W, H, BLUE, null);
    for (let i = 0; i < 90; i++) { const x = r() * W, y = r() * H, s = r() * 4 + 1; R(g, x, y, s, s, CREAM, null); }
    // ringed planet
    O(g, 380, 380, 120, ORANGE, INK, 7); g.save(); g.beginPath(); g.arc(380, 380, 117, 0, 7); g.clip(); O(g, 440, 430, 130, "#d9703a", null); for (let i = 0; i < 12; i++) L(g, 250, 300 + i * 22, 510, 280 + i * 22, "rgba(20,18,16,.35)", 3); g.restore();
    g.beginPath(); g.ellipse(380, 380, 200, 44, -.3, .25, Math.PI - .25); g.strokeStyle = YEL; g.lineWidth = 14; g.stroke(); g.strokeStyle = INK; g.lineWidth = 3; g.beginPath(); g.ellipse(380, 380, 208, 50, -.3, .25, Math.PI - .25); g.stroke();
    // home moon with the dish
    g.beginPath(); g.arc(120, 980, 330, 0, 7); g.fillStyle = CREAM; g.fill(); g.strokeStyle = INK; g.lineWidth = 7; g.stroke(); O(g, 60, 770, 26, "#e6d9b4", INK, 3); O(g, 190, 810, 16, "#e6d9b4", INK, 3);
    L(g, 250, 700, 250, 620, INK, 9); g.beginPath(); g.arc(250, 610, 46, .5, Math.PI + .5); g.closePath(); g.fillStyle = RED; g.fill(); g.strokeStyle = INK; g.lineWidth = 6; g.stroke(); L(g, 262, 596, 290, 560, INK, 5); O(g, 292, 558, 8, YEL, INK, 3);
    g.strokeStyle = YEL; g.lineWidth = 7; for (let i = 1; i < 5; i++) { g.beginPath(); g.arc(292, 558, i * 34, -1.35, -.25); g.stroke(); }
    // rocket
    g.save(); g.translate(120, 430); g.rotate(.55);
    P(g, [[-22, 120], [0, 230], [22, 120]], YEL); P(g, [[-12, 120], [0, 180], [12, 120]], RED, null);
    P(g, [[-34, 60], [-70, 130], [-34, 120]], RED); P(g, [[34, 60], [70, 130], [34, 120]], RED);
    g.beginPath(); g.moveTo(0, -120); g.quadraticCurveTo(52, -30, 34, 120); g.lineTo(-34, 120); g.quadraticCurveTo(-52, -30, 0, -120); g.fillStyle = CREAM; g.fill(); g.strokeStyle = INK; g.lineWidth = 6; g.stroke();
    O(g, 0, -20, 20, SKY, INK, 5); R(g, -34, 70, 68, 16, RED, INK, 4); g.restore();
    t.forEach((s, i) => T(g, s, 256, 110 + i * 112, 136, DISP, YEL, { max: 440, stroke: INK, lw: 14, extrude: 10, exCol: RED }));
    T(g, "TRANSMITTING IN REAL TIME", 256, 36, 30, TALL, CREAM, { max: 440 });
  },
  heist(g, t) {
    R(g, 0, 0, W, H, RED, null); O(g, 256, 520, 210, YEL, INK, 7);
    g.save(); g.translate(256, 700); g.rotate(-.12); R(g, -340, -50, 680, 200, BLUE, INK, 6); g.strokeStyle = "rgba(255,244,214,.5)"; g.lineWidth = 2; for (let i = -340; i < 340; i += 34) { g.beginPath(); g.moveTo(i, -50); g.lineTo(i, 150); g.stroke(); } for (let j = -50; j < 150; j += 34) { g.beginPath(); g.moveTo(-340, j); g.lineTo(340, j); g.stroke(); }
    g.strokeStyle = CREAM; g.lineWidth = 5; g.strokeRect(-200, -20, 150, 90); g.strokeRect(-50, 10, 220, 60); g.setLineDash([12, 10]); g.beginPath(); g.moveTo(-280, 110); g.lineTo(-120, 30); g.lineTo(100, 40); g.lineTo(280, -20); g.strokeStyle = YEL; g.stroke(); g.setLineDash([]); g.restore();
    // the crew
    for (const [x, s] of [[136, 250], [376, 250], [256, 300]]) { P(g, [[x - s * .2, 690], [x - s * .17, 690 - s * .66], [x + s * .17, 690 - s * .66], [x + s * .2, 690]], INK, null); O(g, x, 690 - s * .8, s * .13, INK, null); P(g, [[x - s * .04, 690 - s * .66], [x, 690 - s * .5], [x + s * .04, 690 - s * .66]], CREAM, null); }
    R(g, 300, 600, 86, 60, CREAM, INK, 5); R(g, 328, 586, 30, 16, null, INK, 5);
    T(g, t[0], 256, 120, 150, TALL, CREAM, { max: 452, extrude: 8, exCol: INK }); T(g, t[1], 256, 250, 150, TALL, YEL, { max: 452, extrude: 8, exCol: INK });
    T(g, "THE PLAN · THE CREW · THE CLIENT", 256, 36, 28, TALL, CREAM, { max: 440 });
  },
  arthouse(g, t) {
    const r = rng(3); R(g, 0, 0, W, H, CREAM, null);
    R(g, 300, 90, 150, 300, BLUE, null); O(g, 356, 300, 76, RED, null);
    L(g, 0, 560, W, 560, INK, 6); for (let i = 0; i < 7; i++) L(g, 30 + r() * 300, 580 + i * 14, 120 + r() * 360, 580 + i * 14, INK, 2);
    person(g, 130, 560, 110, INK, { tripod: 1 }); P(g, [[112, 562], [148, 562], [300, 640], [220, 640]], "rgba(20,18,16,.2)", null);
    for (let i = 0; i < 900; i++) { g.fillStyle = `rgba(20,18,16,${r() * .12})`; g.fillRect(r() * W, r() * H, 2, 2); }
    T(g, t[0], 40, 690, 78, MONO, INK, { align: "left", max: 430 }); T(g, t[1], 40, 762, 78, MONO, INK, { align: "left", max: 430 });
    T(g, "un film de efraim toti", 40, 60, 26, MONO, INK, { align: "left" }); T(g, "nº 7", 472, 60, 26, MONO, RED, { align: "right" });
    R(g, 40, 100, 60, 6, INK, null);
  }
};

function paintCover(cv, tape) {
  cv.width = W; cv.height = H; const g = cv.getContext("2d");
  (ART[tape.art] || ART.arthouse)(g, tape.title);
  // box furniture shared by every tape
  R(g, 0, H - 46, W, 46, INK, null); T(g, "TOTI VIDEO", 16, H - 21, 30, OSD, CREAM, { align: "left" }); T(g, "VHS", W - 150, H - 21, 30, OSD, CREAM, { align: "right" });
  [CREAM, YEL, SKY, GREEN, ORANGE, RED, BLUE].forEach((c, i) => R(g, W - 136 + i * 17, H - 34, 17, 22, c, null));
  // album-style frame: paper margin, then one clean ink line
  g.strokeStyle = CREAM; g.lineWidth = 12; g.strokeRect(12, 12, W - 24, H - 70);
  g.strokeStyle = INK; g.lineWidth = 3; g.strokeRect(19, 19, W - 38, H - 84);
  for (let i = 0; i < 1600; i++) { g.fillStyle = `rgba(27,26,23,${Math.random() * .07})`; g.fillRect(Math.random() * W, Math.random() * H, 2, 2); }
  g.strokeStyle = INK; g.lineWidth = 12; g.strokeRect(0, 0, W, H);
  return cv;
}

/* small sign / label painter used around the store */
function paintSign(cv, text, bg, fg, w = 512, h = 144, font = DISP) {
  cv.width = w; cv.height = h; const g = cv.getContext("2d");
  R(g, 0, 0, w, h, bg, INK, 12); T(g, text, w / 2, h / 2 + 4, h * .56, font, fg, { max: w - 50 });
  return cv;
}

window.COVERS = { paintCover, paintSign, INK, CREAM, RED, YEL, BLUE, GREEN, ORANGE, SKY };
})();
