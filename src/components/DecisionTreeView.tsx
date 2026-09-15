import { useEffect, useRef, useState } from "react";
import type { DecisionTree, TreeNode } from "../lib/trees/types";

interface PathStep {
  nodeId: string;
  choiceIndex: number;
}

export function DecisionTreeView({ tree }: { tree: DecisionTree }) {
  const [path, setPath] = useState<PathStep[]>([]);
  const scrollRef = useRef<HTMLDivElement>(null);

  const nodesToShow: TreeNode[] = [tree.nodes[tree.rootId]];
  let current = tree.nodes[tree.rootId];
  for (const step of path) {
    if (current.type !== "question") break;
    const opt = current.options[step.choiceIndex];
    const next = tree.nodes[opt.next];
    if (!next) break;
    nodesToShow.push(next);
    current = next;
  }

  useEffect(() => {
    scrollRef.current?.scrollTo({ left: scrollRef.current.scrollWidth, behavior: "smooth" });
  }, [nodesToShow.length]);

  const choose = (nodeIndex: number, choiceIndex: number) => {
    setPath((prev) => [...prev.slice(0, nodeIndex), { nodeId: nodesToShow[nodeIndex].id, choiceIndex }]);
  };

  return (
    <div className="flex flex-col gap-3">
      <div ref={scrollRef} className="no-scrollbar flex snap-x snap-mandatory gap-3 overflow-x-auto pb-2">
        {nodesToShow.map((node, i) => (
          <div key={node.id} className="flex shrink-0 snap-center items-center gap-3">
            <NodeCard
              node={node}
              chosenIndex={path[i]?.choiceIndex}
              onChoose={(choiceIndex) => choose(i, choiceIndex)}
            />
            {i < nodesToShow.length - 1 && (
              <svg viewBox="0 0 24 24" fill="none" className="h-5 w-5 shrink-0 text-muted">
                <path d="M9 5l7 7-7 7" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            )}
          </div>
        ))}
      </div>
      {path.length > 0 && (
        <button type="button" onClick={() => setPath([])} className="self-start text-sm text-muted underline underline-offset-2">
          Recommencer
        </button>
      )}
    </div>
  );
}

function NodeCard({
  node,
  chosenIndex,
  onChoose,
}: {
  node: TreeNode;
  chosenIndex: number | undefined;
  onChoose: (choiceIndex: number) => void;
}) {
  if (node.type === "leaf") {
    return (
      <div className="card-in w-[82vw] max-w-sm shrink-0 rounded-2xl border border-accent-2/25 bg-accent-2/5 p-4 backdrop-blur-xl">
        <p className="text-sm font-semibold text-accent-2">{node.title}</p>
        <ul className="mt-2.5 flex flex-col gap-1.5">
          {node.items.map((item) => (
            <li key={item} className="flex items-start gap-2 text-sm leading-snug text-white">
              <span className="mt-2 h-1 w-1 shrink-0 rounded-full bg-accent-2" />
              {item}
            </li>
          ))}
        </ul>
        {node.detail && <p className="mt-2.5 text-[13px] leading-snug text-muted">{node.detail}</p>}
      </div>
    );
  }

  return (
    <div className="card-in w-[82vw] max-w-sm shrink-0 rounded-2xl border border-border bg-surface p-4 backdrop-blur-xl">
      <p className="text-sm font-semibold text-white">{node.title}</p>
      {node.subtitle && <p className="mt-0.5 text-xs text-muted">{node.subtitle}</p>}
      <div className="mt-3 flex flex-col gap-2">
        {node.options.map((opt, i) => {
          const active = chosenIndex === i;
          return (
            <button
              key={opt.label}
              type="button"
              onClick={() => onChoose(i)}
              aria-pressed={active}
              className={`rounded-lg border px-3.5 py-2.5 text-left text-sm leading-snug backdrop-blur-xl transition-all duration-150 ease-out ${
                active
                  ? "translate-x-1.5 border-accent-2/60 bg-accent-2/10 text-white"
                  : "translate-x-0 border-border bg-surface-2 text-slate-300 active:bg-surface"
              }`}
            >
              {opt.label}
            </button>
          );
        })}
      </div>
    </div>
  );
}
