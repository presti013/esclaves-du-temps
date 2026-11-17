/* CT-CORP V2 : modules d'état dans la barre de navigation (NAOS-9, horloge, niveau d'accès). */
(function () {
  var logo = document.querySelector('.nav-logo'), nav = logo && logo.closest('nav'), cta = nav && nav.querySelector('.nav-cta'); if (!nav) return;
  var lg = (document.documentElement.lang || 'fr').slice(0, 2), acc = { fr: 'ACCÈS : PUBLIC', en: 'ACCESS: PUBLIC', it: 'ACCESSO: PUBBLICO' }[lg] || 'ACCESS: PUBLIC';
  var box = document.createElement('div'); box.className = 'ct2-status'; box.setAttribute('aria-hidden', 'true');
  box.innerHTML = '<span><i class="ct2-dot"></i>NAOS_9:<b class="ct2-naos" style="font-weight:400">97</b>%</span><span class="ct2-clock"></span><span style="color:var(--accent-amber)">' + acc + '</span>';
  if (cta) nav.insertBefore(box, cta); else nav.appendChild(box);
  var t0 = Date.now(), base = 4 * 3600 + 17 * 60;
  function tick() {
    var s = base + Math.floor((Date.now() - t0) / 1000), p = function (n) { return ('0' + n).slice(-2); };
    box.querySelector('.ct2-clock').textContent = '29.01.2035 // ' + p(Math.floor(s / 3600) % 24) + ':' + p(Math.floor(s / 60) % 60) + ':' + p(s % 60) + '_SECURE';
    box.querySelector('.ct2-naos').textContent = 96 + Math.round(Math.random() * 3);
  }
  tick(); setInterval(tick, 1000);
})();
