// Transfer code: the exam packed into a short string of letters and digits, to be typed by hand
// on another device. Nothing goes over the network. It is an encoding, not encryption: anyone with
// Kipu can read it back. It never holds identity data (the exam has none).
//
// Free text (precisions, "autre constatation") is left out: typing it again is shorter than
// typing its code.
//
// Layout (bits): checksum(10) | vitals | sections | zero padding, in Crockford base32 (5 bits per
// character, case-insensitive, no I/L/O/U). The checksum also covers a fingerprint of the
// template, so a code made with another version of Kipu is refused instead of read back wrong.
//
// Each section starts with 2 bits: 0 = as "Tout normal" leaves it, 1 = nothing ticked,
// 2 = detailed: then 1 bit per finding (same as "Tout normal" or not), and 1 more bit for the
// other state when it differs.

import { GLASGOW_FINDING_ID, sections, type ExamSection, type Finding } from "./template";
import { initialExam, type ExamState, type FindingState, type Mark, type Vitals } from "./render";

const ALPHABET = "0123456789ABCDEFGHJKMNPQRSTVWXYZ";
const CHECK_BITS = 10;
const FORMAT_VERSION = 2;

// Numeric vitals, stored as (value × scale − offset) on a fixed number of bits.
const NUMBERS: { key: keyof Vitals; label: string; scale: number; offset: number; bits: number }[] = [
  { key: "temp", label: "Température", scale: 10, offset: 250, bits: 8 }, // 25,0 – 50,5 °C
  { key: "sys", label: "TA systolique", scale: 1, offset: 30, bits: 8 }, // 30 – 285
  { key: "dia", label: "TA diastolique", scale: 1, offset: 10, bits: 7 }, // 10 – 137
  { key: "hr", label: "FC", scale: 1, offset: 0, bits: 8 }, // 0 – 255
  { key: "sat", label: "Saturation", scale: 1, offset: 0, bits: 7 }, // 0 – 127
  { key: "o2Flow", label: "Débit d'O2", scale: 2, offset: 0, bits: 7 }, // 0 – 63,5 L/min, par 0,5
  { key: "rr", label: "FR", scale: 1, offset: 0, bits: 6 }, // 0 – 63
];

export class CodeError extends Error {}

class BitWriter {
  bits: number[] = [];
  write(value: number, width: number) {
    for (let i = width - 1; i >= 0; i--) this.bits.push((value >> i) & 1);
  }
  flag(on: boolean) {
    this.bits.push(on ? 1 : 0);
    return on;
  }
}

class BitReader {
  pos = 0;
  private bits: number[];
  constructor(bits: number[]) {
    this.bits = bits;
  }
  read(width: number) {
    if (this.pos + width > this.bits.length) throw new CodeError(WRONG_CODE);
    let v = 0;
    for (let i = 0; i < width; i++) v = (v << 1) | this.bits[this.pos++];
    return v;
  }
  flag() {
    return this.read(1) === 1;
  }
}

const WRONG_CODE =
  "Code incorrect : vérifiez qu'il a été recopié sans erreur. S'il est juste, les deux appareils n'ont peut-être pas la même version de Kipu : rechargez la page sur chacun, puis recréez le code.";

const widthFor = (count: number) => Math.max(1, Math.ceil(Math.log2(count)));

function fnv1a(bytes: Iterable<number>, seed = 0x811c9dc5) {
  let h = seed;
  for (const b of bytes) {
    h ^= b;
    h = Math.imul(h, 0x01000193) >>> 0;
  }
  return h;
}

// Changes whenever the template's findings or options change.
const fingerprint = fnv1a(
  new TextEncoder().encode(
    JSON.stringify([
      FORMAT_VERSION,
      sections.map((s) => [s.id, s.findings.map((f) => [f.id, !!f.optional, (f.choices ?? []).map((c) => [c.id, !!c.multi, c.options])])]),
    ]),
  ),
);

function checksum(bits: number[]) {
  const bytes: number[] = [];
  for (let i = 0; i < bits.length; i += 8) {
    let b = 0;
    for (let j = 0; j < 8; j++) b = (b << 1) | (bits[i + j] ?? 0);
    bytes.push(b);
  }
  return fnv1a(bytes, fingerprint) & ((1 << CHECK_BITS) - 1);
}

// What "Tout normal" gives: usual findings normal, optional ones unticked.
const baseline = (f: Finding): Mark => (f.optional ? "off" : "normal");

function sectionKind(section: ExamSection, exam: ExamState): 0 | 1 | 2 {
  const marks = section.findings.map((f) => exam.sections[section.id].findings[f.id].mark);
  if (section.findings.every((f, i) => marks[i] === baseline(f))) return 0;
  if (marks.every((m) => m === "off")) return 1;
  return 2;
}

// The two states a finding can be in besides its baseline, in a fixed order.
const otherMarks = (f: Finding): [Mark, Mark] => (baseline(f) === "normal" ? ["off", "abnormal"] : ["normal", "abnormal"]);

function vitalValue(raw: string, scale: number): number | undefined | "bad" {
  const t = raw.trim().replace(",", ".");
  if (!t) return undefined;
  const x = Number(t) * scale;
  if (!Number.isFinite(x) || Math.abs(x - Math.round(x)) > 1e-6) return "bad";
  return Math.round(x);
}

