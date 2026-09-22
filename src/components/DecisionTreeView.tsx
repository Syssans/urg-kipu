import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { getAny } from "../lib/catalog";
import { defaultValues, type Values } from "../lib/calculators/types";
import { CalculatorForm } from "./CalculatorForm";
import { DrugText } from "./DrugText";
import type { DecisionTree, TreeLink, TreeNode, TreeScore } from "../lib/trees/types";

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
    let nextId: string | undefined;
    if (current.type === "question") nextId = current.options[step.choiceIndex]?.next;
    else if (current.type === "score") nextId = current.branches[step.choiceIndex]?.next;
    else break;
    if (!nextId) break;
    const next = tree.nodes[nextId];
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

function NodeLink({ link }: { link: TreeLink }) {
  return (
    <Link
      to={link.to}
      className="mt-2 flex items-center gap-1.5 text-[13px] font-medium text-accent-2 underline underline-offset-2"
    >
      {link.label}
      <svg viewBox="0 0 24 24" fill="none" className="h-3.5 w-3.5">
        <path d="M9 6l6 6-6 6" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    </Link>
  );
}

function Warning({ text }: { text: string }) {
  return (
    <p className="mt-2.5 flex items-start gap-1.5 rounded-lg border border-amber-500/30 bg-amber-500/10 px-2.5 py-2 text-[13px] leading-snug text-amber-300">
      <svg viewBox="0 0 24 24" fill="none" className="mt-0.5 h-4 w-4 shrink-0">
        <path d="M12 9v4M12 17h.01M10.3 3.86 1.8 18a1.5 1.5 0 0 0 1.3 2.25h17.8a1.5 1.5 0 0 0 1.3-2.25L13.7 3.86a1.5 1.5 0 0 0-2.6 0Z" stroke="currentColor" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round" />
      </svg>
      <DrugText text={text} />
    </p>
  );
}

function ScoreNodeCard({
  node,
  chosenIndex,
  onChoose,
}: {
  node: TreeScore;
  chosenIndex: number | undefined;
  onChoose: (branchIndex: number) => void;
}) {
  const entry = getAny(node.calculatorId);
  const calc = entry?.kind === "calc" ? entry.calc : undefined;
  const [values, setValues] = useState<Values>(() => defaultValues(calc?.fields ?? []));

  if (!calc) {
    return (
      <div className="card-in w-[82vw] max-w-md shrink-0 rounded-2xl border border-red-500/30 bg-red-500/10 p-4 backdrop-blur-xl">
        <p className="text-sm text-red-300">Calculateur introuvable : {node.calculatorId}</p>
      </div>
    );
  }

  const missingRequired = (calc.requiredNumberFieldIds ?? []).some((id) => values[id] === undefined);
  const score = calc.compute(values);
  const matchedIndex = node.branches.findIndex((b) => b.test(score));
  const upToDate = chosenIndex !== undefined && chosenIndex === matchedIndex;

  return (
    <div className="card-in w-[82vw] max-w-md shrink-0 rounded-2xl border border-border bg-surface p-4 backdrop-blur-xl">
      <p className="text-sm font-semibold text-white">{node.title}</p>
      {node.subtitle && <p className="mt-0.5 text-xs text-muted">{node.subtitle}</p>}
      {node.detail && (
        <p className="mt-1.5 whitespace-pre-line text-[13px] leading-snug text-muted">
          <DrugText text={node.detail} />
        </p>
      )}
      <div className="mt-3">
        <CalculatorForm
          fields={calc.fields}
          values={values}
          onChange={(id, v) => setValues((prev) => ({ ...prev, [id]: v }))}
          requiredFieldIds={calc.requiredNumberFieldIds}
        />
      </div>
      {!missingRequired && (
        <p className="mt-3 text-sm text-muted">
          Score actuel : <span className="font-semibold text-white">{score}</span>
          {matchedIndex >= 0 && ` — ${node.branches[matchedIndex].label}`}
        </p>
      )}
      <button
        type="button"
        disabled={missingRequired || matchedIndex < 0 || upToDate}
        onClick={() => onChoose(matchedIndex)}
        className="mt-3 w-full rounded-lg border border-accent-2/60 bg-accent-2/10 px-3.5 py-2.5 text-center text-sm font-medium text-white backdrop-blur-xl transition-all duration-150 disabled:opacity-40"
      >
        {upToDate ? "Validé" : chosenIndex !== undefined ? "Mettre à jour" : "Valider"}
      </button>
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
  if (node.type === "score") {
    return <ScoreNodeCard node={node} chosenIndex={chosenIndex} onChoose={onChoose} />;
  }

  if (node.type === "leaf") {
    return (
      <div className="card-in w-[82vw] max-w-md shrink-0 rounded-2xl border border-accent-2/25 bg-accent-2/5 p-4 backdrop-blur-xl">
        <p className="text-sm font-semibold text-accent-2">{node.title}</p>
        <ul className="mt-2.5 flex flex-col gap-1.5">
          {node.items.map((item) => (
            <li key={item} className="flex items-start gap-2 text-sm leading-snug text-white">
              <span className="mt-2 h-1 w-1 shrink-0 rounded-full bg-accent-2" />
              <DrugText text={item} />
            </li>
          ))}
        </ul>
        {node.treatment && node.treatment.length > 0 && (
          <>
            <p className="mt-3 text-xs font-semibold uppercase tracking-wide text-muted">Prise en charge</p>
            <ul className="mt-1.5 flex flex-col gap-1.5">
              {node.treatment.map((item) => (
                <li key={item} className="flex items-start gap-2 text-sm leading-snug text-white">
                  <span className="mt-2 h-1 w-1 shrink-0 rounded-full bg-white/60" />
                  <DrugText text={item} />
                </li>
              ))}
            </ul>
          </>
        )}
        {node.warning && <Warning text={node.warning} />}
        {node.detail && (
          <p className="mt-2.5 whitespace-pre-line text-[13px] leading-snug text-muted">
            <DrugText text={node.detail} />
          </p>
        )}
        {node.link && <NodeLink link={node.link} />}
        {node.links?.map((l) => <NodeLink key={l.to} link={l} />)}
      </div>
    );
  }

  return (
    <div className="card-in w-[82vw] max-w-md shrink-0 rounded-2xl border border-border bg-surface p-4 backdrop-blur-xl">
      <p className="text-sm font-semibold text-white">{node.title}</p>
      {node.subtitle && <p className="mt-0.5 text-xs text-muted">{node.subtitle}</p>}
      {node.detail && (
        <p className="mt-1.5 whitespace-pre-line text-[13px] leading-snug text-muted">
          <DrugText text={node.detail} />
        </p>
      )}
      {node.warning && <Warning text={node.warning} />}
      {node.link && <NodeLink link={node.link} />}
      {node.links?.map((l) => <NodeLink key={l.to} link={l} />)}
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
