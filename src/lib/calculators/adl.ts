import type { Calculator, Interpretation, Level, Values } from "./types";

function autonomyFindings(v: Values): Interpretation[] {
  const adlScore =
    (v.bathing ?? 0) + (v.dressing ?? 0) + (v.toileting ?? 0) + (v.transferring ?? 0) + (v.continence ?? 0) + (v.feeding ?? 0);
  const iadlScore =
    (v.phone ?? 0) +
    (v.shopping ?? 0) +
    (v.cooking ?? 0) +
    (v.housekeeping ?? 0) +
    (v.laundry ?? 0) +
    (v.transport ?? 0) +
    (v.medication ?? 0) +
    (v.finances ?? 0);

  let adlTitle = "";
  let adlLevel: Level = "low";
  if (adlScore === 6) {
    adlTitle = "ADL : autonomie complète";
    adlLevel = "low";
  } else if (adlScore >= 4) {
    adlTitle = "ADL : dépendance légère à modérée";
    adlLevel = "moderate";
  } else if (adlScore >= 2) {
    adlTitle = "ADL : dépendance modérée à sévère";
    adlLevel = "high";
  } else {
    adlTitle = "ADL : dépendance sévère à totale";
    adlLevel = "critical";
  }

  let iadlTitle = "";
  let iadlLevel: Level = "low";
  if (iadlScore === 8) {
    iadlTitle = "IADL : autonomie complète";
    iadlLevel = "low";
  } else if (iadlScore >= 6) {
    iadlTitle = "IADL : dépendance légère";
    iadlLevel = "moderate";
  } else if (iadlScore >= 4) {
    iadlTitle = "IADL : dépendance modérée";
    iadlLevel = "high";
  } else {
    iadlTitle = "IADL : dépendance sévère";
    iadlLevel = "critical";
  }

  return [
    {
      title: adlTitle,
      level: adlLevel,
      scoreLabel: `${adlScore} / 6`,
      detail: "Activités de base (survie) : toilette, habillage, élimination, transferts, continence, alimentation.",
    },
    {
      title: iadlTitle,
      level: iadlLevel,
      scoreLabel: `${iadlScore} / 8`,
      detail:
        "Activités instrumentales, plus complexes : téléphone, courses, repas, ménage, lessive, transport, médicaments, budget. Un score bas oriente vers un besoin d'aides à domicile ou une évaluation gériatrique/sociale avant retour à domicile.",
    },
  ];
}

export const adl: Calculator = {
  id: "adl-iadl",
  name: "Autonomie : ADL de Katz et IADL de Lawton",
  shortName: "ADL / IADL",
  category: "geriatrie",
  keywords: [
    "adl",
    "iadl",
    "katz",
    "lawton",
    "activites de la vie quotidienne",
    "activités de la vie quotidienne",
    "activites instrumentales",
    "activités instrumentales",
    "autonomie",
    "dependance",
    "dépendance",
    "gériatrie",
    "geriatrie",
  ],
  summary: "Autonomie pour les activités de base (ADL) et instrumentales (IADL) de la vie quotidienne, souvent évaluées ensemble.",
  fields: [
    { type: "boolean", id: "bathing", label: "Autonome pour la toilette", points: 1, group: "ADL — activités de base" },
    { type: "boolean", id: "dressing", label: "Autonome pour l'habillage", points: 1, group: "ADL — activités de base" },
    { type: "boolean", id: "toileting", label: "Autonome pour l'élimination (aller aux toilettes)", points: 1, group: "ADL — activités de base" },
    { type: "boolean", id: "transferring", label: "Autonome pour les transferts (lit/fauteuil)", points: 1, group: "ADL — activités de base" },
    { type: "boolean", id: "continence", label: "Continent (urinaire et fécal)", points: 1, group: "ADL — activités de base" },
    { type: "boolean", id: "feeding", label: "Autonome pour l'alimentation", points: 1, group: "ADL — activités de base" },
    { type: "boolean", id: "phone", label: "Autonome pour utiliser le téléphone", points: 1, group: "IADL — activités instrumentales" },
    { type: "boolean", id: "shopping", label: "Autonome pour faire les courses", points: 1, group: "IADL — activités instrumentales" },
    { type: "boolean", id: "cooking", label: "Autonome pour préparer les repas", points: 1, group: "IADL — activités instrumentales" },
    { type: "boolean", id: "housekeeping", label: "Autonome pour l'entretien du logement", points: 1, group: "IADL — activités instrumentales" },
    { type: "boolean", id: "laundry", label: "Autonome pour la lessive", points: 1, group: "IADL — activités instrumentales" },
    { type: "boolean", id: "transport", label: "Autonome pour utiliser un moyen de transport", points: 1, group: "IADL — activités instrumentales" },
    { type: "boolean", id: "medication", label: "Autonome pour la prise de ses médicaments", points: 1, group: "IADL — activités instrumentales" },
    { type: "boolean", id: "finances", label: "Autonome pour gérer son budget", points: 1, group: "IADL — activités instrumentales" },
  ],
  compute: () => 0,
  interpret: (_score, v) => autonomyFindings(v),
  source: "Katz S et al., JAMA 1963 (ADL). Lawton MP, Brody EM, Gerontologist 1969 (IADL).",
  notes:
    "IADL : version à 8 items utilisée ici pour tous les patients ; la version originale ne compte que 5 items chez l'homme (cuisine, ménage et lessive traditionnellement non évalués), une distinction obsolète en pratique clinique actuelle.",
};
