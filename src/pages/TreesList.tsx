import { useMemo, useState } from "react";
import { Header } from "../components/Header";
import { TreeListItem } from "../components/TreeListItem";
import { searchTrees } from "../lib/trees";

export function TreesList() {
  const [query, setQuery] = useState("");
  const results = useMemo(() => searchTrees(query), [query]);

  return (
    <div>
      <Header title="Arbres décisionnels" />
      <div className="page-in mx-auto flex max-w-xl flex-col gap-5 px-4 pb-28 pt-4">
        <input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Filtrer…"
          className="w-full rounded-2xl border border-border bg-surface px-4 py-3 text-base text-white outline-none backdrop-blur-xl transition-colors duration-150 placeholder:text-muted focus:border-accent-2"
        />
        <div className="flex flex-col gap-2.5">
          {results.map((t) => (
            <TreeListItem key={t.id} tree={t} />
          ))}
        </div>
        {results.length === 0 && (
          <p className="rounded-xl border border-dashed border-border p-4 text-sm text-muted">Aucun résultat.</p>
        )}
      </div>
    </div>
  );
}
