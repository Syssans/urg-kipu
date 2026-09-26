import type { Drug } from "./types";
import { DIJON_DILUTIONS_SOURCE } from "./sources";

export const atropine: Drug = {
  id: "atropine",
  dci: "Atropine",
  brands: [],
  class: "Anticholinergique",
  forms: ["Ampoule 0,5 mg/1 mL"],
  dosage:
    "Bradycardie sinusale, BAV, adulte : 1 mg IVD (2 ampoules de 0,5 mg pures, seringue 2 mL).\n" +
    "Enfant : 0,02 mg/kg IVD (minimum 0,1 mg, maximum 0,5 mg) — 1 ampoule (0,5 mg) + 4 mL NaCl 0,9 % (0,1 mg/mL, seringue 5 mL).",
  contraindications: [
    "Aucune contre-indication absolue dans une bradycardie menaçant le pronostic vital",
    "Glaucome à angle fermé",
    "Risque de rétention urinaire (adénome prostatique)",
  ],
  warning: "Une dose trop faible (< 0,1 mg) peut provoquer une bradycardie paradoxale.",
  notes: "La page source indique « 0,1 mg/kg » pour l'adulte, ce qui semble être une erreur : la dose retenue ici (1 mg) correspond à la préparation décrite (2 ampoules de 0,5 mg).",
  source: DIJON_DILUTIONS_SOURCE,
};
