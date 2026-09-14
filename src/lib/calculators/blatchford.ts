import type { Calculator } from "./types";

export const blatchford: Calculator = {
  id: "glasgow-blatchford",
  name: "Score de Glasgow-Blatchford",
  shortName: "Blatchford",
  category: "digestif",
  keywords: ["blatchford", "hemorragie digestive", "hémorragie digestive", "hda"],
  summary: "Risque d'intervention (transfusion, endoscopie, chirurgie) en cas d'hémorragie digestive haute.",
  fields: [
    { type: "number", id: "urea", label: "Urée sanguine", unit: "mmol/L", min: 0, step: 0.1 },
    {
      type: "select",
      id: "sex",
      label: "Sexe",
      options: [
        { label: "Homme", value: 0 },
        { label: "Femme", value: 1 },
      ],
    },
    { type: "number", id: "hb", label: "Hémoglobine", unit: "g/dL", min: 0, step: 0.1 },
    { type: "number", id: "sbp", label: "Pression artérielle systolique", unit: "mmHg", min: 0, step: 1 },
    { type: "boolean", id: "hr", label: "Fréquence cardiaque ≥ 100/min" },
    { type: "boolean", id: "melena", label: "Méléna" },
    { type: "boolean", id: "syncope", label: "Syncope" },
    { type: "boolean", id: "liverDisease", label: "Hépatopathie connue" },
    { type: "boolean", id: "heartFailure", label: "Insuffisance cardiaque connue" },
  ],
  requiredNumberFieldIds: ["urea", "hb", "sbp"],
  compute: (v) => {
    const urea = v.urea ?? 0;
    let ureaPts = 0;
    if (urea >= 25) ureaPts = 6;
    else if (urea >= 10) ureaPts = 4;
    else if (urea >= 8) ureaPts = 3;
    else if (urea >= 6.5) ureaPts = 2;

    const isFemale = (v.sex ?? 0) === 1;
    const hb = v.hb ?? 0;
    let hbPts = 0;
    if (isFemale) {
      if (hb < 10) hbPts = 6;
      else if (hb < 12) hbPts = 1;
    } else {
      if (hb < 10) hbPts = 6;
      else if (hb < 12) hbPts = 3;
      else if (hb < 13) hbPts = 1;
    }

    const sbp = v.sbp ?? 0;
    let sbpPts = 0;
    if (sbp < 90) sbpPts = 3;
    else if (sbp < 100) sbpPts = 2;
    else if (sbp < 110) sbpPts = 1;

    return (
      ureaPts +
      hbPts +
      sbpPts +
      (v.hr ?? 0) * 1 +
      (v.melena ?? 0) * 1 +
      (v.syncope ?? 0) * 2 +
      (v.liverDisease ?? 0) * 2 +
      (v.heartFailure ?? 0) * 2
    );
  },
  interpret: (score) => [
    {
      title: score === 0 ? "Risque très faible" : "Risque d'intervention présent",
      level: score === 0 ? "low" : score <= 5 ? "moderate" : "high",
      scoreLabel: `${score} / 23`,
      detail:
        score === 0
          ? "Prise en charge ambulatoire envisageable (pas d'endoscopie en urgence)."
          : "Hospitalisation et endoscopie à organiser selon le contexte clinique.",
    },
  ],
  source: "Blatchford et al., Lancet 2000.",
};
