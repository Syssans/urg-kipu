# Urgence+

Aide-mémoire (web app / PWA) pour les professionnels de la médecine d'urgence : calculateurs de
scores cliniques, et à terme protocoles et arbres décisionnels, réunis dans une interface pensée
pour un accès rapide au lit du patient.

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

### Calculateurs de scores (`src/lib/calculators/`)

13 scores cliniques largement publiés et utilisés en médecine d'urgence : Glasgow (GCS), NIHSS,
qSOFA, CURB-65, Wells (EP et TVP), PERC, CHA₂DS₂-VASc, HAS-BLED, Centor/McIsaac, Canadian CT Head
Rule, règles d'Ottawa (cheville/pied), Glasgow-Blatchford.

Chaque calculateur est défini dans un fichier dédié avec : ses champs de saisie, sa fonction de
calcul, sa fonction d'interprétation et sa source bibliographique (affichée dans l'app). Pour
ajouter un score, créer un nouveau fichier sur ce modèle et l'enregistrer dans
`src/lib/calculators/index.ts`.

### Protocoles / Arbres décisionnels

Pages présentes dans la navigation mais marquées « Bientôt disponible » : ce contenu nécessite des
référentiels sourcés (SFMU, HAS, sociétés savantes...) qui n'ont pas encore été fournis. Ne pas
inventer de contenu clinique dans ces sections.

## Icônes

Générées via `scripts/gen-icons.mjs` (nécessite le package `sharp`, déjà en devDependency).
Relancer avec `node scripts/gen-icons.mjs` après modification du design de l'icône.
