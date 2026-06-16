/* Esclaves du Temps / Slaves of Time — sélecteur de langue
 * Mémorise le choix (localStorage) et, une seule fois par session, redirige
 * vers la langue préférée (choix mémorisé, sinon détection navigator.language).
 * Garde anti-boucle stricte : le drapeau de session est posé AVANT toute
 * redirection, et on ne redirige que vers une langue réellement disponible
 * pour la page courante (attribut data-i18n-avail="1"). Sinon : rien.
 */
(function () {
  var KEY = 'edt_lang';      // langue choisie manuellement (persistant)
  var GUARD = 'edt_redir';   // garde anti-boucle (par session)
  var root = document.documentElement;
  var cur = (root.getAttribute('lang') || 'fr').slice(0, 2).toLowerCase();

  // 1) Mémoriser tout choix manuel.
  var links = document.querySelectorAll('a[data-i18n-lang]');
  for (var i = 0; i < links.length; i++) {
    (function (a) {
      a.addEventListener('click', function () {
        try { localStorage.setItem(KEY, a.getAttribute('data-i18n-lang')); } catch (e) {}
      });
    })(links[i]);
  }

  // 2) Redirection unique par session (préférence mémorisée ou détectée).
  try {
    if (sessionStorage.getItem(GUARD)) return;
    sessionStorage.setItem(GUARD, '1');           // posé AVANT toute redirection

    var pref = null;
    try { pref = localStorage.getItem(KEY); } catch (e) {}

    if (!pref) {
      var langs = (navigator.languages && navigator.languages.length)
        ? navigator.languages : [navigator.language || ''];
      for (var j = 0; j < langs.length; j++) {
        var l = (langs[j] || '').toLowerCase();
        if (l.indexOf('it') === 0) { pref = 'it'; break; }
        if (l.indexOf('en') === 0) { pref = 'en'; break; }
        if (l.indexOf('fr') === 0) { pref = 'fr'; break; }
      }
    }

    if (pref && pref !== cur) {
      var target = document.querySelector(
        'a[data-i18n-lang="' + pref + '"][data-i18n-avail="1"]'
      );
      if (target && target.href) { location.replace(target.href); }
    }
  } catch (e) { /* localStorage/sessionStorage indisponible : sélecteur manuel seul */ }
})();
