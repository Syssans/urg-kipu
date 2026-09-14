import type { Calculator } from "./types";

export const cha2ds2vasc: Calculator = {
  id: "cha2ds2-vasc",
  name: "CHA₂DS₂-VASc",
  shortName: "CHA₂DS₂-VASc",
  category: "cardiovasculaire",
  keywords: ["cha2ds2-vasc", "fibrillation atriale", "fa", "avc", "anticoagulation"],
  summary: "Risque thromboembolique (AVC) chez un patient en fibrillation atriale non valvulaire.",
  fields: [
    { type: "boolean", id: "chf", label: "Insuffisance cardiaque congestive / dysfonction ventriculaire gauche", points: 1 },
    { type: "boolean", id: "htn", label: "Hypertension artérielle", points: 1 },
    {
      type: "select",
      id: "age",
      label: "Âge",
      showPoints: true,
      options: [
        { label: "< 65 ans", value: 0 },
        { label: "65-74 ans", value: 1 },
        { label: "≥ 75 ans", value: 2 },
      ],
    },
    { type: "boolean", id: "diabetes", label: "Diabète", points: 1 },
    { type: "boolean", id: "stroke", label: "AVC, AIT ou thromboembolie antérieurs", points: 2 },
    { type: "boolean", id: "vascular", label: "Maladie vasculaire (IDM, AOMI, plaque aortique)", points: 1 },
    { type: "boolean", id: "female", label: "Sexe féminin", points: 1 },
  ],
  compute: (v) =>
    (v.chf ?? 0) +
    (v.htn ?? 0) +
    (v.age ?? 0) +
    (v.diabetes ?? 0) +
    (v.stroke ?? 0) * 2 +
    (v.vascular ?? 0) +
    (v.female ?? 0),
  interpret: (score, v) => {
    const female = (v.female ?? 0) === 1;
    const riskFactorsOnly = female && score === 1;
    let title = "";
    let level: "low" | "moderate" | "high" = "low";
    let detail = "";
    if (score === 0 || riskFactorsOnly) {
      title = "Risque faible";
      level = "low";
      detail = "Anticoagulation généralement non recommandée sur ce seul critère.";
    } else if (score === 1) {
      title = "Risque faible à modéré";
      level = "moderate";
      detail = "Anticoagulation à discuter au cas par cas.";
    } else {
      title = "Risque élevé";
      level = "high";
      detail = "Anticoagulation orale recommandée sauf contre-indication.";
    }
    return [{ title, level, scoreLabel: `${score} / 9`, detail }];
  },
  source: "Lip et al., Chest 2010 ; recommandations ESC sur la fibrillation atriale.",
  notes:
    "Le sexe féminin est un modificateur de risque : isolé (score = 1 uniquement par ce critère), il ne justifie pas à lui seul une anticoagulation selon les recommandations ESC les plus récentes.",
};
