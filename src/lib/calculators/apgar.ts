import type { Calculator } from "./types";

export const apgar: Calculator = {
  id: "apgar",
  name: "Score d'Apgar",
  shortName: "Apgar",
  category: "pediatrie",
  keywords: ["apgar", "nouveau-ne", "nouveau-né", "naissance", "adaptation neonatale", "adaptation néonatale"],
  summary: "Évaluation de l'adaptation du nouveau-né à la vie extra-utérine, habituellement à 1, 5 et 10 minutes de vie.",
  fields: [
    {
      type: "select",
      id: "time",
      label: "Moment de l'évaluation",
      options: [
        { label: "1 min", value: 1 },
        { label: "5 min", value: 5 },
        { label: "10 min", value: 10 },
      ],
    },
    {
      type: "select",
      id: "hr",
      label: "Fréquence cardiaque",
      showPoints: true,
      options: [
        { label: "Absente", value: 0 },
        { label: "< 100/min", value: 1 },
        { label: "≥ 100/min", value: 2 },
      ],
    },
    {
      type: "select",
      id: "breathing",
      label: "Respiration",
      showPoints: true,
      options: [
        { label: "Absente", value: 0 },
        { label: "Faible, irrégulière, cri faible", value: 1 },
        { label: "Bonne, cri vigoureux", value: 2 },
      ],
    },
    {
      type: "select",
      id: "tone",
      label: "Tonus musculaire",
      showPoints: true,
      options: [
        { label: "Flasque", value: 0 },
        { label: "Légère flexion des extrémités", value: 1 },
        { label: "Mouvements actifs, bonne flexion", value: 2 },
      ],
    },
    {
      type: "select",
      id: "reflex",
      label: "Réactivité (stimulation)",
      showPoints: true,
      options: [
        { label: "Aucune", value: 0 },
        { label: "Grimace", value: 1 },
        { label: "Cri vigoureux, toux, éternuement", value: 2 },
      ],
    },
    {
      type: "select",
      id: "color",
      label: "Coloration",
      showPoints: true,
      options: [
        { label: "Cyanose ou pâleur globale", value: 0 },
        { label: "Cyanose des extrémités, corps rose", value: 1 },
        { label: "Rose complet", value: 2 },
      ],
    },
  ],
  compute: (v) => (v.hr ?? 0) + (v.breathing ?? 0) + (v.tone ?? 0) + (v.reflex ?? 0) + (v.color ?? 0),
  interpret: (score, v) => {
    const time = v.time ?? 1;
    let title = "";
    let level: "low" | "moderate" | "critical" = "low";
    if (score >= 7) {
      title = "Bonne adaptation néonatale";
      level = "low";
    } else if (score >= 4) {
      title = "Détresse modérée";
      level = "moderate";
    } else {
      title = "Détresse sévère";
      level = "critical";
    }
    return [
      {
        title,
        level,
        scoreLabel: `${score} / 10 à ${time} min`,
        detail: score < 7 ? "Réévaluer à intervalle rapproché ; envisager les gestes de réanimation néonatale adaptés." : undefined,
      },
    ];
  },
  source: "Apgar V., Curr Res Anesth Analg 1953.",
};
