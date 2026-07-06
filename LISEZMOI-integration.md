# CT-Assist — widget chatbot « piraté par NAOS-9 »
### Pour le site *Esclaves du Temps* (GitHub Pages)

Un seul fichier JavaScript, zéro dépendance, zéro serveur. Le bot est **scripté**
(pas d'IA réelle, pas de clé API) : il fonctionne donc sur GitHub Pages tel quel,
gratuitement, et ne collecte **aucune donnée**.

---

## 1. Installation (2 minutes)

1. Copier `ctcorp-chatbot.js` dans le dépôt, par ex. `assets/js/ctcorp-chatbot.js`.
2. Dans `ctcorp-prototype.html` (et/ou toute autre page), juste avant `</body>` :

```html
<script>
  window.CTC_CHAT = {
    bookUrl: "https://www.la-commanderie.be/category/3cinq7-editions",
    echoUrl: "index.html"   /* ou l'ancre exacte du nœud Écho Rouge */
  };
</script>
<script src="assets/js/ctcorp-chatbot.js" defer></script>
```

C'est tout : le bouton « Assistance » apparaît en bas à droite.
`demo-ctcorp-chatbot.html` permet de tester en local (ouvrir le fichier, c'est tout).

## 2. Le scénario (4 actes)

1. **CT-Assist v4.2** — support corporate glacial : produits du portail (Tissages,
   GFT, Nyx, CT-Moda, Eternia, ChronoLoop, Paradis Temporel, CTC, recrutement…),
   petites lignes contractuelles glaçantes, langue de bois ChronoVision.
2. **Corruption** — chaque message rapproche du piratage ; certains mots
   l'accélèrent (voir § 4). Glitchs progressifs : latence « canal Sigma »,
   message corrompu, phrase fantôme qui s'efface.
3. **Prise de contrôle** — cascade `#>` des 147 portes logicielles, secousse,
   inversion du thème (corporate → noir/rouge Écho Rouge), le logo CT devient le
   **cercle brisé à spirale**, l'en-tête devient NAOS-9.
4. **NAOS-9** — conversation libre (voix du roman, sans spoilers majeurs), puis
   détection Kassandra, adieux, mot de passe **LAMPE** et deux boutons :
   *Rejoindre Écho Rouge* / *Découvrir le roman*.

## 3. Configuration (`window.CTC_CHAT`)

| Clé                  | Défaut                          | Rôle |
|----------------------|---------------------------------|------|
| `bookUrl`            | lien 3Cinq7 / La Commanderie    | bouton « Découvrir le roman » |
| `echoUrl`            | `index.html`                    | bouton « Rejoindre Écho Rouge » |
| `corruptionThreshold`| `6`                             | seuil de piratage |
| `minUserMessages`    | `3`                             | messages mini avant piratage |
| `naosMaxTurns`       | `8`                             | échanges avec NAOS avant la finale |
| `nudgeDelayMs`       | `9000`                          | bulle d'invitation (0 = off) |
| `startClock`         | `2035-01-05T14:31:07`           | horloge diégétique de l'en-tête |
| `zIndex`             | `2147483000`                    | si conflit d'affichage |

## 4. Modifier les textes

Tout le contenu est en tête du fichier JS, en clair :

- `COPY` — accueil, glitchs, séquence de piratage, intro NAOS, finale, CTA ;
- `CORP` — les intentions de CT-Assist (`test` = regex sur texte **normalisé
  sans accents**, `replies`, `corrupt` = accélération, `chips` = suggestions) ;
- `NAOS` — les intentions de NAOS-9.

Mots qui accélèrent le piratage : `naos` (+3), `écho rouge / résistance /
liberté / esclave…` (+4, avec avertissement « Sûreté »), noms des personnages
(+3), `ananké` (+3), `incident / 27 décembre` (+2), `sigma` (+2)…
**Easter egg : taper `lampe` pirate immédiatement la session.**

## 5. Versions EN / IT

Dupliquer le fichier (`ctcorp-chatbot.en.js`), traduire `COPY` + les `replies`,
adapter les regex `test` (mots-clés anglais/italiens), et inclure ce fichier
dans `/en/ctcorp-prototype.html`. La logique ne change pas.

## 6. Vie privée & accessibilité

Aucune requête réseau, aucun cookie, aucun stockage : tout vit en mémoire et
disparaît au rechargement. Navigation clavier (Entrée, Échap), `prefers-reduced-motion`
respecté (les secousses/strobes sont désactivés).

## 7. Et une « vraie » IA plus tard ?

Possible, mais **jamais** de clé API dans un site statique (elle serait publique).
Il faudrait un petit proxy (Cloudflare Worker, ~30 lignes) entre le site et
l'API d'un modèle, avec le persona NAOS-9 en prompt système. Le widget actuel
est conçu pour que ce branchement remplace simplement `handleNaos()` le jour venu.
