import type { Drug } from "./types";
import { DIJON_DILUTIONS_SOURCE } from "./sources";

export const flumazenil: Drug = {
  id: "flumazenil",
  dci: "Flumazénil",
  brands: ["Anexate"],
  class: "Antidote des benzodiazépines",
  forms: ["Ampoule 1 mg/10 mL (0,1 mg/mL)"],
  dosage:
    "Bolus IVD (pur, seringue 10 mL) : dose initiale de 0,2 mg puis 0,1 mg toutes les minutes jusqu'à 1 mg au maximum.\n" +
    "Entretien au PSE (seringue 50 mL) : 50 % de la dose totale initiale par heure (en mg/h).",
  contraindications: [
    "Hypersensibilité au flumazénil ou aux benzodiazépines",
    "Épileptique traité par benzodiazépines (risque de crise de sevrage)",
    "Intoxication mixte avec un antidépresseur tricyclique ou un autre proconvulsivant",
  ],
  warning: "Durée d'action plus courte que celle de nombreuses benzodiazépines : risque de resédation, surveillance prolongée.",
  source: DIJON_DILUTIONS_SOURCE,
};
