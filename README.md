# Kipu

Aide-mémoire (web app / PWA) pour les professionnels de la médecine d'urgence : calculateurs de
scores cliniques, outils de conversion et de calcul, et à terme arbres décisionnels, réunis dans
une interface pensée pour un accès rapide au lit du patient.

**Statut : prototype à usage interne.** Voir l'avertissement dans l'app (page « À propos »).

## Stack technique

- [Vite](https://vitejs.dev/) + React + TypeScript
- [Tailwind CSS v4](https://tailwindcss.com/) (thème sombre)
- [react-router-dom](https://reactrouter.com/) (`HashRouter`, compatible hébergement statique simple)
- [vite-plugin-pwa](https://vite-pwa-org.netlify.app/) — app installable, fonctionne hors-ligne
  une fois chargée une première fois

## Développement

Ce dépôt n'assume pas que Node.js est installé globalement : un binaire portable est téléchargé
dans `.tools/node` (ignoré par git) lors du setup initial. Si vous avez déjà Node ≥ 20 installé
globalement, vous pouvez l'ignorer et utiliser directement `npm`.

```bash
npm install
npm run dev      # serveur de développement
npm run build    # build de production dans dist/
npm run preview  # prévisualiser le build
```

## Contenu actuel

### Calculateurs et interprétateurs (`src/lib/calculators/`)

26 outils reposant sur des critères publiés et largement utilisés en médecine d'urgence :

- **Scores** : Glasgow (GCS), NIHSS, qSOFA, CRB-65, Wells EP, score de Genève révisé simplifié,
  CHA₂DS₂-VASc, ABCD², sPESI, McIsaac, Canadian CT Head Rule, règles d'Ottawa (cheville/pied),
  ASIA (lésion médullaire), échelle de Cushman (sevrage alcoolique), Child-Pugh (cirrhose), NYHA
  (insuffisance cardiaque), mMRC (dyspnée).
- **Pédiatrie** : Glasgow pédiatrique, Apgar, Silverman-Andersen (détresse respiratoire
  néonatale).
- **Gériatrie** : GIR (grille AGGIR), ADL de Katz + IADL de Lawton (autonomie, sur une même page).
- **Interprétateurs biologiques** (catégorie « Biologie ») : gaz du sang (artériel/veineux,
  trouble acido-basique, compensation, trou anionique, delta ratio, oxygénation, lactate), LCR
  (orientation méningite bactérienne/virale), ionogramme urinaire (FENa/FEUrée, natriurèse),
  bilan de coagulation (étiologies d'une anomalie du TP/TCA, facteurs en cause).

Chaque calculateur est défini dans un fichier dédié avec : ses champs de saisie, sa fonction de
calcul, sa fonction d'interprétation et sa source bibliographique (affichée dans l'app). Pour
ajouter un score, créer un nouveau fichier sur ce modèle et l'enregistrer dans
`src/lib/calculators/index.ts`.

### Outils de conversion et de calcul (`src/lib/tools/`)

Onglet « Calcul » : conversions d'unités et formules courantes, indépendantes des scores cliniques
(pas de protocoles de service ici — ceux-ci varient trop selon pays/établissements pour être
codés en dur). Même moteur que les calculateurs (`Calculator`, `CalculatorForm`, `CalculatorPage`),
catégories dédiées `conversion` / `formule`. Actuellement : conversion glycémie (mmol/L ↔ g/L), QT
corrigé (formule de Bazett), IMC, clairance de la créatinine (Cockcroft-Gault), natrémie corrigée
(hyperglycémie), déficit hydrique (hypernatrémie), calcémie corrigée (albumine). Pour ajouter un
outil, créer un fichier sur le modèle de
`src/lib/tools/bmi.ts` et l'enregistrer dans `src/lib/tools/index.ts`.

### Arbres décisionnels (`src/lib/trees/`)

Onglet « Arbres » : arbres décisionnels basés sur des protocoles de service sourcés (pas de
contenu clinique inventé). Moteur dédié (`DecisionTree`, `TreeQuestion`/`TreeLeaf`/`TreeScore`),
rendu en cartes horizontales navigables et progressivement révélées
(`src/components/DecisionTreeView.tsx`). Un nœud `TreeScore` peut intégrer directement un
calculateur existant (`calculatorId`) : le score se calcule dans le fil de l'arbre et la branche
suivante est choisie selon des seuils définis sur le nœud. Les arbres sont indexés dans la
recherche globale au même titre que les scores et outils. Actuellement : dysnatrémie (hypo/hyper,
CHU Dijon-Bourgogne) ; crise convulsive et état de mal épileptique, adulte et enfant réunis dans un
même arbre avec l'âge du patient comme premier discriminant (CE-MIR pour l'adulte, CNPU pour
l'enfant).

## Icônes

Générées via `scripts/gen-icons.mjs` (nécessite le package `sharp`, déjà en devDependency).
Relancer avec `node scripts/gen-icons.mjs` après modification du design de l'icône.
