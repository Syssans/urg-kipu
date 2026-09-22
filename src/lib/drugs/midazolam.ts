import type { Drug } from "./types";

export const midazolam: Drug = {
  id: "midazolam",
  dci: "Midazolam",
  brands: ["Hypnovel"],
  class: "Benzodiazépine (sédatif, anticonvulsivant)",
  forms: ["Solution injectable, ampoules 5 mg/1 mL, 5 mg/5 mL ou 50 mg/10 mL (IV, IM, ou voie buccale hors ampoule dédiée)"],
  dosage:
    "État de mal épileptique, adulte : 0,15 mg/kg en IM (≈ 10 mg pour 70 kg), en l'absence de voie veineuse rapidement disponible.\n" +
    "Chez l'enfant : voie buccale, dose adaptée au poids et à l'âge — avis spécialisé.\n" +
    "Sédation procédurale ou coma thérapeutique (réanimation) : perfusion continue IV, posologie titrée par le réanimateur.",
  contraindications: [
    "Insuffisance respiratoire sévère",
    "Myasthénie",
    "Insuffisance hépatique sévère",
    "Hypersensibilité aux benzodiazépines",
  ],
  warning:
    "Risque de dépression respiratoire, majoré en association avec d'autres dépresseurs du SNC (opioïdes, alcool) : matériel de réanimation respiratoire à proximité. Risque d'accumulation en perfusion prolongée, surtout si insuffisance rénale ou hépatique.",
  source: "Résumé des caractéristiques du produit (RCP) Hypnovel® (ANSM) ; usage en urgence : recommandations formalisées d'experts SRLF/SFMU 2018 (état de mal épileptique).",
};
