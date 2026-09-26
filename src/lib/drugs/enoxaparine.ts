import type { Drug } from "./types";
import { DIJON_DILUTIONS_SOURCE } from "./sources";

export const enoxaparine: Drug = {
  id: "enoxaparine",
  dci: "Énoxaparine sodique",
  brands: ["Lovenox"],
  aliases: ["Énoxaparine"],
  class: "Héparine de bas poids moléculaire (anticoagulant)",
  forms: ["Flacon 30 000 UI anti-Xa/3 mL"],
  dosage:
    "EP / TVP : 100 UI/kg en SC.\n" +
    "SCA : 50 UI/kg en IVD ; en cas de thrombolyse : 3 000 UI.\n" +
    "Préparation : prélever dans le flacon la dose nécessaire avec une seringue de 1 mL.",
  contraindications: [
    "Insuffisance rénale sévère (adapter la dose ou préférer l'héparine non fractionnée)",
    "Hémorragie active ou lésion à risque hémorragique",
    "Antécédent de thrombopénie induite par l'héparine",
    "Hypersensibilité à l'énoxaparine",
  ],
  source: DIJON_DILUTIONS_SOURCE,
};
