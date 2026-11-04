import { useMemo, useRef, useState } from "react";
import { Header } from "../components/Header";
import { gcs } from "../lib/calculators/gcs";
import { GLASGOW_FINDING_ID, sections, type ExamSection, type Finding } from "../lib/exam/template";
import { glasgowTotal, initialExam, renderExam, type ExamState, type Glasgow, type Vitals } from "../lib/exam/render";

// Everything lives in this component's state only: nothing is saved, leaving the page
// or closing the tab wipes it. Inputs opt out of the browser's form history too.

export function ExamPage() {
  const [exam, setExam] = useState<ExamState>(initialExam);
  const text = useMemo(() => renderExam(exam), [exam]);
  const [copied, setCopied] = useState(false);
  const copiedTimer = useRef<number | undefined>(undefined);

  const setVitals = (patch: Partial<Vitals>) => setExam((e) => ({ ...e, vitals: { ...e.vitals, ...patch } }));
  const setGlasgow = (patch: Partial<Glasgow>) => setExam((e) => ({ ...e, glasgow: { ...e.glasgow, ...patch } }));
  const setSection = (id: string, patch: Partial<ExamState["sections"][string]>) =>
    setExam((e) => ({ ...e, sections: { ...e.sections, [id]: { ...e.sections[id], ...patch } } }));
  const setFinding = (sectionId: string, findingId: string, patch: Partial<{ abnormal: boolean; text: string }>) =>
    setExam((e) => {
      const s = e.sections[sectionId];
      return {
        ...e,
        sections: {
          ...e.sections,
          [sectionId]: { ...s, findings: { ...s.findings, [findingId]: { ...s.findings[findingId], ...patch } } },
        },
      };
    });

  const copy = async () => {
    const ok = await copyText(text);
    if (!ok) return;
    setCopied(true);
    window.clearTimeout(copiedTimer.current);
    copiedTimer.current = window.setTimeout(() => setCopied(false), 1800);
  };

  const reset = () => {
    setExam(initialExam());
    setCopied(false);
  };

  return (
    <div>
      <Header title="Examen clinique" back />
      <form
        autoComplete="off"
        onSubmit={(e) => e.preventDefault()}
        className="page-in mx-auto flex max-w-xl flex-col gap-5 px-4 pb-44 pt-4"
      >
        <p className="rounded-xl border border-border bg-surface px-4 py-3 text-[13px] leading-snug text-muted backdrop-blur-xl">
          Tout est normal par défaut : touchez une ligne pour la passer en anormal. Rien n'est enregistré, quitter la
          page efface tout. Ne saisissez aucune donnée d'identité.
        </p>

        <VitalsCard vitals={exam.vitals} onChange={setVitals} />

        {sections.map((section) => (
          <SectionCard
            key={section.id}
            section={section}
            exam={exam}
            onSection={(patch) => setSection(section.id, patch)}
            onFinding={(findingId, patch) => setFinding(section.id, findingId, patch)}
            onGlasgow={setGlasgow}
          />
        ))}

        <div className="flex flex-col gap-2">
          <h2 className="text-sm font-semibold text-slate-200">Texte généré</h2>
          <pre className="whitespace-pre-wrap rounded-2xl border border-border bg-surface p-4 font-sans text-sm leading-relaxed text-slate-100 backdrop-blur-xl select-text">
            {text}
          </pre>
          <button
            type="button"
            onClick={reset}
            className="self-start rounded-lg px-2 py-1.5 text-sm text-muted underline active:text-white"
          >
            Tout réinitialiser
          </button>
        </div>
      </form>

      <div className="peek-bottom fixed inset-x-0 z-30 px-4">
        <button
          type="button"
          onClick={copy}
          className={`mx-auto flex w-full max-w-xl items-center justify-center gap-2 rounded-2xl border py-3.5 text-[15px] font-semibold shadow-[0_8px_30px_rgba(0,0,0,0.5)] backdrop-blur-xl transition-all duration-150 active:scale-[0.98] ${
            copied ? "border-emerald-400/50 bg-[#0d2a20]/95 text-emerald-200" : "border-accent-2/50 bg-[#231d36]/95 text-white"
          }`}
        >
          {copied ? "Copié ✓" : "Copier l'examen"}
        </button>
      </div>
    </div>
  );
}

async function copyText(text: string): Promise<boolean> {
  try {
    await navigator.clipboard.writeText(text);
    return true;
  } catch {
    // Older or locked-down browsers: fall back to a hidden textarea.
    const area = document.createElement("textarea");
    area.value = text;
    area.setAttribute("readonly", "");
    area.style.position = "fixed";
    area.style.opacity = "0";
    document.body.appendChild(area);
    area.select();
    let ok = false;
    try {
      ok = document.execCommand("copy");
    } catch {
      ok = false;
    }
    area.remove();
    return ok;
  }
}

