import type { Calculator, Level } from "../calculators/types";

export const correctedSodium: Calculator = {
  id: "natremie-corrigee",
  name: "Natrémie corrigée (hyperglycémie)",
  shortName: "Natrémie corrigée",
  category: "formule",
  keywords: ["natremie corrigee", "natrémie corrigée", "hyperglycemie", "hyperglycémie", "hyponatremie", "hyponatrémie", "katz", "sodium corrige"],
  summary: "Corrige la natrémie mesurée pour l'effet dilutionnel de l'hyperglycémie, sans avoir besoin d'osmolalité.",
  fields: [
    { type: "number", id: "na", label: "Natrémie mesurée", unit: "mmol/L", step: 1 },
    { type: "number", id: "glycemie", label: "Glycémie", unit: "mmol/L", step: 0.1 },
  ],
  requiredNumberFieldIds: ["na", "glycemie"],
  compute: (v) => {
    const na = v.na ?? 0;
    const glycemie = v.glycemie ?? 5.5;
    return na + (1.6 * (glycemie - 5.5)) / 5.5;
  },
  interpret: (score) => {
    const corrected = score;
    let level: Level = "low";
    let title = "Natrémie corrigée normale";
    if (corrected < 135) {
      level = "moderate";
      title = "Hyponatrémie réelle (persiste après correction)";
    } else if (corrected > 145) {
      level = "moderate";
      title = "Hypernatrémie réelle (démasquée par la correction)";
    }
    return [
      {
        title,
        level,
        scoreLabel: `${corrected.toFixed(1)} mmol/L`,
        detail:
          corrected >= 135 && corrected <= 145
            ? "La natrémie basse mesurée s'explique entièrement par l'hyperglycémie : pas de véritable trouble du sodium à explorer davantage."
            : "Une natrémie anormale persiste après correction de l'hyperglycémie : poursuivre le bilan étiologique (statut volémique, natriurèse).",
      },
    ];
  },
  source: "Formule de Katz MA, N Engl J Med 1973 (+1,6 mmol/L de Na par 5,5 mmol/L de glycémie au-dessus de la normale).",
  notes: "Certains auteurs (Hillier et al., Am J Med 1999) proposent un facteur de 2,4 plutôt que 1,6 pour les glycémies très élevées (> 22 mmol/L environ).",
};
