import { useEffect, useMemo, useRef, useState } from "react";
import { useParams } from "react-router-dom";
import { Header } from "../components/Header";
import { CalculatorForm } from "../components/CalculatorForm";
import { ResultCard } from "../components/ResultCard";
import { DrugText } from "../components/DrugText";
import { getCalculator } from "../lib/calculators";
import {
  defaultValues,
  implausibleFields,
  LEVEL_STYLES,
  missingFields,
  plausibleRangeText,
  type Calculator,
  type Interpretation,
  type Values,
} from "../lib/calculators/types";
import { useFavorites } from "../lib/favorites";
import { useRecentlyUsed } from "../lib/recentlyUsed";

export function CalculatorPage({ lookup = getCalculator }: { lookup?: (id: string) => Calculator | undefined }) {
  const { id } = useParams();
  const calc = id ? lookup(id) : undefined;
  const { isFavorite, toggleFavorite } = useFavorites();

  if (!calc) {
    return (
      <div>
        <Header title="Introuvable" back />
        <p className="px-4 py-6 text-muted">Ce calculateur n'existe pas (ou plus).</p>
      </div>
    );
  }

  return <CalculatorPageInner key={calc.id} calc={calc} favorite={isFavorite(calc.id)} onToggleFavorite={() => toggleFavorite(calc.id)} />;
}

