import type { Calculator } from "./types";

export const curb65: Calculator = {
  id: "curb65",
  name: "CURB-65",
  shortName: "CURB-65",
  category: "respiratoire",
  keywords: ["curb65", "curb-65", "pneumopathie", "pneumonie", "infection respiratoire"],
  summary: "Score de gravité d'une pneumopathie aiguë communautaire et orientation (ambulatoire/hospitalisation).",
  fields: [
    { type: "boolean", id: "confusion", label: "Confusion (désorientation nouvelle)", points: 1 },
    { type: "boolean", id: "urea", label: "Urée > 7 mmol/L (≈ 0,42 g/L)", points: 1 },
    { type: "boolean", id: "rr", label: "Fréquence respiratoire ≥ 30/min", points: 1 },
    { type: "boolean", id: "bp", label: "PAS < 90 mmHg ou PAD ≤ 60 mmHg", points: 1 },
    { type: "boolean", id: "age", label: "Âge ≥ 65 ans", points: 1 },
  ],
  compute: (v) => (v.confusion ?? 0) + (v.urea ?? 0) + (v.rr ?? 0) + (v.bp ?? 0) + (v.age ?? 0),
  interpret: (score) => {
    let title = "";
    let level: "low" | "moderate" | "high" | "critical" = "low";
    let detail = "";
    if (score <= 1) {
      title = "Risque faible";
      level = "low";
      detail = "Mortalité faible : prise en charge ambulatoire envisageable.";
    } else if (score === 2) {
      title = "Risque intermédiaire";
      level = "moderate";
      detail = "Envisager une hospitalisation courte ou une surveillance rapprochée.";
    } else if (score <= 4) {
      title = "Risque élevé";
      level = "high";
      detail = "Hospitalisation recommandée ; envisager une prise en charge en USI si score 4-5.";
    } else {
      title = "Risque très élevé";
      level = "critical";
      detail = "Hospitalisation en urgence, évaluation pour soins critiques.";
    }
    return [{ title, level, scoreLabel: `${score} / 5`, detail }];
  },
  source: "Lim et al., Thorax 2003 (British Thoracic Society).",
  notes: "En l'absence de dosage de l'urée, utiliser le CRB-65 (mêmes critères hors urée).",
};
