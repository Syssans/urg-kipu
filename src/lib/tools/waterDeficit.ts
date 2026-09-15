import type { Calculator } from "../calculators/types";

export const waterDeficit: Calculator = {
  id: "deficit-hydrique",
  name: "Déficit hydrique (hypernatrémie)",
  shortName: "Déficit hydrique",
  category: "formule",
  keywords: ["deficit hydrique", "déficit hydrique", "hypernatremie", "hypernatrémie", "deshydratation", "déshydratation", "eau", "perfusion"],
  summary: "Volume d'eau à apporter pour corriger une hypernatrémie, et rythme de correction sur 24h.",
  fields: [
    { type: "number", id: "poids", label: "Poids habituel", unit: "kg", step: 0.1 },
    { type: "number", id: "na", label: "Natrémie mesurée", unit: "mmol/L", step: 1 },
  ],
  requiredNumberFieldIds: ["poids", "na"],
  compute: (v) => {
    const poids = v.poids ?? 0;
    const na = v.na ?? 140;
    return poids * 0.6 * (na / 140 - 1);
  },
  interpret: (score) => {
    const deficit = Math.max(0, score);
    const low = deficit * 0.5;
    const high = deficit * (2 / 3);
    return [
      {
        title: "Déficit en eau estimé",
        level: "info",
        scoreLabel: `${deficit.toFixed(1)} L`,
        detail: `Volume conseillé sur les premières 24h : ${low.toFixed(1)} à ${high.toFixed(1)} L (1/2 à 2/3 du déficit) ; ajuster selon la clinique et le contrôle de l'ionogramme toutes les 6-8h. Objectif : baisse de la natrémie ≤ 2 mmol/L/h et ≤ 10-12 mmol/L/24h.`,
      },
    ];
  },
  source: "Déficit en eau (L) = poids habituel (kg) × 0,6 × [(natrémie / 140) − 1] — Collège de Néphrologie, 11ᵉ édition 2024.",
  notes: "Le coefficient 0,6 (eau corporelle totale) est une simplification usuelle ; à pondérer selon l'âge, le sexe et la corpulence dans les cas limites.",
};
