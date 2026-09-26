import type { Drug } from "./types";
import { DIJON_DILUTIONS_SOURCE } from "./sources";

export const hydrocortisone: Drug = {
  id: "hydrocortisone",
  dci: "Hémisuccinate d'hydrocortisone",
  brands: [],
  aliases: ["Hydrocortisone"],
  class: "Corticoïde",
  forms: ["Lyophilisat 100 mg avec solvant (2 mL)"],
  dosage:
    "Insuffisance surrénale aiguë : 100 mg IVD.\n" +
    "_Reconstitution : 1 flacon de 100 mg + 2 mL de solvant (50 mg/mL, seringue 2 mL)._",
  contraindications: [
    "Aucune contre-indication absolue dans l'insuffisance surrénale aiguë (urgence vitale)",
    "Hypersensibilité à l'hydrocortisone",
  ],
  source: DIJON_DILUTIONS_SOURCE,
};
