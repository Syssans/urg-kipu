import type { Calculator } from "./types";

function tier(value: number | undefined, low: number, high: number): number {
  const v = value ?? 0;
  if (v < low) return 1;
  if (v <= high) return 2;
  return 3;
}

// Higher INR/bilirubin is worse (ascending tiers); higher albumin is better
// (descending tiers), hence the reversed comparison here.
function tierDesc(value: number | undefined, high: number, low: number): number {
  const v = value ?? 0;
  if (v > high) return 1;
  if (v >= low) return 2;
  return 3;
}

export const childPugh: Calculator = {
  id: "child-pugh",
  name: "Score de Child-Pugh",
  shortName: "Child-Pugh",
  category: "digestif",
  keywords: ["child pugh", "child-pugh", "cirrhose", "insuffisance hepatique", "insuffisance hépatique", "hepatopathie", "hépatopathie"],
  summary: "Sévérité d'une cirrhose et pronostic, à partir de 3 paramètres biologiques et 2 critères cliniques.",
  fields: [
    { type: "number", id: "bilirubin", label: "Bilirubine totale", unit: "µmol/L", step: 1 },
    { type: "number", id: "albumin", label: "Albuminémie", unit: "g/L", step: 1 },
    { type: "number", id: "inr", label: "INR", step: 0.01 },
    {
      type: "select",
      id: "ascites",
      label: "Ascite",
      showPoints: true,
      options: [
        { label: "Absente", value: 1 },
        { label: "Légère à modérée (contrôlée par traitement)", value: 2 },
        { label: "Abondante ou réfractaire", value: 3 },
      ],
    },
    {
      type: "select",
      id: "encephalopathy",
      label: "Encéphalopathie hépatique",
      showPoints: true,
      options: [
        { label: "Absente", value: 1 },
        { label: "Grade I-II (confusion légère)", value: 2 },
        { label: "Grade III-IV (coma)", value: 3 },
      ],
    },
  ],
  requiredNumberFieldIds: ["bilirubin", "albumin", "inr"],
  compute: (v) =>
    tier(v.bilirubin, 34, 50) + tierDesc(v.albumin, 35, 28) + tier(v.inr, 1.7, 2.3) + (v.ascites ?? 1) + (v.encephalopathy ?? 1),
  interpret: (score) => {
    let title = "";
    let level: "low" | "moderate" | "high" = "low";
    let detail = "";
    if (score <= 6) {
      title = "Child-Pugh A : cirrhose compensée";
      level = "low";
      detail = "Survie estimée à 1 an ≈ 100 %, à 2 ans ≈ 85 %.";
    } else if (score <= 9) {
      title = "Child-Pugh B : atteinte significative";
      level = "moderate";
      detail = "Survie estimée à 1 an ≈ 80 %, à 2 ans ≈ 60 %. Discuter une évaluation pour transplantation hépatique.";
    } else {
      title = "Child-Pugh C : cirrhose décompensée";
      level = "high";
      detail = "Survie estimée à 1 an ≈ 45 %, à 2 ans ≈ 35 %. Prise en charge spécialisée et évaluation pour transplantation.";
    }
    return [{ title, level, scoreLabel: `${score} / 15`, detail }];
  },
  source: "Pugh RN et al., Br J Surg. 1973.",
  notes: "Le score MELD est aujourd'hui préféré pour la priorisation en transplantation, mais Child-Pugh reste largement utilisé pour évaluer le pronostic global et la tolérance aux traitements/interventions.",
};
