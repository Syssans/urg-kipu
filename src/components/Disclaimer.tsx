import { Link } from "react-router-dom";

export function Disclaimer({ compact }: { compact?: boolean }) {
  if (compact) {
    return (
      <p className="px-1 text-center text-[11px] leading-snug text-muted">
        Outil d'aide-mémoire à visée professionnelle — ne remplace pas le jugement clinique.{" "}
        <Link to="/a-propos" className="underline">
          En savoir plus
        </Link>
      </p>
    );
  }
  return (
    <div className="rounded-2xl border border-border bg-surface p-4 text-sm leading-relaxed text-muted backdrop-blur-xl">
      <p className="mb-2 font-semibold text-slate-200">Avertissement</p>
      <p>
        Cette application est un aide-mémoire destiné à des professionnels de santé formés. Les
        outils mis à disposition (scores, interprétateurs, conversions, formules) reproduisent des
        critères et formules publiés, mais ne constituent pas des outils diagnostiques fiables à
        100 % : une erreur de saisie, un cas non couvert par le score ou une limite de la
        littérature peuvent en fausser le résultat.
      </p>
      <p className="mt-2">
        Kipu et son équipe ne peuvent être tenus responsables d'une décision ou d'une prise en
        charge fondée sur les résultats de l'application. Kipu ne se substitue en aucun cas à la
        responsabilité, aux compétences cliniques et au sens critique du professionnel de santé
        qui l'utilise : vérifiez toujours la cohérence du résultat avec l'examen du patient, le
        contexte clinique et les protocoles en vigueur dans votre établissement.
      </p>
      <p className="mt-2">
        Version de prototype à usage interne : le contenu n'a pas fait l'objet d'une validation
        institutionnelle formelle et peut contenir des erreurs. Signalez toute anomalie.
      </p>
    </div>
  );
}
