import type { DecisionTree } from "./types";
import { dysnatremia } from "./dysnatremia";
import { seizure } from "./seizure";
import { normalizeSearch } from "../search";

export const trees: DecisionTree[] = [dysnatremia, seizure];

export function getTree(id: string): DecisionTree | undefined {
  return trees.find((t) => t.id === id);
}

export function searchTrees(query: string): DecisionTree[] {
  const q = normalizeSearch(query.trim());
  if (!q) return trees;
  return trees.filter((t) => normalizeSearch([t.name, t.shortName, t.summary].join(" ")).includes(q));
}

export * from "./types";