const inputClass =
  "w-full min-w-0 rounded-xl border border-border bg-surface px-3 py-2.5 text-center text-base text-white outline-none backdrop-blur-xl transition-colors duration-150 placeholder:text-muted/60 focus:border-accent-2";

function VitalInput({
  label,
  unit,
  value,
  onChange,
  placeholder,
}: {
  label: string;
  unit?: string;
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
}) {
  return (
    <label className="flex min-w-0 flex-col gap-1.5">
      <span className="text-xs font-medium text-slate-200">
        {label}
        {unit && <span className="ml-1 font-normal text-muted">{unit}</span>}
      </span>
      <NumberText value={value} onChange={onChange} placeholder={placeholder} ariaLabel={label} />
    </label>
  );
}

function NumberText({
  value,
  onChange,
  placeholder,
  ariaLabel,
}: {
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
  ariaLabel: string;
}) {
  return (
    <input
      type="text"
      inputMode="decimal"
      autoComplete="off"
      spellCheck={false}
      aria-label={ariaLabel}
      placeholder={placeholder ?? "—"}
      value={value}
      onChange={(e) => {
        if (/^[0-9]*[.,]?[0-9]*$/.test(e.target.value)) onChange(e.target.value);
      }}
      className={inputClass}
    />
  );
}

function VitalsCard({ vitals, onChange }: { vitals: Vitals; onChange: (patch: Partial<Vitals>) => void }) {
  return (
    <section className="flex flex-col gap-3 rounded-2xl border border-border bg-surface p-4 backdrop-blur-xl">
      <h2 className="font-semibold text-white">Constantes</h2>
      <div className="grid grid-cols-3 gap-3">
        <VitalInput label="T°" unit="°C" value={vitals.temp} onChange={(temp) => onChange({ temp })} />
        <div className="col-span-2 flex min-w-0 flex-col gap-1.5">
          <span className="text-xs font-medium text-slate-200">
            TA <span className="font-normal text-muted">mmHg</span>
          </span>
          <div className="flex items-center gap-1.5">
            <NumberText value={vitals.sys} onChange={(sys) => onChange({ sys })} ariaLabel="TA systolique" />
            <span className="text-muted">/</span>
            <NumberText value={vitals.dia} onChange={(dia) => onChange({ dia })} ariaLabel="TA diastolique" />
          </div>
        </div>
        <VitalInput label="FC" unit="/min" value={vitals.hr} onChange={(hr) => onChange({ hr })} />
        <VitalInput label="Sat" unit="%" value={vitals.sat} onChange={(sat) => onChange({ sat })} />
        <VitalInput label="FR" unit="/min" value={vitals.rr} onChange={(rr) => onChange({ rr })} />
      </div>
      <div className="flex items-center gap-2">
        <div className="grid flex-1 grid-cols-2 gap-1.5">
          {[
            { label: "Air ambiant", onO2: false },
            { label: "Sous O2", onO2: true },
          ].map((opt) => {
            const active = vitals.onO2 === opt.onO2;
            return (
              <button
                key={opt.label}
                type="button"
                aria-pressed={active}
                onClick={() => onChange({ onO2: opt.onO2 })}
                className={`rounded-lg border py-2.5 text-xs transition-colors duration-150 ${
                  active ? "border-accent-2/60 bg-accent-2/10 text-white" : "border-border bg-surface text-slate-300 active:bg-surface-2"
                }`}
              >
                {opt.label}
              </button>
            );
          })}
        </div>
        {vitals.onO2 && (
          <label className="flex w-28 items-center gap-1.5">
            <NumberText value={vitals.o2Flow} onChange={(o2Flow) => onChange({ o2Flow })} ariaLabel="Débit d'O2" />
            <span className="shrink-0 text-xs text-muted">L/min</span>
          </label>
        )}
      </div>
    </section>
  );
}

function SectionCard({
  section,
  exam,
  onSection,
  onFinding,
  onGlasgow,
}: {
  section: ExamSection;
  exam: ExamState;
  onSection: (patch: Partial<ExamState["sections"][string]>) => void;
  onFinding: (findingId: string, patch: Partial<{ abnormal: boolean; text: string }>) => void;
  onGlasgow: (patch: Partial<Glasgow>) => void;
}) {
  const state = exam.sections[section.id];
  return (
    <section className="flex flex-col gap-2.5 rounded-2xl border border-border bg-surface p-4 backdrop-blur-xl">
      <div className="flex items-center justify-between gap-3">
        <h2 className={`font-semibold ${state.included ? "text-white" : "text-muted"}`}>{section.title}</h2>
        <button
          type="button"
          aria-pressed={state.included}
          onClick={() => onSection({ included: !state.included })}
          className={`rounded-full border px-3 py-1 text-xs transition-colors duration-150 ${
            state.included ? "border-border text-muted active:bg-surface-2" : "border-accent-2/60 bg-accent-2/10 text-white"
          }`}
        >
          {state.included ? "Retirer" : "Inclure"}
        </button>
      </div>

      {state.included && (
        <>
          {section.findings.map((finding) =>
            finding.id === GLASGOW_FINDING_ID ? (
              <GlasgowRow key={finding.id} glasgow={exam.glasgow} onChange={onGlasgow} />
            ) : (
              <FindingRow
                key={finding.id}
                finding={finding}
                state={state.findings[finding.id]}
                onChange={(patch) => onFinding(finding.id, patch)}
              />
            ),
          )}
          <input
            type="text"
            autoComplete="off"
            value={state.extra}
            onChange={(e) => onSection({ extra: e.target.value })}
            placeholder="Autre constatation…"
            aria-label={`Autre constatation (${section.title})`}
            className="w-full rounded-xl border border-dashed border-border bg-transparent px-4 py-2.5 text-sm text-white outline-none transition-colors duration-150 placeholder:text-muted focus:border-accent-2"
          />
        </>
      )}
    </section>
  );
}

