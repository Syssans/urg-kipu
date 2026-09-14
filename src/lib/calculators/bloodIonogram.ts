import type { Calculator, Interpretation, Level, Values } from "./types";

function bloodIonogramFindings(v: Values): Interpretation[] {
  const findings: Interpretation[] = [];

  const na = v.na ?? 0;
  if (na < 135) {
    let level: Level = "moderate";
    let severity = "légère";
    if (na < 125) {
      level = "critical";
      severity = "sévère";
    } else if (na < 130) {
      level = "high";
      severity = "modérée";
    }
    findings.push({
      title: `Hyponatrémie ${severity}`,
      level,
      scoreLabel: `Na⁺ ${na} mmol/L`,
      detail: "Classer selon le statut volémique clinique (hypo/eu/hypervolémique) et la natriurèse pour orienter l'étiologie (SIADH, pertes extra-rénales, insuffisance cardiaque/cirrhose, potomanie...).",
    });
  } else if (na > 145) {
    let level: Level = "moderate";
    let severity = "légère";
    if (na >= 160) {
      level = "critical";
      severity = "sévère";
    } else if (na >= 151) {
      level = "high";
      severity = "modérée";
    }
    findings.push({
      title: `Hypernatrémie ${severity}`,
      level,
      scoreLabel: `Na⁺ ${na} mmol/L`,
      detail: "Le plus souvent un déficit en eau libre : apports insuffisants, pertes digestives/rénales/cutanées, diabète insipide.",
    });
  } else {
    findings.push({ title: "Natrémie normale", level: "low", scoreLabel: `Na⁺ ${na} mmol/L` });
  }

  const k = v.k ?? 0;
  if (k < 3.5) {
    let level: Level = "moderate";
    let severity = "légère";
    if (k < 2.5) {
      level = "critical";
      severity = "sévère";
    } else if (k < 3) {
      level = "high";
      severity = "modérée";
    }
    findings.push({
      title: `Hypokaliémie ${severity}`,
      level,
      scoreLabel: `K⁺ ${k} mmol/L`,
      detail: k < 2.5 ? "ECG recommandé (risque de troubles du rythme)." : undefined,
    });
  } else if (k > 5) {
    let level: Level = "moderate";
    let severity = "légère";
    if (k >= 6.5) {
      level = "critical";
      severity = "sévère";
    } else if (k >= 6) {
      level = "high";
      severity = "modérée";
    }
    findings.push({
      title: `Hyperkaliémie ${severity}`,
      level,
      scoreLabel: `K⁺ ${k} mmol/L`,
      detail: k >= 6 ? "ECG urgent (risque de troubles du rythme graves, notamment si évolution rapide)." : undefined,
    });
  } else {
    findings.push({ title: "Kaliémie normale", level: "low", scoreLabel: `K⁺ ${k} mmol/L` });
  }

  const cl = v.cl;
  if (cl !== undefined) {
    const low = cl < 98;
    const high = cl > 107;
    findings.push({
      title: high ? "Hyperchlorémie" : low ? "Hypochlorémie" : "Chlorémie normale",
      level: high || low ? "moderate" : "low",
      scoreLabel: `Cl⁻ ${cl} mmol/L`,
      detail: high
        ? "Souvent associée à une acidose métabolique à trou anionique normal (pertes digestives basses, acidose tubulaire, apports chlorés)."
        : low
        ? "Souvent associée à une alcalose métabolique (vomissements, aspiration digestive, diurétiques)."
        : undefined,
    });
  }

  const hco3 = v.hco3;
  if (hco3 !== undefined) {
    const low = hco3 < 22;
    const high = hco3 > 26;
    findings.push({
      title: high ? "Bicarbonates élevés" : low ? "Bicarbonates bas" : "Bicarbonates normaux",
      level: high || low ? "moderate" : "low",
      scoreLabel: `HCO₃⁻ ${hco3} mmol/L`,
      detail: high || low ? "Pour une interprétation acido-basique complète (compensation, trou anionique), utiliser l'outil « Gaz du sang »." : undefined,
    });
  }

  const ca = v.ca;
  const albumin = v.albumin;
  if (ca !== undefined) {
    const caCorrected = albumin !== undefined ? ca + 0.02 * (40 - albumin) : ca;
    const low = caCorrected < 2.2;
    const high = caCorrected > 2.6;
    findings.push({
      title: high ? "Hypercalcémie" : low ? "Hypocalcémie" : "Calcémie normale",
      level: high || low ? "moderate" : "low",
      scoreLabel: `Ca²⁺ corrigé ${caCorrected.toFixed(2)} mmol/L${albumin !== undefined ? "" : " (non corrigé, albumine non renseignée)"}`,
      detail: low
        ? "Rechercher paresthésies, signe de Chvostek/Trousseau ; risque d'allongement du QT si sévère."
        : high
        ? "Rechercher polyurie, troubles digestifs, confusion ; risque cardiaque si sévère (> 3,5 mmol/L)."
        : undefined,
    });
  }

  const mg = v.mg;
  if (mg !== undefined) {
    const low = mg < 0.65;
    const high = mg > 1.05;
    findings.push({
      title: high ? "Hypermagnésémie" : low ? "Hypomagnésémie" : "Magnésémie normale",
      level: high || low ? "moderate" : "low",
      scoreLabel: `Mg²⁺ ${mg} mmol/L`,
    });
  }

  const phosphate = v.phosphate;
  if (phosphate !== undefined) {
    const low = phosphate < 0.8;
    const high = phosphate > 1.45;
    findings.push({
      title: high ? "Hyperphosphorémie" : low ? "Hypophosphorémie" : "Phosphorémie normale",
      level: high || low ? "moderate" : "low",
      scoreLabel: `Phosphore ${phosphate} mmol/L`,
    });
  }

  return findings;
}

