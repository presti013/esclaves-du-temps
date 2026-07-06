# CT-Assist / NAOS-9 — widget de chat diégétique (v2, trilingue)

Un seul fichier JavaScript, **zéro dépendance**, trois langues intégrées (**FR / EN / IT**).
Faux assistant corporate « CT-Assist v4.2 » qui se fait pirater par NAOS-9 au fil de la
conversation. Shadow DOM (aucun conflit CSS avec la page), aucune donnée envoyée ni
stockée (pas de cookies, pas de localStorage), `prefers-reduced-motion` respecté.

## 1. Intégration

À placer avant `</body>` de la page :

```html
<script>
  window.CTC_CHAT = {
    bookUrl: "https://www.la-commanderie.be/category/3cinq7-editions",
    echoUrl: "echo-rouge-v2.html",   // page du nœud Écho Rouge (chemin relatif)
    lang: "auto"                     // "fr" | "en" | "it" | "auto"
  };
</script>
<script src="assets/js/ctcorp-chatbot.js" defer></script>
```

**Mise à niveau depuis la v1 (FR seule)** : remplacer le contenu de
`assets/js/ctcorp-chatbot.js` par ce fichier suffit. Sans clé `lang`, le widget
reste en français — la page FR existante fonctionne sans aucune modification.

## 2. Configuration (`window.CTC_CHAT`, toutes les clés sont optionnelles)

| Clé | Défaut | Rôle |
|---|---|---|
| `bookUrl` | lien La Commanderie | bouton final « Découvrir le roman » (nouvel onglet) |
| `echoUrl` | `#` | bouton final « Rejoindre Écho Rouge » (même onglet) |
| `lang` | `"fr"` | `"fr"`, `"en"`, `"it"` ou `"auto"` (lit `<html lang>`, 2 premières lettres, repli `fr`) |
| `corruptionThreshold` | `6` | score de corruption déclenchant le piratage |
| `minUserMessages` | `3` | nombre minimal de messages utilisateur avant le piratage |
| `naosMaxTurns` | `8` | tours de conversation avec NAOS avant la séquence finale |
| `nudgeDelayMs` | `9000` | bulle d'invitation (0 = désactivée) |
| `startClock` | `"2035-01-05T14:31:07"` | horloge diégétique du bandeau |
| `zIndex` | `2147483000` | empilement du widget |

## 3. Langues

- Les trois langues vivent dans le même fichier : blocs `COPY_FR/EN/IT`,
  `CORP_FR/EN/IT`, `NAOS_FR/EN/IT` en tête de fichier — tout le texte y est
  éditable sans toucher au moteur.
- `lang: "auto"` choisit la langue d'après l'attribut `lang` de `<html>`
  (`en-US` → `en`). Si l'attribut manque ou vaut autre chose que fr/en/it,
  repli sur le français. En cas de doute, préférer un `lang` explicite par page.
- **Easter eggs** : taper `lampe` pirate immédiatement la session — `lamp` (EN)
  et `lampada` (IT) aussi. Le mot de passe final reste **LAMPE** dans les trois
  langues (premier mot de Kael, en français dans le roman ; NAOS le glose en
  dialogue : « Lamp, in his language » / « Lampada, nella sua lingua »).

## 4. Scénario (rappel)

1. **CT-Assist v4.2** : bot corporate satirique (produits, recrutement, contrat
   247 pages, CT-NET 2.0, CTC…).
2. **Corruption** : les sujets sensibles (NAOS, Écho Rouge, fugitifs, Ananké,
   incident du 27…) accélèrent la dégradation — glitchs, message corrompu,
   phrases parasites auto-effacées.
3. **Piratage** : cascade des 147 portes, bascule visuelle rouge/noir, avatar
   cercle brisé + spirale, l'en-tête devient NAOS-9.
4. **NAOS-9** : conversation scriptée (identité, vérité du 27, CT-NET 2.0,
   résister, Kael, Sena, rêve, peur…), puis détection Kassandra, adieux et carte
   finale : mot de passe **LAMPE** + boutons **Rejoindre Écho Rouge** / **Découvrir
   le roman**. Session « purgée », `↻` pour recommencer.

## 5. QA rapide

Ouvrir la page, cliquer « Assistance », taper `lampe` (ou `lamp` / `lampada`
selon la langue) → piratage ; poursuivre jusqu'à la carte finale → 2 boutons ;
`F5` → tout est réinitialisé ; console sans erreur ; avec
`prefers-reduced-motion`, pas de secousse ni de strobe.

## 6. Limites connues

- Réponses **scriptées** (aucun LLM, aucune clé API — volontaire pour un site
  statique GitHub Pages). Un vrai modèle pourra être branché plus tard via un
  proxy (Cloudflare Worker) en remplaçant la fonction `handleNaos()`.
- Un seul widget par page (id `ctc-chat-host`).
