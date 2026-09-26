import type { Drug } from "./types";
import { DIJON_DILUTIONS_SOURCE } from "./sources";

export const heparine: Drug = {
  id: "heparine",
  dci: "Héparine sodique",
  brands: [],
  aliases: ["Héparine"],
  class: "Anticoagulant",
  forms: ["Flacon 25 000 UI/5 mL"],
  dosage:
    "Anticoagulation à la seringue électrique : posologie selon le protocole du service (bolus puis débit ajusté sur le TCA ou l'anti-Xa).\n" +
    "_Préparation : prélever 5 mL (25 000 UI) et compléter à 50 mL avec du NaCl 0,9 % (500 UI/mL, seringue 50 mL)._",
  contraindications: [
    "Hémorragie active ou lésion à risque hémorragique",
    "Antécédent de thrombopénie induite par l'héparine",
    "Hémorragie intracrânienne récente",
    "Hypersensibilité à l'héparine",
  ],
  source: DIJON_DILUTIONS_SOURCE,
};
