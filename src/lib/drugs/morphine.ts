import type { Drug } from "./types";
import { DIJON_DILUTIONS_SOURCE } from "./sources";

export const morphine: Drug = {
  id: "morphine",
  dci: "Morphine",
  brands: [],
  class: "Analgésique opioïde (palier III)",
  forms: ["Ampoule 10 mg/1 mL"],
  dosage:
    "Adulte : 1 à 3 mg IVD toutes les 10 min environ, jusqu'à une EVA < 5.\n" +
    "Enfant : 0,05 à 0,1 mg/kg IVD, puis bolus de 0,01 à 0,05 mg/kg toutes les 5 à 7 min.\n" +
    "Préparation : 1 ampoule (10 mg) + 9 mL NaCl 0,9 % (1 mg/mL, seringue 10 mL).",
  contraindications: [
    "Détresse respiratoire, insuffisance respiratoire décompensée",
    "Insuffisance hépatique sévère",
    "Hypersensibilité à la morphine",
    "Association à un agoniste-antagoniste (nalbuphine, buprénorphine)",
  ],
  source: DIJON_DILUTIONS_SOURCE,
};
