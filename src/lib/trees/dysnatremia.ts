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
    "Hyponatrémie : d'après manuel.cuen.fr/hyponatremie-hypernatremie (CUEN). Hypernatrémie : d'après le protocole de service SAU & SAMU du CHU Dijon-Bourgogne (Sept. 2025, réd. M. Houssait, Collège de Néphrologie 11ᵉ éd. 2024) — un exemple de protocole local, à confronter à celui en vigueur dans votre propre établissement.",
  notes:
    "Hyponatrémie : vitesse de correction ≤ 10 mmol/L les premières 24h (≤ 8 mmol/L la 2ᵉ 24h, ≤ 18 mmol/L/48h) — risque de myélinolyse centropontine si correction trop rapide. Hypernatrémie : surveiller diurèse et PA, contrôler l'ionogramme toutes les 6-8h ; objectif de baisse ≤ 2 mmol/L/h et ≤ 10-12 mmol/L/24h — risque d'œdème cérébral si correction trop rapide.",
};
