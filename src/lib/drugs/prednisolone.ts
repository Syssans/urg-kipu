import type { Drug } from "./types";

export const prednisolone: Drug = {
  id: "prednisolone",
  dci: "Prednisolone",
  brands: ["Solupred"],
  class: "Corticoïde (glucocorticoïde de synthèse, action courte/intermédiaire)",
  forms: [
    "Comprimé orodispersible 5 mg / 20 mg",
    "Comprimé sécable 5 mg / 20 mg",
    "Solution buvable en gouttes 1 mg/mL",
  ],
  dosage:
    "Laryngite aiguë sous-glottique (enfant) : 1 à 2 mg/kg en prise unique.\n" +
    "Exacerbation d'asthme : 1 à 2 mg/kg/j chez l'enfant, 40 à 50 mg/j chez l'adulte, en cure courte (habituellement 3 à 5 jours).\n" +
    "Posologie très variable selon l'indication (allergie, inflammation...) : se référer au contexte clinique précis.",
  contraindications: [
    "État infectieux non contrôlé (hors indication spécifique nécessitant une corticothérapie)",
    "Hypersensibilité à la prednisolone",
  ],
  warning:
    "En cure courte à visée urgente, pas de contre-indication absolue liée à la durée du traitement. Prudence particulière en cas de varicelle en cours chez l'enfant (risque de forme grave). Ne jamais arrêter brutalement un traitement corticoïde prolongé (risque d'insuffisance surrénalienne aiguë) : cette mise en garde ne concerne pas les cures courtes de quelques jours.",
  source: "Résumé des caractéristiques du produit (RCP) Solupred® (ANSM).",
};
