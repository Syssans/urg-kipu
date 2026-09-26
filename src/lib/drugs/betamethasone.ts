import type { Drug } from "./types";
import { DIJON_DILUTIONS_SOURCE } from "./sources";

export const betamethasone: Drug = {
  id: "betamethasone",
  dci: "Bétaméthasone",
  brands: ["Célestène"],
  class: "Corticoïde",
  forms: ["Flacon de 1 mL contenant 4 mg", "Équivalence de la forme buvable : 1 mL = 0,5 mg = 40 gouttes"],
  dosage: "Laryngite : 0,1 à 0,3 mg/kg per os (10 à 30 gouttes/kg).",
  contraindications: [
    "État infectieux non contrôlé (hors indication spécifique nécessitant une corticothérapie)",
    "Hypersensibilité à la bétaméthasone",
  ],
  source: DIJON_DILUTIONS_SOURCE,
};
