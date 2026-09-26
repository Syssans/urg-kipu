import type { Drug } from "./types";
import { DIJON_DILUTIONS_SOURCE } from "./sources";

export const acetylsalicylateLysine: Drug = {
  id: "acetylsalicylate-lysine",
  dci: "Acétylsalicylate de lysine",
  brands: ["Aspégic"],
  aliases: ["Aspirine"],
  class: "Antiagrégant plaquettaire, AINS",
  forms: ["Lyophilisat 500 mg (flacon à reconstituer)"],
  dosage:
    "SCA : 150 mg IVD.\n" +
    "_Reconstitution : 1 flacon de 500 mg + 5 mL d'EPPI (100 mg/mL, seringue 5 mL), soit 1,5 mL pour 150 mg._",
  contraindications: [
    "Allergie aux salicylés ou intolérance aux AINS (asthme induit)",
    "Ulcère gastroduodénal évolutif",
    "Syndrome hémorragique ou risque hémorragique majeur",
    "Insuffisance rénale, hépatique ou cardiaque sévère",
  ],
  source: DIJON_DILUTIONS_SOURCE,
};
