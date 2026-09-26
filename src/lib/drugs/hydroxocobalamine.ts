import type { Drug } from "./types";
import { DIJON_DILUTIONS_SOURCE } from "./sources";

export const hydroxocobalamine: Drug = {
  id: "hydroxocobalamine",
  dci: "Hydroxocobalamine",
  brands: ["Cyanokit"],
  class: "Antidote des intoxications à l'acide cyanhydrique",
  forms: ["Lyophilisat 5 g (flacon avec dispositif de transfert et perfuseur muni d'un filtre)"],
  dosage:
    "Adulte : 5 g (1 flacon) en perfusion IV sur 15 min, ± dose supplémentaire de 5 g.\n" +
    "Enfant : 70 mg/kg (maximum 5 g), ± dose supplémentaire (maximum 5 g).\n" +
    "Préparation : 1 flacon (5 g) + 200 mL de NaCl 0,9 % ; mélanger par retournement, ne pas agiter.",
  contraindications: ["Aucune contre-indication absolue en cas d'intoxication cyanhydrique avérée ou fortement suspectée"],
  warning: "Colore la peau, les urines et le sérum en rouge et peut fausser les dosages biologiques colorimétriques : prélever avant l'administration si possible.",
  source: DIJON_DILUTIONS_SOURCE,
};
