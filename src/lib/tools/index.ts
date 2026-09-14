import type { Calculator } from "../calculators/types";
import { glycemiaConversion } from "./glycemiaConversion";
import { qtc } from "./qtc";
import { bmi } from "./bmi";

export const tools: Calculator[] = [glycemiaConversion, qtc, bmi];

export function getTool(id: string): Calculator | undefined {
  return tools.find((t) => t.id === id);
}

export function searchTools(query: string): Calculator[] {
  const q = query.trim().toLowerCase();
  if (!q) return tools;
  return tools.filter((c) => {
    const haystack = [c.name, c.shortName, c.summary, ...c.keywords].join(" ").toLowerCase();
    return haystack.includes(q);
  });
}
