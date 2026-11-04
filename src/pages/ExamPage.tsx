import { useMemo, useRef, useState } from "react";
import { Header } from "../components/Header";
import { gcs } from "../lib/calculators/gcs";
import { GLASGOW_FINDING_ID, sections, type Choice, type ExamSection, type Finding } from "../lib/exam/template";
import {
  abnormalText,
  choiceVisible,
  glasgowTotal,
  initialExam,
  renderExam,
  type ExamState,
  type FindingState,
  type Glasgow,
  type Mark,
  type SectionState,
  type Vitals,
} from "../lib/exam/render";

// Everything lives in this component's state only: nothing is saved, leaving the page
// or closing the tab wipes it. Inputs opt out of the browser's form history too.

const NORMAL_GLASGOW: Glasgow = { y: 4, v: 5, m: 6 };

export function ExamPage() {
  const [exam, setExam] = useState<ExamState>(initialExam);
  const text = useMemo(() => renderExam(exam), [exam]);
  const [copied, setCopied] = useState(false);
  const copiedTimer = useRef<number | undefined>(undefined);

  const setVitals = (patch: Partial<Vitals>) => setExam((e) => ({ ...e, vitals: { ...e.vitals, ...patch } }));
  const setGlasgow = (patch: Partial<Glasgow>) => setExam((e) => ({ ...e, glasgow: { ...e.glasgow, ...patch } }));
  const updateSection = (id: string, update: (s: SectionState) => SectionState) =>
    setExam((e) => ({ ...e, sections: { ...e.sections, [id]: update(e.sections[id]) } }));
  const setFinding = (sectionId: string, findingId: string, patch: Partial<FindingState>) =>
    updateSection(sectionId, (s) => ({ ...s, findings: { ...s.findings, [findingId]: { ...s.findings[findingId], ...patch } } }));

  // Ticks "Normal" on every usual finding still unticked (optional ones are left alone).
  const markAllNormal = (sectionIds: string[]) =>
    setExam((e) => {
      const next = { ...e.sections };
      let glasgow = e.glasgow;
      for (const section of sections.filter((s) => sectionIds.includes(s.id))) {
        const findings = { ...next[section.id].findings };
        for (const f of section.findings) {
          if (f.optional || findings[f.id].mark !== "off") continue;
          findings[f.id] = { ...findings[f.id], mark: "normal" };
          if (f.id === GLASGOW_FINDING_ID) glasgow = NORMAL_GLASGOW;
        }
        next[section.id] = { ...next[section.id], findings };
      }
      return { ...e, glasgow, sections: next };
    });

  const clearSection = (sectionId: string) => {
    const fresh = initialExam().sections[sectionId];
    updateSection(sectionId, () => fresh);
  };

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
        <div className="flex flex-col gap-3 rounded-xl border border-border bg-surface px-4 py-3 backdrop-blur-xl">
          <p className="text-[13px] leading-snug text-muted">
            Cochez ce qui figure dans l'examen : « Normal » reprend votre phrase habituelle, « Anormal » ouvre les
            détails. Rien n'est enregistré, quitter la page efface tout. Ne saisissez aucune donnée d'identité.
          </p>
          <button
            type="button"
            onClick={() => markAllNormal(sections.map((s) => s.id))}
            className="self-start rounded-lg border border-border px-3 py-1.5 text-xs text-slate-200 active:bg-surface-2"
          >
            Tout l'examen habituel normal
          </button>
        </div>

        <VitalsCard vitals={exam.vitals} onChange={setVitals} />

        {sections.map((section) => (
          <SectionCard
            key={section.id}
            section={section}
            exam={exam}
            onExtra={(extra) => updateSection(section.id, (s) => ({ ...s, extra }))}
            onFinding={(findingId, patch) => setFinding(section.id, findingId, patch)}
            onGlasgow={setGlasgow}
            onAllNormal={() => markAllNormal([section.id])}
            onClear={() => clearSection(section.id)}
          />
        ))}

        <div className="flex flex-col gap-2">
          <h2 className="text-sm font-semibold text-slate-200">Texte généré</h2>
          <pre className="whitespace-pre-wrap rounded-2xl border border-border bg-surface p-4 font-sans text-sm leading-relaxed text-slate-100 backdrop-blur-xl select-text">
            {text || "Rien de coché pour l'instant."}
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
          disabled={!text}
          className={`mx-auto flex w-full max-w-xl items-center justify-center gap-2 rounded-2xl border py-3.5 text-[15px] font-semibold shadow-[0_8px_30px_rgba(0,0,0,0.5)] backdrop-blur-xl transition-all duration-150 active:scale-[0.98] disabled:text-muted ${
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
  onExtra,
  onFinding,
  onGlasgow,
  onAllNormal,
  onClear,
}: {
  section: ExamSection;
  exam: ExamState;
  onExtra: (extra: string) => void;
  onFinding: (findingId: string, patch: Partial<FindingState>) => void;
  onGlasgow: (patch: Partial<Glasgow>) => void;
  onAllNormal: () => void;
  onClear: () => void;
}) {
  const state = exam.sections[section.id];
  const ticked = section.findings.filter((f) => state.findings[f.id].mark !== "off").length;
  return (
    <section className="flex flex-col gap-2.5 rounded-2xl border border-border bg-surface p-4 backdrop-blur-xl">
      <div className="flex items-center justify-between gap-2">
        <h2 className={`font-semibold ${ticked ? "text-white" : "text-slate-300"}`}>
          {section.title}
          {ticked > 0 && <span className="ml-2 text-xs font-normal text-muted">{ticked} coché{ticked > 1 ? "s" : ""}</span>}
        </h2>
        <div className="flex shrink-0 gap-1.5">
          {ticked > 0 && (
            <button type="button" onClick={onClear} className="rounded-full px-2.5 py-1 text-xs text-muted active:bg-surface-2">
              Effacer
            </button>
          )}
          <button
            type="button"
            onClick={onAllNormal}
            className="rounded-full border border-border px-3 py-1 text-xs text-slate-200 active:bg-surface-2"
          >
            Tout normal
          </button>
        </div>
      </div>

      {section.findings.map((finding) =>
        finding.id === GLASGOW_FINDING_ID ? (
          <GlasgowRow
            key={finding.id}
            mark={state.findings[finding.id].mark}
            glasgow={exam.glasgow}
            onMark={(mark) => {
              onFinding(finding.id, { mark });
              if (mark === "normal") onGlasgow(NORMAL_GLASGOW);
            }}
            onChange={onGlasgow}
          />
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
        onChange={(e) => onExtra(e.target.value)}
        placeholder="Autre constatation…"
        aria-label={`Autre constatation (${section.title})`}
        className="w-full rounded-xl border border-dashed border-border bg-transparent px-4 py-2.5 text-sm text-white outline-none transition-colors duration-150 placeholder:text-muted focus:border-accent-2"
      />
    </section>
  );
}

function MarkButtons({ mark, onMark, label }: { mark: Mark; onMark: (mark: Mark) => void; label: string }) {
  const options: { value: Mark; text: string; on: string }[] = [
    { value: "normal", text: "Normal", on: "border-emerald-400/60 bg-emerald-500/20 text-emerald-200" },
    { value: "abnormal", text: "Anormal", on: "border-amber-400/70 bg-amber-400/20 text-amber-100" },
  ];
  return (
    <div role="group" aria-label={label} className="flex shrink-0 gap-1">
      {options.map((o) => {
        const active = mark === o.value;
        return (
          <button
            key={o.value}
            type="button"
            aria-pressed={active}
            // Tapping the active one again takes the finding back out of the exam.
            onClick={() => onMark(active ? "off" : o.value)}
            className={`rounded-lg border px-2.5 py-1.5 text-xs font-medium transition-colors duration-150 ${
              active ? o.on : "border-border text-muted active:bg-surface-2"
            }`}
          >
            {o.text}
          </button>
        );
      })}
    </div>
  );
}

function rowClass(mark: Mark) {
  if (mark === "normal") return "border-emerald-500/30 bg-emerald-500/5";
  if (mark === "abnormal") return "border-amber-400/50 bg-amber-400/10";
  return "border-border bg-transparent";
}

function FindingRow({
  finding,
  state,
  onChange,
}: {
  finding: Finding;
  state: FindingState;
  onChange: (patch: Partial<FindingState>) => void;
}) {
  const togglePick = (choice: Choice, option: string) => {
    const current = state.picks[choice.id] ?? [];
    const selected = current.includes(option);
    const next = choice.multi
      ? selected
        ? current.filter((o) => o !== option)
        : [...current, option]
      : selected
        ? []
        : [option];
    onChange({ picks: { ...state.picks, [choice.id]: next } });
  };
  const phrase = state.mark === "abnormal" ? abnormalText(finding, state) : "";

  return (
    <div className={`rounded-xl border transition-colors duration-150 ${rowClass(state.mark)}`}>
      <div className="flex items-center gap-2 px-3.5 py-2.5">
        <span className={`flex-1 text-sm leading-snug ${state.mark === "off" ? "text-slate-300" : "text-white"}`}>
          {finding.label}
        </span>
        <MarkButtons mark={state.mark} onMark={(mark) => onChange({ mark })} label={finding.label} />
      </div>

      {state.mark === "normal" && <p className="px-3.5 pb-3 text-[13px] leading-snug text-emerald-200/80">{finding.normal}</p>}

      {state.mark === "abnormal" && (
        <div className="flex flex-col gap-3 px-3.5 pb-3.5">
          {(finding.choices ?? [])
            .filter((c) => choiceVisible(c, state))
            .map((choice) => (
              <div key={choice.id} className="flex flex-col gap-1.5">
                <span className="text-[11px] font-medium uppercase tracking-wide text-muted">
                  {choice.label}
                  {choice.multi && <span className="ml-1 normal-case tracking-normal">(plusieurs possibles)</span>}
                </span>
                <div className="flex flex-wrap gap-1.5">
                  {choice.options.map((option) => {
                    const active = state.picks[choice.id]?.includes(option) ?? false;
                    return (
                      <button
                        key={option}
                        type="button"
                        aria-pressed={active}
                        onClick={() => togglePick(choice, option)}
                        className={`rounded-full border px-2.5 py-1 text-xs transition-colors duration-150 ${
                          active ? "border-amber-300/70 bg-amber-400/25 text-white" : "border-border bg-surface text-slate-300 active:bg-surface-2"
                        }`}
                      >
                        {option}
                      </button>
                    );
                  })}
                </div>
              </div>
            ))}
          <input
            type="text"
            autoComplete="off"
            value={state.note}
            onChange={(e) => onChange({ note: e.target.value })}
            placeholder="Précision libre…"
            aria-label={`Précision (${finding.label})`}
            className="w-full rounded-lg border border-amber-400/30 bg-black/30 px-3 py-2 text-sm text-white outline-none placeholder:text-muted focus:border-amber-300"
          />
          <p className={`text-[13px] leading-snug ${phrase ? "text-amber-100" : "italic text-muted"}`}>
            {phrase || "À préciser : choisissez au moins une option ou écrivez une précision."}
          </p>
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

function GlasgowRow({
  mark,
  glasgow,
  onMark,
  onChange,
}: {
  mark: Mark;
  glasgow: Glasgow;
  onMark: (mark: Mark) => void;
  onChange: (patch: Partial<Glasgow>) => void;
}) {
  const total = glasgowTotal(glasgow);
  return (
    <div className={`rounded-xl border transition-colors duration-150 ${rowClass(mark)}`}>
      <div className="flex items-center gap-2 px-3.5 py-2.5">
        <span className={`flex-1 text-sm ${mark === "off" ? "text-slate-300" : "text-white"}`}>
          Glasgow
          {mark !== "off" && <span className="ml-1.5 font-semibold tabular-nums">{total}</span>}
        </span>
        <MarkButtons mark={mark} onMark={onMark} label="Glasgow" />
      </div>
      {mark === "abnormal" && (
        <div className="grid grid-cols-3 gap-1.5 px-3.5 pb-3.5">
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
      )}
    </div>
  );
}
