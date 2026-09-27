import type { DecisionTree } from "./types";
import { dysnatremia } from "./dysnatremia";
import { seizure } from "./seizure";
import { searchRanked, W, type SearchField } from "../search";

export const trees: DecisionTree[] = [dysnatremia, seizure];

export function getTree(id: string): DecisionTree | undefined {
  return trees.find((t) => t.id === id);
}

export function treeSearchFields(t: DecisionTree): SearchField[] {
  return [
    { text: t.shortName, weight: W.name },
    { text: t.name, weight: W.name },
    ...(t.keywords ?? []).map((k) => ({ text: k, weight: W.keyword })),
    { text: t.summary, weight: W.summary },
  ];
}

export function searchTrees(query: string): DecisionTree[] {
  return searchRanked(trees, query, treeSearchFields);
}

export * from "./types";
