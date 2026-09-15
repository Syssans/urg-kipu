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
  conversion: "Conversions",
  formule: "Formules",
};

export function defaultValues(fields: Field[]): Values {
  const values: Values = {};
  for (const f of fields) {
    if (f.type === "select") values[f.id] = f.options[0]?.value ?? 0;
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
