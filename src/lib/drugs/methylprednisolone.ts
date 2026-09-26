import type { Drug } from "./types";
import { DIJON_DILUTIONS_SOURCE } from "./sources";

export const methylprednisolone: Drug = {
  id: "methylprednisolone",
  dci: "Méthylprednisolone",
  brands: ["Solumédrol"],
  class: "Corticoïde",
  forms: ["Poudre pour solution injectable 40 mg et 120 mg (flacon)"],
  dosage:
    "Asthme, BPCO, laryngite, anaphylaxie : 1 à 2 mg/kg en IV lente.\n" +
    "Préparation : diluer le ou les flacons nécessaires avec du NaCl 0,9 % ou de l'EPPI (10 mg/mL, seringue 10 mL).",
  contraindications: [
    "État infectieux non contrôlé (hors indication spécifique nécessitant une corticothérapie)",
    "Allergie aux protéines de lait de vache (lactose présent dans certaines présentations)",
    "Hypersensibilité à la méthylprednisolone",
  ],
  source: DIJON_DILUTIONS_SOURCE,
};
