/* ÉCHO ROUGE — PROTOCOLE EXODUS
   Jeu d'infiltration en pixel art, 800×480, 10 niveaux (2 actes).
   Un seul fichier partagé par les versions FR / EN / IT (langue lue sur <html lang>).
   Aucune image ni aucun son externe : tout est dessiné dans le canvas et synthétisé (Web Audio). */
(function () {
'use strict';

var T = 16, VW = 800, VH = 480, H = 30, RW = 20, NL = 10;

/* ======================================================================
   1. TEXTES (FR / EN / IT)
   ====================================================================== */
var STR = {
fr: {
  title: 'PROTOCOLE EXODUS', sub: 'ÉCHO ROUGE // INFILTRATION',
  agent: 'AGENT', cont: 'CONTINUER', neu: 'NOUVELLE PARTIE', levels: 'NIVEAUX', scores: 'SCORES', quit: 'RETOUR À ÉCHO ROUGE',
  sound: 'SON', on: 'OUI', off: 'NON', acts: ['ACTE I', 'ACTE II'],
  level: 'NIVEAU', locked: 'VERROUILLÉ', best: 'RECORD', back: 'B : RETOUR', none: '—',
  keysHint: 'FLÈCHES / ZQSD : BOUGER   ESPACE : ACTION   P : PAUSE   M : SON   F : PLEIN ÉCRAN',
  touchHint: 'CROIX : BOUGER   A : ACTION   B : PAUSE',
  pause: 'PAUSE', resume: 'REPRENDRE', restart: 'RECOMMENCER LE NIVEAU', menu: 'MENU PRINCIPAL',
  caught: 'REPÉRÉ', lives: 'VIES', over: 'CAPTURÉ', overSub: 'Les verrous temporels vous renvoient en cellule.',
  retry: 'A : RÉESSAYER', clear: 'NIVEAU TERMINÉ', time: 'TEMPS', newBest: 'NOUVEAU RECORD', next: 'A : SUITE',
  end: 'EXTRACTION RÉUSSIE', endSub: 'Total de vos records', endThanks: 'Écho Rouge vous doit une vie.',
  hack: 'PIRATAGE', suit: 'CTR-7', alarm: 'ALARME', hidden: 'CACHÉ', needKey: 'CARTE REQUISE', needTerm: 'TERMINAL REQUIS',
  rotate: 'Tournez votre téléphone en mode paysage', total: 'TOTAL',
  names: ['BLOC DE COMPRESSION', 'CANTINE ET CUISINES', 'SALLE DES SERVEURS', 'LES TOITS', 'STATION ORBITALE', 'ZONES GRISES', 'MÉTRO FANTÔME', 'LA CENTRALE', 'CITÉ-VITRINE', 'NOYAU TEMPOREL'],
  goals: ['Trouvez la carte rouge et gagnez la cour.', 'Fondez-vous dans la foule. Carte bleue en cuisine.', 'Piratez les terminaux. Coupez les caméras.', 'Évitez les faisceaux des drones. Rejoignez la navette.', 'Pas d\'ombre ici. Atteignez le cœur, puis la capsule.',
    'Traqueurs au sol : restez hors de leur cercle. Carte jaune.', 'Traversez les voies entre deux wagonnets.', 'Courant coupé. Suivez leurs lampes. Évitez le sol électrifié.', 'Tapis roulants et caméras. Fondez-vous parmi les citoyens.', 'Votre écho rejoue vos pas, 5 secondes après vous. Ne le croisez pas. Atteignez le noyau.'],
  l1a: 'Je suis dans ton oreillette. Reste dans l\'ombre : ils ne voient que ce qui traverse la lumière.',
  l1b: 'Carte rouge, porte rouge. Ils n\'ont jamais eu d\'imagination.',
  l1c: 'La cour. Un dernier garde, puis la cantine.',
  l2a: 'Paraît qu\'un type a vendu dix ans pour une double ration.',
  l2b: 'Fonds-toi dans la file. Un détenu de plus, personne ne compte.',
  l2c: 'Les cuisines, c\'est badge bleu. Et moi, j\'ai rien vu.',
  l3a: 'Ici, c\'est chez moi. Maintiens A près d\'un terminal : j\'ouvre le reste.',
  l3b: 'Les caméras sont les yeux de Kassandra. Le terminal ambre les éteint.',
  l3c: 'Ne regarde pas la sphère. Avance.',
  l4a: 'Les drones n\'ont pas besoin de te voir de face. Évite leur faisceau.',
  l4b: 'La navette est au bout de la plateforme. Ne te retourne pas.',
  l5a: 'Pas d\'ombre ici, seulement des alcôves. Les lasers ont un rythme : écoute-le.',
  l5b: 'Zone irradiée. Ta CTR-7 tient quelques secondes. Cours.',
  l5c: 'Le cœur est là-haut. Pirate-le, et tout s\'ouvre.',
  l5d: 'C\'est fait. Ils savent. Capsule d\'évacuation, maintenant !',
  l6a: 'La capsule a tenu. Bienvenue dans les Zones Grises. Les traqueurs flairent tout ce qui approche : garde tes distances.',
  l6b: 'Encore un qui tombe du ciel. Ici, on ne demande pas d\'où tu viens.',
  l6c: 'L\'entrée du métro est au fond. Plus personne ne descend là-dessous. Parfait.',
  l7a: 'Les wagonnets roulent encore, sans conducteur. Traverse entre deux passages.',
  l7b: 'Trois voies d\'affilée. Compte les passages, pas les secondes.',
  l8a: 'Ils ont coupé le courant. Tant mieux : leurs lampes te montrent où ils regardent.',
  l8b: 'Le sol crépite avant de mordre. Écoute-le.',
  l9a: 'La Cité-Vitrine. Tout est propre, tout est filmé. Marche comme si tu avais le temps.',
  l9b: 'Souriez, voyons. Ici, du temps, on en a.',
  l9c: 'Leur siège est au bout de l\'esplanade. Le noyau est en dessous.',
  l10a: 'Ici, le temps se replie. Ton écho refait tes pas, cinq secondes après toi. Ne reste pas sur place, ne reviens pas sur tes traces.',
  l10b: 'Champ bleu : tu ralentis. Champ doré : tu files. Sers-t\'en.',
  l10c: 'Le noyau. Tout ce qu\'ils ont volé passe par ici. Pirate-le.',
  l10d: 'C\'est fait. Le temps leur échappe. Sors de là, plus vite que toi-même !'
},
en: {
  title: 'PROTOCOL EXODUS', sub: 'RED ECHO // INFILTRATION',
  agent: 'AGENT', cont: 'CONTINUE', neu: 'NEW GAME', levels: 'LEVELS', scores: 'SCORES', quit: 'BACK TO RED ECHO',
  sound: 'SOUND', on: 'ON', off: 'OFF', acts: ['ACT I', 'ACT II'],
  level: 'LEVEL', locked: 'LOCKED', best: 'BEST', back: 'B: BACK', none: '—',
  keysHint: 'ARROWS / WASD: MOVE   SPACE: ACTION   P: PAUSE   M: SOUND   F: FULLSCREEN',
  touchHint: 'D-PAD: MOVE   A: ACTION   B: PAUSE',
  pause: 'PAUSED', resume: 'RESUME', restart: 'RESTART LEVEL', menu: 'MAIN MENU',
  caught: 'SPOTTED', lives: 'LIVES', over: 'CAPTURED', overSub: 'The temporal locks send you back to your cell.',
  retry: 'A: TRY AGAIN', clear: 'LEVEL COMPLETE', time: 'TIME', newBest: 'NEW BEST', next: 'A: NEXT',
  end: 'EXTRACTION COMPLETE', endSub: 'Sum of your best times', endThanks: 'Red Echo owes you a life.',
  hack: 'HACKING', suit: 'CTR-7', alarm: 'ALARM', hidden: 'HIDDEN', needKey: 'KEYCARD REQUIRED', needTerm: 'TERMINAL REQUIRED',
  rotate: 'Rotate your phone to landscape', total: 'TOTAL',
  names: ['COMPRESSION BLOCK', 'CANTEEN AND KITCHENS', 'SERVER HALL', 'THE ROOFTOPS', 'ORBITAL STATION', 'THE GRAY ZONES', 'GHOST METRO', 'THE POWER PLANT', 'SHOWCASE CITY', 'TEMPORAL CORE'],
  goals: ['Find the red keycard and reach the yard.', 'Blend into the crowd. Blue keycard in the kitchens.', 'Hack the terminals. Kill the cameras.', 'Stay out of the drone beams. Reach the shuttle.', 'No shadows here. Reach the core, then the pod.',
    'Ground trackers: stay out of their circle. Yellow keycard.', 'Cross the tracks between two carts.', 'Power is out. Follow their flashlights. Avoid the live floor.', 'Moving walkways and cameras. Blend in with the citizens.', 'Your echo replays your steps, 5 seconds behind. Do not cross it. Reach the core.'],
  l1a: 'I am in your earpiece. Stay in the shadows: they only see what crosses the light.',
  l1b: 'Red card, red door. They never had any imagination.',
  l1c: 'The yard. One last guard, then the canteen.',
  l2a: 'Word is some guy sold ten years for a double ration.',
  l2b: 'Blend into the line. One more inmate, nobody is counting.',
  l2c: 'Kitchens are blue badge only. And I saw nothing.',
  l3a: 'This is my home. Hold A near a terminal: I will open the rest.',
  l3b: 'The cameras are Kassandra\'s eyes. The amber terminal blinds them.',
  l3c: 'Do not look at the sphere. Keep moving.',
  l4a: 'Drones do not need to face you. Stay out of their beam.',
  l4b: 'The shuttle is at the end of the platform. Do not look back.',
  l5a: 'No shadows here, only alcoves. The lasers have a rhythm: listen to it.',
  l5b: 'Irradiated zone. Your CTR-7 holds for a few seconds. Run.',
  l5c: 'The core is up there. Hack it and everything opens.',
  l5d: 'It is done. They know. Escape pod, now!',
  l6a: 'The pod held. Welcome to the Gray Zones. Trackers sniff out anything that gets close: keep your distance.',
  l6b: 'Another one falling from the sky. Around here, nobody asks where you come from.',
  l6c: 'The metro entrance is at the far end. Nobody goes down there anymore. Perfect.',
  l7a: 'The carts still run, with no driver. Cross between two passes.',
  l7b: 'Three tracks in a row. Count the passes, not the seconds.',
  l8a: 'They cut the power. Good: their flashlights show you where they are looking.',
  l8b: 'The floor crackles before it bites. Listen to it.',
  l9a: 'Showcase City. Everything is clean, everything is filmed. Walk as if you had time.',
  l9b: 'Do smile. Here, time is something we have.',
  l9c: 'Their headquarters is at the end of the esplanade. The core is underneath.',
  l10a: 'Here, time folds. Your echo retraces your steps, five seconds behind. Do not stand still, do not double back.',
  l10b: 'Blue field: you slow down. Golden field: you fly. Use them.',
  l10c: 'The core. Everything they stole flows through here. Hack it.',
  l10d: 'It is done. Time is slipping from their hands. Get out, faster than yourself!'
},
it: {
  title: 'PROTOCOLLO EXODUS', sub: 'ECO ROSSO // INFILTRAZIONE',
  agent: 'AGENTE', cont: 'CONTINUA', neu: 'NUOVA PARTITA', levels: 'LIVELLI', scores: 'PUNTEGGI', quit: 'TORNA A ECO ROSSO',
  sound: 'AUDIO', on: 'SÌ', off: 'NO', acts: ['ATTO I', 'ATTO II'],
  level: 'LIVELLO', locked: 'BLOCCATO', best: 'RECORD', back: 'B: INDIETRO', none: '—',
  keysHint: 'FRECCE / WASD: MUOVI   SPAZIO: AZIONE   P: PAUSA   M: AUDIO   F: SCHERMO INTERO',
  touchHint: 'CROCE: MUOVI   A: AZIONE   B: PAUSA',
  pause: 'PAUSA', resume: 'RIPRENDI', restart: 'RICOMINCIA IL LIVELLO', menu: 'MENU PRINCIPALE',
  caught: 'SCOPERTO', lives: 'VITE', over: 'CATTURATO', overSub: 'I blocchi temporali ti rimandano in cella.',
  retry: 'A: RIPROVA', clear: 'LIVELLO COMPLETATO', time: 'TEMPO', newBest: 'NUOVO RECORD', next: 'A: AVANTI',
  end: 'ESTRAZIONE RIUSCITA', endSub: 'Somma dei tuoi record', endThanks: 'Eco Rosso ti deve una vita.',
  hack: 'HACKING', suit: 'CTR-7', alarm: 'ALLARME', hidden: 'NASCOSTO', needKey: 'TESSERA RICHIESTA', needTerm: 'TERMINALE RICHIESTO',
  rotate: 'Ruota il telefono in orizzontale', total: 'TOTALE',
  names: ['BLOCCO DI COMPRESSIONE', 'MENSA E CUCINE', 'SALA SERVER', 'I TETTI', 'STAZIONE ORBITALE', 'ZONE GRIGIE', 'METRO FANTASMA', 'LA CENTRALE', 'CITTÀ-VETRINA', 'NUCLEO TEMPORALE'],
  goals: ['Trova la tessera rossa e raggiungi il cortile.', 'Confonditi tra la folla. Tessera blu in cucina.', 'Viola i terminali. Spegni le telecamere.', 'Evita i fasci dei droni. Raggiungi la navetta.', 'Qui niente ombra. Raggiungi il nucleo, poi la capsula.',
    'Segugi a terra: resta fuori dal loro cerchio. Tessera gialla.', 'Attraversa i binari tra due carrelli.', 'Corrente staccata. Segui le loro torce. Evita il pavimento elettrificato.', 'Tapis roulant e telecamere. Confonditi tra i cittadini.', 'La tua eco ripete i tuoi passi, 5 secondi dopo. Non incrociarla. Raggiungi il nucleo.'],
  l1a: 'Sono nel tuo auricolare. Resta nell\'ombra: vedono solo ciò che attraversa la luce.',
  l1b: 'Tessera rossa, porta rossa. Non hanno mai avuto fantasia.',
  l1c: 'Il cortile. Un\'ultima guardia, poi la mensa.',
  l2a: 'Dicono che un tizio ha venduto dieci anni per una doppia razione.',
  l2b: 'Confonditi nella fila. Un detenuto in più, nessuno conta.',
  l2c: 'In cucina si entra col badge blu. E io non ho visto niente.',
  l3a: 'Qui sono a casa mia. Tieni premuto A vicino a un terminale: apro io il resto.',
  l3b: 'Le telecamere sono gli occhi di Kassandra. Il terminale ambra le spegne.',
  l3c: 'Non guardare la sfera. Vai avanti.',
  l4a: 'I droni non hanno bisogno di vederti in faccia. Evita il loro fascio.',
  l4b: 'La navetta è in fondo alla piattaforma. Non voltarti.',
  l5a: 'Qui niente ombra, solo nicchie. I laser hanno un ritmo: ascoltalo.',
  l5b: 'Zona irradiata. La tua CTR-7 regge pochi secondi. Corri.',
  l5c: 'Il nucleo è lassù. Violalo e tutto si apre.',
  l5d: 'È fatta. Lo sanno. Capsula di salvataggio, adesso!',
  l6a: 'La capsula ha retto. Benvenuto nelle Zone Grigie. I segugi fiutano tutto ciò che si avvicina: tieni le distanze.',
  l6b: 'Un altro che cade dal cielo. Qui nessuno chiede da dove vieni.',
  l6c: 'L\'ingresso del metro è in fondo. Nessuno scende più là sotto. Perfetto.',
  l7a: 'I carrelli corrono ancora, senza conducente. Attraversa tra un passaggio e l\'altro.',
  l7b: 'Tre binari di fila. Conta i passaggi, non i secondi.',
  l8a: 'Hanno staccato la corrente. Meglio così: le loro torce ti mostrano dove guardano.',
  l8b: 'Il pavimento crepita prima di mordere. Ascoltalo.',
  l9a: 'La Città-Vetrina. Tutto è pulito, tutto è ripreso. Cammina come se avessi tempo.',
  l9b: 'Sorrida, su. Qui di tempo ne abbiamo.',
  l9c: 'La loro sede è in fondo alla spianata. Il nucleo è lì sotto.',
  l10a: 'Qui il tempo si ripiega. La tua eco ripete i tuoi passi, cinque secondi dopo. Non fermarti, non tornare sui tuoi passi.',
  l10b: 'Campo blu: rallenti. Campo dorato: voli. Usali.',
  l10c: 'Il nucleo. Tutto ciò che hanno rubato passa da qui. Violalo.',
  l10d: 'È fatta. Il tempo sfugge loro di mano. Esci di lì, più veloce di te stesso!'
}
};

/* ======================================================================
   2. NIVEAUX (pièces de 20 tuiles de large, coordonnées relatives à la pièce)
   ====================================================================== */
var PAL = [
  { floor: '#5d6470', floor2: '#565d69', line: '#4d535e', wallTop: '#5a5088', wallFront: '#2e2850', wallHi: '#7a70a8', brick: true, dark: 0.50, accent: '#00ff41', guard: '#1f3a6b', hide: 'rgba(8,10,20,0.55)' },
  { floor: '#6e6253', floor2: '#665a4c', line: '#584d40', wallTop: '#8a6842', wallFront: '#4a3420', wallHi: '#a9855a', brick: true, dark: 0.42, accent: '#ffb000', guard: '#1f3a6b', hide: 'rgba(20,12,4,0.5)' },
  { floor: '#1c2238', floor2: '#181d31', line: '#11152a', wallTop: '#2f3463', wallFront: '#15173a', wallHi: '#4a50a0', brick: false, dark: 0.55, accent: '#e3be68', guard: '#3a2a6b', hide: 'rgba(0,0,8,0.6)', stepKind: 'metal' },
  { floor: '#1d2833', floor2: '#19232d', line: '#131b24', wallTop: '#2f4052', wallFront: '#111922', wallHi: '#48607a', brick: false, dark: 0.50, accent: '#39d5ff', guard: '#20242c', hide: 'rgba(0,4,10,0.62)', rain: true, top: 'city', stepKind: 'wet' },
  { floor: '#dfe5ea', floor2: '#d5dce2', line: '#c2ccd4', wallTop: '#f4f7f9', wallFront: '#aebac4', wallHi: '#ffffff', brick: false, dark: 0.06, accent: '#c9a24b', guard: '#7f93a6', hide: 'rgba(120,140,160,0.35)', top: 'space', stepKind: 'metal', suit: ['#e9eef2', '#c9a24b'] },
  /* Acte II */
  { floor: '#3f4038', floor2: '#393a32', line: '#2c2d26', wallTop: '#6a5540', wallFront: '#2e2218', wallHi: '#8a7258', brick: true, dark: 0.56, accent: '#ffd23a', guard: '#2a3340', hide: 'rgba(0,0,0,0.6)', rain: true, top: 'ruin', stepKind: 'wet', crowd: ['#6b6f5a', '#7a5a3a', '#4f5a66'] },
  { floor: '#322d2a', floor2: '#2c2825', line: '#1e1b19', wallTop: '#3f5050', wallFront: '#182222', wallHi: '#5e7474', brick: true, dark: 0.50, accent: '#ffd23a', guard: '#283548', hide: 'rgba(0,0,0,0.6)', stepKind: 'metal' },
  { floor: '#1c2722', floor2: '#19231e', line: '#111a16', wallTop: '#2b3b33', wallFront: '#0d1411', wallHi: '#40564a', brick: false, dark: 0.90, blackout: true, accent: '#59ffa0', guard: '#1e2a3a', hide: 'rgba(0,0,0,0.5)', stepKind: 'metal' },
  { floor: '#ebe5d4', floor2: '#e3dcc9', line: '#d0c8b2', wallTop: '#8fd0d8', wallFront: '#4a8a96', wallHi: '#d2f4f7', brick: false, dark: 0.04, accent: '#c9a24b', guard: '#b08a3e', hide: 'rgba(90,150,160,0.3)', top: 'glass', crowd: ['#f2f2f2', '#d9c9a0', '#9fc5d0', '#e8b9b0'], suit: ['#f2f2f2', '#c9a24b'] },
  { floor: '#1c1334', floor2: '#17102c', line: '#0e0920', wallTop: '#3d2c6c', wallFront: '#1a1038', wallHi: '#6f58b8', brick: false, dark: 0.46, accent: '#e3be68', guard: '#4a2a6b', hide: 'rgba(0,0,10,0.6)', stepKind: 'metal' }
];

var LEVELS = [
/* ---------- 1. BLOC DE COMPRESSION ---------- */
{ start: [2, 5], det: 0.55, rooms: [
  { gap: 14,
    blocks: [[3,3,2,3,'bed'],[8,3,2,3,'bed'],[13,3,2,3,'bed'],[3,24,2,3,'bed'],[8,24,2,3,'bed'],[13,24,2,3,'bed'],[6,2,1,6,'wall'],[11,2,1,6,'wall'],[6,22,1,7,'wall'],[11,22,1,7,'wall']],
    hides: [[9,10,3,2,'shadow'],[9,18,3,2,'shadow'],[17,5,2,2,'shadow']],
    guards: [{ p: [[4,14],[16,14]], s: 38, r: 78 }],
    trig: [{ x: 1, y: 2, w: 5, h: 8, who: 'naos', key: 'l1a' }] },
  { gap: 22, door: { type: 'key', c: 'r' },
    blocks: [[5,2,1,14,'wall'],[10,10,1,19,'wall'],[13,10,2,2,'crate'],[16,17,2,2,'crate']],
    hides: [[7,3,2,2,'shadow'],[17,12,2,2,'shadow'],[2,25,2,2,'shadow']],
    keys: [{ x: 15, y: 4, c: 'r' }],
    guards: [{ p: [[12,6],[12,25]], s: 42, r: 80 }],
    trig: [{ x: 6, y: 2, w: 4, h: 6, who: 'naos', key: 'l1b' }] },
  { gap: 8,
    blocks: [[6,6,3,3,'crate'],[12,16,3,3,'crate'],[6,20,2,2,'crate']],
    hides: [[9,24,3,2,'shadow'],[15,4,2,2,'shadow'],[3,15,2,2,'shadow']],
    guards: [{ p: [[4,12],[16,12]], s: 46, r: 82 }],
    trig: [{ x: 1, y: 20, w: 4, h: 6, who: 'naos', key: 'l1c' }] }
] },
/* ---------- 2. CANTINE ET CUISINES ---------- */
{ start: [2, 22], det: 0.48, rooms: [
  { gap: 8,
    blocks: [[6,6,2,2,'crate'],[13,24,2,2,'crate']],
    hides: [[4,13,4,3,'crowd'],[15,19,2,3,'shadow'],[13,3,3,2,'crowd']],
    guards: [{ p: [[10,5],[10,25]], s: 44, r: 84 }],
    trig: [{ x: 3, y: 12, w: 6, h: 5, who: 'npc', key: 'l2a' }] },
  { gap: 20,
    blocks: [[4,5,4,2,'table'],[11,5,4,2,'table'],[4,11,4,2,'table'],[11,11,4,2,'table'],[4,17,4,2,'table'],[11,17,4,2,'table'],[4,23,4,2,'table'],[11,23,4,2,'table']],
    hides: [[4,8,4,2,'crowd'],[11,14,4,2,'crowd'],[4,20,4,2,'crowd'],[11,8,4,2,'crowd']],
    guards: [{ p: [[2,3],[17,3],[17,27],[2,27]], s: 52, r: 86, loop: true }, { p: [[9,3],[9,27]], s: 46, r: 80 }],
    trig: [{ x: 1, y: 7, w: 3, h: 4, who: 'naos', key: 'l2b' }] },
  { gap: 5, door: { type: 'key', c: 'b' },
    blocks: [[5,5,1,12,'counter'],[9,12,1,17,'counter'],[14,2,1,12,'counter'],[14,18,1,6,'counter']],
    hides: [[2,12,2,2,'shadow'],[16,8,2,2,'shadow'],[16,25,2,2,'shadow'],[2,2,2,2,'shadow']],
    keys: [{ x: 4, y: 26, c: 'b' }],
    guards: [{ p: [[7,4],[7,26]], s: 50, r: 84 }, { p: [[12,3],[12,26]], s: 56, r: 84 }],
    trig: [{ x: 1, y: 18, w: 4, h: 5, who: 'npc', key: 'l2c' }] },
  { gap: 24,
    blocks: [[7,7,3,3,'crate'],[12,8,2,2,'crate'],[6,18,2,2,'crate'],[14,17,3,2,'crate']],
    hides: [[10,7,2,2,'shadow'],[2,26,2,2,'shadow'],[10,25,3,2,'shadow'],[17,2,2,2,'shadow']],
    guards: [{ p: [[4,4],[16,4],[16,14],[4,14]], s: 58, r: 88, loop: true }, { p: [[5,22],[16,22]], s: 50, r: 84 }] }
] },
/* ---------- 3. SALLE DES SERVEURS ---------- */
{ start: [2, 14], det: 0.42, rooms: [
  { gap: 14, door: { type: 'term', id: 't1' },
    blocks: [[4,4,2,8,'rack'],[8,4,2,8,'rack'],[12,4,2,8,'rack'],[4,17,2,8,'rack'],[8,17,2,8,'rack'],[12,17,2,8,'rack']],
    hides: [[14,13,2,2,'shadow'],[2,24,2,3,'shadow'],[10,2,2,2,'shadow']],
    terms: [{ x: 16, y: 26, id: 't1' }],
    guards: [{ p: [[6,3],[6,26]], s: 50, r: 86 }, { p: [[17,4],[17,21]], s: 44, r: 84 }],
    trig: [{ x: 1, y: 12, w: 3, h: 5, who: 'naos', key: 'l3a' }] },
  { gap: 6,
    blocks: [[5,8,10,2,'rack'],[5,14,10,2,'rack'],[5,20,10,2,'rack']],
    hides: [[2,2,2,2,'shadow'],[16,26,3,2,'shadow'],[2,17,2,2,'shadow']],
    terms: [{ x: 3, y: 26, off: 'c1' }],
    cams: [{ x: 10, y: 3, a: [40, 140], r: 150, g: 'c1' }, { x: 18, y: 16, a: [140, 220], r: 140, g: 'c1' }],
    guards: [{ p: [[17,9],[17,24]], s: 54, r: 86 }, { p: [[4,11],[15,11]], s: 48, r: 80 }],
    trig: [{ x: 1, y: 13, w: 3, h: 5, who: 'naos', key: 'l3b' }] },
  { gap: 22, door: { type: 'term', id: 't2' },
    blocks: [[8,12,4,4,'core'],[4,24,8,2,'rack'],[15,2,1,6,'rack']],
    hides: [[2,12,2,3,'shadow'],[16,11,2,2,'shadow'],[14,26,2,2,'shadow']],
    terms: [{ x: 17, y: 4, id: 't2' }, { x: 3, y: 3, off: 'c2' }],
    cams: [{ x: 10, y: 10, a: [0, 360], r: 118, g: 'c2', spin: true }, { x: 18, y: 26, a: [170, 250], r: 130 }],
    guards: [{ p: [[5,9],[14,9],[14,19],[5,19]], s: 58, r: 84, loop: true }],
    trig: [{ x: 1, y: 5, w: 3, h: 5, who: 'naos', key: 'l3c' }] },
  { gap: 12,
    blocks: [[4,4,2,7,'rack'],[4,15,2,10,'rack'],[9,2,2,9,'rack'],[9,14,2,9,'rack'],[14,6,2,8,'rack'],[14,18,2,9,'rack']],
    hides: [[2,26,2,2,'shadow'],[16,15,2,2,'shadow'],[17,26,2,2,'shadow']],
    cams: [{ x: 18, y: 3, a: [100, 170], r: 150 }],
    guards: [{ p: [[7,3],[7,26]], s: 62, r: 86 }, { p: [[12,27],[12,3]], s: 54, r: 86 }] }
] },
/* ---------- 4. LES TOITS ---------- */
{ start: [2, 5], det: 0.36, rooms: [
  { gap: 20,
    blocks: [[5,4,3,2,'ac'],[12,9,3,2,'ac'],[6,16,3,2,'ac'],[13,22,3,2,'ac']],
    hides: [[5,6,3,2,'shadow'],[12,11,3,2,'shadow'],[6,18,3,2,'shadow'],[13,24,3,2,'shadow']],
    drones: [{ p: [[4,9],[16,9],[16,25],[4,25]], s: 66, r: 42, loop: true }],
    trig: [{ x: 1, y: 2, w: 4, h: 6, who: 'naos', key: 'l4a' }] },
  { gap: 6,
    blocks: [[8,14,2,2,'ac'],[14,16,2,3,'ac'],[4,10,2,2,'ac']],
    hides: [[8,16,2,2,'shadow'],[14,19,2,2,'shadow'],[4,12,2,2,'shadow'],[16,9,2,2,'shadow']],
    drones: [{ p: [[3,4],[17,4]], s: 78, r: 40 }, { p: [[11,9],[11,26]], s: 60, r: 46 }],
    guards: [{ p: [[4,24],[16,24]], s: 54, r: 86 }] },
  { gap: 24, door: { type: 'key', c: 'r' },
    blocks: [[6,2,1,12,'wall'],[12,12,1,17,'wall'],[3,20,2,2,'ac']],
    hides: [[2,14,2,2,'shadow'],[14,2,2,2,'shadow'],[17,20,2,2,'shadow'],[3,22,2,2,'shadow']],
    keys: [{ x: 16, y: 4, c: 'r' }],
    drones: [{ p: [[9,5],[9,25]], s: 68, r: 44 }, { p: [[15,26],[15,8]], s: 72, r: 44 }],
    guards: [{ p: [[3,26],[10,26]], s: 50, r: 84 }] },
  { gap: 10,
    blocks: [[9,8,2,3,'ac'],[5,17,2,3,'ac'],[13,18,2,3,'ac']],
    hides: [[9,11,2,2,'shadow'],[5,20,2,2,'shadow'],[13,21,2,2,'shadow'],[16,2,2,2,'shadow']],
    drones: [{ p: [[3,5],[17,5]], s: 84, r: 40 }, { p: [[17,14],[3,14]], s: 84, r: 40 }, { p: [[3,24],[17,24]], s: 84, r: 40 }] },
  { gap: 14,
    blocks: [[9,6,3,2,'ac'],[9,20,3,2,'ac']],
    hides: [[9,8,3,2,'shadow'],[9,22,3,2,'shadow'],[2,2,2,2,'shadow'],[17,26,2,2,'shadow']],
    drones: [{ p: [[4,5],[16,5],[16,25],[4,25]], s: 88, r: 42, loop: true }],
    guards: [{ p: [[6,4],[6,26]], s: 62, r: 86 }, { p: [[14,26],[14,4]], s: 62, r: 86 }],
    trig: [{ x: 1, y: 9, w: 3, h: 5, who: 'naos', key: 'l4b' }] }
] },
/* ---------- 5. STATION ORBITALE ---------- */
{ start: [2, 22], det: 0.30, rooms: [
  { gap: 8,
    hides: [[8,2,2,2,'alcove'],[8,26,2,2,'alcove'],[17,13,2,2,'alcove']],
    lasers: [{ x: 6, y: 2, w: 1, h: 27, per: 2.6, duty: 0.5, ph: 0 }, { x: 11, y: 2, w: 1, h: 27, per: 2.6, duty: 0.5, ph: 0.9 }, { x: 16, y: 2, w: 1, h: 27, per: 2.6, duty: 0.5, ph: 1.8 }],
    guards: [{ p: [[13,4],[13,26]], s: 58, r: 88 }],
    trig: [{ x: 1, y: 19, w: 4, h: 6, who: 'naos', key: 'l5a' }] },
  { gap: 20, door: { type: 'term', id: 't1' },
    blocks: [[7,7,6,2,'console'],[7,21,6,2,'console']],
    hides: [[17,2,2,2,'alcove'],[2,14,2,2,'alcove'],[17,26,2,2,'alcove']],
    terms: [{ x: 16, y: 4, id: 't1' }, { x: 3, y: 27, off: 'c1' }],
    cams: [{ x: 10, y: 15, a: [0, 360], r: 112, g: 'c1', spin: true }],
    guards: [{ p: [[4,4],[15,4],[15,12],[4,12]], s: 68, r: 88, loop: true }, { p: [[5,25],[16,25]], s: 62, r: 86 }] },
  { gap: 5,
    blocks: [[8,13,2,2,'pillar'],[12,22,2,2,'pillar']],
    rad: [4, 2, 13, 27],
    lasers: [{ x: 5, y: 10, w: 11, h: 1, per: 2.2, duty: 0.5, ph: 0 }, { x: 5, y: 18, w: 11, h: 1, per: 2.2, duty: 0.5, ph: 1.1 }],
    trig: [{ x: 1, y: 18, w: 3, h: 6, who: 'naos', key: 'l5b' }] },
  { gap: 14, door: { type: 'key', c: 'b' },
    blocks: [[5,12,2,5,'console'],[15,16,2,5,'console']],
    hides: [[2,2,2,2,'alcove'],[10,14,2,2,'alcove'],[17,24,2,2,'alcove']],
    keys: [{ x: 4, y: 26, c: 'b' }],
    cams: [{ x: 18, y: 3, a: [95, 175], r: 150 }],
    guards: [{ p: [[8,3],[8,26]], s: 72, r: 88 }, { p: [[13,26],[13,3]], s: 72, r: 88 }, { p: [[3,9],[17,9]], s: 58, r: 84 }] },
  { gap: 24, door: { type: 'term', id: 'core' }, alarm: 32,
    blocks: [[8,13,4,3,'core']],
    hides: [[2,2,2,2,'alcove'],[17,2,2,2,'alcove'],[2,26,2,2,'alcove']],
    terms: [{ x: 10, y: 3, id: 'core', say: 'l5d' }],
    cams: [{ x: 10, y: 11, a: [0, 360], r: 96, spin: true }],
    lasers: [{ x: 2, y: 22, w: 16, h: 1, per: 2.4, duty: 0.5, ph: 0 }],
    guards: [{ p: [[4,7],[16,7],[16,19],[4,19]], s: 78, r: 88, loop: true }],
    trig: [{ x: 1, y: 12, w: 3, h: 5, who: 'naos', key: 'l5c' }] }
] },
/* ====================== ACTE II ====================== */
/* ---------- 6. ZONES GRISES : traqueurs au sol ---------- */
{ start: [2, 6], det: 0.30, rooms: [
  { gap: 22,
    blocks: [[4,3,3,3,'pod'],[9,9,2,2,'wreck'],[13,16,3,2,'wreck'],[6,20,2,2,'wreck']],
    hides: [[9,11,2,2,'shadow'],[13,18,3,2,'shadow'],[15,4,2,2,'shadow'],[2,25,2,2,'shadow']],
    hounds: [{ p: [[5,14],[16,14]], s: 92, r: 30 }],
    guards: [{ p: [[18,8],[18,26]], s: 54, r: 86 }],
    trig: [{ x: 1, y: 3, w: 3, h: 7, who: 'naos', key: 'l6a' }] },
  { gap: 6,
    blocks: [[6,13,3,3,'wreck'],[12,5,2,3,'wreck'],[13,23,3,2,'wreck']],
    hides: [[6,16,3,2,'shadow'],[12,8,2,2,'shadow'],[13,25,3,2,'shadow'],[2,25,3,3,'crowd']],
    hounds: [{ p: [[3,10],[16,10],[16,20],[3,20]], s: 98, r: 30, loop: true }, { p: [[10,3],[10,27]], s: 88, r: 30 }],
    trig: [{ x: 1, y: 23, w: 5, h: 5, who: 'npc', key: 'l6b' }] },
  { gap: 20, door: { type: 'key', c: 'y' },
    blocks: [[7,2,1,10,'wall'],[7,16,1,13,'wall'],[13,8,1,14,'wall']],
    hides: [[2,13,2,2,'shadow'],[9,2,2,2,'shadow'],[11,24,2,2,'shadow'],[17,12,2,2,'shadow']],
    keys: [{ x: 17, y: 26, c: 'y' }],
    hounds: [{ p: [[10,5],[10,26]], s: 102, r: 30 }],
    drones: [{ p: [[5,4],[5,26]], s: 68, r: 44 }],
    guards: [{ p: [[16,3],[16,21]], s: 58, r: 86 }] },
  { gap: 12,
    blocks: [[9,13,3,2,'wreck'],[3,13,2,2,'wreck'],[16,14,2,2,'wreck']],
    hides: [[9,15,3,2,'shadow'],[3,15,2,2,'shadow'],[16,16,2,2,'shadow'],[9,2,2,2,'shadow'],[9,26,2,2,'shadow']],
    drones: [{ p: [[4,6],[16,6]], s: 78, r: 44 }, { p: [[16,23],[4,23]], s: 78, r: 44 }],
    hounds: [{ p: [[6,10],[14,10],[14,19],[6,19]], s: 106, r: 30, loop: true }] },
  { gap: 14,
    blocks: [[7,8,2,2,'wreck'],[12,20,2,2,'wreck'],[7,20,2,2,'wreck'],[12,8,2,2,'wreck']],
    hides: [[7,10,2,2,'shadow'],[12,22,2,2,'shadow'],[7,22,2,2,'shadow'],[12,10,2,2,'shadow'],[17,2,2,2,'shadow']],
    hounds: [{ p: [[10,3],[10,27]], s: 110, r: 30 }],
    drones: [{ p: [[3,6],[17,6],[17,24],[3,24]], s: 82, r: 42, loop: true }],
    guards: [{ p: [[5,4],[5,26]], s: 64, r: 88 }, { p: [[15,26],[15,4]], s: 64, r: 88 }],
    trig: [{ x: 1, y: 10, w: 3, h: 5, who: 'naos', key: 'l6c' }] }
] },
/* ---------- 7. MÉTRO FANTÔME : wagonnets ---------- */
{ start: [2, 14], det: 0.28, rooms: [
  { gap: 14,
    blocks: [[9,8,2,2,'crate'],[9,20,2,2,'crate'],[16,5,2,2,'crate']],
    movers: [{ x: 6, y: 2, w: 2, h: 27, d: 1, s: 90, n: 2 }, { x: 12, y: 2, w: 2, h: 27, d: -1, s: 120, n: 2 }],
    hides: [[16,7,2,2,'shadow']],
    trig: [{ x: 1, y: 11, w: 4, h: 7, who: 'naos', key: 'l7a' }] },
  { gap: 6,
    movers: [{ x: 4, y: 2, w: 2, h: 27, d: 1, s: 110, n: 2 }, { x: 9, y: 2, w: 2, h: 27, d: -1, s: 150, n: 2 }, { x: 14, y: 2, w: 2, h: 27, d: 1, s: 130, n: 3 }],
    hides: [[6,25,2,2,'shadow'],[11,13,2,2,'shadow'],[18,2,1,2,'shadow']],
    guards: [{ p: [[17,4],[17,26]], s: 58, r: 86 }] },
  { gap: 22, door: { type: 'term', id: 't1' },
    movers: [{ x: 5, y: 2, w: 2, h: 27, d: 1, s: 140, n: 2 }, { x: 13, y: 2, w: 2, h: 27, d: -1, s: 140, n: 2 }],
    hides: [[8,26,2,2,'shadow'],[2,2,2,2,'shadow'],[16,2,2,2,'shadow']],
    terms: [{ x: 10, y: 17, id: 't1' }, { x: 2, y: 26, off: 'c1' }],
    cams: [{ x: 10, y: 12, a: [0, 360], r: 104, g: 'c1', spin: true }],
    guards: [{ p: [[17,8],[17,26]], s: 60, r: 86 }] },
  { gap: 8,
    movers: [{ x: 1, y: 18, w: 19, h: 2, d: 1, s: 150, n: 2 }, { x: 1, y: 13, w: 19, h: 2, d: -1, s: 165, n: 2 }],
    hides: [[9,15,2,2,'shadow'],[17,26,2,2,'shadow'],[9,10,2,2,'shadow']],
    guards: [{ p: [[3,5],[16,5]], s: 62, r: 86 }] },
  { gap: 14,
    movers: [{ x: 4, y: 2, w: 2, h: 27, d: 1, s: 140, n: 3 }, { x: 8, y: 2, w: 2, h: 27, d: -1, s: 170, n: 2 }, { x: 12, y: 2, w: 2, h: 27, d: 1, s: 140, n: 3 }],
    hides: [[16,13,2,2,'shadow'],[6,2,2,2,'shadow'],[10,26,2,2,'shadow']],
    cams: [{ x: 16, y: 3, a: [60, 120], r: 140 }],
    guards: [{ p: [[15,4],[15,26]], s: 68, r: 88 }, { p: [[18,26],[18,4]], s: 68, r: 88 }],
    trig: [{ x: 1, y: 6, w: 3, h: 6, who: 'naos', key: 'l7b' }] }
] },
/* ---------- 8. LA CENTRALE : noir complet, sol électrifié ---------- */
{ start: [2, 22], det: 0.30, rooms: [
  { gap: 14,
    blocks: [[5,4,3,3,'gen'],[12,4,3,3,'gen'],[5,23,3,3,'gen'],[12,23,3,3,'gen']],
    hides: [[2,12,2,2,'shadow'],[8,14,1,2,'shadow']],
    zaps: [{ x: 16, y: 2, w: 2, h: 27, per: 3.2, duty: 0.5, ph: 0 }],
    guards: [{ p: [[10,3],[10,27]], s: 48, r: 96 }],
    trig: [{ x: 1, y: 19, w: 4, h: 6, who: 'naos', key: 'l8a' }] },
  { gap: 6,
    blocks: [[5,2,1,18,'wall'],[10,9,1,20,'wall'],[15,2,1,18,'wall']],
    hides: [[2,2,2,2,'shadow'],[8,2,2,2,'shadow'],[13,26,2,2,'shadow'],[17,24,2,2,'shadow']],
    zaps: [{ x: 5, y: 20, w: 1, h: 9, per: 3, duty: 0.5, ph: 0 }, { x: 10, y: 2, w: 1, h: 7, per: 3, duty: 0.5, ph: 1.5 }],
    guards: [{ p: [[7,4],[7,26]], s: 52, r: 96 }, { p: [[12,26],[12,4]], s: 52, r: 96 }] },
  { gap: 22, door: { type: 'key', c: 'b' },
    blocks: [[8,6,4,3,'gen'],[6,16,3,3,'gen']],
    hides: [[2,26,2,2,'shadow'],[2,10,2,2,'shadow'],[17,14,2,2,'shadow']],
    keys: [{ x: 17, y: 3, c: 'b' }],
    zaps: [{ x: 12, y: 2, w: 2, h: 27, per: 3.2, duty: 0.45, ph: 0.6 }],
    cams: [{ x: 7, y: 12, a: [0, 360], r: 96, spin: true }],
    guards: [{ p: [[5,4],[15,4],[15,25],[5,25]], s: 58, r: 96, loop: true }] },
  { gap: 10,
    blocks: [[4,5,2,4,'gen'],[9,5,2,4,'gen'],[14,5,2,4,'gen'],[4,13,2,4,'gen'],[9,13,2,4,'gen'],[14,13,2,4,'gen'],[4,22,2,4,'gen'],[9,22,2,4,'gen'],[14,22,2,4,'gen']],
    hides: [[7,2,2,2,'shadow'],[12,27,2,2,'shadow'],[6,14,2,2,'shadow'],[12,6,2,2,'shadow']],
    zaps: [{ x: 1, y: 19, w: 16, h: 1, per: 2.8, duty: 0.5, ph: 0 }, { x: 3, y: 11, w: 17, h: 1, per: 2.8, duty: 0.5, ph: 1.4 }],
    guards: [{ p: [[18,3],[18,27]], s: 56, r: 96 }] },
  { gap: 14,
    blocks: [[6,8,2,2,'gen'],[11,18,2,2,'gen'],[6,20,2,2,'gen'],[11,6,2,2,'gen']],
    hides: [[6,10,2,2,'shadow'],[11,20,2,2,'shadow'],[6,22,2,2,'shadow'],[11,8,2,2,'shadow']],
    zaps: [{ x: 16, y: 2, w: 2, h: 27, per: 2.8, duty: 0.5, ph: 0 }],
    guards: [{ p: [[5,4],[5,26]], s: 60, r: 96 }, { p: [[9,26],[9,4]], s: 60, r: 96 }, { p: [[14,4],[14,26]], s: 60, r: 96 }],
    trig: [{ x: 1, y: 8, w: 2, h: 6, who: 'naos', key: 'l8b' }] }
] },
/* ---------- 9. CITÉ-VITRINE : tapis roulants, caméras ---------- */
{ start: [2, 22], det: 0.26, rooms: [
  { gap: 8,
    blocks: [[8,17,4,1,'planter'],[3,3,2,2,'planter'],[16,24,2,2,'planter']],
    belts: [{ x: 2, y: 13, w: 17, h: 3, d: [1, 0], s: 70 }],
    hides: [[5,20,4,3,'crowd'],[12,4,4,3,'crowd']],
    cams: [{ x: 10, y: 3, a: [50, 130], r: 150 }],
    guards: [{ p: [[4,10],[16,10]], s: 60, r: 88 }],
    trig: [{ x: 1, y: 19, w: 4, h: 6, who: 'naos', key: 'l9a' }, { x: 11, y: 3, w: 6, h: 5, who: 'npc', key: 'l9b' }] },
  { gap: 20,
    belts: [{ x: 4, y: 3, w: 3, h: 24, d: [0, 1], s: 70 }, { x: 13, y: 3, w: 3, h: 24, d: [0, -1], s: 70 }],
    hides: [[8,5,4,3,'crowd'],[8,21,4,3,'crowd']],
    terms: [{ x: 2, y: 26, off: 'c1' }],
    cams: [{ x: 10, y: 14, a: [0, 360], r: 108, g: 'c1', spin: true }, { x: 18, y: 27, a: [200, 260], r: 140 }],
    guards: [{ p: [[17,4],[17,17]], s: 62, r: 88 }] },
  { gap: 5, door: { type: 'key', c: 'y' },
    blocks: [[8,12,4,4,'fountain']],
    belts: [{ x: 3, y: 24, w: 15, h: 3, d: [-1, 0], s: 75 }],
    hides: [[2,2,4,3,'crowd'],[14,9,4,3,'crowd'],[2,17,3,2,'crowd']],
    keys: [{ x: 10, y: 25, c: 'y' }],
    cams: [{ x: 18, y: 16, a: [140, 220], r: 150 }],
    guards: [{ p: [[5,9],[13,9],[13,20],[5,20]], s: 66, r: 88, loop: true }] },
  { gap: 22,
    blocks: [[6,2,1,20,'wall'],[13,9,1,20,'wall']],
    belts: [{ x: 2, y: 8, w: 3, h: 13, d: [0, -1], s: 75 }, { x: 8, y: 10, w: 4, h: 15, d: [0, -1], s: 75 }, { x: 15, y: 10, w: 4, h: 11, d: [0, -1], s: 75 }],
    hides: [[1,24,4,3,'crowd'],[15,2,3,2,'crowd'],[9,26,3,2,'crowd']],
    cams: [{ x: 9, y: 3, a: [60, 120], r: 124 }],
    guards: [{ p: [[8,6],[18,6]], s: 64, r: 88 }] },
  { gap: 14,
    belts: [{ x: 3, y: 13, w: 15, h: 3, d: [-1, 0], s: 78 }],
    hides: [[7,11,3,2,'crowd'],[12,16,3,2,'crowd'],[2,2,2,2,'alcove'],[17,26,2,2,'alcove']],
    cams: [{ x: 5, y: 3, a: [40, 110], r: 150 }, { x: 14, y: 3, a: [70, 140], r: 150 }, { x: 10, y: 27, a: [230, 310], r: 140 }],
    guards: [{ p: [[4,20],[16,20]], s: 70, r: 88 }, { p: [[16,8],[4,8]], s: 70, r: 88 }],
    trig: [{ x: 1, y: 20, w: 3, h: 6, who: 'naos', key: 'l9c' }] }
] },
/* ---------- 10. NOYAU TEMPOREL : champs de temps, écho du joueur ---------- */
{ start: [2, 14], det: 0.26, echo: 5, rooms: [
  { gap: 14,
    fields: [{ x: 6, y: 2, w: 4, h: 27, f: 0.5 }, { x: 13, y: 2, w: 3, h: 27, f: 1.7 }],
    hides: [[11,2,2,2,'shadow'],[11,26,2,2,'shadow']],
    guards: [{ p: [[17,4],[17,26]], s: 60, r: 88 }],
    trig: [{ x: 1, y: 11, w: 2, h: 7, who: 'naos', key: 'l10a' }, { x: 4, y: 8, w: 2, h: 13, who: 'naos', key: 'l10b' }] },
  { gap: 6,
    fields: [{ x: 8, y: 2, w: 4, h: 27, f: 0.5 }],
    lasers: [{ x: 5, y: 2, w: 1, h: 27, per: 2.6, duty: 0.5, ph: 0 }, { x: 14, y: 2, w: 1, h: 27, per: 2.6, duty: 0.5, ph: 1.3 }],
    hides: [[2,26,2,2,'shadow'],[17,26,2,2,'shadow'],[12,2,1,2,'shadow']],
    guards: [{ p: [[10,4],[10,26]], s: 62, r: 88 }] },
  { gap: 22, door: { type: 'term', id: 't1' },
    blocks: [[8,12,4,4,'core']],
    fields: [{ x: 2, y: 23, w: 16, h: 3, f: 1.7 }, { x: 13, y: 2, w: 3, h: 6, f: 0.5 }],
    hides: [[2,12,2,3,'shadow'],[16,12,2,2,'shadow'],[2,2,2,2,'shadow']],
    terms: [{ x: 17, y: 4, id: 't1' }],
    cams: [{ x: 18, y: 27, a: [170, 250], r: 130 }],
    guards: [{ p: [[5,9],[14,9],[14,19],[5,19]], s: 72, r: 86, loop: true }] },
  { gap: 10, door: { type: 'key', c: 'r' },
    fields: [{ x: 9, y: 2, w: 4, h: 13, f: 0.5 }],
    lasers: [{ x: 1, y: 16, w: 19, h: 1, per: 2.4, duty: 0.5, ph: 0 }],
    hides: [[2,9,2,2,'shadow'],[17,3,2,2,'shadow'],[17,26,2,2,'shadow'],[10,26,2,2,'shadow']],
    keys: [{ x: 4, y: 4, c: 'r' }],
    guards: [{ p: [[7,4],[7,14]], s: 70, r: 88 }, { p: [[14,14],[14,4]], s: 70, r: 88 }] },
  { gap: 24, door: { type: 'term', id: 'core' }, alarm: 22,
    blocks: [[8,12,4,4,'core']],
    fields: [{ x: 2, y: 9, w: 2, h: 12, f: 1.7 }, { x: 14, y: 22, w: 5, h: 6, f: 0.5 }],
    hides: [[2,2,2,2,'shadow'],[17,2,2,2,'shadow'],[2,26,2,2,'shadow']],
    terms: [{ x: 10, y: 3, id: 'core', say: 'l10d' }],
    cams: [{ x: 10, y: 10, a: [0, 360], r: 96, spin: true }],
    lasers: [{ x: 5, y: 22, w: 9, h: 1, per: 2.4, duty: 0.5, ph: 0 }],
    guards: [{ p: [[5,7],[16,7],[16,20],[5,20]], s: 80, r: 88, loop: true }],
    trig: [{ x: 1, y: 8, w: 3, h: 6, who: 'naos', key: 'l10c' }] }
] }
];

/* Construit la grille et les entités d'un niveau (pur : utilisable hors navigateur pour les tests). */
function buildLevel(idx) {
  var def = LEVELS[idx], n = def.rooms.length, W = RW * n + 1;
  var g = new Uint8Array(W * H), x, y;
  function set(tx, ty, v) { if (tx >= 0 && ty >= 0 && tx < W && ty < H) g[ty * W + tx] = v; }
  function path(q, ox) { return q.p.map(function (p) { return [(ox + p[0]) * T + 8, p[1] * T + 8]; }); }
  for (x = 0; x < W; x++) { set(x, 0, 1); set(x, 1, 1); set(x, H - 1, 1); }
  for (y = 0; y < H; y++) { set(0, y, 1); set(W - 1, y, 1); }
  var L = { idx: idx, W: W, grid: g, blocks: [], hides: [], guards: [], cams: [], lasers: [], drones: [], keys: [], terms: [], doors: [], trigs: [], rads: [], lamps: [], rooms: [], movers: [], belts: [], fields: [], det: def.det, alarm: 0, echo: def.echo || 0 };
  def.rooms.forEach(function (r, ri) {
    var ox = RW * ri, dx = RW * (ri + 1);
    for (y = 2; y < H - 1; y++) set(dx, y, 1);
    for (y = r.gap; y < r.gap + 3; y++) set(dx, y, 0);
    L.rooms.push({ x0: ox, x1: dx, entryY: ri ? def.rooms[ri - 1].gap + 1 : def.start[1] });
    if (r.door) L.doors.push({ x: dx, y: r.gap, h: 3, type: r.door.type, c: r.door.c, id: r.door.id, open: false });
    if (r.alarm) L.alarm = r.alarm;
    (r.blocks || []).forEach(function (b) {
      var kind = b[4], bx, by;
      for (by = b[1]; by < b[1] + b[3]; by++) for (bx = b[0]; bx < b[0] + b[2]; bx++) set(ox + bx, by, kind === 'wall' ? 1 : 2);
      if (kind !== 'wall') L.blocks.push({ x: ox + b[0], y: b[1], w: b[2], h: b[3], kind: kind });
    });
    (r.hides || []).forEach(function (h) { L.hides.push({ x: (ox + h[0]) * T, y: h[1] * T, w: h[2] * T, h: h[3] * T, kind: h[4] }); });
    (r.guards || []).forEach(function (q) { L.guards.push({ pts: path(q, ox), speed: q.s, range: q.r, loop: !!q.loop }); });
    (r.drones || []).forEach(function (q) { L.drones.push({ pts: path(q, ox), speed: q.s, rad: q.r, loop: !!q.loop, hound: false }); });
    (r.hounds || []).forEach(function (q) { L.drones.push({ pts: path(q, ox), speed: q.s, rad: q.r, loop: !!q.loop, hound: true }); });
    (r.cams || []).forEach(function (c) { L.cams.push({ x: (ox + c.x) * T + 8, y: c.y * T + 8, a0: c.a[0], a1: c.a[1], range: c.r, g: c.g || null, spin: !!c.spin }); });
    (r.lasers || []).forEach(function (z) { L.lasers.push({ x: (ox + z.x) * T, y: z.y * T, w: z.w * T, h: z.h * T, per: z.per, duty: z.duty, ph: z.ph || 0, g: z.g || null, zap: false }); });
    (r.zaps || []).forEach(function (z) { L.lasers.push({ x: (ox + z.x) * T, y: z.y * T, w: z.w * T, h: z.h * T, per: z.per, duty: z.duty, ph: z.ph || 0, g: null, zap: true }); });
    (r.movers || []).forEach(function (m) { L.movers.push({ x: (ox + m.x) * T, y: m.y * T, w: m.w * T, h: m.h * T, vert: m.h > m.w, dir: m.d, speed: m.s, n: m.n, len: (m.len || 3) * T }); });
    (r.belts || []).forEach(function (b) { L.belts.push({ x: (ox + b.x) * T, y: b.y * T, w: b.w * T, h: b.h * T, dx: b.d[0], dy: b.d[1], s: b.s }); });
    (r.fields || []).forEach(function (f) { L.fields.push({ x: (ox + f.x) * T, y: f.y * T, w: f.w * T, h: f.h * T, f: f.f }); });
    (r.keys || []).forEach(function (k) { L.keys.push({ x: (ox + k.x) * T + 8, y: k.y * T + 8, c: k.c, got: false }); });
    (r.terms || []).forEach(function (t) { L.terms.push({ x: (ox + t.x) * T + 8, y: t.y * T + 8, tx: ox + t.x, ty: t.y, id: t.id || null, off: t.off || null, say: t.say || null, done: false, prog: 0 }); });
    (r.trig || []).forEach(function (t) { L.trigs.push({ x: (ox + t.x) * T, y: t.y * T, w: t.w * T, h: t.h * T, who: t.who, key: t.key, done: false }); });
    if (r.rad) L.rads.push({ x: (ox + r.rad[0]) * T, y: r.rad[1] * T, w: r.rad[2] * T, h: r.rad[3] * T });
    [[5, 8], [14, 8], [5, 21], [14, 21]].forEach(function (p) { L.lamps.push([(ox + p[0]) * T + 8, p[1] * T + 8]); });
  });
  var last = def.rooms[n - 1];
  for (y = last.gap; y < last.gap + 3; y++) set(W - 1, y, 0);   // sortie : ouverture dans le mur extérieur
  L.exit = { x: W - 1, y: last.gap };
  L.start = [def.start[0] * T + 8, def.start[1] * T + 8];
  return L;
}
/* Rectangles occupés par les wagonnets d'une voie à l'instant t (découpés aux limites de la voie). */
function cartRects(m, t) {
  var out = [], span = m.vert ? m.h : m.w, start = m.vert ? m.y : m.x, total = span + m.len, sp = total / m.n, k, u, a, b;
  for (k = 0; k < m.n; k++) {
    u = (t * m.speed + k * sp) % total;
    a = m.dir > 0 ? start - m.len + u : start + span - u;
    b = Math.min(a + m.len, start + span); a = Math.max(a, start);
    if (b - a > 2) out.push(m.vert ? { x: m.x, y: a, w: m.w, h: b - a } : { x: a, y: m.y, w: b - a, h: m.h });
  }
  return out;
}

if (typeof module !== 'undefined' && module.exports) { module.exports = { LEVELS: LEVELS, buildLevel: buildLevel, cartRects: cartRects, STR: STR, PAL: PAL, T: T, H: H, RW: RW }; }
if (typeof document === 'undefined') return;

/* ======================================================================
   3. INITIALISATION NAVIGATEUR
   ====================================================================== */
var canvas = document.getElementById('game');
var ctx = canvas.getContext('2d');
ctx.imageSmoothingEnabled = false;
var lang = (document.documentElement.lang || 'fr').slice(0, 2); if (!STR[lang]) lang = 'fr';
var S = STR[lang];
var FONT = '"VT323", "Share Tech Mono", monospace';
var isTouch = (window.matchMedia && window.matchMedia('(pointer: coarse)').matches) || ('ontouchstart' in window);
if (isTouch) document.body.classList.add('touch');

function resolveAgent() {
  var p = null;
  try { p = new URLSearchParams(location.search).get('agent'); } catch (e) {}
  if (p) return p;
  try { var ls = localStorage.getItem('er_codename'); if (ls) return ls; } catch (e) {}
  try { var ss = sessionStorage.getItem('er_codename'); if (ss) return ss; } catch (e) {}
  return lang === 'fr' ? 'AGENT_INCONNU' : (lang === 'it' ? 'AGENTE_IGNOTO' : 'UNKNOWN_AGENT');
}
var agent = String(resolveAgent()).toUpperCase().replace(/[^A-Z0-9_\-]/g, '').slice(0, 16) || 'AGENT';

/* ---- Sauvegarde ---- */
var SAVE_KEY = 'exodus_save_v2', SCORE_KEY = 'exodus_scores_v3', MUTE_KEY = 'exodus_mute';
var save = { unlocked: 1, best: {} };
try { var raw = JSON.parse(localStorage.getItem(SAVE_KEY)); if (raw && raw.unlocked) { save.unlocked = Math.max(1, Math.min(NL, raw.unlocked | 0)); save.best = raw.best || {}; } } catch (e) {}
if (save.best[5] && save.unlocked < 6) save.unlocked = 6;        // partie finie avant l'ajout de l'acte II
function persist() { try { localStorage.setItem(SAVE_KEY, JSON.stringify(save)); } catch (e) {} }
function getScores() { try { var s = JSON.parse(localStorage.getItem(SCORE_KEY)); if (Array.isArray(s)) return s; } catch (e) {} return []; }
function pushScore(total) {
  var s = getScores().filter(function (r) { return r && (r.name !== agent || r.time < total); });
  if (!s.some(function (r) { return r.name === agent; })) s.push({ name: agent, time: total });
  s.sort(function (a, b) { return a.time - b.time; });
  try { localStorage.setItem(SCORE_KEY, JSON.stringify(s.slice(0, 8))); } catch (e) {}
}
function totalBest() { var t = 0; for (var i = 1; i <= NL; i++) { if (!save.best[i]) return null; t += save.best[i]; } return t; }

/* ======================================================================
   4. SON : synthèse 8 bits (ondes carrées / pulsées / triangle + bruit)
   ====================================================================== */
var AC = null, master = null, noiseBuf = null, pulseWave = null, loops = {}, lastSfx = {}, muted = false, sfxStats = { tones: 0, noises: 0 };
try { muted = localStorage.getItem(MUTE_KEY) === '1'; } catch (e) {}
function mkLoop(type, f) { var o = AC.createOscillator(), g = AC.createGain(); o.type = type; o.frequency.value = f; g.gain.value = 0; o.connect(g); g.connect(master); o.start(); return { o: o, g: g }; }
function mkNoiseLoop(rate) { var s = AC.createBufferSource(), g = AC.createGain(); s.buffer = noiseBuf; s.loop = true; s.playbackRate.value = rate; g.gain.value = 0; s.connect(g); g.connect(master); s.start(); return { o: s, g: g }; }
function audioInit() {
  if (AC) { if (AC.state === 'suspended') { try { AC.resume(); } catch (e) {} } return; }
  var C = window.AudioContext || window.webkitAudioContext; if (!C) return;
  try {
    AC = new C(); master = AC.createGain(); master.gain.value = muted ? 0 : 0.6; master.connect(AC.destination);
    var n = AC.sampleRate, i, v = 0, d;
    noiseBuf = AC.createBuffer(1, n, n); d = noiseBuf.getChannelData(0);
    for (i = 0; i < n; i++) { if (i % 6 === 0) v = Math.random() * 2 - 1; d[i] = v; }       // bruit « échantillonné-bloqué », grain de console
    var re = new Float32Array(32), im = new Float32Array(32);                                 // onde pulsée à 25 %
    for (i = 1; i < 32; i++) { re[i] = Math.sin(2 * Math.PI * i * 0.25) / (i * Math.PI); im[i] = (1 - Math.cos(2 * Math.PI * i * 0.25)) / (i * Math.PI); }
    pulseWave = AC.createPeriodicWave(re, im);
    loops.siren = mkLoop('square', 620); loops.buzz = mkLoop('sawtooth', 58); loops.ghost = mkLoop('triangle', 196); loops.rumble = mkNoiseLoop(0.3);
  } catch (e) { AC = null; }
}
function setLoop(name, vol, freq) { var l = loops[name]; if (!l) return; l.g.gain.setTargetAtTime(vol, AC.currentTime, 0.05); if (freq && l.o.frequency) l.o.frequency.setValueAtTime(freq, AC.currentTime); }
function tone(type, f0, f1, dur, vol, delay) {
  if (!AC || muted) return;
  var t = AC.currentTime + (delay || 0), o = AC.createOscillator(), g = AC.createGain();
  if (type === 'pulse') o.setPeriodicWave(pulseWave); else o.type = type;
  o.frequency.setValueAtTime(f0, t); if (f1 !== f0) o.frequency.exponentialRampToValueAtTime(Math.max(20, f1), t + dur);
  g.gain.setValueAtTime(vol, t); g.gain.setValueAtTime(vol, t + dur * 0.6); g.gain.linearRampToValueAtTime(0.0001, t + dur);
  o.connect(g); g.connect(master); o.start(t); o.stop(t + dur + 0.03); sfxStats.tones++;
}
function noise(dur, vol, rate, delay) {
  if (!AC || muted) return;
  var t = AC.currentTime + (delay || 0), s = AC.createBufferSource(), g = AC.createGain();
  s.buffer = noiseBuf; s.playbackRate.value = rate || 1;
  g.gain.setValueAtTime(vol, t); g.gain.linearRampToValueAtTime(0.0001, t + dur);
  s.connect(g); g.connect(master); s.start(t, Math.random() * 0.5, dur + 0.03); sfxStats.noises++;
}
function seq(type, notes, step, vol) { notes.forEach(function (f, i) { if (f) tone(type, f, f, step * 0.92, vol, i * step); }); }
function once(name, gapMs) { var now = performance.now(); if (lastSfx[name] && now - lastSfx[name] < gapMs) return false; lastSfx[name] = now; return true; }
var HACK_NOTES = [523, 659, 784, 988, 1175];
var SFX = {
  step: function (k) { var w = pal && pal.stepKind; if (w === 'wet') noise(0.05, 0.05, k ? 1.7 : 1.3); else if (w === 'metal') tone('square', k ? 190 : 150, 90, 0.04, 0.035); else noise(0.035, 0.05, k ? 0.9 : 0.7); },
  move: function () { tone('pulse', 660, 660, 0.04, 0.08); },
  ok: function () { tone('pulse', 880, 880, 0.05, 0.09); tone('pulse', 1320, 1320, 0.09, 0.09, 0.05); },
  back: function () { tone('pulse', 440, 330, 0.08, 0.08); },
  key: function () { tone('pulse', 988, 988, 0.07, 0.1); tone('pulse', 1319, 1319, 0.22, 0.1, 0.07); },
  door: function () { tone('square', 90, 180, 0.22, 0.09, 0.12); noise(0.2, 0.06, 0.4, 0.12); },
  hack: function () { var f = HACK_NOTES[Math.floor(Math.random() * 5)]; tone('pulse', f, f, 0.04, 0.05); },
  hackOk: function () { seq('pulse', [523, 659, 784, 1047, 1319], 0.06, 0.09); },
  spot: function () { tone('square', 1480, 1480, 0.06, 0.09); tone('square', 1480, 1480, 0.06, 0.09, 0.1); },
  caught: function () { tone('square', 880, 110, 0.5, 0.12); noise(0.3, 0.1, 0.5); },
  over: function () { seq('triangle', [392, 349, 311, 262, 196], 0.22, 0.18); },
  clear: function () { seq('pulse', [523, 659, 784, 1047, 784, 1047, 1319], 0.09, 0.1); },
  end: function () { seq('pulse', [523, 523, 523, 659, 784, 659, 784, 1047, 0, 1047, 1319, 1568], 0.12, 0.1); seq('triangle', [131, 0, 131, 0, 196, 0, 196, 0, 0, 262, 262, 262], 0.12, 0.14); },
  laser: function () { tone('sawtooth', 1900, 240, 0.16, 0.05); },
  zap: function () { noise(0.22, 0.07, 2.4); tone('square', 62, 58, 0.22, 0.06); },
  crackle: function () { noise(0.012, 0.05, 3); },
  geiger: function () { noise(0.012, 0.12, 3); },
  hideIn: function () { tone('triangle', 330, 220, 0.09, 0.1); },
  hideOut: function () { tone('triangle', 220, 330, 0.09, 0.08); },
  cp: function () { tone('pulse', 784, 784, 0.05, 0.06); tone('pulse', 1047, 1047, 0.08, 0.06, 0.05); },
  talk: function () { seq('square', [740, 880, 740], 0.045, 0.04); },
  alarm: function () { seq('square', [880, 660, 880, 660], 0.12, 0.12); },
  field: function (fast) { tone('triangle', fast ? 300 : 520, fast ? 900 : 170, 0.25, 0.09); },
  hound: function () { tone('square', 300, 200, 0.05, 0.04); },
  pause: function () { tone('pulse', 660, 660, 0.06, 0.08); tone('pulse', 440, 440, 0.08, 0.08, 0.07); }
};
function setMute(m) {
  muted = m; try { localStorage.setItem(MUTE_KEY, m ? '1' : '0'); } catch (e) {}
  if (master) master.gain.value = m ? 0 : 0.6;
  if (!m) SFX.ok();
}

/* ---- Entrées ---- */
var keys = {}, touchVec = { x: 0, y: 0 }, aHeld = false, pressed = {};
function press(n) { pressed[n] = true; }
window.addEventListener('keydown', function (e) {
  var k = e.key.toLowerCase();
  audioInit();
  if (['arrowup', 'arrowdown', 'arrowleft', 'arrowright', ' '].indexOf(k) >= 0) e.preventDefault();
  if (keys[k]) return; keys[k] = true;
  if (k === 'arrowup' || k === 'z' || k === 'w') press('up');
  if (k === 'arrowdown' || k === 's') press('down');
  if (k === ' ' || k === 'enter' || k === 'e') press('a');
  if (k === 'p' || k === 'escape' || k === 'backspace') press('b');
  if (k === 'f') toggleFullscreen();
  if (k === 'm') setMute(!muted);
});
window.addEventListener('keyup', function (e) { keys[e.key.toLowerCase()] = false; });
window.addEventListener('blur', function () { keys = {}; if (state === 'play') { state = 'pause'; menuIdx = 0; } });

function toggleFullscreen() {
  var d = document, el = d.documentElement;
  try {
    if (d.fullscreenElement || d.webkitFullscreenElement) { (d.exitFullscreen || d.webkitExitFullscreen).call(d); return; }
    var rq = el.requestFullscreen || el.webkitRequestFullscreen;
    if (!rq) return;
    var p = rq.call(el);
    var lock = function () { try { if (screen.orientation && screen.orientation.lock) screen.orientation.lock('landscape').catch(function () {}); } catch (e) {} };
    if (p && p.then) p.then(lock).catch(function () {}); else lock();
  } catch (e) {}
}
var askedFs = false;
function firstGesture() { audioInit(); if (isTouch && !askedFs) { askedFs = true; if (!(document.fullscreenElement || document.webkitFullscreenElement)) toggleFullscreen(); } }

(function touchControls() {
  var pad = document.getElementById('pad'), knob = document.getElementById('pad-knob'), bA = document.getElementById('btn-a'), bB = document.getElementById('btn-b');
  if (!pad) return;
  var padId = null, lastDir = 0;
  function upd(e) {
    var r = pad.getBoundingClientRect(), dx = e.clientX - (r.left + r.width / 2), dy = e.clientY - (r.top + r.height / 2);
    var m = Math.hypot(dx, dy), max = r.width / 2;
    if (m < max * 0.2) { touchVec.x = 0; touchVec.y = 0; }
    else { touchVec.x = dx / m; touchVec.y = dy / m; var d = Math.abs(dy) > Math.abs(dx) ? (dy < 0 ? 1 : 2) : 0; if (d && d !== lastDir) press(d === 1 ? 'up' : 'down'); lastDir = d; }
    var k = Math.min(m, max * 0.55) / (m || 1);
    knob.style.transform = 'translate(' + (dx * k) + 'px,' + (dy * k) + 'px)';
  }
  function end() { padId = null; lastDir = 0; touchVec.x = 0; touchVec.y = 0; knob.style.transform = ''; }
  pad.addEventListener('pointerdown', function (e) { e.preventDefault(); padId = e.pointerId; try { pad.setPointerCapture(padId); } catch (x) {} upd(e); firstGesture(); });
  pad.addEventListener('pointermove', function (e) { if (e.pointerId === padId) upd(e); });
  pad.addEventListener('pointerup', end); pad.addEventListener('pointercancel', end);
  bA.addEventListener('pointerdown', function (e) { e.preventDefault(); aHeld = true; press('a'); bA.classList.add('on'); firstGesture(); });
  ['pointerup', 'pointercancel', 'pointerleave'].forEach(function (ev) { bA.addEventListener(ev, function () { aHeld = false; bA.classList.remove('on'); }); });
  bB.addEventListener('pointerdown', function (e) { e.preventDefault(); firstGesture(); press('b'); });
  canvas.addEventListener('pointerdown', function (e) {           // toucher l'écran = A, ou choix direct dans un menu
    firstGesture();
    if (menuRects.length) {
      var r = canvas.getBoundingClientRect(), mx = (e.clientX - r.left) * VW / r.width, my = (e.clientY - r.top) * VH / r.height;
      for (var i = 0; i < menuRects.length; i++) { var q = menuRects[i]; if (mx >= q.x && mx <= q.x + q.w && my >= q.y && my <= q.y + q.h) { menuIdx = q.i; press('a'); return; } }
    }
    if (state !== 'play') press('a');
  });
})();

/* ======================================================================
   5. ÉTAT DU JEU
   ====================================================================== */
var state = 'title', menuIdx = 0, menuRects = [];
var L = null, P = null, pal = null, bg = null, lightCv = document.createElement('canvas'); lightCv.width = VW; lightCv.height = VH;
var lctx = lightCv.getContext('2d');
var camX = 0, time = 0, clock = 0, levelTime = 0, lives = 3, keysOwned = {}, disabled = {}, respawn = null, grace = 0;
var suit = 1, alarmT = -1, flash = 0, msg = null, bubbles = [], curBubble = null, stateT = 0, newBest = false, lastLevelTime = 0;
var rain = [], sparks = [], hist = [], gi = 0, ghost = null, wasHidden = false, curF = 1, hackT = 0, nearDrone = 9999, nearCart = 9999, onBelt = false;

function tileAt(tx, ty) { if (tx < 0 || ty < 0 || tx >= L.W || ty >= H) return 1; return L.grid[ty * L.W + tx]; }
function doorAt(tx, ty) { for (var i = 0; i < L.doors.length; i++) { var d = L.doors[i]; if (!d.open && tx === d.x && ty >= d.y && ty < d.y + d.h) return d; } return null; }
function solid(tx, ty) { return tileAt(tx, ty) !== 0 || !!doorAt(tx, ty); }
function solidPx(x, y) { return solid(Math.floor(x / T), Math.floor(y / T)); }
function los(x0, y0, x1, y1) {
  var d = Math.hypot(x1 - x0, y1 - y0), n = Math.ceil(d / 4), i;
  for (i = 1; i < n; i++) { if (solidPx(x0 + (x1 - x0) * i / n, y0 + (y1 - y0) * i / n)) return false; }
  return true;
}
function inRect(px, py, r) { return px >= r.x && px < r.x + r.w && py >= r.y && py < r.y + r.h; }
function isHidden() { for (var i = 0; i < L.hides.length; i++) if (inRect(P.x, P.y, L.hides[i])) return true; return false; }
function onScreen(r) { return r.x + r.w > camX && r.x < camX + VW; }
/* Sur écran tactile, la croix et le bouton B recouvrent les bords du canvas : on laisse la caméra
   déborder d'autant, pour que ni le joueur ni la sortie ne se retrouvent sous les commandes. */
var padL = 0, padR = 0;
function measurePads() {
  padL = 0; padR = 0; if (!isTouch) return;
  var cr = canvas.getBoundingClientRect(), pd = document.getElementById('pad'), bb = document.getElementById('btn-b');
  if (!cr.width || !pd || !bb) return;
  var k = VW / cr.width, pr = pd.getBoundingClientRect(), br = bb.getBoundingClientRect();
  if (pr.width) padL = Math.min(200, Math.max(0, Math.round((pr.right - cr.left) * k) + 6));
  if (br.width) padR = Math.min(200, Math.max(0, Math.round((cr.right - br.left) * k) + 6));
}
window.addEventListener('resize', measurePads);
function setCam() { camX = Math.max(-padL, Math.min(L.W * T - VW + padR, Math.round(P.x - VW / 2))); }

function startLevel(i) {
  L = buildLevel(i); pal = PAL[i];
  L.guards.forEach(function (g) { g.x = g.pts[0][0]; g.y = g.pts[0][1]; g.i = 1; g.dir = 1; g.wait = 0; g.ang = Math.atan2(g.pts[1][1] - g.y, g.pts[1][0] - g.x); g.see = 0; g.step = Math.random() * 6; });
  L.drones.forEach(function (g) { g.x = g.pts[0][0]; g.y = g.pts[0][1]; g.i = 1; g.dir = 1; g.see = 0; g.tAng = 0; });
  L.cams.forEach(function (c) { c.t = Math.random() * 6; c.ang = 0; c.see = 0; });
  L.crowd = [];
  var cols = pal.crowd || ['#e0792b'];
  L.hides.forEach(function (h) { if (h.kind === 'crowd') { var n = Math.round(h.w * h.h / 260); for (var k = 0; k < n; k++) L.crowd.push({ x: h.x + 8 + Math.random() * (h.w - 16), y: h.y + 10 + Math.random() * (h.h - 12), ph: Math.random() * 6, hair: ['#3a2a1a', '#1a1a1a', '#6a4a2a', '#8a6a3a'][k % 4], col: cols[k % cols.length] }); } });
  P = { x: L.start[0], y: L.start[1], dir: 1, step: 0, si: 0, moving: false };
  respawn = [P.x, P.y]; keysOwned = {}; disabled = {}; lives = 3; levelTime = 0; clock = 0; grace = 1.2; suit = 1; alarmT = -1; flash = 0; msg = null; bubbles = []; curBubble = null;
  hist = []; gi = 0; ghost = null; wasHidden = false; curF = 1; hackT = 0; nearDrone = 9999; nearCart = 9999; onBelt = false;
  measurePads(); setCam(); renderBackground(); state = 'intro'; stateT = 0; newBest = false;
  rain = []; for (var r = 0; r < 90; r++) rain.push([Math.random() * VW, Math.random() * VH, 6 + Math.random() * 8]);
  sparks = []; for (var s = 0; s < 40; s++) sparks.push([Math.random() * 6.28, 10 + Math.random() * 60, Math.random() * 6.28, 0.4 + Math.random()]);
  document.body.classList.add('playing'); SFX.ok();
}
function say(who, key, x, y) { bubbles.push({ who: who, text: S[key] || key, x: x, y: y }); }
function loseLife() {
  if (grace > 0 || state !== 'play') return;
  lives--; flash = 1; state = lives <= 0 ? 'over' : 'caught'; stateT = 0;
  SFX.caught(); if (lives <= 0) setTimeout(SFX.over, 450);
}
function doRespawn() {
  P.x = respawn[0]; P.y = respawn[1]; grace = 1.6; suit = 1; setCam();
  L.guards.forEach(function (g) { g.see = 0; }); L.cams.forEach(function (c) { c.see = 0; }); L.drones.forEach(function (d) { d.see = 0; });
  if (alarmT >= 0) alarmT = L.alarm;
  hist = []; gi = 0; ghost = null; wasHidden = false; curF = 1;
  state = 'play';
}
function finishLevel() {
  var n = L.idx + 1, t = Math.round(levelTime * 10) / 10;
  lastLevelTime = t; newBest = !save.best[n] || t < save.best[n];
  if (newBest) save.best[n] = t;
  if (n < NL) save.unlocked = Math.max(save.unlocked, n + 1);
  persist();
  var tot = totalBest(); if (n === NL && tot) pushScore(Math.round(tot * 10) / 10);
  state = n === NL ? 'end' : 'clear'; stateT = 0;
  if (n === NL) SFX.end(); else SFX.clear();
}

/* ======================================================================
   6. MISE À JOUR
   ====================================================================== */
function movePath(o, dt) {
  if (o.wait > 0) { o.wait -= dt; return false; }
  var t = o.pts[o.i], dx = t[0] - o.x, dy = t[1] - o.y, d = Math.hypot(dx, dy), st = o.speed * dt;
  if (d <= st) {
    o.x = t[0]; o.y = t[1]; o.wait = o.rad ? 0 : 0.45;
    if (o.loop) o.i = (o.i + 1) % o.pts.length;
    else { if (o.i + o.dir < 0 || o.i + o.dir >= o.pts.length) o.dir = -o.dir; o.i += o.dir; }
    return false;
  }
  o.x += dx / d * st; o.y += dy / d * st; o.tAng = Math.atan2(dy, dx); return true;
}
function angDiff(a, b) { var d = a - b; while (d > Math.PI) d -= 2 * Math.PI; while (d < -Math.PI) d += 2 * Math.PI; return d; }
function seesPlayer(x, y, ang, half, range) {
  var dx = P.x - x, dy = (P.y - 6) - y, d = Math.hypot(dx, dy);
  if (d > range) return false;
  if (Math.abs(angDiff(Math.atan2(dy, dx), ang)) > half) return false;
  return los(x, y, P.x, P.y - 6);
}
function camAngle(c) {
  if (c.spin) return (c.t * 0.9) % (2 * Math.PI);
  var a0 = c.a0 * Math.PI / 180, a1 = c.a1 * Math.PI / 180;
  return a0 + (a1 - a0) * (0.5 + 0.5 * Math.sin(c.t * 0.8));
}
function laserPhase(z) { return (clock * (alarmT >= 0 ? 1.5 : 1) + z.ph) % z.per; }
function laserOff(z) { return !!(z.g && disabled[z.g]); }
function laserOn(z) { return !laserOff(z) && laserPhase(z) < z.per * z.duty; }
function laserSoon(z) { return !laserOff(z) && !laserOn(z) && laserPhase(z) > z.per - 0.5; }
function hitRect(z) { var ix = z.zap ? 2 : (z.w > T ? 0 : 5), iy = z.zap ? 2 : (z.h > T ? 0 : 5); return P.x + 4 > z.x + ix && P.x - 4 < z.x + z.w - ix && P.y + 3 > z.y + iy && P.y - 3 < z.y + z.h - iy; }
function watch(o, seen, dt) {
  o.see = seen ? o.see + dt / L.det : Math.max(0, o.see - dt * 1.2);
  if (o.see > 0.04 && !o.alert) { o.alert = true; if (once('spot', 450)) SFX.spot(); }
  if (o.see <= 0) o.alert = false;
  if (o.see >= 1) loseLife();
}
function openDoors(test) { var any = false; L.doors.forEach(function (d) { if (!d.open && test(d)) { d.open = true; any = true; } }); if (any) SFX.door(); }

function update(dt) {
  var n;
  time += dt; stateT += dt;
  if (flash > 0) flash = Math.max(0, flash - dt * 2.5);
  if (state === 'intro') { if (stateT > 0.5 && pressed.a) { state = 'play'; SFX.ok(); } return; }
  if (state === 'caught') { if (stateT > 1.1) doRespawn(); return; }
  if (state === 'over') { if (stateT > 0.8 && pressed.a) startLevel(L.idx); else if (pressed.b) goTitle(); return; }
  if (state === 'clear') { if (stateT > 0.6 && pressed.a) startLevel(L.idx + 1); else if (pressed.b) goTitle(); return; }
  if (state === 'end') { if (stateT > 1 && (pressed.a || pressed.b)) goTitle(); return; }
  if (state === 'pause') {
    n = 4;
    if (pressed.up) { menuIdx = (menuIdx + n - 1) % n; SFX.move(); }
    if (pressed.down) { menuIdx = (menuIdx + 1) % n; SFX.move(); }
    if (pressed.b) { state = 'play'; SFX.back(); }
    else if (pressed.a) { if (menuIdx === 0) { state = 'play'; SFX.ok(); } else if (menuIdx === 1) startLevel(L.idx); else if (menuIdx === 2) setMute(!muted); else goTitle(); }
    return;
  }
  if (state !== 'play') { updateMenus(); return; }
  if (pressed.b) { state = 'pause'; menuIdx = 0; SFX.pause(); return; }

  levelTime += dt; clock += dt; if (grace > 0) grace -= dt;
  /* Joueur : direction, champs de temps, tapis roulants */
  var mx = 0, my = 0;
  if (keys.arrowleft || keys.q || keys.a) mx -= 1;
  if (keys.arrowright || keys.d) mx += 1;
  if (keys.arrowup || keys.z || keys.w) my -= 1;
  if (keys.arrowdown || keys.s) my += 1;
  mx += touchVec.x; my += touchVec.y;
  var m = Math.hypot(mx, my); if (m > 1) { mx /= m; my /= m; }
  P.moving = m > 0.15;
  var fNow = 1; L.fields.forEach(function (q) { if (inRect(P.x, P.y, q)) fNow = q.f; });
  if (fNow !== curF) { if (fNow !== 1) SFX.field(fNow > 1); curF = fNow; }
  var vx = P.moving ? mx * 108 * fNow : 0, vy = P.moving ? my * 108 * fNow : 0, hw = 5;
  onBelt = false;
  L.belts.forEach(function (b) { if (inRect(P.x, P.y, b)) { vx += b.dx * b.s; vy += b.dy * b.s; onBelt = true; } });
  if (vx || vy) {
    var nx = P.x + vx * dt, ny = P.y + vy * dt;
    if (!(solidPx(nx - hw, P.y - 4) || solidPx(nx + hw, P.y - 4) || solidPx(nx - hw, P.y + 4) || solidPx(nx + hw, P.y + 4))) P.x = nx;
    if (!(solidPx(P.x - hw, ny - 4) || solidPx(P.x + hw, ny - 4) || solidPx(P.x - hw, ny + 4) || solidPx(P.x + hw, ny + 4))) P.y = ny;
  }
  if (P.moving) {
    P.dir = Math.abs(mx) > Math.abs(my) ? (mx > 0 ? 0 : 2) : (my > 0 ? 1 : 3);
    P.step += dt * 9 * (fNow < 1 ? 0.6 : (fNow > 1 ? 1.4 : 1));
    var si = Math.floor(P.step / 2); if (si !== P.si) { P.si = si; SFX.step(si % 2); }
  }
  if (Math.floor(P.x / T) >= L.W - 1) { finishLevel(); return; }
  /* Écho temporel : une copie du joueur rejoue sa trajectoire avec L.echo secondes de retard */
  if (L.echo) {
    if (P.moving || hist.length) hist.push({ t: levelTime, x: P.x, y: P.y, d: P.dir, s: P.step, m: P.moving });
    while (gi < hist.length - 1 && hist[gi + 1].t <= levelTime - L.echo) gi++;
    ghost = (hist.length && hist[gi].t <= levelTime - L.echo) ? hist[gi] : null;
    if (gi > 900) { hist.splice(0, gi); gi = 0; }
    if (ghost && Math.hypot(P.x - ghost.x, P.y - ghost.y) < 9) loseLife();
  }
  /* Point de reprise : entrée de chaque pièce */
  L.rooms.forEach(function (r, i) { if (i && !r.seen && P.x > (r.x0 + 1) * T + 4) { r.seen = true; respawn = [(r.x0 + 1) * T + 10, r.entryY * T + 8]; SFX.cp(); } });
  /* Cartes, portes, terminaux */
  L.keys.forEach(function (k) { if (!k.got && Math.hypot(P.x - k.x, P.y - k.y) < 13) { k.got = true; keysOwned[k.c] = true; SFX.key(); openDoors(function (d) { return d.type === 'key' && d.c === k.c; }); } });
  msg = null;
  L.doors.forEach(function (d) { if (!d.open && Math.abs(P.x - (d.x * T + 8)) < 26 && P.y > d.y * T - 8 && P.y < (d.y + d.h) * T + 8) msg = d.type === 'key' ? S.needKey : S.needTerm; });
  var acting = aHeld || keys[' '] || keys.e || keys.enter;
  L.terms.forEach(function (t) {
    if (t.done) return;
    if (Math.hypot(P.x - t.x, P.y - t.y) < 24 && acting) {
      t.prog += dt / 1.2; hackT += dt; if (hackT > 0.07) { hackT = 0; SFX.hack(); }
      if (t.prog >= 1) {
        t.done = true; SFX.hackOk();
        if (t.id) openDoors(function (d) { return d.type === 'term' && d.id === t.id; });
        if (t.off) disabled[t.off] = true;
        if (t.say) say('naos', t.say);
        if (t.id === 'core' && L.alarm) { alarmT = L.alarm; setTimeout(SFX.alarm, 350); }
      }
    } else t.prog = Math.max(0, t.prog - dt * 1.5);
  });
  /* Bulles */
  L.trigs.forEach(function (t) { if (!t.done && inRect(P.x, P.y, t)) { t.done = true; say(t.who, t.key, t.x + t.w / 2, t.y); } });
  if (!curBubble && bubbles.length) { curBubble = bubbles.shift(); curBubble.t = 2.2 + curBubble.text.length * 0.045; SFX.talk(); }
  if (curBubble) { curBubble.t -= dt; if (curBubble.t <= 0) curBubble = null; }

  var hidden = isHidden(), seen;
  if (hidden !== wasHidden) { if (hidden) SFX.hideIn(); else SFX.hideOut(); wasHidden = hidden; }
  /* Gardes, caméras, drones et traqueurs */
  L.guards.forEach(function (g) {
    g.moving = movePath(g, dt); if (g.moving) g.step += dt * 7;
    if (g.tAng !== undefined) g.ang += angDiff(g.tAng, g.ang) * Math.min(1, dt * 7);
    seen = !hidden && seesPlayer(g.x, g.y - 8, g.ang, 0.62, g.range);
    if (!hidden && Math.hypot(P.x - g.x, P.y - g.y) < 13) { seen = true; g.see = 1; }
    watch(g, seen, dt);
  });
  L.cams.forEach(function (c) {
    c.t += dt; c.ang = camAngle(c);
    if (c.g && disabled[c.g]) { c.see = 0; return; }
    watch(c, !hidden && seesPlayer(c.x, c.y, c.ang, 0.42, c.range), dt);
  });
  nearDrone = 9999;
  L.drones.forEach(function (d) {
    movePath(d, dt);
    var dist = Math.hypot(P.x - d.x, P.y - d.y);
    if (d.hound) { if (dist < 100 && once('hound', 420)) SFX.hound(); } else if (dist < nearDrone) nearDrone = dist;
    watch(d, !hidden && dist < d.rad, dt);
  });
  /* Lasers et sol électrifié */
  L.lasers.forEach(function (z) {
    var on = laserOn(z), vis = onScreen(z);
    if (on && !z.was && vis && once(z.zap ? 'zap' : 'laser', 140)) { if (z.zap) SFX.zap(); else SFX.laser(); }
    if (z.zap && vis && laserSoon(z) && Math.random() < dt * 16) SFX.crackle();
    z.was = on;
    if (on && hitRect(z)) loseLife();
  });
  /* Wagonnets */
  nearCart = 9999;
  L.movers.forEach(function (mv) {
    if (!onScreen(mv)) return;
    cartRects(mv, clock).forEach(function (r) {
      var cx = Math.max(r.x, Math.min(P.x, r.x + r.w)), cy = Math.max(r.y, Math.min(P.y, r.y + r.h)), d = Math.hypot(P.x - cx, P.y - cy);
      if (d < nearCart) nearCart = d;
      if (P.x + 4 > r.x + 2 && P.x - 4 < r.x + r.w - 2 && P.y + 3 > r.y + 2 && P.y - 6 < r.y + r.h - 2) loseLife();
    });
  });
  /* Radiation et alarme */
  var inRad = false; L.rads.forEach(function (r) { if (inRect(P.x, P.y, r)) inRad = true; });
  suit = inRad ? suit - dt / 9 : Math.min(1, suit + dt / 3);
  if (inRad && Math.random() < dt * (6 + 22 * (1 - suit))) SFX.geiger();
  if (suit <= 0) { suit = 0; loseLife(); }
  L.inRad = inRad;
  if (alarmT >= 0) { alarmT -= dt; if (alarmT <= 0) { alarmT = 0; loseLife(); } }
  setCam();
}
/* Sons continus : sirène, bourdonnement des drones, roulement des wagonnets, écho */
function clamp01(v) { return Math.max(0, Math.min(1, v)); }
function audioFrame() {
  if (!AC) return;
  var play = state === 'play' && !muted && !!L;
  setLoop('siren', play && alarmT >= 0 ? 0.07 : 0, (Math.floor(time * 2.6) % 2) ? 830 : 620);
  setLoop('buzz', play ? clamp01(1 - nearDrone / 230) * 0.05 : 0, 58 + Math.sin(time * 11) * 5);
  setLoop('rumble', play ? Math.max(clamp01(1 - nearCart / 210) * 0.2, onBelt ? 0.03 : 0) : 0);
  setLoop('ghost', play && ghost ? clamp01(1 - Math.hypot(P.x - ghost.x, P.y - ghost.y) / 170) * 0.08 : 0, 196 + Math.sin(time * 9) * 9);
}

/* ---- Menus ---- */
var titleItems = [];
function goTitle() { state = 'title'; menuIdx = 0; document.body.classList.remove('playing'); L = null; ghost = null; SFX.back(); }
function soundLabel() { return S.sound + ' : ' + (muted ? S.off : S.on); }
function buildTitle() {
  titleItems = [];
  if (save.unlocked > 1 || save.best[1]) titleItems.push({ k: 'cont', label: S.cont + '  (' + S.level + ' ' + save.unlocked + ')' });
  titleItems.push({ k: 'neu', label: S.neu }, { k: 'levels', label: S.levels }, { k: 'scores', label: S.scores }, { k: 'sound', label: soundLabel() }, { k: 'quit', label: S.quit });
}
function updateMenus() {
  var n;
  if (state === 'title') {
    buildTitle(); n = titleItems.length; if (menuIdx >= n) menuIdx = 0;
    if (pressed.up) { menuIdx = (menuIdx + n - 1) % n; SFX.move(); }
    if (pressed.down) { menuIdx = (menuIdx + 1) % n; SFX.move(); }
    if (pressed.a) {
      var k = titleItems[menuIdx].k;
      if (k === 'cont') startLevel(save.unlocked - 1);
      else if (k === 'neu') startLevel(0);
      else if (k === 'levels') { state = 'levels'; menuIdx = save.unlocked - 1; SFX.ok(); }
      else if (k === 'scores') { state = 'scores'; SFX.ok(); }
      else if (k === 'sound') setMute(!muted);
      else if (k === 'quit') { location.href = 'echo-rouge-v2.html'; }
    }
  } else if (state === 'levels') {
    if (pressed.up) { menuIdx = (menuIdx + NL - 1) % NL; SFX.move(); }
    if (pressed.down) { menuIdx = (menuIdx + 1) % NL; SFX.move(); }
    if (pressed.b) { state = 'title'; menuIdx = 0; SFX.back(); }
    else if (pressed.a) { if (menuIdx < save.unlocked) startLevel(menuIdx); else SFX.back(); }
  } else if (state === 'scores') { if (pressed.a || pressed.b) { state = 'title'; menuIdx = 0; SFX.back(); } }
}

/* ======================================================================
   7. RENDU
   ====================================================================== */
function rnd(seed) { var x = Math.sin(seed * 127.1) * 43758.5453; return x - Math.floor(x); }
function px(c, x, y, w, h, col) { c.fillStyle = col; c.fillRect(Math.round(x), Math.round(y), w, h); }

var KEYCOL = { r: '#e23b3b', b: '#3b8fe2', y: '#f2c230' };
var BLOCK_COL = { bed: ['#7d8794', '#4a525e'], table: ['#9a6e42', '#5c3e22'], counter: ['#a9b3bb', '#5c666e'], crate: ['#8a6a3c', '#4e3a1e'], rack: ['#20253f', '#0c0e20'], ac: ['#5a6878', '#2a3440'], console: ['#f2f5f7', '#a3b0ba'], pillar: ['#eef2f5', '#9eabb6'], core: ['#1a1d40', '#0a0b22'],
  pod: ['#e6ebef', '#8e9aa5'], wreck: ['#6a4a32', '#3a2618'], gen: ['#2f4a3e', '#12201a'], planter: ['#f1eee4', '#b9b4a4'], fountain: ['#cfd8dc', '#8fa0a8'] };
function drawBlock(c, b) {
  var x = b.x * T, y = b.y * T, w = b.w * T, h = b.h * T, i, j, K = BLOCK_COL[b.kind] || ['#777', '#444'];
  px(c, x, y, w, h, K[0]); px(c, x, y + h - 5, w, 5, K[1]); px(c, x, y, w, 1, 'rgba(255,255,255,0.18)');
  if (b.kind === 'bed') { px(c, x + 2, y + 2, w - 4, 8, '#d8dde2'); px(c, x + 2, y + 12, w - 4, h - 19, '#c8742c'); }
  if (b.kind === 'table') { for (i = 0; i < b.w; i++) { px(c, x + i * T + 4, y + 4, 6, 4, '#d9d2c2'); px(c, x + i * T + 5, y + h - 14, 5, 4, '#c9c2b2'); } }
  if (b.kind === 'counter') { for (j = 0; j < b.h; j += 2) px(c, x + 4, y + j * T + 5, 8, 6, j % 4 ? '#3c444c' : '#d0d6da'); }
  if (b.kind === 'crate') { c.strokeStyle = '#4e3a1e'; c.lineWidth = 1; for (i = 0; i < b.w; i++) for (j = 0; j < b.h; j++) c.strokeRect(x + i * T + 1.5, y + j * T + 1.5, T - 3, T - 3); }
  if (b.kind === 'ac') { for (i = 0; i < b.w; i++) { c.fillStyle = '#1c242c'; c.beginPath(); c.arc(x + i * T + 8, y + 8, 5, 0, 6.3); c.fill(); px(c, x + i * T + 7, y + 4, 2, 8, '#6f8296'); } }
  if (b.kind === 'console' || b.kind === 'pillar') { px(c, x + 3, y + 3, w - 6, 4, b.kind === 'console' ? '#e3be68' : '#dfe6ec'); }
  if (b.kind === 'pod') { px(c, x + 4, y + 4, w - 8, h - 14, '#f7f9fa'); px(c, x + 4, y + h - 12, w - 8, 3, '#c9a24b'); px(c, x + w / 2 - 6, y + 8, 12, 8, '#16202c'); for (i = 0; i < 9; i++) px(c, x + rnd(i * 3 + b.x) * (w - 6), y + rnd(i * 7 + b.y) * (h - 8), 4, 3, 'rgba(30,20,10,0.45)'); }
  if (b.kind === 'wreck') { for (i = 0; i < b.w * b.h * 3; i++) px(c, x + rnd(i * 5 + b.x * 3) * (w - 8), y + rnd(i * 9 + b.y) * (h - 7), 3 + rnd(i) * 5, 2, rnd(i * 2 + b.x) > 0.5 ? '#8a5a30' : '#3a2a1e'); }
  if (b.kind === 'gen') { px(c, x + 3, y + 3, w - 6, h - 11, '#253a31'); for (j = 0; j < b.h; j++) for (i = 0; i < b.w; i++) { px(c, x + i * T + 6, y + j * T + 4, 4, 2, '#ffd23a'); px(c, x + i * T + 7, y + j * T + 6, 2, 3, '#ffd23a'); } px(c, x + w - 5, y + 3, 2, 2, '#59ffa0'); }
  if (b.kind === 'planter') { for (i = 0; i < b.w * b.h * 4; i++) px(c, x + 2 + rnd(i * 3 + b.x) * (w - 9), y + 1 + rnd(i * 5 + b.y) * Math.max(1, h - 10), 5, 4, rnd(i + b.x) > 0.5 ? '#4f9a54' : '#3a7a44'); }
  if (b.kind === 'fountain') { px(c, x + 4, y + 4, w - 8, h - 12, '#4aa8d8'); for (i = 0; i < 12; i++) px(c, x + 6 + rnd(i * 3) * (w - 16), y + 6 + rnd(i * 7) * (h - 18), 4, 1, '#bfe8fb'); px(c, x + w / 2 - 3, y + h / 2 - 6, 6, 6, '#eef6fa'); }
}
function drawRackLeds(c) {
  var i, bx, by, b;
  for (i = 0; i < L.blocks.length; i++) {
    b = L.blocks[i]; if (b.kind !== 'rack') continue;
    if (b.x * T - camX > VW || (b.x + b.w) * T - camX < 0) continue;
    for (by = 0; by < b.h * 4 - 2; by++) for (bx = 0; bx < b.w * 2; bx++) {
      var r = rnd(b.x * 31 + b.y * 17 + bx * 7 + by * 13 + Math.floor(time * 3 + bx + by * 0.7) * 0.37);
      if (r > 0.55) px(c, b.x * T - camX + 3 + bx * 7, b.y * T + 3 + by * 4, 3, 1, r > 0.9 ? '#ff4d5e' : (r > 0.72 ? '#e3be68' : '#6a8cff'));
    }
  }
}
function renderBackground() {
  bg = document.createElement('canvas'); bg.width = L.W * T; bg.height = VH;
  var c = bg.getContext('2d'), x, y, t, i, bh;
  for (y = 0; y < H; y++) for (x = 0; x < L.W; x++) {
    t = L.grid[y * L.W + x];
    if (t === 1) {
      px(c, x * T, y * T, T, T, pal.wallTop);
      if (pal.brick) { px(c, x * T, y * T + 7, T, 1, pal.wallFront); px(c, x * T + ((y % 2) ? 4 : 11), y * T, 1, 7, pal.wallFront); px(c, x * T + ((y % 2) ? 11 : 4), y * T + 8, 1, 8, pal.wallFront); }
      if (tileAt(x, y - 1) !== 1) px(c, x * T, y * T, T, 2, pal.wallHi);
      if (y < H - 1 && tileAt(x, y + 1) !== 1) px(c, x * T, y * T + 9, T, 7, pal.wallFront);
    } else {
      px(c, x * T, y * T, T, T, rnd(x * 3.1 + y * 7.7) > 0.5 ? pal.floor : pal.floor2);
      px(c, x * T + 15, y * T, 1, T, pal.line); px(c, x * T, y * T + 15, T, 1, pal.line);
      if (rnd(x * 9.3 + y * 1.9) > 0.9) px(c, x * T + 3 + rnd(x + y) * 8, y * T + 4 + rnd(x * y) * 8, 2, 1, pal.line);
      if (pal.rain && rnd(x * 5.1 + y * 2.3) > 0.93) { c.fillStyle = pal.top === 'ruin' ? 'rgba(160,170,150,0.10)' : (rnd(x + y * 3) > 0.5 ? 'rgba(57,213,255,0.13)' : 'rgba(210,70,255,0.12)'); c.fillRect(x * T - 6, y * T + 4, 28, 7); }
      if (y > 1 && tileAt(x, y - 1) === 1) px(c, x * T, y * T, T, 4, 'rgba(0,0,0,0.22)');
    }
  }
  /* Bandeau haut : ville, ruines, tours de verre ou baie sur la Terre */
  if (pal.top === 'city') {
    px(c, 0, 0, bg.width, 30, '#070b14');
    for (i = 0; i < bg.width / 22; i++) { bh = 8 + rnd(i * 3.3) * 20; px(c, i * 22, 30 - bh, 18, bh, '#0f1826'); for (y = 30 - bh + 2; y < 28; y += 4) for (x = 2; x < 16; x += 4) if (rnd(i * 7 + x + y * 3) > 0.6) px(c, i * 22 + x, y, 2, 2, rnd(i + x * y) > 0.8 ? '#ff4fd8' : '#39d5ff'); }
  }
  if (pal.top === 'ruin') {
    px(c, 0, 0, bg.width, 30, '#0b0d0c');
    for (i = 0; i < bg.width / 26; i++) { bh = 6 + rnd(i * 2.7) * 20; px(c, i * 26, 30 - bh, 22, bh, '#191c18'); px(c, i * 26 + rnd(i) * 14, 30 - bh - 4, 5, 4, '#191c18'); if (rnd(i * 4.4) > 0.7) { px(c, i * 26 + 8, 26, 4, 3, '#ff8a2a'); px(c, i * 26 + 9, 24, 2, 2, '#ffd23a'); } }
  }
  if (pal.top === 'glass') {
    var sky = c.createLinearGradient(0, 0, 0, 30); sky.addColorStop(0, '#9fd6ee'); sky.addColorStop(1, '#eef8fb'); c.fillStyle = sky; c.fillRect(0, 0, bg.width, 30);
    for (i = 0; i < bg.width / 30; i++) { bh = 10 + rnd(i * 3.9) * 18; px(c, i * 30 + 3, 30 - bh, 20, bh, rnd(i) > 0.5 ? '#f6fbfc' : '#bfe6ec'); for (y = 30 - bh + 3; y < 28; y += 5) px(c, i * 30 + 6, y, 14, 1, '#c9a24b'); }
  }
  if (pal.top === 'space') {
    for (i = 0; i < L.W / RW; i++) {
      var wx = i * RW * T + 48, ww = RW * T - 96; px(c, wx - 3, 2, ww + 6, 27, '#aebac4'); px(c, wx, 4, ww, 23, '#02040c');
      for (x = 0; x < 30; x++) px(c, wx + rnd(i * 11 + x) * ww, 5 + rnd(i * 5 + x * 3) * 12, 1, 1, '#ffffff');
      var gr = c.createRadialGradient(wx + ww / 2, 120, 80, wx + ww / 2, 120, 104); gr.addColorStop(0, '#2a6fb0'); gr.addColorStop(0.75, '#5aa2dc'); gr.addColorStop(1, 'rgba(120,190,255,0)');
      c.save(); c.beginPath(); c.rect(wx, 4, ww, 23); c.clip(); c.fillStyle = gr; c.fillRect(wx, 4, ww, 23);
      for (x = 0; x < 9; x++) px(c, wx + rnd(i * 3 + x * 2) * ww, 20 + rnd(x * 5 + i) * 6, 14 + rnd(x) * 20, 2, 'rgba(255,255,255,0.5)'); c.restore();
    }
  }
  /* Voies des wagonnets : ballast, traverses, rails, bouches de tunnel */
  L.movers.forEach(function (m) {
    px(c, m.x, m.y, m.w, m.h, '#201c1a');
    if (m.vert) {
      for (y = m.y + 3; y < m.y + m.h; y += 8) px(c, m.x + 3, y, m.w - 6, 2, '#4a3a2a');
      px(c, m.x + 7, m.y, 2, m.h, '#98a2aa'); px(c, m.x + m.w - 9, m.y, 2, m.h, '#98a2aa');
      for (y = m.y; y < m.y + m.h - 6; y += 12) { px(c, m.x, y, 2, 6, '#ffd23a'); px(c, m.x + m.w - 2, y + 6, 2, 6, '#ffd23a'); }
      px(c, m.x - 2, m.y - 14, m.w + 4, 14, '#050606'); px(c, m.x - 2, m.y + m.h, m.w + 4, 12, '#050606');
    } else {
      for (x = m.x + 3; x < m.x + m.w; x += 8) px(c, x, m.y + 3, 2, m.h - 6, '#4a3a2a');
      px(c, m.x, m.y + 7, m.w, 2, '#98a2aa'); px(c, m.x, m.y + m.h - 9, m.w, 2, '#98a2aa');
      for (x = m.x; x < m.x + m.w - 6; x += 12) { px(c, x, m.y, 6, 2, '#ffd23a'); px(c, x + 6, m.y + m.h - 2, 6, 2, '#ffd23a'); }
      px(c, m.x - 13, m.y - 2, 13, m.h + 4, '#050606'); px(c, m.x + m.w, m.y - 2, 13, m.h + 4, '#050606');
    }
  });
  /* Tapis roulants et plaques électrifiées (partie fixe) */
  L.belts.forEach(function (b) { px(c, b.x, b.y, b.w, b.h, pal.dark < 0.2 ? '#b9c3c6' : '#262b33'); c.strokeStyle = pal.dark < 0.2 ? '#7f9096' : '#4a5361'; c.lineWidth = 2; c.strokeRect(b.x + 1, b.y + 1, b.w - 2, b.h - 2); });
  L.lasers.forEach(function (z) {
    if (!z.zap) return;
    px(c, z.x, z.y, z.w, z.h, '#232a30');
    for (y = z.y; y < z.y + z.h; y += T) for (x = z.x; x < z.x + z.w; x += T) { px(c, x + 1, y + 1, T - 2, T - 2, '#2e373f'); px(c, x + 2, y + 2, 2, 2, '#ffd23a'); px(c, x + T - 4, y + T - 4, 2, 2, '#ffd23a'); }
  });
  L.rads.forEach(function (r) { c.fillStyle = 'rgba(201,162,75,0.16)'; c.fillRect(r.x, r.y, r.w, r.h); c.fillStyle = 'rgba(201,162,75,0.5)'; for (i = 0; i < r.h; i += 12) { c.fillRect(r.x, r.y + i, 3, 6); c.fillRect(r.x + r.w - 3, r.y + i + 6, 3, 6); } });
  L.hides.forEach(function (h) {
    if (h.kind === 'crowd') return;
    c.fillStyle = pal.hide; c.fillRect(h.x, h.y, h.w, h.h);
    if (h.kind === 'shadow') { c.strokeStyle = 'rgba(255,255,255,0.13)'; c.lineWidth = 1; c.setLineDash([3, 3]); c.strokeRect(h.x + 0.5, h.y + 0.5, h.w - 1, h.h - 1); c.setLineDash([]); }
    if (h.kind === 'alcove') { c.strokeStyle = '#8fa3b5'; c.lineWidth = 2; c.strokeRect(h.x + 1, h.y + 1, h.w - 2, h.h - 2); }
  });
  L.blocks.forEach(function (b) { drawBlock(c, b); });
  /* Zone de sortie */
  c.fillStyle = pal.accent; for (y = 0; y < 3; y++) { c.globalAlpha = 0.35; c.fillRect((L.exit.x - 2) * T, (L.exit.y + y) * T, 3 * T, T); } c.globalAlpha = 1;
}

/* Personnage en pixel art : x,y = pieds. dir 0 droite, 1 bas, 2 gauche, 3 haut */
function drawChar(c, x, y, dir, step, body, hat, skin, moving, scarf) {
  x = Math.round(x); y = Math.round(y);
  c.fillStyle = 'rgba(0,0,0,0.35)'; c.beginPath(); c.ellipse(x, y + 1, 7, 3, 0, 0, 6.3); c.fill();
  var f = moving ? (Math.floor(step) % 2) : 0;
  px(c, x - 4, y - 5, 3, 5 - f * 2, '#1a1c22'); px(c, x + 1, y - 5, 3, 3 + f * 2, '#1a1c22');
  px(c, x - 5, y - 13, 10, 9, body);
  px(c, x - 7, y - 12, 2, 6, body); px(c, x + 5, y - 12, 2, 6, body);
  px(c, x - 5, y - 6, 10, 1, 'rgba(0,0,0,0.3)');
  if (scarf) px(c, x - 5, y - 13, 10, 2, scarf);
  px(c, x - 4, y - 20, 8, 7, skin);
  px(c, x - 4, y - 21, 8, dir === 3 ? 7 : 3, hat);
  if (dir === 1) { px(c, x - 3, y - 17, 2, 2, '#111'); px(c, x + 1, y - 17, 2, 2, '#111'); }
  else if (dir === 0) { px(c, x + 2, y - 17, 2, 2, '#111'); px(c, x - 4, y - 21, 3, 6, hat); }
  else if (dir === 2) { px(c, x - 4, y - 17, 2, 2, '#111'); px(c, x + 1, y - 21, 3, 6, hat); }
}
function angToDir(a) { var d = Math.round(a / (Math.PI / 2)); d = ((d % 4) + 4) % 4; return d; }

function conePath(c, x, y, ang, half, range) {
  c.beginPath(); c.moveTo(x - camX, y);
  for (var i = 0; i <= 14; i++) {
    var a = ang - half + (2 * half) * i / 14, r = 0, cx = Math.cos(a), sy = Math.sin(a);
    while (r < range && !solidPx(x + cx * (r + 4), y + sy * (r + 4))) r += 4;
    c.lineTo(x - camX + cx * r, y + sy * r);
  }
  c.closePath();
}
function cone(x, y, ang, half, range, col) { conePath(ctx, x, y, ang, half, range); ctx.fillStyle = col; ctx.fill(); }
function seeCol(v, base) { return v > 0.02 ? 'rgba(255,50,50,' + (0.22 + v * 0.3) + ')' : base; }

function text(str, x, y, size, col, align) { ctx.font = size + 'px ' + FONT; ctx.textAlign = align || 'left'; ctx.textBaseline = 'top'; ctx.fillStyle = col; ctx.fillText(str, Math.round(x), Math.round(y)); }
function wrap(str, max, size) { ctx.font = size + 'px ' + FONT; var w = str.split(' '), lines = [], cur = ''; w.forEach(function (q) { var t = cur ? cur + ' ' + q : q; if (ctx.measureText(t).width > max && cur) { lines.push(cur); cur = q; } else cur = t; }); if (cur) lines.push(cur); return lines; }
function panel(x, y, w, h, fill, border) { px(ctx, x, y, w, h, border); px(ctx, x + 2, y + 2, w - 4, h - 4, fill); }
function fmt(t) { return (Math.round(t * 10) / 10).toFixed(1) + 's'; }

function drawBubble(b) {
  var naos = b.who === 'naos', lines = wrap(b.text, 300, 20), w = 0, i;
  ctx.font = '20px ' + FONT; lines.forEach(function (l) { w = Math.max(w, ctx.measureText(l).width); });
  var bw = Math.ceil(w) + 22, bh = lines.length * 19 + 14 + (naos ? 16 : 0), bx, by;
  if (naos) { bx = (P.x - camX < VW / 2) ? VW - bw - 14 : 14; by = (!isTouch && P.y < VH / 2) ? VH - bh - 14 : 28; } else { bx = Math.max(8, Math.min(VW - bw - 8, b.x - camX - bw / 2)); by = Math.max(24, b.y - bh - 26); }
  panel(bx, by, bw, bh, naos ? '#0b1420' : '#cfe4f7', naos ? '#e3be68' : '#27405e');
  if (naos) text('NAOS-9', bx + 11, by + 5, 16, '#e3be68');
  for (i = 0; i < lines.length; i++) text(lines[i], bx + 11, by + 7 + (naos ? 16 : 0) + i * 19, 20, naos ? '#eadfc2' : '#12233a');
}
function chevron(cx, cy, dx, dy, col) {
  var qx = -dy, qy = dx;
  px(ctx, cx + dx * 3 - 1, cy + dy * 3 - 1, 2, 2, col);
  px(ctx, cx + qx * 2 + dx - 1, cy + qy * 2 + dy - 1, 2, 2, col); px(ctx, cx - qx * 2 + dx - 1, cy - qy * 2 + dy - 1, 2, 2, col);
  px(ctx, cx + qx * 4 - dx - 1, cy + qy * 4 - dy - 1, 2, 2, col); px(ctx, cx - qx * 4 - dx - 1, cy - qy * 4 - dy - 1, 2, 2, col);
}
function drawHound(d) {
  var x = Math.round(d.x - camX), y = Math.round(d.y), f = Math.cos(d.tAng || 0) >= 0 ? 1 : -1, k = Math.floor(time * 10) % 2;
  ctx.fillStyle = 'rgba(0,0,0,0.35)'; ctx.beginPath(); ctx.ellipse(x, y + 1, 9, 3, 0, 0, 6.3); ctx.fill();
  px(ctx, x - 7, y - 4 + k, 2, 4 - k, '#1c2026'); px(ctx, x - 3, y - 4, 2, 4, '#1c2026'); px(ctx, x + 2, y - 4, 2, 4, '#1c2026'); px(ctx, x + 6, y - 4 + (1 - k), 2, 3 + k, '#1c2026');
  px(ctx, x - 8, y - 10, 16, 6, '#3d444e'); px(ctx, x - 8, y - 10, 16, 1, '#5d6672');
  px(ctx, x + (f > 0 ? 6 : -11), y - 13, 5, 6, '#3d444e'); px(ctx, x + (f > 0 ? 9 : -11), y - 11, 2, 2, '#ff3b3b');
  px(ctx, x + (f > 0 ? -10 : 8), y - 11, 2, 2, '#5d6672');
}
function drawCart(r, vert) {
  var x = Math.round(r.x - camX), y = Math.round(r.y), w = Math.round(r.w), h = Math.round(r.h);
  px(ctx, x + 1, y, w - 2, h, '#59636d'); if (h > 8 && w > 8) px(ctx, x + 4, y + 3, w - 8, h - 8, '#2c333a');
  px(ctx, x + 1, y, w - 2, 2, '#8a96a2'); px(ctx, x + 1, y + h - 3, w - 2, 3, '#2a3037');
  if (vert) { px(ctx, x + 1, y + 2, w - 2, 2, '#ffd23a'); if (h > 12) px(ctx, x + 1, y + h - 6, w - 2, 2, '#ffd23a'); }
  else { px(ctx, x + 2, y, 2, h - 3, '#ffd23a'); if (w > 12) px(ctx, x + w - 5, y, 2, h - 3, '#ffd23a'); }
}

function drawGame() {
  var i, x, y, list = [];
  px(ctx, 0, 0, VW, VH, '#000'); ctx.drawImage(bg, -camX, 0);
  drawRackLeds(ctx);
  /* Tapis roulants : chevrons animés */
  L.belts.forEach(function (b) {
    if (!onScreen(b)) return;
    var off = (time * b.s) % 16, col = pal.dark < 0.2 ? 'rgba(40,70,80,0.6)' : 'rgba(255,255,255,0.3)', gx, gy;
    ctx.save(); ctx.beginPath(); ctx.rect(b.x - camX, b.y, b.w, b.h); ctx.clip();
    for (gy = -1; gy <= b.h / 16; gy++) for (gx = -1; gx <= b.w / 16; gx++) chevron(b.x - camX + gx * 16 + 8 + b.dx * off, b.y + gy * 16 + 8 + b.dy * off, b.dx, b.dy, col);
    ctx.restore();
  });
  /* Champs de temps : bleu = lent, doré = rapide */
  L.fields.forEach(function (q) {
    if (!onScreen(q)) return;
    var fast = q.f > 1, fx = q.x - camX, band = fast ? 3 : 8, off = (time * (fast ? 90 : 14)) % 24, yy, y0, y1;
    ctx.fillStyle = fast ? 'rgba(227,190,104,0.16)' : 'rgba(96,120,255,0.20)'; ctx.fillRect(fx, q.y, q.w, q.h);
    ctx.fillStyle = fast ? 'rgba(255,225,150,0.24)' : 'rgba(150,170,255,0.22)';
    for (yy = q.y - 24 + off; yy < q.y + q.h; yy += 24) { y0 = Math.max(q.y, yy); y1 = Math.min(q.y + q.h, yy + band); if (y1 > y0) ctx.fillRect(fx, y0, q.w, y1 - y0); }
    ctx.strokeStyle = fast ? 'rgba(227,190,104,0.7)' : 'rgba(130,150,255,0.7)'; ctx.lineWidth = 1; ctx.setLineDash([4, 4]); ctx.strokeRect(fx + 0.5, q.y + 0.5, q.w - 1, q.h - 1); ctx.setLineDash([]);
  });
  /* Cœur / sphère */
  L.blocks.forEach(function (b) {
    if (b.kind !== 'core') return;
    var cx = (b.x + b.w / 2) * T - camX, cy = (b.y + b.h / 2) * T - 2, r = Math.min(b.w, b.h) * T / 2 - 4;
    var g = ctx.createRadialGradient(cx, cy, 2, cx, cy, r + 14); g.addColorStop(0, '#d8d4ff'); g.addColorStop(0.35, '#6a5cff'); g.addColorStop(0.7, 'rgba(60,40,200,0.5)'); g.addColorStop(1, 'rgba(60,40,200,0)');
    ctx.fillStyle = g; ctx.beginPath(); ctx.arc(cx, cy, r + 14, 0, 6.3); ctx.fill();
    for (i = 0; i < sparks.length; i++) { var s = sparks[i], a = s[0] + time * s[3] * 0.6, rr = s[1] + Math.sin(time + s[2]) * 6; px(ctx, cx + Math.cos(a) * rr, cy - 10 + Math.sin(a) * rr * 0.6 - (i % 5) * 4, 2, 2, 'rgba(227,190,104,' + (0.35 + 0.5 * Math.abs(Math.sin(time * 2 + s[2]))) + ')'); }
  });
  /* Portes */
  L.doors.forEach(function (d) {
    var dx = d.x * T - camX, col = d.type === 'key' ? KEYCOL[d.c] : '#39d5ff';
    if (d.open) { px(ctx, dx, d.y * T, T, 3, col); px(ctx, dx, (d.y + d.h) * T - 3, T, 3, col); return; }
    px(ctx, dx + 2, d.y * T, T - 4, d.h * T, '#1a1e28'); px(ctx, dx + 5, d.y * T, T - 10, d.h * T, col);
    for (i = 0; i < d.h * T; i += 8) px(ctx, dx + 2, d.y * T + i, T - 4, 1, '#0a0c12');
  });
  /* Cartes, terminaux */
  L.keys.forEach(function (k) { if (k.got) return; var by = Math.sin(time * 4 + k.x) * 2; px(ctx, k.x - camX - 6, k.y - 4 + by, 12, 8, '#0c0e14'); px(ctx, k.x - camX - 5, k.y - 3 + by, 10, 6, KEYCOL[k.c]); px(ctx, k.x - camX - 3, k.y - 1 + by, 3, 2, '#fff'); });
  L.terms.forEach(function (t) {
    var tx = t.x - camX, col = t.done ? '#3ddc6a' : (t.off ? '#ffb000' : '#39d5ff');
    px(ctx, tx - 7, t.y - 12, 14, 18, '#10141c'); px(ctx, tx - 5, t.y - 10, 10, 8, col);
    if (!t.done && Math.floor(time * 2) % 2) px(ctx, tx - 3, t.y - 8, 6, 1, '#0b0e14');
    px(ctx, tx - 5, t.y + 1, 10, 2, '#39414f');
    if (t.prog > 0 && !t.done) { px(ctx, tx - 16, t.y - 22, 32, 6, '#0b0e14'); px(ctx, tx - 15, t.y - 21, 30 * t.prog, 4, col); }
  });
  /* Lasers et sol électrifié */
  L.lasers.forEach(function (z) {
    if (!onScreen(z)) return;
    var on = laserOn(z), v = z.h > z.w, zx = z.x - camX, soon = laserSoon(z), k, ax, ay;
    if (z.zap) {
      if (on) {
        ctx.fillStyle = 'rgba(120,225,255,' + (0.22 + 0.15 * Math.random()) + ')'; ctx.fillRect(zx, z.y, z.w, z.h);
        ctx.strokeStyle = '#e6fbff'; ctx.lineWidth = 1; ctx.beginPath();
        for (k = 0; k < Math.max(3, z.w * z.h / 700); k++) { ax = zx + Math.random() * z.w; ay = z.y + Math.random() * z.h; ctx.moveTo(ax, ay); ctx.lineTo(ax + (Math.random() - 0.5) * 20, ay + (Math.random() - 0.5) * 20); ctx.lineTo(ax + (Math.random() - 0.5) * 26, ay + (Math.random() - 0.5) * 26); }
        ctx.stroke();
      } else if (soon) { for (k = 0; k < 4; k++) px(ctx, zx + Math.random() * z.w, z.y + Math.random() * z.h, 2, 2, '#bff3ff'); }
      return;
    }
    px(ctx, v ? zx + 4 : zx - 2, v ? z.y - 2 : z.y + 4, v ? 8 : 4, v ? 4 : 8, '#5c1a1a'); px(ctx, v ? zx + 4 : zx + z.w - 2, v ? z.y + z.h - 2 : z.y + 4, v ? 8 : 4, v ? 4 : 8, '#5c1a1a');
    if (!on) { if (soon && laserPhase(z) > z.per - 0.35) { ctx.fillStyle = 'rgba(255,60,60,0.18)'; ctx.fillRect(v ? zx + 7 : zx, v ? z.y : z.y + 7, v ? 2 : z.w, v ? z.h : 2); } return; }
    ctx.fillStyle = 'rgba(255,40,40,0.25)'; ctx.fillRect(v ? zx + 4 : zx, v ? z.y : z.y + 4, v ? 8 : z.w, v ? z.h : 8);
    ctx.fillStyle = '#ff5a5a'; ctx.fillRect(v ? zx + 7 : zx, v ? z.y : z.y + 7, v ? 2 : z.w, v ? z.h : 2);
  });
  /* Trace de l'écho */
  if (L.echo && hist.length) { for (i = gi; i < hist.length; i += 7) px(ctx, hist[i].x - camX - 1, hist[i].y - 1, 2, 2, 'rgba(170,140,255,0.45)'); }
  /* Personnages et wagonnets triés par profondeur */
  L.crowd.forEach(function (n) { list.push({ y: n.y, f: function () { drawChar(ctx, n.x - camX + Math.sin(time * 0.9 + n.ph) * 2, n.y, Math.floor((time * 0.3 + n.ph) % 4), 0, n.col, n.hair, '#e6b48c', false); } }); });
  L.guards.forEach(function (g) { list.push({ y: g.y, f: function () { drawChar(ctx, g.x - camX, g.y, angToDir(g.ang), g.step, pal.guard, '#0e1626', '#e6b48c', g.moving); px(ctx, Math.round(g.x - camX) - 4, Math.round(g.y) - 19, 8, 1, '#7ad7f0'); } }); });
  L.drones.forEach(function (d) { if (d.hound && d.x - camX > -30 && d.x - camX < VW + 30) list.push({ y: d.y, f: function () { drawHound(d); } }); });
  L.movers.forEach(function (mv) { if (!onScreen(mv)) return; cartRects(mv, clock).forEach(function (r) { list.push({ y: r.y + r.h, f: function () { drawCart(r, mv.vert); } }); }); });
  if (ghost) list.push({ y: ghost.y, f: function () { ctx.globalAlpha = 0.5 + 0.2 * Math.sin(time * 12); drawChar(ctx, ghost.x - camX, ghost.y, ghost.d, ghost.s, '#8a6cff', '#c8b8ff', '#ded4ff', ghost.m); ctx.globalAlpha = 1; } });
  var hid = isHidden(), su = (L.inRad && ['#e9eef2', '#c9a24b']) || pal.suit || ['#2c3038', '#15171c'];
  list.push({ y: P.y, f: function () {
    if (grace > 0 && Math.floor(time * 12) % 2) return;
    ctx.globalAlpha = hid ? 0.55 : 1;
    drawChar(ctx, P.x - camX, P.y, P.dir, P.step, su[0], su[1], '#f0c8a0', P.moving, '#d92b3a');
    ctx.globalAlpha = 1;
  } });
  list.sort(function (a, b) { return a.y - b.y; }); list.forEach(function (o) { o.f(); });
  /* Caméras (boîtier) */
  L.cams.forEach(function (c) { var off = c.g && disabled[c.g]; px(ctx, c.x - camX - 5, c.y - 5, 10, 10, '#12151c'); px(ctx, c.x - camX - 2, c.y - 2, 4, 4, off ? '#3a4250' : (Math.floor(time * 3) % 2 ? '#ff3b3b' : '#8a1a1a')); });
  /* Lumière */
  if (pal.dark > 0.1) {
    lctx.globalCompositeOperation = 'source-over'; lctx.clearRect(0, 0, VW, VH); lctx.fillStyle = 'rgba(2,4,12,' + pal.dark + ')'; lctx.fillRect(0, 0, VW, VH);
    lctx.globalCompositeOperation = 'destination-out';
    var spot = function (sx, sy, r, a) { if (sx < -r || sx > VW + r) return; var g = lctx.createRadialGradient(sx, sy, 3, sx, sy, r); g.addColorStop(0, 'rgba(0,0,0,' + a + ')'); g.addColorStop(1, 'rgba(0,0,0,0)'); lctx.fillStyle = g; lctx.fillRect(sx - r, sy - r, r * 2, r * 2); };
    if (pal.blackout) {
      /* Noir complet : seules éclairent les lampes des gardes, les caméras, les écrans et quelques néons qui grésillent */
      L.lamps.forEach(function (l, k) { spot(l[0] - camX, l[1], 84, 0.15 + 0.08 * Math.sin(time * 3 + k * 1.7) + (rnd(k + Math.floor(time * 8)) > 0.93 ? 0.3 : 0)); });
      spot(P.x - camX, P.y - 8, 58, 0.95);
      L.guards.forEach(function (g) { if (g.x - camX < -140 || g.x - camX > VW + 140) return; lctx.fillStyle = 'rgba(0,0,0,0.8)'; conePath(lctx, g.x, g.y - 8, g.ang, 0.62, g.range); lctx.fill(); spot(g.x - camX, g.y - 8, 22, 0.85); });
      L.cams.forEach(function (c) { if (c.g && disabled[c.g]) return; if (c.x - camX < -170 || c.x - camX > VW + 170) return; lctx.fillStyle = 'rgba(0,0,0,0.6)'; conePath(lctx, c.x, c.y, c.ang, 0.42, c.range); lctx.fill(); spot(c.x - camX, c.y, 14, 0.8); });
      L.terms.forEach(function (t) { spot(t.x - camX, t.y - 4, 24, 0.8); });
      L.keys.forEach(function (k) { if (!k.got) spot(k.x - camX, k.y, 20, 0.8); });
      L.doors.forEach(function (d) { spot(d.x * T + 8 - camX, (d.y + 1.5) * T, 34, 0.6); });
      spot((L.exit.x - 1) * T - camX, (L.exit.y + 1.5) * T, 46, 0.7);
      L.hides.forEach(function (h) { if (!onScreen(h)) return; lctx.fillStyle = 'rgba(0,0,0,0.2)'; lctx.fillRect(h.x - camX, h.y, h.w, h.h); });
      L.lasers.forEach(function (z) { if (!z.zap || !onScreen(z)) return; lctx.fillStyle = 'rgba(0,0,0,' + (laserOn(z) ? 0.85 : (laserSoon(z) ? 0.4 : 0.2)) + ')'; lctx.fillRect(z.x - camX, z.y, z.w, z.h); });
    } else {
      L.lamps.forEach(function (l) { spot(l[0] - camX, l[1], 92, 0.85); });
      spot(P.x - camX, P.y - 8, 60, 0.6);
      L.drones.forEach(function (d) { spot(d.x - camX, d.y, d.rad + 10, d.hound ? 0.5 : 0.9); });
    }
    ctx.drawImage(lightCv, 0, 0);
  }
  /* Cônes de vision */
  L.guards.forEach(function (g) { if (g.x - camX < -140 || g.x - camX > VW + 140) return; cone(g.x, g.y - 8, g.ang, 0.62, g.range, seeCol(g.see, pal.blackout ? 'rgba(255,240,170,0.10)' : 'rgba(255,225,120,0.16)')); if (g.see > 0.05) text('!', g.x - camX, g.y - 40, 26, '#ff4040', 'center'); });
  L.cams.forEach(function (c) { if (c.g && disabled[c.g]) return; if (c.x - camX < -170 || c.x - camX > VW + 170) return; cone(c.x, c.y, c.ang, 0.42, c.range, seeCol(c.see, 'rgba(255,80,80,0.14)')); });
  /* Drones (faisceau) et traqueurs (cercle au sol) */
  L.drones.forEach(function (d) {
    var dx = d.x - camX; if (dx < -80 || dx > VW + 80) return;
    ctx.fillStyle = seeCol(d.see, d.hound ? 'rgba(255,150,60,0.16)' : 'rgba(120,220,255,0.17)'); ctx.beginPath(); ctx.arc(dx, d.y, d.rad, 0, 6.3); ctx.fill();
    ctx.strokeStyle = d.see > 0.02 ? 'rgba(255,60,60,0.8)' : (d.hound ? 'rgba(255,150,60,0.55)' : 'rgba(120,220,255,0.5)'); ctx.lineWidth = 1; ctx.stroke();
    if (d.hound) return;
    var by = d.y - 26 + Math.sin(time * 5 + d.x * 0.01) * 2;
    px(ctx, dx - 7, by, 14, 6, '#1a1f29'); px(ctx, dx - 13, by + 1, 6, 2, '#39414f'); px(ctx, dx + 7, by + 1, 6, 2, '#39414f');
    px(ctx, dx - 15 + (Math.floor(time * 20) % 2) * 2, by - 1, 8, 1, '#9fb3c8'); px(ctx, dx + 7 - (Math.floor(time * 20) % 2) * 2, by - 1, 8, 1, '#9fb3c8'); px(ctx, dx - 2, by + 6, 4, 2, '#ff3b3b');
  });
  /* Pluie */
  if (pal.rain) { ctx.strokeStyle = 'rgba(170,210,255,0.28)'; ctx.lineWidth = 1; ctx.beginPath(); for (i = 0; i < rain.length; i++) { var q = rain[i]; q[1] += q[2] * 1.6; q[0] -= 1.2; if (q[1] > VH) { q[1] = -10; q[0] = Math.random() * (VW + 60); } ctx.moveTo(q[0], q[1]); ctx.lineTo(q[0] - 2, q[1] + q[2]); } ctx.stroke(); }
  if (alarmT >= 0 && Math.floor(time * 2) % 2) { ctx.fillStyle = 'rgba(255,0,0,0.10)'; ctx.fillRect(0, 0, VW, VH); }
  if (curBubble) drawBubble(curBubble);
  /* HUD */
  px(ctx, 0, 0, VW, 18, 'rgba(4,6,12,0.88)');
  text(S.level + ' ' + (L.idx + 1) + '  ' + S.names[L.idx], 8, 0, 18, '#e3be68');
  for (i = 0; i < 3; i++) { x = 520 + i * 18; var lit = i < lives ? '#ff4d5e' : '#3a2a30'; px(ctx, x, 5, 4, 4, lit); px(ctx, x + 6, 5, 4, 4, lit); px(ctx, x - 1, 7, 12, 4, lit); px(ctx, x + 1, 11, 8, 2, lit); px(ctx, x + 3, 13, 4, 2, lit); }
  x = 590; ['r', 'b', 'y'].forEach(function (k) { if (keysOwned[k]) { px(ctx, x, 5, 12, 8, KEYCOL[k]); x += 16; } });
  text(fmt(levelTime), VW - 8, 0, 18, '#7ad7f0', 'right');
  if (hid) text(S.hidden, 650, 0, 18, '#3ddc6a');
  if (muted) text('×', 728, 0, 18, '#ff6a6a');
  y = 24;
  if (suit < 1) { panel(VW - 170, y, 160, 20, '#0b0e14', '#c9a24b'); px(ctx, VW - 166, y + 4, 100 * suit, 12, suit < 0.3 ? '#ff4040' : '#e3be68'); text(S.suit, VW - 58, y, 18, '#e3be68'); y += 24; }
  if (alarmT >= 0) { panel(VW - 170, y, 160, 22, '#2a0508', '#ff4040'); text(S.alarm + ' ' + alarmT.toFixed(1), VW - 90, y + 1, 20, '#ff6a6a', 'center'); }
  if (msg) { ctx.font = '20px ' + FONT; var mw = ctx.measureText(msg).width + 24; panel((VW - mw) / 2, VH - 48, mw, 28, '#0b0e14', '#ff4d5e'); text(msg, VW / 2, VH - 44, 20, '#ffb3b3', 'center'); }
  if (flash > 0) { ctx.fillStyle = 'rgba(255,30,30,' + flash * 0.5 + ')'; ctx.fillRect(0, 0, VW, VH); }
}

function dim(a) { ctx.fillStyle = 'rgba(2,4,10,' + a + ')'; ctx.fillRect(0, 0, VW, VH); }
function menuList(items, y0, sel, size, gap) {
  menuRects = [];
  items.forEach(function (it, i) {
    var y = y0 + i * gap, on = i === sel, col = it.dim ? (on ? '#2a2f38' : '#4b5563') : (on ? '#0b0e14' : '#cfe4f7');
    ctx.font = size + 'px ' + FONT; var w = Math.max(280, ctx.measureText(it.label).width + 40);
    if (on) px(ctx, (VW - w) / 2, y - 2, w, size + 6, it.dim ? '#8a7a52' : '#e3be68');
    text(it.label, VW / 2, y, size, col, 'center');
    menuRects.push({ x: (VW - w) / 2, y: y - 4, w: w, h: gap, i: i });
  });
}
function scan() { ctx.fillStyle = 'rgba(0,0,0,0.16)'; for (var y = 0; y < VH; y += 3) ctx.fillRect(0, y, VW, 1); }

function drawTitle() {
  var g = ctx.createLinearGradient(0, 0, 0, VH); g.addColorStop(0, '#060912'); g.addColorStop(1, '#10060a'); ctx.fillStyle = g; ctx.fillRect(0, 0, VW, VH);
  for (var i = 0; i < 46; i++) { var bh = 30 + rnd(i * 3.7) * 120; px(ctx, i * 18, VH - bh, 15, bh, '#0c1220'); for (var y = VH - bh + 4; y < VH - 6; y += 7) for (var x = 2; x < 12; x += 5) if (rnd(i * 5 + x + y) > 0.72) px(ctx, i * 18 + x, y, 2, 3, rnd(i * x + y) > 0.85 ? '#d92b3a' : '#274a66'); }
  drawChar(ctx, 120 + ((time * 40) % 560), VH - 12, 0, time * 9, '#2c3038', '#15171c', '#f0c8a0', true, '#d92b3a');
  if (state === 'title') {
    text(S.title, VW / 2 + 3, 33, 76, '#5c0f18', 'center'); text(S.title, VW / 2, 30, 76, '#ff3040', 'center');
    text(S.sub, VW / 2, 102, 24, '#e3be68', 'center');
    text(S.agent + ' : ' + agent, VW / 2, 130, 22, '#3ddc6a', 'center');
    buildTitle(); menuList(titleItems, 172, menuIdx, 30, 38);
    text(isTouch ? S.touchHint : S.keysHint, VW / 2, VH - 28, 18, '#7a8898', 'center');
  } else if (state === 'levels') {
    var items = []; for (var n = 1; n <= NL; n++) items.push({ label: n + '. ' + S.names[n - 1] + '   ' + (n <= save.unlocked ? (save.best[n] ? fmt(save.best[n]) : S.none) : S.locked), dim: n > save.unlocked });
    dim(0.8); text(S.levels, VW / 2, 18, 40, '#e3be68', 'center'); menuList(items, 76, menuIdx, 26, 34); var tb = totalBest();
    text((tb ? S.total + ' : ' + fmt(tb) + '     ' : '') + S.back, VW / 2, VH - 44, 22, '#e3be68', 'center');
  } else if (state === 'scores') {
    dim(0.8); menuRects = []; text(S.scores, VW / 2, 60, 40, '#e3be68', 'center');
    var sc = getScores(); if (!sc.length) text(S.none, VW / 2, 200, 28, '#cfe4f7', 'center');
    sc.slice(0, 8).forEach(function (r, i) { text((i + 1) + '.  ' + r.name, 250, 130 + i * 32, 26, r.name === agent ? '#3ddc6a' : '#cfe4f7'); text(fmt(r.time), 560, 130 + i * 32, 26, '#7ad7f0', 'right'); });
    text(S.back, VW / 2, VH - 44, 22, '#e3be68', 'center');
  }
  scan();
}

function draw() {
  menuRects = [];
  if (!L) { drawTitle(); return; }
  drawGame();
  if (state === 'intro') {
    dim(0.72); text(S.acts[L.idx < 5 ? 0 : 1] + '  —  ' + S.level + ' ' + (L.idx + 1), VW / 2, 130, 30, '#7ad7f0', 'center'); text(S.names[L.idx], VW / 2, 170, 60, '#e3be68', 'center');
    wrap(S.goals[L.idx], 600, 26).forEach(function (l, i) { text(l, VW / 2, 250 + i * 28, 26, '#cfe4f7', 'center'); });
    if (Math.floor(time * 2) % 2) text('A', VW / 2, 340, 34, '#3ddc6a', 'center');
  } else if (state === 'pause') {
    dim(0.7); text(S.pause, VW / 2, 90, 60, '#e3be68', 'center'); menuList([{ label: S.resume }, { label: S.restart }, { label: soundLabel() }, { label: S.menu }], 190, menuIdx, 30, 44);
  } else if (state === 'caught') {
    text(S.caught, VW / 2, 190, 72, '#ff4040', 'center'); text(S.lives + ' : ' + lives, VW / 2, 270, 30, '#ffffff', 'center');
  } else if (state === 'over') {
    dim(0.8); text(S.over, VW / 2, 140, 72, '#ff4040', 'center'); text(S.overSub, VW / 2, 230, 26, '#cfe4f7', 'center'); text(S.retry + '     ' + S.back, VW / 2, 310, 26, '#e3be68', 'center');
  } else if (state === 'clear' || state === 'end') {
    dim(0.8); var end = state === 'end';
    text(end ? S.end : S.clear, VW / 2, 110, 60, '#3ddc6a', 'center');
    text(S.time + ' : ' + fmt(lastLevelTime), VW / 2, 200, 34, '#ffffff', 'center');
    text(newBest ? S.newBest : S.best + ' : ' + fmt(save.best[L.idx + 1]), VW / 2, 244, 26, newBest ? '#e3be68' : '#7ad7f0', 'center');
    if (end) { var tb2 = totalBest(); if (tb2) text(S.endSub + ' : ' + fmt(tb2), VW / 2, 290, 26, '#7ad7f0', 'center'); text(S.endThanks, VW / 2, 330, 28, '#e3be68', 'center'); }
    else text(S.next + '     ' + S.back, VW / 2, 320, 26, '#e3be68', 'center');
  }
  if (state !== 'play') scan();
}

var lastT = 0;
function frame(now) {
  var dt = Math.min(0.05, (now - lastT) / 1000 || 0); lastT = now;
  if (L && state !== 'title' && state !== 'levels' && state !== 'scores') update(dt); else { time += dt; updateMenus(); }
  audioFrame();
  draw(); pressed = {};
  requestAnimationFrame(frame);
}
/* Accès de test et de mise au point */
window.__exodus = { start: startLevel, get L() { return L; }, get P() { return P; }, get state() { return state; }, set state(v) { state = v; }, get lives() { return lives; }, get ghost() { return ghost; }, get clock() { return clock; },
  get audio() { return AC ? AC.state : null; }, get muted() { return muted; }, sfx: sfxStats, carts: function (m) { return cartRects(m, clock); }, save: save, finish: finishLevel };
requestAnimationFrame(frame);
})();
