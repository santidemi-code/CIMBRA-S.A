// Del plano a la realidad: un vibrocompactador aplana un terreno desparejo
// (dos pasadas con una vuelta en U, sin desplazamientos laterales) y después
// se replantea y se construye una platea de hormigón con columnas y hierros en espera.
// Isometría propia sobre canvas, sin dependencias. 1 unidad = 1 metro.

const C = Math.cos(Math.PI / 6);
const LX = 15, LY = 6, ZB = -0.8, G = 0.5, NX = LX / G, NY = LY / G;
const INK = '#252729', RED = '#c92026';
const clamp = (v, a = 0, b = 1) => Math.min(b, Math.max(a, v));
const sm = (a, b, x) => { const t = clamp((x - a) / (b - a)); return t * t * (3 - 2 * t); };
const ease = t => t < .5 ? 2 * t * t : 1 - Math.pow(-2 * t + 2, 2) / 2;
const lerp = (a, b, t) => a + (b - a) * t;
const seg = (p, a, b) => clamp((p - a) / (b - a));
const fmt = v => v.toFixed(2).replace('.', ',');

// Recorrido de la máquina. M es el centro de la máquina; el rodillo va 2,1 m adelante.
const XC = 10.5, TR = 1.5, DR = 2.1, RD = .8;
export const STAGES = ['Suelo natural', 'Compactación', 'Replanteo', 'Platea de hormigón', 'El trabajo toma forma.'];
export const stageAt = p => p < .06 ? 0 : p < .6 ? 1 : p < .7 ? 2 : p < .9 ? 3 : 4;

function machineAt(p) {
  const a1 = ease(seg(p, .06, .26)), tu = ease(seg(p, .26, .37)), a2 = ease(seg(p, .37, .56)), ex = ease(seg(p, .56, .63));
  let mx, my, th;
  if (p < .26) { mx = lerp(2.5, XC, a1); my = 4.5; th = 0; }
  else if (p < .37) { const phi = Math.PI / 2 - Math.PI * tu; mx = XC + TR * Math.cos(phi); my = 3 + TR * Math.sin(phi); th = phi - Math.PI / 2; }
  else { mx = lerp(XC, 6.7, a2) - 3.2 * ex; my = 1.5; th = -Math.PI; }
  const c = Math.cos(th), s = Math.sin(th);
  const dist = 8 * a1 + Math.PI * TR * tu + 3.8 * a2 + 3.2 * ex;
  return { a1, tu, a2, ex, th, c, s, mx, my, dx: mx + DR * c, dy: my + DR * s, rot: -dist / RD, working: (p > .06 && p < .26) || (p > .37 && p < .56) };
}

// Terreno inicial: montículos, huellas y ruido, solo entre x = 4,5 y 11 m.
const hash = (i, j) => { const s = Math.sin(i * 127.1 + j * 311.7) * 43758.5453; return s - Math.floor(s); };
const H0 = new Float32Array((NX + 1) * (NY + 1));
for (let i = 0; i <= NX; i++) for (let j = 0; j <= NY; j++) {
  const x = i * G, y = j * G;
  const g = (cx, cy, a, r) => a * Math.exp(-((x - cx) ** 2 + (y - cy) ** 2) / (r * r));
  let h = .32 * Math.sin(x * 1.25 + y * .8) * Math.sin(y * 1.6 - x * .45) + .14 * Math.sin(x * 2.7 - y * 1.9);
  h += g(7.0, 2.0, .95, 1.2) + g(9.2, 4.3, .75, 1.0) + g(9.9, 1.3, .5, .8) + g(8.0, 4.9, .45, .7) + g(8.4, 3.0, -.4, .8);
  h += (hash(i, j) - .5) * .16;
  h *= sm(4.4, 6.0, x) * (1 - sm(10.0, 11.4, x));
  H0[i * (NY + 1) + j] = h;
}
const CELLS = [];
for (let i = 0; i < NX; i++) for (let j = 0; j < NY; j++) CELLS.push([i, j]);
CELLS.sort((a, b) => (a[0] + a[1]) - (b[0] + b[1]));

