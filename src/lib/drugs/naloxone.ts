import type { Drug } from "./types";
import { DIJON_DILUTIONS_SOURCE } from "./sources";

export const naloxone: Drug = {
  id: "naloxone",
  dci: "Naloxone",
  brands: ["Narcan"],
  class: "Antagoniste des opioïdes",
  forms: ["Ampoule 0,4 mg/1 mL"],
  dosage:
    "Adulte, IVD : 0,04 mg (1 mL de la dilution) toutes les 15 secondes jusqu'à la réapparition d'une ventilation spontanée efficace, puis dose totale initiale répartie sur 1 h au PSE.\n" +
    "Préparation IVD : 1 ampoule de 0,4 mg + 9 mL NaCl 0,9 % (0,04 mg/mL, seringue 10 mL).\n" +
    "Préparation PSE : 5 ampoules de 0,4 mg + 45 mL NaCl 0,9 % (0,04 mg/mL, seringue 50 mL).\n" +
    "Enfant : bolus de 50 µg/kg IVD (1 mL/15 s, même dilution) puis relais de 10 µg/kg/h au PSE.",
  contraindications: ["Hypersensibilité à la naloxone"],
  warning:
    "Durée d'action plus courte que celle de nombreux opioïdes : risque de récidive de la dépression respiratoire, surveillance prolongée. Titrer les doses : un réveil brutal peut déclencher un syndrome de sevrage chez le patient dépendant.",
  source: DIJON_DILUTIONS_SOURCE,
};
