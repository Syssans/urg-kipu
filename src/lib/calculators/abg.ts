import type { Calculator, Interpretation, Level, Values } from "./types";

const PH_LOW = 7.35;
const PH_HIGH = 7.45;
const PCO2_LOW = 35;
const PCO2_HIGH = 45;
const HCO3_LOW = 22;
const HCO3_HIGH = 26;
const AG_HIGH = 16;

function round1(n: number) {
  return Math.round(n * 10) / 10;
}

interface Pattern {
  acidemia: boolean;
  alkalemia: boolean;
  metAcidosis: boolean;
  metAlkalosis: boolean;
  respAcidosis: boolean;
  respAlkalosis: boolean;
}

function classify(v: Values): Pattern | undefined {
  if (v.ph === undefined || v.pco2 === undefined || v.hco3 === undefined) return undefined;
  const ph = v.ph;
  const pco2 = v.pco2;
  const hco3 = v.hco3;
  return {
    acidemia: ph < PH_LOW,
    alkalemia: ph > PH_HIGH,
    metAcidosis: hco3 < HCO3_LOW,
    metAlkalosis: hco3 > HCO3_HIGH,
    respAcidosis: pco2 > PCO2_HIGH,
    respAlkalosis: pco2 < PCO2_LOW,
  };
}

// Metabolic acidosis is "in play" (primary, or a component of a mixed picture)
// whenever HCO3 is low and the picture isn't dominated by a pure alkalemia.
function hasMetabolicAcidosisComponent(v: Values): boolean {
  const c = classify(v);
  return !!c && c.metAcidosis && !c.alkalemia;
}

function anionGap(v: Values): number | undefined {
  if (v.na === undefined || v.cl === undefined || v.hco3 === undefined) return undefined;
  const ag = v.na - (v.cl + v.hco3);
  if (v.albumin !== undefined) return ag + 0.25 * (44 - v.albumin);
  return ag;
}

// undefined = not computable yet, true = elevated, false = normal
function anionGapElevated(v: Values): boolean | undefined {
  const ag = anionGap(v);
  if (ag === undefined) return undefined;
  return ag > AG_HIGH;
}

function showUrinaryGapFields(v: Values): boolean {
  return hasMetabolicAcidosisComponent(v) && anionGapElevated(v) === false;
}

function urinaryAnionGap(v: Values): number | undefined {
  if (v.naU === undefined || v.kU === undefined || v.clU === undefined) return undefined;
  return v.naU + v.kU - v.clU;
}

function acidBaseFindings(v: Values): Interpretation[] {
  const c = classify(v);
  if (!c) return [];
  const { acidemia, alkalemia, metAcidosis, metAlkalosis, respAcidosis, respAlkalosis } = c;
  const ph = v.ph!;
  const pco2 = v.pco2!;
  const hco3 = v.hco3!;
  const chronic = (v.duration ?? 0) === 1;

  const findings: Interpretation[] = [];

  const phLevel: Level = acidemia || alkalemia ? "high" : "low";
  findings.push({
    title: acidemia ? "Acidémie" : alkalemia ? "Alcalémie" : "pH normal",
    level: phLevel,
    scoreLabel: `pH ${ph.toFixed(2)}`,
  });

  if (acidemia && metAcidosis && respAcidosis) {
    findings.push({
      title: "Trouble mixte : acidose métabolique + acidose respiratoire",
      level: "critical",
      detail: "Les deux composantes vont dans le sens de l'acidose : il ne s'agit pas d'une compensation mais de deux troubles primaires associés.",
    });
  } else if (alkalemia && metAlkalosis && respAlkalosis) {
    findings.push({
      title: "Trouble mixte : alcalose métabolique + alcalose respiratoire",
      level: "high",
      detail: "Les deux composantes vont dans le sens de l'alcalose : deux troubles primaires associés, pas une compensation.",
    });
  } else if (metAcidosis && !alkalemia) {
    const expected = round1(1.5 * hco3 + 8);
    findings.push({ title: "Trouble primaire : acidose métabolique", level: "high", scoreLabel: `HCO₃⁻ ${hco3} mmol/L` });
    findings.push(compensationFinding(pco2, expected - 2, expected + 2, expected, "PaCO₂", "compensation respiratoire (formule de Winter)"));
  } else if (metAlkalosis && !acidemia) {
    const expected = round1(40 + 0.7 * (hco3 - 24));
    findings.push({ title: "Trouble primaire : alcalose métabolique", level: "moderate", scoreLabel: `HCO₃⁻ ${hco3} mmol/L` });
    findings.push(compensationFinding(pco2, expected - 5, expected + 5, expected, "PaCO₂", "compensation respiratoire attendue"));
  } else if (respAcidosis && !alkalemia) {
    const factor = chronic ? 0.35 : 0.1;
    const expected = round1(24 + factor * (pco2 - 40));
    const tol = chronic ? 4 : 3;
    findings.push({ title: `Trouble primaire : acidose respiratoire (${chronic ? "chronique" : "aiguë"})`, level: "high", scoreLabel: `PaCO₂ ${pco2} mmHg` });
    findings.push(compensationFinding(hco3, expected - tol, expected + tol, expected, "HCO₃⁻", `compensation métabolique attendue (${chronic ? "chronique" : "aiguë"})`));
  } else if (respAlkalosis && !acidemia) {
    const factor = chronic ? 0.4 : 0.2;
    const expected = round1(24 - factor * (40 - pco2));
    const tol = chronic ? 4 : 3;
    findings.push({ title: `Trouble primaire : alcalose respiratoire (${chronic ? "chronique" : "aiguë"})`, level: "moderate", scoreLabel: `PaCO₂ ${pco2} mmHg` });
    findings.push(compensationFinding(hco3, expected - tol, expected + tol, expected, "HCO₃⁻", `compensation métabolique attendue (${chronic ? "chronique" : "aiguë"})`));
  } else if (!acidemia && !alkalemia) {
    findings.push({ title: "Équilibre acido-basique normal", level: "low" });
  } else {
    findings.push({
      title: "Profil non univoque",
      level: "moderate",
      detail: "Le pH est anormal mais HCO₃⁻ et PaCO₂ sont dans les plages usuelles retenues ici : vérifier les valeurs saisies ou évoquer un trouble mixte discret.",
    });
  }

  return findings;
}

