import { useSyncExternalStore } from "react";
import { vitalsLines, type Vitals } from "./exam/render";
import { deriveKey, fromBase64, KDF_ITERATIONS, open, randomBytes, seal, toBase64, type Sealed } from "./vault";

// Patient sheets, kept ONLY on this device: never sent anywhere, never synced.
// They are encrypted with a key derived from the user's code (see vault.ts). The key only
// lives in memory while unlocked. Each sheet is deleted automatically a set time after its
// creation (72 h at most); this works while locked, as the creation time is stored in clear.

export interface Patient {
  id: string;
  createdAt: number;
  updatedAt: number;
  lastName: string;
  firstName: string;
  // As typed, "JJ/MM/AAAA" (or "JJ/MM/AA"), empty if unknown.
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

interface VaultItem extends Sealed {
  id: string;
  createdAt: number;
}

interface Vault {
  v: 1;
  salt: string;
  iterations: number;
  // Something known, sealed with the key: tells a wrong code from a right one.
  check: Sealed;
  retentionHours: number;
  items: VaultItem[];
}

export type VaultStatus = "none" | "locked" | "unlocked";

const VAULT_KEY = "kipu:vault";
// Sheets of the first versions, stored in clear: encrypted (then removed) when the code is set.
const LEGACY_KEY = "kipu:patients";
const CHECK_TEXT = "kipu";
export const RETENTION_CHOICES = [12, 24, 48, 72];
const DEFAULT_RETENTION = 24;
// Lock after this long in the background or without any touch.
const LOCK_AFTER_HIDDEN_MS = 2 * 60 * 1000;
const LOCK_AFTER_IDLE_MS = 10 * 60 * 1000;

const emptyVitals = (): Vitals => ({ temp: "", sys: "", dia: "", hr: "", sat: "", onO2: false, o2Flow: "", rr: "" });

function normalize(p: Partial<Patient> & { id: string }): Patient {
  return {
    ...blank(p.id, p.createdAt ?? Date.now()),
    ...p,
    // Sheets from the first version stored the birth date as yyyy-mm-dd.
    birthDate: typeof p.birthDate === "string" ? p.birthDate.replace(/^(\d{4})-(\d{2})-(\d{2})$/, "$3/$2/$1") : "",
    vitals: { ...emptyVitals(), ...p.vitals },
  };
}

function readVault(): Vault | null {
  try {
    const raw = localStorage.getItem(VAULT_KEY);
    const v = raw ? JSON.parse(raw) : null;
    return v && v.v === 1 && Array.isArray(v.items) ? (v as Vault) : null;
  } catch {
    return null;
  }
}

function readLegacy(): Patient[] {
  try {
    const raw = localStorage.getItem(LEGACY_KEY);
    const parsed = raw ? JSON.parse(raw) : [];
    return Array.isArray(parsed) ? parsed.filter((p) => typeof p?.id === "string").map(normalize) : [];
  } catch {
    return [];
  }
}

let vault: Vault | null = readVault();
let key: Uint8Array | null = null;
let patients: Patient[] = [];
let saveFailed = false;

interface Snapshot {
  status: VaultStatus;
  patients: Patient[];
  retentionHours: number;
  legacyCount: number;
}
let snapshot: Snapshot = makeSnapshot();
const listeners = new Set<() => void>();

function makeSnapshot(): Snapshot {
  return {
    status: !vault ? "none" : key ? "unlocked" : "locked",
    patients,
    retentionHours: vault?.retentionHours ?? DEFAULT_RETENTION,
    legacyCount: vault ? 0 : readLegacy().length,
  };
}

function emit() {
  snapshot = makeSnapshot();
  listeners.forEach((l) => l());
}

function writeVault() {
  if (!vault) return;
  try {
    localStorage.setItem(VAULT_KEY, JSON.stringify(vault));
    saveFailed = false;
  } catch {
    // Storage unavailable (private browsing, full): the sheets live only until the page closes.
    saveFailed = true;
  }
}

const expiresAt = (createdAt: number) => createdAt + (vault?.retentionHours ?? DEFAULT_RETENTION) * 3600 * 1000;

/** Deletes the sheets past their time. Needs no key. */
function purge() {
  const now = Date.now();
  if (vault) {
    const kept = vault.items.filter((i) => expiresAt(i.createdAt) > now);
    if (kept.length !== vault.items.length) {
      vault = { ...vault, items: kept };
      writeVault();
    }
  }
  const keptPatients = patients.filter((p) => expiresAt(p.createdAt) > now);
  if (keptPatients.length !== patients.length) patients = keptPatients;
  emit();
}

/** Encrypts and saves the open sheets. */
function commit(next: Patient[]) {
  patients = next;
  if (vault && key) {
    const k = key;
    vault = { ...vault, items: next.map((p) => ({ id: p.id, createdAt: p.createdAt, ...seal(k, JSON.stringify(p)) })) };
    writeVault();
  }
  emit();
}

function subscribe(listener: () => void) {
  listeners.add(listener);
  return () => listeners.delete(listener);
}

export function usePatientStore() {
  return useSyncExternalStore(subscribe, () => snapshot);
}

export function usePatients() {
  return usePatientStore().patients;
}

export const storageFailed = () => saveFailed;
export const getPatient = (id: string) => patients.find((p) => p.id === id);
export const expiryOf = (p: Patient) => expiresAt(p.createdAt);

// ---- code, lock, unlock ----

const MIN_DIGITS = 4;

/** Checks a new code and its confirmation; returns an error message or null. */
export function newCodeError(code: string, confirm: string) {
  if (code.length < MIN_DIGITS) return `Le code doit faire au moins ${MIN_DIGITS} chiffres (6 conseillés).`;
  if (code !== confirm) return "Les deux codes ne correspondent pas.";
  return null;
}


/** First use: sets the code, and encrypts the sheets left by earlier versions. */
export async function setupCode(code: string) {
  const salt = randomBytes(16);
  const k = await deriveKey(code, salt, KDF_ITERATIONS);
  vault = { v: 1, salt: toBase64(salt), iterations: KDF_ITERATIONS, check: seal(k, CHECK_TEXT), retentionHours: DEFAULT_RETENTION, items: [] };
  key = k;
  commit(readLegacy());
  try {
    localStorage.removeItem(LEGACY_KEY);
  } catch {
    // nothing to remove
  }
  purge();
  navigator.storage?.persist?.().catch(() => {});
  touch();
}

/** Returns false for a wrong code. */
export async function unlock(code: string): Promise<boolean> {
  if (!vault) return false;
  const k = await deriveKey(code, fromBase64(vault.salt), vault.iterations);
  try {
    if (open(k, vault.check) !== CHECK_TEXT) return false;
  } catch {
    return false;
  }
  key = k;
  patients = vault.items.flatMap((item) => {
    try {
      // The creation time in clear is the one the automatic deletion goes by.
      return [normalize({ ...JSON.parse(open(k, item)), createdAt: item.createdAt })];
    } catch {
      return [];
    }
  });
  purge();
  touch();
  return true;
}

export function lock() {
  if (!key) return;
  key = null;
  patients = [];
  emit();
}

export async function changeCode(code: string) {
  if (!vault || !key) return;
  const salt = randomBytes(16);
  const k = await deriveKey(code, salt, KDF_ITERATIONS);
  vault = { ...vault, salt: toBase64(salt), iterations: KDF_ITERATIONS, check: seal(k, CHECK_TEXT) };
  key = k;
  commit(patients);
}

/** Forgotten code: erases the code and every sheet. */
export function resetVault() {
  try {
    localStorage.removeItem(VAULT_KEY);
    localStorage.removeItem(LEGACY_KEY);
  } catch {
    // nothing to remove
  }
  vault = null;
  key = null;
  patients = [];
  emit();
}

export function setRetention(hours: number) {
  if (!vault || !RETENTION_CHOICES.includes(hours)) return;
  vault = { ...vault, retentionHours: hours };
  writeVault();
  purge();
}

// ---- automatic deletion and locking ----

let lastActivity = Date.now();
let hiddenSince: number | null = null;
function touch() {
  lastActivity = Date.now();
}

if (typeof window !== "undefined") {
  purge();
  window.addEventListener("pointerdown", touch, { passive: true });
  window.addEventListener("keydown", touch);
  document.addEventListener("visibilitychange", () => {
    if (document.hidden) {
      hiddenSince = Date.now();
      return;
    }
    if (hiddenSince !== null && Date.now() - hiddenSince > LOCK_AFTER_HIDDEN_MS) lock();
    hiddenSince = null;
    purge();
  });
  window.setInterval(() => {
    if (key && Date.now() - lastActivity > LOCK_AFTER_IDLE_MS) lock();
    purge();
  }, 30_000);
  // Another tab changed the sheets: start again from what is stored.
  window.addEventListener("storage", (e) => {
    if (e.key !== VAULT_KEY && e.key !== LEGACY_KEY) return;
    vault = readVault();
    key = null;
    patients = [];
    emit();
  });
}

// ---- sheets ----

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
  commit([patient, ...patients]);
  return patient.id;
}

