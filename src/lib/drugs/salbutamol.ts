import type { Drug } from "./types";
import { DIJON_DILUTIONS_SOURCE } from "./sources";

export const salbutamol: Drug = {
  id: "salbutamol",
  dci: "Salbutamol",
  brands: ["Ventoline"],
  class: "Bêta-2 mimétique",
  forms: ["Ampoule 5 mg/5 mL (1 mg/mL)"],
  dosage:
    "Asthme aigu grave : 0,25 à 1,5 mg/h au PSE.\n" +
    "_Préparation : 1 ampoule de 5 mg/5 mL + 45 mL de NaCl 0,9 % (0,1 mg/mL, seringue 50 mL)._",
  contraindications: [
    "Hypersensibilité au salbutamol",
    "Hypokaliémie non corrigée, troubles du rythme (précaution majeure)",
    "Cardiopathie ischémique instable",
  ],
  warning: "Surveiller la kaliémie, la lactatémie et l'ECG (hypokaliémie, acidose lactique, tachycardie).",
  source: DIJON_DILUTIONS_SOURCE,
};
