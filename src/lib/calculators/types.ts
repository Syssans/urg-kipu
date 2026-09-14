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
}

export interface BooleanField {
  type: "boolean";
  id: string;
  label: string;
  hint?: string;
  group?: string;
  points?: number;
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
}

export type Field = SelectField | BooleanField | NumberField;

export type Level = "low" | "moderate" | "high" | "critical" | "info";

export interface Interpretation {
  title: string;
  level: Level;
  detail?: string;
  scoreLabel?: string;
}

export type Category =
  | "neurologie"
  | "cardiovasculaire"
  | "respiratoire"
  | "infectiologie"
  | "traumatologie"
  | "digestif";

export interface Calculator {
  id: string;
  name: string;
  shortName: string;
  category: Category;
  keywords: string[];
  summary: string;
  fields: Field[];
  requiredNumberFieldIds?: string[];
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

export const LEVEL_STYLES: Record<Level, { bg: string; text: string; ring: string; dot: string }> = {
  low: { bg: "bg-emerald-500/10", text: "text-emerald-400", ring: "ring-emerald-500/30", dot: "bg-emerald-400" },
  moderate: { bg: "bg-amber-500/10", text: "text-amber-400", ring: "ring-amber-500/30", dot: "bg-amber-400" },
  high: { bg: "bg-orange-500/10", text: "text-orange-400", ring: "ring-orange-500/30", dot: "bg-orange-400" },
  critical: { bg: "bg-red-500/10", text: "text-red-400", ring: "ring-red-500/30", dot: "bg-red-400" },
  info: { bg: "bg-sky-500/10", text: "text-sky-400", ring: "ring-sky-500/30", dot: "bg-sky-400" },
};
