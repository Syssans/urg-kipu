import type { Calculator } from "./calculators/types";
import { searchCalculators, getCalculator } from "./calculators";
import { searchTools, getTool } from "./tools";
import type { DecisionTree } from "./trees/types";
import { searchTrees, getTree } from "./trees";
import type { Drug } from "./drugs/types";
import { searchDrugs, getDrug } from "./drugs";

export type CatalogEntry =
  | { kind: "calc"; calc: Calculator; basePath: "/scores" | "/calcul" }
  | { kind: "tree"; tree: DecisionTree }
  | { kind: "drug"; drug: Drug };

export function searchAll(query: string): CatalogEntry[] {
  return [
    ...searchCalculators(query).map((calc): CatalogEntry => ({ kind: "calc", calc, basePath: "/scores" })),
    ...searchTools(query).map((calc): CatalogEntry => ({ kind: "calc", calc, basePath: "/calcul" })),
    ...searchTrees(query).map((tree): CatalogEntry => ({ kind: "tree", tree })),
    ...searchDrugs(query).map((drug): CatalogEntry => ({ kind: "drug", drug })),
  ];
}

export function getAny(id: string): CatalogEntry | undefined {
  const calc = getCalculator(id);
  if (calc) return { kind: "calc", calc, basePath: "/scores" };
  const tool = getTool(id);
  if (tool) return { kind: "calc", calc: tool, basePath: "/calcul" };
  const tree = getTree(id);
  if (tree) return { kind: "tree", tree };
  const drug = getDrug(id);
  if (drug) return { kind: "drug", drug };
  return undefined;
}
