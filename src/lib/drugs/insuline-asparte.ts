import type { Drug } from "./types";
import { DIJON_DILUTIONS_SOURCE } from "./sources";

export const insulineAsparte: Drug = {
  id: "insuline-asparte",
  dci: "Insuline asparte",
  brands: ["Novorapid"],
  aliases: ["Insuline rapide"],
  class: "Insuline rapide (analogue)",
  forms: ["Flacon 100 UI/mL"],
  dosage:
    "Hyperglycémie (> 1,40 g/L) : PSE à 1 UI/mL, vitesse égale à la valeur du dextro (protocole du service).\n" +
    "Préparation : prélever 50 UI (0,5 mL) avec une seringue à insuline (embout orange) puis ramener à 50 mL avec du NaCl 0,9 % (seringue 50 mL).",
  contraindications: ["Hypoglycémie", "Hypersensibilité à l'insuline asparte"],
  warning: "Administrer à l'abri de la lumière. Contrôler la kaliémie avant et pendant la perfusion (risque d'hypokaliémie).",
  source: DIJON_DILUTIONS_SOURCE,
};
