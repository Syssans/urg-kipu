import type { Drug } from "./types";
import { DIJON_DILUTIONS_SOURCE } from "./sources";

export const ephedrine: Drug = {
  id: "ephedrine",
  dci: "Éphédrine",
  brands: [],
  class: "Sympathomimétique (vasopresseur)",
  forms: ["Ampoule 30 mg/1 mL"],
  dosage:
    "Hypotension iatrogène : 3 à 6 mg IVD, à répéter jusqu'à la PAM souhaitée.\n" +
    "_Préparation : 1 ampoule (30 mg) + 9 mL NaCl 0,9 % (3 mg/mL, seringue 10 mL)._",
  contraindications: ["Hypertension artérielle", "Insuffisance coronarienne", "Troubles du rythme"],
  source: DIJON_DILUTIONS_SOURCE,
};
