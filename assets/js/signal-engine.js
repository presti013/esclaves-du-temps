/* ==========================================================================
   SIGNAL — terminal d'opérations Écho Rouge (moteur commun FR / EN / IT)
   Les missions, le codex et les textes de NAOS-9 sont dans signal-data-*.js.
   Ce fichier contient : textes d'interface, terminal simulé (système de
   fichiers, commandes Linux, tuyaux, redirections), déroulé pédagogique des
   missions, NAOS-9, Kassandra, sauvegarde, sons et musique.
   ========================================================================== */
(function () {
'use strict';

var D = window.SIGNAL_DATA || { missions: [], codex: {} };
var lang = (document.documentElement.lang || 'fr').slice(0, 2), LI = { fr: 0, en: 1, it: 2 }[lang];
if (LI == null) { LI = 0; lang = 'fr'; }
function T(x, a) { if (x == null) return ''; if (typeof x === 'function') return T(x(a), a); if (Array.isArray(x)) return x[LI] != null ? x[LI] : x[0]; return String(x); }
function fmt(s, o) { return String(s).replace(/\{(\w+)\}/g, function (m, k) { return o && o[k] != null ? o[k] : m; }); }
var TOUCH = !!(window.matchMedia && window.matchMedia('(pointer: coarse)').matches);
var reduced = !!(window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches);

/* --------------------------------------------------------------------------
   1. TEXTES D'INTERFACE
   -------------------------------------------------------------------------- */
var STR = {
  fr: {
    sub: 'Terminal d\'opérations Écho Rouge', play: 'Commencer', cont: 'Continuer — mission {n}', map: 'Carte des missions', codex: 'Codex',
    music: 'Musique', fx: 'Effets', on: 'oui', off: 'non', back: 'Retour', backER: 'Retour à Écho Rouge', close: 'Fermer',
    acts: ['Acte I — Canal Sigma', 'Acte II — Fantômes', 'Acte III — Porte-88'], cities: ['Zurich', 'Prague · Brno', 'Gdańsk'],
    actHint: ['Pour débuter : NAOS explique chaque commande.', 'Kassandra surveille : elle monte avec le temps.', 'Expert : Kassandra monte en temps réel.'],
    codename: 'Nom de code', codenameQ: 'Choisis ton nom de code d\'agent.', codenameOk: 'Valider', change: 'changer',
    mission: 'Mission', obj: 'Objectif', hint: 'Indice', hintCost: '+{n} % Kassandra', kass: 'Kassandra', menu: 'Menu',
    unknown: 'Fréquence non répertoriée', naos: 'NAOS-9', you: 'Toi',
    typeHere: 'écris une commande…', typeTouch: '⌨ ou boutons ↓', kbd: 'Clavier', run: 'Entrée', del: 'Effacer', tab: 'Compléter',
    enterKey: 'Entrée', enterTouch: '⏎', tabTip: 'Astuce : écris le début d\'un nom puis appuie sur Tab, le terminal complète tout seul.', tabTipTouch: 'Astuce : touche les boutons en bas, ils écrivent la commande pour toi. Tu peux aussi toucher un mot affiché dans le terminal.',
    quiz: 'Question de NAOS-9', right: 'Exact.', wrong: 'Pas tout à fait. Essaie encore.', go: 'Continuer', answerKeys: 'Réponds en touchant un bouton (ou en écrivant a, b ou c).',
    done: 'Mission accomplie', learned: 'Ce que tu as appris', next: 'Mission suivante', replay: 'Rejouer', finale: 'Épilogue',
    failT: 'Kassandra t\'a repéré', failX: 'Aegis-CD a reçu ta position. Kazimir t\'a extrait juste à temps. Tu peux reprendre là où tu étais, avec une trace plus discrète.',
    resume: 'Reprendre à l\'étape', restart: 'Recommencer la mission', rescue: 'Kassandra allait te repérer : je brouille ta trace. Ralentis, lis bien ce que je t\'explique.',
    newCodex: 'Codex : nouvelle fiche — {t}', codexCmd: 'Commandes', codexIdea: 'Notions', codexBasic: 'BASIC (bonus)', locked: 'verrouillée', lockedEntry: 'Pas encore découverte',
    means: 'Veut dire', example: 'Exemple', real: 'Dans un vrai terminal',
    stars: 'Discrétion', maxK: 'détection maximale : {n} %',
    unknownCmd: '{c} : commande inconnue. Écris help pour la liste.', didYouMean: 'Tu voulais dire « {s} » ?',
    noFile: '{c}: {p}: fichier ou dossier introuvable', isDir: '{c}: {p}: c\'est un dossier', notDir: '{c}: {p}: ce n\'est pas un dossier', perm: '{c}: {p}: permission refusée',
    usage: 'usage : {u}', quote: 'guillemet non fermé', noInput: '{c}: rien à lire', exists: '{c}: {p}: existe déjà', badMode: 'chmod: mode invalide « {m} »',
    helpHead: 'Commandes disponibles ici :', helpTail: 'man <commande> explique une commande · hint donne un indice · naos répète la consigne',
    cleared: 'écran effacé', restartQ: 'Recommencer cette mission depuis le début ?', saved: 'Progression sauvegardée',
    rotate: 'Astuce : tourne ton téléphone en mode paysage pour plus de confort.', speaking: 'NAOS-9 parle… (touche pour tout afficher)',
    endT: 'Signal transmis', allLearned: 'Tu as découvert {c} commandes et {n} notions. Ce sont de vraies commandes : sur un ordinateur Linux ou Mac, ouvre un terminal et écris ls.',
    act: 'Acte', tapMusic: 'Touchez ▶ pour lancer la bande originale'
  },
  en: {
    sub: 'Écho Rouge operations terminal', play: 'Start', cont: 'Continue — mission {n}', map: 'Mission map', codex: 'Codex',
    music: 'Music', fx: 'Effects', on: 'on', off: 'off', back: 'Back', backER: 'Back to Écho Rouge', close: 'Close',
    acts: ['Act I — Sigma Channel', 'Act II — Ghosts', 'Act III — Gate 88'], cities: ['Zurich', 'Prague · Brno', 'Gdańsk'],
    actHint: ['For beginners: NAOS explains every command.', 'Kassandra is watching: she rises over time.', 'Expert: Kassandra rises in real time.'],
    codename: 'Codename', codenameQ: 'Choose your agent codename.', codenameOk: 'Confirm', change: 'change',
    mission: 'Mission', obj: 'Objective', hint: 'Hint', hintCost: '+{n}% Kassandra', kass: 'Kassandra', menu: 'Menu',
    unknown: 'Unregistered frequency', naos: 'NAOS-9', you: 'You',
    typeHere: 'type a command…', typeTouch: '⌨ or buttons ↓', kbd: 'Keyboard', run: 'Enter', del: 'Delete', tab: 'Complete',
    enterKey: 'Enter', enterTouch: '⏎', tabTip: 'Tip: type the start of a name and press Tab, the terminal completes it for you.', tabTipTouch: 'Tip: tap the buttons at the bottom, they type the command for you. You can also tap a word shown in the terminal.',
    quiz: 'Question from NAOS-9', right: 'Correct.', wrong: 'Not quite. Try again.', go: 'Continue', answerKeys: 'Answer by tapping a button (or typing a, b or c).',
    done: 'Mission complete', learned: 'What you learned', next: 'Next mission', replay: 'Replay', finale: 'Epilogue',
    failT: 'Kassandra spotted you', failX: 'Aegis-CD received your position. Kazimir pulled you out just in time. You can pick up where you were, with a quieter trace.',
    resume: 'Resume from this step', restart: 'Restart the mission', rescue: 'Kassandra was about to spot you: I am scrambling your trace. Slow down and read my explanations carefully.',
    newCodex: 'Codex: new entry — {t}', codexCmd: 'Commands', codexIdea: 'Concepts', codexBasic: 'BASIC (bonus)', locked: 'locked', lockedEntry: 'Not discovered yet',
    means: 'Means', example: 'Example', real: 'In a real terminal',
    stars: 'Stealth', maxK: 'peak detection: {n}%',
    unknownCmd: '{c}: unknown command. Type help for the list.', didYouMean: 'Did you mean "{s}"?',
    noFile: '{c}: {p}: no such file or directory', isDir: '{c}: {p}: is a directory', notDir: '{c}: {p}: not a directory', perm: '{c}: {p}: permission denied',
    usage: 'usage: {u}', quote: 'unclosed quote', noInput: '{c}: nothing to read', exists: '{c}: {p}: already exists', badMode: 'chmod: invalid mode "{m}"',
    helpHead: 'Commands available here:', helpTail: 'man <command> explains a command · hint gives a hint · naos repeats the instructions',
    cleared: 'screen cleared', restartQ: 'Restart this mission from the beginning?', saved: 'Progress saved',
    rotate: 'Tip: turn your phone to landscape for more comfort.', speaking: 'NAOS-9 is speaking… (tap to show everything)',
    endT: 'Signal transmitted', allLearned: 'You discovered {c} commands and {n} concepts. They are real commands: on a Linux or Mac computer, open a terminal and type ls.',
    act: 'Act', tapMusic: 'Tap ▶ to start the soundtrack'
  },
  it: {
    sub: 'Terminale operativo Écho Rouge', play: 'Inizia', cont: 'Continua — missione {n}', map: 'Mappa delle missioni', codex: 'Codex',
    music: 'Musica', fx: 'Effetti', on: 'sì', off: 'no', back: 'Indietro', backER: 'Torna a Eco Rosso', close: 'Chiudi',
    acts: ['Atto I — Canale Sigma', 'Atto II — Fantasmi', 'Atto III — Porta 88'], cities: ['Zurigo', 'Praga · Brno', 'Danzica'],
    actHint: ['Per iniziare: NAOS spiega ogni comando.', 'Kassandra sorveglia: sale con il tempo.', 'Esperto: Kassandra sale in tempo reale.'],
    codename: 'Nome in codice', codenameQ: 'Scegli il tuo nome in codice da agente.', codenameOk: 'Conferma', change: 'cambia',
    mission: 'Missione', obj: 'Obiettivo', hint: 'Indizio', hintCost: '+{n}% Kassandra', kass: 'Kassandra', menu: 'Menu',
    unknown: 'Frequenza non registrata', naos: 'NAOS-9', you: 'Tu',
    typeHere: 'scrivi un comando…', typeTouch: '⌨ o pulsanti ↓', kbd: 'Tastiera', run: 'Invio', del: 'Cancella', tab: 'Completa',
    enterKey: 'Invio', enterTouch: '⏎', tabTip: 'Suggerimento: scrivi l\'inizio di un nome e premi Tab, il terminale lo completa da solo.', tabTipTouch: 'Suggerimento: tocca i pulsanti in basso, scrivono il comando per te. Puoi anche toccare una parola mostrata nel terminale.',
    quiz: 'Domanda di NAOS-9', right: 'Esatto.', wrong: 'Non proprio. Riprova.', go: 'Continua', answerKeys: 'Rispondi toccando un pulsante (o scrivendo a, b o c).',
    done: 'Missione compiuta', learned: 'Cosa hai imparato', next: 'Missione successiva', replay: 'Rigioca', finale: 'Epilogo',
    failT: 'Kassandra ti ha individuato', failX: 'Aegis-CD ha ricevuto la tua posizione. Kazimir ti ha tirato fuori appena in tempo. Puoi riprendere da dove eri, con una traccia più discreta.',
    resume: 'Riprendi da questa tappa', restart: 'Ricomincia la missione', rescue: 'Kassandra stava per individuarti: confondo la tua traccia. Rallenta e leggi bene le mie spiegazioni.',
    newCodex: 'Codex: nuova scheda — {t}', codexCmd: 'Comandi', codexIdea: 'Concetti', codexBasic: 'BASIC (bonus)', locked: 'bloccata', lockedEntry: 'Non ancora scoperta',
    means: 'Significa', example: 'Esempio', real: 'In un vero terminale',
    stars: 'Discrezione', maxK: 'rilevamento massimo: {n}%',
    unknownCmd: '{c}: comando sconosciuto. Scrivi help per l\'elenco.', didYouMean: 'Volevi dire «{s}»?',
    noFile: '{c}: {p}: file o cartella inesistente', isDir: '{c}: {p}: è una cartella', notDir: '{c}: {p}: non è una cartella', perm: '{c}: {p}: permesso negato',
    usage: 'uso: {u}', quote: 'virgolette non chiuse', noInput: '{c}: niente da leggere', exists: '{c}: {p}: esiste già', badMode: 'chmod: modo non valido «{m}»',
    helpHead: 'Comandi disponibili qui:', helpTail: 'man <comando> spiega un comando · hint dà un indizio · naos ripete la consegna',
    cleared: 'schermo pulito', restartQ: 'Ricominciare questa missione dall\'inizio?', saved: 'Progressi salvati',
    rotate: 'Suggerimento: gira il telefono in orizzontale per stare più comodo.', speaking: 'NAOS-9 sta parlando… (tocca per mostrare tutto)',
    endT: 'Segnale trasmesso', allLearned: 'Hai scoperto {c} comandi e {n} concetti. Sono comandi veri: su un computer Linux o Mac, apri un terminale e scrivi ls.',
    act: 'Atto', tapMusic: 'Tocca ▶ per avviare la colonna sonora'
  }
};
var S = STR[lang];
var MISSIONS = D.missions, NM = MISSIONS.length;

/* --------------------------------------------------------------------------
   2. OUTILS : UTF-8, empreinte, codages, chiffrements (aussi utilisés par les données)
   -------------------------------------------------------------------------- */
function utf8(s) { return unescape(encodeURIComponent(s)); }
function unutf8(s) { try { return decodeURIComponent(escape(s)); } catch (e) { return s; } }
function sha(str) {                 // empreinte de 64 caractères hexadécimaux (simulation de SHA-256, déterministe)
  var b = utf8(str), h = [0x6a09e667, 0xbb67ae85, 0x3c6ef372, 0xa54ff53a, 0x510e527f, 0x9b05688c, 0x1f83d9ab, 0x5be0cd19], i, k, x, out = '';
  for (var r = 0; r < 2; r++) for (i = 0; i < b.length; i++) for (k = 0; k < 8; k++) h[k] = (Math.imul(h[k] ^ (b.charCodeAt(i) + k * 31 + r * 7), 0x01000193) ^ (h[(k + 1) % 8] >>> 13)) | 0;
  for (k = 0; k < 8; k++) { x = h[k] ^ b.length; x ^= x >>> 16; x = Math.imul(x, 0x85ebca6b); x ^= x >>> 13; x = Math.imul(x, 0xc2b2ae35); x ^= x >>> 16; out += ('0000000' + (x >>> 0).toString(16)).slice(-8); }
  return out;
}
function b64e(s) { return btoa(utf8(s)).replace(/(.{60})/g, '$1\n').trim(); }
function b64d(s) { return unutf8(atob(String(s).replace(/\s+/g, ''))); }
function rot(s, n) { n = ((n % 26) + 26) % 26; return s.replace(/[A-Za-z]/g, function (c) { var b = c <= 'Z' ? 65 : 97; return String.fromCharCode((c.charCodeAt(0) - b + n) % 26 + b); }); }
function vig(s, key, dec) {
  key = String(key).toUpperCase().replace(/[^A-Z]/g, ''); if (!key) return s;
  var j = 0; return s.replace(/[A-Z]/g, function (c) { var k = key.charCodeAt(j++ % key.length) - 65; return String.fromCharCode((c.charCodeAt(0) - 65 + (dec ? 26 - k : k)) % 26 + 65); });
}
function xorHex(s, key) { var b = utf8(s), o = [], i; for (i = 0; i < b.length; i++) o.push(('0' + (b.charCodeAt(i) ^ key.charCodeAt(i % key.length)).toString(16)).slice(-2)); return o.join(' ').replace(/((?:\S+ ){15}\S+) /g, '$1\n'); }
function xorDec(hex, key) { var p = String(hex).trim().split(/\s+/), s = '', i, v; for (i = 0; i < p.length; i++) { v = parseInt(p[i], 16); if (isNaN(v)) return null; s += String.fromCharCode(v ^ key.charCodeAt(i % key.length)); } return unutf8(s); }
var H = { sha: sha, b64e: b64e, rot: rot, vig: vig, xorHex: xorHex, T: T, lang: lang };
D.H = H;

/* --------------------------------------------------------------------------
   3. SAUVEGARDE ET RÉGLAGES
   -------------------------------------------------------------------------- */
var SAVE_KEY = 'signal_save_v1', FX_KEY = 'exodus_fx', MUSIC_KEY = 'exodus_music';
var save = { name: '', done: {}, stars: {}, codex: {}, cur: null };
try { var raw = JSON.parse(localStorage.getItem(SAVE_KEY)); if (raw && typeof raw === 'object') { save.name = raw.name || ''; save.done = raw.done || {}; save.stars = raw.stars || {}; save.codex = raw.codex || {}; save.cur = raw.cur || null; } } catch (e) {}
var fxOn = true, musicOn = true;
try { var pf = localStorage.getItem(FX_KEY), pm = localStorage.getItem(MUSIC_KEY); fxOn = pf !== '0'; musicOn = pm !== '0'; } catch (e) {}
if (!save.name) { try { save.name = (localStorage.getItem('er_codename') || sessionStorage.getItem('er_codename') || ''); } catch (e) {} }
save.name = cleanName(save.name);
function cleanName(s) { return String(s || '').toUpperCase().replace(/[^A-Z0-9_\-]/g, '').slice(0, 16); }
function persist() { try { localStorage.setItem(SAVE_KEY, JSON.stringify(save)); } catch (e) {} }
function unlockedUpTo() { var n = 1; while (n < NM && save.done[n]) n++; return n; }
function agentLow() { return (save.name || 'agent').toLowerCase(); }

/* --------------------------------------------------------------------------
   4. SONS (Web Audio) et MUSIQUE (SoundCloud, comme les autres jeux du site)
   -------------------------------------------------------------------------- */
var AC = null, master = null, sfxCount = 0;
function audioInit() {
  if (AC) { if (AC.state === 'suspended') { try { AC.resume(); } catch (e) {} } return; }
  var Cx = window.AudioContext || window.webkitAudioContext; if (!Cx) return;
  try { AC = new Cx(); master = AC.createGain(); master.gain.value = fxOn ? 0.6 : 0; master.connect(AC.destination); } catch (e) { AC = null; }
}
function tone(type, f0, f1, dur, vol, delay) {
  if (!AC || !fxOn) return;
  var t = AC.currentTime + (delay || 0), o = AC.createOscillator(), g = AC.createGain();
  o.type = type; o.frequency.setValueAtTime(f0, t); if (f1 !== f0) o.frequency.exponentialRampToValueAtTime(Math.max(20, f1), t + dur);
  g.gain.setValueAtTime(0.0001, t); g.gain.linearRampToValueAtTime(vol, t + 0.01); g.gain.exponentialRampToValueAtTime(0.0001, t + dur);
  o.connect(g); g.connect(master); o.start(t); o.stop(t + dur + 0.05); sfxCount++;
}
function noise(dur, vol, delay) {
  if (!AC || !fxOn) return;
  var n = Math.floor(AC.sampleRate * dur), buf = AC.createBuffer(1, n, AC.sampleRate), d = buf.getChannelData(0), i;
  for (i = 0; i < n; i++) d[i] = (Math.random() * 2 - 1) * (1 - i / n);
  var s = AC.createBufferSource(), g = AC.createGain(), t = AC.currentTime + (delay || 0); s.buffer = buf; g.gain.value = vol; s.connect(g); g.connect(master); s.start(t); sfxCount++;
}
var SFX = {
  key: function () { tone('square', 1800 + Math.random() * 400, 1600, 0.02, 0.012); },
  run: function () { tone('square', 660, 660, 0.04, 0.03); tone('square', 990, 990, 0.05, 0.03, 0.05); },
  err: function () { tone('sawtooth', 140, 90, 0.18, 0.06); noise(0.08, 0.04); },
  ok: function () { [523.3, 659.3, 784].forEach(function (f, i) { tone('square', f, f, 0.09, 0.035, i * 0.07); }); },
  blip: function () { tone('sine', 520 + Math.random() * 380, 600, 0.035, 0.025); },
  good: function () { [659.3, 880, 1318.5].forEach(function (f, i) { tone('triangle', f, f, 0.14, 0.06, i * 0.08); }); },
  bad: function () { tone('triangle', 330, 220, 0.25, 0.06); },
  alarm: function () { tone('square', 880, 880, 0.12, 0.04); tone('square', 660, 660, 0.12, 0.04, 0.16); tone('square', 880, 880, 0.12, 0.04, 0.32); },
  codex: function () { tone('sine', 1046.5, 1046.5, 0.12, 0.05); tone('sine', 1568, 1568, 0.18, 0.04, 0.09); },
  win: function () { [392, 523.3, 659.3, 784, 1046.5].forEach(function (f, i) { tone('square', f, f, 0.16, 0.045, i * 0.11); }); tone('triangle', 196, 196, 0.9, 0.05, 0.55); },
  reveal: function () { tone('sine', 110, 880, 2.2, 0.06); [261.6, 392, 523.3, 784].forEach(function (f, i) { tone('sine', f, f, 1.2, 0.05, 0.5 + i * 0.25); }); },
  glitch: function () { noise(0.12, 0.05); tone('square', 90, 60, 0.1, 0.04); },
  ui: function () { tone('sine', 880, 1100, 0.05, 0.04); }
};
function setFx(v) { fxOn = v; try { localStorage.setItem(FX_KEY, v ? '1' : '0'); } catch (e) {} if (master) master.gain.value = v ? 0.6 : 0; if (v) SFX.ui(); refreshSettings(); }

var SC_BASE = 'https://soundcloud.com/laurent-prestigiacomo/';
var T_MENU = { t: 'Prologue', u: 'prologue-1' }, T_END = { t: 'Chapitre 20 — Le Prix de la Liberté', u: 'chapitre-20-le-prix-de-la-liberte-21' };
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
function randomTrack() { if (!bag.length) { bag = POOL.slice(); for (var i = bag.length - 1; i > 0; i--) { var j = (Math.random() * (i + 1)) | 0, x = bag[i]; bag[i] = bag[j]; bag[j] = x; } } return bag.pop(); }
var MUSIC_VOL = 40, MUSIC_WAIT = 5;
var mus = { w: null, ready: false, loading: false, want: T_MENU, cur: null, playing: false, box: null, frame: null, shown: false, nagged: false, timer: 0, err: null, started: false, progAt: 0, lastPos: -1, stalls: 0 };
function showMusicBox(v) { mus.shown = v; if (!mus.box) return; mus.box.style.left = v ? '50%' : '-3000px'; mus.box.style.opacity = v ? '1' : '0'; mus.box.style.pointerEvents = v ? 'auto' : 'none'; }
function musicBox() {
  if (mus.box) return;
  var box = document.createElement('div'), lab = document.createElement('div'), x = document.createElement('button'), fr = document.createElement('iframe');
  box.style.cssText = 'position:fixed;z-index:80;top:8px;width:min(92vw,420px);transform:translateX(-50%);background:#020a05;border:1px solid #33ff77;padding:8px 10px 10px;box-sizing:border-box;font:13px "JetBrains Mono",monospace;color:#9dffb8;';
  lab.textContent = S.tapMusic; lab.style.cssText = 'padding:0 34px 6px 2px;';
  x.type = 'button'; x.textContent = '✕'; x.setAttribute('aria-label', S.close);
  x.style.cssText = 'position:absolute;top:2px;right:4px;width:34px;height:28px;background:none;border:0;color:#9dffb8;font:inherit;cursor:pointer;';
  x.addEventListener('click', function () { mus.nagged = true; showMusicBox(false); });
  fr.allow = 'autoplay; encrypted-media'; fr.setAttribute('scrolling', 'no'); fr.setAttribute('frameborder', '0'); fr.title = 'SoundCloud';
  fr.style.cssText = 'display:block;width:100%;height:120px;border:0;';
  fr.src = 'https://w.soundcloud.com/player/?url=' + encodeURIComponent(SC_BASE + mus.want.u) + '&auto_play=true&color=%2333ff77&hide_related=true&show_comments=false&show_user=false&show_reposts=false&show_teaser=false&visual=false';
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
      w.bind(EV.PLAY, function () { mus.playing = true; mus.started = true; mus.progAt = performance.now(); w.setVolume(MUSIC_VOL); if (mus.shown) showMusicBox(false); if (!musicOn || document.hidden) w.pause(); });
      w.bind(EV.PAUSE, function () { mus.playing = false; });
      w.bind(EV.PLAY_PROGRESS, function (o) { if (o && o.currentPosition !== mus.lastPos) { mus.lastPos = o.currentPosition; mus.progAt = performance.now(); mus.stalls = 0; } });
      w.bind(EV.FINISH, function () { mus.playing = false; if (musicOn) setTimeout(musicReload, 300); });
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
  SFX.ui(); refreshSettings();
}
function musicTick(dt) {
  if (!musicOn || !mus.ready || document.hidden) return;
  if (!mus.playing) { if (mus.timer > 0) { mus.timer -= dt; if (mus.timer <= 0 && !mus.nagged && !mus.shown) showMusicBox(true); } return; }
  if (mus.started && mus.stalls < 3 && performance.now() - mus.progAt > 7000) { mus.stalls++; musicReload(); }
}
document.addEventListener('visibilitychange', function () { if (!mus.ready) return; if (document.hidden) mus.w.pause(); else if (musicOn) musicApply(); });
function gesture() { audioInit(); musicInit(); }

/* --------------------------------------------------------------------------
   5. SYSTÈME DE FICHIERS SIMULÉ
   -------------------------------------------------------------------------- */
function Dir(owner) { return { d: 1, ch: {}, mode: 'rwxr-xr-x', owner: owner || 'root' }; }
function norm(path, cwd, home) {
  var p = String(path || '');
  if (p === '~' || p.indexOf('~/') === 0) p = home + p.slice(1);
  var parts = (p.charAt(0) === '/' ? p : cwd + '/' + p).split('/'), out = [];
  parts.forEach(function (x) { if (!x || x === '.') return; if (x === '..') out.pop(); else out.push(x); });
  return '/' + out.join('/');
}
function Tree(spec, home, user) {
  var t = { root: Dir('root'), home: home, user: user };
  mkdirp(t, home, user);
  Object.keys(spec || {}).forEach(function (k) {
    var v = spec[k], abs = k.charAt(0) === '/' ? k : home + '/' + k;
    if (/\/$/.test(k)) { mkdirp(t, abs.replace(/\/$/, ''), v && v.owner || user); return; }
    var o = (v && typeof v === 'object' && !Array.isArray(v) && 'c' in v) ? v : { c: v };
    var c = typeof o.c === 'function' ? o.c(H) : T(o.c, H);
    mkdirp(t, parentOf(abs).dir, user);
    writeFile(t, abs, c, o.mode || 'rw-r--r--', o.owner || user);
  });
  return t;
}
function mkdirp(t, abs, owner) {
  var n = t.root; abs.split('/').forEach(function (x) { if (!x) return; if (!n.ch[x]) n.ch[x] = Dir(owner); n = n.ch[x]; });
  return n;
}
function getNode(t, abs) { var n = t.root, ps = abs.split('/'); for (var i = 0; i < ps.length; i++) { if (!ps[i]) continue; if (!n.d || !n.ch[ps[i]]) return null; n = n.ch[ps[i]]; } return n; }
function parentOf(abs) { var i = abs.lastIndexOf('/'); return { dir: abs.slice(0, i) || '/', name: abs.slice(i + 1) }; }
function writeFile(t, abs, c, mode, owner) {
  var p = parentOf(abs), d = getNode(t, p.dir); if (!d || !d.d) return false;
  var old = d.ch[p.name]; d.ch[p.name] = { c: String(c), mode: mode || (old && old.mode) || 'rw-r--r--', owner: owner || (old && old.owner) || t.user }; return true;
}
function canRead(t, n) { return n.owner === t.user || n.mode.charAt(6) === 'r'; }
function canWrite(t, n) { return n.owner === t.user || n.mode.charAt(7) === 'w'; }

/* --------------------------------------------------------------------------
   6. ÉTAT D'UNE MISSION
   -------------------------------------------------------------------------- */
var G = null;      // mission en cours
function X() {     // contexte transmis aux fonctions des missions
  return {
    get cwd() { return G.cwd; }, get home() { return G.tree.home; }, get host() { return G.host; }, v: G.v, did: G.did, H: H, T: T, lang: lang,
    file: function (p) { var n = getNode(G.tree, norm(p, G.cwd, G.tree.home)); return n && !n.d ? n.c : null; },
    fileIn: function (tree, p) { var tr = G.trees[tree]; if (!tr) return null; var n = getNode(tr, p.charAt(0) === '/' ? p : tr.home + '/' + p); return n && !n.d ? n.c : null; },
    node: function (p) { return getNode(G.tree, norm(p, G.cwd, G.tree.home)); },
    exists: function (p) { return !!getNode(G.tree, norm(p, G.cwd, G.tree.home)); },
    at: function (rel) { return G.cwd === norm(rel, G.tree.home, G.tree.home); },
    write: function (p, c, mode, owner) { var abs = norm(p, G.cwd, G.tree.home); writeFile(G.tree, abs, c, mode, owner); G.mods.push(['w', G.treeName, abs, String(c), mode || null, owner || null]); },
    remove: function (p) { var abs = norm(p, G.cwd, G.tree.home), q = parentOf(abs), d = getNode(G.tree, q.dir); if (d && d.ch[q.name]) { delete d.ch[q.name]; G.mods.push(['r', G.treeName, abs]); } },
    connect: function (name) { switchTree(name, true); },
    kass: function (n) { addKass(n); }, say: function (m) { naosSay(T(m)); }, token: function (t) { addToken(t); },
    act: function () { return G.def.act; }
  };
}
function switchTree(name, record) {
  if (!G.trees[name]) return;
  G.cwds[G.treeName] = G.cwd; G.treeName = name; G.tree = G.trees[name]; G.cwd = G.cwds[name] || G.tree.home;
  G.host = name === 'local' ? G.def.host : G.def.remote.host;
  G.user = name === 'local' ? agentLow() : G.def.remote.user;
  if (record) G.mods.push(['t', name]);
  updatePrompt(); refreshChips();
}
function buildTrees(def) {
  var tr = { local: Tree(def.fs, def.home || '/home/agent', 'agent') };
  if (def.remote) tr.remote = Tree(def.remote.fs, def.remote.home || '/home/tech', 'tech');
  return tr;
}
function applyMods(mods) {
  mods.forEach(function (m) {
    if (m[0] === 't') { switchTree(m[1], false); return; }
    var t = G.trees[m[1]]; if (!t) return;
    if (m[0] === 'w') writeFile(t, m[2], m[3], m[4], m[5]);
    else if (m[0] === 'r') { var q = parentOf(m[2]), d = getNode(t, q.dir); if (d && d.ch) delete d.ch[q.name]; }
    else if (m[0] === 'c') { var n = getNode(t, m[2]); if (n) n.mode = m[3]; }
    else if (m[0] === 'd') mkdirp(t, m[2], t.user);
  });
}

/* --------------------------------------------------------------------------
   7. COMMANDES
   -------------------------------------------------------------------------- */
function R(o) { return { o: o == null ? '' : String(o) }; }
function E(e) { return { e: e }; }
function flagsOf(args) { var f = {}, rest = []; args.forEach(function (a) { if (/^-[a-zA-Z]+$/.test(a)) a.slice(1).split('').forEach(function (c) { f[c] = 1; }); else rest.push(a); }); return { f: f, rest: rest }; }
function abs(p) { return norm(p, G.cwd, G.tree.home); }
function touchFile(cmd, p) { var b = parentOf(p).name; G.did[cmd + ':' + b] = 1; G.did['any:' + b] = 1; G.did[cmd + ':' + p] = 1; }
function readArg(cmd, p) {       // lit un fichier en vérifiant existence, type et permission
  var a = abs(p), n = getNode(G.tree, a);
  if (!n) return E(fmt(S.noFile, { c: cmd, p: p }));
  if (n.d) return E(fmt(S.isDir, { c: cmd, p: p }));
  if (!canRead(G.tree, n)) { touchFile(cmd + '!', a); return E(fmt(S.perm, { c: cmd, p: p })); }
  touchFile(cmd, a); return R(n.c);
}
function inputOf(cmd, files, stdin) {
  if (!files.length) { if (stdin == null) return E(fmt(S.noInput, { c: cmd })); return R(stdin); }
  var out = []; for (var i = 0; i < files.length; i++) { var r = readArg(cmd, files[i]); if (r.e) return r; out.push(r.o); }
  return R(out.join('\n'));
}
function lines(s) { s = String(s); if (s === '') return []; return s.replace(/\n$/, '').split('\n'); }
function lsLong(name, n) { var size = n.d ? 4096 : utf8(n.c).length; return (n.d ? 'd' : '-') + n.mode + ' ' + (n.owner + '        ').slice(0, 8) + ' ' + ('     ' + size).slice(-6) + ' ' + name + (n.d ? '/' : ''); }
var CMD = {
  pwd: function () { return R(G.cwd); },
  whoami: function () { return R(G.user); },
  date: function () { return R('Sun Jan 28 04:17:00 UTC 2035'); },
  ls: function (a) {
    var p = flagsOf(a), target = p.rest[0] || '.', ab = abs(target), n = getNode(G.tree, ab);
    if (!n) return E(fmt(S.noFile, { c: 'ls', p: target }));
    G.did['ls:' + ab] = 1; if (p.f.a) G.did['ls-a:' + ab] = 1; if (p.f.l) G.did['ls-l:' + ab] = 1;
    if (!n.d) return R(p.f.l ? lsLong(parentOf(ab).name, n) : parentOf(ab).name);
    var names = Object.keys(n.ch).sort(function (x, y) { return x.replace(/^\./, '').localeCompare(y.replace(/^\./, '')); });
    if (!p.f.a) names = names.filter(function (x) { return x.charAt(0) !== '.'; });
    else { G.seenHidden[ab] = 1; }
    if (p.f.l) return R(names.map(function (x) { return lsLong(x, n.ch[x]); }).join('\n'));
    return R((p.f.a ? ['./', '../'] : []).concat(names.map(function (x) { return x + (n.ch[x].d ? '/' : ''); })).join('  '));
  },
  cd: function (a) {
    var target = a[0] || '~', ab = abs(target), n = getNode(G.tree, ab);
    if (!n) return E(fmt(S.noFile, { c: 'cd', p: target }));
    if (!n.d) return E(fmt(S.notDir, { c: 'cd', p: target }));
    G.cwd = ab; updatePrompt(); return R('');
  },
  cat: function (a, stdin) { return inputOf('cat', a, stdin); },
  head: function (a, stdin) { return headTail('head', a, stdin); },
  tail: function (a, stdin) { return headTail('tail', a, stdin); },
  grep: function (a, stdin) {
    var p = flagsOf(a), pat = p.rest[0]; if (pat == null) return E(fmt(S.usage, { u: 'grep [-v] [-i] [-c] [-n] <mot> <fichier>' }));
    var files = p.rest.slice(1), res = [], cnt = 0, multi = files.length > 1;
    var src = files.length ? files : [null];
    for (var i = 0; i < src.length; i++) {
      var r = src[i] == null ? (stdin == null ? E(fmt(S.noInput, { c: 'grep' })) : R(stdin)) : readArg('grep', src[i]); if (r.e) return r;
      lines(r.o).forEach(function (l, k) {
        var hit = p.f.i ? l.toLowerCase().indexOf(pat.toLowerCase()) >= 0 : l.indexOf(pat) >= 0;
        if (p.f.v) hit = !hit;
        if (hit) { cnt++; res.push((multi ? src[i] + ':' : '') + (p.f.n ? (k + 1) + ':' : '') + l); }
      });
    }
    G.lastGrep = { pat: pat, files: files, n: cnt, v: !!p.f.v };
    return R(p.f.c ? String(cnt) : res.join('\n'));
  },
  wc: function (a, stdin) {
    var p = flagsOf(a), r = inputOf('wc', p.rest, stdin); if (r.e) return r;
    var l = lines(r.o).length, w = (r.o.match(/\S+/g) || []).length, c = utf8(r.o).length, nm = p.rest.length ? ' ' + p.rest.join(' ') : '';
    if (p.f.l) return R(l + nm); if (p.f.w) return R(w + nm); if (p.f.c) return R(c + nm);
    return R(l + ' ' + w + ' ' + c + nm);
  },
  sort: function (a, stdin) { var p = flagsOf(a), r = inputOf('sort', p.rest, stdin); if (r.e) return r; var ls = lines(r.o).sort(p.f.n ? function (x, y) { return parseFloat(x) - parseFloat(y); } : undefined); if (p.f.r) ls.reverse(); return R(ls.join('\n')); },
  uniq: function (a, stdin) { var p = flagsOf(a), r = inputOf('uniq', p.rest, stdin); if (r.e) return r; var out = [], last = null, c = 0; lines(r.o).concat([null]).forEach(function (l) { if (l === last) { c++; return; } if (last != null) out.push(p.f.c ? ('      ' + c).slice(-7) + ' ' + last : last); last = l; c = 1; }); return R(out.join('\n')); },
  echo: function (a) { return R(a.join(' ')); },
  history: function () { return R(G.hist.slice().reverse().map(function (h, i) { return ('    ' + (i + 1)).slice(-5) + '  ' + h; }).join('\n')); },
  cp: function (a) { return copyMove('cp', a); },
  mv: function (a) { return copyMove('mv', a); },
  rm: function (a) {
    var p = flagsOf(a); if (!p.rest.length) return E(fmt(S.usage, { u: 'rm <fichier>' }));
    for (var i = 0; i < p.rest.length; i++) { var ab = abs(p.rest[i]), n = getNode(G.tree, ab); if (!n) return E(fmt(S.noFile, { c: 'rm', p: p.rest[i] })); if (n.d && !p.f.r) return E(fmt(S.isDir, { c: 'rm', p: p.rest[i] })); var q = parentOf(ab); delete getNode(G.tree, q.dir).ch[q.name]; G.mods.push(['r', G.treeName, ab]); touchFile('rm', ab); }
    return R('');
  },
  mkdir: function (a) { if (!a[0]) return E(fmt(S.usage, { u: 'mkdir <dossier>' })); var ab = abs(a[0]); if (getNode(G.tree, ab)) return E(fmt(S.exists, { c: 'mkdir', p: a[0] })); mkdirp(G.tree, ab, G.tree.user); G.mods.push(['d', G.treeName, ab]); return R(''); },
  chmod: function (a) {
    if (a.length < 2) return E(fmt(S.usage, { u: 'chmod <mode> <fichier>' }));
    var ab = abs(a[1]), n = getNode(G.tree, ab); if (!n) return E(fmt(S.noFile, { c: 'chmod', p: a[1] }));
    var m = parseMode(a[0], n.mode); if (!m) return E(fmt(S.badMode, { m: a[0] }));
    n.mode = m; G.mods.push(['c', G.treeName, ab, m]); touchFile('chmod', ab); return R('');
  },
  find: function (a) {
    var start = '.', pat = null, i = 0; if (a[0] && a[0].charAt(0) !== '-') { start = a[0]; i = 1; }
    for (; i < a.length; i++) if (a[i] === '-name') pat = a[i + 1];
    var ab = abs(start), n = getNode(G.tree, ab); if (!n) return E(fmt(S.noFile, { c: 'find', p: start }));
    var re = pat ? new RegExp('^' + pat.replace(/[.+^${}()|[\]\\]/g, '\\$&').replace(/\*/g, '.*').replace(/\?/g, '.') + '$') : null, out = [];
    (function walk(node, disp) {
      if (!re || re.test(disp.split('/').pop())) out.push(disp);
      if (node.d) Object.keys(node.ch).sort().forEach(function (k) { walk(node.ch[k], disp + '/' + k); });
    })(n, start.replace(/\/$/, ''));
    if (re && out[0] === start.replace(/\/$/, '') && !re.test(start)) out.shift();
    G.did['find:' + (pat || '')] = 1;
    return R(out.join('\n'));
  },
  sha256sum: function (a, stdin) {
    if (!a.length) { if (stdin == null) return E(fmt(S.usage, { u: 'sha256sum <fichier>' })); return R(sha(stdin) + '  -'); }
    var out = []; for (var i = 0; i < a.length; i++) { var r = readArg('sha256sum', a[i]); if (r.e) return r; out.push(sha(r.o) + '  ' + a[i]); }
    return R(out.join('\n'));
  },
  base64: function (a, stdin) {
    var p = flagsOf(a), r = inputOf('base64', p.rest, stdin); if (r.e) return r;
    if (p.f.d) { try { return R(b64d(r.o)); } catch (e) { return E('base64: invalid input'); } }
    return R(b64e(r.o));
  },
  rot: function (a, stdin) {
    var n = parseInt(a[0], 10); if (isNaN(n)) return E(fmt(S.usage, { u: 'rot <décalage> <fichier>   (ex. rot -3 fichier.txt)' }));
    var r = inputOf('rot', a.slice(1), stdin); if (r.e) return r; return R(rot(r.o, n));
  },
  vigenere: function (a, stdin) {
    var p = flagsOf(a.filter(function (x) { return x === '-d' || x === '-e'; })), rest = a.filter(function (x) { return x !== '-d' && x !== '-e'; });
    if (!rest[0]) return E(fmt(S.usage, { u: 'vigenere -d <clé> <fichier>' }));
    var r = inputOf('vigenere', rest.slice(1), stdin); if (r.e) return r; G.did['vigenere:' + rest[0].toUpperCase()] = 1;
    return R(vig(r.o.toUpperCase(), rest[0], !!p.f.d));
  },
  xor: function (a, stdin) {
    if (!a[0]) return E(fmt(S.usage, { u: 'xor <clé> <fichier>' }));
    var r = inputOf('xor', a.slice(1), stdin); if (r.e) return r;
    var d = /^[0-9a-f\s]+$/i.test(r.o.trim()) ? xorDec(r.o, a[0]) : null;
    return R(d == null ? xorHex(r.o, a[0]) : d);
  },
  diff: function (a) {
    if (a.length < 2) return E(fmt(S.usage, { u: 'diff <fichier1> <fichier2>' }));
    var x = readArg('diff', a[0]); if (x.e) return x; var y = readArg('diff', a[1]); if (y.e) return y;
    var A = lines(x.o), B = lines(y.o), out = [], i, n = Math.max(A.length, B.length);
    for (i = 0; i < n; i++) {
      if (A[i] === B[i]) continue;
      if (A[i] != null && B[i] != null) out.push((i + 1) + 'c' + (i + 1), '< ' + A[i], '---', '> ' + B[i]);
      else if (A[i] != null) out.push((i + 1) + 'd' + B.length, '< ' + A[i]); else out.push(A.length + 'a' + (i + 1), '> ' + B[i]);
    }
    return R(out.join('\n'));
  },
  man: function (a) {
    var k = (a[0] || '').toLowerCase(), e = D.codex[k];
    if (!e) return E(fmt(S.usage, { u: 'man <commande>' }));
    if (!save.codex[k]) return R(k + ' — ' + S.lockedEntry);
    return R(codexText(k, e));
  },
  help: function () {
    var l = cmdList(), out = [S.helpHead, '  ' + l.join('  '), S.helpTail]; return R(out.join('\n'));
  },
  hint: function () { giveHint(); return R(''); },
  naos: function () { repeatStep(); return R(''); },
  codex: function () { openCodex(); return R(''); },
  clear: function () { clearTerm(); return R(''); },
  exit: function () { if (G.treeName !== 'local') { switchTree('local', true); return R('Connection to ' + G.def.remote.host + ' closed.'); } return R('logout'); }
};
CMD.logout = CMD.exit; CMD.indice = CMD.hint; CMD.indizio = CMD.hint; CMD.aide = CMD.help; CMD.aiuto = CMD.help;
function headTail(cmd, a, stdin) {
  var n = 10, files = [], i;
  for (i = 0; i < a.length; i++) { if (a[i] === '-n') { n = parseInt(a[++i], 10) || 10; } else if (/^-\d+$/.test(a[i])) n = parseInt(a[i].slice(1), 10); else files.push(a[i]); }
  var r = inputOf(cmd, files, stdin); if (r.e) return r; var ls = lines(r.o);
  return R((cmd === 'head' ? ls.slice(0, n) : ls.slice(-n)).join('\n'));
}
function copyMove(cmd, a) {
  if (a.length < 2) return E(fmt(S.usage, { u: cmd + ' <source> <destination>' }));
  var src = abs(a[0]), n = getNode(G.tree, src); if (!n) return E(fmt(S.noFile, { c: cmd, p: a[0] })); if (n.d) return E(fmt(S.isDir, { c: cmd, p: a[0] }));
  if (!canRead(G.tree, n)) return E(fmt(S.perm, { c: cmd, p: a[0] }));
  var dst = abs(a[1]), dn = getNode(G.tree, dst); if (dn && dn.d) dst = dst + '/' + parentOf(src).name;
  var pd = getNode(G.tree, parentOf(dst).dir); if (!pd || !pd.d) return E(fmt(S.noFile, { c: cmd, p: a[1] }));
  if (src === dst) return R('');
  writeFile(G.tree, dst, n.c, n.mode, n.owner); G.mods.push(['w', G.treeName, dst, n.c, n.mode, n.owner]);
  if (cmd === 'mv') { var q = parentOf(src); delete getNode(G.tree, q.dir).ch[q.name]; G.mods.push(['r', G.treeName, src]); }
  touchFile(cmd, src); touchFile(cmd + '>', dst); return R('');
}
function parseMode(m, cur) {
  if (/^[0-7]{3}$/.test(m)) return m.split('').map(function (d) { d = +d; return (d & 4 ? 'r' : '-') + (d & 2 ? 'w' : '-') + (d & 1 ? 'x' : '-'); }).join('');
  var g = /^([ugoa]*)([+\-=])([rwx]+)$/.exec(m); if (!g) return null;
  var who = g[1] || 'a', arr = cur.split(''), idx = { u: 0, g: 3, o: 6 }, bits = { r: 0, w: 1, x: 2 };
  (who.indexOf('a') >= 0 ? 'ugo' : who).split('').forEach(function (w) {
    if (g[2] === '=') { arr[idx[w]] = '-'; arr[idx[w] + 1] = '-'; arr[idx[w] + 2] = '-'; }
    g[3].split('').forEach(function (b) { arr[idx[w] + bits[b]] = g[2] === '-' ? '-' : b; });
  });
  return arr.join('');
}
function cmdList() { return (G && G.def.cmds ? G.def.cmds : ['ls', 'cd', 'cat', 'pwd']).concat(['help', 'man', 'hint', 'clear']).filter(function (x, i, a) { return a.indexOf(x) === i; }); }
var ALLCMDS = function () { return Object.keys(CMD).concat(G && G.def.ext ? Object.keys(G.def.ext) : []); };
function lev(a, b) { var m = [], i, j; for (i = 0; i <= a.length; i++) { m[i] = [i]; } for (j = 1; j <= b.length; j++) m[0][j] = j; for (i = 1; i <= a.length; i++) for (j = 1; j <= b.length; j++) m[i][j] = Math.min(m[i - 1][j] + 1, m[i][j - 1] + 1, m[i - 1][j - 1] + (a[i - 1] === b[j - 1] ? 0 : 1)); return m[a.length][b.length]; }

/* --------------------------------------------------------------------------
   8. INTERPRÉTEUR : guillemets, tuyaux |, redirections > et >>
   -------------------------------------------------------------------------- */
function lex(s) {
  var t = [], cur = '', q = null, has = false, i, c;
  function push() { if (cur || has) t.push(cur); cur = ''; has = false; }
  for (i = 0; i < s.length; i++) {
    c = s.charAt(i);
    if (q) { if (c === q) q = null; else cur += c; continue; }
    if (c === '"' || c === '\'' || c === '«' || c === '»' || c === '“' || c === '”') { if (c === '»' || c === '”') continue; q = c === '«' ? '»' : c === '“' ? '”' : c; has = true; continue; }
    if (c === ' ' || c === '\t') { push(); continue; }
    if (c === '|') { push(); t.push({ op: '|' }); continue; }
    if (c === '>') { push(); if (s.charAt(i + 1) === '>') { t.push({ op: '>>' }); i++; } else t.push({ op: '>' }); continue; }
    cur += c;
  }
  if (q) return null; push(); return t;
}
function execLine(raw) {
  var toks = lex(raw), ev = { raw: raw, names: [], segs: [], out: '', err: null, redir: null };
  if (!toks) { ev.err = S.quote; return ev; }
  var segs = [[]], redir = null, i;
  for (i = 0; i < toks.length; i++) {
    var k = toks[i];
    if (typeof k === 'object' && k.op === '|') { segs.push([]); continue; }
    if (typeof k === 'object') { redir = { append: k.op === '>>', path: toks[i + 1] }; i++; continue; }
    segs[segs.length - 1].push(k);
  }
  segs = segs.filter(function (s) { return s.length; });
  if (!segs.length) return ev;
  var stdin = null, r = null, x = X();
  for (i = 0; i < segs.length; i++) {
    var name = segs[i][0].toLowerCase(), args = segs[i].slice(1);
    ev.names.push(name); ev.segs.push({ name: name, args: args });
    var fn = (G.def.ext && G.def.ext[name]) || CMD[name];
    if (!fn) { var best = null, bd = 3; ALLCMDS().forEach(function (c) { var d = lev(name, c); if (d < bd) { bd = d; best = c; } }); ev.err = fmt(S.unknownCmd, { c: name }) + (best ? ' ' + fmt(S.didYouMean, { s: best }) : ''); ev.unknown = 1; break; }
    r = fn(args, stdin, x); if (!r) r = R('');
    if (r.e) { ev.err = r.e; break; }
    stdin = r.o;
  }
  ev.name = ev.names[0]; ev.args = ev.segs[0] ? ev.segs[0].args : [];
  if (!ev.err && r) {
    if (redir) {
      if (!redir.path || typeof redir.path !== 'string') ev.err = fmt(S.usage, { u: 'commande > fichier' });
      else {
        var ab = abs(redir.path), n = getNode(G.tree, ab), pd = getNode(G.tree, parentOf(ab).dir);
        if (n && n.d) ev.err = fmt(S.isDir, { c: ev.name, p: redir.path });
        else if (!pd) ev.err = fmt(S.noFile, { c: ev.name, p: redir.path });
        else if (n && !canWrite(G.tree, n)) ev.err = fmt(S.perm, { c: ev.name, p: redir.path });
        else {
          var c = redir.append && n ? n.c.replace(/\n?$/, '\n') + r.o : r.o;
          writeFile(G.tree, ab, c, n ? n.mode : 'rw-r--r--', n ? n.owner : G.tree.user); G.mods.push(['w', G.treeName, ab, c, n ? n.mode : null, n ? n.owner : null]);
          ev.redir = { path: ab, append: redir.append }; touchFile(redir.append ? '>>' : '>', ab);
        }
      }
    } else ev.out = r.o;
  }
  return ev;
}

/* --------------------------------------------------------------------------
   9. INTERFACE
   -------------------------------------------------------------------------- */
var $ = {};
function el(tag, cls, txt, parent) { var e = document.createElement(tag); if (cls) e.className = cls; if (txt != null) e.textContent = txt; if (parent) parent.appendChild(e); return e; }
function esc(s) { return String(s).replace(/[&<>"]/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]; }); }
function rich(s) {
  return esc(s).replace(/`([^`]+)`/g, '<code>$1</code>').replace(/\*\*([^*]+)\*\*/g, '<b>$1</b>').replace(/\*([^*]+)\*/g, '<i>$1</i>').replace(/\n/g, '<br>');
}
function vars(s) { return fmt(s, { enter: TOUCH ? S.enterTouch : S.enterKey, name: save.name || 'AGENT', tabtip: TOUCH ? S.tabTipTouch : S.tabTip }); }
function btn(label, fn, parent, cls) { var b = el('button', 'btn' + (cls ? ' ' + cls : ''), label, parent); b.type = 'button'; b.addEventListener('click', function () { gesture(); SFX.ui(); fn(); }); return b; }

function buildUI() {
  var app = document.getElementById('app'); app.innerHTML = '';
  var g = el('div', 'game', null, app); $.game = g;
  var top = el('header', 'top', null, g);
  $.menuBtn = el('button', 'ic', '≡', top); $.menuBtn.type = 'button'; $.menuBtn.setAttribute('aria-label', S.menu); $.menuBtn.addEventListener('click', function () { gesture(); openMenu(); });
  var tt = el('div', 'tt', null, top); $.mnum = el('div', 'mnum', '', tt); $.mtitle = el('div', 'mtitle', '', tt);
  var kw = el('div', 'kass', null, top); el('span', 'kl', S.kass, kw); var kb = el('div', 'kbar', null, kw); $.kfill = el('div', 'kfill', null, kb); $.kpct = el('span', 'kp', '0 %', kw);
  $.hintBtn = el('button', 'ic', '💡', top); $.hintBtn.type = 'button'; $.hintBtn.title = S.hint; $.hintBtn.setAttribute('aria-label', S.hint); $.hintBtn.addEventListener('click', function () { gesture(); giveHint(); });
  $.codexBtn = el('button', 'ic', '📖', top); $.codexBtn.type = 'button'; $.codexBtn.title = S.codex; $.codexBtn.setAttribute('aria-label', S.codex); $.codexBtn.addEventListener('click', function () { gesture(); openCodex(); });

  var main = el('div', 'main', null, g);
  var term = el('section', 'term', null, main); $.term = term;
  $.out = el('div', 'out', null, term); $.out.setAttribute('role', 'log'); $.out.setAttribute('aria-live', 'polite');
  var inl = el('div', 'inl', null, term); $.prompt = el('span', 'prompt', '$', inl);
  $.input = el('input', 'cmd', null, inl); $.input.type = 'text'; $.input.autocomplete = 'off'; $.input.spellcheck = false; $.input.setAttribute('autocapitalize', 'off'); $.input.setAttribute('autocorrect', 'off');
  $.input.setAttribute('aria-label', S.typeHere); $.input.placeholder = TOUCH ? S.typeTouch : S.typeHere;
  if (TOUCH) $.input.setAttribute('inputmode', 'none');
  $.input.addEventListener('keydown', onKey);
  $.input.addEventListener('input', function () { SFX.key(); });

  var side = el('aside', 'side', null, main); $.side = side;
  var nh = el('div', 'nhead', null, side); $.orb = el('canvas', 'orb', null, nh); var nw = el('div', 'nwho', null, nh); $.who = el('div', 'who', '', nw); $.whoSub = el('div', 'whosub', '', nw);
  $.msgs = el('div', 'msgs', null, side); $.msgs.addEventListener('click', function () { finishTyping(); });
  $.choices = el('div', 'choices', null, side);
  var ob = el('div', 'objbox', null, side); el('div', 'objl', S.obj, ob); $.obj = el('div', 'obj', '', ob);

  var chips = el('div', 'chips', null, g); $.chips = chips;
  $.row1 = el('div', 'row', null, chips); $.row2 = el('div', 'row', null, chips);
  $.out.addEventListener('click', function (e) { var w = e.target.closest && e.target.closest('.w'); if (w && TOUCH) { insertToken(w.textContent); } });

  $.ov = el('div', 'ovl', null, app); $.ov.addEventListener('click', function (e) { if (e.target === $.ov && $.ov.dataset.dismiss) closeOverlay(); });
  $.card = el('div', 'card', null, $.ov);
  $.toast = el('div', 'toast', '', app);
  window.addEventListener('resize', sizeOrb);
  sizeOrb();
}
function overlay(build, dismiss) { document.body.classList.remove('titlescr'); $.card.className = 'card'; $.card.innerHTML = ''; $.card.scrollTop = 0; build($.card); $.ov.classList.add('on'); $.ov.dataset.dismiss = dismiss ? '1' : ''; document.body.classList.add('modal'); var f = $.card.querySelector('.btn.main') || $.card.querySelector('.btn'); if (f && !TOUCH) setTimeout(function () { f.focus(); }, 30); }
function closeOverlay() { document.body.classList.remove('titlescr'); $.ov.classList.remove('on'); document.body.classList.remove('modal'); if (G && !TOUCH) $.input.focus(); }
function toast(t) { $.toast.textContent = t; $.toast.classList.add('on'); clearTimeout(toast.t); toast.t = setTimeout(function () { $.toast.classList.remove('on'); }, 2600); }

/* terminal */
function print(cls, txt) {
  var d = el('div', 'ln ' + cls, null, $.out);
  if (cls === 'o' && String(txt).length < 6000) { d.innerHTML = esc(txt).replace(/([^\s]+)/g, '<span class="w">$1</span>'); }
  else d.textContent = txt;
  while ($.out.childNodes.length > 400) $.out.removeChild($.out.firstChild);
  $.out.scrollTop = $.out.scrollHeight;
  return d;
}
function clearTerm() { $.out.innerHTML = ''; print('s', '// ' + S.cleared); }
function promptText() { var p = G.cwd === G.tree.home ? '~' : (G.cwd.indexOf(G.tree.home + '/') === 0 ? '~' + G.cwd.slice(G.tree.home.length) : G.cwd); return G.user + '@' + G.host + ':' + p + '$'; }
function updatePrompt() { if ($.prompt && G) $.prompt.textContent = promptText(); }
function onKey(e) {
  if (e.key === 'Enter') { e.preventDefault(); submit(); }
  else if (e.key === 'Tab') { e.preventDefault(); complete(); }
  else if (e.key === 'ArrowUp') { e.preventDefault(); if (G.hi < G.hist.length - 1) G.hi++; $.input.value = G.hist[G.hi] || ''; }
  else if (e.key === 'ArrowDown') { e.preventDefault(); if (G.hi > 0) { G.hi--; $.input.value = G.hist[G.hi] || ''; } else { G.hi = -1; $.input.value = ''; } }
  else if (e.key === 'Escape') { if (typing) finishTyping(); }
}
function submit() {
  gesture();
  var v = $.input.value.trim(); if (!v || !G || G.over) return;
  if (G.mode === 'quiz' && /^[abc123]$/i.test(v)) { $.input.value = ''; answer('abc123'.indexOf(v.toLowerCase()) % 3); return; }
  if (G.mode === 'dialog' && /^[abc123]$/i.test(v)) { $.input.value = ''; var bs = $.choices.querySelectorAll('button'), k = 'abc123'.indexOf(v.toLowerCase()) % 3; if (bs[k]) bs[k].click(); return; }
  $.input.value = ''; G.hist.unshift(v); G.hi = -1;
  run(v);
}
function run(v) {
  print('c', promptText() + ' ' + v); SFX.run();
  var ev = execLine(v);
  if (ev.err) { print('e', ev.err); SFX.err(); shake(); addKass([0, 2, 4, 6][G.def.act] || 2); if (G.def.act === 1) friendlyTip(ev); }
  else if (ev.out !== '') print('o', ev.out);
  if (G.def.onEvent) G.def.onEvent(ev, X());
  if (G.v.noisy) { addKass(G.v.noisy); G.v.noisy = 0; }
  G.lastEv = ev;
  checkStep(ev);
  refreshChips();
}
function shake() { if (reduced) return; $.term.classList.remove('shk'); void $.term.offsetWidth; $.term.classList.add('shk'); }
function friendlyTip(ev) {              // acte I : NAOS explique gentiment l'erreur la plus courante
  var st = curStep(); if (!st) return;
  if (ev.unknown && /^(LS|PWD|CAT|CD)\b/.test(ev.raw)) naosSay(T(D.tips.caps));
  else if (ev.err && /introuvable|no such|inesistente/i.test(ev.err)) naosSay(T(D.tips.nofile));
}
function complete() {
  var v = $.input.value, parts = v.split(' '), last = parts[parts.length - 1], cands;
  if (parts.length === 1) cands = ALLCMDS().filter(function (c) { return c.indexOf(last) === 0; });
  else {
    var dirPart = last.lastIndexOf('/') >= 0 ? last.slice(0, last.lastIndexOf('/') + 1) : '', base = last.slice(dirPart.length), d = getNode(G.tree, abs(dirPart || '.'));
    cands = d && d.d ? Object.keys(d.ch).filter(function (k) { return k.indexOf(base) === 0 && (base.charAt(0) === '.' || k.charAt(0) !== '.'); }).map(function (k) { return dirPart + k + (d.ch[k].d ? '/' : ''); }) : [];
  }
  if (!cands.length) { SFX.bad(); return; }
  if (cands.length === 1) { parts[parts.length - 1] = cands[0]; $.input.value = parts.join(' ') + (/\/$/.test(cands[0]) ? '' : ' '); SFX.key(); return; }
  var pre = cands.reduce(function (a, b) { var i = 0; while (i < a.length && a.charAt(i) === b.charAt(i)) i++; return a.slice(0, i); });
  if (pre.length > last.length) { parts[parts.length - 1] = pre; $.input.value = parts.join(' '); }
  else print('s', cands.join('  '));
}

/* boutons tactiles : commandes, fichiers du dossier courant, mots découverts */
function insertToken(t) {
  var v = $.input.value; if (v && !/\s$/.test(v)) v += ' ';
  $.input.value = v + t; SFX.key(); if (!TOUCH) $.input.focus();
}
function chip(row, label, fn, cls, title) { var b = el('button', 'chip' + (cls ? ' ' + cls : ''), label, row); b.type = 'button'; if (title) b.title = title; b.addEventListener('click', function () { gesture(); fn(); }); return b; }
function refreshChips() {
  if (!G) return; var r1 = $.row1, r2 = $.row2; r1.innerHTML = ''; r2.innerHTML = '';
  if (TOUCH) chip(r1, '⌨', function () { var on = $.input.getAttribute('inputmode') !== 'none'; $.input.setAttribute('inputmode', on ? 'none' : 'text'); $.input.blur(); setTimeout(function () { $.input.focus(); }, 30); }, 'act', S.kbd);
  chip(r1, '⇥', complete, 'act', S.tab);
  chip(r1, '⌫', function () { var v = $.input.value.replace(/\s+$/, ''); $.input.value = v.slice(0, Math.max(0, v.lastIndexOf(' ') + 1)); SFX.key(); }, 'act', S.del);
  chip(r1, '⏎', submit, 'act run', S.run);
  var st = curStep(), sug = st && G.mode === 'cmd' && G.def.act === 1 ? T(st.c, X()) : '';
  if (sug) chip(r1, sug, function () { $.input.value = sug; SFX.key(); if (!TOUCH) $.input.focus(); }, 'sug');
  cmdList().forEach(function (c) { if (c !== 'help' && c !== 'man' && c !== 'hint' && c !== 'clear') chip(r1, c, function () { insertToken(c); }); });
  var d = getNode(G.tree, G.cwd);
  if (G.cwd !== '/') chip(r2, '..', function () { insertToken('..'); }, 'f');
  if (d && d.d) Object.keys(d.ch).sort().forEach(function (k) { if (k.charAt(0) === '.' && !G.seenHidden[G.cwd]) return; chip(r2, k + (d.ch[k].d ? '/' : ''), function () { insertToken(k); }, d.ch[k].d ? 'd' : 'f'); });
  (G.def.opts || []).forEach(function (o) { chip(r2, o, function () { insertToken(o); }, 'o'); });
  G.tokens.forEach(function (t) { chip(r2, t, function () { insertToken(t); }, 'k'); });
}
function addToken(t) { if (G.tokens.indexOf(t) < 0) { G.tokens.push(t); refreshChips(); } }

/* --------------------------------------------------------------------------
   10. NAOS-9 : orbe, voix, consignes
   -------------------------------------------------------------------------- */
var typing = null, msgQueue = [], orbAmp = 0, orbT = 0;
function sizeOrb() { var c = $.orb; if (!c) return; var r = c.getBoundingClientRect(), dpr = Math.min(2, window.devicePixelRatio || 1); c.width = Math.max(1, r.width * dpr); c.height = Math.max(1, r.height * dpr); }
function drawOrb(dt) {
  var c = $.orb; if (!c || !c.width) return; var x = c.getContext('2d'), w = c.width, h = c.height, cx = w / 2, cy = h / 2, R0 = Math.min(w, h) * 0.3;
  orbT += dt; orbAmp += ((typing ? 1 : 0.25) - orbAmp) * Math.min(1, dt * 6);
  var known = G ? G.voice === 'naos' : true, k = G ? G.k / 100 : 0;
  x.clearRect(0, 0, w, h);
  if (!known) {                                  // signal inconnu : onde blanche, irrégulière
    x.strokeStyle = 'rgba(220,240,230,.85)'; x.lineWidth = Math.max(1.5, w / 60); x.beginPath();
    for (var i = 0; i <= 60; i++) { var t = i / 60, yy = cy + Math.sin(t * 18 + orbT * 9) * R0 * 0.55 * orbAmp * Math.sin(t * Math.PI) * (0.6 + 0.4 * Math.sin(orbT * 23 + i)); if (i) x.lineTo(t * w, yy); else x.moveTo(t * w, yy); }
    x.stroke(); x.strokeStyle = 'rgba(160,200,180,.35)'; x.lineWidth = 1; x.strokeRect(1, 1, w - 2, h - 2);
    return;
  }
  var pul = 1 + Math.sin(orbT * 2.4) * 0.05 + orbAmp * 0.12 * Math.sin(orbT * 17);
  var col = k > 0.7 ? [255, 90, 106] : [122, 215, 240];
  var g = x.createRadialGradient(cx, cy, 0, cx, cy, R0 * 2.1 * pul); g.addColorStop(0, 'rgba(' + col + ',.55)'); g.addColorStop(1, 'rgba(' + col + ',0)');
  x.fillStyle = g; x.fillRect(0, 0, w, h);
  var g2 = x.createRadialGradient(cx - R0 * 0.3, cy - R0 * 0.3, R0 * 0.1, cx, cy, R0 * pul); g2.addColorStop(0, '#ffffff'); g2.addColorStop(0.35, 'rgb(' + col + ')'); g2.addColorStop(1, 'rgba(10,40,60,.95)');
  x.fillStyle = g2; x.beginPath(); x.arc(cx, cy, R0 * pul, 0, 7); x.fill();
  x.strokeStyle = 'rgba(227,190,104,.9)'; x.lineWidth = Math.max(1.5, w / 70); x.beginPath(); x.arc(cx, cy, R0 * 1.18 * pul, 0, 7); x.stroke();
  x.strokeStyle = 'rgba(122,215,240,.35)'; x.lineWidth = 1;
  x.beginPath(); x.ellipse(cx, cy, R0 * 1.6, R0 * 0.55, orbT * 0.3, 0, 7); x.stroke();
  x.beginPath(); x.ellipse(cx, cy, R0 * 1.5, R0 * 0.45, -orbT * 0.22 + 1, 0, 7); x.stroke();
}
function setVoice(v) {
  G.voice = v; $.who.textContent = v === 'naos' ? S.naos : S.unknown;
  $.whoSub.textContent = v === 'naos' ? 'ARCHE // ÉCHO ROUGE' : '??.?? THz';
  $.side.classList.toggle('known', v === 'naos');
}
function naosSay(text, cls) {
  if (!text) return;
  msgQueue.push({ t: text, cls: cls || '' });
  if (!typing) nextMsg();
}
function nextMsg() {
  var m = msgQueue.shift(); if (!m) { typing = null; return; }
  var d = el('div', 'msg ' + m.cls, null, $.msgs); d.innerHTML = rich(vars(m.t));
  var nodes = []; (function walk(n) { for (var c = n.firstChild; c; c = c.nextSibling) { if (c.nodeType === 3) { nodes.push({ n: c, t: c.nodeValue }); c.nodeValue = ''; } else walk(c); } })(d);
  typing = { nodes: nodes, i: 0, j: 0, acc: 0, el: d };
  [].slice.call($.msgs.querySelectorAll('.msg')).forEach(function (x, i, a) { x.classList.toggle('old', i < a.length - 1); });
  if (reduced) finishTyping();
}
function typeTick(dt) {
  if (!typing) return;
  typing.acc += dt * (TOUCH ? 75 : 95); var n = Math.floor(typing.acc); typing.acc -= n;
  while (n-- > 0 && typing) {
    var t = typing.nodes[typing.i]; if (!t) { endTyping(); break; }
    t.n.nodeValue = t.t.slice(0, ++typing.j); if (typing.j % 4 === 0) SFX.blip();
    if (typing.j >= t.t.length) { typing.i++; typing.j = 0; }
  }
  $.msgs.scrollTop = $.msgs.scrollHeight;
}
function finishTyping() { if (!typing) return; typing.nodes.forEach(function (t) { t.n.nodeValue = t.t; }); endTyping(); }
function endTyping() { typing = null; $.msgs.scrollTop = $.msgs.scrollHeight; if (msgQueue.length) setTimeout(nextMsg, 250); else if (G && G.afterSay) { var f = G.afterSay; G.afterSay = null; f(); } }
function whenSaid(f) { if (!typing && !msgQueue.length) f(); else G.afterSay = f; }

/* --------------------------------------------------------------------------
   11. DÉROULÉ D'UNE MISSION
   -------------------------------------------------------------------------- */
function curStep() { return G && G.def.steps[G.step]; }
function startMission(n, resume) {
  var def = MISSIONS[n - 1]; if (!def) return;
  closeOverlay(); msgQueue = []; typing = null; $.msgs.innerHTML = ''; $.choices.innerHTML = ''; $.out.innerHTML = '';
  G = { n: n, def: def, step: 0, v: {}, did: {}, mods: [], k: 0, maxK: 0, hist: [], hi: -1, tokens: [], seenHidden: {}, mode: 'cmd', voice: def.voice || 'naos', over: false, hintN: 0, tick: 0, rescued: 0, cwds: {} };
  G.trees = buildTrees(def); G.treeName = 'local'; G.tree = G.trees.local; G.cwd = G.tree.home; G.host = def.host; G.user = agentLow();
  if (resume && save.cur && save.cur.m === n) {
    var c = save.cur; G.v = c.v || {}; G.did = c.did || {}; G.k = c.k || 0; G.maxK = c.maxK || G.k; G.hist = c.hist || []; G.tokens = c.tokens || []; G.seenHidden = c.seen || {}; G.voice = c.voice || G.voice;
    applyMods(c.mods || []); G.mods = (c.mods || []).slice(); if (c.tree && c.tree !== G.treeName) switchTree(c.tree, false);
    G.cwd = getNode(G.tree, c.cwd || '') ? c.cwd : G.tree.home; G.step = Math.min(def.steps.length - 1, c.step | 0);
  }
  document.body.classList.add('playing'); document.body.classList.toggle('act3', def.act === 3);
  $.mnum.textContent = S.mission + ' ' + (n < 10 ? '0' : '') + n + ' · ' + S.acts[def.act - 1].split(' — ')[0];
  $.mtitle.textContent = T(def.title);
  setVoice(G.voice); updatePrompt(); setK(G.k, true); refreshChips();
  setTrack(randomTrack());
  print('s', '─'.repeat(28));
  T(def.brief).split('\n').forEach(function (l, i) { print(i ? 'b' : 'bh', vars(l)); });
  print('s', '─'.repeat(28));
  if (resume) print('s', '// ' + S.resume + ' ' + (G.step + 1) + '/' + def.steps.length);
  showStep(true);
  if (!TOUCH) setTimeout(function () { $.input.focus(); }, 50);
}
function checkpoint() {
  save.cur = { m: G.n, step: G.step, v: G.v, did: G.did, mods: G.mods, k: G.k, maxK: G.maxK, hist: G.hist.slice(0, 40), tokens: G.tokens, seen: G.seenHidden, voice: G.voice, cwd: G.cwd, tree: G.treeName };
  persist();
}
function showStep(first) {
  var st = curStep(); if (!st) return;
  G.mode = st.q ? 'quiz' : st.g ? 'dialog' : 'cmd'; $.choices.innerHTML = ''; G.wrong = {};
  (st.k || []).forEach(learn); (st.tk || []).forEach(addToken);
  $.obj.textContent = T(st.o, X()) || (st.q ? S.quiz : '');
  checkpoint();
  if (st.s) naosSay(T(st.s, X()));
  if (first && G.step === 0 && D.tips && D.tips.start && G.def.act === 1 && G.n === 1) naosSay(T(D.tips.start));
  if (st.q) whenSaid(showQuiz);
  else if (st.g) { G.gi = 0; whenSaid(showDialog); }
  refreshChips();
}
function checkStep(ev) {
  var st = curStep(); if (!st || G.mode !== 'cmd' || G.over) return;
  var ok = false; try { ok = st.d ? !!st.d(ev, X()) : false; } catch (e) { ok = false; }
  if (ok) stepDone();
}
function stepDone() {
  var st = curStep(); G.mode = 'wait'; SFX.ok();
  if (st.ok) naosSay(T(st.ok, X()), 'ok');
  if (st.reveal) { whenSaid(function () { reveal(); }); return; }
  whenSaid(advance);
}
function advance() {
  if (G.over) return;
  G.step++;
  if (G.step >= G.def.steps.length) { missionWon(); return; }
  setTimeout(function () { if (G && !G.over) showStep(false); }, 350);
}
function reveal() {
  SFX.reveal(); $.side.classList.add('flash'); setTimeout(function () { $.side.classList.remove('flash'); }, 1600);
  setVoice('naos'); naosSay(T(curStep().reveal, X()), 'big'); whenSaid(advance);
}
function repeatStep() { var st = curStep(); if (st && st.s) naosSay(T(st.s, X())); }
function giveHint() {
  if (!G || G.over) return; var st = curStep(); if (!st) return;
  var cost = [0, 0, 5, 10][G.def.act] || 0;
  var h = st.h ? T(st.h, X()) : st.c ? '`' + T(st.c, X()) + '`' : st.q ? T(st.q.hint || D.tips.quizHint) : T(D.tips.dialogHint);
  if (cost) addKass(cost);
  naosSay((cost ? '(' + fmt(S.hintCost, { n: cost }) + ') ' : '') + h, 'hint'); G.hintN++;
}
function learn(k) {
  var e = D.codex[k]; if (!e) return;
  G.learned = G.learned || []; if (G.learned.indexOf(k) < 0) G.learned.push(k);
  if (save.codex[k]) return; save.codex[k] = 1; persist(); SFX.codex(); toast(fmt(S.newCodex, { t: T(e.t) }));
  $.codexBtn.classList.add('new'); setTimeout(function () { $.codexBtn.classList.remove('new'); }, 3000);
}

/* quiz */
function showQuiz() {
  var st = curStep(), q = st.q; $.choices.innerHTML = '';
  var box = el('div', 'quiz', null, $.choices); el('div', 'qh', S.quiz, box); el('div', 'qq', null, box).innerHTML = rich(vars(T(q.q, X())));
  q.a.forEach(function (a, i) {
    var b = el('button', 'qa', null, box); b.type = 'button'; b.innerHTML = '<span>' + 'ABC'.charAt(i) + '</span> ' + rich(T(a, X()));
    b.addEventListener('click', function () { gesture(); answer(i); });
  });
  el('div', 'qk', S.answerKeys, box);
  $.choices.scrollIntoView && $.side.scrollTo && ($.side.scrollTop = $.side.scrollHeight);
}
function answer(i) {
  var st = curStep(); if (!st || !st.q || G.mode !== 'quiz') return;
  var bs = $.choices.querySelectorAll('.qa'); if (!bs[i] || bs[i].disabled) return;
  if (i === st.q.r) {
    bs[i].classList.add('right'); [].forEach.call(bs, function (b) { b.disabled = true; }); SFX.good(); G.mode = 'wait';
    if (G.def.act > 1) setK(G.k - 8);
    naosSay(S.right + ' ' + T(st.q.w, X()), 'ok'); (st.q.k || []).forEach(learn);
    whenSaid(function () { setTimeout(function () { $.choices.innerHTML = ''; advance(); }, 500); });
  } else {
    bs[i].classList.add('bad'); bs[i].disabled = true; SFX.bad(); if (G.def.act > 1) addKass(3);
    naosSay(S.wrong + (st.q.hint ? ' ' + T(st.q.hint, X()) : ''), 'hint');
  }
}
/* dialogue */
function showDialog() {
  var st = curStep(), x = st.g[G.gi]; $.choices.innerHTML = '';
  if (!x) { G.mode = 'wait'; if (st.after) naosSay(T(st.after, X())); (st.k2 || []).forEach(learn); whenSaid(advance); return; }
  var box = el('div', 'dlg', null, $.choices);
  var line = el('div', 'dl', null, box); el('b', null, T(x.who || st.who, X()) + ' — ', line); line.appendChild(document.createTextNode(T(x.l, X())));
  if (x.n) el('div', 'dn', '🜂 ' + S.naos + ' : ' + T(x.n, X()), box);
  x.ch.forEach(function (c, i) {
    var b = el('button', 'qa', null, box); b.type = 'button'; b.innerHTML = '<span>' + 'ABC'.charAt(i) + '</span> ' + rich(T(c.t, X()));
    b.addEventListener('click', function () {
      gesture(); G.mode = 'wait'; [].forEach.call(box.querySelectorAll('button'), function (z) { z.disabled = true; }); b.classList.add(c.good ? 'right' : 'bad');
      var r = el('div', 'dl you', null, box); el('b', null, S.you + ' — ', r); r.appendChild(document.createTextNode(T(c.t, X())));
      var rr = el('div', 'dl', null, box); el('b', null, T(x.who || st.who, X()) + ' — ', rr); rr.appendChild(document.createTextNode(T(c.r, X())));
      if (c.v) G.v[c.v] = 1;
      if (!c.good) { SFX.bad(); addKass(st.cost || 12); } else SFX.good();
      setTimeout(function () { G.gi++; G.mode = 'dialog'; showDialog(); }, TOUCH ? 1900 : 1500);
    });
  });
  G.mode = 'dialog'; $.side.scrollTop = $.side.scrollHeight;
}

/* Kassandra */
function setK(v, silent) {
  var old = G.k; G.k = Math.max(0, Math.min(100, Math.round(v))); G.maxK = Math.max(G.maxK, G.k);
  $.kfill.style.width = G.k + '%'; $.kpct.textContent = G.k + ' %';
  $.kfill.className = 'kfill' + (G.k >= 70 ? ' danger' : G.k >= 40 ? ' warn' : '');
  document.body.classList.toggle('alert', G.k >= 70);
  if (!silent && old < 70 && G.k >= 70) SFX.alarm();
}
function addKass(n) {
  if (!G || G.over || !n) return;
  setK(G.k + n);
  if (G.k >= 100) {
    if (G.def.act === 1) { G.rescued++; SFX.glitch(); setK(45, true); naosSay(S.rescue, 'hint'); return; }
    failMission();
  }
}
function failMission() {
  G.over = true; SFX.glitch(); SFX.alarm();
  overlay(function (c) {
    el('div', 'kick red', S.kass + ' 100 %', c); el('h2', 'ttl red', S.failT, c); el('p', 'nar', S.failX, c);
    btn(S.resume, function () { save.cur.k = 30; save.cur.maxK = Math.max(save.cur.maxK || 0, 100); persist(); startMission(G.n, true); }, c, 'main');
    btn(S.restart, function () { save.cur = null; persist(); startMission(G.n, false); }, c);
    btn(S.map, showMap, c, 'ghost');
  });
}
function missionWon() {
  G.over = true; var n = G.n, stars = G.maxK < 40 ? 3 : G.maxK < 75 ? 2 : 1;
  save.done[n] = 1; save.stars[n] = Math.max(save.stars[n] || 0, stars); save.cur = null; persist();
  SFX.win(); document.body.classList.remove('alert');
  setTimeout(function () {
    overlay(function (c) {
      el('div', 'kick', S.mission + ' ' + n + ' / ' + NM, c); el('h2', 'ttl', S.done, c);
      el('div', 'stars', '★★★'.slice(0, stars) + '☆☆☆'.slice(stars), c).title = S.stars;
      el('div', 'small', fmt(S.maxK, { n: G.maxK }), c);
      el('div', 'nar', null, c).innerHTML = rich(vars(T(G.def.outro, X())));
      var ks = (G.learned || []).filter(function (k) { return D.codex[k]; });
      if (ks.length) {
        el('h3', 'lh', S.learned, c); var ul = el('ul', 'learned', null, c);
        ks.forEach(function (k) { var e = D.codex[k], li = el('li', null, null, ul); li.innerHTML = '<code>' + esc(T(e.t)) + '</code> — ' + rich(T(e.m)); });
      }
      if (n < NM) btn(S.next + ' →', function () { startMission(n + 1, false); }, c, 'main');
      else btn(S.finale + ' →', showFinale, c, 'main');
      btn(S.map, showMap, c); btn(S.replay, function () { startMission(n, false); }, c, 'ghost');
    });
  }, 900);
}

/* --------------------------------------------------------------------------
   12. ÉCRANS : titre, nom de code, carte, codex, menu, épilogue
   -------------------------------------------------------------------------- */
function leaveGame() { G = null; document.body.classList.remove('playing', 'alert', 'act3'); msgQueue = []; typing = null; }
function showTitle() {
  leaveGame(); setTrack(T_MENU);
  overlay(function (c) {
    el('div', 'kick', 'ÉCHO ROUGE // TERMINAL', c); el('h1', 'logo', 'SIGNAL', c); el('div', 'subt', S.sub, c);
    el('p', 'nar quote', T(D.tagline), c);
    if (save.name) { var a = el('div', 'agent', S.codename + ' : ' + save.name + ' ', c); var ch = el('button', 'lnk', S.change, a); ch.type = 'button'; ch.addEventListener('click', function () { askName(showTitle); }); }
    var cur = save.cur && MISSIONS[save.cur.m - 1] ? save.cur.m : 0;
    if (cur) btn(fmt(S.cont, { n: cur }), function () { startMission(cur, true); }, c, 'main');
    else if (!save.done[1]) btn(S.play, function () { if (!save.name) askName(function () { startMission(1, false); }); else startMission(1, false); }, c, 'main');
    btn(S.map, showMap, c, cur || !save.done[1] ? '' : 'main');
    btn(S.codex, openCodex, c);
    settingsRow(c);
    var a2 = el('a', 'btn ghost', S.backER, c); a2.href = 'echo-rouge-v2.html';
    if (TOUCH && window.innerHeight > window.innerWidth) el('p', 'small', '↻ ' + S.rotate, c);
  });
  document.body.classList.add('titlescr');
}
function settingsRow(c) {
  var r = el('div', 'set', null, c);
  $.bm = btn('', function () { setMusicOn(!musicOn); }, r); $.bf = btn('', function () { setFx(!fxOn); }, r);
  refreshSettings();
}
function refreshSettings() { if ($.bm) $.bm.textContent = S.music + ' : ' + (musicOn ? S.on : S.off); if ($.bf) $.bf.textContent = S.fx + ' : ' + (fxOn ? S.on : S.off); }
function askName(then) {
  overlay(function (c) {
    el('div', 'kick', 'ÉCHO ROUGE', c); el('h2', 'ttl', S.codename, c); el('p', 'nar', S.codenameQ, c);
    var i = el('input', 'name', null, c); i.maxLength = 16; i.value = save.name; i.placeholder = 'NOM_DE_CODE'; i.setAttribute('autocapitalize', 'characters');
    function ok() { var v = cleanName(i.value); if (v.length < 2) { i.classList.add('bad'); return; } save.name = v; persist(); try { localStorage.setItem('er_codename', v); } catch (e) {} then(); }
    i.addEventListener('keydown', function (e) { if (e.key === 'Enter') ok(); });
    btn(S.codenameOk, ok, c, 'main'); btn(S.back, showTitle, c, 'ghost');
    setTimeout(function () { i.focus(); }, 60);
  });
}
var CITY = { zurich: [118, 120], lyon: [64, 140], prague: [214, 82], brno: [236, 98], gdansk: [238, 22] };
function showMap() {
  leaveGame(); setTrack(T_MENU);
  var up = unlockedUpTo();
  overlay(function (c) {
    c.classList.add('wide');
    el('div', 'kick', 'ÉCHO ROUGE // ' + (save.name || 'AGENT'), c); el('h2', 'ttl', S.map, c);
    var svgNS = 'http://www.w3.org/2000/svg', svg = document.createElementNS(svgNS, 'svg'); svg.setAttribute('viewBox', '0 0 320 160'); svg.setAttribute('class', 'map'); svg.setAttribute('aria-hidden', 'true');
    var actDone = [1, 2, 3].map(function (a) { return MISSIONS.filter(function (m) { return m.act === a; }).every(function (m, i) { return save.done[MISSIONS.indexOf(m) + 1]; }); });
    var pairs = [['lyon', 'zurich', 1], ['zurich', 'prague', 2], ['prague', 'brno', 2], ['brno', 'gdansk', 3]];
    pairs.forEach(function (p) { var l = document.createElementNS(svgNS, 'line'), a = CITY[p[0]], b = CITY[p[1]]; l.setAttribute('x1', a[0]); l.setAttribute('y1', a[1]); l.setAttribute('x2', b[0]); l.setAttribute('y2', b[1]); l.setAttribute('class', 'lk' + (actDone[p[2] - 1] ? ' on' : '')); svg.appendChild(l); });
    Object.keys(CITY).forEach(function (k) {
      var p = CITY[k], ci = document.createElementNS(svgNS, 'circle'); ci.setAttribute('cx', p[0]); ci.setAttribute('cy', p[1]); ci.setAttribute('r', 5);
      var act = { lyon: 0, zurich: 1, prague: 2, brno: 2, gdansk: 3 }[k]; ci.setAttribute('class', 'ct' + (act === 0 || actDone[act - 1] ? ' on' : act === 1 || actDone[act - 2] ? ' cur' : ''));
      svg.appendChild(ci); var t = document.createElementNS(svgNS, 'text'); t.setAttribute('x', p[0] + 8); t.setAttribute('y', p[1] + 4); t.textContent = k === 'gdansk' ? 'Gdańsk' : k === 'zurich' ? (lang === 'it' ? 'Zurigo' : 'Zurich') : k === 'prague' ? (lang === 'en' ? 'Prague' : lang === 'it' ? 'Praga' : 'Prague') : k.charAt(0).toUpperCase() + k.slice(1); svg.appendChild(t);
    });
    c.appendChild(svg);
    var grid = el('div', 'acts', null, c);
    [1, 2, 3].forEach(function (a) {
      var col = el('div', 'actc', null, grid); el('div', 'acth', S.acts[a - 1], col); el('div', 'acts2', S.cities[a - 1] + ' · ' + S.actHint[a - 1], col);
      MISSIONS.forEach(function (m, i) {
        if (m.act !== a) return; var n = i + 1, open = n <= up, b = el('button', 'mis' + (open ? '' : ' off') + (save.done[n] ? ' done' : ''), null, col); b.type = 'button'; b.disabled = !open;
        el('span', 'n', (n < 10 ? '0' : '') + n, b); el('span', 't', (m.star ? '★ ' : '') + T(m.title), b);
        el('span', 's', save.done[n] ? '★★★'.slice(0, save.stars[n] || 1) + '☆☆☆'.slice(save.stars[n] || 1) : open ? (save.cur && save.cur.m === n ? '…' : '▶') : '🔒', b);
        if (open) b.addEventListener('click', function () { gesture(); SFX.ui(); var go = function () { startMission(n, !!(save.cur && save.cur.m === n)); }; if (!save.name) askName(go); else go(); });
      });
    });
    if (window.SIGNAL_BONUS) window.SIGNAL_BONUS.mapBlock(c);
    var bar = el('div', 'row2', null, c); btn(S.codex, openCodex, bar); btn(S.back, showTitle, bar, 'ghost');
  });
}
function codexText(k, e) {
  var a = [T(e.t) + ' — ' + T(e.m)]; if (e.x) a.push(S.example + ' : ' + e.x); if (e.d) a.push(T(e.d)); if (e.r) a.push(S.real + ' : ' + T(e.r)); return a.join('\n');
}
function openCodex() {
  var inBonus = document.body.classList.contains('c64on'), inGame = !!(G && !G.over) || inBonus, back = inGame ? closeOverlay : null, keys = Object.keys(D.codex);
  if (G && !G.over) G.paused = true;
  overlay(function (c) {
    c.classList.add('wide');
    el('div', 'kick', 'ÉCHO ROUGE // NAOS-9', c); el('h2', 'ttl', S.codex, c);
    var cnt = keys.filter(function (k) { return save.codex[k]; }).length; el('div', 'small', cnt + ' / ' + keys.length, c);
    [['cmd', S.codexCmd], ['idea', S.codexIdea], ['basic', S.codexBasic]].forEach(function (grp) {
      el('h3', 'lh', grp[1], c); var list = el('div', 'cx', null, c);
      keys.forEach(function (k) {
        var e = D.codex[k]; if (e.kind !== grp[0]) return; var on = !!save.codex[k], it = el('details', 'cxe' + (on ? '' : ' off'), null, list), sm = el('summary', null, null, it);
        if (!on) { sm.textContent = '??? — ' + S.lockedEntry; return; }
        sm.innerHTML = '<code>' + esc(T(e.t)) + '</code> <span>' + rich(T(e.m)) + '</span>';
        var b = el('div', 'cxb', null, it); if (e.x) b.innerHTML += '<p><b>' + S.example + '</b> : <code>' + esc(e.x) + '</code></p>'; if (e.d) b.innerHTML += '<p>' + rich(T(e.d)) + '</p>'; if (e.r) b.innerHTML += '<p class="real"><b>' + S.real + '</b> : ' + rich(T(e.r)) + '</p>';
      });
    });
    var bar = el('div', 'row2', null, c);
    if (back) btn(S.close, function () { if (G) G.paused = false; closeOverlay(); }, bar, 'main'); else btn(S.back, showTitle, bar, 'main');
  }, !!back);
  if (inGame) $.ov.dataset.dismiss = '1';
}
function openMenu() {
  if (!G) return; G.paused = true;
  overlay(function (c) {
    el('div', 'kick', S.mission + ' ' + G.n, c); el('h2', 'ttl', T(G.def.title), c);
    btn(S.back, function () { G.paused = false; closeOverlay(); }, c, 'main');
    btn(S.codex, openCodex, c); settingsRow(c);
    btn(S.restart, function () { if (window.confirm(S.restartQ)) { save.cur = null; persist(); startMission(G.n, false); } }, c);
    btn(S.map, function () { checkpoint(); showMap(); }, c, 'ghost');
  }, true);
}
function showFinale() {
  leaveGame(); setTrack(T_END);
  var cmds = Object.keys(D.codex).filter(function (k) { return save.codex[k] && D.codex[k].kind === 'cmd'; }).length, ideas = Object.keys(D.codex).filter(function (k) { return save.codex[k] && D.codex[k].kind === 'idea'; }).length;
  overlay(function (c) {
    el('div', 'kick', 'ÉCHO ROUGE // NAOS-9', c); el('h2', 'ttl', S.endT, c);
    el('div', 'nar', null, c).innerHTML = rich(vars(T(D.finale)));
    el('p', 'nar small', fmt(S.allLearned, { c: cmds, n: ideas }), c);
    btn(S.codex, openCodex, c, 'main'); btn(S.map, showMap, c); btn(S.backER, function () { location.href = 'echo-rouge-v2.html'; }, c, 'ghost');
  });
}
function boot() {
  var lines = T(D.boot).split('\n'), i = 0, done = false;
  overlay(function (c) { c.classList.add('boot'); var pre = el('div', 'bootl', null, c); $.bootl = pre; el('div', 'small', '▸ ' + (TOUCH ? '⏎' : 'Enter / clic'), c); });
  function finish() { if (done) return; done = true; document.removeEventListener('keydown', finish); $.ov.removeEventListener('click', finish); try { sessionStorage.setItem('signal_boot', '1'); } catch (e) {} showTitle(); }
  document.addEventListener('keydown', finish); $.ov.addEventListener('click', finish);
  (function step() { if (done) return; if (i >= lines.length) { setTimeout(finish, 700); return; } var l = el('div', /^⚠/.test(lines[i]) ? 'warn' : '', lines[i], $.bootl); i++; setTimeout(step, 160); })();
}

/* --------------------------------------------------------------------------
   13. BOUCLE : NAOS parle, Kassandra veille, musique
   -------------------------------------------------------------------------- */
var lastT = 0;
function frame(t) {
  var dt = Math.min(0.1, (t - (lastT || t)) / 1000); lastT = t;
  typeTick(dt); drawOrb(dt); musicTick(dt);
  if (G && !G.over && !G.paused && !document.hidden && !$.ov.classList.contains('on') && G.mode === 'cmd' && !typing) {
    var rate = [0, 0, 1 / 9, 1 / 4.5][G.def.act] || 0;     // points de détection par seconde
    if (rate) { G.tick += dt * rate; if (G.tick >= 1) { var n = Math.floor(G.tick); G.tick -= n; addKass(n); } }
  }
  requestAnimationFrame(frame);
}

/* --------------------------------------------------------------------------
   14. DÉMARRAGE et accès pour les tests automatisés
   -------------------------------------------------------------------------- */
window.SIGNAL_API = { S: S, T: T, lang: lang, TOUCH: TOUCH, H: H, D: D, save: save, persist: persist, SFX: SFX, tone: tone, noise: noise, gesture: gesture, setTrack: setTrack, randomTrack: randomTrack, T_MENU: T_MENU,
  overlay: overlay, closeOverlay: closeOverlay, el: el, btn: btn, rich: rich, esc: esc, toast: toast, showMap: showMap, showTitle: showTitle, openCodex: openCodex, leaveGame: leaveGame, fmt: fmt,
  learn: function (k) { var e = D.codex[k]; if (!e || save.codex[k]) return; save.codex[k] = 1; persist(); SFX.codex(); toast(fmt(S.newCodex, { t: T(e.t) })); } };
buildUI();
var skipBoot = false; try { skipBoot = sessionStorage.getItem('signal_boot') === '1'; } catch (e) {}
if (skipBoot) showTitle(); else boot();
requestAnimationFrame(frame);
document.addEventListener('pointerdown', gesture, { once: true });
window.__sig = {
  get G() { return G; }, save: save, start: startMission, run: function (v) { run(v); }, answer: answer, finish: finishTyping, map: showMap, codex: openCodex, title: showTitle,
  get mode() { return G && G.mode; }, get step() { return G && G.step; }, get k() { return G && G.k; }, setK: function (v) { setK(v); }, exec: function (v) { return execLine(v); },
  dialog: function (i) { var b = $.choices.querySelectorAll('button')[i]; if (b) b.click(); }, get typing() { return !!typing || msgQueue.length > 0; }, get sfx() { return sfxCount; }, music: function () { return { on: musicOn, cur: mus.cur && mus.cur.t, want: mus.want.t }; }
};
})();
