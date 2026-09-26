import type { Drug } from "./types";
import { DIJON_DILUTIONS_SOURCE } from "./sources";

export const noradrenaline: Drug = {
  id: "noradrenaline",
  dci: "Noradrénaline",
  brands: [],
  class: "Amine vasopressive (catécholamine)",
  forms: ["Ampoule 8 mg/4 mL"],
  dosage:
    "PSE, débit titré sur la PAM cible.\n" +
    "Sur VVP : 1/2 ampoule (4 mg soit 2 mL) + 38 mL de NaCl 0,9 % ou de G5 % (0,1 mg/mL, seringue 50 mL).\n" +
    "Sur VVC : 3 ampoules de 8 mg + 36 mL de NaCl 0,9 % ou de G5 % (0,5 mg/mL, seringue 50 mL).",
  contraindications: ["Aucune contre-indication absolue en situation de choc", "Hypersensibilité aux sulfites (selon les présentations)"],
  warning: "Voie veineuse centrale préférable ; sur VVP, veine de bon calibre avec surveillance du point de perfusion (nécrose en cas d'extravasation).",
  source: DIJON_DILUTIONS_SOURCE,
};
