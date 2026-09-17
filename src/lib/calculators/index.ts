import type { Calculator } from "./types";
import { gcs } from "./gcs";
import { nihss } from "./nihss";
import { qsofa } from "./qsofa";
import { crb65 } from "./crb65";
import { wellsPe } from "./wellsPe";
import { cha2ds2vasc } from "./cha2ds2vasc";
import { centor } from "./centor";
import { canadianCtHead } from "./canadianCtHead";
import { ottawaAnkle } from "./ottawaAnkle";
import { abg } from "./abg";
import { csf } from "./csf";
import { urineIonogram } from "./urineIonogram";
import { coagulation } from "./coagulation";
import { cushman } from "./cushman";
import { childPugh } from "./childPugh";
import { gcsPediatric } from "./gcsPediatric";
import { genevaSimplified } from "./genevaSimplified";
import { abcd2 } from "./abcd2";
import { spesi } from "./spesi";
import { asia } from "./asia";
import { apgar } from "./apgar";
import { silverman } from "./silverman";
import { gir } from "./gir";
import { adl } from "./adl";
import { nyha } from "./nyha";
import { mmrc } from "./mmrc";

export const calculators: Calculator[] = [
  gcs,
  nihss,
  qsofa,
  crb65,
  wellsPe,
  cha2ds2vasc,
  centor,
  canadianCtHead,
  ottawaAnkle,
  abg,
  csf,
  urineIonogram,
  coagulation,
  cushman,
  childPugh,
  gcsPediatric,
  genevaSimplified,
  abcd2,
  spesi,
  asia,
  apgar,
  silverman,
  gir,
  adl,
  nyha,
  mmrc,
];

export function getCalculator(id: string): Calculator | undefined {
  return calculators.find((c) => c.id === id);
}

export function searchCalculators(query: string): Calculator[] {
  const q = query.trim().toLowerCase();
  if (!q) return calculators;
  return calculators.filter((c) => {
    const haystack = [c.name, c.shortName, c.summary, ...c.keywords].join(" ").toLowerCase();
    return haystack.includes(q);
  });
}

export * from "./types";
