import type { Drug } from "./types";
import { DIJON_DILUTIONS_SOURCE } from "./sources";

export const adrenaline: Drug = {
  id: "adrenaline",
  dci: "Adrénaline",
  brands: [],
  class: "Amine vasopressive (catécholamine)",
  forms: ["Ampoule 5 mg/5 mL (1 mg/mL)"],
  dosage:
    "ACR : 1 mg IVD toutes les 3 à 5 min (pur, 1 mg/mL).\n" +
    "ACR enfant : 10 µg/kg IVD ; dilution à 100 µg/mL si > 10 kg (1 mL + 9 mL NaCl 0,9 %), à 10 µg/mL si < 10 kg (redilution : 1 mL de la solution à 100 µg/mL + 9 mL NaCl 0,9 %).\n" +
    "Anaphylaxie adulte : 0,5 mg IM (pur) ; ou 0,05 à 0,1 mg IVD (0,1 mg/mL : 1 mL + 9 mL NaCl 0,9 %).\n" +
    "Anaphylaxie enfant : 0,01 mg/kg IM, maximum 0,5 mg (0,1 mg/mL).\n" +
    "Œdème de Quincke / bronchospasme : 1 mg en aérosol sur 20 min (1 mL + 4 mL NaCl 0,9 %).\n" +
    "État de choc : 0,05 à 0,1 µg/kg/min au PSE puis titration sur la PAM (> 80 mmHg). Sur VVC : 4 à 6 ampoules de 5 mg pures (1 mg/mL, seringue 50 mL). Sur VVP (pratique de la SAUV) : 1 ampoule de 5 mg + 45 mL NaCl 0,9 % (0,1 mg/mL, seringue 50 mL).",
  contraindications: [
    "Aucune contre-indication absolue en situation de détresse vitale (ACR, choc anaphylactique)",
    "Hors urgence vitale : prudence en cas de cardiopathie ischémique, de troubles du rythme, d'HTA sévère ou d'hyperthyroïdie",
  ],
  source: DIJON_DILUTIONS_SOURCE,
};
