import { Link } from "react-router-dom";
import type { Drug } from "../lib/drugs/types";

export function DrugListItem({ drug, subtitle }: { drug: Drug; subtitle?: string }) {
  return (
    <Link
      to={`/medicaments/${drug.id}`}
      className="rounded-xl border border-border bg-surface px-4 py-3.5 backdrop-blur-xl transition-transform duration-150 active:scale-[0.98] active:bg-surface-2"
    >
      <div className="flex items-center justify-between gap-2">
        <span className="font-medium text-white">{drug.dci}</span>
        <span className="shrink-0 rounded-full bg-emerald-500/15 px-2 py-0.5 text-[11px] font-medium text-emerald-300">Médicament</span>
      </div>
      <p className="mt-1 line-clamp-2 text-[13px] leading-snug text-muted">{subtitle ?? (drug.brands.join(", ") || drug.class)}</p>
    </Link>
  );
}