export const bloodIonogram: Calculator = {
  id: "ionogramme-sanguin",
  name: "Interprétation de l'ionogramme sanguin",
  shortName: "Ionogramme sanguin",
  category: "biologie",
  keywords: ["ionogramme", "ionogramme sanguin", "natremie", "natrémie", "kaliemie", "kaliémie", "calcemie", "calcémie"],
  summary: "Repérage et orientation étiologique des principales dysnatrémies, dyskaliémies et autres désordres électrolytiques.",
  fields: [
    { type: "number", id: "na", label: "Sodium (Na⁺)", unit: "mmol/L", step: 1 },
    { type: "number", id: "k", label: "Potassium (K⁺)", unit: "mmol/L", step: 0.1 },
    { type: "number", id: "cl", label: "Chlore (Cl⁻)", unit: "mmol/L", step: 1, group: "Optionnel" },
    { type: "number", id: "hco3", label: "Bicarbonates (HCO₃⁻)", unit: "mmol/L", step: 0.5, group: "Optionnel" },
    { type: "number", id: "ca", label: "Calcium (mesuré, non corrigé)", unit: "mmol/L", step: 0.01, group: "Optionnel" },
    { type: "number", id: "albumin", label: "Albumine (pour correction du calcium)", unit: "g/L", step: 1, group: "Optionnel" },
    { type: "number", id: "mg", label: "Magnésium", unit: "mmol/L", step: 0.01, group: "Optionnel" },
    { type: "number", id: "phosphate", label: "Phosphore", unit: "mmol/L", step: 0.01, group: "Optionnel" },
  ],
  requiredNumberFieldIds: ["na", "k"],
  compute: () => 0,
  interpret: (_score, v) => bloodIonogramFindings(v),
  source: "Valeurs usuelles de référence adulte (biologie médicale courante).",
  notes:
    "Correction du calcium : Ca corrigé (mmol/L) = Ca mesuré + 0,02 × (40 − albumine g/L). Les orientations étiologiques sont générales : toujours corréler à la clinique, aux traitements en cours et à la fonction rénale.",
};
