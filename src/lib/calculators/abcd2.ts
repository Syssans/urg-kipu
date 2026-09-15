import type { Calculator } from "./types";

export const abcd2: Calculator = {
  id: "abcd2",
  name: "Score ABCD²",
  shortName: "ABCD²",
  category: "neurologie",
  keywords: ["abcd2", "abcd", "ait", "accident ischemique transitoire", "accident ischémique transitoire", "avc"],
  summary: "Risque de survenue d'un AVC dans les 2 jours suivant un accident ischémique transitoire (AIT).",
  fields: [
    { type: "boolean", id: "age", label: "Âge ≥ 60 ans", points: 1 },
    { type: "boolean", id: "bp", label: "PA ≥ 140/90 mmHg à l'arrivée", points: 1 },
    {
      type: "select",
      id: "clinical",
      label: "Symptômes cliniques",
      showPoints: true,
      options: [
        { label: "Déficit moteur unilatéral", value: 2 },
        { label: "Trouble du langage isolé, sans déficit moteur", value: 1 },
        { label: "Autres symptômes", value: 0 },
      ],
    },
    {
      type: "select",
      id: "duration",
      label: "Durée des symptômes",
      showPoints: true,
      options: [
        { label: "≥ 60 min", value: 2 },
        { label: "10-59 min", value: 1 },
        { label: "< 10 min", value: 0 },
      ],
    },
    { type: "boolean", id: "diabetes", label: "Diabète connu", points: 1 },
  ],
  compute: (v) => (v.age ?? 0) + (v.bp ?? 0) + (v.clinical ?? 0) + (v.duration ?? 0) + (v.diabetes ?? 0),
  interpret: (score) => {
    let title = "";
    let level: "low" | "moderate" | "high" = "low";
    let detail = "";
    if (score <= 3) {
      title = "Risque faible";
      level = "low";
      detail = "Risque d'AVC à 2 jours ≈ 1 %.";
    } else if (score <= 5) {
      title = "Risque modéré";
      level = "moderate";
      detail = "Risque d'AVC à 2 jours ≈ 4 %. Avis neurovasculaire rapide recommandé.";
    } else {
      title = "Risque élevé";
      level = "high";
      detail = "Risque d'AVC à 2 jours ≈ 8 %. Hospitalisation et bilan neurovasculaire en urgence recommandés.";
    }
    return [{ title, level, scoreLabel: `${score} / 7`, detail }];
  },
  source: "Johnston SC et al., Lancet 2007.",
  notes: "Un score bas ne doit pas retarder l'avis spécialisé en cas de doute diagnostique ou de forte suspicion clinique d'AIT.",
};