export function updatePatient(id: string, patch: Partial<Patient>) {
  commit(patients.map((p) => (p.id === id ? { ...p, ...patch, updatedAt: Date.now() } : p)));
}

export function deletePatient(id: string) {
  commit(patients.filter((p) => p.id !== id));
}

/** Puts back a deleted sheet (undo). Does nothing once locked or past its time. */
export function restorePatient(patient: Patient) {
  if (!key || expiresAt(patient.createdAt) <= Date.now()) return;
  commit([patient, ...patients.filter((p) => p.id !== patient.id)]);
}

export function deleteAllPatients() {
  commit([]);
}

/** Formats what is typed as JJ/MM/AAAA: keeps the digits and adds the slashes. */
export function formatBirthInput(raw: string) {
  const d = raw.replace(/\D/g, "").slice(0, 8);
  return [d.slice(0, 2), d.slice(2, 4), d.slice(4)].filter(Boolean).join("/");
}

/** The birth date as a Date, or null while incomplete or invalid. A 2-digit year is taken in the past century when needed. */
export function parseBirthDate(text: string, now = new Date()): Date | null {
  const m = /^(\d{2})\/(\d{2})\/(\d{2}|\d{4})$/.exec(text.trim());
  if (!m) return null;
  const day = Number(m[1]);
  const month = Number(m[2]);
  let year = Number(m[3]);
  if (m[3].length === 2) {
    const century = Math.floor(now.getFullYear() / 100) * 100;
    year = century + year > now.getFullYear() ? century - 100 + year : century + year;
  }
  const date = new Date(year, month - 1, day);
  if (date.getFullYear() !== year || date.getMonth() !== month - 1 || date.getDate() !== day) return null;
  if (date > now || year < now.getFullYear() - 130) return null;
  return date;
}

