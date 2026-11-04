// The clinical exam template: the author's wording for each finding, system by system.
// Nothing is in the exam until it is ticked "Normal" or "Anormal". An abnormal finding is
// written from its `abnormal` base followed by the details picked in its `choices`, in order,
// then the free note. Edit this file to change the wording or the options.

export interface Choice {
  id: string;
  // Heading of the group of buttons on screen (not printed).
  label: string;
  options: string[];
  // Several options can be picked at once (joined "a, b et c").
  multi?: boolean;
  // Printed before / after the picked options, e.g. "à " or "(" and ")".
  before?: string;
  after?: string;
  // Separator from what comes before: " " (default) or ", ".
  sep?: string;
  // Only shown (and printed) when one of these options is picked in another choice.
  showIf?: { choice: string; any: string[] };
}

export interface Finding {
  id: string;
  // Short name on screen (not printed).
  label: string;
  normal: string;
  // Start of the abnormal phrase; can be empty when the choices say it all.
  abnormal: string;
  choices?: Choice[];
  // Not part of the author's usual exam: left out by "Tout normal".
  optional?: boolean;
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

export const GLASGOW_FINDING_ID = "glasgow";

const SIDES = ["droit", "gauche", "bilatéral"];
const ABDO_REGIONS = [
  "en hypochondre droit",
  "à l'épigastre",
  "en hypochondre gauche",
  "au flanc droit",
  "en région péri-ombilicale",
  "au flanc gauche",
  "en fosse iliaque droite",
  "à l'hypogastre",
  "en fosse iliaque gauche",
];
const LUNG_AREAS = ["en base droite", "en base gauche", "aux deux bases", "jusqu'à mi-champ", "en apical droit", "en apical gauche", "diffus"];

export const sections: ExamSection[] = [
  {
    id: "cardio",
    title: "Cardiovasculaire",
    findings: [
      {
        id: "chest-pain",
        label: "Douleur thoracique",
        normal: "Pas de douleur thoracique",
        abnormal: "douleur thoracique",
        choices: [
          {
            id: "type",
            label: "Type",
            options: ["constrictive", "à type de pesanteur", "à type de brûlure", "en coup de poignard", "atypique"],
          },
          {
            id: "site",
            label: "Siège",
            options: ["rétrosternale", "précordiale", "latérothoracique droite", "latérothoracique gauche", "basithoracique"],
          },
          {
            id: "radiation",
            label: "Irradiation",
            multi: true,
            before: "irradiant ",
            options: ["au bras gauche", "aux deux bras", "à la mâchoire", "au cou", "dans le dos", "à l'épigastre"],
          },
          {
            id: "features",
            label: "Caractéristiques",
            multi: true,
            sep: ", ",
            options: [
              "reproductible à la palpation",
              "majorée à l'inspiration profonde",
              "positionnelle",
              "survenue à l'effort",
              "survenue au repos",
              "trinitrosensible",
            ],
          },
        ],
      },
      {
        id: "heart-sounds",
        label: "Bruits du cœur",
        normal: "bruits du cœur réguliers sans souffle perçus",
        abnormal: "bruits du cœur",
        choices: [
          { id: "rhythm", label: "Rythme", options: ["réguliers", "irréguliers"] },
          {
            id: "murmur",
            label: "Souffle",
            sep: ", ",
            options: ["sans souffle perçu", "souffle systolique", "souffle diastolique", "souffle systolo-diastolique"],
          },
          {
            id: "grade",
            label: "Intensité",
            options: ["1/6", "2/6", "3/6", "4/6", "5/6", "6/6"],
            showIf: { choice: "murmur", any: ["souffle systolique", "souffle diastolique", "souffle systolo-diastolique"] },
          },
          {
            id: "focus",
            label: "Foyer",
            options: ["au foyer aortique", "au foyer mitral", "au foyer pulmonaire", "au foyer tricuspide", "irradiant aux carotides"],
            multi: true,
            showIf: { choice: "murmur", any: ["souffle systolique", "souffle diastolique", "souffle systolo-diastolique"] },
          },
          {
            id: "extra",
            label: "Autres bruits",
            multi: true,
            sep: ", ",
            options: ["bruit de galop", "frottement péricardique", "assourdissement des bruits du cœur"],
          },
        ],
      },
      {
        id: "mottling",
        label: "Marbrures",
        normal: "pas de marbrures",
        abnormal: "marbrures",
        choices: [
          { id: "site", label: "Localisation", multi: true, options: ["des genoux", "des cuisses", "de l'abdomen", "diffuses"] },
          { id: "score", label: "Score de marbrures", sep: ", ", before: "score de marbrures ", options: ["1", "2", "3", "4", "5"] },
        ],
      },
      {
        id: "crt",
        label: "TRC",
        normal: "TRC < 3 secondes",
        abnormal: "TRC allongé",
        choices: [{ id: "time", label: "Durée", before: "à ", options: ["3 secondes", "4 secondes", "5 secondes", "plus de 5 secondes"] }],
      },
      {
        id: "pulses",
        label: "Pouls périphériques",
        normal: "pouls périphériques perçus",
        abnormal: "pouls",
        choices: [
          { id: "which", label: "Pouls", multi: true, options: ["radial", "fémoral", "poplité", "pédieux", "tibial postérieur"] },
          { id: "side", label: "Côté", options: SIDES },
          { id: "state", label: "État", options: ["non perçu", "diminué", "asymétrique"] },
        ],
      },
      {
        id: "edema",
        label: "Œdèmes des membres inférieurs",
        optional: true,
        normal: "pas d'œdème des membres inférieurs",
        abnormal: "",
        choices: [
          {
            id: "side",
            label: "Côté",
            options: ["œdèmes bilatéraux des membres inférieurs", "œdème du membre inférieur droit", "œdème du membre inférieur gauche"],
          },
          { id: "type", label: "Aspect", multi: true, options: ["blancs", "mous", "prenant le godet", "indolores"] },
          {
            id: "level",
            label: "Jusqu'où",
            options: ["remontant aux chevilles", "remontant à mi-jambe", "remontant aux genoux", "remontant aux cuisses"],
          },
        ],
      },
      {
        id: "jugular",
        label: "Turgescence jugulaire / RHJ",
        optional: true,
        normal: "pas de turgescence jugulaire ni de reflux hépato-jugulaire",
        abnormal: "",
        choices: [{ id: "signs", label: "Signes", multi: true, options: ["turgescence jugulaire", "reflux hépato-jugulaire"] }],
      },
      {
        id: "calves",
        label: "Mollets",
        optional: true,
        normal: "mollets souples et indolores",
        abnormal: "mollet",
        choices: [
          { id: "side", label: "Côté", options: ["droit", "gauche"] },
          { id: "signs", label: "Signes", multi: true, options: ["douloureux", "induré", "augmenté de volume", "chaud"] },
        ],
      },
    ],
  },
  {
    id: "respi",
    title: "Respiratoire",
    findings: [
      {
        id: "cyanosis",
        label: "Cyanose",
        normal: "Pas de cyanose",
        abnormal: "cyanose",
        choices: [{ id: "site", label: "Localisation", options: ["des extrémités", "des lèvres", "unguéale", "diffuse"] }],
      },
      {
        id: "expansion",
        label: "Ampliation thoracique",
        normal: "bonne ampliation thoracique",
        abnormal: "ampliation thoracique",
        choices: [{ id: "how", label: "Anomalie", options: ["diminuée", "asymétrique", "diminuée à droite", "diminuée à gauche"] }],
      },
      {
        id: "distress",
        label: "Signes de lutte",
        normal:
          "pas de signe de lutte (balancement thoraco-abdominal, tirage sus sternal, tirage intercostal, battement des ailes du nez)",
        abnormal: "signes de lutte respiratoire",
        choices: [
          {
            id: "signs",
            label: "Signes présents",
            multi: true,
            before: "(",
            after: ")",
            options: [
              "balancement thoraco-abdominal",
              "tirage sus sternal",
              "tirage intercostal",
              "tirage sous-costal",
              "battement des ailes du nez",
              "contraction des sterno-cléido-mastoïdiens",
              "entonnoir xiphoïdien",
              "geignement expiratoire",
            ],
          },
        ],
      },
      {
        id: "exhaustion",
        label: "Signes de détresse / épuisement",
        optional: true,
        normal: "pas de signe d'épuisement respiratoire",
        abnormal: "signes de détresse respiratoire",
        choices: [
          {
            id: "signs",
            label: "Signes présents",
            multi: true,
            before: "(",
            after: ")",
            options: [
              "respiration abdominale paradoxale",
              "bradypnée",
              "pauses respiratoires",
              "polypnée superficielle",
              "difficulté à parler",
              "orthopnée",
              "sueurs",
              "agitation",
              "troubles de la vigilance",
            ],
          },
        ],
      },
      {
        id: "breath-sounds",
        label: "Auscultation pulmonaire",
        normal: "murmure vésiculaire bilatéral et symétrique sans bruit surajouté",
        abnormal: "",
        choices: [
          {
            id: "mv",
            label: "Murmure vésiculaire",
            options: ["murmure vésiculaire diminué", "murmure vésiculaire aboli", "murmure vésiculaire asymétrique", "murmure vésiculaire présent"],
          },
          {
            id: "mv-site",
            label: "Où",
            options: ["à droite", "à gauche", "aux deux bases", "en base droite", "en base gauche"],
            showIf: { choice: "mv", any: ["murmure vésiculaire diminué", "murmure vésiculaire aboli"] },
          },
          {
            id: "added",
            label: "Bruits surajoutés",
            multi: true,
            sep: ", ",
            options: ["crépitants", "sibilants", "ronchi", "frottement pleural", "souffle tubaire"],
          },
          {
            id: "added-site",
            label: "Localisation",
            multi: true,
            options: LUNG_AREAS,
            showIf: { choice: "added", any: ["crépitants", "sibilants", "ronchi", "frottement pleural", "souffle tubaire"] },
          },
          {
            id: "percussion",
            label: "Percussion",
            sep: ", ",
            options: ["matité basale droite", "matité basale gauche", "matité basale bilatérale", "tympanisme droit", "tympanisme gauche"],
          },
        ],
      },
      {
        id: "cough",
        label: "Toux",
        normal: "pas de toux",
        abnormal: "toux",
        choices: [
          { id: "sputum", label: "Expectorations", options: ["sans expectoration", "avec expectorations"] },
          {
            id: "colour",
            label: "Aspect des expectorations",
            multi: true,
            options: ["claires", "blanchâtres", "jaunâtres", "verdâtres", "purulentes", "hémoptoïques", "rouillées", "mousseuses rosées"],
            showIf: { choice: "sputum", any: ["avec expectorations"] },
          },
        ],
      },
    ],
  },
  {
    id: "neuro",
    title: "Neurologique",
    findings: [
      // Built from the Y/V/M selects.
      { id: GLASGOW_FINDING_ID, label: "Glasgow", normal: "Glasgow 15", abnormal: "" },
      {
        id: "pupils",
        label: "Pupilles",
        normal: "pupilles intermédiaires, isocores et réactives",
        abnormal: "",
        choices: [
          {
            id: "size",
            label: "Taille / symétrie",
            options: [
              "anisocorie droite > gauche",
              "anisocorie gauche > droite",
              "mydriase bilatérale",
              "myosis bilatéral",
              "myosis serré bilatéral",
              "pupilles intermédiaires et isocores",
            ],
          },
          {
            id: "reflex",
            label: "Réflexe photomoteur",
            sep: ", ",
            options: ["réflexe photomoteur conservé", "réflexe photomoteur diminué", "réflexe photomoteur aboli"],
          },
        ],
      },
      {
        id: "deficit",
        label: "Déficit sensitivo-moteur",
        normal: "pas de déficit sensitivo-moteur",
        abnormal: "déficit",
        choices: [
          { id: "type", label: "Type", options: ["moteur", "sensitif", "sensitivo-moteur"] },
          {
            id: "site",
            label: "Topographie",
            multi: true,
            options: [
              "du membre supérieur droit",
              "du membre supérieur gauche",
              "du membre inférieur droit",
              "du membre inférieur gauche",
              "hémicorporel droit",
              "hémicorporel gauche",
              "facio-brachio-crural droit",
              "facio-brachio-crural gauche",
              "des deux membres inférieurs",
              "des quatre membres",
            ],
          },
          { id: "grade", label: "Cotation", before: "coté à ", options: ["0/5", "1/5", "2/5", "3/5", "4/5"] },
        ],
      },
      {
        id: "cranial",
        label: "Paires crâniennes",
        normal: "pas d'anomalie des paires crâniennes",
        abnormal: "",
        choices: [
          {
            id: "signs",
            label: "Anomalies",
            multi: true,
            options: [
              "paralysie faciale centrale droite",
              "paralysie faciale centrale gauche",
              "paralysie faciale périphérique droite",
              "paralysie faciale périphérique gauche",
              "diplopie",
              "ptosis",
              "nystagmus",
              "déviation de la langue",
              "troubles de la déglutition",
            ],
          },
        ],
      },
      {
        id: "speech",
        label: "Langage",
        optional: true,
        normal: "pas de trouble du langage",
        abnormal: "",
        choices: [
          { id: "signs", label: "Troubles", multi: true, options: ["aphasie", "manque du mot", "dysarthrie", "troubles de la compréhension"] },
        ],
      },
      {
        id: "gait",
        label: "Marche / équilibre",
        normal: "pas d'anomalies de la marche ou de l'équilibre",
        abnormal: "",
        choices: [
          {
            id: "signs",
            label: "Anomalies",
            multi: true,
            options: [
              "marche impossible",
              "marche instable",
              "élargissement du polygone de sustentation",
              "signe de Romberg",
              "syndrome cérébelleux statique",
              "syndrome cérébelleux cinétique",
              "dysmétrie",
            ],
          },
        ],
      },
      {
        id: "reflexes",
        label: "Réflexes",
        normal: "ROT +/+",
        abnormal: "ROT",
        choices: [
          { id: "rot", label: "ROT", options: ["vifs", "vifs et polycinétiques", "diminués", "abolis", "asymétriques"] },
          {
            id: "babinski",
            label: "Babinski",
            sep: ", ",
            options: ["signe de Babinski à droite", "signe de Babinski à gauche", "signe de Babinski bilatéral"],
          },
        ],
      },
      {
        id: "meningeal",
        label: "Syndrome méningé",
        optional: true,
        normal: "pas de syndrome méningé",
        abnormal: "syndrome méningé",
        choices: [
          {
            id: "signs",
            label: "Signes",
            multi: true,
            before: "(",
            after: ")",
            options: ["raideur de nuque", "signe de Kernig", "signe de Brudzinski", "photophobie", "céphalées"],
          },
        ],
      },
    ],
  },
  {
    id: "abdo",
    title: "Abdominal",
    end: ".",
    findings: [
      {
        id: "palpation",
        label: "Palpation",
        normal: "Abdomen souple, dépressible et indolore",
        abnormal: "abdomen",
        choices: [
          { id: "aspect", label: "Aspect", multi: true, options: ["souple", "ballonné", "distendu", "météorisé"] },
          { id: "pain", label: "Douleur", sep: ", ", options: ["sensible", "douloureux"] },
          {
            id: "pain-site",
            label: "Où",
            multi: true,
            options: ["diffusément", ...ABDO_REGIONS],
            showIf: { choice: "pain", any: ["sensible", "douloureux"] },
          },
          { id: "guarding", label: "Défense / contracture", sep: ", ", options: ["défense", "contracture généralisée"] },
          {
            id: "guarding-site",
            label: "Où",
            multi: true,
            options: ABDO_REGIONS,
            showIf: { choice: "guarding", any: ["défense"] },
          },
          {
            id: "signs",
            label: "Signes",
            multi: true,
            sep: ", ",
            options: ["signe de Murphy", "douleur au point de McBurney", "signe de Blumberg", "signe du psoas", "douleur à la décompression"],
          },
        ],
      },
      {
        id: "organomegaly",
        label: "Hépato-splénomégalie",
        normal: "pas d'hépato-splénomégalie",
        abnormal: "",
        choices: [{ id: "which", label: "Organe", multi: true, options: ["hépatomégalie", "splénomégalie"] }],
      },
      {
        id: "mass",
        label: "Masse",
        normal: "pas de masse palpée",
        abnormal: "masse palpée",
        choices: [
          { id: "site", label: "Localisation", multi: true, options: [...ABDO_REGIONS, "en région inguinale droite", "en région inguinale gauche"] },
          {
            id: "features",
            label: "Caractéristiques",
            multi: true,
            sep: ", ",
            options: ["pulsatile", "douloureuse", "indolore", "mobile", "fixée", "de consistance dure", "de consistance molle"],
          },
        ],
      },
      {
        id: "hernia",
        label: "Orifices herniaires",
        optional: true,
        normal: "orifices herniaires libres",
        abnormal: "",
        choices: [
          {
            id: "which",
            label: "Hernie",
            options: [
              "hernie inguinale droite",
              "hernie inguinale gauche",
              "hernie crurale droite",
              "hernie crurale gauche",
              "hernie ombilicale",
              "éventration",
            ],
          },
          { id: "state", label: "État", multi: true, options: ["réductible", "non réductible", "douloureuse"] },
        ],
      },
      {
        id: "bowel",
        label: "Transit",
        optional: true,
        normal: "transit conservé",
        abnormal: "",
        choices: [
          {
            id: "signs",
            label: "Troubles",
            multi: true,
            options: ["arrêt des matières et des gaz", "diarrhée", "constipation", "rectorragies", "méléna"],
          },
        ],
      },
      {
        id: "nausea",
        label: "Nausées / vomissements",
        normal: "pas de nausée ni de vomissement",
        abnormal: "",
        choices: [
          { id: "signs", label: "Signes", multi: true, options: ["nausées", "vomissements"] },
          {
            id: "aspect",
            label: "Aspect des vomissements",
            multi: true,
            options: ["alimentaires", "bilieux", "fécaloïdes", "en marc de café", "sanglants (hématémèse)"],
            showIf: { choice: "signs", any: ["vomissements"] },
          },
        ],
      },
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
        label: "Signes fonctionnels urinaires",
        normal: "Pas de signe fonctionnel urinaire",
        abnormal: "",
        choices: [
          {
            id: "signs",
            label: "Signes",
            multi: true,
            options: ["brûlures mictionnelles", "pollakiurie", "dysurie", "impériosités mictionnelles", "hématurie macroscopique", "rétention urinaire"],
          },
        ],
      },
      {
        id: "lumbar",
        label: "Fosses lombaires",
        optional: true,
        normal: "fosses lombaires libres",
        abnormal: "douleur à l'ébranlement lombaire",
        choices: [{ id: "side", label: "Côté", options: ["droite", "gauche", "bilatérale"] }],
      },
      {
        id: "bladder",
        label: "Globe vésical",
        optional: true,
        normal: "pas de globe vésical",
        abnormal: "globe vésical",
      },
    ],
  },
];
