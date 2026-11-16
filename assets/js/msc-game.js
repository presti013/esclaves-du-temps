/* MSC — MATRICE DE SYNCHRONISATION CHRONOMORPHIQUE
   Puzzle de conduits en isométrie, 10 séquences tirées du chapitre 26 « Fermentation ».
   Fichier partagé par les versions FR / EN / IT (langue lue sur <html lang>).
   Rien d'externe pour l'image ni les effets : canvas 2D et Web Audio. Musique : lecteur SoundCloud. */
(function () {
'use strict';

/* ======================================================================
   1. TEXTES
   ====================================================================== */
var STR = {
fr: {
  name: 'MATRICE DE SYNCHRONISATION CHRONOMORPHIQUE', sub: 'Chapitre 26 — Fermentation', agent: 'AGENT',
  epi: '« La fermentation est la putréfaction contrôlée. C\'est accepter que quelque chose doit mourir pour que quelque chose de nouveau puisse naître. »', epiBy: 'Vaedran Ilarion, carnet personnel',
  cont: 'Continuer', neu: 'Nouvelle partie', levels: 'Séquences', music: 'Musique', fx: 'Effets', on: 'oui', off: 'non', quit: 'Retour à Écho Rouge',
  start: 'Commencer', next: 'Séquence suivante', resume: 'Reprendre', restart: 'Réinitialiser', menu: 'Menu', back: 'Retour', replay: 'Rejouer',
  seq: 'SÉQUENCE', moves: 'coups', best: 'record', locked: 'verrouillée', pause: 'Pause',
  corr: 'CORRESPONDANCES', sig: 'SIGNAL', desync: 'DÉSYNCHRONISATION', diff: 'DIFFUSION',
  stNodes: 'nœuds', stOk: 'flux établi', stBreach: 'ALERTE — contact', stMix: 'ALERTE — les flux se touchent', stLock: 'verrou fermé', stOpen: 'verrou ouvert',
  solved: 'Séquence synchronisée', endTitle: 'Le signal court',
  end1: 'Le signal de désynchronisation. Cent quarante-sept voix simultanées. Quatorze minutes et trente-sept secondes.', end2: 'Le relais diffusait. Le signal courait.',
  hintKeys: 'Clic ou toucher : tourner · clic droit ou Maj : sens inverse · flèches + Espace · R : réinitialiser · M / N : musique / effets',
  warnHead: '// Chapitre 26 — avertissement', warn: 'Cette matrice rejoue la nuit du chapitre 26, jusqu\'à son dénouement. Lecteur, si tu n\'as pas encore atteint ce chapitre, tu y trouveras de quoi t\'en gâcher la découverte. Entre en toute connaissance de cause.', warnGo: 'Continuer',
  tapMusic: 'Touchez ▶ ci-dessous pour lancer la musique', us: 'NOUS', decoy: 'LEURRE', old: 'pré-3.0', nan: ['plexus', 'nuque', 'paume'],
  lv: [
    { place: 'Cœur Central — zone de travail', time: '01:07', cd: 'T-14 h 53', title: 'Nœud 90', goal: 'Relie l\'émetteur au récepteur en passant par le nœud. Deux tuiles sont décalées ensemble : tourner l\'une fait tourner l\'autre.', quote: '« Sa fréquence porteuse ne correspond pas au schéma de Jarek. Il y a un décalage de 0,7 mégahertz. »', out: '91. 92. 93. La partition prenait forme.' },
    { place: 'Cœur Central — le mur de Jarek', time: '01:07', cd: 'T-14 h 53', title: 'Les sept facteurs', goal: 'Fais passer le flux par les sept facteurs de décalage. Une tuile maîtresse entraîne sa suiveuse : règle la maîtresse d\'abord, la suiveuse ensuite.', quote: '« On ne recalibre pas chaque porte individuellement. On calibre le décalage. »', out: 'Facteur total : 1,2847. Trois secondes par porte, pas quarante minutes.' },
    { place: 'Niveau -3, complexe Fagor-Brandt', time: '02:14', cd: 'T-13 h 46', title: 'Le fil de détection', goal: 'Monte du -3 au -1. Aucun conduit alimenté ne doit pointer vers un fil : un seul contact, et l\'alarme part.', quote: '« On ne coupe pas. On passe en dessous. »', out: 'Le fil de détection resta intact derrière eux. Personne ne saurait qu\'ils étaient passés.' },
    { place: 'Cœur Central — près du berceau de la MSC', time: '03:42', cd: 'T-12 h 18', title: 'Ce qui te manquera', goal: 'Deux flux, Kael (or) et NAOS-9 (cyan), doivent rejoindre le même point sans jamais se toucher avant.', quote: '« Je t\'habitais. Ce n\'est pas la même chose. »', out: 'Cent vingt-deux. Plus que vingt-cinq.' },
    { place: 'Tour Sigma, Zurich — salle de crise', time: '04:31 UTC', cd: 'T-11 h 29', title: 'La salle sans fenêtres', goal: 'Ici, les ordres descendent en cascade : tourner une tuile fait tourner toutes celles qu\'elle commande. Commence par le haut de la chaîne.', quote: '« Lyon. » Cette fois, ce n\'était plus une information — c\'était une direction.', out: 'Ils regardaient en haut. Le danger était en bas.' },
    { place: 'Cœur Central — zone de travail', time: '06:38', cd: 'T-9 h 22', title: 'Toutes les notes', goal: 'Les nœuds voisins interfèrent : la suiveuse tourne en sens inverse de sa maîtresse. Désynchronise-les en séquence.', quote: '« Tu ne les désynchronises pas en même temps, tu les désynchronises en séquence. »', out: 'Cent quarante-sept correspondances. Mais les notes ne sont pas la musique.' },
    { place: 'Complexe Fagor-Brandt', time: '07:12', cd: 'T-8 h 48', title: 'Par le toit', goal: 'Fais descendre les agents (rouge) jusqu\'au leurre du -2, étage par étage. Mène Reya (cyan) au relais du -1. Les deux flux ne doivent jamais se toucher.', quote: '« Il faut les envoyer dans la mauvaise direction. »', out: 'Le -1 est dégagé. Les agents sont au -2.' },
    { place: 'Cœur Central — berceau de la MSC', time: '08:03', cd: 'T-7 h 57', title: 'Le verrou de Jarek', goal: 'Trois nœuds résistent : 44, 89 et 131. Aucun geste ne les fait tourner. Réveille d\'abord les trois nanites dormantes.', quote: '« Le genre que seuls ceux qui comprennent l\'amour peuvent ouvrir. »', out: 'La confiance. Les nanites 44, 89 et 131 s\'activèrent. Le verrou s\'ouvrit.' },
    { place: 'Cœur Central — simulation', time: '08:21', cd: '', title: 'Un signal imparfait', goal: 'Douze Tissages à atteindre. L\'un d\'eux, trop ancien, restera hors de portée : synchronise les onze autres.', quote: '« Un signal imparfait vaut mieux que pas de signal. »', out: 'Taux de désynchronisation estimé : 91,7 %. « Lancez-le. »' },
    { place: 'Datacenter du -1 — relais Sigma', time: '', cd: '', title: 'Seize mètres', goal: 'Du conduit jusqu\'au relais Sigma, rack par rack. Aucun conduit alimenté ne doit pointer vers un agent.', quote: '« Reya ! Cours ! »', out: 'Cent pour cent. Le signal se lança.' }
  ]
},
en: {
  name: 'CHRONOMORPHIC SYNCHRONIZATION MATRIX', sub: 'Chapter 26 — Fermentation', agent: 'AGENT',
  epi: '"Fermentation is controlled putrefaction. It is accepting that something must die so that something new can be born."', epiBy: 'Vaedran Ilarion, personal notebook',
  cont: 'Continue', neu: 'New game', levels: 'Sequences', music: 'Music', fx: 'Sound FX', on: 'on', off: 'off', quit: 'Back to Red Echo',
  start: 'Begin', next: 'Next sequence', resume: 'Resume', restart: 'Reset', menu: 'Menu', back: 'Back', replay: 'Play again',
  seq: 'SEQUENCE', moves: 'moves', best: 'best', locked: 'locked', pause: 'Paused',
  corr: 'CORRESPONDENCES', sig: 'SIGNAL', desync: 'DESYNCHRONIZATION', diff: 'BROADCAST',
  stNodes: 'nodes', stOk: 'flow established', stBreach: 'ALERT — contact', stMix: 'ALERT — the flows are touching', stLock: 'lock closed', stOpen: 'lock open',
  solved: 'Sequence synchronized', endTitle: 'The signal is running',
  end1: 'The desynchronization signal. One hundred and forty-seven simultaneous voices. Fourteen minutes and thirty-seven seconds.', end2: 'The relay was broadcasting. The signal was running.',
  hintKeys: 'Click or tap: rotate · right-click or Shift: reverse · arrows + Space · R: reset · M / N: music / sound FX',
  warnHead: '// Chapter 26 — warning', warn: 'This matrix replays the night of chapter 26, all the way to its outcome. Reader, if you have not reached that chapter yet, you will find enough here to spoil it. Enter with full knowledge.', warnGo: 'Continue',
  tapMusic: 'Tap ▶ below to start the music', us: 'US', decoy: 'DECOY', old: 'pre-3.0', nan: ['plexus', 'nape', 'palm'],
  lv: [
    { place: 'Central Core — work area', time: '01:07', cd: 'T-14 h 53', title: 'Node 90', goal: 'Link the emitter to the receiver through the node. Two tiles are shifted together: rotating one rotates the other.', quote: '"Its carrier frequency does not match Jarek\'s schematic. There is a 0.7 megahertz shift."', out: '91. 92. 93. The score was taking shape.' },
    { place: 'Central Core — Jarek\'s wall', time: '01:07', cd: 'T-14 h 53', title: 'The seven factors', goal: 'Run the flow through the seven shift factors. A master tile drives its follower: set the master first, then the follower.', quote: '"We do not recalibrate each gate one by one. We calibrate the shift."', out: 'Total factor: 1.2847. Three seconds per gate, not forty minutes.' },
    { place: 'Level -3, Fagor-Brandt complex', time: '02:14', cd: 'T-13 h 46', title: 'The detection wire', goal: 'Climb from -3 to -1. No powered conduit may point at a wire: a single contact and the alarm goes off.', quote: '"We do not cut it. We go under it."', out: 'The detection wire stayed intact behind them. Nobody would know they had passed.' },
    { place: 'Central Core — by the MSC cradle', time: '03:42', cd: 'T-12 h 18', title: 'What you will miss', goal: 'Two flows, Kael (gold) and NAOS-9 (cyan), must reach the same point without ever touching before it.', quote: '"I was living in you. That is not the same thing."', out: 'One hundred and twenty-two. Twenty-five to go.' },
    { place: 'Sigma Tower, Zurich — crisis room', time: '04:31 UTC', cd: 'T-11 h 29', title: 'The windowless room', goal: 'Here, orders cascade down: rotating a tile rotates every tile it commands. Start at the top of the chain.', quote: '"Lyon." This time it was no longer information — it was a direction.', out: 'They were looking up. The danger was below.' },
    { place: 'Central Core — work area', time: '06:38', cd: 'T-9 h 22', title: 'All the notes', goal: 'Neighbouring nodes interfere: the follower rotates the opposite way to its master. Desynchronize them in sequence.', quote: '"You do not desynchronize them at the same time, you desynchronize them in sequence."', out: 'One hundred and forty-seven correspondences. But the notes are not the music.' },
    { place: 'Fagor-Brandt complex', time: '07:12', cd: 'T-8 h 48', title: 'From the roof', goal: 'Bring the agents (red) down to the decoy on -2, floor by floor. Lead Reya (cyan) to the relay on -1. The two flows must never touch.', quote: '"We have to send them in the wrong direction."', out: 'Level -1 is clear. The agents are on -2.' },
    { place: 'Central Core — MSC cradle', time: '08:03', cd: 'T-7 h 57', title: 'Jarek\'s lock', goal: 'Three nodes resist: 44, 89 and 131. No gesture will turn them. First wake the three dormant nanites.', quote: '"The kind only those who understand love can open."', out: 'Trust. Nanites 44, 89 and 131 woke. The lock opened.' },
    { place: 'Central Core — simulation', time: '08:21', cd: '', title: 'An imperfect signal', goal: 'Twelve Weaves to reach. One of them, too old, will stay out of range: synchronize the other eleven.', quote: '"An imperfect signal is better than no signal."', out: 'Estimated desynchronization rate: 91.7%. "Launch it."' },
    { place: 'Level -1 datacenter — Sigma relay', time: '', cd: '', title: 'Sixteen metres', goal: 'From the duct to the Sigma relay, rack by rack. No powered conduit may point at an agent.', quote: '"Reya! Run!"', out: 'One hundred percent. The signal launched.' }
  ]
},
it: {
  name: 'MATRICE DI SINCRONIZZAZIONE CRONOMORFICA', sub: 'Capitolo 26 — Fermentazione', agent: 'AGENTE',
  epi: '« La fermentazione è la putrefazione controllata. È accettare che qualcosa debba morire perché qualcosa di nuovo possa nascere. »', epiBy: 'Vaedran Ilarion, taccuino personale',
  cont: 'Continua', neu: 'Nuova partita', levels: 'Sequenze', music: 'Musica', fx: 'Effetti', on: 'sì', off: 'no', quit: 'Torna a Eco Rosso',
  start: 'Inizia', next: 'Sequenza successiva', resume: 'Riprendi', restart: 'Reimposta', menu: 'Menu', back: 'Indietro', replay: 'Rigioca',
  seq: 'SEQUENZA', moves: 'mosse', best: 'record', locked: 'bloccata', pause: 'Pausa',
  corr: 'CORRISPONDENZE', sig: 'SEGNALE', desync: 'DESINCRONIZZAZIONE', diff: 'DIFFUSIONE',
  stNodes: 'nodi', stOk: 'flusso stabilito', stBreach: 'ALLARME — contatto', stMix: 'ALLARME — i flussi si toccano', stLock: 'blocco chiuso', stOpen: 'blocco aperto',
  solved: 'Sequenza sincronizzata', endTitle: 'Il segnale corre',
  end1: 'Il segnale di desincronizzazione. Centoquarantasette voci simultanee. Quattordici minuti e trentasette secondi.', end2: 'Il relè trasmetteva. Il segnale correva.',
  hintKeys: 'Clic o tocco: ruota · clic destro o Maiusc: senso inverso · frecce + Spazio · R: reimposta · M / N: musica / effetti',
  warnHead: '// Capitolo 26 — avvertenza', warn: 'Questa matrice rivive la notte del capitolo 26, fino al suo epilogo. Lettore, se non sei ancora arrivato a quel capitolo, qui troverai quanto basta per rovinartene la scoperta. Entra con piena consapevolezza.', warnGo: 'Continua',
  tapMusic: 'Tocca ▶ qui sotto per avviare la musica', us: 'NOI', decoy: 'ESCA', old: 'pre-3.0', nan: ['plesso', 'nuca', 'palmo'],
  lv: [
    { place: 'Cuore Centrale — zona di lavoro', time: '01:07', cd: 'T-14 h 53', title: 'Nodo 90', goal: 'Collega l\'emettitore al ricevitore passando per il nodo. Due tessere sono sfasate insieme: ruotarne una fa ruotare l\'altra.', quote: '« La sua frequenza portante non corrisponde allo schema di Jarek. C\'è uno scarto di 0,7 megahertz. »', out: '91. 92. 93. La partitura prendeva forma.' },
    { place: 'Cuore Centrale — il muro di Jarek', time: '01:07', cd: 'T-14 h 53', title: 'I sette fattori', goal: 'Fai passare il flusso per i sette fattori di scarto. Una tessera maestra trascina la sua gregaria: regola prima la maestra, poi la gregaria.', quote: '« Non si ricalibra ogni porta una per una. Si calibra lo scarto. »', out: 'Fattore totale: 1,2847. Tre secondi per porta, non quaranta minuti.' },
    { place: 'Livello -3, complesso Fagor-Brandt', time: '02:14', cd: 'T-13 h 46', title: 'Il filo di rilevamento', goal: 'Sali dal -3 al -1. Nessun condotto alimentato deve puntare verso un filo: un solo contatto e scatta l\'allarme.', quote: '« Non si taglia. Si passa sotto. »', out: 'Il filo di rilevamento restò intatto dietro di loro. Nessuno avrebbe saputo del loro passaggio.' },
    { place: 'Cuore Centrale — accanto alla culla della MSC', time: '03:42', cd: 'T-12 h 18', title: 'Ciò che ti mancherà', goal: 'Due flussi, Kael (oro) e NAOS-9 (ciano), devono raggiungere lo stesso punto senza mai toccarsi prima.', quote: '« Ti abitavo. Non è la stessa cosa. »', out: 'Centoventidue. Ne mancano venticinque.' },
    { place: 'Torre Sigma, Zurigo — sala di crisi', time: '04:31 UTC', cd: 'T-11 h 29', title: 'La sala senza finestre', goal: 'Qui gli ordini scendono a cascata: ruotare una tessera fa ruotare tutte quelle che comanda. Comincia dalla cima della catena.', quote: '« Lione. » Stavolta non era più un\'informazione — era una direzione.', out: 'Guardavano in alto. Il pericolo era in basso.' },
    { place: 'Cuore Centrale — zona di lavoro', time: '06:38', cd: 'T-9 h 22', title: 'Tutte le note', goal: 'I nodi vicini interferiscono: la gregaria ruota in senso opposto alla maestra. Desincronizzali in sequenza.', quote: '« Non li desincronizzi nello stesso momento, li desincronizzi in sequenza. »', out: 'Centoquarantasette corrispondenze. Ma le note non sono la musica.' },
    { place: 'Complesso Fagor-Brandt', time: '07:12', cd: 'T-8 h 48', title: 'Dal tetto', goal: 'Fai scendere gli agenti (rosso) fino all\'esca del -2, piano per piano. Porta Reya (ciano) al relè del -1. I due flussi non devono mai toccarsi.', quote: '« Bisogna mandarli nella direzione sbagliata. »', out: 'Il -1 è libero. Gli agenti sono al -2.' },
    { place: 'Cuore Centrale — culla della MSC', time: '08:03', cd: 'T-7 h 57', title: 'Il blocco di Jarek', goal: 'Tre nodi resistono: 44, 89 e 131. Nessun gesto li fa ruotare. Risveglia prima le tre naniti dormienti.', quote: '« Il genere che solo chi comprende l\'amore può aprire. »', out: 'La fiducia. Le naniti 44, 89 e 131 si attivarono. Il blocco si aprì.' },
    { place: 'Cuore Centrale — simulazione', time: '08:21', cd: '', title: 'Un segnale imperfetto', goal: 'Dodici Tessiture da raggiungere. Una, troppo vecchia, resterà fuori portata: sincronizza le altre undici.', quote: '« Un segnale imperfetto è meglio di nessun segnale. »', out: 'Tasso di desincronizzazione stimato: 91,7 %. « Lanciatelo. »' },
    { place: 'Datacenter del -1 — relè Sigma', time: '', cd: '', title: 'Sedici metri', goal: 'Dal condotto fino al relè Sigma, rack dopo rack. Nessun condotto alimentato deve puntare verso un agente.', quote: '« Reya! Corri! »', out: 'Cento per cento. Il segnale partì.' }
  ]
}
};

/* ======================================================================
   2. RÈGLES ET NIVEAUX (partie pure, utilisable hors navigateur pour les tests)
   ====================================================================== */
var DR = [-1, 0, 1, 0], DC = [0, 1, 0, -1], OPP = [2, 3, 0, 1];
var BASE = { straight: [1, 0, 1, 0], corner: [1, 1, 0, 0], tee: [1, 1, 1, 0], cross: [1, 1, 1, 1], end: [1, 0, 0, 0], wall: [0, 0, 0, 0] };
function ports(t, r) { var p = BASE[t].slice(), k; r = ((r % 4) + 4) % 4; for (k = 0; k < r; k++) p = [p[3], p[0], p[1], p[2]]; return p; }
function rng(seed) { var s = seed >>> 0; return function () { s = (s * 1664525 + 1013904223) >>> 0; return s / 4294967296; }; }

/* Chaque flux est décrit par des points de passage [ligne, colonne, marque, étiquette] ; le chemin est
   tracé au plus court entre eux. Marques : n = nœud à alimenter, k = nanite dormante, v = nœud verrouillé.
   links : m = tuile maîtresse, f = suiveuse (anti : la suiveuse tourne en sens inverse). */
var LEVELS = [
  { rows: 4, cols: 5, seed: 5, voidP: 0.35, corr: [89, 93],
    flows: [{ id: 'S', col: 'c', from: [3, 0], via: [[3, 2], [1, 2, 'n', '90'], [1, 4]], to: [0, 4] }],
    links: [{ m: [3, 2], f: [1, 4] }, { m: [1, 4], f: [3, 2] }] },
  { rows: 5, cols: 5, seed: 12, voidP: 0.4, corr: [93, 121],
    flows: [{ id: 'S', col: 'c', from: [4, 0], via: [[4, 2, 'n', '0.0312'], [4, 4], [3, 4, 'n', '0.0473'], [2, 4], [2, 3, 'n', '0.0198'], [2, 1, 'n', '0.0551'], [2, 0], [1, 0, 'n', '0.0287'], [0, 0], [0, 2, 'n', '0.0412'], [0, 4, 'n', '0.0365']], to: [1, 4] }],
    links: [{ m: [4, 4], f: [2, 0] }, { m: [2, 4], f: [0, 0] }] },
  { rows: 7, cols: 5, seed: 23, voidP: 0.15, corr: [121, 121],
    walls: [[5, 0, 'fil'], [5, 1, 'fil'], [5, 2, 'fil'], [3, 2, 'fil'], [3, 3, 'fil'], [3, 4, 'fil'], [1, 0, 'fil'], [1, 1, 'fil'], [1, 4, 'fil']],
    flows: [{ id: 'S', col: 'c', from: [6, 1], slabel: '-3', dlabel: '-1', via: [[6, 3], [4, 3], [4, 1], [2, 1], [2, 3], [0, 3]], to: [0, 1] }],
    links: [{ m: [4, 3], f: [2, 1] }] },
  { rows: 5, cols: 7, seed: 31, voidP: 0.3, corr: [121, 122],
    flows: [{ id: 'K', col: 'g', slabel: 'KAEL', from: [2, 0], via: [[0, 0], [0, 1, 'n'], [0, 2], [2, 2]], to: [2, 3] },
            { id: 'N', col: 'c', slabel: 'NAOS-9', from: [2, 6], via: [[4, 6], [4, 5, 'n'], [4, 4], [2, 4]], to: [2, 3] }],
    links: [{ m: [0, 2], f: [4, 4] }, { m: [4, 6], f: [0, 0] }] },
  { rows: 6, cols: 6, seed: 44, voidP: 0.3, corr: [122, 122],
    flows: [{ id: 'S', col: 'c', slabel: 'ZURICH', dlabel: 'LYON', from: [0, 0], via: [[0, 3, 'n'], [2, 3], [2, 1, 'n'], [4, 1], [4, 4, 'n'], [5, 4]], to: [5, 5] }],
    links: [{ m: [0, 3], f: [2, 1] }, { m: [2, 1], f: [4, 4] }] },
  { rows: 6, cols: 6, seed: 57, voidP: 0.28, corr: [122, 147], sig: [0, 70],
    flows: [{ id: 'S', col: 'c', from: [5, 0], via: [[5, 2, 'n', '23'], [5, 4], [3, 4, 'n', '24'], [3, 2, 'n', '25'], [3, 1], [1, 1, 'n', '27'], [1, 3, 'n', '29'], [1, 5]], to: [0, 5] }],
    links: [{ m: [5, 4], f: [3, 4], anti: 1 }, { m: [3, 4], f: [3, 1], anti: 1 }, { m: [1, 1], f: [1, 5], anti: 1 }] },
  { rows: 8, cols: 5, seed: 68, voidP: 0.25, corr: [147, 147], sig: [70, 92],
    flows: [{ id: 'A', col: 'r', slabel: 'AEGIS', dlabel: '@decoy', from: [0, 2], via: [[1, 2, 'n', '4'], [2, 2], [2, 3, 'n', '3'], [2, 4], [4, 4, 'n', '1'], [6, 4, 'n', '-1']], to: [7, 4] },
            { id: 'R', col: 'c', slabel: 'REYA', dlabel: 'Σ', from: [7, 0], via: [[4, 0], [4, 2]], to: [6, 2] }],
    links: [{ m: [2, 4], f: [4, 2] }, { m: [4, 0], f: [4, 4] }] },
  { rows: 6, cols: 6, seed: 79, voidP: 0.3, corr: [147, 147], sig: [97, 100],
    flows: [{ id: 'S', col: 'c', from: [5, 0], via: [[5, 2], [4, 2, 'k', '@0'], [3, 2], [3, 1], [2, 1, 'k', '@1'], [1, 1], [1, 4, 'k', '@2'], [1, 5], [2, 5, 'v', '44'], [3, 5, 'v', '89'], [4, 5, 'v', '131'], [5, 5]], to: [5, 4] }],
    links: [{ m: [5, 2], f: [3, 1] }, { m: [3, 1], f: [1, 1] }] },
  { rows: 7, cols: 6, seed: 86, voidP: 0.35, corr: [147, 147], sig: [100, 100], desync: 1,
    lost: [[0, 0, 3]],
    flows: [{ id: 'S', col: 'c', from: [6, 0], via: [[6, 2, 'n'], [6, 4, 'n'], [6, 5], [5, 5, 'n'], [4, 5], [4, 3, 'n'], [4, 1, 'n'], [4, 0], [3, 0, 'n'], [2, 0], [2, 2, 'n'], [2, 4, 'n'], [2, 5], [1, 5, 'n'], [0, 5], [0, 4, 'n'], [0, 2, 'n']], to: [0, 1] }],
    links: [{ m: [6, 5], f: [4, 0] }, { m: [4, 5], f: [2, 0] }, { m: [2, 0], f: [0, 5] }, { m: [2, 5], f: [4, 3], anti: 1 }] },
  { rows: 7, cols: 7, seed: 97, voidP: 0.22, corr: [147, 147], sig: [100, 100], diff: 1,
    walls: [[3, 3, 'agent'], [2, 6, 'agent'], [3, 6, 'agent'], [5, 4, 'agent']],
    flows: [{ id: 'S', col: 'c', dlabel: 'Σ', hub: 1, from: [6, 0], via: [[6, 2, 'n'], [5, 2, 'n'], [4, 2], [4, 4, 'n'], [3, 4, 'n'], [2, 4], [2, 5], [0, 5, 'n']], to: [0, 6] }],
    links: [{ m: [6, 2], f: [4, 2] }, { m: [4, 2], f: [4, 4] }, { m: [2, 4], f: [2, 5], anti: 1 }] }
];

function buildLevel(idx) {
  var d = LEVELS[idx], R = d.rows, C = d.cols, n = R * C, i, k;
  var tiles = [], used = new Uint8Array(n), reserved = new Uint8Array(n), pa = [], tags = {};
  for (i = 0; i < n; i++) { tiles.push(null); pa.push([0, 0, 0, 0]); }
  function id(rc) { return rc[0] * C + rc[1]; }
  var L = { idx: idx, def: d, rows: R, cols: C, tiles: tiles, flows: [], links: [], nodes: [], nanites: [], verrous: [], lost: [], shared: -1 };
  (d.walls || []).forEach(function (w) { tiles[id(w)] = { t: 'wall', sol: 0, role: w[2], locked: true }; used[id(w)] = 1; });
  (d.lost || []).forEach(function (w) { tiles[id(w)] = { t: 'end', sol: w[2], role: 'lost', locked: true }; used[id(w)] = 1; L.lost.push(id(w)); });
  d.flows.forEach(function (f) { reserved[id(f.from)] = 1; reserved[id(f.to)] = 1; });
  function bfs(a, b) {                       // plus court chemin de a à b dans les cases libres
    var prev = new Int32Array(n).fill(-1), q = [a], seen = new Uint8Array(n), h = 0, x, dd, nr, nc, j, out = [];
    seen[a] = 1;
    while (h < q.length) {
      x = q[h++]; if (x === b) break;
      for (dd = 0; dd < 4; dd++) {
        nr = ((x / C) | 0) + DR[dd]; nc = (x % C) + DC[dd]; if (nr < 0 || nr >= R || nc < 0 || nc >= C) continue;
        j = nr * C + nc; if (seen[j]) continue; if (j !== b && (used[j] || reserved[j])) continue;
        seen[j] = 1; prev[j] = x; q.push(j);
      }
    }
    if (!seen[b]) return null;
    for (x = b; x !== a; x = prev[x]) out.unshift(x);
    return out;
  }
  function connect(a, b) { for (var dd = 0; dd < 4; dd++) if (((a / C) | 0) + DR[dd] === ((b / C) | 0) && (a % C) + DC[dd] === (b % C)) { pa[a][dd] = 1; pa[b][OPP[dd]] = 1; } }
  d.flows.forEach(function (f) {
    var pts = [f.from].concat(f.via || [], [f.to]), path = [id(f.from)];
    used[path[0]] = 1;
    for (k = 1; k < pts.length; k++) {
      var seg = bfs(path[path.length - 1], id(pts[k]));
      if (!seg) throw new Error('séquence ' + (idx + 1) + ' : chemin impossible vers ' + pts[k][0] + ',' + pts[k][1]);
      seg.forEach(function (x) { used[x] = 1; }); path = path.concat(seg);
      if (pts[k][2]) tags[id(pts[k])] = { tag: pts[k][2], label: pts[k][3] || '' };
    }
    for (k = 0; k < path.length - 1; k++) connect(path[k], path[k + 1]);
    L.flows.push({ id: f.id, col: f.col, src: path[0], dst: path[path.length - 1], path: path, slabel: f.slabel || '', dlabel: f.dlabel || '', hub: !!f.hub });
  });
  if (L.flows.length === 2 && L.flows[0].dst === L.flows[1].dst) L.shared = L.flows[0].dst;
  for (i = 0; i < n; i++) {                   // tuiles du tracé : type et rotation déduits des raccords
    var cnt = pa[i][0] + pa[i][1] + pa[i][2] + pa[i][3]; if (!cnt) continue;
    var type = cnt === 1 ? 'end' : cnt === 3 ? 'tee' : cnt === 4 ? 'cross' : ((pa[i][0] && pa[i][2]) || (pa[i][1] && pa[i][3])) ? 'straight' : 'corner';
    for (k = 0; k < 4; k++) if (ports(type, k).join() === pa[i].join()) break;
    tiles[i] = { t: type, sol: k, role: null, locked: false, label: '' };
  }
  L.flows.forEach(function (f) {
    tiles[f.src].role = 'source'; tiles[f.src].locked = true; tiles[f.src].flow = f.id; tiles[f.src].label = f.slabel;
    tiles[f.dst].role = L.shared === f.dst ? 'us' : (f.hub ? 'hub' : 'sink'); tiles[f.dst].locked = true; tiles[f.dst].flow = f.id; tiles[f.dst].label = f.dlabel;
  });
  Object.keys(tags).forEach(function (key) {
    var t = tiles[key], g = tags[key]; t.label = g.label;
    if (g.tag === 'n') { t.role = 'node'; L.nodes.push(+key); }
    if (g.tag === 'k') { t.role = 'nanite'; L.nodes.push(+key); L.nanites.push(+key); }
    if (g.tag === 'v') { t.role = 'verrou'; t.locked = true; t.off = t.t === 'straight' ? 1 : 2; L.verrous.push(+key); }
  });
  var rnd = rng(d.seed);                      // cases restantes : vides ou tuiles sans rôle
  for (i = 0; i < n; i++) {
    if (tiles[i] || used[i]) continue;
    var a = rnd(), b = rnd(), c = rnd();
    if (a < d.voidP) continue;
    tiles[i] = { t: b < 0.6 ? 'corner' : 'straight', sol: (c * 4) | 0, role: null, locked: false, label: '', extra: true };
  }
  (d.links || []).forEach(function (l) {
    var m = id(l.m), f = id(l.f);
    if (!tiles[m] || !tiles[f] || tiles[m].locked || tiles[f].locked) throw new Error('séquence ' + (idx + 1) + ' : lien sur une tuile fixe');
    L.links.push({ m: m, f: f, s: l.anti ? -1 : 1 });
  });
  return L;
}
/* État de la grille pour des rotations données. */
function evaluate(L, rot) {
  var n = L.tiles.length, C = L.cols, R = L.rows, pw = [], any = new Uint8Array(n), breach = new Uint8Array(n), isDst = new Uint8Array(n), i, d, k, r, c, pp, nr, nc, j;
  function P(x) { var t = L.tiles[x]; return t ? ports(t.t, rot[x]) : BASE.wall; }
  L.flows.forEach(function (f) { isDst[f.dst] = 1; });
  L.flows.forEach(function (f) {
    var p = new Uint8Array(n), st = [f.src]; p[f.src] = 1;
    while (st.length) {
      i = st.pop(); if (isDst[i]) continue; r = (i / C) | 0; c = i % C; pp = P(i);
      for (d = 0; d < 4; d++) {
        if (!pp[d]) continue; nr = r + DR[d]; nc = c + DC[d]; if (nr < 0 || nr >= R || nc < 0 || nc >= C) continue;
        j = nr * C + nc; if (!p[j] && P(j)[OPP[d]]) { p[j] = 1; st.push(j); }
      }
    }
    pw.push(p);
  });
  var mix = false, touch = false, leaks = 0;
  for (i = 0; i < n; i++) { k = 0; pw.forEach(function (p) { if (p[i]) k++; }); any[i] = k ? 1 : 0; if (k > 1 && i !== L.shared) { breach[i] = 1; mix = true; } }
  L.flows.forEach(function (f, a) { L.flows.forEach(function (g, b) { if (a !== b && g.dst !== f.dst && pw[a][g.dst]) { breach[g.dst] = 1; mix = true; } }); });
  for (i = 0; i < n; i++) {
    if (!any[i]) continue; r = (i / C) | 0; c = i % C; pp = P(i);
    for (d = 0; d < 4; d++) {
      if (!pp[d]) continue; nr = r + DR[d]; nc = c + DC[d];
      if (nr < 0 || nr >= R || nc < 0 || nc >= C) { leaks++; continue; }
      j = nr * C + nc;
      if (L.tiles[j] && L.tiles[j].t === 'wall') { breach[i] = 1; breach[j] = 1; touch = true; }
      else if (!P(j)[OPP[d]]) leaks++;
    }
  }
  var reach = L.flows.every(function (f, a) { return pw[a][f.dst]; });
  var on = L.nodes.filter(function (x) { return any[x]; }).length, nan = L.nanites.filter(function (x) { return any[x]; }).length;
  return { pw: pw, any: any, breach: breach, mix: mix, touch: touch, leaks: leaks, reach: reach, nodesOn: on, nodesTot: L.nodes.length, nanOn: nan,
    win: reach && on === L.nodes.length && !mix && !touch };
}
/* Tuiles entraînées par un clic sur i : { indice: sens }. */
function linked(L, i, dir) {
  var out = {}, st = [[i, dir]], q;
  while (st.length) { q = st.pop(); if (out[q[0]]) continue; out[q[0]] = q[1]; L.links.forEach(function (l) { if (l.m === q[0]) st.push([l.f, q[1] * l.s]); }); }
  return out;
}
function solvedRot(L, open) { return L.tiles.map(function (t) { return t ? (t.role === 'verrou' && !open ? (t.sol + t.off) % 4 : t.sol) : 0; }); }

if (typeof module !== 'undefined' && module.exports) { module.exports = { STR: STR, LEVELS: LEVELS, buildLevel: buildLevel, evaluate: evaluate, linked: linked, solvedRot: solvedRot, ports: ports }; }
if (typeof document === 'undefined') return;

/* ======================================================================
   3. PRÉFÉRENCES, SAUVEGARDE
   ====================================================================== */
var lang = (document.documentElement.lang || 'fr').slice(0, 2); if (!STR[lang]) lang = 'fr';
var S = STR[lang], NL = LEVELS.length;
var reduced = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
function num(s) { return lang === 'en' ? s : String(s).replace('.', ','); }
function agentName() {
  var p = null; try { p = new URLSearchParams(location.search).get('agent'); } catch (e) {}
  if (!p) { try { p = localStorage.getItem('er_codename') || sessionStorage.getItem('er_codename'); } catch (e) {} }
  return String(p || '').toUpperCase().replace(/[^A-Z0-9_\-]/g, '').slice(0, 16);
}
var SAVE_KEY = 'msc_save_v2', FX_KEY = 'exodus_fx', MUSIC_KEY = 'exodus_music';      // réglages son partagés avec Protocole Exodus
var save = { unlocked: 1, best: {} }, fxOn = true, musicOn = true;
try { var raw = JSON.parse(localStorage.getItem(SAVE_KEY)); if (raw && raw.unlocked) { save.unlocked = Math.max(1, Math.min(NL, raw.unlocked | 0)); save.best = raw.best || {}; save.state = raw.state || null; } } catch (e) {}
try { var pf = localStorage.getItem(FX_KEY), pm = localStorage.getItem(MUSIC_KEY), om = localStorage.getItem('exodus_mute') === '1'; fxOn = pf === null ? !om : pf === '1'; musicOn = pm === null ? !om : pm === '1'; } catch (e) {}
function persist() { try { localStorage.setItem(SAVE_KEY, JSON.stringify(save)); } catch (e) {} }

/* ======================================================================
   4. EFFETS SONORES (Web Audio) : timbres doux, cristallins
   ====================================================================== */
var AC = null, master = null, sfxCount = 0;
function audioInit() {
  if (AC) { if (AC.state === 'suspended') { try { AC.resume(); } catch (e) {} } return; }
  var Cx = window.AudioContext || window.webkitAudioContext; if (!Cx) return;
  try { AC = new Cx(); master = AC.createGain(); master.gain.value = fxOn ? 0.7 : 0; master.connect(AC.destination); } catch (e) { AC = null; }
}
function tone(type, f0, f1, dur, vol, delay) {
  if (!AC || !fxOn) return;
  var t = AC.currentTime + (delay || 0), o = AC.createOscillator(), g = AC.createGain();
  o.type = type; o.frequency.setValueAtTime(f0, t); if (f1 !== f0) o.frequency.exponentialRampToValueAtTime(Math.max(20, f1), t + dur);
  g.gain.setValueAtTime(0.0001, t); g.gain.linearRampToValueAtTime(vol, t + 0.012); g.gain.exponentialRampToValueAtTime(0.0001, t + dur);
  o.connect(g); g.connect(master); o.start(t); o.stop(t + dur + 0.05); sfxCount++;
}
function bell(f, vol, delay) { tone('sine', f, f, 0.7, vol, delay); tone('sine', f * 2.01, f * 2.01, 0.35, vol * 0.35, delay); tone('triangle', f * 3, f * 3, 0.12, vol * 0.15, delay); }
var SCALE = [392, 440, 523.3, 587.3, 659.3, 784, 880, 1046.5, 1174.7, 1318.5, 1568, 1760];
var SFX = {
  rot: function () { tone('triangle', 620, 760, 0.07, 0.07); },
  link: function () { tone('triangle', 620, 760, 0.07, 0.07); tone('sine', 930, 1100, 0.09, 0.05, 0.05); },
  fixed: function () { tone('sine', 150, 110, 0.12, 0.09); },
  node: function (k) { bell(SCALE[k % SCALE.length], 0.09); },
  nodeOff: function () { tone('sine', 420, 300, 0.12, 0.04); },
  breach: function () { tone('sawtooth', 110, 70, 0.3, 0.08); tone('square', 880, 880, 0.08, 0.03); tone('square', 880, 880, 0.08, 0.03, 0.14); },
  unlock: function () { [392, 523.3, 659.3, 784, 1046.5].forEach(function (f, i) { bell(f, 0.08, i * 0.09); }); },
  solve: function () { [196, 261.6, 329.6, 392, 523.3].forEach(function (f, i) { bell(f, 0.08, i * 0.07); }); },
  final: function () { [130.8, 196, 261.6, 392, 523.3, 784].forEach(function (f, i) { bell(f, 0.09, i * 0.14); }); tone('sine', 110, 880, 2.2, 0.05, 0.2); },
  ui: function () { tone('sine', 880, 1100, 0.06, 0.05); },
  beat: function (v) { tone('sine', 62, 44, 0.16, 0.10 * v); tone('sine', 58, 42, 0.14, 0.07 * v, 0.19); }
};
function setFx(v) { fxOn = v; try { localStorage.setItem(FX_KEY, v ? '1' : '0'); } catch (e) {} if (master) master.gain.value = v ? 0.7 : 0; if (v) SFX.ui(); refreshMenus(); }

/* ======================================================================
   5. MUSIQUE : bande originale via le lecteur SoundCloud. Prologue au menu,
      une piste de chapitre tirée au sort pour chaque séquence, Fermentation à la fin.
   ====================================================================== */
var SC_BASE = 'https://soundcloud.com/laurent-prestigiacomo/';
var T_MENU = { t: 'Prologue', u: 'prologue-1' }, T_END = { t: 'Chapitre 26 — Fermentation', u: 'chapitre-26-fermentation-28' };
var POOL = [['1', 'La Graine et le Fleuve', 'chapitre-01-la-graine-et-le-fleuve-2'], ['2', 'La Fugue de la Machine', 'chapitre-02-la-fugue-de-la-machine-3'], ['3', 'Le Gardien des Cendres', 'chapitre-03-le-gardien-des-cendres-4'], ['4', 'Le Protocole Mironen', 'chapitre-04-le-protocole-mironen-5'],
  ['5', 'Écho Rouge', 'chapitre-05-echo-rouge-6'], ['6', 'Un Langage de Symboles', 'chapitre-06-un-langage-de-symboles-7'], ['7', 'Variables Non Contrôlées', '08-chapitre-07-variables-non-controlees-8'], ['8', 'L\'Observateur Silencieux', 'hapitre-08-lobservateur-silencieux-9'],
  ['9', 'Défaillance Cascade', 'hapitre-09-defaillance-cascade-10'], ['10', 'L\'Éveil', 'chapitre-10-leveil-11'], ['11', 'Le Feu Étranger', 'chapitre-11-le-feu-etranger-12'], ['12', 'Les Deux Fois', 'chapitre-12-les-deux-fois-13'],
  ['13', 'Le Fantôme d\'Orpheus', 'chapitre-13-le-fantome-dorpheus-14'], ['14', 'Le Complot des Trois Volets', 'chapitre-14-le-complot-des-trois-volets-15'], ['15', 'L\'Œil du Spectre', 'chapitre-15-loeil-du-spectre-16'], ['16', 'Le Murmure des Symboles', 'chapitre-16-le-murmure-des-symboles-17'],
  ['17', 'Le Souffle Suspendu', 'chapitre-17-le-souffle-suspendu_mastered-18'], ['18', 'L\'Offrande au Feu', 'chapitre-18-loffrande-au-feu_mastered-19'], ['19', 'Trois Fronts, Une Seule Nuit', 'chapitre-19-trois-fronts-une-seule-nuit-20'], ['20', 'Le Prix de la Liberté', 'chapitre-20-le-prix-de-la-liberte-21'],
  ['', 'Interlude — Le Rite des Origines Inconnues', 'interlude-le-rite-des-origines-inconnues-22'], ['21', 'Le Sanctuaire de l\'Amante Timide', 'chapitre-21-le-sanctuaire-de-lamante-timide-23'], ['22', 'Calcination', 'chapitre-22-calcination-24'], ['23', 'Dissolution', 'chapitre-23-dissolution-25'],
  ['24', 'Séparation', 'chapitre-24-separation-26'], ['25', 'Conjonction', 'chapitre-25-conjonction-27'], ['26', 'Fermentation', 'chapitre-26-fermentation-28'], ['27', 'Distillation', 'chapitre-27-distillation-29'],
  ['28', 'Coagulation', 'chapitre-28-coagulation-30'], ['29', 'Sublimation', 'chapitre-29-sublimation-31'], ['30', 'Précipitation', 'chapitre-30-precipitation-32']
].map(function (p) { return { t: (p[0] ? 'Chapitre ' + p[0] + ' — ' : '') + p[1], u: p[2] }; });
var bag = [];
function randomTrack() {                      // tirage sans remise : aucune répétition avant d'avoir tout entendu
  if (!bag.length) { bag = POOL.slice(); for (var i = bag.length - 1; i > 0; i--) { var j = (Math.random() * (i + 1)) | 0, x = bag[i]; bag[i] = bag[j]; bag[j] = x; } }
  return bag.pop();
}
var MUSIC_VOL = 45, MUSIC_WAIT = 5;
var mus = { w: null, ready: false, loading: false, want: T_MENU, cur: null, playing: false, box: null, frame: null, shown: false, nagged: false, timer: 0, err: null, plays: 0, started: false, progAt: 0, lastPos: -1, stalls: 0, loops: 0 };
function showMusicBox(v) { mus.shown = v; if (!mus.box) return; mus.box.style.left = v ? '50%' : '-3000px'; mus.box.style.opacity = v ? '1' : '0'; mus.box.style.pointerEvents = v ? 'auto' : 'none'; }
function musicBox() {
  if (mus.box) return;
  var box = document.createElement('div'), lab = document.createElement('div'), x = document.createElement('button'), fr = document.createElement('iframe');
  box.id = 'music-box';
  box.style.cssText = 'position:fixed;z-index:80;top:8px;width:min(92vw,420px);transform:translateX(-50%);background:#07131e;border:1px solid #c9a24b;padding:8px 10px 10px;box-sizing:border-box;font:13px "JetBrains Mono",monospace;color:#e3be68;';
  lab.textContent = S.tapMusic; lab.style.cssText = 'padding:0 34px 6px 2px;';
  x.type = 'button'; x.textContent = '✕'; x.setAttribute('aria-label', S.back);
  x.style.cssText = 'position:absolute;top:2px;right:4px;width:34px;height:28px;background:none;border:0;color:#e3be68;font:inherit;cursor:pointer;';
  x.addEventListener('click', function () { mus.nagged = true; showMusicBox(false); });
  fr.allow = 'autoplay; encrypted-media'; fr.setAttribute('scrolling', 'no'); fr.setAttribute('frameborder', '0'); fr.title = 'SoundCloud';
  fr.style.cssText = 'display:block;width:100%;height:120px;border:0;';
  fr.src = 'https://w.soundcloud.com/player/?url=' + encodeURIComponent(SC_BASE + mus.want.u) + '&auto_play=true&color=%23c9a24b&hide_related=true&show_comments=false&show_user=false&show_reposts=false&show_teaser=false&visual=false';
  box.appendChild(lab); box.appendChild(x); box.appendChild(fr); document.body.appendChild(box);
  mus.box = box; mus.frame = fr; showMusicBox(false);
}
function musicApply() {
  if (!mus.ready) return;
  var w = mus.w;
  if (!musicOn) { w.pause(); return; }
  if (mus.cur !== mus.want) {
    mus.cur = mus.want; mus.playing = false; mus.started = false; mus.progAt = performance.now();
    w.load(SC_BASE + mus.cur.u, { auto_play: true, hide_related: true, show_comments: false, show_user: false, show_reposts: false, show_teaser: false, visual: false, callback: function () { w.setVolume(MUSIC_VOL); if (musicOn) w.play(); } });
  } else if (!mus.playing) w.play();
  mus.timer = MUSIC_WAIT;
}
function musicReload() { if (!mus.ready || !musicOn) return; mus.cur = null; musicApply(); }
function musicInit() {
  if (!musicOn || mus.loading || mus.w) return;
  mus.loading = true; mus.cur = mus.want; musicBox();
  var sc = document.createElement('script'); sc.src = 'https://w.soundcloud.com/player/api.js';
  sc.onload = function () {
    try {
      var w = window.SC.Widget(mus.frame), EV = window.SC.Widget.Events;
      w.bind(EV.READY, function () { mus.w = w; mus.ready = true; w.setVolume(MUSIC_VOL); musicApply(); });
      w.bind(EV.PLAY, function () { mus.playing = true; mus.plays++; mus.started = true; mus.progAt = performance.now(); w.setVolume(MUSIC_VOL); if (mus.shown) { showMusicBox(false); try { window.focus(); } catch (e) {} } if (!musicOn || document.hidden) w.pause(); });
      w.bind(EV.PAUSE, function () { mus.playing = false; });
      w.bind(EV.PLAY_PROGRESS, function (o) { if (o && o.currentPosition !== mus.lastPos) { mus.lastPos = o.currentPosition; mus.progAt = performance.now(); mus.stalls = 0; } });
      w.bind(EV.FINISH, function () { mus.playing = false; mus.loops++; if (musicOn) setTimeout(musicReload, 300); });   // boucle : on recharge la piste
      w.bind(EV.ERROR, function () { mus.err = 'lecteur'; });
    } catch (e) { mus.err = 'api'; }
  };
  sc.onerror = function () { mus.err = 'reseau'; mus.loading = false; };
  document.head.appendChild(sc);
}
function setTrack(tr) { mus.want = tr; if (musicOn && mus.ready) musicApply(); }
function setMusicOn(v) {
  musicOn = v; try { localStorage.setItem(MUSIC_KEY, v ? '1' : '0'); } catch (e) {}
  if (v) { mus.nagged = false; if (!mus.w && !mus.loading) musicInit(); else musicApply(); } else { if (mus.ready) mus.w.pause(); showMusicBox(false); }
  SFX.ui(); refreshMenus();
}
function musicFrame(dt) {
  if (!musicOn || !mus.ready || document.hidden) return;
  if (!mus.playing) { if (mus.timer > 0) { mus.timer -= dt; if (mus.timer <= 0 && !mus.nagged && !mus.shown) showMusicBox(true); } return; }
  if (mus.started && mus.stalls < 3 && performance.now() - mus.progAt > 7000) { mus.stalls++; musicReload(); }
}
document.addEventListener('visibilitychange', function () { if (!mus.ready) return; if (document.hidden) mus.w.pause(); else if (musicOn) musicApply(); });
function gesture() { audioInit(); musicInit(); }

/* ======================================================================
   6. ÉTAT DU JEU
   ====================================================================== */
var L = null, rot = [], ang = [], startRot = [], ev = null, cur = 0, moves = 0, solved = false, unlocked = false, playing = false;
var hover = -1, kbd = -1, track = null, solveT = 0, shake = {}, flashLink = 0, gaugeFrom = null;

function applyRot(i, dir, anim) {
  var g = linked(L, i, dir), n = 0;
  Object.keys(g).forEach(function (k) { rot[k] = (rot[k] + g[k] + 4) % 4; if (anim) ang[k] -= g[k]; n++; });
  return n;
}
function scramble() {
  var free = [], i, k, tries = 0;
  L.tiles.forEach(function (t, x) { if (t && !t.locked) free.push(x); });
  do {
    rot = solvedRot(L, false);
    free.sort(function () { return Math.random() - 0.5; }).forEach(function (x) { k = (Math.random() * 4) | 0; while (k--) applyRot(x, 1, false); });
    ev = evaluate(L, rot); tries++;
    var off = L.flows.reduce(function (s, f) { return s + f.path.filter(function (x) { var t = L.tiles[x]; return !t.locked && ports(t.t, rot[x]).join() !== ports(t.t, t.sol).join(); }).length; }, 0);
  } while ((ev.win || off < 3) && tries < 60);
  startRot = rot.slice();
}
/* Partie en cours : séquence, position des tuiles et nombre de coups, enregistrés à chaque geste. */
function keep() { save.state = solved ? null : { lvl: cur, rot: rot.slice(), start: startRot.slice(), moves: moves, open: unlocked }; persist(); }
function validState(st, i) { return st && st.lvl === i && Array.isArray(st.rot) && Array.isArray(st.start) && st.rot.length === L.tiles.length && st.start.length === L.tiles.length && st.rot.every(function (v) { return v === 0 || v === 1 || v === 2 || v === 3; }); }
function loadLevel(i, st) {
  cur = i; L = buildLevel(i); unlocked = false; solved = false; moves = 0; hover = -1; kbd = -1; solveT = 0; shake = {};
  if (validState(st, i)) { rot = st.rot.slice(); startRot = st.start.slice(); moves = st.moves | 0; unlocked = !!st.open; ev = evaluate(L, rot); if (ev.win) { st = null; } }
  if (!validState(st, i)) { unlocked = false; moves = 0; scramble(); }
  ang = rot.map(function () { return 0; }); layout(); updateHud();
}
function resetLevel() { if (!L || solved) return; rot = startRot.slice(); ang = rot.map(function () { return 0; }); unlocked = false; moves = 0; ev = evaluate(L, rot); updateHud(); keep(); SFX.ui(); }
function after(prev) {
  ev = evaluate(L, rot);
  if (L.verrous.length && !unlocked && ev.nanOn === L.nanites.length) {       // les trois nanites réveillées : le verrou cède
    unlocked = true; L.verrous.forEach(function (x) { var t = L.tiles[x]; ang[x] += t.off; rot[x] = t.sol; }); ev = evaluate(L, rot); SFX.unlock(); flashLink = 1;
  }
  if (ev.nodesOn > prev.nodesOn) SFX.node(ev.nodesOn - 1); else if (ev.nodesOn < prev.nodesOn) SFX.nodeOff();
  if ((ev.mix || ev.touch) && !(prev.mix || prev.touch)) SFX.breach();
  updateHud();
  if (ev.win) win(); else keep();
}
function act(i, dir) {
  if (!playing || solved || i < 0 || !L.tiles[i]) return;
  gesture();
  var t = L.tiles[i];
  if (t.locked) { SFX.fixed(); shake[i] = 1; return; }
  var prev = ev, n = applyRot(i, dir, true); moves++;
  if (n > 1) { SFX.link(); flashLink = 1; } else SFX.rot();
  after(prev);
}
function win() {
  solved = true; solveT = 0;
  var n = cur + 1, isBest = !save.best[n] || moves < save.best[n];
  if (isBest) save.best[n] = moves;
  if (n < NL) save.unlocked = Math.max(save.unlocked, n + 1);
  save.state = null; persist(); updateHud();
  if (n === NL) SFX.final(); else SFX.solve();
  setTimeout(function () { if (n === NL) showEnd(); else showSolved(isBest); }, n === NL ? 3200 : 1500);
}

/* ======================================================================
   7. INTERFACE (éléments HTML par-dessus le canvas)
   ====================================================================== */
var ui = document.getElementById('ui'), $ = {};
function el(tag, cls, txt, parent) { var e = document.createElement(tag); if (cls) e.className = cls; if (txt !== undefined && txt !== null) e.textContent = txt; if (parent) parent.appendChild(e); return e; }
function btn(txt, fn, parent, cls) { var b = el('button', 'btn' + (cls ? ' ' + cls : ''), txt, parent); b.type = 'button'; b.addEventListener('click', function () { gesture(); SFX.ui(); fn(); }); return b; }
function overlay(id) { var o = el('div', 'ov', null, ui); o.id = id; var c = el('div', 'card', null, o); $[id] = c; return o; }
function show(id) { Array.prototype.forEach.call(ui.querySelectorAll('.ov'), function (o) { o.classList.toggle('show', o.id === id); }); playing = !id; document.body.classList.toggle('playing', !id); if (id) { var b = document.querySelector('#' + id + ' .btn'); if (b) b.focus(); } }
function onoff(v) { return v ? S.on : S.off; }

(function buildUi() {
  var top = el('header', null, null, ui); top.id = 'hud-top';
  var tl = el('div', 'tl', null, top); $.tag = el('div', 'tag', '', tl); $.name = el('div', 'nm', '', tl);
  var tr = el('div', 'tr', null, top); $.moves = el('span', 'mv', '', tr);
  var rb = el('button', 'ic', '↺', tr); rb.type = 'button'; rb.title = S.restart; rb.setAttribute('aria-label', S.restart); rb.addEventListener('click', resetLevel);
  var mb = el('button', 'ic', '☰', tr); mb.type = 'button'; mb.title = S.menu; mb.setAttribute('aria-label', S.menu); mb.addEventListener('click', function () { gesture(); if (playing) openPause(); });
  var bot = el('footer', null, null, ui); bot.id = 'hud-bottom';
  $.goal = el('p', 'goal', '', bot); var g = el('div', 'gauges', null, bot); $.g1 = el('span', 'g', '', g); $.g2 = el('span', 'g', '', g); $.st = el('span', 'g st', '', g);
  $.live = el('div', 'sr', '', ui); $.live.setAttribute('aria-live', 'polite');
  ['ov-warn', 'ov-title', 'ov-levels', 'ov-intro', 'ov-pause', 'ov-solved', 'ov-end'].forEach(overlay);
})();
function refreshMenus() { if ($['ov-title'] && $['ov-title'].parentNode.classList.contains('show')) showTitle(); if ($['ov-pause'] && $['ov-pause'].parentNode.classList.contains('show')) openPause(); }
function soundButtons(c) {
  var row = el('div', 'row', null, c);
  btn(S.music + ' : ' + onoff(musicOn), function () { setMusicOn(!musicOn); }, row, 'small');
  btn(S.fx + ' : ' + onoff(fxOn), function () { setFx(!fxOn); }, row, 'small');
}
var WARN_KEY = 'msc_spoiler_ack';
function showWarn() {                         // avertissement une fois par session, avant le menu
  var ok = false; try { ok = sessionStorage.getItem(WARN_KEY) === '1'; } catch (e) {}
  if (ok) { showTitle(); return; }
  var c = $['ov-warn']; c.innerHTML = '';
  el('div', 'kicker', S.warnHead, c); el('p', 'goaltxt', S.warn, c);
  btn(S.warnGo, function () { try { sessionStorage.setItem(WARN_KEY, '1'); } catch (e) {} showTitle(); }, c);
  var q = el('a', 'btn ghost', S.quit, c); q.href = 'echo-rouge-v2.html';
  show('ov-warn');
}
function showTitle() {
  var c = $['ov-title']; c.innerHTML = ''; L = L || null;
  el('div', 'kicker', 'MSC // ÉCHO ROUGE' + (agentName() ? ' // ' + S.agent + ' ' + agentName() : ''), c);
  el('h1', 'ttl', S.name, c); el('div', 'sub', S.sub, c);
  el('p', 'quote', S.epi, c); el('p', 'by', '— ' + S.epiBy, c);
  var st = save.state && save.state.lvl >= 0 && save.state.lvl < NL ? save.state : null, ci = st ? st.lvl : save.unlocked - 1;
  if (st || save.unlocked > 1 || save.best[1]) btn(S.cont + ' — ' + S.seq + ' ' + pad2(ci + 1) + (st && st.moves ? ' · ' + st.moves + ' ' + S.moves : ''), function () { showIntro(ci, st); }, c);
  btn(S.neu, function () { showIntro(0); }, c);
  btn(S.levels, showLevels, c);
  soundButtons(c);
  var q = el('a', 'btn ghost', S.quit, c); q.href = 'echo-rouge-v2.html';
  el('p', 'hint', S.hintKeys, c);
  if (musicOn) el('p', 'trk', '♪ ' + T_MENU.t + ' — Laurent Prestigiacomo', c);
  setTrack(T_MENU); show('ov-title');
}
function pad2(n) { return (n < 10 ? '0' : '') + n; }
function showLevels() {
  var c = $['ov-levels']; c.innerHTML = ''; el('h2', 'ttl small', S.levels, c);
  var list = el('div', 'list', null, c);
  S.lv.forEach(function (v, i) {
    var open = i < save.unlocked, b = el('button', 'lvl' + (open ? '' : ' off'), null, list); b.type = 'button'; b.disabled = !open;
    el('span', 'n', pad2(i + 1), b); el('span', 't', v.title, b); el('span', 'b', open ? (save.best[i + 1] ? save.best[i + 1] + ' ' + S.moves : '—') : S.locked, b);
    if (open) b.addEventListener('click', function () { gesture(); SFX.ui(); showIntro(i, save.state && save.state.lvl === i ? save.state : null); });
  });
  btn(S.back, showTitle, c, 'ghost'); show('ov-levels');
}
function showIntro(i, st) {
  loadLevel(i, st); track = randomTrack(); setTrack(track);
  var v = S.lv[i], c = $['ov-intro']; c.innerHTML = '';
  el('div', 'kicker', S.seq + ' ' + pad2(i + 1) + ' / ' + NL + (v.time ? '  ·  ' + v.time : '') + (v.cd ? '  ·  ' + v.cd : ''), c);
  el('div', 'place', v.place, c); el('h2', 'ttl small', v.title, c);
  el('p', 'quote', v.quote, c); el('p', 'goaltxt', v.goal, c);
  if (musicOn) el('p', 'trk', '♪ ' + track.t, c);
  btn(S.start, function () { show(null); }, c);
  show('ov-intro');
}
function openPause() {
  var c = $['ov-pause']; c.innerHTML = ''; el('h2', 'ttl small', S.pause, c);
  el('p', 'goaltxt', S.lv[cur].goal, c);
  btn(S.resume, function () { show(null); }, c);
  btn(S.restart, function () { resetLevel(); show(null); }, c);
  btn(S.levels, showLevels, c);
  soundButtons(c);
  btn(S.menu, showTitle, c, 'ghost');
  show('ov-pause');
}
function showSolved(isBest) {
  var v = S.lv[cur], c = $['ov-solved']; c.innerHTML = '';
  el('div', 'kicker', S.seq + ' ' + pad2(cur + 1) + ' / ' + NL, c); el('h2', 'ttl small', S.solved, c);
  el('p', 'quote', v.out, c);
  el('p', 'by', moves + ' ' + S.moves + '  ·  ' + S.best + ' : ' + save.best[cur + 1] + (isBest ? ' ★' : ''), c);
  btn(S.next, function () { showIntro(cur + 1); }, c); btn(S.menu, showTitle, c, 'ghost');
  show('ov-solved');
}
function showEnd() {
  var c = $['ov-end']; c.innerHTML = ''; setTrack(T_END);
  el('div', 'kicker', S.diff + ' 100 %', c); el('h2', 'ttl', S.endTitle, c);
  el('p', 'quote', S.end1, c); el('p', 'quote strong', S.end2, c);
  if (musicOn) el('p', 'trk', '♪ ' + T_END.t, c);
  btn(S.replay, function () { showIntro(0); }, c); btn(S.menu, showTitle, c, 'ghost');
  show('ov-end');
}
function gaugeVals() {                        // jauges du récit : valeurs du chapitre, avant puis après la séquence
  var d = L.def, k = solved ? 1 : 0, o = [];
  o.push(S.corr + ' ' + d.corr[k] + ' / 147');
  if (d.diff) o.push(S.diff + ' ' + (solved ? '100' : '0') + ' %');
  else if (d.desync) o.push(S.desync + ' ' + num((Math.round(ev.nodesOn / (ev.nodesTot + L.lost.length) * 1000) / 10).toFixed(1)) + ' %');
  else if (d.sig) o.push(S.sig + ' ' + d.sig[k] + ' %');
  return o;
}
function updateHud() {
  if (!L) return;
  var v = S.lv[cur], g = gaugeVals();
  $.tag.textContent = S.seq + ' ' + pad2(cur + 1) + ' / ' + NL; $.name.textContent = v.title; $.moves.textContent = moves + ' ' + S.moves; $.goal.textContent = v.goal;
  $.g1.textContent = g[0]; $.g2.textContent = g[1] || ''; $.g2.style.display = g[1] ? '' : 'none';
  var st = ev.touch ? S.stBreach : ev.mix ? S.stMix : (L.verrous.length ? (unlocked ? S.stOpen : S.stLock) + ' · ' : '') + (ev.nodesTot ? S.stNodes + ' ' + ev.nodesOn + '/' + ev.nodesTot : (ev.reach ? S.stOk : ''));
  $.st.textContent = st; $.st.classList.toggle('bad', !!(ev.touch || ev.mix)); $.live.textContent = st;
}

/* ======================================================================
   8. RENDU ISOMÉTRIQUE
   ====================================================================== */
var cv = document.getElementById('msc'), ctx = cv.getContext('2d'), VW = 0, VH = 0, geo = { tw: 60, th: 30, d: 8, cx: 0, y0: 0, orbX: 0, orbY: 0 }, time = 0, bob = 0, beatPh = 0, stars = [];
var COL = { c: '#7ad7f0', g: '#e3be68', r: '#ff5a6a' }, LINKCOL = ['#e3be68', '#ff9f5a', '#b48cff', '#7af0c8'];
for (var si = 0; si < 150; si++) stars.push([Math.random(), Math.random(), Math.random() * 1.4 + 0.3, Math.random() * 6.28, Math.random() < 0.18]);
function layout() {
  var dpr = Math.min(2, window.devicePixelRatio || 1); VW = window.innerWidth; VH = window.innerHeight;
  cv.width = Math.round(VW * dpr); cv.height = Math.round(VH * dpr); ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  var rows = L ? L.rows : 5, cols = L ? L.cols : 5, span = rows + cols;
  var top = (document.getElementById('hud-top').offsetHeight || 52) + 4, bot = (document.getElementById('hud-bottom').offsetHeight || 84) + 4, avail = Math.max(160, VH - top - bot);
  var tw = Math.min(VW * 0.96 / (span / 2), avail / (span / 4 + 1.55)); tw = Math.max(26, Math.min(128, tw));
  geo.tw = tw; geo.th = tw / 2; geo.d = tw * 0.13;
  geo.cx = VW / 2 - (cols - rows) * tw / 4;
  geo.y0 = top + (avail - (span * tw / 4 + 1.55 * tw)) / 2 + tw * 0.12;
  geo.orbX = VW / 2; geo.orbY = geo.y0 + span * tw / 4 + tw * 0.92;
}
window.addEventListener('resize', layout);
function PX(r, c) { return geo.cx + (c - r) * geo.tw / 2; }
function PY(r, c) { return geo.y0 + bob + (c + r) * geo.th / 2; }
function pick(x, y) {
  if (!L) return -1;
  var u = (x - geo.cx) / (geo.tw / 2), v = (y - geo.y0 - bob) / (geo.th / 2), c = Math.floor((u + v) / 2), r = Math.floor((v - u) / 2);
  return (r < 0 || c < 0 || r >= L.rows || c >= L.cols || !L.tiles[r * L.cols + c]) ? -1 : r * L.cols + c;
}
function rgba(hex, a) { var n = parseInt(hex.slice(1), 16); return 'rgba(' + (n >> 16) + ',' + ((n >> 8) & 255) + ',' + (n & 255) + ',' + a + ')'; }
function heart(p) { return Math.max(Math.exp(-p * 9), 0.75 * Math.exp(-Math.pow((p - 0.27) * 11, 2))); }

function drawSpace() {
  var g = ctx.createRadialGradient(VW / 2, VH * 0.3, 20, VW / 2, VH * 0.5, Math.max(VW, VH) * 0.8);
  g.addColorStop(0, '#0a1a2a'); g.addColorStop(0.55, '#040b14'); g.addColorStop(1, '#010306'); ctx.fillStyle = g; ctx.fillRect(0, 0, VW, VH);
  for (var i = 0; i < stars.length; i++) { var s = stars[i], a = 0.25 + 0.55 * Math.abs(Math.sin(time * 0.6 + s[3])); ctx.fillStyle = s[4] ? 'rgba(227,190,104,' + a + ')' : 'rgba(200,225,245,' + a * 0.8 + ')'; ctx.fillRect(s[0] * VW, (s[1] * VH + time * s[2] * 1.2) % VH, s[2], s[2]); }
}
function drawNaos(beat, energy) {
  var x = geo.orbX, y = geo.orbY, R0 = geo.tw * 0.36 * (1 + 0.12 * beat), k, g, top = geo.y0 + bob + (L.rows + L.cols) * geo.th / 2;
  /* faisceau vers le dessous du plateau */
  g = ctx.createLinearGradient(0, y, 0, top - geo.tw * 0.4); g.addColorStop(0, rgba('#7ad7f0', 0.10 + 0.30 * energy * (0.5 + 0.5 * beat))); g.addColorStop(1, 'rgba(122,215,240,0)');
  ctx.fillStyle = g; ctx.beginPath(); ctx.moveTo(x - R0 * 0.7, y); ctx.lineTo(x - geo.tw * (1.2 + energy), top - geo.tw * 0.4); ctx.lineTo(x + geo.tw * (1.2 + energy), top - geo.tw * 0.4); ctx.lineTo(x + R0 * 0.7, y); ctx.closePath(); ctx.fill();
  g = ctx.createRadialGradient(x, y, 2, x, y, R0 * 5); g.addColorStop(0, rgba('#3ba4c7', 0.26 + 0.22 * beat)); g.addColorStop(1, 'rgba(59,164,199,0)'); ctx.fillStyle = g; ctx.fillRect(x - R0 * 5, y - R0 * 5, R0 * 10, R0 * 10);
  ctx.lineWidth = Math.max(1, geo.tw * 0.022);
  for (k = 0; k < 6; k++) {                    // anneaux : cercles horizontaux vus en isométrie
    var rx = R0 * (1.5 + k * 0.72) * (1 + 0.04 * beat * (k % 2 ? 1 : -1)), a0 = time * (0.22 + 0.06 * k) * (k % 2 ? -1 : 1) + k * 1.3;
    ctx.strokeStyle = k % 2 ? rgba('#c9a24b', 0.55 - k * 0.06) : rgba('#3ba4c7', 0.6 - k * 0.06);
    ctx.beginPath(); ctx.ellipse(x, y, rx, rx * 0.5, 0, a0, a0 + Math.PI * (0.8 + 0.45 * Math.abs(Math.sin(k * 2.1)))); ctx.stroke();
    ctx.fillStyle = k % 2 ? '#e3be68' : '#7ad7f0'; ctx.beginPath(); ctx.arc(x + Math.cos(a0) * rx, y + Math.sin(a0) * rx * 0.5, Math.max(1.2, geo.tw * 0.025), 0, 6.3); ctx.fill();
  }
  g = ctx.createRadialGradient(x, y - R0 * 0.1, 1, x, y, R0); g.addColorStop(0, '#ffffff'); g.addColorStop(0.35, '#9be4f7'); g.addColorStop(0.8, '#2b88ac'); g.addColorStop(1, 'rgba(43,136,172,0.2)');
  ctx.fillStyle = g; ctx.beginPath(); ctx.arc(x, y, R0, 0, 6.3); ctx.fill();
  ctx.strokeStyle = rgba('#e3be68', 0.9); ctx.lineWidth = Math.max(1.2, geo.tw * 0.03); ctx.beginPath(); ctx.arc(x, y, R0 * 1.12, 0, 6.3); ctx.stroke();
  if (geo.tw > 40) { ctx.fillStyle = rgba('#e3be68', 0.85); ctx.font = '600 ' + Math.max(9, geo.tw * 0.15) + 'px "JetBrains Mono",monospace'; ctx.textAlign = 'center'; ctx.textBaseline = 'top'; ctx.fillText('NAOS-9', x, y + R0 * 1.35); }
}
function tilePath(r, c, lift) { ctx.beginPath(); ctx.moveTo(PX(r, c), PY(r, c) - lift); ctx.lineTo(PX(r, c + 1), PY(r, c + 1) - lift); ctx.lineTo(PX(r + 1, c + 1), PY(r + 1, c + 1) - lift); ctx.lineTo(PX(r + 1, c), PY(r + 1, c) - lift); ctx.closePath(); }
function local(r, c, dr, dc, lift) { return [PX(r + 0.5 + dr, c + 0.5 + dc), PY(r + 0.5 + dr, c + 0.5 + dc) - lift]; }
function conduit(t, r, c, a, lift, col, lw) {
  var base = BASE[t.t], th = a * Math.PI / 2, cs = Math.cos(th), sn = Math.sin(th), V = [[-0.5, 0], [0, 0.5], [0.5, 0], [0, -0.5]], ce = local(r, c, 0, 0, lift), d, p;
  ctx.strokeStyle = col; ctx.lineWidth = lw; ctx.lineCap = 'round'; ctx.lineJoin = 'round'; ctx.beginPath();
  for (d = 0; d < 4; d++) { if (!base[d]) continue; p = local(r, c, V[d][0] * cs + V[d][1] * sn, -V[d][0] * sn + V[d][1] * cs, lift); ctx.moveTo(p[0], p[1]); ctx.lineTo(ce[0], ce[1]); }
  ctx.stroke();
}
function label(txt, x, y, col) { if (!txt || geo.tw < 40) return; ctx.font = '600 ' + Math.max(8, geo.tw * 0.14) + 'px "JetBrains Mono",monospace'; ctx.textAlign = 'center'; ctx.textBaseline = 'middle'; ctx.fillStyle = 'rgba(2,6,12,0.75)'; var w = ctx.measureText(txt).width + 6; ctx.fillRect(x - w / 2, y - geo.tw * 0.09, w, geo.tw * 0.18); ctx.fillStyle = col; ctx.fillText(txt, x, y + 0.5); }
function txtOf(s) { if (!s) return ''; if (s === '@decoy') return S.decoy; if (s.charAt(0) === '@') return S.nan[+s.slice(1)]; return /^0\.\d+$/.test(s) ? num(s) : s; }
function crystal(x, y, s, lit, col) {
  if (lit) { var g = ctx.createRadialGradient(x, y, 1, x, y, s * 3); g.addColorStop(0, rgba(col, 0.55)); g.addColorStop(1, rgba(col, 0)); ctx.fillStyle = g; ctx.fillRect(x - s * 3, y - s * 3, s * 6, s * 6); }
  ctx.beginPath(); ctx.moveTo(x, y - s); ctx.lineTo(x + s * 0.62, y); ctx.lineTo(x, y + s); ctx.lineTo(x - s * 0.62, y); ctx.closePath();
  ctx.fillStyle = lit ? col : 'rgba(30,46,62,0.9)'; ctx.fill(); ctx.strokeStyle = lit ? '#ffffff' : 'rgba(150,180,200,0.7)'; ctx.lineWidth = 1; ctx.stroke();
  ctx.beginPath(); ctx.moveTo(x - s * 0.62, y); ctx.lineTo(x + s * 0.62, y); ctx.strokeStyle = lit ? 'rgba(255,255,255,0.7)' : 'rgba(150,180,200,0.35)'; ctx.stroke();
}
function drawTile(i, beat) {
  var t = L.tiles[i]; if (!t) return;
  var r = (i / L.cols) | 0, c = i % L.cols, tw = geo.tw, hot = (i === hover || i === kbd) && playing && !solved;
  var lift = (hot && !t.locked ? tw * 0.07 : 0) + (solved ? Math.max(0, Math.sin(solveT * 5 - (r + c) * 0.55)) * tw * 0.10 * Math.max(0, 1 - solveT / 2.2) : 0);
  var sx = shake[i] ? Math.sin(shake[i] * 40) * 2.5 * shake[i] : 0, d = geo.d, on = ev.any[i], br = ev.breach[i], blink = 0.5 + 0.5 * Math.sin(time * 14);
  var fl = -1; ev.pw.forEach(function (p, k) { if (fl < 0 && p[i]) fl = k; });
  var col = br ? COL.r : fl >= 0 ? COL[L.flows[fl].col] : '#7a93a8';
  ctx.save(); ctx.translate(sx, 0);
  /* flancs */
  ctx.beginPath(); ctx.moveTo(PX(r + 1, c), PY(r + 1, c) - lift); ctx.lineTo(PX(r + 1, c + 1), PY(r + 1, c + 1) - lift); ctx.lineTo(PX(r + 1, c + 1), PY(r + 1, c + 1) - lift + d); ctx.lineTo(PX(r + 1, c), PY(r + 1, c) - lift + d); ctx.closePath();
  ctx.fillStyle = t.t === 'wall' ? 'rgba(70,20,28,0.55)' : 'rgba(24,70,96,0.50)'; ctx.fill();
  ctx.beginPath(); ctx.moveTo(PX(r, c + 1), PY(r, c + 1) - lift); ctx.lineTo(PX(r + 1, c + 1), PY(r + 1, c + 1) - lift); ctx.lineTo(PX(r + 1, c + 1), PY(r + 1, c + 1) - lift + d); ctx.lineTo(PX(r, c + 1), PY(r, c + 1) - lift + d); ctx.closePath();
  ctx.fillStyle = t.t === 'wall' ? 'rgba(50,14,20,0.6)' : 'rgba(12,44,66,0.58)'; ctx.fill();
  /* dessus */
  tilePath(r, c, lift);
  ctx.fillStyle = t.t === 'wall' ? 'rgba(40,10,16,0.82)' : hot ? 'rgba(20,50,74,0.94)' : on ? 'rgba(10,32,50,0.90)' : 'rgba(7,20,33,0.86)'; ctx.fill();
  if (on && !br) { ctx.fillStyle = rgba(col, 0.07 + 0.05 * beat); ctx.fill(); }
  if (br) { ctx.fillStyle = rgba(COL.r, 0.14 + 0.18 * blink); ctx.fill(); }
  ctx.lineWidth = 1; ctx.strokeStyle = t.t === 'wall' ? rgba(COL.r, 0.5) : t.locked ? rgba('#e3be68', 0.85) : hot ? rgba('#7ad7f0', 0.95) : rgba('#c9a24b', 0.38); ctx.stroke();
  var ce = local(r, c, 0, 0, lift), lw = Math.max(2, tw * 0.085), a = ((L.tiles[i].role === 'verrou' && !unlocked) ? rot[i] : rot[i]) + ang[i];
  if (t.t !== 'wall') {
    if (on) conduit(t, r, c, a, lift, rgba(col, 0.20), lw * 2.6);
    conduit(t, r, c, a, lift, on ? col : 'rgba(120,150,175,0.55)', lw);
    if (on && !reduced) { ctx.setLineDash([tw * 0.07, tw * 0.42]); ctx.lineDashOffset = -time * tw * 0.7; conduit(t, r, c, a, lift, 'rgba(255,255,255,0.75)', lw * 0.45); ctx.setLineDash([]); }
  }
  /* rôles */
  var up = tw * 0.30, yb = Math.sin(time * 2 + i) * tw * 0.02, lc;
  if (t.role === 'source') {
    lc = COL[L.flows.filter(function (f) { return f.src === i; })[0].col];
    ctx.strokeStyle = lc; ctx.lineWidth = Math.max(1.5, tw * 0.03); ctx.beginPath(); ctx.ellipse(ce[0], ce[1], tw * 0.22, tw * 0.11, 0, 0, 6.3); ctx.stroke();
    var g = ctx.createLinearGradient(0, ce[1], 0, ce[1] - tw * 0.7); g.addColorStop(0, rgba(lc, 0.75)); g.addColorStop(1, rgba(lc, 0)); ctx.fillStyle = g; ctx.fillRect(ce[0] - tw * 0.05, ce[1] - tw * 0.7, tw * 0.10, tw * 0.7);
    label(txtOf(t.label), ce[0], ce[1] - tw * 0.62, lc);
  } else if (t.role === 'sink' || t.role === 'us' || t.role === 'hub') {
    lc = t.role === 'us' ? '#ffffff' : COL[L.flows.filter(function (f) { return f.dst === i; })[0].col];
    var big = t.role === 'hub' ? 1.3 : 1, lit = on && !br;
    for (var k = 0; k < 2; k++) { ctx.strokeStyle = rgba(lc, lit ? 0.95 : 0.5); ctx.lineWidth = Math.max(1.5, tw * 0.03); ctx.beginPath(); ctx.ellipse(ce[0], ce[1] - k * tw * 0.12 * (lit ? 1 + 0.3 * beat : 1), tw * (0.26 - k * 0.07) * big, tw * (0.13 - k * 0.035) * big, 0, 0, 6.3); ctx.stroke(); }
    if (lit) crystal(ce[0], ce[1] - tw * 0.36 + yb, tw * 0.13 * big, true, lc);
    label(txtOf(t.label) || (t.role === 'us' ? S.us : ''), ce[0], ce[1] - tw * 0.62, lc);
  } else if (t.role === 'node' || t.role === 'nanite') {
    crystal(ce[0], ce[1] - up + yb, tw * (t.role === 'nanite' ? 0.11 : 0.14), on && !br, t.role === 'nanite' ? '#7af0c8' : '#e3be68');
    label(txtOf(t.label), ce[0], ce[1] - up - tw * 0.26, on ? '#ffffff' : '#9fb3c8');
  } else if (t.role === 'lost') {
    ctx.globalAlpha = 0.45 + 0.2 * Math.sin(time * 9 + 2); crystal(ce[0], ce[1] - up, tw * 0.13, false, '#888'); ctx.globalAlpha = 1; label(S.old, ce[0], ce[1] - up - tw * 0.26, '#8794a0');
  } else if (t.role === 'verrou') {
    lc = unlocked ? '#e3be68' : COL.r; var s = tw * 0.10, y = ce[1] - up;
    ctx.strokeStyle = lc; ctx.lineWidth = Math.max(1.5, tw * 0.03); ctx.beginPath(); ctx.arc(ce[0] + (unlocked ? s * 0.9 : 0), y - s * 0.7, s * 0.7, Math.PI, 0); ctx.stroke();
    ctx.fillStyle = rgba(lc, 0.9); ctx.fillRect(ce[0] - s, y - s * 0.7, s * 2, s * 1.5); label(t.label, ce[0], y - tw * 0.30, lc);
  } else if (t.role === 'fil') {
    var p0 = local(r, c, 0, -0.5, lift + tw * 0.16), p1 = local(r, c, 0, 0.5, lift + tw * 0.16), q0 = local(r, c, 0, -0.5, lift), q1 = local(r, c, 0, 0.5, lift);
    ctx.strokeStyle = rgba(COL.r, 0.35); ctx.lineWidth = 1; ctx.beginPath(); ctx.moveTo(q0[0], q0[1]); ctx.lineTo(p0[0], p0[1]); ctx.moveTo(q1[0], q1[1]); ctx.lineTo(p1[0], p1[1]); ctx.stroke();
    ctx.strokeStyle = rgba(COL.r, br ? 0.5 + 0.5 * blink : 0.55 + 0.25 * Math.sin(time * 3 + c)); ctx.lineWidth = br ? 3 : 1.5; ctx.beginPath(); ctx.moveTo(p0[0], p0[1]); ctx.lineTo(p1[0], p1[1]); ctx.stroke();
    ctx.strokeStyle = rgba(COL.r, 0.14); ctx.lineWidth = tw * 0.09; ctx.stroke();
  } else if (t.role === 'agent') {
    var h = tw * 0.42, w = tw * 0.11, al = br ? 0.6 + 0.4 * blink : 0.62;
    ctx.fillStyle = rgba(COL.r, 0.16); ctx.beginPath(); ctx.ellipse(ce[0], ce[1], tw * 0.24, tw * 0.12, 0, 0, 6.3); ctx.fill();
    ctx.fillStyle = rgba(COL.r, al); ctx.fillRect(ce[0] - w, ce[1] - h, w * 2, h * 0.78); ctx.beginPath(); ctx.arc(ce[0], ce[1] - h - w * 0.9, w * 0.95, 0, 6.3); ctx.fill();
    ctx.fillStyle = 'rgba(255,255,255,0.85)'; ctx.fillRect(ce[0] - w * 0.7, ce[1] - h - w * 1.1, w * 1.4, w * 0.35);
  }
  ctx.restore();
}
function drawLinks() {
  var mi = {}, n = 0;
  L.links.forEach(function (l) {
    if (mi[l.m] === undefined) mi[l.m] = n++;
    var col = LINKCOL[mi[l.m] % LINKCOL.length], mr = (l.m / L.cols) | 0, mc = l.m % L.cols, fr = (l.f / L.cols) | 0, fc = l.f % L.cols;
    var a = local(mr, mc, -0.3, -0.3, 0), b = local(fr, fc, -0.3, -0.3, 0), hot = hover === l.m || kbd === l.m, al = Math.min(1, (hot ? 0.95 : 0.34) + flashLink * 0.6);
    var mx = (a[0] + b[0]) / 2, my = Math.min(a[1], b[1]) - geo.tw * (0.55 + 0.12 * Math.abs(mr - fr + mc - fc));
    ctx.strokeStyle = rgba(col, al); ctx.lineWidth = hot ? 2 : 1.2; ctx.setLineDash(l.s < 0 ? [5, 5] : []); ctx.beginPath(); ctx.moveTo(a[0], a[1] - geo.tw * 0.06); ctx.quadraticCurveTo(mx, my, b[0], b[1] - geo.tw * 0.06); ctx.stroke(); ctx.setLineDash([]);
    var u = (time * 0.6 + mi[l.m] * 0.3) % 1, qx = (1 - u) * (1 - u) * a[0] + 2 * (1 - u) * u * mx + u * u * b[0], qy = (1 - u) * (1 - u) * (a[1] - geo.tw * 0.06) + 2 * (1 - u) * u * my + u * u * (b[1] - geo.tw * 0.06);
    ctx.fillStyle = rgba(col, Math.min(1, al + 0.3)); ctx.beginPath(); ctx.arc(qx, qy, Math.max(2, geo.tw * 0.035), 0, 6.3); ctx.fill();
    var s = Math.max(4, geo.tw * 0.09);                                           // maîtresse : losange plein ; suiveuse : anneau
    ctx.beginPath(); ctx.moveTo(a[0], a[1] - geo.tw * 0.06 - s); ctx.lineTo(a[0] + s * 0.7, a[1] - geo.tw * 0.06); ctx.lineTo(a[0], a[1] - geo.tw * 0.06 + s); ctx.lineTo(a[0] - s * 0.7, a[1] - geo.tw * 0.06); ctx.closePath(); ctx.fillStyle = rgba(col, 0.95); ctx.fill();
    ctx.strokeStyle = rgba(col, 0.95); ctx.lineWidth = 2; ctx.beginPath(); ctx.arc(b[0], b[1] - geo.tw * 0.06, s * 0.75, 0, 6.3); ctx.stroke();
    if (l.s < 0 && geo.tw > 40) { ctx.fillStyle = col; ctx.font = '700 ' + Math.max(9, geo.tw * 0.17) + 'px "JetBrains Mono",monospace'; ctx.textAlign = 'center'; ctx.textBaseline = 'middle'; ctx.fillText('↺', b[0] + s * 1.9, b[1] - geo.tw * 0.06); }
  });
}
var lastT = 0, lastBeat = 0;
function frame(now) {
  var dt = Math.min(0.05, (now - lastT) / 1000 || 0); lastT = now; time += dt;
  bob = reduced ? 0 : Math.sin(time * 0.9) * geo.tw * 0.05;
  drawSpace();
  if (L && ev) {
    var need = ev.nodesTot + L.flows.length, got = ev.nodesOn + L.flows.filter(function (f, k) { return ev.pw[k][f.dst]; }).length, energy = solved ? 1 : (need ? got / need : 0);
    beatPh += dt * (46 + 50 * energy + (solved ? 30 : 0)) / 60; var bp = beatPh % 1, beat = heart(bp);
    if (Math.floor(beatPh) !== lastBeat) { lastBeat = Math.floor(beatPh); if (playing && !document.hidden) SFX.beat(0.5 + 0.5 * energy); }
    if (solved) solveT += dt;
    for (var k = 0; k < ang.length; k++) { if (ang[k]) { ang[k] *= Math.pow(0.0005, dt); if (Math.abs(ang[k]) < 0.01) ang[k] = 0; } }
    Object.keys(shake).forEach(function (x) { shake[x] -= dt * 3; if (shake[x] <= 0) delete shake[x]; });
    if (flashLink > 0) flashLink = Math.max(0, flashLink - dt * 1.6);
    drawNaos(beat, energy);
    for (var s = 0; s <= L.rows + L.cols - 2; s++) for (var r = Math.max(0, s - L.cols + 1); r <= Math.min(L.rows - 1, s); r++) drawTile(r * L.cols + (s - r), beat);
    drawLinks();
    if (solved) { var a = Math.max(0, 1 - solveT / 1.6); if (a > 0) { ctx.fillStyle = 'rgba(122,215,240,' + a * 0.22 + ')'; ctx.fillRect(0, 0, VW, VH); } }
  }
  musicFrame(dt);
  requestAnimationFrame(frame);
}

/* ======================================================================
   9. ENTRÉES
   ====================================================================== */
cv.addEventListener('pointermove', function (e) { if (e.pointerType !== 'touch') { hover = pick(e.clientX, e.clientY); cv.style.cursor = hover >= 0 && playing && !L.tiles[hover].locked ? 'pointer' : 'default'; } });
cv.addEventListener('pointerleave', function () { hover = -1; });
cv.addEventListener('pointerdown', function (e) { gesture(); if (e.button === 2) return; var i = pick(e.clientX, e.clientY); if (e.pointerType === 'touch') { hover = i; setTimeout(function () { if (hover === i) hover = -1; }, 350); } act(i, e.shiftKey ? -1 : 1); });
cv.addEventListener('contextmenu', function (e) { e.preventDefault(); act(pick(e.clientX, e.clientY), -1); });
window.addEventListener('keydown', function (e) {
  var k = e.key.toLowerCase(); gesture();
  if (k === 'm') { setMusicOn(!musicOn); return; }
  if (k === 'n') { setFx(!fxOn); return; }
  if (!playing) { if (k === 'escape' && document.getElementById('ov-pause').classList.contains('show')) show(null); return; }
  if (k === 'escape' || k === 'p') { openPause(); return; }
  if (k === 'r') { resetLevel(); return; }
  var dr = k === 'arrowup' ? -1 : k === 'arrowdown' ? 1 : 0, dc = k === 'arrowleft' ? -1 : k === 'arrowright' ? 1 : 0;
  if (dr || dc) {
    e.preventDefault();
    if (kbd < 0) { kbd = L.flows[0].src; return; }
    var r = (kbd / L.cols) | 0, c = kbd % L.cols;
    for (var st = 0; st < 8; st++) { r += dr; c += dc; if (r < 0 || c < 0 || r >= L.rows || c >= L.cols) return; if (L.tiles[r * L.cols + c]) { kbd = r * L.cols + c; return; } }
  }
  if (k === ' ' || k === 'enter') { e.preventDefault(); if (kbd >= 0) act(kbd, e.shiftKey ? -1 : 1); }
});
window.__msc = { get L() { return L; }, get ev() { return ev; }, get rot() { return rot; }, get moves() { return moves; }, get solved() { return solved; }, get playing() { return playing; }, get cur() { return cur; }, get unlocked() { return unlocked; },
  get music() { return { on: musicOn, ready: mus.ready, playing: mus.playing, cur: mus.cur && mus.cur.t, want: mus.want.t, shown: mus.shown, err: mus.err }; }, get fx() { return fxOn; }, get sfx() { return sfxCount; }, get audio() { return AC ? AC.state : null; },
  save: save, act: act, start: function (i) { showIntro(i); show(null); }, geo: geo, cell: function (i) { var r = (i / L.cols) | 0, c = i % L.cols; return local(r, c, 0, 0, 0); }, solution: function () { return solvedRot(L, true); } };
layout(); showWarn(); requestAnimationFrame(frame);
})();
