import type { Drug } from "./types";
import { DIJON_DILUTIONS_SOURCE } from "./sources";

export const diltiazem: Drug = {
  id: "diltiazem",
  dci: "Diltiazem",
  brands: ["Tildiem"],
  class: "Inhibiteur calcique (bradycardisant)",
  forms: ["Flacon de poudre 25 mg (à diluer)"],
  dosage:
    "Tachycardie jonctionnelle, TACFA : 0,25 à 0,30 mg/kg en IVD sur 2 min.\n" +
    "Préparation : 2 flacons de 25 mg + 50 mL de NaCl 0,9 % (1 mg/mL), puis prélever la dose nécessaire (seringue de 10, 20 ou 30 mL).",
  contraindications: [
    "Dysfonction sinusale ou BAV de haut degré non appareillés",
    "Insuffisance cardiaque, dysfonction ventriculaire gauche sévère",
    "Tachycardie à QRS larges, fibrillation atriale préexcitée (WPW)",
    "Association à un bêtabloquant par voie IV",
  ],
  source: DIJON_DILUTIONS_SOURCE,
};
