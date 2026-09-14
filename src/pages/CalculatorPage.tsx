import { useMemo, useState } from "react";
import { useParams } from "react-router-dom";
import { Header } from "../components/Header";
import { CalculatorForm } from "../components/CalculatorForm";
import { ResultCard } from "../components/ResultCard";
import { getCalculator } from "../lib/calculators";
import { defaultValues, type Values } from "../lib/calculators/types";
import { useFavorites } from "../lib/favorites";

export function CalculatorPage() {
  const { id } = useParams();
  const calc = id ? getCalculator(id) : undefined;
  const { isFavorite, toggleFavorite } = useFavorites();

  if (!calc) {
    return (
      <div>
        <Header title="Introuvable" back />
        <p className="px-4 py-6 text-muted">Ce calculateur n'existe pas (ou plus).</p>
      </div>
    );
  }

  return <CalculatorPageInner calc={calc} favorite={isFavorite(calc.id)} onToggleFavorite={() => toggleFavorite(calc.id)} />;
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

  const missingFieldIds = (calc.requiredNumberFieldIds ?? []).filter((id) => values[id] === undefined);
  const missingRequired = missingFieldIds.length > 0;
  const missingFieldLabels = missingFieldIds
    .map((id) => calc.fields.find((f) => f.id === id)?.label)
    .filter((label): label is string => Boolean(label));

  const results = useMemo(() => {
    if (missingRequired) return null;
    const score = calc.compute(values);
    return calc.interpret(score, values);
  }, [calc, values, missingRequired]);

  return (
    <div>
      <Header title={calc.shortName} back />
      <div className="mx-auto flex max-w-xl flex-col gap-6 px-4 pb-28 pt-4">
        <div className="flex items-start justify-between gap-3">
          <div>
            <h2 className="text-lg font-semibold text-white">{calc.name}</h2>
            <p className="mt-1 text-sm leading-snug text-muted">{calc.summary}</p>
          </div>
          <button
            type="button"
            aria-label={favorite ? "Retirer des favoris" : "Ajouter aux favoris"}
            onClick={onToggleFavorite}
            className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-border bg-surface active:bg-surface-2"
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
          requiredFieldIds={calc.requiredNumberFieldIds}
        />

        <button
          type="button"
          onClick={() => setValues(defaultValues(calc.fields))}
          className="self-start text-sm text-muted underline underline-offset-2"
        >
          Réinitialiser
        </button>

        <div className="flex flex-col gap-2.5 border-t border-border pt-5">
          <h3 className="text-xs font-semibold uppercase tracking-wide text-muted">Résultat</h3>
          {missingRequired ? (
            <div className="flex items-start gap-2.5 rounded-2xl border border-red-500/30 bg-red-500/10 p-4">
              <svg viewBox="0 0 24 24" fill="none" className="mt-0.5 h-5 w-5 shrink-0 text-red-400">
                <circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth={1.8} />
                <path d="M12 8v5" stroke="currentColor" strokeWidth={1.8} strokeLinecap="round" />
                <circle cx="12" cy="16" r="1" fill="currentColor" />
              </svg>
              <p className="text-sm leading-snug text-red-300">
                Champ{missingFieldLabels.length > 1 ? "s" : ""} obligatoire{missingFieldLabels.length > 1 ? "s" : ""} manquant
                {missingFieldLabels.length > 1 ? "s" : ""} : {missingFieldLabels.join(", ")}.
              </p>
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
          {calc.notes && <p>{calc.notes}</p>}
        </div>
      </div>
    </div>
  );
}
