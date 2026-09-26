import type { Drug } from "./types";
import { DIJON_DILUTIONS_SOURCE } from "./sources";

export const oxytocine: Drug = {
  id: "oxytocine",
  dci: "Ocytocine",
  brands: ["Syntocinon"],
  aliases: ["Oxytocine"],
  class: "Ocytocique",
  forms: ["Ampoule 5 UI/1 mL"],
  dosage:
    "Prévention de l'hémorragie du post-partum : 5 à 10 UI en IV lente sur 1 min au moment du passage des épaules (pur, 5 UI/mL, seringue 5 mL).\n" +
    "Entretien : 2 à 8 gouttes par minute, maximum 40 gouttes par minute — 1 ampoule (5 UI) dans une poche de G5 % de 500 mL.",
  contraindications: [
    "Hypersensibilité à l'ocytocine",
    "Avant l'expulsion : disproportion fœto-pelvienne, souffrance fœtale, hypertonie utérine",
  ],
  warning: "À passer sous surveillance scopée : tachycardie, hypotension, malaise.",
  source: DIJON_DILUTIONS_SOURCE,
};