/** "82 ans", "14 mois", "3 semaines", from the birth date, or the age typed by hand. */
export function ageText(p: Patient, now = new Date()): string {
  if (!p.birthDate.trim()) {
    const typed = p.age.trim();
    return typed ? (/^\d+$/.test(typed) ? `${typed} ans` : typed) : "";
  }
  const birth = parseBirthDate(p.birthDate, now);
  if (!birth) return "";
  let months = (now.getFullYear() - birth.getFullYear()) * 12 + (now.getMonth() - birth.getMonth());
  if (now.getDate() < birth.getDate()) months--;
  if (months >= 24) return `${Math.floor(months / 12)} ans`;
  if (months >= 1) return `${months} mois`;
  const weeks = Math.floor((now.getTime() - birth.getTime()) / (7 * 24 * 3600 * 1000));
  return weeks >= 1 ? `${weeks} semaine${weeks > 1 ? "s" : ""}` : "nouveau-né";
}

function formatDate(date: Date) {
  const pad = (n: number) => String(n).padStart(2, "0");
  return `${pad(date.getDate())}/${pad(date.getMonth() + 1)}/${date.getFullYear()}`;
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
  const birth = parseBirthDate(p.birthDate);
  if (birth) head += ` (DDN ${formatDate(birth)})`;
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
