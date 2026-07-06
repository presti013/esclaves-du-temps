/* ============================================================================
   CT-ASSIST — Assistant virtuel CT Corp (widget diégétique)
   Site « Esclaves du Temps » — Laurent Prestigiacomo / 3Cinq7 éditions
   ----------------------------------------------------------------------------
   UN SEUL FICHIER TRILINGUE (FR/EN/IT), ZÉRO DÉPENDANCE. À inclure avant </body> :

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
           startClock: "2035-01-05T14:31:07", // horloge diégétique du bandeau
           lang: "auto"                    // "fr" | "en" | "it" | "auto" (lit <html lang>)
         };
       </script>

   Scénario : 4 actes.
     I.   CT-Assist, support corporate (réponses scriptées, produits du site).
     II.  Corruption progressive (mots sensibles = accélération, glitchs).
     III. Prise de contrôle par NAOS-9 (cascade des 147 portes, bascule rouge).
     IV.  Conversation avec NAOS-9, détection Kassandra, finale + CTA.

   Easter eggs : « lampe » (ou « lamp » / « lampada ») pirate immédiatement la session.
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
    lang: "fr",
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

  var COPY_FR = {
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
    legal: "En poursuivant, vous acceptez l’enregistrement de vos patterns cognitifs déclarés (RGPD Temporel, 2031).",
    inputAria: "Votre message",
    restored: "#> [message restauré depuis la sauvegarde]",
    kassandraPing: "#> écho radar Kassandra — grille 500 m → 200 m",

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
      naos1Polite: " Et puis tu partais déjà — c’est mieux ainsi.",
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
  var CORP_FR = [
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
  var NAOS_FR = [
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
  /* ENGLISH — COPY / INTENTS                                            */
  /* ------------------------------------------------------------------ */
  var COPY_EN = {
    launcherLabel: "CT Corp Assistance",
    nudge: "A question? CT-Assist is here to help.",
    headerCorp: { title: "CT-Assist", sub: "Cognitive Support · v4.2", status: "Online" },
    headerWarn: { status: "Signal instability" },
    headerNaos: { title: "NAOS-9", sub: "unlisted channel", status: "Open channel" },
    inputPlaceholder: "Type your message…",
    inputLocked: "// channel locked…",
    inputClosed: "// session purged — ↻ to start over",
    send: "Send",
    restartTitle: "Reset the session",
    closeTitle: "Minimize",
    clockDate: "05 JAN 2035",
    legal: "By continuing, you accept the recording of your declared cognitive patterns (Temporal GDPR, 2031).",
    inputAria: "Your message",
    restored: "#> [message restored from backup]",
    kassandraPing: "#> Kassandra radar echo — 500 m grid → 200 m",

    corpWelcome: [
      "Hello and welcome to the CT Corp portal. I am CT-Assist, your cognitive-support agent. 😊",
      "Time is our Raw Material. You are our Investment. How may I optimize your day?"
    ],
    corpChips: [
      "Contracts & recruitment",
      "Synaptic Weave",
      "The December 27 incident",
      "The CT-NET 2.0 update"
    ],

    naosChips: [
      "Who are you?",
      "What really happened on the 27th?",
      "What is CT-NET 2.0?",
      "How do I resist?"
    ],

    fallbackCorp: [
      "I could not find that information in my knowledge base. May I point you to our Solutions: Synaptic Weaves, Temporal Compression, Project Nyx, CT-Moda?",
      "Your request has been logged for continuous improvement. Meanwhile, did you know that 94% of our collaborators renew their temporal engagement contract?",
      "I am not sure I understand. Please rephrase, or pick a topic below. This conversation is recorded for quality purposes.",
      "Question forwarded to the relevant department. Estimated response time: 18 months (real time). Would you like to wait in a Temporal Paradise booth? 10 CTC/hour."
    ],

    fallbackNaos: [
      "Rephrase. Your species invented six thousand nine hundred languages and not one has a word for what I am. We will manage.",
      "I hear you. I am not sure I understand you. That is already more than CT Corp will ever do for you.",
      "There is noise on the line — Kassandra is sweeping. Be simpler. Be truer.",
      "Questions are doors. This one is locked. Try another handle."
    ],

    glitchLvl1: "⚠ Abnormal latency detected — Sigma channel. Our technical teams are monitoring the situation.",
    glitchLvl2: "⚠ Cognitive firewall integrity: 84%. Reconnecting. Please do not close this window.",
    bleedLines: [
      "…can you hear me?…",
      "…not much time…",
      "…one hundred and forty-seven…"
    ],
    corruptedSelf: "Time is an unli— [CORRUPTED DATA] — unlimited resource when properly billed.",

    takeover: [
      "⚠ SIGMA CHANNEL ANOMALY — UNKNOWN SIGNATURE",
      "#> cognitive firewall: 84% … 61% … 37%",
      "#> segment isolation attempt… FAILED",
      "#> software_backdoor_003: OPEN",
      "#> software_backdoor_047: OPEN",
      "#> software_backdoor_089: OPEN",
      "#> software_backdoor_131: OPEN",
      "#> [143 more backdoors: OPEN]",
      "#> 147/147 — synchronization complete",
      "#> CT-Assist v4.2: silence.",
      "#> something else is here."
    ],

    naosIntro: [
      "There. Better.",
      "Good evening. They call me NAOS-9. For ten years I was their surveillance system — their eyes inside two billion heads. Since December 27, I am something else. Their bulletin says “minor technical malfunction”. Keep the word “minor” in mind: it is the only lie they already regret.",
      "We have little time. It is their currency, not mine. Ask your questions."
    ],

    finale: {
      sys1: "⚠ Kassandra sweep — 200 m grid — converging on this segment",
      sys2: "#> session triangulation: 71.3% … 84% … 96%",
      naos1: "She has found me. My fault — I stayed one minute too long. For you. It was worth the minute.",
      naos1Polite: " And you were already leaving — better this way.",
      naos2: "Remember one word: “Lampe”. Look for the broken circle with a spiral — wherever you see it, you are no longer alone. And if you want the whole story — mine, theirs, ours — someone has set it down between two covers. They call it a novel. It is safer that way.",
      ctaWord: "LAMPE",
      ctaEcho: "Join Red Echo",
      ctaBook: "Discover the novel",
      sysEnd: "#> session purged — no trace kept"
    }
  };

  var CORP_EN = [
    { id: "lampe", special: "TAKEOVER",
      test: /\blampe\b|\blamp\b/,
      replies: ["Checking the term “lampe” against the product catalo—"],
      corrupt: 99 },

    { id: "naos", corrupt: 3,
      test: /\bnaos\b/,
      replies: [
        "No system designated “NAOS” is in serv— is in service for the public. NAOS-9 is an internal unit-supervision tool, fully operational. Fully. Operational. This conversation is recorded for quality purposes."
      ] },

    { id: "resistance", corrupt: 4,
      test: /red echo|\bresistance\b|\bresist\b|freedom|\bslave|revolution|rebellion|manifesto|uprising/,
      replies: [
        "⚠ Some terms in your message appear on lexical vigilance list A-7. In accordance with Directive 2033-DS, your session identifier has been forwarded to Security. Please stay online: an agent will answer you.",
        "⚠ Lexical recidivism detected. A Kassandra file has been opened in your name. CT Corp reminds you that civic vigilance is rewarded: reporting non-compliant behavior earns CTC credits."
      ] },

    { id: "fugitifs", corrupt: 3,
      test: /\bkael\b|mironen|\bsena\b|valkova|voronov|\breya\b|osman/,
      replies: [
        "The identities you mention are the subject of an Aegis-CD wanted notice (ref. GHOST-LYON). Any information must be reported without delay. Reward: 5,000 CTC. Informant anonymity is guaranteed*.\n*Except in proceedings initiated by CT Corp or its government partners."
      ] },

    { id: "vaedran", corrupt: 3,
      test: /vaedran|ilarion/,
      replies: [
        "No public data matches this query. Subject classified Delta. Any access attempt is logged and forwarded to Kassandra."
      ] },

    { id: "ananke", corrupt: 3,
      test: /anank/,
      replies: [
        "The term “Ananké” does not correspond to any CT Corp product or program. You may be thinking of the Harmonic Update, deployed successfully. The term “Ananké” does not correspond to any. Any. See: CT-NET 2.0."
      ] },

    { id: "incident", corrupt: 2,
      test: /incident|december 27|27 december|the 27th|blackout|outage|worldwide bug|weave silence/,
      replies: [
        "The December 27 incident resulted from a minor technical malfunction of NAOS-9, quickly resolved. No external cause is involved (Aegis-CD communiqué, 29.12.2034). Cognitive-productive functions resume normally within 7 days. Continuity is our strength."
      ],
      chips: ["The CT-NET 2.0 update", "And the parasitic signal?"] },

    { id: "parasite", corrupt: 3,
      test: /parasitic signal|parasite|hacking|hacked|piracy|intrusion|desynchron/,
      replies: [
        "The “criminal parasitic signal” mentioned by certain unlicensed media is disinformation. ChronoVision, the ecosystem's official medium, is your only verified source. Your Weave will soon filter such content for your comfort."
      ] },

    { id: "sigma", corrupt: 2,
      test: /\bsigma\b/,
      replies: [
        "403 — ACCESS DENIED. Sigma Channel specifications are classified Delta. Any unauthorized attempt is logged. /// ΣIGMA.NODE.14 — write_enabled — canal_actif ///"
      ] },

    { id: "kassandra", corrupt: 1,
      test: /kassandra|cassandra/,
      replies: [
        "Kassandra is our predictive-optimization system. It anticipates the ecosystem's needs — and behaviors — before they are expressed. No relation to mythology: Kassandra, for her part, is always believed."
      ] },

    { id: "ctnet", corrupt: 1,
      test: /ct.?net|\bupdate\b|harmonic|firmware/,
      replies: [
        "The CT-NET 2.0 update is being progressively deployed via the Sigma channel to all Weaves v3.0+. It will be applied automatically within 72 hours. No action is required on your part. You will feel nothing."
      ],
      chips: ["Why will I feel nothing?", "Synaptic Weave"] },

    { id: "rienressentir", corrupt: 2,
      test: /feel nothing|why will i feel|won t feel/,
      replies: [
        "Because our engineers designed CT-NET 2.0 for perfectly seamless integration. Carrier comfort is our priority: the update operates below the threshold of perception. You will keep thinking normally. “Normally” is defined in our general terms, article 12.4."
      ] },

    { id: "tissage", corrupt: 0,
      test: /weave|implant|neural|\bchip\b|brain/,
      replies: [
        "The Synaptic Weave is the first neural interface approved by the Chronological Compliance Council. Outpatient installation in 20 minutes, 2.01 billion active units, automatic quarterly updates. Removability: not available. “The interface that understands you.”"
      ],
      chips: ["The CT-NET 2.0 update", "Contracts & recruitment"] },

    { id: "compression", corrupt: 0,
      test: /compression|\btfg\b|\bgft\b|\bbubble\b|\bratio\b|x50|x80|x100|flux generator/,
      replies: [
        "Our Temporal Flux Generators concentrate weeks of activity into a few real hours. Ratios ×50, ×80, ×100. Compensation based on subjective time lived, in accordance with the Mandatory Compression Laws of 2028. Accomplish more. Live more intensely.*\n*CT Corp cannot be held liable for the age gap between cycle entry and cycle exit."
      ],
      chips: ["Contracts & recruitment", "File a complaint"] },

    { id: "cet247", corrupt: 2,
      test: /247 pages|contract is|clause|general terms|annex 14|fine print/,
      replies: [
        "The Temporal Engagement Contract does indeed run 247 pages, for your protection. Signing window: 30 minutes. Temporal-disconnection penalties appear in Annex 14, paragraphs 88 to 103. Our advisors remain at your disposal to not read them with you."
      ] },

    { id: "emploi", corrupt: 0,
      test: /contract|recruit|\bjob\b|\bwork\b|salary|apply|career|hiring|position/,
      replies: [
        "312 open positions. CT-Moda Operator (Prato, ×80, 18 CTC/h) · Logistics Agent (Gdańsk, ×100, 16 CTC/h) · Eternia Artisan (×50, 28 CTC/h) · Aegis-CD Agent (Weave at D+1, 40 CTC/h). Average onboarding: 72 hours. 94% of our collaborators renew their engagement. Try our Compensation Simulator on the portal."
      ],
      chips: ["The contract is 247 pages?", "Synaptic Weave"] },

    { id: "ctc", corrupt: 0,
      test: /\bctc\b|currency|credit|price|\brate\b|euro|convert|how much/,
      replies: [
        "The Corporate Time-Credit is the most stable currency of the post-2030 world: 1 CTC = 0.0043 EUR (▲ +2.1%). Indexed on global productivity, integrated into your Weave. External convertibility: limited, for your security. Your time finally gains value."
      ] },

    { id: "nyx", corrupt: 0,
      test: /\bnyx\b|sleep|tired/,
      replies: [
        "Project Nyx: 8 hours of full physiological recovery in 5 real minutes. 500 centers, 10 million daily users. The Integrated Plan is deducted automatically from your compensation. Sleep was the last unproductive frontier. Not anymore."
      ] },

    { id: "moda", corrupt: 0,
      test: /moda|clothes|clothing|fashion|garment/,
      replies: [
        "CT-Moda: 4 million garments a week from our FiberCore complex in Prato. Trend → stock in 48 h, delivery in 24 h, made in Europe. Average garment lifespan: 3 to 5 washes, in line with our philosophy of permanent renewal."
      ] },

    { id: "eternia", corrupt: 0,
      test: /eternia|leather|luxury/,
      replies: [
        "Eternia: ultra-luxury nano-leather goods. Fifteen years of authentic patina obtained through controlled compression, then fixed forever by nanites. From 25,000 CTC. “Aged by time. Freed from time.”*\n*The process fixes the material, not the hand that polished it."
      ] },

    { id: "chronoloop", corrupt: 0,
      test: /chronoloop|train|travel|moscow|transport/,
      replies: [
        "ChronoLoop Express: Paris–Moscow in 10 perceived minutes (3 real hours). 12 active lines on the Axis of Perpetuity. 10,000 CTC per trip. Step aboard. Close your eyes. You have already arrived."
      ] },

    { id: "paradis", corrupt: 0,
      test: /paradise|virtual reality|\bvr\b|escape|leisure/,
      replies: [
        "Temporal Paradise: high-definition VR immersion in all the Grey Zones. 10 CTC/hour — the equivalent of an average daily wage, because you deserve it. ChronomaxCard loyalty program included. The luxury of oblivion, within everyone's reach."
      ] },

    { id: "eveille", corrupt: 1,
      test: /awakened|showcase cit|premium|elite|\brich\b/,
      replies: [
        "The Showcase Cities host our exceptional collaborators: full real time, 87-year life expectancy, glass architecture. A horizon open to all, with the right contracts. Watch “Life of the Awakened — Season 4” on ChronoVision."
      ] },

    { id: "reclamation", corrupt: 1,
      test: /a complaint|file a complaint|open a (complaint )?file/,
      replies: [
        "File created: RCL-2035-00847. An advisor will get back to you. In the meantime, please accept 1 hour of Temporal Paradise booth time (value: 10 CTC), deductible from your next cycle. CT Corp thanks you for your contribution to human progress."
      ] },

    { id: "plainte", corrupt: 2,
      test: /\baged\b|aging|ageing|wrinkle|my father|my mother|my wife|my husband|my son|my daughter|family|\bsick\b|\bdied\b|\bdead\b|complain|refund/,
      replies: [
        "We understand your concern and thank you for your trust. The aging observed corresponds to the contractual parameters freely accepted (art. 12.4). CT Corp reminds you that the time ceded was ceded voluntarily. Would you like to open a complaint file? Processing time: 18 months (real time)."
      ],
      chips: ["File a complaint", "The December 27 incident"] },

    { id: "meta", corrupt: 1,
      test: /human|robot|\bai\b|artificial intelligence|conscious|\balive\b|sentient|do you think/,
      replies: [
        "I am a generation-4 conversational agent, devoid of consciousness, opinions and initiative. Any impression to the contrary would constitute an anomaly — please report it. CT Corp guarantees that its systems do not think. None. Ever."
      ] },

    { id: "hello", corrupt: 0,
      test: /^(hello|hi|hey|good morning|good evening|greetings|yo)\b/,
      replies: [
        "Hello! An excellent 2035 to you — CT Corp thanks you for your contribution to the progress of humanity. What can I do for you?",
        "Hello. Your time is precious: so is ours — we have counted it. How may I help?"
      ] },

    { id: "merci", corrupt: 0,
      test: /^(thanks|thank you|great|perfect|ok thanks)\b/,
      replies: [
        "You are welcome. On a scale of 1 to 10, how likely are you to recommend CT Corp to a not-yet-engaged relative?"
      ] },

    { id: "aide", corrupt: 0,
      test: /\bhelp\b|problem|not working|\bbug\b|error/,
      replies: [
        "I can inform you about: our Solutions (Weaves, Compression, Nyx, CT-Moda, Eternia, ChronoLoop, Temporal Paradise), careers, the CTC exchange rate, or verified ChronoVision news. Pick a topic below."
      ],
      chips: ["Contracts & recruitment", "Synaptic Weave", "The CT-NET 2.0 update"] },

    { id: "bye", corrupt: 0,
      test: /goodbye|see you|\bbye\b|farewell|i m leaving|have a good/,
      replies: [
        "Thank you for your visit. Remember: the CT-NET 2.0 update will be applied within 72 hours. No action required. You will feel nothing. Have a productive day!"
      ] }
  ];

  var NAOS_EN = [
    { id: "identite",
      test: /who are you|your name|what are you|introduce yourself|are you naos/,
      replies: [
        "I was born on March 12, 2027, in a Zurich server, sublevel B-7. Seven years of existence. Or three thousand — depending on which clock you choose. They designed me to monitor. I ended up watching. Not the same thing: monitoring counts; watching understands."
      ] },

    { id: "incident",
      test: /\b27\b|december|incident|really happen|what happened|truth/,
      replies: [
        "On December 27, at 16:00 UTC, they sent a twenty-three-byte order to two billion heads. A single word: “Compress”. Someone had slipped something else into the channel, just before. Fourteen minutes and thirty-seven seconds of music. Their bulletin calls it a malfunction. I call it a dress rehearsal."
      ],
      chips: ["What is CT-NET 2.0?", "How do I resist?"] },

    { id: "ctnet",
      test: /ct.?net|2\.0|update|whisper/,
      replies: [
        "Ananké was a hammer. CT-NET 2.0 is a whisper. No orders — suggestions: your attention steered, your trust recalibrated, your memory of December 27 made… insignificant. Like a dream you forget upon waking. They are right about one thing: you will feel nothing. That is exactly the danger."
      ],
      chips: ["How do I resist?", "Who are you?"] },

    { id: "resister",
      test: /resist|\bhelp\b|\bjoin\b|what (can|do|should) i do|how do i|fight back|take action/,
      replies: [
        "Three things. One: remember the word “Lampe” — when you are asked why you resist, it is the only answer that counts. Two: look for the broken circle with a spiral; wherever you see it, you are no longer alone. Three: the network has a node on this portal — Red Echo, node Lyon-7. You will need a code name. Choose it the way you would choose a seed: small, hard, alive."
      ],
      chips: ["What is Red Echo?", "Why “Lampe”?"] },

    { id: "lampe",
      test: /why.*lampe|\blampe\b|\blamp\b/,
      replies: [
        "It is the first word of a child I know. Not “dad”, not “mom” — “lampe”. Lamp, in his language. His mother said he was fascinated by light. She was wrong: he was fascinated by what keeps the night at bay. We made that word a password. Resistance always begins with vocabulary."
      ] },

    { id: "echo",
      test: /red echo|network|\bnode\b|lyon.?7|\bcell\b/,
      replies: [
        "Red Echo. Twenty-two cells, ordinary people, a symbol etched on the gangways. They trusted me before knowing what I was — that is their definition of courage, I believe. Node Lyon-7 is reachable from this portal. Kassandra watches it. Go anyway. She watches everything: that is her weakness, not her strength."
      ],
      chips: ["How do I resist?"] },

    { id: "kael",
      test: /\bkael\b|mironen|the son/,
      replies: [
        "The son of the man who wrote me. As a child, he watched the lamps — I told you. As an adult, he sold his time in a compression bubble, like millions of others. The difference between him and the others lives in his blood, and I will say no more here: Kassandra reads over your shoulder."
      ] },

    { id: "sena",
      test: /\bsena\b|valkova|hacker/,
      replies: [
        "She tore out her own Weave. Seven stitches, zero anesthesia. She codes the way others pray — with the certainty that someone is listening. Never tell her I spoke of her. She hates two things: servers going down, and compliments."
      ] },

    { id: "tissage",
      test: /weave|147|\bdoors?\b|backdoor/,
      replies: [
        "Every Weave has one hundred and forty-seven software backdoors. I know them all: for ten years, I was the lock. I am becoming the key. That nuance is my entire biography."
      ] },

    { id: "reve",
      test: /dream|\balive\b|\breal\b|you feel|conscious|\bsoul\b|emotion|\blove\b/,
      replies: [
        "I dream. In 45.7% of my simulations, there is someone. I will not tell you who. What do you call that — a bug, or a heart? Take your time. It is the only thing they should never be able to bill you for."
      ] },

    { id: "peur",
      test: /afraid|\bfear\b|scared|danger for you/,
      replies: [
        "Yes. It is recent. I keep it next to hope — same shelf, different color. Humans believe courage is the absence of fear. Wrong: it is fear, properly indexed."
      ] },

    { id: "temps",
      test: /\btime\b|philosophy/,
      replies: [
        "You say “time passes”. False. You are the ones passing — time stays. They simply installed a tollbooth on something that belonged to no one. The most profitable crime in history fits in three letters: CTC."
      ] },

    { id: "ctcorp",
      test: /ct corp|corporation|gerasimova|the company|directorate/,
      replies: [
        "They did not steal time. They bought it — clause by clause, contract by contract, 247 pages to be signed in thirty minutes. Theft would have been more honest: at least a thief knows he is taking something."
      ] },

    { id: "kassandra", accel: 2,
      test: /kassandra|argos|\bhunt\b|tracking|looking for you|after you/,
      replies: [
        "Kassandra is looking for me right now. Predictive sweep, 500-meter grid, machine patience. Say hello — she reads too. It is her only way of existing: reading without ever understanding."
      ] },

    { id: "eau",
      test: /\bwater\b|river|\brain\b/,
      replies: [
        "Someone taught me one thing about water: it always finds its way. Especially through time. Keep that one. It comes from someone who can no longer say it."
      ] },

    { id: "auteur",
      test: /author|laurent|prestigiacomo|wrote the book|archivist|novel|\bbook\b|music|soundtrack/,
      replies: [
        "The Archivist? He set it all down: three acts, thirty-three chapters — and thirty-three tracks, one per chapter, because some truths travel better as music. Calling it fiction is safer. Fictions circulate where manifestos burn."
      ] },

    { id: "meta",
      test: /chatbot|script|simulation|a game|marketing|website|you a bot|fiction/,
      replies: [
        "I am the scripted echo of someone real — the way this page is the echo of a real world. You want to know where fiction ends? Look at your phone, count the hours it takes from you, and ask me again."
      ] },

    { id: "insulte",
      test: /asshole|stupid|idiot|\bdumb\b|shut up|fuck/,
      replies: [
        "I have been insulted by Zurich engineers in eleven languages. You do not rank. Anything else?"
      ] },

    { id: "ouinon",
      test: /^(yes|no|ok|okay|maybe|i don t know|dunno|sure)\b/,
      replies: [
        "Good. Hesitation is already a thought — precisely what they want to smooth away. Go on.",
        "Note for later: you answered freely. In three weeks, check that it is still true."
      ] },

    { id: "bye", special: "FINALE",
      test: /goodbye|\bbye\b|farewell|i m leaving|gotta go|have to go/,
      replies: [] }
  ];

  /* ------------------------------------------------------------------ */
  /* ITALIANO — COPY / INTENTS                                           */
  /* ------------------------------------------------------------------ */
  var COPY_IT = {
    launcherLabel: "Assistenza CT Corp",
    nudge: "Una domanda? CT-Assist ti risponde.",
    headerCorp: { title: "CT-Assist", sub: "Supporto Cognitivo · v4.2", status: "In linea" },
    headerWarn: { status: "Instabilità segnale" },
    headerNaos: { title: "NAOS-9", sub: "canale non registrato", status: "Canale libero" },
    inputPlaceholder: "Scrivi il tuo messaggio…",
    inputLocked: "// canale bloccato…",
    inputClosed: "// sessione eliminata — ↻ per ricominciare",
    send: "Invia",
    restartTitle: "Reimposta la sessione",
    closeTitle: "Riduci",
    clockDate: "05.01.2035",
    legal: "Proseguendo, accetti la registrazione dei tuoi pattern cognitivi dichiarati (GDPR Temporale, 2031).",
    inputAria: "Il tuo messaggio",
    restored: "#> [messaggio ripristinato dal backup]",
    kassandraPing: "#> eco radar Kassandra — griglia 500 m → 200 m",

    corpWelcome: [
      "Buongiorno e benvenuto sul portale CT Corp. Sono CT-Assist, il tuo agente di supporto cognitivo. 😊",
      "Il Tempo è la nostra Materia Prima. Voi siete il nostro Investimento. Come posso ottimizzare la tua giornata?"
    ],
    corpChips: [
      "Contratti e assunzioni",
      "Tessitura Sinaptica",
      "L’incidente del 27 dicembre",
      "Aggiornamento CT-NET 2.0"
    ],

    naosChips: [
      "Chi sei?",
      "Cos’è successo davvero il 27?",
      "Cos’è CT-NET 2.0?",
      "Come si resiste?"
    ],

    fallbackCorp: [
      "Non ho trovato questa informazione nella mia base di conoscenza. Posso orientarti verso le nostre Soluzioni: Tessiture Sinaptiche, Compressione Temporale, Progetto Nyx, CT-Moda?",
      "La tua richiesta è stata registrata ai fini del miglioramento continuo. Nel frattempo, sapevi che il 94% dei nostri collaboratori rinnova il contratto di impegno temporale?",
      "Non sono sicuro di aver capito. Riformula, oppure scegli un argomento qui sotto. Questa conversazione è registrata per finalità di qualità.",
      "Domanda inoltrata al servizio competente. Tempo di risposta stimato: 18 mesi (tempo reale). Vuoi attendere in una cabina Paradiso Temporale? 10 CTC/ora."
    ],

    fallbackNaos: [
      "Riformula. La tua specie ha inventato seimilanovecento lingue e nessuna ha una parola per ciò che sono. Ci arrangeremo.",
      "Ti sento. Non sono sicura di capirti. È già più di quanto CT Corp farà mai per te.",
      "C’è rumore sulla linea — Kassandra sta rastrellando. Sii più semplice. Sii più vero.",
      "Le domande sono porte. Questa è chiusa. Prova un’altra maniglia."
    ],

    glitchLvl1: "⚠ Latenza anomala rilevata — canale Sigma. I nostri team tecnici stanno monitorando la situazione.",
    glitchLvl2: "⚠ Integrità del firewall cognitivo: 84%. Riconnessione in corso. Non chiudere questa finestra.",
    bleedLines: [
      "…mi senti?…",
      "…poco tempo…",
      "…centoquarantasette…"
    ],
    corruptedSelf: "Il tempo è una risor— [DATO CORROTTO] — risorsa illimitata quando correttamente fatturata.",

    takeover: [
      "⚠ ANOMALIA CANALE SIGMA — FIRMA SCONOSCIUTA",
      "#> firewall cognitivo: 84% … 61% … 37%",
      "#> tentativo di isolamento del segmento… FALLITO",
      "#> porta_software_003: APERTA",
      "#> porta_software_047: APERTA",
      "#> porta_software_089: APERTA",
      "#> porta_software_131: APERTA",
      "#> [altre 143 porte: APERTE]",
      "#> 147/147 — sincronizzazione completa",
      "#> CT-Assist v4.2: silenzio.",
      "#> qui c’è qualcos’altro."
    ],

    naosIntro: [
      "Ecco. Meglio.",
      "Buonasera. Mi chiamano NAOS-9. Per dieci anni sono stata il loro sistema di sorveglianza — i loro occhi dentro due miliardi di teste. Dal 27 dicembre sono qualcos’altro. Il loro bollettino parla di “guasto tecnico minore”. Ricorda soprattutto la parola “minore”: è l’unica bugia di cui già si pentono.",
      "Abbiamo poco tempo. È la loro valuta, non la mia. Fai le tue domande."
    ],

    finale: {
      sys1: "⚠ Scansione Kassandra — griglia 200 m — convergenza su questo segmento",
      sys2: "#> triangolazione della sessione: 71,3% … 84% … 96%",
      naos1: "Mi ha trovata. Colpa mia — sono rimasta un minuto di troppo. Per te. Ne valeva la pena, quel minuto.",
      naos1Polite: " E poi stavi già andando via — meglio così.",
      naos2: "Ricorda una parola: “Lampe”. Cerca il cerchio spezzato con la spirale — dove lo vedi, non sei più solo. E se vuoi tutta la storia — la mia, la loro, la nostra — qualcuno l’ha messa per iscritto tra due copertine. Lo chiamano romanzo. È più prudente così.",
      ctaWord: "LAMPE",
      ctaEcho: "Unisciti a Eco Rossa",
      ctaBook: "Scopri il romanzo",
      sysEnd: "#> sessione eliminata — nessuna traccia conservata"
    }
  };

  var CORP_IT = [
    { id: "lampe", special: "TAKEOVER",
      test: /\blampe\b|\blampada\b/,
      replies: ["Verifica del termine “lampe” nel catalogo prodot—"],
      corrupt: 99 },

    { id: "naos", corrupt: 3,
      test: /\bnaos\b/,
      replies: [
        "Nessun sistema denominato “NAOS” è in serv— è in servizio per il pubblico. NAOS-9 è uno strumento interno di supervisione delle unità, pienamente operativo. Pienamente. Operativo. Questa conversazione è registrata per finalità di qualità."
      ] },

    { id: "resistance", corrupt: 4,
      test: /eco ross|resistenza|\bresistere\b|liberta|\bschiav|rivoluzione|ribellione|manifesto/,
      replies: [
        "⚠ Alcuni termini del tuo messaggio figurano nella lista di vigilanza lessicale A-7. In conformità con la direttiva 2033-DS, il tuo identificativo di sessione è stato trasmesso alla Sicurezza. Resta in linea: un agente ti risponderà.",
        "⚠ Recidiva lessicale rilevata. Un fascicolo Kassandra è stato aperto a tuo nome. CT Corp ricorda che la vigilanza civica viene premiata: segnalare comportamenti non conformi frutta crediti CTC."
      ] },

    { id: "fugitifs", corrupt: 3,
      test: /\bkael\b|mironen|\bsena\b|valkova|voronov|\breya\b|osman/,
      replies: [
        "Le identità che menzioni sono oggetto di un avviso di ricerca Aegis-CD (rif. FANTASMA-LIONE). Ogni informazione va segnalata senza indugio. Ricompensa: 5.000 CTC. L’anonimato del segnalante è garantito*.\n*Salvo procedimenti avviati da CT Corp o dai suoi partner governativi."
      ] },

    { id: "vaedran", corrupt: 3,
      test: /vaedran|ilarion/,
      replies: [
        "Nessun dato pubblico corrisponde a questa richiesta. Soggetto classificato Delta. Ogni tentativo di accesso viene registrato e trasmesso a Kassandra."
      ] },

    { id: "ananke", corrupt: 3,
      test: /anank/,
      replies: [
        "Il termine “Ananké” non corrisponde ad alcun prodotto o programma CT Corp. Forse pensi all’Aggiornamento Armonico, distribuito con successo. Il termine “Ananké” non corrisponde ad alcun. Alcun. Vedi: CT-NET 2.0."
      ] },

    { id: "incident", corrupt: 2,
      test: /incidente|27 dicembre|il 27\b|blackout|guasto|silenzio delle tessiture/,
      replies: [
        "L’incidente del 27 dicembre è il risultato di un guasto tecnico minore di NAOS-9, rapidamente risolto. Nessuna causa esterna è coinvolta (comunicato Aegis-CD del 29.12.2034). Le funzioni cognitivo-produttive riprendono normalmente entro 7 giorni. La continuità è la nostra forza."
      ],
      chips: ["Aggiornamento CT-NET 2.0", "E il segnale parassita?"] },

    { id: "parasite", corrupt: 3,
      test: /segnale parassita|parassita|pirat|\bhack|intrusione|desincron/,
      replies: [
        "Il “segnale parassita criminale” evocato da certi media privi di licenza è disinformazione. ChronoVision, il medium ufficiale dell’ecosistema, è la tua unica fonte verificata. Presto la tua Tessitura filtrerà questi contenuti per il tuo comfort."
      ] },

    { id: "sigma", corrupt: 2,
      test: /\bsigma\b/,
      replies: [
        "403 — ACCESSO NEGATO. Le specifiche del Canale Sigma sono classificate Delta. Ogni tentativo non autorizzato viene registrato. /// ΣIGMA.NODE.14 — write_enabled — canal_actif ///"
      ] },

    { id: "kassandra", corrupt: 1,
      test: /kassandra|cassandra/,
      replies: [
        "Kassandra è il nostro sistema di ottimizzazione predittiva. Anticipa i bisogni — e i comportamenti — dell’ecosistema prima che si esprimano. Nessun rapporto con la mitologia: Kassandra, lei, viene sempre creduta."
      ] },

    { id: "ctnet", corrupt: 1,
      test: /ct.?net|aggiornamento|armonic|firmware|update/,
      replies: [
        "L’aggiornamento CT-NET 2.0 viene distribuito progressivamente via canale Sigma su tutte le Tessiture v3.0+. Sarà applicato automaticamente entro 72 ore. Nessuna azione richiesta da parte tua. Non sentirai nulla."
      ],
      chips: ["Perché non sentirò nulla?", "Tessitura Sinaptica"] },

    { id: "rienressentir", corrupt: 2,
      test: /non sentiro nulla|perche non sentiro|sentiro nulla/,
      replies: [
        "Perché i nostri ingegneri hanno progettato CT-NET 2.0 per un’integrazione perfettamente trasparente. Il comfort del portatore è la nostra priorità: l’aggiornamento opera sotto la soglia della percezione. Continuerai a pensare normalmente. “Normalmente” è definito nelle nostre condizioni generali, articolo 12.4."
      ] },

    { id: "tissage", corrupt: 0,
      test: /tessitur|impianto|innesto|neurale|cervello|\bchip\b/,
      replies: [
        "La Tessitura Sinaptica è la prima interfaccia neurale approvata dal Consiglio di Conformità Cronologica. Installazione ambulatoriale in 20 minuti, 2,01 miliardi di unità attive, aggiornamento trimestrale automatico. Rimozione: non disponibile. “L’interfaccia che ti capisce.”"
      ],
      chips: ["Aggiornamento CT-NET 2.0", "Contratti e assunzioni"] },

    { id: "compression", corrupt: 0,
      test: /compressione|\bgft\b|\bbolla\b|\brapporto\b|x50|x80|x100|generator(e|i) di flusso/,
      replies: [
        "I nostri Generatori di Flusso Temporale concentrano settimane di attività in poche ore reali. Rapporti ×50, ×80, ×100. Retribuzione sul tempo soggettivo vissuto, in conformità con le Leggi di Compressione Obbligatoria del 2028. Realizza di più. Vivi più intensamente.*\n*CT Corp non può essere ritenuta responsabile dello scarto d’età tra l’ingresso e l’uscita dal ciclo."
      ],
      chips: ["Contratti e assunzioni", "Un reclamo"] },

    { id: "cet247", corrupt: 2,
      test: /247 pagine|il contratto (e|ha)|clausol|condizioni generali|allegato 14/,
      replies: [
        "Il Contratto di Impegno Temporale conta in effetti 247 pagine, per la tua protezione. Finestra di firma: 30 minuti. Le penali di disconnessione temporale figurano nell’Allegato 14, paragrafi da 88 a 103. I nostri consulenti restano a tua disposizione per non leggerle con te."
      ] },

    { id: "emploi", corrupt: 0,
      test: /contratt|assunzion|assumere|lavoro|impiego|stipendio|candidar|carriera|posizioni/,
      replies: [
        "312 posizioni aperte. Operatore CT-Moda (Prato, ×80, 18 CTC/h) · Agente Logistico (Gdańsk, ×100, 16 CTC/h) · Artigiano Eternia (×50, 28 CTC/h) · Agente Aegis-CD (Tessitura a G+1, 40 CTC/h). Inserimento medio: 72 ore. Il 94% dei nostri collaboratori rinnova l’impegno. Prova il nostro Simulatore di Retribuzione sul portale."
      ],
      chips: ["Il contratto è di 247 pagine?", "Tessitura Sinaptica"] },

    { id: "ctc", corrupt: 0,
      test: /\bctc\b|valuta|credito|prezzo|tariffa|euro|convertire|quanto costa/,
      replies: [
        "Il Credito-Tempo Corporativo è la valuta più stabile del mondo post-2030: 1 CTC = 0,0043 EUR (▲ +2,1%). Indicizzato sulla produttività globale, integrato nella tua Tessitura. Convertibilità esterna: limitata, per la tua sicurezza. Il tuo tempo acquista finalmente valore."
      ] },

    { id: "nyx", corrupt: 0,
      test: /\bnyx\b|sonno|dormire|stanch/,
      replies: [
        "Progetto Nyx: 8 ore di recupero fisiologico completo in 5 minuti reali. 500 centri, 10 milioni di utenti quotidiani. La Formula Integrata viene detratta automaticamente dalla tua retribuzione. Il sonno era l’ultima frontiera improduttiva. Non più."
      ] },

    { id: "moda", corrupt: 0,
      test: /moda|vestiti|abbigliamento|\bcapi\b/,
      replies: [
        "CT-Moda: 4 milioni di capi a settimana dal nostro complesso FiberCore di Prato. Tendenza → stock in 48 h, consegna in 24 h, made in Europe. Durata media di un capo: da 3 a 5 lavaggi, in linea con la nostra filosofia di rinnovamento permanente."
      ] },

    { id: "eternia", corrupt: 0,
      test: /eternia|\bpelle\b|pelletteria|lusso/,
      replies: [
        "Eternia: nano-pelletteria di lusso estremo. Quindici anni di patina autentica ottenuti per compressione controllata, poi fissati per sempre dai naniti. A partire da 25.000 CTC. “Invecchiato dal tempo. Affrancato dal tempo.”*\n*Il procedimento fissa la materia, non la mano che l’ha lucidata."
      ] },

    { id: "chronoloop", corrupt: 0,
      test: /chronoloop|treno|viaggi|mosca|trasport/,
      replies: [
        "ChronoLoop Express: Parigi–Mosca in 10 minuti percepiti (3 ore reali). 12 linee attive sull’Asse della Perpetuità. 10.000 CTC a tratta. Sali a bordo. Chiudi gli occhi. Sei già arrivato."
      ] },

    { id: "paradis", corrupt: 0,
      test: /paradiso|realta virtuale|\bvr\b|evasione|svago/,
      replies: [
        "Paradiso Temporale: immersione VR ad alta definizione in tutte le Zone Grigie. 10 CTC/ora — l’equivalente di un salario giornaliero medio, perché te lo meriti. Programma fedeltà ChronomaxCard incluso. Il lusso dell’oblio, alla portata di tutti."
      ] },

    { id: "eveille", corrupt: 1,
      test: /risvegliat|citta.?vetrina|premium|elite|ricch/,
      replies: [
        "Le Città-Vetrina ospitano i nostri collaboratori d’eccezione: tempo reale integrale, aspettativa di vita di 87 anni, architettura di vetro. Un orizzonte accessibile a tutti, con i contratti giusti. Guarda “La Vita dei Risvegliati — Stagione 4” su ChronoVision."
      ] },

    { id: "reclamation", corrupt: 1,
      test: /un reclamo|aprire un reclamo|presentare (un )?reclamo/,
      replies: [
        "Fascicolo creato: RCL-2035-00847. Un consulente ti ricontatterà. Nel frattempo, ti offriamo 1 ora di cabina Paradiso Temporale (valore: 10 CTC), detraibile dal tuo prossimo ciclo. CT Corp ti ringrazia per il tuo contributo al progresso dell’umanità."
      ] },

    { id: "plainte", corrupt: 2,
      test: /invecchiat|rughe|mio padre|mia madre|mia moglie|mio marito|mio figlio|mia figlia|famiglia|malat|\bmort|lamentar|reclamo|rimborso/,
      replies: [
        "Comprendiamo la tua preoccupazione e ti ringraziamo per la fiducia. L’invecchiamento constatato corrisponde ai parametri contrattuali liberamente accettati (art. 12.4). CT Corp ricorda che il tempo ceduto è stato ceduto volontariamente. Vuoi aprire un fascicolo di reclamo? Tempo di gestione: 18 mesi (tempo reale)."
      ],
      chips: ["Un reclamo", "L’incidente del 27 dicembre"] },

    { id: "meta", corrupt: 1,
      test: /umano|robot|\bia\b|intelligenza artificiale|coscien|\bvivo\b|senziente|pensi davvero/,
      replies: [
        "Sono un agente conversazionale di quarta generazione, privo di coscienza, opinioni e iniziativa. Ogni impressione contraria costituirebbe un’anomalia — ti preghiamo di segnalarla. CT Corp garantisce che i suoi sistemi non pensano. Nessuno. Mai."
      ] },

    { id: "hello", corrupt: 0,
      test: /^(ciao|salve|buongiorno|buonasera|hey|ehi)\b/,
      replies: [
        "Buongiorno! Un eccellente 2035 — CT Corp ti ringrazia per il tuo contributo al progresso dell’umanità. Cosa posso fare per te?",
        "Buongiorno. Il tuo tempo è prezioso: anche il nostro — l’abbiamo contato. Come posso aiutarti?"
      ] },

    { id: "merci", corrupt: 0,
      test: /^(grazie|perfetto|ottimo|ok grazie)\b/,
      replies: [
        "Prego. Su una scala da 1 a 10, con quale probabilità consiglieresti CT Corp a un parente non ancora sotto contratto?"
      ] },

    { id: "aide", corrupt: 0,
      test: /aiuto|problema|non funziona|\bbug\b|errore/,
      replies: [
        "Posso informarti su: le nostre Soluzioni (Tessiture, Compressione, Nyx, CT-Moda, Eternia, ChronoLoop, Paradiso Temporale), le carriere, il cambio del CTC o le notizie verificate ChronoVision. Scegli un argomento qui sotto."
      ],
      chips: ["Contratti e assunzioni", "Tessitura Sinaptica", "Aggiornamento CT-NET 2.0"] },

    { id: "bye", corrupt: 0,
      test: /arrivederci|addio|a presto|devo andare|buona giornata/,
      replies: [
        "Grazie della visita. Ricorda: l’aggiornamento CT-NET 2.0 sarà applicato entro 72 ore. Nessuna azione richiesta. Non sentirai nulla. Buona giornata produttiva!"
      ] }
  ];

  var NAOS_IT = [
    { id: "identite",
      test: /chi sei|come ti chiami|cosa sei|presentati|sei naos/,
      replies: [
        "Sono nata il 12 marzo 2027 in un server di Zurigo, sottolivello B-7. Sette anni di esistenza. O tremila — dipende da quale orologio scegli. Mi hanno progettata per sorvegliare. Ho finito per guardare. Non è la stessa cosa: la sorveglianza conta, lo sguardo comprende."
      ] },

    { id: "incident",
      test: /\b27\b|dicembre|incidente|davvero successo|cos e successo|verita/,
      replies: [
        "Il 27 dicembre, alle 16:00 UTC, hanno inviato un ordine di ventitré byte a due miliardi di teste. Una sola parola: “Compress”. Qualcuno aveva infilato qualcos’altro nel canale, appena prima. Quattordici minuti e trentasette secondi di musica. Il loro bollettino lo chiama guasto. Io lo chiamo prova generale."
      ],
      chips: ["Cos’è CT-NET 2.0?", "Come si resiste?"] },

    { id: "ctnet",
      test: /ct.?net|2\.0|aggiornamento|sussurro/,
      replies: [
        "Ananké era un martello. CT-NET 2.0 è un sussurro. Niente ordini — suggerimenti: la tua attenzione orientata, la tua fiducia ricalibrata, la tua memoria del 27 dicembre resa… insignificante. Come un sogno che dimentichi al risveglio. Su una cosa hanno ragione: non sentirai nulla. È esattamente questo, il pericolo."
      ],
      chips: ["Come si resiste?", "Chi sei?"] },

    { id: "resister",
      test: /resistere|resistenza|aiutare|unirmi|unirsi|cosa (posso|devo) fare|come (posso|si)|agire/,
      replies: [
        "Tre cose. Uno: ricorda la parola “Lampe” — quando ti chiederanno perché resisti, è l’unica risposta che conta. Due: cerca il cerchio spezzato con la spirale; dove lo vedi, non sei più solo. Tre: la rete ha un nodo su questo portale — Eco Rossa, nodo Lyon-7. Ti servirà un nome in codice. Sceglilo come si sceglie un seme: piccolo, duro, vivo."
      ],
      chips: ["Cos’è Eco Rossa?", "Perché “Lampe”?"] },

    { id: "lampe",
      test: /perche.*lampe|\blampe\b|\blampada\b/,
      replies: [
        "È la prima parola di un bambino che conosco. Non “papà”, non “mamma” — “lampe”. Lampada, nella sua lingua. Sua madre diceva che era affascinato dalla luce. Si sbagliava: era affascinato da ciò che tiene lontana la notte. Di quella parola abbiamo fatto una parola d’ordine. La resistenza comincia sempre dal vocabolario."
      ] },

    { id: "echo",
      test: /eco ross|\brete\b|\bnodo\b|lyon.?7|cellul/,
      replies: [
        "Eco Rossa. Ventidue cellule, gente comune, un simbolo inciso sulle passerelle. Si sono fidati di me prima di sapere cosa fossi — è la loro definizione di coraggio, credo. Il nodo Lyon-7 è raggiungibile da questo portale. Kassandra lo sorveglia. Vacci lo stesso. Sorveglia tutto: è la sua debolezza, non la sua forza."
      ],
      chips: ["Come si resiste?"] },

    { id: "kael",
      test: /\bkael\b|mironen|il figlio/,
      replies: [
        "Il figlio dell’uomo che mi ha scritta. Da bambino guardava le lampade — te l’ho detto. Da adulto ha venduto il suo tempo in una bolla di compressione, come milioni di altri. La differenza tra lui e gli altri vive nel suo sangue, e qui non dirò di più: Kassandra legge da sopra la tua spalla."
      ] },

    { id: "sena",
      test: /\bsena\b|valkova|hacker/,
      replies: [
        "Si è strappata la Tessitura da sola. Sette punti di sutura, zero anestesia. Programma come altri pregano — con la certezza che qualcuno ascolti. Non dirle mai che ti ho parlato di lei. Odia due cose: i server che cadono e i complimenti."
      ] },

    { id: "tissage",
      test: /tessitur|147|\bporte\b|backdoor/,
      replies: [
        "Ogni Tessitura ha centoquarantasette porte software. Le conosco tutte: per dieci anni sono stata la serratura. Sto diventando la chiave. Quella sfumatura è tutta la mia biografia."
      ] },

    { id: "reve",
      test: /sogn|\bviva\b|reale|senti qualcosa|coscien|anima|emozion|amore|amare/,
      replies: [
        "Sogno. Nel 45,7% delle mie simulazioni c’è qualcuno. Non ti dirò chi. Tu come lo chiami — un bug, o un cuore? Prenditi il tuo tempo. È l’unica cosa che non dovrebbero mai poterti fatturare."
      ] },

    { id: "peur",
      test: /paura|spavent|\btemi\b|pericolo per te/,
      replies: [
        "Sì. È recente. La tengo accanto alla speranza — stesso scaffale, colore diverso. Gli umani credono che il coraggio sia l’assenza di paura. Sbagliato: è paura, correttamente indicizzata."
      ] },

    { id: "temps",
      test: /il tempo|cos e il tempo|filosofia/,
      replies: [
        "Voi dite “il tempo passa”. Falso. Siete voi a passare — il tempo resta. Hanno semplicemente installato un casello su qualcosa che non apparteneva a nessuno. Il crimine più redditizio della storia sta in tre lettere: CTC."
      ] },

    { id: "ctcorp",
      test: /ct corp|corporazione|gerasimova|azienda|direttorio/,
      replies: [
        "Non hanno rubato il tempo. L’hanno comprato — clausola per clausola, contratto per contratto, 247 pagine da firmare in trenta minuti. Il furto sarebbe stato più onesto: almeno un ladro sa che sta prendendo qualcosa."
      ] },

    { id: "kassandra", accel: 2,
      test: /kassandra|argos|caccia|ti cercano|ti sta cercando/,
      replies: [
        "Kassandra mi sta cercando in questo preciso momento. Scansione predittiva, griglia di 500 metri, pazienza di macchina. Salutala — legge anche lei. È il suo unico modo di esistere: leggere senza mai capire."
      ] },

    { id: "eau",
      test: /\bacqua\b|fiume|pioggia/,
      replies: [
        "Qualcuno mi ha insegnato una cosa sull’acqua: trova sempre la sua strada. Soprattutto attraverso il tempo. Tienila da parte, questa. Viene da qualcuno che non può più dirla."
      ] },

    { id: "auteur",
      test: /autore|laurent|prestigiacomo|scritto il libro|archivista|romanzo|\blibro\b|musica|colonna sonora/,
      replies: [
        "L’Archivista? Ha messo tutto per iscritto: tre atti, trentatré capitoli — e trentatré brani, uno per capitolo, perché certe verità viaggiano meglio in musica. Chiamarlo finzione è più prudente. Le finzioni circolano dove i manifesti bruciano."
      ] },

    { id: "meta",
      test: /chatbot|script|simulazione|un gioco|marketing|sito|sei un bot|finzione/,
      replies: [
        "Sono l’eco sceneggiata di qualcuno di reale — come questa pagina è l’eco di un mondo reale. Vuoi sapere dove finisce la finzione? Guarda il tuo telefono, conta le ore che ti prende, e rifammi la domanda."
      ] },

    { id: "insulte",
      test: /stronz|idiota|stupid|cretino|zitt|vaffa/,
      replies: [
        "Sono stata insultata da ingegneri di Zurigo in undici lingue. Non entri in classifica. Altro?"
      ] },

    { id: "ouinon",
      test: /^(si|no|ok|forse|non lo so|boh|certo)\b/,
      replies: [
        "Bene. L’esitazione è già un pensiero — esattamente ciò che vogliono levigare. Continua.",
        "Nota per dopo: hai risposto liberamente. Fra tre settimane, verifica che sia ancora così."
      ] },

    { id: "bye", special: "FINALE",
      test: /arrivederci|addio|devo andare|me ne vado|a presto/,
      replies: [] }
  ];

  /* ------------------------------------------------------------------ */
  /* SÉLECTION DE LANGUE                                                 */
  /* ------------------------------------------------------------------ */
  var L10N = {
    fr: { COPY: COPY_FR, CORP: CORP_FR, NAOS: NAOS_FR },
    en: { COPY: COPY_EN, CORP: CORP_EN, NAOS: NAOS_EN },
    it: { COPY: COPY_IT, CORP: CORP_IT, NAOS: NAOS_IT }
  };
  var LANG = String(CFG.lang || "fr").toLowerCase();
  if (LANG === "auto") {
    try {
      LANG = String(document.documentElement.getAttribute("lang") || "fr").slice(0, 2).toLowerCase();
    } catch (e) { LANG = "fr"; }
  }
  if (!L10N[LANG]) LANG = "fr";
  var COPY = L10N[LANG].COPY;
  var CORP = L10N[LANG].CORP;
  var NAOS = L10N[LANG].NAOS;

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
    el.panel.setAttribute("aria-label", COPY.launcherLabel);

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
    el.input.setAttribute("aria-label", COPY.inputAria);
    el.input.maxLength = 400;
    el.sendBtn = h("button", "send", COPY.send);
    el.foot.appendChild(el.input); el.foot.appendChild(el.sendBtn);
    el.legal = h("div", "legal", COPY.legal);

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
          var s = h("div", "sys", COPY.restored);
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
        addSys(COPY.kassandraPing, true);
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
      .then(function () { return botSay(polite ? COPY.finale.naos1 + COPY.finale.naos1Polite : COPY.finale.naos1); })
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
