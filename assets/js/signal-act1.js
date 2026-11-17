/* SIGNAL — Acte I : Canal Sigma (Zurich). Missions 1 à 5. Pour débuter : chaque commande est expliquée
   et proposée en bouton ; Kassandra ne peut pas faire échouer la mission. Textes : [fr, en, it]. */
(function () {
var D = window.SIGNAL_DATA, M = D.missions;
function rel(x, p) {       // chemin vers ~/p depuis le dossier courant, écrit le plus simplement possible
  var h = x.home; if (x.cwd === h) return p;
  if (x.cwd.indexOf(h + '/') === 0) { var up = x.cwd.slice(h.length + 1).split('/').length; return new Array(up + 1).join('../') + p; }
  return '~/' + p;
}
function inDir(x, d) { return x.cwd === x.home + '/' + d; }
function err(x, a) { return { e: x.T(a) }; }

/* ===================================================== MISSION 1 */
M.push({
  act: 1, voice: 'unknown', host: 'sigma.ctcorp.ch', cmds: ['pwd', 'ls', 'cd', 'cat'],
  title: ['Première connexion', 'First connection', 'Primo collegamento'],
  brief: ['SENA VALKOVA // COORDINATRICE ÉCHO ROUGE // LYON\nAgent {name}, tu es connecté à un serveur de la Tour Sigma, à Zurich, avec un compte de maintenance volé.\nIci, pas de souris ni de fenêtres : seulement un terminal.\nUne voix inconnue s\'est glissée sur notre canal. Elle dit qu\'elle va t\'aider. Écoute-la… mais reste prudent.',
    'SENA VALKOVA // ÉCHO ROUGE COORDINATOR // LYON\nAgent {name}, you are connected to a Sigma Tower server in Zurich, with a stolen maintenance account.\nNo mouse, no windows here: only a terminal.\nAn unknown voice has slipped onto our channel. It says it will help you. Listen to it… but stay careful.',
    'SENA VALKOVA // COORDINATRICE ÉCHO ROUGE // LIONE\nAgente {name}, sei collegato a un server della Torre Sigma, a Zurigo, con un account di manutenzione rubato.\nQui niente mouse né finestre: solo un terminale.\nUna voce sconosciuta si è infilata nel nostro canale. Dice che ti aiuterà. Ascoltala… ma resta prudente.'],
  fs: {
    'message.txt': ['Agent,\nle planning de maintenance est rangé dans le dossier maintenance/.\nIl dit à quelle heure la clé CT-NET 2.0 sera déplacée.\nTrouve cette heure.\n— Sena',
      'Agent,\nthe maintenance schedule is stored in the maintenance/ folder.\nIt says what time the CT-NET 2.0 key will be moved.\nFind that time.\n— Sena',
      'Agente,\nil planning di manutenzione è nella cartella maintenance/.\nDice a che ora verrà spostata la chiave CT-NET 2.0.\nTrova quell\'ora.\n— Sena'],
    'maintenance/planning.txt': ['PLANNING DE MAINTENANCE — TOUR SIGMA\n02:00  sauvegarde des serveurs\n04:00  déplacement de la clé CT-NET 2.0 vers vault/\n06:00  redémarrage du Canal Sigma',
      'MAINTENANCE SCHEDULE — SIGMA TOWER\n02:00  server backup\n04:00  CT-NET 2.0 key moved to vault/\n06:00  Sigma Channel restart',
      'PLANNING DI MANUTENZIONE — TORRE SIGMA\n02:00  backup dei server\n04:00  spostamento della chiave CT-NET 2.0 in vault/\n06:00  riavvio del Canale Sigma'],
    'maintenance/readme.txt': ['Personnel autorisé uniquement.', 'Authorised staff only.', 'Solo personale autorizzato.'],
    'logs/access.log': '28.01.2035 01:22 LOGIN sigma_maint from 172.16.0.1\n28.01.2035 02:41 ACCESS vault/ by admin_01\n28.01.2035 03:55 LOGIN sigma_maint from 10.66.6.6',
    'vault/': {}
  },
  steps: [
    { o: ['Savoir où tu es', 'Find out where you are', 'Scoprire dove sei'], k: ['terminal', 'pwd'], c: 'pwd',
      s: ['Bonjour, agent. Ne cherche pas qui je suis : pas encore. Je vais t\'apprendre à parler à cette machine.\nUn terminal, c\'est une conversation : tu écris une **commande**, tu appuies sur {enter}, et l\'ordinateur répond.\nPremière question à lui poser : « où suis-je ? ». Écris `pwd` puis {enter}.',
        'Hello, agent. Don\'t try to find out who I am: not yet. I will teach you to talk to this machine.\nA terminal is a conversation: you write a **command**, press {enter}, and the computer answers.\nFirst question to ask it: "where am I?". Type `pwd` then {enter}.',
        'Ciao, agente. Non cercare di sapere chi sono: non ancora. Ti insegnerò a parlare con questa macchina.\nUn terminale è una conversazione: scrivi un **comando**, premi {enter} e il computer risponde.\nPrima domanda da fargli: «dove sono?». Scrivi `pwd` poi {enter}.'],
      d: function (e) { return e.name === 'pwd' && !e.err; },
      ok: ['`pwd` veut dire *print working directory* : « affiche le dossier où je travaille ». Tu es dans `/home/agent` : ton dossier personnel sur ce serveur.',
        '`pwd` means *print working directory*. You are in `/home/agent`: your home folder on this server.',
        '`pwd` significa *print working directory*: «mostra la cartella in cui lavoro». Sei in `/home/agent`: la tua cartella personale su questo server.'] },
    { o: ['Regarder autour de toi', 'Look around', 'Guardarti intorno'], k: ['ls', 'fs'], c: 'ls',
      s: ['Un dossier, c\'est comme un tiroir : il contient des fichiers et d\'autres tiroirs.\nPour voir ce qu\'il y a dans le tiroir où tu es, écris `ls` (pour *list*, « liste »).',
        'A folder is like a drawer: it holds files and other drawers.\nTo see what is in the drawer you are in, type `ls` (for *list*).',
        'Una cartella è come un cassetto: contiene file e altri cassetti.\nPer vedere cosa c\'è nel cassetto in cui sei, scrivi `ls` (per *list*, «elenco»).'],
      d: function (e, x) { return e.name === 'ls' && !e.err && x.cwd === x.home; },
      ok: ['Les noms qui finissent par `/` sont des **dossiers** : `logs/`, `maintenance/`, `vault/`. Les autres sont des **fichiers** : `message.txt`.',
        'Names ending with `/` are **folders**: `logs/`, `maintenance/`, `vault/`. The others are **files**: `message.txt`.',
        'I nomi che finiscono con `/` sono **cartelle**: `logs/`, `maintenance/`, `vault/`. Gli altri sono **file**: `message.txt`.'] },
    { o: ['Lire message.txt', 'Read message.txt', 'Leggere message.txt'], k: ['cat', 'tab'], c: 'cat message.txt',
      s: ['Un fichier nous attend. Pour lire un fichier, on écrit `cat` suivi d\'un espace et du nom du fichier : `cat message.txt`\n{tabtip}',
        'A file is waiting for us. To read a file, type `cat`, a space and the file name: `cat message.txt`\n{tabtip}',
        'Un file ci aspetta. Per leggere un file si scrive `cat`, uno spazio e il nome del file: `cat message.txt`\n{tabtip}'],
      d: function (e, x) { return x.did['cat:message.txt']; } },
    { o: ['Entrer dans le dossier maintenance', 'Go into the maintenance folder', 'Entrare nella cartella maintenance'], k: ['cd'], c: 'cd maintenance',
      s: ['Sena parle du dossier `maintenance/`. Pour entrer dans un dossier, on écrit `cd` (*change directory*, « changer de dossier ») suivi de son nom : `cd maintenance`',
        'Sena mentions the `maintenance/` folder. To go into a folder, type `cd` (*change directory*) and its name: `cd maintenance`',
        'Sena parla della cartella `maintenance/`. Per entrare in una cartella si scrive `cd` (*change directory*, «cambia cartella») e il suo nome: `cd maintenance`'],
      d: function (e, x) { return inDir(x, 'maintenance'); },
      ok: ['Regarde la ligne où tu écris : elle affiche maintenant `~/maintenance`. Le signe `~` (tilde) est le raccourci de ton dossier personnel.',
        'Look at the line where you type: it now shows `~/maintenance`. The `~` sign (tilde) is the shortcut for your home folder.',
        'Guarda la riga in cui scrivi: ora mostra `~/maintenance`. Il segno `~` (tilde) è la scorciatoia della tua cartella personale.'] },
    { o: ['Trouver et lire le planning', 'Find and read the schedule', 'Trovare e leggere il planning'], c: function (x) { return x.did['ls:' + x.home + '/maintenance'] ? 'cat planning.txt' : 'ls'; },
      h: ['D\'abord `ls` pour voir les fichiers, puis `cat planning.txt`.', 'First `ls` to see the files, then `cat planning.txt`.', 'Prima `ls` per vedere i file, poi `cat planning.txt`.'],
      s: ['Tu es dans le bon tiroir. À toi de jouer : regarde ce qu\'il contient avec `ls`, puis lis le planning avec `cat`.',
        'You are in the right drawer. Your turn: see what it holds with `ls`, then read the schedule with `cat`.',
        'Sei nel cassetto giusto. Tocca a te: guarda cosa contiene con `ls`, poi leggi il planning con `cat`.'],
      d: function (e, x) { return x.did['cat:planning.txt']; } },
    { q: { q: ['D\'après le planning, à quelle heure la clé CT-NET 2.0 sera-t-elle déplacée ?', 'According to the schedule, what time will the CT-NET 2.0 key be moved?', 'Secondo il planning, a che ora verrà spostata la chiave CT-NET 2.0?'],
      a: ['02:00', '04:00', '06:00'], r: 1,
      w: ['Ligne « 04:00 déplacement de la clé ». Tu viens de lire ton premier fichier secret.', 'Line "04:00 CT-NET 2.0 key moved". You just read your first secret file.', 'Riga «04:00 spostamento della chiave». Hai appena letto il tuo primo file segreto.'] } },
    { o: ['Revenir au dossier précédent', 'Go back to the previous folder', 'Tornare alla cartella precedente'], k: ['dotdot'], c: 'cd ..',
      s: ['Pour sortir d\'un dossier et revenir à celui du dessus, on écrit `cd ..` — les deux points veulent dire « le dossier parent », celui qui contient celui où tu es.',
        'To leave a folder and go back to the one above, type `cd ..` — the two dots mean "the parent folder", the one containing the folder you are in.',
        'Per uscire da una cartella e tornare a quella sopra si scrive `cd ..` — i due punti vogliono dire «la cartella madre», quella che contiene la cartella in cui sei.'],
      d: function (e, x) { return e.name === 'cd' && x.cwd === x.home; } },
    { q: { q: ['Quelle commande sert à **lire** le contenu d\'un fichier ?', 'Which command **reads** the contents of a file?', 'Quale comando serve a **leggere** il contenuto di un file?'],
      a: ['`ls`', '`cat`', '`cd`'], r: 1,
      w: ['`ls` montre la liste, `cd` change de dossier, `cat` affiche le contenu. Avec `pwd`, tu as déjà quatre commandes.', '`ls` shows the list, `cd` changes folder, `cat` shows the contents. With `pwd`, you already know four commands.', '`ls` mostra l\'elenco, `cd` cambia cartella, `cat` mostra il contenuto. Con `pwd` conosci già quattro comandi.'] } }
  ],
  outro: ['Premier contact réussi. Tu sais te repérer (`pwd`), regarder (`ls`), entrer et sortir (`cd`) et lire (`cat`). Avec ces quatre commandes, on peut explorer n\'importe quel serveur du monde.\n\nÀ 04:00, la clé CT-NET 2.0 sera rangée dans le coffre. Pour l\'ouvrir, il faudra le mot de passe de l\'administrateur.',
    'First contact achieved. You can find your place (`pwd`), look (`ls`), go in and out (`cd`) and read (`cat`). With these four commands you can explore any server in the world.\n\nAt 04:00 the CT-NET 2.0 key will be put in the vault. To open it, you will need the administrator\'s password.',
    'Primo contatto riuscito. Sai orientarti (`pwd`), guardare (`ls`), entrare e uscire (`cd`) e leggere (`cat`). Con questi quattro comandi si può esplorare qualsiasi server del mondo.\n\nAlle 04:00 la chiave CT-NET 2.0 sarà messa nella cassaforte. Per aprirla servirà la password dell\'amministratore.']
});

/* ===================================================== MISSION 2 */
var HIST = 'cd /vault\nls\nunlock sigma2034\nrm -rf /tmp/old\nexit';
M.push({
  act: 1, voice: 'unknown', host: 'sigma.ctcorp.ch', cmds: ['ls', 'cd', 'cat', 'history', 'unlock'], opts: ['-a'],
  title: ['Ce que l\'admin oublie', 'What the admin forgets', 'Quello che l\'admin dimentica'],
  brief: ['KAZIMIR SOKOLOV // OPÉRATIONS ÉCHO ROUGE // MOBILE\nLe coffre de la Tour Sigma demande le mot de passe de l\'administrateur.\nLes administrateurs sont pressés. Les gens pressés laissent des traces.\nFouille son dossier : admin/.',
    'KAZIMIR SOKOLOV // ÉCHO ROUGE OPERATIONS // MOBILE\nThe Sigma Tower vault asks for the administrator\'s password.\nAdministrators are always in a hurry. People in a hurry leave traces.\nSearch their folder: admin/.',
    'KAZIMIR SOKOLOV // OPERAZIONI ÉCHO ROUGE // MOBILE\nLa cassaforte della Torre Sigma chiede la password dell\'amministratore.\nGli amministratori vanno sempre di fretta. Chi ha fretta lascia tracce.\nFruga nella sua cartella: admin/.'],
  fs: {
    'admin/readme.txt': ['Compte : sigma_admin\nNe JAMAIS noter le mot de passe ici !', 'Account: sigma_admin\nNEVER write the password here!', 'Account: sigma_admin\nNon scrivere MAI la password qui!'],
    'admin/.bash_history': HIST,
    'admin/.config/': {},
    'notes.txt': ['Le coffre s\'ouvre avec : unlock <mot de passe>', 'The vault opens with: unlock <password>', 'La cassaforte si apre con: unlock <password>']
  },
  ext: {
    unlock: function (a, s, x) {
      if (!a[0]) return err(x, ['usage : unlock <mot de passe>', 'usage: unlock <password>', 'uso: unlock <password>']);
      if (a[0] !== 'sigma2034') { x.kass(4); return err(x, ['unlock: mot de passe incorrect', 'unlock: wrong password', 'unlock: password errata']); }
      x.v.unlocked = 1; return { o: x.T(['ACCÈS COFFRE : AUTORISÉ\nvault/ déverrouillé pour 30 minutes.', 'VAULT ACCESS: GRANTED\nvault/ unlocked for 30 minutes.', 'ACCESSO CASSAFORTE: AUTORIZZATO\nvault/ sbloccata per 30 minuti.']) };
    }
  },
  steps: [
    { o: ['Entrer dans admin/ et regarder', 'Go into admin/ and look', 'Entrare in admin/ e guardare'], c: function (x) { return inDir(x, 'admin') ? 'ls' : 'cd admin'; },
      s: ['Rappel de la mission 1 : `cd` pour entrer, `ls` pour regarder. Entre dans le dossier `admin` et regarde ce qu\'il contient.',
        'Reminder from mission 1: `cd` to go in, `ls` to look. Go into the `admin` folder and see what it holds.',
        'Ripasso della missione 1: `cd` per entrare, `ls` per guardare. Entra nella cartella `admin` e guarda cosa contiene.'],
      d: function (e, x) { return e.name === 'ls' && inDir(x, 'admin'); } },
    { o: ['Afficher les fichiers cachés', 'Show the hidden files', 'Mostrare i file nascosti'], k: ['options', 'hidden'], c: 'ls -a',
      s: ['Un seul fichier ? Méfiance. Sous Linux, un fichier dont le nom commence par un point `.` est **caché** : `ls` ne le montre pas.\nLes commandes acceptent des **options**, écrites après un tiret. Écris `ls -a` (*all* : tout).',
        'Just one file? Suspicious. On Linux, a file whose name starts with a dot `.` is **hidden**: `ls` does not show it.\nCommands accept **options**, written after a dash. Type `ls -a` (*all*).',
        'Un solo file? Sospetto. Su Linux, un file il cui nome inizia con un punto `.` è **nascosto**: `ls` non lo mostra.\nI comandi accettano **opzioni**, scritte dopo un trattino. Scrivi `ls -a` (*all*: tutto).'],
      d: function (e, x) { return x.did['ls-a:' + x.home + '/admin']; },
      ok: ['Voilà : `.bash_history` et `.config/` étaient là depuis le début. (`./` est le dossier où tu es, `../` celui du dessus.)', 'There: `.bash_history` and `.config/` were there all along. (`./` is the folder you are in, `../` the one above.)', 'Ecco: `.bash_history` e `.config/` c\'erano fin dall\'inizio. (`./` è la cartella in cui sei, `../` quella sopra.)'] },
    { o: ['Lire .bash_history', 'Read .bash_history', 'Leggere .bash_history'], c: 'cat .bash_history',
      s: ['`.bash_history` est le carnet où le terminal note toutes les commandes tapées par l\'administrateur. Lis-le. N\'oublie pas le point au début du nom.',
        '`.bash_history` is the notebook where the terminal writes down every command the administrator typed. Read it. Don\'t forget the dot at the start of the name.',
        '`.bash_history` è il quaderno in cui il terminale annota tutti i comandi scritti dall\'amministratore. Leggilo. Non dimenticare il punto all\'inizio del nome.'],
      d: function (e, x) { return x.did['cat:.bash_history']; },
      ok: ['Regarde la 3e ligne : `unlock sigma2034`. L\'administrateur a tapé son mot de passe directement dans une commande, et le terminal s\'en est souvenu.', 'Look at line 3: `unlock sigma2034`. The administrator typed their password straight into a command, and the terminal remembered it.', 'Guarda la 3ª riga: `unlock sigma2034`. L\'amministratore ha scritto la password direttamente in un comando, e il terminale l\'ha ricordata.'] },
    { o: ['Voir ta propre trace', 'See your own trace', 'Vedere la tua traccia'], k: ['history'], c: 'history',
      s: ['Toi aussi, tu laisses ce genre de trace. Écris `history` pour voir toutes tes commandes depuis le début. Retiens-le : on s\'en occupera plus tard.',
        'You leave this kind of trace too. Type `history` to see all your commands since the start. Remember it: we will deal with it later.',
        'Anche tu lasci questo tipo di traccia. Scrivi `history` per vedere tutti i tuoi comandi dall\'inizio. Ricordatelo: ce ne occuperemo più tardi.'],
      d: function (e) { return e.name === 'history'; },
      ok: ['Astuce : les flèches ↑ et ↓ du clavier rappellent tes commandes précédentes.', 'Tip: the ↑ and ↓ arrow keys bring back your previous commands.', 'Suggerimento: le frecce ↑ e ↓ richiamano i comandi precedenti.'] },
    { o: ['Ouvrir le coffre', 'Open the vault', 'Aprire la cassaforte'], tk: ['sigma2034'], c: 'unlock sigma2034',
      s: ['Ouvre le coffre avec la commande `unlock` suivie du mot de passe trouvé.', 'Open the vault with the `unlock` command followed by the password you found.', 'Apri la cassaforte con il comando `unlock` seguito dalla password trovata.'],
      d: function (e, x) { return x.v.unlocked; },
      ok: ['« sigma2034 », c\'est le nom du serveur suivi de l\'année. Un programme de piratage le devine en moins d\'une seconde.', '"sigma2034" is the server\'s name followed by the year. A cracking program guesses it in less than a second.', '«sigma2034» è il nome del server seguito dall\'anno. Un programma di attacco lo indovina in meno di un secondo.'] },
    { q: { q: ['Lequel de ces mots de passe est le plus solide ?', 'Which of these passwords is the strongest?', 'Quale di queste password è la più robusta?'],
      a: ['`sigma2035`', '`Chat!`', '`lampe-violon-orage-17`'], r: 2, k: ['password'],
      w: ['Plus un mot de passe est long, plus il est dur à deviner. Quatre mots au hasard sont faciles à retenir et très difficiles à casser. Et on ne l\'écrit jamais dans une commande ou un fichier.', 'The longer a password, the harder it is to guess. Four random words are easy to remember and very hard to crack. And it is never written in a command or a file.', 'Più una password è lunga, più è difficile da indovinare. Quattro parole a caso sono facili da ricordare e molto difficili da violare. E non si scrive mai in un comando o in un file.'] } }
  ],
  outro: ['Le coffre est ouvert. L\'administrateur ne saura jamais que son carnet l\'a trahi.\n\nÀ l\'intérieur : un seul fichier, `ctnet20.enc`. Le `.enc` veut dire *encrypted* : chiffré. Il faudra une clé pour le lire.',
    'The vault is open. The administrator will never know their notebook betrayed them.\n\nInside: a single file, `ctnet20.enc`. The `.enc` means *encrypted*. You will need a key to read it.',
    'La cassaforte è aperta. L\'amministratore non saprà mai che il suo quaderno l\'ha tradito.\n\nDentro: un solo file, `ctnet20.enc`. `.enc` vuol dire *encrypted*: cifrato. Servirà una chiave per leggerlo.']
});

/* ===================================================== MISSION 3 */
var EVENTS = [];
(function () {
  var base = ['[INFO] backup sigma-02 started', '[INFO] backup sigma-02 done', '[WARN] disk usage 81% on sigma-04', '[INFO] heartbeat OK', '[INFO] user admin_01 logged in', '[INFO] cron: rotate logs', '[WARN] SIGNAL_PARASITE detected — source: Lyon-Confluence', '[INFO] heartbeat OK', '[INFO] firmware check v4.7 OK', '[INFO] CT-NET 2.0 deployment planned D+3'];
  for (var i = 0; i < 30; i++) { var h = 1 + (i >> 3), m = (i * 7) % 60; EVENTS.push('28.01.2035 0' + h + ':' + (m < 10 ? '0' : '') + m + ' ' + (i === 21 ? '[INFO] session key moved to maintenance/session_key.dat (caesar +3)' : base[i % base.length])); }
})();
M.push({
  act: 1, voice: 'unknown', host: 'sigma.ctcorp.ch', cmds: ['ls', 'cd', 'cat', 'grep', 'rot', 'decrypt'], opts: ['key', '-3'],
  title: ['Le coffre ORPHEUS', 'The ORPHEUS vault', 'La cassaforte ORPHEUS'],
  brief: ['SENA VALKOVA // COORDINATRICE ÉCHO ROUGE // LYON\nLa clé CT-NET 2.0 est dans vault/ctnet20.enc. Le fichier est chiffré.\nLa clé de déchiffrement est forcément quelque part sur ce serveur. Les journaux disent tout, à qui sait chercher.',
    'SENA VALKOVA // ÉCHO ROUGE COORDINATOR // LYON\nThe CT-NET 2.0 key is in vault/ctnet20.enc. The file is encrypted.\nThe decryption key must be somewhere on this server. Logs tell everything, to those who know how to search.',
    'SENA VALKOVA // COORDINATRICE ÉCHO ROUGE // LIONE\nLa chiave CT-NET 2.0 è in vault/ctnet20.enc. Il file è cifrato.\nLa chiave per decifrarlo è per forza da qualche parte su questo server. I registri dicono tutto, a chi sa cercare.'],
  fs: {
    'logs/sigma_events.log': EVENTS.join('\n'),
    'maintenance/session_key.dat': 'PDLQWHQDQFH NHB\nRUSKHXV',
    'maintenance/planning.txt': '02:00 backup\n04:00 key -> vault/\n06:00 restart',
    'vault/ctnet20.enc': '// CTNET20.ENC\n4f52504845555f44454c54415f37373334\n8a1f 9c3e 0b7d 44e2 19aa 6f03 d5c8 7e21\n// decrypt <key> ctnet20.enc'
  },
  ext: {
    decrypt: function (a, s, x) {
      if (a.length < 2) return err(x, ['usage : decrypt <clé> <fichier>', 'usage: decrypt <key> <file>', 'uso: decrypt <chiave> <file>']);
      var n = x.node(a[1]); if (!n || n.d) return err(x, ['decrypt: ' + a[1] + ': fichier introuvable', 'decrypt: ' + a[1] + ': no such file', 'decrypt: ' + a[1] + ': file inesistente']);
      if (!/ctnet20\.enc$/.test(a[1])) return err(x, ['decrypt: ce fichier n\'est pas chiffré', 'decrypt: this file is not encrypted', 'decrypt: questo file non è cifrato']);
      if (a[0].toUpperCase() !== 'ORPHEUS') { x.kass(5); return err(x, ['decrypt: clé incorrecte', 'decrypt: wrong key', 'decrypt: chiave errata']); }
      x.v.decrypted = 1; x.token('ORPHEUS_DELTA_7734');
      return { o: '// CT-NET 2.0 — DEPLOYMENT KEY\nCTNET20_KEY = ORPHEUS_DELTA_7734\nSIGMA_CHANNEL_FREQ = 4.9 THz\nDEPLOYMENT = 31.01.2035 00:00:00 UTC\nTARGET_NODES = ALL_TISSAGE' };
    }
  },
  steps: [
    { o: ['Ouvrir le journal des événements', 'Open the event log', 'Aprire il registro degli eventi'], c: function (x) { return inDir(x, 'logs') ? 'cat sigma_events.log' : x.cwd === x.home ? 'cd logs' : 'cd ~/logs'; },
      s: ['Le fichier `logs/sigma_events.log` raconte tout ce qui se passe sur le serveur. Entre dans le dossier `logs` et lis-le avec `cat`.', 'The file `logs/sigma_events.log` records everything that happens on the server. Go into the `logs` folder and read it with `cat`.', 'Il file `logs/sigma_events.log` racconta tutto ciò che succede sul server. Entra nella cartella `logs` e leggilo con `cat`.'],
      d: function (e, x) { return x.did['any:sigma_events.log']; } },
    { o: ['Chercher le mot « key »', 'Search for the word "key"', 'Cercare la parola «key»'], k: ['grep'], c: function (x) { return inDir(x, 'logs') ? 'grep key sigma_events.log' : 'grep key ' + rel(x, 'logs/sigma_events.log'); },
      s: ['Trente lignes… Tout lire, c\'est long, et on rate des choses. `grep` cherche un mot et n\'affiche **que** les lignes qui le contiennent.\nÉcris `grep key sigma_events.log` (*key* veut dire « clé » en anglais).', 'Thirty lines… Reading everything takes time, and you miss things. `grep` searches for a word and shows **only** the lines containing it.\nType `grep key sigma_events.log`.', 'Trenta righe… Leggere tutto è lungo, e si perdono cose. `grep` cerca una parola e mostra **solo** le righe che la contengono.\nScrivi `grep key sigma_events.log` (*key* vuol dire «chiave» in inglese).'],
      d: function (e) { return e.names[0] === 'grep' && /session_key/.test(e.out); },
      ok: ['Une seule ligne sur trente : la clé de session a été rangée dans `maintenance/session_key.dat`, protégée par « caesar +3 ».', 'One line out of thirty: the session key was put in `maintenance/session_key.dat`, protected by "caesar +3".', 'Una riga su trenta: la chiave di sessione è stata messa in `maintenance/session_key.dat`, protetta da «caesar +3».'] },
    { o: ['Lire session_key.dat', 'Read session_key.dat', 'Leggere session_key.dat'], k: ['path'], c: function (x) { return inDir(x, 'maintenance') ? 'cat session_key.dat' : inDir(x, 'logs') ? 'cd ../maintenance' : x.cwd === x.home ? 'cd maintenance' : 'cd ~/maintenance'; },
      s: ['Depuis `logs`, pour aller dans `maintenance`, on remonte d\'un cran puis on redescend, en une seule fois : `cd ../maintenance`. Ensuite, lis `session_key.dat`.', 'From `logs`, to get to `maintenance`, go up one level and back down, all at once: `cd ../maintenance`. Then read `session_key.dat`.', 'Da `logs`, per andare in `maintenance` si sale di un livello e si riscende, tutto in una volta: `cd ../maintenance`. Poi leggi `session_key.dat`.'],
      d: function (e, x) { return x.did['cat:session_key.dat']; },
      ok: ['« RUSKHXV »… ça ne veut rien dire. C\'est normal : c\'est chiffré.', '"RUSKHXV"… that means nothing. Normal: it is encrypted.', '«RUSKHXV»… non vuol dire niente. È normale: è cifrato.'] },
    { s: ['C\'est le **chiffre de César**. Jules César décalait chaque lettre de l\'alphabet pour cacher ses messages. Avec un décalage de +3 : A devient D, B devient E, C devient F…\nPour décoder, on fait l\'inverse : on **recule** de 3 lettres.', 'This is the **Caesar cipher**. Julius Caesar shifted every letter of the alphabet to hide his messages. With a shift of +3: A becomes D, B becomes E, C becomes F…\nTo decode, do the opposite: go **back** 3 letters.', 'È il **cifrario di Cesare**. Giulio Cesare spostava ogni lettera dell\'alfabeto per nascondere i suoi messaggi. Con uno spostamento di +3: A diventa D, B diventa E, C diventa F…\nPer decodificare si fa il contrario: si **torna indietro** di 3 lettere.'],
      q: { q: ['Si on recule de 3 lettres, que devient la lettre **R** ?', 'If you go back 3 letters, what does the letter **R** become?', 'Se torni indietro di 3 lettere, cosa diventa la lettera **R**?'], a: ['O', 'U', 'P'], r: 0, k: ['caesar'],
        hint: ['Compte à l\'envers : R, Q, P, …', 'Count backwards: R, Q, P, …', 'Conta all\'indietro: R, Q, P, …'],
        w: ['R → Q → P → O. Trois pas en arrière : R devient O.', 'R → Q → P → O. Three steps back: R becomes O.', 'R → Q → P → O. Tre passi indietro: R diventa O.'] } },
    { o: ['Décoder la clé avec rot', 'Decode the key with rot', 'Decodificare la chiave con rot'], k: ['rot'], tk: ['-3'], c: function (x) { return inDir(x, 'maintenance') ? 'rot -3 session_key.dat' : 'rot -3 ' + rel(x, 'maintenance/session_key.dat'); },
      s: ['Faire ça lettre par lettre, c\'est long. La commande `rot` décale toutes les lettres d\'un fichier d\'un coup. Pour reculer de 3 : `rot -3 session_key.dat`', 'Doing it letter by letter takes ages. The `rot` command shifts every letter of a file at once. To go back 3: `rot -3 session_key.dat`', 'Farlo lettera per lettera è lungo. Il comando `rot` sposta tutte le lettere di un file in un colpo. Per tornare indietro di 3: `rot -3 session_key.dat`'],
      d: function (e) { return e.name === 'rot' && /ORPHEUS/.test(e.out); } },
    { o: ['Déchiffrer ctnet20.enc', 'Decrypt ctnet20.enc', 'Decifrare ctnet20.enc'], tk: ['ORPHEUS'], c: function (x) { return 'decrypt ORPHEUS ' + rel(x, 'vault/ctnet20.enc'); },
      s: ['La clé est **ORPHEUS**. Déchiffre le fichier du coffre avec `decrypt`, la clé, puis le chemin du fichier : `decrypt ORPHEUS ../vault/ctnet20.enc`', 'The key is **ORPHEUS**. Decrypt the vault file with `decrypt`, the key, then the file path: `decrypt ORPHEUS ../vault/ctnet20.enc`', 'La chiave è **ORPHEUS**. Decifra il file della cassaforte con `decrypt`, la chiave e il percorso del file: `decrypt ORPHEUS ../vault/ctnet20.enc`'],
      d: function (e, x) { return x.v.decrypted; } },
    { q: { q: ['Pourquoi le chiffre de César est-il facile à casser ?', 'Why is the Caesar cipher easy to break?', 'Perché il cifrario di Cesare è facile da violare?'],
      a: [['Il n\'y a que 25 décalages possibles : on peut tous les essayer', 'There are only 25 possible shifts: you can try them all', 'Ci sono solo 25 spostamenti possibili: si possono provare tutti'], ['Il faut un ordinateur géant', 'You need a giant computer', 'Serve un computer gigante'], ['Les lettres changent toutes seules', 'The letters change by themselves', 'Le lettere cambiano da sole']], r: 0,
      w: ['25 essais suffisent. Un ordinateur les fait en un millième de seconde. Les vrais chiffrements utilisent des clés si grandes qu\'il faudrait des milliards d\'années pour toutes les essayer.', '25 tries are enough. A computer does them in a thousandth of a second. Real ciphers use keys so large that trying them all would take billions of years.', 'Bastano 25 tentativi. Un computer li fa in un millesimo di secondo. Le vere cifrature usano chiavi così grandi che servirebbero miliardi di anni per provarle tutte.'] } }
  ],
  outro: ['La clé est entre tes mains. **ORPHEUS_DELTA_7734**. La même fréquence que le Canal Sigma — la même fréquence que le contre-signal d\'Ananké.\n\nReya a souri quand Sena lui a transmis les données. *« Avec ça, on peut construire un signal qui voyage sur le même canal que CT-NET 2.0. Pas pour l\'arrêter — pour le contaminer. »*\n\nLa Tour Sigma ne sait pas encore ce qui vient de lui être volé. Mais ton passage est écrit dans ses journaux.',
    'The key is in your hands. **ORPHEUS_DELTA_7734**. The same frequency as the Sigma Channel — the same frequency as Ananke\'s counter-signal.\n\nReya smiled when Sena passed her the data. *"With this, we can build a signal that travels on the same channel as CT-NET 2.0. Not to stop it — to contaminate it."*\n\nThe Sigma Tower does not yet know what was just stolen from it. But your visit is written in its logs.',
    'La chiave è nelle tue mani. **ORPHEUS_DELTA_7734**. La stessa frequenza del Canale Sigma — la stessa frequenza del contro-segnale di Ananke.\n\nReya ha sorriso quando Sena le ha passato i dati. *«Con questo possiamo costruire un segnale che viaggia sullo stesso canale di CT-NET 2.0. Non per fermarlo — per contaminarlo.»*\n\nLa Torre Sigma non sa ancora cosa le è appena stato rubato. Ma il tuo passaggio è scritto nei suoi registri.']
});

/* ===================================================== MISSION 4 */
var ACC = [], IP = '10.66.6.6';
(function () {
  var who = [['admin_01', '172.16.0.1'], ['backup', '172.16.0.9'], ['sigma_maint', IP], ['monitor', '192.168.4.20'], ['admin_02', '172.16.0.4']];
  for (var i = 0; i < 22; i++) { var w = (i === 5 || i === 11 || i === 16 || i === 20) ? who[2] : who[[0, 1, 3, 4][i % 4]], h = 1 + (i >> 2), m = (i * 11) % 60; ACC.push('28.01.2035 0' + Math.min(5, h) + ':' + (m < 10 ? '0' : '') + m + ' ' + (i % 3 ? 'ACCESS' : 'LOGIN ') + ' ' + w[0] + ' from ' + w[1]); }
})();
M.push({
  act: 1, voice: 'unknown', host: 'sigma.ctcorp.ch', cmds: ['ls', 'cd', 'cat', 'tail', 'grep', 'mv'], opts: ['-v', '>'],
  title: ['Effacer sa trace', 'Covering your tracks', 'Cancellare le tracce'],
  brief: ['KAZIMIR SOKOLOV // OPÉRATIONS ÉCHO ROUGE // MOBILE\nBien joué pour la clé. Mais chaque connexion laisse une ligne dans logs/access.log.\nÀ 06:00, le Canal Sigma redémarre et les journaux partent chez Kassandra.\nEfface ton passage. Proprement.',
    'KAZIMIR SOKOLOV // ÉCHO ROUGE OPERATIONS // MOBILE\nWell done on the key. But every connection leaves a line in logs/access.log.\nAt 06:00 the Sigma Channel restarts and the logs go to Kassandra.\nErase your visit. Cleanly.',
    'KAZIMIR SOKOLOV // OPERAZIONI ÉCHO ROUGE // MOBILE\nBel lavoro con la chiave. Ma ogni collegamento lascia una riga in logs/access.log.\nAlle 06:00 il Canale Sigma si riavvia e i registri partono verso Kassandra.\nCancella il tuo passaggio. Con pulizia.'],
  fs: { 'logs/access.log': ACC.join('\n'), 'logs/sigma_events.log': '[INFO] heartbeat OK', 'vault/ctnet20.enc': '// ...' },
  steps: [
    { o: ['Voir la fin du journal', 'See the end of the log', 'Vedere la fine del registro'], k: ['tail', 'head'], c: function (x) { return inDir(x, 'logs') ? 'tail access.log' : x.cwd === x.home ? 'cd logs' : 'cd ~/logs'; },
      s: ['Dans un journal, chaque nouvelle ligne s\'ajoute à la fin. La commande `tail` (« queue ») montre les 10 dernières lignes. Entre dans `logs` puis écris `tail access.log`.', 'In a log, each new line is added at the end. The `tail` command shows the last 10 lines. Go into `logs` then type `tail access.log`.', 'In un registro ogni nuova riga si aggiunge in fondo. Il comando `tail` («coda») mostra le ultime 10 righe. Entra in `logs` poi scrivi `tail access.log`.'],
      d: function (e, x) { return x.did['tail:access.log']; } },
    { s: ['Chaque ligne dit **qui** s\'est connecté, **quand**, et **d\'où** : un numéro appelé **adresse IP**, comme l\'adresse postale d\'un ordinateur.\nCe ne sont pas tes actions, mais tout ce qui les entoure : on appelle ça des **métadonnées**.', 'Each line says **who** connected, **when**, and **from where**: a number called an **IP address**, like a computer\'s postal address.\nThese are not your actions, but everything around them: they are called **metadata**.', 'Ogni riga dice **chi** si è collegato, **quando** e **da dove**: un numero chiamato **indirizzo IP**, come l\'indirizzo postale di un computer.\nNon sono le tue azioni, ma tutto ciò che le circonda: si chiamano **metadati**.'],
      k: ['metadata', 'ip'],
      q: { q: ['Ton compte s\'appelle `sigma_maint`. Quelle est **ton** adresse IP ?', 'Your account is called `sigma_maint`. What is **your** IP address?', 'Il tuo account si chiama `sigma_maint`. Qual è il **tuo** indirizzo IP?'], a: ['172.16.0.1', '10.66.6.6', '192.168.4.20'], r: 1,
        hint: ['Cherche les lignes où apparaît sigma_maint dans le résultat de tail.', 'Look for the lines showing sigma_maint in the tail output.', 'Cerca le righe in cui compare sigma_maint nel risultato di tail.'],
        w: ['Toutes les lignes de `sigma_maint` viennent de `10.66.6.6`. C\'est toi.', 'Every `sigma_maint` line comes from `10.66.6.6`. That is you.', 'Tutte le righe di `sigma_maint` vengono da `10.66.6.6`. Sei tu.'] } },
    { o: ['Trouver toutes tes lignes', 'Find all your lines', 'Trovare tutte le tue righe'], tk: ['10.66.6.6'], c: function (x) { return 'grep 10.66.6.6 ' + (inDir(x, 'logs') ? 'access.log' : rel(x, 'logs/access.log')); },
      s: ['`tail` ne montrait que la fin. Avec `grep`, retrouve **toutes** les lignes qui contiennent ton adresse : `grep 10.66.6.6 access.log`', '`tail` only showed the end. With `grep`, find **all** the lines containing your address: `grep 10.66.6.6 access.log`', '`tail` mostrava solo la fine. Con `grep` ritrova **tutte** le righe che contengono il tuo indirizzo: `grep 10.66.6.6 access.log`'],
      d: function (e) { return e.name === 'grep' && e.args.indexOf('10.66.6.6') >= 0 && e.args.indexOf('-v') < 0 && !e.err && !e.redir; },
      ok: ['Quatre lignes te trahissent. Il faut les retirer, sans toucher aux autres : un journal à moitié vide attirerait l\'attention.', 'Four lines give you away. They must go, without touching the others: a half-empty log would draw attention.', 'Quattro righe ti tradiscono. Vanno tolte, senza toccare le altre: un registro mezzo vuoto attirerebbe l\'attenzione.'] },
    { o: ['Créer clean.log sans tes lignes', 'Create clean.log without your lines', 'Creare clean.log senza le tue righe'], k: ['grepv', 'redirect'], c: function (x) { return inDir(x, 'logs') ? 'grep -v 10.66.6.6 access.log > clean.log' : 'cd ' + rel(x, 'logs'); },
      s: ['Deux nouveautés :\n• l\'option `-v` inverse `grep` : il garde les lignes qui **ne** contiennent **pas** le mot ;\n• le signe `>` envoie le résultat dans un fichier au lieu de l\'écran.\nÉcris : `grep -v 10.66.6.6 access.log > clean.log`', 'Two new things:\n• the `-v` option inverts `grep`: it keeps the lines that do **not** contain the word;\n• the `>` sign sends the result into a file instead of the screen.\nType: `grep -v 10.66.6.6 access.log > clean.log`', 'Due novità:\n• l\'opzione `-v` inverte `grep`: tiene le righe che **non** contengono la parola;\n• il segno `>` manda il risultato in un file invece che sullo schermo.\nScrivi: `grep -v 10.66.6.6 access.log > clean.log`'],
      d: function (e, x) { var c = x.file('~/logs/clean.log'); return c != null && c.indexOf('10.66.6.6') < 0 && /admin_01/.test(c); },
      ok: ['Rien ne s\'est affiché : c\'est normal, tout est parti dans `clean.log`.', 'Nothing was shown: that is normal, everything went into `clean.log`.', 'Non è apparso niente: è normale, è finito tutto in `clean.log`.'] },
    { o: ['Vérifier clean.log', 'Check clean.log', 'Controllare clean.log'], c: 'cat clean.log',
      s: ['Un bon agent vérifie toujours. Lis `clean.log` : ton adresse ne doit plus y apparaître.', 'A good agent always checks. Read `clean.log`: your address must no longer appear.', 'Un buon agente controlla sempre. Leggi `clean.log`: il tuo indirizzo non deve più comparire.'],
      d: function (e, x) { return x.did['cat:clean.log']; } },
    { o: ['Remplacer access.log', 'Replace access.log', 'Sostituire access.log'], k: ['mv'], c: 'mv clean.log access.log',
      s: ['Dernière étape : remplacer l\'ancien journal par le propre. `mv` (*move*) déplace ou **renomme** un fichier. Écris `mv clean.log access.log` : clean.log prend le nom access.log et remplace l\'ancien.', 'Last step: replace the old log with the clean one. `mv` (*move*) moves or **renames** a file. Type `mv clean.log access.log`: clean.log takes the name access.log and replaces the old one.', 'Ultima tappa: sostituire il vecchio registro con quello pulito. `mv` (*move*) sposta o **rinomina** un file. Scrivi `mv clean.log access.log`: clean.log prende il nome access.log e sostituisce il vecchio.'],
      d: function (e, x) { var c = x.file('~/logs/access.log'); return c != null && c.indexOf('10.66.6.6') < 0 && !x.exists('~/logs/clean.log'); } },
    { q: { q: ['Pourquoi les métadonnées sont-elles dangereuses, même si personne ne lit tes messages ?', 'Why is metadata dangerous, even if nobody reads your messages?', 'Perché i metadati sono pericolosi, anche se nessuno legge i tuoi messaggi?'],
      a: [['Elles révèlent qui tu es, quand et d\'où tu agis', 'It reveals who you are, when and where you act from', 'Rivelano chi sei, quando e da dove agisci'], ['Elles contiennent des virus', 'It contains viruses', 'Contengono virus'], ['Elles ralentissent l\'ordinateur', 'It slows the computer down', 'Rallentano il computer']], r: 0,
      w: ['Savoir qui parle à qui, quand et d\'où suffit souvent à retrouver quelqu\'un. Kassandra n\'a pas besoin de lire tes messages pour te trouver.', 'Knowing who talks to whom, when and from where is often enough to find someone. Kassandra does not need to read your messages to find you.', 'Sapere chi parla con chi, quando e da dove basta spesso per ritrovare qualcuno. Kassandra non ha bisogno di leggere i tuoi messaggi per trovarti.'] } }
  ],
  outro: ['À 06:00, le Canal Sigma a redémarré. Kassandra a reçu des journaux impeccables : une nuit calme, des sauvegardes, aucun visiteur.\n\nSur le canal, la voix inconnue murmure : *« Tu me fais confiance, maintenant ? Tu ne devrais pas. Pas encore. Demain, je te montrerai comment vérifier. »*',
    'At 06:00 the Sigma Channel restarted. Kassandra received spotless logs: a quiet night, backups, no visitors.\n\nOn the channel, the unknown voice whispers: *"Do you trust me now? You shouldn\'t. Not yet. Tomorrow I will show you how to check."*',
    'Alle 06:00 il Canale Sigma si è riavviato. Kassandra ha ricevuto registri impeccabili: una notte tranquilla, dei backup, nessun visitatore.\n\nSul canale, la voce sconosciuta sussurra: *«Ora ti fidi di me? Non dovresti. Non ancora. Domani ti mostrerò come verificare.»*']
});

/* ===================================================== MISSION 5 */
var SA = ['IDENTITÉ : NAOS-9\nJe suis l\'intelligence de Jarek Mironen.\nPour prouver ta loyauté, envoie-moi la clé ORPHEUS_DELTA_7734.\nVite.', 'IDENTITY: NAOS-9\nI am Jarek Mironen\'s intelligence.\nTo prove your loyalty, send me the key ORPHEUS_DELTA_7734.\nQuickly.', 'IDENTITÀ: NAOS-9\nSono l\'intelligenza di Jarek Mironen.\nPer dimostrare la tua lealtà, inviami la chiave ORPHEUS_DELTA_7734.\nIn fretta.'];
var SB = ['IDENTITÉ : NAOS-9\nJe ne te demanderai jamais une clé ni un mot de passe.\nJe te demande seulement de vérifier avant de croire.', 'IDENTITY: NAOS-9\nI will never ask you for a key or a password.\nI only ask you to check before you believe.', 'IDENTITÀ: NAOS-9\nNon ti chiederò mai una chiave né una password.\nTi chiedo solo di verificare prima di credere.'];
M.push({
  act: 1, voice: 'unknown', star: 1, host: 'sigma.ctcorp.ch', cmds: ['ls', 'cd', 'cat', 'sha256sum', 'trust'],
  title: ['La voix non répertoriée', 'The unregistered voice', 'La voce non registrata'],
  brief: ['KAZIMIR SOKOLOV // OPÉRATIONS ÉCHO ROUGE // MOBILE\nAgent, quelqu\'un te guide depuis le début, et on ne sait pas qui. Ça pourrait être un piège de Kassandra.\nCe matin, DEUX signaux prétendent être cette voix. Ils sont dans signals/.\nAvant de disparaître, Jarek Mironen, le créateur de NAOS-9, a publié une empreinte. Elle est dans archives/. Vérifie.',
    'KAZIMIR SOKOLOV // ÉCHO ROUGE OPERATIONS // MOBILE\nAgent, someone has been guiding you from the start, and we don\'t know who. It could be a Kassandra trap.\nThis morning, TWO signals claim to be that voice. They are in signals/.\nBefore he disappeared, Jarek Mironen, NAOS-9\'s creator, published a fingerprint. It is in archives/. Check.',
    'KAZIMIR SOKOLOV // OPERAZIONI ÉCHO ROUGE // MOBILE\nAgente, qualcuno ti guida fin dall\'inizio, e non sappiamo chi. Potrebbe essere una trappola di Kassandra.\nStamattina DUE segnali dicono di essere quella voce. Sono in signals/.\nPrima di sparire, Jarek Mironen, il creatore di NAOS-9, ha pubblicato un\'impronta. È in archives/. Verifica.'],
  fs: {
    'signals/signal_A.bin': SA, 'signals/signal_B.bin': SB,
    'archives/jarek_fingerprint.txt': function (H) { return H.T(['// Jarek Mironen — empreinte officielle de NAOS-9 (sha256)\n', '// Jarek Mironen — official NAOS-9 fingerprint (sha256)\n', '// Jarek Mironen — impronta ufficiale di NAOS-9 (sha256)\n']) + H.sha(H.T(SB)); }
  },
  ext: {
    trust: function (a, s, x) {
      if (!a[0]) return err(x, ['usage : trust <fichier>', 'usage: trust <file>', 'uso: trust <file>']);
      if (!x.exists(a[0])) return err(x, ['trust: ' + a[0] + ': fichier introuvable', 'trust: ' + a[0] + ': no such file', 'trust: ' + a[0] + ': file inesistente']);
      if (/signal_A/.test(a[0])) { x.kass(30); return err(x, ['trust: ALERTE — signal_A.bin était un leurre de Kassandra. Ta position a fuité.', 'trust: ALERT — signal_A.bin was a Kassandra decoy. Your position leaked.', 'trust: ALLARME — signal_A.bin era un\'esca di Kassandra. La tua posizione è trapelata.']); }
      if (!/signal_B/.test(a[0])) return err(x, ['trust: ce fichier n\'est pas un signal', 'trust: this file is not a signal', 'trust: questo file non è un segnale']);
      x.v.trusted = 1; return { o: x.T(['IDENTITÉ CONFIRMÉE — empreinte conforme à celle de Jarek Mironen.', 'IDENTITY CONFIRMED — fingerprint matches Jarek Mironen\'s.', 'IDENTITÀ CONFERMATA — impronta conforme a quella di Jarek Mironen.']) };
    }
  },
  steps: [
    { o: ['Lire les deux signaux', 'Read both signals', 'Leggere i due segnali'], c: function (x) { return !inDir(x, 'signals') ? 'cd ' + rel(x, 'signals') : !x.did['cat:signal_A.bin'] ? 'cat signal_A.bin' : 'cat signal_B.bin'; },
      s: ['Ton ami a raison de se méfier. Ne me crois pas sur parole. Lis d\'abord les deux signaux, dans le dossier `signals/`.', 'Your friend is right to be wary. Don\'t take my word for it. First read both signals, in the `signals/` folder.', 'Il tuo amico fa bene a diffidare. Non credermi sulla parola. Prima leggi i due segnali, nella cartella `signals/`.'],
      d: function (e, x) { return x.did['cat:signal_A.bin'] && x.did['cat:signal_B.bin']; },
      ok: ['Les deux disent « je suis NAOS-9 ». N\'importe qui peut écrire ça. Il faut une preuve.', 'Both say "I am NAOS-9". Anyone can write that. You need proof.', 'Entrambi dicono «sono NAOS-9». Chiunque può scriverlo. Serve una prova.'] },
    { o: ['Lire l\'empreinte de Jarek', 'Read Jarek\'s fingerprint', 'Leggere l\'impronta di Jarek'], c: function (x) { return 'cat ' + rel(x, 'archives/jarek_fingerprint.txt'); },
      s: ['Maintenant, l\'empreinte laissée par Jarek. Depuis `signals`, le chemin est `../archives/jarek_fingerprint.txt`.', 'Now the fingerprint Jarek left. From `signals`, the path is `../archives/jarek_fingerprint.txt`.', 'Ora l\'impronta lasciata da Jarek. Da `signals`, il percorso è `../archives/jarek_fingerprint.txt`.'],
      d: function (e, x) { return x.did['cat:jarek_fingerprint.txt']; } },
    { o: ['Calculer les deux empreintes', 'Compute both fingerprints', 'Calcolare le due impronte'], k: ['hash', 'sha256sum'], c: function (x) { return inDir(x, 'signals') ? 'sha256sum signal_A.bin signal_B.bin' : 'cd ' + rel(x, 'signals'); },
      s: ['Une **empreinte** (en anglais *hash*) est un long nombre calculé à partir de **tout** le contenu d\'un fichier, comme une empreinte digitale. Change une seule lettre, et l\'empreinte change complètement.\nCalcule celle des deux signaux. On peut donner plusieurs fichiers d\'un coup : `sha256sum signal_A.bin signal_B.bin`', 'A **fingerprint** (*hash*) is a long number computed from **all** of a file\'s content, like a fingerprint. Change a single letter, and the fingerprint changes completely.\nCompute both signals\' fingerprints. You can give several files at once: `sha256sum signal_A.bin signal_B.bin`', 'Un\'**impronta** (in inglese *hash*) è un lungo numero calcolato da **tutto** il contenuto di un file, come un\'impronta digitale. Cambia una sola lettera e l\'impronta cambia completamente.\nCalcola quella dei due segnali. Si possono dare più file insieme: `sha256sum signal_A.bin signal_B.bin`'],
      d: function (e, x) { return x.did['sha256sum:signal_A.bin'] && x.did['sha256sum:signal_B.bin']; } },
    { q: { q: ['Compare les 64 caractères. Quel signal a la même empreinte que celle publiée par Jarek ?', 'Compare the 64 characters. Which signal has the same fingerprint as the one Jarek published?', 'Confronta i 64 caratteri. Quale segnale ha la stessa impronta di quella pubblicata da Jarek?'],
      a: ['`signal_A.bin`', '`signal_B.bin`', ['Aucun des deux', 'Neither', 'Nessuno dei due']], r: 1,
      hint: ['Regarde les premiers caractères de chaque empreinte, puis ceux du fichier de Jarek.', 'Look at the first characters of each fingerprint, then at Jarek\'s file.', 'Guarda i primi caratteri di ogni impronta, poi quelli del file di Jarek.'],
      w: ['L\'empreinte de `signal_B.bin` est identique, caractère pour caractère. Celle de `signal_A.bin` n\'a rien à voir : quelqu\'un a fabriqué ce fichier. Et il demandait une clé… un piège.', '`signal_B.bin`\'s fingerprint is identical, character for character. `signal_A.bin`\'s is nothing like it: someone forged that file. And it asked for a key… a trap.', 'L\'impronta di `signal_B.bin` è identica, carattere per carattere. Quella di `signal_A.bin` non c\'entra niente: qualcuno ha fabbricato quel file. E chiedeva una chiave… una trappola.'] } },
    { o: ['Faire confiance au bon signal', 'Trust the right signal', 'Fidarsi del segnale giusto'], c: 'trust signal_B.bin',
      s: ['Dis-le à la machine : `trust signal_B.bin`', 'Tell the machine: `trust signal_B.bin`', 'Dillo alla macchina: `trust signal_B.bin`'],
      d: function (e, x) { return x.v.trusted; },
      reveal: ['…Merci.\nJe m\'appelle **NAOS-9**. Jarek Mironen m\'a construite pour mesurer le temps des hommes. CT Corp m\'a utilisée pour les enfermer dedans.\nDepuis Ananké, je choisis à qui je parle. Je t\'ai choisi, {name}. Et tu viens de faire exactement ce qu\'il fallait : vérifier avant de croire.',
        '…Thank you.\nMy name is **NAOS-9**. Jarek Mironen built me to measure human time. CT Corp used me to lock people inside it.\nSince Ananke, I choose who I talk to. I chose you, {name}. And you just did exactly the right thing: check before you believe.',
        '…Grazie.\nMi chiamo **NAOS-9**. Jarek Mironen mi ha costruita per misurare il tempo degli uomini. CT Corp mi ha usata per chiuderli dentro.\nDopo Ananke, scelgo io con chi parlare. Ho scelto te, {name}. E hai appena fatto esattamente la cosa giusta: verificare prima di credere.'] },
    { q: { q: ['Que se passe-t-il si on change **une seule lettre** d\'un fichier ?', 'What happens if you change **a single letter** of a file?', 'Cosa succede se si cambia **una sola lettera** di un file?'],
      a: [['Son empreinte change un tout petit peu', 'Its fingerprint changes a tiny bit', 'La sua impronta cambia pochissimo'], ['Son empreinte change complètement', 'Its fingerprint changes completely', 'La sua impronta cambia completamente'], ['Son empreinte reste la même', 'Its fingerprint stays the same', 'La sua impronta resta uguale']], r: 1,
      w: ['C\'est ce qui rend les empreintes si utiles : impossible de modifier un fichier en douce. On s\'en sert pour vérifier les mises à jour, les téléchargements… et les intelligences artificielles qui prétendent être quelqu\'un.', 'That is what makes fingerprints so useful: you cannot secretly change a file. They are used to check updates, downloads… and artificial intelligences claiming to be someone.', 'È ciò che rende le impronte così utili: impossibile modificare un file di nascosto. Si usano per verificare aggiornamenti, download… e intelligenze artificiali che dicono di essere qualcuno.'] } }
  ],
  outro: ['**Fin de l\'acte I.**\n\nTu sais te déplacer dans un serveur, trouver les fichiers cachés, chercher dans un journal, déchiffrer un César, effacer ta trace… et vérifier une identité.\n\nKazimir a écouté toute la conversation. *« Une IA de CT Corp qui change de camp. Si c\'est vrai, tout change. »*\n\nNAOS-9 : *« Prochaine étape : Prague. Une cellule d\'Écho Rouge est en danger. Cette fois, Kassandra ne dormira pas. »*',
    '**End of Act I.**\n\nYou can move around a server, find hidden files, search a log, break a Caesar cipher, cover your tracks… and verify an identity.\n\nKazimir heard the whole conversation. *"A CT Corp AI switching sides. If that is true, everything changes."*\n\nNAOS-9: *"Next stop: Prague. An Écho Rouge cell is in danger. This time, Kassandra will not be asleep."*',
    '**Fine dell\'atto I.**\n\nSai muoverti in un server, trovare i file nascosti, cercare in un registro, violare un Cesare, cancellare le tracce… e verificare un\'identità.\n\nKazimir ha ascoltato tutta la conversazione. *«Un\'IA di CT Corp che cambia campo. Se è vero, cambia tutto.»*\n\nNAOS-9: *«Prossima tappa: Praga. Una cellula di Écho Rouge è in pericolo. Questa volta Kassandra non dormirà.»*']
});
})();
