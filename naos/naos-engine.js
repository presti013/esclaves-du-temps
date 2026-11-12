/* ============================================================================
   NAOS-9 — moteur de dialogue (sans dépendance, sans réseau)
   Esclaves du Temps — Laurent Prestigiacomo
   ----------------------------------------------------------------------------
   Une réponse = ouverture (o) + cœur (c) + finale (f). Voir la bible de voix.
   Le moteur ne contient aucun texte : tout vient de naos-data.js.
   Utilisable dans le navigateur (window.NaosEngine) et dans Node (tests).
   ============================================================================ */
(function (root) {
  "use strict";

  var P_OUVERTURE = 0.6;    // chance d'avoir une ouverture
  var P_FINALE = 0.55;      // chance d'avoir une finale
  var P_BROUILLAGE = 1 / 15; // bible 6.2 : brouillage visuel rare
  var INSISTE_A = 3;        // même thème demandé 3 fois : elle le remarque
  var RETOUR_MIN_MS = 60 * 60 * 1000; // au-delà d'une heure, c'est un retour

  function norm(s) {
    return String(s || "")
      .toLowerCase()
      .replace(/œ/g, "oe").replace(/æ/g, "ae")   // « Œuvre » → « oeuvre »
      .normalize("NFD")
      .replace(/[̀-ͯ]/g, "")
      .replace(/[’'\-]/g, " ")
      .replace(/[^a-z0-9 ]/g, " ")
      .replace(/\s+/g, " ")
      .trim();
  }

  /* « * » accepte toute terminaison ; « ^ » en tête exige le début du message. */
  function cleVersRegex(cle) {
    var debut = cle.charAt(0) === "^";
    var motif = norm(cle.replace(/\*/g, "WILDCARDX"))
      .replace(/wildcardx/g, "[a-z0-9]*");
    return new RegExp((debut ? "^" : "(?:^| )") + motif + "(?: |$)");
  }

  function dureeEnMots(ms) {
    var min = Math.max(1, Math.round(ms / 60000));
    if (min < 60) return min + (min > 1 ? " minutes" : " minute");
    var h = Math.round(min / 60);
    if (h < 48) return h + (h > 1 ? " heures" : " heure");
    var j = Math.floor(h / 24), reste = h - j * 24;
    var txt = j + " jours";
    if (j < 7 && reste > 0) txt += " et " + reste + (reste > 1 ? " heures" : " heure");
    return txt;
  }

  function etatNeuf() {
    return { v: 1, servis: {}, comptes: {}, tours: 0, visites: 0, vuLe: 0 };
  }

  function Engine(data, etat, opts) {
    opts = opts || {};
    this.data = data;
    this.etat = etat && etat.v === 1 ? etat : etatNeuf();
    this.rng = opts.rng || Math.random;
    this.sansBrouillage = !!opts.sansBrouillage;
    this.roles = {};
    this.index = [];
    var self = this;
    var scelles = (data.paliers && data.paliers.scelles) || {};
    Object.keys(scelles).forEach(function (id) {
      if (!data.themes[id]) {
        data.themes[id] = { cles: scelles[id].cles, palier: scelles[id].palier, scelle: true, o: [], c: [], f: [], e: scelles[id].e || [] };
      }
    });
    Object.keys(data.themes).forEach(function (id) {
      var t = data.themes[id];
      if (t.role) self.roles[t.role] = id;
      (t.cles || []).forEach(function (cle) {
        self.index.push({ theme: id, re: cleVersRegex(cle), poids: norm(cle).length + 100 * (t.priorite || 0) });
      });
    });
  }

  /* Ajoute un thème en cours de session (contenu déchiffré sur l'appareil). */
  Engine.prototype.ajouterTheme = function (id, t) {
    if (this.data.themes[id]) return;
    this.data.themes[id] = t;
    if (t.role) this.roles[t.role] = id;
    var self = this;
    (t.cles || []).forEach(function (cle) {
      self.index.push({ theme: id, re: cleVersRegex(cle), poids: norm(cle).length + 100 * (t.priorite || 0) });
    });
  };

  /* Le thème dont la clé reconnue est la plus longue l'emporte ;
     @priorite départage (les salutations cèdent devant tout le reste). */
  Engine.prototype.trouverTheme = function (texte) {
    var t = norm(texte), meilleur = null;
    if (!t) return this.roles.repli;
    for (var i = 0; i < this.index.length; i++) {
      var e = this.index[i];
      if (e.re.test(t) && (!meilleur || e.poids > meilleur.poids)) meilleur = e;
    }
    return meilleur ? meilleur.theme : this.roles.repli;
  };

  /* Pioche un fragment jamais servi ; quand tout a été dit, on repart,
     en écartant le dernier pour ne jamais le répéter deux fois de suite. */
  /* « amour.p17.c.01 » → « amour.p17 » : le fragment vient d'une couche scellée. */
  function coucheDe(id) {
    var m = /^(.+\.p\d\d)\.[ocf]\.\d\d$/.exec(id || "");
    return m ? m[1] : null;
  }

  /* Pioche un fragment jamais servi ; quand tout a été dit, on repart,
     en écartant le dernier pour ne jamais le répéter deux fois de suite.
     Un filtre facultatif restreint la pioche ; une couche scellée tout juste
     ouverte passe avant le reste, le temps d'avoir tout dit une fois. */
  Engine.prototype.piocher = function (theme, morceau, filtre) {
    var liste = (this.data.themes[theme] || {})[morceau];
    if (!liste || !liste.length) return null;
    if (filtre) liste = liste.filter(filtre);
    if (!liste.length) return null;
    var cle = theme + "." + morceau;
    var servis = this.etat.servis[cle] || [];
    var libres = liste.filter(function (f) { return servis.indexOf(f.id) === -1; });
    if (!libres.length) {
      var dernier = servis[servis.length - 1];
      servis = liste.length > 1 ? [dernier] : [];
      libres = liste.filter(function (f) { return servis.indexOf(f.id) === -1; });
    }
    var neufs = libres.filter(function (f) { return coucheDe(f.id); });
    if (neufs.length) libres = neufs;
    var choix = libres[Math.floor(this.rng() * libres.length)];
    servis.push(choix.id);
    this.etat.servis[cle] = servis;
    return { id: choix.id, morceau: morceau, texte: choix.t };
  };

  function remplir(part, vars) {
    if (!part) return part;
    part.texte = part.texte.replace(/\{(\w+)\}/g, function (m, k) {
      return vars && vars[k] !== undefined ? vars[k] : m;
    });
    return part;
  }

  /* Réponse à un message du lecteur. */
  Engine.prototype.repondre = function (texte) {
    return this.repondreTheme(this.trouverTheme(texte));
  };

  /* Un thème scellé ne répond que si son palier a été ouvert (naos-paliers.js). */
  Engine.prototype.estScelle = function (theme) {
    var t = this.data.themes[theme];
    return !!(t && t.scelle);
  };
  Engine.prototype.estDisponible = function (theme) {
    var t = this.data.themes[theme];
    return !!(t && t.c && t.c.length);
  };

  /* Avant le test : une phrase qui ne révèle rien, puis la porte. */
  Engine.prototype.evasif = function (theme, role, vars) {
    var porte = this.ligne(role, vars);
    var e = this.piocher(theme, "e");
    if (e) porte.parts = [e].concat(porte.parts.filter(function (p) { return p.morceau === "c"; }));
    return porte;
  };

  /* Une ligne de mécanique (porte, test…) : ouverture éventuelle + cœur. */
  Engine.prototype.ligne = function (role, vars) {
    var theme = this.roles[role];
    var parts = [];
    if (this.rng() < 0.5) parts.push(this.piocher(theme, "o"));
    parts.push(remplir(this.piocher(theme, "c"), vars));
    return { theme: theme, parts: parts.filter(Boolean) };
  };

  Engine.prototype.repondreTheme = function (theme) {
    var e = this.etat;
    e.tours++;
    e.comptes[theme] = (e.comptes[theme] || 0) + 1;
    var n = e.comptes[theme];
    var sensible = !!(this.data.themes[theme] || {}).sensible;
    var parts = [];

    var estRepli = theme === this.roles.repli;
    var insiste = !estRepli && !sensible && this.roles.insistance && n >= INSISTE_A && n % INSISTE_A === 0;
    var ouvre = !insiste && this.rng() < P_OUVERTURE;
    // Le cœur d'abord : s'il vient d'une couche, l'ouverture et la finale suivent la même couche.
    var coeur = this.piocher(theme, "c");
    var couche = coeur ? coucheDe(coeur.id) : null;
    var self = this;
    var bord = function (morceau) {
      var meme = self.piocher(theme, morceau, function (f) { return coucheDe(f.id) === couche; });
      return meme || (couche ? self.piocher(theme, morceau, function (f) { return !coucheDe(f.id); }) : null);
    };
    if (insiste) parts.push(remplir(this.piocher(this.roles.insistance, "o"), { n: n }));
    else if (ouvre) parts.push(bord("o"));
    parts.push(coeur);
    if (this.rng() < P_FINALE) parts.push(bord("f"));
    parts = parts.filter(Boolean);

    // Brouillage : jamais sur le cœur, qui porte l'information (bible 6.3), jamais sur un thème sensible.
    if (!this.sansBrouillage && !sensible && this.rng() < P_BROUILLAGE) {
      var bords = parts.filter(function (p) { return p.morceau !== "c"; });
      if (bords.length) bords[Math.floor(this.rng() * bords.length)].brouille = true;
    }
    e.vuLe = Date.now();
    return { theme: theme, parts: parts };
  };

  /* Détresse, tristesse : le message passe avant tout le reste, porte comprise. */
  Engine.prototype.estSensible = function (texte) {
    var t = this.data.themes[this.trouverTheme(texte)];
    return !!(t && t.sensible);
  };

  /* Ce qu'elle dit à l'ouverture de l'app. */
  Engine.prototype.accueillir = function (maintenant) {
    var e = this.etat, now = maintenant || Date.now();
    var role, vars = {};
    if (!e.visites) role = "accueil";
    else {
      var ecart = now - (e.vuLe || now);
      vars.duree = dureeEnMots(ecart);
      role = ecart >= RETOUR_MIN_MS ? "retour" : "reprise";
    }
    var theme = this.roles[role] || this.roles.accueil;
    var parts = [];
    if (role !== "reprise") parts.push(this.piocher(theme, "o"));
    parts.push(remplir(this.piocher(theme, "c"), vars));
    if (role === "accueil" || (role === "retour" && this.rng() < 0.6)) {
      parts.push(this.piocher(theme, "f"));
    }
    e.visites++;
    e.vuLe = now;
    return { theme: theme, parts: parts.filter(Boolean) };
  };

  var api = { Engine: Engine, norm: norm, dureeEnMots: dureeEnMots, etatNeuf: etatNeuf };
  if (typeof module !== "undefined" && module.exports) module.exports = api;
  else root.NaosEngine = api;
})(typeof window !== "undefined" ? window : this);
