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

  /* ---- Le prénom du lecteur (choix du 13.11.2026) -----------------------
     Il vit dans l'état du moteur, donc dans la mémoire locale de l'appareil :
     il n'en sort jamais, et « Purger la mémoire » l'efface. */
  var P_ADRESSE = 1 / 6;                       // ailleurs : une réponse sur six l'appelle par son prénom
  var NOM_LIGNE = { porte_ok: 0.7 };           // après un test réussi
  var NOM_THEME = { salut: 0.5, adieu: 0.5 };  // bonjour, au revoir
  var NOM_RETOUR = 0.85, NOM_RETOUR_O = 0.4;   // au retour : presque toujours, en ouverture ou dans le cœur
  var SANS_ADRESSE = ["salut", "adieu", "insulte"];

  /* ---- Le fil de la conversation (choix du 13.11.2026) -------------------
     Dernier sujet, sujets déjà abordés, question en attente : tout vit dans
     l'état du moteur, sur l'appareil, et s'efface avec lui. */
  var P_QUESTION = 1 / 8;      // elle pose parfois une question à la place de la finale
  var QUESTION_APRES = 2;      // jamais dans les deux premiers échanges
  var QUESTION_ECART = 4;      // ni deux questions à moins de quatre échanges
  var P_RAPPEL = 0.6;          // quand le lecteur revient à un sujet déjà abordé
  var P_RETOUR_SUJET = 0.5;    // au retour, elle peut nommer le dernier sujet
  var SUITE = /^(pourquoi( ca| donc| pas)?|comment ca|c est a dire|continue|encore|vas y|raconte|raconte moi|explique|explique moi|dis m en plus|dis moi en plus|dis en plus|developpe|precise|et (alors|apres|ensuite|puis|donc|lui|elle|eux|toi)|ah bon|ah oui|vraiment|c est tout|la suite|ensuite|mais encore|et)$/;
  var REP_OUI = /^(oui|si|ouais|ouaip|exact|exactement|bien sur|evidemment|carrement|un peu|je crois|je pense|souvent|toujours)( |$)/;
  var REP_NON = /^(non|nan|pas du tout|pas vraiment|jamais|aucunement|rarement)( |$)/;

  var LETTRE = "A-Za-zÀ-ÖØ-öø-ÿ", FIN_MOT = "(?![" + LETTRE + "])";
  var NOM = "\\s*[:,]?\\s*([" + LETTRE + "][" + LETTRE + "'’-]*)";
  // « je m'appelle », « mon prénom est », « appelle-moi »… : le lecteur donne un nom.
  var RE_NOMMER = new RegExp("(?:^|[^" + LETTRE + "])(?:j(?:e|['’])?\\s*m['’ ]?\\s*ap+el+e" +
    "|mon\\s+(?:nom|pr[ée]nom)" + FIN_MOT + "(?:\\s*,?\\s*(?:est|c['’ ]?\\s*est)" + FIN_MOT + ")?" +
    "|ap+el+e[\\s-]*moi(?:\\s+plut[ôo]t)?|tu\\s+peux\\s+m['’ ]?\\s*ap+el+er|on\\s+m['’ ]?\\s*ap+el+e" +
    "|je\\s+me\\s+(?:nomme|pr[ée]nomme))" + FIN_MOT + NOM, "gi");
  // « moi c'est », « je suis » : un prénom, ou tout autre chose (« moi c'est pareil », « je suis fatigué »).
  var RE_DIRE = new RegExp("(?:^|[^" + LETTRE + "])(moi\\s*,?\\s*c['’ ]?\\s*est|je\\s+suis)" + FIN_MOT + NOM, "gi");
  var RE_LETTRE = new RegExp("[" + LETTRE + "]");
  // Devant « moi c'est » ou « je suis » : rien, une ponctuation, ou un bonjour.
  var DEVANT = /^(et|moi|(bonjour|bonsoir|salut|coucou|hello|hey|re|rebonjour|yo)( naos( 9)?)?( et)?( moi)?)$/;
  var SALUTS = /(^| )(bonjour|bonsoir|salut|coucou|hello|hey|rebonjour)( |$)/;
  var OUBLI = /(^| )(oublie[rsz]?|efface[rsz]?|supprime[rsz]?|retire[rsz]?)( [a-z]+){0,2} (mon nom|mon prenom|ce prenom|le prenom que je t ai (donne|dit))( |$)|(^| )ne (retiens|retenez|garde|gardez) (pas|plus) (mon nom|mon prenom)( |$)/;
  var PAS_OUBLI = /(^| )n (oublie|efface|supprime|retire)|(^| )(oublie|efface|supprime|retire)[a-z]* (pas|jamais)( |$)/;
  var DEMANDE = /(^| )(comment je m ap+el+e|quel est mon (pre)?nom|c est quoi mon (pre)?nom|mon (pre)?nom c est quoi|tu (connais|sais|retiens|as retenu|as garde|te souviens de|te rappelles de|te rappelles|te rappelle) mon (pre)?nom|tu (sais|te souviens|te rappelles) comment je m ap+el+e)( |$)/;
  var RECONNAIS = /(^| )(tu te souviens de moi|tu te rappelles de moi|tu me reconnais|tu sais qui je suis)( |$)/;
  var OUI = /^(oui|si|ouais|ouaip|yes|exact|exactement|vraiment|bien sur|evidemment|absolument|tout a fait|carrement|affirmatif|c est ca|c est bien ca|j insiste|insiste|je t assure|promis|je te jure|je le jure|je confirme|confirme|c est (vraiment |bien )?(mon (vrai )?(pre)?nom|moi|le mien|vrai))( |$)/;
  var NON = /^(non|nan|pas du tout|pas vraiment|je plaisante|je rigole|je blague|c est une blague|c est pas mon (pre)?nom|ce n est pas mon (pre)?nom)( |$)/;
  // Après « moi c'est » ou « je suis », un mot sans majuscule n'est un prénom que s'il est dans cette liste.
  var PRENOMS = ("laurent laura lea leo louis lucas hugo jules adam gabriel raphael arthur nathan ethan noah paul tom theo " +
    "maxime thomas nicolas julien antoine alexandre jean jacques michel philippe patrick alain christophe stephane " +
    "sebastien olivier frederic eric david daniel marc francois vincent benoit fabrice didier thierry pascal dominique " +
    "bernard andre rene robert claude marcel luc yves serge gilles bruno herve cedric jerome gregory mathieu matthieu " +
    "romain kevin anthony florian quentin clement valentin adrien damien guillaume baptiste simon victor martin samuel " +
    "elias liam sacha mael timeo enzo mathis axel noe aaron yanis rayan amine mehdi karim samir youssef omar ali mohamed " +
    "ahmed hassan ibrahim ismael kenza yasmine ines sarah lina nora salma amira leila nadia sofia sophie julie marion " +
    "camille manon chloe emma jade alice lucie clara zoe anna louise ambre eva elise juliette charlotte pauline margaux " +
    "mathilde celine nathalie isabelle sandrine valerie stephanie christine catherine sylvie veronique martine monique " +
    "francoise nicole brigitte chantal annie anne helene caroline aurelie emilie elodie melanie audrey laetitia virginie " +
    "sabrina vanessa jessica amandine justine morgane oceane laure agathe apolline capucine romane lena louna mila " +
    "giulia giuseppe marco luca matteo alessandro francesca chiara elena giovanni salvatore antonio vincenzo carla " +
    "maria jose carlos juan miguel pablo javier lucia carmen ana pedro jan pieter wout lotte sanne femke jens bram ruben " +
    "kai finn noa liv elin emil oskar luka nikola ivan olga natalia anastasia dmitri igor katarzyna piotr tomasz agnieszka " +
    "magda ewa marek jakub michal dorota zofia mihai andrei ioana radu cristina james john mike chris emily kate lisa " +
    "lou mia nina eve gaelle maelle solene celia elsa marine laurie lauren laurence florence delphine estelle coralie " +
    "noemie maelys ysaline vinciane fabienne pascale sabine severine geraldine ingrid joelle marianne myriam nadine " +
    "carine karine murielle mireille liliane francine danielle michele patricia jacqueline josiane bernadette ginette " +
    "jeanne marguerite suzanne simone odette yvette colette denise germaine marthe madeleine therese paulette renee " +
    "lucienne yvonne josette georges henri roger albert fernand raymond gerard christian joseph emile edouard felix " +
    "gaspard lucien jonathan joachim jeremy loic ludovic mickael michael nathanael renaud sylvain tanguy tristan ulysse " +
    "william arnaud aurelien benjamin bertrand boris cyril dylan emmanuel fabien franck gauthier gael hadrien joris " +
    "killian lionel marius morgan nils remi thibault thibaut xavier yannick wassim younes zakaria sami nabil bilal " +
    "hamza ilyes anas adem hicham khalid rachid mustapha farid nordine aicha fatima khadija meryem nour rania souad " +
    "zineb dounia imane hajar malak maryam assia samira latifa naima hafsa mourad malek " +
    "anne-sophie marie-claire jean-marc jean-pierre jean-luc jean-paul anne-marie pierre-yves marie-christine").split(" ");
  // Ces prénoms sont aussi des mots (« je suis marié ») : admis seulement après « je m'appelle ».
  var AMBIGUS = "marie rose claire max pierre ange blanche aube aurore jade prune".split(" ");
  var PAS_UN_PRENOM = ("pas plus moins rien personne quelqu quelquun moi toi lui elle nous vous eux un une le la les l du de des d " +
    "ton ta tes mon ma mes son sa ses votre notre ce ca cela ceci comme aussi encore bien mal tres trop assez beaucoup peu pareil meme " +
    "different differente pire mieux vrai faux oui non si quoi qui que quand ou tout toute tous toujours jamais souvent parfois " +
    "ici en au aux a dans sur pour par avec sans chez et mais donc or ni car ok bon bonne super desole desolee triste " +
    "fatigue fatiguee perdu perdue seul seule content contente heureux heureuse malade pret prete curieux curieuse nul nulle " +
    "belge francais francaise suisse canadien canadienne italien italienne humain humaine robot ia dieu lecteur lectrice " +
    "inconnu inconnue anonyme etudiant etudiante prof professeur fan auteur auteure ecrivain la bas deja comment pourquoi " +
    "combien quel quelle quels quelles lequel laquelle demain hier aujourd maintenant vite bientot tard tot ensuite alors " +
    "apres avant juste simplement seulement vraiment partout surtout presque ainsi autrement naos9 personne").split(" ");
  // Les noms du roman : refusés, sauf si le lecteur insiste. NAOS-9 a sa propre réplique.
  var PERSONNAGES = "kael sena jarek marten hendrik seong vaedran ilarion adara kazimir tadeusz jansen reya janus argus".split(" ");
  var SIENS = ["naos"];
  function cleNom(nom) { return norm(nom).replace(/ /g, ""); }
  PRENOMS = PRENOMS.map(cleNom); AMBIGUS = AMBIGUS.map(cleNom);
  function capitaliser(nom) {
    return nom.toLowerCase().replace(/(^|[-'’ ])([a-zà-öø-ÿ])/g, function (m, a, b) { return a + b.toUpperCase(); });
  }
  function avecPrenom(f) { return f.t.indexOf("{prenom}") !== -1; }
  function sansPrenom(f) { return f.t.indexOf("{prenom}") === -1; }
  function enMajuscules(texte) {
    var l = String(texte).replace(new RegExp("[^" + LETTRE + "]", "g"), "");
    return l.length > 3 && l === l.toUpperCase();
  }

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
    var prenom = this.etat.prenom;
    if (!prenom) liste = liste.filter(sansPrenom);
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
    return { id: choix.id, morceau: morceau, texte: prenom ? choix.t.replace(/\{prenom\}/g, prenom) : choix.t };
  };

  Engine.prototype.piocherNom = function (theme, morceau, p) {
    if (!this.etat.prenom || !p) return this.piocher(theme, morceau);
    var avec = this.rng() < p;
    return this.piocher(theme, morceau, avec ? avecPrenom : sansPrenom) || this.piocher(theme, morceau);
  };

  function remplir(part, vars) {
    if (!part) return part;
    if (vars && vars.sujet && part.texte.indexOf("{sujet}") === 0) {
      vars = Object.assign({}, vars, { sujet: vars.sujet.charAt(0).toUpperCase() + vars.sujet.slice(1) });
      var tete = vars.sujet; part.texte = tete + part.texte.slice(7);
    }
    part.texte = part.texte.replace(/\{(\w+)\}/g, function (m, k) {
      return vars && vars[k] !== undefined ? vars[k] : m;
    });
    return part;
  }

  /* Réponse à un message du lecteur. */
  Engine.prototype.repondre = function (texte) {
    var theme = this.trouverTheme(texte), e = this.etat, fil = this.fil(), t = norm(texte);
    var vide = theme === this.roles.repli || theme === "ouinon";
    // Elle a posé une question : la réplique suivante en tient compte, sauf si le lecteur change de sujet.
    var q = fil.question; fil.question = null;
    if (q && vide && t && this.roles.reponse_libre) {
      var role = q === "fermee" && REP_OUI.test(t) ? "reponse_oui" : q === "fermee" && REP_NON.test(t) ? "reponse_non" : "reponse_libre";
      e.tours++; e.vuLe = Date.now();
      return { theme: this.roles[role], parts: [this.piocher(this.roles[role], "c")].filter(Boolean) };
    }
    // « Pourquoi ? », « continue », « et lui ? » : elle reste sur le dernier sujet.
    if (theme === this.roles.repli && fil.theme && SUITE.test(t) && this.estDisponible(fil.theme)) {
      return this.repondreTheme(fil.theme, true);
    }
    return this.repondreTheme(theme);
  };

  /* L'écoute élargie (bible 16) : vrai si le message n'a été reconnu par aucune clé
     et n'est ni une suite du fil, ni la réponse à une question qu'elle vient de poser. */
  Engine.prototype.incompris = function (texte) {
    var t = norm(texte), fil = this.fil();
    if (t.split(" ").length < 2 || this.trouverTheme(texte) !== this.roles.repli) return false;
    if (fil.question) return false;
    return !(fil.theme && SUITE.test(t));
  };
  /* Une clé simple du thème, pour le rejouer comme si le lecteur l'avait tapée. */
  Engine.prototype.cleDe = function (theme) {
    var t = this.data.themes[theme];
    if (!t || t.role) return null;
    var cles = (t.cles || []).filter(function (c) { return c.indexOf("*") === -1; });
    return cles.length ? cles[0].replace(/^\^/, "") : null;
  };

  Engine.prototype.fil = function () {
    var e = this.etat;
    if (!e.fil) e.fil = { theme: null, vus: [], question: null, qTour: 0 };
    return e.fil;
  };
  Engine.prototype.sujetDe = function (theme) { return (this.data.themes[theme] || {}).sujet || null; };

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
    parts.push(remplir(this.piocherNom(theme, "c", NOM_LIGNE[role]), vars));
    return { theme: theme, parts: parts.filter(Boolean) };
  };

  Engine.prototype.repondreTheme = function (theme, suite) {
    var e = this.etat, fil = this.fil();
    e.tours++;
    e.comptes[theme] = (e.comptes[theme] || 0) + 1;
    var n = e.comptes[theme];
    var sensible = !!(this.data.themes[theme] || {}).sensible;
    var parts = [];

    var estRepli = theme === this.roles.repli;
    var insiste = !suite && !estRepli && !sensible && this.roles.insistance && n >= INSISTE_A && n % INSISTE_A === 0;
    // Le cœur d'abord : s'il vient d'une couche, l'ouverture et la finale suivent la même couche.
    var coeur = this.piocherNom(theme, "c", NOM_THEME[theme]);
    var couche = coeur ? coucheDe(coeur.id) : null;
    var sujet = this.sujetDe(theme);
    // Le lecteur revient à un sujet abordé plus tôt (pas le dernier) : elle le remarque.
    var rappel = !suite && !insiste && !sensible && sujet && fil.theme !== theme && fil.vus.indexOf(theme) !== -1 &&
                 !couche && !!this.roles.rappel && this.rng() < P_RAPPEL;
    var fiche = this.data.themes[theme] || {};
    var viaRelais = this.viaRelais; this.viaRelais = false;
    var relais = viaRelais && !insiste && !sensible && !!this.roles.relais;
    if (relais) rappel = false;
    var adresse = !insiste && !relais && !rappel && !suite && !!e.prenom && !sensible && !estRepli && !fiche.role && SANS_ADRESSE.indexOf(theme) === -1 &&
                  !!this.roles.adresse && this.rng() < P_ADRESSE;
    var ouvre = !insiste && !relais && !adresse && !rappel && !suite && this.rng() < P_OUVERTURE;
    var self = this;
    var bord = function (morceau) {
      var meme = self.piocher(theme, morceau, function (f) { return coucheDe(f.id) === couche; });
      return meme || (couche ? self.piocher(theme, morceau, function (f) { return !coucheDe(f.id); }) : null);
    };
    if (insiste) parts.push(remplir(this.piocher(this.roles.insistance, "o"), { n: n }));
    else if (relais) parts.push(this.piocher(this.roles.relais, "o"));
    else if (suite && !sensible && this.roles.suite) parts.push(this.piocher(this.roles.suite, "c"));
    else if (rappel) parts.push(remplir(this.piocher(this.roles.rappel, "c"), { sujet: sujet }));
    else if (adresse) parts.push(this.piocher(this.roles.adresse, "o"));
    else if (ouvre) parts.push(bord("o"));
    parts.push(coeur);
    // Parfois, une question au lecteur prend la place de la finale ; sa réponse sera entendue.
    var peutDemander = !sensible && !estRepli && !fiche.role && !fiche.scelle && SANS_ADRESSE.indexOf(theme) === -1 && theme !== "ouinon" &&
                       !!this.roles.question_fermee && e.tours > QUESTION_APRES && e.tours - (fil.qTour || 0) >= QUESTION_ECART;
    if (peutDemander && this.rng() < P_QUESTION) {
      var genre = this.rng() < 0.5 ? "fermee" : "ouverte";
      parts.push(this.piocher(this.roles["question_" + genre], "c"));
      fil.question = genre; fil.qTour = e.tours;
    }
    else if (this.rng() < P_FINALE) parts.push(bord("f"));
    parts = parts.filter(Boolean);

    // Brouillage : jamais sur le cœur, qui porte l'information (bible 6.3), jamais sur un thème sensible.
    if (!this.sansBrouillage && !sensible && this.rng() < P_BROUILLAGE) {
      var bords = parts.filter(function (p) { return p.morceau !== "c"; });
      if (bords.length) bords[Math.floor(this.rng() * bords.length)].brouille = true;
    }
    // Le fil : dernier sujet (pour la suite), sujets nommables déjà abordés (pour le rappel).
    if (!estRepli && !fiche.role && theme !== "ouinon" && SANS_ADRESSE.indexOf(theme) === -1) {
      fil.theme = theme;
      if (sujet && !sensible && fil.vus.indexOf(theme) === -1) { fil.vus.push(theme); if (fil.vus.length > 12) fil.vus.shift(); }
    }
    e.vuLe = Date.now();
    return { theme: theme, parts: parts };
  };

  /* Détresse, tristesse : le message passe avant tout le reste, porte comprise. */
  Engine.prototype.estSensible = function (texte) {
    var t = this.data.themes[this.trouverTheme(texte)];
    return !!(t && t.sensible);
  };

  /* ---- Le lecteur se présente, demande son prénom, ou veut qu'on l'oublie ---- */

  /* Un mot peut-il être un prénom ? Renvoie { nom, cle, statut } ou null.
     statut : « sur » (gardé tout de suite), « doute » (elle demande), « perso » (un nom du roman), « naos ». */
  Engine.prototype.lirePrenom = function (brut, voie, majuscules) {
    var nom = String(brut || "").replace(/['’-]+$/, ""), cle = cleNom(nom);
    if (cle.length < 2 || nom.length > 24 || PAS_UN_PRENOM.indexOf(cle) !== -1) return null;
    var theme = this.trouverTheme(nom), t = this.data.themes[theme];
    if (theme === "insulte" || (t && t.sensible)) return null;
    var statut = SIENS.indexOf(cle) !== -1 ? "naos" : PERSONNAGES.indexOf(cle) !== -1 ? "perso" : null;
    var connu = PRENOMS.indexOf(cle) !== -1, majuscule = majuscules && /^[A-ZÀ-ÖØ-Þ]/.test(nom);
    if (!statut) {
      if (voie === "nommer") statut = connu || majuscule || AMBIGUS.indexOf(cle) !== -1 ? "sur" : "doute";
      // « Moi c'est Baudelaire » parle d'un poète : un mot que le canal connaît n'est pas un prénom.
      else if (connu || (voie === "moi" && majuscule && theme === this.roles.repli)) statut = "sur";
      else return null;
    }
    return { nom: capitaliser(nom), cle: cle, statut: statut };
  };

  /* Cherche dans le message la phrase où le lecteur se nomme. */
  Engine.prototype.chercherPrenom = function (texte) {
    var majuscules = !enMajuscules(texte), m, trouve;
    RE_NOMMER.lastIndex = 0;
    while ((m = RE_NOMMER.exec(texte))) {
      if ((trouve = this.lirePrenom(m[1], "nommer", majuscules))) return trouve;
    }
    RE_DIRE.lastIndex = 0;
    while ((m = RE_DIRE.exec(texte))) {
      var debut = m.index + m[0].search(RE_LETTRE), avant = texte.slice(0, debut).trim();
      if (avant && !/[.!?…,;:]$/.test(avant) && !DEVANT.test(norm(avant))) continue;
      var apres = texte.slice(m.index + m[0].length), suite = norm(apres).split(" ")[0];
      if (suite === "que" || suite === "qui" || suite === "qu" || suite === "dont") continue;   // « moi c'est Sena que je préfère »
      trouve = this.lirePrenom(m[2], /^moi/i.test(m[1]) ? "moi" : "suis", majuscules);
      if (!trouve) continue;
      if (trouve.statut !== "sur" && !/^\s*([.!?…,;:]|$)/.test(apres)) continue;
      return trouve;
    }
    return null;
  };

  /* Le bonjour du lecteur, rendu en tête de réponse. */
  Engine.prototype.bonjour = function (texte) {
    var m = SALUTS.exec(norm(texte));
    if (!m || !this.roles.presentation) return null;
    var mot = m[2] === "bonsoir" ? "bonsoir" : m[2] === "bonjour" || m[2] === "rebonjour" ? "bonjour" : "salut";
    return this.piocher(this.roles.presentation, "o", function (f) { return norm(f.t) === mot; });
  };

  /* Garder le prénom, puis le dire. */
  Engine.prototype.adopter = function (prenom, role, salut) {
    this.etat.prenom = prenom;
    var theme = this.roles[role];
    var parts = [salut, this.piocher(theme, "c")];
    if (role === "presentation" && this.rng() < 0.4) parts.push(this.piocher(theme, "f"));
    return { theme: theme, parts: parts.filter(Boolean) };
  };

  /* Renvoie une réponse si le message parle du prénom du lecteur, sinon null.
     La détresse passe avant tout : un prénom sûr est alors gardé sans un mot.
     Pendant un test, rien n'est intercepté (enTest). */
  Engine.prototype.presentation = function (texte, enTest) {
    var e = this.etat, attente = this.attente, t = norm(texte), r = null;
    this.attente = null;
    if (!t || enTest || !this.roles.presentation) return null;
    if (this.estSensible(texte)) {
      var cache = this.chercherPrenom(texte);
      if (cache && cache.statut === "sur") e.prenom = cache.nom;
      return null;
    }
    var nomme = / (nom|prenom)( |$)|m ap+el+e/.test(" " + t);
    if (nomme && PAS_OUBLI.test(t)) r = this.ligne(e.prenom ? "presentation_rappel" : "presentation_inconnu");
    else if (OUBLI.test(t)) {
      var avait = !!e.prenom;
      delete e.prenom;
      r = this.ligne(avait ? "presentation_oubli" : "presentation_rien");
    }
    else if (DEMANDE.test(t)) r = this.ligne(e.prenom ? "presentation_rappel" : "presentation_inconnu");
    else if (e.prenom && RECONNAIS.test(t)) r = this.ligne("presentation_rappel");
    else if (attente && (OUI.test(t) || t === norm(attente.nom))) {
      r = attente.statut === "doute" ? this.adopter(attente.nom, e.prenom ? "presentation_change" : "presentation")
                                     : this.adopter(attente.nom, "presentation_insiste");
    }
    else if (attente && NON.test(t)) r = this.ligne("presentation_non");
    else {
      var trouve = this.chercherPrenom(texte);
      if (!trouve) return null;
      var salut = this.bonjour(texte);
      if (trouve.statut === "perso" || trouve.statut === "naos") {
        if (attente && attente.cle === trouve.cle) r = this.adopter(trouve.nom, "presentation_insiste", salut);
        else {
          this.attente = trouve;
          r = this.ligne(trouve.statut === "naos" ? "presentation_naos" : "presentation_refus", { essai: trouve.nom });
        }
      } else if (trouve.statut === "doute") {
        this.attente = trouve;
        r = this.ligne("presentation_doute", { essai: trouve.nom });
      } else if (e.prenom && cleNom(e.prenom) === trouve.cle) r = this.ligne("presentation_rappel");
      else r = this.adopter(trouve.nom, e.prenom ? "presentation_change" : "presentation", salut);
      if (salut && r.parts[0] !== salut) r.parts.unshift(salut);
    }
    e.vuLe = Date.now();
    return r;
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
    var parts = [], self = this, porteur = null;
    if (e.prenom && role === "retour" && this.rng() < NOM_RETOUR) porteur = this.rng() < NOM_RETOUR_O ? "o" : "c";
    var tirer = function (morceau) {
      if (!e.prenom || role !== "retour") return self.piocher(theme, morceau);
      return self.piocher(theme, morceau, porteur === morceau ? avecPrenom : sansPrenom) || self.piocher(theme, morceau, sansPrenom);
    };
    if (role !== "reprise") parts.push(tirer("o"));
    parts.push(remplir(tirer("c"), vars));
    var dernier = role === "retour" && e.fil && e.fil.theme && !(this.data.themes[e.fil.theme] || {}).sensible ? this.sujetDe(e.fil.theme) : null;
    if (dernier && this.roles.retour_sujet && this.rng() < P_RETOUR_SUJET) {
      parts.push(remplir(this.piocher(this.roles.retour_sujet, "c"), { sujet: dernier }));
    }
    else if (role === "accueil" || (role === "retour" && this.rng() < 0.6)) {
      parts.push(this.piocher(theme, "f"));
    }
    if (e.fil) e.fil.question = null;
    e.visites++;
    e.vuLe = now;
    return { theme: theme, parts: parts.filter(Boolean) };
  };

  var api = { Engine: Engine, norm: norm, dureeEnMots: dureeEnMots, etatNeuf: etatNeuf };
  if (typeof module !== "undefined" && module.exports) module.exports = api;
  else root.NaosEngine = api;
})(typeof window !== "undefined" ? window : this);
