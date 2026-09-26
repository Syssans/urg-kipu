import type { Drug } from "./types";
import { DIJON_DILUTIONS_SOURCE } from "./sources";

export const phloroglucinol: Drug = {
  id: "phloroglucinol",
  dci: "Phloroglucinol",
  brands: ["Spasfon"],
  class: "Antispasmodique musculotrope",
  forms: ["Ampoule 40 mg/0,4 mg/4 mL (phloroglucinol + triméthylphloroglucinol)"],
  dosage: "Douleur spasmodique : 1 à 2 ampoules, 3 fois par jour, en IVD _(pur, seringue 5 mL)_.",
  contraindications: ["Hypersensibilité au phloroglucinol ou aux excipients"],
  source: DIJON_DILUTIONS_SOURCE,
};
