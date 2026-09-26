import type { Drug } from "./types";
import { DIJON_DILUTIONS_SOURCE } from "./sources";

export const furosemide: Drug = {
  id: "furosemide",
  dci: "Furosémide",
  brands: ["Lasilix"],
  class: "Diurétique de l'anse",
  forms: ["Ampoule 20 mg/2 mL (10 mg/mL)"],
  dosage: "OAP, poussée hypertensive : 1 mg/kg IVD, pur (10 mg/mL, seringue 10 mL).",
  contraindications: [
    "Hypovolémie, déshydratation",
    "Hypotension artérielle",
    "Anurie",
    "Hypokaliémie ou hyponatrémie sévère",
    "Hypersensibilité au furosémide ou aux sulfamides",
  ],
  source: DIJON_DILUTIONS_SOURCE,
};
