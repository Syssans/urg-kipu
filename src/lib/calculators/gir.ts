import type { Calculator } from "./types";

export const gir: Calculator = {
  id: "gir",
  name: "Groupe Iso-Ressources (GIR)",
  shortName: "GIR",
  category: "geriatrie",
  keywords: ["gir", "groupe iso-ressources", "aggir", "autonomie", "dependance", "dépendance", "apa", "gériatrie", "geriatrie"],
  summary: "Niveau de dépendance d'une personne âgée (grille AGGIR), du GIR 1 (dépendance totale) au GIR 6 (autonome).",
  fields: [
    {
      type: "select",
      id: "gir",
      label: "Niveau correspondant à la situation du patient",
      options: [
        {
          label: "GIR 1 — Confiné au lit/fauteuil, fonctions mentales gravement altérées : présence indispensable et continue",
          value: 1,
        },
        {
          label: "GIR 2 — Confiné au lit/fauteuil avec fonctions mentales conservées, ou fonctions mentales altérées mais peut se déplacer",
          value: 2,
        },
        {
          label: "GIR 3 — Autonomie mentale et locomotrice partielle, aide quotidienne nécessaire pour l'autonomie corporelle",
          value: 3,
        },
        {
          label: "GIR 4 — Aide pour les transferts et/ou la toilette et l'habillage, mais se déplace seul une fois levé",
          value: 4,
        },
        {
          label: "GIR 5 — Autonome pour les déplacements, aide ponctuelle pour la toilette, les repas ou le ménage",
          value: 5,
        },
        {
          label: "GIR 6 — Autonome pour tous les actes essentiels de la vie courante",
          value: 6,
        },
      ],
    },
  ],
  compute: (v) => v.gir ?? 6,
  interpret: (score) => {
    let title = "";
    let level: "low" | "moderate" | "high" | "critical" = "low";
    let detail = "";
    if (score === 1) {
      title = "GIR 1 : dépendance totale";
      level = "critical";
      detail = "Nécessite une présence indispensable et continue d'intervenants. Éligible APA, orientation EHPAD/USLD à discuter.";
    } else if (score === 2) {
      title = "GIR 2 : dépendance sévère";
      level = "critical";
      detail = "Aide humaine importante et quasi permanente. Éligible APA.";
    } else if (score === 3) {
      title = "GIR 3 : dépendance modérée";
      level = "high";
      detail = "Aide quotidienne pour l'autonomie corporelle. Éligible APA.";
    } else if (score === 4) {
      title = "GIR 4 : dépendance légère à modérée";
      level = "moderate";
      detail = "Aide pour les transferts, la toilette et l'habillage. Éligible APA.";
    } else if (score === 5) {
      title = "GIR 5 : autonomie quasi complète";
      level = "low";
      detail = "Aide ponctuelle. Non éligible APA (relève des aides sociales de droit commun).";
    } else {
      title = "GIR 6 : autonome";
      level = "low";
      detail = "Aucune perte d'autonomie pour les actes essentiels. Non éligible APA.";
    }
    return [{ title, level, scoreLabel: `GIR ${score}`, detail }];
  },
  source: "Grille nationale AGGIR (Autonomie Gérontologie Groupes Iso-Ressources), arrêté du 2 décembre 2008.",
  notes:
    "La cotation GIR complète repose sur 10 variables discriminantes évaluées par une équipe médico-sociale (APA/MDPH). Cet outil propose une estimation rapide au lit du patient à partir des groupes-types AGGIR, utile pour orienter la filière (retour à domicile, aides, EHPAD) mais ne se substitue pas à l'évaluation médico-sociale officielle.",
};
