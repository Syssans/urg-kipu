import type { DecisionTree } from "./types";

export const dysnatremia: DecisionTree = {
  id: "dysnatremie",
  name: "Diagnostic d'une dysnatrémie",
  shortName: "Dysnatrémie",
  summary: "Diagnostic et prise en charge d'une dysnatrémie, à partir des protocoles de service SAU & SAMU du CHU Dijon-Bourgogne.",
  rootId: "natremie",
  nodes: {
    natremie: {
      type: "question",
      id: "natremie",
      title: "Natrémie ?",
      options: [
        { label: "Hyponatrémie (< 135 mmol/L)", next: "hypo-severite" },
        { label: "Hypernatrémie (> 145 mmol/L)", next: "hyper-volemie" },
      ],
    },

    "hypo-severite": {
      type: "question",
      id: "hypo-severite",
      title: "Sévère et symptomatique ?",
      subtitle: "Sévère : Na < 120 mmol/L. Symptômes : confusion, nausées/vomissements, instabilité hémodynamique, troubles de la vigilance, convulsions.",
      detail: "Avant correction : ionogramme urinaire (Na, K, glycémie, urée). Éliminer une fausse hyponatrémie (hyperprotidémie, hyperglycémie majeure, hyperlipidémie, mannitol, intoxication éthanol) — osmolarité plasmatique ≈ Na × 2 + glycémie.",
      link: { label: "Calculer la natrémie corrigée (hyperglycémie)", to: "/calcul/natremie-corrigee" },
      options: [
        { label: "Oui — sévère ET symptomatique", next: "leaf-hypo-urgence" },
        { label: "Non", next: "hypo-volemie" },
      ],
    },
    "leaf-hypo-urgence": {
      type: "leaf",
      id: "leaf-hypo-urgence",
      title: "Sérum salé hypertonique 3 %",
      items: [
        "150 mL sur 20 min, renouvelable jusqu'à 2 fois",
        "Objectif : correction initiale de 5 mmol/L (2 mmol/L/h) jusqu'à disparition des signes, puis relais par NaCl 0,9 %",
        "Prise en charge spécifique des défaillances (convulsions...)",
      ],
      warning: "Avis néphrologique et réanimation en urgence.",
      detail: "Préparation de 500 mL de NaCl 3 % (15 g/500 mL, soit 513 mmol/L) : remplacer 55 mL d'un flacon de 500 mL de NaCl 0,9 % par 5,5 ampoules de NaCl 20 %.",
    },

    "hypo-volemie": {
      type: "question",
      id: "hypo-volemie",
      title: "Statut volémique clinique ?",
      subtitle: "Évaluation du secteur extracellulaire (clinique)",
      detail: "Vitesse de correction : < 1-2 mmol/L/h les 3-4 premières heures, max 10 mmol/L/j les premières 24h puis 8 mmol/L/j (< 6 mmol/L/j si hyponatrémie chronique). Surveillance natrémie toutes les 4-6h. Si correction trop rapide : G5 %.",
      warning: "Risque de myélinolyse centropontine si correction trop rapide.",
      options: [
        { label: "Déshydratation extracellulaire (perte de poids, hypovolémie)", next: "leaf-hypo-dec" },
        { label: "Secteur extracellulaire normal", next: "leaf-hypo-normal" },
        { label: "Hyperhydratation extracellulaire (OMI, HTA, épanchements)", next: "leaf-hypo-hec" },
      ],
    },
    "leaf-hypo-dec": {
      type: "leaf",
      id: "leaf-hypo-dec",
      title: "Déshydratation extracellulaire (perte de Na)",
      items: ["Pertes digestives", "Diurétiques", "Néphropathies", "Brûlures", "Insuffisance surrénalienne aiguë"],
      treatment: ["NaCl (ex. 500 mL sur 6-8h)", "Arrêt des diurétiques"],
      warning: "Correction rapide possible malgré des apports faibles : surveiller.",
    },
    "leaf-hypo-normal": {
      type: "leaf",
      id: "leaf-hypo-normal",
      title: "Secteur extracellulaire normal",
      items: ["Pas assez d'excrétion d'eau : SIADH, insuffisance surrénalienne chronique, hypothyroïdie", "Trop d'apport : potomanie"],
      treatment: ["Restriction hydrique seule (500-700 mL/j, jusqu'à 1000-1200 mL/j si patient âgé/fragile asymptomatique)", "Arrêt des traitements imputables si possible (neuroleptiques, ISRS, AINS, métoclopramide, IPP...)"],
    },
    "leaf-hypo-hec": {
      type: "leaf",
      id: "leaf-hypo-hec",
      title: "Hyperhydratation extracellulaire (excès de Na)",
      items: ["Hypovolémie efficace : insuffisance cardiaque, cirrhose, syndrome néphrotique, insuffisance rénale chronique"],
      treatment: ["Restriction hydrique (500-700 mL/j, 1000-1200 si âgé/fragile)", "Furosémide (ex. 40 mg/8h)", "Restriction sodée (< 6 g/j, idéal 2-4 g/j)"],
      warning: "Correction lente.",
    },

    "hyper-volemie": {
      type: "question",
      id: "hyper-volemie",
      title: "Statut volémique clinique ?",
      subtitle: "Na > 145 mmol/L = déshydratation intracellulaire",
      detail: "Bilan avant correction : NFS, iono sanguin complet, urée, créatininémie, glycémie, calcémie ionisée, iono urinaire (Na, K, glycosurie, créatininurie, urée).",
      warning: "Signes de gravité (somnolence, convulsions, coma, hématome sous-dural, thrombophlébite cérébrale) → avis néphrologique ± réanimation, prise en charge en soins continus.",
      links: [
        { label: "Calculer la natrémie corrigée (hyperglycémie)", to: "/calcul/natremie-corrigee" },
        { label: "Calculer le déficit hydrique", to: "/calcul/deficit-hydrique" },
      ],
      options: [
        { label: "Déshydratation extracellulaire (pli cutané, hypoTA, tachycardie)", next: "leaf-hyper-dec" },
        { label: "Secteur extracellulaire normal", next: "leaf-hyper-normal" },
        { label: "Hyperhydratation extracellulaire (œdèmes, HTA, prise de poids)", next: "leaf-hyper-hec" },
      ],
    },
    "leaf-hyper-dec": {
      type: "leaf",
      id: "leaf-hyper-dec",
      title: "Déshydratation extracellulaire",
      items: ["Pertes extra-rénales : diarrhées... (NaU < 10 mmol/L)", "Diurèse osmotique : hypercalcémie, diabète, mannitol (NaU > 20 mmol/L)"],
      treatment: ["NaCl hypotonique (sérum salé à 0,45 %, soit 4,5 ‰)", "Traiter la cause"],
      warning: "Toujours un manque d'apport ou une compensation insuffisante en cause — vérifier l'accès à l'eau du patient (personne âgée, nourrisson, trouble de la déglutition/conscience).",
    },
    "leaf-hyper-normal": {
      type: "leaf",
      id: "leaf-hyper-normal",
      title: "Secteur extracellulaire normal",
      items: ["Diabète insipide avec polyurie mal compensée (déficit en ADH, lithium...)", "Pertes insensibles : SNG en aspiration ++, diarrhée, brûlure"],
      treatment: ["Apport d'eau per os (ou glucosé à 2,5 %)", "Traiter la cause"],
    },
    "leaf-hyper-hec": {
      type: "leaf",
      id: "leaf-hyper-hec",
      title: "Hyperhydratation extracellulaire",
      items: ["Apports hypertoniques iatrogènes ++ : perfusion de NaCl ou de bicarbonates, alimentation parentérale"],
      treatment: ["Arrêt des perfusions en cause et réévaluation", "Éventuellement eau per os et régime hyposodé"],
      warning: "Pas de diurétiques.",
    },
  },
  source:
    "Protocoles de service SAU & SAMU du CHU Dijon-Bourgogne : hyponatrémie (16/03/2026, réd. Dr Maurey, val. Pr Ray, sources CUEN 2025 et SRLF 2020) ; hypernatrémie (Sept. 2025, réd. M. Houssait, val. Pr Ray, Collège de Néphrologie 11ᵉ éd. 2024) — des exemples de protocoles locaux, à confronter à celui en vigueur dans votre propre établissement.",
  notes:
    "Hypernatrémie : surveiller diurèse et PA, contrôler l'ionogramme toutes les 6-8h ; objectif de baisse ≤ 2 mmol/L/h et ≤ 10-12 mmol/L/24h — risque d'œdème cérébral si correction trop rapide.",
};
