import type { Calculator } from "./types";

export const wellsPe: Calculator = {
  id: "wells-pe",
  name: "Score de Wells — Embolie pulmonaire",
  shortName: "Wells EP",
  category: "cardiovasculaire",
  keywords: ["wells", "embolie pulmonaire", "ep", "tvp"],
  summary: "Probabilité clinique pré-test d'embolie pulmonaire.",
  fields: [
    { type: "boolean", id: "dvtSigns", label: "Signes cliniques de TVP (œdème, douleur palpation trajet veineux profond)", points: 3 },
    { type: "boolean", id: "altDiagnosisLess", label: "Diagnostic alternatif moins probable que l'EP", points: 3 },
    { type: "boolean", id: "hr", label: "Fréquence cardiaque > 100/min", points: 1.5 },
    { type: "boolean", id: "immobilization", label: "Immobilisation ≥ 3 jours ou chirurgie dans les 4 dernières semaines", points: 1.5 },
    { type: "boolean", id: "priorDvtPe", label: "Antécédent de TVP ou d'EP", points: 1.5 },
    { type: "boolean", id: "hemoptysis", label: "Hémoptysie", points: 1 },
    { type: "boolean", id: "cancer", label: "Cancer actif (traitement en cours ou palliatif, dans les 6 derniers mois)", points: 1 },
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
    const twoTier =
      score <= 4
        ? { title: "EP peu probable (≤ 4)", level: "low" as const, detail: "D-dimères recommandés en première intention." }
        : { title: "EP probable (> 4)", level: "high" as const, detail: "Imagerie (angio-TDM thoracique) recommandée d'emblée." };
    return [{ title: twoTier.title, level: twoTier.level, scoreLabel: `${score} pts`, detail: twoTier.detail }];
  },
  source: "Wells et al., Ann Intern Med 2001 / Thromb Haemost 2000.",
};
