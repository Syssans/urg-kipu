import type { Calculator } from "./types";

export const mmrc: Calculator = {
  id: "mmrc",
  name: "Échelle mMRC de dyspnée",
  shortName: "mMRC",
  category: "respiratoire",
  keywords: ["mmrc", "mrc", "dyspnee", "dyspnée", "bpco", "essoufflement"],
  summary: "Sévérité de la dyspnée chronique (BPCO, insuffisance respiratoire), en 5 grades selon le retentissement sur l'activité.",
  fields: [
    {
      type: "select",
      id: "grade",
      label: "Grade correspondant à la situation du patient",
      options: [
        { label: "Grade 0 — Dyspnée uniquement lors d'un effort intense", value: 0 },
        { label: "Grade 1 — Dyspnée en marchant vite à plat ou en montant une pente légère", value: 1 },
        { label: "Grade 2 — Marche plus lentement qu'une personne du même âge à plat, ou doit s'arrêter pour respirer à son rythme", value: 2 },
        { label: "Grade 3 — Doit s'arrêter pour respirer après environ 100 m ou après quelques minutes de marche à plat", value: 3 },
        { label: "Grade 4 — Trop dyspnéique pour quitter le domicile, ou dyspnée en s'habillant/se déshabillant", value: 4 },
      ],
    },
  ],
  compute: (v) => v.grade ?? 0,
  interpret: (score) => {
    let title = "";
    let level: "low" | "moderate" | "high" | "critical" = "low";
    if (score <= 1) {
      title = "Dyspnée minime";
      level = "low";
    } else if (score === 2) {
      title = "Dyspnée modérée";
      level = "moderate";
    } else if (score === 3) {
      title = "Dyspnée sévère";
      level = "high";
    } else {
      title = "Dyspnée très sévère";
      level = "critical";
    }
    return [{ title, level, scoreLabel: `mMRC ${score}` }];
  },
  source: "Mahler DA, Wells CK, Chest 1988 (échelle MRC modifiée). Utilisée notamment dans la classification GOLD de la BPCO.",
};
