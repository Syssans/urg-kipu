import { Link } from "react-router-dom";
import type { DecisionTree } from "../lib/trees/types";

export function TreeListItem({ tree }: { tree: DecisionTree }) {
  return (
    <Link
      to={`/arbres/${tree.id}`}
      className="rounded-xl border border-border bg-surface px-4 py-3.5 backdrop-blur-xl transition-transform duration-150 active:scale-[0.98] active:bg-surface-2"
    >
      <div className="flex items-center justify-between gap-2">
        <span className="font-medium text-white">{tree.shortName}</span>
        <span className="shrink-0 rounded-full bg-accent-2/15 px-2 py-0.5 text-[11px] font-medium text-accent-2">Arbre</span>
      </div>
      <p className="mt-1 line-clamp-2 text-[13px] leading-snug text-muted">{tree.summary}</p>
    </Link>
  );
}
