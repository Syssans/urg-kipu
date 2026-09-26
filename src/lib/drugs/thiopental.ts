import type { Drug } from "./types";
import { DIJON_DILUTIONS_SOURCE } from "./sources";

export const thiopental: Drug = {
  id: "thiopental",
  dci: "Thiopental",
  brands: [],
  class: "Barbiturique (anesthésique intraveineux)",
  forms: ["Poudre pour solution injectable 500 mg (flacon)"],
  dosage:
    "Induction (état de mal épileptique résistant) : 2 à 5 mg/kg en IV lente sur 30 à 60 s — _1 flacon de 500 mg dans 20 mL de NaCl 0,9 % ou d'eau PPI (25 mg/mL)_.\n" +
    "Entretien (état de mal résistant) : 3 à 5 mg/kg/h au PSE — _1 flacon de 500 mg dans 50 mL de NaCl 0,9 % (10 mg/mL, seringue 50 mL)_.\n" +
    "Pratique de la SAUV : _3 flacons (1 500 mg) pour 60 mL (25 mg/mL)_ au PSE.",
  contraindications: [
    "Porphyrie",
    "Allergie aux barbituriques",
    "Hypotension, état de choc non corrigé (précaution majeure)",
  ],
  warning: "Incompatible avec le sufentanil.",
  source: DIJON_DILUTIONS_SOURCE,
};
