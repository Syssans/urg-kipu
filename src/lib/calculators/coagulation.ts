import type { Calculator, Interpretation, Level, Values } from "./types";

function tpTcaFindings(v: Values): Interpretation[] {
  const findings: Interpretation[] = [];

  const inr = v.inr;
  const tpPercent = v.tpPercent;
  const tcaRatio = v.tcaRatio;
  const onAVK = (v.onAVK ?? 0) === 1;
  const onHeparin = (v.onHeparin ?? 0) === 1;

  const tpProlonged = inr !== undefined ? inr > 1.2 : tpPercent !== undefined ? tpPercent < 70 : undefined;
  const tcaProlonged = tcaRatio !== undefined ? tcaRatio > 1.2 : undefined;

  if (inr !== undefined || tpPercent !== undefined) {
    findings.push({
      title: tpProlonged ? "TP/INR allongé" : "TP/INR normal",
      level: tpProlonged ? "moderate" : "low",
      scoreLabel: `INR ${inr ?? "—"}${tpPercent !== undefined ? ` (TP ${tpPercent} %)` : ""}`,
      role: "secondary",
    });
  }
  if (tcaRatio !== undefined) {
    findings.push({
      title: tcaProlonged ? "TCA allongé" : "TCA normal",
      level: tcaProlonged ? "moderate" : "low",
      scoreLabel: `Ratio TCA ${tcaRatio}`,
      role: "secondary",
    });
  }

  if (tpProlonged === undefined && tcaProlonged === undefined) {
    findings.push({
      title: "Renseignez le TP (INR ou %) et/ou le TCA",
      level: "info",
      detail: "L'app en déduit la voie de la coagulation en cause et les facteurs à évoquer.",
    });
    return findings;
  }

  const commonLevel: Level = "high";

  if (tpProlonged && tcaProlonged) {
    let detail =
      "Atteinte de la voie commune, partagée par le TP et le TCA : facteurs II (prothrombine), V, X et fibrinogène (I). " +
      "Causes à évoquer : insuffisance hépatocellulaire sévère (baisse de synthèse globale), carence sévère en vitamine K ou surdosage en AVK (facteurs II, VII, IX, X), " +
      "coagulation intravasculaire disséminée (consommation), dilution massive (remplissage/transfusion massive), déficit combiné en facteurs (rare), hypo/dysfibrinogénémie sévère.";
    if (v.fibrinogene !== undefined && v.fibrinogene < 1) {
      detail += " Fibrinogène très bas ici : composante d'hypofibrinogénémie probable dans l'allongement observé.";
    }
    if (onAVK) {
      detail += " Sous AVK : un allongement combiné franc évoque un surdosage plutôt qu'un simple effet thérapeutique.";
    }
    if (onHeparin) {
      detail += " Sous héparine : l'héparine explique surtout le TCA ; un TP également allongé doit faire chercher une autre cause associée.";
    }
    findings.push({
      title: "TP et TCA tous les deux allongés",
      level: commonLevel,
      scoreLabel: "Voie commune : II, V, X, fibrinogène",
      detail,
    });
  } else if (tpProlonged && tcaProlonged === false) {
    let detail =
      "Le facteur VII est le seul facteur de la voie exogène non partagé avec le TCA ; sa demi-vie courte (≈ 4-6 h) en fait le premier marqueur d'une atteinte débutante. " +
      "Causes à évoquer : carence en vitamine K débutante, insuffisance hépatocellulaire débutante, équilibration d'un traitement par AVK, déficit congénital isolé en facteur VII (rare).";
    if (onAVK) detail += " Sous AVK : allongement isolé du TP attendu, à corréler à la cible d'INR visée.";
    findings.push({
      title: "TP isolé allongé : voie exogène",
      level: "moderate",
      scoreLabel: "Facteur VII",
      detail,
    });
  } else if (tcaProlonged && tpProlonged === false) {
    let detail =
      "Facteurs propres à la voie endogène : VIII, IX, XI, XII (+ prékallicréine, kininogène de haut poids moléculaire). " +
      "Déficit en VIII → hémophilie A ou maladie de Willebrand (le VIII circule complexé au facteur Willebrand). " +
      "Déficit en IX → hémophilie B. Déficit en XI → déficit rare, risque hémorragique variable. " +
      "Déficit en XII (ou prékallicréine/kininogène) → allongement isolé sans risque hémorragique. " +
      "Anticoagulant circulant (antiphospholipides/lupique) → TCA allongé in vitro sans déficit factoriel, possible risque thrombotique paradoxal. " +
      "Un test de mélange (TCA malade + témoin 50/50) différencie un déficit factoriel (correction) d'un anticoagulant circulant (non-correction).";
    if (onHeparin) detail += " Sous héparine (HNF) : allongement isolé du TCA attendu, à corréler à la cible thérapeutique.";
    findings.push({
      title: "TCA isolé allongé : voie endogène",
      level: "moderate",
      scoreLabel: "Facteurs VIII, IX, XI, XII",
      detail,
    });
  } else if (tpProlonged && tcaProlonged === undefined) {
    findings.push({
      title: "TCA non renseigné",
      level: "info",
      detail: "Ajoutez le TCA pour distinguer une atteinte isolée de la voie exogène (facteur VII) d'une atteinte combinée de la voie commune (II, V, X, fibrinogène).",
      role: "secondary",
    });
  } else if (tcaProlonged && tpProlonged === undefined) {
    findings.push({
      title: "TP non renseigné",
      level: "info",
      detail: "Ajoutez le TP/INR pour distinguer une atteinte isolée de la voie endogène (VIII, IX, XI, XII) d'une atteinte combinée de la voie commune (II, V, X, fibrinogène).",
      role: "secondary",
    });
  }

  return findings;
}

