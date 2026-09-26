import type { Drug } from "./types";
import { DIJON_DILUTIONS_SOURCE } from "./sources";

export const ketamine: Drug = {
  id: "ketamine",
  dci: "Kétamine",
  brands: ["Kétalar"],
  class: "Anesthésique général (antagoniste des récepteurs NMDA)",
  forms: ["Ampoule 250 mg/5 mL (50 mg/mL)"],
  dosage:
    "Induction : 2 à 3 mg/kg IV directe lente — 1 ampoule (250 mg) + 5 mL NaCl 0,9 % (25 mg/mL, seringue 10 mL).\n" +
    "Sédation procédurale : 0,5 mg/kg IV — 2 mL (100 mg) + 8 mL NaCl 0,9 % (10 mg/mL, seringue 10 mL).\n" +
    "Analgésie : 0,25 à 1 mg/kg IV, en titration (10 mg/mL).",
  contraindications: [
    "Hypertension artérielle sévère non contrôlée",
    "Insuffisance coronarienne sévère, cardiopathie décompensée",
    "Pré-éclampsie, éclampsie",
    "Hypersensibilité à la kétamine",
  ],
  warning: "Effets psychodysleptiques (hallucinations, agitation au réveil) : administrer dans un environnement calme.",
  source: DIJON_DILUTIONS_SOURCE,
};
