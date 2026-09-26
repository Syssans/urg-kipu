import type { Drug } from "./types";
import { DIJON_DILUTIONS_SOURCE } from "./sources";

export const nalbuphine: Drug = {
  id: "nalbuphine",
  dci: "Nalbuphine",
  brands: ["Nubain"],
  class: "Analgésique opioïde agoniste-antagoniste",
  forms: ["Ampoule 20 mg/2 mL"],
  dosage:
    "Analgésie (EVA > 6, notamment chez la femme enceinte) : 0,20 mg/kg IVD, à renouveler si besoin toutes les 4 à 6 h.\n" +
    "_Préparation : 1 ampoule de 20 mg + 18 mL NaCl 0,9 % (1 mg/mL, seringue 20 mL)._",
  contraindications: [
    "Insuffisance respiratoire sévère",
    "Insuffisance hépatique sévère",
    "Hypersensibilité à la nalbuphine",
    "Association à un opioïde agoniste pur (risque d'antagonisme et de sevrage)",
  ],
  warning: "Effet agoniste-antagoniste : peut antagoniser un opioïde fort déjà administré.",
  source: DIJON_DILUTIONS_SOURCE,
};
