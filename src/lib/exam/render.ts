import { GLASGOW_FINDING_ID, sections, type ExamSection } from "./template";

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

export interface FindingState {
  abnormal: boolean;
  text: string;
}

export interface SectionState {
  included: boolean;
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

export function initialExam(): ExamState {
  return {
    vitals: { temp: "", sys: "", dia: "", hr: "", sat: "", onO2: false, o2Flow: "", rr: "" },
    glasgow: { y: 4, v: 5, m: 6 },
    sections: Object.fromEntries(
      sections.map((s) => [
        s.id,
        {
          included: true,
          extra: "",
          findings: Object.fromEntries(s.findings.map((f) => [f.id, { abnormal: false, text: f.abnormal[0] ?? "" }])),
        },
      ]),
    ),
  };
}

export const glasgowTotal = (g: Glasgow) => g.y + g.v + g.m;

const clean = (s: string) => s.trim().replace(/\./g, ",");

function vitalsLines(v: Vitals): string[] {
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

// "Douleur thoracique" becomes "douleur thoracique" mid-sentence; "TRC", "ROT" stay as they are.
function lowerFirst(s: string) {
  return /^\p{Lu}\p{Ll}/u.test(s) ? s[0].toLowerCase() + s.slice(1) : s;
}
function upperFirst(s: string) {
  return s ? s[0].toUpperCase() + s.slice(1) : s;
}

export function findingText(section: ExamSection, findingId: string, exam: ExamState): string {
  const finding = section.findings.find((f) => f.id === findingId)!;
  if (finding.id === GLASGOW_FINDING_ID) {
    const g = exam.glasgow;
    return `Glasgow ${glasgowTotal(g)} (Y${g.y}V${g.v}M${g.m})`;
  }
  const state = exam.sections[section.id].findings[finding.id];
  return state.abnormal ? state.text.trim() : finding.normal;
}

function sectionSentence(section: ExamSection, exam: ExamState): string {
  const state = exam.sections[section.id];
  const phrases = section.findings.map((f) => findingText(section, f.id, exam)).filter(Boolean);
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
    const sentence = exam.sections[section.id].included ? sectionSentence(section, exam) : "";
    if (sentence) {
      // Only join the previous paragraph when the section just before it was printed.
      if (section.sameParagraph && previousPrinted) blocks[blocks.length - 1] += "\n" + sentence;
      else blocks.push(sentence);
    }
    previousPrinted = !!sentence;
  }
  return blocks.join("\n\n");
}
