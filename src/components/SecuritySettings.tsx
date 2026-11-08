import { useState } from "react";
import { changeCode, newCodeError, RETENTION_CHOICES, setRetention, usePatientStore } from "../lib/patients";
import { CodeInput } from "./PatientsGate";

export function SecuritySettings() {
  const { retentionHours, patients } = usePatientStore();
  const [changing, setChanging] = useState(false);
  const [code, setCode] = useState("");
  const [confirm, setConfirm] = useState("");
  const [message, setMessage] = useState<{ ok: boolean; text: string } | null>(null);
  const [busy, setBusy] = useState(false);

  const submit = async () => {
    const problem = newCodeError(code, confirm);
    if (problem) return setMessage({ ok: false, text: problem });
    setBusy(true);
    await changeCode(code);
    setBusy(false);
    setChanging(false);
    setCode("");
    setConfirm("");
    setMessage({ ok: true, text: "Code modifié." });
  };

  return (
    <section className="flex flex-col gap-3 rounded-2xl border border-border bg-surface p-4 backdrop-blur-xl">
      <h2 className="font-semibold text-white">Sécurité</h2>
      <div className="flex flex-col gap-1.5">
        <span className="text-xs font-medium text-slate-200">Suppression automatique après la création</span>
        <div className="grid grid-cols-4 gap-1.5">
          {RETENTION_CHOICES.map((h) => {
            const active = h === retentionHours;
            return (
              <button
                key={h}
                type="button"
                aria-pressed={active}
                onClick={() => setRetention(h)}
                className={`rounded-lg border py-2 text-sm transition-colors duration-150 ${
                  active ? "border-accent-2/60 bg-accent-2/15 text-white" : "border-border text-slate-300 active:bg-surface-2"
                }`}
              >
                {h} h
              </button>
            );
          })}
        </div>
        <p className="text-[12px] leading-snug text-muted">
          S'applique aussi aux fiches existantes{patients.length > 0 ? " : un délai plus court supprime aussitôt celles qui le dépassent" : ""}. Une
          fiche dont le délai expire pendant que le téléphone est en veille est supprimée à la prochaine ouverture de Kipu.
        </p>
      </div>

      {changing ? (
        <div className="flex flex-col gap-2">
          <CodeInput value={code} onChange={setCode} label="Nouveau code" autoFocus />
          <CodeInput value={confirm} onChange={setConfirm} label="Confirmer le code" onEnter={submit} />
          <div className="flex gap-2">
            <button
              type="button"
              onClick={submit}
              disabled={busy}
              className="rounded-lg border border-accent-2/50 bg-accent-2/15 px-3 py-2 text-sm font-semibold text-white disabled:opacity-60"
            >
              {busy ? "Chiffrement…" : "Enregistrer"}
            </button>
            <button
              type="button"
              onClick={() => {
                setChanging(false);
                setMessage(null);
              }}
              className="rounded-lg px-3 py-2 text-sm text-slate-300"
            >
              Annuler
            </button>
          </div>
        </div>
      ) : (
        <button
          type="button"
          onClick={() => {
            setChanging(true);
            setMessage(null);
          }}
          className="self-start rounded-lg border border-border px-3 py-1.5 text-sm text-slate-200 active:bg-surface-2"
        >
          Changer le code
        </button>
      )}
      {message && <p className={`text-sm ${message.ok ? "text-emerald-300" : "text-red-300"}`}>{message.text}</p>}
    </section>
  );
}
