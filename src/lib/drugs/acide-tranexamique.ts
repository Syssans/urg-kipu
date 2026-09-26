import type { Drug } from "./types";
import { DIJON_DILUTIONS_SOURCE } from "./sources";

export const acideTranexamique: Drug = {
  id: "acide-tranexamique",
  dci: "Acide tranexamique",
  brands: ["Exacyl"],
  class: "Antifibrinolytique",
  forms: ["Ampoule 500 mg/5 mL"],
  dosage:
    "Choc hémorragique, adulte : 1 g en perfusion IV sur 10 min _(2 ampoules de 500 mg dans 100 mL de NaCl 0,9 %)_, puis 1 g sur 8 h au PSE _(2 ampoules + 38 mL NaCl 0,9 % = 1 g/48 mL, seringue 50 mL)_.\n" +
    "Enfant < 30 kg : 10 mg/kg en perfusion IV sur 10 min, _dilution en fonction du poids ou pur_.\n" +
    "Angio-œdème bradykinique : mêmes modalités d'administration.",
  contraindications: [
    "Thrombose veineuse ou artérielle évolutive",
    "Antécédent de convulsions",
    "Insuffisance rénale sévère (adaptation de la posologie)",
    "Hypersensibilité à l'acide tranexamique",
  ],
  warning: "Perfusion IV lente obligatoire (risque anaphylactique et d'hypotension). Incompatible avec la noradrénaline.",
  source: DIJON_DILUTIONS_SOURCE,
};