function FindingRow({
  finding,
  state,
  onChange,
}: {
  finding: Finding;
  state: { abnormal: boolean; text: string };
  onChange: (patch: Partial<{ abnormal: boolean; text: string }>) => void;
}) {
  return (
    <div
      className={`rounded-xl border transition-colors duration-150 ${
        state.abnormal ? "border-amber-400/50 bg-amber-400/10" : "border-border bg-surface"
      }`}
    >
      <button
        type="button"
        aria-pressed={state.abnormal}
        onClick={() => onChange({ abnormal: !state.abnormal })}
        className="flex w-full items-start gap-3 px-3.5 py-3 text-left text-sm leading-snug"
      >
        <span
          aria-hidden
          className={`mt-0.5 shrink-0 rounded-md px-1.5 py-0.5 text-[10px] font-bold ${
            state.abnormal ? "bg-amber-400 text-black" : "bg-emerald-500/20 text-emerald-300"
          }`}
        >
          {state.abnormal ? "ANORMAL" : "NORMAL"}
        </span>
        <span className={state.abnormal ? "text-muted line-through" : "text-slate-200"}>{finding.normal}</span>
      </button>
      {state.abnormal && (
        <div className="flex flex-col gap-2 px-3.5 pb-3">
          <input
            type="text"
            autoComplete="off"
            value={state.text}
            onChange={(e) => onChange({ text: e.target.value })}
            aria-label={`Constatation à la place de « ${finding.normal} »`}
            className="w-full rounded-lg border border-amber-400/40 bg-black/30 px-3 py-2.5 text-sm text-white outline-none focus:border-amber-300"
          />
          {finding.abnormal.length > 1 && (
            <div className="flex flex-wrap gap-1.5">
              {finding.abnormal.map((suggestion) => (
                <button
                  key={suggestion}
                  type="button"
                  onClick={() => onChange({ text: suggestion })}
                  className="rounded-full border border-border bg-surface px-2.5 py-1 text-xs text-slate-300 active:bg-surface-2"
                >
                  {suggestion}
                </button>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}

const GLASGOW_PARTS = [
  { key: "y", letter: "Y", fieldId: "eye" },
  { key: "v", letter: "V", fieldId: "verbal" },
  { key: "m", letter: "M", fieldId: "motor" },
] as const;

function GlasgowRow({ glasgow, onChange }: { glasgow: Glasgow; onChange: (patch: Partial<Glasgow>) => void }) {
  const total = glasgowTotal(glasgow);
  const abnormal = total < 15;
  return (
    <div
      className={`flex flex-col gap-2 rounded-xl border px-3.5 py-3 ${
        abnormal ? "border-amber-400/50 bg-amber-400/10" : "border-border bg-surface"
      }`}
    >
      <span className="text-sm text-slate-200">
        Glasgow <span className="font-semibold tabular-nums text-white">{total}</span>
      </span>
      <div className="grid grid-cols-3 gap-1.5">
        {GLASGOW_PARTS.map((part) => {
          const field = gcs.fields.find((f) => f.id === part.fieldId);
          const options = field?.type === "select" ? field.options : [];
          return (
            <label key={part.key} className="flex min-w-0 flex-col gap-1">
              <span className="text-[11px] text-muted">{part.letter}</span>
              <select
                value={glasgow[part.key]}
                onChange={(e) => onChange({ [part.key]: Number(e.target.value) })}
                aria-label={field?.type === "select" ? field.label : part.letter}
                className="w-full min-w-0 rounded-lg border border-border bg-[#1a1a1c] px-2 py-2 text-sm text-white outline-none focus:border-accent-2"
              >
                {options.map((o) => (
                  <option key={o.value} value={o.value}>
                    {o.value} · {o.label}
                  </option>
                ))}
              </select>
            </label>
          );
        })}
      </div>
    </div>
  );
}
