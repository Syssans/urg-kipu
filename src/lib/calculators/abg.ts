import type { Calculator, Interpretation, Level, Values } from "./types";

const PH_LOW = 7.35;
const PH_HIGH = 7.45;
const PCO2_LOW = 35;
const PCO2_HIGH = 45;
const HCO3_LOW = 22;
const HCO3_HIGH = 26;

function round1(n: number) {
  return Math.round(n * 10) / 10;
}

function acidBaseFindings(v: Values): Interpretation[] {
  const ph = v.ph ?? 0;
  const pco2 = v.pco2 ?? 0;
  const hco3 = v.hco3 ?? 0;
  const chronic = (v.duration ?? 0) === 1;

  const acidemia = ph < PH_LOW;
  const alkalemia = ph > PH_HIGH;
  const metAcidosis = hco3 < HCO3_LOW;
  const metAlkalosis = hco3 > HCO3_HIGH;
  const respAcidosis = pco2 > PCO2_HIGH;
  const respAlkalosis = pco2 < PCO2_LOW;

  const findings: Interpretation[] = [];

  const phLevel: Level = acidemia || alkalemia ? "high" : "low";
  findings.push({
    title: acidemia ? "Acidémie" : alkalemia ? "Alcalémie" : "pH normal",
    level: phLevel,
    scoreLabel: `pH ${ph.toFixed(2)}`,
  });

  // Mixed same-direction disorder (both metabolic and respiratory push in the same direction)
  if (acidemia && metAcidosis && respAcidosis) {
    findings.push({
      title: "Trouble mixte : acidose métabolique + acidose respiratoire",
      level: "critical",
      detail: "Les deux composantes vont dans le sens de l'acidose : il ne s'agit pas d'une compensation mais de deux troubles primaires associés.",
    });
    return withAnionGapAndComponents(v, findings, "acidose");
  }
  if (alkalemia && metAlkalosis && respAlkalosis) {
    findings.push({
      title: "Trouble mixte : alcalose métabolique + alcalose respiratoire",
      level: "high",
      detail: "Les deux composantes vont dans le sens de l'alcalose : deux troubles primaires associés, pas une compensation.",
    });
    return withAnionGapAndComponents(v, findings, "alcalose");
  }

  // Primary metabolic acidosis
  if (metAcidosis && !alkalemia) {
    const expected = round1(1.5 * hco3 + 8);
    const low = expected - 2;
    const high = expected + 2;
    findings.push({
      title: "Trouble primaire : acidose métabolique",
      level: "high",
      scoreLabel: `HCO₃⁻ ${hco3} mmol/L`,
    });
    findings.push(compensationFinding(pco2, low, high, expected, "PaCO₂", "compensation respiratoire (formule de Winter)"));
    return withAnionGapAndComponents(v, findings, "acidose");
  }

  // Primary metabolic alkalosis
  if (metAlkalosis && !acidemia) {
    const expected = round1(40 + 0.7 * (hco3 - 24));
    const low = expected - 5;
    const high = expected + 5;
    findings.push({
      title: "Trouble primaire : alcalose métabolique",
      level: "moderate",
      scoreLabel: `HCO₃⁻ ${hco3} mmol/L`,
    });
    findings.push(compensationFinding(pco2, low, high, expected, "PaCO₂", "compensation respiratoire attendue"));
    return withAnionGapAndComponents(v, findings, "alcalose");
  }

  // Primary respiratory acidosis
  if (respAcidosis && !alkalemia) {
    const deltaPco2 = pco2 - 40;
    const factor = chronic ? 0.35 : 0.1;
    const expected = round1(24 + factor * deltaPco2);
    const tol = chronic ? 4 : 3;
    findings.push({
      title: `Trouble primaire : acidose respiratoire (${chronic ? "chronique" : "aiguë"})`,
      level: "high",
      scoreLabel: `PaCO₂ ${pco2} mmHg`,
    });
    findings.push(compensationFinding(hco3, expected - tol, expected + tol, expected, "HCO₃⁻", `compensation métabolique attendue (${chronic ? "chronique" : "aiguë"})`));
    return withAnionGapAndComponents(v, findings, "acidose");
  }

  // Primary respiratory alkalosis
  if (respAlkalosis && !acidemia) {
    const deltaPco2 = 40 - pco2;
    const factor = chronic ? 0.4 : 0.2;
    const expected = round1(24 - factor * deltaPco2);
    const tol = chronic ? 4 : 3;
    findings.push({
      title: `Trouble primaire : alcalose respiratoire (${chronic ? "chronique" : "aiguë"})`,
      level: "moderate",
      scoreLabel: `PaCO₂ ${pco2} mmHg`,
    });
    findings.push(compensationFinding(hco3, expected - tol, expected + tol, expected, "HCO₃⁻", `compensation métabolique attendue (${chronic ? "chronique" : "aiguë"})`));
    return withAnionGapAndComponents(v, findings, "alcalose");
  }

  // No component crossed a primary threshold
  if (!acidemia && !alkalemia) {
    findings.push({
      title: "Équilibre acido-basique normal",
      level: "low",
    });
  } else {
    findings.push({
      title: "Profil non univoque",
      level: "moderate",
      detail: "Le pH est anormal mais HCO₃⁻ et PaCO₂ sont dans les plages usuelles retenues ici : vérifier les valeurs saisies ou évoquer un trouble mixte discret.",
    });
  }
  return withAnionGapAndComponents(v, findings, null);
}

