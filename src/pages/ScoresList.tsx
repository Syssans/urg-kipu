import { useMemo, useState } from "react";
import { Header } from "../components/Header";
import { CalculatorListItem } from "../components/CalculatorListItem";
import { calculators, searchCalculators } from "../lib/calculators";
import { CATEGORY_COLORS, CATEGORY_LABELS, type Category } from "../lib/calculators/types";

export function ScoresList() {
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState<Category | null>(null);

  const allCategories = useMemo(() => Array.from(new Set(calculators.map((c) => c.category))) as Category[], []);

  const results = useMemo(() => {
    const searched = searchCalculators(query);
    return category ? searched.filter((c) => c.category === category) : searched;
  }, [query, category]);

  const byCategory = useMemo(() => {
    return allCategories
      .map((cat) => ({ cat, items: results.filter((c) => c.category === cat) }))
      .filter((g) => g.items.length > 0);
  }, [allCategories, results]);

  return (
    <div>
      <Header title="Scores & calculateurs" />
      <div className="page-in mx-auto flex max-w-xl flex-col gap-5 px-4 pb-28 pt-4">
        <input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Filtrer…"
          className="w-full rounded-2xl border border-border bg-surface px-4 py-3 text-base text-white outline-none backdrop-blur-xl transition-colors duration-150 placeholder:text-muted focus:border-accent-2"
        />
        <div className="no-scrollbar -mx-4 flex gap-2 overflow-x-auto px-4">
          <button
            type="button"
            onClick={() => setCategory(null)}
            className={`shrink-0 rounded-full border px-3 py-1.5 text-[13px] font-medium transition-colors duration-150 ${
              category === null ? "border-accent-2/60 bg-accent-2/15 text-white" : "border-border bg-surface text-muted"
            }`}
          >
            Toutes
          </button>
          {allCategories.map((cat) => {
            const colors = CATEGORY_COLORS[cat];
            const active = category === cat;
            return (
              <button
                key={cat}
                type="button"
                onClick={() => setCategory(active ? null : cat)}
                className={`shrink-0 rounded-full border px-3 py-1.5 text-[13px] font-medium transition-colors duration-150 ${
                  active ? `border-transparent ${colors.bg} ${colors.text}` : "border-border bg-surface text-muted"
                }`}
              >
                {CATEGORY_LABELS[cat]}
              </button>
            );
          })}
        </div>
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
