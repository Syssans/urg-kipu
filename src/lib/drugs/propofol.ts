import type { Drug } from "./types";
import { DIJON_DILUTIONS_SOURCE } from "./sources";

export const propofol: Drug = {
  id: "propofol",
  dci: "Propofol",
  brands: ["Diprivan"],
  class: "Anesthésique général intraveineux",
  forms: ["Ampoule 200 mg/20 mL (10 mg/mL)"],
  dosage: "Anesthésie générale de courte durée : 2,5 mg/kg IVD, pur (10 mg/mL, seringue 20 mL).",
  contraindications: [
    "Enfant de moins de 15 ans (protocole du service)",
    "Allergie à l'œuf, au soja ou à l'arachide",
    "Hypotension artérielle (effet hypotenseur induit)",
  ],
  source: DIJON_DILUTIONS_SOURCE,
};