function compensationFinding(
  measured: number,
  low: number,
  high: number,
  expected: number,
  paramLabel: string,
  contextLabel: string,
): Interpretation {
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

function withAnionGapAndComponents(v: Values, findings: Interpretation[], acidBaseContext: "acidose" | "alcalose" | null): Interpretation[] {
  const na = v.na;
  const cl = v.cl;
  const hco3 = v.hco3 ?? 0;
  const albumin = v.albumin;

  if (na !== undefined && cl !== undefined) {
    const ag = na - (cl + hco3);
    const correction = albumin !== undefined ? 0.25 * (44 - albumin) : 0;
    const agCorrected = ag + correction;
    const displayAg = albumin !== undefined ? agCorrected : ag;
    const elevated = displayAg > 16;

    findings.push({
      title: elevated ? "Trou anionique élevé" : "Trou anionique normal",
      level: elevated ? "high" : "info",
      scoreLabel: `TA ${round1(displayAg)} mmol/L${albumin !== undefined ? " (corrigé albumine)" : ""}`,
      detail: elevated
        ? "Évoquer : acidocétose (diabétique, alcoolique, de jeûne), acidose lactique, insuffisance rénale, intoxications (méthanol, éthylène glycol, salicylés)."
        : acidBaseContext === "acidose"
        ? "Trou anionique normal avec acidose métabolique : évoquer pertes digestives de bicarbonates (diarrhée), acidose tubulaire rénale, apports chlorés."
        : "Dans la plage usuelle (8-16 mmol/L, dépend de la méthode du laboratoire).",
    });

    if (elevated && acidBaseContext === "acidose") {
      const deltaRatio = (displayAg - 12) / (24 - hco3);
      let ratioMsg = "";
      if (deltaRatio < 0.4) ratioMsg = "évoque une composante hyperchlorémique (trou anionique normal) prédominante, ou une erreur de mesure.";
      else if (deltaRatio <= 0.8) ratioMsg = "évoque une acidose mixte : trou anionique élevé associé à une acidose à trou anionique normal.";
      else if (deltaRatio <= 2) ratioMsg = "cohérent avec une acidose métabolique pure à trou anionique élevé.";
      else ratioMsg = "évoque une alcalose métabolique associée, ou une acidose respiratoire chronique préexistante (bicarbonates plus élevés que ne le voudrait la seule acidose à trou anionique élevé).";
      findings.push({
        title: "Delta ratio",
        level: "info",
        scoreLabel: `${round1(deltaRatio)}`,
        detail: `Delta ratio = (TA − 12) / (24 − HCO₃⁻) : ${ratioMsg}`,
      });
    }
  }

  return oxygenationAndLactate(v, findings);
}

function oxygenationAndLactate(v: Values, findings: Interpretation[]): Interpretation[] {
  const isArterial = (v.mode ?? 0) === 0;
  const pao2 = v.pao2;
  const fio2 = v.fio2;

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
        detail: "Seuils issus de la définition de Berlin du SDRA (composante d'oxygénation uniquement ; le diagnostic de SDRA nécessite aussi le contexte, l'imagerie et l'exclusion d'une cause cardiogénique).",
      });
    }
  } else if (!isArterial) {
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
  keywords: ["gds", "gaz du sang", "gazometrie", "gazométrie", "acidose", "alcalose", "ph", "bicarbonates"],
  summary: "Trouble acido-basique primaire, compensation, trou anionique, oxygénation et lactate.",
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
    { type: "number", id: "ph", label: "pH", step: 0.01, group: "Équilibre acido-basique" },
    { type: "number", id: "pco2", label: "PaCO₂ (ou PvCO₂)", unit: "mmHg", step: 1, group: "Équilibre acido-basique" },
    { type: "number", id: "hco3", label: "Bicarbonates (HCO₃⁻)", unit: "mmol/L", step: 0.5, group: "Équilibre acido-basique" },
    { type: "number", id: "na", label: "Sodium (Na⁺)", unit: "mmol/L", step: 1, group: "Trou anionique (optionnel)" },
    { type: "number", id: "cl", label: "Chlore (Cl⁻)", unit: "mmol/L", step: 1, group: "Trou anionique (optionnel)" },
    { type: "number", id: "albumin", label: "Albumine", unit: "g/L", step: 1, group: "Trou anionique (optionnel)" },
    { type: "number", id: "pao2", label: "PaO₂", unit: "mmHg", step: 1, group: "Oxygénation (si artériel)" },
    { type: "number", id: "fio2", label: "FiO₂", unit: "%", min: 21, max: 100, step: 1, group: "Oxygénation (si artériel)" },
    { type: "number", id: "lactate", label: "Lactate", unit: "mmol/L", step: 0.1, group: "Lactate (optionnel)" },
  ],
  requiredNumberFieldIds: ["ph", "pco2", "hco3"],
  compute: () => 0,
  interpret: (_score, v) => acidBaseFindings(v),
  source:
    "Approche de Boston (Narins & Emmett, Medicine 1980) ; formule de Winter (Winters RW et al., Ann N Y Acad Sci 1967) ; définition de Berlin du SDRA (JAMA 2012).",
  notes:
    "Les formules de compensation sont des approximations (tolérance ± indiquée) : un résultat hors plage évoque un trouble surajouté mais ne le confirme pas formellement. Le trou anionique normal usuel dépend de la méthode du laboratoire (souvent cité entre 8 et 16 mmol/L).",
};
