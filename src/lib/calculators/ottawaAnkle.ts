import type { Calculator } from "./types";

export const ottawaAnkle: Calculator = {
  id: "ottawa-ankle-foot",
  name: "Règles d'Ottawa (cheville et pied)",
  shortName: "Ottawa cheville/pied",
  category: "traumatologie",
  keywords: ["ottawa", "cheville", "pied", "entorse", "radiographie"],
  summary: "Indication de radiographie après un traumatisme de la cheville ou du médio-pied.",
  fields: [
    { type: "boolean", id: "anklePainZone", label: "Douleur en zone malléolaire", group: "Cheville" },
    { type: "boolean", id: "lateralMalleolus", label: "Douleur à la palpation du bord postérieur ou de la pointe de la malléole externe (6 derniers cm)", group: "Cheville" },
    { type: "boolean", id: "medialMalleolus", label: "Douleur à la palpation du bord postérieur ou de la pointe de la malléole interne (6 derniers cm)", group: "Cheville" },
    { type: "boolean", id: "ankleWeightBearing", label: "Incapacité à se mettre en appui (4 pas) immédiatement après le traumatisme ET aux urgences", group: "Cheville" },
    { type: "boolean", id: "footPainZone", label: "Douleur médio-pied", group: "Pied" },
    { type: "boolean", id: "fifthMetatarsal", label: "Douleur à la palpation de la base du 5ᵉ métatarsien", group: "Pied" },
    { type: "boolean", id: "navicular", label: "Douleur à la palpation de l'os naviculaire", group: "Pied" },
    { type: "boolean", id: "footWeightBearing", label: "Incapacité à se mettre en appui (4 pas), immédiatement ou aux urgences", group: "Pied" },
  ],
  compute: (v) => Object.values(v).reduce((a, b) => (a ?? 0) + (b ?? 0), 0) ?? 0,
  interpret: (_score, v) => {
    const ankleGate = (v.anklePainZone ?? 0) === 1;
    const ankleCriteria = (v.lateralMalleolus ?? 0) + (v.medialMalleolus ?? 0) + (v.ankleWeightBearing ?? 0) > 0;
    const ankleXray = ankleGate && ankleCriteria;

    const footGate = (v.footPainZone ?? 0) === 1;
    const footCriteria = (v.fifthMetatarsal ?? 0) + (v.navicular ?? 0) + (v.footWeightBearing ?? 0) > 0;
    const footXray = footGate && footCriteria;

    const results = [];
    results.push({
      title: !ankleGate ? "Cheville : règle non applicable" : ankleXray ? "Cheville : radiographie indiquée" : "Cheville : radiographie non indiquée",
      level: !ankleGate ? ("info" as const) : ankleXray ? ("high" as const) : ("low" as const),
      detail: !ankleGate ? "Cochez « douleur en zone malléolaire » pour appliquer la règle." : undefined,
    });
    results.push({
      title: !footGate ? "Pied : règle non applicable" : footXray ? "Pied : radiographie indiquée" : "Pied : radiographie non indiquée",
      level: !footGate ? ("info" as const) : footXray ? ("high" as const) : ("low" as const),
      detail: !footGate ? "Cochez « douleur médio-pied » pour appliquer la règle." : undefined,
    });
    return results;
  },
  source: "Stiell et al., JAMA 1993 / BMJ 2003.",
  notes: "Non validées chez l'enfant < 18 ans dans la version originale (utiliser avec prudence, certaines validations pédiatriques existent).",
};
