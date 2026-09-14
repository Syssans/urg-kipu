import type { Calculator } from "./types";
import { gcs } from "./gcs";
import { nihss } from "./nihss";
import { qsofa } from "./qsofa";
import { curb65 } from "./curb65";
import { wellsPe } from "./wellsPe";
import { wellsDvt } from "./wellsDvt";
import { perc } from "./perc";
import { cha2ds2vasc } from "./cha2ds2vasc";
import { hasbled } from "./hasbled";
import { centor } from "./centor";
import { canadianCtHead } from "./canadianCtHead";
import { ottawaAnkle } from "./ottawaAnkle";
import { blatchford } from "./blatchford";
import { abg } from "./abg";
import { csf } from "./csf";
import { bloodIonogram } from "./bloodIonogram";
import { urineIonogram } from "./urineIonogram";
import { coagulation } from "./coagulation";

export const calculators: Calculator[] = [
  gcs,
  nihss,
  qsofa,
  curb65,
  wellsPe,
  wellsDvt,
  perc,
  cha2ds2vasc,
  hasbled,
  centor,
  canadianCtHead,
  ottawaAnkle,
  blatchford,
  abg,
  csf,
  bloodIonogram,
  urineIonogram,
  coagulation,
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
