import type { Calculator, Level } from "../calculators/types";

export const bmi: Calculator = {
  id: "imc",
  name: "Indice de masse corporelle (IMC)",
  shortName: "IMC",
  category: "formule",
  keywords: ["imc", "bmi", "poids", "taille", "masse corporelle", "obesite", "obésité", "corpulence"],
  summary: "Calcule l'indice de masse corporelle à partir du poids et de la taille.",
  fields: [
    { type: "number", id: "poids", label: "Poids", unit: "kg", step: 0.1 },
    { type: "number", id: "taille", label: "Taille", unit: "cm", step: 1 },
  ],
  requiredNumberFieldIds: ["poids", "taille"],
  compute: (v) => {
    const poids = v.poids ?? 0;
    const tailleM = (v.taille ?? 0) / 100;
    return tailleM > 0 ? poids / (tailleM * tailleM) : 0;
  },
  interpret: (score) => {
    const imc = score;
    let level: Level = "low";
    let title = "Corpulence normale";
    if (imc < 16) {
      level = "critical";
      title = "Maigreur sévère";
    } else if (imc < 18.5) {
      level = "moderate";
      title = "Maigreur";
    } else if (imc < 25) {
      level = "low";
      title = "Corpulence normale";
    } else if (imc < 30) {
      level = "moderate";
      title = "Surpoids";
    } else if (imc < 35) {
      level = "high";
      title = "Obésité modérée";
    } else if (imc < 40) {
      level = "high";
      title = "Obésité sévère";
    } else {
      level = "critical";
      title = "Obésité massive";
    }
    return [{ title, level, scoreLabel: `${imc.toFixed(1)} kg/m²` }];
  },
  source: "Classification de l'indice de masse corporelle, Organisation mondiale de la santé.",
};
