import type { Drug } from "./types";

export const nefopam: Drug = {
  id: "nefopam",
  dci: "Néfopam",
  brands: ["Acupan"],
  class: "Analgésique non morphinique, non antipyrétique et non anti-inflammatoire",
  forms: [
    "Solution injectable, ampoule 20 mg/2 mL (IV lente ou IM)",
    "Comprimé 30 mg (voie orale)",
  ],
  dosage:
    "Adulte, IV/IM : 20 mg en IV lente (sur au moins 15 minutes, patient en décubitus) ou en IM, à renouveler toutes les 4 à 6 heures selon la douleur, sans dépasser 120 mg/24 h.\n" +
    "Adulte, per os (comprimé) : 30 mg par prise, à renouveler toutes les 4 à 6 heures selon la douleur.\n" +
    "À défaut de comprimé disponible, le contenu de l'ampoule peut être pris dilué per os (pratique hors AMM, courante à l'hôpital), à la dose de 20 mg par prise.",
  contraindications: [
    "Enfant de moins de 15 ans",
    "Épilepsie ou antécédent de convulsions",
    "Glaucome à angle fermé",
    "Adénome prostatique / risque de rétention urinaire",
    "Insuffisance coronarienne sévère, trouble du rythme cardiaque",
    "Association aux IMAO",
  ],
  warning:
    "Effet abaissant le seuil épileptogène : contre-indiqué en cas d'épilepsie. Effets atropiniques fréquents (tachycardie, sécheresse buccale, sueurs, nausées, rétention urinaire). Injecter lentement, patient allongé, pour limiter le risque de malaise/hypotension et de vertiges.",
  notes: "Le comprimé permet une administration per os sans recourir à l'ampoule ; à défaut de disponibilité, l'ampoule diluée peut être prise per os (pratique hors AMM, courante en milieu hospitalier), à mentionner comme telle au patient.",
  source: "Résumé des caractéristiques du produit (RCP) Acupan® (ANSM).",
};
