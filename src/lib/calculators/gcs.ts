import type { Calculator } from "./types";

export const gcs: Calculator = {
  id: "gcs",
  name: "Score de Glasgow (GCS)",
  shortName: "Glasgow",
  category: "neurologie",
  keywords: ["glasgow", "gcs", "conscience", "coma", "trauma crânien"],
  summary: "Évaluation du niveau de conscience (ouverture des yeux, réponse verbale, réponse motrice).",
  fields: [
    {
      type: "select",
      id: "eye",
      label: "Ouverture des yeux (Y)",
      options: [
        { label: "Spontanée — 4", value: 4 },
        { label: "À la demande verbale — 3", value: 3 },
        { label: "À la douleur — 2", value: 2 },
        { label: "Absente — 1", value: 1 },
      ],
    },
    {
      type: "select",
      id: "verbal",
      label: "Réponse verbale (V)",
      options: [
        { label: "Orientée — 5", value: 5 },
        { label: "Confuse — 4", value: 4 },
        { label: "Mots inappropriés — 3", value: 3 },
        { label: "Sons incompréhensibles — 2", value: 2 },
        { label: "Absente — 1", value: 1 },
      ],
    },
    {
      type: "select",
      id: "motor",
      label: "Réponse motrice (M)",
      options: [
        { label: "Obéit aux ordres — 6", value: 6 },
        { label: "Orientée à la douleur — 5", value: 5 },
        { label: "Évitement/retrait à la douleur — 4", value: 4 },
        { label: "Flexion anormale (décortication) — 3", value: 3 },
        { label: "Extension anormale (décérébration) — 2", value: 2 },
        { label: "Absente — 1", value: 1 },
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
  source: "Teasdale & Jennett, Lancet 1974.",
};
