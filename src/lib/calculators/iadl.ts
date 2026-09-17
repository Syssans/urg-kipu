import type { Calculator } from "./types";

export const iadl: Calculator = {
  id: "iadl",
  name: "Indice IADL de Lawton (activités instrumentales de la vie quotidienne)",
  shortName: "IADL",
  category: "geriatrie",
  keywords: ["iadl", "lawton", "activites instrumentales", "activités instrumentales", "autonomie", "dependance", "dépendance", "gériatrie", "geriatrie"],
  summary: "Autonomie pour 8 activités instrumentales de la vie quotidienne (téléphone, courses, transport, médicaments, budget...).",
  fields: [
    { type: "boolean", id: "phone", label: "Autonome pour utiliser le téléphone", points: 1 },
    { type: "boolean", id: "shopping", label: "Autonome pour faire les courses", points: 1 },
    { type: "boolean", id: "cooking", label: "Autonome pour préparer les repas", points: 1 },
    { type: "boolean", id: "housekeeping", label: "Autonome pour l'entretien du logement", points: 1 },
    { type: "boolean", id: "laundry", label: "Autonome pour la lessive", points: 1 },
    { type: "boolean", id: "transport", label: "Autonome pour utiliser un moyen de transport", points: 1 },
    { type: "boolean", id: "medication", label: "Autonome pour la prise de ses médicaments", points: 1 },
    { type: "boolean", id: "finances", label: "Autonome pour gérer son budget", points: 1 },
  ],
  compute: (v) =>
    (v.phone ?? 0) +
    (v.shopping ?? 0) +
    (v.cooking ?? 0) +
    (v.housekeeping ?? 0) +
    (v.laundry ?? 0) +
    (v.transport ?? 0) +
    (v.medication ?? 0) +
    (v.finances ?? 0),
  interpret: (score) => {
    let title = "";
    let level: "low" | "moderate" | "high" | "critical" = "low";
    if (score === 8) {
      title = "Autonomie complète";
      level = "low";
    } else if (score >= 6) {
      title = "Dépendance légère";
      level = "moderate";
    } else if (score >= 4) {
      title = "Dépendance modérée";
      level = "high";
    } else {
      title = "Dépendance sévère";
      level = "critical";
    }
    return [{ title, level, scoreLabel: `${score} / 8`, detail: "Un score bas oriente vers un besoin d'aides à domicile ou une évaluation gériatrique/sociale avant retour à domicile." }];
  },
  source: "Lawton MP, Brody EM, Gerontologist 1969.",
  notes: "Version à 8 items utilisée ici pour tous les patients ; la version originale ne compte que 5 items chez l'homme (cuisine, ménage et lessive traditionnellement non évalués), une distinction obsolète en pratique clinique actuelle.",
};
