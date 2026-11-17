/* ==========================================================================
   SENTINELLES — le jeu que Malek Sabiani a écrit en 1987 sur sa vieille machine.
   Jeu de tir fixe : une escadrille de sondes de Kassandra descend vers l'antenne
   du joueur, abritée derrière quatre bulles. Graphismes et sons originaux,
   palette 8 bits. Clavier (flèches / A-D, espace) ou boutons tactiles.
   ========================================================================== */
(function () {
'use strict';
var A = window.SIGNAL_API; if (!A) return;
var T = A.T, SFX = A.SFX, tone = A.tone, noise = A.noise, TOUCH = A.TOUCH, el = A.el;
var W = 320, H = 200;
var C = { black: '#000000', white: '#ffffff', cyan: '#aaffee', purple: '#cc44cc', green: '#00cc55', blue: '#0000aa', yellow: '#eeee77', lred: '#ff7777', lgreen: '#aaff66', lblue: '#0088ff', grey: '#777777', dgrey: '#333333' };
var TX = {
  name: ['SENTINELLES', 'SENTINELS', 'SENTINELLE'], by: ['PAR M. SABIANI - 1987', 'BY M. SABIANI - 1987', 'DI M. SABIANI - 1987'],
  fire: ['APPUIE SUR FEU', 'PRESS FIRE', 'PREMI FUOCO'], over: 'GAME OVER', wave: ['VAGUE', 'WAVE', 'ONDATA'], pause: 'PAUSE',
  keys: ['FLECHES : BOUGER  ESPACE : TIRER', 'ARROWS: MOVE  SPACE: FIRE', 'FRECCE: MUOVI  SPAZIO: SPARA'],
  pts: ['= ? POINTS', '= ? POINTS', '= ? PUNTI'], quit: ['Quitter', 'Quit', 'Esci']
};
/* sprites dessinés à la main (1 = pixel allumé) */
var SPR = {
  eye: [['...######...', '.##########.', '###..##..###', '##..####..##', '###..##..###', '.##########.', '...######...', '..#..##..#..'],
        ['...######...', '.##########.', '###..##..###', '##..####..##', '###..##..###', '.##########.', '...######...', '.#..#..#..#.']],
  probe: [['.....##.....', '....####....', '...##..##...', '..##.##.##..', '..##.##.##..', '...##..##...', '....####....', '..#.#..#.#..'],
          ['.....##.....', '....####....', '...##..##...', '..##.##.##..', '..##.##.##..', '...##..##...', '....####....', '...#.##.#...']],
  ring: [['..########..', '.#........#.', '#..######..#', '#.#......#.#', '#..######..#', '.#........#.', '..########..', '#....##....#'],
         ['..########..', '.#........#.', '#..######..#', '#.#.####.#.#', '#..######..#', '.#........#.', '..########..', '.#...##...#.']],
  player: [['.......#.......', '......###......', '..#...###...#..', '..##.#####.##..', '...#########...', '.#############.', '###############', '###############']],
  ufo: [['......####......', '...##########...', '..##.##..##.##..', '################', '..###......###..', '...#........#...']],
  boom: [['#...#...#', '.#..#..#.', '..#...#..', '##.....##', '..#...#..', '.#..#..#.', '#...#...#']]
};
var cache = {};
function sprite(name, f, col) {
  var k = name + f + col; if (cache[k]) return cache[k];
  var rows = SPR[name][f % SPR[name].length], c = document.createElement('canvas'); c.width = rows[0].length; c.height = rows.length;
  var x = c.getContext('2d'); x.fillStyle = col;
  rows.forEach(function (r, y) { for (var i = 0; i < r.length; i++) if (r.charAt(i) === '#') x.fillRect(i, y, 1, 1); });
  return (cache[k] = c);
}
var ROWS = [{ s: 'ring', c: C.cyan, p: 30 }, { s: 'probe', c: C.purple, p: 20 }, { s: 'probe', c: C.purple, p: 20 }, { s: 'eye', c: C.lred, p: 10 }, { s: 'eye', c: C.lred, p: 10 }];

var $ = {}, G = null, keys = {}, onExit = null, raf = 0, last = 0, best = 0, stars = [];
function build() {
  if ($.root) return;
  var r = el('div', 'arcade', null, document.body); $.root = r;
  $.cv = el('canvas', null, null, r); $.cv.width = W; $.cv.height = H; $.x = $.cv.getContext('2d'); $.x.imageSmoothingEnabled = false;
  var q = el('button', 'ic aquit', '✕', r); q.type = 'button'; q.setAttribute('aria-label', T(TX.quit)); q.addEventListener('click', quit);
  if (TOUCH) {
    var pad = el('div', 'apad', null, r);
    [['◀', 'left'], ['▶', 'right']].forEach(function (b) {
      var e = el('button', 'abtn', b[0], pad); e.type = 'button';
      var on = function (ev) { ev.preventDefault(); A.gesture(); keys[b[1]] = 1; }, off = function (ev) { ev.preventDefault(); keys[b[1]] = 0; };
      e.addEventListener('pointerdown', on); e.addEventListener('pointerup', off); e.addEventListener('pointercancel', off); e.addEventListener('pointerleave', off);
    });
    var f = el('button', 'abtn fire', 'FEU'.replace('FEU', ['FEU', 'FIRE', 'FUOCO'][['fr', 'en', 'it'].indexOf(A.lang)] || 'FIRE'), r); f.type = 'button';
    f.addEventListener('pointerdown', function (ev) { ev.preventDefault(); A.gesture(); keys.fire = 1; press(); });
    f.addEventListener('pointerup', function () { keys.fire = 0; }); f.addEventListener('pointercancel', function () { keys.fire = 0; });
  }
  document.addEventListener('keydown', function (e) {
    if (!G) return; var k = e.key;
    if (k === 'ArrowLeft' || k === 'a' || k === 'A' || k === 'q' || k === 'Q') keys.left = 1;
    else if (k === 'ArrowRight' || k === 'd' || k === 'D') keys.right = 1;
    else if (k === ' ' || k === 'z' || k === 'Z' || k === 'Enter') { keys.fire = 1; press(); }
    else if (k === 'p' || k === 'P') { if (G.mode === 'play' || G.mode === 'pause') G.mode = G.mode === 'play' ? 'pause' : 'play'; }
    else if (k === 'Escape') quit(); else return;
    e.preventDefault();
  });
  document.addEventListener('keyup', function (e) {
    var k = e.key; if (k === 'ArrowLeft' || k === 'a' || k === 'A' || k === 'q' || k === 'Q') keys.left = 0; else if (k === 'ArrowRight' || k === 'd' || k === 'D') keys.right = 0; else if (k === ' ' || k === 'z' || k === 'Z' || k === 'Enter') keys.fire = 0;
  });
  window.addEventListener('resize', fit);
  document.addEventListener('visibilitychange', function () { if (document.hidden && G && G.mode === 'play') G.mode = 'pause'; });
  for (var i = 0; i < 40; i++) stars.push([Math.random() * W, 14 + Math.random() * 170, Math.random()]);
}
function fit() {
  if (!$.root) return; var land = window.innerWidth > window.innerHeight, pw = window.innerWidth - (TOUCH && land ? 300 : 0), ph = window.innerHeight - (TOUCH && !land ? 130 : 0);
  var s = Math.min(pw / (W + 16), ph / (H + 16)); if (s >= 2) s = Math.floor(s);
  $.cv.style.width = Math.floor(W * s) + 'px'; $.cv.style.height = Math.floor(H * s) + 'px';
}
function shieldMask() {
  var m = []; for (var y = 0; y < 16; y++) { m.push([]); for (var x = 0; x < 24; x++) { var top = y < 5 ? Math.abs(x - 11.5) <= 6 + y * 1.3 : true, arch = y >= 11 && x >= 8 && x < 16; m[y].push(top && !arch ? 1 : 0); } }
  return m;
}
function newWave(n) {
  G.wave = n; G.inv = [];
  var y0 = 34 + Math.min(n - 1, 4) * 6;
  for (var r = 0; r < 5; r++) for (var c = 0; c < 9; c++) G.inv.push({ x: 50 + c * 22, y: y0 + r * 16, r: r, alive: 1 });
  G.dir = 1; G.stepT = 0; G.frame = 0; G.ebul = []; G.pb = null; G.fireT = 1.2; G.note = 0;
  G.shields = [36, 108, 180, 252].map(function (x) { return { x: x, y: 152, m: shieldMask() }; });
}
function reset() {
  G = { mode: 'title', score: 0, lives: 3, px: W / 2 - 7, inv: [], ufo: null, ufoT: 18, booms: [], dead: 0, msgT: 0, extra: 0, wave: 1 };
  newWave(1);
}
function press() {
  if (!G) return;
  if (G.mode === 'title' || G.mode === 'over') { var b = best; reset(); G.mode = 'play'; best = b; G.msgT = 1.5; SFX.ui(); return; }
  if (G.mode === 'pause') { G.mode = 'play'; return; }
  if (G.mode === 'play' && !G.pb && !G.dead) { G.pb = { x: G.px + 7, y: 172 }; tone('square', 1200, 300, 0.09, 0.04); }
}
function boom(x, y, col) { G.booms.push({ x: x, y: y, t: 0.3, c: col }); }
function erode(sh, lx, ly, r) { for (var y = -r; y <= r; y++) for (var x = -r; x <= r; x++) { var yy = ly + y, xx = lx + x; if (yy >= 0 && yy < 16 && xx >= 0 && xx < 24 && x * x + y * y <= r * r + Math.random() * 2) sh.m[yy][xx] = 0; } }
function hitShield(x, y) {
  for (var i = 0; i < G.shields.length; i++) { var s = G.shields[i], lx = Math.floor(x - s.x), ly = Math.floor(y - s.y); if (lx >= 0 && lx < 24 && ly >= 0 && ly < 16 && s.m[ly][lx]) { erode(s, lx, ly, 2); return true; } }
  return false;
}
function update(dt) {
  if (G.mode !== 'play') return;
  if (G.msgT > 0) G.msgT -= dt;
  /* joueur */
  if (G.dead > 0) { G.dead -= dt; if (G.dead <= 0) { if (G.lives <= 0) { G.mode = 'over'; if (G.score > best) best = G.score; return; } G.px = W / 2 - 7; G.ebul = []; } }
  else { if (keys.left) G.px -= 110 * dt; if (keys.right) G.px += 110 * dt; G.px = Math.max(4, Math.min(W - 19, G.px)); if (keys.fire && !G.pb) press(); }
  /* tir du joueur */
  if (G.pb) {
    G.pb.y -= 260 * dt; var b = G.pb;
    if (b.y < 14) G.pb = null;
    else if (hitShield(b.x, b.y)) G.pb = null;
    else {
      for (var i = 0; i < G.inv.length; i++) { var v = G.inv[i]; if (v.alive && b.x >= v.x && b.x <= v.x + 12 && b.y >= v.y && b.y <= v.y + 8) { v.alive = 0; G.pb = null; G.score += ROWS[v.r].p; boom(v.x, v.y, ROWS[v.r].c); noise(0.14, 0.05); break; } }
      if (G.pb && G.ufo && b.x >= G.ufo.x && b.x <= G.ufo.x + 16 && b.y >= 22 && b.y <= 30) { var pts = [50, 100, 150, 300][Math.floor(Math.random() * 4)]; G.score += pts; G.ufoPts = { x: G.ufo.x, t: 1.2, p: pts }; boom(G.ufo.x + 3, 22, C.yellow); G.ufo = null; G.pb = null; noise(0.3, 0.06); }
    }
  }
  if (G.score >= 1500 && !G.extra) { G.extra = 1; G.lives++; SFX.good(); }
  /* escadrille */
  var alive = G.inv.filter(function (v) { return v.alive; });
  if (!alive.length) { newWave(G.wave + 1); G.msgT = 1.5; SFX.win(); return; }
  var interval = (0.04 + alive.length * 0.012) / (1 + (G.wave - 1) * 0.15);
  G.stepT -= dt;
  if (G.stepT <= 0) {
    G.stepT = interval; G.frame ^= 1;
    var edge = alive.some(function (v) { return (G.dir > 0 && v.x + 12 + 3 > W - 4) || (G.dir < 0 && v.x - 3 < 4); });
    if (edge) { G.dir *= -1; alive.forEach(function (v) { v.y += 8; }); } else alive.forEach(function (v) { v.x += 3 * G.dir; });
    tone('square', [98, 87, 78, 73][G.note++ % 4], [98, 87, 78, 73][(G.note - 1) % 4], 0.07, 0.05);
    alive.forEach(function (v) { G.shields.forEach(function (s) { for (var yy = 0; yy < 8; yy++) for (var xx = 0; xx < 12; xx++) { var lx = Math.floor(v.x + xx - s.x), ly = Math.floor(v.y + yy - s.y); if (lx >= 0 && lx < 24 && ly >= 0 && ly < 16) s.m[ly][lx] = 0; } }); });
    if (alive.some(function (v) { return v.y + 8 >= 168; })) { G.lives = 0; G.dead = 1.2; boom(G.px + 3, 172, C.lgreen); noise(0.6, 0.08); }
  }
  /* tirs ennemis */
  G.fireT -= dt;
  if (G.fireT <= 0 && G.ebul.length < 2 + Math.min(G.wave, 3) && !G.dead) {
    G.fireT = (0.6 + Math.random() * 0.9) / (1 + (G.wave - 1) * 0.25);
    var cols = {}; alive.forEach(function (v) { var k = Math.round(v.x / 22); if (!cols[k] || cols[k].y < v.y) cols[k] = v; });
    var ks = Object.keys(cols), s = cols[ks[Math.floor(Math.random() * ks.length)]];
    if (Math.random() < 0.45) { var near = ks.map(function (k) { return cols[k]; }).sort(function (a, b) { return Math.abs(a.x - G.px) - Math.abs(b.x - G.px); })[0]; if (near) s = near; }
    G.ebul.push({ x: s.x + 6, y: s.y + 8, z: Math.random() < 0.5 });
  }
  var sp = 85 + G.wave * 10;
  G.ebul = G.ebul.filter(function (b) {
    b.y += sp * dt; if (b.y > 188) return false;
    if (hitShield(b.x, b.y + 4)) return false;
    if (!G.dead && b.x >= G.px && b.x <= G.px + 15 && b.y + 4 >= 172 && b.y <= 180) { G.lives--; G.dead = 1.4; boom(G.px + 3, 172, C.lgreen); noise(0.6, 0.08); tone('sawtooth', 300, 60, 0.6, 0.06); return false; }
    if (G.pb && Math.abs(G.pb.x - b.x) < 3 && Math.abs(G.pb.y - b.y) < 6) { G.pb = null; return false; }
    return true;
  });
  /* satellite d'Aegis */
  G.ufoT -= dt;
  if (!G.ufo && G.ufoT <= 0) { G.ufoT = 18 + Math.random() * 10; var d = Math.random() < 0.5 ? 1 : -1; G.ufo = { x: d > 0 ? -16 : W, d: d, bl: 0 }; }
  if (G.ufo) { G.ufo.x += G.ufo.d * 50 * dt; G.ufo.bl -= dt; if (G.ufo.bl <= 0) { G.ufo.bl = 0.16; tone('sine', G.ufo.x % 2 < 1 ? 700 : 520, 600, 0.12, 0.025); } if (G.ufo.x < -20 || G.ufo.x > W + 4) G.ufo = null; }
  if (G.ufoPts) { G.ufoPts.t -= dt; if (G.ufoPts.t <= 0) G.ufoPts = null; }
  G.booms = G.booms.filter(function (b) { b.t -= dt; return b.t > 0; });
}
function txt(s, x, y, col, al) { var c = $.x; c.font = '8px "Press Start 2P", monospace'; c.textBaseline = 'top'; c.textAlign = al || 'left'; c.fillStyle = col; c.fillText(s, x, y); }
function pad(n, k) { n = String(n); while (n.length < k) n = '0' + n; return n; }
function draw() {
  var c = $.x; c.fillStyle = C.black; c.fillRect(0, 0, W, H);
  stars.forEach(function (s) { c.fillStyle = s[2] > 0.7 ? C.grey : C.dgrey; c.fillRect(Math.floor(s[0]), Math.floor(s[1]), 1, 1); });
  txt('SCORE ' + pad(G.score, 5), 4, 3, C.white); txt('HI ' + pad(Math.max(best, G.score), 5), W / 2 + 10, 3, C.white, 'center');
  for (var l = 0; l < Math.min(G.lives, 5); l++) c.drawImage(sprite('player', 0, C.lgreen), W - 18 - l * 18, 3);
  c.fillStyle = C.green; c.fillRect(0, 190, W, 1);
  if (G.mode === 'title') {
    txt(T(TX.name), W / 2, 46, C.yellow, 'center'); txt(T(TX.by), W / 2, 62, C.grey, 'center');
    [['ring', C.cyan, 30], ['probe', C.purple, 20], ['eye', C.lred, 10], ['ufo', C.yellow, '?']].forEach(function (r, i) {
      c.drawImage(sprite(r[0], 0, r[1]), W / 2 - 50, 88 + i * 16); txt(T(TX.pts).replace('?', r[2]), W / 2 - 30, 88 + i * 16, C.white);
    });
    if (Math.floor(Date.now() / 500) % 2) txt(T(TX.fire), W / 2, 160, C.lgreen, 'center');
    if (!TOUCH) txt(T(TX.keys), W / 2, 176, C.grey, 'center');
    return;
  }
  G.shields.forEach(function (s) { c.fillStyle = C.green; for (var y = 0; y < 16; y++) for (var x = 0; x < 24; x++) if (s.m[y][x]) c.fillRect(s.x + x, s.y + y, 1, 1); });
  G.inv.forEach(function (v) { if (v.alive) c.drawImage(sprite(ROWS[v.r].s, G.frame, ROWS[v.r].c), Math.round(v.x), Math.round(v.y)); });
  if (G.ufo) c.drawImage(sprite('ufo', 0, C.yellow), Math.round(G.ufo.x), 22);
  if (G.ufoPts) txt(String(G.ufoPts.p), G.ufoPts.x + 8, 22, C.yellow, 'center');
  if (!G.dead || Math.floor(G.dead * 10) % 2) c.drawImage(sprite('player', 0, G.dead ? C.lred : C.lgreen), Math.round(G.px), 172);
  if (G.pb) { c.fillStyle = C.white; c.fillRect(Math.round(G.pb.x), Math.round(G.pb.y), 1, 4); }
  G.ebul.forEach(function (b) { c.fillStyle = C.lred; var x = Math.round(b.x), y = Math.round(b.y); if (b.z) { c.fillRect(x, y, 1, 1); c.fillRect(x + 1, y + 1, 1, 1); c.fillRect(x, y + 2, 1, 1); c.fillRect(x + 1, y + 3, 1, 1); } else c.fillRect(x, y, 1, 4); });
  G.booms.forEach(function (b) { c.drawImage(sprite('boom', 0, b.c), Math.round(b.x), Math.round(b.y)); });
  if (G.msgT > 0 && G.mode === 'play') txt(T(TX.wave) + ' ' + G.wave, W / 2, 120, C.yellow, 'center');
  if (G.mode === 'pause') txt(TX.pause, W / 2, 100, C.white, 'center');
  if (G.mode === 'over') { c.fillStyle = 'rgba(0,0,0,.6)'; c.fillRect(60, 80, 200, 50); txt(TX.over, W / 2, 88, C.lred, 'center'); txt('SCORE ' + pad(G.score, 5), W / 2, 102, C.white, 'center'); if (Math.floor(Date.now() / 500) % 2) txt(T(TX.fire), W / 2, 116, C.lgreen, 'center'); }
}
function frame(t) {
  if (!G) return; var dt = Math.min(0.05, (t - (last || t)) / 1000); last = t;
  update(dt); draw(); raf = requestAnimationFrame(frame);
}
function start(opts) {
  build(); onExit = opts && opts.onExit; best = (A.save.bonus && A.save.bonus.hi) || 0;
  document.body.classList.add('arcadeon'); $.root.classList.add('on'); fit(); reset(); last = 0;
  cancelAnimationFrame(raf); raf = requestAnimationFrame(frame);
  if (document.fonts && document.fonts.load) document.fonts.load('8px "Press Start 2P"');
}
function quit() {
  if (!G) return; var sc = Math.max(best, G.score); G = null; cancelAnimationFrame(raf); keys = {};
  $.root.classList.remove('on'); document.body.classList.remove('arcadeon');
  if (onExit) onExit(sc);
}
window.SIGNAL_ARCADE = { start: start, quit: quit, get state() { return G; }, press: press, keys: keys };
})();
