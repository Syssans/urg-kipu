import type { Drug } from "./types";
import { DIJON_DILUTIONS_SOURCE } from "./sources";

export const glucose30: Drug = {
  id: "glucose-30",
  dci: "Glucose 30 %",
  brands: [],
  aliases: ["Glucosé 30 %"],
  class: "Hyperglycémiant (soluté hypertonique)",
  forms: ["Ampoule 30 % soit 3 g/10 mL"],
  dosage: "Hypoglycémie : 1 à 2 ampoules en IV lente, pur, sur 10 min (seringue 20 mL).",
  contraindications: [
    "Aucune contre-indication dans le traitement d'une hypoglycémie confirmée",
    "En l'absence d'hypoglycémie : hyperglycémie, hyperosmolarité",
  ],
  warning:
    "Solution hypertonique veinotoxique : voie veineuse de bon calibre, risque de nécrose en cas d'extravasation. Chez le patient alcoolique ou dénutri, administrer la vitamine B1 avant ou avec le glucose.",
  source: DIJON_DILUTIONS_SOURCE,
};
