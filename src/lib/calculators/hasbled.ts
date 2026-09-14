import type { Calculator } from "./types";

export const hasbled: Calculator = {
  id: "has-bled",
  name: "HAS-BLED",
  shortName: "HAS-BLED",
  category: "cardiovasculaire",
  keywords: ["has-bled", "hemorragie", "hémorragie", "anticoagulation", "fibrillation atriale"],
  summary: "Estimation du risque hémorragique sous anticoagulation chez un patient en fibrillation atriale.",
  fields: [
    { type: "boolean", id: "htn", label: "Hypertension non contrôlée (PAS > 160 mmHg)", points: 1 },
    { type: "boolean", id: "renal", label: "Fonction rénale anormale (dialyse, greffe, créatinine > 200 µmol/L)", points: 1 },
    { type: "boolean", id: "liver", label: "Fonction hépatique anormale (cirrhose, bilirubine > 2N, ASAT/ALAT/PAL > 3N)", points: 1 },
    { type: "boolean", id: "stroke", label: "Antécédent d'AVC", points: 1 },
    { type: "boolean", id: "bleeding", label: "Antécédent hémorragique ou prédisposition au saignement", points: 1 },
    { type: "boolean", id: "labileInr", label: "INR labile (si sous AVK, temps dans la cible < 60 %)", points: 1 },
    { type: "boolean", id: "elderly", label: "Âge > 65 ans", points: 1 },
    { type: "boolean", id: "drugs", label: "Médicaments favorisant le saignement (antiagrégants, AINS)", points: 1 },
    { type: "boolean", id: "alcohol", label: "Consommation d'alcool ≥ 8 unités/semaine", points: 1 },
  ],
  compute: (v) => Object.values(v).reduce((a, b) => (a ?? 0) + (b ?? 0), 0) ?? 0,
  interpret: (score) => [
    {
      title: score >= 3 ? "Risque hémorragique élevé" : "Risque hémorragique faible à modéré",
      level: score >= 3 ? "high" : "low",
      scoreLabel: `${score} / 9`,
      detail:
        score >= 3
          ? "Ne contre-indique pas l'anticoagulation mais impose une surveillance rapprochée et la correction des facteurs modifiables."
          : "Risque hémorragique acceptable pour une anticoagulation si indiquée.",
    },
  ],
  source: "Pisters et al., Chest 2010.",
};