const SOIL = [206, 196, 180], PACK = [200, 199, 192], SIDE = [184, 172, 154];
const BODY = [238, 238, 234], DARK = [96, 106, 102], GLASS = [120, 132, 128], TIRE = [74, 80, 78], DRUM = [150, 158, 154], DRUM2 = [126, 134, 130];
const CONC = [202, 206, 203], WOOD = [199, 183, 156];
const SLAB = { x0: 5.6, x1: 13.6, y0: .9, y1: 5.1, t: .4 };
const COLS = [[6.0, 1.3], [6.0, 4.7], [9.6, 1.3], [9.6, 4.7], [13.2, 1.3], [13.2, 4.7]].sort((a, b) => (a[0] + a[1]) - (b[0] + b[1]));
const L = (() => { const v = [.5, .15, 1], n = Math.hypot(...v); return v.map(k => k / n); })();

export function createObra(canvas, { onFrame } = {}) {
  const ctx = canvas.getContext('2d');
  const reduced = window.matchMedia('(prefers-reduced-motion:reduce)');
  const Hc = new Float32Array(H0.length), Fc = new Float32Array(H0.length);
  let W = 0, H = 0, dpr = 1, sc = 1, ox = 0, oy = 0, lw = 1, XF = null;
  let target = 0, cur = 0, raf = 0, visible = true, dirty = true;

  const P = (x, y, z) => [ox + (x - y) * C * sc, oy + ((x + y) * .5 - z) * sc];
  const PX = p => { const q = XF ? XF(p) : p; return P(q[0], q[1], q[2]); };

  function fit() {
    const r = canvas.getBoundingClientRect();
    if (!r.width || !r.height) return;
    dpr = Math.min(2, window.devicePixelRatio || 1);
    W = r.width; H = r.height;
    canvas.width = Math.round(W * dpr); canvas.height = Math.round(H * dpr);
    const pts = [];
    for (const x of [-.2, 15.6]) for (const y of [-.9, 6.9]) pts.push([x, y, ZB], [x, y, .4]);
    for (const x of [1, 15]) for (const y of [.3, 5.7]) pts.push([x, y, 3.6]);
    let a = 1e9, b = -1e9, c = 1e9, d = -1e9;
    for (const [x, y, z] of pts) { const sx = (x - y) * C, sy = (x + y) * .5 - z; a = Math.min(a, sx); b = Math.max(b, sx); c = Math.min(c, sy); d = Math.max(d, sy); }
    const mTop = Math.min(56, H * .1), mBot = Math.min(92, H * .19), mSide = 12;
    sc = Math.min((W - 2 * mSide) / (b - a), (H - mTop - mBot) / (d - c));
    ox = W / 2 - sc * (a + b) / 2;
    oy = mTop + (H - mTop - mBot) / 2 - sc * (c + d) / 2;
    lw = clamp(sc * .028, .7, 1.5);
    dirty = true; kick();
  }

  const shade = (base, n) => {
    const len = Math.hypot(n[0], n[1], n[2]) || 1;
    const k = .62 + .38 * Math.max(0, (n[0] * L[0] + n[1] * L[1] + n[2] * L[2]) / len);
    return `rgb(${base[0] * k | 0},${base[1] * k | 0},${base[2] * k | 0})`;
  };
  function face(list, pts, base, ctr) {
    if (XF) { pts = pts.map(XF); ctr = ctr && XF(ctr); }
    let nx = 0, ny = 0, nz = 0, cx = 0, cy = 0, cz = 0;
    for (let i = 0; i < pts.length; i++) {
      const a = pts[i], b = pts[(i + 1) % pts.length];
      nx += (a[1] - b[1]) * (a[2] + b[2]); ny += (a[2] - b[2]) * (a[0] + b[0]); nz += (a[0] - b[0]) * (a[1] + b[1]);
      cx += a[0]; cy += a[1]; cz += a[2];
    }
    cx /= pts.length; cy /= pts.length; cz /= pts.length;
    if (ctr && nx * (cx - ctr[0]) + ny * (cy - ctr[1]) + nz * (cz - ctr[2]) < 0) { nx = -nx; ny = -ny; nz = -nz; }
    if (nx + ny + nz <= 1e-6) return;
    list.push({ pts, d: cx + cy + cz, fill: shade(base, [nx, ny, nz]) });
  }
  function box(list, x0, y0, z0, x1, y1, z1, base) {
    if (z1 - z0 < 1e-4) return;
    const ctr = [(x0 + x1) / 2, (y0 + y1) / 2, (z0 + z1) / 2];
    face(list, [[x0, y0, z1], [x1, y0, z1], [x1, y1, z1], [x0, y1, z1]], base, ctr);
    face(list, [[x0, y0, z0], [x1, y0, z0], [x1, y0, z1], [x0, y0, z1]], base, ctr);
    face(list, [[x1, y0, z0], [x1, y1, z0], [x1, y1, z1], [x1, y0, z1]], base, ctr);
    face(list, [[x0, y1, z0], [x1, y1, z0], [x1, y1, z1], [x0, y1, z1]], base, ctr);
    face(list, [[x0, y0, z0], [x0, y1, z0], [x0, y1, z1], [x0, y0, z1]], base, ctr);
  }
  function cylY(list, cx, cz, r, y0, y1, base, rot, n, alt) {
    const ctr = [cx, (y0 + y1) / 2, cz], ring = [];
    for (let k = 0; k < n; k++) { const a = rot + k * Math.PI * 2 / n; ring.push([cx + r * Math.cos(a), cz + r * Math.sin(a)]); }
    for (let k = 0; k < n; k++) {
      const p = ring[k], q = ring[(k + 1) % n];
      face(list, [[p[0], y0, p[1]], [q[0], y0, q[1]], [q[0], y1, q[1]], [p[0], y1, p[1]]], alt && k % 2 ? alt : base, ctr);
    }
    face(list, ring.map(p => [p[0], y1, p[1]]), base, ctr);
    face(list, ring.map(p => [p[0], y0, p[1]]), base, ctr);
  }
  function prismY(list, prof, y0, y1, base) {
    let cx = 0, cz = 0; for (const p of prof) { cx += p[0]; cz += p[1]; }
    const ctr = [cx / prof.length, (y0 + y1) / 2, cz / prof.length];
    for (let k = 0; k < prof.length; k++) {
      const p = prof[k], q = prof[(k + 1) % prof.length];
      face(list, [[p[0], y0, p[1]], [q[0], y0, q[1]], [q[0], y1, q[1]], [p[0], y1, p[1]]], base, ctr);
    }
    face(list, prof.map(p => [p[0], y1, p[1]]), base, ctr);
    face(list, prof.map(p => [p[0], y0, p[1]]), base, ctr);
  }
  function drawFaces(list) {
    list.sort((a, b) => a.d - b.d);
    ctx.lineJoin = 'round'; ctx.lineWidth = lw; ctx.strokeStyle = INK;
    for (const f of list) {
      ctx.beginPath();
      f.pts.forEach((p, i) => { const s = P(p[0], p[1], p[2]); i ? ctx.lineTo(s[0], s[1]) : ctx.moveTo(s[0], s[1]); });
      ctx.closePath(); ctx.fillStyle = f.fill; ctx.fill(); ctx.stroke();
    }
  }
  function line3(pts, color, w, dash) {
    ctx.beginPath();
    pts.forEach((p, i) => { const s = PX(p); i ? ctx.lineTo(s[0], s[1]) : ctx.moveTo(s[0], s[1]); });
    ctx.strokeStyle = color; ctx.lineWidth = w; ctx.setLineDash(dash || []); ctx.stroke(); ctx.setLineDash([]);
  }

  // Vibrocompactador de rodillo liso, construido en coordenadas propias (rodillo en el origen, avance hacia +x).
  function compactor(m, jit, alpha) {
    XF = ([x, y, z]) => [m.dx + x * m.c - y * m.s, m.dy + x * m.s + y * m.c, z];
    const f = [];
    cylY(f, 0, RD + jit, RD, -1.4, 1.4, DRUM, m.rot, 18, DRUM2);
    box(f, -.86, -1.55, 1.12 + jit, .86, 1.55, 1.86 + jit, BODY);
    box(f, .86, -1.3, 1.5 + jit, .98, 1.3, 1.62 + jit, DARK);
    box(f, -1.42, -.35, .9, -.95, .35, 1.4, DARK);
    cylY(f, -3.3, .62, .62, .5, 1.12, TIRE, m.rot * 1.29, 14);
    cylY(f, -3.3, .62, .62, -1.12, -.5, TIRE, m.rot * 1.29, 14);
    prismY(f, [[-1.4, .78], [-1.4, 1.55], [-2.5, 1.55], [-2.62, 2.25], [-4.0, 2.25], [-4.3, 1.85], [-4.3, .78]], -1.2, 1.2, BODY);
    box(f, -2.45, -.85, 1.55, -1.32, .85, 2.05, BODY);
    box(f, -2.45, -.85, 2.05, -1.32, .85, 3.25, GLASS);
    box(f, -2.56, -.95, 3.25, -1.22, .95, 3.42, BODY);
    box(f, -3.06, -.56, 2.25, -2.92, -.42, 3.0, DARK);
    ctx.globalAlpha = alpha;
    drawFaces(f);
    const b = PX([-1.88, 0, 3.52]);
    ctx.fillStyle = RED; ctx.fillRect(b[0] - .1 * sc, b[1] - .16 * sc, .2 * sc, .2 * sc);
    ctx.globalAlpha = 1;
    XF = null;
  }

  function bubble(s, t) {
    const r = Math.max(8, sc * .34);
    ctx.beginPath(); ctx.arc(s[0], s[1], r, 0, Math.PI * 2);
    ctx.fillStyle = '#efefec'; ctx.fill(); ctx.strokeStyle = RED; ctx.lineWidth = 1; ctx.stroke();
    ctx.fillStyle = RED; ctx.font = `600 ${Math.round(r * 1.1)}px Manrope, Arial, sans-serif`;
    ctx.textAlign = 'center'; ctx.textBaseline = 'middle'; ctx.fillText(t, s[0], s[1] + .5);
  }
  function cross(s) {
    const k = Math.max(5, sc * .18);
    ctx.strokeStyle = RED; ctx.lineWidth = 1.2; ctx.beginPath();
    ctx.moveTo(s[0] - k, s[1]); ctx.lineTo(s[0] + k, s[1]); ctx.moveTo(s[0], s[1] - k); ctx.lineTo(s[0], s[1] + k); ctx.stroke();
  }
  function dim(a, b, label) {
    line3([a, b], RED, 1);
    for (const p of [a, b]) { const s = P(...p); ctx.beginPath(); ctx.moveTo(s[0] - 4, s[1] + 4); ctx.lineTo(s[0] + 4, s[1] - 4); ctx.strokeStyle = RED; ctx.lineWidth = 1.2; ctx.stroke(); }
    const m = P((a[0] + b[0]) / 2, (a[1] + b[1]) / 2, 0);
    ctx.font = `600 ${Math.round(clamp(sc * .3, 10, 13))}px Manrope, Arial, sans-serif`;
    ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
    const w = ctx.measureText(label).width + 10;
    ctx.fillStyle = 'rgba(228,229,227,.92)'; ctx.fillRect(m[0] - w / 2, m[1] - 9, w, 18);
    ctx.fillStyle = RED; ctx.fillText(label, m[0], m[1]);
  }

  function render(p, time) {
    if (!W) return;
    const RM = reduced.matches;
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    ctx.clearRect(0, 0, W, H);
    const m = machineAt(p);

    // Aplanado: pasada 1 por la franja delantera; pasada 2 por la trasera, después de la vuelta.
    const d1 = lerp(2.5, XC, m.a1) + DR;
    const back = (p >= .26 && m.dy < 3) ? m.dx : 99;
    let maxH = 0;
    for (let i = 0; i <= NX; i++) for (let j = 0; j <= NY; j++) {
      const x = i * G, y = j * G, k = i * (NY + 1) + j;
      const wf = sm(2.75, 3.25, y);
      const f = clamp(wf * (1 - sm(d1 + .4, d1 + 1.0, x)) + (1 - wf) * (back < 99 ? sm(back - .9, back - .3, x) : 0));
      Hc[k] = H0[k] * (1 - f); Fc[k] = f;
      maxH = Math.max(maxH, Math.abs(Hc[k]));
    }
    const hAt = (i, j) => Hc[i * (NY + 1) + j];

    ctx.lineJoin = 'round';
    for (const [i, j] of CELLS) {
      const x = i * G, y = j * G, k = i * (NY + 1) + j;
      const h00 = hAt(i, j), h10 = hAt(i + 1, j), h11 = hAt(i + 1, j + 1), h01 = hAt(i, j + 1);
      const d1z = h11 - h00, d2z = h01 - h10;
      const f = (Fc[k] + Fc[k + 1] + Fc[k + NY + 1] + Fc[k + NY + 2]) / 4;
      const base = [lerp(SOIL[0], PACK[0], f), lerp(SOIL[1], PACK[1], f), lerp(SOIL[2], PACK[2], f)];
      const q = [P(x, y, h00), P(x + G, y, h10), P(x + G, y + G, h11), P(x, y + G, h01)];
      ctx.beginPath(); ctx.moveTo(q[0][0], q[0][1]); for (let n = 1; n < 4; n++) ctx.lineTo(q[n][0], q[n][1]); ctx.closePath();
      ctx.fillStyle = shade(base, [G * (d2z - d1z), -G * (d1z + d2z), 2 * G * G]); ctx.fill();
      ctx.strokeStyle = `rgba(37,39,41,${.09 + .1 * f})`; ctx.lineWidth = .7; ctx.stroke();
    }
    const side = (pts, n) => {
      ctx.beginPath(); pts.forEach((p, i) => { const s = P(...p); i ? ctx.lineTo(s[0], s[1]) : ctx.moveTo(s[0], s[1]); });
      ctx.closePath(); ctx.fillStyle = shade(SIDE, n); ctx.fill(); ctx.strokeStyle = INK; ctx.lineWidth = lw; ctx.stroke();
    };
    const front = [[0, LY, ZB], [LX, LY, ZB]]; for (let i = NX; i >= 0; i--) front.push([i * G, LY, hAt(i, NY)]);
    side(front, [0, 1, 0]);
    const right = [[LX, LY, ZB], [LX, 0, ZB]]; for (let j = 0; j <= NY; j++) right.push([LX, j * G, hAt(NX, j)]);
    side(right, [1, 0, 0]);
    line3([[0, LY, -.42], [LX, LY, -.42], [LX, 0, -.42]], 'rgba(37,39,41,.35)', .8, [5, 4]);

    // Huellas del rodillo: recta, curva de la vuelta en U, recta de regreso.
    const fade = 1 - seg(p, .66, .74), track = `rgba(37,39,41,${.32 * fade})`;
    if (fade > 0) {
      if (d1 > 4.7) for (const e of [-1.38, 1.38]) line3([[4.4, 4.5 + e, 0], [Math.min(d1 + .3, XC + DR), 4.5 + e, 0]], track, .8);
      if (p > .26) {
        const end = Math.PI / 2 - Math.PI * m.tu;
        for (const e of [-1.38, 1.38]) {
          const pts = [];
          for (let k = 0; k <= 24; k++) {
            const phi = lerp(Math.PI / 2, end, k / 24), th = phi - Math.PI / 2, c = Math.cos(th), s = Math.sin(th);
            pts.push([XC + TR * Math.cos(phi) + DR * c - e * s, 3 + TR * Math.sin(phi) + DR * s + e * c, 0]);
          }
          line3(pts, track, .8);
        }
      }
      if (p > .37 && back < XC - DR) for (const y of [.12, 2.88]) line3([[XC - DR, y, 0], [Math.max(back, 4.4), y, 0]], track, .8);
    }

    // Ondas de vibración (el rodillo vibra en las pasadas, no en la vuelta).
    if (m.working && !RM) {
      for (let k = 0; k < 3; k++) {
        const ph = (time * .0011 + k / 3) % 1, r = 1 + ph * 1.3, pts = [];
        for (let n = 0; n <= 48; n++) { const a = n / 48 * Math.PI * 2; pts.push([m.dx + r * Math.cos(a), m.dy + r * Math.sin(a) * .9, .02]); }
        ctx.globalAlpha = (1 - ph) * .6; line3(pts, RED, 1, [3, 4]); ctx.globalAlpha = 1;
      }
    }
    if (m.ex < 1) compactor(m, m.working && !RM ? Math.sin(time * .09) * .018 : 0, 1 - m.ex);

    // Replanteo: ejes, estacas, hilo y cotas.
    const r = seg(p, .6, .7);
    if (r > 0) {
      const S = SLAB, o = .3, hs = .5 * ease(clamp(r * 2));
      const corners = [[S.x0 - o, S.y0 - o], [S.x1 + o, S.y0 - o], [S.x1 + o, S.y1 + o], [S.x0 - o, S.y1 + o]];
      ctx.globalAlpha = r;
      ['A', 'B', 'C'].forEach((t, k) => { const x = [6, 9.6, 13.2][k]; line3([[x, S.y0, 0], [x, -.15, 0]], 'rgba(201,32,38,.75)', .9, [6, 3, 1, 3]); bubble(P(x, -.55, 0), t); });
      [1.3, 4.7].forEach((y, k) => { line3([[S.x0, y, 0], [4.55, y, 0]], 'rgba(201,32,38,.75)', .9, [6, 3, 1, 3]); bubble(P(4.15, y, 0), String(k + 1)); });
      ctx.globalAlpha = 1;
      const stakes = [];
      corners.forEach(([x, y]) => box(stakes, x - .05, y - .05, 0, x + .05, y + .05, hs, WOOD));
      drawFaces(stakes);
      const per = [...corners, corners[0]];
      let left = 2 * ((S.x1 - S.x0 + 2 * o) + (S.y1 - S.y0 + 2 * o)) * clamp((r - .25) / .75);
      const pts = [[per[0][0], per[0][1], .38]];
      for (let k = 1; k < per.length && left > 0; k++) {
        const a = per[k - 1], b = per[k], len = Math.hypot(b[0] - a[0], b[1] - a[1]), t = Math.min(1, left / len);
        pts.push([lerp(a[0], b[0], t), lerp(a[1], b[1], t), .38]); left -= len;
      }
      if (pts.length > 1) line3(pts, RED, 1.1);
      corners.forEach(([x, y]) => cross(P(x, y, hs)));
      ctx.globalAlpha = clamp((r - .5) * 2);
      dim([S.x0, 5.75, 0], [S.x1, 5.75, 0], '8,00 m');
      dim([14.35, S.y0, 0], [14.35, S.y1, 0], '4,20 m');
      ctx.globalAlpha = 1;
    }

    // Encofrado y platea.
    const fw = ease(seg(p, .68, .74)), s = ease(seg(p, .73, .83));
    if (fw > 0) {
      const S = SLAB, list = [], hb = .48 * fw;
      box(list, S.x0 - .12, S.y0 - .12, 0, S.x1 + .12, S.y0, hb, WOOD);
      box(list, S.x0 - .12, S.y0, 0, S.x0, S.y1, hb, WOOD);
      box(list, S.x0, S.y0, 0, S.x1, S.y1, S.t * s, CONC);
      box(list, S.x1, S.y0, 0, S.x1 + .12, S.y1, hb, WOOD);
      box(list, S.x0 - .12, S.y1, 0, S.x1 + .12, S.y1 + .12, hb, WOOD);
      drawFaces(list);
      if (s > .98) for (let k = 1; k < 8; k++) { const y = S.y0 + (S.y1 - S.y0) * k / 8; line3([[S.x0 + .25, y, S.t], [S.x0 + 1.15 + (k % 3) * .4, y, S.t]], 'rgba(37,39,41,.14)', .8); }
    }

    // Columnas con hierros en espera.
    const rb = ease(seg(p, .83, .9)), cl = ease(seg(p, .88, .98));
    if (rb > 0) {
      const z0 = SLAB.t, colTop = z0 + 1.15 * cl, barTop = z0 + 1.75 * rb, o = .1;
      for (const [x, y] of COLS) {
        const list = []; box(list, x - .16, y - .16, z0, x + .16, y + .16, colTop, CONC); drawFaces(list);
        if (barTop > colTop) {
          for (const [qx, qy] of [[-o, -o], [o, -o], [o, o], [-o, o]]) line3([[x + qx, y + qy, Math.max(colTop, z0)], [x + qx, y + qy, barTop]], RED, lw * 1.3);
          for (let z = z0 + .15; z < barTop - .05; z += .22) if (z > colTop) line3([[x - o, y - o, z], [x + o, y - o, z], [x + o, y + o, z], [x - o, y + o, z], [x - o, y - o, z]], RED, lw * .9);
        }
      }
    }
    onFrame?.({ progress: p, stage: stageAt(p), level: fmt(maxH) + ' m' });
  }

  function loop(t) {
    raf = 0;
    const RM = reduced.matches, prev = cur;
    cur = RM ? target : cur + (target - cur) * .14;
    if (Math.abs(target - cur) < .0005) cur = target;
    const live = !RM && machineAt(cur).working;
    if (visible && (dirty || cur !== prev || live)) { render(cur, t); dirty = false; }
    if (visible && (cur !== target || live)) raf = requestAnimationFrame(loop);
  }
  function kick() { if (!raf) raf = requestAnimationFrame(loop); }

  new ResizeObserver(fit).observe(canvas);
  new IntersectionObserver(e => { visible = e[0].isIntersecting; if (visible) { dirty = true; kick(); } }).observe(canvas);
  reduced.addEventListener('change', () => { dirty = true; kick(); });
  document.fonts?.ready.then(() => { dirty = true; kick(); });
  fit();
  return { setProgress(p) { target = clamp(p); kick(); } };
}
