import type { Drug } from "./types";
import { DIJON_DILUTIONS_SOURCE } from "./sources";

export const sulfateMagnesium: Drug = {
  id: "sulfate-magnesium",
  dci: "Sulfate de magnésium",
  brands: [],
  class: "Sel de magnésium (antiarythmique, bronchodilatateur, anticonvulsivant)",
  forms: ["Ampoule injectable (vérifier la concentration de l'ampoule utilisée)"],
  dosage:
    "Asthme aigu grave : 1 ampoule dans une poche de 50 mL de NaCl 0,9 %, en perfusion IV sur 20 min.\n" +
    "Pré-éclampsie : bolus de 4 g sur 20 min _(solution pure, seringue 50 mL, environ 80 mL/h)_ puis entretien de 1 g/h au PSE _(6 g dans 40 mL de solution pure, soit 6,5 mL/h)_.\n" +
    "Hypokaliémie : 6 à 8 g/24 h au PSE _(seringue 50 mL, dilution avec du NaCl 0,9 %)_.\n" +
    "Torsades de pointes : bolus de 2 g en IV lente sur 5 à 10 min, puis relais de 3 à 20 mg/min au PSE.",
  contraindications: [
    "Insuffisance rénale sévère (risque d'accumulation)",
    "Bloc auriculo-ventriculaire",
    "Myasthénie",
    "Hypersensibilité au magnésium",
  ],
  warning:
    "Surveillance rapprochée pendant l'administration (réflexes ostéotendineux, fréquence respiratoire, diurèse) : le surdosage provoque une abolition des réflexes puis une dépression respiratoire (antidote : gluconate de calcium).",
  notes:
    "Les équivalences ampoules/volumes de la page source ne sont pas cohérentes entre les indications : seules les doses en grammes ont été reprises. Contrôler la concentration de l'ampoule utilisée avant de préparer la seringue.",
  source: DIJON_DILUTIONS_SOURCE,
};
