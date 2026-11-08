import { useEffect, useRef, useState, type ReactNode } from "react";
import { Header } from "./Header";
import { enableBiometric, newCodeError, resetVault, setupCode, unlock, unlockWithBiometric, usePatientStore } from "../lib/patients";
import { useBiometricInfo } from "../lib/biometric";

// Stands in front of the patient sheets: asks to create a code the first time, then the
// code to unlock them.

export function PatientsGate({ children }: { children: ReactNode }) {
  const { status, legacyCount } = usePatientStore();
  if (status === "unlocked") return <>{children}</>;
  return (
    <div>
      <Header title="Fiches patients" />
      <div className="page-in mx-auto flex max-w-sm flex-col gap-4 px-4 pb-28 pt-6">
        {status === "none" ? <SetupCode legacyCount={legacyCount} /> : <Unlock />}
      </div>
    </div>
  );
}

const MAX_DIGITS = 8;

export function CodeInput({
  value,
  onChange,
  label,
  autoFocus,
  onEnter,
}: {
  value: string;
  onChange: (v: string) => void;
  label: string;
  autoFocus?: boolean;
  onEnter?: () => void;
}) {
  return (
    <input
      type="password"
      inputMode="numeric"
      autoComplete="off"
      aria-label={label}
      placeholder={label}
      autoFocus={autoFocus}
      maxLength={MAX_DIGITS}
      value={value}
      onChange={(e) => onChange(e.target.value.replace(/\D/g, "").slice(0, MAX_DIGITS))}
      onKeyDown={(e) => {
        if (e.key === "Enter" && onEnter) {
          e.preventDefault();
          onEnter();
        }
      }}
      className="w-full rounded-xl border border-border bg-surface px-4 py-3 text-center text-2xl tracking-[0.4em] text-white outline-none backdrop-blur-xl placeholder:text-sm placeholder:tracking-normal placeholder:text-muted focus:border-accent-2"
    />
  );
}

function SetupCode({ legacyCount }: { legacyCount: number }) {
  const [code, setCode] = useState("");
  const [confirm, setConfirm] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);
  const bio = useBiometricInfo();
  const [useBio, setUseBio] = useState(true);

  const submit = async () => {
    const problem = newCodeError(code, confirm);
    if (problem) return setError(problem);
    setBusy(true);
    await setupCode(code);
    if (bio.available && useBio) await enableBiometric();
  };

  return (
    <>
      <LockIcon />
      <h2 className="text-center text-lg font-semibold text-white">Protéger les fiches par un code</h2>
      <p className="text-center text-[13px] leading-snug text-muted">
        Les fiches sont chiffrées avec ce code et restent uniquement sur cet appareil. Elles se verrouillent après
        quelques minutes d'inactivité et sont supprimées automatiquement (24 h par défaut, 72 h au plus).
        {legacyCount > 0 && ` Vos ${legacyCount} fiche${legacyCount > 1 ? "s" : ""} existante${legacyCount > 1 ? "s" : ""} seront chiffrées.`}
      </p>
      <CodeInput value={code} onChange={setCode} label="Nouveau code" autoFocus />
      <CodeInput value={confirm} onChange={setConfirm} label="Confirmer le code" onEnter={submit} />
      {bio.available && (
        <label className="flex items-center gap-3 rounded-xl border border-border bg-surface px-4 py-3 text-sm text-slate-200">
          <input type="checkbox" checked={useBio} onChange={(e) => setUseBio(e.target.checked)} className="h-5 w-5 accent-[#a78bfa]" />
          Déverrouiller aussi avec {bio.label}
        </label>
      )}
      {error && <p className="text-center text-sm text-red-300">{error}</p>}
      <button
        type="button"
        onClick={submit}
        disabled={busy}
        className="rounded-2xl border border-accent-2/50 bg-accent-2/15 py-3.5 text-[15px] font-semibold text-white active:scale-[0.98] disabled:opacity-60"
      >
        {busy ? "Chiffrement…" : "Créer le code"}
      </button>
      <p className="text-center text-[12px] leading-snug text-muted">
        Code oublié = fiches perdues : personne ne peut les déchiffrer sans lui.
      </p>
    </>
  );
}

