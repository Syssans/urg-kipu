import type { Drug } from "./types";
import { DIJON_DILUTIONS_SOURCE } from "./sources";

export const tenecteplase: Drug = {
  id: "tenecteplase",
  dci: "Ténectéplase",
  brands: ["Metalyse"],
  class: "Fibrinolytique",
  forms: ["Lyophilisat 10 000 UI (50 mg) avec 10 mL d'eau solvant"],
  dosage:
    "SCA : bolus IVD en 10 secondes, dose selon le poids :\n" +
    "< 60 kg : 6 000 UI.\n" +
    "60 à < 70 kg : 7 000 UI.\n" +
    "70 à < 80 kg : 8 000 UI.\n" +
    "80 à < 90 kg : 9 000 UI.\n" +
    "≥ 90 kg : 10 000 UI.\n" +
    "Préparation : reconstituer la poudre avec le solvant fourni (10 000 UI/10 mL), seringue spéciale de 10 mL.",
  contraindications: [
    "Hémorragie active ou diathèse hémorragique",
    "Antécédent d'hémorragie intracrânienne, AVC ischémique récent (< 6 mois)",
    "Lésion ou tumeur du système nerveux central, anévrisme, malformation vasculaire",
    "Traumatisme ou chirurgie majeure récents",
    "HTA sévère non contrôlée",
    "Anticoagulation orale efficace",
  ],
  notes: "Liste non exhaustive : se référer aux contre-indications de la thrombolyse.",
  source: DIJON_DILUTIONS_SOURCE,
};
