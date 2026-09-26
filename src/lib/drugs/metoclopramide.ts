import type { Drug } from "./types";
import { DIJON_DILUTIONS_SOURCE } from "./sources";

export const metoclopramide: Drug = {
  id: "metoclopramide",
  dci: "Métoclopramide",
  brands: ["Primpéran"],
  class: "Antiémétique (antagoniste dopaminergique)",
  forms: ["Ampoule 10 mg/2 mL"],
  dosage: "Nausées, vomissements : 1 ampoule (10 mg) diluée dans 50 mL de NaCl 0,9 %, en perfusion IV sur 15 min.",
  contraindications: [
    "Hémorragie, obstruction ou perforation digestive",
    "Phéochromocytome",
    "Antécédent de dyskinésie tardive aux neuroleptiques ou au métoclopramide",
    "Épilepsie, maladie de Parkinson",
    "Association à la lévodopa ou aux agonistes dopaminergiques",
    "Enfant de moins de 1 an",
  ],
  warning: "Injection lente : l'administration rapide expose à un allongement du QT et à des effets extrapyramidaux.",
  source: DIJON_DILUTIONS_SOURCE,
};
