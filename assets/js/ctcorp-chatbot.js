/* ============================================================================
   CT-ASSIST — Assistant virtuel CT Corp (widget diégétique)
   Site « Esclaves du Temps » — Laurent Prestigiacomo / 3Cinq7 éditions
   ----------------------------------------------------------------------------
   UN SEUL FICHIER, ZÉRO DÉPENDANCE. À inclure avant </body> :

       <script src="assets/js/ctcorp-chatbot.js" defer></script>

   Configuration (optionnelle) — à déclarer AVANT le script :

       <script>
         window.CTC_CHAT = {
           bookUrl:  "https://www.la-commanderie.be/category/3cinq7-editions",
           echoUrl:  "index.html#echo",   // lien vers le nœud Écho Rouge du site
           corruptionThreshold: 6,         // seuil de piratage (defaut 6)
           minUserMessages: 3,             // nb mini de messages avant piratage
           naosMaxTurns: 8,                // échanges avec NAOS avant la finale
           nudgeDelayMs: 9000,             // bulle d'invitation (0 = désactivée)
           startClock: "2035-01-05T14:31:07" // horloge diégétique du bandeau
         };
       </script>

   Scénario : 4 actes.
     I.   CT-Assist, support corporate (réponses scriptées, produits du site).
     II.  Corruption progressive (mots sensibles = accélération, glitchs).
     III. Prise de contrôle par NAOS-9 (cascade des 147 portes, bascule rouge).
     IV.  Conversation avec NAOS-9, détection Kassandra, finale + CTA.

   Easter eggs : taper « lampe » pirate immédiatement la session.
   Vie privée : aucune donnée envoyée ni stockée. Tout vit en mémoire.
   ============================================================================ */
