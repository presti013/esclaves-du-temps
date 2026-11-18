/* CT-CORP V3 — fond dynamique : halos bleus qui suivent le pointeur et dérivent au défilement,
   trame de points qui se creuse autour du curseur. Désactivé si l'utilisateur réduit les animations. */
(function () {
  if (window.matchMedia && matchMedia('(prefers-reduced-motion: reduce)').matches) return;
  var c = document.createElement('canvas'); c.className = 'ct3-bg'; c.setAttribute('aria-hidden', 'true');
  /* styles posés directement : le fond reste derrière la page même si la feuille de style en cache est ancienne */
  c.style.cssText = 'position:fixed;top:0;left:0;width:100vw;height:100vh;z-index:-1;pointer-events:none;display:block';
  document.documentElement.style.background = '#EEEAE5'; document.body.style.background = 'transparent';
  document.body.insertBefore(c, document.body.firstChild);
  var x = c.getContext('2d'), W, H, dpr, mx = .3, my = .25, tx = .3, ty = .25, sy = 0, st = 0, t0 = performance.now();
  function size() { dpr = Math.min(2, devicePixelRatio || 1); W = innerWidth; H = innerHeight; c.width = W * dpr; c.height = H * dpr; c.style.width = W + 'px'; c.style.height = H + 'px'; x.setTransform(dpr, 0, 0, dpr, 0, 0); }
  size(); addEventListener('resize', size);
  addEventListener('pointermove', function (e) { tx = e.clientX / W; ty = e.clientY / H; }, { passive: true });
  addEventListener('scroll', function () { st = scrollY; }, { passive: true });
  function blob(cx, cy, r, col) { var g = x.createRadialGradient(cx, cy, 0, cx, cy, r); g.addColorStop(0, col); g.addColorStop(1, 'rgba(238,234,229,0)'); x.fillStyle = g; x.fillRect(cx - r, cy - r, r * 2, r * 2); }
  (function frame(now) {
    var t = (now - t0) / 1000; mx += (tx - mx) * .06; my += (ty - my) * .06; sy += (st - sy) * .08;
    var k = sy / Math.max(1, document.documentElement.scrollHeight - H);           // progression du défilement 0 → 1
    x.clearRect(0, 0, W, H);
    blob(mx * W, my * H, Math.max(W, H) * .42, 'rgba(120,155,235,.55)');           // halo du pointeur
    blob(W * (.08 + .1 * Math.sin(t * .2)), H * (.15 + .7 * k), Math.max(W, H) * .38, 'rgba(169,192,242,.75)');
    blob(W * (.92 - .1 * Math.cos(t * .17)), H * (.85 - .6 * k), Math.max(W, H) * .34, 'rgba(200,214,247,.8)');
    blob(W * (.55 + .25 * Math.sin(k * 6.3)), H * (.5 + .2 * Math.cos(t * .13)), Math.max(W, H) * .25, 'rgba(29,78,216,.10)');
    // trame de points : défile avec la page, s'écarte autour du curseur
    var step = 34, off = -(sy * .3) % step, px = mx * W, py = my * H;
    for (var yy = off; yy < H + step; yy += step) for (var xx = 0; xx < W + step; xx += step) {
      var dx = xx - px, dy = yy - py, d = Math.sqrt(dx * dx + dy * dy), f = Math.max(0, 1 - d / 220);
      x.fillStyle = 'rgba(29,78,216,' + (.10 + f * .45).toFixed(3) + ')';
      x.fillRect(xx + dx / (d || 1) * f * 14, yy + dy / (d || 1) * f * 14, 1.6 + f * 1.4, 1.6 + f * 1.4);
    }
    requestAnimationFrame(frame);
  })(t0);
})();
