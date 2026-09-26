import type { Drug } from "./types";
import { DIJON_DILUTIONS_SOURCE } from "./sources";

export const isoprenaline: Drug = {
  id: "isoprenaline",
  dci: "Isoprénaline",
  brands: ["Isuprel"],
  class: "Bêta-mimétique (chronotrope positif)",
  forms: ["Ampoule 0,2 mg/1 mL (à conserver au réfrigérateur)"],
  dosage:
    "Torsades de pointes avec bradycardie, BAV de haut degré, intoxication aux bêtabloquants : 0,05 à 0,2 µg/kg/min au PSE.\n" +
    "Préparation : 5 ampoules (1 mg) + 45 mL de G5 % en seringue de 50 mL (20 µg/mL).\n" +
    "Vitesse du PSE à 20 µg/mL : débit (mL/h) = dose (µg/kg/min) × poids (kg) × 3 ; par exemple 0,1 µg/kg/min = poids × 0,3 mL/h.",
  contraindications: [
    "Infarctus du myocarde de siège inférieur",
    "Tachycardie ou arythmie ventriculaire non liée à une bradycardie",
    "Hypersensibilité à l'isoprénaline",
  ],
  warning: "Administrer à l'abri de la lumière.",
  source: DIJON_DILUTIONS_SOURCE,
};
