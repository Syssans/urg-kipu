import { useEffect, useRef, useState, type ReactNode } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Header } from "../components/Header";
import {
  ageText,
  createPatient,
  deleteAllPatients,
  deletePatient,
  displayName,
  expiryOf,
  lock,
  restorePatient,
  usePatientStore,
  type Patient,
} from "../lib/patients";
import { SecuritySettings } from "../components/SecuritySettings";

export function PatientsList() {
  const { patients, retentionHours } = usePatientStore();
  const navigate = useNavigate();
  const [confirmAll, setConfirmAll] = useState(false);
  const [now, setNow] = useState(() => Date.now());
  // Keeps the "deleted in …" times current.
  useEffect(() => {
    const timer = window.setInterval(() => setNow(Date.now()), 60_000);
    return () => window.clearInterval(timer);
  }, []);
  // Last sheet deleted by a swipe, kept a few seconds so it can be put back.
  const [undo, setUndo] = useState<Patient | null>(null);
  const undoTimer = useRef<number | undefined>(undefined);
  useEffect(() => () => window.clearTimeout(undoTimer.current), []);

  const swipeDelete = (patient: Patient) => {
    deletePatient(patient.id);
    setUndo(patient);
    window.clearTimeout(undoTimer.current);
    undoTimer.current = window.setTimeout(() => setUndo(null), 6000);
  };
  const sorted = [...patients].sort((a, b) => b.updatedAt - a.updatedAt);

  return (
    <div>
      <Header title="Fiches patients" />
      <div className="page-in mx-auto flex max-w-xl flex-col gap-4 px-4 pb-28 pt-4">
        <div className="flex flex-col gap-2 rounded-xl border border-border bg-surface px-4 py-3 backdrop-blur-xl">
          <p className="text-[13px] leading-snug text-muted">
            Fiches <span className="text-slate-200">chiffrées et conservées uniquement sur cet appareil</span>, supprimées
            automatiquement {retentionHours} h après leur création. À utiliser sur votre téléphone personnel uniquement.
          </p>
          <button
            type="button"
            onClick={lock}
            className="flex items-center gap-1.5 self-start rounded-lg border border-border px-3 py-1.5 text-xs text-slate-200 active:bg-surface-2"
          >
            <svg viewBox="0 0 24 24" fill="none" className="h-3.5 w-3.5">
              <rect x="5" y="10.5" width="14" height="9.5" rx="2" stroke="currentColor" strokeWidth={2} />
              <path d="M8 10.5V8a4 4 0 0 1 8 0v2.5" stroke="currentColor" strokeWidth={2} strokeLinecap="round" />
            </svg>
            Verrouiller
          </button>
        </div>

        <button
          type="button"
          onClick={() => navigate(`/patients/${createPatient()}`)}
          className="flex items-center justify-center gap-2 rounded-2xl border border-accent-2/50 bg-accent-2/15 py-3.5 text-[15px] font-semibold text-white transition-transform duration-150 active:scale-[0.98]"
        >
          <svg viewBox="0 0 24 24" fill="none" className="h-5 w-5">
            <path d="M12 5v14M5 12h14" stroke="currentColor" strokeWidth={2} strokeLinecap="round" />
          </svg>
          Nouvelle fiche
        </button>

        {sorted.length === 0 ? (
          <p className="rounded-xl border border-dashed border-border p-4 text-sm text-muted">Aucune fiche pour l'instant.</p>
        ) : (
          <div className="flex flex-col gap-2.5">
            <p className="px-1 text-[12px] text-muted">Glissez une fiche vers la gauche pour la supprimer.</p>
            {sorted.map((p) => {
              const age = ageText(p);
              const where = [p.room.trim() && `Ch. ${p.room.trim()}`, p.ward.trim()].filter(Boolean).join(" · ");
              const left = expiryOf(p) - now;
              const soon = left < 3 * 3600 * 1000;
              return (
                <SwipeToDelete key={p.id} onDelete={() => swipeDelete(p)}>
                <Link
                  to={`/patients/${p.id}`}
                  draggable={false}
                  className={`block rounded-xl border bg-surface px-4 py-3.5 active:bg-surface-2 ${
                    soon ? "border-amber-400/40" : "border-border"
                  }`}
                >
                  <div className="flex items-baseline justify-between gap-2">
                    <span className="truncate font-medium text-white">
                      {displayName(p)}
                      {age && <span className="font-normal text-muted"> · {age}</span>}
                    </span>
                    <span className={`shrink-0 text-[11px] ${soon ? "text-amber-300" : "text-muted"}`}>suppr. dans {formatLeft(left)}</span>
                  </div>
                  {where && <p className="mt-0.5 text-[13px] text-slate-300">{where}</p>}
                  {p.reason.trim() && <p className="mt-1 line-clamp-2 text-[13px] leading-snug text-muted">{p.reason.trim()}</p>}
                </Link>
                </SwipeToDelete>
              );
            })}
          </div>
        )}

        {sorted.length > 0 &&
          (confirmAll ? (
            <div className="flex flex-col gap-2 rounded-xl border border-red-400/40 bg-red-500/10 p-3">
              <p className="text-sm text-red-100">Supprimer définitivement les {sorted.length} fiches ?</p>
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => {
                    deleteAllPatients();
                    setConfirmAll(false);
                  }}
                  className="rounded-lg bg-red-500/80 px-3 py-2 text-sm font-semibold text-white active:scale-95"
                >
                  Tout supprimer
                </button>
                <button type="button" onClick={() => setConfirmAll(false)} className="rounded-lg px-3 py-2 text-sm text-slate-300">
                  Annuler
                </button>
              </div>
            </div>
          ) : (
            <button type="button" onClick={() => setConfirmAll(true)} className="self-start px-1 py-1.5 text-sm text-red-300 underline">
              Supprimer toutes les fiches
            </button>
          ))}

        <SecuritySettings />
      </div>

      {undo && (
        <div className="peek-bottom fixed inset-x-0 z-30 px-4" role="status">
          <div className="mx-auto flex max-w-xl items-center gap-3 rounded-2xl border border-border bg-[#1c1c20]/95 px-4 py-3 shadow-[0_8px_30px_rgba(0,0,0,0.5)] backdrop-blur-xl">
            <span className="flex-1 truncate text-sm text-slate-200">Fiche {displayName(undo)} supprimée</span>
            <button
              type="button"
              onClick={() => {
                restorePatient(undo);
                setUndo(null);
              }}
              className="shrink-0 rounded-lg px-2 py-1 text-sm font-semibold text-accent-2 active:bg-surface-2"
            >
              Annuler
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

function formatLeft(ms: number) {
  const minutes = Math.max(0, Math.round(ms / 60000));
  if (minutes < 60) return `${minutes} min`;
  return `${Math.floor(minutes / 60)} h${minutes % 60 && minutes < 600 ? String(minutes % 60).padStart(2, "0") : ""}`;
}

// Drag to the left past 40 % of the width to delete. Vertical moves are left to the page
// scroll; a drag never counts as a tap on the sheet.
function SwipeToDelete({ onDelete, children }: { onDelete: () => void; children: ReactNode }) {
  const [dx, setDx] = useState(0);
  const [dragging, setDragging] = useState(false);
  const box = useRef<HTMLDivElement>(null);
  const gesture = useRef<{ x: number; y: number; axis: "h" | "v" | null; dx: number } | null>(null);
  const swiped = useRef(false);

  const end = () => {
    const g = gesture.current;
    gesture.current = null;
    setDragging(false);
    if (!g || g.axis !== "h") return;
    const width = box.current?.offsetWidth ?? 1;
    if (-g.dx > width * 0.4) {
      setDx(-width);
      window.setTimeout(onDelete, 180);
    } else {
      setDx(0);
    }
  };

  return (
    <div ref={box} className="relative overflow-hidden rounded-xl">
      <div
        aria-hidden
        className="absolute inset-0 flex items-center justify-end gap-2 rounded-xl bg-red-600/85 pr-5 text-sm font-semibold text-white"
        style={{ opacity: Math.min(1, -dx / 60) }}
      >
        <svg viewBox="0 0 24 24" fill="none" className="h-5 w-5">
          <path d="M5 7h14M10 11v6M14 11v6M6 7l1 12a1 1 0 0 0 1 1h8a1 1 0 0 0 1-1l1-12M9 7V4h6v3" stroke="currentColor" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round" />
        </svg>
        Supprimer
      </div>
      <div
        className="relative rounded-xl bg-bg"
        style={{ transform: `translateX(${dx}px)`, transition: dragging ? "none" : "transform 180ms ease-out", touchAction: "pan-y" }}
        onPointerDown={(e) => {
          if (e.pointerType === "mouse" && e.button !== 0) return;
          gesture.current = { x: e.clientX, y: e.clientY, axis: null, dx: 0 };
          swiped.current = false;
        }}
        onPointerMove={(e) => {
          const g = gesture.current;
          if (!g) return;
          const mx = e.clientX - g.x;
          const my = e.clientY - g.y;
          if (!g.axis) {
            if (Math.abs(mx) > 8 && Math.abs(mx) > Math.abs(my)) {
              g.axis = "h";
              swiped.current = true;
              e.currentTarget.setPointerCapture(e.pointerId);
              setDragging(true);
            } else if (Math.abs(my) > 8) {
              g.axis = "v";
            }
          }
          if (g.axis === "h") {
            g.dx = Math.min(0, mx);
            setDx(g.dx);
          }
        }}
        onPointerUp={end}
        onPointerCancel={() => {
          gesture.current = null;
          setDragging(false);
          setDx(0);
        }}
        onClickCapture={(e) => {
          if (swiped.current) {
            e.preventDefault();
            e.stopPropagation();
            swiped.current = false;
          }
        }}
      >
        {children}
      </div>
    </div>
  );
}