function compensationFinding(measured: number, low: number, high: number, expected: number, paramLabel: string, contextLabel: string): Interpretation {
  const inRange = measured >= low && measured <= high;
  if (inRange) {
    return {
      title: "Compensation appropriée",
      level: "low",
      detail: `${paramLabel} mesuré (${round1(measured)}) cohérent avec la ${contextLabel} (attendu ≈ ${round1(expected)}, plage ${round1(low)}–${round1(high)}). Trouble probablement simple.`,
    };
  }
  const direction = measured > high ? "plus élevé" : "plus bas";
  return {
    title: "Compensation inattendue : trouble surajouté probable",
    level: "high",
    detail: `${paramLabel} mesuré (${round1(measured)}) ${direction} que la plage attendue pour la ${contextLabel} (≈ ${round1(expected)}, plage ${round1(low)}–${round1(high)}). Évoquer un second trouble acido-basique associé.`,
  };
}

function anionGapFindings(v: Values): Interpretation[] {
  const findings: Interpretation[] = [];
  if (!hasMetabolicAcidosisComponent(v)) return findings;

  const ag = anionGap(v);
  if (ag === undefined) return findings;

  const elevated = ag > AG_HIGH;
  const corrected = v.albumin !== undefined;

  if (elevated) {
    findings.push({
      title: "Acidose métabolique à trou anionique augmenté",
      level: "critical",
      scoreLabel: `TA ${round1(ag)} mmol/L${corrected ? " (corrigé albumine)" : ""}`,
      detail:
        "Conseil : doser lactates, cétonémie, fonction rénale, bilan hépatique ; rechercher une prise de metformine, une diarrhée, une intoxication (méthanol, éthylène glycol, salicylés).",
    });

    const hco3 = v.hco3!;
    const deltaRatio = (ag - 12) / (24 - hco3);
    let ratioMsg = "";
    if (deltaRatio < 0.4) ratioMsg = "évoque une composante hyperchlorémique (trou anionique normal) prédominante, ou une erreur de mesure.";
    else if (deltaRatio <= 0.8) ratioMsg = "évoque une acidose mixte : trou anionique élevé associé à une acidose à trou anionique normal.";
    else if (deltaRatio <= 2) ratioMsg = "cohérent avec une acidose métabolique pure à trou anionique élevé.";
    else ratioMsg = "évoque une alcalose métabolique associée, ou une acidose respiratoire chronique préexistante.";
    findings.push({
      title: "Delta ratio",
      level: "info",
      scoreLabel: `${round1(deltaRatio)}`,
      detail: `(TA − 12) / (24 − HCO₃⁻) : ${ratioMsg}`,
    });
  } else {
    const uag = urinaryAnionGap(v);
    if (uag === undefined) {
      findings.push({
        title: "Trou anionique normal",
        level: "moderate",
        scoreLabel: `TA ${round1(ag)} mmol/L${corrected ? " (corrigé albumine)" : ""}`,
        detail: "Renseignez le ionogramme urinaire ci-dessous (Na⁺, K⁺, Cl⁻) pour calculer le trou anionique urinaire et orienter l'origine (rénale ou digestive).",
      });
    } else {
      const renal = uag >= 0;
      findings.push({
        title: renal ? "Acidose tubulaire rénale probable" : "Perte digestive de bicarbonates probable",
        level: renal ? "high" : "moderate",
        scoreLabel: `Trou anionique urinaire ${round1(uag)} mmol/L`,
        detail: renal
          ? "Trou anionique urinaire ≥ 0 : excrétion d'ammonium inadaptée à l'acidose, évocateur d'une acidose tubulaire rénale."
          : "Trou anionique urinaire < 0 : excrétion d'ammonium augmentée (réponse rénale appropriée), évocateur d'une perte digestive de bicarbonates (diarrhée).",
      });
      findings.push({
        title: "Limite d'interprétation",
        level: "info",
        detail: "Le trou anionique urinaire n'est interprétable qu'avec une natriurèse suffisante (Na⁺ urinaire > 20-25 mmol/L) et en l'absence d'anions urinaires non mesurés (cétonurie, toxiques).",
      });
    }
  }

  return findings;
}

