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
    { type: "number", id: "mmolL", label: "Glycémie", unit: "mmol/L", step: 0.1, placeholder: "—" },
    { type: "number", id: "gL", label: "Glycémie", unit: "g/L", step: 0.01, placeholder: "—" },
  ],
  compute: () => 0,
  interpret: (_score, v) => {
    if (v.mmolL !== undefined) {
      const gL = v.mmolL * FACTOR;
      return [{ title: `${gL.toFixed(2)} g/L`, level: "info", scoreLabel: `${v.mmolL} mmol/L` }];
    }
    if (v.gL !== undefined) {
      const mmolL = v.gL / FACTOR;
      return [{ title: `${mmolL.toFixed(1)} mmol/L`, level: "info", scoreLabel: `${v.gL} g/L` }];
    }
    return [{ title: "Saisissez une valeur", level: "info", detail: "Renseignez la glycémie dans l'une des deux unités (l'autre se calcule automatiquement)." }];
  },
  source: "Masse molaire du glucose = 180,16 g/mol (1 mmol/L = 0,18016 g/L).",
  notes: "Remplissez un seul des deux champs — l'autre est calculé automatiquement. Si les deux sont renseignés, la valeur en mmol/L est utilisée.",
};
