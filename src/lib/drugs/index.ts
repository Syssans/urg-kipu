import type { Drug } from "./types";
import { clonazepam } from "./clonazepam";

export const drugs: Drug[] = [clonazepam];

export function getDrug(id: string): Drug | undefined {
  return drugs.find((d) => d.id === id);
}

export function searchDrugs(query: string): Drug[] {
  const q = query.trim().toLowerCase();
  if (!q) return drugs;
  return drugs.filter((d) => [d.dci, ...d.brands].join(" ").toLowerCase().includes(q));
}

export * from "./types";
