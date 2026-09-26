import type { Drug } from "./types";
import { DIJON_DILUTIONS_SOURCE } from "./sources";

export const clonazepam: Drug = {
  id: "clonazepam",
  dci: "Clonazépam",
  brands: ["Rivotril"],
  class: "Benzodiazépine anticonvulsivante",
  forms: [
    "Comprimé sécable 2 mg",
    "Solution buvable en gouttes 2,5 mg/mL (≈ 0,1 mg par goutte)",
    "Solution injectable, ampoule 1 mg/1 mL avec solvant spécifique (à diluer avant administration IV)",
  ],
  dosage:
    "Crise convulsive / état de mal épileptique (adulte) : 0,015 mg/kg en IV directe lente (≈ 1 mg pour 70 kg) ; " +
    "seconde injection identique en cas de persistance des convulsions 5 minutes après la première.\n" +
    "Protocole du service, > 15 ans : 1 mg en IV lente sur 2 à 3 min, renouvelable 4 à 6 fois.\n" +
    "Protocole du service, < 15 ans : 0,25 à 0,5 mg en IV lente sur 2 à 3 min.\n" +
    "Préparation IV : 1/4 d'ampoule (0,25 mg) à 1 ampoule (1 mg) + 1 mL du solvant spécifique (seringue 2 mL).\n" +
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
  source:
    "Résumé des caractéristiques du produit (RCP) Rivotril® (ANSM) ; état de mal épileptique : recommandations formalisées d'experts SRLF/SFMU 2018. " +
    DIJON_DILUTIONS_SOURCE,
};
