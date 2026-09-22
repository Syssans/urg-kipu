import type { Drug } from "./types";

export const levetiracetam: Drug = {
  id: "levetiracetam",
  dci: "Lévétiracétam",
  brands: ["Keppra"],
  class: "Antiépileptique (liaison à la protéine vésiculaire SV2A)",
  forms: [
    "Comprimé pelliculé 250 / 500 / 750 / 1000 mg",
    "Solution buvable 100 mg/mL",
    "Solution à diluer pour perfusion IV, ampoule 500 mg/5 mL",
  ],
  dosage:
    "État de mal épileptique (antiépileptique de 2ᵉ ligne, adulte) : dose de charge 60 mg/kg IV (maximum 4500 mg), en perfusion sur environ 15 minutes, puis relais selon avis spécialisé.\n" +
    "Chez l'enfant : dose de charge adaptée au poids — avis spécialisé.\n" +
    "Traitement de fond : instauration à dose faible avec titration progressive, prescription et suivi spécialisés.",
  contraindications: ["Hypersensibilité au lévétiracétam ou aux dérivés de la pyrrolidone"],
  warning:
    "Adapter la posologie à la fonction rénale (élimination essentiellement rénale). Troubles du comportement possibles (irritabilité, agressivité, troubles de l'humeur), plus fréquents chez l'enfant.",
  notes: "Bon profil de tolérance cardiovasculaire et respiratoire, peu d'interactions médicamenteuses (pas de métabolisme hépatique significatif) ; efficacité en état de mal peut-être inférieure à celle des autres antiépileptiques de 2ᵉ ligne aux doses classiquement utilisées.",
  source: "Résumé des caractéristiques du produit (RCP) Keppra® (ANSM) ; usage en urgence : recommandations formalisées d'experts SRLF/SFMU 2018 (état de mal épileptique).",
};
