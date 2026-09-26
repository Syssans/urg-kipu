import type { Drug } from "./types";
import { DIJON_DILUTIONS_SOURCE } from "./sources";

export const paracetamol: Drug = {
  id: "paracetamol",
  dci: "Paracétamol",
  brands: ["Perfalgan"],
  class: "Antalgique et antipyrétique (palier I)",
  forms: ["Flacon 1 g/100 mL", "Flacon 500 mg/50 mL (pédiatrie)", "Solutions déjà diluées (10 mg/mL)"],
  dosage:
    "Adulte et > 50 kg : 1 g en perfusion IV sur 15 min, 3 à 4 fois par jour.\n" +
    "Enfant < 10 kg : 7,5 mg/kg.\n" +
    "Enfant de 10 à 33 kg : 15 mg/kg sans dépasser 2 g/jour.\n" +
    "Enfant de 33 à 50 kg : 15 mg/kg sans dépasser 3 g/jour.\n" +
    "Dose maximale : 4 g/24 h chez l'adulte, 60 mg/kg/24 h chez l'enfant.",
  contraindications: ["Insuffisance hépatocellulaire sévère", "Hypersensibilité au paracétamol"],
  warning: "Perfusion lente (sur 15 min) : une injection trop rapide peut provoquer une hypotension, surtout chez l'enfant.",
  source: DIJON_DILUTIONS_SOURCE,
};
