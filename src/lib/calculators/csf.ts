import type { Calculator, Interpretation, Level, Values } from "./types";

function csfFindings(v: Values): Interpretation[] {
  const findings: Interpretation[] = [];

  const leuco = v.leucocytes ?? 0;
  const pnnPercent = v.pnnPercent;
  const protein = v.protein;
  const glycorachie = v.glycorachie;
  const glycemie = v.glycemie;
  const lactateLcr = v.lactateLcr;
  const aspect = v.aspect ?? 0; // 0 clair, 1 trouble, 2 hemorragique, 3 xanthochromique

  const leucoElevated = leuco >= 5;
  findings.push({
    title: leucoElevated ? "Pléiocytose" : "Cellularité normale",
    level: leucoElevated ? "moderate" : "low",
    scoreLabel: `${leuco} élément(s)/mm³`,
    detail: !leucoElevated ? "N'exclut pas une méningite très débutante." : undefined,
  });

  if (protein !== undefined) {
    const hyperMarquee = protein > 1;
    const hyperModeree = protein > 0.45 && protein <= 1;
    findings.push({
      title: hyperMarquee ? "Hyperprotéinorachie marquée" : hyperModeree ? "Hyperprotéinorachie modérée" : "Protéinorachie normale",
      level: hyperMarquee ? "high" : hyperModeree ? "moderate" : "low",
      scoreLabel: `${protein} g/L`,
    });
  }

  let glucoseRatio: number | undefined;
  if (glycorachie !== undefined && glycemie !== undefined && glycemie > 0) {
    glucoseRatio = glycorachie / glycemie;
    const hypo = glucoseRatio < 0.5;
    findings.push({
      title: hypo ? "Hypoglycorachie" : "Glycorachie normale",
      level: hypo ? "high" : "low",
      scoreLabel: `Ratio LCR/sang ${(glucoseRatio * 100).toFixed(0)} %`,
      detail: hypo ? "Ratio < 0,5 : évocateur d'une consommation de glucose par des germes/cellules (bactérien, tuberculeux, fongique, carcinomateux)." : undefined,
    });
  } else if (glycorachie !== undefined) {
    findings.push({
      title: glycorachie < 2.2 ? "Glycorachie basse (en valeur absolue)" : "Glycorachie normale (en valeur absolue)",
      level: glycorachie < 2.2 ? "moderate" : "low",
      scoreLabel: `${glycorachie} mmol/L`,
      detail: "Glycémie concomitante non renseignée : le ratio LCR/sang est plus fiable que la valeur absolue.",
    });
  }

  if (lactateLcr !== undefined) {
    const elevated = lactateLcr > 3.5;
    findings.push({
      title: elevated ? "Lactate LCR élevé" : "Lactate LCR normal",
      level: elevated ? "high" : "low",
      scoreLabel: `${lactateLcr} mmol/L`,
      detail: elevated
        ? "Argument en faveur d'une origine bactérienne (peu influencé par une antibiothérapie préalable, contrairement à la culture)."
        : "Un lactate normal n'élimine pas formellement une méningite bactérienne débutante.",
    });
  }

  if (aspect === 2 || aspect === 3) {
    findings.push({
      title: aspect === 2 ? "LCR hémorragique" : "LCR xanthochromique",
      level: "high",
      detail:
        "Distinguer hémorragie méningée vraie de piqûre traumatique : comparer l'aspect sur 3 tubes successifs (éclaircissement progressif = traumatique probable ; aspect uniforme = hémorragie méningée probable) et rechercher une xanthochromie (évocatrice d'hémorragie méningée si > 12h d'évolution).",
    });
  }

  // Synthesis pattern
  const neutroPredominant = pnnPercent !== undefined ? pnnPercent >= 50 : undefined;
  const hypoglycorachie = glucoseRatio !== undefined ? glucoseRatio < 0.5 : glycorachie !== undefined ? glycorachie < 2.2 : undefined;
  const hyperproteinMarquee = protein !== undefined ? protein > 1 : undefined;

  let synthesis: Interpretation | null = null;
  const synthLevel: Level = "critical";

  if (leuco < 5 && hypoglycorachie !== true && (protein === undefined || protein <= 0.45) && aspect === 0) {
    synthesis = {
      title: "Profil compatible avec un LCR normal",
      level: "low",
      detail: "Méningite peu probable sur ces seuls critères ; n'exclut pas une atteinte très débutante ou décapitée.",
    };
  } else if (neutroPredominant && hypoglycorachie && hyperproteinMarquee) {
    synthesis = {
      title: "Profil évocateur de méningite bactérienne purulente",
      level: synthLevel,
      detail: "Prédominance neutrophile + hypoglycorachie + hyperprotéinorachie marquée : antibiothérapie probabiliste urgente, hémocultures, ne pas retarder le traitement pour l'imagerie si signes de gravité.",
    };
  } else if (neutroPredominant === false && hypoglycorachie === true) {
    synthesis = {
      title: "Profil lymphocytaire avec hypoglycorachie",
      level: "high",
      detail: "Évoquer listériose, tuberculose, méningite fongique (cryptocoque), ou méningite bactérienne décapitée (antibiothérapie préalable) : compléter par PCR spécifiques et avis spécialisé.",
    };
  } else if (neutroPredominant === false && (hypoglycorachie === false || hypoglycorachie === undefined) && (hyperproteinMarquee !== true)) {
    synthesis = {
      title: "Profil évocateur de méningite virale (lymphocytaire)",
      level: "moderate",
      detail: "Cellularité modérée à prédominance lymphocytaire, glycorachie et protéinorachie non franchement perturbées : profil habituel des méningites virales. Corréler à la clinique.",
    };
  } else if (leucoElevated) {
    synthesis = {
      title: "Pléiocytose de profil non univoque",
      level: "moderate",
      detail: "La formule ne permet pas de trancher avec certitude : corréler à la clinique, envisager PCR multiplex méningo-encéphalite, cultures, et avis spécialisé.",
    };
  }

  if (synthesis) findings.unshift(synthesis);

  return findings;
}

