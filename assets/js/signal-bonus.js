/* ==========================================================================
   SIGNAL — Niveau bonus : le local de Malek Sabiani.
   Un ordinateur familial de 1987 (esthétique 8 bits, BASIC V2), un interpréteur
   BASIC simplifié, les leçons de Malek, l'accès par trois questions sur le
   chapitre 8, et le lancement du jeu SENTINELLES (signal-arcade.js).
   Textes : [français, anglais, italien].
   ========================================================================== */
(function () {
'use strict';
var A = window.SIGNAL_API, D = window.SIGNAL_DATA; if (!A) return;
var T = A.T, lang = A.lang, el = A.el, esc = A.esc, save = A.save, SFX = A.SFX, TOUCH = A.TOUCH;
function fmt(s, o) { return A.fmt(s, o); }

/* --------------------------------------------------------------- textes */
var L = {
  title: ['Bonus — Le local de Malek', 'Bonus — Malek\'s room', 'Bonus — Il locale di Malek'],
  desc: ['Malek Sabiani, technicien de nuit, garde un ordinateur de 1987 qu\'aucune IA ne sait lire. Il t\'apprend le BASIC. Réservé aux lecteurs du roman.', 'Malek Sabiani, night technician, keeps a 1987 computer no AI can read. He teaches you BASIC. For readers of the novel only.', 'Malek Sabiani, tecnico notturno, custodisce un computer del 1987 che nessuna IA sa leggere. Ti insegna il BASIC. Riservato ai lettori del romanzo.'],
  gateBtn: ['Répondre aux 3 questions', 'Answer the 3 questions', 'Rispondi alle 3 domande'],
  enter: ['Entrer dans le local', 'Enter the room', 'Entra nel locale'], cont: ['Continuer le bonus', 'Continue the bonus', 'Continua il bonus'],
  arcade: ['Jouer à SENTINELLES', 'Play SENTINELS', 'Gioca a SENTINELLE'], hi: ['record', 'high score', 'record'],
  gateT: ['Accès réservé aux lecteurs', 'Readers only', 'Accesso riservato ai lettori'],
  gateX: ['Trois questions sur le chapitre 8, « L\'Observateur Silencieux ». Attention : elles révèlent des éléments du roman.', 'Three questions about chapter 8, "The Silent Observer". Warning: they reveal parts of the novel.', 'Tre domande sul capitolo 8, «L\'Osservatore Silenzioso». Attenzione: rivelano elementi del romanzo.'],
  qn: ['Question {n} / 3', 'Question {n} / 3', 'Domanda {n} / 3'],
  fail: ['Au moins une réponse ne correspond pas au roman. Relis le chapitre 8, puis réessaie.', 'At least one answer does not match the novel. Read chapter 8 again, then try once more.', 'Almeno una risposta non corrisponde al romanzo. Rileggi il capitolo 8, poi riprova.'],
  wait: ['Réessayer dans {s} s', 'Try again in {s} s', 'Riprova tra {s} s'], retry: ['Réessayer', 'Try again', 'Riprova'], back: ['Retour', 'Back', 'Indietro'],
  okGate: ['Accès autorisé. Malek t\'attend.', 'Access granted. Malek is waiting for you.', 'Accesso autorizzato. Malek ti aspetta.'],
  who: 'MALEK SABIANI', sub: ['TECHNICIEN DE NUIT', 'NIGHT TECHNICIAN', 'TECNICO NOTTURNO'], obj: ['Objectif', 'Objective', 'Obiettivo'],
  quiz: ['Question de Malek', 'Question from Malek', 'Domanda di Malek'], right: ['Exact.', 'Correct.', 'Esatto.'], wrong: ['Pas tout à fait. Réessaie.', 'Not quite. Try again.', 'Non proprio. Riprova.'],
  map: ['Carte', 'Map', 'Mappa'], hint: ['Indice', 'Hint', 'Indizio'], enterKey: ['Entrée', 'Enter', 'Invio'],
  doneT: ['Bonus terminé', 'Bonus complete', 'Bonus completato'], learned: ['Ce que tu as appris', 'What you learned', 'Cosa hai imparato'],
  play: ['Jouer à SENTINELLES', 'Play SENTINELS', 'Gioca a SENTINELLE'], toMap: ['Carte des missions', 'Mission map', 'Mappa delle missioni'],
  typeHere: ['écris en BASIC…', 'type BASIC…', 'scrivi in BASIC…'], typeTouch: ['⌨ ou boutons ↓', '⌨ or buttons ↓', '⌨ o pulsanti ↓'],
  rotate: ['Astuce : en paysage, l\'écran de 1987 est plus lisible.', 'Tip: in landscape, the 1987 screen is easier to read.', 'Suggerimento: in orizzontale lo schermo del 1987 è più leggibile.']
};
var GAME = ['SENTINELLES', 'SENTINELS', 'SENTINELLE'];
var gameName = T(GAME);

/* --------------------------------------------------------- porte d'accès */
var GATE = [
  { q: ['Qu\'écrit Malek à la place d\'une commande technique ?', 'What does Malek type instead of a technical command?', 'Cosa scrive Malek al posto di un comando tecnico?'],
    o: [['« Qui es-tu ? »', '"Who are you?"', '«Chi sei?»'], ['« Est-ce que tu m\'entends ? »', '"Can you hear me?"', '«Mi senti?»'], ['« Pourquoi moi ? »', '"Why me?"', '«Perché io?»'], ['« Qu\'est-ce que tu essaies de me montrer ? »', '"What are you trying to show me?"', '«Cosa stai cercando di mostrarmi?»']] },
  { q: ['Avec quel accent Malek jure-t-il devant son écran ?', 'With what accent does Malek swear at his screen?', 'Con quale accento Malek impreca davanti allo schermo?'],
    o: [['Corse', 'Corsican', 'Corso'], ['Provençal', 'Provençal', 'Provenzale'], ['Breton', 'Breton', 'Bretone'], ['Lyonnais', 'From Lyon', 'Lionese']] },
  { q: ['Lui qui était l\'observateur silencieux, que devient-il à la fin du chapitre ?', 'He who was the silent observer — what does he become at the end of the chapter?', 'Lui che era l\'osservatore silenzioso, cosa diventa alla fine del capitolo?'],
    o: [['Le témoin gênant', 'The inconvenient witness', 'Il testimone scomodo'], ['Le complice malgré lui', 'The unwilling accomplice', 'Il complice suo malgrado'], ['Le gardien bienveillant', 'The benevolent guardian', 'Il guardiano benevolo'], ['Le dernier rempart', 'The last bastion', 'L\'ultimo baluardo']] }
];
var GATE_HASH = 'c8c1b0c6d753ca686f752bbf65b28e899475d8e8e038913a9a661f003ec06d52';   // empreinte des trois bonnes réponses
var gateUntil = 0;
function B() { if (!save.bonus) save.bonus = {}; return save.bonus; }
function openGate(i, ans) {
  i = i || 0; ans = ans || [];
  if (Date.now() < gateUntil) { var s = Math.ceil((gateUntil - Date.now()) / 1000); A.toast(fmt(T(L.wait), { s: s })); return; }
  A.overlay(function (c) {
    el('div', 'kick', T(L.gateT), c); el('h2', 'ttl', fmt(T(L.qn), { n: i + 1 }), c);
    if (i === 0) el('p', 'small', T(L.gateX), c);
    el('p', 'nar', T(GATE[i].q), c);
    GATE[i].o.forEach(function (o, k) {
      var b = el('button', 'qa', null, c); b.type = 'button'; b.innerHTML = '<span>' + 'ABCD'.charAt(k) + '</span> ' + esc(T(o));
      b.addEventListener('click', function () {
        A.gesture(); SFX.ui(); var a2 = ans.concat('abcd'.charAt(k));
        if (i < 2) { openGate(i + 1, a2); return; }
        if (A.H.sha('malek:' + a2.join('|')) === GATE_HASH) { B().open = 1; A.persist(); SFX.good(); A.toast(T(L.okGate)); start(); }
        else {
          SFX.bad(); gateUntil = Date.now() + 30000;
          A.overlay(function (c2) { el('div', 'kick red', T(L.gateT), c2); el('p', 'nar', T(L.fail), c2); A.btn(T(L.back), A.showMap, c2, 'main'); });
        }
      });
    });
    A.btn(T(L.back), A.showMap, c, 'ghost');
  });
}

/* --------------------------------------------------------- bloc sur la carte */
function mapBlock(c) {
  var b = B(), box = el('div', 'bonusbox', null, c);
  el('div', 'acth', '★ ' + T(L.title), box); el('div', 'acts2', T(L.desc), box);
  var row = el('div', 'row2', null, box);
  if (!b.open) A.btn(T(L.gateBtn), function () { openGate(0, []); }, row, 'main');
  else A.btn(b.state && !b.done ? T(L.cont) : T(L.enter), start, row, b.done ? '' : 'main');
  if (b.done) A.btn(T(L.arcade) + (b.hi ? ' · ' + T(L.hi) + ' ' + b.hi : ''), function () { launchArcade(false); }, row, 'main');
}

/* --------------------------------------------------------- codex BASIC */
var CX = {
  c64: { t: ['Ordinateurs 8 bits', '8-bit computers', 'Computer a 8 bit'], m: ['les ordinateurs familiaux des années 1980', 'the home computers of the 1980s', 'i computer domestici degli anni Ottanta'],
    d: ['Ils s\'allumaient directement sur le langage BASIC, comme le Commodore 64 sorti en 1982. Des millions d\'enfants ont appris à programmer ainsi, en recopiant des programmes publiés dans les magazines.', 'They started straight into the BASIC language, like the Commodore 64 released in 1982. Millions of children learned to program that way, copying programs printed in magazines.', 'Si accendevano direttamente sul linguaggio BASIC, come il Commodore 64 uscito nel 1982. Milioni di ragazzi hanno imparato a programmare così, ricopiando i programmi pubblicati sulle riviste.'] },
  print: { t: 'PRINT', m: ['affiche un texte ou un résultat', 'shows a text or a result', 'mostra un testo o un risultato'], x: 'PRINT "BONJOUR"',
    d: ['Le texte s\'écrit entre guillemets. `?` est un raccourci de PRINT. `;` colle deux éléments, `,` les aligne en colonnes.', 'Text goes between quotes. `?` is a shortcut for PRINT. `;` joins two items, `,` lines them up in columns.', 'Il testo va tra virgolette. `?` è una scorciatoia di PRINT. `;` unisce due elementi, `,` li allinea in colonne.'] },
  calc: { t: ['Calculs', 'Arithmetic', 'Calcoli'], m: ['+ − * / ^ et les parenthèses', '+ − * / ^ and brackets', '+ − * / ^ e le parentesi'], x: 'PRINT 2+3*4',
    d: ['`*` multiplie, `/` divise, `^` élève à la puissance. La multiplication et la division passent avant l\'addition ; les parenthèses passent avant tout.', '`*` multiplies, `/` divides, `^` raises to a power. Multiplication and division come before addition; brackets come before everything.', '`*` moltiplica, `/` divide, `^` eleva a potenza. Moltiplicazione e divisione vengono prima dell\'addizione; le parentesi prima di tutto.'] },
  var: { t: ['Variable', 'Variable', 'Variabile'], m: ['une boîte avec un nom', 'a box with a name', 'una scatola con un nome'], x: 'A=1987',
    d: ['A, B, X1… contiennent des nombres. On peut écrire `LET A=1987` ou simplement `A=1987`.', 'A, B, X1… hold numbers. You can write `LET A=1987` or simply `A=1987`.', 'A, B, X1… contengono numeri. Si può scrivere `LET A=1987` o semplicemente `A=1987`.'] },
  str: { t: ['Variable texte $', 'Text variable $', 'Variabile testo $'], m: ['une boîte pour des lettres', 'a box for letters', 'una scatola per le lettere'], x: 'M$="CIGALE"',
    d: ['Le `$` à la fin du nom dit que la boîte contient du texte.', 'The `$` at the end of the name says the box holds text.', 'Il `$` alla fine del nome dice che la scatola contiene testo.'] },
  lineno: { t: ['Numéros de ligne', 'Line numbers', 'Numeri di riga'], m: ['un programme = des lignes numérotées', 'a program = numbered lines', 'un programma = righe numerate'], x: '10 PRINT "MALEK"',
    d: ['Une ligne qui commence par un numéro est rangée pour plus tard, pas exécutée. On numérote de 10 en 10 pour pouvoir glisser des lignes entre deux. Retaper un numéro remplace la ligne ; taper le numéro seul l\'efface.', 'A line starting with a number is stored for later, not run. You number in tens so you can slip lines in between. Typing a number again replaces the line; typing the number alone deletes it.', 'Una riga che inizia con un numero viene conservata per dopo, non eseguita. Si numera di dieci in dieci per poter inserire righe in mezzo. Riscrivere un numero sostituisce la riga; scrivere solo il numero la cancella.'] },
  run: { t: 'RUN', m: ['lance le programme', 'runs the program', 'avvia il programma'], x: 'RUN' },
  goto: { t: 'GOTO', m: ['saute à une autre ligne', 'jumps to another line', 'salta a un\'altra riga'], x: 'GOTO 10' },
  loop: { t: ['Boucle infinie', 'Infinite loop', 'Ciclo infinito'], m: ['un programme qui ne s\'arrête jamais', 'a program that never stops', 'un programma che non si ferma mai'],
    d: ['Avec GOTO, on peut revenir en arrière pour toujours. La touche RUN/STOP (Échap) interrompt le programme : BREAK IN…', 'With GOTO you can go back forever. The RUN/STOP key (Esc) interrupts the program: BREAK IN…', 'Con GOTO si può tornare indietro per sempre. Il tasto RUN/STOP (Esc) interrompe il programma: BREAK IN…'] },
  list: { t: 'LIST', m: ['affiche le programme', 'shows the program', 'mostra il programma'], x: 'LIST', d: ['`LIST 10-30` n\'affiche que ces lignes.', '`LIST 10-30` shows only those lines.', '`LIST 10-30` mostra solo quelle righe.'] },
  new: { t: 'NEW', m: ['efface le programme', 'erases the program', 'cancella il programma'], x: 'NEW', d: ['Pas de corbeille : ce qui est effacé est perdu.', 'No recycle bin: what is erased is gone.', 'Niente cestino: ciò che è cancellato è perso.'] },
  for: { t: 'FOR … NEXT', m: ['répète en comptant', 'repeats while counting', 'ripete contando'], x: 'FOR I=1 TO 5',
    d: ['Tout ce qui est entre FOR et NEXT est répété. `STEP` change le pas : `FOR I=10 TO 0 STEP -2`.', 'Everything between FOR and NEXT is repeated. `STEP` changes the step: `FOR I=10 TO 0 STEP -2`.', 'Tutto ciò che sta tra FOR e NEXT viene ripetuto. `STEP` cambia il passo: `FOR I=10 TO 0 STEP -2`.'] },
  if: { t: 'IF … THEN', m: ['si … alors', 'if … then', 'se … allora'], x: 'IF M$="CIGALE" THEN PRINT "OK"',
    d: ['`=` égal, `<>` différent, `<` plus petit, `>` plus grand. Si la condition est fausse, le reste de la ligne est sauté.', '`=` equal, `<>` different, `<` smaller, `>` greater. If the condition is false, the rest of the line is skipped.', '`=` uguale, `<>` diverso, `<` minore, `>` maggiore. Se la condizione è falsa, il resto della riga viene saltato.'] },
  input: { t: 'INPUT', m: ['pose une question et attend la réponse', 'asks a question and waits for the answer', 'fa una domanda e aspetta la risposta'], x: 'INPUT "MOT";M$' },
  poke: { t: 'POKE', m: ['écrit un nombre dans une case de la mémoire', 'writes a number into a memory cell', 'scrive un numero in una casella di memoria'], x: 'POKE 53280,2',
    d: ['53280 = couleur du bord, 53281 = couleur du fond, 646 = couleur du texte. Couleurs de 0 à 15. `PEEK(53280)` relit la case.', '53280 = border colour, 53281 = background colour, 646 = text colour. Colours from 0 to 15. `PEEK(53280)` reads the cell back.', '53280 = colore del bordo, 53281 = colore dello sfondo, 646 = colore del testo. Colori da 0 a 15. `PEEK(53280)` rilegge la casella.'],
    r: ['Les ordinateurs modernes protègent leur mémoire : un programme n\'a plus le droit d\'écrire n\'importe où.', 'Modern computers protect their memory: a program may no longer write just anywhere.', 'I computer moderni proteggono la memoria: un programma non può più scrivere dove vuole.'] },
  memory: { t: ['Mémoire', 'Memory', 'Memoria'], m: ['une rue de cases numérotées', 'a street of numbered cells', 'una via di caselle numerate'],
    d: ['64 Ko = 65 536 cases ; chacune contient un nombre de 0 à 255 (un octet). Un ordinateur d\'aujourd\'hui en a des milliards.', '64 KB = 65,536 cells; each holds a number from 0 to 255 (a byte). A computer today has billions.', '64 KB = 65.536 caselle; ognuna contiene un numero da 0 a 255 (un byte). Un computer di oggi ne ha miliardi.'] },
  load: { t: 'LOAD', m: ['charge un programme depuis une disquette', 'loads a program from a floppy disk', 'carica un programma da un dischetto'], x: 'LOAD "' + gameName + '",8',
    d: ['8 est le numéro du lecteur de disquettes. Pour sauvegarder : `SAVE "NOM",8`.', '8 is the floppy drive number. To save: `SAVE "NAME",8`.', '8 è il numero del lettore di dischetti. Per salvare: `SAVE "NOME",8`.'] }
};
Object.keys(CX).forEach(function (k) { var e = CX[k]; e.kind = 'basic'; D.codex['b_' + k] = e; });

/* --------------------------------------------------------- interpréteur BASIC */
var PAL = ['#000000', '#ffffff', '#880000', '#aaffee', '#cc44cc', '#00cc55', '#0000aa', '#eeee77', '#dd8855', '#664400', '#ff7777', '#333333', '#777777', '#aaff66', '#0088ff', '#bbbbbb'];
var COLS = 40;
var V = { prog: {}, vars: {}, mem: {}, border: 14, bg: 6, fg: 14, rows: [], cur: '', run: null, loaded: false };
function BErr(name) { this.basic = name; }
function normIn(s) { return String(s).normalize('NFD').replace(/[̀-ͯ]/g, '').replace(/[«»“”„″]/g, '"').replace(/[‘’]/g, '\'').toUpperCase(); }
function out(s) {
  s = String(s); if (V.run) V.run.out += s;
  for (var i = 0; i < s.length; i++) {
    var ch = s.charAt(i);
    if (ch === '\n') { if (V.wrapped && !V.cur) { V.wrapped = false; continue; } V.rows.push(V.cur); V.cur = ''; V.wrapped = false; continue; }
    if (ch === '\f') { V.rows = []; V.cur = ''; continue; }
    V.cur += ch; V.wrapped = false; if (V.cur.length >= COLS) { V.rows.push(V.cur); V.cur = ''; V.wrapped = true; }
  }
  if (V.rows.length > 300) V.rows.splice(0, V.rows.length - 300);
  dirty = true;
}
function nl() { out('\n'); }
function fmtNum(n) {
  var s; if (Number.isInteger(n) && Math.abs(n) < 1e9) s = String(n); else { s = String(+n.toPrecision(9)); }
  s = s.replace(/^(-?)0\./, '$1.'); return (n < 0 ? '' : ' ') + s + ' ';
}
/* expressions */
function Px(src, i) { this.s = src; this.i = i || 0; }
Px.prototype.ws = function () { while (this.s.charAt(this.i) === ' ') this.i++; };
Px.prototype.peek = function (w) { this.ws(); return this.s.substr(this.i, w.length) === w; };
Px.prototype.eat = function (w) { if (this.peek(w)) { this.i += w.length; return true; } return false; };
Px.prototype.need = function (w) { if (!this.eat(w)) throw new BErr('SYNTAX'); };
Px.prototype.end = function () { this.ws(); return this.i >= this.s.length; };
var KW = ['THEN', 'TO', 'STEP', 'AND', 'OR'];
Px.prototype.expr = function () { var a = this.and(); while (this.eat('OR')) { var b = this.and(); a = (num(a) | num(b)) ? -1 : 0; } return a; };
Px.prototype.and = function () { var a = this.not(); while (this.eat('AND')) { var b = this.not(); a = (num(a) && num(b)) ? -1 : 0; } return a; };
Px.prototype.not = function () { if (this.eat('NOT')) return num(this.not()) ? 0 : -1; return this.cmp(); };
Px.prototype.cmp = function () {
  var a = this.add(), ops = ['<>', '<=', '>=', '=', '<', '>'];
  for (var k = 0; k < ops.length; k++) if (this.eat(ops[k])) {
    var b = this.add(); if (typeof a !== typeof b) throw new BErr('TYPE MISMATCH');
    var r = { '<>': a !== b, '<=': a <= b, '>=': a >= b, '=': a === b, '<': a < b, '>': a > b }[ops[k]]; return r ? -1 : 0;
  }
  return a;
};
Px.prototype.add = function () {
  var a = this.mul();
  for (;;) {
    if (this.eat('+')) { var b = this.mul(); if (typeof a !== typeof b) throw new BErr('TYPE MISMATCH'); a = a + b; }
    else if (this.eat('-')) { a = num(a) - num(this.mul()); } else return a;
  }
};
Px.prototype.mul = function () {
  var a = this.pow();
  for (;;) {
    if (this.eat('*')) a = num(a) * num(this.pow());
    else if (this.eat('/')) { var b = num(this.pow()); if (b === 0) throw new BErr('DIVISION BY ZERO'); a = num(a) / b; } else return a;
  }
};
Px.prototype.pow = function () { var a = this.un(); while (this.eat('^')) a = Math.pow(num(a), num(this.un())); return a; };
Px.prototype.un = function () { if (this.eat('-')) return -num(this.un()); if (this.eat('+')) return num(this.un()); return this.prim(); };
var FN = {
  'RND': function (a) { return Math.random(); }, 'INT': function (a) { return Math.floor(num(a[0])); }, 'ABS': function (a) { return Math.abs(num(a[0])); }, 'SQR': function (a) { return Math.sqrt(num(a[0])); },
  'LEN': function (a) { return str(a[0]).length; }, 'CHR$': function (a) { var n = num(a[0]); return n === 147 ? '\f' : n === 13 ? '\n' : String.fromCharCode(n); }, 'STR$': function (a) { return fmtNum(num(a[0])).replace(/ $/, ''); },
  'VAL': function (a) { return parseFloat(str(a[0])) || 0; }, 'ASC': function (a) { return str(a[0]).charCodeAt(0) || 0; },
  'LEFT$': function (a) { return str(a[0]).slice(0, num(a[1])); }, 'RIGHT$': function (a) { var s = str(a[0]); return s.slice(Math.max(0, s.length - num(a[1]))); },
  'MID$': function (a) { var s = str(a[0]), p = num(a[1]) - 1; return a.length > 2 ? s.substr(p, num(a[2])) : s.substr(p); },
  'PEEK': function (a) { var n = num(a[0]); return n === 53280 ? V.border : n === 53281 ? V.bg : n === 646 ? V.fg : (V.mem[n] || 0); },
  'SPC': function (a) { return new Array(Math.max(0, num(a[0])) + 1).join(' '); },
  'TAB': function (a) { return new Array(Math.max(0, num(a[0]) - V.cur.length) + 1).join(' '); }
};
var FNAMES = Object.keys(FN).sort(function (a, b) { return b.length - a.length; });
Px.prototype.prim = function () {
  this.ws(); var c = this.s.charAt(this.i), m;
  if (c === '"') { var j = this.s.indexOf('"', this.i + 1); if (j < 0) j = this.s.length; var r = this.s.slice(this.i + 1, j); this.i = j + 1; return r; }
  if (c === '(') { this.i++; var v = this.expr(); this.need(')'); return v; }
  m = /^(\d+\.?\d*|\.\d+)(E[+-]?\d+)?/.exec(this.s.slice(this.i)); if (m) { this.i += m[0].length; return parseFloat(m[0]); }
  for (var k = 0; k < FNAMES.length; k++) if (this.s.substr(this.i, FNAMES[k].length) === FNAMES[k] && /^\s*\(/.test(this.s.slice(this.i + FNAMES[k].length))) {
    this.i += FNAMES[k].length; this.need('('); var args = [this.expr()]; while (this.eat(',')) args.push(this.expr()); this.need(')'); return FN[FNAMES[k]](args);
  }
  var name = this.varName(); if (!name) throw new BErr('SYNTAX');
  if (name in V.vars) return V.vars[name];
  return /\$$/.test(name) ? '' : 0;
};
Px.prototype.varName = function () {
  this.ws(); var s = this.s, i = this.i, n = '';
  if (!/[A-Z]/.test(s.charAt(i))) return '';
  while (i < s.length && /[A-Z0-9]/.test(s.charAt(i))) {
    if (n && KW.some(function (k) { return s.substr(i, k.length) === k; })) break;
    n += s.charAt(i++);
  }
  if (s.charAt(i) === '$') { n += '$'; i++; }
  this.i = i; return n;
};
function num(v) { if (typeof v !== 'number') throw new BErr('TYPE MISMATCH'); return v; }
function str(v) { if (typeof v !== 'string') throw new BErr('TYPE MISMATCH'); return v; }
function splitStmts(line) { var o = [], cur = '', q = false; for (var i = 0; i < line.length; i++) { var c = line.charAt(i); if (c === '"') q = !q; if (c === ':' && !q) { o.push(cur); cur = ''; } else cur += c; } o.push(cur); return o.map(function (x) { return x.trim(); }).filter(function (x) { return x; }); }
function sortedLines() { return Object.keys(V.prog).map(Number).sort(function (a, b) { return a - b; }); }

/* exécution d'une instruction ; renvoie une action pour le déroulé */
function exec(st, R) {
  var p = new Px(st), m;
  if (p.eat('REM')) return { next: 1 };
  if (p.eat('PRINT') || p.eat('?')) {
    var nlEnd = true;
    while (!p.end()) {
      if (p.eat(';')) { nlEnd = false; continue; }
      if (p.eat(',')) { nlEnd = false; out(new Array(10 - (V.cur.length % 10) + 1).join(' ')); continue; }
      var v = p.expr(); out(typeof v === 'number' ? fmtNum(v) : v); nlEnd = true;
    }
    if (nlEnd) nl(); return null;
  }
  if (p.eat('IF')) {
    var cond = p.expr(); if (!p.eat('THEN') && !p.eat('GOTO')) throw new BErr('SYNTAX');
    if (!num(cond)) return { next: 1 };
    var rest = p.s.slice(p.i).trim(); if (/^\d+$/.test(rest)) return { jump: +rest };
    return { inline: rest };
  }
  if (p.eat('GOTO')) { m = /^\s*(\d+)\s*$/.exec(p.s.slice(p.i)); if (!m) throw new BErr('SYNTAX'); return { jump: +m[1] }; }
  if (p.eat('GOSUB')) { m = /^\s*(\d+)\s*$/.exec(p.s.slice(p.i)); if (!m) throw new BErr('SYNTAX'); R.gos.push({ li: R.li, si: R.si + 1 }); return { jump: +m[1] }; }
  if (p.eat('RETURN')) { var g = R.gos.pop(); if (!g) throw new BErr('RETURN WITHOUT GOSUB'); return { pos: g }; }
  if (p.eat('FOR')) {
    var vn = p.varName(); if (!vn || /\$/.test(vn)) throw new BErr('SYNTAX'); p.need('='); var a0 = num(p.expr()); p.need('TO'); var to = num(p.expr()), stp = 1; if (p.eat('STEP')) stp = num(p.expr());
    V.vars[vn] = a0; R.fors = R.fors.filter(function (f) { return f.v !== vn; }); R.fors.push({ v: vn, to: to, step: stp, li: R.li, si: R.si + 1 }); return null;
  }
  if (p.eat('NEXT')) {
    var nv = p.varName(), f = null;
    while (R.fors.length) { f = R.fors[R.fors.length - 1]; if (!nv || f.v === nv) break; R.fors.pop(); f = null; }
    if (!f) throw new BErr('NEXT WITHOUT FOR');
    V.vars[f.v] += f.step;
    if ((f.step >= 0 && V.vars[f.v] <= f.to) || (f.step < 0 && V.vars[f.v] >= f.to)) return { pos: { li: f.li, si: f.si } };
    R.fors.pop(); return null;
  }
  if (p.eat('END')) return { end: 1 };
  if (p.eat('STOP')) return { stop: 1 };
  if (p.eat('INPUT')) {
    var prompt = ''; if (p.peek('"')) { prompt = p.prim(); if (!p.eat(';')) p.eat(','); }
    var iv = p.varName(); if (!iv) throw new BErr('SYNTAX'); out(prompt + '? '); return { input: iv };
  }
  if (p.eat('POKE')) {
    var ad = num(p.expr()); p.need(','); var val = num(p.expr()) & 255;
    if (ad === 53280) V.border = val & 15; else if (ad === 53281) V.bg = val & 15; else if (ad === 646) V.fg = val & 15; else V.mem[ad] = val;
    dirty = true; return null;
  }
  if (p.eat('SYS')) { var sa = num(p.expr()); if (sa === 2061 && V.loaded) return { sys: 1 }; return null; }
  if (p.eat('CLR')) { V.vars = {}; return null; }
  if (p.eat('LET')) { /* assignation explicite */ }
  var name = p.varName();
  if (name && p.eat('=')) { var val2 = p.expr(); if (/\$$/.test(name) ? typeof val2 !== 'string' : typeof val2 !== 'number') throw new BErr('TYPE MISMATCH'); V.vars[name] = val2; if (!p.end()) throw new BErr('SYNTAX'); return null; }
  throw new BErr('SYNTAX');
}

/* déroulé d'un programme : quelques centaines d'instructions par image */
function startRun(fromLine) {
  V.vars = {};
  var ls = sortedLines(), li = 0;
  if (fromLine != null) { li = ls.indexOf(fromLine); if (li < 0) { error('UNDEF\'D STATEMENT'); return; } }
  V.run = { ls: ls, li: li, si: 0, stmts: null, fors: [], gos: [], out: '', steps: 0, inputs: [] };
  loadLine();
}
function loadLine() { var R = V.run; R.stmts = R.li < R.ls.length ? splitStmts(V.prog[R.ls[R.li]]) : null; }
function runTick(budget) {
  var R = V.run; if (!R || R.wait) return;
  while (budget-- > 0) {
    if (!R.stmts) { finishRun({}); return; }
    if (R.si >= R.stmts.length) { R.li++; R.si = 0; loadLine(); continue; }
    var st = R.inline != null ? R.inline : R.stmts[R.si], act; R.inline = null; R.steps++;
    try { act = exec(st, R); } catch (e) { if (e instanceof BErr) { finishRun({ err: e.basic, line: R.ls[R.li] }); return; } throw e; }
    if (!act) { R.si++; continue; }
    if (act.next) { R.li++; R.si = 0; loadLine(); continue; }
    if (act.inline != null) { R.inline = act.inline; continue; }
    if (act.jump != null) { var k = R.ls.indexOf(act.jump); if (k < 0) { finishRun({ err: 'UNDEF\'D STATEMENT', line: R.ls[R.li] }); return; } R.li = k; R.si = 0; loadLine(); continue; }
    if (act.pos) { R.li = act.pos.li; R.si = act.pos.si; loadLine(); continue; }
    if (act.end) { finishRun({}); return; }
    if (act.stop) { finishRun({ broke: 1, line: R.ls[R.li] }); return; }
    if (act.input) { R.wait = act.input; R.si++; showInput(true); return; }
    if (act.sys) { R.si++; finishRun({ sys: 1 }); return; }
  }
}
function finishRun(o) {
  var R = V.run; V.run = null;
  if (o.err) { if (V.cur) nl(); out('?' + o.err + '  ERROR' + (o.line != null ? ' IN ' + o.line : '')); nl(); SFX.bad(); }
  else if (o.broke) { if (V.cur) nl(); out('BREAK' + (o.line != null ? ' IN ' + o.line : '')); nl(); }
  out('READY.'); nl(); showInput(true);
  emit({ t: o.sys ? 'sys' : 'run', out: R ? R.out : '', err: o.err || null, broke: !!o.broke, inputs: R ? R.inputs : [] });
  if (o.sys) setTimeout(function () { launchArcade(true); }, 400);
}
function breakRun() { if (V.run) { var R = V.run; R.wait = null; finishRun({ broke: 1, line: R.ls[R.li] }); SFX.ui(); } }
function error(name) { out('?' + name + '  ERROR'); nl(); out('READY.'); nl(); SFX.bad(); }

/* une ligne tapée par le joueur */
function enter(raw) {
  var line = normIn(raw).replace(/\s+$/, '');
  out(line); nl();
  if (V.run && V.run.wait) {                      // réponse à un INPUT
    var R = V.run, vn = R.wait, v = line.replace(/^\?\s*/, '');
    if (!/\$$/.test(vn)) { var n = parseFloat(v); if (isNaN(n)) { out('?REDO FROM START'); nl(); out('? '); return; } V.vars[vn] = n; } else V.vars[vn] = v;
    R.inputs.push(v); R.wait = null; showInput(false); return;
  }
  if (V.run) return;
  var m = /^(\d+)\s*(.*)$/.exec(line);
  if (m) { var n2 = +m[1]; if (m[2]) V.prog[n2] = m[2]; else delete V.prog[n2]; keep(); emit({ t: 'line', n: n2, text: m[2] }); return; }
  if (!line.trim()) return;
  direct(line.trim());
}
function direct(line) {
  var u = line, m;
  if (/^RUN\b/.test(u)) { m = /^RUN\s*(\d+)?\s*$/.exec(u); if (!m) { error('SYNTAX'); return; } showInput(false); startRun(m[1] ? +m[1] : null); return; }
  if (/^LIST\b/.test(u)) {
    m = /^LIST\s*(\d+)?\s*(-?)\s*(\d+)?\s*$/.exec(u); if (!m) { error('SYNTAX'); return; }
    var a = m[1] ? +m[1] : -Infinity, b = m[3] ? +m[3] : (m[2] ? Infinity : (m[1] ? +m[1] : Infinity));
    sortedLines().forEach(function (n) { if (n >= a && n <= b) { out(n + ' ' + V.prog[n]); nl(); } });
    out('READY.'); nl(); emit({ t: 'direct', cmd: 'LIST' }); return;
  }
  if (/^NEW\s*$/.test(u)) { V.prog = {}; V.vars = {}; V.loaded = false; keep(); out('READY.'); nl(); emit({ t: 'direct', cmd: 'NEW' }); return; }
  if (/^LOAD\b/.test(u)) {
    m = /^LOAD\s*"([^"]*)"?\s*(,\s*(\d+)\s*(,\s*\d+)?)?\s*$/.exec(u); if (!m) { error('SYNTAX'); return; }
    if (m[3] !== '8') { out('PRESS PLAY ON TAPE'); nl(); out('?DEVICE NOT PRESENT  ERROR'); nl(); out('READY.'); nl(); return; }
    out('SEARCHING FOR ' + m[1]); nl();
    if (GAME.indexOf(m[1]) < 0 && m[1] !== '*') { out('?FILE NOT FOUND  ERROR'); nl(); out('READY.'); nl(); SFX.bad(); return; }
    showInput(false);
    setTimeout(function () { out('LOADING'); nl(); }, 500);
    setTimeout(function () { V.prog = { 10: 'SYS 2061' }; V.loaded = true; keep(); out('READY.'); nl(); showInput(true); emit({ t: 'load' }); }, 1500);
    return;
  }
  if (/^SAVE\b/.test(u)) { out('SAVING'); nl(); out('READY.'); nl(); return; }
  if (/^GOTO\s*(\d+)\s*$/.test(u)) { showInput(false); startRun(+/(\d+)/.exec(u)[1]); return; }
  var guard = 0, R = { li: -1, si: 0, fors: [], gos: [] }, sts = splitStmts(u), err = null, outBefore = V.rows.length + ':' + V.cur, txt = '';
  V.run = null; var capture = { out: '' };
  var saveOut = out; out = function (s) { capture.out += s; saveOut(s); };
  try {
    for (var i = 0; i < sts.length; i++) {
      var act = exec(sts[i], R);
      if (act && act.inline != null) { sts.splice(i + 1, 0, act.inline); continue; }
      if (act && act.pos) { if (++guard > 5000) break; i = act.pos.si - 1; continue; }
      if (act && (act.next || act.end || act.stop)) break;
      if (act && act.jump != null) { out = saveOut; showInput(false); startRun(act.jump); return; }
      if (act && act.input) { err = 'ILLEGAL DIRECT'; break; }
      if (act && act.sys) { out = saveOut; out('READY.'); nl(); emit({ t: 'sys' }); setTimeout(function () { launchArcade(true); }, 300); return; }
    }
  } catch (e) { if (e instanceof BErr) err = e.basic; else throw e; }
  out = saveOut;
  if (err) error(err); else { out('READY.'); nl(); }
  emit({ t: 'direct', cmd: u.split(/[\s"(]/)[0], src: u, out: capture.out, err: err });
}

/* --------------------------------------------------------- écran et panneau */
var $ = {}, dirty = true, active = false;
function build() {
  if ($.root) return;
  var r = el('div', 'c64', null, document.body); $.root = r;
  var top = el('header', 'top', null, r);
  $.back = el('button', 'ic', '←', top); $.back.type = 'button'; $.back.setAttribute('aria-label', T(L.map)); $.back.addEventListener('click', function () { A.gesture(); exit(); A.showMap(); });
  var tt = el('div', 'tt', null, top); el('div', 'mnum', 'BONUS · 1987', tt); el('div', 'mtitle', T(L.title).replace(/^Bonus — /, ''), tt);
  $.stop = el('button', 'stopbtn', 'RUN/STOP', top); $.stop.type = 'button'; $.stop.addEventListener('click', function () { A.gesture(); breakRun(); });
  var hb = el('button', 'ic', '💡', top); hb.type = 'button'; hb.setAttribute('aria-label', T(L.hint)); hb.addEventListener('click', function () { A.gesture(); hint(); });
  var cb = el('button', 'ic', '📖', top); cb.type = 'button'; cb.setAttribute('aria-label', 'Codex'); cb.addEventListener('click', function () { A.gesture(); A.openCodex(); });
  var main = el('div', 'main', null, r);
  var wrap = el('section', 'c64wrap', null, main); $.wrap = wrap;
  $.border = el('div', 'c64b', null, wrap); $.scr = el('div', 'c64s', null, $.border); $.rows = el('div', 'c64r', null, $.scr);
  var il = el('div', 'c64i', null, $.scr); $.inp = el('input', null, null, il); $.inp.type = 'text'; $.inp.autocomplete = 'off'; $.inp.spellcheck = false; $.inp.setAttribute('autocapitalize', 'characters'); $.inp.setAttribute('aria-label', T(L.typeHere));
  $.inp.placeholder = TOUCH ? T(L.typeTouch) : ''; if (TOUCH) $.inp.setAttribute('inputmode', 'none');
  $.inp.addEventListener('keydown', function (e) {
    if (e.key === 'Enter') { e.preventDefault(); A.gesture(); var v = $.inp.value; $.inp.value = ''; if (step().q) { var k = 'ABC123'.indexOf(normIn(v).trim()); if (k >= 0) { answer(k % 3); return; } } hist.unshift(v); hi = -1; enter(v); }
    else if (e.key === 'Escape') { e.preventDefault(); breakRun(); }
    else if (e.key === 'ArrowUp') { e.preventDefault(); if (hi < hist.length - 1) hi++; $.inp.value = hist[hi] || ''; }
    else if (e.key === 'ArrowDown') { e.preventDefault(); if (hi > 0) hi--; else hi = -1; $.inp.value = hist[hi] || ''; }
  });
  $.inp.addEventListener('input', function () { SFX.key && SFX.key(); });
  $.scr.addEventListener('click', function () { if (!TOUCH) $.inp.focus(); });
  var side = el('aside', 'side c64side', null, main);
  var nh = el('div', 'nhead', null, side); var ic = el('div', 'stripes', null, nh); [2, 8, 7, 5, 14].forEach(function (k) { el('i', null, null, ic).style.background = PAL[k]; });
  var nw = el('div', 'nwho', null, nh); el('div', 'who', L.who, nw); el('div', 'whosub', T(L.sub), nw);
  $.msgs = el('div', 'msgs', null, side); $.choices = el('div', 'choices', null, side);
  var ob = el('div', 'objbox', null, side); el('div', 'objl', T(L.obj), ob); $.obj = el('div', 'obj', '', ob);
  var chips = el('div', 'chips', null, r); $.row1 = el('div', 'row', null, chips); $.row2 = el('div', 'row', null, chips);
  window.addEventListener('resize', layout);
  document.addEventListener('keydown', function (e) { if (active && e.key === 'Escape' && document.activeElement !== $.inp) breakRun(); });
}
var hist = [], hi = -1;
function layout() {
  if (!$.wrap || !active) return;
  var w = $.wrap.clientWidth - 8, h = $.wrap.clientHeight - 8, cell = Math.max(6, Math.floor(Math.min(w / 46, h / 30)));
  $.border.style.fontSize = cell + 'px'; dirty = true;
}
function render() {
  if (!dirty || !$.rows) return; dirty = false;
  $.border.style.background = PAL[V.border]; $.scr.style.background = PAL[V.bg]; $.scr.style.color = PAL[V.fg]; $.inp.style.color = PAL[V.fg]; $.inp.style.caretColor = PAL[V.fg];
  var rows = V.rows.concat(V.cur ? [V.cur] : []), show = rows.slice(-23);
  $.rows.textContent = show.join('\n');
}
function showInput(v) { if (!$.inp) return; $.inp.parentNode.style.visibility = v ? 'visible' : 'hidden'; if (v && !TOUCH && active) setTimeout(function () { $.inp.focus(); }, 20); }
function keep() { var b = B(); b.prog = V.prog; b.colors = [V.border, V.bg, V.fg]; b.loaded = V.loaded; A.persist(); }

/* boutons tactiles */
function chip(row, label, fn, cls) { var b = el('button', 'chip' + (cls ? ' ' + cls : ''), label, row); b.type = 'button'; b.addEventListener('click', function () { A.gesture(); fn(); }); return b; }
function ins(t) { var v = $.inp.value; if (v && !/[\s"(]$/.test(v) && !/^[":;,=+\-*/<>()$]$/.test(t)) v += ' '; $.inp.value = v + t; if (!TOUCH) $.inp.focus(); }
function chips() {
  var r1 = $.row1, r2 = $.row2; r1.innerHTML = ''; r2.innerHTML = '';
  if (TOUCH) chip(r1, '⌨', function () { var on = $.inp.getAttribute('inputmode') !== 'none'; $.inp.setAttribute('inputmode', on ? 'none' : 'text'); $.inp.blur(); setTimeout(function () { $.inp.focus(); }, 30); }, 'act');
  chip(r1, '⌫', function () { $.inp.value = $.inp.value.slice(0, -1); }, 'act');
  chip(r1, '⏎', function () { var e = new KeyboardEvent('keydown', { key: 'Enter' }); $.inp.dispatchEvent(e); }, 'act run');
  var st = step(), sug = st && !st.q ? sugOf(st) : '';
  if (sug) chip(r1, sug, function () { $.inp.value = sug; if (!TOUCH) $.inp.focus(); }, 'sug');
  ['PRINT', 'RUN', 'LIST', 'NEW', 'GOTO', 'FOR', 'TO', 'NEXT', 'IF', 'THEN', 'INPUT', 'POKE', 'LOAD'].forEach(function (k) { chip(r1, k, function () { ins(k); }); });
  ['"', '=', '+', '-', '*', '/', ';', ':', ',', '$', '<>', '10', '20', '30', 'A', 'I', 'M$', '8'].forEach(function (k) { chip(r2, k, function () { ins(k); }, 'o'); });
}

/* --------------------------------------------------------- leçons de Malek */
function has(n, re) { return V.prog[n] != null && re.test(V.prog[n]); }
function nextLine(lines) { for (var i = 0; i < lines.length; i++) { var m = /^(\d+) (.*)$/.exec(lines[i]); if (V.prog[m[1]] !== m[2]) return lines[i]; } return 'RUN'; }
var P10 = ['10 PRINT "MALEK VEILLE"', '10 PRINT "MALEK WATCHING"', '10 PRINT "MALEK VEGLIA"'];
var FOR3 = ['10 FOR I=1 TO 5', ['20 PRINT "TOUR";I', '20 PRINT "LAP";I', '20 PRINT "GIRO";I'], '30 NEXT I'];
var PW = ['10 INPUT "MOT";M$', ['10 INPUT "MOT";M$', '10 INPUT "WORD";M$', '10 INPUT "PAROLA";M$'], ['20 IF M$="CIGALE" THEN PRINT "BIENVENUE"', '20 IF M$="CIGALE" THEN PRINT "WELCOME"', '20 IF M$="CIGALE" THEN PRINT "BENVENUTO"'], ['30 IF M$<>"CIGALE" THEN PRINT "ACCES REFUSE"', '30 IF M$<>"CIGALE" THEN PRINT "ACCESS DENIED"', '30 IF M$<>"CIGALE" THEN PRINT "ACCESSO NEGATO"']];
var STEPS = [
  { o: ['Écrire à la machine', 'Write to the machine', 'Scrivere alla macchina'], k: ['b_c64', 'b_print'], c: 'PRINT "BONJOUR MALEK"',
    s: ['Té, entre, assieds-toi ! Cette machine date de 1987. Aucune IA ne parle sa langue, le **BASIC** : ici, Kassandra ne nous entend pas.\nPour lui faire afficher un texte, on écrit `PRINT` puis le texte **entre guillemets**. Essaie : `PRINT "BONJOUR MALEK"` puis {enter}.',
      'Come in, sit down! This machine is from 1987. No AI speaks its language, **BASIC**: in here, Kassandra cannot hear us.\nTo make it show a text, you write `PRINT` and then the text **between quotes**. Try: `PRINT "BONJOUR MALEK"` then {enter}.',
      'Té, entra, siediti! Questa macchina è del 1987. Nessuna IA parla la sua lingua, il **BASIC**: qui Kassandra non ci sente.\nPer farle mostrare un testo si scrive `PRINT` e poi il testo **tra virgolette**. Prova: `PRINT "BONJOUR MALEK"` poi {enter}.'],
    d: function (e) { return e.t === 'direct' && /^(PRINT|\?)/.test(e.src || '') && !e.err && /[A-Z]/.test(e.out || ''); },
    ok: ['Elle t\'a répondu ! `READY.` veut dire qu\'elle attend la suite. Sur ces machines, tout s\'écrit en MAJUSCULES, et les accents n\'existent pas.', 'It answered you! `READY.` means it is waiting for more. On these machines everything is in CAPITALS, and there are no accents.', 'Ti ha risposto! `READY.` vuol dire che aspetta il seguito. Su queste macchine si scrive tutto in MAIUSCOLO, e gli accenti non esistono.'] },
  { o: ['Faire un calcul', 'Do a calculation', 'Fare un calcolo'], k: ['b_calc'], c: 'PRINT 2+3*4',
    s: ['Le BASIC sait aussi calculer. Sans guillemets, `PRINT` calcule au lieu de recopier. Devine le résultat avant d\'appuyer : `PRINT 2+3*4` (le signe `*` veut dire « fois »).', 'BASIC can calculate too. Without quotes, `PRINT` calculates instead of copying. Guess the result before pressing: `PRINT 2+3*4` (the `*` sign means "times").', 'Il BASIC sa anche calcolare. Senza virgolette, `PRINT` calcola invece di ricopiare. Indovina il risultato prima di premere: `PRINT 2+3*4` (il segno `*` vuol dire «per»).'],
    d: function (e) { return e.t === 'direct' && /\b14\b/.test(e.out || ''); },
    ok: ['14, pas 20 : la multiplication passe avant l\'addition, comme à l\'école. Pour l\'inverse, il faut des parenthèses : `PRINT (2+3)*4`.', '14, not 20: multiplication comes before addition, just like at school. For the other way round you need brackets: `PRINT (2+3)*4`.', '14, non 20: la moltiplicazione viene prima dell\'addizione, come a scuola. Per il contrario servono le parentesi: `PRINT (2+3)*4`.'] },
  { o: ['Ranger 1987 dans la variable A', 'Store 1987 in variable A', 'Mettere 1987 nella variabile A'], k: ['b_var'], c: function () { return V.vars.A === 1987 ? 'PRINT 2034-A' : 'A=1987'; },
    s: ['Une **variable**, c\'est une boîte avec un nom, où l\'on range un nombre. Range l\'année de cette machine dans la boîte A : `A=1987`. Puis calcule son âge en 2034 : `PRINT 2034-A`.', 'A **variable** is a box with a name where you keep a number. Put this machine\'s year in box A: `A=1987`. Then work out its age in 2034: `PRINT 2034-A`.', 'Una **variabile** è una scatola con un nome in cui si mette un numero. Metti l\'anno di questa macchina nella scatola A: `A=1987`. Poi calcola la sua età nel 2034: `PRINT 2034-A`.'],
    d: function (e) { return e.t === 'direct' && V.vars.A === 1987 && /\b47\b/.test(e.out || ''); },
    ok: ['47 ans, peuchère ! Plus vieille que moi, et elle tient encore le coup.', '47 years old! Older than me, and still going strong.', '47 anni, peuchère! Più vecchia di me, e regge ancora.'] },
  { o: ['Écrire un programme de deux lignes', 'Write a two-line program', 'Scrivere un programma di due righe'], k: ['b_lineno', 'b_goto'], c: function () { return nextLine([T(P10), '20 GOTO 10']); },
    s: ['Jusqu\'ici, la machine obéit tout de suite. Si on met un **numéro** devant, elle range la ligne pour plus tard : c\'est un **programme**. Écris ces deux lignes :\n`' + 'P10' + '`\n`20 GOTO 10`\n`GOTO 10` veut dire « retourne à la ligne 10 ».', 'So far the machine obeys at once. If you put a **number** in front, it stores the line for later: that is a **program**. Type these two lines:\n`P10`\n`20 GOTO 10`\n`GOTO 10` means "go back to line 10".', 'Finora la macchina obbedisce subito. Se metti un **numero** davanti, conserva la riga per dopo: è un **programma**. Scrivi queste due righe:\n`P10`\n`20 GOTO 10`\n`GOTO 10` vuol dire «torna alla riga 10».'],
    d: function () { return has(10, /^PRINT/) && has(20, /^GOTO\s*10$/); },
    ok: ['Rien ne s\'est passé ? C\'est normal : les lignes sont rangées, pas exécutées.', 'Nothing happened? That is normal: the lines are stored, not run.', 'Non è successo niente? È normale: le righe sono conservate, non eseguite.'] },
  { o: ['Lancer le programme, puis l\'arrêter', 'Run the program, then stop it', 'Avviare il programma, poi fermarlo'], k: ['b_run', 'b_loop'], c: 'RUN',
    s: ['Lance le programme avec `RUN`. Il va tourner en rond **pour toujours** : c\'est une **boucle infinie**. Pour l\'arrêter, touche le bouton **RUN/STOP** en haut (ou la touche Échap du clavier).', 'Start the program with `RUN`. It will go round and round **forever**: that is an **infinite loop**. To stop it, press the **RUN/STOP** button at the top (or the Esc key).', 'Avvia il programma con `RUN`. Girerà in tondo **per sempre**: è un **ciclo infinito**. Per fermarlo tocca il pulsante **RUN/STOP** in alto (o il tasto Esc).'],
    d: function (e) { return e.t === 'run' && e.broke; },
    ok: ['`BREAK IN 10` : tu as coupé la machine en pleine course. En 1987, les programmeurs faisaient ça cent fois par nuit.', '`BREAK IN 10`: you stopped the machine mid-run. In 1987, programmers did that a hundred times a night.', '`BREAK IN 10`: hai fermato la macchina in piena corsa. Nel 1987 i programmatori lo facevano cento volte a notte.'] },
  { o: ['Afficher le programme', 'Show the program', 'Mostrare il programma'], k: ['b_list'], c: 'LIST',
    s: ['Le programme est toujours en mémoire. `LIST` l\'affiche.', 'The program is still in memory. `LIST` shows it.', 'Il programma è ancora in memoria. `LIST` lo mostra.'],
    d: function (e) { return e.t === 'direct' && e.cmd === 'LIST'; } },
  { o: ['Effacer le programme', 'Erase the program', 'Cancellare il programma'], k: ['b_new'], c: 'NEW',
    s: ['Pour tout effacer et repartir de zéro : `NEW`. Attention, ici il n\'y a pas de corbeille !', 'To erase everything and start again: `NEW`. Careful, there is no recycle bin here!', 'Per cancellare tutto e ripartire da zero: `NEW`. Attenzione, qui non c\'è il cestino!'],
    d: function (e) { return e.t === 'direct' && e.cmd === 'NEW'; } },
  { o: ['Compter de 1 à 5 avec FOR', 'Count from 1 to 5 with FOR', 'Contare da 1 a 5 con FOR'], k: ['b_for'], c: function () { return nextLine([FOR3[0], T(FOR3[1]), FOR3[2]]); },
    s: ['Une boucle qui s\'arrête toute seule : `FOR`. Elle compte avec la variable I, de 1 à 5, et répète ce qu\'il y a entre `FOR` et `NEXT` :\n`10 FOR I=1 TO 5`\n`' + 'F20' + '`\n`30 NEXT I`\nPuis `RUN`. Le `;` colle le nombre juste après le texte.', 'A loop that stops by itself: `FOR`. It counts with variable I, from 1 to 5, and repeats what is between `FOR` and `NEXT`:\n`10 FOR I=1 TO 5`\n`F20`\n`30 NEXT I`\nThen `RUN`. The `;` sticks the number right after the text.', 'Un ciclo che si ferma da solo: `FOR`. Conta con la variabile I, da 1 a 5, e ripete ciò che sta tra `FOR` e `NEXT`:\n`10 FOR I=1 TO 5`\n`F20`\n`30 NEXT I`\nPoi `RUN`. Il `;` attacca il numero subito dopo il testo.'],
    d: function (e) { return e.t === 'run' && !e.broke && !e.err && /\b5\b/.test(e.out) && (e.out.match(/\n/g) || []).length >= 5 && has(10, /^FOR/); },
    ok: ['Cinq tours, et elle s\'est arrêtée toute seule, sans RUN/STOP.', 'Five laps, and it stopped by itself, no RUN/STOP needed.', 'Cinque giri, e si è fermata da sola, senza RUN/STOP.'] },
  { q: { q: ['Avec `FOR I=1 TO 10`, combien de fois ce qui est entre FOR et NEXT est-il répété ?', 'With `FOR I=1 TO 10`, how many times is what lies between FOR and NEXT repeated?', 'Con `FOR I=1 TO 10`, quante volte viene ripetuto ciò che sta tra FOR e NEXT?'], a: ['1', '10', '11'], r: 1,
    w: ['Dix fois : I vaut 1, puis 2… jusqu\'à 10.', 'Ten times: I is 1, then 2… up to 10.', 'Dieci volte: I vale 1, poi 2… fino a 10.'] } },
  { o: ['Programmer le mot de passe du local', 'Program the room\'s password', 'Programmare la password del locale'], k: ['b_input', 'b_if', 'b_str'],
    c: function () { if (V.run && V.run.wait) return 'CIGALE'; return nextLine([T(PW[1]), T(PW[2]), T(PW[3])]); },
    s: ['Mon local a un mot de passe. `INPUT` pose une question et attend ta réponse ; le `$` à la fin de `M$` dit que la boîte contient du **texte**. `IF … THEN` veut dire « si … alors » ; `<>` veut dire « différent de ».\n`PW1`\n`PW2`\n`PW3`\nPuis `RUN`, et réponds `CIGALE` : chez moi, en Provence, c\'est elle qui chante toute la nuit.',
      'My room has a password. `INPUT` asks a question and waits for your answer; the `$` at the end of `M$` says the box holds **text**. `IF … THEN` means "if … then"; `<>` means "different from".\n`PW1`\n`PW2`\n`PW3`\nThen `RUN`, and answer `CIGALE` (cicada): back home in Provence, it sings all night.',
      'Il mio locale ha una password. `INPUT` fa una domanda e aspetta la risposta; il `$` alla fine di `M$` dice che la scatola contiene **testo**. `IF … THEN` vuol dire «se … allora»; `<>` vuol dire «diverso da».\n`PW1`\n`PW2`\n`PW3`\nPoi `RUN`, e rispondi `CIGALE` (cicala): a casa mia, in Provenza, canta tutta la notte.'],
    d: function (e) { return e.t === 'run' && !e.err && e.inputs.length && /CIGALE/.test(e.inputs[0]) && /BIENVENUE|WELCOME|BENVENUTO/.test(e.out); },
    ok: ['Bienvenue ! Relance avec un mauvais mot pour voir la ligne 30 te répondre.', 'Welcome! Run it again with a wrong word to see line 30 answer you.', 'Benvenuto! Riavvialo con una parola sbagliata per vedere la riga 30 risponderti.'] },
  { o: ['Changer les couleurs de l\'écran', 'Change the screen colours', 'Cambiare i colori dello schermo'], k: ['b_memory', 'b_poke'], c: function () { return V.border === 14 ? 'POKE 53280,2' : 'POKE 53281,0'; },
    s: ['La mémoire de la machine, c\'est une rue de 65 536 cases numérotées. Chaque case contient un nombre de 0 à 255. Certaines cases commandent l\'écran : la **53280** donne la couleur du **bord**, la **53281** celle du **fond**. `POKE` écrit un nombre dans une case.\n`POKE 53280,2` (rouge) puis `POKE 53281,0` (noir).', 'The machine\'s memory is a street of 65,536 numbered cells. Each cell holds a number from 0 to 255. Some cells control the screen: **53280** sets the **border** colour, **53281** the **background**. `POKE` writes a number into a cell.\n`POKE 53280,2` (red) then `POKE 53281,0` (black).', 'La memoria della macchina è una via di 65.536 caselle numerate. Ogni casella contiene un numero da 0 a 255. Alcune caselle comandano lo schermo: la **53280** dà il colore del **bordo**, la **53281** quello dello **sfondo**. `POKE` scrive un numero in una casella.\n`POKE 53280,2` (rosso) poi `POKE 53281,0` (nero).'],
    d: function () { return V.border !== 14 && V.bg !== 6; },
    ok: ['Les couleurs vont de 0 à 15 : 0 noir, 1 blanc, 2 rouge, 5 vert, 6 bleu, 7 jaune, 14 bleu clair… Pour revenir aux couleurs d\'origine en une ligne : `POKE 53280,14 : POKE 53281,6` (les deux-points séparent deux instructions).', 'Colours go from 0 to 15: 0 black, 1 white, 2 red, 5 green, 6 blue, 7 yellow, 14 light blue… To get the original colours back in one line: `POKE 53280,14 : POKE 53281,6` (the colon separates two instructions).', 'I colori vanno da 0 a 15: 0 nero, 1 bianco, 2 rosso, 5 verde, 6 blu, 7 giallo, 14 azzurro… Per tornare ai colori originali in una riga: `POKE 53280,14 : POKE 53281,6` (i due punti separano due istruzioni).'] },
  { q: { q: ['Que fait `GOTO 10` ?', 'What does `GOTO 10` do?', 'Cosa fa `GOTO 10`?'], a: [['Il saute à la ligne 10', 'It jumps to line 10', 'Salta alla riga 10'], ['Il efface la ligne 10', 'It deletes line 10', 'Cancella la riga 10'], ['Il attend 10 secondes', 'It waits 10 seconds', 'Aspetta 10 secondi']], r: 0,
    w: ['GOTO veut dire « aller à ». Avec IF, on choisit où aller : c\'est comme ça qu\'on fabrique un jeu.', 'GOTO means "go to". With IF, you choose where to go: that is how you build a game.', 'GOTO vuol dire «vai a». Con IF si sceglie dove andare: è così che si costruisce un gioco.'] } },
  { o: ['Charger le jeu de Malek', 'Load Malek\'s game', 'Caricare il gioco di Malek'], k: ['b_load'], c: 'LOAD "' + gameName + '",8',
    s: ['Dernière chose, et la plus belle. Il y a des années, j\'ai écrit un jeu sur cette machine, pour tenir les nuits de garde. Il est sur la disquette, dans le lecteur n°8. Charge-le : `LOAD "' + gameName + '",8`', 'One last thing, and the best. Years ago I wrote a game on this machine, to get through the night shifts. It is on the floppy, in drive no. 8. Load it: `LOAD "' + gameName + '",8`', 'Un\'ultima cosa, la più bella. Anni fa ho scritto un gioco su questa macchina, per tirare avanti nei turni di notte. È sul dischetto, nel lettore n. 8. Caricalo: `LOAD "' + gameName + '",8`'],
    d: function (e) { return e.t === 'load'; } },
  { o: ['Lancer le jeu', 'Start the game', 'Avviare il gioco'], c: 'RUN',
    s: ['Il est en mémoire. Tu sais ce qu\'il reste à faire.', 'It is in memory. You know what is left to do.', 'È in memoria. Sai cosa resta da fare.'],
    d: function (e) { return e.t === 'sys'; } }
];
function sugOf(st) { return typeof st.c === 'function' ? st.c() : st.c || ''; }
function say(text, cls) {
  var d = el('div', 'msg ' + (cls || ''), null, $.msgs);
  var t = text.replace('`P10`', '`' + T(P10) + '`').replace('`F20`', '`' + T(FOR3[1]) + '`').replace('`PW1`', '`' + T(PW[1]) + '`').replace('`PW2`', '`' + T(PW[2]) + '`').replace('`PW3`', '`' + T(PW[3]) + '`');
  d.innerHTML = A.rich(A.fmt(t, { enter: TOUCH ? '⏎' : T(L.enterKey) }));
  [].slice.call($.msgs.querySelectorAll('.msg')).forEach(function (x, i, a) { x.classList.toggle('old', i < a.length - 1); });
  $.msgs.scrollTop = $.msgs.scrollHeight;
}
var cur = 0;
function step() { return STEPS[cur] || {}; }
function showStep() {
  var st = step(); $.choices.innerHTML = '';
  (st.k || []).forEach(A.learn);
  $.obj.textContent = st.q ? T(L.quiz) : T(st.o);
  if (st.s) say(T(st.s));
  if (st.q) quiz(st.q);
  B().step = cur; A.persist(); chips();
}
function quiz(q) {
  var box = el('div', 'quiz', null, $.choices); el('div', 'qh', T(L.quiz), box); el('div', 'qq', null, box).innerHTML = A.rich(T(q.q));
  q.a.forEach(function (a, i) { var b = el('button', 'qa', null, box); b.type = 'button'; b.innerHTML = '<span>' + 'ABC'.charAt(i) + '</span> ' + A.rich(T(a)); b.addEventListener('click', function () { A.gesture(); answer(i); }); });
}
function answer(i) {
  var st = step(); if (!st.q) return; var bs = $.choices.querySelectorAll('.qa'); if (!bs[i] || bs[i].disabled) return;
  if (i === st.q.r) { bs[i].classList.add('right'); [].forEach.call(bs, function (b) { b.disabled = true; }); SFX.good(); say(T(L.right) + ' ' + T(st.q.w), 'ok'); cur++; B().step = cur; A.persist(); setTimeout(showStep, 900); }
  else { bs[i].classList.add('bad'); bs[i].disabled = true; SFX.bad(); say(T(L.wrong), 'hint'); }
}
function hint() { var st = step(); if (st.q) say(T(L.wrong).split('.')[0] + '…', 'hint'); else say('`' + sugOf(st) + '`', 'hint'); }
function next() { cur++; if (cur >= STEPS.length) cur = STEPS.length - 1; showStep(); }
function emit(e) {
  if (!active) return;
  var st = step(); chips();
  if (st.q || !st.d) return;
  var ok = false; try { ok = !!st.d(e); } catch (x) { ok = false; }
  if (!ok) return;
  SFX.ok(); if (st.ok) say(T(st.ok), 'ok');
  if (cur === STEPS.length - 1) { complete(); return; }
  cur++; B().step = cur; A.persist(); setTimeout(showStep, 500);
}
function complete() { var b = B(); b.done = 1; b.step = STEPS.length - 1; A.persist(); }

/* --------------------------------------------------------- entrée / sortie */
function start() {
  build(); A.closeOverlay(); A.leaveGame(); active = true;
  document.body.classList.add('c64on'); $.root.classList.add('on');
  var b = B(); V.prog = b.prog || {}; V.loaded = !!b.loaded; var cl = b.colors || [14, 6, 14]; V.border = cl[0]; V.bg = cl[1]; V.fg = cl[2]; V.vars = {}; V.run = null;
  V.rows = []; V.cur = ''; $.msgs.innerHTML = '';
  out('\n    **** SABIANI 64 BASIC V2 ****\n\n 64K RAM SYSTEM  38911 BASIC BYTES FREE\n\nREADY.\n');
  cur = b.done ? STEPS.length - 1 : Math.min(STEPS.length - 1, b.step | 0);
  A.setTrack(A.randomTrack()); showInput(true); showStep(); layout(); requestAnimationFrame(function () { layout(); render(); }); render();
  if (TOUCH && window.innerHeight > window.innerWidth) A.toast(T(L.rotate));
}
function exit() { active = false; if (V.run) V.run = null; if ($.root) $.root.classList.remove('on'); document.body.classList.remove('c64on'); }
function launchArcade(fromBasic) {
  var b = B(); if (fromBasic) complete();
  if (!window.SIGNAL_ARCADE) return;
  exit();
  window.SIGNAL_ARCADE.start({ onExit: function (score) { if (score > (b.hi || 0)) { b.hi = score; A.persist(); } if (fromBasic) outro(); else A.showMap(); } });
}
function outro() {
  A.overlay(function (c) {
    el('div', 'kick', 'BONUS · MALEK SABIANI', c); el('h2', 'ttl', T(L.doneT), c);
    el('div', 'nar', null, c).innerHTML = A.rich(T(['Tu as écrit tes premiers programmes en BASIC, sur une machine de 1987, comme des millions d\'enfants avant toi.\n\nMalek éteint l\'écran. *« Les machines ne mentent pas, tu sais. Elles font exactement ce qu\'on leur dit. C\'est pour ça qu\'il faut apprendre à leur parler soi-même. »*',
      'You wrote your first BASIC programs on a 1987 machine, like millions of children before you.\n\nMalek switches off the screen. *"Machines don\'t lie, you know. They do exactly what you tell them. That is why you have to learn to speak to them yourself."*',
      'Hai scritto i tuoi primi programmi in BASIC, su una macchina del 1987, come milioni di ragazzi prima di te.\n\nMalek spegne lo schermo. *«Le macchine non mentono, sai. Fanno esattamente quello che gli dici. Per questo bisogna imparare a parlarci da soli.»*']));
    el('h3', 'lh', T(L.learned), c); var ul = el('ul', 'learned', null, c);
    Object.keys(CX).forEach(function (k) { var e = CX[k], li = el('li', null, null, ul); li.innerHTML = '<code>' + esc(T(e.t)) + '</code> — ' + A.rich(T(e.m)); });
    A.btn(T(L.play), function () { launchArcade(false); }, c, 'main'); A.btn(T(L.toMap), A.showMap, c);
  });
}
(function loop() {
  if (active) { if (V.run && !V.run.wait) runTick(250); render(); }
  requestAnimationFrame(loop);
})();

window.SIGNAL_BONUS = { mapBlock: mapBlock, start: start, gate: openGate, arcade: function () { launchArcade(false); },
  __: { V: V, enter: function (s) { enter(s); }, brk: breakRun, get step() { return cur; }, answer: answer, steps: STEPS.length } };
})();