function Unlock() {
  const [code, setCode] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);
  const [failures, setFailures] = useState(0);
  const [blockedUntil, setBlockedUntil] = useState(0);
  const [confirmReset, setConfirmReset] = useState(false);
  const { biometric } = usePatientStore();
  const bio = useBiometricInfo();
  const canBio = biometric && bio.available;

  const tryBiometric = async () => {
    setError(null);
    const result = await unlockWithBiometric();
    if (result === "invalid")
      setError(`${bio.label} a été désactivé (visage ou empreinte modifiés sur l'iPhone). Entrez votre code, puis réactivez-le dans Sécurité.`);
    else if (result === "failed") setError(`${bio.label} n'a pas abouti : entrez votre code.`);
  };

  // Offer Face ID once, as soon as the lock screen shows.
  const offered = useRef(false);
  useEffect(() => {
    if (!canBio || offered.current) return;
    offered.current = true;
    void tryBiometric();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [canBio]);

  const submit = async () => {
    if (busy || !code) return;
    const now = Date.now();
    if (now < blockedUntil) return setError(`Trop d'essais : réessayez dans ${Math.ceil((blockedUntil - now) / 1000)} s.`);
    setBusy(true);
    const ok = await unlock(code);
    setBusy(false);
    if (ok) return;
    const n = failures + 1;
    setFailures(n);
    setCode("");
    // From the 5th wrong code, each new try waits longer.
    if (n >= 5) setBlockedUntil(Date.now() + Math.min(300, 15 * 2 ** (n - 5)) * 1000);
    setError(n >= 5 ? "Code incorrect. Patientez avant de réessayer." : "Code incorrect.");
  };

  return (
    <>
      <LockIcon />
      <h2 className="text-center text-lg font-semibold text-white">Fiches verrouillées</h2>
      <CodeInput value={code} onChange={setCode} label="Code" autoFocus onEnter={submit} />
      {error && <p className="text-center text-sm text-red-300">{error}</p>}
      <button
        type="button"
        onClick={submit}
        disabled={busy}
        className="rounded-2xl border border-accent-2/50 bg-accent-2/15 py-3.5 text-[15px] font-semibold text-white active:scale-[0.98] disabled:opacity-60"
      >
        {busy ? "Vérification…" : "Déverrouiller"}
      </button>
      {canBio && (
        <button
          type="button"
          onClick={tryBiometric}
          className="flex items-center justify-center gap-2 rounded-2xl border border-border py-3 text-sm text-slate-200 active:bg-surface-2"
        >
          <FaceIdIcon />
          Utiliser {bio.label}
        </button>
      )}
      {confirmReset ? (
        <div className="flex flex-col gap-2 rounded-xl border border-red-400/40 bg-red-500/10 p-3">
          <p className="text-sm text-red-100">Sans le code, les fiches ne peuvent pas être récupérées. Tout effacer et créer un nouveau code ?</p>
          <div className="flex gap-2">
            <button type="button" onClick={resetVault} className="rounded-lg bg-red-500/80 px-3 py-2 text-sm font-semibold text-white active:scale-95">
              Tout effacer
            </button>
            <button type="button" onClick={() => setConfirmReset(false)} className="rounded-lg px-3 py-2 text-sm text-slate-300">
              Annuler
            </button>
          </div>
        </div>
      ) : (
        <button type="button" onClick={() => setConfirmReset(true)} className="self-center px-1 py-1.5 text-sm text-muted underline">
          Code oublié ?
        </button>
      )}
    </>
  );
}

function LockIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" className="mx-auto h-10 w-10 text-accent-2">
      <rect x="5" y="10.5" width="14" height="9.5" rx="2" stroke="currentColor" strokeWidth={1.8} />
      <path d="M8 10.5V8a4 4 0 0 1 8 0v2.5" stroke="currentColor" strokeWidth={1.8} strokeLinecap="round" />
    </svg>
  );
}

function FaceIdIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" className="h-5 w-5">
      <path
        d="M4 8V6a2 2 0 0 1 2-2h2M16 4h2a2 2 0 0 1 2 2v2M20 16v2a2 2 0 0 1-2 2h-2M8 20H6a2 2 0 0 1-2-2v-2M9 9.5v1M15 9.5v1M12 9.5v3.5h-1M9.5 15.5c1.5 1.2 3.5 1.2 5 0"
        stroke="currentColor"
        strokeWidth={1.8}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
