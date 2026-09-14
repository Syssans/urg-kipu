import type { Calculator } from "./types";

export const perc: Calculator = {
  id: "perc",
  name: "PERC Rule (Pulmonary Embolism Rule-out Criteria)",
  shortName: "PERC",
  category: "cardiovasculaire",
  keywords: ["perc", "embolie pulmonaire", "ep", "exclusion"],
  summary:
    "Permet d'exclure une embolie pulmonaire sans examen complémentaire chez un patient à faible probabilité clinique pré-test (jugement clinique).",
  fields: [
    { type: "boolean", id: "age", label: "Âge ≥ 50 ans" },
    { type: "boolean", id: "hr", label: "Fréquence cardiaque ≥ 100/min" },
    { type: "boolean", id: "spo2", label: "SpO₂ < 95 % en air ambiant" },
    { type: "boolean", id: "unilateralEdema", label: "Œdème unilatéral d'un membre" },
    { type: "boolean", id: "hemoptysis", label: "Hémoptysie" },
    { type: "boolean", id: "surgeryTrauma", label: "Chirurgie ou traumatisme récent (< 4 semaines) avec anesthésie" },
    { type: "boolean", id: "priorDvtPe", label: "Antécédent de TVP ou d'EP" },
    { type: "boolean", id: "hormones", label: "Prise d'œstrogènes (contraception, THS)" },
  ],
  compute: (v) => Object.values(v).reduce((a, b) => (a ?? 0) + (b ?? 0), 0) ?? 0,
  interpret: (score) => [
    {
      title: score === 0 ? "PERC négatif" : "PERC positif",
      level: score === 0 ? "low" : "moderate",
      scoreLabel: `${score} / 8 critère(s) positif(s)`,
      detail:
        score === 0
          ? "Chez un patient à faible probabilité clinique pré-test, une EP peut être raisonnablement exclue sans examen complémentaire."
          : "La règle PERC ne permet pas d'exclure l'EP : poursuivre les investigations (D-dimères, imagerie selon contexte).",
    },
  ],
  source: "Kline et al., J Thromb Haemost 2004.",
  notes: "À n'utiliser que chez des patients jugés à faible probabilité clinique pré-test d'EP (gestalt < 15 %).",
};
