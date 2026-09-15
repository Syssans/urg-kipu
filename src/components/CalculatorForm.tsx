import { useEffect, useState } from "react";
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

function isCompactSelect(f: Field): boolean {
  return f.type === "select" && f.options.length <= 3 && !f.showPoints;
}

function formatSigned(n: number): string {
  if (n > 0) return `+${n}`;
  if (n < 0) return `${n}`;
  return "0";
}

// Pairs up consecutive compact selects (e.g. two 2-option toggles) so they
// can share one row instead of each taking a full-width block.
function groupIntoRows(fields: Field[]): Field[][] {
  const rows: Field[][] = [];
  for (const f of fields) {
    const last = rows[rows.length - 1];
    if (isCompactSelect(f) && last && last.length === 1 && isCompactSelect(last[0])) {
      last.push(f);
    } else {
      rows.push([f]);
    }
  }
  return rows;
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
          {groupIntoRows(group.fields).map((row, ri) => {
            const groupSaysOptional = group.group?.toLowerCase().includes("optionnel") ?? false;
            const controls = row.map((field) => {
              const required = requiredFieldIds?.includes(field.id) ?? false;
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
            });
            if (row.length === 1) return controls[0] ?? null;
            return (
              <div key={ri} className="flex gap-3">
                {row.map((field, i) => (
                  <div key={field.id} className="min-w-0 flex-1">
                    {controls[i]}
                  </div>
                ))}
              </div>
            );
          })}
        </div>
      ))}
    </div>
  );
}

