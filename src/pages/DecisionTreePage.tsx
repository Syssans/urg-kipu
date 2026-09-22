import { useEffect } from "react";
import { useParams } from "react-router-dom";
import { Header } from "../components/Header";
import { DecisionTreeView } from "../components/DecisionTreeView";
import { DrugText } from "../components/DrugText";
import { getTree } from "../lib/trees";
import { useRecentlyUsed } from "../lib/recentlyUsed";

export function DecisionTreePage() {
  const { id } = useParams();
  const tree = id ? getTree(id) : undefined;
  const { recordVisit } = useRecentlyUsed();

  useEffect(() => {
    if (tree) recordVisit(tree.id);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [tree?.id]);

  if (!tree) {
    return (
      <div>
        <Header title="Introuvable" back />
        <p className="px-4 py-6 text-muted">Cet arbre décisionnel n'existe pas (ou plus).</p>
      </div>
    );
  }

  return (
    <div>
      <Header title={tree.shortName} back />
      <div className="page-in mx-auto flex max-w-xl flex-col gap-6 px-4 pb-28 pt-4">
        <div>
          <h2 className="text-lg font-semibold text-white">{tree.name}</h2>
          <p className="mt-1 text-sm leading-snug text-muted">{tree.summary}</p>
        </div>

        <DecisionTreeView tree={tree} />

        <div className="flex flex-col gap-1.5 border-t border-border pt-4 text-[13px] leading-snug text-muted">
          <p>
            <span className="font-medium text-slate-300">Source : </span>
            {tree.source}
          </p>
          {tree.notes && (
            <p>
              <DrugText text={tree.notes} />
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
