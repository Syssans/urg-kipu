import type { Vitals } from "../lib/exam/render";

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

export function NumberText({
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

export function VitalsCard({ vitals, onChange }: { vitals: Vitals; onChange: (patch: Partial<Vitals>) => void }) {
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
