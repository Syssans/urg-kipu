import { GLASGOW_FINDING_ID, sections, type Choice, type ExamSection, type Finding } from "./template";

// Values are kept as typed (strings) so "37,5" stays "37,5" in the text.
export interface Vitals {
  temp: string;
  sys: string;
  dia: string;
  hr: string;
  sat: string;
  onO2: boolean;
  o2Flow: string;
  rr: string;
}

// "off": not in the exam (the default).
export type Mark = "off" | "normal" | "abnormal";

export interface FindingState {
  mark: Mark;
  // Picked options, by choice id.
  picks: Record<string, string[]>;
  note: string;
}

export interface SectionState {
  extra: string;
  findings: Record<string, FindingState>;
}

export interface Glasgow {
  y: number;
  v: number;
  m: number;
}

export interface ExamState {
  vitals: Vitals;
  glasgow: Glasgow;
  sections: Record<string, SectionState>;
}

export const emptyFinding = (): FindingState => ({ mark: "off", picks: {}, note: "" });

export function initialExam(): ExamState {
  return {
    vitals: { temp: "", sys: "", dia: "", hr: "", sat: "", onO2: false, o2Flow: "", rr: "" },
    glasgow: { y: 4, v: 5, m: 6 },
    sections: Object.fromEntries(
      sections.map((s) => [s.id, { extra: "", findings: Object.fromEntries(s.findings.map((f) => [f.id, emptyFinding()])) }]),
    ),
  };
}

export const glasgowTotal = (g: Glasgow) => g.y + g.v + g.m;

const clean = (s: string) => s.trim().replace(/\./g, ",");

export function vitalsLines(v: Vitals): string[] {
  const lines: string[] = [];
  if (v.temp.trim()) lines.push(`T°: ${clean(v.temp)}°C`);
  const parts: string[] = [];
  if (v.sys.trim() && v.dia.trim()) parts.push(`TA ${clean(v.sys)}/${clean(v.dia)} mmHg`);
  if (v.hr.trim()) parts.push(`FC: ${clean(v.hr)}/min`);
  if (v.sat.trim()) {
    const support = v.onO2 ? (v.o2Flow.trim() ? `sous ${clean(v.o2Flow)} L/min d'O2` : "sous O2") : "en air ambiant";
    parts.push(`Sat: ${clean(v.sat)}% ${support}`);
  }
  if (v.rr.trim()) parts.push(`FR: ${clean(v.rr)}/min`);
  if (parts.length) lines.push(parts.join(", "));
  return lines;
}

// "a", "a et b", "a, b et c"
export function joinFr(items: string[]) {
  if (items.length <= 1) return items.join("");
  return items.slice(0, -1).join(", ") + " et " + items[items.length - 1];
}

export function choiceVisible(choice: Choice, state: FindingState) {
  if (!choice.showIf) return true;
  const picked = state.picks[choice.showIf.choice] ?? [];
  return choice.showIf.any.some((o) => picked.includes(o));
}

export function abnormalText(finding: Finding, state: FindingState): string {
  let out = finding.abnormal;
  for (const choice of finding.choices ?? []) {
    if (!choiceVisible(choice, state)) continue;
    // Printed in the template's order, whatever the order they were tapped in.
    const picked = choice.options.filter((o) => state.picks[choice.id]?.includes(o));
    if (!picked.length) continue;
    const body = (choice.before ?? "") + joinFr(picked) + (choice.after ?? "");
    out = out ? out + (choice.sep ?? " ") + body : body;
  }
  const note = state.note.trim();
  if (note) out = out ? `${out}, ${note}` : note;
  return out;
}

// "Douleur thoracique" becomes "douleur thoracique" mid-sentence; "TRC", "ROT" stay as they are.
function lowerFirst(s: string) {
  return /^\p{Lu}\p{Ll}/u.test(s) ? s[0].toLowerCase() + s.slice(1) : s;
}
function upperFirst(s: string) {
  return s ? s[0].toUpperCase() + s.slice(1) : s;
}

export function findingText(section: ExamSection, finding: Finding, exam: ExamState): string {
  const state = exam.sections[section.id].findings[finding.id];
  if (state.mark === "off") return "";
  if (finding.id === GLASGOW_FINDING_ID) {
    const g = exam.glasgow;
    return `Glasgow ${glasgowTotal(g)} (Y${g.y}V${g.v}M${g.m})`;
  }
  return state.mark === "normal" ? finding.normal : abnormalText(finding, state);
}

function sectionSentence(section: ExamSection, exam: ExamState): string {
  const state = exam.sections[section.id];
  const phrases = section.findings.map((f) => findingText(section, f, exam)).filter(Boolean);
  if (state.extra.trim()) phrases.push(state.extra.trim());
  if (!phrases.length) return "";
  let sentence = phrases.map((p, i) => (i === 0 ? upperFirst(p) : lowerFirst(p))).join(", ");
  if (section.end && !sentence.endsWith(section.end)) sentence += section.end;
  return sentence;
}

export function renderExam(exam: ExamState): string {
  const blocks: string[] = [];
  const vitals = vitalsLines(exam.vitals);
  if (vitals.length) blocks.push(vitals.join("\n"));
  let previousPrinted = false;
  for (const section of sections) {
    const sentence = sectionSentence(section, exam);
    if (sentence) {
      // Only join the previous paragraph when the section just before it was printed.
      if (section.sameParagraph && previousPrinted) blocks[blocks.length - 1] += "\n" + sentence;
      else blocks.push(sentence);
    }
    previousPrinted = !!sentence;
  }
  return blocks.join("\n\n");
}
