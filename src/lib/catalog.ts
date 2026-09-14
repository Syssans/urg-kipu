import type { Calculator } from "./calculators/types";
import { searchCalculators, getCalculator } from "./calculators";
import { searchTools, getTool } from "./tools";

export interface CatalogEntry {
  calc: Calculator;
  basePath: "/scores" | "/calcul";
}

export function searchAll(query: string): CatalogEntry[] {
  return [
    ...searchCalculators(query).map((calc): CatalogEntry => ({ calc, basePath: "/scores" })),
    ...searchTools(query).map((calc): CatalogEntry => ({ calc, basePath: "/calcul" })),
  ];
}

export function getAny(id: string): CatalogEntry | undefined {
  const calc = getCalculator(id);
  if (calc) return { calc, basePath: "/scores" };
  const tool = getTool(id);
  if (tool) return { calc: tool, basePath: "/calcul" };
  return undefined;
}
