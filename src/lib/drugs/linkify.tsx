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
    for (const name of [d.dci, ...d.brands, ...(d.aliases ?? [])]) terms.push({ pattern: name, drugId: d.id });
  }
  // Longest pattern first, so a name that is a substring of another still matches the longer one fully.
  return terms.sort((a, b) => b.pattern.length - a.pattern.length);
}

let cachedTerms: Term[] | null = null;
let cachedRegex: RegExp | null = null;

// A name only matches when it is not glued to other letters/digits. \b is not
// used because it treats accented letters and a trailing "%" as non-word
// characters, which breaks names like "Éphédrine" or "Glucose 30 %".
function getMatcher(): { regex: RegExp; terms: Term[] } {
  if (!cachedRegex || !cachedTerms) {
    cachedTerms = buildTerms();
    cachedRegex =
      cachedTerms.length === 0
        ? /$^/
        : new RegExp(`(^|[^\\p{L}\\p{N}])(${cachedTerms.map((t) => escapeRegExp(t.pattern)).join("|")})(?![\\p{L}\\p{N}])`, "giu");
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
 * name occurs, so any prose in the app can link out to its mini-fiche without
 * every string having to be authored with markup. `excludeDrugId` avoids a
 * fiche linking to itself.
 */
export function linkifyDrugs(text: string, excludeDrugId?: string): ReactNode[] {
  const { regex, terms } = getMatcher();
  regex.lastIndex = 0;
  const parts: ReactNode[] = [];
  let lastIndex = 0;
  let match: RegExpExecArray | null;
  let key = 0;

  while ((match = regex.exec(text))) {
    const prefix = match[1];
    const matched = match[2];
    const start = match.index + prefix.length;
    const term = terms.find((t) => t.pattern.toLowerCase() === matched.toLowerCase());
    if (start > lastIndex) parts.push(text.slice(lastIndex, start));
    if (term && term.drugId !== excludeDrugId) {
      parts.push(
        <Link
          key={`${term.drugId}-${start}-${key++}`}
          to={`/medicaments/${term.drugId}`}
          className="text-emerald-400 underline decoration-emerald-400/60 decoration-dotted underline-offset-2 hover:decoration-solid"
        >
          {matched}
        </Link>,
      );
    } else {
      parts.push(matched);
    }
    lastIndex = start + matched.length;
  }
  if (lastIndex < text.length) parts.push(text.slice(lastIndex));
  return parts;
}
