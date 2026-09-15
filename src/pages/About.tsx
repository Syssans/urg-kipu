import { Header } from "../components/Header";
import { Disclaimer } from "../components/Disclaimer";
import { Logo } from "../components/Logo";

export function About() {
  return (
    <div>
      <Header title="À propos" back />
      <div className="page-in mx-auto flex max-w-xl flex-col gap-4 px-4 pb-28 pt-4">
        <div className="flex justify-center py-2">
          <Logo className="h-16 w-16" />
        </div>
        <Disclaimer />
        <div className="rounded-2xl border border-border bg-surface p-4 text-sm leading-relaxed text-muted backdrop-blur-xl">
          <p className="mb-2 font-semibold text-slate-200">Développement</p>
          <p>
            Kipu est développé par <span className="text-slate-200">Anton Millien</span>, interne
            en médecine d'urgence rattaché au CHU de Caen.
          </p>
          <p className="mt-2 text-xs text-muted">Septembre 2026</p>
        </div>
      </div>
    </div>
  );
}