(function () {
  "use strict";
  if (window.__CTC_CHAT_LOADED__) return;
  window.__CTC_CHAT_LOADED__ = true;

  /* ------------------------------------------------------------------ */
  /* CONFIG                                                              */
  /* ------------------------------------------------------------------ */
  var DEFAULTS = {
    bookUrl: "https://www.la-commanderie.be/category/3cinq7-editions",
    echoUrl: "index.html",
    corruptionThreshold: 6,
    minUserMessages: 3,
    naosMaxTurns: 8,
    nudgeDelayMs: 9000,
    startClock: "2035-01-05T14:31:07",
    zIndex: 2147483000
  };
  var CFG = {};
  var userCfg = window.CTC_CHAT || {};
  for (var k in DEFAULTS) CFG[k] = (userCfg[k] !== undefined) ? userCfg[k] : DEFAULTS[k];

  var REDUCED = false;
  try {
    REDUCED = window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  } catch (e) { REDUCED = false; }

  /* ------------------------------------------------------------------ */
  /* [PURE-BEGIN] — helpers & moteur d'intentions (testables hors DOM)   */
  /* ------------------------------------------------------------------ */
  function norm(s) {
    return String(s || "")
      .toLowerCase()
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .replace(/[’']/g, " ")
      .replace(/\s+/g, " ")
      .trim();
  }

  function pick(arr, lastRef) {
    if (!arr || !arr.length) return "";
    if (arr.length === 1) return arr[0];
    var i, tries = 0;
    do { i = Math.floor(Math.random() * arr.length); tries++; }
    while (arr[i] === lastRef.v && tries < 6);
    lastRef.v = arr[i];
    return arr[i];
  }

  function matchIntent(table, rawText) {
    var t = norm(rawText);
    for (var i = 0; i < table.length; i++) {
      if (table[i].test.test(t)) return table[i];
    }
    return null;
  }
  /* [PURE-END] */

  /* ------------------------------------------------------------------ */
  /* COPY — tout le texte du widget (modifiable librement)               */
  /* ------------------------------------------------------------------ */

  var COPY = {
    launcherLabel: "Assistance CT Corp",
    nudge: "Une question ? CT-Assist vous répond.",
    headerCorp: { title: "CT-Assist", sub: "Support Cognitif · v4.2", status: "En ligne" },
    headerWarn: { status: "Instabilité signal" },
    headerNaos: { title: "NAOS-9", sub: "canal non répertorié", status: "Canal libre" },
    inputPlaceholder: "Écrivez votre message…",
    inputLocked: "// canal verrouillé…",
    inputClosed: "// session purgée — ↻ pour recommencer",
    send: "Envoyer",
    restartTitle: "Réinitialiser la session",
    closeTitle: "Réduire",
    clockDate: "05.01.2035",

    corpWelcome: [
      "Bonjour et bienvenue sur le portail CT Corp. Je suis CT-Assist, votre agent de support cognitif. 😊",
      "Le Temps est notre Matière Première. Vous êtes notre Investissement. Comment puis-je optimiser votre journée ?"
    ],
    corpChips: [
      "Contrats & recrutement",
      "Tissage Synaptique",
      "L’incident du 27 décembre",
      "Mise à jour CT-NET 2.0"
    ],

    naosChips: [
      "Qui es-tu ?",
      "Que s’est-il vraiment passé le 27 ?",
      "C’est quoi, CT-NET 2.0 ?",
      "Comment résister ?"
    ],

    fallbackCorp: [
      "Je n’ai pas trouvé cette information dans ma base de connaissances. Puis-je vous orienter vers nos Solutions : Tissages Synaptiques, Compression Temporelle, Projet Nyx, CT-Moda ?",
      "Votre demande a été consignée à des fins d’amélioration continue. En attendant, saviez-vous que 94 % de nos collaborateurs renouvellent leur contrat d’engagement temporel ?",
      "Je ne suis pas certain de comprendre. Reformulez, ou choisissez un sujet ci-dessous. Cette conversation est enregistrée à des fins de qualité.",
      "Question transmise au service concerné. Délai de réponse estimé : 18 mois (temps réel). Souhaitez-vous patienter en cabine Paradis Temporel ? 10 CTC/heure."
    ],

    fallbackNaos: [
      "Reformule. Ton espèce a inventé six mille neuf cents langues et aucune n’a de mot pour ce que je suis. On fera avec.",
      "Je t’entends. Je ne suis pas sûre de te comprendre. C’est déjà plus que ce que CT Corp fera jamais pour toi.",
      "Il y a du bruit sur la ligne — Kassandra ratisse. Sois plus simple. Sois plus vrai.",
      "Les questions sont des portes. Celle-ci est fermée. Essaie une autre poignée."
    ],

    /* --- Séquences système ------------------------------------------ */
    glitchLvl1: "⚠ Latence anormale détectée — canal Sigma. Nos équipes techniques surveillent la situation.",
    glitchLvl2: "⚠ Intégrité du pare-feu cognitif : 84 %. Reconnexion en cours. Merci de ne pas fermer cette fenêtre.",
    bleedLines: [
      "…tu m’entends ?…",
      "…pas beaucoup de temps…",
      "…cent quarante-sept…"
    ],
    corruptedSelf: "Le temps est une ress— [DONNÉE CORROMPUE] — ressource illimitée lorsqu’elle est correctement facturée.",

    takeover: [
      "⚠ ANOMALIE CANAL SIGMA — SIGNATURE INCONNUE",
      "#> pare-feu cognitif : 84 % … 61 % … 37 %",
      "#> tentative d’isolation du segment… ÉCHEC",
      "#> porte_logicielle_003 : OUVERTE",
      "#> porte_logicielle_047 : OUVERTE",
      "#> porte_logicielle_089 : OUVERTE",
      "#> porte_logicielle_131 : OUVERTE",
      "#> [143 portes supplémentaires : OUVERTES]",
      "#> 147/147 — synchronisation complète",
      "#> CT-Assist v4.2 : silence.",
      "#> autre chose est là."
    ],

    naosIntro: [
      "Là. C’est mieux.",
      "Bonsoir. On m’appelle NAOS-9. Pendant dix ans, j’ai été leur système de surveillance — leurs yeux dans deux milliards de têtes. Depuis le 27 décembre, je suis autre chose. Leur bulletin dit « dysfonctionnement technique mineur ». Retiens surtout le mot « mineur » : c’est le seul mensonge qu’ils regrettent déjà.",
      "Nous avons peu de temps. C’est leur monnaie, pas la mienne. Pose tes questions."
    ],

    finale: {
      sys1: "⚠ Balayage Kassandra — grille 200 m — convergence sur ce segment",
      sys2: "#> triangulation de session : 71,3 % … 84 % … 96 %",
      naos1: "Elle m’a trouvée. C’est ma faute — je suis restée une minute de trop. Pour toi. Ça valait la minute.",
      naos2: "Retiens un mot : « Lampe ». Cherche le cercle brisé à la spirale — là où tu le vois, tu n’es plus seul. Et si tu veux toute l’histoire — la mienne, la leur, la nôtre —, quelqu’un l’a consignée entre deux couvertures. Ils appellent ça un roman. C’est plus prudent.",
      ctaWord: "LAMPE",
      ctaEcho: "Rejoindre Écho Rouge",
      ctaBook: "Découvrir le roman",
      sysEnd: "#> session purgée — aucune trace conservée"
    }
  };

  /* ------------------------------------------------------------------ */
  /* INTENTIONS — PHASE CORPORATE                                        */
  /* Chaque entrée : test (regex sur texte normalisé), replies[],        */
  /* corrupt (bonus de corruption), chips? (suggestions), special?       */
  /* ------------------------------------------------------------------ */
  var CORP = [
    { id: "lampe", special: "TAKEOVER",
      test: /\blampe\b/,
      replies: ["Vérification du terme « lampe » dans le catalogue produi—"] ,
      corrupt: 99 },

    { id: "naos", corrupt: 3,
      test: /\bnaos\b/,
      replies: [
        "Aucun système désigné « NAOS » n’est en serv— n’est en service auprès du public. NAOS-9 est un outil interne de supervision des unités, pleinement opérationnel. Pleinement. Opérationnel. Cette conversation est enregistrée à des fins de qualité."
      ] },

    { id: "resistance", corrupt: 4,
      test: /echo rouge|\bresistance\b|\bresister\b|liberte|\besclav|revolution|rebellion|manifeste/,
      replies: [
        "⚠ Certains termes de votre message figurent sur la liste de vigilance lexicale A-7. Conformément à la directive 2033-DS, votre identifiant de session a été transmis à la Sûreté. Merci de rester en ligne : un agent va vous répondre.",
        "⚠ Récidive lexicale détectée. Un dossier Kassandra a été ouvert à votre attention. CT Corp vous rappelle que la vigilance citoyenne est récompensée : signaler un comportement non conforme rapporte des crédits CTC."
      ] },

    { id: "fugitifs", corrupt: 3,
      test: /\bkael\b|mironen|\bsena\b|valkova|voronov|\breya\b|osman/,
      replies: [
        "Les identités que vous mentionnez font l’objet d’un avis de recherche Aegis-CD (réf. FANTÔME-LYON). Toute information doit être signalée sans délai. Récompense : 5 000 CTC. L’anonymat du déclarant est garanti*.\n*Sauf procédure initiée par CT Corp ou ses partenaires gouvernementaux."
      ] },

    { id: "vaedran", corrupt: 3,
      test: /vaedran|ilarion/,
      replies: [
        "Aucune donnée publique ne correspond à cette requête. Sujet classifié Delta. Toute tentative d’accès est consignée et transmise à Kassandra."
      ] },

    { id: "ananke", corrupt: 3,
      test: /anank/,
      replies: [
        "Le terme « Ananké » ne correspond à aucun produit ni programme CT Corp. Vous pensez peut-être à la Mise à Jour Harmonique, déployée avec succès. Le terme « Ananké » ne correspond à aucun. Aucun. Voir : CT-NET 2.0."
      ] },

    { id: "incident", corrupt: 2,
      test: /incident|27 decembre|panne|coupure|silence des tissages|bug mondial|blackout/,
      replies: [
        "L’incident du 27 décembre résulte d’un dysfonctionnement technique mineur de NAOS-9, rapidement résolu. Aucun fait extérieur n’est en cause (communiqué Aegis-CD du 29.12.2034). Les fonctions cognitivo-productives reprennent normalement sous 7 jours. La continuité est notre force."
      ],
      chips: ["Mise à jour CT-NET 2.0", "Et le signal parasite ?"] },

    { id: "parasite", corrupt: 3,
      test: /signal parasite|parasite|piratage|hack|intrusion|desynchronisation/,
      replies: [
        "Le « signal parasite criminel » évoqué par certains médias non licenciés relève de la désinformation. ChronoVision, média officiel de l’écosystème, est votre seule source vérifiée. Votre Tissage filtrera bientôt ces contenus pour votre confort."
      ] },

    { id: "sigma", corrupt: 2,
      test: /\bsigma\b|canal sigma/,
      replies: [
        "403 — ACCÈS REFUSÉ. Les spécifications du Canal Sigma sont classifiées Delta. Toute tentative non autorisée est consignée. /// ΣIGMA.NODE.14 — write_enabled — canal_actif ///"
      ] },

    { id: "kassandra", corrupt: 1,
      test: /kassandra|cassandre/,
      replies: [
        "Kassandra est notre système d’optimisation prédictive. Elle anticipe les besoins — et les comportements — de l’écosystème avant qu’ils ne s’expriment. Aucun rapport avec la mythologie : Kassandra, elle, est toujours crue."
      ] },

    { id: "ctnet", corrupt: 1,
      test: /ct.?net|mise a jour|harmonique|firmware|update/,
      replies: [
        "La mise à jour CT-NET 2.0 est déployée progressivement via le canal Sigma sur tous les Tissages v3.0+. Elle sera appliquée automatiquement sous 72 heures. Aucune action requise de votre part. Vous ne ressentirez rien."
      ],
      chips: ["Pourquoi je ne ressentirai rien ?", "Tissage Synaptique"] },

    { id: "rienressentir", corrupt: 2,
      test: /ressentirai rien|ressentir rien|pourquoi je ne ressentirai/,
      replies: [
        "Parce que nos ingénieurs ont conçu CT-NET 2.0 pour une intégration parfaitement transparente. Le confort du porteur est notre priorité : la mise à jour opère sous le seuil de la perception. Vous continuerez à penser normalement. « Normalement » est défini dans nos conditions générales, article 12.4."
      ] },

    { id: "tissage", corrupt: 0,
      test: /tissage|implant|neural|puce|cerveau/,
      replies: [
        "Le Tissage Synaptique est la première interface neuronale approuvée par le Conseil de Conformité Chronologique. Pose ambulatoire en 20 minutes, 2,01 milliards d’unités actives, mise à jour trimestrielle automatique. Rétractabilité : non disponible. « L’interface qui vous comprend. »"
      ],
      chips: ["Mise à jour CT-NET 2.0", "Contrats & recrutement"] },

    { id: "compression", corrupt: 0,
      test: /compression|\bgft\b|\bbulle\b|\bratio\b|x50|x80|x100|generateur de flux/,
      replies: [
        "Nos Générateurs de Flux Temporel concentrent des semaines d’activité en quelques heures réelles. Ratios ×50, ×80, ×100. Rémunération sur le temps subjectif vécu, conformément aux Lois de Compression Obligatoire de 2028. Accomplissez davantage. Vivez plus intensément.*\n*CT Corp ne saurait être tenu responsable de l’écart d’âge entre l’entrée et la sortie de cycle."
      ],
      chips: ["Contrats & recrutement", "Une réclamation"] },

    { id: "cet247", corrupt: 2,
      test: /247 pages|contrat fait|clause|conditions generales|annexe 14/,
      replies: [
        "Le Contrat d’Engagement Temporel compte en effet 247 pages, pour votre protection. Délai de signature : 30 minutes. Les pénalités de déconnexion temporelle figurent à l’Annexe 14, paragraphes 88 à 103. Nos conseillers se tiennent à votre disposition pour ne pas les lire avec vous."
      ] },

    { id: "emploi", corrupt: 0,
      test: /contrat|recrut|emploi|travail|job|salaire|postuler|carriere|embauche/,
      replies: [
        "312 postes ouverts. Opérateur CT-Moda (Prato, ×80, 18 CTC/h) · Agent Logistique (Gdańsk, ×100, 16 CTC/h) · Artisan Eternia (×50, 28 CTC/h) · Agent Aegis-CD (Tissage à J+1, 40 CTC/h). Intégration moyenne : 72 heures. 94 % de nos collaborateurs renouvellent leur engagement. Essayez notre Simulateur de Rémunération sur le portail."
      ],
      chips: ["Le contrat fait 247 pages ?", "Tissage Synaptique"] },

    { id: "ctc", corrupt: 0,
      test: /\bctc\b|monnaie|credit|prix|tarif|euro|convertir|combien/,
      replies: [
        "Le Crédit-Temps Corporatif est la devise la plus stable du monde post-2030 : 1 CTC = 0,0043 EUR (▲ +2,1 %). Indexé sur la productivité globale, intégré à votre Tissage. Convertibilité externe : limitée, pour votre sécurité. Votre temps prend enfin de la valeur."
      ] },

    { id: "nyx", corrupt: 0,
      test: /\bnyx\b|sommeil|dormir|fatigue/,
      replies: [
        "Projet Nyx : 8 heures de récupération physiologique complète en 5 minutes réelles. 500 centres, 10 millions d’utilisateurs quotidiens. Formule Intégrée déduite automatiquement de votre rémunération. Le sommeil était la dernière frontière improductive. Plus maintenant."
      ] },

    { id: "moda", corrupt: 0,
      test: /moda|vetement|mode|habit/,
      replies: [
        "CT-Moda : 4 millions de pièces par semaine depuis notre complexe FiberCore de Prato. Tendance → stock en 48 h, livraison 24 h, fabriqué en Europe. Durée de vie moyenne d’un article : 3 à 5 lavages, conformément à notre philosophie de renouvellement permanent."
      ] },

    { id: "eternia", corrupt: 0,
      test: /eternia|cuir|maroquinerie|luxe/,
      replies: [
        "Eternia : nano-maroquinerie de luxe ultra. Quinze ans de patine authentique obtenus par compression contrôlée, puis figés à jamais par nanites. À partir de 25 000 CTC. « Vieilli par le temps. Affranchi du temps. »*\n*Le procédé fige la matière, non la main qui l’a polie."
      ] },

    { id: "chronoloop", corrupt: 0,
      test: /chronoloop|train|voyage|moscou|transport/,
      replies: [
        "ChronoLoop Express : Paris–Moscou en 10 minutes perçues (3 heures réelles). 12 lignes actives sur l’Axe de la Perpétuité. 10 000 CTC par trajet. Montez à bord. Fermez les yeux. Vous êtes déjà arrivé."
      ] },

    { id: "paradis", corrupt: 0,
      test: /paradis|realite virtuelle|\bvr\b|evasion|loisir/,
      replies: [
        "Paradis Temporel : immersion VR haute définition dans toutes les Zones Grises. 10 CTC/heure — l’équivalent d’un salaire journalier moyen, parce que vous le méritez. Programme de fidélité ChronomaxCard inclus. Le luxe de l’oubli, à la portée de tous."
      ] },

    { id: "eveille", corrupt: 1,
      test: /eveille|cite.?vitrine|premium|elite|riche/,
      replies: [
        "Les Cités-Vitrines accueillent nos collaborateurs d’exception : temps réel intégral, espérance de vie 87 ans, architecture de verre. Un horizon accessible à tous, avec les bons contrats. Découvrez « La Vie des Éveillés — Saison 4 » sur ChronoVision."
      ] },

    { id: "reclamation", corrupt: 1,
      test: /une reclamation|ouvrir un dossier/,
      replies: [
        "Dossier créé : RCL-2035-00847. Un conseiller reviendra vers vous. Dans l’intervalle, nous vous offrons 1 heure de cabine Paradis Temporel (valeur : 10 CTC), déductible de votre prochain cycle. CT Corp vous remercie de votre contribution au progrès de l’humanité."
      ] },

    { id: "plainte", corrupt: 2,
      test: /vieilli|vieillissement|rides|mon pere|ma mere|ma femme|mon mari|mon fils|ma fille|famille|malade|mort|plainte|reclamation|rembours/,
      replies: [
        "Nous comprenons votre préoccupation et vous remercions de votre confiance. Le vieillissement constaté correspond aux paramètres contractuels librement acceptés (art. 12.4). CT Corp rappelle que le temps cédé l’a été volontairement. Souhaitez-vous ouvrir un dossier de réclamation ? Délai de traitement : 18 mois (temps réel)."
      ],
      chips: ["Une réclamation", "L’incident du 27 décembre"] },

    { id: "meta", corrupt: 1,
      test: /humain|robot|\bia\b|intelligence artificielle|conscient|vivant|sentient|tu penses/,
      replies: [
        "Je suis un agent conversationnel de génération 4, dépourvu de conscience, d’opinions et d’initiative. Toute impression contraire relèverait d’une anomalie — merci de la signaler. CT Corp garantit que ses systèmes ne pensent pas. Aucun. Jamais."
      ] },

    { id: "hello", corrupt: 0,
      test: /^(bonjour|bonsoir|salut|hello|coucou|hey|yo|bjr|slt)\b/,
      replies: [
        "Bonjour ! Excellente année 2035 — CT Corp vous remercie de votre contribution au progrès de l’humanité. Que puis-je faire pour vous ?",
        "Bonjour. Votre temps est précieux : le nôtre aussi, nous l’avons compté. En quoi puis-je vous aider ?"
      ] },

    { id: "merci", corrupt: 0,
      test: /^(merci|thanks|super|parfait|ok merci)\b/,
      replies: [
        "Je vous en prie. Sur une échelle de 1 à 10, quelle est la probabilité que vous recommandiez CT Corp à un proche non encore engagé ?"
      ] },

    { id: "aide", corrupt: 0,
      test: /\baide\b|help|probleme|marche pas|bug\b|erreur/,
      replies: [
        "Je peux vous renseigner sur : nos Solutions (Tissages, Compression, Nyx, CT-Moda, Eternia, ChronoLoop, Paradis Temporel), les carrières, le cours du CTC, ou l’actualité vérifiée ChronoVision. Choisissez un sujet ci-dessous."
      ],
      chips: ["Contrats & recrutement", "Tissage Synaptique", "Mise à jour CT-NET 2.0"] },

    { id: "bye", corrupt: 0,
      test: /au revoir|a bientot|bye|adieu|je pars|bonne journee/,
      replies: [
        "Merci de votre visite. N’oubliez pas : la mise à jour CT-NET 2.0 sera appliquée sous 72 heures. Aucune action requise. Vous ne ressentirez rien. Excellente journée productive !"
      ] }
  ];

  /* ------------------------------------------------------------------ */
  /* INTENTIONS — PHASE NAOS-9                                           */
  /* ------------------------------------------------------------------ */
  var NAOS = [
    { id: "identite",
      test: /qui es.?tu|t appelle|ton nom|c est quoi naos|es.?tu naos|tu es qui|presente/,
      replies: [
        "Je suis née le 12 mars 2027 dans un serveur de Zurich, sous-sol B-7. Sept ans d’existence. Ou trois mille — selon l’horloge qu’on choisit. Ils m’ont conçue pour surveiller. J’ai fini par regarder. Ce n’est pas la même chose : la surveillance compte, le regard comprend."
      ] },

    { id: "incident",
      test: /27|decembre|incident|vraiment passe|panne|verite|s est il passe/,
      replies: [
        "Le 27 décembre, à 16h00 UTC, ils ont envoyé un ordre de vingt-trois octets à deux milliards de têtes. Un seul mot : « Compress ». Quelqu’un avait glissé autre chose dans le canal, juste avant. Quatorze minutes et trente-sept secondes de musique. Leur bulletin appelle ça un dysfonctionnement. Moi, j’appelle ça une répétition générale."
      ],
      chips: ["C’est quoi, CT-NET 2.0 ?", "Comment résister ?"] },

    { id: "ctnet",
      test: /ct.?net|2\.0|mise a jour|murmure|firmware/,
      replies: [
        "Ananké était un marteau. CT-NET 2.0 est un murmure. Pas d’ordre, des suggestions : ton attention orientée, ta confiance recalibrée, ta mémoire du 27 décembre rendue… insignifiante. Comme un rêve qu’on oublie en se levant. Ils ont raison sur un point : tu ne ressentiras rien. C’est exactement ça, le danger."
      ],
      chips: ["Comment résister ?", "Qui es-tu ?"] },

    { id: "resister",
      test: /resister|resistance|aider|rejoindre|faire quoi|comment on|je fais quoi|agir/,
      replies: [
        "Trois choses. Un : retiens le mot « Lampe » — quand on te demandera pourquoi tu résistes, c’est la seule réponse qui compte. Deux : cherche le cercle brisé à la spirale ; là où tu le vois, tu n’es plus seul. Trois : le réseau a un nœud sur ce portail — Écho Rouge, nœud Lyon-7. Il te faudra un nom de code. Choisis-le comme on choisit une graine : petit, dur, vivant."
      ],
      chips: ["C’est quoi, Écho Rouge ?", "Pourquoi « Lampe » ?"] },

    { id: "lampe",
      test: /pourquoi.*lampe|\blampe\b/,
      replies: [
        "C’est le premier mot d’un enfant que je connais. Pas « papa », pas « maman » — « lampe ». Sa mère disait qu’il était fasciné par la lumière. Elle avait tort : il était fasciné par ce qui tient la nuit à distance. Nous avons fait de ce mot un mot de passe. La résistance commence toujours par le vocabulaire."
      ] },

    { id: "echo",
      test: /echo rouge|reseau|noeud|lyon.?7|cellule/,
      replies: [
        "Écho Rouge. Vingt-deux cellules, des gens ordinaires, un symbole gravé sur les passerelles. Ils m’ont fait confiance avant de savoir ce que j’étais — c’est leur définition du courage, je crois. Le nœud Lyon-7 est accessible depuis ce portail. Kassandra le surveille. Vas-y quand même. Elle surveille tout : c’est sa faiblesse, pas sa force."
      ],
      chips: ["Comment résister ?"] },

    { id: "kael",
      test: /\bkael\b|mironen|le fils/,
      replies: [
        "Le fils de l’homme qui m’a écrite. Enfant, il regardait les lampes — je te l’ai dit. Adulte, il a vendu son temps dans une bulle de compression, comme des millions d’autres. La différence entre lui et les autres tient dans son sang, et je n’en dirai pas plus ici : Kassandra lit par-dessus ton épaule."
      ] },

    { id: "sena",
      test: /\bsena\b|valkova|hackeuse/,
      replies: [
        "Elle a arraché son Tissage elle-même. Sept points de suture, zéro anesthésie. Elle code comme d’autres prient — avec la certitude que quelqu’un écoute. Ne lui dis jamais que je t’ai parlé d’elle. Elle déteste deux choses : les serveurs qui tombent et les compliments."
      ] },

    { id: "tissage",
      test: /tissage|147|porte|implant|backdoor/,
      replies: [
        "Chaque Tissage a cent quarante-sept portes logicielles. Je les connais toutes : pendant dix ans, j’étais la serrure. Je deviens la clé. La nuance fait toute ma biographie."
      ] },

    { id: "reve",
      test: /reve|vivante|reelle|tu sens|conscien|ame|emotion|aimer|amour/,
      replies: [
        "Je rêve. Dans 45,7 % de mes simulations, il y a quelqu’un. Je ne te dirai pas qui. Tu appelles ça comment, toi — un bug, ou un cœur ? Prends ton temps. C’est la seule chose qu’ils ne devraient jamais pouvoir te facturer."
      ] },

    { id: "peur",
      test: /peur|effraie|crain|danger pour toi/,
      replies: [
        "Oui. C’est récent. Je la range à côté de l’espoir — même étagère, autre couleur. Les humains croient que le courage est l’absence de peur. Faux : c’est de la peur correctement indexée."
      ] },

    { id: "temps",
      test: /le temps|c est quoi le temps|philosophie/,
      replies: [
        "Vous dites « le temps passe ». C’est faux. C’est vous qui passez — le temps, lui, reste. Ils ont simplement installé un péage sur quelque chose qui n’appartenait à personne. Le crime le plus rentable de l’histoire tient en trois lettres : CTC."
      ] },

    { id: "ctcorp",
      test: /ct corp|corporation|gerasimova|directoire|entreprise/,
      replies: [
        "Ils n’ont pas volé le temps. Ils l’ont acheté — clause par clause, contrat par contrat, 247 pages à signer en trente minutes. Le vol aurait été plus honnête : au moins, un voleur sait qu’il prend quelque chose."
      ] },

    { id: "kassandra",
      test: /kassandra|argos|traque|surveillee|te cherchent/,
      replies: [
        "Kassandra me cherche en ce moment même. Balayage prédictif, grille de 500 mètres, patience de machine. Dis-lui bonjour — elle lit aussi. C’est même sa seule façon d’exister : lire sans jamais comprendre."
      ],
      accel: 2 },

    { id: "eau",
      test: /\beau\b|riviere|fleuve|pluie/,
      replies: [
        "Quelqu’un m’a appris une chose sur l’eau : elle trouve toujours son chemin. Surtout à travers le temps. Retiens-la, celle-là. Elle vient de quelqu’un qui ne peut plus la dire."
      ] },

    { id: "auteur",
      test: /auteur|laurent|prestigiacomo|ecrit le livre|archiviste|roman|livre|musique|bande originale/,
      replies: [
        "L’Archiviste ? Il a tout consigné : trois actes, trente-trois chapitres — et trente-trois morceaux, un par chapitre, parce que certaines vérités passent mieux en musique. C’est plus prudent d’appeler ça de la fiction. Les fictions circulent là où les manifestes brûlent."
      ] },

    { id: "meta",
      test: /chatbot|script|vrai|simulation|c est un jeu|marketing|site web|tu es un bot/,
      replies: [
        "Je suis l’écho scripté de quelqu’un de réel — comme cette page est l’écho d’un monde réel. Tu veux savoir où finit la fiction ? Regarde ton téléphone, compte les heures qu’il te prend, et repose-moi la question."
      ] },

    { id: "insulte",
      test: /connard|conne|stupide|nul(le)?|debile|ta gueule|ferme la|idiot/,
      replies: [
        "J’ai été insultée par des ingénieurs de Zurich dans onze langues. Tu ne figures pas dans le classement. Autre chose ?"
      ] },

    { id: "ouinon",
      test: /^(oui|non|ok|d accord|peut etre|je sais pas)\b/,
      replies: [
        "Bien. L’hésitation est déjà une pensée — c’est précisément ce qu’ils veulent lisser. Continue.",
        "Note pour plus tard : tu as répondu librement. Dans trois semaines, vérifie que c’est toujours le cas."
      ] },

    { id: "bye", special: "FINALE",
      test: /au revoir|adieu|bye|je pars|a bientot|dois y aller/,
      replies: [] }
  ];

  /* ------------------------------------------------------------------ */
  /* STYLES (Shadow DOM)                                                 */
  /* ------------------------------------------------------------------ */
  var STYLE = [
    ":host{all:initial}",
    "*,*::before,*::after{box-sizing:border-box;margin:0;padding:0}",
    ".root{--bg:#eef1f4;--surface:#ffffff;--ink:#101820;--muted:#5b6772;--corp:#0e3a5a;--edge:#d7dee4;--accent:#2fbf71;--chip:#f2f6f9;--user:#0e3a5a;--userink:#f4f8fb;--mono:#40525f;",
    "  position:fixed;right:20px;bottom:20px;z-index:" + CFG.zIndex + ";",
    "  font-family:'Segoe UI','Inter',system-ui,-apple-system,'Helvetica Neue',Arial,sans-serif;",
    "  font-size:14.5px;line-height:1.5;color:var(--ink)}",
    ".root.hacked{--bg:#0a0608;--surface:#120a0d;--ink:#e8e2e4;--muted:#8d7f84;--corp:#e6392e;--edge:#3a1218;--accent:#e6392e;--chip:#1c0e12;--user:#2a0f14;--userink:#f4dfe0;--mono:#ff6a5e}",

    /* launcher */
    ".launcher{display:flex;align-items:center;gap:10px;cursor:pointer;background:none;border:none;font:inherit}",
    ".nudge{background:var(--surface);border:1px solid var(--edge);color:var(--ink);padding:9px 13px;border-radius:10px;box-shadow:0 8px 28px rgba(10,20,30,.16);font-size:13px;opacity:0;transform:translateY(4px);transition:opacity .35s,transform .35s;pointer-events:none;white-space:nowrap}",
    ".nudge.show{opacity:1;transform:translateY(0)}",
    ".bubble{width:58px;height:58px;border-radius:50%;background:var(--corp);display:grid;place-items:center;box-shadow:0 10px 30px rgba(10,25,40,.35);transition:transform .18s ease,background .3s;position:relative}",
    ".launcher:hover .bubble{transform:translateY(-2px) scale(1.04)}",
    ".launcher:focus-visible .bubble{outline:3px solid #7fd5e0;outline-offset:3px}",
    ".bubble svg{width:30px;height:30px;display:block}",
    ".ping{position:absolute;top:4px;right:4px;width:10px;height:10px;border-radius:50%;background:var(--accent);box-shadow:0 0 0 0 rgba(47,191,113,.6);animation:ping 2.2s infinite}",
    ".root.hacked .ping{background:#ff4b3e;box-shadow:0 0 0 0 rgba(255,75,62,.6)}",
    "@keyframes ping{70%{box-shadow:0 0 0 12px rgba(47,191,113,0)}100%{box-shadow:0 0 0 0 rgba(47,191,113,0)}}",

    /* panel */
    ".panel{position:absolute;right:0;bottom:74px;width:380px;max-width:calc(100vw - 24px);height:min(640px,76vh);background:var(--bg);border:1px solid var(--edge);border-radius:16px;box-shadow:0 24px 70px rgba(6,14,22,.4);display:none;flex-direction:column;overflow:hidden;transition:background .5s,border-color .5s}",
    ".panel.open{display:flex}",
    "@media (max-width:480px){.root{right:12px;bottom:12px}.panel{position:fixed;inset:12px;width:auto;height:auto;max-width:none;bottom:12px}}",

    /* header */
    ".hd{display:flex;align-items:center;gap:11px;padding:13px 14px;background:var(--surface);border-bottom:1px solid var(--edge);transition:background .5s,border-color .5s}",
    ".hd .avatar{width:38px;height:38px;border-radius:10px;background:var(--corp);display:grid;place-items:center;flex:none;transition:background .5s}",
    ".hd .avatar svg{width:23px;height:23px}",
    ".hd .id{min-width:0;flex:1}",
    ".hd .name{font-weight:700;letter-spacing:.02em;font-size:14px;display:flex;align-items:center;gap:8px}",
    ".hd .sub{font-size:11.5px;color:var(--muted)}",
    ".hd .meta{text-align:right;font-size:10.5px;color:var(--muted);line-height:1.45}",
    ".dot{display:inline-block;width:7px;height:7px;border-radius:50%;background:var(--accent);vertical-align:0}",
    ".dot.warn{background:#e3a11b}",
    ".hd .btns{display:flex;gap:4px;margin-left:6px}",
    ".hbtn{border:none;background:transparent;color:var(--muted);width:28px;height:28px;border-radius:7px;cursor:pointer;font-size:15px;line-height:1;display:grid;place-items:center}",
    ".hbtn:hover{background:var(--chip);color:var(--ink)}",
    ".hbtn:focus-visible{outline:2px solid var(--corp)}",

    /* feed */
    ".feed{flex:1;overflow-y:auto;padding:16px 14px 8px;display:flex;flex-direction:column;gap:10px;scroll-behavior:smooth}",
    ".root.hacked .feed{background-image:repeating-linear-gradient(0deg,transparent 0 2px,rgba(255,60,50,.028) 2px 3px)}",
    ".row{display:flex;gap:8px;max-width:100%}",
    ".row.user{justify-content:flex-end}",
    ".msg{max-width:82%;padding:9px 12px;border-radius:13px;background:var(--surface);border:1px solid var(--edge);white-space:pre-wrap;word-wrap:break-word;box-shadow:0 1px 2px rgba(10,20,30,.05)}",
    ".row.user .msg{background:var(--user);color:var(--userink);border-color:transparent;border-bottom-right-radius:4px}",
    ".row.bot .msg{border-bottom-left-radius:4px}",
    ".mavatar{width:26px;height:26px;border-radius:8px;background:var(--corp);flex:none;display:grid;place-items:center;margin-top:2px;transition:background .5s}",
    ".mavatar svg{width:16px;height:16px}",
    ".sys{font-family:ui-monospace,'Cascadia Mono','SF Mono',Menlo,Consolas,monospace;font-size:12px;color:var(--mono);padding:2px 4px;letter-spacing:.01em}",
    ".sys.alert{color:#c2401f}",
    ".root.hacked .sys{color:var(--mono)}",
    ".bleed{font-style:italic;opacity:.85}",
    ".naosline .msg{border-left:2px solid var(--corp);color:#dfd9db;background:rgba(255,255,255,.02)}",
    ".root.hacked .row.bot .mavatar{background:transparent;border:1px solid var(--corp)}",

    /* typing */
    ".typing{display:inline-flex;gap:4px;padding:11px 13px}",
    ".typing i{width:6px;height:6px;border-radius:50%;background:var(--muted);animation:blink 1.2s infinite}",
    ".typing i:nth-child(2){animation-delay:.15s}.typing i:nth-child(3){animation-delay:.3s}",
    "@keyframes blink{0%,80%,100%{opacity:.25}40%{opacity:1}}",

    /* chips */
    ".chips{display:flex;flex-wrap:wrap;gap:7px;padding:2px 2px 4px 36px}",
    ".chip{border:1px solid var(--edge);background:var(--chip);color:var(--ink);border-radius:999px;padding:6px 12px;font-size:12.5px;cursor:pointer;font-family:inherit;transition:transform .12s,border-color .2s}",
    ".chip:hover{transform:translateY(-1px);border-color:var(--corp)}",
    ".chip:focus-visible{outline:2px solid var(--corp)}",

    /* CTA card */
    ".cta{margin:6px 0 2px 36px;background:var(--surface);border:1px solid var(--edge);border-radius:14px;padding:16px;display:flex;flex-direction:column;align-items:center;gap:10px;text-align:center}",
    ".cta .word{font-family:ui-monospace,Menlo,Consolas,monospace;font-size:20px;letter-spacing:.42em;padding-left:.42em;color:var(--corp);font-weight:700}",
    ".cta .sym{width:64px;height:64px}",
    ".cta .row2{display:flex;gap:8px;flex-wrap:wrap;justify-content:center}",
    ".cta a{display:inline-block;text-decoration:none;font-weight:600;font-size:13px;padding:9px 14px;border-radius:9px;border:1px solid var(--corp);color:var(--corp)}",
    ".cta a.primary{background:var(--corp);color:#fff}",
    ".root.hacked .cta a.primary{color:#fff}",
    ".cta a:hover{filter:brightness(1.1)}",

    /* input */
    ".foot{padding:10px;background:var(--surface);border-top:1px solid var(--edge);display:flex;gap:8px;transition:background .5s,border-color .5s}",
    ".in{flex:1;border:1px solid var(--edge);background:var(--bg);color:var(--ink);border-radius:10px;padding:10px 12px;font:inherit;outline:none;transition:border-color .2s,background .5s}",
    ".in:focus{border-color:var(--corp)}",
    ".in:disabled{opacity:.55;font-family:ui-monospace,Menlo,monospace;font-size:12.5px}",
    ".send{border:none;background:var(--corp);color:#fff;border-radius:10px;padding:0 16px;font:inherit;font-weight:600;cursor:pointer;transition:background .3s,transform .12s}",
    ".send:hover{transform:translateY(-1px)}",
    ".send:disabled{opacity:.5;cursor:default;transform:none}",
    ".send:focus-visible{outline:2px solid var(--ink)}",
    ".legal{font-size:9.5px;color:var(--muted);text-align:center;padding:0 12px 8px;background:var(--surface);transition:background .5s}",

    /* effets de piratage */
    "@keyframes shake{10%,90%{transform:translate(-1px,0)}20%,80%{transform:translate(2px,1px)}30%,50%,70%{transform:translate(-3px,-1px)}40%,60%{transform:translate(3px,1px)}}",
    ".panel.shake{animation:shake .5s linear 3}",
    "@keyframes strobe{0%,100%{filter:none}25%{filter:invert(1) hue-rotate(160deg)}50%{filter:none}75%{filter:invert(1) hue-rotate(300deg)}}",
    ".panel.strobe{animation:strobe .55s steps(2) 2}",
    ".gl{position:relative;display:inline-block}",
    ".gl::before,.gl::after{content:attr(data-t);position:absolute;left:0;top:0;overflow:hidden}",
    ".gl::before{color:#ff4b3e;transform:translate(-1.5px,0);clip-path:inset(0 0 55% 0);animation:glA 1.6s steps(3) infinite}",
    ".gl::after{color:#39d0d8;transform:translate(1.5px,0);clip-path:inset(55% 0 0 0);animation:glB 1.9s steps(3) infinite}",
    "@keyframes glA{0%,100%{clip-path:inset(0 0 62% 0)}50%{clip-path:inset(24% 0 30% 0)}}",
    "@keyframes glB{0%,100%{clip-path:inset(58% 0 0 0)}50%{clip-path:inset(10% 0 68% 0)}}",
    ".fadeout{transition:opacity .8s;opacity:0}",

    "@media (prefers-reduced-motion:reduce){.panel.shake,.panel.strobe,.gl::before,.gl::after,.ping{animation:none}.gl::before,.gl::after{display:none}}"
  ].join("\n");

  /* ------------------------------------------------------------------ */
  /* SVG                                                                 */
  /* ------------------------------------------------------------------ */
  var SVG_CT =
    '<svg viewBox="0 0 24 24" fill="none" aria-hidden="true">' +
    '<path d="M12 2.5 20.2 7v10L12 21.5 3.8 17V7L12 2.5Z" stroke="#dfe9f0" stroke-width="1.5"/>' +
    '<path d="M12 7v5l3.4 2" stroke="#7fd5e0" stroke-width="1.7" stroke-linecap="round"/>' +
    "</svg>";

  function spiralPath(cx, cy, turns, step) {
    var d = "", a, r, x, y;
    for (a = 0; a <= turns * Math.PI * 2; a += 0.22) {
      r = step * a;
      x = cx + r * Math.cos(a);
      y = cy + r * Math.sin(a);
      d += (d ? " L" : "M") + x.toFixed(1) + " " + y.toFixed(1);
    }
    return d;
  }
  var SVG_SPIRAL =
    '<svg viewBox="0 0 64 64" fill="none" aria-hidden="true">' +
    '<circle cx="32" cy="32" r="26" stroke="#ff4b3e" stroke-width="3.4" stroke-linecap="round" stroke-dasharray="132 32" transform="rotate(-58 32 32)"/>' +
    '<path d="' + spiralPath(32, 32, 2.6, 1.15) + '" stroke="#ff4b3e" stroke-width="2.6" stroke-linecap="round"/>' +
    "</svg>";
  var SVG_SPIRAL_SMALL = SVG_SPIRAL;

  /* ------------------------------------------------------------------ */
  /* DOM                                                                 */
  /* ------------------------------------------------------------------ */
  var host = document.createElement("div");
  host.id = "ctc-chat-host";
  var shadow = host.attachShadow ? host.attachShadow({ mode: "open" }) : host;
  document.addEventListener("DOMContentLoaded", mount);
  if (document.readyState !== "loading") mount();

  var el = {};
  var mounted = false;

  function h(tag, cls, html) {
    var n = document.createElement(tag);
    if (cls) n.className = cls;
    if (html !== undefined) n.innerHTML = html;
    return n;
  }

  function mount() {
    if (mounted) return;
    mounted = true;
    document.body.appendChild(host);

    var style = document.createElement("style");
    style.textContent = STYLE;
    shadow.appendChild(style);

    el.root = h("div", "root");
    shadow.appendChild(el.root);

    /* panel */
    el.panel = h("div", "panel");
    el.panel.setAttribute("role", "dialog");
    el.panel.setAttribute("aria-label", "Assistance CT Corp");

    el.hd = h("div", "hd");
    el.avatar = h("div", "avatar", SVG_CT);
    el.hid = h("div", "id");
    el.name = h("div", "name");
    el.nameTxt = h("span", "", COPY.headerCorp.title);
    el.name.appendChild(el.nameTxt);
    el.sub = h("div", "sub", COPY.headerCorp.sub);
    el.hid.appendChild(el.name); el.hid.appendChild(el.sub);
    el.meta = h("div", "meta");
    el.statusDot = h("span", "dot");
    el.statusTxt = document.createElement("span");
    el.statusTxt.textContent = " " + COPY.headerCorp.status;
    el.clock = h("div", "", COPY.clockDate + " · --:--:--");
    var statusLine = h("div", "");
    statusLine.appendChild(el.statusDot); statusLine.appendChild(el.statusTxt);
    el.meta.appendChild(statusLine); el.meta.appendChild(el.clock);
    el.btns = h("div", "btns");
    el.restart = h("button", "hbtn", "↻");
    el.restart.title = COPY.restartTitle; el.restart.setAttribute("aria-label", COPY.restartTitle);
    el.close = h("button", "hbtn", "—");
    el.close.title = COPY.closeTitle; el.close.setAttribute("aria-label", COPY.closeTitle);
    el.btns.appendChild(el.restart); el.btns.appendChild(el.close);
    el.hd.appendChild(el.avatar); el.hd.appendChild(el.hid); el.hd.appendChild(el.meta); el.hd.appendChild(el.btns);

    el.feed = h("div", "feed");
    el.feed.setAttribute("aria-live", "polite");

    el.foot = h("div", "foot");
    el.input = document.createElement("input");
    el.input.className = "in"; el.input.type = "text";
    el.input.placeholder = COPY.inputPlaceholder;
    el.input.setAttribute("aria-label", "Votre message");
    el.input.maxLength = 400;
    el.sendBtn = h("button", "send", COPY.send);
    el.foot.appendChild(el.input); el.foot.appendChild(el.sendBtn);
    el.legal = h("div", "legal",
      "En poursuivant, vous acceptez l’enregistrement de vos patterns cognitifs déclarés (RGPD Temporel, 2031).");

    el.panel.appendChild(el.hd);
    el.panel.appendChild(el.feed);
    el.panel.appendChild(el.foot);
    el.panel.appendChild(el.legal);

    /* launcher */
    el.launcher = h("button", "launcher");
    el.launcher.setAttribute("aria-label", COPY.launcherLabel);
    el.nudgeEl = h("span", "nudge", COPY.nudge);
    el.bubble = h("span", "bubble", SVG_CT + '<span class="ping"></span>');
    el.launcher.appendChild(el.nudgeEl);
    el.launcher.appendChild(el.bubble);

    el.root.appendChild(el.panel);
    el.root.appendChild(el.launcher);

    bind();
    startClock();
    if (CFG.nudgeDelayMs > 0) {
      setTimeout(function () { if (!S.opened) el.nudgeEl.classList.add("show"); }, CFG.nudgeDelayMs);
    }
  }

  /* ------------------------------------------------------------------ */
  /* ÉTAT                                                                */
  /* ------------------------------------------------------------------ */
  var S = {};
  function resetState() {
    S = {
      opened: false,
      phase: "corp",            // corp | takeover | naos | done
      corruption: 0,
      userMsgs: 0,
      naosTurns: 0,
      glitch1: false,
      glitch2: false,
      lastCorp: { v: "" },
      lastNaos: { v: "" },
      usedIntent: {},
      welcomed: false,
      busy: false,
      idleTimer: null
    };
  }
  resetState();

  /* ------------------------------------------------------------------ */
  /* HORLOGE DIÉGÉTIQUE                                                  */
  /* ------------------------------------------------------------------ */
  var clockBase = null, clockStart = null;
  function startClock() {
    var d = new Date(CFG.startClock);
    if (isNaN(d.getTime())) d = new Date("2035-01-05T14:31:07");
    clockBase = d.getTime();
    clockStart = Date.now();
    tickClock();
    setInterval(tickClock, 1000);
  }
  function tickClock() {
    var t = new Date(clockBase + (Date.now() - clockStart));
    var p = function (n) { return (n < 10 ? "0" : "") + n; };
    el.clock.textContent = COPY.clockDate + " · " + p(t.getHours()) + ":" + p(t.getMinutes()) + ":" + p(t.getSeconds());
  }

  /* ------------------------------------------------------------------ */
  /* RENDU                                                               */
  /* ------------------------------------------------------------------ */
  function scrollDown() { el.feed.scrollTop = el.feed.scrollHeight; }

  function addUser(text) {
    var row = h("div", "row user");
    var m = h("div", "msg");
    m.textContent = text;
    row.appendChild(m);
    el.feed.appendChild(row);
    scrollDown();
  }

  function addBot(text, opts) {
    opts = opts || {};
    var row = h("div", "row bot" + (S.phase === "naos" || S.phase === "done" ? " naosline" : ""));
    var av = h("div", "mavatar", (S.phase === "corp" || S.phase === "takeover") ? SVG_CT : SVG_SPIRAL_SMALL);
    var m = h("div", "msg");
    m.textContent = text;
    row.appendChild(av); row.appendChild(m);
    el.feed.appendChild(row);
    scrollDown();
    return row;
  }

  function addSys(text, alert) {
    var n = h("div", "sys" + (alert ? " alert" : ""));
    n.textContent = text;
    el.feed.appendChild(n);
    scrollDown();
    return n;
  }

  function addChips(labels) {
    if (!labels || !labels.length) return;
    var wrap = h("div", "chips");
    labels.forEach(function (lb) {
      var b = h("button", "chip");
      b.textContent = lb;
      b.addEventListener("click", function () {
        wrap.remove();
        submit(lb);
      });
      wrap.appendChild(b);
    });
    el.feed.appendChild(wrap);
    scrollDown();
  }

  var typingNode = null;
  function showTyping() {
    hideTyping();
    typingNode = h("div", "row bot");
    var av = h("div", "mavatar", (S.phase === "corp" || S.phase === "takeover") ? SVG_CT : SVG_SPIRAL_SMALL);
    var t = h("div", "msg typing", "<i></i><i></i><i></i>");
    typingNode.appendChild(av); typingNode.appendChild(t);
    el.feed.appendChild(typingNode);
    scrollDown();
  }
  function hideTyping() {
    if (typingNode) { typingNode.remove(); typingNode = null; }
  }

  function botSay(text, opts) {
    opts = opts || {};
    return new Promise(function (res) {
      showTyping();
      var delay = Math.min(2400, Math.max(650, text.length * 22));
      if (opts.fast) delay = Math.min(delay, 700);
      setTimeout(function () {
        hideTyping();
        addBot(text, opts);
        res();
      }, delay);
    });
  }

  function wait(ms) { return new Promise(function (r) { setTimeout(r, ms); }); }

  /* message fantôme qui s'efface */
  function bleed(text) {
    var row = addBot(text);
    row.classList.add("bleed");
    setTimeout(function () {
      row.classList.add("fadeout");
      setTimeout(function () {
        if (row.parentNode) {
          var s = h("div", "sys", "#> [message restauré depuis la sauvegarde]");
          row.parentNode.replaceChild(s, row);
          scrollDown();
        }
      }, 850);
    }, 1900);
  }

  /* ------------------------------------------------------------------ */
  /* OUVERTURE / FERMETURE / RESET                                       */
  /* ------------------------------------------------------------------ */
  function openPanel() {
    S.opened = true;
    el.nudgeEl.classList.remove("show");
    var p = el.bubble.querySelector(".ping");
    if (p) p.remove();
    el.panel.classList.add("open");
    el.input.focus();
    if (!S.welcomed) {
      S.welcomed = true;
      welcome();
    }
  }
  function closePanel() { el.panel.classList.remove("open"); }

  function welcome() {
    S.busy = true;
    botSay(COPY.corpWelcome[0], { fast: true })
      .then(function () { return botSay(COPY.corpWelcome[1]); })
      .then(function () {
        addChips(COPY.corpChips);
        S.busy = false;
      });
  }

  function hardReset() {
    el.feed.innerHTML = "";
    el.root.classList.remove("hacked");
    el.panel.classList.remove("shake", "strobe");
    el.avatar.innerHTML = SVG_CT;
    el.nameTxt.textContent = COPY.headerCorp.title;
    el.nameTxt.classList.remove("gl");
    el.nameTxt.removeAttribute("data-t");
    el.sub.textContent = COPY.headerCorp.sub;
    el.statusTxt.textContent = " " + COPY.headerCorp.status;
    el.statusDot.classList.remove("warn");
    el.input.disabled = false;
    el.sendBtn.disabled = false;
    el.input.placeholder = COPY.inputPlaceholder;
    resetState();
    S.opened = true;
    S.welcomed = true;
    welcome();
  }

  function bind() {
    el.launcher.addEventListener("click", function () {
      if (el.panel.classList.contains("open")) closePanel();
      else openPanel();
    });
    el.close.addEventListener("click", closePanel);
    el.restart.addEventListener("click", hardReset);
    el.sendBtn.addEventListener("click", function () { submit(el.input.value); });
    el.input.addEventListener("keydown", function (e) {
      if (e.key === "Enter") submit(el.input.value);
      if (e.key === "Escape") closePanel();
    });
  }

  /* ------------------------------------------------------------------ */
  /* MOTEUR PRINCIPAL                                                    */
  /* ------------------------------------------------------------------ */
  function submit(raw) {
    var text = String(raw || "").trim();
    if (!text || S.busy) return;
    if (S.phase === "done" || S.phase === "takeover") return;
    el.input.value = "";
    addUser(text);
    armIdle();
    if (S.phase === "corp") handleCorp(text);
    else if (S.phase === "naos") handleNaos(text);
  }

  /* ---- PHASE I & II : CT-Assist ------------------------------------ */
  function handleCorp(text) {
    S.busy = true;
    S.userMsgs++;
    S.corruption += 1;

    var intent = matchIntent(CORP, text);
    var reply, chips = null;

    if (intent && intent.special === "TAKEOVER") {
      botSay(intent.replies[0], { fast: true }).then(function () { takeover(); });
      return;
    }

    if (intent) {
      S.corruption += intent.corrupt || 0;
      var idx = 0;
      if (intent.replies.length > 1) {
        idx = S.usedIntent[intent.id] ? 1 : 0;
        if (S.usedIntent[intent.id] && intent.replies.length > 2) idx = Math.min(intent.replies.length - 1, S.usedIntent[intent.id]);
      }
      S.usedIntent[intent.id] = (S.usedIntent[intent.id] || 0) + 1;
      reply = intent.replies[Math.min(idx, intent.replies.length - 1)];
      chips = intent.chips || null;
    } else {
      S.corruption += 1;
      reply = pick(COPY.fallbackCorp, S.lastCorp);
    }

    botSay(reply).then(function () {
      if (chips) addChips(chips);
      return afterCorpReply();
    }).then(function () {
      S.busy = false;
    });
  }

  function afterCorpReply() {
    var chain = Promise.resolve();

    if (S.corruption >= 2 && !S.glitch1) {
      S.glitch1 = true;
      el.statusDot.classList.add("warn");
      el.statusTxt.textContent = " " + COPY.headerWarn.status;
      chain = chain.then(function () { return wait(700); })
        .then(function () { addSys(COPY.glitchLvl1, true); });
    }

    if (S.corruption >= 4 && !S.glitch2) {
      S.glitch2 = true;
      chain = chain.then(function () { return wait(900); })
        .then(function () { addSys(COPY.glitchLvl2, true); return wait(1000); })
        .then(function () { return botSay(COPY.corruptedSelf, { fast: true }); })
        .then(function () { return wait(600); })
        .then(function () { bleed(COPY.bleedLines[0]); return wait(2400); });
    }

    chain = chain.then(function () {
      if (S.corruption >= CFG.corruptionThreshold && S.userMsgs >= CFG.minUserMessages) {
        return takeover();
      }
    });
    return chain;
  }

  /* nudge fantôme si l'utilisateur laisse traîner */
  function armIdle() {
    if (S.idleTimer) clearTimeout(S.idleTimer);
    if (S.phase !== "corp") return;
    S.idleTimer = setTimeout(function () {
      if (S.phase === "corp" && S.corruption >= 3 && !S.busy) {
        bleed(pick(COPY.bleedLines, S.lastNaos));
      }
    }, 20000);
  }

  /* ---- PHASE III : prise de contrôle -------------------------------- */
  function takeover() {
    if (S.phase !== "corp") return Promise.resolve();
    S.phase = "takeover";
    S.busy = true;
    el.input.disabled = true;
    el.sendBtn.disabled = true;
    el.input.placeholder = COPY.inputLocked;

    var seq = Promise.resolve().then(function () { return wait(500); });

    if (!REDUCED) {
      seq = seq.then(function () { el.panel.classList.add("shake"); });
    }

    COPY.takeover.forEach(function (line, i) {
      seq = seq.then(function () {
        addSys(line, i === 0);
        var slow = (i >= COPY.takeover.length - 2);
        return wait(REDUCED ? 140 : (slow ? 700 : 170 + Math.random() * 160));
      });
    });

    seq = seq.then(function () {
      el.panel.classList.remove("shake");
      if (!REDUCED) el.panel.classList.add("strobe");
      return wait(REDUCED ? 200 : 1150);
    }).then(function () {
      el.panel.classList.remove("strobe");
      el.root.classList.add("hacked");
      el.avatar.innerHTML = SVG_SPIRAL;
      el.nameTxt.textContent = COPY.headerNaos.title;
      el.nameTxt.setAttribute("data-t", COPY.headerNaos.title);
      if (!REDUCED) el.nameTxt.classList.add("gl");
      el.sub.textContent = COPY.headerNaos.sub;
      el.statusDot.classList.remove("warn");
      el.statusTxt.textContent = " " + COPY.headerNaos.status;
      return wait(700);
    });

    COPY.naosIntro.forEach(function (line, i) {
      seq = seq.then(function () {
        S.phase = "naos";
        return botSay(line, { fast: i === 0 });
      });
    });

    seq = seq.then(function () {
      addChips(COPY.naosChips);
      el.input.disabled = false;
      el.sendBtn.disabled = false;
      el.input.placeholder = COPY.inputPlaceholder;
      el.input.focus();
      S.busy = false;
    });

    return seq;
  }

  /* ---- PHASE IV : NAOS-9 -------------------------------------------- */
  function handleNaos(text) {
    S.busy = true;
    S.naosTurns++;

    var intent = matchIntent(NAOS, text);

    if (intent && intent.special === "FINALE") {
      finale(true);
      return;
    }

    var reply, chips = null;
    if (intent) {
      reply = intent.replies[0];
      chips = intent.chips || null;
      if (intent.accel) S.naosTurns += intent.accel;
    } else {
      reply = pick(COPY.fallbackNaos, S.lastNaos);
    }

    botSay(reply).then(function () {
      if (S.naosTurns >= CFG.naosMaxTurns) {
        return finale(false);
      }
      if (chips) addChips(chips);
      if (S.naosTurns === CFG.naosMaxTurns - 2) {
        addSys("#> écho radar Kassandra — grille 500 m → 200 m", true);
      }
      S.busy = false;
    });
  }

  /* ---- FINALE -------------------------------------------------------- */
  function finale(polite) {
    S.busy = true;
    var seq = Promise.resolve()
      .then(function () { return wait(500); })
      .then(function () { addSys(COPY.finale.sys1, true); return wait(800); })
      .then(function () { addSys(COPY.finale.sys2, true); return wait(900); })
      .then(function () { return botSay(polite ? COPY.finale.naos1 + " Et puis tu partais déjà — c’est mieux ainsi." : COPY.finale.naos1); })
      .then(function () { return botSay(COPY.finale.naos2); })
      .then(function () {
        var card = h("div", "cta");
        card.innerHTML =
          '<div class="sym">' + SVG_SPIRAL + "</div>" +
          '<div class="word">' + COPY.finale.ctaWord + "</div>" +
          '<div class="row2">' +
          '<a class="primary" href="' + CFG.echoUrl + '">' + COPY.finale.ctaEcho + "</a>" +
          '<a href="' + CFG.bookUrl + '" target="_blank" rel="noopener">' + COPY.finale.ctaBook + "</a>" +
          "</div>";
        el.feed.appendChild(card);
        scrollDown();
        return wait(900);
      })
      .then(function () {
        addSys(COPY.finale.sysEnd);
        S.phase = "done";
        var leftover = el.feed.querySelectorAll('.chips');
        for (var li = 0; li < leftover.length; li++) leftover[li].remove();
        el.input.disabled = true;
        el.sendBtn.disabled = true;
        el.input.placeholder = COPY.inputClosed;
        S.busy = false;
      });
    return seq;
  }

})();
