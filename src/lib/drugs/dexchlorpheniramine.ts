import type { Drug } from "./types";
import { DIJON_DILUTIONS_SOURCE } from "./sources";

export const dexchlorpheniramine: Drug = {
  id: "dexchlorpheniramine",
  dci: "Dexchlorphéniramine",
  brands: ["Polaramine"],
  class: "Antihistaminique H1",
  forms: ["Ampoule 5 mg/1 mL"],
  dosage:
    "Urticaire, réaction allergique : 1 ampoule (5 mg) en IV lente sur 1 min, pure (seringue 5 mL), à répéter au bout de 10 min si persistance.",
  contraindications: [
    "Glaucome à angle fermé",
    "Risque de rétention urinaire (adénome prostatique)",
    "Hypersensibilité aux antihistaminiques",
  ],
  source: DIJON_DILUTIONS_SOURCE,
};
