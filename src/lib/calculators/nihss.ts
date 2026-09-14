import type { Calculator } from "./types";

function opts(...pairs: [string, number][]) {
  return pairs.map(([label, value]) => ({ label, value }));
}

export const nihss: Calculator = {
  id: "nihss",
  name: "NIHSS (National Institutes of Health Stroke Scale)",
  shortName: "NIHSS",
  category: "neurologie",
  keywords: ["nihss", "avc", "stroke", "accident vasculaire cérébral", "neurologie"],
  summary: "Évaluation quantifiée de la sévérité d'un accident vasculaire cérébral (AVC) ischémique.",
  fields: [
    {
      type: "select",
      showPoints: true,
      id: "loc",
      label: "1a. Niveau de conscience",
      group: "Conscience",
      options: opts(["Vigilant", 0], ["Non vigilant, éveillable par stimulation mineure", 1], ["Non vigilant, nécessite stimulation répétée", 2], ["Coma", 3]),
    },
    {
      type: "select",
      showPoints: true,
      id: "locQuestions",
      label: "1b. Questions (mois, âge)",
      group: "Conscience",
      options: opts(["2 réponses correctes", 0], ["1 réponse correcte", 1], ["0 réponse correcte", 2]),
    },
    {
      type: "select",
      showPoints: true,
      id: "locCommands",
      label: "1c. Commandes (ouvrir/fermer les yeux, serrer/ouvrir la main)",
      group: "Conscience",
      options: opts(["2 ordres exécutés", 0], ["1 ordre exécuté", 1], ["0 ordre exécuté", 2]),
    },
    {
      type: "select",
      showPoints: true,
      id: "gaze",
      label: "2. Oculomotricité",
      options: opts(["Normale", 0], ["Paralysie partielle du regard", 1], ["Déviation forcée", 2]),
    },
    {
      type: "select",
      showPoints: true,
      id: "visual",
      label: "3. Champ visuel",
      options: opts(["Aucun déficit", 0], ["Hémianopsie partielle", 1], ["Hémianopsie complète", 2], ["Hémianopsie bilatérale / cécité corticale", 3]),
    },
    {
      type: "select",
      showPoints: true,
      id: "facial",
      label: "4. Paralysie faciale",
      options: opts(["Normale", 0], ["Mineure (asymétrie sourire)", 1], ["Partielle (paralysie inférieure)", 2], ["Complète (unie ou bilatérale)", 3]),
    },
    {
      type: "select",
      showPoints: true,
      id: "motorLeftArm",
      label: "5a. Motricité bras gauche",
      group: "Motricité",
      options: opts(["Pas de chute (10s)", 0], ["Chute progressive", 1], ["Effort contre gravité", 2], ["Aucun effort contre gravité", 3], ["Aucun mouvement", 4]),
    },
    {
      type: "select",
      showPoints: true,
      id: "motorRightArm",
      label: "5b. Motricité bras droit",
      group: "Motricité",
      options: opts(["Pas de chute (10s)", 0], ["Chute progressive", 1], ["Effort contre gravité", 2], ["Aucun effort contre gravité", 3], ["Aucun mouvement", 4]),
    },
    {
      type: "select",
      showPoints: true,
      id: "motorLeftLeg",
      label: "6a. Motricité jambe gauche",
      group: "Motricité",
      options: opts(["Pas de chute (5s)", 0], ["Chute progressive", 1], ["Effort contre gravité", 2], ["Aucun effort contre gravité", 3], ["Aucun mouvement", 4]),
    },
    {
      type: "select",
      showPoints: true,
      id: "motorRightLeg",
      label: "6b. Motricité jambe droite",
      group: "Motricité",
      options: opts(["Pas de chute (5s)", 0], ["Chute progressive", 1], ["Effort contre gravité", 2], ["Aucun effort contre gravité", 3], ["Aucun mouvement", 4]),
    },
    {
      type: "select",
      showPoints: true,
      id: "ataxia",
      label: "7. Ataxie des membres",
      options: opts(["Absente", 0], ["Présente sur 1 membre", 1], ["Présente sur 2 membres", 2]),
    },
    {
      type: "select",
      showPoints: true,
      id: "sensory",
      label: "8. Sensibilité",
      options: opts(["Normale", 0], ["Perte légère à modérée", 1], ["Perte sévère à totale", 2]),
    },
    {
      type: "select",
      showPoints: true,
      id: "language",
      label: "9. Langage (aphasie)",
      options: opts(["Normal", 0], ["Aphasie légère à modérée", 1], ["Aphasie sévère", 2], ["Mutisme / aphasie globale", 3]),
    },
    {
      type: "select",
      showPoints: true,
      id: "dysarthria",
      label: "10. Dysarthrie",
      options: opts(["Normale", 0], ["Légère à modérée", 1], ["Sévère / anarthrie", 2]),
    },
    {
      type: "select",
      showPoints: true,
      id: "extinction",
      label: "11. Extinction / négligence",
      options: opts(["Absente", 0], ["Légère (1 modalité)", 1], ["Sévère (≥2 modalités)", 2]),
    },
  ],
  compute: (v) => Object.values(v).reduce((a, b) => (a ?? 0) + (b ?? 0), 0) ?? 0,
  interpret: (score) => {
    let title = "";
    let level: "low" | "moderate" | "high" | "critical" = "low";
    if (score === 0) {
      title = "Absence de déficit neurologique mesurable";
      level = "low";
    } else if (score <= 4) {
      title = "AVC mineur";
      level = "low";
    } else if (score <= 15) {
      title = "AVC modéré";
      level = "moderate";
    } else if (score <= 20) {
      title = "AVC modéré à sévère";
      level = "high";
    } else {
      title = "AVC sévère";
      level = "critical";
    }
    return [{ title, level, scoreLabel: `${score} / 42` }];
  },
  source: "Brott et al., Stroke 1989 ; National Institutes of Health.",
  notes:
    "Les items « membre non testable » (amputation, ankylose) ne sont pas modélisés ici : jugement clinique requis dans ces cas.",
};