function oxygenationAndLactate(v: Values): Interpretation[] {
  const findings: Interpretation[] = [];
  const isArterial = (v.mode ?? 0) === 0;
  const pao2 = v.po2;

  if (isArterial && pao2 !== undefined) {
    let title = "";
    let level: Level = "low";
    if (pao2 >= 80) {
      title = "Oxygénation normale";
      level = "low";
    } else if (pao2 >= 60) {
      title = "Hypoxémie légère";
      level = "moderate";
    } else if (pao2 >= 40) {
      title = "Hypoxémie modérée à sévère";
      level = "high";
    } else {
      title = "Hypoxémie sévère";
      level = "critical";
    }
    findings.push({ title, level, scoreLabel: `PaO₂ ${pao2} mmHg` });

    const fio2 = v.fio2;
    if (fio2 !== undefined && fio2 > 0) {
      const pf = round1(pao2 / (fio2 / 100));
      let pfLevel: Level = "low";
      let pfTitle = "Rapport PaO₂/FiO₂ normal";
      if (pf < 100) {
        pfTitle = "Rapport PaO₂/FiO₂ : atteinte sévère de l'oxygénation";
        pfLevel = "critical";
      } else if (pf < 200) {
        pfTitle = "Rapport PaO₂/FiO₂ : atteinte modérée de l'oxygénation";
        pfLevel = "high";
      } else if (pf < 300) {
        pfTitle = "Rapport PaO₂/FiO₂ : atteinte légère de l'oxygénation";
        pfLevel = "moderate";
      }
      findings.push({
        title: pfTitle,
        level: pfLevel,
        scoreLabel: `P/F ${pf}`,
        detail: "Seuils issus de la définition de Berlin du SDRA (composante d'oxygénation uniquement).",
      });
    }
  } else if (!isArterial && pao2 !== undefined) {
    findings.push({
      title: "Oxygénation non évaluable sur gaz veineux",
      level: "info",
      detail: "La PvO₂ ne reflète pas fiablement l'oxygénation artérielle : utiliser une SpO₂/gaz artériel si l'oxygénation doit être évaluée.",
    });
  }

  const lactate = v.lactate;
  if (lactate !== undefined) {
    let title = "Lactate normal";
    let level: Level = "low";
    let detail: string | undefined;
    if (lactate > 4) {
      title = "Hyperlactatémie sévère";
      level = "critical";
      detail = "Évoque une hypoperfusion tissulaire significative (choc, sepsis) ; facteur pronostique péjoratif. Rechercher et traiter la cause en urgence.";
    } else if (lactate >= 2) {
      title = "Hyperlactatémie modérée";
      level = "moderate";
      detail = "Évoquer hypoperfusion débutante, sepsis, effort intense, certains médicaments (metformine, adrénaline). À recontrôler selon le contexte.";
    }
    findings.push({ title, level, scoreLabel: `Lactate ${lactate} mmol/L`, detail });
  }

  return findings;
}

