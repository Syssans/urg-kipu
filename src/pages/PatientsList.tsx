import { useEffect, useRef, useState, type ReactNode } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Header } from "../components/Header";
import {
  ageText,
  createPatient,
  deleteAllPatients,
  deletePatient,
  displayName,
  OLD_AFTER_MS,
  restorePatient,
  usePatients,
  type Patient,
} from "../lib/patients";
import { timeAgo } from "../lib/recentlyUsed";

export function PatientsList() {
  const patients = usePatients();
  const navigate = useNavigate();
  const [confirmAll, setConfirmAll] = useState(false);
  const [now] = useState(() => Date.now());
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
  const oldCount = patients.filter((p) => now - p.updatedAt > OLD_AFTER_MS).length;

  return (
    <div>
      <Header title="Fiches patients" />
      <div className="page-in mx-auto flex max-w-xl flex-col gap-4 px-4 pb-28 pt-4">
        <p className="rounded-xl border border-border bg-surface px-4 py-3 text-[13px] leading-snug text-muted backdrop-blur-xl">
          Les fiches restent <span className="text-slate-200">uniquement sur cet appareil</span> : rien n'est envoyé sur
          internet. Elles sont conservées jusqu'à ce que vous les supprimiez. À utiliser sur votre téléphone personnel
          uniquement : sur un ordinateur partagé, elles resteraient visibles pour les suivants.
        </p>

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

        {oldCount > 0 && (
          <p className="rounded-xl border border-amber-400/40 bg-amber-400/10 px-4 py-3 text-[13px] leading-snug text-amber-100">
            {oldCount} fiche{oldCount > 1 ? "s n'ont" : " n'a"} pas été modifiée{oldCount > 1 ? "s" : ""} depuis plus de 48 h.
            Pensez à supprimer celles dont vous n'avez plus besoin.
          </p>
        )}

        {sorted.length === 0 ? (
          <p className="rounded-xl border border-dashed border-border p-4 text-sm text-muted">Aucune fiche pour l'instant.</p>
        ) : (
          <div className="flex flex-col gap-2.5">
            <p className="px-1 text-[12px] text-muted">Glissez une fiche vers la gauche pour la supprimer.</p>
            {sorted.map((p) => {
              const age = ageText(p);
              const where = [p.room.trim() && `Ch. ${p.room.trim()}`, p.ward.trim()].filter(Boolean).join(" · ");
              const old = now - p.updatedAt > OLD_AFTER_MS;
              return (
                <SwipeToDelete key={p.id} onDelete={() => swipeDelete(p)}>
                <Link
                  to={`/patients/${p.id}`}
                  draggable={false}
                  className={`block rounded-xl border bg-surface px-4 py-3.5 active:bg-surface-2 ${
                    old ? "border-amber-400/40" : "border-border"
                  }`}
                >
                  <div className="flex items-baseline justify-between gap-2">
                    <span className="truncate font-medium text-white">
                      {displayName(p)}
                      {age && <span className="font-normal text-muted"> · {age}</span>}
                    </span>
                    <span className={`shrink-0 text-[11px] ${old ? "text-amber-300" : "text-muted"}`}>{timeAgo(p.updatedAt)}</span>
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