// Plain <input type="number"> rejects a comma entirely (its value must always use
// "." per the HTML spec), but French mobile keypads for inputMode="decimal" only
// offer a comma — so typing a decimal on phone was silently impossible. This uses
// type="text" instead and normalizes "," to "." itself, keeping the numeric keypad
// via inputMode while accepting whatever separator the keyboard actually offers.
function NumberInput({
  id,
  value,
  onChange,
  placeholder,
  missing,
  centered,
}: {
  id: string;
  value: number | undefined;
  onChange: (v: number | undefined) => void;
  placeholder: string;
  missing: boolean;
  centered?: boolean;
}) {
  const [raw, setRaw] = useState(value !== undefined ? String(value) : "");

  useEffect(() => {
    const parsed = raw === "" ? undefined : Number(raw.replace(",", "."));
    if (parsed !== value) {
      setRaw(value !== undefined ? String(value) : "");
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [value]);

  const handleChange = (text: string) => {
    if (!/^-?[0-9]*[.,]?[0-9]*$/.test(text)) return;
    setRaw(text);
    if (text === "") {
      onChange(undefined);
      return;
    }
    const normalized = text.replace(",", ".");
    if (normalized === "-" || normalized.endsWith(".")) return;
    const parsed = Number(normalized);
    if (!Number.isNaN(parsed)) onChange(parsed);
  };

  const handleBlur = () => {
    // A fully-typed value was already committed on change; only clean up a
    // value left dangling on a separator (e.g. "12," or "-") when leaving the field.
    const normalized = raw.replace(",", ".");
    if (normalized !== "-" && !normalized.endsWith(".")) return;
    const cleaned = normalized.slice(0, -1);
    const parsed = cleaned === "" ? undefined : Number(cleaned);
    const final = parsed !== undefined && !Number.isNaN(parsed) ? parsed : undefined;
    onChange(final);
    setRaw(final !== undefined ? String(final) : "");
  };

  return (
    <input
      id={id}
      type="text"
      inputMode="decimal"
      placeholder={placeholder}
      value={raw}
      onChange={(e) => handleChange(e.target.value)}
      onBlur={handleBlur}
      aria-invalid={missing}
      className={`rounded-xl border px-4 py-3 text-white outline-none backdrop-blur-xl transition-colors duration-150 focus:border-accent-2 ${
        centered ? "w-32 text-center text-lg" : "w-full text-base"
      } ${missing ? "border-red-500 bg-red-500/10 placeholder:text-red-400/70" : "border-border bg-surface"}`}
    />
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
        className={`flex items-center gap-3 rounded-xl border px-4 py-3.5 text-left text-sm backdrop-blur-xl transition-all duration-150 ease-out ${
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
        <span className="flex-1 leading-snug">{field.label}</span>
        {field.points !== undefined && (
          <span className={`shrink-0 tabular-nums ${checked ? "text-white" : "text-muted"}`}>{formatSigned(field.points)}</span>
        )}
      </button>
    );
  }

  if (field.type === "select") {
    const compact = isCompactSelect(field);
    const showPoints = field.showPoints ?? false;
    return (
      <div className="flex h-full flex-col gap-1.5">
        <label className={compact ? "text-xs font-medium text-slate-200" : "text-sm font-medium text-slate-200"}>{field.label}</label>
        <div className={compact ? `mt-auto grid gap-1.5 ${field.options.length === 2 ? "grid-cols-2" : "grid-cols-3"}` : "flex flex-col gap-2"}>
          {field.options.map((opt) => {
            const active = value === opt.value;
            return (
              <button
                type="button"
                key={opt.label}
                onClick={() => onChange(opt.value)}
                aria-pressed={active}
                className={`rounded-lg border leading-snug backdrop-blur-xl transition-all duration-150 ease-out ${
                  compact
                    ? "flex min-h-[2.5rem] items-center justify-center p-1 text-center text-xs"
                    : showPoints
                    ? "flex items-center gap-3 px-4 py-3 text-left text-sm"
                    : "px-4 py-3 text-left text-sm"
                } ${
                  active
                    ? `${compact ? "-translate-y-0.5" : "translate-x-1.5"} border-accent-2/60 bg-accent-2/10 text-white`
                    : `${compact ? "translate-y-0" : "translate-x-0"} border-border bg-surface text-slate-300 active:bg-surface-2`
                }`}
              >
                {showPoints ? (
                  <>
                    <span className="flex-1">{opt.label}</span>
                    <span className={`shrink-0 tabular-nums ${active ? "text-white" : "text-muted"}`}>{formatSigned(opt.value)}</span>
                  </>
                ) : (
                  opt.label
                )}
              </button>
            );
          })}
        </div>
      </div>
    );
  }

  // number
  const missing = required && value === undefined;
  const dimmed = optional && value === undefined;

  if (field.compact) {
    return (
      <div className={`flex flex-col items-center gap-2 transition-opacity duration-150 ${dimmed ? "opacity-55 focus-within:opacity-100" : ""}`}>
        <label className="text-sm font-medium text-slate-200" htmlFor={field.id}>
          {field.label}
          {required && <span className="ml-1 text-red-400">*</span>}
          {showOptionalTag && <span className="ml-1.5 text-xs font-normal text-muted">(optionnel)</span>}
          {field.normText && <span className="ml-1.5 text-xs font-normal italic text-muted">({field.normText})</span>}
        </label>
        <NumberInput
          id={field.id}
          value={value}
          onChange={onChange}
          placeholder={field.placeholder ?? "—"}
          missing={missing}
          centered
        />
      </div>
    );
  }

  return (
    <div className={`flex flex-col gap-2 transition-opacity duration-150 ${dimmed ? "opacity-55 focus-within:opacity-100" : ""}`}>
      <label className="text-sm font-medium text-slate-200" htmlFor={field.id}>
        {field.label}
        {required && <span className="ml-1 text-red-400">*</span>}
        {showOptionalTag && <span className="ml-1.5 text-xs font-normal text-muted">(optionnel)</span>}
        {field.normText && <span className="ml-1.5 text-xs font-normal italic text-muted">({field.normText})</span>}
      </label>
      <div className="flex items-center gap-2">
        <NumberInput
          id={field.id}
          value={value}
          onChange={onChange}
          placeholder={field.placeholder ?? "—"}
          missing={missing}
        />
        {field.unit && <span className="shrink-0 text-sm text-muted">{field.unit}</span>}
      </div>
    </div>
  );
}
