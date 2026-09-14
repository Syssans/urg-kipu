import { Header } from "../components/Header";
import { Disclaimer } from "../components/Disclaimer";

export function About() {
  return (
    <div>
      <Header title="À propos" back />
      <div className="mx-auto flex max-w-xl flex-col gap-4 px-4 pb-24 pt-4">
        <Disclaimer />
        <div className="rounded-2xl border border-border bg-surface p-4 text-sm leading-relaxed text-muted">
          <p className="mb-2 font-semibold text-slate-200">À propos d'Urgence+</p>
          <p>
            Urgence+ est un aide-mémoire pour les professionnels de la médecine d'urgence :
            calculateurs de scores, et bientôt protocoles et arbres décisionnels, réunis dans une
            interface pensée pour un accès rapide au lit du patient.
          </p>
          <p className="mt-2">
            Les scores actuellement disponibles reposent sur des critères publiés et largement
            diffusés dans la littérature (voir la source citée sur chaque fiche). Les protocoles et
            arbres décisionnels seront ajoutés au fur et à mesure, à partir de référentiels sourcés
            (SFMU, HAS, sociétés savantes) fournis par l'équipe.
          </p>
        </div>
      </div>
    </div>
  );
}
