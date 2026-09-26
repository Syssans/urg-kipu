import type { Drug } from "./types";
import { DIJON_DILUTIONS_SOURCE } from "./sources";

export const midazolam: Drug = {
  id: "midazolam",
  dci: "Midazolam",
  brands: ["Hypnovel"],
  class: "Benzodiazépine (sédatif, anticonvulsivant)",
  forms: ["Ampoule 50 mg/10 mL", "Ampoule 5 mg/5 mL", "Ampoule 5 mg/1 mL (voie IM ou buccale)"],
  dosage:
    "État de mal épileptique, adulte : 0,15 mg/kg en IM (≈ 10 mg pour 70 kg), en l'absence de voie veineuse rapidement disponible.\n" +
    "État de mal épileptique, enfant : voie buccale, dose adaptée au poids et à l'âge — avis spécialisé.\n" +
    "Entretien de sédation : 0,1 mg/kg/h au PSE — _1 ampoule de 50 mg + 40 mL NaCl 0,9 % (1 mg/mL, seringue 50 mL)_.\n" +
    "Sédation légère : 0,05 mg/kg IVD, _pur (5 mg/5 mL, seringue 5 mL)_.\n" +
    "Sédation chez l'enfant : 0,025 à 0,05 mg/kg — _1 ampoule de 5 mg + 45 mL NaCl 0,9 % (0,1 mg/mL, seringue 50 mL)_.",
  contraindications: [
    "Insuffisance respiratoire sévère",
    "Myasthénie",
    "Insuffisance hépatique sévère",
    "Hypersensibilité aux benzodiazépines",
    "Hypotension artérielle (précaution majeure)",
  ],
  warning:
    "Risque de dépression respiratoire, majoré en association avec d'autres dépresseurs du SNC (opioïdes, alcool) : matériel de réanimation respiratoire à proximité. Risque d'accumulation en perfusion prolongée, surtout si insuffisance rénale ou hépatique.",
  source:
    "Résumé des caractéristiques du produit (RCP) Hypnovel® (ANSM) ; état de mal épileptique : recommandations formalisées d'experts SRLF/SFMU 2018. " +
    DIJON_DILUTIONS_SOURCE,
};
