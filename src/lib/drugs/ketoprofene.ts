import type { Drug } from "./types";
import { DIJON_DILUTIONS_SOURCE } from "./sources";

export const ketoprofene: Drug = {
  id: "ketoprofene",
  dci: "Kétoprofène",
  brands: ["Profénid"],
  class: "Anti-inflammatoire non stéroïdien (AINS)",
  forms: ["Ampoule 100 mg/4 mL"],
  dosage:
    "Douleur (colique néphrétique en particulier) : 50 à 100 mg en perfusion IV sur 20 min.\n" +
    "_Préparation : 50 à 100 mg de kétoprofène dans 100 mL de NaCl 0,9 % (0,5 à 1 mg/mL)._",
  contraindications: [
    "Ulcère gastroduodénal, hémorragie digestive",
    "Allergie aux AINS ou à l'aspirine",
    "Insuffisance rénale, hépatique ou cardiaque sévère",
    "Grossesse à partir du 6ᵉ mois (24 SA)",
  ],
  source: DIJON_DILUTIONS_SOURCE,
};
