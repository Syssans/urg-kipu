import type { Drug } from "./types";
import { DIJON_DILUTIONS_SOURCE } from "./sources";

export const gluconateCalcium: Drug = {
  id: "gluconate-calcium",
  dci: "Gluconate de calcium",
  brands: [],
  class: "Sel de calcium (protection membranaire dans l'hyperkaliémie)",
  forms: ["Ampoule 10 % soit 1 g/10 mL"],
  dosage:
    "Hyperkaliémie avec signes ECG : 1 ampoule (1 g), renouvelable, en IV lente sur 20 min.\n" +
    "Préparation : 1 ampoule dans une poche de 100 mL de NaCl 0,9 % (1 g/100 mL).",
  contraindications: [
    "Patient sous digoxine (risque de troubles du rythme)",
    "Hypercalcémie, hypercalciurie sévère",
  ],
  source: DIJON_DILUTIONS_SOURCE,
};
