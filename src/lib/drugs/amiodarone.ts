import type { Drug } from "./types";
import { DIJON_DILUTIONS_SOURCE } from "./sources";

export const amiodarone: Drug = {
  id: "amiodarone",
  dci: "Amiodarone",
  brands: ["Cordarone"],
  class: "Antiarythmique de classe III",
  forms: ["Ampoule 150 mg/3 mL"],
  dosage:
    "Trouble du rythme supraventriculaire ou ventriculaire mal toléré, dose de charge : 5 mg/kg sur 20 à 30 min — 1 à 2 ampoules de 150 mg + G5 % QSP 20 mL (seringue 50 mL), au PSE à 60 mL/h.\n" +
    "Entretien : 10 à 20 mg/kg/24 h — 3 à 6 ampoules de 150 mg + G5 % QSP 48 mL (seringue 50 mL), au PSE à 2 mL/h.\n" +
    "ACR avec FV ou TV sans pouls : 300 mg IVD après le 3ᵉ choc électrique externe (5 mg/kg chez l'enfant).",
  contraindications: [
    "Bradycardie sinusale, bloc sino-auriculaire ou BAV non appareillés",
    "Dysthyroïdie (hyperthyroïdie)",
    "Hypotension sévère, collapsus",
    "Hypersensibilité à l'iode ou à l'amiodarone",
    "Association à un médicament pourvoyeur de torsades de pointes (hors urgence vitale)",
  ],
  warning: "Ne se dilue que dans du G5 % (incompatible avec le NaCl 0,9 %). Veinotoxique : préférer une voie veineuse centrale en administration prolongée.",
  source: DIJON_DILUTIONS_SOURCE,
};
