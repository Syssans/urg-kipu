import type { Calculator } from "./types";

export const centor: Calculator = {
  id: "centor-mcisaac",
  name: "Score de McIsaac",
  shortName: "McIsaac",
  category: "infectiologie",
  keywords: ["centor", "mcisaac", "angine", "pharyngite", "streptocoque"],
  summary: "Probabilité d'angine à streptocoque du groupe A et pertinence d'un test/antibiothérapie.",
  fields: [
    { type: "boolean", id: "fever", label: "Fièvre > 38 °C", points: 1 },
    { type: "boolean", id: "noCough", label: "Absence de toux", points: 1 },
    { type: "boolean", id: "nodes", label: "Adénopathies cervicales antérieures sensibles", points: 1 },
    { type: "boolean", id: "exudate", label: "Exsudat ou hypertrophie amygdalienne", points: 1 },
    {
      type: "select",
      id: "age",
      label: "Âge",
      showPoints: true,
      options: [
        { label: "3-14 ans", value: 1 },
        { label: "15-44 ans", value: 0 },
        { label: "≥ 45 ans", value: -1 },
      ],
    },
  ],
  compute: (v) => (v.fever ?? 0) + (v.noCough ?? 0) + (v.nodes ?? 0) + (v.exudate ?? 0) + (v.age ?? 0),
  interpret: (score) => {
    let title = "";
    let level: "low" | "moderate" | "high" = "low";
    let detail = "";
    if (score <= 0) {
      title = "Risque très faible (0-2,5 %)";
      level = "low";
      detail = "Pas de test ni d'antibiothérapie.";
    } else if (score === 1) {
      title = "Risque faible (5-10 %)";
      level = "low";
      detail = "Pas de test ni d'antibiothérapie recommandés en général.";
    } else if (score === 2) {
      title = "Risque intermédiaire (11-17 %)";
      level = "moderate";
      detail = "Envisager un test de diagnostic rapide (TDR).";
    } else if (score === 3) {
      title = "Risque élevé (28-35 %)";
      level = "high";
      detail = "TDR recommandé ; antibiothérapie si positif.";
    } else {
      title = "Risque très élevé (51-53 %)";
      level = "high";
      detail = "TDR ou antibiothérapie probabiliste selon le contexte clinique.";
    }
    return [{ title, level, scoreLabel: `${score} pts`, detail }];
  },
  source: "McIsaac et al., CMAJ 1998 ; Centor et al., Med Decis Making 1981.",
};