function CalculatorPageInner({
  calc,
  favorite,
  onToggleFavorite,
}: {
  calc: NonNullable<ReturnType<typeof getCalculator>>;
  favorite: boolean;
  onToggleFavorite: () => void;
}) {
  const [values, setValues] = useState<Values>(() => defaultValues(calc.fields));
  const { recordVisit } = useRecentlyUsed();

  useEffect(() => {
    recordVisit(calc.id);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [calc.id]);

  const missing = missingFields(calc, values);
  const implausible = implausibleFields(calc, values);
  const blocked = missing.length > 0 || implausible.length > 0;

  const recommendedFieldIds = calc.getRecommendedFieldIds?.(values) ?? [];
  const highlightFieldIds = [...(calc.requiredNumberFieldIds ?? []), ...recommendedFieldIds];

  const results = useMemo(() => {
    if (blocked) return null;
    const score = calc.compute(values);
    return calc.interpret(score, values);
  }, [calc, values, blocked]);

  // The result sits below a possibly long form: while it is out of view (below the fold),
  // a compact copy floats above the bottom nav and scrolls to it when tapped.
  const resultRef = useRef<HTMLDivElement>(null);
  const [resultBelow, setResultBelow] = useState(false);
  useEffect(() => {
    const el = resultRef.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => setResultBelow(!entry.isIntersecting && entry.boundingClientRect.top > 0),
      { rootMargin: "0px 0px -150px 0px" },
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return (
    <div>
      <Header title={calc.shortName} back />
      <div className="page-in mx-auto flex max-w-xl flex-col gap-6 px-4 pb-28 pt-4">
        <div className="flex items-start justify-between gap-3">
          <div>
            <h2 className="text-lg font-semibold text-white">{calc.name}</h2>
            <p className="mt-1 text-sm leading-snug text-muted">{calc.summary}</p>
          </div>
          <button
            type="button"
            aria-label={favorite ? "Retirer des favoris" : "Ajouter aux favoris"}
            onClick={onToggleFavorite}
            className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-border bg-surface backdrop-blur-xl transition-transform duration-150 active:scale-90 active:bg-surface-2"
          >
            <svg viewBox="0 0 24 24" fill={favorite ? "#e11d2f" : "none"} className="h-5 w-5">
              <path
                d="m12 3.5 2.6 5.4 5.9.8-4.3 4.2 1 5.9-5.2-2.8-5.2 2.8 1-5.9-4.3-4.2 5.9-.8Z"
                stroke={favorite ? "#e11d2f" : "currentColor"}
                className={favorite ? "" : "text-muted"}
                strokeWidth={1.8}
                strokeLinejoin="round"
              />
            </svg>
          </button>
        </div>

        <CalculatorForm
          fields={calc.fields}
          values={values}
          onChange={(id, v) => setValues((prev) => ({ ...prev, [id]: v }))}
          requiredFieldIds={highlightFieldIds}
          missingIds={missing.filter((f) => f.type === "select").map((f) => f.id)}
          implausibleIds={implausible.map((f) => f.id)}
        />

        <button
          type="button"
          onClick={() => setValues(defaultValues(calc.fields))}
          className="self-start text-sm text-muted underline underline-offset-2"
        >
          Réinitialiser
        </button>

        <div ref={resultRef} className="flex scroll-mt-4 flex-col gap-2.5 border-t border-border pt-5">
          <h3 className="text-xs font-semibold uppercase tracking-wide text-muted">Résultat</h3>
          {implausible.length > 0 ? (
            <div className="flex items-start gap-2.5 rounded-2xl border border-red-500/30 bg-red-500/10 p-4 backdrop-blur-xl">
              <svg viewBox="0 0 24 24" fill="none" className="mt-0.5 h-5 w-5 shrink-0 text-red-400">
                <circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth={1.8} />
                <path d="M12 8v5" stroke="currentColor" strokeWidth={1.8} strokeLinecap="round" />
                <circle cx="12" cy="16" r="1" fill="currentColor" />
              </svg>
              <div className="flex flex-col gap-1 text-sm leading-snug text-red-300">
                <p className="font-medium">Valeur improbable, vérifiez la saisie :</p>
                {implausible.map((f) => (
                  <p key={f.id}>
                    {f.label} = {String(values[f.id]).replace(".", ",")}
                    {f.unit ? ` ${f.unit}` : ""} (attendu {plausibleRangeText(f)})
                  </p>
                ))}
              </div>
            </div>
          ) : missing.length > 0 ? (
            <div className="rounded-2xl border border-dashed border-border p-4 text-sm leading-snug text-muted">
              <span className="font-medium text-slate-300">À compléter : </span>
              {missing.map((f) => f.label.replace(/\s*\?$/, "")).join(", ")}.
            </div>
          ) : (
            <div className="flex flex-col gap-2.5">
              {results!.map((r, i) => (
                <ResultCard key={i} result={r} />
              ))}
            </div>
          )}
        </div>

        <div className="flex flex-col gap-1.5 border-t border-border pt-4 text-[13px] leading-snug text-muted">
          <p>
            <span className="font-medium text-slate-300">Source : </span>
            {calc.source}
          </p>
          {calc.notes && (
            <p>
              <DrugText text={calc.notes} />
            </p>
          )}
        </div>
      </div>
      {resultBelow && (
        <ResultPeek
          results={results}
          missingCount={missing.length}
          implausible={implausible.length > 0}
          onClick={() => resultRef.current?.scrollIntoView({ behavior: "smooth", block: "start" })}
        />
      )}
    </div>
  );
}

function ResultPeek({
  results,
  missingCount,
  implausible,
  onClick,
}: {
  results: Interpretation[] | null;
  missingCount: number;
  implausible: boolean;
  onClick: () => void;
}) {
  const primary = results?.find((r) => (r.role ?? "primary") === "primary") ?? results?.[0];
  let dot = "bg-muted";
  let text = "text-slate-200";
  let label: string;
  if (implausible) {
    dot = "bg-red-400";
    text = "text-red-300";
    label = "Valeur improbable, vérifiez la saisie";
  } else if (missingCount > 0 || !primary) {
    label = `À compléter : ${missingCount} élément${missingCount > 1 ? "s" : ""}`;
  } else {
    dot = LEVEL_STYLES[primary.level].dot;
    text = LEVEL_STYLES[primary.level].text;
    label = primary.scoreLabel ? `${primary.scoreLabel} · ${primary.title}` : primary.title;
  }
  return (
    <button
      type="button"
      onClick={onClick}
      className="fixed inset-x-3 bottom-[calc(env(safe-area-inset-bottom)+5.5rem)] z-30 mx-auto flex max-w-xl items-center gap-2.5 rounded-2xl border border-border bg-surface-2 px-4 py-2.5 text-left shadow-[0_8px_30px_rgba(0,0,0,0.5)] backdrop-blur-xl"
    >
      <span aria-hidden="true" className={`h-2.5 w-2.5 shrink-0 rounded-full ${dot}`} />
      <span className={`min-w-0 flex-1 truncate text-sm font-semibold ${text}`}>{label}</span>
      <span className="sr-only">Aller au résultat</span>
      <svg aria-hidden="true" viewBox="0 0 24 24" fill="none" className="h-4 w-4 shrink-0 text-muted">
        <path d="M6 9l6 6 6-6" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    </button>
  );
}
