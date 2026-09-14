export function Disclaimer({ compact }: { compact?: boolean }) {
  if (compact) {
    return (
      <p className="px-1 text-center text-[11px] leading-snug text-muted">
        Outil d'aide-mémoire à visée professionnelle — ne remplace pas le jugement clinique.{" "}
        <a href="/a-propos" className="underline">
          En savoir plus
        </a>
      </p>
    );
  }
  return (
    <div className="rounded-2xl border border-border bg-surface p-4 text-sm leading-relaxed text-muted">
      <p className="mb-2 font-semibold text-slate-200">Avertissement</p>
      <p>
        Cette application est un aide-mémoire destiné à des professionnels de santé formés. Les
        calculateurs reproduisent des scores publiés et largement utilisés, mais leur résultat ne
        remplace en aucun cas le jugement clinique, l'examen du patient et les protocoles en
        vigueur dans votre établissement. Vérifiez toujours la cohérence du résultat avec le
        contexte clinique.
      </p>
      <p className="mt-2">
        Version de prototype à usage interne : le contenu n'a pas fait l'objet d'une validation
        institutionnelle formelle et peut contenir des erreurs. Signalez toute anomalie.
      </p>
    </div>
  );
}
