import { useEffect } from "react";
import { useParams } from "react-router-dom";
import { Header } from "../components/Header";
import { DrugText } from "../components/DrugText";
import { getDrug } from "../lib/drugs";
import { useRecentlyUsed } from "../lib/recentlyUsed";

export function DrugPage() {
  const { id } = useParams();
  const drug = id ? getDrug(id) : undefined;
  const { recordVisit } = useRecentlyUsed();

  useEffect(() => {
    if (drug) recordVisit(drug.id);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [drug?.id]);

  if (!drug) {
    return (
      <div>
        <Header title="Introuvable" back />
        <p className="px-4 py-6 text-muted">Cette fiche médicament n'existe pas (ou plus).</p>
      </div>
    );
  }

  return (
    <div>
      <Header title={drug.dci} back />
      <div className="page-in mx-auto flex max-w-xl flex-col gap-6 px-4 pb-28 pt-4">
        <div>
          <h2 className="text-lg font-semibold text-white">{drug.dci}</h2>
          <p className="mt-1 text-sm leading-snug text-muted">
            {drug.brands.map((b) => `${b} ®`).join(", ")}
            {drug.brands.length > 0 && drug.class ? ` — ${drug.class}` : drug.class ?? ""}
          </p>
        </div>

        <Section title="Formes">
          <ul className="flex flex-col gap-1.5">
            {drug.forms.map((f) => (
              <li key={f} className="flex items-start gap-2 text-sm leading-snug text-white">
                <span className="mt-2 h-1 w-1 shrink-0 rounded-full bg-accent-2" />
                {f}
              </li>
            ))}
          </ul>
        </Section>

        <Section title="Posologie usuelle">
          <ul className="flex flex-col gap-1.5">
            {drug.dosage
              .split("\n")
              .map((line) => line.trim())
              .filter(Boolean)
              .map((line) => (
                <li key={line} className="flex items-start gap-2 text-sm leading-snug text-white">
                  <span className="mt-2 h-1 w-1 shrink-0 rounded-full bg-emerald-400" />
                  <DrugText text={line} excludeDrugId={drug.id} />
                </li>
              ))}
          </ul>
        </Section>

        <Section title="Contre-indications">
          <ul className="flex flex-col gap-1.5">
            {drug.contraindications.map((c) => (
              <li key={c} className="flex items-start gap-2 text-sm leading-snug text-white">
                <span className="mt-2 h-1 w-1 shrink-0 rounded-full bg-red-400" />
                {c}
              </li>
            ))}
          </ul>
        </Section>

        {drug.warning && (
          <p className="flex items-start gap-1.5 rounded-lg border border-amber-500/30 bg-amber-500/10 px-2.5 py-2 text-[13px] leading-snug text-amber-300">
            <svg viewBox="0 0 24 24" fill="none" className="mt-0.5 h-4 w-4 shrink-0">
              <path
                d="M12 9v4M12 17h.01M10.3 3.86 1.8 18a1.5 1.5 0 0 0 1.3 2.25h17.8a1.5 1.5 0 0 0 1.3-2.25L13.7 3.86a1.5 1.5 0 0 0-2.6 0Z"
                stroke="currentColor"
                strokeWidth={1.8}
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
            <DrugText text={drug.warning} excludeDrugId={drug.id} />
          </p>
        )}

        <div className="flex flex-col gap-1.5 border-t border-border pt-4 text-[13px] leading-snug text-muted">
          <p>
            <span className="font-medium text-slate-300">Source : </span>
            {drug.source}
          </p>
          {drug.notes && <p>{drug.notes}</p>}
          <p className="italic">Aide-mémoire non exhaustif : ne remplace pas le résumé des caractéristiques du produit (RCP) ou le Vidal.</p>
        </div>
      </div>
    </div>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="flex flex-col gap-2.5">
      <h3 className="text-xs font-semibold uppercase tracking-wide text-muted">{title}</h3>
      {children}
    </div>
  );
}
