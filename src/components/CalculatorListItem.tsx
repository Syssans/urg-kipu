import { Link } from "react-router-dom";
import type { Calculator } from "../lib/calculators/types";
import { CATEGORY_COLORS, CATEGORY_LABELS } from "../lib/calculators/types";
import { useFavorites } from "../lib/favorites";

export function CalculatorListItem({ calc, basePath = "/scores" }: { calc: Calculator; basePath?: "/scores" | "/calcul" }) {
  const { isFavorite, toggleFavorite } = useFavorites();
  const fav = isFavorite(calc.id);
  const colors = CATEGORY_COLORS[calc.category];

  return (
    <div className="flex items-center gap-2">
      <Link
        to={`${basePath}/${calc.id}`}
        className="flex-1 rounded-xl border border-border bg-surface px-4 py-3.5 backdrop-blur-xl transition-transform duration-150 active:scale-[0.98] active:bg-surface-2"
      >
        <div className="flex items-center justify-between gap-2">
          <span className="font-medium text-white">{calc.shortName}</span>
          <span className={`shrink-0 rounded-full px-2 py-0.5 text-[11px] font-medium ${colors.bg} ${colors.text}`}>
            {CATEGORY_LABELS[calc.category]}
          </span>
        </div>
        <p className="mt-1 line-clamp-2 text-[13px] leading-snug text-muted">{calc.summary}</p>
      </Link>
      <button
        type="button"
        aria-label={fav ? "Retirer des favoris" : "Ajouter aux favoris"}
        onClick={() => toggleFavorite(calc.id)}
        className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-border bg-surface backdrop-blur-xl transition-transform duration-150 active:scale-90 active:bg-surface-2"
      >
        <svg viewBox="0 0 24 24" fill={fav ? "#e11d2f" : "none"} className="h-5 w-5">
          <path
            d="m12 3.5 2.6 5.4 5.9.8-4.3 4.2 1 5.9-5.2-2.8-5.2 2.8 1-5.9-4.3-4.2 5.9-.8Z"
            stroke={fav ? "#e11d2f" : "currentColor"}
            className={fav ? "" : "text-muted"}
            strokeWidth={1.8}
            strokeLinejoin="round"
          />
        </svg>
      </button>
    </div>
  );
}
