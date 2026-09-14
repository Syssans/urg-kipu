import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { searchAll } from "../lib/catalog";
import { CalculatorListItem } from "../components/CalculatorListItem";
import { Disclaimer } from "../components/Disclaimer";
import { useFavorites } from "../lib/favorites";

export function Home() {
  const [query, setQuery] = useState("");
  const results = useMemo(() => searchAll(query), [query]);
  const { favorites } = useFavorites();
  const favCalcs = useMemo(
    () => searchAll("").filter((c) => favorites.includes(c.calc.id)),
    [favorites],
  );

  return (
    <div className="mx-auto flex max-w-xl flex-col gap-6 px-4 pb-28 pt-[calc(env(safe-area-inset-top)+1rem)]">
      <div>
        <p className="text-sm text-muted">Aide-mémoire</p>
        <h1 className="text-2xl font-bold text-white">Kipu</h1>
      </div>

      <div className="relative">
        <svg viewBox="0 0 24 24" fill="none" className="pointer-events-none absolute left-3.5 top-1/2 h-5 w-5 -translate-y-1/2 text-muted">
          <circle cx="11" cy="11" r="7" stroke="currentColor" strokeWidth={1.8} />
          <path d="m21 21-4.3-4.3" stroke="currentColor" strokeWidth={1.8} strokeLinecap="round" />
        </svg>
        <input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Rechercher un score, un outil de calcul…"
          className="w-full rounded-2xl border border-border bg-surface py-3.5 pl-11 pr-4 text-base text-white outline-none placeholder:text-muted focus:border-accent-2"
        />
      </div>

      {query.trim() ? (
        <div className="flex flex-col gap-2.5">
          <p className="text-sm text-muted">{results.length} résultat{results.length > 1 ? "s" : ""}</p>
          {results.map((r) => (
            <CalculatorListItem key={r.calc.id} calc={r.calc} basePath={r.basePath} />
          ))}
          {results.length === 0 && (
            <p className="rounded-xl border border-dashed border-border p-4 text-sm text-muted">
              Aucun résultat pour « {query} ».
            </p>
          )}
        </div>
      ) : (
        <>
          <div className="grid grid-cols-3 gap-3">
            <Link to="/scores" className="flex flex-col items-center gap-2 rounded-2xl border border-border bg-surface py-5 active:bg-surface-2">
              <TileIcon>
                <rect x="5" y="3" width="14" height="18" rx="2" stroke="currentColor" strokeWidth={1.8} />
                <path d="M8 8h8M8 12h2M12 12h2M8 16h2M12 16h2" stroke="currentColor" strokeWidth={1.8} strokeLinecap="round" />
              </TileIcon>
              <span className="text-xs font-medium text-slate-200">Scores</span>
            </Link>
            <Link to="/calcul" className="flex flex-col items-center gap-2 rounded-2xl border border-border bg-surface py-5 active:bg-surface-2">
              <TileIcon>
                <path d="M6 8h11.5M17.5 8 14 4.5M17.5 8 14 11.5" stroke="currentColor" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round" />
                <path d="M18 16H6.5M6.5 16 10 12.5M6.5 16 10 19.5" stroke="currentColor" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round" />
              </TileIcon>
              <span className="text-xs font-medium text-slate-200">Calcul</span>
            </Link>
            <Link to="/arbres" className="flex flex-col items-center gap-2 rounded-2xl border border-border bg-surface py-5 active:bg-surface-2">
              <TileIcon>
                <circle cx="6" cy="6" r="2.2" stroke="currentColor" strokeWidth={1.8} />
                <circle cx="18" cy="6" r="2.2" stroke="currentColor" strokeWidth={1.8} />
                <circle cx="12" cy="18" r="2.2" stroke="currentColor" strokeWidth={1.8} />
                <path d="M12 15.8V11m0 0H6.5M12 11h5.5M6 8.2V11m12-2.8V11" stroke="currentColor" strokeWidth={1.8} strokeLinecap="round" />
              </TileIcon>
              <span className="text-xs font-medium text-slate-200">Arbres</span>
            </Link>
          </div>

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
