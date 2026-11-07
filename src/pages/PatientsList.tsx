import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Header } from "../components/Header";
import { ageText, createPatient, deleteAllPatients, displayName, OLD_AFTER_MS, usePatients } from "../lib/patients";
import { timeAgo } from "../lib/recentlyUsed";

export function PatientsList() {
  const patients = usePatients();
  const navigate = useNavigate();
  const [confirmAll, setConfirmAll] = useState(false);
  const [now] = useState(() => Date.now());
  const sorted = [...patients].sort((a, b) => b.updatedAt - a.updatedAt);
  const oldCount = patients.filter((p) => now - p.updatedAt > OLD_AFTER_MS).length;

  return (
    <div>
      <Header title="Fiches patients" back />
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
            {sorted.map((p) => {
              const age = ageText(p);
              const where = [p.room.trim() && `Ch. ${p.room.trim()}`, p.ward.trim()].filter(Boolean).join(" · ");
              const old = now - p.updatedAt > OLD_AFTER_MS;
              return (
                <Link
                  key={p.id}
                  to={`/patients/${p.id}`}
                  className={`rounded-xl border bg-surface px-4 py-3.5 backdrop-blur-xl transition-transform duration-150 active:scale-[0.98] active:bg-surface-2 ${
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
    </div>
  );
}
