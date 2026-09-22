import type { Drug } from "./types";
import { clonazepam } from "./clonazepam";
import { midazolam } from "./midazolam";
import { levetiracetam } from "./levetiracetam";
import { nefopam } from "./nefopam";
import { prednisolone } from "./prednisolone";
import { normalizeSearch } from "../search";

export const drugs: Drug[] = [clonazepam, midazolam, levetiracetam, nefopam, prednisolone];

export function getDrug(id: string): Drug | undefined {
  return drugs.find((d) => d.id === id);
}

export function searchDrugs(query: string): Drug[] {
  const q = normalizeSearch(query.trim());
  if (!q) return drugs;
  return drugs.filter((d) => normalizeSearch([d.dci, ...d.brands].join(" ")).includes(q));
}

export * from "./types";
