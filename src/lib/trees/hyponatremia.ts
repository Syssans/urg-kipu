import type { DecisionTree } from "./types";

export const hyponatremia: DecisionTree = {
  id: "hyponatremie",
  name: "Diagnostic d'une hyponatrémie",
  shortName: "Hyponatrémie",
  summary: "Démarche diagnostique pas à pas devant une hyponatrémie, de l'osmolalité plasmatique à l'étiologie.",
  rootId: "osmolalite-plasmatique",
  nodes: {
    "osmolalite-plasmatique": {
      type: "question",
      id: "osmolalite-plasmatique",
      title: "Mesurer l'osmolalité plasmatique",
      options: [
        { label: "Normale (285 ± 5 mOsm/kg)", next: "leaf-isotonique" },
        { label: "Basse (< 275 mOsm/kg)", next: "osmolalite-urinaire" },
        { label: "Élevée (> 300 mOsm/kg)", next: "leaf-hypertonique" },
      ],
    },
    "osmolalite-urinaire": {
      type: "question",
      id: "osmolalite-urinaire",
      title: "Osmolalité urinaire ?",
      subtitle: "Hyponatrémie hypotonique",
      options: [
        { label: "≤ 100 mOsm/kg H₂O", next: "leaf-polydipsie" },
        { label: "> 100 mOsm/kg H₂O", next: "compartiment-ec" },
      ],
    },
    "compartiment-ec": {
      type: "question",
      id: "compartiment-ec",
      title: "Évaluer le compartiment extracellulaire",
      subtitle: "Clinique + natriurèse (NaU)",
      options: [
        { label: "Diminué (déficit en Na > eau)", next: "natriurese-diminue" },
        { label: "Normal (excès d'eau)", next: "leaf-normal" },
        { label: "Augmenté (excès d'eau > Na)", next: "leaf-augmente" },
      ],
    },
    "natriurese-diminue": {
      type: "question",
      id: "natriurese-diminue",
      title: "Natriurèse (NaU) ?",
      subtitle: "Compartiment extracellulaire diminué",
      options: [
        { label: "NaU ≤ 30 mmol/L", next: "leaf-pertes-extrarenales" },
        { label: "NaU > 30 mmol/L", next: "leaf-pertes-renales" },
      ],
    },
    "leaf-isotonique": {
      type: "leaf",
      id: "leaf-isotonique",
      title: "Hyponatrémie isotonique",
      items: ["Hyperlipidémie", "Hyperprotidémie"],
      detail: "Fausse hyponatrémie (erreur de mesure) : la natrémie réelle est normale.",
    },
    "leaf-hypertonique": {
      type: "leaf",
      id: "leaf-hypertonique",
      title: "Hyponatrémie hypertonique",
      items: ["Hyperglycémie", "Solutés hyperosmolaires (Mannitol...)"],
      detail: "Un soluté osmotiquement actif attire l'eau vers le secteur extracellulaire et dilue le sodium.",
    },
    "leaf-polydipsie": {
      type: "leaf",
      id: "leaf-polydipsie",
      title: "Polydipsie / apports faibles en solutés",
      items: ["Polydipsie primaire", "Apports faibles en solutés (« syndrome tea and toast »)"],
    },
    "leaf-pertes-extrarenales": {
      type: "leaf",
      id: "leaf-pertes-extrarenales",
      title: "Pertes extra-rénales",
      items: ["Pertes cutanées", "Pertes digestives", "3ᵉ secteur de fluides (brûlures, pancréatite...)"],
    },
    "leaf-pertes-renales": {
      type: "leaf",
      id: "leaf-pertes-renales",
      title: "Pertes rénales",
      items: ["Diurétiques", "Insuffisance surrénale", "CSW (cerebral salt wasting...)"],
    },
    "leaf-normal": {
      type: "leaf",
      id: "leaf-normal",
      title: "Excès d'eau à volémie normale",
      items: ["SIADH", "Hypothyroïdie", "Hypocortisolisme"],
      detail: "Diagnostic classiquement retenu avec NaU > 30 mmol/L.",
    },
    "leaf-augmente": {
      type: "leaf",
      id: "leaf-augmente",
      title: "Excès d'eau > excès de Na",
      items: ["Insuffisance cardiaque", "Cirrhose hépatique", "Syndrome néphrotique", "Insuffisance rénale"],
      detail: "± Hypovolémie efficace, NaU < 30 mmol/L.",
    },
  },
  source: "D'après CUEN 2020 et Spasovski G et al., Clinical practice guideline on diagnosis and treatment of hyponatraemia, Nephrol Dial Transplant 2014;29(S.2):i1–39.",
  notes: "Ne prend pas en compte l'hypernatrémie ni la vitesse de correction (risque de myélinolyse centropontine si correction trop rapide d'une hyponatrémie chronique).",
};
