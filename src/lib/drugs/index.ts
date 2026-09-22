import type { Drug } from "./types";
import { clonazepam } from "./clonazepam";
import { midazolam } from "./midazolam";
import { levetiracetam } from "./levetiracetam";
import { nefopam } from "./nefopam";
import { prednisolone } from "./prednisolone";

export const drugs: Drug[] = [clonazepam, midazolam, levetiracetam, nefopam, prednisolone];

export function getDrug(id: string): Drug | undefined {
  return drugs.find((d) => d.id === id);
}

export function searchDrugs(query: string): Drug[] {
  const q = query.trim().toLowerCase();
  if (!q) return drugs;
  return drugs.filter((d) => [d.dci, ...d.brands].join(" ").toLowerCase().includes(q));
}

export * from "./types";
