/* SIGNAL — Acte III : Porte-88 (Gdańsk). Missions 11 à 15. Niveau expert : Kassandra monte en temps réel,
   les commandes bruyantes la font grimper, les indices coûtent cher. Textes : [fr, en, it]. */
(function () {
var D = window.SIGNAL_DATA, M = D.missions;
function err(x, a) { return { e: x.T(a) }; }
var HOST = 'gft-west.ctg6';
function sshExt(a, s, x) {
  if (!a[0]) return err(x, ['usage : ssh utilisateur@machine', 'usage: ssh user@machine', 'uso: ssh utente@macchina']);
  if (x.host === HOST) return err(x, ['ssh: tu es déjà connecté à ' + HOST, 'ssh: you are already connected to ' + HOST, 'ssh: sei già collegato a ' + HOST]);
  var m = /^([^@]+)@(.+)$/.exec(a[0]); if (!m) return err(x, ['ssh: écris utilisateur@machine, par exemple tech@' + HOST, 'ssh: write user@machine, for example tech@' + HOST, 'ssh: scrivi utente@macchina, per esempio tech@' + HOST]);
  if (m[2] !== HOST) { x.kass(4); return err(x, ['ssh: ' + m[2] + ': machine injoignable', 'ssh: ' + m[2] + ': host unreachable', 'ssh: ' + m[2] + ': macchina irraggiungibile']); }
  if (m[1] !== 'tech') { x.kass(4); return { e: m[1] + '@' + HOST + ': Permission denied (publickey).' }; }
  if (x.fileIn('local', 'upload/id_agent.pub') == null) { x.kass(4); return { e: 'tech@' + HOST + ': Permission denied (publickey).' }; }
  x.v.ssh = 1; x.connect('remote');
  return { o: x.T(['Connexion à ' + HOST + ' (port 22)… clé publique acceptée.\nGFT-WEST // COMPLEXE N°6 // ACCÈS TECHNICIEN\n`exit` pour te déconnecter.', 'Connecting to ' + HOST + ' (port 22)… public key accepted.\nGFT-WEST // COMPLEX NO. 6 // TECHNICIAN ACCESS\n`exit` to disconnect.', 'Connessione a ' + HOST + ' (porta 22)… chiave pubblica accettata.\nGFT-WEST // COMPLESSO N. 6 // ACCESSO TECNICO\n`exit` per scollegarti.']).replace(/`/g, '') };
}

/* ===================================================== MISSION 11 */
var NET = { 'gft-west.ctg6': '10.6.0.21', 'gft-north.ctg6': '10.6.0.22', 'kassandra-relay.ctg6': '10.6.0.2', 'naos-core.ctg6': '10.6.0.9' };
M.push({
  act: 3, host: 'relay.echo-rouge.org', cmds: ['cat', 'ping', 'scan'], opts: ['gft-west.ctg6', 'gft-north.ctg6'],
  title: ['Cartographie', 'Mapping', 'Cartografia'],
  brief: ['KAZIMIR SOKOLOV // OPÉRATIONS ÉCHO ROUGE // GDAŃSK\nComplexe n°6, aile ouest : 2 400 compressés encore dans leurs bulles.\nAvant d\'agir, il nous faut une carte du réseau du complexe.\nChaque sonde fait du bruit, et Kassandra écoute en temps réel. Sois bref.',
    'KAZIMIR SOKOLOV // ÉCHO ROUGE OPERATIONS // GDAŃSK\nComplex No. 6, west wing: 2,400 compressed still in their bubbles.\nBefore acting, we need a map of the complex\'s network.\nEvery probe makes noise, and Kassandra is listening in real time. Be quick.',
    'KAZIMIR SOKOLOV // OPERAZIONI ÉCHO ROUGE // DANZICA\nComplesso n. 6, ala ovest: 2.400 compressi ancora nelle loro bolle.\nPrima di agire ci serve una mappa della rete del complesso.\nOgni sonda fa rumore, e Kassandra ascolta in tempo reale. Sii rapido.'],
  fs: { 'network.txt': ['RÉSEAU DU COMPLEXE N°6 (relevé de Lena)\ngft-west.ctg6        générateurs, aile ouest\ngft-north.ctg6       générateurs, aile nord\nkassandra-relay.ctg6 relais de surveillance — NE PAS TOUCHER\nnaos-core.ctg6       nœud NAOS-9 local', 'COMPLEX NO. 6 NETWORK (Lena\'s survey)\ngft-west.ctg6        generators, west wing\ngft-north.ctg6       generators, north wing\nkassandra-relay.ctg6 surveillance relay — DO NOT TOUCH\nnaos-core.ctg6       local NAOS-9 node', 'RETE DEL COMPLESSO N. 6 (rilievo di Lena)\ngft-west.ctg6        generatori, ala ovest\ngft-north.ctg6       generatori, ala nord\nkassandra-relay.ctg6 relè di sorveglianza — NON TOCCARE\nnaos-core.ctg6       nodo NAOS-9 locale'] },
  ext: {
    ping: function (a, s, x) {
      var h = a[0]; if (!h) return err(x, ['usage : ping <machine>', 'usage: ping <machine>', 'uso: ping <macchina>']);
      if (!NET[h]) return { e: 'ping: ' + h + ': Name or service not known' };
      x.v.noisy = 2; x.v['ping:' + h] = 1; if (h === 'kassandra-relay.ctg6') x.v.noisy = 15;
      var out = ['PING ' + h + ' (' + NET[h] + '): 56 data bytes'];
      if (h === 'gft-north.ctg6') { out.push('Request timeout for icmp_seq 0', 'Request timeout for icmp_seq 1', 'Request timeout for icmp_seq 2', '--- 3 packets transmitted, 0 received, 100% packet loss'); }
      else { [12, 11, 13].forEach(function (t, i) { out.push('64 bytes from ' + NET[h] + ': icmp_seq=' + i + ' time=' + t + ' ms'); }); out.push('--- 3 packets transmitted, 3 received, 0% packet loss'); }
      return { o: out.join('\n') };
    },
    scan: function (a, s, x) {
      var h = a[0]; if (!h) return err(x, ['usage : scan <machine>', 'usage: scan <machine>', 'uso: scan <macchina>']);
      if (!NET[h]) return { e: 'scan: ' + h + ': unknown host' };
      x.v.noisy = h === 'kassandra-relay.ctg6' ? 25 : 8; x.v['scan:' + h] = 1;
      if (h === 'gft-north.ctg6') return { o: 'scan: ' + h + ': host seems down (0 ports answered)' };
      if (h !== 'gft-west.ctg6') return { o: 'PORT     STATE    SERVICE\n22/tcp   open     ssh\n443/tcp  open     https' };
      return { o: 'PORT      STATE     SERVICE\n22/tcp    open      ssh\n80/tcp    closed    http\n443/tcp   closed    https\n8088/tcp  filtered  mironen-gate' };
    }
  },
  steps: [
    { o: ['Lire le relevé du réseau', 'Read the network survey', 'Leggere il rilievo della rete'],
      s: ['Lena a fait un relevé du réseau du complexe : `network.txt`. Commence par là.', 'Lena surveyed the complex\'s network: `network.txt`. Start there.', 'Lena ha fatto un rilievo della rete del complesso: `network.txt`. Comincia da lì.'],
      d: function (e, x) { return x.did['cat:network.txt']; } },
    { o: ['Sonder l\'aile ouest', 'Probe the west wing', 'Sondare l\'ala ovest'], k: ['ping'],
      s: ['`ping` envoie un petit message à une machine et attend l\'écho, comme un sonar : « tu es là ? ». Sonde les générateurs de l\'aile ouest : `ping gft-west.ctg6`', '`ping` sends a small message to a machine and waits for the echo, like sonar: "are you there?". Probe the west wing generators: `ping gft-west.ctg6`', '`ping` invia un piccolo messaggio a una macchina e aspetta l\'eco, come un sonar: «ci sei?». Sonda i generatori dell\'ala ovest: `ping gft-west.ctg6`'],
      d: function (e, x) { return x.v['ping:gft-west.ctg6']; },
      ok: ['Trois réponses en une douzaine de millisecondes : la machine est allumée et proche.', 'Three answers in about twelve milliseconds: the machine is on and close.', 'Tre risposte in una dozzina di millisecondi: la macchina è accesa e vicina.'] },
    { o: ['Sonder l\'aile nord', 'Probe the north wing', 'Sondare l\'ala nord'],
      s: ['Et l\'aile nord ? `ping gft-north.ctg6`', 'And the north wing? `ping gft-north.ctg6`', 'E l\'ala nord? `ping gft-north.ctg6`'],
      d: function (e, x) { return x.v['ping:gft-north.ctg6']; },
      ok: ['Aucune réponse. Soit la machine est éteinte, soit un **pare-feu** bloque l\'écho. Dans les deux cas, on ne passera pas par le nord.', 'No answer. Either the machine is off, or a **firewall** is blocking the echo. Either way, we will not go through the north.', 'Nessuna risposta. O la macchina è spenta, o un **firewall** blocca l\'eco. In entrambi i casi non passeremo dal nord.'], k: ['firewall'] },
    { o: ['Lister les ports de l\'aile ouest', 'List the west wing\'s ports', 'Elencare le porte dell\'ala ovest'], k: ['ports', 'scan'],
      s: ['Une machine a des **ports** : des portes numérotées, chacune pour un service. 22 pour se connecter à distance, 80 et 443 pour le web…\n`scan gft-west.ctg6` les essaie toutes. Ça fait du bruit : une seule fois, et pas sur le relais de Kassandra.', 'A machine has **ports**: numbered doors, each for a service. 22 for remote login, 80 and 443 for the web…\n`scan gft-west.ctg6` tries them all. It is noisy: only once, and not on Kassandra\'s relay.', 'Una macchina ha delle **porte**: ingressi numerati, ognuno per un servizio. 22 per collegarsi a distanza, 80 e 443 per il web…\n`scan gft-west.ctg6` le prova tutte. Fa rumore: una volta sola, e non sul relè di Kassandra.'],
      d: function (e, x) { return x.v['scan:gft-west.ctg6']; } },
    { q: { q: ['Le port 8088, « mironen-gate », est **filtré**. Qu\'est-ce que ça veut dire ?', 'Port 8088, "mironen-gate", is **filtered**. What does that mean?', 'La porta 8088, «mironen-gate», è **filtrata**. Cosa vuol dire?'],
      a: [['Un pare-feu cache sa réponse', 'A firewall hides its answer', 'Un firewall nasconde la sua risposta'], ['Il est ouvert à tous', 'It is open to everyone', 'È aperta a tutti'], ['Il n\'existe pas', 'It does not exist', 'Non esiste']], r: 0,
      w: ['**Ouvert** : ça répond. **Fermé** : ça refuse. **Filtré** : silence, un pare-feu est devant. C\'est la porte de Jarek : on ne l\'ouvrira pas depuis l\'extérieur, mais de l\'intérieur.', '**Open**: it answers. **Closed**: it refuses. **Filtered**: silence, a firewall is in front. It is Jarek\'s gate: we will not open it from outside, but from inside.', '**Aperta**: risponde. **Chiusa**: rifiuta. **Filtrata**: silenzio, c\'è un firewall davanti. È la porta di Jarek: non la apriremo dall\'esterno, ma dall\'interno.'] } },
    { q: { q: ['Par quel port entrer pour se connecter à distance ?', 'Which port should we use to log in remotely?', 'Da quale porta entrare per collegarsi a distanza?'], a: ['`22` (ssh)', '`80` (http)', '`8088`'], r: 0,
      w: ['Le 22, ouvert, service ssh. Il demande une clé. Il va falloir en fabriquer une.', 'Port 22, open, ssh service. It requires a key. We will have to make one.', 'La 22, aperta, servizio ssh. Chiede una chiave. Dovremo fabbricarne una.'] } }
  ],
  outro: ['La carte s\'allume sur l\'écran de Kazimir : l\'aile ouest répond, l\'aile nord se tait, et la porte de Jarek attend derrière son pare-feu.\n\nNAOS-9 : *« Le port 22 accepte les clés. Pas les mots de passe : les clés. Demain, tu en fabriqueras une. Et tu apprendras pourquoi tu ne dois jamais me la donner. »*',
    'The map lights up on Kazimir\'s screen: the west wing answers, the north wing is silent, and Jarek\'s gate waits behind its firewall.\n\nNAOS-9: *"Port 22 accepts keys. Not passwords: keys. Tomorrow you will make one. And you will learn why you must never give it to me."*',
    'La mappa si accende sullo schermo di Kazimir: l\'ala ovest risponde, l\'ala nord tace, e la porta di Jarek aspetta dietro il suo firewall.\n\nNAOS-9: *«La porta 22 accetta le chiavi. Non le password: le chiavi. Domani ne fabbricherai una. E imparerai perché non devi mai darmela.»*']
});

/* ===================================================== MISSION 12 */
var PUB = 'ssh-ed25519 AAAAC3NzaC1lZDI1NTE5AAAAIJ8x4f2NAOSechoRouge7Kq1 agent@echo-rouge';
var PRIV = '-----BEGIN OPENSSH PRIVATE KEY-----\nb3BlbnNzaC1rZXktdjEAAAAABG5vbmUAAAAEbm9uZQAAAAAAAAABAAAAMwAAAAtzc2gtZW\nQyNTUxOQAAACCfMeH9jUDhJ4u3k8eQsAqR7y0hKXnEo4qL3d2c8v1uAAAAkO1v7aDtb+2g\n-----END OPENSSH PRIVATE KEY-----';
var WELCOME = ['GFT-WEST // COMPLEXE N°6\nAccès technicien. Toute action est journalisée.', 'GFT-WEST // COMPLEX NO. 6\nTechnician access. Every action is logged.', 'GFT-WEST // COMPLESSO N. 6\nAccesso tecnico. Ogni azione è registrata.'];
M.push({
  act: 3, host: 'relay.echo-rouge.org', cmds: ['ls', 'cd', 'cat', 'ssh-keygen', 'cp', 'ssh'], opts: ['-a', '.ssh', 'upload/', 'tech@gft-west.ctg6'],
  remote: { host: HOST, user: 'tech', home: '/home/tech', fs: { 'welcome.txt': WELCOME } },
  title: ['Deux clés', 'Two keys', 'Due chiavi'],
  brief: ['NAOS-9 // ARCHE // ÉCHO ROUGE\nLe port 22 de l\'aile ouest attend une clé. Pas un mot de passe : une **paire** de clés.\nJe peux installer la tienne sur la machine. Mais c\'est toi qui dois la fabriquer : je ne dois jamais connaître ta clé privée. Personne ne doit la connaître.',
    'NAOS-9 // ARK // ÉCHO ROUGE\nThe west wing\'s port 22 is waiting for a key. Not a password: a **pair** of keys.\nI can install yours on the machine. But you must make it yourself: I must never know your private key. Nobody must.',
    'NAOS-9 // ARCA // ÉCHO ROUGE\nLa porta 22 dell\'ala ovest aspetta una chiave. Non una password: una **coppia** di chiavi.\nPosso installare la tua sulla macchina. Ma devi fabbricarla tu: non devo mai conoscere la tua chiave privata. Nessuno deve conoscerla.'],
  fs: { '.ssh/': {}, 'upload/': {}, 'readme.txt': ['upload/ : dossier d\'envoi vers NAOS-9', 'upload/: outgoing folder to NAOS-9', 'upload/: cartella di invio verso NAOS-9'] },
  ext: {
    'ssh-keygen': function (a, s, x) {
      if (x.host === HOST) return err(x, ['ssh-keygen: fabrique tes clés chez toi, pas sur la machine ennemie', 'ssh-keygen: make your keys at home, not on the enemy machine', 'ssh-keygen: fabbrica le chiavi a casa tua, non sulla macchina nemica']);
      x.write('~/.ssh/id_agent', PRIV, 'rw-------'); x.write('~/.ssh/id_agent.pub', PUB, 'rw-r--r--'); x.v.keygen = 1;
      return { o: 'Generating public/private ed25519 key pair.\nYour identification has been saved in ~/.ssh/id_agent\nYour public key has been saved in ~/.ssh/id_agent.pub\nThe key fingerprint is: SHA256:8nQ+NAOS9/echoRouge0x88 agent@echo-rouge' };
    },
    ssh: sshExt
  },
  onEvent: function (e, x) {
    if (x.host !== HOST && x.exists('~/upload/id_agent')) {
      x.remove('~/upload/id_agent'); x.kass(30);
      x.say(['STOP ! Tu viens d\'envoyer ta clé **privée**. Je l\'ai détruite avant de la lire, mais Kassandra a vu passer quelque chose. Une clé privée ne quitte **jamais** ton ordinateur. Envoie la clé `.pub`.', 'STOP! You just sent your **private** key. I destroyed it before reading it, but Kassandra saw something go by. A private key **never** leaves your computer. Send the `.pub` key.', 'STOP! Hai appena inviato la tua chiave **privata**. L\'ho distrutta prima di leggerla, ma Kassandra ha visto passare qualcosa. Una chiave privata non lascia **mai** il tuo computer. Invia la chiave `.pub`.']);
    }
  },
  steps: [
    { o: ['Fabriquer une paire de clés', 'Make a key pair', 'Fabbricare una coppia di chiavi'], k: ['sshkeygen'],
      s: ['Écris `ssh-keygen` : la machine fabrique deux clés liées l\'une à l\'autre.', 'Type `ssh-keygen`: the machine makes two keys linked to each other.', 'Scrivi `ssh-keygen`: la macchina fabbrica due chiavi legate tra loro.'],
      d: function (e, x) { return x.v.keygen; } },
    { o: ['Trouver le dossier des clés', 'Find the keys folder', 'Trovare la cartella delle chiavi'],
      s: ['Les clés sont rangées dans `~/.ssh`. Tu ne le vois pas avec `ls` : souviens-toi de la mission 2. Affiche ton dossier personnel avec les fichiers cachés.', 'The keys are stored in `~/.ssh`. You cannot see it with `ls`: remember mission 2. Show your home folder including hidden files.', 'Le chiavi sono in `~/.ssh`. Non la vedi con `ls`: ricordati della missione 2. Mostra la tua cartella personale con i file nascosti.'],
      h: ['`ls -a`', '`ls -a`', '`ls -a`'],
      d: function (e, x) { return x.did['ls-a:' + x.home]; } },
    { o: ['Regarder dans .ssh', 'Look inside .ssh', 'Guardare dentro .ssh'],
      s: ['Regarde maintenant ce qu\'il y a dans `.ssh`.', 'Now look at what is inside `.ssh`.', 'Ora guarda cosa c\'è dentro `.ssh`.'], h: ['`ls .ssh`', '`ls .ssh`', '`ls .ssh`'],
      d: function (e, x) { return x.did['ls:' + x.home + '/.ssh']; } },
    { s: ['Deux fichiers, une seule paire. Imagine un **cadenas** et sa **clé** :\n• `id_agent.pub` (*public*) est un cadenas ouvert. Tu peux en distribuer à tout le monde : il ne sert qu\'à **fermer**.\n• `id_agent` est la seule clé qui **ouvre**. Elle reste dans ta poche, toujours.\nLa machine de l\'aile ouest installera ton cadenas ; quand tu te connecteras, ta clé prouvera que c\'est bien toi.', 'Two files, one pair. Picture a **padlock** and its **key**:\n• `id_agent.pub` (*public*) is an open padlock. You can hand them out to everyone: it can only **lock**.\n• `id_agent` is the only key that **opens**. It stays in your pocket, always.\nThe west wing machine will install your padlock; when you connect, your key will prove it is really you.', 'Due file, una sola coppia. Immagina un **lucchetto** e la sua **chiave**:\n• `id_agent.pub` (*public*) è un lucchetto aperto. Puoi distribuirne a tutti: serve solo a **chiudere**.\n• `id_agent` è l\'unica chiave che **apre**. Resta nella tua tasca, sempre.\nLa macchina dell\'ala ovest installerà il tuo lucchetto; quando ti collegherai, la tua chiave dimostrerà che sei proprio tu.'],
      k: ['asym'],
      q: { q: ['Laquelle peux-tu donner à NAOS-9 ?', 'Which one can you give to NAOS-9?', 'Quale puoi dare a NAOS-9?'], a: ['`id_agent`', '`id_agent.pub`', ['Les deux', 'Both', 'Entrambe']], r: 1,
        w: ['Le cadenas, jamais la clé.', 'The padlock, never the key.', 'Il lucchetto, mai la chiave.'] } },
    { o: ['Déposer la clé publique dans upload/', 'Put the public key in upload/', 'Mettere la chiave pubblica in upload/'], k: ['cp'],
      s: ['Copie ta clé publique dans le dossier d\'envoi. `cp` (*copy*) prend la source puis la destination : `cp .ssh/id_agent.pub upload/`', 'Copy your public key into the outgoing folder. `cp` (*copy*) takes the source then the destination: `cp .ssh/id_agent.pub upload/`', 'Copia la tua chiave pubblica nella cartella di invio. `cp` (*copy*) prende la sorgente e poi la destinazione: `cp .ssh/id_agent.pub upload/`'],
      d: function (e, x) { return x.exists('~/upload/id_agent.pub'); },
      ok: ['Reçu. J\'installe ton cadenas sur la machine de l\'aile ouest… c\'est fait.', 'Received. I am installing your padlock on the west wing machine… done.', 'Ricevuto. Installo il tuo lucchetto sulla macchina dell\'ala ovest… fatto.'] },
    { o: ['Se connecter à l\'aile ouest', 'Log in to the west wing', 'Collegarsi all\'ala ovest'], k: ['ssh'],
      s: ['Connecte-toi : `ssh` suivi de l\'utilisateur, d\'un `@` et de la machine : `ssh tech@gft-west.ctg6`', 'Connect: `ssh` followed by the user, an `@` and the machine: `ssh tech@gft-west.ctg6`', 'Collegati: `ssh` seguito dall\'utente, una `@` e la macchina: `ssh tech@gft-west.ctg6`'],
      d: function (e, x) { return x.v.ssh; },
      ok: ['Regarde ta ligne de commande : `tech@gft-west.ctg6`. Tu tapes maintenant **sur** la machine du Complexe n°6, à des centaines de kilomètres.', 'Look at your prompt: `tech@gft-west.ctg6`. You are now typing **on** the Complex No. 6 machine, hundreds of kilometres away.', 'Guarda la tua riga di comando: `tech@gft-west.ctg6`. Ora stai scrivendo **sulla** macchina del Complesso n. 6, a centinaia di chilometri.'] },
    { q: { q: ['Quelqu\'un te demande ta clé privée « pour t\'aider ». Que fais-tu ?', 'Someone asks for your private key "to help you". What do you do?', 'Qualcuno ti chiede la chiave privata «per aiutarti». Cosa fai?'], a: [['Je la donne, c\'est pour m\'aider', 'I give it, it is to help me', 'La do, è per aiutarmi'], ['Je refuse : une clé privée ne se partage jamais', 'I refuse: a private key is never shared', 'Rifiuto: una chiave privata non si condivide mai'], ['J\'en donne seulement la moitié', 'I give only half of it', 'Ne do solo metà']], r: 1,
      w: ['Jamais. Même pas à moi. C\'est pour ça que tu l\'as fabriquée toi-même.', 'Never. Not even to me. That is why you made it yourself.', 'Mai. Nemmeno a me. Per questo l\'hai fabbricata tu.'] } }
  ],
  outro: ['Tu es entré dans la machine de l\'aile ouest sans mot de passe, sans bruit, avec une clé que personne d\'autre ne possède.\n\nKazimir : *« On a un pied dans la porte. »*\nNAOS-9 : *« Pas encore. Sena vient d\'envoyer le plan d\'entrée. Il est arrivé deux fois. Et les deux versions ne disent pas la même chose. »*',
    'You got into the west wing machine with no password, no noise, with a key nobody else holds.\n\nKazimir: *"We have a foot in the door."*\nNAOS-9: *"Not yet. Sena just sent the entry plan. It arrived twice. And the two versions do not say the same thing."*',
    'Sei entrato nella macchina dell\'ala ovest senza password, senza rumore, con una chiave che nessun altro possiede.\n\nKazimir: *«Abbiamo un piede nella porta.»*\nNAOS-9: *«Non ancora. Sena ha appena mandato il piano d\'ingresso. È arrivato due volte. E le due versioni non dicono la stessa cosa.»*']
});

/* ===================================================== MISSION 13 */
var R2 = ['De : Sena\nÉquipe d\'extraction : entrée par l\'aile OUEST, porte 3, à 02:40.\nLes gardes changent à 02:45. Ne traînez pas.', 'From: Sena\nExtraction team: enter through the WEST wing, door 3, at 02:40.\nThe guards change at 02:45. Do not linger.', 'Da: Sena\nSquadra di estrazione: ingresso dall\'ala OVEST, porta 3, alle 02:40.\nLe guardie cambiano alle 02:45. Non attardatevi.'];
var R1 = ['De : Sena\nÉquipe d\'extraction : entrée par l\'aile NORD, porte 1, à 02:40.\nLes gardes changent à 02:45. Ne traînez pas.', 'From: Sena\nExtraction team: enter through the NORTH wing, door 1, at 02:40.\nThe guards change at 02:45. Do not linger.', 'Da: Sena\nSquadra di estrazione: ingresso dall\'ala NORD, porta 1, alle 02:40.\nLe guardie cambiano alle 02:45. Non attardatevi.'];
M.push({
  act: 3, host: 'relay.echo-rouge.org', cmds: ['ls', 'cd', 'cat', 'diff', 'sha256sum', 'confirm'],
  title: ['Interception', 'Interception', 'Intercettazione'],
  brief: ['NAOS-9 // ARCHE // ÉCHO ROUGE\nLe plan d\'entrée de Sena est arrivé par deux relais différents, dans inbox/.\nLes deux messages devraient être identiques. Ils ne le sont pas.\nL\'équipe d\'extraction part dans quelques minutes. Il faut lui dire lequel est le vrai.',
    'NAOS-9 // ARK // ÉCHO ROUGE\nSena\'s entry plan arrived through two different relays, in inbox/.\nBoth messages should be identical. They are not.\nThe extraction team leaves in a few minutes. We must tell them which one is real.',
    'NAOS-9 // ARCA // ÉCHO ROUGE\nIl piano d\'ingresso di Sena è arrivato da due relè diversi, in inbox/.\nI due messaggi dovrebbero essere identici. Non lo sono.\nLa squadra di estrazione parte tra pochi minuti. Bisogna dirle qual è quello vero.'],
  fs: {
    'inbox/msg_relay1.txt': R1, 'inbox/msg_relay2.txt': R2,
    'inbox/sena_fingerprint.txt': function (H) { return H.T(['// Sena Valkova — empreinte publiée du plan d\'entrée (sha256)\n', '// Sena Valkova — published fingerprint of the entry plan (sha256)\n', '// Sena Valkova — impronta pubblicata del piano d\'ingresso (sha256)\n']) + H.sha(H.T(R2)); }
  },
  ext: {
    confirm: function (a, s, x) {
      if (!a[0] || !x.exists(a[0])) return err(x, ['usage : confirm <fichier>', 'usage: confirm <file>', 'uso: confirm <file>']);
      if (/relay1/.test(a[0])) { x.kass(25); return err(x, ['confirm: l\'aile nord est un piège — l\'équipe a fait demi-tour de justesse', 'confirm: the north wing is a trap — the team turned back just in time', 'confirm: l\'ala nord è una trappola — la squadra ha fatto dietrofront appena in tempo']); }
      if (!/relay2/.test(a[0])) return err(x, ['confirm: ce n\'est pas un plan d\'entrée', 'confirm: this is not an entry plan', 'confirm: questo non è un piano d\'ingresso']);
      x.v.confirmed = 1; return { o: x.T(['Plan confirmé et transmis à l\'équipe : aile ouest, porte 3, 02:40.', 'Plan confirmed and sent to the team: west wing, door 3, 02:40.', 'Piano confermato e trasmesso alla squadra: ala ovest, porta 3, 02:40.']) };
    }
  },
  steps: [
    { o: ['Lire les deux messages', 'Read both messages', 'Leggere i due messaggi'],
      s: ['Lis les deux messages du dossier `inbox/`.', 'Read both messages in the `inbox/` folder.', 'Leggi i due messaggi della cartella `inbox/`.'],
      h: ['`cd inbox` puis `cat msg_relay1.txt msg_relay2.txt`', '`cd inbox` then `cat msg_relay1.txt msg_relay2.txt`', '`cd inbox` poi `cat msg_relay1.txt msg_relay2.txt`'],
      d: function (e, x) { return x.did['cat:msg_relay1.txt'] && x.did['cat:msg_relay2.txt']; } },
    { o: ['Trouver la différence', 'Find the difference', 'Trovare la differenza'],
      s: ['Ils se ressemblent beaucoup. Laisse la machine trouver la différence pour toi.', 'They look very alike. Let the machine find the difference for you.', 'Si somigliano molto. Lascia che la macchina trovi la differenza per te.'], h: ['`diff msg_relay1.txt msg_relay2.txt`', '`diff msg_relay1.txt msg_relay2.txt`', '`diff msg_relay1.txt msg_relay2.txt`'],
      d: function (e) { return e.name === 'diff' && /2c2/.test(e.out); },
      ok: ['Ligne 2 : NORD et porte 1 d\'un côté, OUEST et porte 3 de l\'autre. Quelqu\'un a modifié l\'un des deux en chemin.', 'Line 2: NORTH and door 1 on one side, WEST and door 3 on the other. Someone changed one of them on the way.', 'Riga 2: NORD e porta 1 da una parte, OVEST e porta 3 dall\'altra. Qualcuno ha modificato uno dei due lungo il percorso.'] },
    { o: ['Vérifier les empreintes', 'Check the fingerprints', 'Verificare le impronte'], k: ['mitm'],
      s: ['Quelqu\'un s\'est glissé **entre** Sena et nous, a lu le message et l\'a modifié avant de le renvoyer. C\'est l\'attaque de l\'**homme du milieu**.\nSena publie toujours l\'empreinte de ses plans. Calcule l\'empreinte des deux messages et compare-la à `sena_fingerprint.txt`. Tu connais les commandes.', 'Someone slipped **between** Sena and us, read the message and changed it before sending it on. That is the **man-in-the-middle** attack.\nSena always publishes the fingerprint of her plans. Compute the fingerprint of both messages and compare it with `sena_fingerprint.txt`. You know the commands.', 'Qualcuno si è infilato **tra** Sena e noi, ha letto il messaggio e l\'ha modificato prima di inoltrarlo. È l\'attacco dell\'**uomo nel mezzo**.\nSena pubblica sempre l\'impronta dei suoi piani. Calcola l\'impronta dei due messaggi e confrontala con `sena_fingerprint.txt`. Conosci i comandi.'],
      h: ['`sha256sum msg_relay1.txt msg_relay2.txt` puis `cat sena_fingerprint.txt`', '`sha256sum msg_relay1.txt msg_relay2.txt` then `cat sena_fingerprint.txt`', '`sha256sum msg_relay1.txt msg_relay2.txt` poi `cat sena_fingerprint.txt`'],
      d: function (e, x) { return x.did['sha256sum:msg_relay1.txt'] && x.did['sha256sum:msg_relay2.txt'] && x.did['cat:sena_fingerprint.txt']; } },
    { q: { q: ['Quel message est authentique ?', 'Which message is genuine?', 'Quale messaggio è autentico?'], a: ['`msg_relay1.txt`', '`msg_relay2.txt`', ['Impossible à savoir', 'Impossible to tell', 'Impossibile saperlo']], r: 1,
      w: ['`msg_relay2.txt` a la même empreinte que celle publiée par Sena. L\'autre envoyait l\'équipe dans l\'aile nord, celle qui ne répondait pas au ping : gardée, et sans doute piégée.', '`msg_relay2.txt` has the same fingerprint Sena published. The other one sent the team into the north wing, the one that did not answer the ping: guarded, and probably trapped.', '`msg_relay2.txt` ha la stessa impronta pubblicata da Sena. L\'altro mandava la squadra nell\'ala nord, quella che non rispondeva al ping: sorvegliata, e probabilmente una trappola.'] } },
    { o: ['Confirmer le bon plan', 'Confirm the right plan', 'Confermare il piano giusto'],
      s: ['Transmets le bon plan à l\'équipe : `confirm` suivi du fichier authentique.', 'Send the right plan to the team: `confirm` followed by the genuine file.', 'Trasmetti il piano giusto alla squadra: `confirm` seguito dal file autentico.'],
      d: function (e, x) { return x.v.confirmed; } },
    { q: { q: ['Comment se protéger de l\'homme du milieu ?', 'How do you protect yourself from a man in the middle?', 'Come ci si protegge dall\'uomo nel mezzo?'], a: [['Vérifier l\'empreinte ou la signature du message', 'Check the message\'s fingerprint or signature', 'Verificare l\'impronta o la firma del messaggio'], ['Lire le message deux fois', 'Read the message twice', 'Leggere il messaggio due volte'], ['Répondre plus vite', 'Reply faster', 'Rispondere più in fretta']], r: 0,
      w: ['Le cadenas de ton navigateur sur les sites en `https` fait exactement ça, des millions de fois par jour.', 'The padlock in your browser on `https` sites does exactly that, millions of times a day.', 'Il lucchetto del browser sui siti `https` fa esattamente questo, milioni di volte al giorno.'] } }
  ],
  outro: ['L\'équipe d\'extraction est en route vers la porte 3 de l\'aile ouest. Dans l\'aile nord, une dizaine de gardes d\'Aegis-CD attendent des visiteurs qui ne viendront pas.\n\nNAOS-9 : *« Kassandra sait maintenant que nous savons. Il ne reste plus qu\'une chose : la commande de Jarek. Elle est découpée en quatre morceaux, et je ne sais pas où ils sont. »*',
    'The extraction team is heading to door 3 of the west wing. In the north wing, a dozen Aegis-CD guards are waiting for visitors who will not come.\n\nNAOS-9: *"Kassandra now knows that we know. Only one thing is left: Jarek\'s command. It is cut into four pieces, and I do not know where they are."*',
    'La squadra di estrazione è diretta alla porta 3 dell\'ala ovest. Nell\'ala nord una decina di guardie di Aegis-CD aspettano visitatori che non arriveranno.\n\nNAOS-9: *«Ora Kassandra sa che noi sappiamo. Resta una sola cosa: il comando di Jarek. È diviso in quattro pezzi, e non so dove siano.»*']
});

/* ===================================================== MISSION 14 */
var FRAG = {
  1: 'exploit --port 88', 2: '--node <ID>', 3: '--sig MIRONEN-088',
  4: ['ID = CTG + numéro du complexe sur deux chiffres + tiret + code de la ville\nGdańsk = GDN · Prague = PRG · Zurich = ZRH', 'ID = CTG + complex number in two digits + dash + city code\nGdańsk = GDN · Prague = PRG · Zurich = ZRH', 'ID = CTG + numero del complesso a due cifre + trattino + codice della città\nDanzica (Gdańsk) = GDN · Praga = PRG · Zurigo = ZRH']
};
function frag(n) { return function (H) { return '[FRAGMENT ' + n + '/4 — PORTE 88]\n' + H.T(FRAG[n]); }; }
var NOISE = ['Jarek Mironen — journal de développement. Tests de synchronisation. Rien à signaler.', 'Jarek Mironen — development log. Synchronisation tests. Nothing to report.', 'Jarek Mironen — diario di sviluppo. Test di sincronizzazione. Niente da segnalare.'];
M.push({
  act: 3, host: 'naos9.arche', cmds: ['ls', 'cd', 'cat', 'find', 'assemble'], opts: ['-name', '"*88*"'],
  title: ['Les fragments', 'The fragments', 'I frammenti'],
  brief: ['NAOS-9 // ARCHE // ÉCHO ROUGE\nJarek a intégré 147 portes dans mon architecture. La commande de la porte n°88 est découpée en quatre fragments, cachés dans ses vieilles archives.\nPersonne ne possède le secret entier : c\'était voulu.\nCT Corp n\'a jamais su lire ces archives. Toi, tu sauras.',
    'NAOS-9 // ARK // ÉCHO ROUGE\nJarek built 147 gates into my architecture. The command for gate No. 88 is cut into four fragments, hidden in his old archives.\nNobody holds the whole secret: that was intended.\nCT Corp never managed to read these archives. You will.',
    'NAOS-9 // ARCA // ÉCHO ROUGE\nJarek ha integrato 147 porte nella mia architettura. Il comando della porta n. 88 è diviso in quattro frammenti, nascosti nei suoi vecchi archivi.\nNessuno possiede il segreto intero: era voluto.\nCT Corp non ha mai saputo leggere questi archivi. Tu saprai.'],
  fs: {
    'archives/2027/alpha/jm_alpha.log': NOISE, 'archives/2027/alpha/p88-1.log': frag(1), 'archives/2027/alpha/p87.log': NOISE,
    'archives/2027/beta/jm_beta.log': NOISE, 'archives/2027/beta/tests/p88-2.log': frag(2), 'archives/2027/beta/tests/p86.log': NOISE,
    'archives/2028/genesis/jm_genesis.log': NOISE, 'archives/2028/genesis/old/notes/p88-3.log': frag(3), 'archives/2028/genesis/old/p89.log': NOISE,
    'archives/2028/sigma/jm_sigma.log': NOISE, 'archives/2028/sigma/p88-4.log': frag(4), 'archives/2028/sigma/p90.log': NOISE
  },
  ext: {
    assemble: function (a, s, x) {
      var miss = [1, 2, 3, 4].filter(function (n) { return !x.did['cat:p88-' + n + '.log']; });
      if (miss.length) return err(x, ['assemble: fragments non lus : ' + miss.join(', '), 'assemble: unread fragments: ' + miss.join(', '), 'assemble: frammenti non letti: ' + miss.join(', ')]);
      x.v.assembled = 1; return { o: 'exploit --port 88 --node <ID> --sig MIRONEN-088\n\n' + x.T(FRAG[4]) };
    }
  },
  steps: [
    { o: ['Explorer les archives', 'Explore the archives', 'Esplorare gli archivi'],
      s: ['Regarde d\'abord le dossier `archives`.', 'First look at the `archives` folder.', 'Guarda prima la cartella `archives`.'], h: ['`ls archives`', '`ls archives`', '`ls archives`'],
      d: function (e, x) { return x.did['ls:' + x.home + '/archives']; },
      ok: ['Des années, des projets, des sous-dossiers dans des sous-dossiers… Les ouvrir un par un prendrait la nuit, et Kassandra monte.', 'Years, projects, folders within folders… Opening them one by one would take all night, and Kassandra is rising.', 'Anni, progetti, cartelle dentro cartelle… Aprirle una per una richiederebbe tutta la notte, e Kassandra sale.'] },
    { o: ['Trouver tous les fichiers « 88 »', 'Find every "88" file', 'Trovare tutti i file «88»'], k: ['find', 'glob'],
      s: ['`find` fouille un dossier **et tous ses sous-dossiers** d\'un coup. Avec `-name`, il ne garde que les noms qui correspondent à un modèle. L\'étoile `*` veut dire « n\'importe quels caractères » : `*88*` = tout nom qui contient 88.\n`find archives -name "*88*"`', '`find` searches a folder **and all its subfolders** at once. With `-name`, it keeps only names matching a pattern. The star `*` means "any characters": `*88*` = any name containing 88.\n`find archives -name "*88*"`', '`find` fruga una cartella **e tutte le sue sottocartelle** in un colpo. Con `-name` tiene solo i nomi che corrispondono a un modello. L\'asterisco `*` vuol dire «qualsiasi carattere»: `*88*` = qualsiasi nome che contiene 88.\n`find archives -name "*88*"`'],
      d: function (e) { return e.name === 'find' && /p88-1/.test(e.out) && /p88-4/.test(e.out); } },
    { o: ['Lire les quatre fragments', 'Read the four fragments', 'Leggere i quattro frammenti'],
      s: ['Quatre fichiers, quatre chemins. Lis-les avec `cat`. Tu peux copier un chemin depuis le résultat de `find` (ou le toucher sur mobile), et `cat` accepte plusieurs fichiers à la suite.', 'Four files, four paths. Read them with `cat`. You can copy a path from the `find` output (or tap it on mobile), and `cat` accepts several files in a row.', 'Quattro file, quattro percorsi. Leggili con `cat`. Puoi copiare un percorso dal risultato di `find` (o toccarlo sul cellulare), e `cat` accetta più file di seguito.'],
      h: ['`cat archives/2027/alpha/p88-1.log archives/2027/beta/tests/p88-2.log` … et ainsi de suite', '`cat archives/2027/alpha/p88-1.log archives/2027/beta/tests/p88-2.log` … and so on', '`cat archives/2027/alpha/p88-1.log archives/2027/beta/tests/p88-2.log` … e così via'],
      d: function (e, x) { return [1, 2, 3, 4].every(function (n) { return x.did['cat:p88-' + n + '.log']; }); } },
    { o: ['Assembler la commande', 'Assemble the command', 'Assemblare il comando'],
      s: ['Assemble-les : `assemble`', 'Put them together: `assemble`', 'Assemblali: `assemble`'],
      d: function (e, x) { return x.v.assembled; } },
    { q: { q: ['Selon le fragment 4, quel est l\'ID du nœud du **Complexe n°6 de Gdańsk** ?', 'According to fragment 4, what is the node ID of **Complex No. 6 in Gdańsk**?', 'Secondo il frammento 4, qual è l\'ID del nodo del **Complesso n. 6 di Danzica**?'], a: ['`CTG6-GDN`', '`CTG06-GDN`', '`GDN-06`'], r: 1,
      hint: ['Deux chiffres pour le numéro du complexe : 6 s\'écrit 06.', 'Two digits for the complex number: 6 is written 06.', 'Due cifre per il numero del complesso: 6 si scrive 06.'],
      w: ['CTG + 06 + - + GDN. La commande complète est : `exploit --port 88 --node CTG06-GDN --sig MIRONEN-088`.', 'CTG + 06 + - + GDN. The full command is: `exploit --port 88 --node CTG06-GDN --sig MIRONEN-088`.', 'CTG + 06 + - + GDN. Il comando completo è: `exploit --port 88 --node CTG06-GDN --sig MIRONEN-088`.'] } },
    { q: { q: ['Pourquoi Jarek a-t-il découpé la commande en quatre morceaux ?', 'Why did Jarek cut the command into four pieces?', 'Perché Jarek ha diviso il comando in quattro pezzi?'], a: [['Pour qu\'un seul fichier volé ne suffise pas', 'So that a single stolen file is not enough', 'Perché un solo file rubato non basti'], ['Pour gagner de la place', 'To save space', 'Per risparmiare spazio'], ['Par erreur', 'By mistake', 'Per errore']], r: 0, k: ['split'],
      w: ['C\'est le **secret réparti**. CT Corp a fouillé ces archives pendant des années sans jamais tout réunir.', 'That is a **split secret**. CT Corp searched these archives for years without ever putting it all together.', 'È il **segreto ripartito**. CT Corp ha frugato in questi archivi per anni senza mai riunire tutto.'] } }
  ],
  outro: ['La commande est complète :\n`exploit --port 88 --node CTG06-GDN --sig MIRONEN-088`\n\nNAOS-9 : *« Sept ans que CT Corp cherche ces morceaux. Tu les as trouvés en quelques minutes, parce que tu sais demander à la machine au lieu de fouiller à la main. Il ne reste qu\'à l\'exécuter, depuis l\'intérieur du Complexe n°6. »*',
    'The command is complete:\n`exploit --port 88 --node CTG06-GDN --sig MIRONEN-088`\n\nNAOS-9: *"Seven years CT Corp has been looking for these pieces. You found them in minutes, because you know how to ask the machine instead of digging by hand. All that is left is to run it, from inside Complex No. 6."*',
    'Il comando è completo:\n`exploit --port 88 --node CTG06-GDN --sig MIRONEN-088`\n\nNAOS-9: *«Sono sette anni che CT Corp cerca questi pezzi. Tu li hai trovati in pochi minuti, perché sai chiedere alla macchina invece di frugare a mano. Resta solo da eseguirlo, dall\'interno del Complesso n. 6.»*']
});

/* ===================================================== MISSION 15 */
var EXP = '#!/naos/gate\n# MIRONEN GATE 88 — GFT_SUSPEND (geographic)\nrequire signature MIRONEN-088\nsuspend generators --node $NODE --duration 180s --silent\n';
var EXP2 = '#!/naos/gate\n# MIRONEN GATE 88 — GFT_SUSPEND (geographic)\nrequire signature MIRONEN-088\nreport --to kassandra-relay.ctg6 --position $SOURCE\nsuspend generators --node $NODE --duration 180s --silent\n';
var ACC3 = []; (function () { var u = [['gft_ops', '10.6.0.5'], ['tech', '10.66.6.6'], ['monitor', '10.6.0.2'], ['gft_ops', '10.6.0.5'], ['backup', '10.6.0.7']]; for (var i = 0; i < 14; i++) { var w = (i === 9 || i === 12) ? u[1] : u[[0, 2, 3, 4][i % 4]]; ACC3.push('29.01.2035 02:' + (10 + i * 2) + ' ' + (i % 2 ? 'ACCESS' : 'LOGIN ') + ' ' + w[0] + ' from ' + w[1]); } })();
M.push({
  act: 3, star: 1, host: 'relay.echo-rouge.org', cmds: ['ls', 'cd', 'cat', 'ssh', 'sha256sum', 'load', 'exploit', 'grep', 'mv'], opts: ['tech@gft-west.ctg6', '-v', '>'],
  fs: { '.ssh/id_agent': { c: PRIV, mode: 'rw-------' }, '.ssh/id_agent.pub': PUB, 'upload/id_agent.pub': PUB },
  remote: { host: HOST, user: 'tech', home: '/home/tech', fs: {
    'welcome.txt': WELCOME, 'gates/exploit88.bin': EXP, 'gates/exploit88_v2.bin': EXP2,
    'gates/exploit88.sha': function (H) { return H.T(['// Jarek Mironen — empreinte de l\'exploit de la porte 88 (sha256)\n', '// Jarek Mironen — fingerprint of the gate 88 exploit (sha256)\n', '// Jarek Mironen — impronta dell\'exploit della porta 88 (sha256)\n']) + H.sha(EXP); },
    'logs/access.log': ACC3.join('\n') } },
  title: ['Porte-88', 'Gate 88', 'Porta 88'],
  brief: ['NAOS-9 // ARCHE // ÉCHO ROUGE\nCette nuit, tout ce que tu as appris sert en même temps.\nConnecte-toi à l\'aile ouest. Vérifie l\'exploit. Ouvre la porte n°88. Efface ton passage.\nKassandra monte en temps réel, et elle sait que nous sommes là. Je suis avec toi, {name}.',
    'NAOS-9 // ARK // ÉCHO ROUGE\nTonight, everything you have learned is needed at once.\nLog in to the west wing. Check the exploit. Open gate No. 88. Erase your trace.\nKassandra is rising in real time, and she knows we are here. I am with you, {name}.',
    'NAOS-9 // ARCA // ÉCHO ROUGE\nStanotte tutto ciò che hai imparato serve nello stesso momento.\nCollegati all\'ala ovest. Verifica l\'exploit. Apri la porta n. 88. Cancella il tuo passaggio.\nKassandra sale in tempo reale, e sa che siamo qui. Sono con te, {name}.'],
  ext: {
    ssh: sshExt,
    load: function (a, s, x) {
      if (x.host !== HOST) return err(x, ['load: connecte-toi d\'abord à ' + HOST, 'load: log in to ' + HOST + ' first', 'load: collegati prima a ' + HOST]);
      if (!a[0] || !x.exists(a[0])) return err(x, ['usage : load <fichier>', 'usage: load <file>', 'uso: load <file>']);
      if (/_v2/.test(a[0])) { x.kass(30); return err(x, ['load: ALERTE — cet exploit envoie ta position à kassandra-relay !', 'load: ALERT — this exploit sends your position to kassandra-relay!', 'load: ALLARME — questo exploit invia la tua posizione a kassandra-relay!']); }
      if (!/exploit88\.bin$/.test(a[0])) return err(x, ['load: ce fichier n\'est pas un exploit', 'load: this file is not an exploit', 'load: questo file non è un exploit']);
      x.v.loaded = 1; return { o: 'GATE 88 EXPLOIT LOADED — signature check pending' };
    },
    exploit: function (a, s, x) {
      if (!x.v.loaded) return err(x, ['exploit: aucun exploit chargé (load)', 'exploit: no exploit loaded (load)', 'exploit: nessun exploit caricato (load)']);
      var raw = a.join(' '), p = /--port\s+(\S+)/.exec(raw), n = /--node\s+(\S+)/.exec(raw), g = /--sig\s+(\S+)/.exec(raw);
      if (!p || !n || !g) return err(x, ['usage : exploit --port <n> --node <ID> --sig <signature>', 'usage: exploit --port <n> --node <ID> --sig <signature>', 'uso: exploit --port <n> --node <ID> --sig <firma>']);
      if (p[1] !== '88') { x.kass(10); return { e: 'exploit: gate ' + p[1] + ' refused' }; }
      if (n[1] !== 'CTG06-GDN') { x.kass(10); return { e: 'exploit: node ' + n[1] + ' unknown' }; }
      if (g[1] !== 'MIRONEN-088') { x.kass(15); return { e: 'exploit: invalid signature' }; }
      x.v.exploited = 1;
      return { o: 'Sending gate 88 exploit to CTG06-GDN…\nNAOS-9 // Mironen signature authenticated. Gate 88 open.\nGFT suspend — Gdańsk node — duration: 180 s (real time)\n✓ COMPLEX NO. 6 GFT SUSPENDED' };
    }
  },
  steps: [
    { o: ['Se connecter à l\'aile ouest', 'Log in to the west wing', 'Collegarsi all\'ala ovest'],
      s: ['Ta clé publique est déjà installée depuis la mission 12. Connecte-toi à l\'aile ouest.', 'Your public key has been installed since mission 12. Log in to the west wing.', 'La tua chiave pubblica è già installata dalla missione 12. Collegati all\'ala ovest.'],
      h: ['`ssh tech@gft-west.ctg6`', '`ssh tech@gft-west.ctg6`', '`ssh tech@gft-west.ctg6`'],
      d: function (e, x) { return x.v.ssh; } },
    { o: ['Vérifier les deux exploits', 'Check both exploits', 'Verificare i due exploit'],
      s: ['Dans `gates/`, deux versions de l\'exploit. L\'une a été piégée par Kassandra. Jarek a laissé l\'empreinte de la bonne dans `exploit88.sha`. Vérifie comme à la mission 5.', 'In `gates/` there are two versions of the exploit. One has been booby-trapped by Kassandra. Jarek left the right one\'s fingerprint in `exploit88.sha`. Check it as in mission 5.', 'In `gates/` ci sono due versioni dell\'exploit. Una è stata manomessa da Kassandra. Jarek ha lasciato l\'impronta di quella giusta in `exploit88.sha`. Verifica come nella missione 5.'],
      h: ['`cd gates`, `sha256sum exploit88.bin exploit88_v2.bin`, `cat exploit88.sha`', '`cd gates`, `sha256sum exploit88.bin exploit88_v2.bin`, `cat exploit88.sha`', '`cd gates`, `sha256sum exploit88.bin exploit88_v2.bin`, `cat exploit88.sha`'],
      d: function (e, x) { return x.did['sha256sum:exploit88.bin'] && x.did['sha256sum:exploit88_v2.bin'] && x.did['cat:exploit88.sha']; } },
    { q: { q: ['Quel exploit est celui de Jarek ?', 'Which exploit is Jarek\'s?', 'Quale exploit è quello di Jarek?'], a: ['`exploit88.bin`', '`exploit88_v2.bin`', ['Les deux', 'Both', 'Entrambi']], r: 0,
      w: ['`exploit88.bin`. Le « v2 » avait l\'air plus récent : c\'est justement ce qui devait te tromper. Tu peux comparer les deux avec `diff` : Kassandra a ajouté une ligne qui envoie ta position.', '`exploit88.bin`. The "v2" looked newer: that is exactly what was meant to fool you. You can compare them with `diff`: Kassandra added a line that sends your position.', '`exploit88.bin`. La «v2» sembrava più recente: è proprio ciò che doveva ingannarti. Puoi confrontarli con `diff`: Kassandra ha aggiunto una riga che invia la tua posizione.'] } },
    { o: ['Charger le bon exploit', 'Load the right exploit', 'Caricare l\'exploit giusto'],
      s: ['Charge-le : `load` suivi du fichier.', 'Load it: `load` followed by the file.', 'Caricalo: `load` seguito dal file.'], h: ['`load exploit88.bin`', '`load exploit88.bin`', '`load exploit88.bin`'],
      d: function (e, x) { return x.v.loaded; } },
    { o: ['Ouvrir la porte n°88', 'Open gate No. 88', 'Aprire la porta n. 88'],
      s: ['Écris la commande assemblée à la mission 14. Sans faute : chaque erreur fait sonner Kassandra.', 'Type the command you assembled in mission 14. No mistakes: every error makes Kassandra ring.', 'Scrivi il comando assemblato nella missione 14. Senza errori: ogni sbaglio fa suonare Kassandra.'],
      h: ['`exploit --port 88 --node CTG06-GDN --sig MIRONEN-088`', '`exploit --port 88 --node CTG06-GDN --sig MIRONEN-088`', '`exploit --port 88 --node CTG06-GDN --sig MIRONEN-088`'],
      d: function (e, x) { return x.v.exploited; },
      ok: ['…La porte s\'ouvre. Les générateurs de l\'aile ouest marquent une pause. 180 secondes. L\'équipe entre.', '…The gate opens. The west wing generators pause. 180 seconds. The team goes in.', '…La porta si apre. I generatori dell\'ala ovest si fermano. 180 secondi. La squadra entra.'] },
    { o: ['Effacer ton passage dans logs/access.log', 'Erase your visit from logs/access.log', 'Cancellare il tuo passaggio da logs/access.log'],
      s: ['Vite : ta connexion est écrite dans `~/logs/access.log` de cette machine, avec ton adresse `10.66.6.6`. Efface-la comme à la mission 4 : `grep -v` vers un nouveau fichier, puis `mv`.', 'Quick: your connection is written in this machine\'s `~/logs/access.log`, with your address `10.66.6.6`. Erase it as in mission 4: `grep -v` into a new file, then `mv`.', 'Presto: il tuo collegamento è scritto in `~/logs/access.log` di questa macchina, con il tuo indirizzo `10.66.6.6`. Cancellalo come nella missione 4: `grep -v` verso un nuovo file, poi `mv`.'],
      h: ['`cd ~/logs`, `grep -v 10.66.6.6 access.log > clean.log`, `mv clean.log access.log`', '`cd ~/logs`, `grep -v 10.66.6.6 access.log > clean.log`, `mv clean.log access.log`', '`cd ~/logs`, `grep -v 10.66.6.6 access.log > clean.log`, `mv clean.log access.log`'],
      d: function (e, x) { var c = x.fileIn('remote', 'logs/access.log'); return c != null && c.indexOf('10.66.6.6') < 0 && /gft_ops/.test(c); } },
    { s: ['Les générateurs repartent dans quelques secondes. Trois dernières questions, et je coupe Kassandra pour de bon.', 'The generators restart in a few seconds. Three last questions, and I cut Kassandra off for good.', 'I generatori ripartono tra pochi secondi. Tre ultime domande, e taglio fuori Kassandra per sempre.'],
      q: { q: ['Quelle commande montre les fichiers cachés ?', 'Which command shows hidden files?', 'Quale comando mostra i file nascosti?'], a: ['`ls -a`', '`cat -a`', '`cd -a`'], r: 0, w: ['', '', ''] } },
    { q: { q: ['Que fait le tuyau `|` ?', 'What does the pipe `|` do?', 'Cosa fa il tubo `|`?'], a: [['Il envoie le résultat d\'une commande dans la suivante', 'It sends one command\'s result into the next', 'Manda il risultato di un comando nel successivo'], ['Il efface un fichier', 'It deletes a file', 'Cancella un file'], ['Il coupe la connexion', 'It cuts the connection', 'Interrompe la connessione']], r: 0, w: ['', '', ''] } },
    { q: { q: ['Quelle clé ne doit **jamais** quitter ta poche ?', 'Which key must **never** leave your pocket?', 'Quale chiave non deve **mai** lasciare la tua tasca?'], a: [['La clé publique', 'The public key', 'La chiave pubblica'], ['La clé privée', 'The private key', 'La chiave privata'], ['Les deux', 'Both', 'Entrambe']], r: 1,
      w: ['Kassandra est coupée. Tu as réussi, {name}.', 'Kassandra is cut off. You did it, {name}.', 'Kassandra è tagliata fuori. Ce l\'hai fatta, {name}.'] } }
  ],
  outro: ['La porte n°88 s\'ouvre.\n\nDans le Complexe n°6 de Gdańsk, les **Générateurs de Flux Temporel** marquent une pause. Trois secondes. Dix secondes. Trente secondes de temps réel qui ressemblent à une éternité pour 2 400 consciences qui n\'ont plus été synchronisées depuis Ananké.\n\nLes portes des bulles s\'ouvrent. Pas toutes — juste assez. Les compressés les plus proches des sorties comprennent avant les gardes.\n\n*2 400 personnes libres.*\n\nNAOS-9 t\'a transmis un seul message après l\'exploit : **« Jarek avait raison. Quelqu\'un les a trouvées. »**',
    'Gate No. 88 opens.\n\nIn Gdańsk\'s Complex No. 6, the **Temporal Flux Generators** pause. Three seconds. Ten seconds. Thirty seconds of real time that feel like an eternity to 2,400 consciousnesses that have not been synchronized since Ananke.\n\nThe bubble doors open. Not all of them — just enough. The compressed nearest the exits understand before the guards do.\n\n*2,400 people free.*\n\nNAOS-9 transmitted a single message after the exploit: **"Jarek was right. Someone found them."**',
    'La porta n. 88 si apre.\n\nNel Complesso n. 6 di Danzica, i **Generatori di Flusso Temporale** si fermano. Tre secondi. Dieci secondi. Trenta secondi di tempo reale che sembrano un\'eternità per 2.400 coscienze che non vengono più sincronizzate da Ananke.\n\nLe porte delle bolle si aprono. Non tutte — quel tanto che basta. I compressi più vicini alle uscite capiscono prima delle guardie.\n\n*2.400 persone libere.*\n\nNAOS-9 ti ha trasmesso un solo messaggio dopo l\'exploit: **«Jarek aveva ragione. Qualcuno le ha trovate.»**']
});
})();
