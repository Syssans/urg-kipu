import type { Drug } from "./types";
import { DIJON_DILUTIONS_SOURCE } from "./sources";

export const sufentanil: Drug = {
  id: "sufentanil",
  dci: "Sufentanil",
  brands: ["Sufenta"],
  class: "Opioïde (analgésique morphinique de synthèse)",
  forms: ["Ampoule 50 µg/10 mL (5 µg/mL)"],
  dosage:
    "Entretien de sédation, adulte : 0,5 à 3 µg/kg/h au PSE, pur (5 µg/mL, seringue 50 mL).\n" +
    "Entretien de sédation, enfant : 0,2 à 0,5 µg/kg/h au PSE — 1 ampoule de 50 µg/10 mL + 40 mL NaCl 0,9 % (1 µg/mL, seringue 50 mL).",
  contraindications: [
    "Hypersensibilité aux morphiniques",
    "Détresse respiratoire en l'absence de ventilation assistée",
    "Association aux agonistes-antagonistes (nalbuphine, buprénorphine)",
  ],
  warning: "Incompatible avec le thiopental.",
  source: DIJON_DILUTIONS_SOURCE,
};
