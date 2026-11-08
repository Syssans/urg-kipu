import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Header } from "../components/Header";
import { NumberText, VitalsCard } from "../components/VitalsCard";
import { copyText } from "../lib/clipboard";
import {
  ageText,
  deletePatient,
  displayName,
  expiryOf,
  formatBirthInput,
  getPatient,
  parseBirthDate,
  patientText,
  storageFailed,
  updatePatient,
  usePatients,
  type Patient,
} from "../lib/patients";

// Every change is saved at once on this device (see lib/patients.ts). A sheet left
// completely empty is removed when leaving it.

function isEmpty(p: Patient) {
  const { id: _id, createdAt: _c, updatedAt: _u, vitals, ...fields } = p;
  return Object.values(fields).every((v) => !String(v).trim()) && Object.entries(vitals).every(([k, v]) => k === "onO2" || !String(v).trim());
}

const pendingRemoval = new Map<string, number>();

function formatExpiry(ts: number) {
  const d = new Date(ts);
  const pad = (n: number) => String(n).padStart(2, "0");
  return `${pad(d.getDate())}/${pad(d.getMonth() + 1)} à ${pad(d.getHours())}h${pad(d.getMinutes())}`;
}

export function PatientPage() {
  const { id = "" } = useParams();
  const patients = usePatients();
  const patient = patients.find((p) => p.id === id);
  const navigate = useNavigate();
  const [copied, setCopied] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState(false);
  // Removing an empty sheet waits a tick, so a remount of the same page (React dev mode) cancels it.
  useEffect(() => {
    window.clearTimeout(pendingRemoval.get(id));
    return () => {
      pendingRemoval.set(
        id,
        window.setTimeout(() => {
          const current = getPatient(id);
          if (current && isEmpty(current)) deletePatient(id);
        }, 0),
      );
    };
  }, [id]);

  if (!patient) {
    return (
      <div>
        <Header title="Fiche introuvable" back />
        <p className="mx-auto max-w-xl px-4 py-6 text-muted">Cette fiche n'existe pas ou a été supprimée.</p>
      </div>
    );
  }

  const set = (patch: Partial<Patient>) => updatePatient(patient.id, patch);
  const age = ageText(patient);
  // A full date (6 or 8 digits) that does not parse is flagged; a partial one is just waiting.
  const birthDigits = patient.birthDate.replace(/\D/g, "").length;
  const birthState = (birthDigits === 6 || birthDigits === 8) && !parseBirthDate(patient.birthDate) ? "invalid" : "ok";

  const copy = async () => {
    if (!(await copyText(patientText(patient)))) return;
    setCopied(true);
    window.setTimeout(() => setCopied(false), 1800);
  };

  return (
    <div>
      <Header title={displayName(patient)} back />
      <form
        autoComplete="off"
        onSubmit={(e) => e.preventDefault()}
        className="page-in mx-auto flex max-w-xl flex-col gap-4 px-4 pb-28 pt-4"
      >
        <p className={`px-1 text-[12px] ${storageFailed() ? "text-red-300" : "text-muted"}`}>
          {storageFailed()
            ? "Enregistrement impossible sur cet appareil (navigation privée ?) : la fiche sera perdue en quittant."
            : `Chiffrée et enregistrée sur cet appareil uniquement. Suppression automatique le ${formatExpiry(expiryOf(patient))}.`}
        </p>

        <Card title="Patient">
          <div className="grid grid-cols-2 gap-3">
            <TextField label="Nom" value={patient.lastName} onChange={(lastName) => set({ lastName })} autoCapitalize="characters" />
            <TextField label="Prénom" value={patient.firstName} onChange={(firstName) => set({ firstName })} autoCapitalize="words" />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <label className="flex min-w-0 flex-col gap-1.5">
              <span className="text-xs font-medium text-slate-200">Date de naissance</span>
              <input
                type="text"
                inputMode="numeric"
                placeholder="JJ/MM/AAAA"
                maxLength={10}
                value={patient.birthDate}
                onChange={(e) => set({ birthDate: formatBirthInput(e.target.value) })}
                autoComplete="off"
                className={fieldClass}
              />
            </label>
            <label className="flex min-w-0 flex-col gap-1.5">
              <span className="text-xs font-medium text-slate-200">Âge</span>
              {patient.birthDate ? (
                <span className={`flex min-h-[2.75rem] items-center px-1 text-base ${birthState === "invalid" ? "text-red-300" : "text-white"}`}>
                  {birthState === "invalid" ? "Date invalide" : age || "…"}
                </span>
              ) : (
                <NumberText value={patient.age} onChange={(a) => set({ age: a })} ariaLabel="Âge (ans)" placeholder="ans" />
              )}
            </label>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <TextField label="Chambre" value={patient.room} onChange={(room) => set({ room })} />
            <TextField label="Service" value={patient.ward} onChange={(ward) => set({ ward })} />
          </div>
        </Card>

        <Card title="Motif de l'appel">
          <TextArea value={patient.reason} onChange={(reason) => set({ reason })} label="Motif de l'appel" placeholder="Ex. désaturation à 85 %, confusion…" />
        </Card>

        <Card title="Antécédents">
          <TextArea value={patient.history} onChange={(history) => set({ history })} label="Antécédents" placeholder="Antécédents, traitements, allergies…" />
        </Card>

        <VitalsCard vitals={patient.vitals} onChange={(patch) => set({ vitals: { ...patient.vitals, ...patch } })} />
        <label className="-mt-2 flex items-center gap-3 rounded-2xl border border-border bg-surface px-4 py-3 backdrop-blur-xl">
          <span className="flex-1 text-sm text-slate-200">
            Glycémie capillaire <span className="text-muted">g/L</span>
          </span>
          <span className="w-24">
            <NumberText value={patient.glycemia} onChange={(glycemia) => set({ glycemia })} ariaLabel="Glycémie capillaire (g/L)" />
          </span>
        </label>

        <Card title="Notes">
          <TextArea value={patient.notes} onChange={(notes) => set({ notes })} label="Notes" placeholder="Examen, conduite tenue, à recontrôler…" />
        </Card>

        <div className="flex flex-col gap-2.5">
          <button
            type="button"
            onClick={copy}
            className={`rounded-2xl border py-3.5 text-[15px] font-semibold transition-all duration-150 active:scale-[0.98] ${
              copied ? "border-emerald-400/50 bg-emerald-500/20 text-emerald-200" : "border-accent-2/50 bg-accent-2/15 text-white"
            }`}
          >
            {copied ? "Copié ✓" : "Copier la fiche"}
          </button>
          <button
            type="button"
            onClick={() => navigate("/examen", { state: { vitals: patient.vitals } })}
            className="rounded-2xl border border-border bg-surface py-3 text-sm text-slate-200 active:bg-surface-2"
          >
            Rédiger l'examen clinique avec ces constantes
          </button>
        </div>

        {confirmDelete ? (
          <div className="flex flex-col gap-2 rounded-xl border border-red-400/40 bg-red-500/10 p-3">
            <p className="text-sm text-red-100">Supprimer définitivement cette fiche ?</p>
            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => {
                  deletePatient(patient.id);
                  navigate("/patients", { replace: true });
                }}
                className="rounded-lg bg-red-500/80 px-3 py-2 text-sm font-semibold text-white active:scale-95"
              >
                Supprimer
              </button>
              <button type="button" onClick={() => setConfirmDelete(false)} className="rounded-lg px-3 py-2 text-sm text-slate-300">
                Annuler
              </button>
            </div>
          </div>
        ) : (
          <button type="button" onClick={() => setConfirmDelete(true)} className="self-start px-1 py-1.5 text-sm text-red-300 underline">
            Supprimer la fiche
          </button>
        )}
      </form>
    </div>
  );
}