/** Packs the exam into a code. Throws CodeError when a value cannot be carried. */
export function encodeExam(exam: ExamState): string {
  const w = new BitWriter();

  for (const { key, label, scale, offset, bits } of NUMBERS) {
    const n = vitalValue(exam.vitals[key] as string, scale);
    if (!w.flag(n !== undefined)) continue;
    const stored = n === "bad" ? -1 : n! - offset;
    if (stored < 0 || stored >= 1 << bits) throw new CodeError(`${label} : valeur « ${exam.vitals[key]} » non prise en charge par le code.`);
    w.write(stored, bits);
  }
  w.flag(exam.vitals.onO2);

  for (const section of sections) {
    const kind = sectionKind(section, exam);
    w.write(kind, 2);
    if (kind !== 2) continue;
    for (const finding of section.findings) {
      const f = exam.sections[section.id].findings[finding.id];
      if (!w.flag(f.mark !== baseline(finding))) continue;
      w.flag(otherMarks(finding)[1] === f.mark);
      if (f.mark !== "abnormal") continue;
      if (finding.id === GLASGOW_FINDING_ID) {
        w.write(exam.glasgow.y - 1, 2);
        w.write(exam.glasgow.v - 1, 3);
        w.write(exam.glasgow.m - 1, 3);
        continue;
      }
      for (const choice of finding.choices ?? []) {
        const picked = f.picks[choice.id] ?? [];
        if (!w.flag(picked.length > 0)) continue;
        if (choice.multi) for (const option of choice.options) w.flag(picked.includes(option));
        else w.write(choice.options.indexOf(picked[0]), widthFor(choice.options.length));
      }
    }
  }

  const body = w.bits;
  while ((body.length + CHECK_BITS) % 5 !== 0) body.push(0);
  const head = new BitWriter();
  head.write(checksum(body), CHECK_BITS);
  const all = [...head.bits, ...body];
  let code = "";
  for (let i = 0; i < all.length; i += 5) code += ALPHABET[parseInt(all.slice(i, i + 5).join(""), 2)];
  return code;
}

/** Free text the code leaves out, to retype on the other device. */
export function leftOutText(exam: ExamState): string[] {
  const out: string[] = [];
  for (const section of sections) {
    const s = exam.sections[section.id];
    for (const finding of section.findings) {
      const f = s.findings[finding.id];
      if (f.mark === "abnormal" && f.note.trim()) out.push(`${finding.label} : ${f.note.trim()}`);
    }
    if (s.extra.trim()) out.push(`${section.title} (autre) : ${s.extra.trim()}`);
  }
  return out;
}

/** Code as shown on screen: groups of 4 characters. */
export function formatCode(code: string) {
  return code.match(/.{1,4}/g)?.join(" ") ?? "";
}

// Tolerates spaces, dashes, lower case and the usual look-alikes (O→0, I/L→1, U→V).
function normalize(input: string) {
  return input
    .toUpperCase()
    .replace(/[\s-]/g, "")
    .replace(/O/g, "0")
    .replace(/[IL]/g, "1")
    .replace(/U/g, "V");
}

/** Rebuilds the exam from a code. Throws CodeError with a message for the user. */
export function decodeExam(input: string): ExamState {
  const code = normalize(input);
  if (!code) throw new CodeError("Saisissez un code.");
  const bits: number[] = [];
  for (const ch of code) {
    const v = ALPHABET.indexOf(ch);
    if (v < 0) throw new CodeError(`Caractère « ${ch} » invalide dans le code.`);
    for (let i = 4; i >= 0; i--) bits.push((v >> i) & 1);
  }
  if (bits.length <= CHECK_BITS) throw new CodeError(WRONG_CODE);
  const body = bits.slice(CHECK_BITS);
  if (checksum(body) !== parseInt(bits.slice(0, CHECK_BITS).join(""), 2)) throw new CodeError(WRONG_CODE);

  const r = new BitReader(body);
  const exam = initialExam();
  for (const { key, scale, offset, bits: width } of NUMBERS) {
    if (r.flag()) (exam.vitals[key] as string) = String((r.read(width) + offset) / scale).replace(".", ",");
  }
  exam.vitals.onO2 = r.flag();

  for (const section of sections) {
    const kind = r.read(2);
    if (kind === 3) throw new CodeError(WRONG_CODE);
    const findings = exam.sections[section.id].findings;
    for (const finding of section.findings) {
      let mark: Mark = kind === 1 ? "off" : baseline(finding);
      if (kind === 2 && r.flag()) mark = otherMarks(finding)[r.flag() ? 1 : 0];
      const f: FindingState = { mark, picks: {}, note: "" };
      findings[finding.id] = f;
      if (mark !== "abnormal") continue;
      if (finding.id === GLASGOW_FINDING_ID) {
        exam.glasgow = { y: r.read(2) + 1, v: r.read(3) + 1, m: r.read(3) + 1 };
        continue;
      }
      for (const choice of finding.choices ?? []) {
        if (!r.flag()) continue;
        if (choice.multi) {
          f.picks[choice.id] = choice.options.filter(() => r.flag());
        } else {
          const option = choice.options[r.read(widthFor(choice.options.length))];
          if (option === undefined) throw new CodeError(WRONG_CODE);
          f.picks[choice.id] = [option];
        }
      }
    }
  }
  return exam;
}
