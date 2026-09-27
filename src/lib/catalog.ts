import type { Calculator } from "./calculators/types";
import { calculators, calculatorSearchFields, getCalculator } from "./calculators";
import { tools, getTool } from "./tools";
import type { DecisionTree } from "./trees/types";
import { trees, treeSearchFields, getTree } from "./trees";
import type { Drug } from "./drugs/types";
import { drugs, drugSearchFields, getDrug } from "./drugs";
import { searchRanked, type SearchField } from "./search";

export type CatalogEntry =
  | { kind: "calc"; calc: Calculator; basePath: "/scores" | "/calcul" }
  | { kind: "tree"; tree: DecisionTree }
  | { kind: "drug"; drug: Drug };

const allEntries: CatalogEntry[] = [
  ...calculators.map((calc): CatalogEntry => ({ kind: "calc", calc, basePath: "/scores" })),
  ...tools.map((calc): CatalogEntry => ({ kind: "calc", calc, basePath: "/calcul" })),
  ...trees.map((tree): CatalogEntry => ({ kind: "tree", tree })),
  ...drugs.map((drug): CatalogEntry => ({ kind: "drug", drug })),
];

function entrySearchFields(e: CatalogEntry): SearchField[] {
  if (e.kind === "calc") return calculatorSearchFields(e.calc);
  if (e.kind === "tree") return treeSearchFields(e.tree);
  return drugSearchFields(e.drug);
}

// Results across scores, tools, trees and drugs, most relevant first.
export function searchAll(query: string): CatalogEntry[] {
  return searchRanked(allEntries, query, entrySearchFields);
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
