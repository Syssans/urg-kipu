import type { Calculator, Level } from "../calculators/types";

const CA_LOW = 2.2;
const CA_HIGH = 2.6;

export const correctedCalcium: Calculator = {
  id: "calcemie-corrigee",
  name: "Calcémie corrigée (albumine)",
  shortName: "Calcémie corrigée",
  category: "formule",
  keywords: ["calcemie corrigee", "calcémie corrigée", "calcium corrige", "calcium corrigé", "hypocalcemie", "hypocalcémie", "hypercalcemie", "hypercalcémie", "albumine"],
  summary: "Corrige la calcémie totale mesurée pour le niveau d'albuminémie, sans avoir besoin du calcium ionisé.",
  fields: [
    { type: "number", id: "ca", label: "Calcémie totale mesurée", unit: "mmol/L", step: 0.01 },
    { type: "number", id: "albumin", label: "Albuminémie", unit: "g/L", step: 1 },
  ],
  requiredNumberFieldIds: ["ca", "albumin"],
  compute: (v) => {
    const ca = v.ca ?? 0;
    const albumin = v.albumin ?? 40;
    return ca + 0.02 * (40 - albumin);
  },
  interpret: (score) => {
    const corrected = score;
    let level: Level = "low";
    let title = "Calcémie corrigée normale";
    let detail: string | undefined;
    if (corrected < CA_LOW) {
      level = "moderate";
      title = "Hypocalcémie";
      detail = "Rechercher paresthésies, signe de Chvostek/Trousseau ; risque d'allongement du QT si sévère.";
    } else if (corrected > CA_HIGH) {
      level = "moderate";
      title = "Hypercalcémie";
      detail = "Rechercher polyurie, troubles digestifs, confusion ; risque cardiaque si sévère (> 3,5 mmol/L).";
    }
    return [{ title, level, scoreLabel: `${corrected.toFixed(2)} mmol/L`, detail }];
  },
  source: "Ca corrigé (mmol/L) = Ca mesuré + 0,02 × (40 − albumine g/L) ; normes : 2,20-2,60 mmol/L.",
  notes: "Formule d'estimation : en cas de doute (dysprotidémie majeure, réanimation), le calcium ionisé mesuré directement reste la référence.",
};
