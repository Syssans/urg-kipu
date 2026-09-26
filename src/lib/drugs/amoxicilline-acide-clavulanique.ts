import type { Drug } from "./types";
import { DIJON_DILUTIONS_SOURCE } from "./sources";

export const amoxicillineAcideClavulanique: Drug = {
  id: "amoxicilline-acide-clavulanique",
  dci: "Amoxicilline / acide clavulanique",
  brands: ["Augmentin"],
  class: "Antibiotique (pénicilline + inhibiteur de bêtalactamase)",
  forms: ["Lyophilisat 2 g pour perfusion IV (adulte)"],
  dosage: "Fracture ouverte, inhalation : 2 g en perfusion IV sur 30 min _(2 g dans une poche de 100 mL de NaCl 0,9 %)_.",
  contraindications: [
    "Allergie aux pénicillines",
    "Antécédent de réaction allergique grave à une autre bêtalactamine",
    "Antécédent d'atteinte hépatique ou d'ictère lié à l'amoxicilline-acide clavulanique",
  ],
  source: DIJON_DILUTIONS_SOURCE,
};
