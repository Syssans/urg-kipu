import type { Drug } from "./types";
import { DIJON_DILUTIONS_SOURCE } from "./sources";

export const adenosineTriphosphate: Drug = {
  id: "adenosine-triphosphate",
  dci: "Adénosine triphosphate",
  brands: ["Striadyne"],
  aliases: ["Adénosine"],
  class: "Antiarythmique (bloqueur nodal transitoire)",
  forms: ["Ampoule 20 mg/2 mL"],
  dosage:
    "Tachycardie supraventriculaire, à titre diagnostique et thérapeutique : 1/2 à 1 ampoule (10 à 20 mg) en IVD, pure (seringue 2 mL).",
  contraindications: [
    "BAV de haut degré ou maladie de l'oreillette non appareillés",
    "Asthme, bronchospasme",
    "Syndrome du QT long",
    "Insuffisance coronarienne (prudence)",
  ],
  warning: "Prévoir une seringue d'atropine. Effets transitoires fréquents (flush, oppression thoracique, pause sinusale).",
  source: DIJON_DILUTIONS_SOURCE,
};
