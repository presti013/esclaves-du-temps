/* ============================================================================
   NAOS-9 — paliers de lecture
   ----------------------------------------------------------------------------
   Certaines réponses sont scellées : chiffrées dans naos-data.js, illisibles
   sans avoir réussi le test du chapitre. La clé d'un palier se calcule à partir
   des trois bonnes réponses ; elle ouvre aussi tous les paliers précédents.
   Le sceau : un thème réservé, ouvert par un mot ou par trois questions. Le mot
   n'est publié que sous forme d'empreinte ; ses étages suivent les paliers.
   Rien n'est envoyé nulle part : tout se passe sur l'appareil du lecteur.
   ============================================================================ */
(function (root) {
  "use strict";

  var ATTENTE_MS = 60 * 60 * 1000;   // une heure après un échec
  var INSISTE_A = 3;                 // comme dans le moteur : la troisième demande
  var ITERATIONS = 120000;
  var subtle = (root.crypto || (typeof globalThis !== "undefined" && globalThis.crypto) || {}).subtle;
  var Outils = root.NaosEngine || (typeof require !== "undefined" ? require("./naos-engine.js") : null);

  function b64(s) {
    var bin = atob(s), out = new Uint8Array(bin.length);
    for (var i = 0; i < bin.length; i++) out[i] = bin.charCodeAt(i);
    return out;
  }
  function versB64(octets) {
    var bin = "";
    for (var i = 0; i < octets.length; i++) bin += String.fromCharCode(octets[i]);
    return btoa(bin);
  }
  function utf8(s) { return new TextEncoder().encode(s); }
  function lireJson(octets) { return JSON.parse(new TextDecoder().decode(octets)); }

  function ouvrir(cleBrute, boite) {
    return subtle.importKey("raw", cleBrute, "AES-GCM", false, ["decrypt"]).then(function (k) {
      return subtle.decrypt({ name: "AES-GCM", iv: b64(boite.iv) }, k, b64(boite.ct));
    }).then(function (clair) { return new Uint8Array(clair); });
  }
  function cleDesReponses(palier, reponses, sel) {
    var secret = utf8(palier + ":" + reponses.join("|"));
    return subtle.importKey("raw", secret, "PBKDF2", false, ["deriveBits"]).then(function (k) {
      return subtle.deriveBits({ name: "PBKDF2", hash: "SHA-256", salt: b64(sel), iterations: ITERATIONS }, k, 256);
    }).then(function (bits) { return new Uint8Array(bits); });
  }
  /* Clé d'un étage du sceau : SHA-256(clé du sceau ‖ clé du palier). */
  function cleMelee(a, b) {
    var tout = new Uint8Array(a.length + b.length);
    tout.set(a); tout.set(b, a.length);
    return subtle.digest("SHA-256", tout).then(function (h) { return new Uint8Array(h); });
  }

  /* SHA-256 (FIPS 180-4), synchrone : reconnaître un mot sans jamais l'écrire. */
  var K256 = [0x428a2f98, 0x71374491, 0xb5c0fbcf, 0xe9b5dba5, 0x3956c25b, 0x59f111f1, 0x923f82a4, 0xab1c5ed5,
    0xd807aa98, 0x12835b01, 0x243185be, 0x550c7dc3, 0x72be5d74, 0x80deb1fe, 0x9bdc06a7, 0xc19bf174,
    0xe49b69c1, 0xefbe4786, 0x0fc19dc6, 0x240ca1cc, 0x2de92c6f, 0x4a7484aa, 0x5cb0a9dc, 0x76f988da,
    0x983e5152, 0xa831c66d, 0xb00327c8, 0xbf597fc7, 0xc6e00bf3, 0xd5a79147, 0x06ca6351, 0x14292967,
    0x27b70a85, 0x2e1b2138, 0x4d2c6dfc, 0x53380d13, 0x650a7354, 0x766a0abb, 0x81c2c92e, 0x92722c85,
    0xa2bfe8a1, 0xa81a664b, 0xc24b8b70, 0xc76c51a3, 0xd192e819, 0xd6990624, 0xf40e3585, 0x106aa070,
    0x19a4c116, 0x1e376c08, 0x2748774c, 0x34b0bcb5, 0x391c0cb3, 0x4ed8aa4a, 0x5b9cca4f, 0x682e6ff3,
    0x748f82ee, 0x78a5636f, 0x84c87814, 0x8cc70208, 0x90befffa, 0xa4506ceb, 0xbef9a3f7, 0xc67178f2];
  function rot(x, n) { return (x >>> n) | (x << (32 - n)); }
  function sha256hex(texte) {
    var m = utf8(texte), l = m.length, n = ((l + 9 + 63) >> 6) << 6, b = new Uint8Array(n), bits = l * 8;
    b.set(m); b[l] = 0x80;
    b[n - 4] = (bits >>> 24) & 255; b[n - 3] = (bits >>> 16) & 255; b[n - 2] = (bits >>> 8) & 255; b[n - 1] = bits & 255;
    var h = [0x6a09e667, 0xbb67ae85, 0x3c6ef372, 0xa54ff53a, 0x510e527f, 0x9b05688c, 0x1f83d9ab, 0x5be0cd19];
    var w = new Array(64), i, t;
    for (i = 0; i < n; i += 64) {
      for (t = 0; t < 16; t++) w[t] = (b[i + 4 * t] << 24) | (b[i + 4 * t + 1] << 16) | (b[i + 4 * t + 2] << 8) | b[i + 4 * t + 3];
      for (t = 16; t < 64; t++) {
        var s0 = rot(w[t - 15], 7) ^ rot(w[t - 15], 18) ^ (w[t - 15] >>> 3);
        var s1 = rot(w[t - 2], 17) ^ rot(w[t - 2], 19) ^ (w[t - 2] >>> 10);
        w[t] = (w[t - 16] + s0 + w[t - 7] + s1) | 0;
      }
      var a = h[0], bb = h[1], c = h[2], d = h[3], e = h[4], f = h[5], g = h[6], hh = h[7];
      for (t = 0; t < 64; t++) {
        var t1 = (hh + (rot(e, 6) ^ rot(e, 11) ^ rot(e, 25)) + ((e & f) ^ (~e & g)) + K256[t] + w[t]) | 0;
        var t2 = ((rot(a, 2) ^ rot(a, 13) ^ rot(a, 22)) + ((a & bb) ^ (a & c) ^ (bb & c))) | 0;
        hh = g; g = f; f = e; e = (d + t1) | 0; d = c; c = bb; bb = a; a = (t1 + t2) | 0;
      }
      h[0] = (h[0] + a) | 0; h[1] = (h[1] + bb) | 0; h[2] = (h[2] + c) | 0; h[3] = (h[3] + d) | 0;
      h[4] = (h[4] + e) | 0; h[5] = (h[5] + f) | 0; h[6] = (h[6] + g) | 0; h[7] = (h[7] + hh) | 0;
    }
    return h.map(function (v) { return ("00000000" + (v >>> 0).toString(16)).slice(-8); }).join("");
  }

  /* « chapitre 21 » → palier 22 : l'Interlude s'intercale après le chapitre 20. */
  function lirePosition(texte) {
    var t = Outils.norm(texte);
    if (/pas lu|pas encore lu|pas commence|jamais lu|je ne l ai pas|je l ai pas|pas le livre|pas le roman/.test(t)) return "nonlu";
    if (/^(annule|laisse|stop|rien|non|oublie|plus tard)\b/.test(t)) return "abandon";
    var precis = t.match(/chapitre (\d{1,2})\b/);   // « chapitre 2 » l'emporte sur « fini »
    if (precis) { var c = parseInt(precis[1], 10); if (c >= 1 && c <= 30) return c <= 20 ? c : c + 1; }
    if (/prologue/.test(t)) return 0;
    if (/interlude/.test(t)) return 21;
    if (/epilogue|fini|termine|tout lu|la fin|en entier/.test(t)) return 32;
    var m = t.match(/\b(\d{1,2})\b/);
    if (!m) return null;
    var n = parseInt(m[1], 10);
    if (n < 1 || n > 30) return null;
    return n <= 20 ? n : n + 1;
  }

  function Paliers(moteur, data, stockage, horloge) {
    this.moteur = moteur;
    this.p = data.paliers || { ordre: [], tests: {}, chaines: {}, contenus: {}, scelles: {} };
    this.stockage = stockage;
    this.maintenant = horloge || function () { return Date.now(); };
    var garde = stockage.lire() || {};
    this.niveau = typeof garde.niveau === "number" ? garde.niveau : -1;
    this.cle = garde.cle || null;
    this.echecLe = garde.echecLe || 0;
    this.km = garde.km || null;          // clé du sceau, si le lecteur l'a ouvert
    this.echecS = garde.echecS || 0;     // dernier échec aux questions du sceau
    this.kmBrut = null; this.sceauTheme = null; this.sceauLignes = null;
    this.rappel = false;                 // rappel de discrétion déjà fait dans cette session
    this.repos();
  }

  Paliers.prototype.repos = function () {
    this.mode = "repos"; this.demande = null; this.vise = null; this.test = null; this.flous = 0;
  };

  /* Le palier qu'une porte doit ouvrir : celui d'un thème scellé,
     ou la prochaine couche encore fermée d'un thème ouvert. */
  Paliers.prototype.palierVise = function (theme) {
    var t = this.moteur.data.themes[theme] || {}, niveau = this.niveau;
    if (t.scelle) return t.palier;
    var fermees = (t.couches || []).filter(function (p) { return p > niveau; });
    return fermees.length ? Math.min.apply(null, fermees) : null;
  };

  /* Thème ouvert à couches : à chaque troisième demande, tant qu'une couche reste
     fermée, elle propose la porte au lieu de répondre (décision du 11.11.2026). */
  Paliers.prototype.proposerCouche = function (theme) {
    var m = this.moteur, vise = this.palierVise(theme);
    if (vise === null || !subtle || !m.roles.porte_couche) return null;
    var n = (m.etat.comptes[theme] || 0) + 1;
    if (n % INSISTE_A !== 0) return null;
    if (this.echecLe + ATTENTE_MS > this.maintenant()) return null;   // pas de relance pendant l'attente
    m.etat.comptes[theme] = n;
    this.mode = "ou"; this.demande = theme; this.vise = vise;
    return Promise.resolve({ dire: [m.ligne("porte_couche")], qcm: null });
  };
  Paliers.prototype.actif = function () { return this.mode !== "repos"; };
  Paliers.prototype.garder = function () {
    this.stockage.ecrire({ niveau: this.niveau, cle: this.cle, echecLe: this.echecLe, km: this.km, echecS: this.echecS });
  };
  Paliers.prototype.nom = function (n) {
    var o = this.p.ordre[n];
    return o ? o.nom : "ce chapitre";
  };

  function fusionner(cible, ajout) {
    ["o", "c", "f"].forEach(function (m) {
      (ajout[m] || []).forEach(function (frag) {
        if (!cible[m].some(function (x) { return x.id === frag.id; })) cible[m].push(frag);
      });
    });
  }

  /* Déchiffre tous les paliers de 0 à n à partir de la clé du palier n
     (et, si le sceau est ouvert, ses étages jusqu'à n). */
  Paliers.prototype.deverser = function (n, cleBrute) {
    var self = this, suite = Promise.resolve(cleBrute), sceau = this.p.sceau;
    function etape(k) {
      return function (cle) {
        var fait = Promise.resolve();
        if (self.p.contenus[k]) {
          fait = ouvrir(cle, self.p.contenus[k]).then(function (clair) {
            var themes = lireJson(clair);
            Object.keys(themes).forEach(function (id) { fusionner(self.moteur.data.themes[id], themes[id]); });
          });
        }
        if (self.kmBrut && sceau && sceau.etages[k] && self.moteur.data.themes[self.sceauTheme]) {
          fait = fait.then(function () { return cleMelee(self.kmBrut, cle); })
            .then(function (cm) { return ouvrir(cm, sceau.etages[k]); })
            .then(function (clair) { fusionner(self.moteur.data.themes[self.sceauTheme], lireJson(clair)); });
        }
        return fait.then(function () {
          return k > 0 && self.p.chaines[k] ? ouvrir(cle, self.p.chaines[k]) : null;
        });
      };
    }
    for (var k = n; k >= 0; k--) suite = suite.then(etape(k));
    return suite;
  };

  /* La clé d'un palier inférieur ou égal au niveau, en descendant la chaîne. */
  Paliers.prototype.clePalier = function (n) {
    var self = this, suite = Promise.resolve(b64(this.cle));
    for (var k = this.niveau; k > n; k--) {
      (function (kk) { suite = suite.then(function (cle) { return ouvrir(cle, self.p.chaines[kk]); }); })(k);
    }
    return suite;
  };

  /* Ouvre la base du sceau : un thème réservé rejoint le moteur. */
  Paliers.prototype.ouvrirSceau = function (km) {
    var self = this;
    return ouvrir(km, this.p.sceau.base).then(function (clair) {
      var b = lireJson(clair);
      self.kmBrut = km; self.km = versB64(km);
      self.sceauTheme = b.theme; self.sceauLignes = { a: b.a, r: b.r };
      self.moteur.ajouterTheme(b.theme, {
        cles: b.cles, priorite: b.priorite, couches: b.couches, reserve: true,
        o: b.o.slice(), c: b.c.slice(), f: b.f.slice()
      });
      self.garder();
    });
  };
  Paliers.prototype.etagesJusquauNiveau = function () {
    return this.niveau >= 0 && this.cle ? this.deverser(this.niveau, b64(this.cle)) : Promise.resolve();
  };

  /* Au démarrage : rouvre ce que le lecteur avait déjà gagné. */
  Paliers.prototype.reprendre = function () {
    var self = this;
    if (!subtle) return Promise.resolve();
    var suite = Promise.resolve();
    if (this.km && this.p.sceau) {
      suite = this.ouvrirSceau(b64(this.km)).catch(function () { self.km = null; self.kmBrut = null; self.garder(); });
    }
    return suite.then(function () {
      if (self.niveau < 0 || !self.cle) return null;
      return self.deverser(self.niveau, b64(self.cle)).catch(function () {
        self.niveau = -1; self.cle = null; self.garder();
      });
    });
  };

  /* Le mot du sceau est-il dans le message ? Chaque mot est comparé à l'empreinte,
     ainsi que les lettres isolées mises bout à bout (« a.b.c » → « abc »). */
  Paliers.prototype.motDit = function (texte) {
    var s = this.p.sceau;
    if (!s || !s.empreinte) return null;
    var mots = Outils.norm(texte).split(" ").filter(Boolean), essais = mots.slice(), suite = [];
    mots.concat([""]).forEach(function (x) {
      if (x.length === 1 && suite.length < 24) { suite.push(x); return; }
      for (var i = 0; i < suite.length; i++)       // « à v i t … » : toutes les sous-suites
        for (var j = i + 2; j <= suite.length; j++) essais.push(suite.slice(i, j).join(""));
      suite = x.length === 1 ? [x] : [];
    });
    for (var i = 0; i < essais.length; i++) if (sha256hex(s.sel + ":" + essais[i]) === s.empreinte) return essais[i];
    return null;
  };

  Paliers.prototype.ligneSceau = function (genre) {
    var liste = (this.sceauLignes || {})[genre] || [];
    var f = liste[Math.floor(this.moteur.rng() * liste.length)];
    return { theme: this.sceauTheme, parts: f ? [{ id: f.id, morceau: "c", texte: f.t }] : [] };
  };
  /* Juste après l'ouverture : une ligne d'accueil, puis la réponse. */
  Paliers.prototype.accueilSceau = function () {
    this.rappel = true;
    return { dire: [this.ligneSceau("a"), this.moteur.repondreTheme(this.sceauTheme)], qcm: null };
  };
  /* Sceau ouvert : un rappel de discrétion à la première réponse de la session, puis une fois sur trois. */
  Paliers.prototype.repondreSceau = function (theme) {
    var n = (this.moteur.etat.comptes[theme] || 0) + 1;
    if (this.rappel && n % INSISTE_A !== 1) return null;
    this.rappel = true;
    return Promise.resolve({ dire: [this.ligneSceau("r"), this.moteur.repondreTheme(theme)], qcm: null });
  };
  /* Sceau fermé, lecteur assez avancé : à la troisième demande, les trois questions. */
  Paliers.prototype.proposerSceau = function (theme) {
    var m = this.moteur, s = this.p.sceau, self = this;
    if (!s || !s.qcm || this.km || !subtle || !this.cle || this.niveau < s.qcm.palier) return null;
    var n = (m.etat.comptes[theme] || 0) + 1;
    if (n % INSISTE_A !== 0) return null;
    if (this.echecS + ATTENTE_MS > this.maintenant()) return null;
    m.etat.comptes[theme] = n;
    return this.clePalier(s.qcm.palier).then(function (kp) { return ouvrir(kp, s.qcm.boite); }).then(function (clair) {
      var b = lireJson(clair), f = b.offre[Math.floor(m.rng() * b.offre.length)];
      self.mode = "test"; self.demande = null; self.vise = null;
      self.test = { sceau: true, questions: b.questions, i: 0, reponses: [] };
      return { dire: [{ theme: theme, parts: [{ id: f.id, morceau: "c", texte: f.t }] }], qcm: self.question() };
    }, function () {
      return { dire: [m.repondreTheme(theme)], qcm: null };
    });
  };
  Paliers.prototype.leverSceau = function (cleEnveloppe, enveloppe) {
    var self = this;
    return ouvrir(cleEnveloppe, enveloppe).then(function (km) { return self.ouvrirSceau(km); })
      .then(function () { return self.etagesJusquauNiveau(); })
      .then(function () { return self.accueilSceau(); });
  };

  Paliers.prototype.testPour = function (n) {
    for (var k = Math.min(n, this.p.ordre.length - 1); k >= 0; k--) if (this.p.tests[k]) return k;
    return -1;
  };
  Paliers.prototype.questions = function () {
    return this.test.sceau ? this.test.questions : this.p.tests[this.test.palier].questions;
  };
  Paliers.prototype.question = function () {
    var q = this.questions()[this.test.i];
    return { id: q.id, texte: q.q, options: q.options, rang: this.test.i + 1, sur: 3 };
  };

  /* Renvoie null si le message ne concerne pas un palier (le moteur répond alors
     normalement), sinon une promesse de { dire: [réponses], qcm: question|null }. */
  Paliers.prototype.intercepter = function (texte) {
    var m = this.moteur, self = this;

    // Un message de détresse n'est jamais retenu par une porte ni par un test.
    if (m.estSensible && m.estSensible(texte)) { this.repos(); return null; }

    // Le mot du sceau, tapé n'importe quand (sauf au milieu d'un test).
    if (this.mode !== "test" && subtle && this.p.sceau && !this.km) {
      var mot = this.motDit(texte);
      if (mot) {
        var s = this.p.sceau;
        this.repos();
        return cleDesReponses("sceau", [mot], s.sel).then(function (k) { return self.leverSceau(k, s.mot); })
          .catch(function () { return { dire: [m.repondre(texte)], qcm: null }; });
      }
    }

    if (this.mode === "repos") {
      var theme = m.trouverTheme(texte);
      if (!m.estScelle(theme)) {
        var couche = this.proposerCouche(theme);
        if (couche) return couche;
        if (this.sceauTheme && theme === this.sceauTheme) return this.repondreSceau(theme);
        if (theme === m.roles.discretion) return this.proposerSceau(theme);
        return null;
      }
      var palierTheme = m.data.themes[theme].palier;
      if (this.niveau >= palierTheme && m.estDisponible(theme)) return null;
      var reste = this.echecLe + ATTENTE_MS - this.maintenant();
      if (reste > 0) {
        return Promise.resolve({ dire: [m.ligne("porte_attente", { duree: Outils.dureeEnMots(reste) })], qcm: null });
      }
      this.mode = "ou"; this.demande = theme; this.vise = palierTheme;
      var ligne = this.niveau >= 0 ? m.evasif(theme, "porte_avance", { nom: this.nom(this.niveau) }) : m.evasif(theme, "porte");
      return Promise.resolve({ dire: [ligne], qcm: null });
    }

    if (this.mode === "ou") {
      var pos = lirePosition(texte);
      if (pos === "nonlu") { this.repos(); return Promise.resolve({ dire: [m.ligne("porte_nonlu")], qcm: null }); }
      if (pos === "abandon") { this.repos(); return Promise.resolve({ dire: [m.ligne("porte_abandon")], qcm: null }); }
      if (pos === null) {
        // Le lecteur parle d'autre chose : on quitte la porte et on lui répond.
        if (m.trouverTheme(texte) !== m.roles.repli) { this.repos(); return this.intercepter(texte); }
        if (++this.flous >= 2) { this.repos(); return Promise.resolve({ dire: [m.ligne("porte_abandon")], qcm: null }); }
        return Promise.resolve({ dire: [m.ligne("porte_flou")], qcm: null });
      }
      var palierDemande = this.vise;
      if (pos <= this.niveau) return this.conclure(false);
      var k = this.testPour(pos);
      if (k < 0 || k <= this.niveau) return this.conclure(false);
      if (pos < palierDemande) { this.repos(); return Promise.resolve({ dire: [m.ligne("porte_loin")], qcm: null }); }
      this.mode = "test"; this.test = { palier: k, i: 0, reponses: [] };
      return Promise.resolve({ dire: [m.ligne("porte_test", { nom: this.nom(k) })], qcm: this.question() });
    }

    // mode "test"
    var q = this.questions()[this.test.i];
    var t = Outils.norm(texte), choix = null;
    if (/^(annule|stop|laisse|oublie|plus tard|non)\b/.test(t)) {
      this.repos(); return Promise.resolve({ dire: [m.ligne("porte_abandon")], qcm: null });
    }
    q.options.forEach(function (o) {
      if (t === o.id || t === Outils.norm(o.t) || t === o.id + " " + Outils.norm(o.t)) choix = o.id;
    });
    if (!choix) return Promise.resolve({ dire: [m.ligne("porte_choix")], qcm: this.question() });
    this.test.reponses.push(choix);
    this.test.i++;
    if (this.test.i < 3) return Promise.resolve({ dire: [], qcm: this.question() });

    if (this.test.sceau) {
      var sq = this.p.sceau.qcm, reponses = this.test.reponses;
      this.repos();
      return cleDesReponses("sceau", reponses, sq.sel).then(function (k) {
        return self.leverSceau(k, sq.enveloppe);
      }).catch(function () {
        self.echecS = self.maintenant(); self.garder();
        return { dire: [m.ligne("porte_echec")], qcm: null };
      });
    }

    var n = this.test.palier, essai = this.p.tests[n];
    return cleDesReponses(n, this.test.reponses, essai.sel).then(function (cleTest) {
      return ouvrir(cleTest, essai.enveloppe);
    }).then(function (clePalier) {
      self.niveau = n; self.cle = versB64(clePalier); self.garder();
      return self.deverser(n, clePalier).then(function () { return self.conclure(true); });
    }, function () {
      self.echecLe = self.maintenant(); self.garder(); self.repos();
      return { dire: [m.ligne("porte_echec")], qcm: null };
    });
  };

  /* Après un test réussi (ou inutile) : répondre à la question d'origine si le palier le permet. */
  Paliers.prototype.conclure = function (vientDeReussir) {
    var m = this.moteur, theme = this.demande, vise = this.vise, dire = [];
    this.repos();
    if (vientDeReussir) dire.push(m.ligne("porte_ok"));
    if (this.niveau >= vise && m.estDisponible(theme)) {
      if (this.sceauTheme && theme === this.sceauTheme && ((m.etat.comptes[theme] || 0) + 1) % INSISTE_A === 1) {
        this.rappel = true; dire.push(this.ligneSceau("r"));
      }
      dire.push(m.repondreTheme(theme));
    }
    else dire.push(m.ligne("porte_loin"));
    return Promise.resolve({ dire: dire, qcm: null });
  };

  var api = { Paliers: Paliers, lirePosition: lirePosition, disponible: !!subtle, sha256hex: sha256hex };
  if (typeof module !== "undefined" && module.exports) module.exports = api;
  else root.NaosPaliers = api;
})(typeof window !== "undefined" ? window : globalThis);
