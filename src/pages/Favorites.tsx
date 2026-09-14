import { Header } from "../components/Header";
import { CalculatorListItem } from "../components/CalculatorListItem";
import { searchAll } from "../lib/catalog";
import { useFavorites } from "../lib/favorites";

export function Favorites() {
  const { favorites } = useFavorites();
  const items = searchAll("").filter((r) => favorites.includes(r.calc.id));

  return (
    <div>
      <Header title="Favoris" />
      <div className="mx-auto flex max-w-xl flex-col gap-2.5 px-4 pb-8 pt-4">
        {items.length === 0 ? (
          <p className="rounded-xl border border-dashed border-border p-4 text-sm text-muted">
            Aucun favori pour l'instant. Ouvrez un score ou un outil et appuyez sur l'étoile pour l'épingler ici.
          </p>
        ) : (
          items.map((r) => <CalculatorListItem key={r.calc.id} calc={r.calc} basePath={r.basePath} />)
        )}
      </div>
    </div>
  );
}
