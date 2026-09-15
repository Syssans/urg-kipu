import type { DecisionTree } from "./types";

export const dysnatremia: DecisionTree = {
  id: "dysnatremie",
  name: "Diagnostic d'une dysnatrémie",
  shortName: "Dysnatrémie",
  summary: "Démarche rapide devant une hypo- ou une hypernatrémie.",
  rootId: "natremie",
  nodes: {
    natremie: {
      type: "question",
      id: "natremie",
      title: "Natrémie ?",
      options: [
        { label: "Hyponatrémie (< 135 mmol/L)", next: "hypo-osmolalite" },
        { label: "Hypernatrémie (> 145 mmol/L)", next: "hyper-volemie" },
      ],
    },

    "hypo-osmolalite": {
      type: "question",
      id: "hypo-osmolalite",
      title: "Osmolalité plasmatique ?",
      subtitle: "Confirmer une hyponatrémie hypotonique vraie",
      options: [
        { label: "Normale ou élevée (> 280 mOsm/kg)", next: "leaf-hypo-fausse" },
        { label: "Basse (< 280 mOsm/kg)", next: "hypo-osmolalite-urinaire" },
      ],
    },
    "hypo-osmolalite-urinaire": {
      type: "question",
      id: "hypo-osmolalite-urinaire",
      title: "Osmolalité urinaire ?",
      subtitle: "Hyponatrémie hypotonique confirmée",
      options: [
        { label: "< 100 mOsm/kg", next: "leaf-hypo-polydipsie" },
        { label: "> 100 mOsm/kg", next: "hypo-volemie" },
      ],
    },
    "hypo-volemie": {
      type: "question",
      id: "hypo-volemie",
      title: "Statut volémique clinique ?",
      options: [
        { label: "Hypovolémie (hypoTA, tachycardie, pli cutané)", next: "leaf-hypo-hypovolemie" },
        { label: "Euvolémie", next: "leaf-hypo-siadh" },
        { label: "Hypervolémie (œdèmes, prise de poids)", next: "leaf-hypo-hypervolemie" },
      ],
    },

    "leaf-hypo-fausse": {
      type: "leaf",
      id: "leaf-hypo-fausse",
      title: "Hyponatrémie non hypotonique",
      items: ["Hyperprotidémie (fausse hyponatrémie)", "Hyperlipidémie (fausse hyponatrémie)", "Hyperglycémie", "Mannitol"],
      detail: "Hyperprotidémie/hyperlipidémie : erreur de mesure, natrémie réelle normale. Hyperglycémie/mannitol : attraction réelle d'eau vers le secteur extracellulaire.",
    },
    "leaf-hypo-polydipsie": {
      type: "leaf",
      id: "leaf-hypo-polydipsie",
      title: "Excrétion rénale d'eau adaptée",
      items: ["Potomanie (apports > 10 L/j)", "Apports osmolaires faibles (« tea and toast »)", "Reset osmostat (grossesse)"],
    },
    "leaf-hypo-hypovolemie": {
      type: "leaf",
      id: "leaf-hypo-hypovolemie",
      title: "Hyponatrémie hypovolémique",
      items: ["Pertes digestives", "Pertes cutanées", "Diurétiques", "Insuffisance surrénale"],
      detail: "Natriurèse généralement < 30 mmol/L, sauf prise de diurétiques ou insuffisance surrénale.",
    },
    "leaf-hypo-siadh": {
      type: "leaf",
      id: "leaf-hypo-siadh",
      title: "SIADH — cause la plus fréquente",
      items: ["Atteinte du SNC (infection, AVC, traumatisme)", "Pathologie pulmonaire", "Postopératoire", "Médicaments (carbamazépine, ISRS, halopéridol)", "Néoplasie", "Endocrinopathie"],
      detail: "À confirmer : natriurèse > 30 mmol/L, fonctions thyroïdienne et surrénalienne normales, uricémie souvent basse (< 240 µmol/L).",
    },
    "leaf-hypo-hypervolemie": {
      type: "leaf",
      id: "leaf-hypo-hypervolemie",
      title: "Hyponatrémie hypervolémique",
      items: ["Insuffisance cardiaque", "Cirrhose hépatique", "Syndrome néphrotique", "Insuffisance rénale avancée"],
      detail: "Excès d'eau et de sodium, avec excès d'eau supérieur à l'excès de sodium.",
    },

    "hyper-volemie": {
      type: "question",
      id: "hyper-volemie",
      title: "Statut volémique clinique ?",
      subtitle: "Hypernatrémie confirmée (> 145 mmol/L, osmolalité > 300 mOsm/kg)",
      options: [
        { label: "Déshydratation globale (extra- + intracellulaire)", next: "hyper-natriurese" },
        { label: "Déshydratation intracellulaire isolée", next: "leaf-hyper-dic" },
        { label: "Hyperhydratation extracellulaire (excès de Na)", next: "leaf-hyper-hec" },
      ],
    },
    "hyper-natriurese": {
      type: "question",
      id: "hyper-natriurese",
      title: "Natriurèse ?",
      subtitle: "Déshydratation globale",
      options: [
        { label: "< 20 mmol/L", next: "leaf-hyper-extrarenal" },
        { label: "> 20 mmol/L", next: "leaf-hyper-renal" },
      ],
    },

    "leaf-hyper-extrarenal": {
      type: "leaf",
      id: "leaf-hyper-extrarenal",
      title: "Pertes extra-rénales",
      items: ["Pertes digestives (diarrhée)", "Pertes cutanées (brûlures, chaleur)", "Pertes respiratoires (hyperventilation, fièvre)"],
    },
    "leaf-hyper-renal": {
      type: "leaf",
      id: "leaf-hyper-renal",
      title: "Pertes rénales",
      items: ["Diurèse osmotique (hyperglycémie, mannitol)", "Diurétiques", "Insuffisance surrénale"],
    },
    "leaf-hyper-dic": {
      type: "leaf",
      id: "leaf-hyper-dic",
      title: "Déshydratation intracellulaire isolée",
      items: ["Diabète insipide central ou néphrogénique (polyurie, urines diluées)", "Pertes insensibles (fièvre, hyperventilation)", "Carence d'apport en eau (personne âgée, trouble de conscience, nourrisson)"],
      detail: "Diabète insipide : test de restriction hydrique puis épreuve à la desmopressine (réponse = central, absence de réponse = néphrogénique).",
    },
    "leaf-hyper-hec": {
      type: "leaf",
      id: "leaf-hyper-hec",
      title: "Excès de sodium",
      items: ["Apports iatrogènes de sérum salé hypertonique", "Bicarbonate de sodium hypertonique", "Hyperaldostéronisme"],
    },
  },
  source: "D'après manuel.cuen.fr/hyponatremie-hypernatremie (Collège Universitaire des Enseignants de Néphrologie).",
  notes:
    "Hyponatrémie : vitesse de correction ≤ 10 mmol/L les premières 24h (≤ 8 mmol/L la 2ᵉ 24h, ≤ 18 mmol/L/48h) — risque de myélinolyse centropontine si correction trop rapide. Hypernatrémie chronique : ≤ 10 mmol/L/24h — risque d'œdème cérébral si correction trop rapide.",
};