export const abg: Calculator = {
  id: "gaz-du-sang",
  name: "Interprétation du gaz du sang (artériel ou veineux)",
  shortName: "Gaz du sang",
  category: "biologie",
  keywords: ["gds", "gaz du sang", "gazometrie", "gazométrie", "acidose", "alcalose", "ph", "bicarbonates", "trou anionique"],
  summary: "Trouble acido-basique, trou anionique guidé pas à pas, oxygénation et lactate.",
  fields: [
    {
      type: "select",
      id: "mode",
      label: "Type de prélèvement",
      options: [
        { label: "Artériel", value: 0 },
        { label: "Veineux", value: 1 },
      ],
    },
    {
      type: "select",
      id: "duration",
      label: "Si trouble respiratoire primaire : durée d'évolution",
      options: [
        { label: "Aiguë", value: 0 },
        { label: "Chronique", value: 1 },
      ],
    },
    { type: "number", id: "ph", label: "pH", step: 0.01 },
    { type: "number", id: "pco2", label: "PaCO₂ (ou PvCO₂)", unit: "mmHg", step: 1 },
    { type: "number", id: "po2", label: "PaO₂ (ou PvO₂)", unit: "mmHg", step: 1 },
    { type: "number", id: "hco3", label: "Bicarbonates (HCO₃⁻)", unit: "mmol/L", step: 0.5 },
    { type: "number", id: "lactate", label: "Lactate", unit: "mmol/L", step: 0.1, group: "Optionnel" },
    { type: "number", id: "fio2", label: "FiO₂", unit: "%", min: 21, max: 100, step: 1, group: "Optionnel", visibleIf: (v) => (v.mode ?? 0) === 0 },
    {
      type: "number",
      id: "na",
      label: "Sodium (Na⁺)",
      unit: "mmol/L",
      step: 1,
      group: "Trou anionique — acidose métabolique détectée",
      visibleIf: hasMetabolicAcidosisComponent,
    },
    {
      type: "number",
      id: "cl",
      label: "Chlore (Cl⁻)",
      unit: "mmol/L",
      step: 1,
      group: "Trou anionique — acidose métabolique détectée",
      visibleIf: hasMetabolicAcidosisComponent,
    },
    {
      type: "number",
      id: "albumin",
      label: "Albumine (correction du trou anionique)",
      unit: "g/L",
      step: 1,
      group: "Optionnel",
      visibleIf: hasMetabolicAcidosisComponent,
    },
    {
      type: "number",
      id: "naU",
      label: "Sodium urinaire",
      unit: "mmol/L",
      step: 1,
      group: "Trou anionique urinaire — trou anionique normal",
      visibleIf: showUrinaryGapFields,
    },
    {
      type: "number",
      id: "clU",
      label: "Chlore urinaire",
      unit: "mmol/L",
      step: 1,
      group: "Trou anionique urinaire — trou anionique normal",
      visibleIf: showUrinaryGapFields,
    },
    {
      type: "number",
      id: "kU",
      label: "Potassium urinaire",
      unit: "mmol/L",
      step: 1,
      group: "Trou anionique urinaire — trou anionique normal",
      visibleIf: showUrinaryGapFields,
    },
  ],
  requiredNumberFieldIds: ["ph", "pco2", "po2", "hco3"],
  getRecommendedFieldIds: (v) => {
    const ids: string[] = [];
    if (hasMetabolicAcidosisComponent(v)) {
      ids.push("na", "cl");
      if (showUrinaryGapFields(v)) ids.push("naU", "clU", "kU");
    }
    return ids;
  },
  compute: () => 0,
  interpret: (_score, v) => [...acidBaseFindings(v), ...anionGapFindings(v), ...oxygenationAndLactate(v)],
  source:
    "Approche de Boston (Narins & Emmett, Medicine 1980) ; formule de Winter (Winters RW et al., Ann N Y Acad Sci 1967) ; trou anionique urinaire (Goldstein MB et al., Ann Intern Med 1986) ; définition de Berlin du SDRA (JAMA 2012).",
  notes:
    "Les formules de compensation sont des approximations. Le trou anionique urinaire ne s'applique qu'aux acidoses métaboliques hyperchlorémiques (trou anionique plasmatique normal).",
};
