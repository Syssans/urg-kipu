import type { Calculator, Level } from "../calculators/types";

export const qtc: Calculator = {
  id: "qtc",
  name: "QT corrigé (formule de Framingham)",
  shortName: "QTc",
  category: "formule",
  keywords: ["qt", "qtc", "qt corrige", "qt corrigé", "framingham", "ecg", "torsade de pointes", "allongement du qt"],
  summary: "Calcule le QT corrigé à partir du QT mesuré et de la fréquence cardiaque, selon la formule de Framingham.",
  fields: [
    { type: "number", id: "qt", label: "QT mesuré", unit: "ms", step: 1 },
    { type: "number", id: "hr", label: "Fréquence cardiaque", unit: "/min", step: 1 },
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
  requiredNumberFieldIds: ["qt", "hr"],
  compute: (v) => {
    const qt = v.qt ?? 0;
    const hr = v.hr ?? 60;
    const rrSec = 60 / hr;
    return qt + 154 * (1 - rrSec);
  },
  interpret: (score, v) => {
    const qtc = score;
    const isFemale = (v.sex ?? 0) === 1;
    const highThreshold = isFemale ? 470 : 450;
    const borderlineThreshold = isFemale ? 450 : 430;
    const norms = "Normes : Homme ≤ 430 ms (limite 431-450), Femme ≤ 450 ms (limite 451-470). Allongé au-delà (> 450 ms chez l'homme, > 470 ms chez la femme).";

    let level: Level = "low";
    let title = "QTc normal";
    let clinicalNote: string | undefined;
    if (qtc >= 500) {
      level = "critical";
      title = "QTc très allongé";
      clinicalNote = "Risque élevé de torsades de pointes. Corriger les facteurs favorisants (hypokaliémie, hypomagnésémie, médicaments allongeant le QT), scope/surveillance rapprochée.";
    } else if (qtc > highThreshold) {
      level = "high";
      title = "QTc allongé";
      clinicalNote = "Rechercher une cause (médicamenteuse, ionique, congénitale) et éviter tout médicament bradycardisant ou allongeant le QT.";
    } else if (qtc > borderlineThreshold) {
      level = "moderate";
      title = "QTc à la limite supérieure";
    }
    const detail = clinicalNote ? `${clinicalNote} ${norms}` : norms;
    return [{ title, level, scoreLabel: `${qtc.toFixed(0)} ms`, detail }];
  },
  source: "Formule de Framingham (QTc = QT + 154 × (1 − RR), QT en ms et RR en secondes ; Sagie et al., Am J Cardiol 1992) ; seuils selon Rautaharju et al., AHA/ACCF/HRS 2009.",
  notes: "La formule de Framingham (correction linéaire) est moins dépendante de la fréquence cardiaque que celle de Bazett, qui surestime le QTc aux fréquences élevées et le sous-estime aux fréquences basses.",
};
