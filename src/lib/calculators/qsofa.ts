import type { Calculator } from "./types";

export const qsofa: Calculator = {
  id: "qsofa",
  name: "quick SOFA (qSOFA)",
  shortName: "qSOFA",
  category: "infectiologie",
  keywords: ["qsofa", "sepsis", "choc septique", "infection"],
  summary: "Repérage rapide au chevet d'un patient à risque de sepsis sévère en cas de suspicion d'infection.",
  fields: [
    { type: "boolean", id: "rr", label: "Fréquence respiratoire ≥ 22/min", points: 1 },
    { type: "boolean", id: "gcs", label: "Altération de la conscience (Glasgow < 15)", points: 1 },
    { type: "boolean", id: "sbp", label: "Pression artérielle systolique ≤ 100 mmHg", points: 1 },
  ],
  compute: (v) => (v.rr ?? 0) + (v.gcs ?? 0) + (v.sbp ?? 0),
  interpret: (score) => [
    {
      title: score >= 2 ? "qSOFA positif" : "qSOFA négatif",
      level: score >= 2 ? "high" : "low",
      scoreLabel: `${score} / 3`,
      detail:
        score >= 2
          ? "Risque accru de mortalité intra-hospitalière : rechercher activement un sepsis et envisager une prise en charge agressive."
          : "Ne permet pas d'exclure un sepsis : le jugement clinique reste prioritaire.",
    },
  ],
  source: "Singer et al. (Sepsis-3), JAMA 2016.",
  notes: "Outil de repérage, pas un outil diagnostique du sepsis.",
};
