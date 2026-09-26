import type { Drug } from "./types";
import { DIJON_DILUTIONS_SOURCE } from "./sources";

export const cisatracurium: Drug = {
  id: "cisatracurium",
  dci: "Cisatracurium",
  brands: ["Nimbex"],
  class: "Curare non dépolarisant",
  forms: ["Ampoule 10 mg/5 mL (à conserver au réfrigérateur)"],
  dosage: "Curarisation : 0,03 à 0,15 mg/kg/h, pur (10 mg/5 mL, seringue de 5 mL).",
  contraindications: ["Hypersensibilité au cisatracurium, à l'atracurium ou à l'acide benzènesulfonique"],
  warning: "Ne jamais curariser sans sédation, analgésie et ventilation contrôlée.",
  source: DIJON_DILUTIONS_SOURCE,
};
