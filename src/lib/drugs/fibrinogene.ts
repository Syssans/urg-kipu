import type { Drug } from "./types";
import { DIJON_DILUTIONS_SOURCE } from "./sources";

export const fibrinogene: Drug = {
  id: "fibrinogene",
  dci: "Fibrinogène humain",
  brands: ["Clottafact"],
  aliases: ["Fibrinogène"],
  class: "Facteur de coagulation (dérivé du plasma)",
  forms: ["Poudre 1,5 g avec solvant (100 mL)"],
  dosage:
    "Choc hémorragique : 1,5 à 3 g en IV lente (environ 10 min), voie intraveineuse exclusive.\n" +
    "_Reconstitution : amener poudre et solvant à température ambiante, désinfecter les bouchons, transférer le solvant dans le flacon de poudre, faire tourner doucement jusqu'à dissolution complète sans agiter (solution limpide à légèrement opalescente)._",
  contraindications: ["Hypersensibilité au fibrinogène humain ou aux excipients"],
  warning: "Surveillance clinique et biologique. Risque thrombo-embolique.",
  source: DIJON_DILUTIONS_SOURCE,
};