function fibrinogenAndPlateletsFindings(v: Values): Interpretation[] {
  const findings: Interpretation[] = [];
  const fibrinogene = v.fibrinogene;
  const plaquettes = v.plaquettes;

  if (fibrinogene !== undefined) {
    let level: Level = "low";
    let title = "Fibrinogène normal";
    if (fibrinogene < 1) {
      level = "critical";
      title = "Hypofibrinogénémie sévère";
    } else if (fibrinogene < 2) {
      level = "high";
      title = "Hypofibrinogénémie";
    } else if (fibrinogene > 4) {
      level = "info";
      title = "Fibrinogène élevé";
    }
    findings.push({
      title,
      level,
      scoreLabel: `${fibrinogene} g/L`,
      detail:
        level === "critical" || level === "high"
          ? "Évoquer CIVD, insuffisance hépatique sévère, hyperfibrinolyse, dilution massive (transfusion)."
          : level === "info"
          ? "Marqueur inflammatoire non spécifique (protéine de l'inflammation)."
          : undefined,
      role: "secondary",
    });
  }

  if (plaquettes !== undefined) {
    let level: Level = "low";
    let title = "Plaquettes normales";
    let detail: string | undefined;
    if (plaquettes < 20) {
      level = "critical";
      title = "Thrombopénie sévère";
      detail = "Risque hémorragique spontané élevé ; seuil transfusionnel prophylactique généralement indiqué (à adapter au contexte, notamment fièvre/sepsis).";
    } else if (plaquettes < 50) {
      level = "high";
      title = "Thrombopénie modérée";
      detail = "Seuil habituellement requis avant un geste invasif courant (~50 G/L) ; risque hémorragique spontané plus faible en l'absence d'autre facteur.";
    } else if (plaquettes < 150) {
      level = "moderate";
      title = "Thrombopénie légère";
    } else if (plaquettes > 450) {
      level = "info";
      title = "Thrombocytose";
      detail = "Rechercher une cause réactionnelle (inflammation, carence martiale, splénectomie) avant d'évoquer un syndrome myéloprolifératif.";
    }
    findings.push({ title, level, scoreLabel: `${plaquettes} G/L`, detail, role: "secondary" });
  }

  return findings;
}

export const coagulation: Calculator = {
  id: "bilan-coagulation",
  name: "Interprétation du bilan de coagulation",
  shortName: "Coagulation",
  category: "biologie",
  keywords: [
    "coagulation",
    "tp",
    "inr",
    "tca",
    "facteur",
    "facteurs de coagulation",
    "hemophilie",
    "hémophilie",
    "willebrand",
    "avk",
    "heparine",
    "héparine",
    "anticoagulant circulant",
    "fibrinogene",
    "fibrinogène",
    "plaquettes",
  ],
  summary: "Étiologies d'une anomalie du TP et/ou du TCA : quelle voie (exogène, endogène, commune) et quels facteurs de coagulation évoquer.",
  fields: [
    { type: "number", id: "inr", label: "INR", step: 0.01 },
    { type: "number", id: "tpPercent", label: "TP", unit: "%", step: 1 },
    { type: "number", id: "tcaRatio", label: "Ratio TCA (patient/témoin)", step: 0.01 },
    { type: "boolean", id: "onAVK", label: "Traitement par AVK en cours", group: "Contexte (optionnel)" },
    { type: "boolean", id: "onHeparin", label: "Traitement par héparine (HNF/HBPM) en cours", group: "Contexte (optionnel)" },
    { type: "number", id: "fibrinogene", label: "Fibrinogène", unit: "g/L", step: 0.1, group: "Fibrinogène et plaquettes (optionnel)" },
    { type: "number", id: "plaquettes", label: "Plaquettes", unit: "G/L", step: 1, group: "Fibrinogène et plaquettes (optionnel)" },
  ],
  compute: () => 0,
  interpret: (_score, v) => [...tpTcaFindings(v), ...fibrinogenAndPlateletsFindings(v)],
  source: "Physiopathologie classique de la cascade de la coagulation (voies exogène, endogène et commune) et sémiologie du bilan standard TP/TCA.",
  notes:
    "Outil d'orientation étiologique, pas de score chiffré : en cas d'allongement isolé du TCA, un test de mélange (malade + témoin) reste l'étape clé pour distinguer déficit factoriel et anticoagulant circulant. Les seuils de prolongation utilisés ici (INR > 1,2, TP < 70 %, ratio TCA > 1,2) sont des repères usuels ; se référer aux normes du laboratoire local.",
};
