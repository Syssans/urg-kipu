import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { getAny, searchAll, type CatalogEntry } from "../lib/catalog";
import { CalculatorListItem } from "../components/CalculatorListItem";
import { TreeListItem } from "../components/TreeListItem";
import { DrugListItem } from "../components/DrugListItem";
import { Disclaimer } from "../components/Disclaimer";
import { useFavorites } from "../lib/favorites";
import { timeAgo, useRecentlyUsed } from "../lib/recentlyUsed";

function isCalcEntry(r: CatalogEntry): r is Extract<CatalogEntry, { kind: "calc" }> {
  return r.kind === "calc";
}

function renderEntry(entry: CatalogEntry, subtitle?: string) {
  switch (entry.kind) {
    case "calc":
      return <CalculatorListItem key={entry.calc.id} calc={entry.calc} basePath={entry.basePath} subtitle={subtitle} />;
    case "tree":
      return <TreeListItem key={entry.tree.id} tree={entry.tree} subtitle={subtitle} />;
    case "drug":
      return <DrugListItem key={entry.drug.id} drug={entry.drug} subtitle={subtitle} />;
  }
}

export function Home() {
  const [query, setQuery] = useState("");
  const results = useMemo(() => searchAll(query), [query]);
  const { favorites } = useFavorites();
  const favCalcs = useMemo(
    () => searchAll("").filter(isCalcEntry).filter((r) => favorites.includes(r.calc.id)),
    [favorites],
  );
  const { recent } = useRecentlyUsed();
  const recentEntries = useMemo(
    () =>
      recent
        .map((r) => ({ ts: r.ts, entry: getAny(r.id) }))
        .filter((r): r is { ts: number; entry: CatalogEntry } => r.entry !== undefined),
    [recent],
  );

  return (
    <div className="page-in mx-auto flex max-w-xl flex-col gap-6 px-4 pb-28 pt-[calc(env(safe-area-inset-top)+1rem)]">
      <h1 className="text-2xl font-bold text-white">Rechercher</h1>

      <div className="relative">
        <svg viewBox="0 0 24 24" fill="none" className="pointer-events-none absolute left-3.5 top-1/2 z-10 h-5 w-5 -translate-y-1/2 text-muted">
          <circle cx="11" cy="11" r="7" stroke="currentColor" strokeWidth={1.8} />
          <path d="m21 21-4.3-4.3" stroke="currentColor" strokeWidth={1.8} strokeLinecap="round" />
        </svg>
        <input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          aria-label="Rechercher un score, un outil, un arbre ou un médicament"
          placeholder="Score, outil, arbre, médicament…"
          className="w-full rounded-2xl border border-border bg-surface py-3.5 pl-11 pr-4 text-base text-white outline-none backdrop-blur-xl transition-colors duration-150 placeholder:text-muted focus:border-accent-2"
        />
      </div>

      {query.trim() ? (
        <div className="flex flex-col gap-2.5">
          <p className="text-sm text-muted">{results.length} résultat{results.length > 1 ? "s" : ""}</p>
          {results.map((r) => renderEntry(r))}
          {results.length === 0 && (
            <p className="rounded-xl border border-dashed border-border p-4 text-sm text-muted">
              Aucun résultat pour « {query} ».
            </p>
          )}
        </div>
      ) : (
        <>
          <Link
            to="/examen"
            className="flex items-center gap-3 rounded-2xl border border-border bg-surface px-4 py-3.5 backdrop-blur-xl transition-transform duration-150 active:scale-[0.98] active:bg-surface-2"
          >
            <TileIcon>
              <path d="M9 4h6v3H9z" stroke="currentColor" strokeWidth={1.8} strokeLinejoin="round" />
              <path d="M9 5.5H6.5a1 1 0 0 0-1 1V20a1 1 0 0 0 1 1h11a1 1 0 0 0 1-1V6.5a1 1 0 0 0-1-1H15" stroke="currentColor" strokeWidth={1.8} strokeLinejoin="round" />
              <path d="M9 12h6M9 16h4" stroke="currentColor" strokeWidth={1.8} strokeLinecap="round" />
            </TileIcon>
            <span className="flex-1">
              <span className="block font-medium text-white">Examen clinique</span>
              <span className="block text-[13px] leading-snug text-muted">Rédiger l'examen à copier dans le dossier</span>
            </span>
          </Link>

          <div className="flex flex-col gap-2.5">
            <div className="flex items-center justify-between">
              <h2 className="text-sm font-semibold text-slate-200">Favoris</h2>
              {favCalcs.length > 0 && (
                <Link to="/favoris" className="text-sm text-accent-2">
                  Tout voir
                </Link>
              )}
            </div>
            {favCalcs.length > 0 ? (
              favCalcs.map((r) => <CalculatorListItem key={r.calc.id} calc={r.calc} basePath={r.basePath} />)
            ) : (
              <p className="rounded-xl border border-dashed border-border p-4 text-sm text-muted">
                Aucun favori pour l'instant. Ouvrez un score ou un outil et appuyez sur l'étoile pour l'épingler ici.
              </p>
            )}
          </div>

          {recentEntries.length > 0 && (
            <div className="flex flex-col gap-2.5">
              <h2 className="text-sm font-semibold text-slate-200">Récents</h2>
              {recentEntries.map(({ ts, entry }) => renderEntry(entry, timeAgo(ts)))}
            </div>
          )}
        </>
      )}

      <Disclaimer compact />
    </div>
  );
}

function TileIcon({ children }: { children: React.ReactNode }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" className="h-6 w-6 text-accent-2">
      {children}
    </svg>
  );
}
