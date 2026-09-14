import type { Calculator } from "./types";

export const wellsPe: Calculator = {
  id: "wells-pe",
  name: "Score de Wells — Embolie pulmonaire",
  shortName: "Wells EP",
  category: "cardiovasculaire",
  keywords: ["wells", "embolie pulmonaire", "ep", "tvp"],
  summary: "Probabilité clinique pré-test d'embolie pulmonaire.",
  fields: [
    { type: "boolean", id: "dvtSigns", label: "Signes cliniques de TVP (œdème, douleur palpation trajet veineux profond)" },
    { type: "boolean", id: "altDiagnosisLess", label: "Diagnostic alternatif moins probable que l'EP" },
    { type: "boolean", id: "hr", label: "Fréquence cardiaque > 100/min" },
    { type: "boolean", id: "immobilization", label: "Immobilisation ≥ 3 jours ou chirurgie dans les 4 dernières semaines" },
    { type: "boolean", id: "priorDvtPe", label: "Antécédent de TVP ou d'EP" },
    { type: "boolean", id: "hemoptysis", label: "Hémoptysie" },
    { type: "boolean", id: "cancer", label: "Cancer actif (traitement en cours ou palliatif, dans les 6 derniers mois)" },
  ],
  compute: (v) =>
    (v.dvtSigns ?? 0) * 3 +
    (v.altDiagnosisLess ?? 0) * 3 +
    (v.hr ?? 0) * 1.5 +
    (v.immobilization ?? 0) * 1.5 +
    (v.priorDvtPe ?? 0) * 1.5 +
    (v.hemoptysis ?? 0) * 1 +
    (v.cancer ?? 0) * 1,
  interpret: (score) => {
    const threeTier =
      score < 2
        ? { title: "Probabilité clinique faible", level: "low" as const }
        : score <= 6
        ? { title: "Probabilité clinique intermédiaire", level: "moderate" as const }
        : { title: "Probabilité clinique élevée", level: "high" as const };
    const twoTier =
      score <= 4
        ? { title: "EP peu probable (≤ 4)", level: "low" as const, detail: "D-dimères recommandés en première intention." }
        : { title: "EP probable (> 4)", level: "high" as const, detail: "Imagerie (angio-TDM thoracique) recommandée d'emblée." };
    return [
      { title: threeTier.title, level: threeTier.level, scoreLabel: `${score} pts (3 classes)` },
      { title: twoTier.title, level: twoTier.level, scoreLabel: `${score} pts (2 classes)`, detail: twoTier.detail },
    ];
  },
  source: "Wells et al., Ann Intern Med 2001 / Thromb Haemost 2000.",
};
