import type { Calculator, Level } from "../calculators/types";

export const creatinineClearance: Calculator = {
  id: "clairance-creatinine",
  name: "Clairance de la créatinine (Cockcroft-Gault)",
  shortName: "Clairance créat.",
  category: "formule",
  keywords: ["clairance", "creatinine", "créatinine", "cockcroft", "gault", "fonction renale", "fonction rénale", "insuffisance renale", "insuffisance rénale"],
  summary: "Estime le débit de filtration glomérulaire à partir de l'âge, du poids, du sexe et de la créatininémie.",
  fields: [
    { type: "number", id: "age", label: "Âge", unit: "ans", step: 1 },
    { type: "number", id: "weight", label: "Poids", unit: "kg", step: 0.1 },
    { type: "number", id: "creatinine", label: "Créatininémie", unit: "µmol/L", step: 1 },
    {
      type: "select",
      id: "sex",
      label: "Sexe",
      options: [
        { label: "Homme", value: 0 },
        { label: "Femme", value: 1 },
      ],
    },
  ],
  requiredNumberFieldIds: ["age", "weight", "creatinine"],
  compute: (v) => {
    const age = v.age ?? 0;
    const weight = v.weight ?? 0;
    const creatinine = v.creatinine ?? 0;
    const k = (v.sex ?? 0) === 1 ? 1.04 : 1.23;
    return creatinine > 0 ? ((140 - age) * weight * k) / creatinine : 0;
  },
  interpret: (score) => {
    const clairance = score;
    let level: Level = "low";
    let title = "Fonction rénale normale";
    if (clairance < 15) {
      level = "critical";
      title = "Insuffisance rénale terminale";
    } else if (clairance < 30) {
      level = "critical";
      title = "Insuffisance rénale sévère";
    } else if (clairance < 60) {
      level = "high";
      title = "Insuffisance rénale modérée";
    } else if (clairance < 90) {
      level = "moderate";
      title = "Insuffisance rénale légère";
    }
    return [{ title, level, scoreLabel: `${Math.round(clairance)} mL/min` }];
  },
  source: "Cockcroft DW, Gault MH, Nephron 1976.",
  notes: "Formule de Cockcroft-Gault : ((140 − âge) × poids × k) / créatininémie, k = 1,23 (homme) ou 1,04 (femme). Moins fiable en cas de poids extrême (obésité, dénutrition), d'âge très avancé ou de fonction rénale rapidement évolutive : préférer le DFG estimé par CKD-EPI si disponible.",
};
