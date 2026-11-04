// The clinical exam template: the author's own wording for a normal exam, system by system.
// Each finding reads as normal by default; marking it abnormal swaps in an editable phrase,
// pre-filled with the first suggestion. Edit this file to change the wording.

export interface Finding {
  id: string;
  normal: string;
  // Suggested abnormal phrasings, the first one is used by default.
  abnormal: string[];
}

export interface ExamSection {
  id: string;
  title: string;
  findings: Finding[];
  // Appended after the last finding (e.g. "." to close the sentence).
  end?: string;
  // true: printed on the line right after the previous section instead of after a blank line.
  sameParagraph?: boolean;
}

export const sections: ExamSection[] = [
  {
    id: "cardio",
    title: "Cardiovasculaire",
    findings: [
      { id: "chest-pain", normal: "Pas de douleur thoracique", abnormal: ["Douleur thoracique"] },
      {
        id: "heart-sounds",
        normal: "bruits du cœur réguliers sans souffle perçus",
        abnormal: ["bruits du cœur irréguliers", "souffle systolique"],
      },
      { id: "mottling", normal: "pas de marbrures", abnormal: ["marbrures des genoux"] },
      { id: "crt", normal: "TRC < 3 secondes", abnormal: ["TRC allongé à 4 secondes"] },
      { id: "pulses", normal: "pouls périphériques perçus", abnormal: ["pouls pédieux non perçus"] },
    ],
  },
  {
    id: "respi",
    title: "Respiratoire",
    findings: [
      { id: "cyanosis", normal: "Pas de cyanose", abnormal: ["Cyanose des extrémités"] },
      {
        id: "expansion",
        normal: "bonne ampliation thoracique",
        abnormal: ["ampliation thoracique asymétrique", "ampliation thoracique diminuée"],
      },
      {
        id: "distress",
        normal:
          "pas de signe de lutte (balancement thoraco-abdominal, tirage sus sternal, tirage intercostal, battement des ailes du nez)",
        abnormal: ["signes de lutte (tirage sus sternal, tirage intercostal)"],
      },
      {
        id: "breath-sounds",
        normal: "murmure vésiculaire bilatéral et symétrique sans bruit surajouté",
        abnormal: ["crépitants en base droite", "sibilants diffus", "diminution du murmure vésiculaire en base droite"],
      },
    ],
  },
  {
    id: "neuro",
    title: "Neurologique",
    findings: [
      // The Glasgow line is built from the Y/V/M selects (see GLASGOW_FINDING_ID).
      { id: "glasgow", normal: "Glasgow 15", abnormal: [] },
      {
        id: "pupils",
        normal: "pupilles intermédiaires, isocores et réactives",
        abnormal: ["anisocorie", "mydriase bilatérale aréactive", "myosis serré bilatéral"],
      },
      {
        id: "deficit",
        normal: "pas de déficit sensitivo-moteur",
        abnormal: ["déficit moteur du membre supérieur droit", "hypoesthésie de l'hémicorps gauche"],
      },
      { id: "cranial", normal: "pas d'anomalie des paires crâniennes", abnormal: ["paralysie faciale centrale droite"] },
      {
        id: "gait",
        normal: "pas d'anomalies de la marche ou de l'équilibre",
        abnormal: ["marche impossible", "syndrome cérébelleux statique"],
      },
      { id: "reflexes", normal: "ROT +/+", abnormal: ["ROT vifs", "ROT abolis", "signe de Babinski"] },
    ],
  },
  {
    id: "abdo",
    title: "Abdominal",
    end: ".",
    findings: [
      {
        id: "palpation",
        normal: "Abdomen souple, dépressible et indolore",
        abnormal: ["Abdomen sensible en fosse iliaque droite", "Défense en fosse iliaque droite", "Contracture abdominale"],
      },
      { id: "organomegaly", normal: "pas d'hépato-splénomégalie", abnormal: ["hépatomégalie", "splénomégalie"] },
      { id: "mass", normal: "pas de masse palpée", abnormal: ["masse palpée en hypochondre droit"] },
    ],
  },
  {
    id: "uro",
    title: "Urinaire",
    end: ".",
    sameParagraph: true,
    findings: [
      {
        id: "urinary",
        normal: "Pas de signe fonctionnel urinaire",
        abnormal: ["Brûlures mictionnelles", "Pollakiurie", "Hématurie macroscopique"],
      },
    ],
  },
];

export const GLASGOW_FINDING_ID = "glasgow";
