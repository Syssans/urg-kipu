import type { DecisionTree } from "./types";
import { dysnatremia } from "./dysnatremia";
import { seizure } from "./seizure";

export const trees: DecisionTree[] = [dysnatremia, seizure];

export function getTree(id: string): DecisionTree | undefined {
  return trees.find((t) => t.id === id);
}

export function searchTrees(query: string): DecisionTree[] {
  const q = query.trim().toLowerCase();
  if (!q) return trees;
  return trees.filter((t) => [t.name, t.shortName, t.summary].join(" ").toLowerCase().includes(q));
}

export * from "./types";