export const csf: Calculator = {
  id: "lcr",
  name: "Interprétation du liquide céphalo-rachidien (LCR)",
  shortName: "LCR",
  category: "biologie",
  keywords: ["lcr", "liquide cephalo-rachidien", "liquide céphalo-rachidien", "meningite", "méningite", "ponction lombaire"],
  summary: "Orientation étiologique d'une analyse de LCR (méningite bactérienne, virale, hémorragie méningée...).",
  fields: [
    { type: "number", id: "leucocytes", label: "Leucocytes (éléments)", unit: "/mm³", min: 0, step: 1 },
    { type: "number", id: "pnnPercent", label: "Dont polynucléaires neutrophiles", unit: "%", min: 0, max: 100, step: 1 },
    { type: "number", id: "protein", label: "Protéinorachie", unit: "g/L", min: 0, step: 0.05 },
    { type: "number", id: "glycorachie", label: "Glycorachie", unit: "mmol/L", min: 0, step: 0.1 },
    { type: "number", id: "glycemie", label: "Glycémie concomitante", unit: "mmol/L", min: 0, step: 0.1 },
    { type: "number", id: "lactateLcr", label: "Lactate du LCR", unit: "mmol/L", min: 0, step: 0.1 },
    {
      type: "select",
      id: "aspect",
      label: "Aspect macroscopique",
      options: [
        { label: "Clair (« eau de roche »)", value: 0 },
        { label: "Trouble / purulent", value: 1 },
        { label: "Hémorragique", value: 2 },
        { label: "Xanthochromique", value: 3 },
      ],
    },
  ],
  requiredNumberFieldIds: ["leucocytes"],
  compute: () => 0,
  interpret: (_score, v) => csfFindings(v),
  source:
    "Critères classiques d'orientation étiologique des méningites (Société de Pathologie Infectieuse de Langue Française ; Tunkel et al., Clin Infect Dis 2004/2017).",
  notes:
    "Outil d'orientation, ne remplace pas la culture, les PCR spécifiques ni l'avis infectiologique. Valeurs usuelles adulte : leucocytes < 5/mm³, protéinorachie 0,15-0,45 g/L, ratio glycorachie/glycémie > 0,5-0,6.",
};
