import type { Calculator, Interpretation, Level, Values } from "./types";

function coagulationFindings(v: Values): Interpretation[] {
  const findings: Interpretation[] = [];

  const inr = v.inr;
  const tpPercent = v.tpPercent;
  const tcaRatio = v.tcaRatio;
  const fibrinogene = v.fibrinogene ?? 0;
  const plaquettes = v.plaquettes ?? 0;

  const tpProlonged = inr !== undefined ? inr > 1.2 : tpPercent !== undefined ? tpPercent < 70 : undefined;
  const tcaProlonged = tcaRatio !== undefined ? tcaRatio > 1.2 : undefined;

  if (inr !== undefined) {
    findings.push({
      title: tpProlonged ? "TP/INR allongé" : "TP/INR normal",
      level: tpProlonged ? "moderate" : "low",
      scoreLabel: `INR ${inr}${tpPercent !== undefined ? ` (TP ${tpPercent} %)` : ""}`,
    });
  }
  if (tcaRatio !== undefined) {
    findings.push({
      title: tcaProlonged ? "TCA allongé" : "TCA normal",
      level: tcaProlonged ? "moderate" : "low",
      scoreLabel: `Ratio TCA ${tcaRatio}`,
    });
  }

  if (tpProlonged && tcaProlonged) {
    findings.push({
      title: "Allongement combiné du TP et du TCA",
      level: "high",
      detail: "Évoquer : déficit en facteurs de la voie commune (II, V, X), insuffisance hépatocellulaire sévère, CIVD, surdosage en AVK/héparine, ou déficits combinés.",
    });
  } else if (tpProlonged && tcaProlonged === false) {
    findings.push({
      title: "Allongement isolé du TP/INR",
      level: "moderate",
      detail: "Évoquer : déficit en facteur VII, traitement par AVK, insuffisance hépatique débutante, carence en vitamine K débutante.",
    });
  } else if (tcaProlonged && tpProlonged === false) {
    findings.push({
      title: "Allongement isolé du TCA",
      level: "moderate",
      detail: "Évoquer : déficit en facteurs VIII/IX/XI/XII (hémophilies, Willebrand), anticoagulant circulant (antiphospholipides), héparine, inhibiteur acquis.",
    });
  }

  // Fibrinogen
  let fibrinogenLevel: Level = "low";
  let fibrinogenTitle = "Fibrinogène normal";
  if (fibrinogene < 1) {
    fibrinogenLevel = "critical";
    fibrinogenTitle = "Hypofibrinogénémie sévère";
  } else if (fibrinogene < 2) {
    fibrinogenLevel = "high";
    fibrinogenTitle = "Hypofibrinogénémie";
  } else if (fibrinogene > 4) {
    fibrinogenLevel = "info";
    fibrinogenTitle = "Fibrinogène élevé";
  }
  findings.push({
    title: fibrinogenTitle,
    level: fibrinogenLevel,
    scoreLabel: `${fibrinogene} g/L`,
    detail:
      fibrinogenLevel === "critical" || fibrinogenLevel === "high"
        ? "Évoquer CIVD, insuffisance hépatique sévère, hyperfibrinolyse, dilution massive (transfusion)."
        : fibrinogenLevel === "info"
        ? "Marqueur inflammatoire non spécifique (protéine de l'inflammation)."
        : undefined,
  });

  // Platelets
  let pltLevel: Level = "low";
  let pltTitle = "Plaquettes normales";
  let pltDetail: string | undefined;
  if (plaquettes < 20) {
    pltLevel = "critical";
    pltTitle = "Thrombopénie sévère";
    pltDetail = "Risque hémorragique spontané élevé ; seuil transfusionnel prophylactique généralement indiqué (à adapter au contexte, notamment fièvre/sepsis).";
  } else if (plaquettes < 50) {
    pltLevel = "high";
    pltTitle = "Thrombopénie modérée";
    pltDetail = "Seuil habituellement requis avant un geste invasif courant (~50 G/L) ; risque hémorragique spontané plus faible en l'absence d'autre facteur.";
  } else if (plaquettes < 150) {
    pltLevel = "moderate";
    pltTitle = "Thrombopénie légère";
  } else if (plaquettes > 450) {
    pltLevel = "info";
    pltTitle = "Thrombocytose";
    pltDetail = "Rechercher une cause réactionnelle (inflammation, carence martiale, splénectomie) avant d'évoquer un syndrome myéloprolifératif.";
  }
  findings.push({ title: pltTitle, level: pltLevel, scoreLabel: `${plaquettes} G/L`, detail: pltDetail });

  // ISTH overt DIC score
  const underlyingDisorder = (v.underlyingDisorder ?? 0) === 1;
  const ddimerPoints = v.ddimerLevel;
  const tpProlongationSec = v.tpProlongationSec;

  if (underlyingDisorder) {
    if (ddimerPoints !== undefined && tpProlongationSec !== undefined) {
      const pltPoints = plaquettes > 100 ? 0 : plaquettes >= 50 ? 1 : 2;
      const fibPoints = fibrinogene > 1 ? 0 : 1;
      const tpPoints = tpProlongationSec < 3 ? 0 : tpProlongationSec <= 6 ? 1 : 2;
      const total = pltPoints + fibPoints + tpPoints + ddimerPoints;
      const overt = total >= 5;
      findings.push({
        title: overt ? "Score ISTH : compatible avec une CIVD patente" : "Score ISTH : CIVD non patente sur ce score",
        level: overt ? "critical" : "moderate",
        scoreLabel: `${total} / 8`,
        detail: overt
          ? "Score ≥ 5 : compatible avec une coagulation intravasculaire disséminée patente. Prise en charge de la cause sous-jacente en priorité."
          : "Score < 5 : ne permet pas d'affirmer une CIVD patente ; répéter le bilan dans les 24-48h si la suspicion clinique persiste.",
      });
    } else {
      findings.push({
        title: "Score ISTH incomplet",
        level: "info",
        detail: "Renseignez l'allongement du TP (secondes) et le niveau de D-dimères pour calculer le score de CIVD.",
      });
    }
  }

  return findings;
}

