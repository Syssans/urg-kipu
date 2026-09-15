import type { Calculator } from "./types";

export const gcsPediatric: Calculator = {
  id: "gcs-pediatrique",
  name: "Score de Glasgow pédiatrique",
  shortName: "Glasgow pédiatrique",
  category: "pediatrie",
  keywords: ["glasgow", "gcs", "pediatrique", "pédiatrique", "nourrisson", "enfant", "conscience", "coma"],
  summary: "Évaluation du niveau de conscience chez le nourrisson et le jeune enfant (< 2 ans, préverbal).",
  fields: [
    {
      type: "select",
      id: "eye",
      label: "Ouverture des yeux (Y)",
      showPoints: true,
      options: [
        { label: "Spontanée", value: 4 },
        { label: "À la demande verbale", value: 3 },
        { label: "À la douleur", value: 2 },
        { label: "Absente", value: 1 },
      ],
    },
    {
      type: "select",
      id: "verbal",
      label: "Réponse verbale (V)",
      showPoints: true,
      options: [
        { label: "Gazouille, babille normalement", value: 5 },
        { label: "Pleurs irritables, consolables", value: 4 },
        { label: "Pleurs inappropriés à la douleur", value: 3 },
        { label: "Gémit à la douleur", value: 2 },
        { label: "Absente", value: 1 },
      ],
    },
    {
      type: "select",
      id: "motor",
      label: "Réponse motrice (M)",
      showPoints: true,
      options: [
        { label: "Mouvements spontanés normaux", value: 6 },
        { label: "Retrait au toucher", value: 5 },
        { label: "Retrait à la douleur", value: 4 },
        { label: "Flexion anormale (décortication)", value: 3 },
        { label: "Extension anormale (décérébration)", value: 2 },
        { label: "Absente", value: 1 },
      ],
    },
  ],
  compute: (v) => (v.eye ?? 0) + (v.verbal ?? 0) + (v.motor ?? 0),
  interpret: (score) => {
    let title = "";
    let level: "low" | "moderate" | "critical" = "low";
    if (score >= 13) {
      title = "Traumatisme crânien léger";
      level = "low";
    } else if (score >= 9) {
      title = "Traumatisme crânien modéré";
      level = "moderate";
    } else {
      title = "Traumatisme crânien sévère";
      level = "critical";
    }
    return [
      {
        title,
        level,
        scoreLabel: `${score} / 15`,
        detail:
          score <= 8
            ? "GCS ≤ 8 : protection des voies aériennes à envisager (intubation)."
            : "Surveillance neurologique rapprochée recommandée.",
      },
    ];
  },
  source: "Adaptation pédiatrique de Teasdale & Jennett (Lancet 1974), James HE, Pediatric Head Injury 1986.",
  notes: "Utilisée principalement chez le nourrisson et l'enfant préverbal (< 2 ans) ; au-delà, le score de Glasgow adulte est généralement utilisable.",
};
