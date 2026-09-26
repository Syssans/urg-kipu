import type { Drug } from "./types";
import { DIJON_DILUTIONS_SOURCE } from "./sources";

export const isosorbideDinitrate: Drug = {
  id: "isosorbide-dinitrate",
  dci: "Isosorbide dinitrate",
  brands: ["Risordan"],
  aliases: ["Isosorbide"],
  class: "Dérivé nitré (vasodilatateur)",
  forms: ["Ampoule 10 mg/10 mL"],
  dosage:
    "OAP hypertensif : 0,5 à 3 mg/h au PSE, voire plus (bolus possible).\n" +
    "_Préparation : 5 ampoules de 10 mg (50 mg) dans une seringue de 50 mL, soit 1 mg/mL (pur)._",
  contraindications: [
    "Pression artérielle systolique < 100 mmHg",
    "Infarctus du ventricule droit",
    "Hypovolémie",
    "Association aux inhibiteurs de la phosphodiestérase de type 5 (sildénafil...)",
    "Rétrécissement aortique serré, cardiomyopathie obstructive",
  ],
  source: DIJON_DILUTIONS_SOURCE,
};
