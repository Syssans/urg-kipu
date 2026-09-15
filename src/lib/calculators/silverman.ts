import type { Calculator } from "./types";

export const silverman: Calculator = {
  id: "silverman",
  name: "Score de Silverman-Andersen",
  shortName: "Silverman",
  category: "pediatrie",
  keywords: ["silverman", "andersen", "detresse respiratoire", "détresse respiratoire", "nouveau-ne", "nouveau-né", "neonatal", "néonatal"],
  summary: "Sévérité d'une détresse respiratoire néonatale, à partir de 5 signes cliniques (contrairement à l'Apgar, un score élevé est péjoratif).",
  fields: [
    {
      type: "select",
      id: "thoracoAbdo",
      label: "Balancement thoraco-abdominal",
      showPoints: true,
      options: [
        { label: "Synchrone (respiration en bloc)", value: 0 },
        { label: "Léger décalage thorax/abdomen", value: 1 },
        { label: "Balancement (mouvement paradoxal)", value: 2 },
      ],
    },
    {
      type: "select",
      id: "intercostal",
      label: "Tirage intercostal",
      showPoints: true,
      options: [
        { label: "Absent", value: 0 },
        { label: "Modéré", value: 1 },
        { label: "Intense", value: 2 },
      ],
    },
    {
      type: "select",
      id: "xiphoid",
      label: "Entonnoir xiphoïdien",
      showPoints: true,
      options: [
        { label: "Absent", value: 0 },
        { label: "Modéré", value: 1 },
        { label: "Intense", value: 2 },
      ],
    },
    {
      type: "select",
      id: "flaring",
      label: "Battement des ailes du nez",
      showPoints: true,
      options: [
        { label: "Absent", value: 0 },
        { label: "Modéré", value: 1 },
        { label: "Intense", value: 2 },
      ],
    },
    {
      type: "select",
      id: "grunting",
      label: "Geignement expiratoire",
      showPoints: true,
      options: [
        { label: "Absent", value: 0 },
        { label: "Audible au stéthoscope seulement", value: 1 },
        { label: "Audible à l'oreille nue", value: 2 },
      ],
    },
  ],
  compute: (v) => (v.thoracoAbdo ?? 0) + (v.intercostal ?? 0) + (v.xiphoid ?? 0) + (v.flaring ?? 0) + (v.grunting ?? 0),
  interpret: (score) => {
    let title = "";
    let level: "low" | "moderate" | "high" | "critical" = "low";
    if (score === 0) {
      title = "Pas de détresse respiratoire";
      level = "low";
    } else if (score <= 3) {
      title = "Détresse respiratoire légère";
      level = "moderate";
    } else if (score <= 6) {
      title = "Détresse respiratoire modérée";
      level = "high";
    } else {
      title = "Détresse respiratoire sévère";
      level = "critical";
    }
    return [{ title, level, scoreLabel: `${score} / 10` }];
  },
  source: "Silverman WA, Andersen DH, Pediatrics 1956.",
  notes: "Attention au sens du score : contrairement à l'Apgar, plus le score de Silverman est élevé, plus la détresse respiratoire est sévère.",
};
