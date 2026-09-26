import type { Drug } from "./types";
import { DIJON_DILUTIONS_SOURCE } from "./sources";

export const nicardipine: Drug = {
  id: "nicardipine",
  dci: "Nicardipine",
  brands: ["Loxen"],
  class: "Inhibiteur calcique (dihydropyridine)",
  forms: ["Ampoule 10 mg/10 mL (1 mg/mL)"],
  dosage:
    "Contrôle tensionnel (HTA sévère, dissection aortique, anévrisme, MAP) : sur VVC, 1 mg IVD toutes les 3 min, maximum 10 mg (pur, 1 mg/mL, seringue 50 mL).\n" +
    "Entretien : 1 mg/h au PSE sur VVP — 1 ampoule de 10 mg + 40 mL de G5 % (10 mg/50 mL soit 0,2 mg/mL, seringue 50 mL).",
  contraindications: [
    "Rétrécissement aortique serré",
    "Infarctus du myocarde récent, angor instable",
    "Insuffisance cardiaque non contrôlée",
    "Hypersensibilité à la nicardipine",
  ],
  source: DIJON_DILUTIONS_SOURCE,
};
