import type { Drug } from "./types";
import { DIJON_DILUTIONS_SOURCE } from "./sources";

export const etomidate: Drug = {
  id: "etomidate",
  dci: "Étomidate",
  brands: ["Hypnomidate"],
  class: "Hypnotique (anesthésique intraveineux)",
  forms: ["Ampoule 20 mg/10 mL (2 mg/mL)"],
  dosage: "Intubation en séquence rapide : 0,3 à 0,5 mg/kg IVD, _pur (préparer 2 ampoules en seringue de 20 mL)_.",
  contraindications: ["Comitialité (épilepsie)", "Hypersensibilité à l'étomidate"],
  warning: "Inhibition transitoire de la synthèse du cortisol (insuffisance surrénalienne relative), à garder en tête en cas de sepsis ou de choc septique.",
  source: DIJON_DILUTIONS_SOURCE,
};
