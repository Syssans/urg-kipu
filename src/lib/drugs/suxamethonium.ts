import type { Drug } from "./types";
import { DIJON_DILUTIONS_SOURCE } from "./sources";

export const suxamethonium: Drug = {
  id: "suxamethonium",
  dci: "Suxaméthonium",
  brands: ["Célocurine"],
  aliases: ["Succinylcholine"],
  class: "Curare dépolarisant",
  forms: ["Ampoule 100 mg/2 mL"],
  dosage:
    "Intubation en séquence rapide : 1 mg/kg IVD.\n" +
    "Préparation : 1 ampoule (100 mg) + 8 mL NaCl 0,9 % (10 mg/mL, seringue 10 mL).",
  contraindications: [
    "Allergie aux curares",
    "Hyperkaliémie",
    "Crush syndrome",
    "Antécédent personnel ou familial d'hyperthermie maligne",
    "Brûlure étendue, dénervation ou immobilisation prolongée (risque d'hyperkaliémie majeure)",
    "Myopathie, déficit en pseudocholinestérases",
  ],
  warning: "Ne jamais utiliser sans ventilation et intubation immédiatement disponibles.",
  source: DIJON_DILUTIONS_SOURCE,
};
