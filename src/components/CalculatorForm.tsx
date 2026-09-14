import type { Field, Values } from "../lib/calculators/types";

interface Props {
  fields: Field[];
  values: Values;
  onChange: (id: string, value: number | undefined) => void;
  requiredFieldIds?: string[];
}

function groupFields(fields: Field[]): { group: string | null; fields: Field[] }[] {
  const groups: { group: string | null; fields: Field[] }[] = [];
  for (const f of fields) {
    const g = f.group ?? null;
    let bucket = groups.find((b) => b.group === g);
    if (!bucket) {
      bucket = { group: g, fields: [] };
      groups.push(bucket);
    }
    bucket.fields.push(f);
  }
  return groups;
}

export function CalculatorForm({ fields, values, onChange, requiredFieldIds }: Props) {
  const visibleFields = fields.filter((f) => f.visibleIf?.(values) ?? true);
  const groups = groupFields(visibleFields);
  const hasRequiredFields = (requiredFieldIds?.length ?? 0) > 0;

  return (
    <div className="flex flex-col gap-6">
      {groups.map((group, gi) => (
        <div key={gi} className="flex flex-col gap-3">
          {group.group && (
            <h3 className="text-xs font-semibold uppercase tracking-wide text-muted">{group.group}</h3>
          )}
          {group.fields.map((field) => {
            const required = requiredFieldIds?.includes(field.id) ?? false;
            const groupSaysOptional = group.group?.toLowerCase().includes("optionnel") ?? false;
            return (
              <FieldControl
                key={field.id}
                field={field}
                value={values[field.id]}
                onChange={(v) => onChange(field.id, v)}
                required={required}
                optional={hasRequiredFields && field.type === "number" && !required}
                showOptionalTag={hasRequiredFields && field.type === "number" && !required && !groupSaysOptional}
              />
            );
          })}
        </div>
      ))}
    </div>
  );
}

function FieldControl({
  field,
  value,
  onChange,
  required,
  optional,
  showOptionalTag,
}: {
  field: Field;
  value: number | undefined;
  onChange: (v: number | undefined) => void;
  required: boolean;
  optional: boolean;
  showOptionalTag: boolean;
}) {
  if (field.type === "boolean") {
    const checked = (value ?? 0) === 1;
    return (
      <button
        type="button"
        onClick={() => onChange(checked ? 0 : 1)}
        aria-pressed={checked}
        className={`flex items-center gap-3 rounded-xl border px-4 py-3.5 text-left text-sm transition-all duration-150 ease-out ${
          checked
            ? "translate-x-1.5 border-accent-2/60 bg-accent-2/10 text-white"
            : "translate-x-0 border-border bg-surface text-slate-200 active:bg-surface-2"
        }`}
      >
        <span
          className={`flex h-5 w-5 shrink-0 items-center justify-center rounded-md border-2 transition-colors duration-150 ${
            checked ? "border-accent-2 bg-accent-2" : "border-border"
          }`}
        >
          {checked && (
            <svg viewBox="0 0 20 20" fill="none" className="h-3.5 w-3.5">
              <path d="M4 10.5 8 14l8-8" stroke="#0a0a0b" strokeWidth={2.5} strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          )}
        </span>
        <span className="leading-snug">{field.label}</span>
      </button>
    );
  }

  if (field.type === "select") {
    return (
      <div className="flex flex-col gap-2">
        <label className="text-sm font-medium text-slate-200">{field.label}</label>
        <div className="flex flex-col gap-2">
          {field.options.map((opt) => {
            const active = value === opt.value;
            return (
              <button
                type="button"
                key={opt.label}
                onClick={() => onChange(opt.value)}
                aria-pressed={active}
                className={`rounded-xl border px-4 py-3 text-left text-sm transition-all duration-150 ease-out ${
                  active
                    ? "translate-x-1.5 border-accent-2/60 bg-accent-2/10 text-white"
                    : "translate-x-0 border-border bg-surface text-slate-300 active:bg-surface-2"
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

  // number
  const missing = required && value === undefined;
  return (
    <div className={`flex flex-col gap-2 transition-opacity duration-150 ${optional ? "opacity-55 focus-within:opacity-100" : ""}`}>
      <label className="text-sm font-medium text-slate-200" htmlFor={field.id}>
        {field.label}
        {required && <span className="ml-1 text-red-400">*</span>}
        {showOptionalTag && <span className="ml-1.5 text-xs font-normal text-muted">(optionnel)</span>}
      </label>
      <div className="flex items-center gap-2">
        <input
          id={field.id}
          type="number"
          inputMode="decimal"
          min={field.min}
          max={field.max}
          step={field.step ?? 1}
          placeholder={field.placeholder ?? "—"}
          value={value ?? ""}
          onChange={(e) => onChange(e.target.value === "" ? undefined : Number(e.target.value))}
          aria-invalid={missing}
          className={`w-full rounded-xl border px-4 py-3 text-base text-white outline-none focus:border-accent-2 ${
            missing ? "border-red-500 bg-red-500/10 placeholder:text-red-400/70" : "border-border bg-surface"
          }`}
        />
        {field.unit && <span className="shrink-0 text-sm text-muted">{field.unit}</span>}
      </div>
    </div>
  );
}
