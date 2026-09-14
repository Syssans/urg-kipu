import type { Calculator, Interpretation, Level, Values } from "./types";

function round1(n: number) {
  return Math.round(n * 10) / 10;
}

function urineIonogramFindings(v: Values): Interpretation[] {
  const findings: Interpretation[] = [];

  const naU = v.naU;
  const naP = v.naP;
  const creatU = v.creatU;
  const creatP = v.creatP;
  const ureeU = v.ureeU;
  const ureeP = v.ureeP;
  const diuretics = (v.diuretics ?? 0) === 1;
  const osmoU = v.osmoU;

  const canComputeFena = naU !== undefined && naP !== undefined && creatU !== undefined && creatP !== undefined && naP > 0 && creatU > 0;
  const canComputeFeuree = ureeU !== undefined && ureeP !== undefined && creatU !== undefined && creatP !== undefined && ureeP > 0 && creatU > 0;

  if (canComputeFena) {
    const fena = (naU! * creatP!) / (naP! * creatU!) * 100;
    let title = "";
    let level: Level = "moderate";
    let detail = "";
    if (fena < 1) {
      title = "FENa < 1 % : origine pré-rénale probable";
      level = "moderate";
      detail = "Évoque une insuffisance rénale fonctionnelle (hypoperfusion rénale) : hypovolémie, bas débit cardiaque, syndrome hépatorénal.";
    } else if (fena > 2) {
      title = "FENa > 2 % : origine rénale (nécrose tubulaire aiguë) probable";
      level = "high";
      detail = "Évoque une atteinte tubulaire intrinsèque (nécrose tubulaire aiguë ischémique ou toxique).";
    } else {
      title = "FENa en zone intermédiaire (1-2 %)";
      level = "moderate";
      detail = "Peu discriminant : s'appuyer sur le contexte clinique et, si besoin, la FEUrée.";
    }
    if (diuretics) {
      detail += " Patient sous diurétiques : la FENa est peu fiable dans ce contexte, privilégier la FEUrée.";
    }
    findings.push({ title, level, scoreLabel: `FENa ${round1(fena)} %`, detail });
  }

  if (canComputeFeuree) {
    const feuree = (ureeU! * creatP!) / (ureeP! * creatU!) * 100;
    let title = "";
    let level: Level = "moderate";
    let detail = "";
    if (feuree < 35) {
      title = "FEUrée < 35 % : origine pré-rénale probable";
      level = "moderate";
      detail = "Reste interprétable sous diurétiques, contrairement à la FENa.";
    } else if (feuree > 50) {
      title = "FEUrée > 50 % : origine rénale (nécrose tubulaire aiguë) probable";
      level = "high";
    } else {
      title = "FEUrée en zone intermédiaire (35-50 %)";
      level = "moderate";
      detail = "Peu discriminant isolément : corréler au contexte clinique.";
    }
    findings.push({ title, level, scoreLabel: `FEUrée ${round1(feuree)} %`, detail });
  }

  if (!canComputeFena && !canComputeFeuree) {
    findings.push({
      title: "Données insuffisantes pour calculer la FENa/FEUrée",
      level: "info",
      detail: "Renseignez sodium et créatinine urinaires + sanguins (FENa), ou urée et créatinine urinaires + sanguines (FEUrée).",
    });
  }

  if (naU !== undefined) {
    const low = naU < 30;
    findings.push({
      title: low ? "Natriurèse basse" : "Natriurèse non basse",
      level: "info",
      scoreLabel: `Na⁺ urinaire ${naU} mmol/L`,
      detail: low
        ? "Dans un contexte d'hyponatrémie : évoque une hypovolémie vraie ou efficace (pertes extra-rénales, insuffisance cardiaque, cirrhose, syndrome néphrotique) — le rein retient le sodium de façon appropriée."
        : "Dans un contexte d'hyponatrémie : évoque un SIADH (si euvolémie clinique), des pertes rénales de sel (diurétiques, insuffisance surrénalienne, néphropathie avec perte de sel) ou une hypervolémie avec insuffisance rénale.",
    });
  }

  if (osmoU !== undefined) {
    const low = osmoU < 100;
    findings.push({
      title: low ? "Osmolalité urinaire basse (< 100 mOsm/kg)" : "Osmolalité urinaire non basse",
      level: "info",
      scoreLabel: `${osmoU} mOsm/kg`,
      detail: low
        ? "Dans un contexte d'hyponatrémie : évoque une polydipsie primaire ou un apport hypotonique excessif (« potomanie », excès de bière)."
        : "Dans un contexte d'hyponatrémie avec natrémie basse, une urine non diluée (> 100 mOsm/kg) est inappropriée : évoque un SIADH ou une hypovolémie efficace.",
    });
  }

  return findings;
}

export const urineIonogram: Calculator = {
  id: "ionogramme-urinaire",
  name: "Interprétation de l'ionogramme urinaire",
  shortName: "Ionogramme urinaire",
  category: "biologie",
  keywords: ["ionogramme urinaire", "fena", "feuree", "feurée", "natriurese", "natriurèse", "insuffisance renale aigue", "insuffisance rénale aiguë"],
  summary: "Fraction excrétée de sodium/urée (bilan d'IRA) et natriurèse (orientation d'hyponatrémie).",
  fields: [
    { type: "number", id: "naU", label: "Sodium urinaire", unit: "mmol/L", step: 1, group: "Sodium" },
    { type: "number", id: "naP", label: "Sodium plasmatique", unit: "mmol/L", step: 1, group: "Sodium" },
    { type: "number", id: "creatU", label: "Créatinine urinaire", unit: "µmol/L", step: 10, group: "Créatinine (pour FENa/FEUrée)" },
    { type: "number", id: "creatP", label: "Créatinine plasmatique", unit: "µmol/L", step: 1, group: "Créatinine (pour FENa/FEUrée)" },
    { type: "number", id: "ureeU", label: "Urée urinaire", unit: "mmol/L", step: 1, group: "Urée (pour FEUrée)" },
    { type: "number", id: "ureeP", label: "Urée plasmatique", unit: "mmol/L", step: 0.5, group: "Urée (pour FEUrée)" },
    { type: "boolean", id: "diuretics", label: "Patient sous diurétiques (récents)", group: "Contexte" },
    { type: "number", id: "osmoU", label: "Osmolalité urinaire", unit: "mOsm/kg", step: 1, group: "Contexte" },
  ],
  compute: () => 0,
  interpret: (_score, v) => urineIonogramFindings(v),
  source: "FENa/FEUrée : Espinel CH, JAMA 1976 ; Carvounis CP et al., Kidney Int 2002. Natriurèse/hyponatrémie : approche classique par le statut volémique (recommandations européennes d'hyponatrémie, Eur J Endocrinol 2014).",
  notes:
    "FENa (%) = (Na urinaire × créatinine plasmatique) / (Na plasmatique × créatinine urinaire) × 100. FEUrée (%) = (urée urinaire × créatinine plasmatique) / (urée plasmatique × créatinine urinaire) × 100. Ces seuils s'appliquent surtout à l'insuffisance rénale aiguë oligurique ; peu valides en cas de néphropathie chronique, glomérulaire ou d'injection de produit de contraste récente.",
};
