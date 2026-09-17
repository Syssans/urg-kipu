import type { Calculator } from "./types";

export const adl: Calculator = {
  id: "adl",
  name: "Indice ADL de Katz (activités de base de la vie quotidienne)",
  shortName: "ADL",
  category: "geriatrie",
  keywords: ["adl", "katz", "activites de la vie quotidienne", "activités de la vie quotidienne", "autonomie", "dependance", "dépendance", "gériatrie", "geriatrie"],
  summary: "Autonomie pour les 6 activités de base de la vie quotidienne (toilette, habillage, élimination, transferts, continence, alimentation).",
  fields: [
    { type: "boolean", id: "bathing", label: "Autonome pour la toilette", points: 1 },
    { type: "boolean", id: "dressing", label: "Autonome pour l'habillage", points: 1 },
    { type: "boolean", id: "toileting", label: "Autonome pour l'élimination (aller aux toilettes)", points: 1 },
    { type: "boolean", id: "transferring", label: "Autonome pour les transferts (lit/fauteuil)", points: 1 },
    { type: "boolean", id: "continence", label: "Continent (urinaire et fécal)", points: 1 },
    { type: "boolean", id: "feeding", label: "Autonome pour l'alimentation", points: 1 },
  ],
  compute: (v) =>
    (v.bathing ?? 0) + (v.dressing ?? 0) + (v.toileting ?? 0) + (v.transferring ?? 0) + (v.continence ?? 0) + (v.feeding ?? 0),
  interpret: (score) => {
    let title = "";
    let level: "low" | "moderate" | "high" | "critical" = "low";
    if (score === 6) {
      title = "Autonomie complète";
      level = "low";
    } else if (score >= 4) {
      title = "Dépendance légère à modérée";
      level = "moderate";
    } else if (score >= 2) {
      title = "Dépendance modérée à sévère";
      level = "high";
    } else {
      title = "Dépendance sévère à totale";
      level = "critical";
    }
    return [{ title, level, scoreLabel: `${score} / 6`, detail: "Un score bas oriente vers un besoin d'aide humaine et une évaluation gériatrique/sociale avant retour à domicile." }];
  },
  source: "Katz S et al., JAMA 1963.",
  notes: "Évalue les activités de base (survie) ; à distinguer de l'IADL, qui évalue les activités instrumentales plus complexes.",
};
