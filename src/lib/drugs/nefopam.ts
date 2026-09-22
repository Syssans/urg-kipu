import type { Drug } from "./types";

export const nefopam: Drug = {
  id: "nefopam",
  dci: "Néfopam",
  brands: ["Acupan"],
  class: "Analgésique non morphinique, non antipyrétique et non anti-inflammatoire",
  forms: [
    "Solution injectable, ampoule 20 mg/2 mL (IV lente ou IM)",
    "Voie orale : pas de forme galénique dédiée en France — le contenu de l'ampoule est pris dilué dans un verre d'eau ou de boisson sucrée (usage hors AMM, pratique hospitalière courante)",
  ],
  dosage:
    "Adulte, IV/IM : 20 mg en IV lente (sur au moins 15 minutes, patient en décubitus) ou en IM, à renouveler toutes les 4 à 6 heures selon la douleur, sans dépasser 120 mg/24 h.\n" +
    "Adulte, per os (hors AMM) : même dose par prise (une ampoule, 20 mg), mêmes intervalles et même dose maximale journalière ; alternative utile quand la voie injectable n'est pas nécessaire ou mal tolérée.",
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
  notes: "L'AMM française ne couvre que la voie injectable (IV/IM) ; la prise per os de l'ampoule est une pratique hors AMM, largement répandue en milieu hospitalier mais à mentionner comme telle au patient.",
  source: "Résumé des caractéristiques du produit (RCP) Acupan® (ANSM).",
};
