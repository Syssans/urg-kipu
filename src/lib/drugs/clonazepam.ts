import type { Drug } from "./types";

export const clonazepam: Drug = {
  id: "clonazepam",
  dci: "Clonazépam",
  brands: ["Rivotril"],
  class: "Benzodiazépine anticonvulsivante",
  forms: [
    "Comprimé sécable 2 mg",
    "Solution buvable en gouttes 2,5 mg/mL (≈ 0,1 mg par goutte)",
    "Solution injectable, ampoule 1 mg/1 mL (à diluer avant administration IV)",
  ],
  dosage:
    "Crise convulsive / état de mal épileptique (adulte) : 0,015 mg/kg en IV directe lente (≈ 1 mg pour 70 kg) ; " +
    "seconde injection identique en cas de persistance des convulsions 5 minutes après la première.\n" +
    "Chez l'enfant : posologie à adapter au poids, en IV lente, au mieux en milieu hospitalier — avis spécialisé.\n" +
    "Par voie orale (traitement de fond ou prévention de la récidive) : instauration à dose faible avec titration progressive, prescription et suivi spécialisés.",
  contraindications: [
    "Insuffisance respiratoire sévère",
    "Syndrome d'apnées du sommeil",
    "Myasthénie",
    "Insuffisance hépatique sévère (risque d'encéphalopathie)",
    "Hypersensibilité aux benzodiazépines",
  ],
  warning:
    "Risque de dépression respiratoire, majoré en association avec d'autres dépresseurs du SNC (opioïdes, alcool, autres antiépileptiques sédatifs) : matériel de réanimation respiratoire à proximité lors de toute injection IV. Risque de dépendance en cas de traitement prolongé.",
  source: "Résumé des caractéristiques du produit (RCP) Rivotril® (ANSM) ; usage en urgence : recommandations formalisées d'experts SRLF/SFMU 2018 (état de mal épileptique).",
};
