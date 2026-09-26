import type { Drug } from "./types";
import { DIJON_DILUTIONS_SOURCE } from "./sources";

export const dobutamine: Drug = {
  id: "dobutamine",
  dci: "Dobutamine",
  brands: ["Dobutrex"],
  class: "Inotrope positif (catécholamine)",
  forms: ["Flacon 250 mg/20 mL"],
  dosage:
    "Choc cardiogénique : 5 à 20 µg/kg/min au PSE.\n" +
    "Préparation : 1 flacon (250 mg/20 mL) + 30 mL de NaCl 0,9 % ou de G5 % = 250 mg/50 mL (5 mg/mL, seringue 50 mL).\n" +
    "Vitesse du PSE à 5 mg/mL : débit (mL/h) = dose (µg/kg/min) × poids (kg) × 0,012 ; par exemple 5 µg/kg/min chez 70 kg = 4,2 mL/h.",
  contraindications: [
    "Rétrécissement aortique serré, cardiomyopathie obstructive",
    "Allergie aux sulfites",
    "Hypersensibilité à la dobutamine",
  ],
  source: DIJON_DILUTIONS_SOURCE,
};
