import type { Drug } from "./types";
import { DIJON_DILUTIONS_SOURCE } from "./sources";

export const loxapine: Drug = {
  id: "loxapine",
  dci: "Loxapine",
  brands: ["Loxapac"],
  class: "Neuroleptique (antipsychotique)",
  forms: ["Ampoule 50 mg/2 mL"],
  dosage:
    "Agitation, agressivité : 1 à 4 ampoules soit 50 à 200 mg en IM directe, non diluée.\n" +
    "Matériel : seringue de 10 mL + aiguille verte longue.",
  contraindications: [
    "Intoxication alcoolique aiguë (potentialisation de la sédation)",
    "Coma",
    "Allongement du QT, arythmie ventriculaire (ECG préalable)",
    "Glaucome à angle fermé, rétention urinaire",
    "Antécédent de syndrome malin des neuroleptiques",
  ],
  warning: "Faire un ECG avant l'administration (risque d'allongement du QT).",
  source: DIJON_DILUTIONS_SOURCE,
};