export const coagulation: Calculator = {
  id: "bilan-coagulation",
  name: "Interprétation du bilan de coagulation",
  shortName: "Coagulation",
  category: "biologie",
  keywords: ["coagulation", "tp", "inr", "tca", "fibrinogene", "fibrinogène", "civd", "plaquettes"],
  summary: "Lecture du TP/INR, TCA, fibrinogène et plaquettes, avec score ISTH de CIVD si contexte évocateur.",
  fields: [
    { type: "number", id: "fibrinogene", label: "Fibrinogène", unit: "g/L", step: 0.1, group: "Fibrinogène et plaquettes" },
    { type: "number", id: "plaquettes", label: "Plaquettes", unit: "G/L", step: 1, group: "Fibrinogène et plaquettes" },
    { type: "number", id: "inr", label: "INR", step: 0.01, group: "TP / TCA (optionnel)" },
    { type: "number", id: "tpPercent", label: "TP", unit: "%", step: 1, group: "TP / TCA (optionnel)" },
    { type: "number", id: "tcaRatio", label: "Ratio TCA (patient/témoin)", step: 0.01, group: "TP / TCA (optionnel)" },
    {
      type: "boolean",
      id: "underlyingDisorder",
      label: "Pathologie sous-jacente évocatrice de CIVD (sepsis sévère, polytraumatisme, pathologie obstétricale grave, hémopathie maligne...)",
      group: "Score de CIVD (ISTH)",
    },
    {
      type: "number",
      id: "tpProlongationSec",
      label: "Allongement du TP par rapport au témoin",
      unit: "secondes",
      step: 0.5,
      group: "Score de CIVD (ISTH)",
    },
    {
      type: "select",
      id: "ddimerLevel",
      label: "D-dimères",
      group: "Score de CIVD (ISTH)",
      options: [
        { label: "Non augmentés — 0 pt", value: 0 },
        { label: "Modérément augmentés — 2 pts", value: 2 },
        { label: "Fortement augmentés — 3 pts", value: 3 },
      ],
    },
  ],
  requiredNumberFieldIds: ["fibrinogene", "plaquettes"],
  compute: () => 0,
  interpret: (_score, v) => coagulationFindings(v),
  source: "Score ISTH de CIVD patente : Taylor FB et al., Thromb Haemost 2001.",
  notes:
    "Le score ISTH ne s'applique qu'en présence d'une pathologie sous-jacente connue pour être associée à une CIVD. Les seuils de D-dimères dépendent fortement de la technique du laboratoire : classer selon le rapport au laboratoire local plutôt que sur une valeur absolue générique.",
};
