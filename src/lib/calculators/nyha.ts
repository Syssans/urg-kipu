import type { Calculator } from "./types";

export const nyha: Calculator = {
  id: "nyha",
  name: "Classification NYHA (insuffisance cardiaque)",
  shortName: "NYHA",
  category: "cardiovasculaire",
  keywords: ["nyha", "new york heart association", "insuffisance cardiaque", "dyspnee", "dyspnée", "classe fonctionnelle"],
  summary: "Classe fonctionnelle d'un patient insuffisant cardiaque, selon la gêne occasionnée par l'activité physique.",
  fields: [
    {
      type: "select",
      id: "class",
      label: "Classe correspondant à la situation du patient",
      options: [
        { label: "Classe I — Aucune limitation : l'activité physique ordinaire n'entraîne pas de symptômes", value: 1 },
        { label: "Classe II — Limitation légère : à l'aise au repos, mais l'activité ordinaire entraîne dyspnée/fatigue/palpitations", value: 2 },
        { label: "Classe III — Limitation marquée : à l'aise au repos, mais une activité moindre qu'ordinaire entraîne des symptômes", value: 3 },
        { label: "Classe IV — Symptômes présents au repos, aggravés par la moindre activité", value: 4 },
      ],
    },
  ],
  compute: (v) => v.class ?? 1,
  interpret: (score) => {
    let title = "";
    let level: "low" | "moderate" | "high" | "critical" = "low";
    if (score === 1) {
      title = "NYHA I : pas de limitation fonctionnelle";
      level = "low";
    } else if (score === 2) {
      title = "NYHA II : limitation légère";
      level = "moderate";
    } else if (score === 3) {
      title = "NYHA III : limitation marquée";
      level = "high";
    } else {
      title = "NYHA IV : symptômes au repos";
      level = "critical";
    }
    return [{ title, level, scoreLabel: `Classe ${score}` }];
  },
  source: "New York Heart Association, Criteria Committee, Nomenclature and Criteria for Diagnosis, 9e éd. 1994.",
};
