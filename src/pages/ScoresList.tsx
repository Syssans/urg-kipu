import { useMemo, useState } from "react";
import { Header } from "../components/Header";
import { CalculatorListItem } from "../components/CalculatorListItem";
import { calculators, searchCalculators } from "../lib/calculators";
import { CATEGORY_LABELS, type Category } from "../lib/calculators/types";

export function ScoresList() {
  const [query, setQuery] = useState("");
  const results = useMemo(() => searchCalculators(query), [query]);

  const byCategory = useMemo(() => {
    const cats = Array.from(new Set(calculators.map((c) => c.category))) as Category[];
    return cats
      .map((cat) => ({ cat, items: results.filter((c) => c.category === cat) }))
      .filter((g) => g.items.length > 0);
  }, [results]);

  return (
    <div>
      <Header title="Scores & calculateurs" />
      <div className="mx-auto flex max-w-xl flex-col gap-5 px-4 pb-28 pt-4">
        <input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Filtrer…"
          className="w-full rounded-2xl border border-border bg-surface px-4 py-3 text-base text-white outline-none placeholder:text-muted focus:border-accent-2"
        />
        {byCategory.map(({ cat, items }) => (
          <div key={cat} className="flex flex-col gap-2.5">
            <h2 className="text-sm font-semibold text-slate-200">{CATEGORY_LABELS[cat]}</h2>
            {items.map((c) => (
              <CalculatorListItem key={c.id} calc={c} />
            ))}
          </div>
        ))}
        {results.length === 0 && (
          <p className="rounded-xl border border-dashed border-border p-4 text-sm text-muted">Aucun résultat.</p>
        )}
      </div>
    </div>
  );
}
