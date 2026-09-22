import type { Calculator } from "../calculators/types";
import { normalizeSearch } from "../search";
import { glycemiaConversion } from "./glycemiaConversion";
import { qtc } from "./qtc";
import { bmi } from "./bmi";
import { creatinineClearance } from "./creatinineClearance";
import { correctedSodium } from "./correctedSodium";
import { waterDeficit } from "./waterDeficit";
import { correctedCalcium } from "./correctedCalcium";

export const tools: Calculator[] = [glycemiaConversion, qtc, bmi, creatinineClearance, correctedSodium, waterDeficit, correctedCalcium];

export function getTool(id: string): Calculator | undefined {
  return tools.find((t) => t.id === id);
}

export function searchTools(query: string): Calculator[] {
  const q = normalizeSearch(query.trim());
  if (!q) return tools;
  return tools.filter((c) => {
    const haystack = normalizeSearch([c.name, c.shortName, c.summary, ...c.keywords].join(" "));
    return haystack.includes(q);
  });
}
