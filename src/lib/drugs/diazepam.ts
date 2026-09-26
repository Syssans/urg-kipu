import type { Drug } from "./types";
import { DIJON_DILUTIONS_SOURCE } from "./sources";

export const diazepam: Drug = {
  id: "diazepam",
  dci: "Diazépam",
  brands: ["Valium"],
  class: "Benzodiazépine",
  forms: ["Ampoule 10 mg/2 mL"],
  dosage:
    "Crise convulsive, adulte : 1 ampoule (10 mg) en IV lente sur 1 min (seringue 2 mL), à répéter au bout de 10 min si persistance.\n" +
    "Crise convulsive, enfant : 0,5 mg/kg par voie rectale (contenu de l'ampoule, seringue 2 mL), à répéter 10 min après si persistance.",
  contraindications: [
    "Insuffisance respiratoire sévère",
    "Syndrome d'apnées du sommeil",
    "Myasthénie",
    "Insuffisance hépatique sévère",
    "Hypersensibilité aux benzodiazépines",
  ],
  warning:
    "Risque de dépression respiratoire, majoré en association avec d'autres dépresseurs du SNC (opioïdes, alcool) : matériel de réanimation respiratoire à proximité.",
  source: DIJON_DILUTIONS_SOURCE,
};
