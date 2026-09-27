export type Values = Record<string, number | undefined>;

export interface SelectOption {
  label: string;
  value: number;
  hint?: string;
}

export interface SelectField {
  type: "select";
  id: string;
  label: string;
  group?: string;
  options: SelectOption[];
  visibleIf?: (values: Values) => boolean;
  // When true, each option renders as a full-width row with its label on
  // the left and its point value (signed: +N / −N / 0) right-aligned,
  // instead of the compact square layout used for short categorical
  // choices with no score contribution (e.g. artériel/veineux).
  showPoints?: boolean;
  // Pre-selected option, only for context choices (arterial/venous...). Scoring
  // items have none: the result stays hidden until the user has picked one.
  defaultValue?: number;
}

export interface BooleanField {
  type: "boolean";
  id: string;
  label: string;
  hint?: string;
  group?: string;
  points?: number;
  visibleIf?: (values: Values) => boolean;
}

export interface NumberField {
  type: "number";
  id: string;
  label: string;
  unit?: string;
  // Plausibility bounds: a value outside them is flagged as a probable typo and
  // no result is shown until it is corrected.
  min?: number;
  max?: number;
  step?: number;
  placeholder?: string;
  group?: string;
  visibleIf?: (values: Values) => boolean;
  // When true, renders as a smaller, centered input instead of the default
  // full-width field — for single-value "type a number, get a result" tools
  // (unit converters) rather than multi-field clinical forms.
  compact?: boolean;
  // Reference range shown in small gray italics next to the label (e.g.
  // "7,35–7,45") — a quick at-a-glance normal, always visible regardless of
  // whether the field has been filled in.
  normText?: string;
}

export type Field = SelectField | BooleanField | NumberField;

export type Level = "low" | "moderate" | "high" | "critical" | "info";

export interface Interpretation {
  title: string;
  level: Level;
  detail?: string;
  scoreLabel?: string;
  // "primary" (default) renders as a colored, glowing card — the headline
  // conclusion. "secondary" renders as a flat violet card with no glow, for
  // supporting detail that shouldn't compete visually with the diagnosis.
  role?: "primary" | "secondary";
}

export type Category =
  | "neurologie"
  | "cardiovasculaire"
  | "respiratoire"
  | "infectiologie"
  | "traumatologie"
  | "digestif"
  | "biologie"
  | "pediatrie"
  | "geriatrie"
  | "conversion"
  | "formule";

export interface Calculator {
  id: string;
  name: string;
  shortName: string;
  category: Category;
  keywords: string[];
  summary: string;
  fields: Field[];
  requiredNumberFieldIds?: string[];
  getRecommendedFieldIds?: (values: Values) => string[];
  compute: (values: Values) => number;
  interpret: (score: number, values: Values) => Interpretation[];
  scoreSuffix?: string;
  source: string;
  notes?: string;
}

export const CATEGORY_LABELS: Record<Category, string> = {
  neurologie: "Neurologie",
  cardiovasculaire: "Cardiovasculaire",
  respiratoire: "Respiratoire",
  infectiologie: "Infectiologie",
  traumatologie: "Traumatologie",
  digestif: "Digestif",
  biologie: "Biologie",
  pediatrie: "Pédiatrie",
  geriatrie: "Gériatrie",
  conversion: "Conversions",
  formule: "Formules",
};

export const CATEGORY_COLORS: Record<Category, { bg: string; text: string }> = {
  neurologie: { bg: "bg-violet-500/15", text: "text-violet-300" },
  cardiovasculaire: { bg: "bg-rose-500/15", text: "text-rose-300" },
  respiratoire: { bg: "bg-sky-500/15", text: "text-sky-300" },
  infectiologie: { bg: "bg-yellow-500/15", text: "text-yellow-300" },
  traumatologie: { bg: "bg-orange-500/15", text: "text-orange-300" },
  digestif: { bg: "bg-lime-500/15", text: "text-lime-300" },
  biologie: { bg: "bg-cyan-500/15", text: "text-cyan-300" },
  pediatrie: { bg: "bg-pink-500/15", text: "text-pink-300" },
  geriatrie: { bg: "bg-indigo-500/15", text: "text-indigo-300" },
  conversion: { bg: "bg-slate-500/15", text: "text-slate-300" },
  formule: { bg: "bg-stone-500/15", text: "text-stone-300" },
};

export function defaultValues(fields: Field[]): Values {
  const values: Values = {};
  for (const f of fields) {
    if (f.type === "select") values[f.id] = f.defaultValue;
    if (f.type === "boolean") values[f.id] = 0;
    if (f.type === "number") values[f.id] = undefined;
  }
  return values;
}

export const LEVEL_STYLES: Record<Level, { bg: string; text: string; ring: string; dot: string; glow: string }> = {
  low: { bg: "bg-emerald-500/10", text: "text-emerald-400", ring: "ring-emerald-500/30", dot: "bg-emerald-400", glow: "shadow-emerald-500/40" },
  moderate: { bg: "bg-amber-500/10", text: "text-amber-400", ring: "ring-amber-500/30", dot: "bg-amber-400", glow: "shadow-amber-500/40" },
  high: { bg: "bg-orange-500/10", text: "text-orange-400", ring: "ring-orange-500/30", dot: "bg-orange-400", glow: "shadow-orange-500/45" },
  critical: { bg: "bg-red-500/10", text: "text-red-400", ring: "ring-red-500/30", dot: "bg-red-400", glow: "shadow-red-500/55" },
  info: { bg: "bg-zinc-400/10", text: "text-zinc-300", ring: "ring-zinc-400/30", dot: "bg-zinc-300", glow: "shadow-zinc-400/30" },
};

function isVisible(f: Field, values: Values): boolean {
  return f.visibleIf?.(values) ?? true;
}

// Fields that still need an answer before a result can be shown: unanswered
// scoring selects and empty required numbers (hidden fields excluded).
export function missingFields(calc: Calculator, values: Values): Field[] {
  const required = calc.requiredNumberFieldIds ?? [];
  return calc.fields.filter(
    (f) =>
      isVisible(f, values) &&
      values[f.id] === undefined &&
      (f.type === "select" || (f.type === "number" && required.includes(f.id))),
  );
}

export function implausibleFields(calc: Calculator, values: Values): NumberField[] {
  return calc.fields.filter((f): f is NumberField => {
    if (f.type !== "number" || !isVisible(f, values)) return false;
    const v = values[f.id];
    return v !== undefined && ((f.min !== undefined && v < f.min) || (f.max !== undefined && v > f.max));
  });
}

function frNum(n: number): string {
  return String(n).replace(".", ",");
}

export function plausibleRangeText(f: NumberField): string {
  const unit = f.unit ? ` ${f.unit}` : "";
  if (f.min !== undefined && f.max !== undefined) return `${frNum(f.min)} à ${frNum(f.max)}${unit}`;
  if (f.min !== undefined) return `≥ ${frNum(f.min)}${unit}`;
  return `≤ ${frNum(f.max!)}${unit}`;
}
