import type { Calculator } from "./types";

export const crb65: Calculator = {
  id: "crb65",
  name: "CRB-65",
  shortName: "CRB-65",
  category: "respiratoire",
  keywords: ["crb65", "crb-65", "curb65", "curb-65", "pneumopathie", "pneumonie", "infection respiratoire"],
  summary: "Score de gravité d'une pneumopathie aiguë communautaire et orientation (ambulatoire/hospitalisation), sans dosage biologique.",
  fields: [
    { type: "boolean", id: "confusion", label: "Confusion (désorientation nouvelle)", points: 1 },
    { type: "boolean", id: "rr", label: "Fréquence respiratoire ≥ 30/min", points: 1 },
    { type: "boolean", id: "bp", label: "PAS < 90 mmHg ou PAD ≤ 60 mmHg", points: 1 },
    { type: "boolean", id: "age", label: "Âge ≥ 65 ans", points: 1 },
  ],
  compute: (v) => (v.confusion ?? 0) + (v.rr ?? 0) + (v.bp ?? 0) + (v.age ?? 0),
  interpret: (score) => {
    let title = "";
    let level: "low" | "moderate" | "high" = "low";
    let detail = "";
    if (score === 0) {
      title = "Risque faible";
      level = "low";
      detail = "Mortalité ≈ 1 % : prise en charge ambulatoire envisageable.";
    } else if (score <= 2) {
      title = "Risque intermédiaire";
      level = "moderate";
      detail = "Évaluation hospitalière recommandée (hospitalisation ou surveillance rapprochée selon le contexte).";
    } else {
      title = "Risque élevé";
      level = "high";
      detail = "Mortalité ≈ 17-41 % : hospitalisation en urgence.";
    }
    return [{ title, level, scoreLabel: `${score} / 4`, detail }];
  },
  source: "Lim et al., Thorax 2003 (British Thoracic Society).",
  notes: "Version du CURB-65 sans dosage de l'urée : utile quand un bilan biologique immédiat n'est pas disponible (médecine de ville, préhospitalier).",
};
