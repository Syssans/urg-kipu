import type { Calculator } from "../calculators/types";

// Masse molaire du glucose = 180,16 g/mol, donc 1 mmol/L = 0,18016 g/L.
const FACTOR = 0.18016;

export const glycemiaConversion: Calculator = {
  id: "conv-glycemie",
  name: "Conversion glycémie mmol/L ↔ g/L",
  shortName: "Glycémie",
  category: "conversion",
  keywords: ["glycemie", "glycémie", "glucose", "conversion", "mmol", "g/l", "sucre"],
  summary: "Convertit une glycémie entre mmol/L (unité SI) et g/L (unité encore courante en France).",
  fields: [
    { type: "number", id: "mmolL", label: "mmol/L", step: 0.1, placeholder: "—", compact: true },
    { type: "number", id: "gL", label: "g/L", step: 0.01, placeholder: "—", compact: true },
  ],
  compute: () => 0,
  interpret: (_score, v) => {
    if (v.mmolL !== undefined) {
      const gL = v.mmolL * FACTOR;
      return [{ title: "Équivalent en g/L", level: "info", scoreLabel: `${gL.toFixed(2)} g/L`, detail: `${v.mmolL} mmol/L saisi.` }];
    }
    if (v.gL !== undefined) {
      const mmolL = v.gL / FACTOR;
      return [{ title: "Équivalent en mmol/L", level: "info", scoreLabel: `${mmolL.toFixed(1)} mmol/L`, detail: `${v.gL} g/L saisi.` }];
    }
    return [{ title: "Saisissez une valeur", level: "info", detail: "Renseignez la glycémie dans l'une des deux unités (l'autre se calcule automatiquement)." }];
  },
  source: "Masse molaire du glucose = 180,16 g/mol (1 mmol/L = 0,18016 g/L).",
  notes: "Remplissez un seul des deux champs — l'autre est calculé automatiquement. Si les deux sont renseignés, la valeur en mmol/L est utilisée.",
};
