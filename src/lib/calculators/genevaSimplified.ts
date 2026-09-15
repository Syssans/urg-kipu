import type { Calculator } from "./types";

export const genevaSimplified: Calculator = {
  id: "geneve-simplifie",
  name: "Score de Genève révisé simplifié",
  shortName: "Genève simplifié",
  category: "cardiovasculaire",
  keywords: ["geneve", "genève", "embolie pulmonaire", "ep", "wells"],
  summary: "Probabilité clinique pré-test d'embolie pulmonaire, alternative au score de Wells fondée uniquement sur des critères objectifs.",
  fields: [
    { type: "boolean", id: "age", label: "Âge > 65 ans", points: 1 },
    { type: "boolean", id: "priorDvtPe", label: "Antécédent de TVP ou d'EP", points: 1 },
    { type: "boolean", id: "surgery", label: "Chirurgie ou fracture dans le dernier mois", points: 1 },
    { type: "boolean", id: "cancer", label: "Cancer actif", points: 1 },
    { type: "boolean", id: "unilateralPain", label: "Douleur unilatérale d'un membre inférieur", points: 1 },
    { type: "boolean", id: "hemoptysis", label: "Hémoptysie", points: 1 },
    {
      type: "select",
      id: "hr",
      label: "Fréquence cardiaque",
      showPoints: true,
      options: [
        { label: "< 75/min", value: 0 },
        { label: "75-94/min", value: 1 },
        { label: "≥ 95/min", value: 2 },
      ],
    },
    { type: "boolean", id: "palpationEdema", label: "Douleur à la palpation d'un trajet veineux profond + œdème unilatéral", points: 1 },
  ],
  compute: (v) =>
    (v.age ?? 0) +
    (v.priorDvtPe ?? 0) +
    (v.surgery ?? 0) +
    (v.cancer ?? 0) +
    (v.unilateralPain ?? 0) +
    (v.hemoptysis ?? 0) +
    (v.hr ?? 0) +
    (v.palpationEdema ?? 0),
  interpret: (score) => {
    const twoTier =
      score <= 2
        ? { title: "EP peu probable (≤ 2)", level: "low" as const, detail: "D-dimères recommandés en première intention." }
        : { title: "EP probable (≥ 3)", level: "high" as const, detail: "Imagerie (angio-TDM thoracique) recommandée d'emblée." };
    return [{ title: twoTier.title, level: twoTier.level, scoreLabel: `${score} / 9`, detail: twoTier.detail }];
  },
  source: "Klok FA et al., Arch Intern Med 2008 (version simplifiée du score de Genève révisé de Le Gal G et al., Ann Intern Med 2006).",
};
