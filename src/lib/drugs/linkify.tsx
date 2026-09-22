import type { ReactNode } from "react";
import { Link } from "react-router-dom";
import { drugs } from "./index";

interface Term {
  pattern: string;
  drugId: string;
}

function escapeRegExp(s: string): string {
  return s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

function buildTerms(): Term[] {
  const terms: Term[] = [];
  for (const d of drugs) {
    terms.push({ pattern: d.dci, drugId: d.id });
    for (const brand of d.brands) terms.push({ pattern: brand, drugId: d.id });
  }
  // Longest pattern first, so a brand/DCI that is a substring of another still matches the longer one fully.
  return terms.sort((a, b) => b.pattern.length - a.pattern.length);
}

let cachedTerms: Term[] | null = null;
let cachedRegex: RegExp | null = null;

function getMatcher(): { regex: RegExp; terms: Term[] } {
  if (!cachedRegex || !cachedTerms) {
    cachedTerms = buildTerms();
    cachedRegex =
      cachedTerms.length === 0
        ? /$^/
        : new RegExp(`\\b(${cachedTerms.map((t) => escapeRegExp(t.pattern)).join("|")})\\b`, "gi");
  }
  return { regex: cachedRegex, terms: cachedTerms };
}

// Resets the cache after a hot-module edit to lib/drugs/*; harmless in production.
export function resetDrugMatcherCache() {
  cachedRegex = null;
  cachedTerms = null;
}

/**
 * Splits `text` into plain strings and <Link> elements wherever a known drug
 * DCI or French brand name occurs, so any prose in the app can link out to
 * its mini-fiche without every string having to be authored with markup.
 */
export function linkifyDrugs(text: string): ReactNode[] {
  const { regex, terms } = getMatcher();
  regex.lastIndex = 0;
  const parts: ReactNode[] = [];
  let lastIndex = 0;
  let match: RegExpExecArray | null;
  let key = 0;

  while ((match = regex.exec(text))) {
    if (match.index > lastIndex) parts.push(text.slice(lastIndex, match.index));
    const matched = match[0];
    const term = terms.find((t) => t.pattern.toLowerCase() === matched.toLowerCase());
    if (term) {
      parts.push(
        <Link
          key={`${term.drugId}-${match.index}-${key++}`}
          to={`/medicaments/${term.drugId}`}
          className="text-emerald-400 underline decoration-emerald-400/60 decoration-dotted underline-offset-2 hover:decoration-solid"
        >
          {matched}
        </Link>,
      );
    } else {
      parts.push(matched);
    }
    lastIndex = match.index + matched.length;
  }
  if (lastIndex < text.length) parts.push(text.slice(lastIndex));
  return parts;
}
