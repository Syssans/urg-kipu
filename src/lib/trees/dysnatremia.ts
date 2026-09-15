import type { DecisionTree } from "./types";

export const dysnatremia: DecisionTree = {
  id: "dysnatremie",
  name: "Diagnostic d'une dysnatrémie",
  shortName: "Dysnatrémie",
  summary: "Orientation étiologique en 2 clics à partir de ce qu'on a déjà au lit du patient : natrémie et examen clinique.",
  rootId: "natremie",
  nodes: {
    natremie: {
      type: "question",
      id: "natremie",
      title: "Natrémie ?",
      options: [
        { label: "Hyponatrémie (< 135 mmol/L)", next: "hypo-volemie" },
        { label: "Hypernatrémie (> 145 mmol/L)", next: "hyper-volemie" },
      ],
    },

    "hypo-volemie": {
      type: "question",
      id: "hypo-volemie",
      title: "Statut volémique clinique ?",
      subtitle: "Pli cutané, TA/FC, œdèmes — pas besoin d'osmolalité",
      detail: "Glycémie élevée ? Corrige la natrémie sans osmolalité :",
      link: { label: "Calculer la natrémie corrigée", to: "/calcul/natremie-corrigee" },
      options: [
        { label: "Hypovolémie (hypoTA, tachycardie, pli cutané)", next: "leaf-hypo-hypovolemie" },
        { label: "Euvolémie", next: "leaf-hypo-siadh" },
        { label: "Hypervolémie (œdèmes, prise de poids)", next: "leaf-hypo-hypervolemie" },
      ],
    },
    "leaf-hypo-hypovolemie": {
      type: "leaf",
      id: "leaf-hypo-hypovolemie",
      title: "Hyponatrémie hypovolémique",
      items: ["Pertes digestives", "Pertes cutanées", "Diurétiques", "Insuffisance surrénale"],
      detail: "Si natriurèse disponible : NaU < 30 mmol/L en faveur de pertes extra-rénales ; NaU > 30 en faveur de pertes rénales (diurétiques, insuffisance surrénale).",
    },
    "leaf-hypo-siadh": {
      type: "leaf",
      id: "leaf-hypo-siadh",
      title: "SIADH — 1ʳᵉ cause à évoquer",
      items: ["Atteinte du SNC (infection, AVC, traumatisme)", "Pathologie pulmonaire", "Postopératoire, douleur, nausée", "Médicaments (carbamazépine, ISRS, halopéridol)", "Néoplasie"],
      detail: "Alternative si polyurie + gros volumes bus ou apports alimentaires très pauvres : potomanie / apports osmolaires faibles (« tea and toast »).",
    },
    "leaf-hypo-hypervolemie": {
      type: "leaf",
      id: "leaf-hypo-hypervolemie",
      title: "Hyponatrémie hypervolémique",
      items: ["Insuffisance cardiaque", "Cirrhose hépatique", "Syndrome néphrotique", "Insuffisance rénale avancée"],
    },

    "hyper-volemie": {
      type: "question",
      id: "hyper-volemie",
      title: "Statut volémique clinique ?",
      subtitle: "Hypernatrémie = perte d'eau nette, toujours par défaut de soif ou d'accès à l'eau",
      options: [
        { label: "Déshydratation globale (EC + IC)", next: "leaf-hyper-globale" },
        { label: "Déshydratation intracellulaire isolée (EC normal)", next: "leaf-hyper-dic" },
        { label: "Hyperhydratation extracellulaire (excès de Na)", next: "leaf-hyper-hec" },
      ],
    },
    "leaf-hyper-globale": {
      type: "leaf",
      id: "leaf-hyper-globale",
      title: "Déshydratation globale",
      items: ["Pertes digestives (diarrhée)", "Pertes cutanées (brûlures, chaleur)", "Pertes respiratoires (hyperventilation, fièvre)", "Diurèse osmotique (hyperglycémie, mannitol)", "Diurétiques"],
      detail: "Si natriurèse disponible : NaU < 20 mmol/L en faveur de pertes extra-rénales ; NaU > 20 en faveur de pertes rénales (diurèse osmotique, diurétiques, insuffisance surrénale).",
    },
    "leaf-hyper-dic": {
      type: "leaf",
      id: "leaf-hyper-dic",
      title: "Déshydratation intracellulaire isolée",
      items: ["Diabète insipide central ou néphrogénique (polyurie, urines diluées)", "Pertes insensibles (fièvre, hyperventilation)", "Carence d'apport en eau (personne âgée, trouble de conscience, nourrisson)"],
      detail: "Diabète insipide : test de restriction hydrique puis épreuve à la desmopressine (réponse = central, absence de réponse = néphrogénique) — bilan spécialisé, pas en urgence immédiate sauf déshydratation sévère.",
    },
    "leaf-hyper-hec": {
      type: "leaf",
      id: "leaf-hyper-hec",
      title: "Excès de sodium",
      items: ["Apports iatrogènes de sérum salé hypertonique", "Bicarbonate de sodium hypertonique", "Hyperaldostéronisme"],
    },
  },
  source: "D'après manuel.cuen.fr/hyponatremie-hypernatremie (Collège Universitaire des Enseignants de Néphrologie), simplifié pour un usage rapide au lit du patient.",
  notes:
    "Hyponatrémie : vitesse de correction ≤ 10 mmol/L les premières 24h (≤ 8 mmol/L la 2ᵉ 24h, ≤ 18 mmol/L/48h) — risque de myélinolyse centropontine si correction trop rapide. Hypernatrémie chronique : ≤ 10 mmol/L/24h — risque d'œdème cérébral si correction trop rapide.",
};