const fieldClass =
  "w-full min-w-0 rounded-xl border border-border bg-surface px-3 py-2.5 text-base text-white outline-none backdrop-blur-xl transition-colors duration-150 placeholder:text-muted/60 focus:border-accent-2";

function Card({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="flex flex-col gap-3 rounded-2xl border border-border bg-surface p-4 backdrop-blur-xl">
      <h2 className="font-semibold text-white">{title}</h2>
      {children}
    </section>
  );
}

function TextField({
  label,
  value,
  onChange,
  autoCapitalize,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  autoCapitalize?: string;
}) {
  return (
    <label className="flex min-w-0 flex-col gap-1.5">
      <span className="text-xs font-medium text-slate-200">{label}</span>
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        autoComplete="off"
        autoCorrect="off"
        spellCheck={false}
        autoCapitalize={autoCapitalize}
        className={fieldClass}
      />
    </label>
  );
}

function TextArea({ value, onChange, label, placeholder }: { value: string; onChange: (v: string) => void; label: string; placeholder: string }) {
  return (
    <textarea
      value={value}
      onChange={(e) => onChange(e.target.value)}
      aria-label={label}
      placeholder={placeholder}
      rows={3}
      autoComplete="off"
      className={`${fieldClass} resize-y leading-snug`}
    />
  );
}
