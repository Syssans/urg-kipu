import type { Calculator } from "./types";

export const spesi: Calculator = {
  id: "spesi",
  name: "sPESI — Pulmonary Embolism Severity Index simplifié",
  shortName: "sPESI",
  category: "cardiovasculaire",
  keywords: ["spesi", "pesi", "embolie pulmonaire", "ep", "pronostic", "ambulatoire"],
  summary: "Pronostic d'une embolie pulmonaire confirmée : identifie les patients à faible risque, éligibles à une prise en charge ambulatoire.",
  fields: [
    { type: "boolean", id: "age", label: "Âge > 80 ans", points: 1 },
    { type: "boolean", id: "cancer", label: "Antécédent de cancer", points: 1 },
    { type: "boolean", id: "chronicDisease", label: "Insuffisance cardiaque chronique ou maladie respiratoire chronique", points: 1 },
    { type: "boolean", id: "hr", label: "Fréquence cardiaque ≥ 110/min", points: 1 },
    { type: "boolean", id: "sbp", label: "Pression artérielle systolique < 100 mmHg", points: 1 },
    { type: "boolean", id: "spo2", label: "SpO₂ < 90 %", points: 1 },
  ],
  compute: (v) => (v.age ?? 0) + (v.cancer ?? 0) + (v.chronicDisease ?? 0) + (v.hr ?? 0) + (v.sbp ?? 0) + (v.spo2 ?? 0),
  interpret: (score) => [
    {
      title: score === 0 ? "Faible risque" : "Risque non faible",
      level: score === 0 ? "low" : "high",
      scoreLabel: `${score} / 6`,
      detail:
        score === 0
          ? "Mortalité à 30 jours ≈ 1 %. Prise en charge ambulatoire envisageable si contexte psychosocial favorable."
          : "Mortalité à 30 jours ≈ 10 %. Hospitalisation recommandée.",
    },
  ],
  source: "Jiménez D et al., Arch Intern Med 2010.",
};
