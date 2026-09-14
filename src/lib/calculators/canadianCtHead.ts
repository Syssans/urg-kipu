import type { Calculator } from "./types";

export const canadianCtHead: Calculator = {
  id: "canadian-ct-head",
  name: "Canadian CT Head Rule",
  shortName: "CT Head Rule",
  category: "traumatologie",
  keywords: ["traumatisme crânien", "ct head", "scanner cérébral", "tdm cérébrale"],
  summary:
    "Indication de TDM cérébrale chez l'adulte après un traumatisme crânien léger (GCS 13-15).",
  fields: [
    { type: "boolean", id: "gcsBelow15At2h", label: "GCS < 15 à 2 heures post-traumatisme", group: "Risque élevé (lésion neurochirurgicale)" },
    { type: "boolean", id: "openSkullFracture", label: "Suspicion de fracture ouverte ou embarrée du crâne", group: "Risque élevé (lésion neurochirurgicale)" },
    { type: "boolean", id: "basalSkullFracture", label: "Signe de fracture de la base du crâne (hémotympan, ecchymose périorbitaire, otorrhée/rhinorrhée de LCR, signe de Battle)", group: "Risque élevé (lésion neurochirurgicale)" },
    { type: "boolean", id: "vomiting", label: "≥ 2 épisodes de vomissements", group: "Risque élevé (lésion neurochirurgicale)" },
    { type: "boolean", id: "age65", label: "Âge ≥ 65 ans", group: "Risque élevé (lésion neurochirurgicale)" },
    { type: "boolean", id: "amnesia30", label: "Amnésie avant l'impact ≥ 30 minutes", group: "Risque moyen (lésion visible au TDM)" },
    { type: "boolean", id: "dangerousMechanism", label: "Mécanisme dangereux (piéton renversé, éjection d'un véhicule, chute > 3 pieds / 5 marches)", group: "Risque moyen (lésion visible au TDM)" },
  ],
  compute: (v) => Object.values(v).reduce((a, b) => (a ?? 0) + (b ?? 0), 0) ?? 0,
  interpret: (score) => [
    {
      title: score > 0 ? "TDM cérébrale indiquée" : "TDM cérébrale non indiquée par la règle",
      level: score > 0 ? "high" : "low",
      scoreLabel: `${score} critère(s) positif(s)`,
      detail:
        score > 0
          ? "Au moins un critère positif : TDM cérébrale recommandée."
          : "Aucun critère positif : TDM cérébrale non indiquée selon cette règle (le jugement clinique reste prioritaire).",
    },
  ],
  source: "Stiell et al., Lancet 2001.",
  notes:
    "Applicable aux adultes avec traumatisme crânien léger (GCS 13-15) avec perte de connaissance, amnésie ou désorientation observée. Ne s'applique pas sous anticoagulants/antiagrégants, épilepsie connue ou trouble de la coagulation selon certaines validations — évaluer au cas par cas.",
};
