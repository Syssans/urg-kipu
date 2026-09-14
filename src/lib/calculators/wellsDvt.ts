import type { Calculator } from "./types";

export const wellsDvt: Calculator = {
  id: "wells-dvt",
  name: "Score de Wells — Thrombose veineuse profonde (TVP)",
  shortName: "Wells TVP",
  category: "cardiovasculaire",
  keywords: ["wells", "tvp", "thrombose veineuse profonde", "phlébite"],
  summary: "Probabilité clinique pré-test de thrombose veineuse profonde du membre inférieur.",
  fields: [
    { type: "boolean", id: "cancer", label: "Cancer actif (traitement en cours, dans les 6 derniers mois, ou palliatif)", points: 1 },
    { type: "boolean", id: "paralysis", label: "Paralysie, parésie ou immobilisation plâtrée récente d'un membre inférieur", points: 1 },
    { type: "boolean", id: "bedridden", label: "Alitement récent ≥ 3 jours ou chirurgie majeure < 12 semaines", points: 1 },
    { type: "boolean", id: "tenderness", label: "Douleur localisée sur le trajet du système veineux profond", points: 1 },
    { type: "boolean", id: "legSwelling", label: "Œdème de toute la jambe", points: 1 },
    { type: "boolean", id: "calfSwelling", label: "Augmentation du périmètre du mollet > 3 cm vs côté controlatéral", points: 1 },
    { type: "boolean", id: "pittingEdema", label: "Œdème prenant le godet, limité à la jambe symptomatique", points: 1 },
    { type: "boolean", id: "collateralVeins", label: "Veines superficielles collatérales (non variqueuses)", points: 1 },
    { type: "boolean", id: "priorDvt", label: "Antécédent de TVP documentée", points: 1 },
    { type: "boolean", id: "altDiagnosis", label: "Diagnostic alternatif au moins aussi probable que la TVP", points: -2 },
  ],
  compute: (v) =>
    (v.cancer ?? 0) +
    (v.paralysis ?? 0) +
    (v.bedridden ?? 0) +
    (v.tenderness ?? 0) +
    (v.legSwelling ?? 0) +
    (v.calfSwelling ?? 0) +
    (v.pittingEdema ?? 0) +
    (v.collateralVeins ?? 0) +
    (v.priorDvt ?? 0) -
    (v.altDiagnosis ?? 0) * 2,
  interpret: (score) => {
    let title = "";
    let level: "low" | "moderate" | "high" = "low";
    if (score <= 0) {
      title = "Probabilité clinique faible";
      level = "low";
    } else if (score <= 2) {
      title = "Probabilité clinique modérée";
      level = "moderate";
    } else {
      title = "Probabilité clinique élevée";
      level = "high";
    }
    return [{ title, level, scoreLabel: `${score} pts` }];
  },
  source: "Wells et al., N Engl J Med 2003 / Lancet 1997.",
};
