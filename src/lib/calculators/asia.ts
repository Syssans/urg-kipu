import type { Calculator, Values } from "./types";

function showSacral(v: Values): boolean {
  return (v.normalAll ?? 0) === 0;
}
function showMotor(v: Values): boolean {
  return showSacral(v) && (v.sacralSparing ?? 0) === 1;
}
function showHalfAbove3(v: Values): boolean {
  return showMotor(v) && (v.motorPreserved ?? 0) === 1;
}

export const asia: Calculator = {
  id: "asia",
  name: "Échelle de déficience ASIA (AIS)",
  shortName: "ASIA",
  category: "traumatologie",
  keywords: ["asia", "moelle", "medullaire", "médullaire", "rachis", "paraplegie", "paraplégie", "tetraplegie", "tétraplégie"],
  summary: "Classification simplifiée du caractère complet ou incomplet d'une lésion médullaire (grade AIS A à E).",
  fields: [
    { type: "boolean", id: "normalAll", label: "Fonctions motrice et sensitive strictement normales, à tous les niveaux" },
    {
      type: "boolean",
      id: "sacralSparing",
      label: "Sensibilité ou contraction anale volontaire préservée en S4-S5 (sensibilité péri-anale, contraction sphinctérienne)",
      visibleIf: showSacral,
    },
    {
      type: "boolean",
      id: "motorPreserved",
      label: "Fonction motrice volontaire préservée sous le niveau lésionnel (plus de 3 niveaux sous le niveau moteur)",
      visibleIf: showMotor,
    },
    {
      type: "boolean",
      id: "halfAbove3",
      label: "Plus de la moitié des muscles clés sous le niveau lésionnel cotés ≥ 3/5",
      visibleIf: showHalfAbove3,
    },
  ],
  compute: (v) => {
    if ((v.normalAll ?? 0) === 1) return 4;
    if ((v.sacralSparing ?? 0) === 0) return 0;
    if ((v.motorPreserved ?? 0) === 0) return 1;
    if ((v.halfAbove3 ?? 0) === 0) return 2;
    return 3;
  },
  interpret: (score) => {
    const grades = [
      { title: "ASIA A — Lésion complète", level: "critical" as const, detail: "Aucune fonction motrice ni sensitive préservée dans les segments sacrés S4-S5." },
      { title: "ASIA B — Incomplète, sensitive", level: "high" as const, detail: "Sensibilité préservée mais pas de fonction motrice volontaire sous le niveau lésionnel." },
      { title: "ASIA C — Incomplète, motrice", level: "moderate" as const, detail: "Fonction motrice préservée, mais plus de la moitié des muscles clés sous le niveau lésionnel cotés < 3/5." },
      { title: "ASIA D — Incomplète, motrice", level: "moderate" as const, detail: "Fonction motrice préservée, au moins la moitié des muscles clés sous le niveau lésionnel cotés ≥ 3/5." },
      { title: "ASIA E — Normal", level: "low" as const, detail: "Fonctions motrice et sensitive normales." },
    ];
    const grade = grades[score];
    return [{ title: grade.title, level: grade.level, detail: grade.detail }];
  },
  source: "American Spinal Injury Association — International Standards for Neurological Classification of Spinal Cord Injury (ISNCSCI) ; Kirshblum S et al., J Spinal Cord Med 2011.",
  notes: "Version simplifiée pour orientation rapide : le grading officiel repose sur un examen segmentaire complet (10 myotomes et 28 dermatomes de chaque côté), à réaliser pour une classification précise ou un suivi.",
};
