import type { Calculator } from "./types";

function opts(labels: [string, string, string, string]) {
  return labels.map((label, value) => ({ label, value }));
}

export const cushman: Calculator = {
  id: "cushman",
  name: "Échelle de Cushman",
  shortName: "Cushman",
  category: "neurologie",
  keywords: ["cushman", "sevrage alcoolique", "delirium tremens", "alcool", "sevrage"],
  summary: "Sévérité du syndrome de sevrage alcoolique, pour guider la surveillance et le traitement (benzodiazépines).",
  fields: [
    {
      type: "select",
      id: "pulse",
      label: "Pouls",
      showPoints: true,
      options: opts(["< 80/min", "80–100/min", "101–120/min", "> 120/min"]),
    },
    {
      type: "select",
      id: "sbp",
      label: "Pression artérielle systolique",
      showPoints: true,
      options: opts(["< 135 mmHg", "135–145 mmHg", "146–155 mmHg", "> 155 mmHg"]),
    },
    {
      type: "select",
      id: "rr",
      label: "Fréquence respiratoire",
      showPoints: true,
      options: opts(["< 16/min", "16–24/min", "25–30/min", "> 30/min"]),
    },
    {
      type: "select",
      id: "tremor",
      label: "Tremblements",
      showPoints: true,
      options: opts(["Absents", "Discrets (bout des doigts)", "Modérés (bras tendus)", "Sévères, même au repos"]),
    },
    {
      type: "select",
      id: "sweating",
      label: "Sueurs",
      showPoints: true,
      options: opts(["Absentes", "Discrètes (paumes moites)", "Modérées (front moite)", "Profuses"]),
    },
    {
      type: "select",
      id: "agitation",
      label: "Agitation",
      showPoints: true,
      options: opts(["Absente", "Légère", "Modérée", "Agitation motrice sévère"]),
    },
    {
      type: "select",
      id: "perception",
      label: "Troubles perceptifs (hallucinations)",
      showPoints: true,
      options: opts(["Absents", "Légers (prurit, paresthésies)", "Modérés, critiqués", "Sévères, permanents, non critiqués"]),
    },
  ],
  compute: (v) =>
    (v.pulse ?? 0) + (v.sbp ?? 0) + (v.rr ?? 0) + (v.tremor ?? 0) + (v.sweating ?? 0) + (v.agitation ?? 0) + (v.perception ?? 0),
  interpret: (score) => {
    let title = "";
    let level: "low" | "moderate" | "high" = "low";
    let detail = "";
    if (score < 7) {
      title = "Sevrage mineur";
      level = "low";
      detail = "Surveillance simple ; réévaluer régulièrement.";
    } else if (score < 15) {
      title = "Sevrage modéré";
      level = "moderate";
      detail = "Benzodiazépines recommandées ; surveillance rapprochée.";
    } else {
      title = "Sevrage sévère";
      level = "high";
      detail = "Risque de delirium tremens/convulsions ; benzodiazépines à dose élevée et surveillance rapprochée (hospitalisation à envisager).";
    }
    return [{ title, level, scoreLabel: `${score} / 21`, detail }];
  },
  source: "Cushman P et al., Am J Med. 1985.",
  notes: "Score à répéter régulièrement pour adapter le traitement ; ne remplace pas l'examen clinique (recherche de complications : convulsions, delirium tremens, troubles ioniques).",
};
