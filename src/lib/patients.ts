import { useSyncExternalStore } from "react";
import { vitalsLines, type Vitals } from "./exam/render";

// Patient sheets, kept ONLY in this device's local storage: never sent anywhere, never synced.
// They stay until the user deletes them.

export interface Patient {
  id: string;
  createdAt: number;
  updatedAt: number;
  lastName: string;
  firstName: string;
  // yyyy-mm-dd (from <input type="date">), empty if unknown.
  birthDate: string;
  // Typed by hand when the birth date is unknown.
  age: string;
  room: string;
  ward: string;
  reason: string;
  history: string;
  vitals: Vitals;
  glycemia: string;
  notes: string;
}

const STORAGE_KEY = "kipu:patients";
// Sheets older than this get a reminder to delete them.
export const OLD_AFTER_MS = 48 * 3600 * 1000;

const emptyVitals = (): Vitals => ({ temp: "", sys: "", dia: "", hr: "", sat: "", onO2: false, o2Flow: "", rr: "" });

function read(): Patient[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    const parsed = raw ? JSON.parse(raw) : [];
    if (!Array.isArray(parsed)) return [];
    return parsed
      .filter((p) => typeof p?.id === "string")
      .map((p) => ({ ...blank(p.id, p.createdAt ?? Date.now()), ...p, vitals: { ...emptyVitals(), ...p.vitals } }));
  } catch {
    return [];
  }
}

let cache: Patient[] = read();
const listeners = new Set<() => void>();
let saveFailed = false;

function commit(next: Patient[]) {
  cache = next;
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
    saveFailed = false;
  } catch {
    // Storage unavailable (private browsing, full): the sheet lives only until the page closes.
    saveFailed = true;
  }
  listeners.forEach((l) => l());
}

// Another tab changed the sheets.
if (typeof window !== "undefined") {
  window.addEventListener("storage", (e) => {
    if (e.key !== STORAGE_KEY) return;
    cache = read();
    listeners.forEach((l) => l());
  });
}

function subscribe(listener: () => void) {
  listeners.add(listener);
  return () => listeners.delete(listener);
}

export function usePatients() {
  return useSyncExternalStore(subscribe, () => cache);
}

export const storageFailed = () => saveFailed;

export const getPatient = (id: string) => cache.find((p) => p.id === id);

function blank(id: string, now: number): Patient {
  return {
    id,
    createdAt: now,
    updatedAt: now,
    lastName: "",
    firstName: "",
    birthDate: "",
    age: "",
    room: "",
    ward: "",
    reason: "",
    history: "",
    vitals: emptyVitals(),
    glycemia: "",
    notes: "",
  };
}

function newId() {
  try {
    return crypto.randomUUID();
  } catch {
    return `${Date.now().toString(36)}-${Math.random().toString(36).slice(2)}`;
  }
}

export function createPatient(): string {
  const patient = blank(newId(), Date.now());
  commit([patient, ...cache]);
  // Ask the browser not to clear Kipu's storage on its own (no-op where unsupported).
  navigator.storage?.persist?.().catch(() => {});
  return patient.id;
}

export function updatePatient(id: string, patch: Partial<Patient>) {
  commit(cache.map((p) => (p.id === id ? { ...p, ...patch, updatedAt: Date.now() } : p)));
}

export function deletePatient(id: string) {
  commit(cache.filter((p) => p.id !== id));
}

export function deleteAllPatients() {
  commit([]);
}

/** "82 ans", "14 mois", "3 semaines", from the birth date, or the age typed by hand. */
export function ageText(p: Patient, now = new Date()): string {
  if (!p.birthDate) {
    const typed = p.age.trim();
    return typed ? (/^\d+$/.test(typed) ? `${typed} ans` : typed) : "";
  }
  const birth = new Date(p.birthDate + "T00:00:00");
  if (Number.isNaN(birth.getTime()) || birth > now) return "";
  let months = (now.getFullYear() - birth.getFullYear()) * 12 + (now.getMonth() - birth.getMonth());
  if (now.getDate() < birth.getDate()) months--;
  if (months >= 24) return `${Math.floor(months / 12)} ans`;
  if (months >= 1) return `${months} mois`;
  const weeks = Math.floor((now.getTime() - birth.getTime()) / (7 * 24 * 3600 * 1000));
  return weeks >= 1 ? `${weeks} semaine${weeks > 1 ? "s" : ""}` : "nouveau-né";
}

export function formatDate(iso: string) {
  const [y, m, d] = iso.split("-");
  return y && m && d ? `${d}/${m}/${y}` : iso;
}

export function displayName(p: Patient) {
  const name = [p.lastName.trim().toUpperCase(), p.firstName.trim()].filter(Boolean).join(" ");
  return name || "Patient sans nom";
}

/** The sheet as plain text, for the clipboard. */
export function patientText(p: Patient): string {
  const lines: string[] = [];
  const age = ageText(p);
  let head = displayName(p);
  if (age) head += `, ${age}`;
  if (p.birthDate) head += ` (DDN ${formatDate(p.birthDate)})`;
  lines.push(head);
  const where = [p.room.trim() && `Chambre ${p.room.trim()}`, p.ward.trim()].filter(Boolean).join(", ");
  if (where) lines.push(where);
  if (p.reason.trim()) lines.push(`Motif de l'appel : ${p.reason.trim()}`);
  if (p.history.trim()) lines.push(`Antécédents : ${p.history.trim()}`);
  const vitals = vitalsLines(p.vitals);
  if (p.glycemia.trim()) vitals.push(`Glycémie capillaire : ${p.glycemia.trim().replace(".", ",")} g/L`);
  if (vitals.length) lines.push(`Constantes : ${vitals.join(", ")}`);
  if (p.notes.trim()) lines.push(`Notes : ${p.notes.trim()}`);
  return lines.join("\n");
}
