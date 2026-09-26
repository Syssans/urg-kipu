import type { Drug } from "./types";
import { DIJON_DILUTIONS_SOURCE } from "./sources";

export const nimodipine: Drug = {
  id: "nimodipine",
  dci: "Nimodipine",
  brands: ["Nimotop"],
  class: "Inhibiteur calcique (vasodilatateur cérébral)",
  forms: ["Flacon 10 mg/50 mL (0,2 mg/mL)"],
  dosage:
    "Contrôle tensionnel en contexte crânien : 0,5 à 2 mg/h au PSE.\n" +
    "_Préparation : 1 ampoule de 10 mg dans une seringue de 50 mL, pure (0,2 mg/mL)._",
  contraindications: ["Hypotension artérielle sévère", "Hypersensibilité à la nimodipine"],
  warning: "Solution contenant de l'éthanol : respecter les précautions du RCP concernant la voie d'administration et le matériel de perfusion.",
  source: DIJON_DILUTIONS_SOURCE,
};
